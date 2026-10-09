export const source = {author:'John McMurry',title:'Organic Chemistry, §12.7, Table 12.1',publisher:'OpenStax',year:2023,url:'https://openstax.org/books/organic-chemistry/pages/12-7-interpreting-infrared-spectra',license:'CC BY-NC-SA 4.0',reviewed:'2026-10-09'};
// Numeric reference facts, transcribed from Table 12.1. No generated assignments.
export const bands = [
 ['alkane-ch','Alkane','C–H',2850,2960,'Medium'],
 ['alkene-ch','Alkene','=C–H',3020,3100,'Medium'],
 ['alkene-cc','Alkene','C=C',1640,1680,'Medium'],
 ['alkyne-cc','Alkyne','C≡C',2100,2260,'Medium'],
 ['halide-cl','Alkyl chloride','C–Cl',600,800,'Strong'],
 ['halide-br','Alkyl bromide','C–Br',500,600,'Strong'],
 ['alcohol-oh','Alcohol','O–H',3400,3650,'Strong, broad'],
 ['alcohol-co','Alcohol','C–O',1050,1150,'Strong'],
 ['amine-nh','Amine','N–H',3300,3500,'Medium'],
 ['amine-cn','Amine','C–N',1030,1230,'Medium'],
 ['carbonyl','Carbonyl compound','C=O',1670,1780,'Strong'],
 ['acid-oh','Carboxylic acid','O–H',2500,3100,'Strong, broad'],
 ['nitrile','Nitrile','C≡N',2210,2260,'Medium']
].map(([id,group,bond,min,max,intensity])=>({id,group,bond,min,max,intensity,source,evidence:'Textbook reference range'}));

// The manufacturer reports approximate positions, not a band interval.
// ±25 cm⁻¹ is an application screening window, not a published width.
const atmosphereSource = {author:'Shimadzu Corporation',title:'FTIR FAQ 4: Atmospheric water vapor and carbon dioxide',publisher:'Shimadzu',year:'n.d.',url:'https://www.shimadzu.com/an/service-support/faq/ftir/4/index.html',license:'Linked manufacturer guidance; no spectrum or image redistributed',reviewed:'2026-10-09'};
for(const [id,center] of [['co2-atmosphere-stretch',2350],['co2-atmosphere-bend',670]]) bands.push({id,group:'Carbon dioxide (CO₂) · possible background interference',bond:'CO₂ absorption',min:center-25,max:center+25,center,intensity:'Not specified by source',source:atmosphereSource,evidence:'Manufacturer guidance: approximate position',rangeKind:'Application screening window',note:`Source reports absorption near ${center} cm⁻¹. The ±25 cm⁻¹ screening window is an application heuristic, not a source-reported band width. Atmospheric CO₂ or a background mismatch is possible; this peak alone does not establish CO₂ in the sample. Check the background spectrum, repeat with a fresh background or purge, and inspect the companion CO₂ region near ${center===2350?670:2350} cm⁻¹.`});
