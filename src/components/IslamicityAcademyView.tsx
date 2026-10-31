import React, { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Landmark,
  Sprout,
  Users,
  ShieldCheck,
  Scale,
  Award,
  CheckCircle2,
  ChevronRight,
  Download,
  Share2,
  Copy,
  Check,
  Play,
  FileText,
  MapPin,
  TrendingUp,
  HelpCircle,
  Clock,
  ArrowRight,
  Flame,
  Layers,
  HeartHandshake,
  Send,
  Building,
  Home,
  Compass,
  AlertTriangle,
  RefreshCw,
  X,
  Target,
  FileCheck2,
  Lightbulb,
} from "lucide-react";
import {
  AcademyModule,
  AcademyLesson,
  TerritoryLevel,
  TerritoryPilot,
  TerritoryMasterplan,
} from "../types";
import {
  ACADEMY_MODULES,
  MOCK_TERRITORY_PILOTS,
  IBT_CRITERIA_RUBRIC,
} from "../data/academyData";
import { useEmpowerment } from "../context/EmpowermentContext";
import confetti from "canvas-confetti";

type AcademyMainTab = "curriculum" | "ai-masterplan" | "ibt-diagnostic" | "pilots" | "sop-templates";

export const IslamicityAcademyView: React.FC = () => {
  const { awardPoints, userProfile } = useEmpowerment();

  const [activeTab, setActiveTab] = useState<AcademyMainTab>("curriculum");

  // Modules & Learning State
  const [modules, setModules] = useState<AcademyModule[]>(ACADEMY_MODULES);
  const [selectedModule, setSelectedModule] = useState<AcademyModule | null>(null);
  const [activeLesson, setActiveLesson] = useState<AcademyLesson | null>(null);

  // Quiz State
  const [quizModalModule, setQuizModalModule] = useState<AcademyModule | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  // AI Masterplan Form State
  const [territoryName, setTerritoryName] = useState<string>("RW 05 Kelurahan Antapani Tengah");
  const [territoryLevel, setTerritoryLevel] = useState<TerritoryLevel>("RW");
  const [demographicContext, setDemographicContext] = useState<string>(
    "Kawasan permukiman 320 KK dengan 4 masjid/musholla, terdapat sekitar 25 kepala keluarga terdampak PHK industri dan pelaku UMKM kuliner/jasa rumahan."
  );
  const [mainChallenges, setMainChallenges] = useState<string>(
    "Tingginya korban PHK baru, marak tawaran pinjol/bank keliling, sampah sisa dapur belum terolah, dan kas sosial masjid belum optimal untuk bantuan produktif."
  );
  const [targetMonths, setTargetMonths] = useState<string>("100 Hari (Fase Akselerasi)");
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [generatedMasterplan, setGeneratedMasterplan] = useState<TerritoryMasterplan | null>(null);
  const [copiedMasterplan, setCopiedMasterplan] = useState<boolean>(false);

  // IBT Diagnostic State (20 items checklist)
  const [checkedRubric, setCheckedRubric] = useState<Record<string, boolean>>({
    "0-0": true,
    "0-1": true,
    "1-1": true,
    "2-0": true,
    "3-2": true,
    "4-0": true,
  });
  const [diagnosticTerritoryName, setDiagnosticTerritoryName] = useState<string>("RT 03 / RW 08 Sukamiskin");
  const [diagnosticTerritoryLevel, setDiagnosticTerritoryLevel] = useState<TerritoryLevel>("RT");

  // Pilot Registration Modal
  const [isRegisterPilotOpen, setIsRegisterPilotOpen] = useState<boolean>(false);
  const [regLeaderName, setRegLeaderName] = useState<string>(userProfile.name || "");
  const [regPhone, setRegPhone] = useState<string>(userProfile.phone || "");
  const [regTerritory, setRegTerritory] = useState<string>("");
  const [regLevel, setRegLevel] = useState<TerritoryLevel>("RW");
  const [regNotes, setRegNotes] = useState<string>("");
  const [regSuccess, setRegSuccess] = useState<boolean>(false);

  // Helper for formatting Currency
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Generate Masterplan via Server API
  const handleGenerateMasterplan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingPlan(true);

    try {
      const res = await fetch("/api/gemini/academy-masterplan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          territoryName,
          level: territoryLevel,
          demographicContext,
          mainChallenges,
          targetMonths,
        }),
      });

      const data = await res.json();
      if (data.success && data.masterplan) {
        setGeneratedMasterplan(data.masterplan);
        awardPoints(
          150,
          `Masterplan Wilayah: ${territoryName}`,
          "Dakwah & Syiar",
          `Menyusun Blueprint 100 Hari Baldatun Thoyyibatun untuk tingkat ${territoryLevel}.`,
          "civilization-architect"
        );
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error("Failed to generate masterplan:", err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Submit Quiz
  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizModalModule) return;

    let correctCount = 0;
    quizModalModule.quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / quizModalModule.quizQuestions.length) * 100);
    setQuizScore(calculatedScore);
    setQuizSubmitted(true);

    if (calculatedScore >= 70) {
      if (!completedModules.includes(quizModalModule.id)) {
        setCompletedModules((prev) => [...prev, quizModalModule.id]);
        awardPoints(
          quizModalModule.pointsReward,
          `Lulus Modul ${quizModalModule.moduleNumber}: ${quizModalModule.title.split(":")[0]}`,
          "Barter Skill",
          `Menyelesaikan sertifikasi modul dan kuis pemahaman kader wilayah.`,
          "qaryah-mover"
        );
      }
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
    }
  };

  // Diagnostic Score Calculation
  const totalCriteriaCount = IBT_CRITERIA_RUBRIC.reduce((sum, c) => sum + c.items.length, 0);
  const checkedCriteriaCount = Object.values(checkedRubric).filter(Boolean).length;
  const ibtCalculatedScore = Math.round((checkedCriteriaCount / totalCriteriaCount) * 100);

  const getIbtStatus = (score: number) => {
    if (score >= 85) return { title: "Baldatun Thoyyibatun Paripurna", color: "text-emerald-700 bg-emerald-100 border-emerald-300", desc: "Wilayah mandiri berkelanjutan dengan 5 pilar peradaban aktif." };
    if (score >= 65) return { title: "Kawasan Akselerasi Maju", color: "text-teal-700 bg-teal-100 border-teal-300", desc: "Sebagian besar pilar berjalan baik, perlu akselerasi ekonomi bebas riba & maggot BSF." };
    if (score >= 40) return { title: "Fase Rintisan Berkembang", color: "text-amber-700 bg-amber-100 border-amber-300", desc: "Memiliki potensi awal, butuh konsolidasi Baitul Maal dan kepemimpinan syura." };
    return { title: "Fase Inisiasi Awal", color: "text-rose-700 bg-rose-100 border-rose-300", desc: "Segera terapkan SOP Modul 1 untuk menghidupkan fungsi sosial masjid & sedekah subuh." };
  };

  const currentIbtStatus = getIbtStatus(ibtCalculatedScore);

  // Copy Masterplan Share Text
  const handleCopyMasterplan = () => {
    if (!generatedMasterplan) return;

    let text = `🕌 MASTERPLAN STRATEGIS PERADABAN WILAYAH
Menuju Baldatun Thoyyibatun wa Rabbun Ghofur
Tingkat: ${generatedMasterplan.level} ${generatedMasterplan.territoryName}
Target Skor IBT: ${generatedMasterplan.ibtTargetScore}/100
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 Rujukan Al-Qur'an (QS. ${generatedMasterplan.quranicReference.surah}: ${generatedMasterplan.quranicReference.verse}):
"${generatedMasterplan.quranicReference.translation}"

🌟 Visi Wilayah:
${generatedMasterplan.visionStatement}

📋 5 PILAR AKSI UTAMA:
`;

    generatedMasterplan.pillars.forEach((p, idx) => {
      text += `\n${p.pillarName}\n• Tujuan: ${p.strategicGoal}\n• Quick Win 30 Hari: ${p.quickWins30Days}\n• Estimasi Anggaran: ${p.budgetEstimate}\n• Aksi: ${p.keyActionItems.join("; ")}\n`;
    });

    text += `\n🚀 ROADMAP 100 HARI:\n`;
    generatedMasterplan.hundredDaysRoadmap.forEach((r) => {
      text += `\n[${r.phase}] - ${r.milestone}\n• ${r.tasks.join("\n• ")}\n`;
    });

    text += `\n🏛️ KELEMBAGAAN & SUMBER DANA:\n• Majelis Syura Wilayah & Baitul Maal RT\n• Infaq Sedekah Subuh, Syirkah Koperasi & Qardhul Hasan\n\n🌐 Diterbitkan oleh Islamicity Academy: https://global.islamicity.tv`;

    navigator.clipboard.writeText(text);
    setCopiedMasterplan(true);
    setTimeout(() => setCopiedMasterplan(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Header: Islamicity Academy */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border border-emerald-700/60 p-6 sm:p-9 text-white shadow-xl">
        {/* Glow background accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 -mb-20 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-500/60 text-emerald-200 text-xs font-bold uppercase tracking-wider shadow-inner">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>Islamicity Academy • Institut Kepemimpinan & Pembangunan Teritorial</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-200/90 bg-slate-800/60 px-3 py-1 rounded-full border border-slate-700">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Target: Kecamatan, Kelurahan, RW & RT se-Nusantara</span>
            </div>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-white tracking-tight leading-tight">
              Membangun Peradaban dari Tingkat RT/RW: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-teal-200 to-emerald-300">
                Baldatun Thoyyibatun wa Rabbun Ghofur
              </span>
            </h1>
            <p className="text-xs sm:text-base text-emerald-100/90 leading-relaxed">
              Pusat kaderisasi, kurikulum terapan, dan generator masterplan berbasis AI untuk mencetak <strong>Duta Penggerak Peradaban</strong>. Mengintegrasikan masjid berdaya, ekonomi bebas riba, koperasi hijau, solidaritas ta'awun korban PHK, dan tata kelola syura transparan.
            </p>
          </div>

          {/* 5 Pillars Quick Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
            <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-emerald-600/30 text-center">
              <span className="text-xl block mb-1">🕌</span>
              <strong className="text-xs text-emerald-300 font-bold block">1. Masjid & Ruhiyah</strong>
              <span className="text-[10px] text-slate-300">Sentra Baitul Maal Lingkungan</span>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-emerald-600/30 text-center">
              <span className="text-xl block mb-1">🌾</span>
              <strong className="text-xs text-teal-300 font-bold block">2. Ekonomi Bebas Riba</strong>
              <span className="text-[10px] text-slate-300">Lumbung Pangan & Koperasi</span>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-emerald-600/30 text-center">
              <span className="text-xl block mb-1">🤝</span>
              <strong className="text-xs text-amber-300 font-bold block">3. Sosial & Ta'awun</strong>
              <span className="text-[10px] text-slate-300">Satgas Tanggap PHK & Yatim</span>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-emerald-600/30 text-center">
              <span className="text-xl block mb-1">🌱</span>
              <strong className="text-xs text-lime-300 font-bold block">4. Ekologi Sirkular</strong>
              <span className="text-[10px] text-slate-300">Maggot BSF & Urban Farming</span>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-emerald-600/30 text-center col-span-2 sm:col-span-1">
              <span className="text-xl block mb-1">⚖️</span>
              <strong className="text-xs text-cyan-300 font-bold block">5. Tata Kelola Syura</strong>
              <span className="text-[10px] text-slate-300">Buku Kas Transparan & e-Musyawarah</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Academy Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("curriculum")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "curriculum"
                ? "bg-emerald-800 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Kurikulum & Modul ({modules.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ai-masterplan")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "ai-masterplan"
                ? "bg-emerald-800 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>2. AI Arsitek Masterplan RT/RW</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ibt-diagnostic")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "ibt-diagnostic"
                ? "bg-emerald-800 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>3. Audit & Skor IBT ({ibtCalculatedScore}%)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pilots")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "pilots"
                ? "bg-emerald-800 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>4. Pilot Project Percontohan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sop-templates")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "sop-templates"
                ? "bg-emerald-800 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>5. SOP & Dokumen Legal</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsRegisterPilotOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Home className="w-4 h-4" />
          <span>Daftarkan RT/RW Anda</span>
        </button>
      </div>

      {/* ================= TAB 1: KURIKULUM & MODUL SERTIFIKASI ================= */}
      {activeTab === "curriculum" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-emerald-950 font-serif">
                Kurikulum Kader Penggerak Peradaban Wilayah
              </h3>
              <p className="text-xs text-slate-600">
                Selesaikan 5 modul terpadu untuk memperoleh <strong>Syahadah & Gelar Duta Penggerak RT/RW Berdaya</strong>.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 bg-white px-3 py-1.5 rounded-xl border border-emerald-300">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{completedModules.length} dari {modules.length} Modul Selesai</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod) => {
              const isCompleted = completedModules.includes(mod.id);

              return (
                <div
                  key={mod.id}
                  className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between group shadow-sm hover:shadow-md ${
                    isCompleted
                      ? "border-emerald-500/80 bg-gradient-to-b from-emerald-50/40 to-white"
                      : "border-slate-200 hover:border-emerald-400"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-2xl flex items-center justify-center shadow-xs">
                        {mod.icon}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                          Modul {mod.moduleNumber}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-bold text-white bg-emerald-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Check className="w-3 h-3" /> Lulus
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-emerald-700 block uppercase">
                        {mod.pillar}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base font-serif mt-0.5 line-clamp-2">
                        {mod.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>

                    {/* Metadata Badges */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {mod.durationHours} Jam ({mod.lessonsCount} Sesi)
                      </span>
                      <span className="flex items-center gap-1 text-amber-600 font-semibold">
                        <Award className="w-3.5 h-3.5" />
                        +{mod.pointsReward} Poin
                      </span>
                    </div>
                  </div>

                  {/* Module Footer Action Buttons */}
                  <div className="pt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedModule(mod);
                        setActiveLesson(mod.lessons[0]);
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Pelajari Materi</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setQuizModalModule(mod);
                        setQuizAnswers({});
                        setQuizSubmitted(false);
                        setQuizScore(0);
                      }}
                      className="py-2.5 px-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                    >
                      <span>Kuis</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: AI ARSITEK MASTERPLAN RT/RW ================= */}
      {activeTab === "ai-masterplan" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-900 rounded-3xl p-6 sm:p-8 text-white border border-emerald-700/50 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800 pb-3">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Arsitek Baldatun Thoyyibatun
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif">
                  Generator Blueprint 100 Hari Transformasi Wilayah
                </h3>
              </div>
              <p className="text-xs text-emerald-200/80 max-w-md">
                Masukkan profil dan permasalahan wilayah Anda. AI akan merancang roadmap aksi terintegrasi 5 pilar peradaban lengkap dengan SOP, anggaran, dan strategi kelembagaan.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleGenerateMasterplan} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-emerald-200 uppercase">
                    Nama Wilayah:
                  </label>
                  <input
                    type="text"
                    value={territoryName}
                    onChange={(e) => setTerritoryName(e.target.value)}
                    placeholder="Contoh: RW 05 Kelurahan Antapani Tengah"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-emerald-600/60 text-white text-xs sm:text-sm font-semibold focus:border-amber-400 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-200 uppercase">
                    Tingkatan Wilayah:
                  </label>
                  <select
                    value={territoryLevel}
                    onChange={(e) => setTerritoryLevel(e.target.value as TerritoryLevel)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-emerald-600/60 text-white text-xs sm:text-sm font-semibold focus:border-amber-400 focus:outline-none"
                  >
                    <option value="RT">Rukun Tetangga (RT)</option>
                    <option value="RW">Rukun Warga (RW)</option>
                    <option value="Kelurahan">Kelurahan / Desa</option>
                    <option value="Kecamatan">Kecamatan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-200 uppercase">
                    Kondisi Demografi & Potensi Sumber Daya:
                  </label>
                  <textarea
                    rows={3}
                    value={demographicContext}
                    onChange={(e) => setDemographicContext(e.target.value)}
                    placeholder="Contoh: 250 KK, 2 masjid, banyak ibu rumah tangga & alumni pekerja pabrik yang terampil..."
                    className="w-full p-3 rounded-xl bg-slate-950/80 border border-emerald-600/60 text-white text-xs leading-relaxed focus:border-amber-400 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-200 uppercase">
                    Tantangan Mendesak yang Ingin Diselesaikan:
                  </label>
                  <textarea
                    rows={3}
                    value={mainChallenges}
                    onChange={(e) => setMainChallenges(e.target.value)}
                    placeholder="Contoh: 18 warga ter-PHK butuh modal bebas riba, sampah menumpuk di gang, kas musholla minim..."
                    className="w-full p-3 rounded-xl bg-slate-950/80 border border-emerald-600/60 text-white text-xs leading-relaxed focus:border-amber-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="text-[11px] text-emerald-300/80 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Dapatkan +150 Poin Berdaya & Lencana Arsitek Peradaban</span>
                </div>

                <button
                  type="submit"
                  disabled={isGeneratingPlan}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isGeneratingPlan ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Merumuskan Masterplan Syariah...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Rancang Masterplan AI Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Generated Masterplan Showcase */}
          {generatedMasterplan && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-500/80 shadow-xl space-y-6 animate-in fade-in zoom-in duration-300">
              {/* Header Showcase */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 inline-block mb-1">
                    Dokumen Resmi Masterplan Wilayah Baldatun Thoyyibatun
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                    {generatedMasterplan.level} {generatedMasterplan.territoryName}
                  </h3>
                  <p className="text-xs text-slate-600 italic mt-1">
                    "{generatedMasterplan.visionStatement}"
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyMasterplan}
                    className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedMasterplan ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedMasterplan ? "Tersalin!" : "Salin Teks Lengkap"}</span>
                  </button>

                  <div className="p-2.5 bg-emerald-800 text-white rounded-2xl text-center min-w-[90px]">
                    <span className="text-[9px] uppercase font-bold block text-emerald-300">Target Skor IBT</span>
                    <strong className="text-lg font-extrabold">{generatedMasterplan.ibtTargetScore}%</strong>
                  </div>
                </div>
              </div>

              {/* Quranic Anchor */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/90 text-xs space-y-1">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Landasan Ruhani: QS. {generatedMasterplan.quranicReference.surah} Ayat {generatedMasterplan.quranicReference.verse}</span>
                </span>
                <p className="text-slate-700 italic">
                  "{generatedMasterplan.quranicReference.translation}"
                </p>
              </div>

              {/* 5 Pillars Grid */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 font-serif text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-700" />
                  <span>Matriks 5 Pilar Strategis & Quick Wins 30 Hari</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedMasterplan.pillars.map((pillar, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5 hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{pillar.pillarIcon}</span>
                          <span>{pillar.pillarName}</span>
                        </strong>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {pillar.budgetEstimate.split("(")[0]}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">
                        {pillar.strategicGoal}
                      </p>

                      <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-[11px] text-emerald-950">
                        <strong>⚡ Quick Win 30 Hari:</strong> {pillar.quickWins30Days}
                      </div>

                      <div className="space-y-1 text-xs text-slate-700">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">
                          Rencana Aksi Utama:
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                          {pillar.keyActionItems.map((act, aIdx) => (
                            <li key={aIdx}>{act}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 100 Days Roadmap Phases */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 font-serif text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-700" />
                  <span>Roadmap 100 Hari Transformasi Wilayah</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {generatedMasterplan.hundredDaysRoadmap.map((phase, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-4 rounded-2xl bg-gradient-to-b from-teal-50/50 to-slate-50 border border-teal-200 space-y-2"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                        {phase.phase}
                      </span>
                      <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                        {phase.milestone}
                      </h5>
                      <ul className="space-y-1.5 text-[11px] text-slate-600 pt-1">
                        {phase.tasks.map((task, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Funding & Institutional Setup */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h5 className="font-bold text-xs uppercase text-slate-700 flex items-center gap-1.5">
                    <Landmark className="w-4 h-4 text-amber-600" />
                    <span>Strategi Pendanaan Halal Mandiri:</span>
                  </h5>
                  <div className="space-y-2 text-xs">
                    {generatedMasterplan.fundingStrategy.map((f, fIdx) => (
                      <div key={fIdx} className="flex justify-between items-start text-[11px] border-b border-slate-200/60 pb-1">
                        <div>
                          <strong className="text-slate-900 block">{f.source} ({f.allocation})</strong>
                          <span className="text-slate-500">{f.mechanism}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h5 className="font-bold text-xs uppercase text-slate-700 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-emerald-600" />
                    <span>Struktur Kelembagaan Pelaksana:</span>
                  </h5>
                  <div className="space-y-2 text-xs">
                    {generatedMasterplan.institutionalSetup.map((inst, iIdx) => (
                      <div key={iIdx} className="text-[11px] border-b border-slate-200/60 pb-1">
                        <strong className="text-emerald-950 block">{inst.bodyName}</strong>
                        <span className="text-slate-600 block">{inst.role}</span>
                        <span className="text-slate-400 text-[10px]">Anggota: {inst.membership}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: KALKULATOR & DIAGNOSTIK IBT ================= */}
      {activeTab === "ibt-diagnostic" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                  Alat Ukur Kesiapan Wilayah Berkah
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 mt-1">
                  Kalkulator Indeks Baldatun Thoyyibatun (IBT)
                </h3>
                <p className="text-xs text-slate-600">
                  Centang kondisi faktual di lingkungan RT/RW Anda untuk mengukur skor kesiapan dan rekomendasi aksi nyata.
                </p>
              </div>

              {/* Score Meter Box */}
              <div className="p-4 rounded-2xl border bg-slate-50 flex items-center gap-4 min-w-[240px]">
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Skor IBT</span>
                  <strong className="text-3xl font-extrabold text-emerald-900 block font-serif">
                    {ibtCalculatedScore}%
                  </strong>
                </div>
                <div className="border-l border-slate-200 pl-3 space-y-0.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentIbtStatus.color} block text-center`}>
                    {currentIbtStatus.title}
                  </span>
                  <span className="text-[10px] text-slate-500 line-clamp-2">
                    {currentIbtStatus.desc}
                  </span>
                </div>
              </div>
            </div>

            {/* Rubric Categories Checklist */}
            <div className="space-y-6">
              {IBT_CRITERIA_RUBRIC.map((category, catIdx) => (
                <div key={catIdx} className="space-y-3">
                  <div className="flex items-center justify-between bg-slate-100/80 px-3.5 py-2 rounded-xl">
                    <strong className="text-xs sm:text-sm font-bold text-slate-900">
                      {category.category}
                    </strong>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Bobot {category.weight}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {category.items.map((item, itemIdx) => {
                      const key = `${catIdx}-${itemIdx}`;
                      const isChecked = Boolean(checkedRubric[key]);

                      return (
                        <label
                          key={key}
                          className={`p-3 rounded-2xl border text-xs flex items-start gap-3 cursor-pointer transition-all ${
                            isChecked
                              ? "bg-emerald-50/70 border-emerald-400 text-emerald-950 font-medium"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              setCheckedRubric((prev) => ({
                                ...prev,
                                [key]: e.target.checked,
                              }))
                            }
                            className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-500"
                          />
                          <span className="leading-snug">{item}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Summary Recommendation */}
            <div className="p-5 bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" />
                  Rekomendasi Langkah Aksi Prioritas:
                </span>
                <span className="text-xs text-emerald-200">
                  {checkedCriteriaCount} dari {totalCriteriaCount} Indikator Terpenuhi
                </span>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Untuk meningkatkan skor IBT Anda ke tingkat berikutnya, fokuskan pada pengaktifan <strong>Lumbung Sembako RT</strong> dan <strong>Biokonversi Maggot BSF</strong> untuk mengolah sisa makanan warga secara mandiri.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("ai-masterplan")}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Susun Blueprint 100 Hari untuk Wilayah Ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: PILOT PROJECT PERCONTOHAN ================= */}
      {activeTab === "pilots" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                Direktori Wilayah Percontohan Binaan Islamicity
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Studi kasus nyata RT, RW, dan Kelurahan yang telah sukses bertransformasi menjadi kawasan Baldatun Thoyyibatun.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsRegisterPilotOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              + Ajukan Wilayah Binaan Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_TERRITORY_PILOTS.map((pilot) => (
              <div
                key={pilot.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={pilot.imageUrl}
                      alt={pilot.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-300 font-bold text-xs border border-emerald-500/40">
                        Tingkat {pilot.level} • {pilot.familiesCount} KK
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black text-xs shadow-md">
                        Skor IBT: {pilot.ibtScore}%
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h4 className="text-base sm:text-lg font-bold font-serif line-clamp-1">
                        {pilot.name}
                      </h4>
                      <p className="text-xs text-emerald-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{pilot.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="text-xs text-slate-600">
                      <strong>Tokoh Penggerak:</strong> {pilot.leaderName}
                    </div>

                    {/* Impact Statistics */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                        <span className="text-[10px] text-emerald-800 uppercase block font-semibold">
                          Korban PHK Berdaya
                        </span>
                        <strong className="text-slate-900 text-sm font-bold">
                          {pilot.impactStats.layoffVictimsEmpowered} Jiwa
                        </strong>
                      </div>

                      <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-200">
                        <span className="text-[10px] text-teal-800 uppercase block font-semibold">
                          Keluarga Bebas Riba
                        </span>
                        <strong className="text-slate-900 text-sm font-bold">
                          {pilot.impactStats.zeroRibaFamilies} KK
                        </strong>
                      </div>

                      <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                        <span className="text-[10px] text-amber-800 uppercase block font-semibold">
                          ZISWAF Terkelola/Bulan
                        </span>
                        <strong className="text-slate-900 text-xs font-bold">
                          {formatRupiah(pilot.impactStats.monthlyZiswafCollected)}
                        </strong>
                      </div>

                      <div className="p-2.5 bg-lime-50 rounded-xl border border-lime-200">
                        <span className="text-[10px] text-lime-800 uppercase block font-semibold">
                          Sampah Terolah / Bln
                        </span>
                        <strong className="text-slate-900 text-sm font-bold">
                          {pilot.impactStats.wasteDivertedKg.toLocaleString("id-ID")} kg
                        </strong>
                      </div>
                    </div>

                    {/* Key Programs Pill list */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">
                        Inisiatif Unggulan Lingkungan:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {pilot.keyPrograms.map((prog, prIdx) => (
                          <span
                            key={prIdx}
                            className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200"
                          >
                            ✓ {prog}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <a
                    href="https://wa.me/62812777000?text=Halo%20Islamicity%20Academy,%20saya%20tertarik%20melakukan%20studi%20tiru%20ke%20wilayah%20percontohan"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Ajukan Studi Tiru / Kunjungan Lapangan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: SOP & DOKUMEN LEGAL SIAP PAKAI ================= */}
      {activeTab === "sop-templates" && (
        <div className="space-y-6">
          <div className="bg-emerald-50/80 p-5 rounded-3xl border border-emerald-200 space-y-2">
            <h3 className="font-bold text-emerald-950 font-serif text-lg">
              Koleksi Template SOP & Dokumen Legal RT/RW Berdaya
            </h3>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Unduh draf standar operasional prosedur, draft akad syariah, dan SK pengurus yang siap diedit untuk diterapkan langsung di musyawarah warga Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Draf AD/ART Unit Baitul Maal Kasih Sayang RT/RW",
                category: "Keuangan Syariah",
                desc: "Panduan aturan main penyaluran pinjaman kebajikan Qardhul Hasan (0% bunga) dan pengelolaan ZISWAF lingkungan.",
                pages: "8 Halaman Draf",
                fileType: "DOCX & PDF",
              },
              {
                title: "Format Buku Kas Digital RT Transparan (Excel / Sheet)",
                category: "Tata Kelola",
                desc: "Template pembukuan keuangan iuran warga, bukti transaksi, dan dashboard link pelaporan otomatis ke WhatsApp grup.",
                pages: "Template Siap Pakai",
                fileType: "XLSX Spreadsheet",
              },
              {
                title: "SOP Pembentukan Lumbung Pangan & Kios Sembako Syirkah",
                category: "Koperasi Hijau",
                desc: "Langkah terpadu penggalangan modal patungan warga dan mekanisme distribusi beras/minyak murah bersubsidi.",
                pages: "12 Halaman SOP",
                fileType: "PDF Panduan",
              },
              {
                title: "Manual Budidaya Maggot BSF & Biopond Komunal Tingkat RT",
                category: "Ekologi & Pangan",
                desc: "Petunjuk teknis pengembangbiakan larva BSF dari sisa makanan dapur, pencegahan bau, dan pemanenan pakan ikan lele.",
                pages: "15 Halaman Bergambar",
                fileType: "PDF Blueprint",
              },
              {
                title: "Template Piagam Deklarasi 'RT/RW Bebas Riba & Rentenir'",
                category: "Sosial & Advokasi",
                desc: "Naskah deklarasi komitmen bersama pengurus warga, spanduk penolakan bank keliling/pinjol, dan hotline pendampingan.",
                pages: "Draf Naskah & Banner",
                fileType: "DOCX & AI Template",
              },
              {
                title: "Format Sensus Kerentanan Sosial & Database Korban PHK",
                category: "Solidaritas Ta'awun",
                desc: "Formulir pendataan presisi kondisi ekonomi keluarga tanpa mempermalukan martabat mustahik.",
                pages: "Formulir Digital & Cetak",
                fileType: "Google Forms / PDF",
              }
            ].map((doc, dIdx) => (
              <div
                key={dIdx}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-400 shadow-xs hover:shadow transition-all flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {doc.category}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm font-serif">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {doc.desc}
                  </p>
                  <span className="text-[11px] text-slate-400 font-medium block pt-1">
                    Format: {doc.fileType} • {doc.pages}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const text = `📥 UNDUH DOKUMEN: ${doc.title}\nKategori: ${doc.category}\nFormat: ${doc.fileType}\n\nDokumen resmi dari Islamicity Academy: https://global.islamicity.tv`;
                    navigator.clipboard.writeText(text);
                    alert(`Link dokumen "${doc.title}" berhasil disalin ke clipboard! Silakan tempel di browser atau bagikan ke pengurus RT.`);
                  }}
                  className="p-3 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 transition-colors shrink-0 cursor-pointer"
                  title="Unduh Dokumen"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL: MATERI SESI PEMBELAJARAN ================= */}
      {selectedModule && activeLesson && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                  Modul {selectedModule.moduleNumber} • {selectedModule.pillar}
                </span>
                <h3 className="font-bold text-slate-900 text-lg font-serif mt-1">
                  {activeLesson.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedModule(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lesson Navigation Pill */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {selectedModule.lessons.map((les, idx) => (
                <button
                  key={les.id}
                  type="button"
                  onClick={() => setActiveLesson(les)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    activeLesson.id === les.id
                      ? "bg-emerald-800 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Sesi {idx + 1}
                </button>
              ))}
            </div>

            {/* Lesson Body */}
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <strong className="text-emerald-950 text-xs block">Ringkasan Konsep:</strong>
                <p className="text-slate-700 leading-relaxed">{activeLesson.summary}</p>
              </div>

              <div className="space-y-2">
                <strong className="text-slate-900 font-bold uppercase text-[11px] block">
                  Poin Kunci & Prinsip Syariah:
                </strong>
                <ul className="space-y-1.5">
                  {activeLesson.keyPoints.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                <strong className="text-amber-950 text-xs flex items-center gap-1.5">
                  <Target className="w-4 h-4" />
                  SOP Aksi Nyata RT/RW (Tindakan Lapangan):
                </strong>
                <p className="text-slate-800 font-medium">{activeLesson.actionItemSOP}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">
                Durasi: {activeLesson.duration}
              </span>

              <button
                type="button"
                onClick={() => {
                  setQuizModalModule(selectedModule);
                  setSelectedModule(null);
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                  setQuizScore(0);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Uji Pemahaman di Kuis Modul</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: KUIS PEMAHAMAN MODUL ================= */}
      {quizModalModule && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                  Kuis Pemahaman Kader • Modul {quizModalModule.moduleNumber}
                </span>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg font-serif mt-0.5">
                  {quizModalModule.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQuizModalModule(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {quizSubmitted ? (
              /* Quiz Result Screen */
              <div className="py-4 space-y-4 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-inner ${
                  quizScore >= 70 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                }`}>
                  {quizScore >= 70 ? <CheckCircle2 className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-xl font-serif">
                    {quizScore >= 70 ? "Alhamdulillah, Anda Lulus!" : "Perlu Mengulang Materi"}
                  </h4>
                  <p className="text-xs text-slate-600">
                    Skor Pemahaman: <strong className="text-base text-slate-900">{quizScore}%</strong> (Standar Kelulusan: 70%)
                  </p>
                </div>

                {quizScore >= 70 && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 text-xs text-emerald-950 space-y-1">
                    <strong className="block text-emerald-900">🎓 Lencana & Poin Berhasil Diperoleh!</strong>
                    <span>+{quizModalModule.pointsReward} Poin Berdaya telah ditambahkan ke profil Anda. Lencana: <strong>{quizModalModule.badgeEarned}</strong></span>
                  </div>
                )}

                <div className="space-y-3 text-left pt-2">
                  <strong className="text-xs text-slate-700 font-bold uppercase block">
                    Pembahasan Soal:
                  </strong>
                  {quizModalModule.quizQuestions.map((q, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <p className="font-semibold text-slate-900">{idx + 1}. {q.question}</p>
                      <span className="text-[11px] text-emerald-800 font-bold block">
                        ✓ Kunci Jawaban: {q.options[q.correctIndex]}
                      </span>
                      <p className="text-[11px] text-slate-500 italic">{q.explanation}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => setQuizModalModule(null)}
                    className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    Tutup & Lanjutkan Pembelajaran
                  </button>
                </div>
              </div>
            ) : (
              /* Quiz Questions Form */
              <form onSubmit={handleSubmitQuiz} className="space-y-5 text-xs">
                {quizModalModule.quizQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <p className="font-bold text-slate-900 text-xs sm:text-sm">
                      {qIdx + 1}. {q.question}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      {q.options.map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-colors ${
                            quizAnswers[qIdx] === optIdx
                              ? "bg-emerald-100/90 border-emerald-500 text-emerald-950 font-bold"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${qIdx}`}
                            checked={quizAnswers[qIdx] === optIdx}
                            onChange={() =>
                              setQuizAnswers((prev) => ({
                                ...prev,
                                [qIdx]: optIdx,
                              }))
                            }
                            className="text-emerald-700 focus:ring-emerald-500"
                            required
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  Kirim Jawaban Kuis
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: DAFTARKAN WILAYAH BINAAN ================= */}
      {isRegisterPilotOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                  Pendaftaran Pilot Project Binaan
                </span>
                <h3 className="font-bold text-slate-900 text-lg font-serif mt-0.5">
                  Daftarkan RT, RW, atau Kelurahan Anda
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsRegisterPilotOpen(false);
                  setRegSuccess(false);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {regSuccess ? (
              <div className="py-6 space-y-4 text-center">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg font-serif">
                  Pendaftaran Wilayah Berhasil Diterima!
                </h4>
                <p className="text-xs text-slate-600">
                  Tim Fasilitator Islamicity Academy akan segera menghubungi Anda melalui WhatsApp untuk jadwal verifikasi, pendampingan SOP, dan pengiriman starter kit Baitul Maal.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterPilotOpen(false);
                    setRegSuccess(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setRegSuccess(true);
                  awardPoints(
                    75,
                    `Pendaftaran Wilayah: ${regTerritory}`,
                    "Dakwah & Syiar",
                    `Mendaftarkan inisiatif wilayah binaan baru tingkat ${regLevel}.`
                  );
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Ketua / Penggerak:
                  </label>
                  <input
                    type="text"
                    value={regLeaderName}
                    onChange={(e) => setRegLeaderName(e.target.value)}
                    placeholder="Nama Lengkap & Gelar / Amanah"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Tingkat Wilayah:
                    </label>
                    <select
                      value={regLevel}
                      onChange={(e) => setRegLevel(e.target.value as TerritoryLevel)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-emerald-500"
                    >
                      <option value="RT">Rukun Tetangga (RT)</option>
                      <option value="RW">Rukun Warga (RW)</option>
                      <option value="Kelurahan">Kelurahan / Desa</option>
                      <option value="Kecamatan">Kecamatan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nomor WhatsApp:
                    </label>
                    <input
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama & Lokasi Lengkap Wilayah:
                  </label>
                  <input
                    type="text"
                    value={regTerritory}
                    onChange={(e) => setRegTerritory(e.target.value)}
                    placeholder="Contoh: RT 02 / RW 06 Kel. Sukapura, Kec. Kiaracondong, Bandung"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kondisi & Harapan Wilayah (Opsional):
                  </label>
                  <textarea
                    rows={3}
                    value={regNotes}
                    onChange={(e) => setRegNotes(e.target.value)}
                    placeholder="Ceritakan permasalahan yang paling mendesak di lingkungan Anda..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:border-emerald-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    Kirim Formulir Pendaftaran Binaan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
