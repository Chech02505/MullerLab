import { parse, complex as mathComplex } from 'mathjs';
import { C, asC } from './complex.js';

const functions=new Set([
  'sin','cos','tan','asin','acos','atan','sinh','cosh','tanh',
  'exp','log','log10','sqrt','abs','re','im','conj','sign'
]);
const constants=new Set(['x','i','pi','e','PI','E',...functions]);
const operators=new Set(['+','-','*','/','^']);

function safeParse(input, allowVariable) {
  if(typeof input!=='string'||!input.trim()) throw new Error('Escriba una expresión matemática.');
  if(input.length>320) throw new Error('La expresión supera los 320 caracteres permitidos.');
  let tree;
  try{tree=parse(input.trim());}catch(e){throw new Error(`Sintaxis matemática inválida: ${e.message}`);}
  let nodes=0;
  tree.traverse(node=>{
    nodes++;
    if(nodes>160)throw new Error('Expresión demasiado compleja.');
    if(node.isConstantNode){
      // mathjs ConstantNode también admite strings: se rechazan por seguridad.
      if(node.valueType==='string' || typeof node.value==='string' && !/^[-+]?\d*\.?\d+(e[-+]?\d+)?$/i.test(node.value)) {
        throw new Error('Solo se permiten constantes numéricas.');
      }
      return;
    }
    if(node.isSymbolNode){
      if(!constants.has(node.name)||(!allowVariable && node.name==='x')) throw new Error(`Símbolo no permitido: ${node.name}.`);
      return;
    }
    if(node.isOperatorNode){
      if(!operators.has(node.op))throw new Error(`Operador no permitido: ${node.op}.`);
      return;
    }
    if(node.isFunctionNode){
      if(!node.fn?.isSymbolNode||!functions.has(node.fn.name))throw new Error('Se ha utilizado una función no autorizada.');
      return;
    }
    if(node.isParenthesisNode)return;
    throw new Error(`Construcción no permitida: ${node.type}.`);
  });
  return tree.compile();
}

function checked(value) {
  if(typeof value==='number')return C(value);
  if(value && (value.isComplex||typeof value.re==='number'&&typeof value.im==='number'))return asC(value);
  throw new Error('La expresión debe dar un resultado numérico real o complejo.');
}

/** Función matemática arbitraria evaluada solo con un scope numérico explícito. */
export function compileUserFunction(expression) {
  const executable=safeParse(expression,true);
  return (x) => {
    const z=asC(x);
    let value;
    try{value=executable.evaluate({x:mathComplex(z.re,z.im)});}catch(err){throw new Error(`Error al evaluar f(x): ${err.message}`);}
    return checked(value);
  };
}
export function parseInitialPoint(expression) {
  const executable=safeParse(String(expression),false);
  let value;
  try{value=executable.evaluate({});}catch(err){throw new Error(`Punto inicial inválido: ${err.message}`);}
  return checked(value);
}
