// PDFs (receipt, statement, report) are built in the browser with jsPDF. Receipt no = MHR-YYYYMM-<10 digit phone>, so it can be checked against the records.
const T=[15,118,110],I=[14,42,43],MU=[91,113,114],R=[180,35,24],G=[21,128,61];
const mn=m=>new Date(m+"-15").toLocaleString("en-IN",{month:"long",year:"numeric"}),ms=m=>new Date(m+"-15").toLocaleString("en-IN",{month:"short",year:"numeric"}),rs=n=>"Rs. "+Number(n).toLocaleString("en-IN");
const nx=m=>{let[y,o]=m.split("-").map(Number);o++;if(o>12){o=1;y++}return y+"-"+String(o).padStart(2,"0")};
export const rno=(m,ph)=>"MHR-"+m.replace("-","")+"-"+ph;
export function dues(r,ps,M,td){
  const rec=ps.filter(p=>p.status=="received"),got=new Set(rec.map(p=>p.month)),first=r.since||ps.map(p=>p.month).sort()[0]||M,months=[];
  for(let m=first,i=0;m<=M&&i<240;m=nx(m),i++)if(!got.has(m)&&(m<M||td>r.dueDay))months.push(m);
  return{months,amt:months.length*(+r.rent),paid:rec.reduce((s,p)=>s+(+p.amount||+r.rent),0)};
}
const pdf=()=>{const{jsPDF}=window.jspdf;return new jsPDF({unit:"mm",format:"a4"})};
function band(d,t,s){d.setFillColor(...T);d.rect(0,0,210,38,"F");d.setTextColor(255);d.setFont("helvetica","bold");d.setFontSize(22);d.text("Myhomerent",15,18);
  d.setFont("helvetica","normal");d.setFontSize(11);d.text(t,15,28);d.setFontSize(10);s.forEach((x,i)=>d.text(x,195,18+i*10,{align:"right"}))}
function txt(d,s,x,y,w,c,sz,b){d.setFont("helvetica",b?"bold":"normal");d.setFontSize(sz);d.setTextColor(...c);const L=d.splitTextToSize(s,w);d.text(L,x,y);return y+L.length*(sz*0.45)+2}
const foot=(d,s)=>{d.setFont("helvetica","normal");d.setFontSize(9);d.setTextColor(...MU);d.text(s,105,287,{align:"center"})};
const fd=s=>s?new Date(s+"T12:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"-";
function words(n){const a=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],b=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"],t=x=>x<20?a[x]:b[Math.floor(x/10)]+(x%10?" "+a[x%10]:""),h=x=>x>99?a[Math.floor(x/100)]+" Hundred"+(x%100?" "+t(x%100):""):t(x);n=Math.round(+n);if(!n)return"Zero";const o=[];for(const[v,l]of[[1e7,"Crore"],[1e5,"Lakh"],[1e3,"Thousand"]])if(n>=v){o.push(h(Math.floor(n/v))+" "+l);n%=v}if(n)o.push(h(n));return o.join(" ")}
export function receipt(r,p){
  const d=pdf(),amt=p.amount||r.rent,no=rno(p.month,r.phone),by=p.method=="cash"?"Cash":"UPI / Online",tx=(s,x,y,sz,c,b,o)=>{d.setFont("helvetica",b?"bold":"normal");d.setFontSize(sz);d.setTextColor(...c);d.text(s,x,y,o)};
  d.setFillColor(...T);d.rect(0,0,210,46,"F");tx("Myhomerent",15,22,24,[255,255,255],1);tx("RENT RECEIPT",15,32,11,[213,240,236]);
  tx("Receipt No.",195,15,9,[213,240,236],0,{align:"right"});tx(no,195,23,14,[255,255,255],1,{align:"right"});tx("Date: "+fd(p.receivedAt),195,33,10,[255,255,255],0,{align:"right"});
  d.setDrawColor(210,222,221);d.setFillColor(255,255,255);d.roundedRect(15,58,180,172,4,4,"FD");
  d.setFillColor(...G);d.roundedRect(158,66,30,10,5,5,"F");tx("PAID",173,72.8,11,[255,255,255],1,{align:"center"});
  tx("Amount received",25,74,10,MU);tx(rs(amt),25,92,32,T,1);tx(words(amt)+" Rupees Only",25,101,10,MU);
  d.setDrawColor(227,232,232);d.line(25,108,185,108);
  [["Received from",r.name],["Flat / room",r.flat],["Rent for",mn(p.month)],["Payment mode",by],["Received on",fd(p.receivedAt)],["Phone",r.phone]].forEach(([k,v],i)=>{const x=i%2?112:25,y=122+Math.floor(i/2)*24;tx(k,x,y,9,MU);tx(String(v).slice(0,26),x,y+7,12,I,1)});
  d.setFillColor(227,241,238);d.roundedRect(25,199,160,22,3,3,"F");tx("Receipt number (use it to verify this receipt)",31,207,9,MU);tx(no,31,215,13,T,1);
  d.setDrawColor(...MU);d.line(135,254,195,254);tx("Authorised signatory",165,260,9,MU,0,{align:"center"});tx("Issued on "+fd(new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Kolkata"})),15,260,9,MU);
  foot(d,"Computer-generated receipt. To verify it, give the receipt number to the landlord.");
  return{name:"Receipt-"+no+".pdf",blob:d.output("blob")};
}
export function statement(r,all,du){
  const d=pdf();band(d,"Statement of account",[r.name+" (Flat "+r.flat+")","Phone: "+r.phone]);
  let y=54;txt(d,"Total paid: "+rs(du.paid)+"     Total due: "+rs(du.amt),15,y,180,I,13,1);y+=9;
  y=txt(d,du.months.length?"Due months: "+du.months.map(ms).join(", "):"No dues. All paid up.",15,y,180,du.months.length?R:T,10,0)+4;
  d.setFont("helvetica","bold");d.setFontSize(10);d.setTextColor(...MU);["Month","Date","Method","Amount","Receipt no."].forEach((h,i)=>d.text(h,[15,50,85,125,195][i],y,{align:i>2&&i<4?"left":i==4?"right":"left"}));
  d.setDrawColor(...MU);d.line(15,y+2,195,y+2);y+=9;
  all.filter(p=>p.status=="received").forEach(p=>{if(y>275){d.addPage();y=20}
    d.setFont("helvetica","normal");d.setFontSize(10);d.setTextColor(...I);d.text(ms(p.month),15,y);d.text(p.receivedAt||"-",50,y);d.text(p.method=="cash"?"Cash":"UPI / Online",85,y);d.text(rs(p.amount||r.rent),125,y);d.text(rno(p.month,r.phone),195,y,{align:"right"});y+=8});
  foot(d,"Generated on "+new Date().toLocaleDateString("en-IN"));
  return{name:"Statement-"+r.name.replace(/\W+/g,"_")+".pdf",blob:d.output("blob")};
}
export function report(rows,M){
  const d=pdf(),tp=rows.reduce((s,x)=>s+x.paid,0),td=rows.reduce((s,x)=>s+x.amt,0);
  band(d,"Rent report",["Up to "+mn(M),"Generated "+new Date().toLocaleDateString("en-IN")]);
  let y=54;txt(d,"Total collected: "+rs(tp)+"     Total due: "+rs(td)+"     Renters: "+rows.length,15,y,180,I,12,1);y+=12;
  const head=()=>{d.setFont("helvetica","bold");d.setFontSize(10);d.setTextColor(...MU);d.text("Renter",15,y);d.text("Paid",75,y);d.text("Due months",100,y);d.text("Due amount",195,y,{align:"right"});d.setDrawColor(...MU);d.line(15,y+2,195,y+2);y+=9};head();
  rows.forEach(x=>{const L=d.splitTextToSize(x.months.length?x.months.map(ms).join(", "):"None",70),h=Math.max(8,L.length*5+3);if(y+h>280){d.addPage();y=20;head()}
    d.setFont("helvetica","normal");d.setFontSize(10);d.setTextColor(...I);d.text((x.r.name+" (Flat "+x.r.flat+")").slice(0,28),15,y);d.text(rs(x.paid),75,y);
    d.setTextColor(...(x.months.length?R:T));d.text(L,100,y);d.setTextColor(...I);d.text(rs(x.amt),195,y,{align:"right"});y+=h});
  foot(d,"Due = unpaid months up to today at the current rent.");
  return{name:"Rent-report-"+M+".pdf",blob:d.output("blob")};
}
const save=x=>{const a=document.createElement("a");a.href=URL.createObjectURL(x.blob);a.download=x.name;a.click()};
export const download=(r,p)=>save(receipt(r,p));
export const downloadStatement=(r,all,du)=>save(statement(r,all,du));
export const downloadReport=(rows,M)=>save(report(rows,M));
export function rtext(r,p){return"Receipt "+rno(p.month,r.phone)+"\nMyhomerent rent receipt\nReceived from "+r.name+" (Flat "+r.flat+")\n"+rs(p.amount||r.rent)+" for "+mn(p.month)+"\nPaid by "+(p.method=="cash"?"cash":"UPI / online")+" on "+(p.receivedAt||"-")+"\nSee all your receipts here: "+new URL("./",location.href).href}
export const sendWA=(r,p)=>window.open("https://wa.me/91"+r.phone+"?text="+encodeURIComponent(rtext(r,p)),"_blank");
export const sendSMS=(r,p)=>{location.href="sms:+91"+r.phone+"?body="+encodeURIComponent(rtext(r,p))};
