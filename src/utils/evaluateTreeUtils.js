import { calculateSimpleEquation } from "./calculateSimpleEquation";

const evaluateNode = (tree, nodeName) => {
    const node = tree[nodeName]
    if (!node) {
        throw Error("node is null")
    }

    let evaluationToCalculate = node.content;
    const map = new Map();
    if (node.children.length > 0) {
        node.children.forEach(child => {
            const key = child
            const value = evaluateNode(tree, key).result
            console.log("Child:", key, "Child value:", value)
            map.set(child, value)
        });
    }
    
    console.log("evaluationToCalculate:", evaluationToCalculate, "node:", node, "map:", map)
    const calculationResult = calculateSimpleEquation(evaluationToCalculate, true, map)
    if (!calculationResult || typeof calculationResult !== 'number') {
        throw Error("Invalid calculation result")
    }

    const valueToReturn = {
        name: nodeName,
        content: node.content,
        map,
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