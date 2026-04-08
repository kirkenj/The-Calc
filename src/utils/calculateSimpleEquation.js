import { getDefaultOperatorsAccordingToPriorities } from './operatorsAccordingToPriorities'
import { tokenTypeNames, createToken } from './tokenTypes'
import { getOperatorsForVariables } from './variableResolver';
import { getItemIndexToTheRightByCallback, getIndexOfFirst } from './arrayUtils';
import { decrementIndexes, getIndexesOnPredicate } from './indexUtils';

const ignoredByDefaultTokenTypes = new Set([tokenTypeNames.WhiteSpace, tokenTypeNames.ClosedBracket, tokenTypeNames.OpenBracket])
const notIgnoredTokenCheckCallback = (token) => !ignoredByDefaultTokenTypes.has(token.typeName)

const operatorsTokenTypes = new Set([tokenTypeNames.Word, tokenTypeNames.SpecSymbol])
const isOperatorsTokenTypesCallback = (token) => operatorsTokenTypes.has(token.typeName)

const getOperatorsForContext = (context) => {
  const operatorsByPriority = getDefaultOperatorsAccordingToPriorities();
  const variables = getOperatorsForVariables(context)
  if (variables) {
    operatorsByPriority.unshift(variables)
  }

  return operatorsByPriority
}

const getCalculationResult = (tokens) => {
  const firstNotIgnoredTokenIndex = getIndexOfFirst(tokens, notIgnoredTokenCheckCallback)
  if (firstNotIgnoredTokenIndex === null) {
    return {result: null, message: "not ignored tokens not found"}
  }

  const secondNotIgnoredTokenIndex = getItemIndexToTheRightByCallback(tokens, firstNotIgnoredTokenIndex, notIgnoredTokenCheckCallback)
  if (secondNotIgnoredTokenIndex !== null) {
    return {result: null, message: "not ignored tokens count > 1"}
  }

  return {result: tokens[firstNotIgnoredTokenIndex].value, message: null}
}

export const calculateTokens = (tokens, context = null) => {
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

      decrementIndexes(operatorIndexes, i, (syntaxValidationResult.operationLength - 1))
      i--
    }
  }

  const calculationResult = getCalculationResult(tokens)
  if (calculationResult.result === null){
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