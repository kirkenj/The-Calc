import type { ValueToken } from "../Core/Token";
import type { TokenType } from "../Core/TokenType";

export interface TreeBuilderTriggerTypes {
  OpenBracket: TokenType,
  ClosedBracket: TokenType,
  TypeUsedForAliases: TokenType<ValueToken<string>>,
}