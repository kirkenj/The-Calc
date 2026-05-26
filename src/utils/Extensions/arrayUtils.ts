export function getIndexOfFirst<T>(
  equation: ArrayLike<T>,
  сheckCallback: (val: T) => boolean
): number | null {
  for (let i = 0; i < equation.length; i++) {
    if (сheckCallback(equation[i])) {
      return i
    }
  }

  return null
}

export function getItemIndexToTheRightByCallback<T>(
  equation: ArrayLike<T>,
  index: number,
  сheckCallback: (val: T) => boolean
): number | null {
  if (index < 0 || index >= equation.length) {
    throw Error("ArgumentOutOfRange: Invalid index")
  }

  for (let i = index + 1; i < equation.length; i++) {
    if (сheckCallback(equation[i])) {
      return i
    }
  }

  return null
}

export function getItemIndexToTheLeftByCallback<T>(
  equation: ArrayLike<T>,
  index: number,
  сheckCallback: (val: T) => boolean
): number | null {
  if (!equation || equation.length === 0) {
    throw Error("InvalidArgument: equation")
  }

  if (index < 0 || index >= equation.length) {
    throw Error("ArgumentOutOfRange: Invalid index")
  }

  for (let i = index - 1; i >= 0; i--) {
    if (сheckCallback(equation[i])) {
      return i
    }
  }

  return null
}