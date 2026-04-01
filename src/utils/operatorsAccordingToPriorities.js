import { preHandleBinarOperation, preHandleUnarOperation, preHandleUnarFunction } from './preHandlersUtils'
import { handleDiff, handleDivision, handleSum, handleMultiplication, handleUnaryMinus, handleFunction } from './operationHandlersUtils'

export const operatorsAccordingToPriorities = [
  {
    "operators": {
      "sin": handleFunction,
    },
    "preHandler": preHandleUnarFunction
  },
  {
    "operators": {
      "-": handleUnaryMinus,
    },
    "preHandler": preHandleUnarOperation
  },
  {
    "operators": {
      "*": handleMultiplication,
      ":": handleDivision,
      "/": handleDivision,
      "\\": handleDivision,
    },
    "preHandler": preHandleBinarOperation
  },
  {
    "operators": {
      "+": handleSum,
      "-": handleDiff,
    },
    "preHandler": preHandleBinarOperation
  }
]