const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),W=require('./puzzle.js'),checks=[];
const words='春风\n花园\n森林\n星空\n月光\n海洋\n山川\n雨水';
assert.deepEqual(W.parse('cat\nＣＡＴ\n森林\n 123 ',10),['CAT','森林','123']);assert.deepEqual(W.parse('éé\ne\u0301e\u0301',8),['ÉÉ']);checks.push('Unicode normalization, uppercase, blank trimming and duplicate merge');
for(const input of ['', 'A', 'A B', '<script>', '你好🙂', Array(22).fill('AB').join('\n'),'ABCDEFGHIK'])assert.throws(()=>W.generate(input,8));for(const seed of [-1,NaN,2.2,4294967296])assert.throws(()=>W.generate(words,10,seed));assert.throws(()=>W.generate(words,9));checks.push('Empty, malformed, oversized and invalid seed/size inputs rejected');
assert.deepEqual(W.generate(words),W.generate(words));assert.notDeepEqual(W.generate(words,10,1).grid,W.generate(words,10,2).grid);checks.push('Identical seed repeats exact grid and answer paths');
let placements=0;
for(let seed=0;seed<80;seed++)for(const size of [8,10,12,16]){
 const p=W.generate(words+'\nHELLO\n2026',size,seed,Boolean(seed%2));assert.equal(p.placed.length+p.unplaced.length,p.requested.length);assert.equal(new Set([...p.placed.map(v=>v.word),...p.unplaced]).size,p.requested.length);assert.ok(p.grid.every(row=>row.length===size&&row.every(c=>Array.from(c).length===1)));
 for(const v of p.placed){assert.equal(v.path.map(([r,c])=>p.grid[r][c]).join(''),v.word);assert.equal(W.select(p,v.path[0],v.path.at(-1)).word,v.word);assert.ok(W.select(p,v.path.at(-1),v.path[0]));placements++;}
}
checks.push('320 seeded puzzles: every declared answer spells its word; all requests accounted for; '+placements+' answer paths verified');
const dense=W.generate(Array.from({length:20},(_,i)=>String.fromCharCode(65+i).repeat(8)).join('\n'),8,1);assert.ok(dense.unplaced.length>0);assert.equal(dense.unplaced.length+dense.placed.length,20);const p=W.generate(words);assert.equal(W.select(p,[-1,0],[1,0]),null);assert.equal(W.select(p,[0,0],[2,1]),null);assert.equal(W.select(p,[0,0],[0,0]),null);checks.push('Unplaceable words explicitly returned; invalid selections rejected');
const reversePair=W.generate('AB\nBA',8,7,true);for(const v of reversePair.placed)assert.equal(W.select(reversePair,v.path[0],v.path.at(-1)).word,v.word);checks.push('Reverse-pair words prioritize exact selected spelling');
const out=path.join(__dirname,'test-output');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'engine-results.json'),JSON.stringify({timestamp:new Date().toISOString(),status:'PASS',checks},null,2));console.log(checks);
