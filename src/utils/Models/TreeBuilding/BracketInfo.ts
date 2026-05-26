import type { Token } from "../Core/Token";

export interface BracketInfo {
  readonly index: number,
  readonly name: string,
  readonly children: string[],
  readonly content: Token[],
}


export const BracketInfo = {
  createBracketInfo: (name: string, index: number): BracketInfo => {
    return {
      index: index,
      name: name,
      children: [],
      content: [],
    }
  }
}