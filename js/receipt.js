// Builds a PDF receipt in the browser (jsPDF) and shares it on WhatsApp.
export function receipt(r,p){
  const{jsPDF}=window.jspdf,d=new jsPDF({unit:"mm",format:"a4"}),B=[37,99,235],amt=p.amount||r.rent,no="MHR-"+p.month.replace("-","")+"-"+String(r.phone).slice(-4);
  d.setFillColor(...B);d.rect(0,0,210,38,"F");
  d.setTextColor(255);d.setFont("helvetica","bold");d.setFontSize(22);d.text("Myhomerent",15,18);
  d.setFont("helvetica","normal");d.setFontSize(11);d.text("Rent Payment Receipt",15,28);
  d.setFontSize(10);d.text("Receipt No: "+no,195,18,{align:"right"});d.text("Date: "+(p.receivedAt||"-"),195,28,{align:"right"});
  const rows=[["Received from",r.name],["Flat / room",r.flat],["Phone",r.phone],["Rent for month",p.month],["Payment method",(p.method||"-").toUpperCase()],["Reference no.",p.refId||"-"]];
  let y=58;
  rows.forEach(([k,v])=>{d.setFont("helvetica","normal");d.setFontSize(10);d.setTextColor(100,116,139);d.text(k,15,y);
    d.setFont("helvetica","bold");d.setFontSize(12);d.setTextColor(15,23,42);d.text(String(v).slice(0,45),75,y);
    d.setDrawColor(226,232,240);d.line(15,y+4,195,y+4);y+=14});
  d.setFillColor(230,238,255);d.roundedRect(15,y+4,180,30,3,3,"F");
  d.setFont("helvetica","normal");d.setFontSize(11);d.setTextColor(100,116,139);d.text("Amount received",22,y+14);
  d.setFont("helvetica","bold");d.setFontSize(24);d.setTextColor(...B);d.text("Rs. "+Number(amt).toLocaleString("en-IN"),22,y+27);
  d.setFontSize(20);d.setTextColor(21,128,61);d.text("PAID",188,y+22,{align:"right"});
  d.setFont("helvetica","normal");d.setFontSize(9);d.setTextColor(100,116,139);d.text("This is a computer-generated receipt and does not need a signature.",105,285,{align:"center"});
  const name="Receipt-"+no+".pdf",blob=d.output("blob");
  return{name,blob,file:new File([blob],name,{type:"application/pdf"})};
}
function save(x){const a=document.createElement("a");a.href=URL.createObjectURL(x.blob);a.download=x.name;a.click()}
export const download=(r,p)=>save(receipt(r,p));
export async function share(r,p){
  const x=receipt(r,p),msg="Hello "+r.name+", we have received your rent of Rs "+(p.amount||r.rent)+" for "+p.month+". Your receipt is attached. Thank you.";
  if(navigator.canShare&&navigator.canShare({files:[x.file]})){
    try{await navigator.share({files:[x.file],text:msg});return}catch(e){if(e.name=="AbortError")return}}
  save(x);window.open("https://wa.me/91"+r.phone+"?text="+encodeURIComponent(msg),"_blank");
}
