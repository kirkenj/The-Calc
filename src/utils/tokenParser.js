import { tokenTypes } from "./tokenTypes"

export const parseTokens = (equation, onTokenParsedCallback = null) => {
  if (!equation || equation.length === 0){
    throw Error("InvalidArgument: equation")
  }

  const isOnTokenParsedCallbackPassed = onTokenParsedCallback != null
  if (isOnTokenParsedCallbackPassed && onTokenParsedCallback.length !== 1){
    throw Error("InvalidArgument: onTokenParsedCallback")
  }

  let i = 0;
  const tokens = []
  while (i < equation.length) {
    let tokenizerExecuted = false;

    for (const tokenType of tokenTypes) {
      if (!tokenType.charCheckDelegate(equation[i])) {
        continue
      }

      tokenizerExecuted = true
      console.log(`Found ${tokenType.name} at index`, i, equation[i])

      const parsedTokenString = tokenType.tokenStringCollector(equation, i)
      const token = tokenType.tokenFactory(parsedTokenString.result, i, parsedTokenString.resultStr)

      console.log("Token parse result:", token)

      if (isOnTokenParsedCallbackPassed){
        onTokenParsedCallback(token)
      }

      tokens.push(token)

      i += token.fromSlice.length - 1
      break
    }

    if (!tokenizerExecuted) {
      throw Error(`Unknown token '${equation[i]}' at index ${i}`)
    }

    i++;
  }

  return tokens
}