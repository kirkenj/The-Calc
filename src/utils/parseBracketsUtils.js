//improvement idea: add check for existing equations, to avoid evaluation of same equations: (2+2)*(2+2) -> "@0*@0"    { "@0": { content: "(2+2)", children: [] }, "@1": { content: "(@0*@0)", children: ["@0"] }}
const createBracketInfo = (name, index) => {
  return {
    index: index,
    name: name,
    children: []
  }
}

export const parseBrackets = (equation) => {
  equation = '(' + equation.replaceAll(' ', "")
  let eqIDCounter = 0;
  let eqMap = {}
  let stack = [
    createBracketInfo(`@${eqIDCounter++}`, 0)
  ]
  for (let i = 1; i < equation.length; i++) {

    if (equation[i] === '(') {
      const openBracketInfo = createBracketInfo(`@${eqIDCounter++}`, i)
      stack.push(openBracketInfo)
      stack[stack.length - 2].children.push(openBracketInfo.name)
    }

    if (equation[i] === ')') {
      if (stack.length === 0) {
        throw new Error("Unmatched parenthesis")
      }

      const openBracketInfo = stack.pop()
      eqMap[openBracketInfo.name] = {
        content: equation.slice(openBracketInfo.index, i + 1),
        children: openBracketInfo.children
      }

      equation = equation.slice(0, openBracketInfo.index)
        + openBracketInfo.name
        + equation.slice(i + 1, equation.length)

      i = openBracketInfo.index + openBracketInfo.name.length - 1;
    }

    if (i === equation.length - 1 && stack.length > 0){
      equation += ')'.repeat(stack.length);
    }
  }

  return eqMap
}