import { Result } from "./Models/Core/Result";
import { type Token } from "./Models/Core/Token";
import { type TokenType } from "./Models/Core/TokenType";
import { type BracketInfo } from "./Models/TreeBuilding/BracketInfo";


interface NodeCalculationResult {
    name: string,
    content: Token[],
    map: Map<string, Token>,
    result: Token
}


export const evaluateNode = (
    tree: Map<string, BracketInfo>,
    nodeName: string,
    calculationResultExpectedType: TokenType,
    calculateSimpleEquationCallback: (tokensToCalculate: Token[], context: Map<string, Token>) => Result<Token>
): Result<NodeCalculationResult> => {
    const node = tree.get(nodeName)
    if (!node) {
        return Result.Fail("node is null")
    }

    let evaluationToCalculate = node.content;
    const map = new Map<string, Token>();
    if (node.children.length > 0) {
        for (const childName of node.children) {
            const nodeCalculationResult = evaluateNode(tree, childName, calculationResultExpectedType, calculateSimpleEquationCallback)
            if (!nodeCalculationResult.Success){
                return nodeCalculationResult
            }

            console.log("Child:", childName, "Child result token:", nodeCalculationResult)
            map.set(childName, nodeCalculationResult.Result.result)
        }
    }

    console.log("evaluationToCalculate:", evaluationToCalculate,
        "node:", node,
        "map:", map)

    const calculationResult = calculateSimpleEquationCallback(evaluationToCalculate, map)
    if (!calculationResult.Success){
        return calculationResult
    }
    
    if (!calculationResult || calculationResult.Result.type !== calculationResultExpectedType) {
        return Result.Fail("Invalid calculation result")
    }

    const valueToReturn: NodeCalculationResult = {
        name: nodeName,
        content: node.content,
        map,
        result: calculationResult.Result
    }

    console.log("valueToReturn", valueToReturn);

    return Result.Success(valueToReturn)
}