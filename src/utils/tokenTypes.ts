import { numberRestrictions, openBracketRestrictions, closedBracketRestrictions, specSymbolRestrictions, whiteSpaceRestrictions, wordRestrictions } from './tokenTypesRestrictions'
import { getNumberAtIndex, getTokenSubstringAtIndex } from './tokenStringBuilder'

type TokenValueType = number | string

export interface Token {
  typeName: string,
  value: TokenValueType,
  initStringIndex: number,
  fromSlice: string
}

export interface TokenType {
  name: string,
  charCheckDelegate: (arg: string) => boolean,
  tokenParser: (string: string) => Token,
}

export const tokenTypeNames =
{
  Number: "Number",
  Word: "Word",
  WhiteSpace: "Whitespace",
  SpecSymbol: "Special symbol",
  OpenBracket: "OpenBracket",
  ClosedBracket: "ClosedBracket"
}

Object.freeze(tokenTypeNames)

export const tokenTypes: TokenType = [
  {
    name: tokenTypeNames.Number,
    charCheckDelegate: numberRestrictions.symbolMembershipCheckCallback,
    tokenParser: (value: number, initStringIndex: number, fromString: string) => createToken(tokenTypeNames.Number, value, initStringIndex, fromString)
  },
  {
    name: tokenTypeNames.Word,
    charCheckDelegate: wordRestrictions.symbolMembershipCheckCallback,
    tokenParser: (value: string, initStringIndex: number, fromString: string) => createToken(tokenTypeNames.Word, value, initStringIndex, fromString)
  },
  {
    name: tokenTypeNames.SpecSymbol,
    charCheckDelegate: specSymbolRestrictions.symbolMembershipCheckCallback,
    tokenParser: (value: string, initStringIndex: number, fromString: string) => createToken(tokenTypeNames.SpecSymbol, value, initStringIndex, fromString)
  },
  {
    name: tokenTypeNames.WhiteSpace,
    charCheckDelegate: whiteSpaceRestrictions.symbolMembershipCheckCallback,
    tokenParser: (value: string, initStringIndex: number, fromString: string) => createToken(tokenTypeNames.WhiteSpace, value, initStringIndex, fromString)
  },
  {
    name: tokenTypeNames.OpenBracket,
    charCheckDelegate: openBracketRestrictions.symbolMembershipCheckCallback,
    tokenParser: (value: string, initStringIndex: number, fromString: string) => createToken(tokenTypeNames.OpenBracket, value, initStringIndex, fromString)
  },
  {
    name: tokenTypeNames.ClosedBracket,
    charCheckDelegate: closedBracketRestrictions.symbolMembershipCheckCallback,
    tokenParser: (value: string, initStringIndex: number, fromString: string) => createToken(tokenTypeNames.ClosedBracket, value, initStringIndex, fromString)
  }
]

Object.freeze(tokenTypes)
for (const type of tokenTypes) {
  Object.freeze(type)
}