# The-Calc Project Index

## Overview
**The-Calc** is a custom expression parser and calculator engine built with TypeScript and React. It features a modular architecture for tokenization, tree building (AST-like), and recursive evaluation.

## Core Architecture

### 1. Parsing (`src/utils/Parsing/`)
Responsible for converting a raw equation string into a structured list of tokens.
- `tokenParser.ts`: The main entry point for tokenization. It uses a list of `TokenType` definitions to identify and parse segments of the string.
- `tokenStringBuilder.ts`: Helper for collecting characters into token strings.

### 2. Tree Building (`src/utils/TreeBuilding/`)
Handles the hierarchy of the expression, specifically managing nested brackets.
- `treeBuilder.ts`: Builds a map of "BracketInfo" objects. Each bracketed sub-expression is treated as a separate node (alias) to simplify evaluation.
- `BracketInfo.ts`: Model representing a node in the expression tree.

### 3. Calculation (`src/utils/Calculation/`)
Executes the actual mathematical logic.
- `evaluateTreeUtils.ts`: Performs recursive evaluation of the tree nodes.
- `calculateSimpleEquation.ts`: Evaluates a flat list of tokens (without nested brackets, as they are pre-resolved by the tree builder).

### 4. Models (`src/utils/Models/`)
Defines the domain objects and types.
- `Core/`: Basic types like `Token`, `TokenType`, `Result`.
- `Parsing/`, `TreeBuilding/`, `EquationCalculation/`: Interfaces and delegates specific to each phase.

### 5. Utilities & Constants (`src/utils/`)
- `Constants/Types/`: Definitions for standard token types (Numbers, Words, Brackets, etc.).
- `operatorsAccordingToPriorities.ts`: Configuration for mathematical operator precedence and behavior.
- `syntaxValidators.ts`: Logic to ensure the equation is well-formed before calculation.
- `variableResolver.ts`: (Likely) handles resolving named variables within expressions.

### 6. Data Structures (`src/utils/IndexedCollections/`)
- `DoubleLinkedListClass.ts`: A custom doubly linked list implementation used throughout the project for efficient token manipulation.

## Key Logic Flows
1. **Equation String** → `tokenParser` → `DoubleLinkedList<Token>`
2. **Tokens** → `treeBuilder` → `Map<string, BracketInfo>` (Hierarchical Tree)
3. **Tree** → `evaluateNode` (Recursive) → **Final Result**

## Extension Points
- **Adding new operators**: Update `operatorsAccordingToPriorities.ts` and `operationHandlersUtils.ts`.
- **Adding new token types**: Create a new file in `src/utils/Constants/Types/` and add it to the parser configuration.
- **Custom validation**: Add logic to `syntaxValidators.ts`.
