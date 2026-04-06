import { numberRestrictions, openBracketRestrictions, closedBracketRestrictions, specSymbolRestrictions, whiteSpaceRestrictions, wordRestrictions } from './tokenTypesRestrictions'
import { getNumberAtIndex, getTokenSubstringAtIndex } from './tokenStringBuilder'

export const createToken = (typeName, value, initStringIndex, fromSlice) => {
  const valueToRet = {
    typeName,
    value,
    initStringIndex,
    fromSlice
  }

  Object.freeze(valueToRet)
  return valueToRet
}

export const tokenTypeNames =
{
  Number: "Numbr",
  Word: " Word",
  WhiteSpace: "Space",
  SpecSymbol: "Specl",
  OpenBracket: "OpenBracket",
  ClosedBracket: "ClosedBracket" 

}

Object.freeze(tokenTypeNames)

export const tokenTypes = [
  {
    name: tokenTypeNames.Number,
    charCheckDelegate: numberRestrictions.symbolMembershipCheckCallback,
    tokenStringCollector: getNumberAtIndex,
    tokenFactory: (value, initStringIndex, fromString) => createToken(tokenTypeNames.Number, value, initStringIndex, fromString)
  },
  {
    name: tokenTypeNames.Word,
    charCheckDelegate: wordRestrictions.symbolMembershipCheckCallback,
    tokenStringCollector: (equation, index) => getTokenSubstringAtIndex(equation, index, wordRestrictions),
    tokenFactory: (value, initStringIndex, fromString) => createToken(tokenTypeNames.Word, value, initStringIndex, fromString)
  },
  {
    name: tokenTypeNames.SpecSymbol,
    charCheckDelegate: specSymbolRestrictions.symbolMembershipCheckCallback,
    tokenStringCollector: (equation, index) => getTokenSubstringAtIndex(equation, index, specSymbolRestrictions),
    tokenFactory: (value, initStringIndex, fromString) => createToken(tokenTypeNames.SpecSymbol, value, initStringIndex, fromString)
  },
  {
    name: tokenTypeNames.WhiteSpace,
    charCheckDelegate: whiteSpaceRestrictions.symbolMembershipCheckCallback,
    tokenStringCollector: (equation, index) => getTokenSubstringAtIndex(equation, index, whiteSpaceRestrictions),
    tokenFactory: (value, initStringIndex, fromString) => createToken(tokenTypeNames.WhiteSpace, value, initStringIndex, fromString)
  },
  {
    name: tokenTypeNames.OpenBracket,
    charCheckDelegate: openBracketRestrictions.symbolMembershipCheckCallback,
    tokenStringCollector: (equation, index) => getTokenSubstringAtIndex(equation, index, openBracketRestrictions),
    tokenFactory: (value, initStringIndex, fromString) => createToken(tokenTypeNames.OpenBracket, value, initStringIndex, fromString)
  },
  {
    name: tokenTypeNames.ClosedBracket,
    charCheckDelegate: closedBracketRestrictions.symbolMembershipCheckCallback,
    tokenStringCollector: (equation, index) => getTokenSubstringAtIndex(equation, index, closedBracketRestrictions),
    tokenFactory: (value, initStringIndex, fromString) => createToken(tokenTypeNames.ClosedBracket, value, initStringIndex, fromString)
  }
]

Object.freeze(tokenTypes)
for (const type of tokenTypes) {
  Object.freeze(type)
}