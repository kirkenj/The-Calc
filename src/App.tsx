//import './App.css'
import { createTokenParser} from "./utils/Parsing/tokenParser";
import { tokenTypesAsArr } from "./utils/Types/TokenTypes";
import { getTokenStringAtIndex } from "./utils/Parsing/tokenStringBuilder";

function App() {
  const parseTokensDelegate = createTokenParser(tokenTypesAsArr, getTokenStringAtIndex)



  return (
    <>
      <div>Hello world</div>
      <button onClick={() => {


        //console.log("defaultDefinedNames:", defaultDefinedNames)
        const parseResult = parseTokensDelegate("10 + ( 5 * ( 6 / 2 )) + 4")
        //const parseResult = parseTree("10 + ( 5 * ( 6 / 2 )")
        //const parseResult = parseTree("100 + ( 60            / 2 )")
        //const parseResult = parseTree("(((()())()(", onTokenParsed)
        //const parseResult = parseTree("10 + sin( 5 * ( 6 / 2 ) - (3 + 5)) + (18 + 121) + (( -6 / 2 )")
        //const parseResult = parseTree("sin( 5 * ( 6 / 2 ) - (3 + 5))")
        //const parseResult = parseTree("- 5.5 + 2 * 1.5  - 4.5 / - 1.5")
        console.log(parseResult)
        //const result = evaluateTree(parseResult)
        //const result = calculateSimpleEquation("(-5.5+sin2*1.5-4.5/-1.5)", false)
        //console.log(result)
      }}>Start</button>
    </>)
}

export default App
