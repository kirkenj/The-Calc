import type { Token } from "./Token";

export type IsInstanceResult<TToken extends Token> =
  | { success: true, result: TToken }
  | { success: false };
