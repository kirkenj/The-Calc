import { getIndexOfFirst } from "../../Extensions/arrayUtils"
import { Result } from "../../Models/Core/Result"
import type { Token } from "../../Models/Core/Token"
import type { TokenType } from "../../Models/Core/TokenType"
import type { TokenTypeRestriction } from "../../Models/Core/TokenTypeRestrictions"
import type { TokenStringCollectionResult } from "../../Models/Parsing/TokenStringCollectionResult"
import { DefaultTokenIsInstance } from "./defaultTokenTypeCheck"


const openBracketAllowedSymbols = new Set(['('])
Object.freeze(openBracketAllowedSymbols)


export const openBracketRestrictions: TokenTypeRestriction = {
  allowedSymbols: openBracketAllowedSymbols,
  symbolMembershipCheckCallback: (symbol) => openBracketAllowedSymbols.has(symbol),
  maxLength: 1
}
Object.freeze(openBracketRestrictions)

export const openBracketTokenType: TokenType<Token> = {
  name: "openBracket",
  tokenStringRestriction: openBracketRestrictions,
  tokenParser: (
    stringCollectionResult: TokenStringCollectionResult
  ): Result<Token> => {
    if (stringCollectionResult.tokenString.length === 0) {
      return Result.Fail("ArgumentException: length of tokenString can not be 0")
    }

    if (openBracketRestrictions.maxLength
      && stringCollectionResult.tokenString.length > openBracketRestrictions.maxLength) {
      return Result.Fail(`ArgumentException: length of tokenString can not be more than ${openBracketRestrictions.maxLength}`)
    }

    const invalidSymbolIndex = getIndexOfFirst(
      stringCollectionResult.tokenString,
      (s: string) => !openBracketRestrictions.symbolMembershipCheckCallback(s))

    if (invalidSymbolIndex !== null) {
      return Result.Fail(`ArgumentException: invalid symbol '${stringCollectionResult.tokenString[invalidSymbolIndex]}' at index: ${invalidSymbolIndex}`)
    }

    return Result.Success({
      type: openBracketTokenType,
      initStringIndex: stringCollectionResult.absoluteStartIndex,
      fromString: stringCollectionResult.tokenString,
    })
  },

  isInstance: (arg) => DefaultTokenIsInstance(arg, openBracketTokenType)
}

Object.freeze(openBracketTokenType)