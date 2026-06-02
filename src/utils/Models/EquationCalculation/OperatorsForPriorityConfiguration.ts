import type { FunctionValidatorDelegate } from "./FunctionValidatorDelegate";
import type { HandlerDelegate } from "./HandleEquationrDelegate";

export interface OperatorsForPriorityConfiguration {
  operators: Map<string, HandlerDelegate>,
  syntaxValidator: FunctionValidatorDelegate,
  fallIfSyntaxValidationFailed: boolean
}