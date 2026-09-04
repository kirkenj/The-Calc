import type { Token } from "../Core/Token";
import type { PrevalidationResult } from "./PrevalidationResult";
import type { Result } from "../Core/Result";

export type FunctionValidatorDelegate = (equation: Token<any>[], index: number, notIgnoredTokenCheckCallback: (arg: Token) => boolean) => Result<PrevalidationResult>