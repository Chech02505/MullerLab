/** Operaciones complejas autocontenidas y comprobables sin dependencias de UI. */
export function C(re = 0, im = 0) {
  const x = Number(re);
  const y = Number(im);
  if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error('Se obtuvo un número no finito. Revise la función o los puntos iniciales.');
  return { re: x, im: y };
}
export function asC(value) {
  if (typeof value === 'number') return C(value, 0);
  if (typeof value === 'object' && value !== null && 're' in value && 'im' in value) return C(value.re, value.im);
  throw new Error('La función debe devolver un número real o complejo.');
}
export const add = (a,b) => C(asC(a).re + asC(b).re, asC(a).im + asC(b).im);
export const neg = a => C(-asC(a).re, -asC(a).im);
export const sub = (a,b) => add(a,neg(b));
export function mul(a,b) {
  const x=asC(a), y=asC(b);
  return C(x.re*y.re-x.im*y.im,x.re*y.im+x.im*y.re);
}
export function div(a,b) {
  const x=asC(a), y=asC(b);
  // Cociente escalado: evita desbordamiento artificial por (re²+im²).
  const scale=Math.max(Math.abs(y.re),Math.abs(y.im));
  if (scale===0) throw new Error('División entre cero durante la iteración.');
  const br=y.re/scale, bi=y.im/scale;
  const denominator=br*br+bi*bi;
  return C((x.re*br+x.im*bi)/denominator/scale,(x.im*br-x.re*bi)/denominator/scale);
}
export function abs(z) { const v=asC(z); return Math.hypot(v.re,v.im); }
export function sqrt(z) {
  const x=asC(z), r=abs(x);
  if (r===0) return C(0);
  const u=Math.sqrt(Math.max(0,(r+x.re)/2));
  const v=Math.sqrt(Math.max(0,(r-x.re)/2));
  return C(u,x.im<0?-v:v);
}
export const square = z => mul(z,z);
export const finite = z => Number.isFinite(asC(z).re) && Number.isFinite(asC(z).im);
export function near(a,b,eps=1e-13){
  return abs(sub(a,b))<=eps*Math.max(1,abs(a),abs(b));
}
export function fmt(z,digits=8) {
  if (z===null || z===undefined) return '—';
  if (typeof z==='number') return fmt(C(z),digits);
  const x=asC(z);
  const f=n => {
    const v=Math.abs(n)<1e-13?0:n;
    if (v===0) return '0';
    if (Math.abs(v)>=1e7 || Math.abs(v)<1e-5) return v.toExponential(3);
    return Number(v.toPrecision(digits)).toString();
  };
  if(Math.abs(x.im)<1e-11*Math.max(1,Math.abs(x.re))) return f(x.re);
  if(Math.abs(x.re)<1e-11*Math.max(1,Math.abs(x.im))) return `${f(x.im)}i`;
  return `${f(x.re)} ${x.im>=0?'+':'−'} ${f(Math.abs(x.im))}i`;
}
export const isReal = (z,eps=1e-9) => Math.abs(asC(z).im)<eps*Math.max(1,abs(z));
