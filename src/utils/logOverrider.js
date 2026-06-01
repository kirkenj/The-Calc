// import console from "console";

// const originalLog = console.log;
// const originalGroupCollapsed = console.groupCollapsed;
// const originalGroup = console.group;

// const freezeArgs = (args) => {
//   return args.map(arg => {
//     if (typeof arg === 'object' && arg !== null) {
//       try {
//         return structuredClone(arg);
//       } catch (e) {
//         try {
//           return JSON.parse(JSON.stringify(arg));
//         } catch (err) {
//           return arg; 
//         }
//       }
//     }
//     return arg;
//   });
// };

// console.log = (...args) => {
//   originalLog('[FROZEN]:', ...freezeArgs(args));
// };

// console.groupCollapsed = (...args) => {
//   originalGroupCollapsed('[FROZEN GROUP]:', ...freezeArgs(args));
// };

// console.group = (...args) => {
//   originalGroup('[FROZEN GROUP]:', ...freezeArgs(args));
// };