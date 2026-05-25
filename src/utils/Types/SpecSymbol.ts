import { type TokenTypeRestriction } from "../Models/TokenTypeRestrictions"
import { type Token } from "../Models/Token"
import { type TokenType } from "../Models/TokenType"
import { type TokenStringCollectionResult } from "../tokenStringBuilder"

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