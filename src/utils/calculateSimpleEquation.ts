import { tokenTypes } from './Constants/Types/TokenTypes';
import { getIndexOfFirst, getItemIndexToTheRightByCallback } from './Extensions/arrayUtils';
import { decrementValuesFromIndex, getIndexesOnPredicate } from './indexUtils';
import { Result } from './Models/Core/Result';
import { type Token, type ValueToken } from './Models/Core/Token';
import { type TokenType } from './Models/Core/TokenType';
import { getDefaultOperatorsAccordingToPriorities } from './operatorsAccordingToPriorities';
import { getOperatorsForVariables } from './variableResolver';

const ignoredByDefaultTokenTypes = new Set<TokenType>([tokenTypes.WhiteSpaceTokenType, tokenTypes.ClosedBracketTokenType, tokenTypes.OpenBracketTokenType])
const notIgnoredTokenCheckCallback = (token: Token) => !ignoredByDefaultTokenTypes.has(token.type)

const operatorsTokenTypes = new Set<TokenType>([tokenTypes.WordTokenType, tokenTypes.SpecSymbolTokenType])
const isOperatorsTokenTypesCallback = (token: Token) => operatorsTokenTypes.has(token.type)

const getOperatorsForContext = (context: Map<string, Token> | null) => {
  const operatorsByPriority = getDefaultOperatorsAccordingToPriorities();
  const variables = getOperatorsForVariables(context)
  if (variables) {
    operatorsByPriority.unshift(variables)
  }

  return operatorsByPriority
}

const getCalculationResult = (
  tokens: Token[]
): Result<ValueToken<number>> => {
  const firstNotIgnoredTokenIndex = getIndexOfFirst(tokens, notIgnoredTokenCheckCallback)
  if (firstNotIgnoredTokenIndex === null) {
    return Result.Fail("not ignored tokens not found")
  }

  const secondNotIgnoredTokenIndex = getItemIndexToTheRightByCallback(tokens, firstNotIgnoredTokenIndex, notIgnoredTokenCheckCallback)
  if (secondNotIgnoredTokenIndex !== null) {
    return Result.Fail("not ignored tokens count > 1")
  }

  const isNumberCheckResult = tokenTypes.NumberTokenType.isInstance(tokens[firstNotIgnoredTokenIndex])
  if (!isNumberCheckResult.success) {
    return Result.Fail("Invalid not ignored token type")
  }

  return Result.Success(isNumberCheckResult.result)
}


export const calculateTokens = (
  tokens: Token[],
  context: Map<string, Token> | null = null
): Result<ValueToken<number>> => {
  console.groupCollapsed(`calculateTokens`, tokens, context);

  const operatorsByPriority = getOperatorsForContext(context)

  const operatorIndexes = getIndexesOnPredicate(tokens, ((token) => {
    
  }))

  console.log("handlersIndexes:", operatorIndexes)

  for (let k = 0; k < operatorsByPriority.length; k++) {
    const currenrPriorityOperators = operatorsByPriority[k]
    console.log("Operators from current priority", currenrPriorityOperators)

    for (let i = 0; i < operatorIndexes.length; i++) {
      const operatorTokenIndex = operatorIndexes[i]
      const tokenToCheck = tokens[operatorTokenIndex]
      const isWordResult = tokenTypes.WordTokenType.isInstance(tokenToCheck) // add check for specSymbol!!!!!!!!!!!!
      if (!isWordResult.success) {
        const msg = `Invalid syntax for token at index ${operatorTokenIndex}`;
        console.log(msg, tokenToCheck)
        return Result.Fail(msg)
      }

      const operatorToken = isWordResult.result
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
          const msg = `Invalid syntax for token at index ${operatorTokenIndex}`;
          console.log(msg, operatorToken)
          return Result.Fail(msg)
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
  if (!calculationResult.Success) {
    const msg = "Couldn't handle equation properly. " + calculationResult.Message;
    console.log(msg)
    return Result.Fail(msg)
  }


  const tokenToReturn: ValueToken<number> = {
    type: tokenTypes.NumberTokenType,
    value: calculationResult.Result.value,
    initStringIndex: tokens[0].initStringIndex,
    fromString: tokens.map(t => t.fromString).join("")
  }

  console.log("Calculation finished. result:", tokenToReturn);
  console.groupEnd();
  return Result.Success(tokenToReturn)
}