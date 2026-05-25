import { Token } from "../Models/Token"
import { TokenType } from "../Models/TokenType"
import { TokenTypeRestriction } from "../Models/TokenTypeRestrictions"
import { TokenStringCollectionResult } from "../tokenStringBuilder"


const closedBracketAllowedSymbols = new Set([')'])
Object.freeze(closedBracketAllowedSymbols)

export const closedBracketRestrictions: TokenTypeRestriction = {
    allowedSymbols: closedBracketAllowedSymbols,
    symbolMembershipCheckCallback: (symbol) => closedBracketAllowedSymbols.has(symbol),
    maxLength: 1
}
Object.freeze(closedBracketRestrictions)


export const closedBracketTokenType: TokenType = {
  name: "closedBracket",
  tokenStringRestriction: closedBracketRestrictions,
  tokenParser: (
    stringCollectionResult: TokenStringCollectionResult
  ): Token => {
    return {
      type: closedBracketTokenType,
      initStringIndex: stringCollectionResult.absoluteStartIndex,
      fromString: stringCollectionResult.tokenString,
    }
  }
}