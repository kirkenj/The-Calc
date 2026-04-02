export const preHandleUnarFunction = (equation, index) => {
  if (isNaN(index)) {
    return null
  }

  if (index < 0 || index >= equation.length) {
    return null
  }

  const valueToReturn = {
    argumentIndexes: [index + 1],
    operationStartIndex: index,
    operationLength: 2,
    unarMinusCalculationResult: undefined
  }

  console.log(
    "eq", equation,
    valueToReturn
  );

  const operatorPlacedCorrectly = index >= 0 && index < equation.length - 1
  let argumentIsValid = typeof equation[index + 1] === 'number'

  return operatorPlacedCorrectly && argumentIsValid
    ? valueToReturn
    : null
}


export const preHandleUnarOperation = (equation, index) => {
  if (isNaN(index)) {
    return null
  }

  if (index < 0 || index >= equation.length) {
    return null
  }

  const valueToReturn = {
    argumentIndexes: [index + 1],
    operationStartIndex: index,
    operationLength: 2
  }

  console.log(
    "eq", equation,
    valueToReturn
  );

  return ((index >= 0 && index < equation.length - 1 && typeof equation[index + 1] === 'number')
    && (index === 0 || typeof equation[index - 1] !== 'number'))
    ? valueToReturn
    : null
}

export const preHandleBinarOperation = (equation, index) => {
  if (isNaN(index)) {
    return null
  }

  if (index < 1 || index >= equation.length - 1) {
    return null
  }

  const valueToReturn = {
    argumentIndexes: [index - 1, index + 1],
    operationStartIndex: index - 1,
    operationLength: 3
  }

  console.log(
    "eq", equation,
    valueToReturn
  );

  return (
    index >= 1
    && index <= equation.length - 2
    && typeof equation[index + 1] === 'number'
    && typeof equation[index - 1] === 'number')
    ? valueToReturn
    : null
}