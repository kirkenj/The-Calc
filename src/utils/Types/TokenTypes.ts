import { closedBracketTokenType } from "./ClosedBracket"
import { openBracketTokenType } from "./OpenBracket"
import { numberTokenType } from "./Number"
import { specSymbolTokenType } from "./SpecSymbol"
import { whiteSpaceTokenType } from "./Whitespace"
import { wordTokenType } from "./Word"


export const tokenTypes = {
  ClosedBracketTokenType: closedBracketTokenType,
  OpenBracketTokenType: openBracketTokenType,
  NumberTokenType: numberTokenType,
  SpecSymbolTokenType: specSymbolTokenType,
  WhiteSpaceTokenType: whiteSpaceTokenType,
  WordTokenType: wordTokenType
}

export const tokenTypesAsArr = Object.values(tokenTypes)