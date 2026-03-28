import { calculateSimpleEquation } from "./calculateSimpleEquation";


const evaluateNode = (tree, nodeName) => {
    const node = tree[nodeName]
    if (!node) {
        throw Error("node is null")
    }

    let evaluationToCalculate;

    if (node.children.length > 0) {
        let nodeEquation = node.content
        const childrenValues = node.children.map(child => {
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
    }

    const valueToReturn = {
        name: nodeName,
        initNode: node,
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