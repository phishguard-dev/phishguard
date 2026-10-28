const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/script.js','utf8');
const start=src.indexOf('const shorteners=');const end=src.indexOf('function renderAnalysis()',start);
const sandbox={URL,console};vm.createContext(sandbox);vm.runInContext(src.slice(start,end),sandbox);
const check=(url)=>sandbox.analyzeUrl(url).flags;
for(const url of ['https://sberbanc.ru','https://sberbnk.ru','https://sberbaank.ru','https://goog1e.com','https://sberbank.ru.fake-site.example']){
 const f=check(url);assert(f.some(x=>x.brand||x.title.includes('поддомене')),url+' not flagged');console.log('FLAG',url,f.filter(x=>x.brand||x.title.includes('поддомене')).map(x=>x.title));
}
for(const url of ['https://sberbank.ru','https://tbank.ru','https://github.com','https://vk.com','https://google.com']){
 const f=check(url);assert(!f.some(x=>x.brand),url+' false positive');console.log('CLEAN',url);
}
console.log('BRANDS',vm.runInContext('brandRegistry.length',sandbox),'DOMAINS',vm.runInContext('officialDomains.size',sandbox));
