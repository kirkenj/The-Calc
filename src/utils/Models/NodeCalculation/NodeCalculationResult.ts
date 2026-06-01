import { type Token } from "../Core/Token";

export interface NodeCalculationResult {
    name: string,
    content: Token[],
    map: Map<string, Token>,
    result: Token
}
