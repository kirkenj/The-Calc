import { type TokenType } from "./TokenType"

export interface Token {
  readonly type: TokenType,
  readonly initStringIndex: number,
  readonly fromString: string
}

export interface ValueToken<T> extends Token {
  value: T
}