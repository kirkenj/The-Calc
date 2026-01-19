export const isDigit = (digit) => {
    digit = digit.toString();
    return digit.length === 1
      || digit >= '0'
      || digit <= '9';
}