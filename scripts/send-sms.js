import admin from "firebase-admin";
import Client from "android-sms-gateway";
admin.initializeApp({credential:admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))});
const db=admin.firestore(),ist=new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Kolkata"}),M=ist.slice(0,7),day=+ist.slice(8);
const j=r=>r.json();
const http={get:(u,h)=>fetch(u,{headers:h}).then(j),post:(u,b,h)=>fetch(u,{method:"POST",headers:{"Content-Type":"application/json",...h},body:JSON.stringify(b)}).then(j),delete:(u,h)=>fetch(u,{method:"DELETE",headers:h}).then(j)};
const api=new Client(process.env.SMSGATE_USER,process.env.SMSGATE_PASS,http);
const s=(await db.doc("settings/payment").get()).data()||{};
const tpl=s.smsTemplate||"Hello {name}, your rent of Rs {rent} for {month} was due on {due}. Please pay now. {payment}";
for(const d of (await db.collection("renters").get()).docs){
  const r=d.data();if(day<=r.dueDay)continue;               // not overdue yet
  const ref=db.doc(`payments/${r.uid}_${M}`),p=(await ref.get()).data()||{};
  if(p.status==="received"||p.smsSent)continue;             // paid, or SMS already sent this month
  const text=tpl.replace(/{name}/g,r.name).replace(/{rent}/g,r.rent).replace(/{month}/g,M).replace(/{due}/g,`${M}-${String(r.dueDay).padStart(2,"0")}`).replace(/{payment}/g,s.details||"");
  try{await api.send({phoneNumbers:["+91"+r.phone],message:text});
    await ref.set({renterId:r.uid,month:M,status:p.status||"pending",smsSent:true},{merge:true});console.log("SMS sent")}
  catch(e){console.error("SMS failed")}}
