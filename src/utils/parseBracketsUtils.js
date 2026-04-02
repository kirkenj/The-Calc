import { createAlphaCounter } from "./alphaCounter"
import { tokenTypes } from "./tokenTypes"

//improvement idea: add check for existing equations, to avoid evaluation of same equations: (2+2)*(2+2) -> "@0*@0"    { "@0": { content: "(2+2)", children: [] }, "@1": { content: "(@0*@0)", children: ["@0"] }}
const createBracketInfo = (name, index) => {
  return {
    index: index,
    name: name,
    children: []
  }
}

export const parseBrackets = (equation) => {
  equation = '(' + equation.replaceAll(' ', "")
  let getNextStringName = createAlphaCounter();
  const entryPointName = getNextStringName()
  
  let eqMap = {}
  let stack = [
    createBracketInfo(entryPointName, 0)
  ]

  let arr = Array.from(equation)
  for (let i = 1; i < arr.length; i++) {

    if (arr[i] === '(') {
      console.log("Found open bracket at index:", i)
      const openBracketInfo = createBracketInfo(getNextStringName(), i)
      stack.push(openBracketInfo)
      stack[stack.length - 2].children.push(openBracketInfo.name)
    }
    else if (arr[i] === ')') {
      console.log("Found closed bracket at index:", i)
      if (stack.length === 0) {
        throw new Error("Unmatched parenthesis")
      }

      const openBracketInfo = stack.pop()
      console.log(openBracketInfo);

      const currentStackValue = eqMap[openBracketInfo.name] = {
        ...openBracketInfo,
        content: arr.slice(openBracketInfo.index, i + 1),
        children: openBracketInfo.children
      }

      console.log("arr before pop", arr);
      console.log("CurrentBracketInfo", openBracketInfo);
      console.log("CurrentStackValue", currentStackValue);

      const popped = arr.splice(
        openBracketInfo.index,
        currentStackValue.content.length,
        currentStackValue.name)

      console.log("popped as brackets", popped);
      console.log("arr after pop", arr);
      i = openBracketInfo.index;
    }
    else {
      let tokenizerTriggered = false

      for (const ttype of tokenTypes) {
        tokenizerTriggered = ttype.checkDelegate(arr[i])
        if (!tokenizerTriggered) {
          continue
        }

        console.log(`Found ${ttype.name} at index`, i, arr[i])
        const val = ttype.tokenizer(arr, i)
        console.log("Arr before token pop:", arr);
        const poppedForToken = arr.splice(val.absoluteStartIndex, val.resultStr.length, val.result)
        i = val.absoluteStartIndex
        console.log("poppedForToken:", poppedForToken, "New arr state:", arr, "Index before inc:", i)
        break
      }

      console.log("tokenizerTriggered:", tokenizerTriggered, "atIndex:", i, "Symbol", arr[i])
    }

    if (i === arr.length - 1) {
      console.log("Reached last index", "stack:", stack)
      if (stack.length > 0) {
        arr.push(')')
        console.log("Added brackets in the end. new arr:", arr)
      } else {
        console.log("Addition of closing brackets in the end not needed:", arr)
      }
    }
  }

  return { map: eqMap, entryPointName }
}