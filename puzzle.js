(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.WordTrails=api;})(globalThis,function(){
  'use strict';
  const directions=[[0,1],[1,0],[1,1],[-1,1],[0,-1],[-1,0],[-1,-1],[1,-1]];
  const chars=s=>Array.from(s);
  function parse(input,size){
    if(typeof input!=='string'||input.length>2000)throw Error('词表最多2000字符');
    if(![8,10,12,16].includes(size))throw Error('字阵大小无效');
    const lines=input.split(/\r?\n/).map(s=>s.trim().normalize('NFKC').toUpperCase()).filter(Boolean);
    if(!lines.length||lines.length>20)throw Error('请输入1—20行词语');
    if(lines.some(s=>! /^[\p{L}\p{N}]+$/u.test(s)))throw Error('词语仅接受汉字、字母和数字；请去掉空格、标点或表情');
    if(lines.some(s=>chars(s).length<2||chars(s).length>size))throw Error('每个词语须有2—'+size+'个字符');
    return [...new Set(lines)];
  }
  function rng(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
  function generate(input,size=10,seed=2026,reverse=false){
    if(!Number.isInteger(seed)||seed<0||seed>4294967295||typeof reverse!=='boolean')throw Error('种子或方向设置无效');
    const words=parse(input,size),random=rng(seed),grid=Array.from({length:size},()=>Array(size).fill('')),placed=[],unplaced=[],dirs=directions.slice(0,reverse?8:3);
    const ordered=words.map((word,index)=>({word,index})).sort((a,b)=>chars(b.word).length-chars(a.word).length||a.index-b.index);
    for(const {word,index}of ordered){const letters=chars(word),candidates=[];
      for(let row=0;row<size;row++)for(let col=0;col<size;col++)for(const [dr,dc]of dirs){const endR=row+dr*(letters.length-1),endC=col+dc*(letters.length-1);if(endR<0||endR>=size||endC<0||endC>=size)continue;let overlap=0,ok=true;const path=[];for(let k=0;k<letters.length;k++){const r=row+dr*k,c=col+dc*k;path.push([r,c]);if(grid[r][c]&&grid[r][c]!==letters[k]){ok=false;break;}if(grid[r][c])overlap++;}if(ok)candidates.push({path,score:overlap+random()});}
      candidates.sort((a,b)=>b.score-a.score);if(!candidates.length){unplaced.push(word);continue;}const path=candidates[0].path;path.forEach(([r,c],i)=>grid[r][c]=letters[i]);placed.push({word,index,path});
    }
    const pool=[...new Set(chars(words.join('')))];for(const row of grid)for(let c=0;c<size;c++)if(!row[c])row[c]=pool[Math.floor(random()*pool.length)];
    placed.sort((a,b)=>a.index-b.index);return{schema:'word-trails-v1',size,seed,reverse,grid,placed,unplaced,requested:words};
  }
  function select(p,a,b){
    if(![a,b].every(v=>Array.isArray(v)&&v.length===2&&v.every(n=>Number.isInteger(n)&&n>=0&&n<p.size)))return null;
    const dr=b[0]-a[0],dc=b[1]-a[1];if((dr===0&&dc===0)||(dr!==0&&dc!==0&&Math.abs(dr)!==Math.abs(dc)))return null;
    const n=Math.max(Math.abs(dr),Math.abs(dc))+1,path=[];for(let i=0;i<n;i++)path.push([a[0]+Math.sign(dr)*i,a[1]+Math.sign(dc)*i]);
    const value=path.map(([r,c])=>p.grid[r][c]).join(''),back=chars(value).reverse().join('');
    const match=p.placed.find(v=>v.word===value)||p.placed.find(v=>v.word===back);
    return match?{word:match.word,path}:null;
  }
  return{parse,generate,select};
});
