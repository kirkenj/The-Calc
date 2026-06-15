import './App.css'
import { createTokenParser } from "./utils/Parsing/tokenParser";
import { getTokenStringAtIndex } from "./utils/Parsing/tokenStringBuilder";
import { parseTree } from "./utils/TreeBuilding/treeBuilder";
import { createAlphaCounter } from "./utils/TreeBuilding/alphaCounter";
import type { TreeBuilderTriggerTypes } from "./utils/Models/TreeBuilding/TreeBuilderTriggerTypes";
import { tokenTypesAsArr } from "./utils/Constants/Types/TokenTypes";
import { evaluateNode } from "./utils/Calculation/evaluateTreeUtils";
import { calculateTokens, indexationCallback } from "./utils/calculateSimpleEquation";
import { getOperatorsForVariables } from "./utils/variableResolver";
import type { ValueToken } from "./utils/Models/Core/Token";
import { getIndexesOnPredicate } from "./utils/indexUtils";
import './utils/logOverrider'
import type { Token } from "./utils/Models/Core/Token";
import { tokenTypes } from "./utils/Constants/Types/TokenTypes";
import { DoubleLinkedListClass } from "./utils/IndexedCollections/DoubleLinkedListClass";


function App() {
  const exec = () => {
    
    const parseTokensDelegate = createTokenParser(tokenTypesAsArr, getTokenStringAtIndex)
    const equation = "10 + sin( 5 * ( 6 / 2 ) - (3 + 5)) + (18 + 121) + (( -6 / 2 )"

    // const a = parseTokensDelegate(equation, null)
    // console.log(a);
    // if (a.Success){
    //   console.log(a.Result.toJSON());
    // }  

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

    const map = parseTreeResult.Result.eqMap
    for (const key of map.keys()) {
      const mapVal = map.get(key)
      const obj = {
        name: mapVal?.name,
        ind: mapVal?.index,
        ch: mapVal?.children.toJSON(),
        cont: mapVal?.content.toJSON(),
      }

      console.log(key, obj);
    }
  }

  //   const equation = "10 + sin( 5 * ( 6 / 2 ) - (3 + 5)) + (18 + 121) + (( -6 / 2 )"

  //   // const equation = "10 * ( 5 + 3)";
  //   // const equation = "10 + 4";
  //   // const equation = "10 * (4)";

  //   const parseTokensDelegate = createTokenParser(tokenTypesAsArr, getTokenStringAtIndex)

  //   const alphaCounterNameGenerator = createAlphaCounter()

  //   const treeBuilderTriggers: TreeBuilderTriggerTypes = {
  //     OpenBracket: tokenTypes.OpenBracketTokenType,
  //     ClosedBracket: tokenTypes.ClosedBracketTokenType,
  //     TypeUsedForAliases: tokenTypes.WordTokenType
  //   }

  //   const parseTreeResult = parseTree(equation, alphaCounterNameGenerator, treeBuilderTriggers, tokenTypesAsArr, parseTokensDelegate, getTokenStringAtIndex)
  //   console.log(parseTreeResult)
  //   if (!parseTreeResult.Success){
  //     return
  //   }


  //   const evaluateNodeResult = evaluateNode(parseTreeResult.Result.eqMap, parseTreeResult.Result.entryPointName, calculateTokens);
  //   console.log(evaluateNodeResult);
  // }

  return (
    <>
      <div>Hello world</div>
      <button onClick={exec}>Start</button>
    </>)
}


export default App

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


    // const lst = new DoubleLinkedListClass<Token>()
    // lst.insertRange(0, tokens)
    // console.log(lst.toJSON());

    // const iter1 = lst.GetIteratorAtIndex(3)
    // const iter2 = lst.GetIteratorAtIndex(3)

    // while(true){
    //   console.log(iter1?.GetValue());
    //   if (!iter1?.MoveNext())
    //   {
    //     break
    //   }
    // }

    // lst.insertRange(0, tokens)

    
    // while(true){
    //   console.log(iter2?.GetValue());
    //   if (!iter2?.MovePrev())
    //   {
    //     break
    //   }
    // }


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