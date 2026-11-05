import{initializeApp}from"https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import{getAuth,signInWithEmailAndPassword,signOut,onAuthStateChanged,createUserWithEmailAndPassword}from"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import{initializeFirestore,doc,getDoc,setDoc,getDocs,collection,query,where}from"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
// Firebase web config (safe to be public; security comes from login + firestore.rules)
export const cfg={apiKey:"AIzaSyA0Ki7QChDrxDGvrwpAiXXiNjiA0ioUNbw",authDomain:"myhomerent-34d14.firebaseapp.com",projectId:"myhomerent-34d14",storageBucket:"myhomerent-34d14.firebasestorage.app",messagingSenderId:"872529806470",appId:"1:872529806470:web:e50739795cf1f48c61fd07"};
export const app=initializeApp(cfg),auth=getAuth(app),db=initializeFirestore(app,{experimentalForceLongPolling:true});
export const email=p=>p.replace(/\D/g,"").slice(-10)+"@myhomerent.app";
const ist=()=>new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Kolkata"});
export const ADMIN_EMAIL="pranavpande43@gmail.com",isAdminUser=u=>(u.email||"").toLowerCase()===ADMIN_EMAIL,lid=v=>v.includes("@")?v.trim().toLowerCase():email(v);
export const dateStr=ist;
export const month=()=>ist().slice(0,7),today=()=>+ist().slice(8);
export const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
export const go=u=>{document.body.classList.add("out");setTimeout(()=>location.href=u,250)};
export{signInWithEmailAndPassword,signOut,onAuthStateChanged,createUserWithEmailAndPassword,initializeApp,getAuth,doc,getDoc,setDoc,getDocs,collection,query,where};
