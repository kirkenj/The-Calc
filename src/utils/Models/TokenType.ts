import { TokenStringCollectionResult } from "../tokenStringBuilder";
import { TokenTypeRestriction } from "./TokenTypeRestrictions";
import { type Token } from "./Token"

export interface TokenType {
  name: string,
  tokenParser: (tokenCollectionResult: TokenStringCollectionResult) => Token,
  tokenStringRestriction: TokenTypeRestriction
}