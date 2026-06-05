import { tokenTypes } from './Constants/Types/TokenTypes';
import { getIndexOfFirst, getItemIndexToTheRightByCallback } from './Extensions/arrayUtils';
import { decrementValuesFromIndex, getIndexesOnPredicate } from './indexUtils';
import { Result } from './Models/Core/Result';
import { type Token, type ValueToken } from './Models/Core/Token';
import { type TokenType } from './Models/Core/TokenType';
import { getDefaultOperatorsAccordingToPriorities } from './operatorsAccordingToPriorities';
import { getOperatorsForVariables } from './variableResolver';

const ignoredByDefaultTokenTypes: TokenType[] = [tokenTypes.WhiteSpaceTokenType, tokenTypes.ClosedBracketTokenType, tokenTypes.OpenBracketTokenType]
const notIgnoredTokenCheckCallback = (token: Token): boolean => getIndexOfFirst(ignoredByDefaultTokenTypes, type => type.isInstance(token).success) === null

const operatorsTokenTypes: TokenType<ValueToken<string>>[] = [tokenTypes.WordTokenType, tokenTypes.SpecSymbolTokenType]
//const isOperatorsTokenTypesCallback = (token: Token): boolean => getIndexOfFirst(operatorsTokenTypes, type => type.isInstance(token).success) !== null

const getOperatorsForContext = (context: Map<string, Token> | null) => {
  const operatorsByPriority = getDefaultOperatorsAccordingToPriorities();
  const variables = getOperatorsForVariables(context)
  console.log("variables as handlers: ", variables)
  
  if (variables) {
    operatorsByPriority.unshift(variables)
    console.log("Pushed variables into operators");
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


export const indexationCallback = (token: Token) => {
  console.log("indexationCallback: token: ", token)
  
  let valToRet: ValueToken<string> | null = null
  for (const type of operatorsTokenTypes) {
    const typeCheckResult = type.isInstance(token)
    if (typeCheckResult.success) {
      valToRet = typeCheckResult.result
      break
    }
  }

  console.log("indexationCallback: created index", valToRet)
  return valToRet === null
    ? Result.Fail("")
    : Result.Success(valToRet)
}


export const calculateTokens = (
  tokens: Token[],
  context: Map<string, Token> | null = null
): Result<ValueToken<number>> => {
  console.groupCollapsed(`calculateTokens`, tokens, context);

  const operatorsByPriority = getOperatorsForContext(context)
  console.log("operatorsByPriority:", operatorsByPriority)


  const operatorIndexesResult = getIndexesOnPredicate(tokens, indexationCallback)
  if (!operatorIndexesResult.Success){
    throw Error("Something went wrong with indexation!!")
  }

  const operatorIndexes = operatorIndexesResult.Result

  console.log("handlersIndexes:", operatorIndexes)

  for (let k = 0; k < operatorsByPriority.length; k++) {
    const currenrPriorityOperators = operatorsByPriority[k]
    console.log("Operators from current priority", currenrPriorityOperators)

    for (let i = 0; i < operatorIndexes.length; i++) {
      const operatorTokenIndex = operatorIndexes[i]

      const operatorToken = operatorTokenIndex.ref
      const currentOperatorHandler = currenrPriorityOperators.operators.get(operatorToken.value)
      if (!currentOperatorHandler) {
        console.log("Handler not found at current operators priority. " +
          `operator:${operatorToken.value} at index ${operatorTokenIndex.index}`)
        continue
      }

      const syntaxValidationResult = currenrPriorityOperators.syntaxValidator(
        tokens, operatorTokenIndex.index, notIgnoredTokenCheckCallback)

      console.log("syntaxValidationResult", syntaxValidationResult,
        "fallIfPreHandleFailed", currenrPriorityOperators.fallIfSyntaxValidationFailed);

      if (!syntaxValidationResult) {
        if (currenrPriorityOperators.fallIfSyntaxValidationFailed) {
          const msg = `Invalid syntax for token at index ${operatorTokenIndex.index}`;
          console.log(msg, operatorToken)
          return Result.Fail(msg)
        }
        else {
          console.log(`Operator of function is not applicable at init index: ${operatorToken.initStringIndex}`)
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