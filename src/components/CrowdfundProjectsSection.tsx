import React, { useState } from "react";
import {
  Heart,
  Zap,
  Coins,
  TrendingUp,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Clock,
  Wallet,
  PlusCircle,
  Copy,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";
import { CrowdfundProject } from "../types";
import { useEmpowerment } from "../context/EmpowermentContext";

interface CrowdfundProjectsSectionProps {
  projects: CrowdfundProject[];
  onInvestProject?: (projectId: string, amount: number) => void;
  onInstantDonate?: (projectId: string, amount: number) => void;
  onNavigateToFinance?: () => void;
}

interface GratitudeData {
  projectTitle: string;
  amount: number;
  remainingBalance: number;
  pointsEarned: number;
  receiptNumber: string;
  timestamp: string;
}

const INSTANT_DONATION_PRESETS = [
  { amount: 10000, label: "Rp 10.000", points: 50 },
  { amount: 25000, label: "Rp 25.000", points: 75, popular: true },
  { amount: 50000, label: "Rp 50.000", points: 120 },
  { amount: 100000, label: "Rp 100.000", points: 200 },
];

export const CrowdfundProjectsSection: React.FC<CrowdfundProjectsSectionProps> = ({
  projects,
  onInvestProject,
  onInstantDonate,
  onNavigateToFinance,
}) => {
  const { simulatedBalance, deductBalance, topUpBalance, awardPoints } = useEmpowerment();

  // Local state for interactive project lists to allow live updates
  const [projectList, setProjectList] = useState<CrowdfundProject[]>(projects);
  const [selectedProjectForDonate, setSelectedProjectForDonate] = useState<CrowdfundProject | null>(null);
  const [donationAmount, setDonationAmount] = useState<number>(25000);
  const [customDonationInput, setCustomDonationInput] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [gratitudeModalData, setGratitudeModalData] = useState<GratitudeData | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState<boolean>(false);
  const [topUpAlert, setTopUpAlert] = useState<boolean>(false);

  // Sync with prop updates
  React.useEffect(() => {
    setProjectList(projects);
  }, [projects]);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Play peaceful Islamic chime via Web Audio API
  const playSyukurChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Harmonic chords (G4, B4, D5, G5)
      const freqs = [392.0, 493.88, 587.33, 783.99];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);

        gain.gain.setValueAtTime(0, now + idx * 0.14);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.14 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.14 + 1.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 1.5);
      });
    } catch (e) {
      console.log("Audio chime error:", e);
    }
  };

  // Handle Quick 1-Tap Sedekah Instan (Direct Default Rp 25.000)
  const handleQuickInstantDonate = (proj: CrowdfundProject, amountToDonate: number = 25000) => {
    if (simulatedBalance < amountToDonate) {
      setSelectedProjectForDonate(proj);
      setTopUpAlert(true);
      return;
    }

    const success = deductBalance(amountToDonate);
    if (!success) {
      setTopUpAlert(true);
      return;
    }

    // Update project locally and trigger callbacks
    setProjectList((prev) =>
      prev.map((p) => {
        if (p.id === proj.id) {
          const updatedAmount = p.currentAmount + amountToDonate;
          return {
            ...p,
            currentAmount: updatedAmount,
            investorsCount: p.investorsCount + 1,
            isFunded: updatedAmount >= p.targetAmount,
          };
        }
        return p;
      })
    );

    if (onInstantDonate) {
      onInstantDonate(proj.id, amountToDonate);
    }

    const points = amountToDonate >= 100000 ? 200 : amountToDonate >= 50000 ? 120 : amountToDonate >= 25000 ? 75 : 50;

    // Award points
    awardPoints(
      points,
      `Sedekah Instan: ${proj.title.slice(0, 30)}...`,
      "Infaq & Sedekah",
      `Sedekah instan ${formatIDR(amountToDonate)} disalurkan langsung ke proyek crowdfunding: ${proj.title}.`,
      "baitul-maal-supporter"
    );

    // Trigger celebration effects
    playSyukurChime();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#10b981", "#34d399", "#fbbf24", "#065f46"],
    });

    const now = new Date();
    const dateStr = now.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

    setGratitudeModalData({
      projectTitle: proj.title,
      amount: amountToDonate,
      remainingBalance: simulatedBalance - amountToDonate,
      pointsEarned: points,
      receiptNumber: `SI-CF-${Date.now().toString().slice(-6)}`,
      timestamp: `${dateStr}, ${timeStr}`,
    });
  };

  // Submit Donation from Modal
  const handleModalDonateSubmit = () => {
    if (!selectedProjectForDonate) return;

    const finalAmount = customDonationInput
      ? parseInt(customDonationInput, 10) || donationAmount
      : donationAmount;

    if (finalAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      handleQuickInstantDonate(selectedProjectForDonate, finalAmount);
      setIsProcessing(false);
      setSelectedProjectForDonate(null);
      setCustomDonationInput("");
    }, 400);
  };

  const handleCopyReceipt = () => {
    if (!gratitudeModalData) return;
    const text = `TANDA TERIMA RESMI SEDEKAH INSTAN ISLAMICITY\nNo. Resi: ${gratitudeModalData.receiptNumber}\nProyek: ${gratitudeModalData.projectTitle}\nNominal: ${formatIDR(gratitudeModalData.amount)}\nWaktu: ${gratitudeModalData.timestamp}\nStatus: Berhasil Terpotong & Tersalurkan.`;
    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  return (
    <div id="crowdfunding-dashboard-section" className="space-y-6">
      {/* Header Banner & Live Balance Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Crowdfunding Usaha Jamaah • 100% Bebas Riba</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight leading-tight">
              Dukung Proyek Usaha Korban PHK & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200">
                Tunaikan 'Sedekah Instan' Langsung Berkah
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Pilih proyek wirausaha mandiri binaan alumni PHK. Dukung permodalan mereka melalui investasi bagi hasil Musyarakah atau klik{" "}
              <strong className="text-amber-300">⚡ Sedekah Instan</strong> untuk menyalurkan infaq langsung dari saldo dompet Anda dengan ucapan syukur seketika.
            </p>
          </div>

          {/* User Simulated Balance Card */}
          <div className="bg-slate-950/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-emerald-700/60 shadow-lg shrink-0 flex flex-col justify-between gap-3 min-w-[260px]">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-300">
                <Wallet className="w-4 h-4 text-amber-400" />
                <span>Saldo Dompet Berkah Anda</span>
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-800">
                Simulasi
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-amber-300 font-serif">
              {formatIDR(simulatedBalance)}
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">Siap untuk sedekah 1-klik</span>
              <button
                onClick={() => {
                  topUpBalance(500000);
                  confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
                }}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors bg-emerald-900/40 px-2.5 py-1 rounded-lg border border-emerald-700/50"
                title="Isi ulang saldo simulasi +Rp 500.000"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
                <span>+ Isi Rp 500rb</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Crowdfunding Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projectList.map((proj) => {
          const progressPct = Math.min(100, Math.round((proj.currentAmount / proj.targetAmount) * 100));

          return (
            <div
              key={proj.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="h-48 w-full bg-slate-800 relative overflow-hidden">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>

                  <span className="absolute top-3 left-3 bg-emerald-950/90 backdrop-blur-xs text-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-700/50 shadow">
                    {proj.category}
                  </span>

                  {proj.isFunded ? (
                    <span className="absolute top-3 right-3 bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Tercapai 100%</span>
                    </span>
                  ) : (
                    <span className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow">
                      {progressPct}% Terhimpun
                    </span>
                  )}

                  {/* Initiator tag on bottom of image */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-[11px] text-emerald-200/90 truncate font-medium">
                    👤 {proj.initiator}
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 space-y-4">
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-2 font-serif">
                    {proj.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="text-slate-500 font-medium">Terkumpul:</span>
                      <span className="font-extrabold text-emerald-800 text-sm">
                        {formatIDR(proj.currentAmount)}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
                        style={{ width: `${progressPct}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Target: {formatIDR(proj.targetAmount)}</span>
                      <span className="font-bold text-slate-700">{proj.investorsCount} Donatur / Investor</span>
                    </div>
                  </div>

                  {/* Green Impact snippet */}
                  <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200/70 text-[11px] text-emerald-900 flex items-start gap-2">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{proj.greenImpact}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="p-5 pt-0 space-y-2.5">
                {/* PRIMARY FEATURE: Tombol Sedekah Instan (Langsung Memotong Saldo Simulasi) */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuickInstantDonate(proj, 25000)}
                    className="flex-1 py-3 px-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-95 group/btn"
                    title="Sedekah langsung Rp 25.000 dari saldo Anda dengan 1-klik"
                  >
                    <Zap className="w-4 h-4 fill-slate-950 text-slate-950 group-hover/btn:animate-bounce" />
                    <span>Sedekah Instan</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 font-extrabold">
                      Rp 25.000
                    </span>
                  </button>

                  {/* Settings / Custom Amount Button */}
                  <button
                    onClick={() => setSelectedProjectForDonate(proj)}
                    className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-colors cursor-pointer"
                    title="Pilih nominal sedekah lain"
                  >
                    <Heart className="w-4 h-4 fill-amber-500 text-amber-600" />
                  </button>
                </div>

                {/* Secondary Button: Detail & Investasi Syariah */}
                <button
                  onClick={() => {
                    if (onNavigateToFinance) {
                      onNavigateToFinance();
                    } else {
                      setSelectedProjectForDonate(proj);
                    }
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                >
                  <Coins className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Danai Modal Musyarakah (Bagi Hasil)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Custom Amount Sedekah Instan */}
      {selectedProjectForDonate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 text-slate-900">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider">
                  ⚡ Sedekah Instan Proyek Umat
                </span>
                <h4 className="font-extrabold text-base text-slate-900 font-serif mt-1">
                  {selectedProjectForDonate.title}
                </h4>
              </div>
              <button
                onClick={() => {
                  setSelectedProjectForDonate(null);
                  setTopUpAlert(false);
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Balance Display */}
            <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Saldo Dompet Berkah Anda</div>
                <div className="text-lg font-black text-amber-300 font-serif">{formatIDR(simulatedBalance)}</div>
              </div>
              <button
                type="button"
                onClick={() => topUpBalance(500000)}
                className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
              >
                + Isi Rp 500rb
              </button>
            </div>

            {topUpAlert && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                ⚠️ Saldo Anda tidak mencukupi untuk nominal ini. Silakan klik tombol <strong>+ Isi Rp 500rb</strong> di atas untuk menambah saldo simulasi.
              </div>
            )}

            {/* Preset Amount Chips */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Pilih Nominal Sedekah:</label>
              <div className="grid grid-cols-2 gap-2">
                {INSTANT_DONATION_PRESETS.map((preset) => (
                  <button
                    key={preset.amount}
                    type="button"
                    onClick={() => {
                      setDonationAmount(preset.amount);
                      setCustomDonationInput("");
                      setTopUpAlert(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      !customDonationInput && donationAmount === preset.amount
                        ? "bg-amber-50 border-amber-400 ring-2 ring-amber-300/40 font-bold text-slate-900"
                        : "bg-white border-slate-200 text-slate-700 hover:border-amber-200"
                    }`}
                  >
                    <div className="text-sm font-extrabold">{preset.label}</div>
                    <div className="text-[10px] text-emerald-700 font-medium">+{preset.points} Poin Berdaya</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Atau Masukkan Nominal Kustom (Rp):</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                <input
                  type="number"
                  placeholder="Contoh: 35000"
                  value={customDonationInput}
                  onChange={(e) => {
                    setCustomDonationInput(e.target.value);
                    setTopUpAlert(false);
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:border-amber-500 text-sm font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Submission CTA */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleModalDonateSubmit}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>
                  {isProcessing
                    ? "Memotong Saldo..."
                    : `Tunaikan Sedekah (${formatIDR(
                        customDonationInput ? parseInt(customDonationInput, 10) || donationAmount : donationAmount
                      )})`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedProjectForDonate(null)}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL ANIMASI UCAPAN SYUKUR ================= */}
      {gratitudeModalData && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-amber-400 shadow-2xl text-center space-y-5 animate-in zoom-in-95 text-white overflow-hidden">
            {/* Background ambient decorative rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Animated Gratitude Icon (Praying hands / heart with glowing pulse) */}
            <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-emerald-400 to-amber-300 p-0.5 shadow-2xl flex items-center justify-center animate-bounce">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-3xl">
                🤲
              </div>
              <span className="absolute -inset-2 rounded-full border-2 border-amber-300/40 animate-ping"></span>
            </div>

            {/* Arabic Calligraphy Gratitude */}
            <div className="space-y-1">
              <div className="text-xl sm:text-2xl font-serif text-amber-300 leading-relaxed font-bold tracking-wide">
                الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
              </div>
              <div className="text-sm sm:text-base font-serif text-emerald-200 font-semibold italic">
                "Jazakumullahu Khairan Katsiran"
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-serif text-white pt-1">
                Sedekah Instan Berhasil Tertunaikan!
              </h3>
            </div>

            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-600/50 text-left space-y-2 text-xs shadow-inner">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span>Bukti Resi Digital:</span>
                <span className="font-mono font-bold text-amber-300">{gratitudeModalData.receiptNumber}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Nominal Sedekah:</span>
                <span className="font-black text-amber-300 text-base">{formatIDR(gratitudeModalData.amount)}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Proyek Penerima:</span>
                <span className="font-bold text-white max-w-[200px] truncate text-right">
                  {gratitudeModalData.projectTitle}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800">
                <span className="text-slate-400">Sisa Saldo Dompet Anda:</span>
                <span className="font-mono text-emerald-300 font-bold">
                  {formatIDR(gratitudeModalData.remainingBalance)}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs text-amber-300 font-bold pt-1">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Poin Berdaya Ditambahkan:</span>
                </span>
                <span>+{gratitudeModalData.pointsEarned} Poin</span>
              </div>
            </div>

            {/* Hadith Reflection */}
            <p className="text-xs text-emerald-100/90 italic leading-relaxed px-2">
              "Sedekah itu tidak akan mengurangi harta, dan tidak ada orang yang memberi maaf melainkan Allah akan menambah kemuliaannya." (HR. Muslim no. 2588)
            </p>

            {/* Modal Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopyReceipt}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              >
                {copiedReceipt ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Tanda Terima Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Resi Digital</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setGratitudeModalData(null)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm cursor-pointer shadow-lg transition-transform active:scale-95"
              >
                Alhamdulillah, Aamiin 🤲
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
