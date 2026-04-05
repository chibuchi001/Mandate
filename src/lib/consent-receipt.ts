import type { AuditEntry, ConnectedService } from "@/types";
export async function generateConsentReceipt(log:AuditEntry[],svcs:ConnectedService[]):Promise<Blob>{
  const{default:jsPDF}=await import("jspdf");await import("jspdf-autotable");const doc=new jsPDF();
  doc.setFontSize(22);doc.setFont("helvetica","bold");doc.text("Mandate — Consent Receipt",14,22);
  doc.setFontSize(9);doc.setFont("helvetica","normal");doc.setTextColor(120);doc.text("Generated: "+new Date().toLocaleString(),14,30);
  doc.line(14,38,196,38);doc.setFontSize(12);doc.setFont("helvetica","bold");doc.setTextColor(0);doc.text("Services",14,48);
  (doc as any).autoTable({startY:52,head:[["Service","Status","Scopes","Token"]],body:svcs.map(s=>[s.name,s.connected?"On":"Off",s.connected?s.scopes.filter(sc=>sc.enabled).length+"/"+s.scopes.length:"—",s.tokenHealth]),theme:"grid",headStyles:{fillColor:[232,164,74],textColor:255,fontSize:8},bodyStyles:{fontSize:8}});
  const y=(doc as any).lastAutoTable.finalY+12;doc.setFontSize(12);doc.setFont("helvetica","bold");doc.text("Audit Log",14,y);
  (doc as any).autoTable({startY:y+4,head:[["Time","Event","Details","Service"]],body:log.map(e=>[new Date(e.timestamp).toLocaleString(),e.type.replace(/_/g," "),e.message,e.service??"—"]),theme:"grid",headStyles:{fillColor:[232,164,74],textColor:255,fontSize:8},bodyStyles:{fontSize:7},columnStyles:{2:{cellWidth:70}}});
  const pg=doc.getNumberOfPages();for(let i=1;i<=pg;i++){doc.setPage(i);doc.setFontSize(7);doc.setTextColor(150);doc.text(`Mandate Receipt — ${i}/${pg}`,14,doc.internal.pageSize.height-8);}
  return doc.output("blob");
}
