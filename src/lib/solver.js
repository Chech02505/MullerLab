import { C, asC, add, sub, mul, div, abs, sqrt, square, near } from './complex.js';

/**
 * P(t)=a·t²+b·t+c, con t=x−x₂.
 * Selección del denominador de mayor módulo para reducir cancelación.
 * No requiere derivadas ni restricciones al signo del discriminante.
 */
export function muller(f, initial, opts={}) {
  const tol = Number(opts.tolerance ?? 1e-8);
  const maxIterations=Number(opts.maxIterations ?? 30);
  if (!Number.isFinite(tol) || tol<=0 || tol>=1) throw new Error('La tolerancia debe estar entre 0 y 1 (sin incluirlos).');
  if (!Number.isInteger(maxIterations) || maxIterations<1 || maxIterations>200) throw new Error('Las iteraciones deben ser un entero entre 1 y 200.');
  if(!Array.isArray(initial)||initial.length!==3) throw new Error('Ingrese exactamente tres puntos iniciales.');
  let [x0,x1,x2]=initial.map(asC);
  if(near(x0,x1)||near(x1,x2)||near(x0,x2)) throw new Error('Los tres puntos iniciales deben ser diferentes.');
  const steps=[];
  let status='max_iterations', message='Se alcanzó el máximo de iteraciones.';
  let x3=x2;
  try {
    let f0=asC(f(x0)), f1=asC(f(x1)), f2=asC(f(x2));
    if(abs(f2)<=tol) return {root:x2,residual:abs(f2),steps,status:'converged',message:'El punto inicial x₂ ya satisface la tolerancia.',iterations:0};
    for(let k=1;k<=maxIterations;k++) {
      const h0=sub(x1,x0),h1=sub(x2,x1);
      if(near(x0,x1)||near(x1,x2)||near(x0,x2)) {
        status='stagnated';message='Los puntos se volvieron demasiado cercanos para interpolar sin pérdida numérica.';break;
      }
      const delta0=div(sub(f1,f0),h0);
      const delta1=div(sub(f2,f1),h1);
      const a=div(sub(delta1,delta0),add(h0,h1));
      const b=add(mul(a,h1),delta1);
      const c=f2;
      const discriminant=sub(square(b),mul(C(4),mul(a,c)));
      const radicandSqrt=sqrt(discriminant);
      const dPlus=add(b,radicandSqrt),dMinus=sub(b,radicandSqrt);
      const denominator=abs(dPlus)>=abs(dMinus)?dPlus:dMinus;
      const branch=abs(dPlus)>=abs(dMinus)?'+':'−';
      if(abs(denominator)<=1e-14*Math.max(1,abs(b),abs(radicandSqrt))) {
        status='breakdown';message='La parábola no proporciona un denominador estable en esta iteración.';break;
      }
      x3=sub(x2,div(mul(C(2),c),denominator));
      const f3=asC(f(x3));
      const change=abs(sub(x3,x2));
      const relativePercent=abs(x3)>1e-14?100*change/abs(x3):null;
      steps.push({i:k,x0,x1,x2,f0,f1,f2,h0,h1,delta0,delta1,a,b,c,discriminant,radicandSqrt,denominator,branch,x3,f3,absoluteChange:change,errorPercent:relativePercent});
      if(abs(f3)<=tol) {status='converged';message='Convergencia alcanzada por residuo |f(x)|.';break;}
      if(change<=tol*Math.max(1,abs(x3))) {status='converged';message='Convergencia alcanzada por cambio relativo entre aproximaciones.';break;}
      if(near(x3,x2,Number.EPSILON*4)) {status='stagnated';message='Estancamiento por precisión de máquina.';break;}
      [x0,x1,x2]=[x1,x2,x3];
      [f0,f1,f2]=[f1,f2,f3];
    }
  } catch(err) {
    status='error';message=`Se detuvo el cálculo: ${err.message}`;
  }
  const root=steps.length?steps[steps.length-1].x3:x2;
  let residual;
  try {residual=abs(f(root));} catch {residual=Number.NaN;}
  return {root,residual,steps,status,message,iterations:steps.length};
}

export function secant(f,start,opts={}) {
  const tolerance=Number(opts.tolerance??1e-8), maxIterations=Number(opts.maxIterations??30);
  let [a,b]=start.map(asC);
  const history=[];
  if(near(a,b)) return result(b,history,'breakdown','Puntos iguales.');
  try {
    let fa=asC(f(a)), fb=asC(f(b));
    if(abs(fb)<=tolerance)return result(b,history,'converged','Residuo inicial suficiente.',f);
    for(let i=1;i<=maxIterations;i++) {
      const denom=sub(fb,fa);
      if(abs(denom)<=1e-14*Math.max(1,abs(fb),abs(fa)))return result(b,history,'breakdown','División por pendiente casi nula.',f);
      const next=sub(b,div(mul(fb,sub(b,a)),denom));
      const fn=asC(f(next));
      history.push({i,x:next,residual:abs(fn)});
      if(abs(fn)<=tolerance||abs(sub(next,b))<=tolerance*Math.max(1,abs(next)))return result(next,history,'converged','Convergencia.',f);
      [a,b]=[b,next];[fa,fb]=[fb,fn];
    }
    return result(b,history,'max_iterations','Máximo de iteraciones.',f);
  }catch(err){return result(b,history,'error',err.message,f);}
}

export function newton(f,start,opts={}) {
  const tolerance=Number(opts.tolerance??1e-8), maxIterations=Number(opts.maxIterations??30);
  let x=asC(start);
  const history=[];
  try {
    if(abs(f(x))<=tolerance)return result(x,history,'converged','Residuo inicial suficiente.',f);
    for(let i=1;i<=maxIterations;i++) {
      // Diferencia central numérica; para funciones analíticas también funciona en puntos complejos.
      const h=1e-5*Math.max(1,abs(x));
      const fp=div(sub(asC(f(add(x,C(h)))),asC(f(sub(x,C(h))))),C(2*h));
      if(abs(fp)<1e-13)return result(x,history,'breakdown','Derivada casi nula.',f);
      const next=sub(x,div(asC(f(x)),fp));
      const fn=asC(f(next));
      history.push({i,x:next,residual:abs(fn)});
      if(abs(fn)<=tolerance||abs(sub(next,x))<=tolerance*Math.max(1,abs(next)))return result(next,history,'converged','Convergencia.',f);
      x=next;
    }
    return result(x,history,'max_iterations','Máximo de iteraciones.',f);
  }catch(err){return result(x,history,'error',err.message,f);}
}
function result(root,history,status,message,f=null) {
  let residual=history.length?history[history.length-1].residual:NaN;
  if(f) {try{residual=abs(f(root));}catch {/* conserva residuo anterior */}}
  return {root,residual,steps:history,status,message,iterations:history.length};
}

export function compareMethods(f,initial,opts={}) {
  const mullerResult=muller(f,initial,opts);
  const secantResult=secant(f,[initial[1],initial[2]],opts);
  const newtonResult=newton(f,initial[2],opts);
  return [
    {name:'Müller',short:'Müller',kind:'quadratic',...mullerResult,history:mullerResult.steps.map(s=>({i:s.i,x:s.x3,residual:abs(s.f3)}))},
    {name:'Secante',short:'Secante',kind:'linear',...secantResult,history:secantResult.steps},
    {name:'Newton–Raphson',short:'Newton',kind:'tangent',...newtonResult,history:newtonResult.steps},
  ];
}
