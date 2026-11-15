import React from 'react';
import { fmt } from '../lib/complex.js';
import { Download, Table2 } from 'lucide-react';
import { saveFile, toCSV } from '../lib/export.js';

const columns=[
  ['i','i'],['x0','x₀'],['x1','x₁'],['x2','x₂'],
  ['h0','h₀'],['h1','h₁'],['delta0','δ₀'],['delta1','δ₁'],
  ['a','a'],['b','b'],['c','c'],['discriminant','Δ'],
  ['denominator','Denominador'],['x3','x₃'],['f3','f(x₃)'],['errorPercent','εₐ (%)']
];
export default function IterationTable({rows,selected,onSelect}) {
  return <section className="surface panel-iterations" id="iteraciones">
    <div className="section-header flex-wrap-gap">
      <div><div className="tiny-eyebrow">Rastro numérico</div><h2><Table2 size={18}/> Tabla de iteraciones</h2><p>Todos los coeficientes de la interpolación cuadrática, sin omitir los cálculos complejos.</p></div>
      <button type="button" className="button ghost small" disabled={!rows.length} onClick={()=>saveFile('muller_iteraciones.csv',toCSV(rows),'text/csv;charset=utf-8')}><Download size={15}/> Exportar CSV</button>
    </div>
    {!rows.length?<div className="no-rows">Aún no hay iteraciones para mostrar.</div>:
    <>
      <div className="table-scroller" tabIndex="0" aria-label="Tabla desplazable de iteraciones">
        <table className="iterations-table"><thead><tr>{columns.map(([key,name])=><th key={key}>{name}</th>)}</tr></thead>
        <tbody>{rows.map((row,i)=><tr key={row.i} className={i===selected?'selected':''} onClick={()=>onSelect(i)} title="Seleccionar iteración para la gráfica">
          {columns.map(([key])=><td key={key} className={key==='i'?'number-cell':''}>{key==='i'?row.i:key==='errorPercent'?(row.errorPercent===null?'n/d':Number(row.errorPercent).toExponential(3)):fmt(row[key],8)}</td>)}
        </tr>)}</tbody></table>
      </div>
      <div className="table-bottom"><span>Desliza horizontalmente para ver las 16 columnas.</span><span>{rows.length} iteraciones · Selecciona una fila para graficarla</span></div>
    </>}
  </section>;
}
