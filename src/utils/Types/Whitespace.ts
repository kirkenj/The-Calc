import { type TokenTypeRestriction } from "../Models/TokenTypeRestrictions"
import { Token } from "../Models/Token"
import { TokenType } from "../Models/TokenType"
import { TokenStringCollectionResult } from "../tokenStringBuilder"

const whiteSpaceAllowedSymbols = new Set([' '])
Object.freeze(whiteSpaceAllowedSymbols)

export const whiteSpaceRestrictions: TokenTypeRestriction ={
    allowedSymbols: whiteSpaceAllowedSymbols,
    symbolMembershipCheckCallback: (symbol) => whiteSpaceAllowedSymbols.has(symbol),
    maxLength: null
}
Object.freeze(whiteSpaceRestrictions)


export const whiteSpaceTokenType: TokenType = {
  name: "whiteSpace",
  tokenStringRestriction: whiteSpaceRestrictions,
  tokenParser: (
    stringCollectionResult: TokenStringCollectionResult
  ): Token => {
    return {
      type: whiteSpaceTokenType,
      initStringIndex: stringCollectionResult.absoluteStartIndex,
      fromString: stringCollectionResult.tokenString,
    }
  }
}