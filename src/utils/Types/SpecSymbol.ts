import { type TokenTypeRestriction } from "../Models/Core/TokenTypeRestrictions"
import { type Token } from "../Models/Core/Token"
import { type TokenType } from "../Models/Core/TokenType"
import { type TokenStringCollectionResult } from "../Models/Parsing/TokenStringCollectionResult"
import { getIndexOfFirst } from "../Extensions/arrayUtils"
import { Result } from "../Models/Core/Result"


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
  ): Result<Token> => {

    if (stringCollectionResult.tokenString.length === 0) {
      return Result.Fail("ArgumentException: length of tokenString can not be 0")
    }

    if (specSymbolRestrictions.maxLength
      && stringCollectionResult.tokenString.length > specSymbolRestrictions.maxLength) {
      return Result.Fail(`ArgumentException: length of tokenString can not be more than ${specSymbolRestrictions.maxLength}`)
    }

    const invalidSymbolIndex = getIndexOfFirst(
      stringCollectionResult.tokenString,
      (s: string) => !specSymbolRestrictions.symbolMembershipCheckCallback(s))

    if (invalidSymbolIndex !== null) {
      return Result.Fail(`ArgumentException: invalid symbol '${stringCollectionResult.tokenString[invalidSymbolIndex]}' at index: ${invalidSymbolIndex}`)
    }

    return Result.Success({
      type: specSymbolTokenType,
      initStringIndex: stringCollectionResult.absoluteStartIndex,
      fromString: stringCollectionResult.tokenString,
    })
  }
}

Object.freeze(specSymbolTokenType)
