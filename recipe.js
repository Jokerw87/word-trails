(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./puzzle.js'):root.WordTrails);if(typeof module==='object'&&module.exports)module.exports=api;else root.WordRecipe=api;})(globalThis,function(engine){
 'use strict';const MAX_BYTES=16384,keys=['format','version','title','words','size','seed','reverse'];
 function validate(v){if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).length!==keys.length||keys.some(k=>!Object.hasOwn(v,k)))throw Error('配置字段不符');if(v.format!=='word-trails-recipe'||v.version!==1)throw Error('配置版本不支持');if(typeof v.title!=='string'||v.title.length>24||typeof v.words!=='string'||typeof v.size!=='number'||typeof v.seed!=='number'||typeof v.reverse!=='boolean')throw Error('配置类型或标题长度不符');engine.generate(v.words,v.size,v.seed,v.reverse);return Object.fromEntries(keys.map(k=>[k,v[k]]));}
 function parse(text){if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_BYTES)throw Error('配置不得超过16 KiB');return validate(JSON.parse(text));}
 return{MAX_BYTES,validate,parse};
});
