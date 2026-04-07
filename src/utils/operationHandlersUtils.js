import { tokenTypeNames, createToken } from "./tokenTypes"

const getTokensRangeViaPrevalidationResult = (equation, prevalidationResult) => equation.slice(
    prevalidationResult.operationStartIndex,
    prevalidationResult.operationStartIndex + prevalidationResult.operationLength)

const handleUnarOperation = (equation, prevalidationResult, handler) => {
  console.log("handleFunction", "equation", equation, "prevalidationResult", prevalidationResult, "handler:", handler)

  if (!handler || handler.length !== 1) {
    throw Error("Invalid handler")
  }

  if (!prevalidationResult || !equation
    || prevalidationResult.argumentIndexes.length !== 1
    || equation.length <= prevalidationResult.argumentIndexes[0]) {
    throw Error("Couldn't handle operation", { equation, prevalidationResult })
  }

  const argument = equation[prevalidationResult.argumentIndexes[0]]

  console.log("Argument for handleFunc:", argument);

  if (!argument || argument.typeName !== tokenTypeNames.Number) {
    throw Error("Couldn't handle operation", { equation, prevalidationResult })
  }

  const calculationResult = handler(argument.value)

  const fromSlice = getTokensRangeViaPrevalidationResult(equation, prevalidationResult)

  return createToken(
    tokenTypeNames.Number,
    calculationResult,
    prevalidationResult.operationStartIndex,
    fromSlice.map(s => s.fromSlice).join(""))
}

const handleBinarOperation = (equation, prevalidationResult, handler) => {
  console.log("handleBinarOperation", "equation", equation, "prevalidationResult", prevalidationResult)

  if (!handler || handler.length !== 2) {
    throw Error("Invalid handler")
  }

  if (!prevalidationResult || !equation
    || prevalidationResult.argumentIndexes.length !== 2
    || equation.length <= prevalidationResult.argumentIndexes[1]) {
    throw Error("Invalid location of operator or arguments")
  }

  for (const index of prevalidationResult.argumentIndexes) {
    const argument = equation[index]
    if (!argument || argument.typeName !== tokenTypeNames.Number) {
      console.log("Couldn't handle operation", argument, prevalidationResult.argumentIndexes, index)
      throw Error("Invalid arguments")
    }
  }

  const leftArgumentIndex = prevalidationResult.argumentIndexes[0]
  const rightArgumentIndex = prevalidationResult.argumentIndexes[1]

  const calculationResult = handler(equation[leftArgumentIndex].value, equation[rightArgumentIndex].value)

  const fromSlice = getTokensRangeViaPrevalidationResult(equation, prevalidationResult)
  
  return createToken(
    tokenTypeNames.Number,
    calculationResult,
    prevalidationResult.operationStartIndex,
    fromSlice.map(s => s.fromSlice).join(""))
}

export const handleMultiplication = (equation, prevalidationResult) => handleBinarOperation(equation, prevalidationResult, (a, b) => a * b)
export const handleDivision = (equation, prevalidationResult) => handleBinarOperation(equation, prevalidationResult, (a, b) => a / b)

export const handleSum = (equation, prevalidationResult) => handleBinarOperation(equation, prevalidationResult, (a, b) => a + b)
export const handleDiff = (equation, prevalidationResult) => handleBinarOperation(equation, prevalidationResult, (a, b) => a - b)

export const handleSin = (equation, prevalidationResult) => handleUnarOperation(equation, prevalidationResult, (a) => Math.sin(a))
export const handleUnaryMinus = (equation, prevalidationResult) => handleUnarOperation(equation, prevalidationResult, (a) => -a)