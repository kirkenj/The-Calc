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

        const key = equation[index]
        if (typeof key !== 'string') {
            console.log(executedFunc,
            "typeof key !== 'string'")
            return null
        }

        return context.has(key)
            ? {
                argumentIndexes: [index],
                operationStartIndex: index,
                operationLength: 1,
            }
            : null
    }

    const operators = {}
    for (let [key, value] of context.entries()) {
        operators[key] = () => value
    }

    return {
        operators: operators,
        preHandler: preHandleVariable,
        fallIfPreHandleFailed: true
    }
}