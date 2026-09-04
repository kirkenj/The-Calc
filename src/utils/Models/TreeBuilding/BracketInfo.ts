import { DoubleLinkedListClass, type Bidirectionalterator } from "../../IndexedCollections/DoubleLinkedListClass";
import type { Token } from "../Core/Token";

export interface BracketInfo {
  readonly index: number,
  readonly name: string,
  readonly children: DoubleLinkedListClass<string>,
  readonly content: DoubleLinkedListClass<Token>,
  readonly operators: Map<number, Bidirectionalterator<Token>[]>, // Priority -> Iterators
}


export const BracketInfo = {
  createBracketInfo: (name: string, index: number): BracketInfo => {
    return {
      index: index,
      name: name,
      children: new DoubleLinkedListClass<string>(),
      content: new DoubleLinkedListClass<Token>(),
      operators: new Map<number, Bidirectionalterator<Token>[]>(),
    }
  }
}