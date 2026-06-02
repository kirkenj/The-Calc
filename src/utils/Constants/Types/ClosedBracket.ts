import { getIndexOfFirst } from "../../Extensions/arrayUtils"
import { Result } from "../../Models/Core/Result"
import type { Token } from "../../Models/Core/Token"
import type { TokenType } from "../../Models/Core/TokenType"
import type { TokenTypeRestriction } from "../../Models/Core/TokenTypeRestrictions"
import type { TokenStringCollectionResult } from "../../Models/Parsing/TokenStringCollectionResult"
import { DefaultTokenIsInstance } from "./defaultTokenTypeCheck"


const closedBracketAllowedSymbols = new Set([')'])
Object.freeze(closedBracketAllowedSymbols)

export const closedBracketRestrictions: TokenTypeRestriction = {
  allowedSymbols: closedBracketAllowedSymbols,
  symbolMembershipCheckCallback: (symbol) => closedBracketAllowedSymbols.has(symbol),
  maxLength: 1
}
Object.freeze(closedBracketRestrictions)

export const closedBracketTokenType: TokenType<Token> = {
  name: "closedBracket",
  tokenStringRestriction: closedBracketRestrictions,
  tokenParser: (
    stringCollectionResult: TokenStringCollectionResult
  ): Result<Token> => {
    if (stringCollectionResult.tokenString.length === 0) {
      return Result.Fail("ArgumentException: length of tokenString can not be 0")
    }

    if (closedBracketRestrictions.maxLength
      && stringCollectionResult.tokenString.length > closedBracketRestrictions.maxLength) {
      return Result.Fail(`ArgumentException: length of tokenString can not be more than ${closedBracketRestrictions.maxLength}`)
    }

    const invalidSymbolIndex = getIndexOfFirst(
      stringCollectionResult.tokenString,
      (s: string) => !closedBracketRestrictions.symbolMembershipCheckCallback(s))

    if (invalidSymbolIndex !== null) {
      return Result.Fail(`ArgumentException: invalid symbol '${stringCollectionResult.tokenString[invalidSymbolIndex]}' at index: ${invalidSymbolIndex}`)
    }

    return Result.Success<Token>({
      type: closedBracketTokenType,
      initStringIndex: stringCollectionResult.absoluteStartIndex,
      fromString: stringCollectionResult.tokenString,
    })
  },

  isInstance: (arg) => DefaultTokenIsInstance(arg, closedBracketTokenType)
}

Object.freeze(closedBracketTokenType)