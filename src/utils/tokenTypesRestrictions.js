const numberAllowedSymbols = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."])
Object.freeze(numberAllowedSymbols)

const wordAllowedSymbols =  new Set(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'])
Object.freeze(wordAllowedSymbols)

const whiteSpaceAllowedSymbols = new Set([' '])
Object.freeze(whiteSpaceAllowedSymbols)

const specSymbolAllowedSymbols = new Set(['*', "/", "\\", "+", "-", ":", "^"])
Object.freeze(specSymbolAllowedSymbols)

const closedBracketAllowedSymbols = new Set([')'])
Object.freeze(closedBracketAllowedSymbols)

const openBracketAllowedSymbols = new Set(['('])
Object.freeze(openBracketAllowedSymbols)

export const numberRestrictions = {
    allowedSymbols: numberAllowedSymbols,
    symbolMembershipCheckCallback: (symbol) => numberAllowedSymbols.has(symbol),
    maxLength: null
}
Object.freeze(numberRestrictions)


export const wordRestrictions = {
    allowedSymbols: wordAllowedSymbols,
    symbolMembershipCheckCallback: (symbol) => wordAllowedSymbols.has(symbol),
    maxLength: null
}
Object.freeze(wordRestrictions)


export const whiteSpaceRestrictions ={
    allowedSymbols: whiteSpaceAllowedSymbols,
    symbolMembershipCheckCallback: (symbol) => whiteSpaceAllowedSymbols.has(symbol),
    maxLength: null
}
Object.freeze(whiteSpaceRestrictions)


export const specSymbolRestrictions = {
    allowedSymbols: specSymbolAllowedSymbols,
    symbolMembershipCheckCallback: (symbol) => specSymbolAllowedSymbols.has(symbol),
    maxLength: 1
}
Object.freeze(specSymbolRestrictions)

export const openBracketRestrictions = {
    allowedSymbols: openBracketAllowedSymbols,
    symbolMembershipCheckCallback: (symbol) => openBracketAllowedSymbols.has(symbol),
    maxLength: 1
}
Object.freeze(openBracketRestrictions)

export const closedBracketRestrictions = {
    allowedSymbols: closedBracketAllowedSymbols,
    symbolMembershipCheckCallback: (symbol) => closedBracketAllowedSymbols.has(symbol),
    maxLength: 1
}
Object.freeze(closedBracketRestrictions)