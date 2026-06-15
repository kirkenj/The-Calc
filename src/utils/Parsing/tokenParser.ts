import {  DoubleLinkedListClass } from "../IndexedCollections/DoubleLinkedListClass"
import { Result } from "../Models/Core/Result"
import { type Token } from "../Models/Core/Token"
import { type TokenType } from "../Models/Core/TokenType"
import { type StringCollectionDelegate } from "../Models/Parsing/StringCollectionDelegate"
import { type EquationTokenParserDelegate } from "../Models/Parsing/TokenParserDelegate"



export const parseTokens: EquationTokenParserDelegate = (
  equation, onTokenParsedCallback = null, tokenTypes, tokenStringCollectionDelegate
): Result<DoubleLinkedListClass<Token>> => {
  if (equation.length === 0) {
    return Result.Fail("InvalidArgument: equation")
  }

  if (tokenTypes.length === 0) {
    return Result.Fail("InvalidArgument: tokenTypes")
  }

  let i = 0;
  const tokens = new DoubleLinkedListClass<Token>()
  while (i < equation.length) {
    const tokenTypeForSymbol = tokenTypes.find(tt => tt.tokenStringRestriction.symbolMembershipCheckCallback(equation[i]))
    if (!tokenTypeForSymbol) {
      return Result.Fail(`Unknown token '${equation[i]}' at index ${i}`)
    }

    console.log(`Found ${tokenTypeForSymbol.name} at index`, i, equation[i])

    const tokenStringCollectionResult = tokenStringCollectionDelegate(
      equation,
      i,
      tokenTypeForSymbol.tokenStringRestriction.symbolMembershipCheckCallback,
      tokenTypeForSymbol.tokenStringRestriction.maxLength)

    if (!tokenStringCollectionResult.Success) {
      return tokenStringCollectionResult
    }

    const tokenParseResult = tokenTypeForSymbol.tokenParser(tokenStringCollectionResult.Result)
    if (!tokenParseResult.Success) {
      return tokenParseResult
    }

    const parsedToken = tokenParseResult.Result
    console.log("Token parse result:", tokenParseResult)

    onTokenParsedCallback?.(parsedToken)

    tokens.push(parsedToken)

    i += parsedToken.fromString.length
  }

  return Result.Success(tokens)
}


export const createTokenParser = (
  tokenTypes: TokenType[],
  tokenStringCollectionDelegate: StringCollectionDelegate
) => {
  return (
    equation: string,
    onTokenParsedCallback: ((stringCollectionResult: Token) => void) | null = null,
  ) => parseTokens(equation, onTokenParsedCallback, tokenTypes, tokenStringCollectionDelegate)
}