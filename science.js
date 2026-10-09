import {bands} from './references.js';
export function parseQuery(text){
 const m=text.trim().match(/^(\d+(?:\.\d+)?)\s*(?:[-–]\s*(\d+(?:\.\d+)?))?$/);
 if(!m)throw Error('Enter a wavenumber or range, for example 1715 or 1650–1750.');
 const a=Number(m[1]),b=Number(m[2]??m[1]);
 if(a<400||b>4000||a>b||a>4000||b<400)throw Error('Use an ascending range between 400 and 4000 cm⁻¹.');
 return {min:a,max:b};
}
export function matchBands(query,tolerance=0){
 if(!Number.isFinite(tolerance)||tolerance<0||tolerance>100)throw Error('Tolerance must be between 0 and 100 cm⁻¹.');
 return bands.map(b=>({...b,distance:Math.max(b.min-query.max,query.min-b.max,0)})).filter(b=>b.distance<=tolerance).sort((a,b)=>a.distance-b.distance||a.max-a.min-(b.max-b.min));
}
export function parseCSV(text){
 const points=[],warnings=[];let skipped=0;
 for(const line of text.replace(/^\uFEFF/,'').split(/\r?\n/)){
  if(!line.trim()||line.startsWith('#'))continue;
  const parts=line.trim().split(/[,;\t]/).map(s=>s.trim().replace(/^"|"$/g,''));
  if(parts.length!==2||parts.some(s=>!s)||parts.some(s=>!Number.isFinite(Number(s)))){skipped++;continue;}
  points.push({x:Number(parts[0]),y:Number(parts[1])});
 }
 if(points.length<5)throw Error('At least five valid rows are required. Use two columns: wavenumber, intensity.');
 if(points.length>50000)throw Error('This prototype supports up to 50,000 samples per spectrum. Reduce the file size before importing.');
 if(points.some(p=>p.x<=0))throw Error('Wavenumbers must be positive.');
 const map=new Map();for(const p of points){if(map.has(p.x))throw Error('Duplicate wavenumbers found. Resolve duplicate rows before importing.');map.set(p.x,p);}
 if(skipped)warnings.push(`${skipped} header or invalid row(s) skipped.`);
 return {points:points.sort((a,b)=>a.x-b.x),warnings};
}
export function detectPeaks(points,type,threshold=5,separation=20,smooth=false){
 if(!['absorbance','transmittance'].includes(type))throw Error('Select the intensity type.');
 if(type==='transmittance'&&points.some(p=>p.y<0||p.y>100))throw Error('Percent transmittance must be between 0 and 100.');
 const values=points.map((p,i)=>smooth?points.slice(Math.max(0,i-2),i+3).reduce((s,p)=>s+p.y,0)/points.slice(Math.max(0,i-2),i+3).length:p.y);
 const sign=type==='transmittance'?-1:1, v=values.map(y=>sign*y),span=Math.max(...values)-Math.min(...values);
 if(!span)return [];
 const candidates=[];
 for(let i=1;i<v.length-1;i++)if(v[i]>v[i-1]&&v[i]>=v[i+1]){
  // Local contrast within ±50 cm⁻¹; deliberately not called true prominence.
  let left=i-1,right=i+1;
  while(left>0&&points[i].x-points[left-1].x<=50)left--;
  while(right<v.length-1&&points[right+1].x-points[i].x<=50)right++;
  const contrast=Math.min(v[i]-Math.min(...v.slice(left,i)),v[i]-Math.min(...v.slice(i+1,right+1)))/span*100;
  if(contrast>=threshold)candidates.push({...points[i],contrast});
 }
 const selected=[];
 for(const p of candidates.sort((a,b)=>b.contrast-a.contrast))if(selected.every(q=>Math.abs(q.x-p.x)>=separation))selected.push(p);
 return selected.sort((a,b)=>b.x-a.x);
}
