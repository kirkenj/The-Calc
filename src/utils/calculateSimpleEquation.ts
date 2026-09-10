import { ValidationErrors } from './Constants/ValidationErrors';
import { tokenTypes } from './Constants/Types/TokenTypes';
import { getIndexOfFirst, getItemIndexToTheRightByCallback } from './Extensions/arrayUtils';
import { decrementValuesFromIndex, getIndexesOnPredicate } from './indexUtils';
import { Result } from './Models/Core/Result';
import { type Token, type ValueToken } from './Models/Core/Token';
import { type TokenType } from './Models/Core/TokenType';
import { getDefaultOperatorsAccordingToPriorities } from './operatorsAccordingToPriorities';
import { getOperatorsForVariables } from './variableResolver';

const ignoredByDefaultTokenTypes: TokenType[] = [tokenTypes.WhiteSpaceTokenType, tokenTypes.ClosedBracketTokenType, tokenTypes.OpenBracketTokenType]
const notIgnoredTokenCheckCallback = (token: Token): boolean => getIndexOfFirst(ignoredByDefaultTokenTypes, type => type.isInstance(token).success) === null

const operatorsTokenTypes: TokenType<ValueToken<string>>[] = [tokenTypes.WordTokenType, tokenTypes.SpecSymbolTokenType]

const getOperatorsForContext = (context: Map<string, Token> | null) => {
  const operatorsByPriority = getDefaultOperatorsAccordingToPriorities();
  const variables = getOperatorsForVariables(context)
  
  if (variables) {
    operatorsByPriority.unshift(variables)
  }

  return operatorsByPriority
}

const getCalculationResult = (
  tokens: Token[]
): Result<ValueToken<number>> => {
  const firstNotIgnoredTokenIndex = getIndexOfFirst(tokens, notIgnoredTokenCheckCallback)
  if (firstNotIgnoredTokenIndex === null) {
    return Result.Fail(ValidationErrors.EquationEmpty)
  }

  const secondNotIgnoredTokenIndex = getItemIndexToTheRightByCallback(tokens, firstNotIgnoredTokenIndex, notIgnoredTokenCheckCallback)
  if (secondNotIgnoredTokenIndex !== null) {
    return Result.Fail("not ignored tokens count > 1")
  }

  const isNumberCheckResult = tokenTypes.NumberTokenType.isInstance(tokens[firstNotIgnoredTokenIndex])
  if (!isNumberCheckResult.success) {
    return Result.Fail(ValidationErrors.InvalidTokenTypes)
  }

  return Result.Success(isNumberCheckResult.result)
}


export const indexationCallback = (token: Token) => {
  let valToRet: ValueToken<string> | null = null
  for (const type of operatorsTokenTypes) {
    const typeCheckResult = type.isInstance(token)
    if (typeCheckResult.success) {
      valToRet = typeCheckResult.result
      break
    }
  }

  return valToRet === null
    ? Result.Fail(ValidationErrors.InvalidOperatorContext)
    : Result.Success(valToRet)
}


export const calculateTokens = (
  tokens: Token[],
  context: Map<string, Token> | null = null
): Result<ValueToken<number>> => {
  const operatorsByPriority = getOperatorsForContext(context)

  const operatorIndexesResult = getIndexesOnPredicate(tokens, indexationCallback)
  if (!operatorIndexesResult.Success){
    return Result.Fail(operatorIndexesResult.Message)
  }

  const operatorIndexes = operatorIndexesResult.Result

  for (let k = 0; k < operatorsByPriority.length; k++) {
    const currenrPriorityOperators = operatorsByPriority[k]

    for (let i = 0; i < operatorIndexes.length; i++) {
      const operatorTokenIndex = operatorIndexes[i]

      const operatorToken = operatorTokenIndex.ref
      let operatorValue: string | null = null
      for (const opType of operatorsTokenTypes) {
        const check = opType.isInstance(operatorToken)
        if (check.success) {
          operatorValue = check.result.value
          break
        }
      }

      if (!operatorValue) {
        continue
      }

      const currentOperatorHandler = currenrPriorityOperators.operators.get(operatorValue)
      if (!currentOperatorHandler) {
        continue
      }

      const syntaxValidationResult = currenrPriorityOperators.syntaxValidator(
        tokens, operatorTokenIndex.index, notIgnoredTokenCheckCallback)

      if (!syntaxValidationResult.Success) {
        if (currenrPriorityOperators.fallIfSyntaxValidationFailed) {
          return Result.Fail(syntaxValidationResult.Message)
        }
        else {
          continue
        }
      }

      const res = currentOperatorHandler(tokens, syntaxValidationResult.Result)
      if (!res.Success) {
        return res
      }

      tokens.splice(
        syntaxValidationResult.Result.operationStartIndex,
        syntaxValidationResult.Result.operationLength,
        res.Result)

      operatorIndexes.splice(i, 1)
      decrementValuesFromIndex(operatorIndexes, i, (syntaxValidationResult.Result.operationLength - 1))
      i--
    }
  }

  const calculationResult = getCalculationResult(tokens)
  if (!calculationResult.Success) {
    return Result.Fail(calculationResult.Message)
  }

  const tokenToReturn: ValueToken<number> = {
    type: tokenTypes.NumberTokenType,
    value: calculationResult.Result.value,
    initStringIndex: tokens[0].initStringIndex,
    fromString: tokens.map(t => t.fromString).join("")
  }

  return Result.Success(tokenToReturn)
}
