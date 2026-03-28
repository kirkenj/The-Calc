import { getCurrentNumberString } from '../utils/getCurrenNumberUtil';

describe('getCurrentNumberString: Full TDD Suite', () => {

    /**
     * SECTION 1: Standard Positioning (Caret Affinity)
     * Testing how the caret "sticks" to numbers around operators
     */
    describe('Standard Positioning in "5+3"', () => {
        test('index 0 (caret before 5) returns "5" at absolute 0, relative 0', () => {
            expect(getCurrentNumberString("5+3", 0)).toEqual({
                number: "5",
                absoluteStartIndex: 0,
                relativeCaretIndex: 0
            });
        });

        test('index 1 (caret after 5) returns "5" at absolute 0, relative 1', () => {
            expect(getCurrentNumberString("5+3", 1)).toEqual({
                number: "5",
                absoluteStartIndex: 0,
                relativeCaretIndex: 1
            });
        });

        test('index 2 (caret after plus) returns "3" at absolute 2, relative 0', () => {
            expect(getCurrentNumberString("5+3", 2)).toEqual({
                number: "3",
                absoluteStartIndex: 2,
                relativeCaretIndex: 0
            });
        });
    });

    /**
     * SECTION 2: Complex Numbers & Delimiters
     * Testing multi-digit expansion and decimals
     */
    describe('Multi-digit and Decimals', () => {
        test('extracts "345" from "12+345" when caret is in the middle (index 4)', () => {
            expect(getCurrentNumberString("12+345", 4)).toEqual({
                number: "345",
                absoluteStartIndex: 3,
                relativeCaretIndex: 1 // Right after '3'
            });
        });

        test('handles decimal points correctly: "3.14*2" (index 2)', () => {
            expect(getCurrentNumberString("3.14*2", 2)).toEqual({
                number: "3.14",
                absoluteStartIndex: 0,
                relativeCaretIndex: 2 // Right after '.'
            });
        });
    });

    /**
     * SECTION 3: Unary Minus (The Boss Fight)
     * Testing if the minus is correctly swallowed or ignored
     */
    describe('Unary Minus Logic', () => {
        test('includes minus at the start of string: "-42"', () => {
            expect(getCurrentNumberString("-42", 1)).toEqual({
                number: "-42",
                absoluteStartIndex: 0,
                relativeCaretIndex: 1
            });
        });

        test('includes minus after an operator: "5*-3"', () => {
            expect(getCurrentNumberString("5*-3", 3)).toEqual({
                number: "-3",
                absoluteStartIndex: 2,
                relativeCaretIndex: 1 // Right after '-'
            });
        });

        test('treats minus as separator if preceded by a number: "5-3"', () => {
            // Caret at index 2 (before 3)
            expect(getCurrentNumberString("5-3", 2)).toEqual({
                number: "3",
                absoluteStartIndex: 2,
                relativeCaretIndex: 0
            });
        });
    });

    /**
     * SECTION 4: Boundary Cases & Brackets
     */
    describe('Boundaries and Parentheses', () => {
        test('stops expansion at parentheses: "(42)"', () => {
            expect(getCurrentNumberString("(42)", 2)).toEqual({
                number: "42",
                absoluteStartIndex: 1,
                relativeCaretIndex: 1
            });
        });
    });

    /**
     * SECTION 5: Defensive Programming (Invalid Inputs)
     */
    describe('Invalid Arguments', () => {
        test('returns null for non-string equations', () => {
            // @ts-ignore
            expect(getCurrentNumberString(null, 0)).toBe(null);
            // @ts-ignore
            expect(getCurrentNumberString(123, 0)).toBe(null);
        });

        test('returns null for out-of-bounds index', () => {
            expect(getCurrentNumberString("5+3", -1)).toBe(null);
            expect(getCurrentNumberString("5+3", 99)).toBe(null);
        });
        
        test('returns null for NaN index', () => {
            expect(getCurrentNumberString("5+3", NaN)).toBe(null);
        });
    });
});