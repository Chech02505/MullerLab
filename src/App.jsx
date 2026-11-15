import React, { useState } from 'react';
import {
  Activity, AlertCircle, ArrowRight, BarChart3, BookOpen, Calculator, CheckCircle2,
  ChevronLeft, ChevronRight, CircleHelp, Code2, Download, FlaskConical,
  Github, Info, Layers3, Play, RotateCcw, Sigma, Sparkles, Target, Zap,
} from 'lucide-react';
import Graph from './components/Graph.jsx';
import Comparison from './components/Comparison.jsx';
import Theory from './components/Theory.jsx';
import IterationTable from './components/IterationTable.jsx';
import { compileUserFunction, parseInitialPoint } from './lib/expression.js';
import { muller, secant, newton } from './lib/solver.js';
import { OFFICIAL_EXAMPLE, COMPLEX_EXAMPLE, TRIG_EXAMPLE } from './lib/example.js';
import { fmt } from './lib/complex.js';

function solve(inputs) {
  const fn=compileUserFunction(inputs.expression);
  const initial=[inputs.x0,inputs.x1,inputs.x2].map(parseInitialPoint);
  const opts={tolerance:Number(inputs.tolerance),maxIterations:Number(inputs.maxIterations)};
  const m=muller(fn,initial,opts);
  const s=secant(fn,[initial[1],initial[2]],opts);
  const n=newton(fn,initial[2],opts);
  return {fn,initial,opts,expression:inputs.expression,calculation:m,comparisons:[
    {name:'Müller',...m,history:m.steps.map(r=>({i:r.i,x:r.x3,residual:Math.hypot(r.f3.re,r.f3.im)}))},
    {name:'Secante',...s,history:s.steps},
    {name:'Newton–Raphson',...n,history:n.steps},
  ]};
}

const nav=[{id:'laboratorio',label:'Laboratorio',icon:Calculator},{id:'comparacion',label:'Duelo de métodos',icon:BarChart3},{id:'teoria',label:'Teoría y fórmulas',icon:BookOpen}];
function Pill({children,className=''}){return <span className={'pill '+className}>{children}</span>}
function InputField({label,help,wide=false,...props}){return <label className={'field '+(wide?'wide':'')}><span className="field-label">{label}</span><input {...props} /><span className="input-help">{help}</span></label>}

export default function App() {
  const [tab,setTab]=useState('laboratorio');
  const [inputs,setInputs]=useState({...OFFICIAL_EXAMPLE});
  const [data,setData]=useState(()=>{try{return solve(OFFICIAL_EXAMPLE)}catch{return null}});
  const [error,setError]=useState('');
  const [selected,setSelected]=useState(()=>{try{return Math.max(0,solve(OFFICIAL_EXAMPLE).calculation.steps.length-1)}catch{return 0}});
  const [dirty,setDirty]=useState(false);
  const [showDetails,setShowDetails]=useState(true);

  const update=(key,value)=>{setInputs(prev=>({...prev,[key]:value}));setDirty(true);};
  const calculate=(values=inputs)=>{
    try{
      const result=solve(values);
      setData(result);setError('');setDirty(false);
      setSelected(Math.max(0,result.calculation.steps.length-1));setTab('laboratorio');
    }catch(e){setError(e.message);}
  };
  const loadExample=(example)=>{const values={...example};setInputs(values);calculate(values);};
  const result=data?.calculation;
  const steps=result?.steps??[];
  const currentStep=steps[Math.min(selected,Math.max(0,steps.length-1))]??null;
  const ok=result?.status==='converged';
  return (
    <div className="layout-shell min-h-screen">
      <aside className="sidebar">
        <div className="brand"><div className="brand-icon"><Sigma size={26} strokeWidth={2.3}/></div><div className="brand-text"><strong>Müller<span>Lab</span></strong><small>NUMERICAL STUDIO</small></div></div>
        <div className="side-caption">EXPLORAR</div>
        <nav className="side-nav" aria-label="Navegación principal">{nav.map(item=>{const Icon=item.icon;return <button key={item.id} type="button" className={'nav-item '+(tab===item.id?'active':'')} onClick={()=>setTab(item.id)}><Icon size={18}/><span>{item.label}</span>{tab===item.id&&<ArrowRight size={16} className="push-right"/>}</button>})}</nav>
        <div className="sidebar-bottom"><div className="sidebar-divider"/><div className="made-for"><span className="school-label">PROYECTO ACADÉMICO</span><strong>Universidad de Santander</strong><span>Ingeniería de Software</span><span>Métodos Numéricos · 2026</span></div><div className="author-card"><span className="avatar">SC</span><div><strong>Sergio Andres<br/>Cristancho Moreno</strong><small>Cód. 01240371021</small></div></div></div>
      </aside>
      <div className="main-shell min-w-0">
        <header className="topbar"><div className="breadcrumbs"><span>Métodos Numéricos</span><ChevronRight size={14}/><strong>{nav.find(n=>n.id===tab)?.label}</strong></div><div className="topbar-right"><span className="online-dot"/><span>100% en tu navegador</span><Pill className="version">v1.0</Pill></div></header>
        <main className="main-content mx-auto">
          {tab==='laboratorio'&&<>
            <section className="hero"><div className="hero-copy"><div className="hero-eyebrow"><Sparkles size={15}/> INTERPOLACIÓN CUADRÁTICA, EN TIEMPO REAL</div><h1>Encuentra la raíz.<br/><span>Entiende el camino.</span></h1><p>Experimenta con el método de Müller: de tres puntos a una parábola, de la parábola a la solución. Con seguimiento de cada cálculo y soporte para números complejos.</p><div className="hero-chips flex flex-wrap items-center"><span><CheckCircle2 size={14}/> Sin backend</span><span><Activity size={14}/> Paso a paso</span><span><Zap size={14}/> Números complejos</span></div></div><div className="hero-mark" aria-hidden="true"><svg viewBox="0 0 270 210"><defs><linearGradient id="hero-grad"><stop stopColor="#58efcf"/><stop offset="1" stopColor="#a797ff"/></linearGradient></defs><g opacity=".17" stroke="#89a5ca" strokeWidth="1">{Array.from({length:7},(_,i)=><line key={i} x1={22+i*36} y1="0" x2={22+i*36} y2="210"/>)}{Array.from({length:6},(_,i)=><line key={i} x1="0" y1={17+i*36} x2="270" y2={17+i*36}/>)}</g><path d="M10 156 C80 160 90 5 149 65 S213 186 260 43" stroke="url(#hero-grad)" strokeWidth="5" fill="none" strokeLinecap="round"/><path d="M35 40 Q130 221 234 40" stroke="#c1a5ff" strokeWidth="3" strokeDasharray="8 9" fill="none"/><circle cx="149" cy="65" r="7" fill="#f5bd72"/><circle cx="149" cy="65" r="14" stroke="#f5bd72" strokeOpacity=".5" fill="none"/></svg></div></section>
            <div className="lab-grid grid">
              <section className="surface inputs-panel"><div className="section-header"><div><div className="tiny-eyebrow">01 / CONFIGURACIÓN</div><h2><Calculator size={19}/> Configura tu función</h2><p>Ingresa la ecuación f(x) = 0 y tres aproximaciones iniciales.</p></div></div>
                <form onSubmit={e=>{e.preventDefault();calculate()}} className="calculator-form" noValidate>
                  <InputField wide label="Función f(x)" value={inputs.expression} onChange={e=>update('expression',e.target.value)} spellCheck="false" placeholder="x^3 - 13*x - 12" help="Operadores +, −, *, /, ^ · Funciones sin(), cos(), exp(), sqrt()..."/>
                  <div className="three-inputs grid"><InputField label="Punto x₀" value={inputs.x0} onChange={e=>update('x0',e.target.value)} help="Inicio 1" placeholder="4.5"/><InputField label="Punto x₁" value={inputs.x1} onChange={e=>update('x1',e.target.value)} help="Inicio 2" placeholder="5.5"/><InputField label="Punto x₂" value={inputs.x2} onChange={e=>update('x2',e.target.value)} help="Inicio 3" placeholder="5.0"/></div>
                  <div className="two-inputs grid"><InputField label="Tolerancia" type="number" step="any" min="0" max="0.999" value={inputs.tolerance} onChange={e=>update('tolerance',e.target.value)} help="Ej.: 1e-8"/><InputField label="Iteraciones máximas" type="number" min="1" max="200" step="1" value={inputs.maxIterations} onChange={e=>update('maxIterations',e.target.value)} help="Entre 1 y 200"/></div>
                  {error&&<div className="form-error" role="alert"><AlertCircle size={18}/><span>{error}</span></div>}
                  {dirty&&<div className="form-tip"><Info size={15}/> Cambiaste los parámetros. Pulsa «Calcular raíz» para actualizar resultados.</div>}
                  <button className="button primary submit-button" type="submit"><Play size={17} fill="currentColor"/> Calcular raíz <ArrowRight size={18}/></button>
                </form>
                <div className="examples"><span>PROBAR UN EJEMPLO</span><button type="button" onClick={()=>loadExample(OFFICIAL_EXAMPLE)} className="example-button featured"><FlaskConical size={15}/> Cargar Ejemplo Oficial UDES</button><div className="example-pair"><button type="button" onClick={()=>loadExample(COMPLEX_EXAMPLE)}>x² + 1 <span>↗</span></button><button type="button" onClick={()=>loadExample(TRIG_EXAMPLE)}>cos(x) − x <span>↗</span></button></div></div>
              </section>
              <section className="right-column grid">
                <div className="result-grid grid"><div className="surface stat-card hero-stat"><span className="stat-icon mint"><Target size={17}/></span><span className="stat-label">RAÍZ APROXIMADA</span><strong className="root-value">{result?fmt(result.root,12):'—'}</strong><span className="stat-detail">{result?.status==='converged'?'Solución aproximada hallada':'Última aproximación disponible'}</span></div>
                  <div className="surface stat-card"><span className="stat-icon purple"><Activity size={17}/></span><span className="stat-label">RESIDUO |f(x)|</span><strong>{Number.isFinite(result?.residual)?result.residual.toExponential(3):'—'}</strong><span className="stat-detail">Debe acercarse a 0</span></div>
                  <div className="surface stat-card"><span className="stat-icon gold"><Layers3 size={17}/></span><span className="stat-label">ITERACIONES</span><strong>{result?.iterations??'—'}</strong><span className="stat-detail">Pasos calculados</span></div>
                  <div className="surface stat-card"><span className={'stat-icon '+(ok?'mint':'gold')}>{ok?<CheckCircle2 size={17}/>:<Info size={17}/>}</span><span className="stat-label">ESTADO</span><strong className="status-value">{!result?'—':ok?'Convergencia':result.status==='max_iterations'?'Máximo alcanzado':'Sin converger'}</strong><span className="stat-detail">{result?.message??'—'}</span></div></div>
                <section className="surface graph-panel"><div className="section-header graph-header"><div><div className="tiny-eyebrow">02 / VISUALIZACIÓN</div><h2><Activity size={18}/> Explorador geométrico</h2><p>Observa la curva y la parábola de la iteración seleccionada.</p></div><div className="iteration-count"><span>ITERACIÓN</span><strong>{currentStep?.i??0}<em> / {steps.length}</em></strong></div></div>
                  <Graph step={currentStep} fn={data?.fn}/>
                  <div className="step-controls flex items-center"><button className="icon-button" title="Iteración anterior" aria-label="Iteración anterior" type="button" disabled={selected<=0||!steps.length} onClick={()=>setSelected(v=>Math.max(0,v-1))}><ChevronLeft size={21}/></button><input type="range" min="0" max={Math.max(0,steps.length-1)} step="1" value={Math.min(selected,Math.max(0,steps.length-1))} disabled={steps.length<2} onChange={e=>setSelected(Number(e.target.value))} aria-label="Seleccionar iteración"/><button className="icon-button" type="button" title="Iteración siguiente" aria-label="Iteración siguiente" disabled={selected>=steps.length-1||!steps.length} onClick={()=>setSelected(v=>Math.min(steps.length-1,v+1))}><ChevronRight size={21}/></button></div>
                  <div className="step-summary"><div><span>Antes</span><strong>x₂ = {currentStep?fmt(currentStep.x2,9):'—'}</strong></div><ArrowRight size={17}/><div><span>Ahora</span><strong>x₃ = {currentStep?fmt(currentStep.x3,9):'—'}</strong></div><div><span>Error relativo</span><strong>{currentStep?.errorPercent===null||!currentStep?'n/d':currentStep.errorPercent.toExponential(3)+' %'}</strong></div></div>
                </section>
              </section>
            </div>
            <IterationTable rows={steps} selected={selected} onSelect={idx=>{setSelected(idx);document.querySelector('.graph-panel')?.scrollIntoView({behavior:'smooth',block:'center'});}}/>
            <section className="surface next-panel"><div className="next-icon"><BarChart3 size={24}/></div><div><h3>¿Cuál método converge mejor?</h3><p>Compara la curva de convergencia de Müller con Secante y Newton-Raphson para la misma ecuación.</p></div><button type="button" className="button outline" onClick={()=>setTab('comparacion')}>Ver comparativa <ArrowRight size={17}/></button></section>
          </>}
          {tab==='comparacion'&&<><div className="page-header"><div className="tiny-eyebrow">BENCHMARK INTERACTIVO</div><h1>Duelo de <span>métodos.</span></h1><p>Contrasta tres aproximaciones diferentes usando la misma función y tolerancia de la última ejecución.</p><div className="page-function">f(x) = {data?.expression??'—'}</div></div><Comparison results={data?.comparisons} params={data?.opts}/></>}
          {tab==='teoria'&&<><div className="page-header"><div className="tiny-eyebrow">DOCUMENTACIÓN DEL ALGORITMO</div><h1>La matemática <span>que lo mueve.</span></h1><p>Derivación de las fórmulas, precisión, operaciones con complejos y criterios de convergencia.</p></div><Theory/></>}
        </main>
        <footer className="footer"><span>© 2026 MüllerLab · Proyecto académico UDES</span><span>Desarrollado por Sergio Andres Cristancho Moreno · 01240371021</span></footer>
      </div>
    </div>
  );
}
