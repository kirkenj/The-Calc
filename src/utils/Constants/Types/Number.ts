import { getIndexOfFirst } from "../../Extensions/arrayUtils"
import { Result } from "../../Models/Core/Result"
import type { ValueToken } from "../../Models/Core/Token"
import type { TokenType } from "../../Models/Core/TokenType"
import type { TokenTypeRestriction } from "../../Models/Core/TokenTypeRestrictions"
import type { TokenStringCollectionResult } from "../../Models/Parsing/TokenStringCollectionResult"


const numberAllowedSymbols = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."])
Object.freeze(numberAllowedSymbols)


export const numberRestrictions: TokenTypeRestriction = {
  allowedSymbols: numberAllowedSymbols,
  symbolMembershipCheckCallback: (symbol) => numberAllowedSymbols.has(symbol),
  maxLength: null
}
Object.freeze(numberRestrictions)


export const numberTokenType: TokenType<ValueToken<number>> = {
  name: "Number",
  tokenStringRestriction: numberRestrictions,
  tokenParser: (
    stringCollectionResult: TokenStringCollectionResult
  ): Result<ValueToken<number>> => {
    if (stringCollectionResult.tokenString.length === 0) {
      return Result.Fail("ArgumentException: length of tokenString can not be 0")
    }

    if (numberRestrictions.maxLength
      && stringCollectionResult.tokenString.length > numberRestrictions.maxLength) {
      return Result.Fail(`ArgumentException: length of tokenString can not be more than ${numberRestrictions.maxLength}`)
    }

    const invalidSymbolIndex = getIndexOfFirst(
      stringCollectionResult.tokenString,
      (s: string) => !numberRestrictions.symbolMembershipCheckCallback(s))

    if (invalidSymbolIndex !== null) {
      return Result.Fail(`ArgumentException: invalid symbol '${stringCollectionResult.tokenString[invalidSymbolIndex]}' at index: ${invalidSymbolIndex}`)
    }

    const number = parseFloat(stringCollectionResult.tokenString)

    if (isNaN(number)) {
      throw Error(`Couldn't parse number properly at index ${stringCollectionResult.absoluteStartIndex}`)
    }

    return Result.Success({
      type: numberTokenType,
      initStringIndex: stringCollectionResult.absoluteStartIndex,
      fromString: stringCollectionResult.tokenString,
      value: number
    })
  },
  
  isInstance: (
    token
  ) =>  {
    const vToken = token as ValueToken<unknown>
    if (
      vToken.type !== numberTokenType 
      || !('value' in vToken) 
      || typeof vToken.value !== 'number'
      || isNaN(vToken.value)) {
      return { success: false };
    }

    return {success: true, result: vToken as ValueToken<number>}
  }  
}

Object.freeze(numberTokenType)
