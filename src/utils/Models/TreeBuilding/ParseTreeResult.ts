import type { BracketInfo } from "./BracketInfo";

export interface ParseTreeResult {
  readonly eqMap: Map<string, BracketInfo>,
  readonly entryPointName: string
}