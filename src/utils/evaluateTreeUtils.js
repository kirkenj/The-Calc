import { calculateSimpleEquation } from "./calculateSimpleEquation";

const evaluateNode = (tree, nodeName) => {
    const node = tree[nodeName]
    if (!node) {
        throw Error("node is null")
    }

    let evaluationToCalculate = node.content;
    const context = node.children.length <= 0
        ? []
        : node.children.map(child => {
            return {
                key: child,
                value: evaluateNode(tree, child).result,
            }
        })

    console.log("evaluationToCalculate:", evaluationToCalculate, "node:", node)
    const calculationResult = calculateSimpleEquation(evaluationToCalculate, true, context)
    if (!calculationResult || typeof calculationResult !=='number'){
        throw Error("Invalid calculation result")
    }

    const valueToReturn = {
        name: nodeName,
        content: node.content,
        context,
        result: calculationResult 
    }

    console.log("valueToReturn", valueToReturn);
    return valueToReturn
}


export const evaluateTree = (parseResult) => {
    console.log("evaluateTree executed")
    if (!parseResult || !parseResult.map || !parseResult.entryPointName) {
        throw Error("tree is null")
    }

    return evaluateNode(parseResult.map, parseResult.entryPointName).result
}