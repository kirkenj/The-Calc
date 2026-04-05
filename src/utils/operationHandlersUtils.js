import { tokenTypeNames } from "./tokenTypes"

const handleFunction = (equation, prevalidationResult, handler) => {
  console.log("handleFunction", "equation", equation, "prevalidationResult", prevalidationResult, "handler:", handler)
  
  if (!handler || handler.length !== 1) {
    throw Error("Invalid handler")
  }

  if (!prevalidationResult || !equation
    || prevalidationResult.argumentIndexes.length !== 1
    || equation.length <= prevalidationResult.argumentIndexes[0]) {
    throw Error("Couldn't handle operation", { equation, prevalidationResult })
  }

  const argument = equation[prevalidationResult.argumentIndexes[0]].value

  console.log("Argument for handleFunc:", argument);
  
  if (!argument || argument.typeName !== tokenTypeNames.Number) {
    throw Error("Couldn't handle operation", { equation, prevalidationResult })
  }

  return handler(argument)
}

export const handleUnaryMinus = (equation, prevalidationResult) => {
  console.log("handleUnaryMinus", "equation", equation, "prevalidationResult", prevalidationResult)
  
  const prevalidationResultIsNull = !prevalidationResult 
  const equationIsNull = !equation 

  if (prevalidationResultIsNull || equationIsNull
    || prevalidationResult.argumentIndexes.length !== 1
    || equation.length <= prevalidationResult.argumentIndexes[0]) {
    
      console.log("prevalidationResultIsNull:", prevalidationResultIsNull, "equationIsNull:", equationIsNull)
      throw Error("Couldn't handle operation", { equation, prevalidationResult })
  }

  let argument = equation[prevalidationResult.argumentIndexes[0]].value
  if (!argument || argument.typeName !== tokenTypeNames.Number) {
    throw Error("Couldn't get argument for operation", { equation, prevalidationResult })
  }

  argument = -argument
  console.log("Finished unary minus. result:", argument)
  return argument
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

  return handler(
    equation[prevalidationResult.argumentIndexes[0]].value,
    equation[prevalidationResult.argumentIndexes[1]].value)
}

export const handleMultiplication = (equation, prevalidationResult) => handleBinarOperation(equation, prevalidationResult, (a, b) => a * b)
export const handleDivision = (equation, prevalidationResult) => handleBinarOperation(equation, prevalidationResult, (a, b) => a / b)

export const handleSum = (equation, prevalidationResult) => handleBinarOperation(equation, prevalidationResult, (a, b) => a + b)
export const handleDiff = (equation, prevalidationResult) => handleBinarOperation(equation, prevalidationResult, (a, b) => a - b)

export const handleSin = (equation, prevalidationResult) => handleFunction(equation, prevalidationResult, (a) => Math.sin(a))