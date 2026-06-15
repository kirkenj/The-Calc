import type { DoubleLinkedListClass } from "../../IndexedCollections/DoubleLinkedListClass";
import { type Token, type ValueToken } from "../Core/Token";

export interface NodeCalculationResult {
    name: string,
    content: DoubleLinkedListClass<Token>,
    map: Map<string, Token>,
    result: ValueToken<number>
}
