import { getDefaultOperatorsAccordingToPriorities } from './operatorsAccordingToPriorities'
import { tokenTypeNames, createToken } from './tokenTypes'
import { getOperatorsForVariables } from './variableResolver';

const ignoredByDefaultTokenTypes = new Set([tokenTypeNames.WhiteSpace])
const notIgnoredTokenCheckCallback = (token) => !ignoredByDefaultTokenTypes.has(token.typeName) 

export const calculateTokens = (tokens, context = null) => {
  console.log("Started calculateTokens.",
    "tokens:", tokens ? tokens : "[null]",
    "context:", context ? context : "[null]"
  )

  if (tokens.length > 2 && tokens[0] === '(' && tokens[tokens.length - 1] === ')'){
    tokens = tokens.slice(1, tokens.length - 1)
    console.log("Found braces at both equation sides. New tokens:", tokens);
  }

  const operatorsAccordingToPriorities = getDefaultOperatorsAccordingToPriorities();
  const variables = getOperatorsForVariables(context)
  console.log("Variables handlers:", variables)
  if (variables)
  {
    operatorsAccordingToPriorities.unshift(variables)
    console.log("operatorsAccordingToPriorities with variables:", variables)
  }

  const currentTokensToIgnore = new Set([...ignoredByDefaultTokenTypes, tokenTypeNames.Number])
  
  for (let k = 0; k < operatorsAccordingToPriorities.length; k++) {
    const operatorsToPriority = operatorsAccordingToPriorities[k]

    console.log("Current operators to handle", operatorsToPriority,
      "Prevalidator", operatorsToPriority.operators
    )

    for (let i = 0; i < tokens.length; i++) {
      if (currentTokensToIgnore.has(tokens[i].typeName)) {
        console.log("Skipped:", tokens[i], "index:", i);
        continue
      }

      const currentOperatorHandler = operatorsToPriority.operators.get(tokens[i].value)
      if (!currentOperatorHandler) {
        console.log(`Handler not found or not at current operators priority. operator: ${tokens[i]} at index ${i}`, tokens)
        continue
      }

      const prevalidationResult = operatorsToPriority.preHandler(tokens, i, notIgnoredTokenCheckCallback)
      console.log("prevalidationResult", prevalidationResult, "fallIfPreHandleFailed", operatorsToPriority.fallIfPreHandleFailed);

      if (!prevalidationResult) {
        if (operatorsToPriority.fallIfPreHandleFailed) {
          console.log(`Invalid syntax for token at index ${i}`, tokens[i])
          return null
        }
        else {
          console.log(`Operator of function is not applicable at index:${i}`)
          continue
        }
      }

      const res = currentOperatorHandler(tokens, prevalidationResult)
      console.log(
        "prevalidationResult:", prevalidationResult,
        "func:", currentOperatorHandler,
        "res:", res)

      const sliceToReplace = tokens.slice(
        prevalidationResult.operationStartIndex, 
        prevalidationResult.operationLength + 1)
      
      const tokenToPaste = createToken(
        tokenTypeNames.Number, 
        res, 
        sliceToReplace[0].initStringIndex, 
        sliceToReplace.map(s => s.fromSlice).join(""))

      console.log("arr", tokens, "slice to replace", sliceToReplace)
      
      const popped = tokens.splice(
        prevalidationResult.operationStartIndex,
        prevalidationResult.operationLength,
        tokenToPaste)

      console.log("arr", tokens, "popped", popped)
      i = prevalidationResult.operationStartIndex
    }
  }

  console.log("Calculation finished. Postcalculation validation", tokens)
  let firstNotIgnoredTokenIndex = null
  for (let i = 0; i < tokens.length; i++){
    if (notIgnoredTokenCheckCallback(tokens[i])){
      if (firstNotIgnoredTokenIndex !== null){
        console.log("Couldn't handle equation properly (not ignored tokens count > 1)");
        return null
      }
      
      firstNotIgnoredTokenIndex = i
    }
  }

  const calculationResult = tokens[firstNotIgnoredTokenIndex]
  console.log("Calculation finished. result:", calculationResult);
  return calculationResult.value
}

export const calculateSimpleEquation = (tokens, context = null) => {
  console.log("Started calculateSimpleEquation. parameter:", tokens, 
    "context:", context ? context : "[null]"
  )
  
  console.log("Recieved tokens to handle:", tokens)
  return calculateTokens(tokens, context)
}