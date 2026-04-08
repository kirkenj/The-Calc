import { validateBinarOperation, validateUnarFunction, validateUnarMinus } from './syntaxValidators'
import { handleDiff, handleDivision, handleSum,handleMultiplication,handleUnaryMinus,handleSin } from './operationHandlersUtils'

export const getDefaultOperatorsAccordingToPriorities = () => [
  {
    operators: new Map([
      ["sin", handleSin]
    ]),
    syntaxValidator: validateUnarFunction,
    fallIfSyntaxValidationFailed: true
  },
  {
    operators: new Map([
      ["-", handleUnaryMinus]
    ]),
    syntaxValidator: validateUnarMinus,
    fallIfSyntaxValidationFailed: false
  },
  {
    operators: new Map([
      ["*", handleMultiplication],
      [":", handleDivision],
      ["/", handleDivision],
      ["\\", handleDivision]
    ]),
    syntaxValidator: validateBinarOperation,
    fallIfSyntaxValidationFailed: true
  },
  {
    operators: new Map([
      ["+", handleSum],
      ["-", handleDiff]
    ]),
    syntaxValidator: validateBinarOperation,
    fallIfSyntaxValidationFailed: true
  }
]

export const defaultDefinedNames = [...new Set(
  getDefaultOperatorsAccordingToPriorities().flatMap(item => Array.from(item.operators.keys()))
)]