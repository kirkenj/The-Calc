import { tokenTypeNames } from "./tokenTypes"
import { getItemIndexToTheLeftByCallback, getItemIndexToTheRightByCallback } from "./arrayUtils"

export const preHandleUnarFunction = (equation, index, notIgnoredTokenCheckCallback) => {
  if (isNaN(index)) {
    throw Error("ArgumentNull: index")
  }

  if (!equation || equation.length === 0) {
    throw Error("Invalid Argument: equation")
  }

  if (index < 0 || index >= equation.length) {
    throw Error("ArgumentOutOfRange: Invalid index")
  }

  if (!notIgnoredTokenCheckCallback || notIgnoredTokenCheckCallback.length < 1) {
    throw Error("InvalidArgument: notIgnoredTokenCheckCallback")
  }

  if (!(index >= 0 && index < equation.length - 1)) {
    return null
  }

  const notIgnoredTokenIndexToTheRight = getItemIndexToTheRightByCallback(equation, index, notIgnoredTokenCheckCallback)
  if (notIgnoredTokenIndexToTheRight === null) {
    return null
  }

  console.log("notIgnoredTokenIndexToTheRight:", notIgnoredTokenIndexToTheRight)
  return equation[index + 1].typeName === tokenTypeNames.Number
  ? {
      argumentIndexes: [notIgnoredTokenIndexToTheRight],
      operationStartIndex: index,
      operationLength: notIgnoredTokenIndexToTheRight - index + 1,
    }
  : null
}

export const preHandleBinarOperation = (equation, index, notIgnoredTokenCheckCallback) => {
  console.log("preHandleBinarOperation executed with arguments:", 
    "equation:", equation, 
    "index:",index, 
    "notIgnoredTokenCheckCallback:", notIgnoredTokenCheckCallback)

  if (isNaN(index)) {
    throw Error("ArgumentNull: index")
  }

  if (!equation || equation.length === 0) {
    throw Error("InvalidArgument: equation")
  }

  if (index < 0 || index >= equation.length) {
    throw Error("ArgumentOutOfRange: Invalid index")
  }

  if (!notIgnoredTokenCheckCallback || notIgnoredTokenCheckCallback.length < 1) {
    throw Error("InvalidArgument: notIgnoredTokenCheckCallback")
  }

  if (index < 1 || index >= equation.length - 1) {
    return null
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
    equation[notIgnoredTokenIndexToTheRight].typeName === tokenTypeNames.Number
    && equation[notIgnoredTokenIndexToTheLeft].typeName === tokenTypeNames.Number)
    ? valueToReturn
    : null
}