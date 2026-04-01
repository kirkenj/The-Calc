import { numberRestrictions, wordRestrictions } from './tokenTypesRestrictions'
import { parseToken } from './parseTokenUtil'

import { operatorsAccordingToPriorities } from './operatorsAccordingToPriorities'

export const getNumberAtIndex = (equation, index) => {
  if (isNaN(index)) {
    return null
  }

  if (index < 0 || index >= equation.length) {
    return null
  }

  const parseTokenResult = parseToken(equation,
    index,
    numberRestrictions.allowedSymbols)

  const number = parseFloat(parseTokenResult.result)

  if (number.toString() !== parseTokenResult.result) {
    throw Error(`Couldn't parse number properly at index ${index}`)
  }

  return {
    ...parseTokenResult,
    resultStr: parseTokenResult.result,
    result: number
  }
}

export const getWordAtIndex = (equation, index) => {
  if (isNaN(index)) {
    return null
  }

  if (index < 0 || index >= equation.length) {
    return null
  }

  const parseTokenResult = parseToken(equation,
    index,
    wordRestrictions.allowedSymbols)

  return {
    ...parseTokenResult,
    resultStr: parseTokenResult.result,
  }
}

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
    if (numberRestrictions.isNumberSymbol(arr[i])) {
      console.log("Found number at index", i, arr[i])
      const val = getNumberAtIndex(arr, i)
      arr.splice(val.absoluteStartIndex, val.resultStr.length, val.result)
      i = val.absoluteStartIndex
      console.log("Arr:", arr, "Index before inc:", i)
    }
    else if (wordRestrictions.isWordSymbol(arr[i])) {
      console.log("Found char at index", i, arr[i])
      const val = getWordAtIndex(arr, i)
      arr.splice(val.absoluteStartIndex, val.resultStr.length, val.result)
      i = val.absoluteStartIndex
      console.log("Arr:", arr, "Index before inc:", i)
    }
    else {
      console.log("skipped item at index", i, arr[i])
    }
  }

  console.log("Tokenization finished. result:", arr);
  return arr
}

export const calculateTokens = (tokens) => {
  if (tokens && tokens.length === 1 && typeof tokens[0] === 'number'){
    return tokens[0]
  }

  for (let k = 0; k < operatorsAccordingToPriorities.length; k++) {
    const currentOperatorsAccordingToPriorities = operatorsAccordingToPriorities[k]
    const currentOperatorsDict = currentOperatorsAccordingToPriorities.operators
    const currentOperatorsPreHandler = currentOperatorsAccordingToPriorities.preHandler

    console.log("Current key set", currentOperatorsDict,
      "Prevalidator", currentOperatorsPreHandler
    )

    for (let i = 0; i < tokens.length; i++) {
      if (typeof tokens[i] === 'number') {
        console.log("Skipped:", tokens[i], "index:", i);
        continue
      }

      const currentOperatorHandler = currentOperatorsDict[tokens[i]]
      if (!currentOperatorHandler) {
        console.log(`Handler not found for or not at current operators priority. operator: ${tokens[i]} at index ${i}`, tokens)
        continue
      }

      const prevalidationResult = currentOperatorsPreHandler(tokens, i)
      if (!prevalidationResult) {
        console.log(`Invalid syntax at index:${i}`)
        return
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


export const calculateSimpleEquation = (equation) => {
  console.log("Started calculateSimpleEquation. parameter:", equation)
  const tokens = tokenizeEquation(equation)
  console.log("Recieved tokens to handle:", tokens)
  return calculateTokens(tokens)
}