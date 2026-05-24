import { getTokenStringAtIndex} from "./tokenStringBuilder"
import { numberRestrictions } from "./tokenTypesRestrictions"

export function appendNumber(
    num: string, 
    equation: string
) : string {
    if (!numberRestrictions.symbolMembershipCheckCallback(num)) {
        console.log("num !E [0,9]")
        return equation
    }

    return equation === "0"
        ? num.toString()
        : equation + num.toString()
}

export function appendDot(
    equation: string
) : string {

    const currentNumber = getTokenStringAtIndex(
        equation,
        equation.length - 1,
        numberRestrictions.symbolMembershipCheckCallback);

    if (currentNumber.tokenString === "0" || currentNumber.tokenString === "") {
        return "0."
    }

    if (currentNumber.tokenString.includes(".")) {
        console.log(`Number already has dot`, currentNumber);
        return equation
    }

    return equation + '.'
}