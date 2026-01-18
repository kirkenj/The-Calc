import { useContext } from "react";
import { CalcContext } from '../context/CalcContext'

const getStyleName = btn => {
  const className = {
    '=': 'equals',
    'x': 'opt',
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
      num: 29
    });
    console.log("sosal");
  }

  const handleBtnClick = () => {
    const results = {
      '.': commaClick
    }
    console.log(value);
    console.log(results[value]);

    return results[value];
  }


  return (
    <button onClick={handleBtnClick} className={`${getStyleName(value)} button`}>{value}</button>
  )
}

export default Button