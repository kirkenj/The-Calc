import { getDefaultOperatorsAccordingToPriorities } from './operatorsAccordingToPriorities'
import { tokenTypeNames, createToken } from './tokenTypes'
import { getOperatorsForVariables } from './variableResolver';
import { getItemIndexToTheRightByCallback, getIndexOfFirst } from './arrayUtils';
import { shuffleIndexes, getIndexedItemsOnCallback } from './indexUtils';

const ignoredByDefaultTokenTypes = new Set([tokenTypeNames.WhiteSpace, tokenTypeNames.ClosedBracket, tokenTypeNames.OpenBracket])
const notIgnoredTokenCheckCallback = (token) => !ignoredByDefaultTokenTypes.has(token.typeName)

const operatorsTokenTypes = new Set([tokenTypeNames.Word, tokenTypeNames.SpecSymbol])
const isOperatorsTokenTypesCallback = (token) => operatorsTokenTypes.has(token.typeName)

export const calculateTokens = (tokens, context = null) => {
  console.groupCollapsed(`calculateTokens`, tokens);

  console.log("Started calculateTokens.",
    "tokens:", tokens ? tokens : "[null]",
    "context:", context
  )

  const operatorsByPriority = getDefaultOperatorsAccordingToPriorities();
  
  const variables = getOperatorsForVariables(context)
  if (variables) {
    operatorsByPriority.unshift(variables)
  }
  
  const operatorIndexArr = getIndexedItemsOnCallback(tokens, isOperatorsTokenTypesCallback)
  console.log("handlersIndex:", operatorIndexArr)

  for (let k = 0; k < operatorsByPriority.length; k++) {
    const currenrPriorityOperators = operatorsByPriority[k]

    console.log(
      "Operators from current priority", currenrPriorityOperators,
      "Operators:", currenrPriorityOperators.operators)

    for (let i = 0; i < operatorIndexArr.length; i++) {
      const operatorIndexPair = operatorIndexArr[i]
      const operatorTokenIndex = operatorIndexPair.index
      const operatorToken = tokens[operatorTokenIndex]

      const currentOperatorHandler = currenrPriorityOperators.operators.get(operatorToken.value)
      if (!currentOperatorHandler) {
        console.log("Handler not found or not at current operators priority. " +
          `operator:${operatorToken.value} at index ${operatorTokenIndex}`, "Current operators:", currenrPriorityOperators.operators.keys(), tokens)
        continue
      }

      const prevalidationResult = currenrPriorityOperators.preHandler(
        tokens, operatorTokenIndex, notIgnoredTokenCheckCallback)

      console.log(
        "prevalidationResult", prevalidationResult,
        "fallIfPreHandleFailed", currenrPriorityOperators.fallIfPreHandleFailed);

      if (!prevalidationResult) {
        if (currenrPriorityOperators.fallIfPreHandleFailed) {
          console.log(`Invalid syntax for token at index ${operatorTokenIndex}`, operatorToken)
          return null
        }
        else {
          console.log(`Operator of function is not applicable at index: ${operatorToken}`)
          continue
        }
      }

      const res = currentOperatorHandler(tokens, prevalidationResult)
      console.log(
        "prevalidationResult:", prevalidationResult,
        "func:", currentOperatorHandler,
        "res:", res)

      const popped = tokens.splice(
        prevalidationResult.operationStartIndex,
        prevalidationResult.operationLength,
        res)

      console.log("arr", tokens, "popped", popped)

      console.log("Not ignored token indexes before pop:", operatorIndexArr,
        "Index to pop index:", i, "Index pair to pop:", operatorIndexArr[i]
      )
      const poppedNotIgnoredToken = operatorIndexArr.splice(i, 1)[0]
      console.log("poppedNotIgnoredToken", poppedNotIgnoredToken, "at index(i)", i)

      shuffleIndexes(operatorIndexArr, i, (prevalidationResult.operationLength - 1))
      i--
    }
  }

  console.log("Calculation finished. Postcalculation validation", tokens)
  const firstNotIgnoredTokenIndex = getIndexOfFirst(tokens, notIgnoredTokenCheckCallback)
  if (firstNotIgnoredTokenIndex === null) {
    console.log("Couldn't handle equation properly (not ignored tokens not found)");
    return null
  }

  const secondNotIgnoredTokenIndex = getItemIndexToTheRightByCallback(tokens, firstNotIgnoredTokenIndex, notIgnoredTokenCheckCallback)
  if (secondNotIgnoredTokenIndex !== null) {
    console.log("Couldn't handle equation properly (not ignored tokens count > 1)");
    return null
  }

  const calculationResult = tokens[firstNotIgnoredTokenIndex]

  const tokenToReturn = createToken(
    tokenTypeNames.Number,
    calculationResult.value,
    tokens[0].initStringIndex,
    tokens.map(t => t.fromSlice).join(""))

  console.log("Calculation finished. result:", tokenToReturn);
  console.groupEnd();
  return tokenToReturn
}