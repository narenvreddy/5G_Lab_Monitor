import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UnitProgress {
    lessons: Array<LessonProgress>;
    unitIndex: bigint;
}
export type Time = bigint;
export interface ServerStatus {
    online: boolean;
}
export interface DailyStreak {
    lastActivity: Time;
    currentStreak: bigint;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface UserData {
    activeProfileId?: bigint;
    settings: AppSettings;
    parentPinHash?: string;
    profiles: Array<ChildProfile>;
}
export interface PipelineStatus {
    nlpParser: PipelineState;
    encoder: PipelineState;
    scriptGenerator: PipelineState;
}
export interface ChildProfile {
    id: bigint;
    arcadeHighScores: Array<[string, bigint]>;
    name: string;
    progress: Array<UnitProgress>;
    dailyStreak: DailyStreak;
    avatar: string;
}
export interface AppSettings {
    voiceSpeed: bigint;
    reduceMotion: boolean;
    highContrastMode: boolean;
    dyslexicFont: boolean;
    colorBlindnessMode: boolean;
    largeTapTargets: boolean;
    soundEnabled: boolean;
    textToSpeechEnabled: boolean;
    autoAdvance: boolean;
}
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface LessonProgress {
    lessonIndex: bigint;
    attempts: bigint;
    stars: bigint;
    hintsUsed: bigint;
}
export interface UserProfile {
    name: string;
}
export enum PipelineStage {
    nlpParser = "nlpParser",
    encoder = "encoder",
    scriptGenerator = "scriptGenerator"
}
export enum PipelineState {
    idle = "idle",
    completed = "completed",
    processing = "processing"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProfile(profileId: bigint): Promise<void>;
    getActiveProfile(): Promise<ChildProfile | null>;
    getArcadeHighScore(profileId: bigint, game: string): Promise<bigint | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getHasSeenOnboarding(): Promise<boolean>;
    getPipelineStatus(testRequestId: string): Promise<PipelineStatus>;
    getProfiles(): Promise<Array<ChildProfile>>;
    getServerStatus(): Promise<ServerStatus>;
    getSettings(): Promise<AppSettings>;
    getStreak(profileId: bigint): Promise<DailyStreak>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hasParentPin(): Promise<boolean>;
    initializeUserData(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    runPipeline(testRequestId: string): Promise<PipelineStatus>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveProfile(profile: ChildProfile): Promise<void>;
    sendParentWeeklySummaryEmail(emailAddress: string, summary: string): Promise<void>;
    setHasSeenOnboarding(): Promise<void>;
    setParentPin(pinHash: string): Promise<void>;
    switchActiveProfile(profileId: bigint): Promise<void>;
    updateArcadeHighScore(profileId: bigint, game: string, score: bigint): Promise<void>;
    updatePipelineStatus(testRequestId: string, stage: PipelineStage, state: PipelineState): Promise<PipelineState>;
    updateProfileProgress(profileId: bigint, progress: Array<UnitProgress>): Promise<void>;
    updateSettings(settings: AppSettings): Promise<void>;
    updateStreak(profileId: bigint, streak: DailyStreak): Promise<void>;
    verifyParentPin(pinHash: string): Promise<boolean>;
}
