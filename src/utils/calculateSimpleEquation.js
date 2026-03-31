import { isNumber } from './calculatorInputUtils'
import { parseToken } from './parseTokenUtil'

const handleUnaryMinus = (equation, prevalidationResult) => {
  if (!prevalidationResult || !equation
    || prevalidationResult.argumentIndexes.length !== 1
    || equation.length <= prevalidationResult.argumentIndexes[0]) {
    throw Error("Couldn't handle operation", { equation, prevalidationResult })
  }

  const argument = equation[prevalidationResult.argumentIndexes[0]]
  if (!argument || typeof (argument) !== 'number') {
    throw Error("Couldn't handle operation", { equation, prevalidationResult })
  }

  return -argument
}

const handleBinarOperation = (equation, prevalidationResult, handler) => {
  if (!handler || handler.length != 2){
    throw Error("Invalid handler")
  }

  if (!prevalidationResult || !equation
    || prevalidationResult.argumentIndexes.length !== 2
    || equation.length <= prevalidationResult.argumentIndexes[1]) {
    throw Error("Invalid location of operator or arguments")
    
  }

  for (const index of prevalidationResult.argumentIndexes) {
    const argument = equation[index]
    if (!argument || typeof (argument) !== 'number') {
      console.log("Couldn't handle operation", argument, prevalidationResult.argumentIndexes, index)
      throw Error("Invalid arguments")
    }
  }
  
  return handler(
    equation[prevalidationResult.argumentIndexes[0]], 
    equation[prevalidationResult.argumentIndexes[1]])
}

const handleMultiplication = (equation, prevalidationResult) => handleBinarOperation(equation, prevalidationResult, (a, b) => a * b)

const handleDivision = (equation, prevalidationResult) => handleBinarOperation(equation, prevalidationResult, (a, b) => a / b)

const handleSum = (equation, prevalidationResult) => handleBinarOperation(equation, prevalidationResult, (a, b) => a + b)

const handleDiff = (equation, prevalidationResult) => handleBinarOperation(equation, prevalidationResult, (a, b) => a - b)
  
const prevalidateUnarOperation = (equation, index) => {
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

const prevalidateBinarOperation = (equation, index) => {
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

const operatorsAccordingToPriorities = [
  {
    "operators": {
      "-": handleUnaryMinus,
    },
    "prevalidation": prevalidateUnarOperation
  },
  {
    "operators": {
      "*": handleMultiplication,
      ":": handleDivision,
      "/": handleDivision,
      "\\": handleDivision,
    },
    "prevalidation": prevalidateBinarOperation
  },
  {
    "operators": {
      "+": handleSum,
      "-": handleDiff,
    },
    "prevalidation": prevalidateBinarOperation
  }
]

export const getNumberAtIndex = (equation, index) => {
  if (isNaN(index)) {
    return null
  }

  if (index < 0 || index >= equation.length) {
    return null
  }

  const numberElements = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']

  const parseTokenResult = parseToken(equation, index, numberElements)

  const number = parseFloat(parseTokenResult.result)

  if (number.toString() !== parseTokenResult.result) {
    throw Error(`Couldn't parse number properly at index ${index}`)
  }

  return {
    ...parseTokenResult,
    resultStr: parseTokenResult.result,
    result: number
  }
}

export const calculateSimpleEquation = (equation) => {
  console.log("Started calculateSimpleEquation. parameter:", equation)

  if (equation[0] === '(' && equation[equation.length - 1] === ')') {
    equation = equation.slice(1, equation.length - 1)
    console.log("Found brackets on each end of the parameter. removed. result:", equation)
  }

  let arr = Array.from(equation)

  for (let i = 0; i < arr.length; i++) {
    if (isNumber(arr[i])) {
      console.log("Found number at index", i, arr[i])
      const val = getNumberAtIndex(arr, i)
      arr.splice(val.absoluteStartIndex, val.resultStr.length, val.result)
      i = val.absoluteStartIndex
      console.log("Arr:", arr, "Index before inc:", i)
    }
    else {
      console.log("skipped item at index", i, arr[i])
    }
  }

  console.log(arr)

  for (let k = 0; k < operatorsAccordingToPriorities.length; k++) {

    const currentOperatorsAccordingToPriorities = operatorsAccordingToPriorities[k]
    const currentOperatorsDict = currentOperatorsAccordingToPriorities.operators
    const currentOperatorsPrevalidator = currentOperatorsAccordingToPriorities.prevalidation

    console.log("Current key set", currentOperatorsDict,
      "Prevalidator", currentOperatorsPrevalidator
    )

    for (let i = 0; i < arr.length; i++) {
      if (typeof arr[i] === 'number') {
        console.log("Skipped:", arr[i], "index:", i);
        continue
      }

      const currentOperatorHandler = currentOperatorsDict[arr[i]]
      if (!currentOperatorHandler) {
        console.log(`Handler not found for or not at current operators priority. operator: ${arr[i]} at index ${i}`, arr)
        continue
      }

      const prevalidationResult = currentOperatorsPrevalidator(arr, i)
      if (!prevalidationResult) {
        console.log("Prevalidation failed at index:", i)
        continue
      }

      const res = currentOperatorHandler(arr, prevalidationResult)
      console.log(
        "prevalidationResult:", prevalidationResult,
        "func:", currentOperatorHandler,
        "res:", res)

      console.log("arr", arr)

      const popped = arr.splice(
        prevalidationResult.operationStartIndex,
        prevalidationResult.operationLength,
        res)

      console.log("arr", arr, "popped", popped)
      i = prevalidationResult.operationStartIndex
    }
  }

  if (arr.length !== 1) {
    console.log("Couldn't handle equation properly (arr len != 1)");
    return null
  }

  console.log("Calculation finished. result:", arr[0]);
  return arr[0]
}