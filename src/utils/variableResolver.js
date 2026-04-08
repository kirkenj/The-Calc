import { tokenTypeNames } from "./tokenTypes"

export const getOperatorsForVariables = (context) => {
    console.log("getOperatorsForVariables executed",
        "context:", context
    )
    
    if (context === null) {
        console.log("Context is null")
        return null
    }

    const size = context.size
    if (!size || size <= 0) {
        console.log("Invalid context size")
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
        operators.set(variableName, () => variableValue)
    }

    console.log("Created variable map:", operators)

    return {
        operators: operators,
        syntaxValidator: preHandleVariable,
        fallIfSyntaxValidationFailed: true
    }
}