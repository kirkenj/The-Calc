import type { Token, ValueToken } from "./Models/Core/Token"
import type { PrevalidationResult } from "./Models/EquationCalculation/PrevalidationResult"
import { tokenTypes } from "./Types/TokenTypes"

const getTokensRangeViaPrevalidationResult = (
  equation: Token[],
  prevalidationResult: PrevalidationResult
): Token[] =>
  equation.slice(
    prevalidationResult.operationStartIndex,
    prevalidationResult.operationStartIndex + prevalidationResult.operationLength)

const handleUnarOperation = (
  equation: Token[],
  prevalidationResult: PrevalidationResult,
  handler: (arg: number) => number
): ValueToken<number> => {
  console.log("handleFunction", "equation", equation, "prevalidationResult", prevalidationResult, "handler:", handler)

  if (!handler || handler.length !== 1) {
    throw Error("Invalid handler")
  }

  if (!prevalidationResult || !equation
    || prevalidationResult.argumentIndexes.length !== 1
    || equation.length <= prevalidationResult.argumentIndexes[0]) {
    throw Error("Couldn't handle operation", { cause: { equation, prevalidationResult } })
  }

  const argument = equation[prevalidationResult.argumentIndexes[0]]

  console.log("Argument for handleFunc:", argument);

  if (!argument || argument.type !== tokenTypes.NumberTokenType || isNaN(argument.value)) {
    throw Error("Couldn't handle operation", { cause: { equation, prevalidationResult } })
  }

  const calculationResult = handler(argument.value)

  const fromSlice = getTokensRangeViaPrevalidationResult(equation, prevalidationResult)

  return {
    type: tokenTypes.NumberTokenType,
    value: calculationResult,
    initStringIndex: prevalidationResult.operationStartIndex,
    fromString: fromSlice.map(s => s.fromString).join("")
  }
}

const handleBinarOperation = (
  equation: Token[],
  prevalidationResult: PrevalidationResult,
  handler: (arg1: number, arg2: number) => number
): ValueToken<number> => {
  console.log("handleBinarOperation", "equation", equation, "prevalidationResult", prevalidationResult)

  if (!handler || handler.length !== 2) {
    throw Error("Invalid handler")
  }

  if (!prevalidationResult || !equation
    || prevalidationResult.argumentIndexes.length !== 2
    || equation.length <= prevalidationResult.argumentIndexes[1]) {
    throw Error("Invalid location of operator or arguments")
  }

  for (const index of prevalidationResult.argumentIndexes) {
    const argument = equation[index]
    if (!argument || argument.type !== tokenTypes.NumberTokenType || isNaN(argument.value)) {
      console.log("Couldn't handle operation", argument, prevalidationResult.argumentIndexes, index)
      throw Error("Invalid arguments")
    }
  }

  const leftArgumentIndex = prevalidationResult.argumentIndexes[0]
  const rightArgumentIndex = prevalidationResult.argumentIndexes[1]

  const calculationResult = handler(equation[leftArgumentIndex].value, equation[rightArgumentIndex].value)

  const fromSlice = getTokensRangeViaPrevalidationResult(equation, prevalidationResult)

  return {
    type: tokenTypes.NumberTokenType,
    value: calculationResult,
    initStringIndex: prevalidationResult.operationStartIndex,
    fromString: fromSlice.map(s => s.fromString).join("")
  }
}


type operationHandler = (equation: Token[], prevalidationResult: PrevalidationResult) => ValueToken<number>

export const handleMultiplication: operationHandler = (equation, prevalidationResult) => handleBinarOperation(equation, prevalidationResult, (a, b) => a * b)
export const handleDivision: operationHandler = (equation, prevalidationResult) => handleBinarOperation(equation, prevalidationResult, (a, b) => a / b)

export const handleSum: operationHandler = (equation, prevalidationResult) => handleBinarOperation(equation, prevalidationResult, (a, b) => a + b)
export const handleDiff: operationHandler = (equation, prevalidationResult) => handleBinarOperation(equation, prevalidationResult, (a, b) => a - b)

export const handleSin: operationHandler = (equation, prevalidationResult) => handleUnarOperation(equation, prevalidationResult, (a) => Math.sin(a))
export const handleUnaryMinus: operationHandler = (equation, prevalidationResult) => handleUnarOperation(equation, prevalidationResult, (a) => -a)