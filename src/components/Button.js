import { useContext } from "react";
import { CalcContext } from '../context/CalcContext'
import { isDigit } from '../utils/validators.js'

const getStyleName = btn => {
  const className = {
    '=': 'equals',
    '*': 'opt',
    '+': 'opt',
    '-': 'opt',
    '/': 'opt',
  }
  return className[btn];
}

const Button = ({ value }) => {
  const { calc, setCalc } = useContext(CalcContext);


  const commaClick = () => {
    setCalc({
      ...calc,
      num: !calc.num.toString().includes('.')
        ? calc.num + value
        : calc.num
    });
  }

  const digitClick = (digit) => {
    if (!isDigit(digit)) {
      console.log(`Error. ${digit} - invalid digit`)
      return
    }

    setCalc({
      ...calc,
      num: calc.num.toString() === "0"
        ? digit
        : Number(calc.num.toString() + digit)
    });
  }

  const resetClick = () => {
    setCalc({
      sign: '',
      num: 0,
      res: 0
    });
  }

  const signClick = () => {
    setCalc({
      sign: value,
      res: !calc.res && calc.num ? calc.num : calc.res,
      num: 0
    });
  }

  const percentClick = () => {
    setCalc({
      num: (calc.num / 100),
      res: (calc.res / 100),
      sign: ''
    })
  }

  const ivertClick = () => {
    setCalc({
      num: calc.num ? calc.num * (-1) : 0,
      res: calc.res ? calc.num * (-1) : 0,
      sign: ''
    })
  }


  const equalsClick = () => {
    if (!(calc.res && calc.num)) {
      return;
    }

    const math = (a, b, sign) => {
      const result = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '/': (a, b) => a / b,
        '*': (a, b) => a * b,
      }

      const funcToCall = result[sign]; 
      return funcToCall 
        ? funcToCall(a,b)
        : 0;
    }

    const calcResult = math(calc.res, calc.num, calc.sign);
    console.log(calcResult);
    setCalc({
      res: calcResult,
      sign: '',
      num: 0
    });
  }

  const handleBtnClick = () => {
    const results = {
      '.': commaClick,
      'C': resetClick,
      '/': signClick,
      '*': signClick,
      '+': signClick,
      '-': signClick,
      '=': equalsClick,
      '%': percentClick,
      '+-': ivertClick,
      '1': () => digitClick(1),
      '2': () => digitClick(2),
      '3': () => digitClick(3),
      '4': () => digitClick(4),
      '5': () => digitClick(5),
      '6': () => digitClick(6),
      '7': () => digitClick(7),
      '8': () => digitClick(8),
      '9': () => digitClick(9),
      '0': () => digitClick(0),
    }

    results[value]?.();
  }


  return (
    <button onClick={handleBtnClick} className={`${getStyleName(value)} button`}>{value}</button>
  )
}

export default Button