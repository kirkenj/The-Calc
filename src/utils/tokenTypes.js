import { numberRestrictions, wordRestrictions } from './tokenTypesRestrictions'
import { getNumberAtIndex, getWordAtIndex } from './parseTokenUtil'

export const tokenTypes = [
  {
    name: "Number",
    checkDelegate: numberRestrictions.isNumberSymbol,
    tokenizer: getNumberAtIndex
  },
  {
    name: "Word\\Symbol",
    checkDelegate: wordRestrictions.isWordSymbol,
    tokenizer: getWordAtIndex
  }
]