import { tokenTypeNames } from "./tokenTypes"

export const getOperatorsForVariables = (context) => {
    console.log("getOperatorsForVariables executed",
        "context:", context
    )
    
    if (!context) {
        console.log("!Context")
        return null
    }

    const size = context.size
    if (!size || size <= 0) {
        console.log("!keys || !size || size <= 0")
        return null
    }

    const preHandleVariable = (equation, index) => {
        const executedFunc = "preHandleVariable" 
        console.log(`${executedFunc} executed`,"equation:", equation, "index", index)
        if (isNaN(index)) {
            return null
        }

        if (index < 0 || index >= equation.length) {
            console.log(executedFunc,
                 "index < 0 || index >= equation.length")
            return null
        }

        const token = equation[index]
        if (token.typeName !== tokenTypeNames.Word) {
            console.log(executedFunc,
            "typeof key !== 'string'")
            return null
        }

        return context.has(token.value)
            ? {
                argumentIndexes: [index],
                operationStartIndex: index,
                operationLength: 1,
            }
            : null
    }

    const operators = new Map()
    for (let [variableName, variableValue] of context.entries()) {
        operators.set(variableName, (equation, prevalidationResult) => variableValue)
    }

    return {
        operators: operators,
        preHandler: preHandleVariable,
        fallIfPreHandleFailed: true
    }
}