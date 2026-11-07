const C="mhr-v7",S=["./","index.html","admin.html","renter.html","css/style.css","js/pwa.js","js/firebase.js","js/receipt.js","manifest.json","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(C).then(c=>c.addAll(S)).catch(()=>0).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
const put=(r,res)=>{if(res.ok){const c=res.clone();caches.open(C).then(x=>x.put(r,c))}return res};
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!="GET")return;const u=new URL(r.url),same=u.origin==location.origin;
 if(same)return e.respondWith(Promise.race([fetch(r),new Promise((_,j)=>setTimeout(j,4000))]).then(res=>put(r,res)).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));
 if(/\/firebasejs\/|cdnjs\.cloudflare\.com|fonts\.(gstatic|googleapis)/.test(u.href))e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>put(r,res))))});
