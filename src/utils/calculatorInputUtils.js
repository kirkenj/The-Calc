export const appendNumber = (expression, number) =>{
    if (typeof expression !== 'string'){
        console.log('invalid expression type. must be string. Recieved:', typeof expression)
        return expression
    }

    if (typeof number !== 'string'){
        console.log('invalid number type. must be string')
        return expression
    }

    if (number.length !== 1){
        console.log('invalid number length. must be 1')
        return expression
    }

    if (isNaN(number)){
        console.log('invalid number length. must be 1')
        return expression
    }

    if (expression === "0"){
        return number
    }

    return expression + number
}