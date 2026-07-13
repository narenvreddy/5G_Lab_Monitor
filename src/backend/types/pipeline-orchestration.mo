// Domain types for pipeline orchestration.
// These mirror the pipeline types already defined in main.mo so the
// orchestration domain can reference them by import without redefining
// the canonical variants used by the existing storage and functions.
module {
  // The three sequential pipeline stages, in execution order:
  // NLP Parser -> Encoder -> Script Generator.
  public type PipelineStage = {
    #nlpParser;
    #encoder;
    #scriptGenerator;
  };

  // Per-stage lifecycle state driven by runPipeline.
  public type PipelineState = {
    #idle;
    #processing;
    #completed;
  };

  // Aggregate status across all three stages for a single test request.
  public type PipelineStatus = {
    nlpParser : PipelineState;
    encoder : PipelineState;
    scriptGenerator : PipelineState;
  };
};
