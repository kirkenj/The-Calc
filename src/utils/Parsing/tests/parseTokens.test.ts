import { describe, it, expect, vi } from 'vitest';
import { parseTokens } from '../tokenParser';
import { type TokenType } from '../../Models/Core/TokenType';
import type { TokenStringCollectionResult } from '../../Models/Parsing/TokenStringCollectionResult';
import { Result } from '../../Models/Core/Result';

// ==========================================
// 1. MOCK DATA FOR ISOLATED TESTING
// ==========================================

const allowedSymbolsA = new Set(["A"]);
const mockTokenTypeA: TokenType = {
  name: "TypeA",
  tokenStringRestriction: {
    allowedSymbols: allowedSymbolsA,
    symbolMembershipCheckCallback: (sym) => allowedSymbolsA.has(sym),
    maxLength: null
  },
  tokenParser: (res: TokenStringCollectionResult) => (Result.Success({
    type: mockTokenTypeA,
    initStringIndex: res.absoluteStartIndex,
    fromString: res.tokenString
  }))
};

const allowedSymbolsB = new Set(["B"]);
const mockTokenTypeB: TokenType = {
  name: "TypeB",
  tokenStringRestriction: {
    allowedSymbols: allowedSymbolsB,
    symbolMembershipCheckCallback: (sym) => allowedSymbolsB.has(sym),
    maxLength: null
  },
  tokenParser: (res: TokenStringCollectionResult) => (Result.Success({
    type: mockTokenTypeB,
    initStringIndex: res.absoluteStartIndex,
    fromString: res.tokenString
  }))
};

const mockTokenTypes = [mockTokenTypeA, mockTokenTypeB];

// Mock delegate that greedily collects identical consecutive characters
const mockDelegate = (
  equation: string,
  index: number,
  checkCallback: (arg: string) => boolean
): Result<TokenStringCollectionResult> => {
  let str = "";
  let curr = index;

  while (curr < equation.length && checkCallback(equation[curr])) {
    str += equation[curr];
    curr++;
  }

  return Result.Success({
    tokenString: str,
    absoluteStartIndex: index,
    relativeCaretIndex: curr - index
  });
};

// ==========================================
// 2. TEST SUITE
// ==========================================

describe('parseTokens Engine', () => {

  it('Should return a fail when the equation string is empty', () => {
    const result = parseTokens("", null, mockTokenTypes, mockDelegate);
    expect(result.Success).toBe(false);
    expect(result.Result).toBe(null);
    expect(result.Message).toBe("InvalidArgument: equation");
  });

  it('Should return a fail when tokenTypes array is empty', () => {
    const result = parseTokens("A", null, [], mockDelegate);
    expect(result.Success).toBe(false);
    expect(result.Result).toBe(null);
    expect(result.Message).toBe("InvalidArgument: tokenTypes");
  });

  it('Should return a fail on unknown symbol (Fail-Fast behavior)', () => {
    const result = parseTokens("AAC", null, mockTokenTypes, mockDelegate);
    expect(result.Success).toBe(false);
    expect(result.Result).toBe(null);// Array contains only A and B. Symbol 'C' should trigger the guard clause.
    expect(result.Message).toBe("Unknown token 'C' at index 2");
  });

  // 🔥 THE CORE INDEX SHIFTING TEST 🔥
  it('Should correctly shift the loop index (i += token.fromString.length)', () => {
    // Wrap our delegate in a spy to track invocation arguments
    const spyDelegate = vi.fn(mockDelegate);

    // Equation "AAABBB". 
    // Step 1: Finds "AAA" (length 3).
    // Step 2: Finds "BBB" (length 3).
    const result = parseTokens("AAABBB", null, mockTokenTypes, spyDelegate);

    // Assert final parsing results
    expect(result.Success).toBe(true);
    if (result.Success) {
      expect(result.Result).toHaveLength(2);
      expect(result.Result[0].fromString).toBe("AAA"); // Никаких "!"
      expect(result.Result[1].fromString).toBe("BBB");
    }
    // ASSERT INDEX SHIFTING:
    // Delegate should be called exactly twice
    expect(spyDelegate).toHaveBeenCalledTimes(2);

    // First call: starting at index 0
    expect(spyDelegate.mock.calls[0][1]).toBe(0);

    // Second call: index should have shifted exactly by the length of "AAA" (index 3)
    expect(spyDelegate.mock.calls[1][1]).toBe(3);
  });

  it('Should execute onTokenParsedCallback for each successfully parsed token', () => {
    const callbackSpy = vi.fn();

    parseTokens("AB", callbackSpy, mockTokenTypes, mockDelegate);

    expect(callbackSpy).toHaveBeenCalledTimes(2);
    // Verify that the correct tokens were passed to the callback
    expect(callbackSpy.mock.calls[0][0].fromString).toBe("A");
    expect(callbackSpy.mock.calls[1][0].fromString).toBe("B");
  });

});