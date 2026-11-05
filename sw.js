// Ovale v0.49 : la page se recharge depuis le réseau quand il y en a (nouvelle version), sinon depuis le cache ; les bibliothèques restent en cache
const C='ovale-v0.49';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','https://cdn.jsdelivr.net/npm/peerjs@1.5.5/dist/peerjs.min.js'];
self.addEventListener('install',e=>{ self.skipWaiting(); e.waitUntil(caches.open(C).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{}))))); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(r.mode==='navigate'||u.pathname.endsWith('/index.html')||u.pathname.endsWith('/')){
    e.respondWith(fetch(r).then(res=>{ const cp=res.clone(); caches.open(C).then(c=>c.put('index.html',cp)); return res; }).catch(()=>caches.match('index.html')));
    return; }
  if(u.origin===location.origin||/cdnjs|jsdelivr|fonts\.(googleapis|gstatic)/.test(u.host)){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{ if(res.ok||res.type==='opaque'){ const cp=res.clone(); caches.open(C).then(c=>c.put(r,cp)); } return res; })));
  }
});
