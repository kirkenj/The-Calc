import { tokenTypes } from "./tokenTypes"

//improvement idea: add check for existing equations, to avoid evaluation of same equations: (2+2)*(2+2) -> "@0*@0"    { "@0": { content: "(2+2)", children: [] }, "@1": { content: "(@0*@0)", children: ["@0"] }}
const createBracketInfo = (name, index) => {
  return {
    index: index,
    name: name,
    innerTokens: [],
    children: []
  }
}

export const parseBrackets = (equation) => {
  equation = '(' + equation.replaceAll(' ', "")
  let eqIDCounter = 0;
  let eqMap = {}
  let stack = [
    createBracketInfo(`@${eqIDCounter++}`, 0)
  ]

  let arr = Array.from(equation)


  for (let i = 1; i < arr.length; i++) {

    if (arr[i] === '(') {
      console.log("Found open bracket at index:", i)
      const openBracketInfo = createBracketInfo(`@${eqIDCounter++}`, i)
      stack.push(openBracketInfo)
      stack[stack.length - 2].children.push(openBracketInfo.name)
    }
    else if (arr[i] === ')') {
      console.log("Found clised bracket at index:", i)
      if (stack.length === 0) {
        throw new Error("Unmatched parenthesis")
      }

      const openBracketInfo = stack.pop()
      console.log(openBracketInfo);
      
      eqMap[openBracketInfo.name] = {
        content: arr.slice(openBracketInfo.index, i + 1),
        children: openBracketInfo.children
      }

      console.log("arr before pop", arr);
      const popped = arr.splice(openBracketInfo.index, openBracketInfo.innerTokens.length + 2, openBracketInfo)
      console.log("popped", popped);
      console.log("arr after pop", arr);
      
      // arr = arr.slice(0, openBracketInfo.index)
      //   + openBracketInfo.name
      //   + arr.slice(i + 1, arr.length)

      i = openBracketInfo.index + openBracketInfo.name.length - 1;
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
        arr.splice(val.absoluteStartIndex, val.resultStr.length, val.result)
        i = val.absoluteStartIndex
        console.log("Arr:", arr, "Index before inc:", i)
      }

      if (!tokenizerTriggered) {
        console.log("skipped item at index", i, arr[i])
      }

      const openBracketInfo = stack[stack.length - 1]
      openBracketInfo.innerTokens.push(arr[i])
    }

    if (i === arr.length - 1 && stack.length > 0) {
      arr.push([')'].repeat(stack.length))
      console.log("Added brackets in the end. new arr:", arr)
    }
  }


  console.log(stack);
  
  return eqMap
}