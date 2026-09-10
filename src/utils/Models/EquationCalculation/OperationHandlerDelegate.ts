import type { Result } from "../Core/Result";
import type { Token, ValueToken } from "../Core/Token";
import type { PrevalidationResult } from "./PrevalidationResult";

export type OperationHandlerDelegate = (equation: Token[], prevalidationResult: PrevalidationResult) => Result<ValueToken<number>>
