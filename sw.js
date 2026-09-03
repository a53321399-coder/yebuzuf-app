const CACHE='yebuzufinal-v4.0-icon2';
const ASSETS=[
  './',
  './index.html',
  './manifest.webmanifest?v=20260904-icon2',
  './icon-192.png?v=20260904-icon2',
  './icon-512.png?v=20260904-icon2',
  './apple-touch-icon.png?v=20260904-icon2'
];
self.addEventListener('install',e=>e.waitUntil(
  caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())
));
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(keys=>Promise.all(
    keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
  )).then(()=>self.clients.claim())
));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(url.pathname.endsWith('/index.html')||url.pathname.endsWith('/')){
    e.respondWith(
      fetch(e.request,{cache:'no-store'}).then(r=>{
        if(r&&r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}
        return r;
      }).catch(()=>caches.match(e.request))
    );
    return;
  }
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)));
});
