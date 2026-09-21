'use strict';
const $=id=>document.getElementById(id),defaultWords=$('words').value;
let puzzle=null,first=null,found=new Set(),foundCells=new Set(),paperTitle='';
const key=([r,c])=>r+','+c;
function invalidate(){puzzle=null;for(const id of ['question','answer'])$(id).disabled=true;$('status').textContent='内容已修改，请重新生成。旧字阵暂不能继续答题或导出。';}
function choose(r,c){if(!puzzle)return;if(!first){first=[r,c];renderState();$('progress').textContent='已选起点，再选同一直线上的终点。';return;}const match=WordTrails.select(puzzle,first,[r,c]);first=null;if(match){found.add(match.word);match.path.forEach(p=>foundCells.add(key(p)));}renderState(match?'找到：'+match.word:'这里没有目标词语，请重新选择。');}
function renderState(message=''){document.querySelectorAll('.cell').forEach(b=>{b.classList.toggle('start',first&&b.dataset.key===key(first));b.classList.toggle('found',foundCells.has(b.dataset.key));b.setAttribute('aria-pressed',String(Boolean(first&&b.dataset.key===key(first))));});document.querySelectorAll('#clues li').forEach(li=>li.classList.toggle('done',found.has(li.textContent)));$('progress').textContent=(message?message+' ':'')+'已找到 '+found.size+' / '+puzzle.placed.length+' 个词语。';}
function generate(){try{const p=WordTrails.generate($('words').value,Number($('size').value),Number($('seed').value),$('reverse').checked);puzzle=p;paperTitle=$('title').value.trim()||'词语寻宝纸';found=new Set();foundCells=new Set();first=null;$('heading').textContent=paperTitle;$('board').replaceChildren();$('board').style.gridTemplateColumns=`repeat(${p.size},1fr)`;for(let r=0;r<p.size;r++)for(let c=0;c<p.size;c++){const b=document.createElement('button');b.className='cell';b.textContent=p.grid[r][c];b.dataset.key=key([r,c]);b.setAttribute('aria-label',`第${r+1}行 第${c+1}列 ${p.grid[r][c]}`);b.onclick=()=>choose(r,c);$('board').append(b);}$('clues').replaceChildren(...p.placed.map(v=>{const li=document.createElement('li');li.textContent=v.word;return li;}));$('status').textContent=`已放入 ${p.placed.length} / ${p.requested.length} 个词语。种子 ${p.seed}。`+(p.unplaced.length?'未放入：'+p.unplaced.join('、')+'。请增大字阵或减少词语。':'全部放入。');for(const id of ['question','answer'])$(id).disabled=p.placed.length===0;renderState();}catch(e){invalidate();$('status').textContent='无法生成：'+e.message;}}
function exportPaper(answer){
  if(!puzzle)return;
  const p=puzzle,canvas=document.createElement('canvas');canvas.width=1200;canvas.height=1800;
  const g=canvas.getContext('2d');g.fillStyle='#fffdf5';g.fillRect(0,0,1200,1800);g.fillStyle='#343840';
  g.font='22px system-ui';g.fillText('WORD TRAILS / '+(answer?'答案参考':'词语寻宝'),75,75);
  let font=46;do{g.font=`${font}px "Microsoft YaHei",system-ui`;if(g.measureText(paperTitle).width<=1050)break;font-=2;}while(font>18);
  g.fillText(paperTitle,75,145);g.font='20px system-ui';g.fillText(`${p.size}×${p.size} · 种子 ${p.seed} · 寻找 ${p.placed.length} 个词语`,75,190);
  const left=100,top=240,step=1000/p.size,cells=new Set(answer?p.placed.flatMap(v=>v.path.map(key)):[]);
  g.textAlign='center';g.textBaseline='middle';
  for(let r=0;r<p.size;r++)for(let c=0;c<p.size;c++){
    g.fillStyle=cells.has(key([r,c]))?'#d3df97':'#fffdf5';g.fillRect(left+c*step,top+r*step,step,step);
    g.strokeStyle='#c6bd9c';g.lineWidth=1;g.strokeRect(left+c*step,top+r*step,step,step);
    g.fillStyle='#343840';g.font=`${Math.min(46,step*.6)}px "Microsoft YaHei",system-ui`;
    g.fillText(p.grid[r][c],left+(c+.5)*step,top+(r+.5)*step);
  }
  g.textAlign='left';g.textBaseline='alphabetic';g.font='22px "Microsoft YaHei",system-ui';
  let x=75,y=1310;for(const v of p.placed){const label=v.word+'   ',width=g.measureText(label).width;if(x+width>1125){x=75;y+=35;}g.fillText(label,x,y);x+=width;}
  g.font='18px system-ui';g.fillText(answer?'着色仅标出生成路径；额外匹配也算正确。':'先找到一个词语，再沿横、竖或斜线圈出它。',75,1730);
  g.fillText('本地生成 · 请自行检查词语内容是否适合使用对象',75,1765);
  canvas.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=answer?'word-trails-answer.png':'word-trails-puzzle.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);},'image/png');
}
$('form').onsubmit=e=>{e.preventDefault();generate();};['title','words','size','seed','reverse'].forEach(id=>$(id).addEventListener('input',invalidate));$('question').onclick=()=>exportPaper(false);$('answer').onclick=()=>exportPaper(true);$('reset').onclick=()=>{if(!confirm('恢复自然词表示例？当前词表和答题进度将丢失。'))return;$('words').value=defaultWords;$('title').value='自然里的小发现';$('size').value=10;$('seed').value=2026;$('reverse').checked=false;generate();};generate();
