import { getTokenStringAtIndex as parseToken } from "./tokenStringBuilder"
import { numberRestrictions } from "./tokenTypesRestrictions"

export const appendNumber = (num, equation) => {
    if (typeof equation !== 'string') {
        console.log("equation is not a string")
        return equation
    }

    if (!numberRestrictions.symbolMembershipCheckCallback(num)) {
        console.log("num !E [0,9]")
        return equation
    }

    return equation === "0"
        ? num.toString()
        : equation + num.toString()
}

export const appendDot = (equation) => {
    const currentNumber = parseToken(
        equation,
        equation.length - 1,
        numberRestrictions.allowedSymbols);

    if (currentNumber.number === "0" || currentNumber.number === "") {
        return "0."
    }

    if (currentNumber.number.includes(".")) {
        console.log(`Number already has dot`, currentNumber);
        return equation
    }

    return equation + '.'
}