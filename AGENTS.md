# AGENTS.md - The-Calc

## Commands
- **Test:** `npx vitest run` (Run single test: `npx vitest run DoubleLinkedListClass`)
- **Build & Typecheck:** `npm run build` (`tsc -b && vite build`)
- **Lint:** `npm run lint` (`eslint .`)

## Architecture & Data Flow
- Custom expression parser and calculator engine in React + TypeScript.
- **Pipeline:** Equation String → `tokenParser` (`DoubleLinkedList<Token>`) → `treeBuilder` (`Map<string, BracketInfo>`) → `evaluateNode` (Recursive evaluation).
- See `PROJECT_INDEX.md` for module layout (`src/utils/Parsing/`, `src/utils/TreeBuilding/`, `src/utils/Calculation/`, `src/utils/IndexedCollections/`).

## Gotchas & Quirks
- **File Casing Imports:** Imports referencing `./defaultTokenTypeCheck` must match exact disk casing `DefaultTokenTypeCheck.ts` to prevent `TS1261` compilation errors on Windows.
- **Token Interfaces:** Base `Token` interface has no `value`. Use `ValueToken<T>` (`src/utils/Models/Core/Token.ts`) for tokens holding parsed values.
