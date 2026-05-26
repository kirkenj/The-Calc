export interface TokenTypeRestriction {
    readonly allowedSymbols: Set<string>,
    readonly symbolMembershipCheckCallback: (symbol: string) => boolean,
    readonly maxLength: number | null
}