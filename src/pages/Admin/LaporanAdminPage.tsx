// src/pages/Admin/LaporanAdminPage.tsx
import { useEffect, useState } from "react";
import { getSalesReport, type SalesReportResponse } from "../../services/reportService";
import { Banknote, CheckCircle2, Package, Download } from "lucide-react";
import * as XLSX from "xlsx";

export default function LaporanAdminPage() {
  const [reportData, setReportData] = useState<SalesReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [period, setPeriod] = useState("day");

  const fetchReport = async () => {
    try {
      setLoading(true); setError(null);
      const data = await getSalesReport(startDate, endDate, period);
      setReportData(data);
      if (!startDate) setStartDate(data.startDate);
      if (!endDate) setEndDate(data.endDate);
    } catch (err: any) { setError(err.message); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReport(); }, [period]);

  const handleExportExcel = () => {
    if (!reportData || reportData.rows.length === 0) return alert("Tidak ada data");
    const excelData = reportData.rows.map(row => ({"Periode": row.period, "Total Pesanan": row.totalOrders, "Pesanan Lunas": row.paidOrders, "Pendapatan (Rp)": row.revenue}));
    excelData.push({"Periode": "", "Total Pesanan": null as any, "Pesanan Lunas": null as any, "Pendapatan (Rp)": null as any});
    excelData.push({"Periode": "RINGKASAN", "Total Pesanan": null as any, "Pesanan Lunas": null as any, "Pendapatan (Rp)": null as any});
    excelData.push({"Periode": "Total Pesanan", "Total Pesanan": reportData.summary.totalOrders as any, "Pesanan Lunas": null as any, "Pendapatan (Rp)": null as any});
    excelData.push({"Periode": "Total Pendapatan", "Total Pesanan": null as any, "Pesanan Lunas": null as any, "Pendapatan (Rp)": reportData.summary.totalRevenue});
    
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    ws["!cols"] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 20 }];
    XLSX.writeFile(wb, `Laporan_${reportData.startDate}_${reportData.endDate}.xlsx`);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full bg-[#F4F6FB]">
      <div className="shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row justify-between gap-3 z-10">
        <div><h1 className="text-lg font-bold text-[#1B2A6B]">Laporan Penjualan</h1></div>
        <button onClick={handleExportExcel} disabled={!reportData} className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50">
          <Download className="w-4 h-4" /> Export Excel
        </button>
      </div>

      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full h-full flex flex-col space-y-4">
          <div className="bg-white p-4 rounded-2xl border shrink-0">
            <form onSubmit={e => { e.preventDefault(); fetchReport(); }} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full"><label className="text-xs font-bold">Mulai</label><input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm mt-1" /></div>
              <div className="flex-1 w-full"><label className="text-xs font-bold">Akhir</label><input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm mt-1" /></div>
              <div className="flex-1 w-full"><label className="text-xs font-bold">Periode</label><select value={period} onChange={e=>setPeriod(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm mt-1"><option value="day">Harian</option><option value="month">Bulanan</option><option value="year">Tahunan</option></select></div>
              <button type="submit" className="w-full md:w-auto bg-[#1B2A6B] text-white px-6 py-2 rounded-xl text-sm font-bold">Filter</button>
            </form>
          </div>

          {loading ? <div className="flex-1 flex items-center justify-center">Memuat...</div> : reportData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
                <div className="bg-white p-5 rounded-2xl border flex items-center gap-4"><div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Package/></div><div><p className="text-xs text-gray-400">Total Pesanan</p><p className="text-2xl font-black">{reportData.summary.totalOrders}</p></div></div>
                <div className="bg-white p-5 rounded-2xl border flex items-center gap-4"><div className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle2/></div><div><p className="text-xs text-gray-400">Lunas</p><p className="text-2xl font-black">{reportData.summary.paidOrders}</p></div></div>
                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 flex items-center gap-4"><div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><Banknote/></div><div><p className="text-xs text-emerald-600">Pendapatan</p><p className="text-2xl font-black text-emerald-700">Rp {reportData.summary.totalRevenue.toLocaleString()}</p></div></div>
              </div>
              <div className="flex-1 bg-white rounded-2xl border overflow-hidden flex flex-col relative">
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-gray-50 border-b shadow-sm text-xs text-gray-500 uppercase">
                      <tr><th className="p-4">Periode</th><th className="p-4">Total</th><th className="p-4">Lunas</th><th className="p-4 text-right">Pendapatan</th></tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                      {reportData.rows.map((r, i) => (
                        <tr key={i}><td className="p-4 font-bold">{r.period}</td><td className="p-4">{r.totalOrders}</td><td className="p-4"><span className="bg-green-50 text-green-700 px-2 rounded font-bold">{r.paidOrders}</span></td><td className="p-4 text-right font-black text-emerald-600">Rp {r.revenue.toLocaleString()}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
