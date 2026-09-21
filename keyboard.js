'use strict';
// Progressive keyboard navigation; no change to puzzle generation or matching.
(function(){
 const board=document.getElementById('board');
 function rove(button){for(const cell of board.querySelectorAll('.cell'))cell.tabIndex=cell===button?0:-1;}
 function initialize(){rove(board.querySelector('.cell'));}
 new MutationObserver(initialize).observe(board,{childList:true});initialize();
 board.addEventListener('focusin',e=>{if(e.target.matches('.cell'))rove(e.target);});
 board.addEventListener('keydown',e=>{
  if(!e.target.matches('.cell'))return;
  if(e.key==='Escape'){e.preventDefault();if(puzzle){first=null;renderState('已取消起点。');}return;}
  const moves={ArrowLeft:[0,-1],ArrowRight:[0,1],ArrowUp:[-1,0],ArrowDown:[1,0]};
  if(!moves[e.key]&&!['Home','End'].includes(e.key))return;
  e.preventDefault();const cells=[...board.querySelectorAll('.cell')],size=Math.sqrt(cells.length);let [r,c]=e.target.dataset.key.split(',').map(Number);
  if(moves[e.key]){r=Math.max(0,Math.min(size-1,r+moves[e.key][0]));c=Math.max(0,Math.min(size-1,c+moves[e.key][1]));}
  else {if(e.ctrlKey)r=e.key==='Home'?0:size-1;c=e.key==='Home'?0:size-1;}
  const next=cells[r*size+c];rove(next);next.focus();
 });
 const instructions=board.closest('section').querySelector('p.note');instructions.textContent='点击起点、再点终点。键盘 Tab 进入字阵，方向键移动，空格或 Enter 选格，Escape 取消起点；Home / End 到行首尾，Ctrl + Home / End 到字阵首尾。Tab 可离开字阵。';
 document.title='词语寻宝纸 V1.1 · Word Trails';
})();
