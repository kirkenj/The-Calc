import { preHandleBinarOperation, preHandleUnarOperation, preHandleUnarFunction } from './preHandlersUtils'
import { handleDiff, handleDivision, handleSum, handleMultiplication, handleUnaryMinus, handleFunction } from './operationHandlersUtils'


export const operatorsAccordingToPriorities = [
  {
    operators: {
      "sin": handleFunction,
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

export const definedNames = () =>{
  //return new Set(operatorsAccordingToPriorities.map(o => o.operators))
  return operatorsAccordingToPriorities.map(o => o)
}