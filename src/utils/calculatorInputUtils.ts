import { numberRestrictions } from "./Constants/Types/Number";
import { getTokenStringAtIndex } from "./Parsing/tokenStringBuilder";

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
    const getCurrentNumberResult = getTokenStringAtIndex(
        equation,
        equation.length - 1,
        numberRestrictions.symbolMembershipCheckCallback);

    if (!getCurrentNumberResult.Success){
        console.log(`Couldn't get a number`, getCurrentNumberResult);
        return equation
    }

    const getCurrentNumber = getCurrentNumberResult.Result;

    if (getCurrentNumber.tokenString === "0" || getCurrentNumber.tokenString === "") {
        return "0."
    }

    if (getCurrentNumber.tokenString.includes(".")) {
        console.log(`Number already has dot`, getCurrentNumberResult);
        return equation
    }

    return equation + '.'
}