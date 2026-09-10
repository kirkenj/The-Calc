import { Result } from "../Models/Core/Result"
import { type Token, type ValueToken } from "../Models/Core/Token"
import { type TokenType } from "../Models/Core/TokenType"
import { type StringCollectionDelegate } from "../Models/Parsing/StringCollectionDelegate"
import { type EquationTokenParserDelegate } from "../Models/Parsing/TokenParserDelegate"
import { BracketInfo } from "../Models/TreeBuilding/BracketInfo"
import { type ParseTreeResult } from "../Models/TreeBuilding/ParseTreeResult"
import { type TreeBuilderTriggerTypes } from "../Models/TreeBuilding/TreeBuilderTriggerTypes"
import { type TreeBuildingError } from "../Models/TreeBuilding/TreeBuildingError"
import { tokenTypes } from "../Constants/Types/TokenTypes"
import { getDefaultOperatorsAccordingToPriorities } from "../operatorsAccordingToPriorities"

const operatorsPriorityMap = new Map<string, number>();
const operatorsConfig = getDefaultOperatorsAccordingToPriorities();
operatorsConfig.forEach((config, priority) => {
  for (const op of config.operators.keys()) {
    operatorsPriorityMap.set(op, priority);
  }
});

export function parseTree(
  equation: string,
  nameGenerator: () => string,
  builderTriggers: TreeBuilderTriggerTypes,
  tokenTypesToParse: TokenType[],
  parseEquationCallback: EquationTokenParserDelegate,
  stringCollectionDelegate: StringCollectionDelegate
): Result<ParseTreeResult> {
  console.groupCollapsed(`ParseTree`, equation);

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

  const entryPointName = nameGenerator()
  const stack: BracketInfo[] = []
  const initialBracket = BracketInfo.createBracketInfo(entryPointName, 0)
  stack.push(initialBracket)

  const eqMap = new Map<string, BracketInfo>()
  eqMap.set(entryPointName, initialBracket)

  const treeBuildingError = { error: null }
  const onTokenParsed = createOnTokenParsedDelegate(stack, eqMap, nameGenerator, builderTriggers, treeBuildingError)

  const parseTokensResult = parseEquationCallback(equation, onTokenParsed, tokenTypesToParse, stringCollectionDelegate)
  if (!parseTokensResult.Success) {
    return parseTokensResult
  }

  if (treeBuildingError.error){
    return Result.Fail(treeBuildingError.error)
  }

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
    if (errorContainer.error) return

    const topBracket = stack[stack.length - 1]
    if (!topBracket) {
      errorContainer.error = "Stack is empty"
      return
    }

    const isOpenBracket = builderTriggers.OpenBracket.isInstance(token).success
    const isClosedBracket = builderTriggers.ClosedBracket.isInstance(token).success

    if (isOpenBracket) {
      const newStackName = nameGenerationCallback()
      const newBracket = BracketInfo.createBracketInfo(newStackName, token.initStringIndex)

      eqMap.set(newStackName, newBracket)

      const aliasToken: ValueToken<string> = {
        ...token,
        fromString: newStackName,
        type: builderTriggers.TypeUsedForAliases,
        value: newStackName 
      }

      topBracket.content.push(aliasToken)
      topBracket.children.push(newStackName)
      
      stack.push(newBracket)
      return 
    }

    if (isClosedBracket) {
      if (stack.length <= 1) {
        errorContainer.error = `Bracket mismatch at index ${token.initStringIndex}`
        return
      }
      stack.pop()
      return
    }

    let tokenToPush = token
    
    const specSymbolCheck = tokenTypes.SpecSymbolTokenType.isInstance(token)
    if (specSymbolCheck.success && specSymbolCheck.result.value === "-") {
      const lastToken = topBracket.content.tailValue
      let lastTokenValue: string | null = null
      if (lastToken) {
        for (const opType of [tokenTypes.WordTokenType, tokenTypes.SpecSymbolTokenType]) {
          const check = opType.isInstance(lastToken)
          if (check.success) {
            lastTokenValue = check.result.value
            break
          }
        }
      }

      const isUnary = !lastToken || 
                     builderTriggers.OpenBracket.isInstance(lastToken).success || 
                     (lastTokenValue !== null && operatorsPriorityMap.has(lastTokenValue))

      if (isUnary) {
        tokenToPush = { ...token, type: tokenTypes.WordTokenType, value: "unary-" } as any
      }
    }

    topBracket.content.push(tokenToPush)
    
    let tokenToPushValue: string | null = null
    for (const opType of [tokenTypes.WordTokenType, tokenTypes.SpecSymbolTokenType]) {
      const check = opType.isInstance(tokenToPush)
      if (check.success) {
        tokenToPushValue = check.result.value
        break
      }
    }

    const priority = tokenToPushValue !== null ? operatorsPriorityMap.get(tokenToPushValue) : undefined
    if (priority !== undefined) {
      const iter = topBracket.content.GetTailIterator()
      if (iter) {
        const list = topBracket.operators.get(priority) || []
        list.push(iter)
        topBracket.operators.set(priority, list)
      }
    }
  }
}