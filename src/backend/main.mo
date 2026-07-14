import Map "mo:core/Map";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import OQL "mo:caffeineai-oql";
import Expose "mo:caffeineai-oql/Expose";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinViews "mo:caffeineai-data-viewer/MixinViews";



actor {
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

  let accessControlState = AccessControl.initState();
  // Pipeline state keyed by testRequestId, then stage — anonymous-callable
  let pipelineStates = Map.empty<Text, Map.Map<PipelineStage, PipelineState>>();

  include MixinAuthorization(accessControlState, null);
  include MixinViews();

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

  // OQL — flatten the nested pipelineStates map (testRequestId -> stage -> state)
  // into one queryable row per (testRequestId, stage) pair. Variants are projected
  // to Text so the Data Intelligence agent can filter and order on them.
  func stageToText(stage : PipelineStage) : Text {
    switch (stage) {
      case (#nlpParser) "nlpParser";
      case (#encoder) "encoder";
      case (#scriptGenerator) "scriptGenerator";
    };
  };

  func stateToText(state : PipelineState) : Text {
    switch (state) {
      case (#idle) "idle";
      case (#processing) "processing";
      case (#completed) "completed";
    };
  };

  // Flattens pipelineStates into a flat iterator of (testRequestId, stage, state).
  func flattenPipelineStates() : Iter.Iter<(Text, PipelineStage, PipelineState)> {
    pipelineStates.entries().flatMap(
      func((testRequestId, stageMap)) {
        stageMap.entries().map(
          func((stage, state)) { (testRequestId, stage, state) },
        );
      },
    );
  };

  include Expose({
    entities = [
      OQL.Entity.manual<(Text, PipelineStage, PipelineState)>(
        "pipelineStageState",
        flattenPipelineStates,
        "PipelineStageState",
        "id",
      )
        .payload("id", func((testRequestId, stage, _)) = testRequestId # ":" # stageToText(stage))
        .payload("testRequestId", func((testRequestId, _, _)) = testRequestId)
        .payload("stage", func((_, stage, _)) = stageToText(stage))
        .payload("state", func((_, _, state)) = stateToText(state))
        .controllerOnly()
        .build(),
    ];
  });
};
