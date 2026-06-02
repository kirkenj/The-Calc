import { tokenTypes } from "./Constants/Types/TokenTypes"
import type { Token, ValueToken } from "./Models/Core/Token"
import type { PrevalidationResult } from "./Models/EquationCalculation/PrevalidationResult"

export const getTokensRangeViaPrevalidationResult = (
  equation: Token[],
  prevalidationResult: PrevalidationResult
): Token[] =>
  equation.slice(
    prevalidationResult.operationStartIndex,
    prevalidationResult.operationStartIndex + prevalidationResult.operationLength)

export const handleUnarOperation = (
  equation: Token[],
  prevalidationResult: PrevalidationResult,
  handler: (arg: number) => number
): ValueToken<number> => {
  console.log("handleFunction", "equation", equation, "prevalidationResult", prevalidationResult, "handler:", handler)

  if (!prevalidationResult || !equation
    || prevalidationResult.argumentIndexes.length !== 1
    || equation.length <= prevalidationResult.argumentIndexes[0]) {
    throw Error("Couldn't handle operation", { cause: { equation, prevalidationResult } })
  }

  const argument = equation[prevalidationResult.argumentIndexes[0]]

  console.log("Argument for handleFunc:", argument);

  if (!argument) {
    throw Error("Couldn't handle operation", { cause: { equation, prevalidationResult } })
  }

  const isInstanceResult = tokenTypes.NumberTokenType.isInstance(argument)
  if (!isInstanceResult.success) {
    throw Error("Couldn't handle operation", { cause: { equation, prevalidationResult } })
  }

  const calculationResult = handler(isInstanceResult.result.value)

  const fromSlice = getTokensRangeViaPrevalidationResult(equation, prevalidationResult)

  return {
    type: tokenTypes.NumberTokenType,
    value: calculationResult,
    initStringIndex: prevalidationResult.operationStartIndex,
    fromString: fromSlice.map(s => s.fromString).join("")
  }
}

export const handleBinarOperation = (
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

  const argsAsValueTokens: ValueToken<number>[] = []
  for (const index of prevalidationResult.argumentIndexes) {
    const argument = equation[index]

    if (!argument) {
      console.log("Couldn't handle operation", argument, prevalidationResult.argumentIndexes, index)
      throw Error("Invalid arguments")
    }

    const isInstanceResult = tokenTypes.NumberTokenType.isInstance(argument)
    if (!isInstanceResult.success) {
      console.log("Couldn't handle operation", argument, prevalidationResult.argumentIndexes, index)
      throw Error("Invalid arguments")
    }

    argsAsValueTokens.push(isInstanceResult.result)
  }

  const calculationResult = handler(argsAsValueTokens[0].value, argsAsValueTokens[1].value)

  const fromSlice = getTokensRangeViaPrevalidationResult(equation, prevalidationResult)

  return {
    type: tokenTypes.NumberTokenType,
    value: calculationResult,
    initStringIndex: prevalidationResult.operationStartIndex,
    fromString: fromSlice.map(s => s.fromString).join("")
  }
}