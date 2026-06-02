import type { Token, ValueToken } from "../Core/Token";
import type { PrevalidationResult } from "./PrevalidationResult";

export type HandlerDelegate = (equation: Token[], prevalidationResult: PrevalidationResult) => ValueToken<number>
