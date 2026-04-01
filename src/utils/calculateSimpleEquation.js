import { operatorsAccordingToPriorities } from './operatorsAccordingToPriorities'
import { tokenTypes } from './tokenTypes'

export const tokenizeEquation = (equation) => {
  if (!equation
    || typeof equation !== 'string'
    || equation.length === 0) {
    throw Error("Invalid argument")
  }

  console.log("Started tokenization for equation:", equation);

  if (equation[0] === '(' && equation[equation.length - 1] === ')') {
    equation = equation.slice(1, equation.length - 1)
    console.log("Found brackets on each end of the parameter. removed. result:", equation)
  }

  let arr = Array.from(equation)

  for (let i = 0; i < arr.length; i++) {
    let tokenizerTriggered = false
    for (const ttype of tokenTypes) {
      tokenizerTriggered = ttype.checkDelegate(arr[i])
      if (!tokenizerTriggered) {
        continue
      }

      console.log(`Found ${ttype.name} at index`, i, arr[i])
      const val = ttype.tokenizer(arr, i)
      arr.splice(val.absoluteStartIndex, val.resultStr.length, val.result)
      i = val.absoluteStartIndex
      console.log("Arr:", arr, "Index before inc:", i)
    }

    if (!tokenizerTriggered) {
      console.log("skipped item at index", i, arr[i])
    }
  }

  console.log("Tokenization finished. result:", arr);
  return arr
}

export const calculateTokens = (tokens) => {
  if (tokens && tokens.length === 1 && typeof tokens[0] === 'number') {
    return tokens[0]
  }

  for (let k = 0; k < operatorsAccordingToPriorities.length; k++) {
    const operatorsToPriority = operatorsAccordingToPriorities[k]

    console.log("Current operators to handle", operatorsToPriority,
      "Prevalidator", operatorsToPriority.operators
    )

    for (let i = 0; i < tokens.length; i++) {
      if (typeof tokens[i] === 'number') {
        console.log("Skipped:", tokens[i], "index:", i);
        continue
      }

      const currentOperatorHandler = operatorsToPriority.operators[tokens[i]]
      if (!currentOperatorHandler) {
        console.log(`Handler not found or not at current operators priority. operator: ${tokens[i]} at index ${i}`, tokens)
        continue
      }

      const prevalidationResult = operatorsToPriority.preHandler(tokens, i)
      console.log("prevalidationResult", prevalidationResult, "fallIfPreHandleFailed", operatorsToPriority.fallIfPreHandleFailed);

      if (!prevalidationResult) {
        if (operatorsToPriority.fallIfPreHandleFailed) {
          console.log(`Invalid syntax at index:${i}`)
          return
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

      console.log("arr", tokens)

      const popped = tokens.splice(
        prevalidationResult.operationStartIndex,
        prevalidationResult.operationLength,
        res)

      console.log("arr", tokens, "popped", popped)
      i = prevalidationResult.operationStartIndex
    }
  }

  if (tokens.length !== 1 && typeof tokens[0] !== 'number') {
    console.log("Couldn't handle equation properly (arr len != 1)");
    return null
  }

  console.log("Calculation finished. result:", tokens[0]);
  return tokens[0]
}

export const calculateSimpleEquation = (equation, isTokenized = false) => {
  console.log("Started calculateSimpleEquation. parameter:", equation, "isTokenized:", isTokenized)
  const tokens = isTokenized
    ? equation
    : tokenizeEquation(equation)

  console.log("Recieved tokens to handle:", tokens)
  return calculateTokens(tokens)
}