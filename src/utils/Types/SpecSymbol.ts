import { type TokenTypeRestriction } from "../Models/TokenTypeRestrictions"
import { Token } from "../Models/Token"
import { TokenType } from "../Models/TokenType"
import { TokenStringCollectionResult } from "../tokenStringBuilder"

const specSymbolAllowedSymbols = new Set(['*', "/", "\\", "+", "-", ":", "^"])
Object.freeze(specSymbolAllowedSymbols)

export const specSymbolRestrictions: TokenTypeRestriction = {
    allowedSymbols: specSymbolAllowedSymbols,
    symbolMembershipCheckCallback: (symbol) => specSymbolAllowedSymbols.has(symbol),
    maxLength: 1
}
Object.freeze(specSymbolRestrictions)


export const specSymbolTokenType: TokenType = {
  name: "Special symbol",
  tokenStringRestriction: specSymbolRestrictions,
  tokenParser: (
    stringCollectionResult: TokenStringCollectionResult
  ): Token => {
    return {
      type: specSymbolTokenType,
      initStringIndex: stringCollectionResult.absoluteStartIndex,
      fromString: stringCollectionResult.tokenString,
    }
  }
}