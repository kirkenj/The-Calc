import { type TokenTypeRestriction } from "../Models/TokenTypeRestrictions"
import { Token } from "../Models/Token"
import { TokenType } from "../Models/TokenType"
import { TokenStringCollectionResult } from "../tokenStringBuilder"

const wordAllowedSymbols =  new Set(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'])
Object.freeze(wordAllowedSymbols)

export const wordRestrictions: TokenTypeRestriction = {
    allowedSymbols: wordAllowedSymbols,
    symbolMembershipCheckCallback: (symbol) => wordAllowedSymbols.has(symbol),
    maxLength: null
}
Object.freeze(wordRestrictions)

export const wordTokenType: TokenType = {
  name: "Word",
  tokenStringRestriction: wordRestrictions,
  tokenParser: (
    stringCollectionResult: TokenStringCollectionResult
  ): Token => {
    return {
      type: wordTokenType,
      initStringIndex: stringCollectionResult.absoluteStartIndex,
      fromString: stringCollectionResult.tokenString,
    }
  }
}