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



export const calculateTokens = (tokens, context = null) => {
  console.log("Started calculateTokens.",
    "tokens:", tokens ? tokens : "[null]",
    "context:", context
  )

  const operatorsAccordingToPriorities = getDefaultOperatorsAccordingToPriorities();
  const variables = getOperatorsForVariables(context)
  console.log("Variables handlers:", variables)
  if (variables) {
    operatorsAccordingToPriorities.unshift(variables)
    console.log("operatorsAccordingToPriorities with variables:", variables)
  }

  const currentTokensToIgnore = new Set([...ignoredByDefaultTokenTypes, tokenTypeNames.Number])
  const isTokenIgnoredCallback = (token) => currentTokensToIgnore.has(token.typeName)

  const notIgnoredTokens = getIndexedItemsOnCallback(tokens, (token) => !isTokenIgnoredCallback(token))
  console.log("notIgnoredTokens:", notIgnoredTokens)


  for (let k = 0; k < operatorsAccordingToPriorities.length; k++) {
    const operatorsToPriority = operatorsAccordingToPriorities[k]

    console.log("Current operators to handle", operatorsToPriority,
      "Prevalidator", operatorsToPriority.operators
    )





    for (let i = 0; i < notIgnoredTokens.length; i++) {

      const notIgnoredTokenIndex = notIgnoredTokens[i]

      const currentOperatorHandler = operatorsToPriority.operators.get(tokens[notIgnoredTokenIndex.index].value)
      if (!currentOperatorHandler) {
        console.log(`Handler not found or not at current operators priority. operator: ${tokens[notIgnoredTokenIndex.index].value} at index ${notIgnoredTokenIndex.index}`, tokens)
        continue
      }

      const prevalidationResult = operatorsToPriority.preHandler(tokens, i, notIgnoredTokenCheckCallback)
      console.log("prevalidationResult", prevalidationResult, "fallIfPreHandleFailed", operatorsToPriority.fallIfPreHandleFailed);

      if (!prevalidationResult) {
        if (operatorsToPriority.fallIfPreHandleFailed) {
          console.log(`Invalid syntax for token at index ${notIgnoredTokenIndex.index}`, tokens[notIgnoredTokenIndex.index])
          return null
        }
        else {
          console.log(`Operator of function is not applicable at index:${notIgnoredTokenIndex.index}`)
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


      const poppedNotIgnoredToken = notIgnoredTokens.splice(i, 1)[0]
      console.log("poppedNotIgnoredToken", poppedNotIgnoredToken, "at index(i)", i)

      for (const itemIndex of notIgnoredTokens) {
        if (itemIndex.index < poppedNotIgnoredToken.index) {
          continue;
        }


        const indexBeforeDecrement = itemIndex.index 
        itemIndex.index = itemIndex.index - prevalidationResult.operationLength + 1

        console.log("indexBeforeDecrement", indexBeforeDecrement,
          "itemIndex after decremented:", itemIndex,
          "Index refers to", tokens[itemIndex.index]);
      }


      console.log("arr", tokens, "popped", popped, notIgnoredTokens)
      i = prevalidationResult.operationStartIndex

      //throw "break"
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

export const calculateSimpleEquation = (tokens, context = null) => {
  console.log("Started calculateSimpleEquation. parameter:", tokens,
    "context:", context ? context : "[null]"
  )

  console.log("Recieved tokens to handle:", tokens)
  return calculateTokens(tokens, context)
}