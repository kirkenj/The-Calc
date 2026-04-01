import { numberRestrictions, wordRestrictions } from './tokenTypesRestrictions'

export const parseToken = (equation, index, setOfSymbols) => {
    if (isNaN(index)) {
        return null
    }

    if (index < 0 || index >= equation.length) {
        return null
    }

    const isAllowedSymbol = (symbol) => setOfSymbols.includes(symbol)

    let leftIndex = index
    let rightIndex = index
    let moveRight = true
    let moveLeft = true
    let edgeRight = false

    if (!isAllowedSymbol(equation[index])) {
        if (index > 0 && isAllowedSymbol(equation[index - 1])) {
            index--;
            leftIndex = index;
            rightIndex = index;
            edgeRight = true;
        }
        else if (index < equation.length - 1 && isAllowedSymbol(equation[index + 1])) {
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
                ? isAllowedSymbol(leftSymbolToCheck)
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

        if (moveRight){
            const rightIndexToCheck = rightIndex + 1
            const rightSymbolToCheck = rightIndexToCheck < equation.length
                ? equation[rightIndexToCheck]
                : null

            const isRightSymbolAllowed = rightSymbolToCheck
                ? isAllowedSymbol(rightSymbolToCheck)
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
    while (moveLeft || moveRight)

    const valStr = equation.slice(leftIndex, rightIndex + 1).join("")
    return {
        result: valStr,
        absoluteStartIndex: leftIndex,
        relativeCaretIndex: index - leftIndex + (edgeRight ? 1 : 0)
    }
}

export const getNumberAtIndex = (equation, index) => {
  if (isNaN(index)) {
    return null
  }

  if (index < 0 || index >= equation.length) {
    return null
  }

  const parseTokenResult = parseToken(equation,
    index,
    numberRestrictions.allowedSymbols)

  const number = parseFloat(parseTokenResult.result)

  if (number.toString() !== parseTokenResult.result) {
    throw Error(`Couldn't parse number properly at index ${index}`)
  }

  return {
    ...parseTokenResult,
    resultStr: parseTokenResult.result,
    result: number
  }
}

export const getWordAtIndex = (equation, index) => {
  if (isNaN(index)) {
    return null
  }

  if (index < 0 || index >= equation.length) {
    return null
  }

  const parseTokenResult = parseToken(equation,
    index,
    wordRestrictions.allowedSymbols)

  return {
    ...parseTokenResult,
    resultStr: parseTokenResult.result,
  }
}