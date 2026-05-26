import type { Result } from "../Core/Result";
import type { TokenStringCollectionResult } from "./TokenStringCollectionResult";

export type StringCollectionDelegate = (equation: string, index: number, symbolMembershipCheckCallback: (arg: string) => boolean, maxLength?: number | null) => Result<TokenStringCollectionResult>
