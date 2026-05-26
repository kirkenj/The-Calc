import type { Result } from "../Core/Result";
import type { Token } from "../Core/Token";
import type { TokenType } from "../Core/TokenType";
import type { StringCollectionDelegate } from "./StringCollectionDelegate";

export type EquationTokenParserDelegate = (
  equation: string,
  onTokenParsedCallback: ((token: Token) => void) | null,
  tokenTypes: TokenType[],
  tokenStringCollectionDelegate: StringCollectionDelegate
) => Result<Token[]>
