import { parseTokens } from "./tokenParser"
import { tokenTypeNames, tokenTypes } from "./tokenTypes"
import { createAlphaCounter } from "./alphaCounter"

const createBracketInfo = (name, index) => {
  return {
    index: index,
    name: name,
    children: [],
    content: [],
  }
}

export const parseTree = (equation) => {
  const defaultTokenTypeName = tokenTypeNames.Word
  const defaultTokenType = tokenTypes.find(t => t.name === defaultTokenTypeName)
  if (!defaultTokenType) {
    throw new Error(`Couldn't get default token type by name '${defaultTokenTypeName}'`)
  }

  let getNextStringName = createAlphaCounter();
  const entryPointName = getNextStringName()
  const eqMap = new Map()
  let stack = [
    createBracketInfo(entryPointName, 0)
  ]
  eqMap.set(entryPointName, stack[stack.length - 1])

  const onTokenParsed = (token) => {
    console.log("Token parsed:", token)
    const isOpenBracket = token.typeName === tokenTypeNames.OpenBracket
    if (isOpenBracket) {
      const newStackName = getNextStringName()
      const stackValueToPush = createBracketInfo(newStackName, token.initStringIndex)

      stack.push(stackValueToPush)
      eqMap.set(newStackName, stackValueToPush)

      console.log("Pushed stack value:", stackValueToPush)

      const tokenToPushIntoParent = defaultTokenType.tokenFactory(newStackName, token.initStringIndex, newStackName)
      const parentStackValue = stack[stack.length - 2]

      parentStackValue.content.push(tokenToPushIntoParent)
      parentStackValue.children.push(tokenToPushIntoParent.value)
    }

    stack[stack.length - 1].content.push(token)

    if (!isOpenBracket && token.typeName === tokenTypeNames.ClosedBracket) {
      stack.pop(stack.length - 1)
    }
  }

  const parsedTokens = parseTokens(equation, onTokenParsed)
  console.log("parsedTokens:", parsedTokens)
  console.log("stack:", stack)
  console.log("eqMap", eqMap)

  return { map: eqMap, entryPointName }
}