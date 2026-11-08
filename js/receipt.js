// PDFs (receipt, statement, report) are built in the browser with jsPDF. Receipt no = MHR- plus 6 letters/digits made from the renter id and month. It has no phone number and can be checked against the records.
const T=[15,118,110],I=[14,42,43],MU=[91,113,114],R=[180,35,24],G=[21,128,61];
const mn=m=>new Date(m+"-15").toLocaleString("en-IN",{month:"long",year:"numeric"}),ms=m=>new Date(m+"-15").toLocaleString("en-IN",{month:"short",year:"numeric"}),rs=n=>"Rs. "+Number(n).toLocaleString("en-IN");
const nx=m=>{let[y,o]=m.split("-").map(Number);o++;if(o>12){o=1;y++}return y+"-"+String(o).padStart(2,"0")};
export const fl=v=>/^\d+$/.test(String(v))?"Flat "+v:String(v);
const h53=s=>{let a=0xdeadbeef,b=0x41c6ce57;for(let i=0,c;i<s.length;i++){c=s.charCodeAt(i);a=Math.imul(a^c,2654435761);b=Math.imul(b^c,1597334677)}a=Math.imul(a^(a>>>16),2246822507)^Math.imul(b^(b>>>13),3266489909);b=Math.imul(b^(b>>>16),2246822507)^Math.imul(a^(a>>>13),3266489909);return 4294967296*(2097151&b)+(a>>>0)};
export const rno=(m,uid)=>{let n=h53(uid+"|"+m)%1073741824,o="";for(let i=0;i<6;i++){o="23456789ABCDEFGHJKLMNPQRSTUVWXYZ"[n%32]+o;n=Math.floor(n/32)}return"MHR-"+o};
export const need=(p,r)=>p&&p.status=="received"?(p.due!=null?+p.due:(+p.amount||+r.rent)):+r.rent;
export function dues(r,ps,M,td){
  const rec=ps.filter(p=>p.status=="received"),by={};rec.forEach(p=>by[p.month]=p);const first=r.since||ps.map(p=>p.month).sort()[0]||M,months=[];let amt=0;
  for(let m=first,i=0;m<=M&&i<240;m=nx(m),i++)if(m<M||td>r.dueDay){const q=by[m],g=q?(+q.amount||+r.rent):0,nd=need(q,r);if(g<nd){months.push(m);amt+=nd-g}}
  return{months,amt,paid:rec.reduce((s,p)=>s+(+p.amount||+r.rent),0)};
}
const pdf=f=>{const{jsPDF}=window.jspdf;return new jsPDF({unit:"mm",format:f||"a4"})};
function band(d,t,s){d.setFillColor(...T);d.rect(0,0,210,38,"F");d.setTextColor(255);d.setFont("helvetica","bold");d.setFontSize(22);d.text("Myhomerent",15,18);
  d.setFont("helvetica","normal");d.setFontSize(11);d.text(t,15,28);d.setFontSize(10);s.forEach((x,i)=>d.text(x,195,18+i*10,{align:"right"}))}
function txt(d,s,x,y,w,c,sz,b){d.setFont("helvetica",b?"bold":"normal");d.setFontSize(sz);d.setTextColor(...c);const L=d.splitTextToSize(s,w);d.text(L,x,y);return y+L.length*(sz*0.45)+2}
const foot=(d,s)=>{d.setFont("helvetica","normal");d.setFontSize(9);d.setTextColor(...MU);d.text(s,105,287,{align:"center"})};
const fd=s=>s?new Date(s+"T12:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"-";
function words(n){const a=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],b=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"],t=x=>x<20?a[x]:b[Math.floor(x/10)]+(x%10?" "+a[x%10]:""),h=x=>x>99?a[Math.floor(x/100)]+" Hundred"+(x%100?" "+t(x%100):""):t(x);n=Math.round(+n);if(!n)return"Zero";const o=[];for(const[v,l]of[[1e7,"Crore"],[1e5,"Lakh"],[1e3,"Thousand"]])if(n>=v){o.push(h(Math.floor(n/v))+" "+l);n%=v}if(n)o.push(h(n));return o.join(" ")}
export const verifyUrl=no=>new URL("admin.html",location.href).href+"#check="+no;
function qr(d,text,x,y,s){if(typeof window.qrcode!="function")return false;try{const q=window.qrcode(0,"M");q.addData(text);q.make();const n=q.getModuleCount(),c=s/n;d.setFillColor(...I);for(let a=0;a<n;a++)for(let b=0;b<n;b++)if(q.isDark(a,b))d.rect(x+b*c,y+a*c,c+.03,c+.03,"F");return true}catch{return false}}
export function receipt(r,p,own){
  const amt=+p.amount||+r.rent,left=need(p,r)-amt,no=rno(p.month,r.uid),by=p.method=="cash"?"Cash":"UPI / Online",C={align:"center"},Rt={align:"right"},
  rows=[["Received from",r.name],["Room",fl(r.flat)],["Rent for",mn(p.month)],["Paid by",by],...(left>0?[["Balance due",rs(left)]]:[]),...(p.note?[["Note",p.note]]:[]),["Receipt no.",no],...(own?[["Issued by",own]]:[])],
  ex=Math.max(0,rows.length-6)*9,d=pdf([88,180+ex]),
  tx=(s,x,y,sz,c,b,o)=>{d.setFont("helvetica",b?"bold":"normal");d.setFontSize(sz);d.setTextColor(...c);d.text(String(s),x,y,o)};
  d.setFillColor(242,245,244);d.rect(0,0,88,180+ex,"F");d.setFillColor(255,255,255);d.roundedRect(5,5,78,170+ex,5,5,"F");
  d.setFillColor(...T);d.roundedRect(11,11,9,9,2.5,2.5,"F");d.setFillColor(255,255,255);d.triangle(15.5,12.8,12,15.8,19,15.8,"F");d.rect(12.9,15.8,5.2,3,"F");
  tx("Myhomerent",23,17.2,11,I,1);tx("RECEIPT",77,17,7,MU,0,Rt);
  tx(left>0?"Amount received":"Amount paid",44,34,7.5,MU,0,C);tx(rs(amt),44,45,24,T,1,C);
  if(left>0){d.setFillColor(180,83,9);d.roundedRect(28,50,32,6,3,3,"F");tx("PART PAYMENT",44,54.2,7,[255,255,255],1,C)}else{d.setFillColor(...G);d.roundedRect(35,50,18,6,3,3,"F");tx("PAID",44,54.2,7.5,[255,255,255],1,C)}
  tx(fd(p.receivedAt),44,63,8.5,MU,0,C);
  d.setDrawColor(200,214,213);d.setLineDashPattern([1,1],0);d.line(11,68,77,68);
  rows.forEach(([k,v],i)=>{const y=76+i*9;tx(k,11,y,7,MU);tx(String(v).slice(0,24),77,y,8.5,I,1,Rt)});
  const yd=76+rows.length*9-2,qy=yd+5;d.line(11,yd,77,yd);d.setLineDashPattern([],0);
  if(!qr(d,verifyUrl(no),29,qy,30))tx("Verify: give this receipt no. to the landlord",44,qy+14,6.5,MU,0,C);
  tx("Scan with your phone camera to verify",44,qy+34,6.5,MU,0,C);tx("Computer generated receipt. No signature needed.",44,qy+38.5,6,MU,0,C);
  return{name:"Receipt-"+no+".pdf",blob:d.output("blob")};
}
export function statement(r,all,du){
  const d=pdf();band(d,"Statement of account",[r.name+" ("+fl(r.flat)+")","Phone: "+r.phone]);
  let y=54;txt(d,"Total paid: "+rs(du.paid)+"     Total due: "+rs(du.amt),15,y,180,I,13,1);y+=9;
  y=txt(d,du.months.length?"Due months: "+du.months.map(ms).join(", "):"No dues. All paid up.",15,y,180,du.months.length?R:T,10,0)+4;
  d.setFont("helvetica","bold");d.setFontSize(10);d.setTextColor(...MU);["Month","Date","Method","Amount","Receipt no."].forEach((h,i)=>d.text(h,[15,50,85,125,195][i],y,{align:i>2&&i<4?"left":i==4?"right":"left"}));
  d.setDrawColor(...MU);d.line(15,y+2,195,y+2);y+=9;
  all.filter(p=>p.status=="received").forEach(p=>{if(y>275){d.addPage();y=20}
    d.setFont("helvetica","normal");d.setFontSize(10);d.setTextColor(...I);d.text(ms(p.month),15,y);d.text(p.receivedAt||"-",50,y);d.text(p.method=="cash"?"Cash":"UPI / Online",85,y);d.text(rs(p.amount||r.rent)+(+(p.amount||r.rent)<need(p,r)?" (part)":""),125,y);d.text(rno(p.month,r.uid),195,y,{align:"right"});y+=8});
  foot(d,"Generated on "+new Date().toLocaleDateString("en-IN"));
  return{name:"Statement-"+r.name.replace(/\W+/g,"_")+".pdf",blob:d.output("blob")};
}
export function report(rows,M){
  const d=pdf(),tp=rows.reduce((s,x)=>s+x.paid,0),td=rows.reduce((s,x)=>s+x.amt,0);
  band(d,"Rent report",["Up to "+mn(M),"Generated "+new Date().toLocaleDateString("en-IN")]);
  let y=54;txt(d,"Total collected: "+rs(tp)+"     Total due: "+rs(td)+"     Renters: "+rows.length,15,y,180,I,12,1);y+=12;
  const head=()=>{d.setFont("helvetica","bold");d.setFontSize(10);d.setTextColor(...MU);d.text("Renter",15,y);d.text("Paid",75,y);d.text("Due months",100,y);d.text("Due amount",195,y,{align:"right"});d.setDrawColor(...MU);d.line(15,y+2,195,y+2);y+=9};head();
  rows.forEach(x=>{const L=d.splitTextToSize(x.months.length?x.months.map(ms).join(", "):"None",70),h=Math.max(8,L.length*5+3);if(y+h>280){d.addPage();y=20;head()}
    d.setFont("helvetica","normal");d.setFontSize(10);d.setTextColor(...I);d.text((x.r.name+" ("+fl(x.r.flat)+")").slice(0,28),15,y);d.text(rs(x.paid),75,y);
    d.setTextColor(...(x.months.length?R:T));d.text(L,100,y);d.setTextColor(...I);d.text(rs(x.amt),195,y,{align:"right"});y+=h});
  foot(d,"Due = unpaid months up to today at the current rent.");
  return{name:"Rent-report-"+M+".pdf",blob:d.output("blob")};
}
const save=x=>{const a=document.createElement("a");a.href=URL.createObjectURL(x.blob);a.download=x.name;a.click()};
export const download=(r,p,o)=>save(receipt(r,p,o));
export const downloadStatement=(r,all,du)=>save(statement(r,all,du));
export const downloadReport=(rows,M)=>save(report(rows,M));
const site=()=>new URL("./",location.href).href,sg=o=>"\n\nRegards,\n"+(o||"Myhomerent");
export const msgReceipt=(r,p,o)=>{const a=+p.amount||+r.rent,l=need(p,r)-a;return"Hello "+r.name+",\n\n"+(l>0?"Thank you! We have received a part payment of your rent.":"Thank you! We have received your rent payment.")+"\n\nAmount: "+rs(a)+(l>0?"\nBalance due: "+rs(l):"")+"\nFor: "+mn(p.month)+"\nPaid by: "+(p.method=="cash"?"Cash":"UPI / Online")+" on "+fd(p.receivedAt)+(p.note?"\nNote: "+p.note:"")+"\nReceipt no: "+rno(p.month,r.uid)+"\n\nYou can view and download your receipts here:\n"+site()+sg(o)};
export const msgRemind=(r,M,td,pay,o,bal)=>"Hello "+r.name+",\n\nThis is a gentle reminder that "+(bal>0?"the balance of your rent, "+rs(bal)+",":"your rent of "+rs(r.rent))+" for "+mn(M)+(td>r.dueDay?" was due on ":" is due on ")+fd(M+"-"+String(r.dueDay).padStart(2,"0"))+".\n"+(pay?"\nYou can pay here: "+pay+"\n":"")+"\nIf you have already paid, please ignore this message."+sg(o);
export const msgLogin=(n,ph,pw,o)=>"Hello "+n+",\n\nWelcome! "+(o?o+" has":"You have been")+" added you to Myhomerent, where you can see your rent, receipts and payment history.\n\nSign in here: "+new URL("index.html",location.href).href+"\nPhone number: "+ph+"\nPassword: "+pw+"\n\nPlease keep this password private."+sg(o);
export const sendMsg=(k,ph,t)=>{if(k=="wa")window.open("https://wa.me/91"+ph+"?text="+encodeURIComponent(t),"_blank");else location.href="sms:+91"+ph+"?body="+encodeURIComponent(t)};
export async function shareReceiptWA(r,p,own){
  const x=receipt(r,p,own),f=new File([x.blob],x.name,{type:"application/pdf"}),t=msgReceipt(r,p,own);
  if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:"Rent receipt",text:t});return"shared"}catch(e){if(e&&e.name=="AbortError")return"cancelled"}}
  save(x);sendMsg("wa",r.phone,t);return"fallback"}
