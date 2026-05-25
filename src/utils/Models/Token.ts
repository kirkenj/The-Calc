import { type TokenType } from "./TokenType"

export interface Token {
  type: TokenType,
  initStringIndex: number,
  fromString: string
}

export interface ValueToken<T> extends Token {
  value: T
}