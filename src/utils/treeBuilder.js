import { parseTokens } from "./tokenParser"

// const getDefaultTokenTypeFromTokenType = (tokenType) => {
//   return {
//     ...tokenType,
//     charCheckDelegate: () => true,
//     tokenStringCollector: (equation, index) => {
//       return {
//         absoluteStartIndex: index,
//         relativeCaretIndex: index,
//         resultStr: equation[index],
//         result: equation[index]
//       }
//     }
//   }
// }



export const parseTree = (equation) => {
  const onTokenParsed = (token) => {
    console.log("Token parsed:", token)
  }

  parseTokens(equation, onTokenParsed)



  return
}

// const createBracketInfo = (name, index, initIndex) => {
//   return {
//     index: index,
//     name: name,
//     children: [],
//     initIndex
//   }
// }

// export const parseBrackets = (equation) => {
//   let initString = equation = '(' + equation
//   let getNextStringName = createAlphaCounter();
//   const entryPointName = getNextStringName()

//   let eqMap = {}
//   let stack = [
//     createBracketInfo(entryPointName, 0, 0)
//   ]

//   const defaultTokenTypeName = tokenTypeNames.Word
//   const defaultTokenType = tokenTypes.find(t => t.name === defaultTokenTypeName)
//   if (!defaultTokenType) {
//     throw new Error(`Couldn't get default token type by name '${defaultTokenTypeName}'`)
//   }

//   const currenTokenTypes = [...tokenTypes, getDefaultTokenTypeFromTokenType(defaultTokenType)]

//   let arr = Array.from(initString)
//   let initIndex = 1
//   let i = initIndex
//   while (i < arr.length) {
//     const areSymbolsEqual = arr[i] === initString[initIndex] ? "yes" : "NOOOOOO"
//     console.log("Init index:", initIndex,
//       "I:", i,
//       "InitString:", initString,
//       "Current symbol from init string:", initString[initIndex],
//       "Current arr symbol:", arr[i],
//       "Are symbols equal:", areSymbolsEqual)

//     if (arr[i] === '(') {
//       console.log("Found open bracket at index:", i)
//       const openBracketInfo = createBracketInfo(getNextStringName(), i, initIndex)
//       stack.push(openBracketInfo)
//       stack[stack.length - 2].children.push(openBracketInfo.name)
//     }
//     else if (arr[i] === ')') {
//       console.log("Found closed bracket at index:", i)
//       if (stack.length === 0) {
//         throw new Error("Unmatched parenthesis")
//       }

//       const openBracketInfo = stack.pop()
//       console.log(openBracketInfo);

//       const initStringSlice = initString.slice(openBracketInfo.initIndex, initIndex + 1)
//       const bracketContentWithoutBrackets = arr.slice(openBracketInfo.index + 1, i)
//       const currentStackValue = eqMap[openBracketInfo.name] = {
//         ...openBracketInfo,
//         content: bracketContentWithoutBrackets,
//         children: openBracketInfo.children,
//         fromSlice: initStringSlice
//       }

//       console.log("arr before pop", arr,
//         "CurrentBracketInfo", openBracketInfo,
//         "CurrentStackValue", currentStackValue
//       );

//       const tokenToInsert = defaultTokenType.tokenFactory(
//         currentStackValue.name,
//         openBracketInfo.initIndex,
//         initStringSlice)

//       const popped = arr.splice(
//         openBracketInfo.index,
//         bracketContentWithoutBrackets.length + 2,
//         tokenToInsert)


//       console.log("popped as brackets", popped);
//       console.log("arr after pop", arr);
//       i = openBracketInfo.index;
//     }
//     else {
//       let tokenizerExecuted = false;

//       for (const tokenType of currenTokenTypes) {
//         if (!tokenType.charCheckDelegate(arr[i])) {
//           continue
//         }

//         tokenizerExecuted = true
//         console.log(`Found ${tokenType.name} at index`, i, arr[i])

//         const parsedTokenInfo = tokenType.tokenStringCollector(arr, i)
//         const token = tokenType.tokenFactory(parsedTokenInfo.result, initIndex, parsedTokenInfo.resultStr)
//         console.log("Arr before token pop:", arr);
        
//         console.log("Parsed token:", token)

//         const poppedForToken = arr.splice(
//           parsedTokenInfo.absoluteStartIndex, 
//           parsedTokenInfo.resultStr.length, 
//           token)

//         console.log("poppedForToken:", poppedForToken,
//           "New arr state:", arr,
//           "Index before inc:", i,
//           "placedValue:", token)

//         console.log("Placed:", token, "atIndex:", i, "initIndex:", initIndex)

//         i = parsedTokenInfo.absoluteStartIndex
//         initIndex += token.fromSlice.length - 1
//         console.log("New initIndex:", initIndex)

//         break
//       }

//       if (!tokenizerExecuted){
//         throw Error(`Unknown token '${initString[initIndex]}' at index ${initIndex}`)
//       }
//     }

//     if (i === arr.length - 1) {
//       console.log("Reached last index", "stack:", stack)
//       if (stack.length > 0) {
//         arr.push(')')
//         initString = initString + ')'
//         console.log("Added brackets in the end. new arr:", arr)
//       } else {
//         console.log("Addition of closing brackets in the end not needed:", arr)
//       }
//     }

//     i++;
//     initIndex++;
//   }


//   console.log(i);

//   return { map: eqMap, entryPointName }
// }