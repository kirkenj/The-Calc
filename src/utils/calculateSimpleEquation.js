import { getDefaultOperatorsAccordingToPriorities } from './operatorsAccordingToPriorities'
import { tokenTypeNames, createToken } from './tokenTypes'
import { getOperatorsForVariables } from './variableResolver';
import { getItemIndexToTheRightByCallback, getIndexOfFirst } from './arrayUtils';

const ignoredByDefaultTokenTypes = new Set([tokenTypeNames.WhiteSpace, tokenTypeNames.ClosedBracket, tokenTypeNames.OpenBracket])
const notIgnoredTokenCheckCallback = (token) => !ignoredByDefaultTokenTypes.has(token.typeName)

const getIndexedItemsOnCallback = (tokens, callback) => {
  const arrToRet = []

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (callback(token)) {
      arrToRet.push({ index: i, token })
    }
  }

  return arrToRet
}

const shiftIndexes = (indexes, decrement, startingWithIndexIntoPairsArr) => {

}


export const calculateTokens = (tokens, context = null) => {
  console.log("Started calculateTokens.",
    "tokens:", tokens ? tokens : "[null]",
    "context:", context
  )

  const operatorsAccordingToPriorities = getDefaultOperatorsAccordingToPriorities();
  console.log("operatorsAccordingToPriorities:",operatorsAccordingToPriorities)


  const variables = getOperatorsForVariables(context)
  console.log("Variables handlers:", variables)
  if (variables) {
    operatorsAccordingToPriorities.unshift(variables)
    console.log("operatorsAccordingToPriorities with variables:", variables)
  }

  const currentTokensToIgnore = new Set([...ignoredByDefaultTokenTypes, tokenTypeNames.Number])
  const notIgnoredTokensIndexes = getIndexedItemsOnCallback(tokens, (token) => !currentTokensToIgnore.has(token.typeName))
  console.log("notIgnoredTokens:", notIgnoredTokensIndexes)

  console.log("operatorsAccordingToPriorities:",operatorsAccordingToPriorities)

  for (let k = 0; k < operatorsAccordingToPriorities.length; k++) {
    const operatorsToPriority = operatorsAccordingToPriorities[k]

    console.log(
      "Current operators to handle", operatorsToPriority,
      "Operators:", operatorsToPriority.operators)


    for (let i = 0; i < notIgnoredTokensIndexes.length; i++) {
      const notIgnoredTokenIndexPair = notIgnoredTokensIndexes[i]
      const notIgnoredTokenIndex = notIgnoredTokenIndexPair.index
      const notIgnoredToken = tokens[notIgnoredTokenIndex]

      const currentOperatorHandler = operatorsToPriority.operators.get(notIgnoredToken.value)
      if (!currentOperatorHandler) {
        console.log("Handler not found or not at current operators priority. " +
          `operator:${notIgnoredToken.value} at index ${notIgnoredTokenIndex}`, "Current operators:", operatorsToPriority.operators.keys(), tokens)
        continue
      }

      const prevalidationResult = operatorsToPriority.preHandler(
        tokens, notIgnoredTokenIndex, notIgnoredTokenCheckCallback)

      console.log(
        "prevalidationResult", prevalidationResult,
        "fallIfPreHandleFailed", operatorsToPriority.fallIfPreHandleFailed);

      if (!prevalidationResult) {
        if (operatorsToPriority.fallIfPreHandleFailed) {
          console.log(`Invalid syntax for token at index ${notIgnoredTokenIndex}`, notIgnoredToken)
          return null
        }
        else {
          console.log(`Operator of function is not applicable at index:${notIgnoredToken}`)
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


      console.log("Not ignored token indexes before pop:", notIgnoredTokensIndexes,
        "Index to pop index:", i, "Index pair to pop:", notIgnoredTokensIndexes[i]
      )
      const poppedNotIgnoredToken = notIgnoredTokensIndexes.splice(i, 1)[0]
      console.log("poppedNotIgnoredToken", poppedNotIgnoredToken, "at index(i)", i)

      const indexDecrement = (prevalidationResult.operationLength - 1)
      
      for (let q = i; q < notIgnoredTokensIndexes.length; q++) {
      const itemIndex = notIgnoredTokensIndexes[q]
        const indexBeforeDecrement = itemIndex.index
        
        itemIndex.index = itemIndex.index - indexDecrement

        console.log("indexBeforeDecrement", indexBeforeDecrement,
          "itemIndex after decremented:", itemIndex,
          "Index refers to", tokens[itemIndex.index]);

        if (itemIndex.token !== tokens[itemIndex.index]) {
          throw new Error("Self validation failed for indexPair", { cause: { itemIndex, tokens } })
        }
      }

      i--
      console.log("arr", tokens, "popped", popped, notIgnoredTokensIndexes)
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
  return tokenToReturn
}