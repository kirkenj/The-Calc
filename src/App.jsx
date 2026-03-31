//import Calculator from "./features/Calculator/Calculator";

import { calculateSimpleEquation } from "./utils/calculateSimpleEquation";
import { evaluateTree } from "./utils/evaluateTreeUtils";
import { parseBrackets } from "./utils/parseBracketsUtils";


function App() {
  return (
    <button onClick={() => {
      const tree = parseBrackets("10 + ( 5 * ( 6 / 2 ) - (3 + 5)) + (18 + 121) + (( 6 / 2 )")
      //const tree = parseBrackets("(-5.5+2*1.5-4.5/-1.5)")
      //console.log(tree)
      const result = evaluateTree(tree)
      //const result = calculateSimpleEquation("(-5.5+2*1.5-4.5/-1.5)")
      console.log(result)
    }}>Start</button>
  )}

export default App;