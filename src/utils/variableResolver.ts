import { tokenTypes } from "./Constants/Types/TokenTypes"
import type { Token } from "./Models/Core/Token"
import type { FunctionValidatorDelegate } from "./Models/EquationCalculation/FunctionValidatorDelegate"
import type { HandlerDelegate } from "./Models/EquationCalculation/HandleEquationrDelegate"
import type { OperatorsForPriorityConfiguration } from "./Models/EquationCalculation/OperatorsForPriorityConfiguration"

export const getOperatorsForVariables = (
    context: Map<string, Token> | null
): OperatorsForPriorityConfiguration | null => {
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

    const preHandleVariable: FunctionValidatorDelegate = (equation, index) => {
        const executedFunc = "preHandleVariable"
        console.log(`${executedFunc} executed`, "equation:", equation, "index", index)

        if (index < 0 || index >= equation.length) {
            console.log(executedFunc,
                "index < 0 || index >= equation.length")
            return null
        }

        const isWordCheckResult = tokenTypes.WordTokenType.isInstance(equation[index])
        if (!isWordCheckResult.success) {
            console.log(executedFunc,
                "typeof key !== 'string'")
            return null
        }

        return context.has(isWordCheckResult.result.value)
            ? {
                argumentIndexes: [index],
                operationStartIndex: index,
                operationLength: 1,
            }
            : null
    }

    const operators = new Map<string, HandlerDelegate>()
    for (const [variableName, variableValue] of context.entries()) {
        const isNumberCheckResult = tokenTypes.NumberTokenType.isInstance(variableValue)
        if (!isNumberCheckResult.success){
            console.log("Context value is not a NumberTokenTypeInstance")
            return null
        }
        
        operators.set(variableName, () => isNumberCheckResult.result)
    }

    return {
        operators: operators,
        syntaxValidator: preHandleVariable,
        fallIfSyntaxValidationFailed: true
    }
}