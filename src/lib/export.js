import { fmt } from './complex.js';

export function toCSV(rows) {
  const headers=['Iteración','x0','x1','x2','h0','h1','delta0','delta1','a','b','c','discriminante','denominador','x3','f(x3)','error_relativo_%'];
  const columns=['i','x0','x1','x2','h0','h1','delta0','delta1','a','b','c','discriminant','denominator','x3','f3','errorPercent'];
  const q=v=>'"'+String(v??'').replaceAll('"','""')+'"';
  return '\uFEFF'+[headers.map(q).join(';'),...rows.map(r=>columns.map(k=>q(typeof r[k]==='number'?r[k]:fmt(r[k],12))).join(';'))].join('\r\n');
}
export function saveFile(filename,content,mimetype) {
  const blob=new Blob([content],{type:mimetype});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');link.href=url;link.download=filename;
  document.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),2000);
}
