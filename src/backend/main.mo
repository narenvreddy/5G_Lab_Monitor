import Array "mo:core/Array";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Text "mo:core/Text";
import _List "mo:core/List";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import _Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import EmailClient "mo:caffeineai-email/emailClient";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinViews "mo:caffeineai-data-viewer/MixinViews";

actor {
  // Persistent types
  public type ChildProfile = {
    id : Nat;
    name : Text;
    avatar : Text;
    progress : [UnitProgress];
    arcadeHighScores : [(Text, Nat)];
    dailyStreak : DailyStreak;
  };

  public type UnitProgress = {
    unitIndex : Nat;
    lessons : [LessonProgress];
  };

  public type LessonProgress = {
    lessonIndex : Nat;
    stars : Nat;
    attempts : Nat;
    hintsUsed : Nat;
  };

  public type DailyStreak = {
    currentStreak : Nat;
    lastActivity : Time.Time;
  };

  public type AppSettings = {
    textToSpeechEnabled : Bool;
    voiceSpeed : Nat;
    dyslexicFont : Bool;
    highContrastMode : Bool;
    reduceMotion : Bool;
    largeTapTargets : Bool;
    colorBlindnessMode : Bool;
    autoAdvance : Bool;
    soundEnabled : Bool;
  };

  public type UserData = {
    profiles : [ChildProfile];
    settings : AppSettings;
    parentPinHash : ?Text;
    activeProfileId : ?Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  // Workspace types — server health-check + test-request pipeline indicators
  public type ServerStatus = {
    online : Bool;
  };

  public type PipelineStage = {
    #nlpParser;
    #encoder;
    #scriptGenerator;
  };

  public type PipelineState = {
    #idle;
    #processing;
    #completed;
  };

  public type PipelineStatus = {
    nlpParser : PipelineState;
    encoder : PipelineState;
    scriptGenerator : PipelineState;
  };

  module PipelineStage {
    public func compare(x : PipelineStage, y : PipelineStage) : Order.Order {
      switch (x, y) {
        case (#nlpParser, #nlpParser) #equal;
        case (#nlpParser, _) #less;
        case (_, #nlpParser) #greater;
        case (#encoder, #encoder) #equal;
        case (#encoder, _) #less;
        case (_, #encoder) #greater;
        case (#scriptGenerator, #scriptGenerator) #equal;
      };
    };
  };

  let userData = Map.empty<Principal, UserData>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  // Separate stable map for onboarding flag (avoids AppSettings migration issues)
  let onboardingFlags = Map.empty<Principal, Bool>();
  let accessControlState = AccessControl.initState();
  // Pipeline state keyed by testRequestId, then stage — anonymous-callable
  let pipelineStates = Map.empty<Text, Map.Map<PipelineStage, PipelineState>>();

  include MixinAuthorization(accessControlState, null);
  include MixinViews();

  module ChildProfile {
    public func compare(x : ChildProfile, y : ChildProfile) : Order.Order {
      Nat.compare(x.id, y.id);
    };

    public func compareByName(x : ChildProfile, y : ChildProfile) : Order.Order {
      Text.compare(x.name, y.name);
    };
  };

  public query ({ caller }) func getProfiles() : async [ChildProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    let data = getUserData(caller);
    data.profiles.sort();
  };

  public shared ({ caller }) func saveProfile(profile : ChildProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let data = getUserData(caller);

    // Check if we already have 5 profiles
    if (data.profiles.size() >= 5 and not data.profiles.any(func(p) { p.id == profile.id })) {
      Runtime.trap("Maximum of 5 profiles allowed per account");
    };

    let filteredProfiles = data.profiles.filter(func(p) { p.id != profile.id });
    let updatedProfiles = filteredProfiles.concat([profile]);
    updateUserData(caller, { data with profiles = updatedProfiles });
  };

  public shared ({ caller }) func deleteProfile(profileId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete profiles");
    };
    let data = getUserData(caller);
    let filteredProfiles = data.profiles.filter(func(p) { p.id != profileId });

    // Clear active profile if it was deleted
    let newActiveProfileId = switch (data.activeProfileId) {
      case (?id) { if (id == profileId) { null } else { ?id } };
      case (null) { null };
    };

    updateUserData(caller, { data with profiles = filteredProfiles; activeProfileId = newActiveProfileId });
  };

  public shared ({ caller }) func switchActiveProfile(profileId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can switch profiles");
    };
    let data = getUserData(caller);
    let profileExists = data.profiles.any(func(p) { p.id == profileId });

    if (not profileExists) {
      Runtime.trap("Profile does not exist");
    };

    updateUserData(caller, { data with activeProfileId = ?profileId });
  };

  // Profile progress
  public query ({ caller }) func getActiveProfile() : async ?ChildProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    let data = getUserData(caller);
    switch (data.activeProfileId) {
      case (null) { null };
      case (?id) { data.profiles.find(func(p) { p.id == id }) };
    };
  };

  public shared ({ caller }) func updateProfileProgress(profileId : Nat, progress : [UnitProgress]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update progress");
    };
    let data = getUserData(caller);

    // Verify the profile belongs to this user
    if (not data.profiles.any(func(p) { p.id == profileId })) {
      Runtime.trap("Profile not found");
    };

    let updatedProfiles = data.profiles.map(
      func(p) {
        if (p.id == profileId) {
          { p with progress };
        } else {
          p;
        };
      }
    );
    updateUserData(caller, { data with profiles = updatedProfiles });
  };

  // Settings
  public query ({ caller }) func getSettings() : async AppSettings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access settings");
    };
    let data = getUserData(caller);
    data.settings;
  };

  public shared ({ caller }) func updateSettings(settings : AppSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update settings");
    };
    let data = getUserData(caller);
    updateUserData(caller, { data with settings });
  };

  // Onboarding flag (stored separately to avoid stable variable migration issues)
  public query ({ caller }) func getHasSeenOnboarding() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (onboardingFlags.get(caller)) {
      case (?v) { v };
      case (null) { false };
    };
  };

  public shared ({ caller }) func setHasSeenOnboarding() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    onboardingFlags.add(caller, true);
  };

  // Daily streak
  public query ({ caller }) func getStreak(profileId : Nat) : async DailyStreak {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access streak data");
    };
    let data = getUserData(caller);
    switch (data.profiles.find(func(p) { p.id == profileId })) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile.dailyStreak };
    };
  };

  public shared ({ caller }) func updateStreak(profileId : Nat, streak : DailyStreak) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update streak data");
    };
    let data = getUserData(caller);

    // Verify the profile belongs to this user
    if (not data.profiles.any(func(p) { p.id == profileId })) {
      Runtime.trap("Profile not found");
    };

    let updatedProfiles = data.profiles.map(
      func(p) {
        if (p.id == profileId) {
          { p with dailyStreak = streak };
        } else {
          p;
        };
      }
    );
    updateUserData(caller, { data with profiles = updatedProfiles });
  };

  // Arcade high scores
  public query ({ caller }) func getArcadeHighScore(profileId : Nat, game : Text) : async ?Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access high scores");
    };
    let data = getUserData(caller);
    switch (data.profiles.find(func(p) { p.id == profileId })) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        switch (profile.arcadeHighScores.find(func((g, _)) { g == game })) {
          case (null) { null };
          case (?(_, score)) { ?score };
        };
      };
    };
  };

  public shared ({ caller }) func updateArcadeHighScore(profileId : Nat, game : Text, score : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update high scores");
    };
    let data = getUserData(caller);

    // Verify the profile belongs to this user
    if (not data.profiles.any(func(p) { p.id == profileId })) {
      Runtime.trap("Profile not found");
    };

    let updatedProfiles = data.profiles.map(
      func(p) {
        if (p.id == profileId) {
          let filteredScores = p.arcadeHighScores.filter(func((g, _)) { g != game });
          { p with arcadeHighScores = filteredScores.concat([(game, score)]) };
        } else {
          p;
        };
      }
    );
    updateUserData(caller, { data with profiles = updatedProfiles });
  };

  // Parent PIN
  public shared ({ caller }) func verifyParentPin(pinHash : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can verify PIN");
    };
    let data = getUserData(caller);
    switch (data.parentPinHash) {
      case (null) { false };
      case (?storedHash) { storedHash == pinHash };
    };
  };

  public shared ({ caller }) func hasParentPin() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    let data = getUserData(caller);
    switch (data.parentPinHash) {
      case (null) { false };
      case (_) { true };
    };
  };

  public shared ({ caller }) func setParentPin(pinHash : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set PIN");
    };
    let data = getUserData(caller);
    updateUserData(caller, { data with parentPinHash = ?pinHash });
  };

  // Initialization — idempotent: returns silently if data already exists
  public shared ({ caller }) func initializeUserData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can initialize data");
    };

    // Idempotent: if data already exists, return without error
    if (userData.containsKey(caller)) {
      return;
    };

    let defaultSettings : AppSettings = {
      textToSpeechEnabled = false;
      voiceSpeed = 1;
      dyslexicFont = false;
      highContrastMode = false;
      reduceMotion = false;
      largeTapTargets = false;
      colorBlindnessMode = false;
      autoAdvance = false;
      soundEnabled = true;
    };

    let newUserData : UserData = {
      profiles = [];
      settings = defaultSettings;
      parentPinHash = null;
      activeProfileId = null;
    };

    userData.add(caller, newUserData);
  };

  // Required user profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Email weekly summary
  public shared ({ caller }) func sendParentWeeklySummaryEmail(emailAddress : Text, summary : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send weekly summary email");
    };

    let result = await EmailClient.sendServiceEmail(
      "no-reply",
      [emailAddress],
      "Parent Weekly Summary",
      summary,
    );
    switch (result) {
      case (#ok) {};
      case (#err(error)) {
        Runtime.trap("Failed to send email: " # error);
      };
    };
  };

  // Workspace — server health-check (anonymous-callable; no auth guard)
  public query func getServerStatus() : async ServerStatus {
    // The canister is reachable, so it is online.
    { online = true };
  };

  // Workspace — advance a pipeline indicator's state for a test request (anonymous-callable)
  public shared func updatePipelineStatus(testRequestId : Text, stage : PipelineStage, state : PipelineState) : async PipelineState {
    let stageMap = getOrCreateStageMap(testRequestId);
    stageMap.add(stage, state);
    state;
  };

  // Workspace — read the three pipeline indicator states for a test request (anonymous-callable)
  public query func getPipelineStatus(testRequestId : Text) : async PipelineStatus {
    switch (pipelineStates.get(testRequestId)) {
      case (null) { defaultPipelineStatus() };
      case (?stageMap) {
        {
          nlpParser = getStageState(stageMap, #nlpParser);
          encoder = getStageState(stageMap, #encoder);
          scriptGenerator = getStageState(stageMap, #scriptGenerator);
        };
      };
    };
  };

  // Workspace — run the full pipeline for a test request (anonymous-callable).
  // Sequentially drives the three stages through idle -> processing -> completed
  // in order: NLP Parser, then Encoder, then Script Generator. Each transition
  // is persisted to pipelineStates so getPipelineStatus reflects progress mid-run
  // and after completion. Returns the final PipelineStatus (all stages completed).
  public shared func runPipeline(testRequestId : Text) : async PipelineStatus {
    let stages : [PipelineStage] = [#nlpParser, #encoder, #scriptGenerator];
    for (stage in stages.values()) {
      ignore await updatePipelineStatus(testRequestId, stage, #processing);
      ignore await updatePipelineStatus(testRequestId, stage, #completed);
    };
    switch (pipelineStates.get(testRequestId)) {
      case (null) { defaultPipelineStatus() };
      case (?stageMap) {
        {
          nlpParser = getStageState(stageMap, #nlpParser);
          encoder = getStageState(stageMap, #encoder);
          scriptGenerator = getStageState(stageMap, #scriptGenerator);
        };
      };
    };
  };

  func getUserData(caller : Principal) : UserData {
    switch (userData.get(caller)) {
      case (null) { Runtime.trap("User data not found") };
      case (?data) { data };
    };
  };

  func updateUserData(caller : Principal, updatedData : UserData) {
    userData.add(caller, updatedData);
  };

  // Workspace pipeline helpers
  func getOrCreateStageMap(testRequestId : Text) : Map.Map<PipelineStage, PipelineState> {
    switch (pipelineStates.get(testRequestId)) {
      case (?m) { m };
      case (null) {
        let m = Map.empty<PipelineStage, PipelineState>();
        pipelineStates.add(testRequestId, m);
        m;
      };
    };
  };

  func getStageState(stageMap : Map.Map<PipelineStage, PipelineState>, stage : PipelineStage) : PipelineState {
    switch (stageMap.get(stage)) {
      case (?s) { s };
      case (null) { #idle };
    };
  };

  func defaultPipelineStatus() : PipelineStatus {
    {
      nlpParser = #idle;
      encoder = #idle;
      scriptGenerator = #idle;
    };
  };
};
