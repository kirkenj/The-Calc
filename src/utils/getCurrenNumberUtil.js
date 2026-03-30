const parentheses = ['(', ')']
const numberSeparators = ['+', '-', '*', '/', ...parentheses]
const unaryTriggers = ['(', '*', '/', '^'];


const minusContinuationCondition = (eqn, lIndex) =>
    eqn[lIndex - 1] === '-' && (
        lIndex - 1 === 0 ||
        unaryTriggers.includes(eqn[lIndex - 2]))

export const getCurrentNumberString = (equation, index) => {
    // if (typeof equation !== 'string' || equation.trim() === "") {
    //     return null
    // }

    if (isNaN(index)) {
        return null
    }

    if (index < 0 || index >= equation.length) {
        return null
    }

    let leftIndex = index
    let rightIndex = index
    let moveRight = true
    let moveLeft = true
    let edgeRight = false

    if (numberSeparators.includes(equation[index])) {
        if (index > 0 && !numberSeparators.includes(equation[index - 1])) {
            index--;
            leftIndex = index;
            rightIndex = index;
            edgeRight = true;
        }
        else if (index < equation.length - 1 && !numberSeparators.includes(equation[index + 1])) {
            index++;
            leftIndex = index;
            rightIndex = index;
        }
        else {
            return { number: "", absoluteStartIndex: index, relativeCaretIndex: 0 };
        }
    }

    do {
        moveLeft = moveLeft && leftIndex > 0 && (
            !numberSeparators.includes(equation[leftIndex - 1]) ||
            minusContinuationCondition(equation, leftIndex));
        if (moveLeft) {
            leftIndex--;
        }

        moveRight = moveRight && rightIndex < equation.length - 1 &&
            !numberSeparators.includes(equation[rightIndex + 1])
        if (moveRight) {
            rightIndex++;
        }
    }
    while (moveLeft || moveRight)

    const valStr = equation.slice(leftIndex, rightIndex + 1).join("")
    return {
        number: parseFloat(valStr),
        numberLength: valStr.length,
        absoluteStartIndex: leftIndex,
        relativeCaretIndex: index - leftIndex + (edgeRight ? 1 : 0)
    }
}