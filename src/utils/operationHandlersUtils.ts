import { tokenTypes } from "./Constants/Types/TokenTypes"
import { Result } from "./Models/Core/Result"
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
): Result<ValueToken<number>> => {
  if (!prevalidationResult || !equation
    || prevalidationResult.argumentIndexes.length !== 1
    || equation.length <= prevalidationResult.argumentIndexes[0]) {
    return Result.Fail("Couldn't handle unary operation: invalid prevalidation result or equation")
  }

  const argument = equation[prevalidationResult.argumentIndexes[0]]
  if (!argument) {
    return Result.Fail("Couldn't handle unary operation: argument not found")
  }

  const isInstanceResult = tokenTypes.NumberTokenType.isInstance(argument)
  if (!isInstanceResult.success) {
    return Result.Fail("Couldn't handle unary operation: argument is not a number token")
  }

  const calculationResult = handler(isInstanceResult.result.value)
  const fromSlice = getTokensRangeViaPrevalidationResult(equation, prevalidationResult)

  return Result.Success({
    type: tokenTypes.NumberTokenType,
    value: calculationResult,
    initStringIndex: prevalidationResult.operationStartIndex,
    fromString: fromSlice.map(s => s.fromString).join("")
  })
}

export const handleBinarOperation = (
  equation: Token[],
  prevalidationResult: PrevalidationResult,
  handler: (arg1: number, arg2: number) => number
): Result<ValueToken<number>> => {
  if (!handler || handler.length !== 2) {
    return Result.Fail("Invalid binary handler")
  }

  if (!prevalidationResult || !equation
    || prevalidationResult.argumentIndexes.length !== 2
    || equation.length <= prevalidationResult.argumentIndexes[1]) {
    return Result.Fail("Invalid location of operator or arguments")
  }

  const argsAsValueTokens: ValueToken<number>[] = []
  for (const index of prevalidationResult.argumentIndexes) {
    const argument = equation[index]

    if (!argument) {
      return Result.Fail("Invalid arguments: argument not found")
    }

    const isInstanceResult = tokenTypes.NumberTokenType.isInstance(argument)
    if (!isInstanceResult.success) {
      return Result.Fail("Invalid arguments: argument is not a number token")
    }

    argsAsValueTokens.push(isInstanceResult.result)
  }

  const calculationResult = handler(argsAsValueTokens[0].value, argsAsValueTokens[1].value)
  const fromSlice = getTokensRangeViaPrevalidationResult(equation, prevalidationResult)

  return Result.Success({
    type: tokenTypes.NumberTokenType,
    value: calculationResult,
    initStringIndex: prevalidationResult.operationStartIndex,
    fromString: fromSlice.map(s => s.fromString).join("")
  })
}
