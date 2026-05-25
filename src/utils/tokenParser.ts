import { type Token } from "./Models/Token"
import { getTokenStringAtIndex } from "./tokenStringBuilder"
import { tokenTypesAsArr } from './Types/TokenTypes'

export const parseTokens = (
  equation: string,
  onTokenParsedCallback: ((stringCollectionResult: Token) => void) | null = null
): Token[] => {
  if (equation.length === 0) {
    throw Error("InvalidArgument: equation")
  }

  let i = 0;
  const tokens = []
  while (i < equation.length) {
    const tokenTypeForSymbol = tokenTypesAsArr.find(tt => tt.tokenStringRestriction.symbolMembershipCheckCallback(equation[i]))
    if (!tokenTypeForSymbol) {
      throw Error(`Unknown token '${equation[i]}' at index ${i}`)
    }

    console.log(`Found ${tokenTypeForSymbol.name} at index`, i, equation[i])

    const tokenStringCollectionResult = getTokenStringAtIndex(
      equation,
      i,
      tokenTypeForSymbol.tokenStringRestriction.symbolMembershipCheckCallback,
      tokenTypeForSymbol.tokenStringRestriction.maxLength)


    const token = tokenTypeForSymbol.tokenParser(tokenStringCollectionResult)

    console.log("Token parse result:", token)

    onTokenParsedCallback?.(token)

    tokens.push(token)

    i += token.fromString.length
  }

  return tokens
}