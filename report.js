import {matchBands} from './science.js?v=3';
export function buildReport(peaks,tolerance,metadata){
 return {version:1,createdAt:new Date().toISOString(),metadata,tolerance,limitation:'Candidate assignments only; not compound identification. Unmatched peaks indicate limited reference coverage.',peaks:peaks.map(p=>({...p,assignments:matchBands({min:p.x,max:p.x},tolerance)}))};
}
export function reportCSV(report){
 const quote=v=>'"'+String(v??'').replaceAll('"','""')+'"';
 const rows=[['Wavenumber (cm-1)','Origin','Group','Bond','Reference min','Reference max','Reference type','Distance (cm-1)','Evidence','Source','URL','Limitations']];
 for(const p of report.peaks){const matches=p.assignments.length?p.assignments:[null];for(const b of matches)rows.push([p.x,p.origin??'Detected',b?.group??'Unmatched',b?.bond,b?.min,b?.max,b?.rangeKind??'Reference range',b?.distance,b?.evidence,b?`${b.source.author}; ${b.source.publisher}; ${b.source.title}; ${b.source.license}`:'',b?.source.url,b?.note??report.limitation]);}
 return rows.map(row=>row.map(quote).join(',')).join('\r\n');
}
