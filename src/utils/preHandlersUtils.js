import {calculateTokens} from './calculateSimpleEquation'


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
  if (!argumentIsValid && equation[index + 1] && equation[index + 2]) {
    const eqToCalculate = [equation[index + 1], equation[index + 2]]
    console.log("Possible unar minus. Calculating tokens:", eqToCalculate);
    valueToReturn.unarMinusCalculationResult = calculateTokens(eqToCalculate)
    console.log("Calculation result for Possible unar minus:", valueToReturn.unarMinusCalculationResult);
    if (valueToReturn.unarMinusCalculationResult){
      valueToReturn.operationLength++
      argumentIsValid = true
    }    
  }

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