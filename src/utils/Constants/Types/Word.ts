import { getIndexOfFirst } from "../../Extensions/arrayUtils"
import { Result } from "../../Models/Core/Result"
import type { ValueToken } from "../../Models/Core/Token"
import type { TokenType } from "../../Models/Core/TokenType"
import type { TokenTypeRestriction } from "../../Models/Core/TokenTypeRestrictions"
import type { TokenStringCollectionResult } from "../../Models/Parsing/TokenStringCollectionResult"


const wordAllowedSymbols = new Set(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'])
Object.freeze(wordAllowedSymbols)

export const wordRestrictions: TokenTypeRestriction = {
  allowedSymbols: wordAllowedSymbols,
  symbolMembershipCheckCallback: (symbol) => wordAllowedSymbols.has(symbol),
  maxLength: null
}
Object.freeze(wordRestrictions)

export const wordTokenType: TokenType<ValueToken<string>> = {
  name: "Word",
  tokenStringRestriction: wordRestrictions,
  tokenParser: (
    stringCollectionResult: TokenStringCollectionResult
  ): Result<ValueToken<string>> => {

    if (stringCollectionResult.tokenString.length === 0) {
      return Result.Fail("ArgumentException: length of tokenString can not be 0")
    }

    if (wordRestrictions.maxLength
      && stringCollectionResult.tokenString.length > wordRestrictions.maxLength) {
      return Result.Fail(`ArgumentException: length of tokenString can not be more than ${wordRestrictions.maxLength}`)
    }

    const invalidSymbolIndex = getIndexOfFirst(
      stringCollectionResult.tokenString,
      (s: string) => !wordRestrictions.symbolMembershipCheckCallback(s))

    if (invalidSymbolIndex !== null) {
      return Result.Fail(`ArgumentException: invalid symbol '${stringCollectionResult.tokenString[invalidSymbolIndex]}' at index: ${invalidSymbolIndex}`)
    }


    return Result.Success({
      type: wordTokenType,
      initStringIndex: stringCollectionResult.absoluteStartIndex,
      fromString: stringCollectionResult.tokenString,
      value: stringCollectionResult.tokenString
    })
  },

  isInstance: (
    token
  ) => {
    const vToken = token as ValueToken<unknown>
    if (
      vToken.type !== wordTokenType
      || !('value' in vToken)
      || typeof vToken.value !== 'string') {
      return { success: false };
    }

    return { success: true, result: vToken as ValueToken<string> }
  }
}

Object.freeze(wordTokenType)