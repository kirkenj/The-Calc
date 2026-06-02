import { type TokenType } from "./TokenType"

export interface Token<Tself extends Token<any> = any> {
  readonly type: TokenType<Tself>,
  readonly initStringIndex: number,
  readonly fromString: string
}

export interface ValueToken<T> extends Token<ValueToken<T>> {
  value: T
}