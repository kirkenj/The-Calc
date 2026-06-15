import { DoubleLinkedListClass } from "../../IndexedCollections/DoubleLinkedListClass";
import type { Token } from "../Core/Token";

export interface BracketInfo {
  readonly index: number,
  readonly name: string,
  readonly children: DoubleLinkedListClass<string>,
  readonly content: DoubleLinkedListClass<Token>,
}


export const BracketInfo = {
  createBracketInfo: (name: string, index: number): BracketInfo => {
    return {
      index: index,
      name: name,
      children: new DoubleLinkedListClass<string>(),
      content: new DoubleLinkedListClass<Token>,
    }
  }
}