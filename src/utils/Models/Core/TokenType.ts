import { type Token } from "./Token"
import { type TokenStringCollectionResult } from "../Parsing/TokenStringCollectionResult";
import { type Result } from "./Result";
import { type TokenTypeRestriction } from "./TokenTypeRestrictions";

export interface TokenType {
  readonly name: string,
  readonly tokenParser: (stringCollectionResult: TokenStringCollectionResult) => Result<Token>,
  readonly tokenStringRestriction: TokenTypeRestriction
}