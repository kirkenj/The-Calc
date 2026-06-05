import { type Token, type ValueToken } from "../Core/Token";

export interface NodeCalculationResult {
    name: string,
    content: Token[],
    map: Map<string, Token>,
    result: ValueToken<number>
}
