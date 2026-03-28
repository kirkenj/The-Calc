//import Calculator from "./features/Calculator/Calculator";

import { calculateSimpleEquation } from "./utils/calculateSimpleEquation";
//import { evaluateTree } from "./utils/evaluateTreeUtils";
//import { parseBrackets } from "./utils/parseBracketsUtils";


function App() {
  //const tree = parseBrackets("10 + 2")
  //const tree = parseBrackets("10 + ( 5 * ( 6 / 2 ) - (3 + 5)) + (18 + 121)")
  // const tree = parseBrackets("(-5.5+2*1.5-4.5/-1.5)")
  // const result = evaluateTree(tree)
  // console.log(result)
 
  const res = calculateSimpleEquation("(-5.5+2*1.5-4.5/-1.5)")
  console.log(res);
  
  // return (
  //   // <Calculator/>
  // );
}

export default App;