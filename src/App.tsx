import './App.css'
import './utils/logOverrider'
import type { Token } from "./utils/Models/Core/Token";
import { tokenTypes } from "./utils/Constants/Types/TokenTypes";
import { DoubleLinkedListClass } from "./utils/IndexedCollections/DoubleLinkedListClass";


function App() {
  const exec = () => {

    const tokens: Token[] =
    [
        {
            type: tokenTypes.NumberTokenType,
            initStringIndex: 0,
            fromString: "10",
            value: 10
        },
        {
            type: tokenTypes.WhiteSpaceTokenType,
            initStringIndex: 2,
            fromString: " "
        },
        {
            type: tokenTypes.SpecSymbolTokenType,
            initStringIndex: 3,
            fromString: "*",
            value: "*"
        },
        {
            type: tokenTypes.WhiteSpaceTokenType,
            initStringIndex: 4,
            fromString: " "
        },
        {
            type: tokenTypes.WordTokenType,
            initStringIndex: 5,
            fromString: "@B",
            value: "@B"
        }
    ]


    const lst = new DoubleLinkedListClass<Token>()
    lst.insertRange(0, tokens)
    console.log(lst);

  return (
    <>
      <div>Hello world</div>
      <button onClick={exec}>Start</button>
    </>)
}


export default App