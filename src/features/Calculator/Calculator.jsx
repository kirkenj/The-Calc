import Wrapper from "./Wrapper";
import Screen from "./Screen";
import ButtonBox from "./ButtonBox";
import Button from "./Button";
import { useReducer } from "react";
import { appendNumber } from "../../utils/calculatorInputUtils";


const reducer = (state, action) => {
  if (!isNaN(action.type)) {
    const newState = appendNumber(state, action.type)
    console.log('newState', newState);
    return newState
  }

  switch (action.type) {
    case "C":
      return "0"

    default:
      return state
  }
}


const Calculator = () => {
  const [state, dispatch] = useReducer(reducer, '0')


  const btnValues = [
    [
      { symbol: "C", style: "cButton" },
      { symbol: "%", style: "" },
      { symbol: "/", style: "opt" }
    ],
    [
      { symbol: '7', style: "" },
      { symbol: '8', style: "" },
      { symbol: '9', style: "" },
      { symbol: "*", style: "opt" }
    ],
    [
      { symbol: '4', style: "" },
      { symbol: '5', style: "" },
      { symbol: '6', style: "" },
      { symbol: "-", style: "opt" }
    ],
    [
      { symbol: '1', style: "" },
      { symbol: '2', style: "" },
      { symbol: '3', style: "" },
      { symbol: "+", style: "opt" }
    ],
    [
      { symbol: '0', style: "" },
      { symbol: ".", style: "" },
      { symbol: "=", style: "equals" }
    ]
  ]

  return (
    <Wrapper>
      <Screen>{state}</Screen>
      <ButtonBox>
        {btnValues.flat().map((btn, i) => (
          <Button
            key={i}
            value={btn.symbol}
            style={btn.style}
            callback={() => dispatch({ type: btn.symbol })} />
        ))}
      </ButtonBox>
    </Wrapper>
  )
}

export default Calculator