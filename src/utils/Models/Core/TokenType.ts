import { type Token } from "./Token"
import { type TokenStringCollectionResult } from "../Parsing/TokenStringCollectionResult";
import { type Result } from "./Result";
import { type TokenTypeRestriction } from "./TokenTypeRestrictions";
import type { IsInstanceResult } from "./IsInstanceResult";

export interface TokenType<TToken extends Token = any> {
  readonly name: string,
  readonly tokenParser: (stringCollectionResult: TokenStringCollectionResult) => Result<Token>,
  readonly tokenStringRestriction: TokenTypeRestriction
  readonly isInstance: (token: Token) => IsInstanceResult<TToken>;
}