//import './App.css'
import { createTokenParser } from "./utils/Parsing/tokenParser";
import { getTokenStringAtIndex } from "./utils/Parsing/tokenStringBuilder";
import { parseTree } from "./utils/TreeBuilding/treeBuilder";
import { createAlphaCounter } from "./utils/TreeBuilding/alphaCounter";
import type { TreeBuilderTriggerTypes } from "./utils/Models/TreeBuilding/TreeBuilderTriggerTypes";
import { tokenTypes, tokenTypesAsArr } from "./utils/Constants/Types/TokenTypes";
import { evaluateNode } from "./utils/Calculation/evaluateTreeUtils";
import { calculateTokens, indexationCallback } from "./utils/calculateSimpleEquation";
import { getOperatorsForVariables } from "./utils/variableResolver";
import type { Token, ValueToken } from "./utils/Models/Core/Token";
import { getIndexesOnPredicate } from "./utils/indexUtils";
//import './utils/logOverrider'


function App() {
  const exec = () => {





    // const someMap = new Map<string, ValueToken<number>>();
    // const val:ValueToken<number> = {
    //   type: tokenTypes.NumberTokenType,
    //   value: 123,
    //   fromString: "",
    //   initStringIndex: 0,
    // }

    // someMap.set('a', val)

    // const a = getOperatorsForVariables(someMap)
    // console.log(a)

    // const val:ValueToken<string> = {
    //   type: tokenTypes.WordTokenType,
    //   value: "@B",
    //   fromString: "",
    //   initStringIndex: 0,
    // }

    // console.log(tokenTypes.WordTokenType.isInstance(val))


    const equation = "10 + sin( 5 * ( 6 / 2 ) - (3 + 5)) + (18 + 121) + (( -6 / 2 )"
    
    //const equation = "10 * ( 5 + 3)";
    // const equation = "10 + 4";
    // const equation = "10 * (4)";

    const parseTokensDelegate = createTokenParser(tokenTypesAsArr, getTokenStringAtIndex)

    const alphaCounterNameGenerator = createAlphaCounter()

    const treeBuilderTriggers: TreeBuilderTriggerTypes = {
      OpenBracket: tokenTypes.OpenBracketTokenType,
      ClosedBracket: tokenTypes.ClosedBracketTokenType,
      TypeUsedForAliases: tokenTypes.WordTokenType
    }

    const parseTreeResult = parseTree(equation, alphaCounterNameGenerator, treeBuilderTriggers, tokenTypesAsArr, parseTokensDelegate, getTokenStringAtIndex)
    console.log(parseTreeResult)
    if (!parseTreeResult.Success){
      return
    }


    const evaluateNodeResult = evaluateNode(parseTreeResult.Result.eqMap, parseTreeResult.Result.entryPointName, calculateTokens);
    console.log(evaluateNodeResult);
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


// const tokens: Token[] =
// [
//     {
//         type: tokenTypes.NumberTokenType,
//         initStringIndex: 0,
//         fromString: "10",
//         value: 10
//     },
//     {
//         type: tokenTypes.WhiteSpaceTokenType,
//         initStringIndex: 2,
//         fromString: " "
//     },
//     {
//         type: tokenTypes.SpecSymbolTokenType,
//         initStringIndex: 3,
//         fromString: "*",
//         value: "*"
//     },
//     {
//         type: tokenTypes.WhiteSpaceTokenType,
//         initStringIndex: 4,
//         fromString: " "
//     },
//     {
//         type: tokenTypes.WordTokenType,
//         initStringIndex: 5,
//         fromString: "@B",
//         value: "@B"
//     }
// ]

// const operatorIndexesResult = getIndexesOnPredicate(tokens, indexationCallback)
// console.log(operatorIndexesResult);
