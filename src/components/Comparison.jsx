import React from 'react';
import { Activity, ArrowRight, CheckCircle2, Info, TrendingDown, AlertTriangle } from 'lucide-react';
import { fmt } from '../lib/complex.js';

const colors=['#43ddc7','#b1a1f8','#f2b56f'];
const descriptions=[
  'Interpolación cuadrática con tres puntos. No necesita derivadas y puede dar un paso complejo.',
  'Interpolación lineal con dos puntos. No necesita derivadas; su trayectoria puede diferir.',
  'Aproximación por tangentes. En esta demo se calcula la derivada mediante diferencia central.'
];
export default function Comparison({results,params}) {
  if(!results)return <section className="surface placeholder">Realiza el cálculo para comparar métodos.</section>;
  const valid=results.filter(r=>Number.isFinite(r.residual));
  const max=Math.max(1e-8,...valid.flatMap(r=>r.history.map(s=>s.residual).filter(Number.isFinite)));
  const maxI=Math.max(5,...results.map(r=>r.history.length));
  return <div className="compare-layout">
    <section className="surface comparison-chart-section">
      <div className="tiny-eyebrow">Duelo de métodos</div><h2 className="section-heading">Tres rutas, una ecuación.</h2>
      <p className="section-description">Se comparan el error residual |f(xₖ)| por iteración y la aproximación final. Menor residuo significa mayor proximidad a satisfacer la ecuación.</p>
      <div className="compare-chart"><svg viewBox="0 0 810 350" role="img" aria-label="Gráfico de convergencia del residuo de Müller, Secante y Newton-Raphson">
        {Array.from({length:6},(_,k)=>{const y=30+k*54;return <g key={k}><line x1="64" y1={y} x2="770" y2={y} stroke="#274055" strokeDasharray="4 6"/><text x="55" y={y+4} textAnchor="end" fill="#97adc3" fontSize="12">{(Math.log10(max)-(Math.log10(max)+14)*k/5).toFixed(1)}</text></g>})}
        {Array.from({length:7},(_,k)=>{const x=64+k*(706/6);return <g key={k}><line x1={x} y1="30" x2={x} y2="300" stroke="#1d3045"/><text x={x} y="328" textAnchor="middle" fill="#97adc3" fontSize="12">{Math.round(maxI*k/6)}</text></g>})}
        {results.map((r,i)=>{const range=Math.max(1,Math.log10(max)+14);const line=r.history.filter(s=>Number.isFinite(s.residual)).map(s=>[64+Math.min(maxI,s.i)/maxI*706,30+(Math.log10(max)-Math.max(-14,Math.log10(Math.max(1e-14,s.residual))))/range*270]);return <g key={r.name}>
          {line.length>1&&<polyline points={line.map(([x,y])=>`${x.toFixed(2)},${y.toFixed(2)}`).join(' ')} fill="none" stroke={colors[i]} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>}
          {line.map(([x,y],j)=><circle key={j} cx={x} cy={y} r="4" fill={colors[i]} stroke="#0b1a2b" strokeWidth="1.5"/>)}
        </g>})}
        <text x="417" y="346" fill="#8da6ba" fontSize="12" textAnchor="middle">Número de iteración</text>
        <text x="15" y="18" fill="#8da6ba" fontSize="12">log₁₀ |f(xₖ)|</text>
      </svg></div>
      <div className="graph-legend comparison-legend">{results.map((r,i)=><span key={r.name}><i className="legend-line" style={{background:colors[i]}}/> {r.name}</span>)}</div>
      <div className="hint-box"><Info size={17}/><p>Las condiciones iniciales no son idénticas: Müller usa x₀, x₁ y x₂; Secante usa x₁ y x₂; Newton parte de x₂. Esta es una comparación pedagógica, no una prueba universal de superioridad.</p></div>
    </section>
    <div className="comparison-cards">
      {results.map((r,i)=><article key={r.name} className="surface method-card" style={{'--method-color':colors[i]}}>
        <div className="method-heading"><span className="method-indicator">0{i+1}</span><h3>{r.name}</h3><span className={'status-tag '+(r.status==='converged'?'ok':'warn')}>{r.status==='converged'?'Convergió':'Sin converger'}</span></div>
        <p className="method-description">{descriptions[i]}</p>
        <div className="method-number-row"><div><span>Raíz aproximada</span><strong className="method-root">{fmt(r.root,10)}</strong></div><div><span>Iteraciones</span><strong>{r.iterations}</strong></div></div>
        <div className="method-number-row"><div><span>Residuo |f(x)|</span><strong>{Number.isFinite(r.residual)?r.residual.toExponential(3):'—'}</strong></div><div><span>Estado</span><strong className="method-short-status">{r.status==='converged'?'Correcto':'Revisar'}</strong></div></div>
      </article>)}
    </div>
    <section className="surface comparison-explanation">
      <h2><Activity size={20}/> ¿Por qué usar Müller?</h2>
      <div className="three-facts">
        <div><div className="fact-number">01</div><h3>Más información local</h3><p>En lugar de una recta secante, utiliza una parábola que interpola tres valores, capturando curvatura local.</p></div>
        <div><div className="fact-number">02</div><h3>Sin derivada explícita</h3><p>A diferencia de Newton-Raphson, no requiere derivar simbólicamente la función para construir el siguiente paso.</p></div>
        <div><div className="fact-number">03</div><h3>Raíces complejas</h3><p>El discriminante puede ser negativo. Müller admite raíces y trayectorias complejas dentro de la misma aritmética.</p></div>
      </div>
      <div className="footnote">Müller no es siempre el más rápido ni garantiza convergencia. Puede ser sensible a las semillas, a singularidades y a errores de redondeo; Newton puede resultar superior con una buena derivada y un punto cercano.</div>
    </section>
  </div>;
}
