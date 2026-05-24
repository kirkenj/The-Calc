export const createAlphaCounter = () : () => string => {
  let count = 0;

  return () => {
    count++;
    let num = count;
    let result = '';

    while (num > 0) {
      let remainder = (num - 1) % 26;
      result = '@' + String.fromCharCode(65 + remainder) + result;
      num = Math.floor((num - 1) / 26);
    }

    return result;
  };
};