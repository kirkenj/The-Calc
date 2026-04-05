import { numberRestrictions } from './tokenTypesRestrictions'

export const getTokenStringAtIndex = (equation, index, symbolMembershipCheckCallback, maxLength = null) => {
    console.log("getTokenStringAtIndex executed with arguments:", "equation",equation, "index", index, "symbolMembershipCheckCallback", symbolMembershipCheckCallback, "maxLength", maxLength === null ? "[null]" : maxLength)
    
    if (isNaN(index)) {
        throw Error("ArgumentNull: index")
    }

    if (!equation || equation.length === 0) {
        throw Error("InvalidArgument: equation")
    }

    if (index < 0 || index >= equation.length) {
        throw Error("ArgumentOutOfRange: Invalid index")
    }

    if (!symbolMembershipCheckCallback || symbolMembershipCheckCallback.length < 1) {
        throw Error("InvalidArgument: callback")
    }

    if (maxLength !== null && typeof maxLength !== 'number' && maxLength <= 0){
        throw Error("InvalidArgument: maxLength")
    }

    let leftIndex = index
    let rightIndex = index
    let moveRight = true
    let moveLeft = true
    let edgeRight = false

    if (!symbolMembershipCheckCallback(equation[index])) {
        if (index > 0 && symbolMembershipCheckCallback(equation[index - 1])) {
            index--;
            leftIndex = index;
            rightIndex = index;
            edgeRight = true;
        }
        else if (index < equation.length - 1 && symbolMembershipCheckCallback(equation[index + 1])) {
            index++;
            leftIndex = index;
            rightIndex = index;
        }
        else {
            return { number: "", absoluteStartIndex: index, relativeCaretIndex: 0 };
        }
    }

    do {
        if (moveLeft) {
            const leftIndexToCheck = leftIndex - 1
            const leftSymbolToCheck = leftIndexToCheck >= 0
                ? equation[leftIndexToCheck]
                : null

            const isLeftSymbolAllowed = leftSymbolToCheck
                ? symbolMembershipCheckCallback(leftSymbolToCheck)
                : false

            console.log("Left!",
                "Index:", leftIndexToCheck,
                "Symbol:", leftSymbolToCheck,
                "Allowed:", isLeftSymbolAllowed)

            if (isLeftSymbolAllowed) {
                leftIndex--;
            } else {
                moveLeft = false
            }
        }

        if (moveRight) {
            const rightIndexToCheck = rightIndex + 1
            const rightSymbolToCheck = rightIndexToCheck < equation.length
                ? equation[rightIndexToCheck]
                : null

            const isRightSymbolAllowed = rightSymbolToCheck
                ? symbolMembershipCheckCallback(rightSymbolToCheck)
                : false

            console.log("Right!",
                "Index:", rightIndexToCheck,
                "Symbol:", rightSymbolToCheck,
                "Allowed:", isRightSymbolAllowed)

            if (isRightSymbolAllowed) {
                rightIndex++;
            } else {
                moveRight = false
            }
        }
    }
    while ((moveLeft || moveRight)
        && (maxLength === null || rightIndex - leftIndex + 1 < maxLength))

    const valStr = equation.slice(leftIndex, rightIndex + 1).join("")
    return {
        result: valStr,
        absoluteStartIndex: leftIndex,
        relativeCaretIndex: index - leftIndex + (edgeRight ? 1 : 0)
    }
}

export const getTokenSubstringAtIndex = (equation, index, tokenTypeRestrictions) => {
    if (isNaN(index)) {
        throw Error("ArgumentNull: index")
    }

    if (!equation || equation.length === 0) {
        throw Error("InvalidArgument: equation")
    }

    if (index < 0 || index >= equation.length) {
        throw Error("ArgumentOutOfRange: Invalid index")
    }

    if (!tokenTypeRestrictions){
        throw Error("InvalidArgument: tokenTypeRestrictions")
    }

    const parseTokenResult = getTokenStringAtIndex(equation,
        index,
        tokenTypeRestrictions.symbolMembershipCheckCallback,
        tokenTypeRestrictions.maxLength
    )

    return {
        ...parseTokenResult,
        resultStr: parseTokenResult.result,
    }
}

export const getNumberAtIndex = (equation, index) => {
    if (isNaN(index)) {
        throw Error("ArgumentNull: index")
    }

    if (!equation || equation.length === 0) {
        throw Error("InvalidArgument: equation")
    }

    if (index < 0 || index >= equation.length) {
        throw Error("ArgumentOutOfRange: Invalid index")
    }

    const parseTokenResult = getTokenSubstringAtIndex(equation, index, numberRestrictions)

    const number = parseFloat(parseTokenResult.result)

    if (number.toString() !== parseTokenResult.result) {
        throw Error(`Couldn't parse number properly at index ${index}`)
    }

    parseTokenResult.result = number
    return parseTokenResult
}