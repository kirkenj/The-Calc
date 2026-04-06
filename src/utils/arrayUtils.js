export const getIndexOfFirst = (equation, сheckCallback) => {
  if (!equation || equation.length === 0) {
    throw Error("InvalidArgument: equation")
  }

  if (!сheckCallback || сheckCallback.length < 1) {
    throw Error("InvalidArgument: сheckCallback")
  }

  for (let i = 0; i < equation.length; i++) {
    if (сheckCallback(equation[i])) {
      return i
    }
  }

  return null
}

export const getItemIndexToTheRightByCallback = (equation, index, сheckCallback) => {
  if (isNaN(index)) {
    throw Error("ArgumentNull: index")
  }

  if (!equation || equation.length === 0) {
    throw Error("InvalidArgument: equation")
  }

  if (index < 0 || index >= equation.length) {
    throw Error("ArgumentOutOfRange: Invalid index")
  }

  if (!сheckCallback || сheckCallback.length < 1) {
    throw Error("InvalidArgument: сheckCallback")
  }

  for (let i = index + 1; i < equation.length; i++) {
    if (сheckCallback(equation[i])) {
      return i
    }
  }

  return null
}

export const getItemIndexToTheLeftByCallback = (equation, index, сheckCallback) => {
  if (isNaN(index)) {
    throw Error("ArgumentNull: index")
  }

  if (!equation || equation.length === 0) {
    throw Error("InvalidArgument: equation")
  }

  if (index < 0 || index >= equation.length) {
    throw Error("ArgumentOutOfRange: Invalid index")
  }

  if (!сheckCallback || сheckCallback.length < 1) {
    throw Error("InvalidArgument: сheckCallback")
  }

  for (let i = index - 1; i >= 0; i--) {
    if (сheckCallback(equation[i])) {
      return i
    }
  }

  return null
}