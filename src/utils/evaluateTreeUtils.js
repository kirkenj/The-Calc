import { calculateTokens } from "./calculateSimpleEquation";
import { tokenTypeNames } from "./tokenTypes";

const evaluateNode = (tree, nodeName) => {
    console.groupCollapsed("tree:", tree, 
        "nodeName:", nodeName)

    const node = tree.get(nodeName)
    if (!node) {
        throw Error("node is null")
    }

    let evaluationToCalculate = node.content;
    const map = new Map();
    if (node.children.length > 0) {
        node.children.forEach(child => {
            const key = child
            const childNodeEvaluationResultToken = evaluateNode(tree, key).result
            console.log("Child:", key, "Child result token:", childNodeEvaluationResultToken)
            map.set(child, childNodeEvaluationResultToken)
        });
    }
    
    console.log("evaluationToCalculate:", evaluationToCalculate, 
        "node:", node, 
        "map:", map)

    const calculationResultToken = calculateTokens(evaluationToCalculate, map)
    if (!calculationResultToken || calculationResultToken.typeName !== tokenTypeNames.Number) {
        throw Error("Invalid calculation result")
    }

    const valueToReturn = {
        name: nodeName,
        content: node.content,
        map,
        result: calculationResultToken
    }

    console.log("valueToReturn", valueToReturn);

    console.groupEnd()
    return valueToReturn
}


export const evaluateTree = (parseResult) => {
    console.groupCollapsed("evaluateTree", parseResult)
    if (!parseResult || !parseResult.map || !parseResult.entryPointName) {
        throw Error("tree is null")
    }

    console.groupEnd()
    return evaluateNode(parseResult.map, parseResult.entryPointName).result
}