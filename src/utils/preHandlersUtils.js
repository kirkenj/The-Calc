import { tokenTypeNames } from "./tokenTypes"

const getNotIgnoredTokenIndexToTheRight = (equation, index, notIgnoredTokenCheckCallback) => {
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

  for (let i = index + 1; i < equation.length; i++) {
    if (notIgnoredTokenCheckCallback(equation[i])) {
      return i
    }
  }

  return null
}

const getNotIgnoredTokenIndexToTheLeft = (equation, index, notIgnoredTokenCheckCallback) => {
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

  for (let i = index - 1; i > 0; i--) {
    if (notIgnoredTokenCheckCallback(equation[i])) {
      return i
    }
  }

  return null
}


export const preHandleUnarFunction = (equation, index, notIgnoredTokenCheckCallback) => {
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

  if (!(index >= 0 && index < equation.length - 1)) {
    return null
  }

  const notIgnoredTokenIndexToTheRight = getNotIgnoredTokenIndexToTheRight(equation, index, notIgnoredTokenCheckCallback)
  if (!notIgnoredTokenIndexToTheRight) {
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

  const notIgnoredTokenIndexToTheRight = getNotIgnoredTokenIndexToTheRight(equation, index, notIgnoredTokenCheckCallback)
  if (!notIgnoredTokenIndexToTheRight) {
    return null
  }

  const notIgnoredTokenIndexToTheLeft = getNotIgnoredTokenIndexToTheLeft(equation, index, notIgnoredTokenCheckCallback)
  if (!notIgnoredTokenIndexToTheLeft) {
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
    index >= 1
    && index <= equation.length - 2
    && equation[notIgnoredTokenIndexToTheRight].typeName === tokenTypeNames.Number
    && equation[notIgnoredTokenIndexToTheLeft].typeName === tokenTypeNames.Number)
    ? valueToReturn
    : null
}


// export const preHandleUnarOperation = (equation, index) => {
//   if (isNaN(index)) {
//     return null
//   }

//   if (index < 0 || index >= equation.length) {
//     return null
//   }

//   const valueToReturn = {
//     argumentIndexes: [index + 1],
//     operationStartIndex: index,
//     operationLength: 2
//   }

//   console.log(
//     "eq", equation,
//     valueToReturn
//   );

//   return ((index >= 0 && index < equation.length - 1 && equation[index + 1].typeName === tokenTypeNames.Number)
//     && (index === 0 || equation[index - 1].typeName !== tokenTypeNames.Number))
//     ? valueToReturn
//     : null
// }