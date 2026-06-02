import { getIndexOfFirst } from "../../Extensions/arrayUtils";
import type { IsInstanceResult } from "../../Models/Core/IsInstanceResult";
import type { Token, ValueToken } from "../../Models/Core/Token";
import type { TokenType } from "../../Models/Core/TokenType";

export function DefaultTokenIsInstance<TToken extends Token<any>>(
    token: TToken,
    tokenType: TokenType<TToken>,
): IsInstanceResult<TToken> {
    const typeRestriction = tokenType.tokenStringRestriction
    if (token.type !== tokenType
        || (typeRestriction.maxLength && token.fromString.length > typeRestriction.maxLength)
        || getIndexOfFirst(token.fromString, (s) => !typeRestriction.symbolMembershipCheckCallback(s)) !== null
    ) {
        return { success: false };
    }

    return { success: true, result: token as TToken }
}