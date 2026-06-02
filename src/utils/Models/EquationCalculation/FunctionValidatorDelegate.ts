import type { Token } from "../Core/Token";
import type { PrevalidationResult } from "./PrevalidationResult";

export type FunctionValidatorDelegate = (equation: Token<any>[], index: number, notIgnoredTokenCheckCallback: (arg: Token) => boolean) => PrevalidationResult | null
