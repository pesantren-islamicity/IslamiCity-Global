import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  FileSpreadsheet,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Leaf,
  Scale,
  Calendar,
  Layers,
  ArrowRight,
  RefreshCw,
  Award,
} from "lucide-react";
import { useEmpowerment } from "../context/EmpowermentContext";

export const AIPivotView: React.FC = () => {
  const { awardPoints } = useEmpowerment();
  const [activeSubTab, setActiveSubTab] = useState<
    "career-pivot" | "syariah-clinic" | "green-proposal"
  >("career-pivot");

  // --- Subtab 1: Career & Business Pivot State ---
  const [background, setBackground] = useState("Karyawan Swasta (Divisi Operasional & Gudang)");
  const [skills, setSkills] = useState("Manajemen stok, administrasi, komunikasi, mengemudi kendaraan");
  const [budget, setBudget] = useState("Rp 10.000.000 (dari alokasi pesangon)");
  const [location, setLocation] = useState("Bekasi, Jawa Barat");
  const [interest, setInterest] = useState("Budidaya Pertanian Organik / Maggot BSF atau Kuliner Halal");
  const [familyDependents, setFamilyDependents] = useState("1 Istri dan 2 Anak usia sekolah");
  const [isPivotLoading, setIsPivotLoading] = useState(false);
  const [pivotResult, setPivotResult] = useState<any>(null);
  const [pivotError, setPivotError] = useState<string | null>(null);

  // --- Subtab 2: Syariah Clinic State ---
  const [clinicQuestion, setClinicQuestion] = useState(
    "Saya dan teman alumni PHK ingin patungan buka usaha katering bekal sehat. Bagaimana skema bagi hasil yang syariah agar tidak ada unsur riba atau ketidakjelasan (gharar)?"
  );
  const [clinicContext, setClinicContext] = useState("Kemitraan Modal & Kerja (Musyarakah)");
  const [isClinicLoading, setIsClinicLoading] = useState(false);
  const [clinicResult, setClinicResult] = useState<any>(null);
  const [clinicError, setClinicError] = useState<string | null>(null);

  // --- Subtab 3: Green Proposal Generator State ---
  const [proposalName, setProposalName] = useState("Sentra Budidaya Maggot & Pupuk Kasgot Jamaah");
  const [proposalCategory, setProposalCategory] = useState("Green Circular Economy & Pakan");
  const [proposalTarget, setProposalTarget] = useState("Rp 25.000.000");
  const [proposalMembers, setProposalMembers] = useState("4");
  const [proposalLocation, setProposalLocation] = useState("Sukoharjo, Jawa Tengah");
  const [isProposalLoading, setIsProposalLoading] = useState(false);
  const [proposalResult, setProposalResult] = useState<any>(null);
  const [proposalError, setProposalError] = useState<string | null>(null);

  // Handle Career Pivot Submission
  const handleGeneratePivot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPivotLoading(true);
    setPivotError(null);
    try {
      const res = await fetch("/api/gemini/career-pivot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          background,
          skills,
          budget,
          location,
          interest,
          familyDependents,
        }),
      });
      const data = await res.json();
      if (data.success && data.plan) {
        setPivotResult(data.plan);
        // Award points for formulating 30-day pivot plan
        awardPoints(
          50,
          "Konsultasi Rencana 30 Hari AI Pivot",
          "AI Karir",
          "Merumuskan strategi bangkit mandiri pasca-PHK bersama AI Islamicity.",
          "ai-strategist"
        );
      } else {
        setPivotError(data.error || "Gagal memproses rekomendasi.");
      }
    } catch (err: any) {
      setPivotError(err.message || "Terjadi kesalahan jaringan.");
    } finally {
      setIsPivotLoading(false);
    }
  };

  // Handle Syariah Clinic Submission
  const handleAskClinic = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsClinicLoading(true);
    setClinicError(null);
    try {
      const res = await fetch("/api/gemini/syariah-clinic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: clinicQuestion,
          contextType: clinicContext,
        }),
      });
      const data = await res.json();
      if (data.success && data.answer) {
        setClinicResult(data.answer);
      } else {
        setClinicError(data.error || "Gagal memproses konsultasi fiqih.");
      }
    } catch (err: any) {
      setClinicError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsClinicLoading(false);
    }
  };

  // Handle Green Proposal Generator Submission
  const handleGenerateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProposalLoading(true);
    setProposalError(null);
    try {
      const res = await fetch("/api/gemini/green-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: proposalName,
          category: proposalCategory,
          targetBudget: proposalTarget,
          membersCount: proposalMembers,
          location: proposalLocation,
        }),
      });
      const data = await res.json();
      if (data.success && data.proposal) {
        setProposalResult(data.proposal);
      } else {
        setProposalError(data.error || "Gagal membuat proposal hijau.");
      }
    } catch (err: any) {
      setProposalError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsProposalLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-800 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/40">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Dewan Konsultan & AI Syariah Islamicity</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-white">
          AI Konsultan Karir, Fiqih Muamalah & Usaha Hijau
        </h1>
        <p className="text-emerald-100/90 text-sm sm:text-base max-w-3xl leading-relaxed">
          Manfaatkan kecerdasan buatan terlatih Fiqih Muamalah untuk memetakan
          potensi Anda pasca-PHK, memvalidasi kepatuhan syariah transaksi bisnis,
          dan merancang proposal usaha hijau siap diajukan ke permodalan jamaah.
        </p>

        {/* Sub Navigation Bar */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setActiveSubTab("career-pivot")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === "career-pivot"
                ? "bg-amber-400 text-emerald-950 shadow-md font-bold"
                : "bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>1. Rencana 30 Hari Bangkit (PHK Pivot)</span>
          </button>

          <button
            onClick={() => setActiveSubTab("syariah-clinic")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === "syariah-clinic"
                ? "bg-amber-400 text-emerald-950 shadow-md font-bold"
                : "bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800"
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>2. Klinik Fiqih Muamalah & Akad</span>
          </button>

          <button
            onClick={() => setActiveSubTab("green-proposal")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === "green-proposal"
                ? "bg-amber-400 text-emerald-950 shadow-md font-bold"
                : "bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800"
            }`}
          >
            <Leaf className="w-4 h-4" />
            <span>3. Generator Proposal Usaha Hijau</span>
          </button>
        </div>
      </div>

      {/* ================= MODE 1: CAREER & BUSINESS PIVOT ================= */}
      {activeSubTab === "career-pivot" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Input Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Profil & Potensi Diri Anda
              </h2>
              <p className="text-xs text-slate-500">
                Isi data dengan jujur untuk mendapatkan panduan realistis dan
                terarah.
              </p>
            </div>

            <form onSubmit={handleGeneratePivot} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Profesi / Bidang Kerja Sebelumnya:
                </label>
                <input
                  type="text"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="Contoh: Karyawan Pabrik Tekstil / Staf Keuangan"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Keahlian & Pengalaman Utama:
                </label>
                <textarea
                  rows={2}
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Contoh: Mengoperasikan mesin, packing, penjualan, Excel"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Alokasi Modal:
                  </label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Contoh: Rp 5.000.000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kota / Wilayah:
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Bandung"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Minat Bidang Usaha Baru:
                </label>
                <input
                  type="text"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  placeholder="Contoh: Kuliner Halal, Maggot BSF, Jasa Servis, Laundry Eco"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tanggungan Keluarga:
                </label>
                <input
                  type="text"
                  value={familyDependents}
                  onChange={(e) => setFamilyDependents(e.target.value)}
                  placeholder="Contoh: 1 istri, 2 anak"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <button
                type="submit"
                disabled={isPivotLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isPivotLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menganalisis Rencana Syariah...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Buat Rencana 30 Hari Bangkit</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Result Output Display */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm min-h-[500px] flex flex-col">
            {pivotError && (
              <div className="p-4 bg-rose-50 text-rose-800 rounded-2xl border border-rose-200 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Gagal Membuat Rencana</div>
                  <div>{pivotError}</div>
                </div>
              </div>
            )}

            {!pivotResult && !isPivotLoading && !pivotError && (
              <div className="my-auto text-center py-12 space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 font-serif">
                  Siap Melangkah Menuju Kemandirian?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Lengkapi form di sebelah kiri dan klik tombol untuk menghasilkan
                  analisis peluang bisnis syariah, model akad, dan roadmap aksi 4
                  minggu yang spesifik untuk situasi Anda.
                </p>
              </div>
            )}

            {isPivotLoading && (
              <div className="my-auto text-center py-16 space-y-3">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto" />
                <div className="font-bold text-slate-800 text-base">
                  Menyusun Rencana Usaha Berkah...
                </div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Menghitung proyeksi BEP, kesesuaian akad syariah, dan aspek
                  keberlanjutan hijau...
                </p>
              </div>
            )}

            {pivotResult && !isPivotLoading && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Rencana Terverifikasi Fiqih Muamalah</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mt-2">
                    {pivotResult.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {pivotResult.summary}
                  </p>
                </div>

                {/* Recommended Business Models */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Rekomendasi Model Usaha Berdaya:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {pivotResult.recommendedBusinessModels?.map(
                      (item: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                        >
                          <div className="font-bold text-slate-900 text-sm">
                            {item.name}
                          </div>
                          <div className="flex flex-wrap gap-1.5 text-[11px]">
                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
                              Akad: {item.akad}
                            </span>
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                              BEP: {item.breakEvenEstimate}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            <strong>Modal:</strong> {item.estimatedStartupCost}
                          </p>
                          <p className="text-xs text-emerald-800">
                            <strong>Aspek Hijau:</strong> {item.greenAspect}
                          </p>
                          <p className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
                            <strong>Syariah:</strong> {item.shariaComplianceNote}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* 4-Week Action Roadmap */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>Roadmap Aksi Konkret 4 Minggu Pertama:</span>
                  </h3>
                  <div className="space-y-2.5">
                    {pivotResult.weeklyActionRoadmap?.map(
                      (weekItem: any, wIdx: number) => (
                        <div
                          key={wIdx}
                          className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5"
                        >
                          <div className="font-bold text-emerald-950 text-xs">
                            {weekItem.week}
                          </div>
                          <ul className="space-y-1">
                            {weekItem.steps?.map((step: string, sIdx: number) => (
                              <li
                                key={sIdx}
                                className="text-xs text-emerald-900 flex items-start gap-2"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Quran / Hadith Motivation */}
                {pivotResult.quranInspiration && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                    <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                      {pivotResult.quranInspiration.verse}
                    </div>
                    <p className="text-xs sm:text-sm font-medium italic">
                      "{pivotResult.quranInspiration.text}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODE 2: SHARIA CLINIC ================= */}
      {activeSubTab === "syariah-clinic" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Clinic Input Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Tanya Jawab Fiqih Muamalah
              </h2>
              <p className="text-xs text-slate-500">
                Konsultasikan keraguan akad, hutang piutang, status halal
                transaksi, atau bagi hasil usaha.
              </p>
            </div>

            <form onSubmit={handleAskClinic} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kategori Masalah:
                </label>
                <select
                  value={clinicContext}
                  onChange={(e) => setClinicContext(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white"
                >
                  <option>Kemitraan Modal & Kerja (Mudharabah/Musyarakah)</option>
                  <option>Pelunasan Utang & Solusi Bebas Riba</option>
                  <option>Hak Pesangon & Ketenggangan Kerja</option>
                  <option>Jual Beli Online, Reseller & Dropshipping</option>
                  <option>Sertifikasi Halal & Standar Green Eco</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pertanyaan Anda Secara Detail:
                </label>
                <textarea
                  rows={4}
                  value={clinicQuestion}
                  onChange={(e) => setClinicQuestion(e.target.value)}
                  placeholder="Jelaskan kasus muamalah Anda..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1 border border-slate-200">
                <div className="font-semibold text-slate-800">
                  Pertanyaan Populer Jamaah:
                </div>
                <ul className="space-y-1 text-[11px] text-slate-600">
                  <li
                    onClick={() =>
                      setClinicQuestion(
                        "Bagaimana hukum mengambil pinjaman modal usaha dengan syarat titip sertifikat rumah tapi tanpa bunga tambahan (Qardh)?"
                      )
                    }
                    className="cursor-pointer text-emerald-700 hover:underline"
                  >
                    • Hukum jaminan gadai pada Qardhul Hasan?
                  </li>
                  <li
                    onClick={() =>
                      setClinicQuestion(
                        "Jika usaha bersama rugi bukan karena kelalaian pengelola, siapa yang menanggung kerugian modal menurut akad Mudharabah?"
                      )
                    }
                    className="cursor-pointer text-emerald-700 hover:underline"
                  >
                    • Penanggung kerugian dalam Mudharabah?
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isClinicLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isClinicLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengkaji Dalil & Kaidah Fiqih...</span>
                  </>
                ) : (
                  <>
                    <Scale className="w-4 h-4" />
                    <span>Dapatkan Fatwa & Solusi Syariah</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Clinic Result */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm min-h-[480px]">
            {clinicError && (
              <div className="p-4 bg-rose-50 text-rose-800 rounded-2xl border border-rose-200 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Gagal Menganalisis</div>
                  <div>{clinicError}</div>
                </div>
              </div>
            )}

            {!clinicResult && !isClinicLoading && !clinicError && (
              <div className="text-center py-16 space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                  <Scale className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 font-serif">
                  Klinik Fiqih Muamalah 24/7
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Kirimkan pertanyaan terkait transaksi bisnis Anda untuk
                  mendapatkan fatwa praktis, rujukan dalil Al-Quran & Sunnah,
                  serta alternatif solusi yang terbebas dari riba dan gharar.
                </p>
              </div>
            )}

            {isClinicLoading && (
              <div className="text-center py-20 space-y-3">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto" />
                <div className="font-bold text-slate-800 text-base">
                  Mengkaji Berdasarkan Kaidah Fiqih...
                </div>
                <p className="text-xs text-slate-500">
                  Mengharmonisasikan fatwa DSN-MUI dan kitab-kitab Fiqih Muamalah
                  kontemporer...
                </p>
              </div>
            )}

            {clinicResult && !isClinicLoading && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status Ketetapan Fiqih:
                    </span>
                    <div className="text-xl font-bold text-emerald-700 font-serif mt-0.5">
                      {clinicResult.statusHukum}
                    </div>
                  </div>
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {clinicResult.penjelasan}
                </div>

                {/* Poin Kritis */}
                {clinicResult.poinKritis && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Poin Kritis yang Wajib Diperhatikan:
                    </h4>
                    <div className="space-y-1.5">
                      {clinicResult.poinKritis.map((p: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-700"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rekomendasi Akad & Dalil */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                    <div className="font-bold text-amber-900 mb-1">
                      Rekomendasi Akad:
                    </div>
                    <div className="text-amber-950 font-medium">
                      {clinicResult.rekomendasiAkad}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="font-bold text-emerald-900 mb-1">
                      Dalil / Rujukan Fiqih:
                    </div>
                    <div className="text-emerald-950 font-medium">
                      {clinicResult.dalilRujukan}
                    </div>
                  </div>
                </div>

                {/* Langkah Praktis */}
                {clinicResult.langkahPraktis && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Langkah Praktis Eksekusi:
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      {clinicResult.langkahPraktis.map(
                        (step: string, idx: number) => (
                          <li key={idx} className="leading-relaxed">
                            {step}
                          </li>
                        )
                      )}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODE 3: GREEN PROPOSAL GENERATOR ================= */}
      {activeSubTab === "green-proposal" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Proposal Input */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Rancang Bangun Usaha Hijau
              </h2>
              <p className="text-xs text-slate-500">
                Buat proposal terstruktur untuk diajukan ke Crowdfunding Jamaah
                atau Koperasi Syariah.
              </p>
            </div>

            <form onSubmit={handleGenerateProposal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Proyek Usaha Hijau:
                </label>
                <input
                  type="text"
                  value={proposalName}
                  onChange={(e) => setProposalName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kategori Usaha:
                </label>
                <select
                  value={proposalCategory}
                  onChange={(e) => setProposalCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white"
                >
                  <option>Green Circular Economy & Pakan (Maggot BSF)</option>
                  <option>Pertanian Organik & Aquaponik Masjid</option>
                  <option>Bank Sampah Berkah & Upcycling Plastik</option>
                  <option>Dapur Halal Bersama & Cloud Kitchen Koperasi</option>
                  <option>Konversi Energi Bersih & Motor Listrik</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Modal:
                  </label>
                  <input
                    type="text"
                    value={proposalTarget}
                    onChange={(e) => setProposalTarget(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tenaga Kerja PHK:
                  </label>
                  <input
                    type="number"
                    value={proposalMembers}
                    onChange={(e) => setProposalMembers(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Lokasi Operasional:
                </label>
                <input
                  type="text"
                  value={proposalLocation}
                  onChange={(e) => setProposalLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isProposalLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isProposalLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyusun Proposal Lengkap...</span>
                  </>
                ) : (
                  <>
                    <Leaf className="w-4 h-4" />
                    <span>Generate Proposal Usaha Hijau</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Proposal Display */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm min-h-[480px]">
            {proposalError && (
              <div className="p-4 bg-rose-50 text-rose-800 rounded-2xl border border-rose-200 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Gagal Membuat Proposal</div>
                  <div>{proposalError}</div>
                </div>
              </div>
            )}

            {!proposalResult && !isProposalLoading && !proposalError && (
              <div className="text-center py-16 space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
                  <Leaf className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 font-serif">
                  Blueprint Usaha Hijau Siap Dana
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Buat proposal formal lengkap dengan target dampak lingkungan,
                  penyerapan tenaga kerja alumni PHK, alokasi anggaran, dan
                  skema bagi hasil (nisbah) untuk pemodal jamaah.
                </p>
              </div>
            )}

            {isProposalLoading && (
              <div className="text-center py-20 space-y-3">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto" />
                <div className="font-bold text-slate-800 text-base">
                  Mengalkulasi Dampak Lingkungan & Finansial...
                </div>
                <p className="text-xs text-slate-500">
                  Menghitung skema Musyarakah, persentase anggaran, dan reduksi
                  jejak karbon...
                </p>
              </div>
            )}

            {proposalResult && !isProposalLoading && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {proposalResult.kategori}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mt-2">
                    {proposalResult.namaProyek}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {proposalResult.ringkasanEksekutif}
                  </p>
                </div>

                {/* Anggaran Rencana */}
                {proposalResult.anggaranRencana && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Struktur Alokasi Anggaran:
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <div className="text-slate-500 text-[10px]">Alat:</div>
                        <div className="font-bold text-slate-900">
                          {proposalResult.anggaranRencana.alokasiAlat}
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <div className="text-slate-500 text-[10px]">Bahan Baku:</div>
                        <div className="font-bold text-slate-900">
                          {proposalResult.anggaranRencana.alokasiBahanBaku}
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <div className="text-slate-500 text-[10px]">Operasional:</div>
                        <div className="font-bold text-slate-900">
                          {proposalResult.anggaranRencana.alokasiOperasional}
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <div className="text-slate-500 text-[10px]">Infaq & Darurat:</div>
                        <div className="font-bold text-slate-900">
                          {proposalResult.anggaranRencana.danaDaruratDanInfaq}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dampak Hijau & Sosial */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                    <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      <span>Target Dampak Hijau:</span>
                    </div>
                    <ul className="space-y-1 text-xs text-emerald-900">
                      {proposalResult.targetDampakHijau?.map(
                        (g: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1 shrink-0"></span>
                            <span>{g}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 space-y-2">
                    <div className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-teal-600" />
                      <span>Dampak Sosial Umat:</span>
                    </div>
                    <ul className="space-y-1 text-xs text-teal-900">
                      {proposalResult.targetDampakSosialEkonomi?.map(
                        (s: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1 shrink-0"></span>
                            <span>{s}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>

                {/* Skema Bagi Hasil */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-amber-900">
                      Skema Bagi Hasil (Nisbah Syariah):
                    </div>
                    <div className="mt-0.5">{proposalResult.skemaBagiHasil}</div>
                  </div>
                  <button
                    onClick={() =>
                      alert(
                        "Proposal berhasil disimpan ke draft pengajuan Crowdfunding Jamaah!"
                      )
                    }
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Ajukan ke Crowdfund
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
