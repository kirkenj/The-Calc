import { preHandleBinarOperation, preHandleUnarOperation, preHandleUnarFunction } from './preHandlersUtils'
import { handleDiff, handleDivision, handleSum, handleMultiplication, handleUnaryMinus, handleSin } from './operationHandlersUtils'


export const getDefaultOperatorsAccordingToPriorities = () => [
  {
    operators: {
      "sin": handleSin,
    },
    preHandler: preHandleUnarFunction,
    fallIfPreHandleFailed: true
  },
  {
    operators: {
      "-": handleUnaryMinus,
    },
    preHandler: preHandleUnarOperation,
    fallIfPreHandleFailed: false
  },
  {
    operators: {
      "*": handleMultiplication,
      ":": handleDivision,
      "/": handleDivision,
      "\\": handleDivision,
    },
    preHandler: preHandleBinarOperation,
    fallIfPreHandleFailed: true
  },
  {
    operators: {
      "+": handleSum,
      "-": handleDiff,
    },
    preHandler: preHandleBinarOperation,
    fallIfPreHandleFailed: true
  }
]

export const defaultDefinedNames = getDefaultOperatorsAccordingToPriorities().map(o => o.operators).map(op => Object.keys(op)).flat()