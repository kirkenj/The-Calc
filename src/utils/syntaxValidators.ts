import { tokenTypes } from "./Constants/Types/TokenTypes"
import { getItemIndexToTheLeftByCallback, getItemIndexToTheRightByCallback } from "./Extensions/arrayUtils"
import type { FunctionValidatorDelegate } from "./Models/EquationCalculation/FunctionValidatorDelegate"
import { Result } from "./Models/Core/Result"
import { ValidationErrors } from "./Constants/ValidationErrors"

export const validateUnarFunction: FunctionValidatorDelegate = (equation, index, notIgnoredTokenCheckCallback) => {
  if (equation.length === 0) {
    return Result.Fail(ValidationErrors.EquationEmpty)
  }

  if (index < 0 || index >= equation.length) {
    return Result.Fail(ValidationErrors.IndexOutOfRange)
  }

  if (!notIgnoredTokenCheckCallback || notIgnoredTokenCheckCallback.length < 1) {
    return Result.Fail(ValidationErrors.InvalidCallback)
  }

  const notIgnoredTokenIndexToTheRight = getItemIndexToTheRightByCallback(equation, index, notIgnoredTokenCheckCallback)
  if (notIgnoredTokenIndexToTheRight === null) {
    return Result.Fail(ValidationErrors.RightArgumentNotFound)
  }

  return tokenTypes.NumberTokenType.isInstance(equation[notIgnoredTokenIndexToTheRight]).success
    ? Result.Success({
      argumentIndexes: [notIgnoredTokenIndexToTheRight],
      operationStartIndex: index,
      operationLength: notIgnoredTokenIndexToTheRight - index + 1,
    })
    : Result.Fail(ValidationErrors.InvalidTokenTypes)
}
export const validateUnarMinus: FunctionValidatorDelegate = (equation, index, notIgnoredTokenCheckCallback) => {
  const rightArgumentValidationResult = validateUnarFunction(equation, index, notIgnoredTokenCheckCallback)
  if (!rightArgumentValidationResult.Success) {
    return rightArgumentValidationResult
  }

  const { argumentIndexes: [notIgnoredTokenIndexToTheRight] } = rightArgumentValidationResult.Result
  const notIgnoredTokenIndexToTheLeft = getItemIndexToTheLeftByCallback(equation, index, notIgnoredTokenCheckCallback)
  const notIgnoredTokenToTheLeft = notIgnoredTokenIndexToTheLeft === null ? null : equation[notIgnoredTokenIndexToTheLeft]
  return tokenTypes.NumberTokenType.isInstance(equation[notIgnoredTokenIndexToTheRight]).success
    && (notIgnoredTokenToTheLeft === null || !tokenTypes.NumberTokenType.isInstance(notIgnoredTokenToTheLeft).success)
    ? Result.Success({
      argumentIndexes: [notIgnoredTokenIndexToTheRight],
      operationStartIndex: index,
      operationLength: notIgnoredTokenIndexToTheRight - index + 1,
    })
    : Result.Fail(ValidationErrors.InvalidOperatorContext)
}
export const validateBinarOperation : FunctionValidatorDelegate = (equation, index, notIgnoredTokenCheckCallback) => {
  if (equation.length === 0) {
    return Result.Fail(ValidationErrors.EquationEmpty)
  }

  if (index < 1 || index >= equation.length) {
    return Result.Fail(ValidationErrors.IndexOutOfRange)
  }

  const notIgnoredTokenIndexToTheRight = getItemIndexToTheRightByCallback(equation, index, notIgnoredTokenCheckCallback)
  if (notIgnoredTokenIndexToTheRight === null) {
    return Result.Fail(ValidationErrors.RightArgumentNotFound)
  }

  const notIgnoredTokenIndexToTheLeft = getItemIndexToTheLeftByCallback(equation, index, notIgnoredTokenCheckCallback)
  if (notIgnoredTokenIndexToTheLeft === null) {
    return Result.Fail(ValidationErrors.LeftArgumentNotFound)
  }

  return (
    tokenTypes.NumberTokenType.isInstance(equation[notIgnoredTokenIndexToTheRight]).success
    && tokenTypes.NumberTokenType.isInstance(equation[notIgnoredTokenIndexToTheLeft]).success)
    ? Result.Success({
      argumentIndexes: [notIgnoredTokenIndexToTheLeft, notIgnoredTokenIndexToTheRight],
      operationStartIndex: notIgnoredTokenIndexToTheLeft,
      operationLength: notIgnoredTokenIndexToTheRight - notIgnoredTokenIndexToTheLeft + 1
    })
    : Result.Fail(ValidationErrors.InvalidTokenTypes)
}
