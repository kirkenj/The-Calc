import { Result } from "../Models/Core/Result"
import type { StringCollectionDelegate } from "../Models/Parsing/StringCollectionDelegate"


export const getTokenStringAtIndex: StringCollectionDelegate = (equation, index, symbolMembershipCheckCallback, maxLength = null) => {
    console.log("getTokenStringAtIndex executed with arguments:",
        "equation", equation,
        "index", index,
        "symbolMembershipCheckCallback", symbolMembershipCheckCallback,
        "maxLength", maxLength === null ? "[null]" : maxLength)

    if (equation.length === 0) {
        return Result.Fail("InvalidArgument: equation")
    }

    if (index < 0 || index >= equation.length) {
        return Result.Fail("ArgumentOutOfRange: Invalid index")
    }

    if (maxLength !== null && !isNaN(maxLength) && maxLength <= 0) {
        return Result.Fail("InvalidArgument: maxLength")
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
            return Result.Success({ tokenString: "", absoluteStartIndex: index, relativeCaretIndex: 0 });
        }
    }

    let length = rightIndex - leftIndex + 1

    const lengthCanBeExpanded = maxLength === null
        ? () => true
        : (length: number) => length + 1 <= maxLength

    do {
        if (moveLeft) {
            const leftIndexToCheck = leftIndex - 1
            const leftSymbolToCheck = leftIndexToCheck >= 0
                ? equation[leftIndexToCheck]
                : null

            const isLeftSymbolAllowed = leftSymbolToCheck
                ? symbolMembershipCheckCallback(leftSymbolToCheck) && lengthCanBeExpanded(length)
                : false

            console.log("Left!",
                "Index:", leftIndexToCheck,
                "Symbol:", leftSymbolToCheck,
                "Allowed:", isLeftSymbolAllowed)

            if (isLeftSymbolAllowed) {
                leftIndex--;
                length++
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
                ? symbolMembershipCheckCallback(rightSymbolToCheck) && lengthCanBeExpanded(length)
                : false

            console.log("Right!",
                "Index:", rightIndexToCheck,
                "Symbol:", rightSymbolToCheck,
                "Allowed:", isRightSymbolAllowed)

            if (isRightSymbolAllowed) {
                rightIndex++;
                length++
            } else {
                moveRight = false
            }
        }
    }
    while (moveLeft || moveRight)

    const valStr = equation.slice(leftIndex, rightIndex + 1)
    console.log('valStr to return:', valStr, "leftIndex:", leftIndex, "rightIndex:", rightIndex)

    return Result.Success({
        tokenString: valStr,
        absoluteStartIndex: leftIndex,
        relativeCaretIndex: index - leftIndex + (edgeRight ? 1 : 0)
    })
}