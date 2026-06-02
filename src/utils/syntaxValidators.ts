import { tokenTypes } from "./Constants/Types/TokenTypes"
import { getItemIndexToTheLeftByCallback, getItemIndexToTheRightByCallback } from "./Extensions/arrayUtils"
import type { FunctionValidatorDelegate } from "./Models/EquationCalculation/FunctionValidatorDelegate"
import type { PrevalidationResult } from "./Models/EquationCalculation/PrevalidationResult"

export const validateUnarFunction: FunctionValidatorDelegate = (equation, index, notIgnoredTokenCheckCallback): PrevalidationResult | null => {
  if (equation.length === 0) {
    throw Error("Invalid Argument: equation")
  }

  if (index < 0 || index >= equation.length) {
    throw Error("ArgumentOutOfRange: Invalid index")
  }

  if (!notIgnoredTokenCheckCallback || notIgnoredTokenCheckCallback.length < 1) {
    throw Error("InvalidArgument: notIgnoredTokenCheckCallback")
  }

  const notIgnoredTokenIndexToTheRight = getItemIndexToTheRightByCallback(equation, index, notIgnoredTokenCheckCallback)
  if (notIgnoredTokenIndexToTheRight === null) {
    return null
  }

  console.log("notIgnoredTokenIndexToTheRight:", notIgnoredTokenIndexToTheRight)
  return equation[notIgnoredTokenIndexToTheRight].type === tokenTypes.NumberTokenType
    ? {
      argumentIndexes: [notIgnoredTokenIndexToTheRight],
      operationStartIndex: index,
      operationLength: notIgnoredTokenIndexToTheRight - index + 1,
    }
    : null
}

export const validateUnarMinus: FunctionValidatorDelegate = (equation, index, notIgnoredTokenCheckCallback): PrevalidationResult | null => {
  const rightArgumentValidationResult = validateUnarFunction(equation, index, notIgnoredTokenCheckCallback)
  if (rightArgumentValidationResult === null) {
    return null
  }

  const notIgnoredTokenIndexToTheRight = rightArgumentValidationResult.argumentIndexes[0]
  const notIgnoredTokenIndexToTheLeft = getItemIndexToTheLeftByCallback(equation, index, notIgnoredTokenCheckCallback)
  const notIgnoredTokenToTheLeft = notIgnoredTokenIndexToTheLeft === null ? null : equation[notIgnoredTokenIndexToTheLeft]
  console.log(
    "notIgnoredTokenIndexToTheLeft:", notIgnoredTokenIndexToTheLeft,
    "notIgnoredTokenToTheLeft:", notIgnoredTokenToTheLeft,
    "notIgnoredTokenIndexToTheRight:", notIgnoredTokenIndexToTheRight,
  )

  return equation[notIgnoredTokenIndexToTheRight].type === tokenTypes.NumberTokenType
    && (notIgnoredTokenToTheLeft === null || notIgnoredTokenToTheLeft.type !== tokenTypes.NumberTokenType)
    ? {
      argumentIndexes: [notIgnoredTokenIndexToTheRight],
      operationStartIndex: index,
      operationLength: notIgnoredTokenIndexToTheRight - index + 1,
    }
    : null
}

export const validateBinarOperation : FunctionValidatorDelegate = (equation, index, notIgnoredTokenCheckCallback): PrevalidationResult | null => {
  console.log("preHandleBinarOperation executed with arguments:",
    "equation:", equation,
    "index:", index,
    "notIgnoredTokenCheckCallback:", notIgnoredTokenCheckCallback)


  if (equation.length === 0) {
    throw Error("InvalidArgument: equation")
  }

  if (index < 1 || index >= equation.length) {
    throw Error("ArgumentOutOfRange: Invalid index")
  }

  const notIgnoredTokenIndexToTheRight = getItemIndexToTheRightByCallback(equation, index, notIgnoredTokenCheckCallback)
  console.log("notIgnoredTokenIndexToTheRight:", notIgnoredTokenIndexToTheRight);
  if (notIgnoredTokenIndexToTheRight === null) {
    return null
  }

  const notIgnoredTokenIndexToTheLeft = getItemIndexToTheLeftByCallback(equation, index, notIgnoredTokenCheckCallback)
  console.log("notIgnoredTokenIndexToTheLeft:", notIgnoredTokenIndexToTheLeft);
  if (notIgnoredTokenIndexToTheLeft === null) {
    return null
  }

  console.log(
    "notIgnoredTokenIndexToTheLeft:", notIgnoredTokenIndexToTheLeft,
    "notIgnoredTokenIndexToTheRight:", notIgnoredTokenIndexToTheRight,
  )

  const valueToReturn = {
    argumentIndexes: [notIgnoredTokenIndexToTheLeft, notIgnoredTokenIndexToTheRight],
    operationStartIndex: notIgnoredTokenIndexToTheLeft,
    operationLength: notIgnoredTokenIndexToTheRight - notIgnoredTokenIndexToTheLeft + 1
  }

  console.log(
    "eq", equation,
    valueToReturn
  );

  return (
    equation[notIgnoredTokenIndexToTheRight].type === tokenTypes.NumberTokenType
    && equation[notIgnoredTokenIndexToTheLeft].type === tokenTypes.NumberTokenType)
    ? valueToReturn
    : null
}