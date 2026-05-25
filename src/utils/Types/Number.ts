import { type ValueToken } from "../Models/Token"
import { type TokenType } from "../Models/TokenType"
import { type TokenTypeRestriction } from "../Models/TokenTypeRestrictions"
import { type TokenStringCollectionResult } from "../tokenStringBuilder"


const numberAllowedSymbols = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."])
Object.freeze(numberAllowedSymbols)


export const numberRestrictions: TokenTypeRestriction = {
    allowedSymbols: numberAllowedSymbols,
    symbolMembershipCheckCallback: (symbol) => numberAllowedSymbols.has(symbol),
    maxLength: null
}
Object.freeze(numberRestrictions)


export const numberTokenType: TokenType = {
  name: "Number",
  tokenStringRestriction: numberRestrictions,
  tokenParser: (
    stringCollectionResult: TokenStringCollectionResult
  ): ValueToken<number> => {
    const number = parseFloat(stringCollectionResult.tokenString)

    if (isNaN(number)) {
      throw Error(`Couldn't parse number properly at index ${stringCollectionResult.absoluteStartIndex}`)
    }

    return {
      type: numberTokenType,
      initStringIndex: stringCollectionResult.absoluteStartIndex,
      fromString: stringCollectionResult.tokenString,
      value: number
    }
  }
}