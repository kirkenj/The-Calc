// import Calculator from "./features/Calculator/Calculator";

import { evaluateTree } from "./utils/evaluateTreeUtils";


import { parseTree } from "./utils/treeBuilder";

// const originalLog = console.log;

// // Перехватываем управление
// console.log = function (...args) {
//   const safeArgs = args.map(arg => {
//     // Если это объект или массив, делаем глубокую копию
//     if (typeof arg === 'object' && arg !== null) {
//       return JSON.parse(JSON.stringify(arg));
//     }
//     return arg; // Строки и числа оставляем как есть
//   });
//   // Вызываем настоящий логгер с безопасными копиями
//   originalLog.apply(console, safeArgs);
// };


function App() {



  return (
    <>
      {/* <Calculator /> */}

      <button onClick={() => {


        //console.log("defaultDefinedNames:", defaultDefinedNames)
        //const parseResult = parseTree("10 + ( 5 * ( 6 / 2 )) + 4")
        //const parseResult = parseTree("10 + ( 5 * ( 6 / 2 )")
        const parseResult = parseTree("100 + ( 60            / 2 )")
        //const parseResult = parseTree("(((()())()(", onTokenParsed)
        //const parseResult = parseTree("10 + sin( 5 * ( 6 //// 2 ) - (3 + 5)) + (18 + 121) + (( -6 / 2 )")
        //const parseResult = parseTree("sin( 5 * ( 6 / 2 ) - (3 + 5))")
        //const parseResult = parseTree("(-5.5+2*1.5-4.5/-1.5)")
        console.log(parseResult)
        const result = evaluateTree(parseResult)
        //const result = calculateSimpleEquation("(-5.5+sin2*1.5-4.5/-1.5)", false)
        console.log(result)
      }}>Start</button>
    </>)
}

export default App;