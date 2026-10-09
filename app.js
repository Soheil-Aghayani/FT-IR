import {parseQuery,matchBands,parseCSV,detectPeaks} from './science.js';
const $=id=>document.getElementById(id);
let spectrum=null,query=parseQuery('1715'),peaks=[];
const number=n=>Number(n.toFixed(2)).toLocaleString('en-US',{maximumFractionDigits:2});
function status(message){$('status').textContent=message;}
function element(tag,text,className){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(className)e.className=className;return e;}
function svgElement(tag,attributes){const e=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v]of Object.entries(attributes))e.setAttribute(k,v);return e;}
function plot(matches){
 const svg=svgElement('svg',{viewBox:'0 0 800 300',role:'img','aria-label':spectrum?'Raw spectrum with candidate peak markers; wavenumber decreases from left to right':'Reference band ranges on a decreasing wavenumber axis'});
 const lo=spectrum?Math.min(spectrum.points[0].x,400):400,hi=spectrum?Math.max(spectrum.points.at(-1).x,4000):4000;
 const x=n=>56+(hi-n)/(hi-lo)*720;
 let min=0,max=1;if(spectrum){min=Math.min(...spectrum.points.map(p=>p.y));max=Math.max(...spectrum.points.map(p=>p.y));if(min===max)max=min+1;}
 const y=n=>244-(n-min)/(max-min)*205;
 for(let i=0;i<5;i++){const yy=39+i*51.25;svg.append(svgElement('line',{x1:56,x2:776,y1:yy,y2:yy,stroke:'#e9eaed'}));const t=svgElement('text',{x:45,y:yy+4,'text-anchor':'end',fill:'#65666d','font-size':11});t.textContent=spectrum?number(max-i*(max-min)/4):'';svg.append(t);}
 for(const b of matches){svg.append(svgElement('rect',{x:x(b.max),y:35,width:Math.max(2,x(b.min)-x(b.max)),height:210,fill:'#0066cc',opacity:'.08'}));}
 svg.append(svgElement('rect',{x:x(query.max),y:35,width:Math.max(2,x(query.min)-x(query.max)),height:210,fill:'#0066cc',opacity:'.18'}));
 if(spectrum){svg.append(svgElement('polyline',{points:spectrum.points.map(p=>`${x(p.x)},${y(p.y)}`).join(' '),fill:'none',stroke:'#286eaa','stroke-width':1.7,'stroke-linejoin':'round'}));for(const p of peaks)svg.append(svgElement('circle',{cx:x(p.x),cy:y(p.y),r:4,fill:'#0066cc',stroke:'white','stroke-width':2}));}
 else{const t=svgElement('text',{x:416,y:133,'text-anchor':'middle',fill:'#65666d','font-size':14});t.textContent='Import a spectrum to see your measurements';svg.append(t);}
 for(const n of [4000,3500,3000,2500,2000,1500,1000,400]){const t=svgElement('text',{x:x(n),y:270,'text-anchor':'middle',fill:'#65666d','font-size':11});t.textContent=n;svg.append(t);}
 const label=svgElement('text',{x:416,y:296,'text-anchor':'middle',fill:'#65666d','font-size':11});label.textContent='Wavenumber (cm⁻¹)';svg.append(label);
 if(spectrum){const intensity=svgElement('text',{x:56,y:18,fill:'#65666d','font-size':11});intensity.textContent=$('type').value==='transmittance'?'Transmittance (%)':'Absorbance';svg.append(intensity);}
 $('plot').replaceChildren(svg);
}
function search(){
 try{query=parseQuery($('query').value);const tolerance=Number($('tolerance').value);if(!$('tolerance').value)throw Error('Enter a tolerance.');const matches=matchBands(query,tolerance);
 $('result-title').textContent=`Matches ${query.min===query.max?'near':'within'} ${number(query.min)}${query.min===query.max?'':`–${number(query.max)}`} cm⁻¹`;
 $('result-count').textContent=`${matches.length} possible ${matches.length===1?'assignment':'assignments'}`;
 $('results').replaceChildren();
 for(const b of matches){const card=element('article',undefined,'result'),top=element('div',undefined,'result-top'),heading=element('h3',b.group);heading.append(element('span',b.bond,'bond'));top.append(heading,element('span',`${b.min}–${b.max} cm⁻¹`,'range'));card.append(top,element('p',`${b.distance===0?'Direct range overlap':`${number(b.distance)} cm⁻¹ from the reference range`} · Reference intensity: ${b.intensity}`));const details=element('details');details.append(element('summary','Inspect evidence & source'),element('p',`${b.evidence}. General organic-chemistry guidance; no sample-specific validation. Overlapping bands and measurement conditions may change the interpretation.`),element('p',`${b.source.author} · ${b.source.title} · ${b.source.year}. Reviewed ${b.source.reviewed}. ${b.source.license}.`));const link=element('a','Open source table');link.href=b.source.url;link.target='_blank';link.rel='noreferrer';details.append(link);card.append(details);$('results').append(card);}
 if(!matches.length)$('results').append(element('p','No matching bands in this limited reference set. This does not establish that a functional group is absent.','muted'));
 plot(matches);return true;
 }catch(e){status(e.message);return false;}
}
function analyze(){
 if(!spectrum)return;
 try{const threshold=Number($('contrast').value),separation=Number($('separation').value);if(!$('contrast').value||threshold<0.1||threshold>100||!$('separation').value||separation<1||separation>500)throw Error('Use contrast 0.1–100% and separation 1–500 cm⁻¹.');
 peaks=detectPeaks(spectrum.points,$('type').value,threshold,separation,$('smooth').checked);$('peaks').replaceChildren();for(const p of peaks){const button=element('button',`${number(p.x)} cm⁻¹`);button.title=`Search candidate; local contrast ${number(p.contrast)}%`;button.onclick=()=>{$('query').value=p.x.toFixed(2);search();};$('peaks').append(button);}status(`${peaks.length} candidate peaks. ${spectrum.warnings.join(' ')} Review candidates before interpreting. ${$('smooth').checked?'Detection uses a five-point average.':'Detection uses raw intensity.'}`);search();
 }catch(e){peaks=[];$('peaks').replaceChildren();search();status(e.message);}
}
function load(data,name){spectrum=data;peaks=[];$('file-name').textContent=name;$('plot-title').textContent='Your spectrum';$('plot-badge').textContent='Raw measurements';$('plot-note').textContent=`${data.points.length.toLocaleString()} samples · ${number(data.points[0].x)}–${number(data.points.at(-1).x)} cm⁻¹. Select intensity type, then detect candidates. No baseline correction applied.`;$('analysis-controls').hidden=false;$('peaks').replaceChildren();status(`Loaded locally. ${data.warnings.join(' ')} Confirm the intensity type before detection.`);search();}
 $('search-form').onsubmit=e=>{e.preventDefault();status('');search();};
 document.querySelectorAll('[data-query]').forEach(b=>b.onclick=()=>{$('query').value=b.dataset.query;status('');search();});
 $('csv').onchange=async()=>{const file=$('csv').files[0];if(!file)return;try{if(file.size>5*1024*1024)throw Error('File exceeds 5 MB.');load(parseCSV(await file.text()),file.name);}catch(e){status(e.message);}finally{$('csv').value='';}};
 $('demo').onclick=()=>{const points=[];for(let x=400;x<=4000;x+=2){let y=96;for(const [center,width,height]of [[3420,90,23],[2920,24,12],[1715,18,62],[1120,22,32]])y-=height*Math.exp(-.5*((x-center)/width)**2);points.push({x,y});}$('type').value='transmittance';load({points,warnings:['Synthetic example, not an experimental or reference spectrum.']},'Synthetic demonstration');analyze();};
 $('analyze').onclick=analyze;$('type').onchange=()=>{peaks=[];$('peaks').replaceChildren();search();status('Intensity type changed. Run detection again.');};search();
