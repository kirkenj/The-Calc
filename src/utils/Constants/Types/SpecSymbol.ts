import { getIndexOfFirst } from "../../Extensions/arrayUtils"
import { Result } from "../../Models/Core/Result"
import type { ValueToken } from "../../Models/Core/Token"
import type { TokenType } from "../../Models/Core/TokenType"
import type { TokenTypeRestriction } from "../../Models/Core/TokenTypeRestrictions"
import type { TokenStringCollectionResult } from "../../Models/Parsing/TokenStringCollectionResult"



const specSymbolAllowedSymbols = new Set(['*', "/", "\\", "+", "-", ":", "^"])
Object.freeze(specSymbolAllowedSymbols)

export const specSymbolRestrictions: TokenTypeRestriction = {
  allowedSymbols: specSymbolAllowedSymbols,
  symbolMembershipCheckCallback: (symbol) => specSymbolAllowedSymbols.has(symbol),
  maxLength: 1
}
Object.freeze(specSymbolRestrictions)

const isValidSpecSymbolValue = (
  val: string
): Result<string> => {
  if (val.length === 0) {
    return Result.Fail("ArgumentException: length of tokenString can not be 0")
  }

  if (specSymbolRestrictions.maxLength
    && val.length > specSymbolRestrictions.maxLength) {
    return Result.Fail(`ArgumentException: length of tokenString can not be more than ${specSymbolRestrictions.maxLength}`)
  }

  const invalidSymbolIndex = getIndexOfFirst(
    val,
    (s) => !specSymbolRestrictions.symbolMembershipCheckCallback(s))

  if (invalidSymbolIndex !== null) {
    return Result.Fail(`ArgumentException: invalid symbol '${val[invalidSymbolIndex]}' at index: ${invalidSymbolIndex}`)
  }

  return Result.Success(val)
}

export const specSymbolTokenType: TokenType<ValueToken<string>> = {
  name: "Special symbol",
  tokenStringRestriction: specSymbolRestrictions,
  tokenParser: (
    stringCollectionResult: TokenStringCollectionResult
  ): Result<ValueToken<string>> => {

    const isValidSpecSymbolValueResult = isValidSpecSymbolValue(stringCollectionResult.tokenString)
    if (!isValidSpecSymbolValueResult.Success) {
      return isValidSpecSymbolValueResult
    }

    return Result.Success({
      type: specSymbolTokenType,
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
      vToken.type !== specSymbolTokenType
      || !('value' in vToken)
      || typeof vToken.value !== 'string') {
      return { success: false }
    }

    const isValidSpecSymbolValueResult = isValidSpecSymbolValue(vToken.value)
    if (!isValidSpecSymbolValueResult.Success) {
      return { success: false }
    }

    return { success: true, result: vToken as ValueToken<string> }
  }
}

Object.freeze(specSymbolTokenType)
