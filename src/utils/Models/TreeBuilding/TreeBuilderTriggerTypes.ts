import type { TokenType } from "../Core/TokenType";

export interface TreeBuilderTriggerTypes {
  OpenBracket: TokenType,
  ClosedBracket: TokenType,
  TypeUsedForAliases: TokenType,
}