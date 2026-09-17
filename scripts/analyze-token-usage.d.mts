export interface TokenUsageBucket {
  input: number;
  cacheWrite: number;
  cacheRead: number;
  output: number;
  turns: number;
  webSearch: number;
  webFetch: number;
}

export interface AssistantTurnRecord {
  sidechain: boolean;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  input: number;
  tools: string[];
}

export interface SubagentSpawnRecord {
  type: string;
  desc: string;
}

export interface TranscriptUsageResult {
  main: TokenUsageBucket;
  sub: TokenUsageBucket;
  all: TokenUsageBucket;
  spawns: SubagentSpawnRecord[];
  turns: AssistantTurnRecord[];
}

export declare const COST_WEIGHTS: {
  input: number;
  cacheWrite: number;
  cacheRead: number;
  output: number;
};

export declare function calculateCostUnits(usage: Partial<TokenUsageBucket>): number;
export declare function createBlankUsage(): TokenUsageBucket;
export declare function addUsage(acc: TokenUsageBucket, u: any): void;
export declare function parseTranscriptUsage(filePath: string): TranscriptUsageResult;
