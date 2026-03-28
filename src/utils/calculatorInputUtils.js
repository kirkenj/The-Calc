import { getCurrentNumberString } from "./getCurrenNumberUtil"

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

export const isNumber = (num) => numbers.includes(num.toString())

export const appendNumber = (num, equation) => {
    if (typeof equation !== 'string') {
        console.log("equation is not a string")
        return equation
    }

    if (!isNumber(num)) {
        console.log("num !E [0,9]")
        return equation
    }

    return equation === "0"
        ? num.toString()
        : equation + num.toString()
}

export const appendDot = (equation) => {
    const currentNumber = getCurrentNumberString(equation, equation.length - 1);
    if (currentNumber.number === "0" || currentNumber.number === "") {
        return "0."
    }

    if (currentNumber.number.includes(".")) {
        console.log(`Number already has dot`, currentNumber);
        return equation
    }

    return equation + '.'
}