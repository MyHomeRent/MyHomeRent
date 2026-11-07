if("serviceWorker" in navigator)addEventListener("load",()=>navigator.serviceWorker.register("sw.js",{updateViaCache:"none"}));
let ev;const ua=navigator.userAgent,ios=/iphone|ipad|ipod/i.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1),sa=matchMedia("(display-mode: standalone)").matches||navigator.standalone,K="mhr_inst",
btns=v=>document.querySelectorAll(".inst").forEach(b=>b.hidden=!v),
snoozed=()=>{try{return Date.now()-(+localStorage.getItem(K)||0)<6048e5}catch{return 0}},
close=()=>{const s=document.getElementById("ib");if(s){s.classList.add("dn");setTimeout(()=>s.remove(),300)}};
function banner(fb){if(sa||snoozed()||document.getElementById("ib")||!(ev||ios||fb))return;
 const s=document.createElement("div");s.id="ib";s.className="ib";
 s.innerHTML='<img src="icon-192.png" alt=""><div><b>Install Myhomerent</b>'+(ev?'Add it to your home screen to open it like an app.':(ios?'Tap <svg viewBox="0 0 24 24"><path d="M12 3v12M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg> Share, then Add to Home Screen.':'Open the browser menu (&#8942;) and tap Install app or Add to Home screen.'))+'</div>'+(ev?'<button class="inst">Install</button>':'')+'<button class="g t x" aria-label="Close">&#10005;</button>';
 s.querySelector(".x").onclick=()=>{try{localStorage.setItem(K,Date.now())}catch{}close()};const mn=document.querySelector("main");if(mn&&!mn.classList.contains("login")){s.classList.add("fl");mn.prepend(s)}else document.body.append(s)}
addEventListener("beforeinstallprompt",e=>{e.preventDefault();ev=e;btns(true);setTimeout(banner,1500)});
addEventListener("click",async e=>{if(ev&&e.target.closest(".inst")){ev.prompt();await ev.userChoice;ev=null;btns(false);close()}});
addEventListener("appinstalled",()=>{ev=null;btns(false);close()});
if(ios&&!sa)addEventListener("load",()=>setTimeout(banner,2000));
if(!ios&&!sa)addEventListener("load",()=>setTimeout(()=>{if(!ev)banner(1)},4000));
