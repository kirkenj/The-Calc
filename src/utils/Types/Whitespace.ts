import { type TokenTypeRestriction } from "../Models/Core/TokenTypeRestrictions"
import { type Token } from "../Models/Core/Token"
import { type TokenType } from "../Models/Core/TokenType"
import { type TokenStringCollectionResult } from "../Models/Parsing/TokenStringCollectionResult"
import { getIndexOfFirst } from "../Extensions/arrayUtils"
import { Result } from "../Models/Core/Result"

const whiteSpaceAllowedSymbols = new Set([' '])
Object.freeze(whiteSpaceAllowedSymbols)

export const whiteSpaceRestrictions: TokenTypeRestriction = {
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
  ): Result<Token> => {
    if (stringCollectionResult.tokenString.length === 0) {
      return Result.Fail("ArgumentException: length of tokenString can not be 0")
    }

    if (whiteSpaceRestrictions.maxLength
      && stringCollectionResult.tokenString.length > whiteSpaceRestrictions.maxLength) {
      return Result.Fail(`ArgumentException: length of tokenString can not be more than ${whiteSpaceRestrictions.maxLength}`)
    }

    const invalidSymbolIndex = getIndexOfFirst(
      stringCollectionResult.tokenString,
      (s: string) => !whiteSpaceRestrictions.symbolMembershipCheckCallback(s))

    if (invalidSymbolIndex !== null) {
      return Result.Fail(`ArgumentException: invalid symbol '${stringCollectionResult.tokenString[invalidSymbolIndex]}' at index: ${invalidSymbolIndex}`)
    }


    return Result.Success({
      type: whiteSpaceTokenType,
      initStringIndex: stringCollectionResult.absoluteStartIndex,
      fromString: stringCollectionResult.tokenString,
    })
  }
}

Object.freeze(whiteSpaceTokenType)
