import { isNumber } from './calculatorInputUtils'
import { getCurrentNumberString } from './getCurrenNumberUtil'

const handleMultiplication = (arg1, arg2) => arg1 * arg2
const handleDivision = (divisible, divisor) => divisible / divisor

const handleSum = (arg1, arg2) => arg1 + arg2
const handleDiff = (arg1, arg2) => arg1 - arg2

const operatorsAccordingToPriorities = [
  {
    "*": handleMultiplication,
    ":": handleDivision,
    "/": handleDivision
  },
  {
    "+": handleSum,
    "-": handleDiff
  }
]

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
      const val = getCurrentNumberString(arr, i)
      arr.splice(val.absoluteStartIndex, val.numberLength, val.number)
      i = val.absoluteStartIndex
    }
    else {
      console.log("skipped item at index", i, arr[i])
    }
  }

  console.log(arr)
  for (let k = 0; k < operatorsAccordingToPriorities.length; k++) {
    const currentOperatorsDict = operatorsAccordingToPriorities[k]
    console.log("Current key set", currentOperatorsDict)
    
    for (let i = 0; i < arr.length; i++){
      if (!isNaN(arr[i])){
        console.log("Skipped:", arr[i], "index:", i);
        continue
      }

      const currentOperatorHandler = currentOperatorsDict[arr[i]]
      if (!currentOperatorHandler){
        console.log(`Handler not found for or not at current operators priority. operator: ${arr[i]} at index ${i}`, arr)
        continue
      }

      const leftArgIndex = i - 1
      const leftArg = arr[leftArgIndex]
      const rightArgIndex = i + 1
      const rightArg = arr[rightArgIndex]
      const res = currentOperatorHandler(leftArg, rightArg)
      console.log(
        "leftArgIndex:", leftArgIndex,
        "leftArg:", leftArg,
        "rightArgIndex", rightArgIndex,
        "rightArg:", rightArg,
        "func:", currentOperatorHandler,
        "res:", res)
      const popped = arr.splice(leftArgIndex, 3, res)
      console.log("arr", arr, "popped", popped)
      i = leftArgIndex
    }
  }

  if (arr.length !== 1) {
    console.log("Couldn't handle equation properly (arr len != 1)");
    return null
  }

  console.log("Calculation finished. result:", arr[0]);
  return arr[0]
}