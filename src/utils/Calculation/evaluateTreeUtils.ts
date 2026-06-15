import { type NodeCalculationResult } from "../Models/NodeCalculation/NodeCalculationResult";
import { Result } from "../Models/Core/Result";
import { type Token, type ValueToken } from "../Models/Core/Token";
import { type BracketInfo } from "../Models/TreeBuilding/BracketInfo";
import { type DoubleLinkedListClass } from "../IndexedCollections/DoubleLinkedListClass";


export const evaluateNode = (
    tree: Map<string, BracketInfo>,
    nodeName: string,
    calculateSimpleEquationCallback: (tokensToCalculate: DoubleLinkedListClass<Token>, context: Map<string, ValueToken<number>>) => Result<ValueToken<number>>
): Result<NodeCalculationResult> => {
    const node = tree.get(nodeName)
    if (!node) {
        return Result.Fail("node is null")
    }

    const evaluationToCalculate = node.content;
    const map = new Map<string, ValueToken<number>>();
    if (node.children.length > 0) {
        const iterator = node.children.GetIteratorAtIndex(0)
        if (iterator === null){
            throw Error("Couldn't get an iterator for not empty list")
        }

        do {
            const childName = iterator.GetValue()
            const nodeCalculationResult = evaluateNode(tree, childName, calculateSimpleEquationCallback)
            if (!nodeCalculationResult.Success) {
                return nodeCalculationResult
            }

            console.log("Child:", childName, "Child result token:", nodeCalculationResult)
            map.set(childName, nodeCalculationResult.Result.result)
        } while (iterator.MoveNext())
    }

    console.log("evaluationToCalculate:", evaluationToCalculate,
        "node:", node,
        "map:", map)

    const calculationResult = calculateSimpleEquationCallback(evaluationToCalculate, map)
    if (!calculationResult.Success) {
        return calculationResult
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