import { calculateSimpleEquation } from "./calculateSimpleEquation";


const evaluateNode = (tree, nodeName) => {
    const node = tree[nodeName]
    if (!node) {
        throw Error("node is null")
    }

    let evaluationToCalculate;
    let childrenValues;
    if (node.children.length > 0) {
        let nodeEquation = node.content
        childrenValues = node.children.map(child => {
            return {
                ...evaluateNode(tree, child),
                name: child,
            }
        })

        childrenValues.forEach(element => {
            nodeEquation = nodeEquation.replaceAll(element.name, element.result)
        });

        evaluationToCalculate = nodeEquation
    }
    else {
        evaluationToCalculate = node.content
        childrenValues = []
    }

    const valueToReturn = {
        name: nodeName,
        initNode: node,
        childrenValues,
        result: calculateSimpleEquation(evaluationToCalculate)
    }

    console.log("valueToReturn", valueToReturn);

    return valueToReturn
}


export const evaluateTree = (tree) => {
    console.log("evaluateTree executed")
    if (!tree) {
        throw Error("tree is null")
    }

    return evaluateNode(tree, "@0").result
}