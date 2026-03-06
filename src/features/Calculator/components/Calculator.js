import React from 'react'
import Wrapper from "./Wrapper";
import Screen from "./Screen";
import ButtonBox from "./ButtonBox";
import Button from "./Button";
import CalcProvider from "../context/CalcContext"
import CalcContext from "../context/CalcContext"
import { useContext } from 'react';
import { isDigit } from "../../../utils/validators"


const Calculator = () => {
    //const { calc, setCalc } = useContext(CalcContext);

  const btnValues = [
  [
    { symbol: "C", style: "" },
    { symbol: "+-", style: "" },
    { symbol: "%", style: "" },
    { symbol: "/", style: "opt" }
  ],
  [
    { symbol: 7, style: "" },
    { symbol: 8, style: "" },
    { symbol: 9, style: "" },
    { symbol: "*", style: "opt" }
  ],
  [
    { symbol: 4, style: "" },
    { symbol: 5, style: "" },
    { symbol: 6, style: "" },
    { symbol: "-", style: "opt" }
  ],
  [
    { symbol: 1, style: "" },
    { symbol: 2, style: "" },
    { symbol: 3, style: "" },
    { symbol: "+", style: "opt" }
  ],
  [
    { symbol: 0, style: "" },
    { symbol: ".", style: "" },
    { symbol: "=", style: "equals" }
  ]
]

    return (
        <CalcProvider>
            <Wrapper>
                <Screen />
                <ButtonBox>
                    {btnValues.flat().map((btn, i) => (
                        <Button value={btn.symbol} key={i} style={btn.style} />
                    ))}
                </ButtonBox>
            </Wrapper>
        </CalcProvider>
    )
}

export default Calculator