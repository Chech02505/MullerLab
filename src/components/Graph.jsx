import React, { useMemo } from 'react';
import { abs, add, C, fmt, isReal, mul, sub, square } from '../lib/complex.js';

const W=850,H=388,P={left:66,right:25,top:24,bottom:53};
const PW=W-P.left-P.right,PH=H-P.top-P.bottom;
const palette={curve:'#45e4ce',parabola:'#d1a5ff',zero:'#8797b1',point:'#8aa9d9',new:'#f4bf73'};
function number(n) {return Number.isFinite(n)?n.toFixed(Math.abs(n)>=10?0:Math.abs(n)>=1?1:2):'—';}

export default function Graph({step,fn}) {
  const chart=useMemo(()=>{
    if(!step||!fn)return null;
    const points=[step.x0,step.x1,step.x2,step.x3];
    const reals=points.map(z=>z.re);
    const minX=Math.min(...reals),maxX=Math.max(...reals);
    const spread=Math.max(1,maxX-minX);
    const xmin=minX-spread*.75, xmax=maxX+spread*.75;
    const samples=[];
    for(let i=0;i<=260;i++) {
      const x=xmin+(xmax-xmin)*i/260;
      let y=NaN;
      try {const v=fn(C(x));if(isReal(v))y=v.re;}catch{/* discontinuidad */}
      samples.push({x,y});
    }
    const canParabola=[step.x0,step.x1,step.x2,step.a,step.b,step.c].every(z=>isReal(z));
    const paras=[];
    if(canParabola){
      for(let i=0;i<=260;i++){
        const x=xmin+(xmax-xmin)*i/260;
        try {const t=C(x-step.x2.re);paras.push({x,y:add(add(mul(step.a,square(t)),mul(step.b,t)),step.c).re});}
        catch {paras.push({x,y:NaN});}
      }
    }
    const candidates=[...samples,...paras].map(p=>p.y).filter(Number.isFinite).sort((a,b)=>a-b);
    const ys=[0,...[step.f0,step.f1,step.f2,step.f3].filter(isReal).map(z=>z.re)];
    const lower=candidates.length?candidates[Math.floor(candidates.length*.06)]:-1;
    const upper=candidates.length?candidates[Math.floor(candidates.length*.94)]:1;
    let ymin=Math.min(0,lower,...ys), ymax=Math.max(0,upper,...ys);
    if(ymax===ymin){ymax+=1;ymin-=1;}
    const padding=(ymax-ymin)*.12;
    ymin-=padding;ymax+=padding;
    const xx=x=>P.left+(x-xmin)/(xmax-xmin)*PW;
    const yy=y=>P.top+(ymax-y)/(ymax-ymin)*PH;
    function path(data){
      let str='',previous=false;
      data.forEach(({x,y})=>{
        if(!Number.isFinite(y)||Math.abs(y)>1e30){previous=false;return;}
        str+=(previous?' L':' M')+xx(x).toFixed(2)+' '+yy(y).toFixed(2);previous=true;
      });
      return str;
    }
    return {xmin,xmax,ymin,ymax,xx,yy,pathF:path(samples),pathP:path(paras),canParabola,points};
  },[step,fn]);
  if(!chart)return <div className="empty-canvas">Ejecuta un cálculo para observar la interpolación.</div>;
  const {xmin,xmax,ymin,ymax,xx,yy,pathF,pathP,canParabola,points}=chart;
  const horizontal=(ymin<=0&&ymax>=0)?yy(0):null;
  const vertical=(xmin<=0&&xmax>=0)?xx(0):null;
  const locations=[{x:points[0],y:step.f0,label:'x₀'},{x:points[1],y:step.f1,label:'x₁'},{x:points[2],y:step.f2,label:'x₂'},{x:points[3],y:step.f3,label:'x₃'}];
  const complexLocation=points.some(z=>!isReal(z))||locations.some(p=>!isReal(p.y));
  return (
    <div className="graph-outer">
      <div className="graph-legend"><span><i className="legend-line mint"/> f(x) real</span><span><i className="legend-line purple"/> Interpolación P(x)</span><span><i className="legend-dot amber"/> Nueva aproximación x₃</span></div>
      <svg className="graph-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Plano cartesiano dinámico de la función, parábola interpolante y puntos de Müller">
        <defs><clipPath id="muller-chart-clip"><rect x={P.left} y={P.top} width={PW} height={PH} rx="6"/></clipPath>
          <linearGradient id="f-shadow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4be7cb" stopOpacity=".18"/><stop offset="100%" stopColor="#4be7cb" stopOpacity="0"/></linearGradient>
        </defs>
        <rect x={P.left} y={P.top} width={PW} height={PH} fill="#0c192c" rx="8" />
        {Array.from({length:6},(_,j)=>{const y=P.top+PH*j/5;const value=ymax-(ymax-ymin)*j/5;return <g key={'gy'+j}><line x1={P.left} y1={y} x2={W-P.right} y2={y} stroke="#1f3348" strokeDasharray="3 5"/><text x={P.left-12} y={y+4} fill="#7e91ab" fontSize="12" textAnchor="end">{number(value)}</text></g>})}
        {Array.from({length:7},(_,j)=>{const x=P.left+PW*j/6;const value=xmin+(xmax-xmin)*j/6;return <g key={'gx'+j}><line x1={x} y1={P.top} x2={x} y2={H-P.bottom} stroke="#1f3348" strokeDasharray="3 5"/><text x={x} y={H-P.bottom+23} fill="#7e91ab" fontSize="12" textAnchor="middle">{number(value)}</text></g>})}
        {horizontal!==null&&<line x1={P.left} y1={horizontal} x2={W-P.right} y2={horizontal} stroke={palette.zero} strokeWidth="1.4"/>}
        {vertical!==null&&<line x1={vertical} y1={P.top} x2={vertical} y2={H-P.bottom} stroke={palette.zero} strokeWidth="1.4"/>}
        <g clipPath="url(#muller-chart-clip)">
          {canParabola&&<path d={pathP} stroke={palette.parabola} strokeWidth="3.2" fill="none" strokeDasharray="9 7"/>}
          <path d={pathF} stroke={palette.curve} strokeWidth="3" fill="none" strokeLinecap="round"/>
          {!complexLocation&&locations.map((p,i)=><g key={i}>
            <line x1={xx(p.x.re)} y1={yy(0)} x2={xx(p.x.re)} y2={yy(p.y.re)} stroke={i===3?palette.new:palette.point} strokeDasharray="3 5" opacity=".55"/>
            <circle cx={xx(p.x.re)} cy={yy(p.y.re)} r={i===3?7:6} fill={i===3?palette.new:palette.point} stroke="#0a1524" strokeWidth="3" />
          </g>)}
          {!complexLocation&&canParabola&&horizontal!==null&&<g>
            <circle cx={xx(step.x3.re)} cy={horizontal} r="12" fill="#f4bf73" opacity=".14"/>
            <circle cx={xx(step.x3.re)} cy={horizontal} r="6.5" fill="#f4bf73" stroke="#172338" strokeWidth="2"/>
            <text x={xx(step.x3.re)+11} y={horizontal+18} fill="#f4bf73" fontSize="11" fontWeight="700">P(x₃) = 0</text>
          </g>}
        </g>
        {!complexLocation&&locations.map((p,i)=><g key={'label'+i}>
          <rect x={Math.min(W-75,Math.max(P.left,xx(p.x.re)-17))} y={Math.min(H-P.bottom-20,Math.max(P.top+1,yy(p.y.re)-31))} width="38" height="21" rx="6" fill="#122a3e" stroke={i===3?palette.new:palette.point} strokeOpacity=".4"/>
          <text x={Math.min(W-56,Math.max(P.left+19,xx(p.x.re)+2))} y={Math.min(H-P.bottom-5,Math.max(P.top+16,yy(p.y.re)-17))} fill={i===3?palette.new:'#d0e3f4'} fontWeight="700" fontSize="12" textAnchor="middle">{p.label}</text>
        </g>)}
        <text x={W-P.right} y={H-12} fill="#a1b1c9" textAnchor="end" fontSize="12">x</text>
        <text x="16" y={P.top+8} fill="#a1b1c9" fontSize="12">f(x)</text>
      </svg>
      {complexLocation&&<div className="graph-notice">Esta iteración contiene valores complejos: la curva muestra f(x) sobre el eje real. La parábola compleja no admite una proyección cartesiana real única; consulta los puntos en el plano complejo.</div>}
      {complexLocation&&<ComplexPlane points={points}/>}
      <div className="graph-foot"><span>Iteración {step.i} · Discriminante Δ = {fmt(step.discriminant,7)}</span><span>Rama estable: b {step.branch} √Δ</span></div>
    </div>
  );
}

function ComplexPlane({points}) {
  const W=580,H=180,cx=290,cy=90;
  const max=Math.max(1,...points.flatMap(z=>[Math.abs(z.re),Math.abs(z.im)]));
  const scale=70/max;
  const colors=['#93b4d8','#93b4d8','#93b4d8','#f3c077'];
  return <div className="complex-chart">
    <div className="section-minor-title">Plano complejo (Argand): posición de las aproximaciones</div>
    <svg viewBox={`0 0 ${W} ${H}`} className="graph-svg" role="img" aria-label="Plano complejo con partes reales e imaginarias de los puntos">
      <line x1="20" y1={cy} x2={W-20} y2={cy} stroke="#506682"/><line x1={cx} y1="12" x2={cx} y2={H-12} stroke="#506682"/>
      <text x={W-18} y={cy-6} fill="#96abc4" textAnchor="end" fontSize="12">Re</text>
      <text x={cx+8} y="16" fill="#96abc4" fontSize="12">Im</text>
      {points.map((p,i)=><g key={i}><circle cx={cx+p.re*scale} cy={cy-p.im*scale} r="7" fill={colors[i]} stroke="#0b1727" strokeWidth="2"/><text x={cx+p.re*scale+10} y={cy-p.im*scale-9} fill={colors[i]} fontSize="12" fontWeight="bold">x{i===3?'₃':['₀','₁','₂'][i]}</text></g>)}
    </svg>
  </div>;
}
