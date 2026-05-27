import { getIndexOfFirst, getItemIndexToTheRightByCallback } from './Extensions/arrayUtils';
import { decrementValuesFromIndex, getIndexesOnPredicate } from './indexUtils';
import { Result } from './Models/Core/Result';
import type { Token, ValueToken } from './Models/Core/Token';
import type { TokenType } from './Models/Core/TokenType';
import { tokenTypes } from './Types/TokenTypes';

const ignoredByDefaultTokenTypes = new Set<TokenType>([tokenTypes.WhiteSpaceTokenType, tokenTypes.ClosedBracketTokenType, tokenTypes.OpenBracketTokenType])
const notIgnoredTokenCheckCallback = (token: Token) => !ignoredByDefaultTokenTypes.has(token.type)

const operatorsTokenTypes = new Set<TokenType>([tokenTypes.WordTokenType, tokenTypes.SpecSymbolTokenType])
const isOperatorsTokenTypesCallback = (token: Token) => operatorsTokenTypes.has(token.type)

const getOperatorsForContext = (context: Map<string, Token>) => {
  const operatorsByPriority = getDefaultOperatorsAccordingToPriorities();
  const variables = getOperatorsForVariables(context)
  if (variables) {
    operatorsByPriority.unshift(variables)
  }

  return operatorsByPriority
}

const getCalculationResult = (
  tokens: Token[]
): Result<Token> => {
  const firstNotIgnoredTokenIndex = getIndexOfFirst(tokens, notIgnoredTokenCheckCallback)
  if (firstNotIgnoredTokenIndex === null) {
    return Result.Fail("not ignored tokens not found") 
  }

  const secondNotIgnoredTokenIndex = getItemIndexToTheRightByCallback(tokens, firstNotIgnoredTokenIndex, notIgnoredTokenCheckCallback)
  if (secondNotIgnoredTokenIndex !== null) {
    return Result.Fail("not ignored tokens count > 1") 
  }

  return Result.Success(tokens[firstNotIgnoredTokenIndex])
}


export const calculateTokens = (
  tokens: Token[],
  context: Map<string, Token> | null = null
): Result<Token> => {
  console.groupCollapsed(`calculateTokens`, tokens, context);

  const operatorsByPriority = getOperatorsForContext(context)

  const operatorIndexes = getIndexesOnPredicate(tokens, isOperatorsTokenTypesCallback)

  console.log("handlersIndexes:", operatorIndexes)

  for (let k = 0; k < operatorsByPriority.length; k++) {
    const currenrPriorityOperators = operatorsByPriority[k]
    console.log("Operators from current priority", currenrPriorityOperators)

    for (let i = 0; i < operatorIndexes.length; i++) {
      const operatorTokenIndex = operatorIndexes[i]
      const operatorToken = tokens[operatorTokenIndex]

      const currentOperatorHandler = currenrPriorityOperators.operators.get(operatorToken.value)
      if (!currentOperatorHandler) {
        console.log("Handler not found at current operators priority. " +
          `operator:${operatorToken.value} at index ${operatorTokenIndex}`)
        continue
      }

      const syntaxValidationResult = currenrPriorityOperators.syntaxValidator(
        tokens, operatorTokenIndex, notIgnoredTokenCheckCallback)

      console.log("syntaxValidationResult", syntaxValidationResult,
        "fallIfPreHandleFailed", currenrPriorityOperators.fallIfSyntaxValidationFailed);

      if (!syntaxValidationResult) {
        if (currenrPriorityOperators.fallIfSyntaxValidationFailed) {
          console.log(`Invalid syntax for token at index ${operatorTokenIndex}`, operatorToken)
          return null
        }
        else {
          console.log(`Operator of function is not applicable at index: ${operatorToken}`)
          continue
        }
      }

      const res = currentOperatorHandler(tokens, syntaxValidationResult)
      console.log(
        "prevalidationResult:", syntaxValidationResult,
        "func:", currentOperatorHandler,
        "res:", res)

      const popped = tokens.splice(
        syntaxValidationResult.operationStartIndex,
        syntaxValidationResult.operationLength,
        res)

      console.log("arr", tokens, "popped", popped)

      console.log("Not ignored token indexes before pop:", operatorIndexes,
        "Index to pop index:", i, "Index pair to pop:", operatorIndexes[i]
      )
      const poppedNotIgnoredToken = operatorIndexes.splice(i, 1)[0]
      console.log("poppedNotIgnoredToken", poppedNotIgnoredToken, "at index(i)", i)

      decrementValuesFromIndex(operatorIndexes, i, (syntaxValidationResult.operationLength - 1))
      i--
    }
  }

  const calculationResult = getCalculationResult(tokens)
  if (calculationResult.result === null) {
    console.log("Couldn't handle equation properly. "
      + (calculationResult.message === null ? "[null]" : calculationResult.message))
  }

  const tokenToReturn = createToken(
    tokenTypeNames.Number,
    calculationResult.result,
    tokens[0].initStringIndex,
    tokens.map(t => t.fromSlice).join(""))

  console.log("Calculation finished. result:", tokenToReturn);
  console.groupEnd();
  return tokenToReturn
}