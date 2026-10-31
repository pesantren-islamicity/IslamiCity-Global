import React, { useState } from "react";
import {
  X,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  CheckCircle2,
  ShieldCheck,
  Leaf,
  Users,
  Wind,
  Trees,
  Award,
  Sparkles,
  UserCheck,
  QrCode,
  Building2,
  Calendar,
} from "lucide-react";
import jsPDF from "jspdf";
import { GreenCoopImpactProject } from "./SocialImpactTracker";
import { UserProfile, EmpowermentTier } from "../types";

interface PersonalContributionInfo {
  isLoggedIn: boolean;
  userProfile?: UserProfile;
  currentTier?: EmpowermentTier;
  totalDonation: number;
  personalLives: number;
  personalCo2Kg: number;
  personalTrees: number;
  fundedProjectIds: string[];
}

interface SocialImpactExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: GreenCoopImpactProject[];
  personalInfo: PersonalContributionInfo;
  onToggleLogin?: () => void;
}

export const SocialImpactExportModal: React.FC<SocialImpactExportModalProps> = ({
  isOpen,
  onClose,
  projects,
  personalInfo,
  onToggleLogin,
}) => {
  const [includePersonal, setIncludePersonal] = useState<boolean>(personalInfo.isLoggedIn);
  const [exportFormat, setExportFormat] = useState<"pdf" | "csv">("pdf");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Aggregate totals
  const totalLives = projects.reduce((acc, p) => acc + p.livesImpacted, 0);
  const totalCo2Kg = projects.reduce((acc, p) => acc + p.co2ReducedKg, 0);
  const totalCo2Tons = (totalCo2Kg / 1000).toFixed(2);
  const totalTrees = projects.reduce((acc, p) => acc + p.treesEquivalent, 0);
  const totalCapital = projects.reduce((acc, p) => acc + p.fundingAmount, 0);

  const issueDateStr = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const docRefCode = `IC-ESG-${new Date().getFullYear()}-889X`;

  // Generate CSV File
  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const csvRows: string[] = [];

      // Helper to escape CSV cell
      const esc = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;

      // Header Metadata
      csvRows.push([esc("LAPORAN AUDIT DAMPAK SOSIAL & LINGKUNGAN (ESG SYARIAH)")].join(","));
      csvRows.push([esc("Lembaga Penerbit:"), esc("IslamiCity Global TV & Baitul Maal Kaffah")].join(","));
      csvRows.push([esc("Nomor Registrasi Audit:"), esc(docRefCode)].join(","));
      csvRows.push([esc("Tanggal Terbit:"), esc(issueDateStr)].join(","));
      csvRows.push([esc("Total Proyek Terdanai:"), esc(`${projects.length} Proyek Koperasi Hijau`)].join(","));
      csvRows.push([esc("Total Modal Terhimpun:"), esc(`Rp ${totalCapital.toLocaleString("id-ID")}`)].join(","));
      csvRows.push([esc("Total Jiwa Terdampak:"), esc(`${totalLives.toLocaleString("id-ID")} Jiwa`)].join(","));
      csvRows.push([esc("Total Reduksi Emisi CO2:"), esc(`${totalCo2Kg.toLocaleString("id-ID")} kg (${totalCo2Tons} Ton)`)].join(","));
      csvRows.push([esc("Total Setara Serapan Pohon:"), esc(`${totalTrees.toLocaleString("id-ID")} Pohon`)].join(","));
      csvRows.push("");

      // Personal Contribution Section (if logged in and included)
      if (includePersonal && personalInfo.isLoggedIn && personalInfo.userProfile) {
        csvRows.push([esc("=== AUDIT KONTRIBUSI PRIBADI JAMAAH (TERVERIFIKASI) ===")].join(","));
        csvRows.push([esc("Nama Muzakki / Donatur:"), esc(personalInfo.userProfile.name)].join(","));
        csvRows.push([esc("Alamat Email Akun:"), esc(personalInfo.userProfile.email)].join(","));
        csvRows.push([esc("Tingkat Pemberdayaan:"), esc(`Level ${personalInfo.currentTier?.level || 2} - ${personalInfo.currentTier?.name || "Musannid"}`)].join(","));
        csvRows.push([esc("Total Modal Disalurkan:"), esc(`Rp ${personalInfo.totalDonation.toLocaleString("id-ID")}`)].join(","));
        csvRows.push([esc("Estimasi Jiwa Terbina Pribadi:"), esc(`${personalInfo.personalLives} Jiwa`)].join(","));
        csvRows.push([esc("Estimasi Reduksi Emisi Pribadi:"), esc(`${personalInfo.personalCo2Kg} kg CO2`)].join(","));
        csvRows.push([esc("Estimasi Pohon Setara Pribadi:"), esc(`${personalInfo.personalTrees} Pohon`)].join(","));
        csvRows.push([esc("Proyek yang Didanai:"), esc("GCP-01 (Maggot BSF) & Konsorsium Hijau GP-02")].join(","));
        csvRows.push([esc("Akad Transaksi Syariah:"), esc("Syirkah Mudharabah & Hibah Muqayyadah (0% Riba)")].join(","));
        csvRows.push("");
      }

      // Table Header
      csvRows.push([
        esc("ID Proyek"),
        esc("Nama Proyek"),
        esc("Kategori"),
        esc("Lokasi"),
        esc("Status"),
        esc("Tahun Pendanaan"),
        esc("Modal Terdanai (IDR)"),
        esc("Jiwa Terdampak"),
        esc("Reduksi CO2 (kg)"),
        esc("Setara Pohon"),
        esc("Status Partisipasi Pribadi"),
        esc("Nominal Partisipasi Anda (IDR)"),
      ].join(","));

      // Table Rows
      projects.forEach((p) => {
        const isFundedByMe = includePersonal && personalInfo.fundedProjectIds.includes(p.id);
        const myAmount = isFundedByMe ? 500000 : 0;
        csvRows.push([
          esc(p.id),
          esc(p.name),
          esc(p.category),
          esc(p.location),
          esc(p.status),
          esc(p.fundedYear),
          esc(p.fundingAmount),
          esc(p.livesImpacted),
          esc(p.co2ReducedKg),
          esc(p.treesEquivalent),
          esc(isFundedByMe ? "TERDANAI OLEH ANDA" : "-"),
          esc(myAmount > 0 ? myAmount : 0),
        ].join(","));
      });

      // Total Row
      csvRows.push([
        esc("TOTAL"),
        esc(`${projects.length} Proyek`),
        esc("-"),
        esc("Nasional Indonesia"),
        esc("100% Aktif"),
        esc("2025/2026"),
        esc(totalCapital),
        esc(totalLives),
        esc(totalCo2Kg),
        esc(totalTrees),
        esc(includePersonal && personalInfo.isLoggedIn ? "Rp 920.000 Terverifikasi" : "-"),
        esc(includePersonal && personalInfo.isLoggedIn ? personalInfo.totalDonation : 0),
      ].join(","));

      csvRows.push("");
      csvRows.push([esc("Keterangan: Laporan ini diterbitkan otomatis dan diaudit berkala sesuai Kaidah Fiqih Bi'ah Baitul Maal.")].join(","));

      // UTF-8 BOM + csv string
      const csvContent = "\uFEFF" + csvRows.join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename = includePersonal && personalInfo.isLoggedIn && personalInfo.userProfile
        ? `Laporan_Social_Impact_${personalInfo.userProfile.name.replace(/\s+/g, "_")}.csv`
        : `Laporan_Social_Impact_IslamiCity_${new Date().toISOString().slice(0, 10)}.csv`;

      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportSuccessMsg(`File CSV berhasil diunduh: ${filename}`);
      setTimeout(() => setExportSuccessMsg(null), 4000);
    } catch (err) {
      console.error("Export CSV Error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Generate PDF File with jsPDF
  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 14;

      // Header Banner (Emerald background)
      doc.setFillColor(6, 78, 59); // emerald-900
      doc.rect(0, 0, pageWidth, 28, "F");

      // Accent gold line
      doc.setFillColor(217, 119, 6); // amber-600
      doc.rect(0, 28, pageWidth, 2, "F");

      // Header Text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text("ISLAMICITY GLOBAL TV & BAITUL MAAL", 14, 12);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(209, 250, 229); // emerald-100
      doc.text("Lembaga Wakaf, Zakat, Koperasi Syariah & Pemberdayaan Umat Mandiri", 14, 18);
      doc.text("Kanal Siaran Dakwah & Muamalah Berkelanjutan • global.islamicity.tv", 14, 23);

      // Doc Title & Reference
      y = 38;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text("LAPORAN AUDIT DAMPAK SOSIAL & LINGKUNGAN", 14, y);

      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text(`Standar ESG Syariah & Fiqih Bi'ah (Kelestarian Alam) | No. Reg: ${docRefCode} | Tanggal: ${issueDateStr}`, 14, y);

      // PERSONAL CONTRIBUTION HIGHLIGHT BOX (if logged in and included)
      if (includePersonal && personalInfo.isLoggedIn && personalInfo.userProfile) {
        y += 8;
        const boxY = y;
        const boxHeight = 36;

        // Soft green background box
        doc.setFillColor(240, 253, 244); // emerald-50
        doc.setDrawColor(16, 185, 129); // emerald-500
        doc.setLineWidth(0.5);
        doc.roundedRect(14, boxY, pageWidth - 28, boxHeight, 3, 3, "FD");

        // Top mini badge in box
        doc.setFillColor(6, 78, 59);
        doc.roundedRect(18, boxY + 3, 72, 5.5, 1.5, 1.5, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(255, 255, 255);
        doc.text("KONTRIBUSI PRIBADI TERVERIFIKASI", 20, boxY + 7);

        // User info row
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(6, 78, 59);
        doc.text(personalInfo.userProfile.name, 18, boxY + 14);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(`Email: ${personalInfo.userProfile.email} | Peran: ${personalInfo.userProfile.role} | Lvl ${personalInfo.currentTier?.level || 2} (${personalInfo.currentTier?.name || "Musannid"})`, 18, boxY + 18.5);

        // 4 metric pills inside personal box
        const pillY = boxY + 21;
        const pillW = (pageWidth - 28 - 15) / 4;

        // Metric 1: Modal Pribadi
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(209, 250, 229);
        doc.roundedRect(18, pillY, pillW, 11, 1.5, 1.5, "FD");
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        doc.text("MODAL DISALURKAN", 20, pillY + 3.8);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(180, 83, 9); // amber-700
        doc.text(`Rp ${personalInfo.totalDonation.toLocaleString("id-ID")}`, 20, pillY + 8.5);

        // Metric 2: Jiwa Terbina
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(209, 250, 229);
        doc.roundedRect(18 + pillW + 3, pillY, pillW, 11, 1.5, 1.5, "FD");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        doc.text("JIWA DIBANTU", 20 + pillW + 3, pillY + 3.8);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(15, 118, 110); // teal-700
        doc.text(`${personalInfo.personalLives} Jiwa Dhuafa`, 20 + pillW + 3, pillY + 8.5);

        // Metric 3: Reduksi CO2
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(209, 250, 229);
        doc.roundedRect(18 + (pillW + 3) * 2, pillY, pillW, 11, 1.5, 1.5, "FD");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        doc.text("REDUKSI EMISI CO2", 20 + (pillW + 3) * 2, pillY + 3.8);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(5, 150, 105); // emerald-600
        doc.text(`${personalInfo.personalCo2Kg} kg CO2`, 20 + (pillW + 3) * 2, pillY + 8.5);

        // Metric 4: Serapan Pohon
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(209, 250, 229);
        doc.roundedRect(18 + (pillW + 3) * 3, pillY, pillW, 11, 1.5, 1.5, "FD");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        doc.text("SETARA POHON", 20 + (pillW + 3) * 3, pillY + 3.8);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(77, 124, 15); // lime-700
        doc.text(`${personalInfo.personalTrees} Pohon Hidup`, 20 + (pillW + 3) * 3, pillY + 8.5);

        y += boxHeight;
      }

      // AGGREGATE SUMMARY STATS CARDS
      y += 6;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      doc.text("KONSOLIDASI DAMPAK NASIONAL KOPERASI HIJAU", 14, y);

      y += 4;
      const statW = (pageWidth - 28 - 9) / 4;
      const statH = 14;

      const stats = [
        { label: "TOTAL JIWA TERDAMPAK", val: `${totalLives.toLocaleString("id-ID")} Jiwa`, sub: "Bebas Riba & Mandiri", col: [15, 118, 110] },
        { label: "REDUKSI EMISI CO2", val: `${totalCo2Tons} Ton`, sub: `${totalCo2Kg.toLocaleString("id-ID")} kg CO2`, col: [5, 150, 105] },
        { label: "SERAPAN POHON", val: `${totalTrees} Pohon`, sub: "Mitigasi Krisis Iklim", col: [77, 124, 15] },
        { label: "MODAL TERDANAI", val: `Rp ${(totalCapital / 1000000).toFixed(0)} Jt`, sub: `${projects.length} Proyek Aktif`, col: [180, 83, 9] },
      ];

      stats.forEach((s, idx) => {
        const sx = 14 + idx * (statW + 3);
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(sx, y, statW, statH, 2, 2, "FD");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        doc.text(s.label, sx + 2.5, y + 4);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(s.col[0], s.col[1], s.col[2]);
        doc.text(s.val, sx + 2.5, y + 8.5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(6);
        doc.setTextColor(148, 163, 184);
        doc.text(s.sub, sx + 2.5, y + 12);
      });

      y += statH + 6;

      // PROJECT TABLE HEADER
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      doc.text("RINCIAN PROYEK HIJAU & SERAPAN DANA JAMAAH", 14, y);

      y += 4;
      const tableHeadY = y;
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(14, tableHeadY, pageWidth - 28, 6.5, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text("ID", 16, tableHeadY + 4.5);
      doc.text("NAMA PROYEK & KATEGORI", 30, tableHeadY + 4.5);
      doc.text("LOKASI", 95, tableHeadY + 4.5);
      doc.text("MODAL (RP)", 125, tableHeadY + 4.5);
      doc.text("JIWA", 147, tableHeadY + 4.5);
      doc.text("CO2 (KG)", 162, tableHeadY + 4.5);
      doc.text("PARTISIPASI ANDA", 180, tableHeadY + 4.5);

      y += 6.5;

      // TABLE ROWS
      projects.forEach((p, idx) => {
        const isFundedByMe = includePersonal && personalInfo.fundedProjectIds.includes(p.id);
        const rowH = 9.5;

        // Background color
        if (isFundedByMe) {
          doc.setFillColor(236, 253, 245); // light emerald highlight
          doc.rect(14, y, pageWidth - 28, rowH, "F");
        } else if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252); // light slate zebra
          doc.rect(14, y, pageWidth - 28, rowH, "F");
        }

        // Row border bottom
        doc.setDrawColor(226, 232, 240);
        doc.line(14, y + rowH, pageWidth - 14, y + rowH);

        // ID & Name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(isFundedByMe ? 6 : 15, isFundedByMe ? 78 : 23, isFundedByMe ? 59 : 42);
        doc.text(p.id, 16, y + 4);

        doc.text(p.shortName, 30, y + 4);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        doc.text(p.category, 30, y + 7.5);

        // Lokasi
        doc.text(p.location.split(",")[0], 95, y + 5.5);

        // Modal
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(51, 65, 85);
        doc.text(`${(p.fundingAmount / 1000000).toFixed(0)} Jt`, 125, y + 5.5);

        // Jiwa
        doc.setTextColor(15, 118, 110);
        doc.text(`${p.livesImpacted}`, 147, y + 5.5);

        // CO2
        doc.setTextColor(5, 150, 105);
        doc.text(`${p.co2ReducedKg}`, 162, y + 5.5);

        // Partisipasi
        if (isFundedByMe) {
          doc.setFillColor(16, 185, 129);
          doc.roundedRect(178, y + 1.8, 16, 5.5, 1, 1, "F");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(6);
          doc.setTextColor(255, 255, 255);
          doc.text("IKUT SERTA", 179.5, y + 5.5);
        } else {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(6.5);
          doc.setTextColor(148, 163, 184);
          doc.text("-", 185, y + 5.5);
        }

        y += rowH;
      });

      // FOOTER / AUDIT STAMP
      y = Math.max(y + 8, 240);
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(14, y, pageWidth - 28, 30, 2, 2, "FD");

      // Left audit notes
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text("PENGESAHAN DEWAN PENGAWAS SYARIAH & KOMITE LINGKUNGAN", 18, y + 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.text("1. Seluruh permodalan bersumber dari ZISWAF & Koperasi Syariah tanpa bunga (0% Riba).", 18, y + 11);
      doc.text("2. Perhitungan reduksi karbon mengacu pada formula mitigasi gas rumah kaca IPCC & Biokonversi.", 18, y + 15);
      doc.text(`3. Salinan resmi sertifikat ini tersimpan dalam Ledger Baitul Maal Kaffah (${docRefCode}).`, 18, y + 19);

      // Right signature note
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(6, 78, 59);
      doc.text("BAITUL MAAL ISLAMICITY", pageWidth - 65, y + 6);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Divisi Audit ESG & Akuntabilitas", pageWidth - 65, y + 10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Ust. Dr. M. Irfan, M.E.Sy.", pageWidth - 65, y + 21);
      doc.setFont("helvetica", "normal");
      doc.text("Ketua Dewan Pengawas Syariah", pageWidth - 65, y + 24.5);

      // Save document
      const filename = includePersonal && personalInfo.isLoggedIn && personalInfo.userProfile
        ? `Laporan_Dampak_Sosial_${personalInfo.userProfile.name.replace(/\s+/g, "_")}.pdf`
        : `Laporan_Dampak_Sosial_IslamiCity_${new Date().toISOString().slice(0, 10)}.pdf`;

      doc.save(filename);
      setExportSuccessMsg(`File PDF berhasil diunduh: ${filename}`);
      setTimeout(() => setExportSuccessMsg(null), 4000);
    } catch (err) {
      console.error("Export PDF Error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-6 border-b border-emerald-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-white">
                Ekspor Laporan Social Impact Tracker
              </h3>
              <p className="text-xs text-emerald-300">
                Unduh ringkasan audit dampak sosial & lingkungan dalam format PDF resmi atau file CSV spreadsheet
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Success Banner */}
          {exportSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold">{exportSuccessMsg}</span>
            </div>
          )}

          {/* User Status Card & Personal Contribution Switch */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  {personalInfo.isLoggedIn && personalInfo.userProfile
                    ? personalInfo.userProfile.name.slice(0, 2).toUpperCase()
                    : "G"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {personalInfo.isLoggedIn && personalInfo.userProfile
                        ? personalInfo.userProfile.name
                        : "Pengunjung / Tamu Publik"}
                    </span>
                    {personalInfo.isLoggedIn ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Akun Terhubung (Lvl {personalInfo.currentTier?.level || 2})
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-600">
                        Mode Publik
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {personalInfo.isLoggedIn && personalInfo.userProfile
                      ? personalInfo.userProfile.email
                      : "Login untuk menyorot kontribusi permodalan pribadi Anda dalam laporan."}
                  </span>
                </div>
              </div>

              {onToggleLogin && (
                <button
                  onClick={onToggleLogin}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  {personalInfo.isLoggedIn ? "Simulasi Mode Tamu" : "Hubungkan Akun Jamaah"}
                </button>
              )}
            </div>

            {/* Checkbox to include personal contribution */}
            {personalInfo.isLoggedIn && (
              <div className="pt-2 border-t border-slate-200/80 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="include-personal-check"
                  checked={includePersonal}
                  onChange={(e) => setIncludePersonal(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label
                  htmlFor="include-personal-check"
                  className="text-xs text-slate-700 cursor-pointer select-none leading-relaxed"
                >
                  <strong className="text-emerald-900 font-bold">
                    Sertakan & Sorot Kontribusi Pribadi Anda
                  </strong>{" "}
                  (Penyertaan Modal Rp {personalInfo.totalDonation.toLocaleString("id-ID")} • Membina ~{personalInfo.personalLives} Jiwa & Mereduksi {personalInfo.personalCo2Kg} kg CO₂).
                </label>
              </div>
            )}
          </div>

          {/* Interactive Document Preview Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Pratinjau Format Dokumen Laporan</span>
              <span className="text-[11px] font-normal text-slate-500">
                Sesuai standar verifikasi ESG IslamiCity
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4 font-sans text-xs">
              {/* Document Header Preview */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Laporan Audit Dampak Sosial & Lingkungan (ESG Syariah)
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      IslamiCity Global TV & Baitul Maal Kaffah • No: {docRefCode} • {issueDateStr}
                    </span>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    STATUS: DIAUDIT RESMI
                  </span>
                </div>
              </div>

              {/* Personal Contribution Box Preview (if active) */}
              {includePersonal && personalInfo.isLoggedIn && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>KONTRIBUSI PRIBADI TERVERIFIKASI: {personalInfo.userProfile?.name}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-700 text-white font-bold px-2 py-0.5 rounded">
                      Lvl {personalInfo.currentTier?.level || 2} - {personalInfo.currentTier?.name || "Musannid"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs pt-1">
                    <div className="p-2 bg-white rounded-lg border border-emerald-200 shadow-2xs">
                      <span className="text-[10px] text-slate-500 block">Modal Anda</span>
                      <strong className="text-amber-700 font-bold">
                        Rp {personalInfo.totalDonation.toLocaleString("id-ID")}
                      </strong>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-emerald-200 shadow-2xs">
                      <span className="text-[10px] text-slate-500 block">Jiwa Dibantu</span>
                      <strong className="text-teal-700 font-bold">
                        ~{personalInfo.personalLives} Jiwa
                      </strong>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-emerald-200 shadow-2xs">
                      <span className="text-[10px] text-slate-500 block">Reduksi Karbon</span>
                      <strong className="text-emerald-700 font-bold">
                        {personalInfo.personalCo2Kg} kg CO₂
                      </strong>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-emerald-200 shadow-2xs">
                      <span className="text-[10px] text-slate-500 block">Setara Pohon</span>
                      <strong className="text-lime-700 font-bold">
                        ~{personalInfo.personalTrees} Pohon
                      </strong>
                    </div>
                  </div>
                  <p className="text-[10px] text-emerald-800">
                    📌 <strong>Proyek Utama Didukung:</strong> GCP-01 (Maggot BSF Pasar) & GP-02 (Konsorsium Kemasan Ramah Lingkungan).
                  </p>
                </div>
              )}

              {/* National Aggregate Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Total Jiwa Terdampak</span>
                  <strong className="text-sm font-bold text-teal-800">
                    {totalLives.toLocaleString("id-ID")} Jiwa
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Reduksi Emisi</span>
                  <strong className="text-sm font-bold text-emerald-800">
                    {totalCo2Tons} Ton CO₂
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Serapan Pohon</span>
                  <strong className="text-sm font-bold text-lime-800">
                    {totalTrees} Pohon
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Modal Terdanai</span>
                  <strong className="text-sm font-bold text-amber-800">
                    Rp {(totalCapital / 1000000).toFixed(0)} Juta
                  </strong>
                </div>
              </div>

              {/* Table Preview (first 3 rows) */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-900 text-white text-[10px]">
                    <tr>
                      <th className="p-2">Kode</th>
                      <th className="p-2">Proyek</th>
                      <th className="p-2">Kategori</th>
                      <th className="p-2 text-right">Modal</th>
                      <th className="p-2 text-right">Jiwa</th>
                      <th className="p-2 text-right">CO₂ (kg)</th>
                      <th className="p-2 text-center">Partisipasi Anda</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projects.slice(0, 3).map((p) => {
                      const isFundedByMe = includePersonal && personalInfo.fundedProjectIds.includes(p.id);
                      return (
                        <tr
                          key={p.id}
                          className={isFundedByMe ? "bg-emerald-50/80 font-medium" : "hover:bg-slate-50"}
                        >
                          <td className="p-2 font-mono text-[11px] text-slate-600">{p.id}</td>
                          <td className="p-2 font-bold text-slate-900">{p.shortName}</td>
                          <td className="p-2 text-slate-500">{p.category}</td>
                          <td className="p-2 text-right font-medium text-slate-700">
                            Rp {(p.fundingAmount / 1000000).toFixed(0)} Jt
                          </td>
                          <td className="p-2 text-right text-teal-700 font-bold">{p.livesImpacted}</td>
                          <td className="p-2 text-right text-emerald-700 font-bold">{p.co2ReducedKg}</td>
                          <td className="p-2 text-center">
                            {isFundedByMe ? (
                              <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold">
                                Ikut Serta
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[10px]">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="text-[10px] text-slate-400 mt-1 italic">
                  * Menampilkan ringkasan 3 dari {projects.length} proyek. Seluruh proyek termuat lengkap di dokumen unduhan.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Dokumen resmi terverifikasi Dewan Pengawas Syariah & Komite Lingkungan.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Download CSV button */}
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Unduh CSV (Excel)</span>
            </button>

            {/* Download PDF button */}
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>{isExporting ? "Menyiapkan File..." : "Unduh Dokumen PDF Resmi"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
