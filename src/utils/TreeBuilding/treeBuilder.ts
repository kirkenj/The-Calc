import { Result } from "../Models/Core/Result"
import { type Token } from "../Models/Core/Token"
import { type TokenType } from "../Models/Core/TokenType"
import { type StringCollectionDelegate } from "../Models/Parsing/StringCollectionDelegate"
import { type EquationTokenParserDelegate } from "../Models/Parsing/TokenParserDelegate"
import { BracketInfo } from "../Models/TreeBuilding/BracketInfo"
import { type ParseTreeResult } from "../Models/TreeBuilding/ParseTreeResult"
import { type TreeBuilderTriggerTypes } from "../Models/TreeBuilding/TreeBuilderTriggerTypes"
import { type TreeBuildingError } from "../Models/TreeBuilding/TreeBuildingError"


export function parseTree(
  equation: string,
  nameGenerator: () => string,
  builderTriggers: TreeBuilderTriggerTypes,
  tokenTypesToParse: TokenType[],
  parseEquationCallback: EquationTokenParserDelegate,
  stringCollectionDelegate: StringCollectionDelegate
): Result<ParseTreeResult> {
  console.groupCollapsed(`ParseTree`, equation);

  //#region validations
  if (equation.length === 0) {
    return Result.Fail("Equation must not be empty")
  }

  const triggerTypes = Object.values(builderTriggers)
  const uniqueTypes = new Set(triggerTypes);
  if (triggerTypes.length !== uniqueTypes.size) {
    return Result.Fail("Configuration error: Trigger types must be distinct (not the same object)");
  }

  const notFoundTokenType = triggerTypes.find(trigger => !tokenTypesToParse.includes(trigger))
  if (notFoundTokenType) {
    return Result.Fail("Configuration error: Trigger types must be in tokenTypesToParse");
  }
  //#endregion

  const entryPointName = nameGenerator()
  let stack: BracketInfo[] = [
    BracketInfo.createBracketInfo(entryPointName, 0)
  ]

  const eqMap = new Map<string, BracketInfo>()
  eqMap.set(entryPointName, stack[stack.length - 1])

  const treeBuildingError = { error: null }
  const onTokenParsed = createOnTokenParsedDelegate(stack, eqMap, nameGenerator, builderTriggers, treeBuildingError)

  const parseTokensResult = parseEquationCallback(equation, onTokenParsed, tokenTypesToParse, stringCollectionDelegate)
  if (!parseTokensResult.Success) {
    return parseTokensResult
  }

  if (treeBuildingError.error){
    return Result.Fail(treeBuildingError.error)
  }

  console.log("parsedTokens:", parseTokensResult)
  console.log("stack:", stack)
  console.log("eqMap", eqMap)

  console.groupEnd()
  return Result.Success({ eqMap, entryPointName })
}

function createOnTokenParsedDelegate(
  stack: BracketInfo[],
  eqMap: Map<string, BracketInfo>,
  nameGenerationCallback: () => string,
  builderTriggers: TreeBuilderTriggerTypes,
  errorContainer: TreeBuildingError
): (arg: Token) => void {

  return (token: Token) => {
    console.log("Token parsed:", token)
    if (errorContainer.error) {
      return
    }

    const isOpenBracket = token.type === builderTriggers.OpenBracket
    if (isOpenBracket) {
      const newStackName = nameGenerationCallback()
      const stackValueToPush = BracketInfo.createBracketInfo(newStackName, token.initStringIndex)

      stack.push(stackValueToPush)
      eqMap.set(newStackName, stackValueToPush)

      console.log("Pushed stack value:", stackValueToPush)

      const tokenToPushIntoParent = {
        ...token,
        fromString: newStackName,
        type: builderTriggers.TypeUsedForAliases
      }

      const parentStackValue = stack[stack.length - 2]

      parentStackValue.content.push(tokenToPushIntoParent)
      parentStackValue.children.push(tokenToPushIntoParent.fromString)
    }

    stack[stack.length - 1].content.push(token)

    if (!isOpenBracket && token.type === builderTriggers.ClosedBracket) {
      if (stack.length <= 1) {
        return errorContainer.error = `Bracket mismatch at index ${token.initStringIndex}`
      }

      stack.pop()
    }
  }
}