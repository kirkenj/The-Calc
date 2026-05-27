//import './App.css'
import { createTokenParser } from "./utils/Parsing/tokenParser";
import { tokenTypes, tokenTypesAsArr } from "./utils/Types/TokenTypes";
import { getTokenStringAtIndex } from "./utils/Parsing/tokenStringBuilder";
import { parseTree } from "./utils/TreeBuilding/treeBuilder";
import { createAlphaCounter } from "./utils/TreeBuilding/alphaCounter";
import type { TreeBuilderTriggerTypes } from "./utils/Models/TreeBuilding/TreeBuilderTriggerTypes";

function App() {
  const exec = () => {
    const equation = "10 + ( 5 * ( 6 / 2 )) + 4";

    const parseTokensDelegate = createTokenParser(tokenTypesAsArr, getTokenStringAtIndex)

    const alphaCounterNameGenerator = createAlphaCounter()

    const treeBuilderTriggers: TreeBuilderTriggerTypes = {
      OpenBracket: tokenTypes.OpenBracketTokenType,
      ClosedBracket: tokenTypes.ClosedBracketTokenType,
      TypeUsedForAliases: tokenTypes.WordTokenType
    }

    const parseTreeResult = parseTree(equation, alphaCounterNameGenerator, treeBuilderTriggers, tokenTypesAsArr, parseTokensDelegate, getTokenStringAtIndex)
    console.log(parseTreeResult)
  }

  return (
    <>
      <div>Hello world</div>
      <button onClick={exec}>Start</button>
    </>)
}

export default App




//console.log("defaultDefinedNames:", defaultDefinedNames)
//const parseResult = parseTokensDelegate()
//const parseResult = parseTree("10 + ( 5 * ( 6 / 2 )")
//const parseResult = parseTree("100 + ( 60            / 2 )")
//const parseResult = parseTree("(((()())()(", onTokenParsed)
//const parseResult = parseTree("10 + sin( 5 * ( 6 / 2 ) - (3 + 5)) + (18 + 121) + (( -6 / 2 )")
//const parseResult = parseTree("sin( 5 * ( 6 / 2 ) - (3 + 5))")
//const parseResult = parseTree("- 5.5 + 2 * 1.5  - 4.5 / - 1.5")
//console.log(parseResult)
//const result = evaluateTree(parseResult)
//const result = calculateSimpleEquation("(-5.5+sin2*1.5-4.5/-1.5)", false)
//console.log(result)
