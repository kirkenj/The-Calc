import Wrapper from "./Wrapper";
import Screen from "./Screen";
import ButtonBox from "./ButtonBox";
import Button from "./Button";
import { useReducer } from "react";


const reducer = (state, action) => {
  console.log('action.type:', action.type)
  console.log('state:', state)
  const isNumber = !isNaN(action.type);
  console.log('isNumber:', isNumber)

  if (isNumber) {
    const newState = state.toString() + action.type.toString()
    console.log('newState', newState);
    return newState
  }

  switch (action.type) {
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