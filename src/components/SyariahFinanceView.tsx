import React, { useState } from "react";
import {
  Coins,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  PlusCircle,
  TrendingUp,
  Award,
  ArrowRight,
  Leaf,
  Users,
  Calculator,
  Building2,
  DollarSign,
  BookOpen,
  HelpCircle,
  Sparkles,
  Info,
  Scale,
  Repeat,
  Zap,
  Heart,
  Wallet,
} from "lucide-react";
import confetti from "canvas-confetti";
import { QardhulHasanApplication, CrowdfundProject } from "../types";
import { LearnQardhulHasanModal } from "./LearnQardhulHasanModal";
import { FiqihChatbot } from "./FiqihChatbot";
import { AutodebetSedekahSection } from "./AutodebetSedekahSection";
import { useEmpowerment } from "../context/EmpowermentContext";

interface SyariahFinanceViewProps {
  applications: QardhulHasanApplication[];
  onOpenApplyModal: () => void;
  crowdfundProjects: CrowdfundProject[];
  onInvestProject: (projectId: string, amount: number) => void;
}

export const SyariahFinanceView: React.FC<SyariahFinanceViewProps> = ({
  applications,
  onOpenApplyModal,
  crowdfundProjects,
  onInvestProject,
}) => {
  const { simulatedBalance, deductBalance, awardPoints } = useEmpowerment();
  const [subTab, setSubTab] = useState<
    "qardhul-hasan" | "crowdfund" | "autodebet-sedekah" | "zakat-calc" | "fiqih-bot"
  >("qardhul-hasan");
  const [instantDonateSuccess, setInstantDonateSuccess] = useState<{
    projectTitle: string;
    amount: number;
    remainingBalance: number;
    receiptNo: string;
  } | null>(null);

  const handleInstantSedekahInFinance = (proj: CrowdfundProject, amount: number = 25000) => {
    if (simulatedBalance < amount) {
      alert(`Saldo dompet berkah Anda (${formatRupiah(simulatedBalance)}) tidak mencukupi untuk sedekah instan ini.`);
      return;
    }
    const success = deductBalance(amount);
    if (!success) return;

    onInvestProject(proj.id, amount);
    awardPoints(
      75,
      `Sedekah Instan: ${proj.title.slice(0, 30)}...`,
      "Infaq & Sedekah",
      `Sedekah instan Rp 25.000 pada proyek ${proj.title}.`,
      "baitul-maal-supporter"
    );

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#10b981", "#34d399", "#fbbf24"],
    });

    setInstantDonateSuccess({
      projectTitle: proj.title,
      amount,
      remainingBalance: simulatedBalance - amount,
      receiptNo: `SI-SF-${Date.now().toString().slice(-6)}`,
    });
  };
  const [isLearnModalOpen, setIsLearnModalOpen] = useState(false);
  const [searchApp, setSearchApp] = useState("");
  const [selectedProject, setSelectedProject] = useState<CrowdfundProject | null>(
    null
  );
  const [investAmount, setInvestAmount] = useState<number>(1000000);
  const [investSuccess, setInvestSuccess] = useState(false);

  // Zakat Calculator state
  const [goldPrice, setGoldPrice] = useState<number>(1350000); // Rp per gram
  const [cashSavings, setCashSavings] = useState<number>(50000000);
  const [businessAssets, setBusinessAssets] = useState<number>(30000000);
  const [shortTermDebt, setShortTermDebt] = useState<number>(10000000);

  // Nisab = 85 gram emas
  const nisabThreshold = 85 * goldPrice;
  const totalNetWealth = Math.max(0, cashSavings + businessAssets - shortTermDebt);
  const isZakatObligatory = totalNetWealth >= nisabThreshold;
  const zakatDue = isZakatObligatory ? totalNetWealth * 0.025 : 0;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleInvestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    onInvestProject(selectedProject.id, investAmount);
    setInvestSuccess(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      setInvestSuccess(false);
      setSelectedProject(null);
    }, 2000);
  };

  const filteredApps = applications.filter(
    (app) =>
      app.name.toLowerCase().includes(searchApp.toLowerCase()) ||
      app.businessPlanTitle.toLowerCase().includes(searchApp.toLowerCase()) ||
      app.formerCompany.toLowerCase().includes(searchApp.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-800 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Ekosistem Keuangan Syariah Bebas Riba 100%</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-white">
          Permodalan Berkah & Finansial Umat
        </h1>
        <p className="text-emerald-100/90 text-sm sm:text-base max-w-3xl leading-relaxed">
          Menghubungkan korban PHK dan pengusaha mandiri dengan dana talangan
          Qardhul Hasan (tanpa bunga), Micro-Wakaf Produktif, dan Crowdfunding
          Musyarakah yang diawasi Dewan Syariah.
        </p>

        {/* Sub Navigation */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setSubTab("qardhul-hasan")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              subTab === "qardhul-hasan"
                ? "bg-amber-400 text-emerald-950 shadow-md font-bold"
                : "bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800"
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>1. Dana Bergulir Qardhul Hasan</span>
          </button>

          <button
            onClick={() => setSubTab("crowdfund")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              subTab === "crowdfund"
                ? "bg-amber-400 text-emerald-950 shadow-md font-bold"
                : "bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. Crowdfunding Usaha Jamaah</span>
          </button>

          <button
            onClick={() => setSubTab("autodebet-sedekah")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              subTab === "autodebet-sedekah"
                ? "bg-amber-400 text-emerald-950 shadow-md font-bold"
                : "bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800"
            }`}
          >
            <Repeat className="w-4 h-4 text-amber-300" />
            <span>3. Autodebet Sedekah</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-amber-300 font-extrabold">
              Baru
            </span>
          </button>

          <button
            onClick={() => setSubTab("zakat-calc")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              subTab === "zakat-calc"
                ? "bg-amber-400 text-emerald-950 shadow-md font-bold"
                : "bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>4. Kalkulator Zakat & Wakaf</span>
          </button>

          <button
            onClick={() => setSubTab("fiqih-bot")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer relative ${
              subTab === "fiqih-bot"
                ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-lg font-extrabold"
                : "bg-emerald-800/80 text-emerald-200 hover:bg-emerald-700 border border-emerald-600/50"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>5. Tanya AI Fiqih Muamalah</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/40 text-amber-300 font-bold border border-amber-300/30">
              AI
            </span>
          </button>
        </div>
      </div>

      {/* ================= SUBTAB 1: QARDHUL HASAN ================= */}
      {subTab === "qardhul-hasan" && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Total Dana Qardh Tersedia
                </span>
                <div className="text-xl font-bold text-slate-900">
                  Rp 1.450.000.000
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  Dari Wakif & ZISWAF Jamaah
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-teal-50 text-teal-700 rounded-xl">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Bunga / Tambahan Biaya
                </span>
                <div className="text-xl font-bold text-emerald-700">
                  0% (Murni Kebajikan)
                </div>
                <span className="text-[11px] text-slate-500">
                  Hanya pengembalian pokok
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Pengajuan Disetujui
                </span>
                <div className="text-xl font-bold text-slate-900">
                  {applications.length + 85} Berkas
                </div>
                <span className="text-[11px] text-amber-700 font-semibold">
                  98.4% Tingkat Pengembalian Lancar
                </span>
              </div>
            </div>
          </div>

          {/* Action Header */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Daftar Permohonan Dana Qardhul Hasan
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Transparan, amanah, dan dapat dipantau langsung oleh jamaah
                wakif dan penerima manfaat.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setSubTab("fiqih-bot")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>Tanya AI Fiqih</span>
              </button>

              <button
                onClick={() => setIsLearnModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
              >
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>Pelajari Prinsip Qardhul Hasan</span>
              </button>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Cari nama / usaha / asal pabrik..."
                  value={searchApp}
                  onChange={(e) => setSearchApp(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 w-56 sm:w-64"
                />
              </div>

              <button
                onClick={onOpenApplyModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Ajukan Modal 0% Bunga</span>
              </button>
            </div>
          </div>

          {/* AI Fiqih Banner Prompt */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-emerald-700/60 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>Ragu dengan Syarat Akad atau Kelayakan Zakat Korban PHK?</span>
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30 font-semibold">
                    AI Fiqih Assistant
                  </span>
                </h4>
                <p className="text-xs text-emerald-200/90 mt-0.5">
                  Konsultasikan hukum pinjaman tanpa bunga, status penerima zakat (Asnaf), dan pembersihan riba berbasis Al-Quran.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSubTab("fiqih-bot")}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs transition-all cursor-pointer shadow-md whitespace-nowrap self-stretch sm:self-auto text-center"
            >
              Mulai Tanya Ustadz AI
            </button>
          </div>

          {/* Application Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {app.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.status === "Tersalurkan"
                          ? "bg-emerald-100 text-emerald-800"
                          : app.status === "Disetujui"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {app.businessPlanTitle}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      Pemohon: {app.name}
                    </p>
                    <p className="text-[11px] text-slate-400 italic">
                      Ex: {app.formerCompany}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Plafon Modal:</span>
                      <span className="font-bold text-emerald-700">
                        {formatRupiah(app.amountRequested)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tenor Pengembalian:</span>
                      <span className="font-semibold text-slate-700">
                        {app.repaymentPeriodMonths} Bulan
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cicilan Pokok:</span>
                      <span className="font-semibold text-slate-900">
                        {formatRupiah(app.monthlyRepaymentAbility)}/bln
                      </span>
                    </div>
                  </div>

                  {app.notes && (
                    <p className="text-[11px] text-slate-600 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                      💡 {app.notes}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Diajukan: {app.submittedAt}</span>
                  {app.isGreenCertified && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      <Leaf className="w-3 h-3 text-emerald-600" />
                      Green Eco
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SUBTAB 2: CROWDFUNDING JAMAAH ================= */}
      {subTab === "crowdfund" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Proyek Usaha Berjamaah Siap Danai
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Pemberdayaan terstruktur alumni PHK dengan bagi hasil keuntungan
                adil dan transparan (Nisbah Musyarakah).
              </p>
            </div>
            <div className="text-xs text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 font-medium">
              ⚖️ Semua proyek diawasi Dewan Pengawas Syariah & Terverifikasi Lapangan
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {crowdfundProjects.map((proj) => {
              const progressPct = Math.min(
                100,
                Math.round((proj.currentAmount / proj.targetAmount) * 100)
              );
              return (
                <div
                  key={proj.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Image / Category Banner */}
                    <div className="h-44 w-full bg-slate-800 relative overflow-hidden">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                      <span className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-sm text-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-700/50">
                        {proj.category}
                      </span>
                      {proj.isFunded && (
                        <span className="absolute top-3 right-3 bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow">
                          Tercapai 100%
                        </span>
                      )}
                    </div>

                    <div className="p-5 space-y-3.5">
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Inisiator: {proj.initiator}
                      </p>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {proj.description}
                      </p>

                      {/* Green Aspect */}
                      <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 flex items-start gap-2">
                        <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{proj.greenImpact}</span>
                      </div>

                      {/* Funding Progress Bar */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-600">
                            Terkumpul: {formatRupiah(proj.currentAmount)}
                          </span>
                          <span className="text-emerald-700 font-bold">
                            {progressPct}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>Target: {formatRupiah(proj.targetAmount)}</span>
                          <span>{proj.investorsCount} Pemodal Jamaah</span>
                        </div>
                      </div>

                      {/* Nisbah Info */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="text-slate-400 block">Nisbah:</span>
                          <strong className="text-slate-800">{proj.nisbah}</strong>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="text-slate-400 block">Bagi Hasil:</span>
                          <strong className="text-slate-800">
                            {proj.returnPeriod}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleInstantSedekahInFinance(proj, 25000)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer transform active:scale-95"
                        title="Sedekah langsung Rp 25.000 dengan 1-klik dari saldo Anda"
                      >
                        <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                        <span>Sedekah Instan (Rp 25.000)</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setSelectedProject(proj)}
                      disabled={proj.isFunded}
                      className={`w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                        proj.isFunded
                          ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                          : "bg-white hover:bg-slate-50 text-slate-700 border-slate-300"
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{proj.isFunded ? "Pendanaan Ditutup" : "Danai Musyarakah (Investasi)"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= SUBTAB: AUTODEBET SEDEKAH ================= */}
      {subTab === "autodebet-sedekah" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <AutodebetSedekahSection />
        </div>
      )}

      {/* ================= SUBTAB 3: ZAKAT & WAKAF CALCULATOR ================= */}
      {subTab === "zakat-calc" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Kalkulator Zakat Mal & Wakaf Produktif Umat
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Hitung kewajiban zakat mal dari harta simpanan dan keuntungan usaha
              untuk disalurkan menjadi modal kerja korban PHK.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Harga Emas Murni Saat Ini (per gram):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={goldPrice}
                    onChange={(e) => setGoldPrice(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 font-semibold text-sm focus:border-emerald-500"
                  />
                </div>
                <span className="text-[11px] text-slate-500">
                  Nisab (85 gram emas) = <strong>{formatRupiah(nisabThreshold)}</strong>
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Uang Tunai, Tabungan & Deposito yang Mengendap 1 Tahun (Haul):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={cashSavings}
                    onChange={(e) => setCashSavings(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 font-semibold text-sm focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nilai Aset Lancar Usaha / Saham / Piutang Lancar:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={businessAssets}
                    onChange={(e) => setBusinessAssets(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 font-semibold text-sm focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hutang Jatuh Tempo yang Harus Dibayar:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={shortTermDebt}
                    onChange={(e) => setShortTermDebt(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 font-semibold text-sm focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Zakat Result Summary */}
            <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Harta Bersih Wajib Zakat:
                </span>
                <div className="text-2xl font-bold text-slate-900">
                  {formatRupiah(totalNetWealth)}
                </div>
              </div>

              <div
                className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                  isZakatObligatory
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-amber-50 border-amber-200 text-amber-900"
                }`}
              >
                {isZakatObligatory ? (
                  <div>
                    <strong className="block text-sm font-bold text-emerald-950 mb-1">
                      ✅ Telah Mencapai Nisab ({formatRupiah(nisabThreshold)})
                    </strong>
                    Kewajiban Zakat Mal Anda adalah <strong>2,5%</strong> dari
                    total harta bersih setelah haul 1 tahun.
                  </div>
                ) : (
                  <div>
                    <strong className="block text-sm font-bold text-amber-950 mb-1">
                      ℹ️ Belum Mencapai Nisab ({formatRupiah(nisabThreshold)})
                    </strong>
                    Anda belum wajib zakat mal, namun sangat dianjurkan untuk
                    berinfaq atau berwakaf produktif seikhlasnya.
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Estimasi Zakat Mal yang Wajib Dikeluarkan:
                </span>
                <div className="text-3xl font-extrabold text-emerald-700">
                  {formatRupiah(zakatDue)}
                </div>
                <p className="text-[11px] text-slate-500">
                  Zakat disalurkan kepada 8 asnaf, diprioritaskan bagi fakir
                  miskin dan mustahiq terdampak PHK yang siap berdaya.
                </p>
              </div>

              <button
                onClick={() =>
                  alert(
                    "Penyaluran Zakat/Wakaf dialihkan ke rekening amanah Baitul Maal Islamicity Global. Jazakumullahu khairan."
                  )
                }
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Salurkan ke Rekening Dana Qardhul Hasan & Asnaf PHK
              </button>

              <button
                onClick={() => setSubTab("fiqih-bot")}
                className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>Konsultasikan Hukum Zakat & Nisab ke AI Fiqih</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 4: FIQIH AI CHATBOT ================= */}
      {subTab === "fiqih-bot" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <FiqihChatbot
            onOpenApplyModal={onOpenApplyModal}
            onGoToCalculator={() => setSubTab("zakat-calc")}
          />
        </div>
      )}

      {/* Invest Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                  Investasi Musyarakah Jamaah
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {investSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">
                  Alhamdulillah, Investasi Berhasil!
                </h4>
                <p className="text-xs text-slate-600">
                  Penyertaan modal Anda telah dicatat dalam akad Musyarakah
                  digital. Semoga membawa keberkahan dan dividen halal.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInvestSubmit} className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-700 border border-slate-100">
                  <div className="flex justify-between">
                    <span>Nisbah Bagi Hasil:</span>
                    <strong className="text-emerald-800">
                      {selectedProject.nisbah}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Minimal Investasi:</span>
                    <strong>{formatRupiah(selectedProject.minInvestment)}</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nominal Investasi Anda:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">
                      Rp
                    </span>
                    <input
                      type="number"
                      step={100000}
                      min={selectedProject.minInvestment}
                      value={investAmount}
                      onChange={(e) => setInvestAmount(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 font-bold text-base focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {[500000, 1000000, 2500000, 5000000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setInvestAmount(amt)}
                        className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
                      >
                        {amt / 1000000} Juta
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  * Akad: Musyarakah / Mudharabah. Resiko usaha dan keuntungan
                  ditanggung bersama secara proporsional sesuai kaidah Fiqih
                  Muamalah (Al-ghurmu bil ghunmi).
                </p>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Setujui Akad & Danai Sekarang
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating 'Learn About Qardhul Hasan' Button */}
      <aside aria-label="Edukasi Qardhul Hasan" className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsLearnModalOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl border-2 border-emerald-400/40 hover:border-amber-300 transition-all transform hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-400/50"
          title="Pelajari prinsip pinjaman kebajikan tanpa bunga (0% riba) dan dampak sosialnya"
        >
          <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold shadow-sm shrink-0 group-hover:scale-110 transition-transform">
            <HeartHandshake className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="leading-tight text-white flex items-center gap-1 font-bold">
              <span>Pelajari Qardhul Hasan</span>
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            </span>
            <span className="text-[10px] text-emerald-200 font-normal hidden sm:inline leading-none mt-0.5">
              Prinsip 0% Riba & Dampak Sosial
            </span>
          </div>
        </button>
      </aside>

      {/* Learn About Qardhul Hasan Modal */}
      <LearnQardhulHasanModal
        isOpen={isLearnModalOpen}
        onClose={() => setIsLearnModalOpen(false)}
        onOpenApplyModal={onOpenApplyModal}
      />

      {/* Gratitude Modal for Instant Sadaqah */}
      {instantDonateSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-amber-400 shadow-2xl text-center space-y-4 animate-in zoom-in-95 text-white">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-3xl animate-bounce shadow-lg">
              🤲
            </div>
            <div className="space-y-1">
              <div className="text-xl font-serif text-amber-300 font-bold">
                الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
              </div>
              <div className="text-sm font-serif text-emerald-200 italic">
                "Jazakumullahu Khairan Katsiran"
              </div>
              <h4 className="text-lg font-black font-serif text-white pt-1">
                Sedekah Instan Berhasil Tertunaikan!
              </h4>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-700/60 text-left text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>No. Resi Digital:</span>
                <span className="font-mono text-amber-300 font-bold">{instantDonateSuccess.receiptNo}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span>Nominal:</span>
                <span className="text-amber-300 font-black">{formatRupiah(instantDonateSuccess.amount)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Proyek:</span>
                <span className="truncate max-w-[180px] font-semibold text-white">{instantDonateSuccess.projectTitle}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                <span>Sisa Saldo:</span>
                <span className="font-mono text-emerald-300 font-bold">{formatRupiah(instantDonateSuccess.remainingBalance)}</span>
              </div>
            </div>

            <button
              onClick={() => setInstantDonateSuccess(null)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-sm cursor-pointer shadow-lg hover:from-amber-300 hover:to-amber-400"
            >
              Alhamdulillah, Aamiin 🤲
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
