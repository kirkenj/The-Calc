import { type TokenStringCollectionResult } from "../tokenStringBuilder";
import { type TokenTypeRestriction } from "./TokenTypeRestrictions";
import { type Token } from "./Token"

export interface TokenType {
  name: string,
  tokenParser: (tokenCollectionResult: TokenStringCollectionResult) => Token,
  tokenStringRestriction: TokenTypeRestriction
}