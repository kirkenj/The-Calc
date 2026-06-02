import { validateBinarOperation, validateUnarFunction, validateUnarMinus } from './syntaxValidators'
import type { HandlerDelegate } from './Models/EquationCalculation/HandleEquationrDelegate'
import type { OperationHandlerDelegate } from './Models/EquationCalculation/OperationHandlerDelegate'
import { handleBinarOperation, handleUnarOperation } from './operationHandlersUtils'
import type { OperatorsForPriorityConfiguration } from './Models/EquationCalculation/OperatorsForPriorityConfiguration'


export const getDefaultOperatorsAccordingToPriorities: () => OperatorsForPriorityConfiguration[] = () => [
  {
    operators: new Map<string, HandlerDelegate>([
      ["sin", handleSin]
    ]),
    syntaxValidator: validateUnarFunction,
    fallIfSyntaxValidationFailed: true
  },
  {
    operators: new Map<string, HandlerDelegate>([
      ["-", handleUnaryMinus]
    ]),
    syntaxValidator: validateUnarMinus,
    fallIfSyntaxValidationFailed: false
  },
  {
    operators: new Map<string, HandlerDelegate>([
      ["*", handleMultiplication],
      [":", handleDivision],
      ["/", handleDivision],
      ["\\", handleDivision]
    ]),
    syntaxValidator: validateBinarOperation,
    fallIfSyntaxValidationFailed: true
  },
  {
    operators: new Map<string, HandlerDelegate>([
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


const handleMultiplication: OperationHandlerDelegate = (equation, prevalidationResult) => handleBinarOperation(equation, prevalidationResult, (a, b) => a * b)
const handleDivision: OperationHandlerDelegate = (equation, prevalidationResult) => handleBinarOperation(equation, prevalidationResult, (a, b) => a / b)

const handleSum: OperationHandlerDelegate = (equation, prevalidationResult) => handleBinarOperation(equation, prevalidationResult, (a, b) => a + b)
const handleDiff: OperationHandlerDelegate = (equation, prevalidationResult) => handleBinarOperation(equation, prevalidationResult, (a, b) => a - b)

const handleSin: OperationHandlerDelegate = (equation, prevalidationResult) => handleUnarOperation(equation, prevalidationResult, (a) => Math.sin(a))
const handleUnaryMinus: OperationHandlerDelegate = (equation, prevalidationResult) => handleUnarOperation(equation, prevalidationResult, (a) => -a)