import { type Token } from "../Models/Token"
import { type TokenType } from "../Models/TokenType"
import { type TokenTypeRestriction } from "../Models/TokenTypeRestrictions"
import { type TokenStringCollectionResult } from "../tokenStringBuilder"

const openBracketAllowedSymbols = new Set(['('])
Object.freeze(openBracketAllowedSymbols)


export const openBracketRestrictions: TokenTypeRestriction = {
    allowedSymbols: openBracketAllowedSymbols,
    symbolMembershipCheckCallback: (symbol) => openBracketAllowedSymbols.has(symbol),
    maxLength: 1
}
Object.freeze(openBracketRestrictions)

export const openBracketTokenType: TokenType = {
  name: "openBracket",
  tokenStringRestriction: openBracketRestrictions,
  tokenParser: (
    stringCollectionResult: TokenStringCollectionResult
  ): Token => {
    return {
      type: openBracketTokenType,
      initStringIndex: stringCollectionResult.absoluteStartIndex,
      fromString: stringCollectionResult.tokenString,
    }
  }
}


const closedBracketAllowedSymbols = new Set([')'])
Object.freeze(closedBracketAllowedSymbols)