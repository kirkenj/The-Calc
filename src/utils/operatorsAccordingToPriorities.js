import { preHandleBinarOperation, preHandleUnarFunction } from './preHandlersUtils'
import { handleDiff, handleDivision, handleSum,handleMultiplication,handleUnaryMinus,handleSin } from './operationHandlersUtils'

export const getDefaultOperatorsAccordingToPriorities = () => [
  {
    operators: new Map([
      ["sin", handleSin]
    ]),
    preHandler: preHandleUnarFunction,
    fallIfPreHandleFailed: true
  },
  {
    operators: new Map([
      ["-", handleUnaryMinus]
    ]),
    preHandler: preHandleUnarFunction,
    fallIfPreHandleFailed: false
  },
  {
    operators: new Map([
      ["*", handleMultiplication],
      [":", handleDivision],
      ["/", handleDivision],
      ["\\", handleDivision]
    ]),
    preHandler: preHandleBinarOperation,
    fallIfPreHandleFailed: true
  },
  {
    operators: new Map([
      ["+", handleSum],
      ["-", handleDiff]
    ]),
    preHandler: preHandleBinarOperation,
    fallIfPreHandleFailed: true
  }
]

export const defaultDefinedNames = [...new Set(
  getDefaultOperatorsAccordingToPriorities().flatMap(item => Array.from(item.operators.keys()))
)]