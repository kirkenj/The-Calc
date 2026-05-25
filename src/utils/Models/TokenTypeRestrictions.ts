export interface TokenTypeRestriction {
    allowedSymbols: Set<string>,
    symbolMembershipCheckCallback: (symbol: string) => boolean,
    maxLength: number | null
}