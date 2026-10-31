import React, { useState, useEffect } from "react";
import {
  QrCode,
  Heart,
  Sparkles,
  CheckCircle2,
  Copy,
  Download,
  Share2,
  RefreshCw,
  Coins,
  ShieldCheck,
  Building2,
  Utensils,
  Clock,
  ArrowRight,
  User,
  Phone,
  MessageSquare,
  Check,
  Flame,
  ExternalLink,
  ChevronDown,
  Info,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useEmpowerment } from "../context/EmpowermentContext";

interface QRISZakatInfaqSectionProps {
  onSuccessDonation?: (amount: number, program: string) => void;
}

type DonationCategory =
  | "infaq-phk"
  | "zakat-maal"
  | "sedekah-subuh"
  | "sembako-darurat"
  | "wakaf-tunai";

interface DonationProgram {
  id: DonationCategory;
  name: string;
  shortLabel: string;
  icon: string;
  badge: string;
  desc: string;
  targetFocus: string;
  defaultAmount: number;
  pointsReward: number;
}

const DONATION_PROGRAMS: DonationProgram[] = [
  {
    id: "infaq-phk",
    name: "Infaq Dana Talangan Qardhul Hasan (0% Riba)",
    shortLabel: "Infaq Qardhul Hasan",
    icon: "🤝",
    badge: "Paling Prioritas",
    desc: "100% dialokasikan untuk modal usaha bergulir tanpa bunga bagi saudara kita korban PHK & pencari kerja mandiri.",
    targetFocus: "Penyaluran Modal Kerja Bebas Riba",
    defaultAmount: 50000,
    pointsReward: 100,
  },
  {
    id: "zakat-maal",
    name: "Zakat Maal & Zakat Penghasilan / Profesi",
    shortLabel: "Zakat Maal (2.5%)",
    icon: "⚖️",
    badge: "Kewajiban Syar'i",
    desc: "Penyucian harta 2.5% yang disalurkan secara amanah kepada 8 Asnaf (Fakir, Miskin, Gharimin & Fisabilillah).",
    targetFocus: "Penyaluran 8 Asnaf Berdasarkan Fiqih",
    defaultAmount: 250000,
    pointsReward: 200,
  },
  {
    id: "sedekah-subuh",
    name: "Sedekah Subuh Kilat Baitul Maal",
    shortLabel: "Sedekah Subuh",
    icon: "🌅",
    badge: "Doa Malaikat Fajar",
    desc: "Raih doa para malaikat di waktu fajar untuk kelapangan rezeki dan keselamatan keluarga dunia akhirat.",
    targetFocus: "Operasional & Santunan Rutin Fajar",
    defaultAmount: 20000,
    pointsReward: 75,
  },
  {
    id: "sembako-darurat",
    name: "Dapur Halal & Paket Sembako Darurat",
    shortLabel: "Dapur Halal Darurat",
    icon: "🍲",
    badge: "Pangan Mustahiq",
    desc: "Suplai beras, telur, minyak kelapa, dan makanan siap saji higienis untuk keluarga pra-sejahtera binaan.",
    targetFocus: "Distribusi Pangan Sehat & Anti-Kelaparan",
    defaultAmount: 25000,
    pointsReward: 80,
  },
  {
    id: "wakaf-tunai",
    name: "Wakaf Tunai Produktif (Aset Abadi)",
    shortLabel: "Wakaf Produktif",
    icon: "🏛️",
    badge: "Pahala Jariyah",
    desc: "Investasi akhirat untuk pengadaan mesin produksi, solar dryer, dan sarana Koperasi Hijau berkelanjutan.",
    targetFocus: "Kapitalisasi Aset Abadi Umat",
    defaultAmount: 100000,
    pointsReward: 150,
  },
];

const PRESET_AMOUNTS = [
  { value: 10000, label: "Rp 10.000", tag: "Sedekah Berkah" },
  { value: 25000, label: "Rp 25.000", tag: "Paket Makan Halal" },
  { value: 50000, label: "Rp 50.000", tag: "Subsidi Pangan", popular: true },
  { value: 100000, label: "Rp 100.000", tag: "Pemberdayaan Umat" },
  { value: 250000, label: "Rp 250.000", tag: "Zakat / Modal Mikro" },
  { value: 500000, label: "Rp 500.000", tag: "Infaq Konsorsium" },
];

const QUICK_PRAYER_TEMPLATES = [
  "Bismillah, mohon keberkahan rezeki, kesehatan keluarga & dijauhkan dari hutang riba.",
  "Semoga saudara-saudara kita korban PHK lekas bangkit dan mendapat usaha mandiri yang berkah.",
  "Niat zakat/infaq lillahi ta'ala demi kemaslahatan umat dan perlindungan dari bala musibah.",
  "Pahala sedekah ini diniatkan untuk kedua orang tua kami tercinta fiddunya wal akhirah.",
];

const RECENT_LIVE_DONATIONS = [
  {
    name: "Hamba Allah (Kemayoran)",
    amount: 100000,
    program: "Infaq Qardhul Hasan",
    time: "1 menit lalu",
    icon: "🤝",
  },
  {
    name: "Ahmad Fauzi & Keluarga",
    amount: 250000,
    program: "Zakat Maal (2.5%)",
    time: "4 menit lalu",
    icon: "⚖️",
  },
  {
    name: "Siti Rahmah (Bandung)",
    amount: 50000,
    program: "Dapur Halal Darurat",
    time: "8 menit lalu",
    icon: "🍲",
  },
  {
    name: "M. Ridwan (Palembang)",
    amount: 20000,
    program: "Sedekah Subuh",
    time: "12 menit lalu",
    icon: "🌅",
  },
];

export const QRISZakatInfaqSection: React.FC<QRISZakatInfaqSectionProps> = ({
  onSuccessDonation,
}) => {
  const { userProfile, awardPoints } = useEmpowerment();

  // State
  const [selectedCategory, setSelectedCategory] = useState<DonationCategory>("infaq-phk");
  const [amount, setAmount] = useState<number>(50000);
  const [customAmountStr, setCustomAmountStr] = useState<string>("");
  const [isCustomAmount, setIsCustomAmount] = useState<boolean>(false);
  const [donorName, setDonorName] = useState<string>(userProfile?.name || "Hamba Allah");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [donorPhone, setDonorPhone] = useState<string>("");
  const [donorPrayer, setDonorPrayer] = useState<string>(
    "Bismillah, mohon keberkahan rezeki, kesehatan keluarga & dijauhkan dari hutang riba."
  );

  // QR and Payment Simulation State
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(900); // 15 mins
  const [isCopiedNMID, setIsCopiedNMID] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [lastReceipt, setLastReceipt] = useState<{
    trxId: string;
    date: string;
    amount: number;
    programName: string;
    donorName: string;
    donorPrayer: string;
    pointsAwarded: number;
  } | null>(null);

  const selectedProgramObj =
    DONATION_PROGRAMS.find((p) => p.id === selectedCategory) || DONATION_PROGRAMS[0];

  // Countdown timer for QR validity
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSelectCategory = (catId: DonationCategory) => {
    setSelectedCategory(catId);
    const prog = DONATION_PROGRAMS.find((p) => p.id === catId);
    if (prog && !isCustomAmount) {
      setAmount(prog.defaultAmount);
    }
  };

  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setIsCustomAmount(false);
    setCustomAmountStr("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setCustomAmountStr(raw);
    setIsCustomAmount(true);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) {
      setAmount(parsed);
    } else {
      setAmount(0);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCopyNMID = () => {
    navigator.clipboard.writeText("ID1020039281923");
    setIsCopiedNMID(true);
    setTimeout(() => setIsCopiedNMID(false), 2500);
  };

  const handleSimulateSuccess = () => {
    const finalAmount = amount > 0 ? amount : 50000;
    const finalName = isAnonymous ? "Hamba Allah" : donorName.trim() || "Hamba Allah";
    const now = new Date();
    const trxId = `BM-QRIS-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
      now.getDate()
    ).padStart(2, "0")}-${Math.floor(10000 + Math.random() * 90000)}`;

    const dateFormatted = now.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";

    // Points calculation based on tier and amount
    const baseReward = selectedProgramObj.pointsReward;
    const bonusReward = Math.min(100, Math.floor(finalAmount / 50000) * 20);
    const totalPoints = baseReward + bonusReward;

    // Trigger celebration effects
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10b981", "#34d399", "#fbbf24", "#f59e0b", "#14b8a6"],
    });

    // Award Points into Context
    awardPoints(
      totalPoints,
      `QRIS Baitul Maal: ${selectedProgramObj.shortLabel}`,
      "infaq",
      `Menyalurkan ${formatRupiah(finalAmount)} melalui QRIS resmi Baitul Maal untuk ${selectedProgramObj.name}.`,
      "baitul-maal-supporter"
    );

    setLastReceipt({
      trxId,
      date: dateFormatted,
      amount: finalAmount,
      programName: selectedProgramObj.name,
      donorName: finalName,
      donorPrayer: donorPrayer || "Semoga berkah dan diridhoi Allah Ta'ala.",
      pointsAwarded: totalPoints,
    });

    setIsSuccessModalOpen(true);

    if (onSuccessDonation) {
      onSuccessDonation(finalAmount, selectedProgramObj.name);
    }
  };

  return (
    <div
      id="qris-zakat-infaq-section"
      className="bg-white rounded-3xl border border-emerald-200/90 shadow-xl overflow-hidden transition-all relative"
    >
      {/* Top Emerald Header Strip */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 sm:p-8 text-white relative overflow-hidden">
        {/* Decorative Background Aura */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                <QrCode className="w-3.5 h-3.5 text-amber-300" />
                <span>QRIS Nasional Terverifikasi Bank Indonesia</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-semibold border border-amber-300/30">
                <ShieldCheck className="w-3 h-3" />
                <span>NMID: ID1020039281923</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight">
              QRIS Zakat, Infaq & Sedekah Baitul Maal
            </h2>
            <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">
              Salurkan dana kebajikan secara instan, aman, dan 100% bebas riba langsung dari
              aplikasi mobile banking syariah atau e-wallet pilihan Anda untuk mengentaskan PHK dan
              memakmurkan mustahiq.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-700/60 shadow-inner flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                Total Terkumpul Hari Ini
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-300 font-serif">
                Rp 14.850.000
              </span>
              <span className="text-[11px] text-slate-300 block mt-0.5">
                ⚡ 142 Transaksi Jamaah Berkah
              </span>
            </div>
            <div className="h-10 w-px bg-slate-700 hidden sm:block"></div>
            <div className="flex -space-x-2 overflow-hidden py-1">
              <div className="w-8 h-8 rounded-full bg-emerald-700 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                🤝
              </div>
              <div className="w-8 h-8 rounded-full bg-amber-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                ⚖️
              </div>
              <div className="w-8 h-8 rounded-full bg-teal-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                🍲
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-amber-300">
                +139
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Column: Form Setup (col-span-7) */}
        <div className="lg:col-span-7 p-5 sm:p-7 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-200">
          {/* Step 1: Program Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[11px] flex items-center justify-center font-bold">
                  1
                </span>
                <span>Pilih Program Peruntukan Zakat & Infaq:</span>
              </label>
              <span className="text-[11px] text-emerald-800 font-semibold">
                +{selectedProgramObj.pointsReward} Poin Berdaya
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DONATION_PROGRAMS.map((prog) => {
                const isSelected = selectedCategory === prog.id;
                return (
                  <button
                    key={prog.id}
                    onClick={() => handleSelectCategory(prog.id)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                      isSelected
                        ? "bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-500/30 shadow-xs"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{prog.icon}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          isSelected
                            ? "bg-emerald-800 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {prog.badge}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 line-clamp-1">
                        {prog.shortLabel}
                      </div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">
                        {prog.targetFocus}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Program Info Banner */}
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 text-xs text-slate-700 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-950 font-bold block">
                  {selectedProgramObj.name}
                </strong>
                <span className="text-slate-600 text-[11px]">
                  {selectedProgramObj.desc}
                </span>
              </div>
            </div>
          </div>

          {/* Step 2: Amount Selector */}
          <div className="space-y-2.5">
            <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[11px] flex items-center justify-center font-bold">
                2
              </span>
              <span>Pilih atau Ketik Nominal Donasi (Rp):</span>
            </label>

            {/* Preset Amount Chips */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_AMOUNTS.map((preset) => {
                const isSelected = !isCustomAmount && amount === preset.value;
                return (
                  <button
                    key={preset.value}
                    onClick={() => handleSelectPreset(preset.value)}
                    className={`py-2 px-1.5 rounded-xl text-center border font-bold transition-all cursor-pointer text-xs ${
                      isSelected
                        ? "bg-slate-900 text-amber-300 border-slate-900 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div>{preset.label}</div>
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input Field */}
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">
                Rp
              </span>
              <input
                type="text"
                value={customAmountStr || (isCustomAmount ? "" : amount ? amount.toLocaleString("id-ID") : "")}
                onChange={handleCustomAmountChange}
                placeholder="Atau masukkan nominal kustom lainnya..."
                className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 text-xs sm:text-sm font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400"
              />
              <span className="absolute right-3 top-2.5 text-[11px] font-semibold text-emerald-700">
                Bebas Biaya Admin
              </span>
            </div>
          </div>

          {/* Step 3: Donor Info & Doa / Hajat */}
          <div className="space-y-3 pt-1">
            <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[11px] flex items-center justify-center font-bold">
                3
              </span>
              <span>Nama & Untaian Doa / Hajat Anda:</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-slate-600">Nama Lengkap</span>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                    />
                    <span>Hamba Allah</span>
                  </label>
                </div>
                <input
                  type="text"
                  disabled={isAnonymous}
                  value={isAnonymous ? "Hamba Allah" : donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Masukkan nama donatur..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                  No. WhatsApp (Untuk e-Kuitansi PDF)
                </span>
                <input
                  type="tel"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  placeholder="0812-xxxx-xxxx (opsional)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>

            {/* Prayer Input and Quick Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-600 block">
                Doa / Hajat Khusus (Diaminkan Bersama):
              </span>
              <textarea
                rows={2}
                value={donorPrayer}
                onChange={(e) => setDonorPrayer(e.target.value)}
                placeholder="Tuliskan hajat doa untuk Anda dan keluarga..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 leading-relaxed"
              ></textarea>

              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <span className="text-[10px] text-slate-400 self-center">Pilihan Doa:</span>
                {QUICK_PRAYER_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDonorPrayer(tmpl)}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-600 transition-colors cursor-pointer truncate max-w-[200px]"
                    title={tmpl}
                  >
                    🤲 Doa #{idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: QRIS Graphic & Instant Scan (col-span-5) */}
        <div className="lg:col-span-5 p-5 sm:p-7 bg-slate-50/70 flex flex-col justify-between space-y-5">
          {/* Official QRIS Card Container */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-4 text-center relative overflow-hidden">
            {/* Top Official Logos */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-rose-600 tracking-wider">QRIS</span>
                <span className="text-[10px] text-slate-400 font-bold">• GPN</span>
              </div>
              <div className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-200">
                Baitul Maal IslamiCity
              </div>
            </div>

            {/* Merchant Identity & Target Amount */}
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900">
                BAITUL MAAL ISLAMICITY GLOBAL
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                NMID: ID1020039281923 (A01)
              </div>
              <div className="pt-1">
                <span className="text-xs text-slate-500 font-medium">Nominal Transaksi:</span>
                <div className="text-2xl font-black text-emerald-800 font-serif">
                  {formatRupiah(amount > 0 ? amount : 50000)}
                </div>
              </div>
            </div>

            {/* Stylized QR Code Stage */}
            <div className="relative mx-auto w-52 h-52 sm:w-56 sm:h-56 bg-white p-3 rounded-2xl border-2 border-slate-900 shadow-inner flex items-center justify-center group">
              {/* Corner Frame Accents */}
              <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-600"></div>
              <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-600"></div>
              <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-600"></div>
              <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-600"></div>

              {/* Dynamic SVG QR Pattern */}
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full text-slate-950 select-none"
                fill="currentColor"
              >
                {/* 3 Large Corner Position Detection Patterns */}
                {/* Top-Left */}
                <rect x="10" y="10" width="50" height="50" rx="6" />
                <rect x="20" y="20" width="30" height="30" fill="white" rx="3" />
                <rect x="27" y="27" width="16" height="16" rx="2" />

                {/* Top-Right */}
                <rect x="140" y="10" width="50" height="50" rx="6" />
                <rect x="150" y="20" width="30" height="30" fill="white" rx="3" />
                <rect x="157" y="27" width="16" height="16" rx="2" />

                {/* Bottom-Left */}
                <rect x="10" y="140" width="50" height="50" rx="6" />
                <rect x="20" y="150" width="30" height="30" fill="white" rx="3" />
                <rect x="27" y="157" width="16" height="16" rx="2" />

                {/* Dense Stylized QR Modules */}
                {/* Horizontal Timing pattern */}
                <rect x="68" y="30" width="6" height="6" />
                <rect x="82" y="30" width="6" height="6" />
                <rect x="96" y="30" width="6" height="6" />
                <rect x="110" y="30" width="6" height="6" />
                <rect x="124" y="30" width="6" height="6" />

                {/* Vertical Timing pattern */}
                <rect x="30" y="68" width="6" height="6" />
                <rect x="30" y="82" width="6" height="6" />
                <rect x="30" y="96" width="6" height="6" />
                <rect x="30" y="110" width="6" height="6" />
                <rect x="30" y="124" width="6" height="6" />

                {/* Random Mock Datablocks */}
                <rect x="70" y="70" width="10" height="10" />
                <rect x="90" y="70" width="16" height="8" />
                <rect x="120" y="70" width="10" height="14" />
                <rect x="70" y="90" width="18" height="8" />
                <rect x="100" y="88" width="14" height="14" />
                <rect x="124" y="92" width="8" height="18" />
                <rect x="74" y="110" width="14" height="14" />
                <rect x="98" y="112" width="18" height="8" />
                <rect x="122" y="120" width="14" height="14" />

                <rect x="145" y="70" width="12" height="12" />
                <rect x="165" y="70" width="20" height="8" />
                <rect x="145" y="90" width="18" height="18" />
                <rect x="170" y="94" width="15" height="10" />
                <rect x="145" y="115" width="20" height="8" />
                <rect x="172" y="112" width="14" height="14" />

                <rect x="70" y="145" width="18" height="12" />
                <rect x="96" y="145" width="12" height="18" />
                <rect x="116" y="145" width="18" height="10" />
                <rect x="70" y="165" width="22" height="14" />
                <rect x="100" y="170" width="14" height="12" />
                <rect x="122" y="165" width="16" height="16" />

                <rect x="145" y="145" width="14" height="14" />
                <rect x="168" y="145" width="18" height="10" />
                <rect x="145" y="168" width="22" height="14" />
                <rect x="175" y="165" width="12" height="18" />
              </svg>

              {/* Center Islamic Syariah Shield Logo */}
              <div className="absolute inset-0 m-auto w-10 h-10 bg-white rounded-xl shadow-md border-2 border-emerald-600 flex items-center justify-center">
                <span className="text-base">🕌</span>
              </div>

              {/* Live Scanner Animation Laser Line */}
              <div className="absolute inset-x-2 top-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_8px_#10b981] animate-pulse"></div>
            </div>

            {/* Timer & Supported Payment Channel Icons */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Masa Berlaku QR:</span>
                <strong className="text-slate-900 font-mono">{formatTimer(timeLeftSeconds)}</strong>
              </div>

              {/* Supported Banks & E-wallets */}
              <div className="pt-1 border-t border-slate-100 flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                  BSI Mobile
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                  BCA Syariah
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                  Muamalat DIN
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                  GoPay
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                  OVO
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                  DANA
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                  Livin'
                </span>
              </div>
            </div>
          </div>

          {/* Action Button: Simulate Payment & Copy NMID */}
          <div className="space-y-2.5">
            <button
              onClick={handleSimulateSuccess}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Simulasikan Pembayaran Berhasil (1-Klik)</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyNMID}
                className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isCopiedNMID ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">NMID Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Salin Kode NMID</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  alert(
                    "Kode QRIS Baitul Maal siap di-scan langsung dari layar atau disimpan ke galeri ponsel Anda."
                  );
                }}
                className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Simpan QR</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Recent Donors Ticker Banner (Transparansi Terbuka) */}
      <div className="bg-slate-900 text-slate-300 px-5 py-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
            Feed Penyaluran Real-time:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          {RECENT_LIVE_DONATIONS.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-slate-300">
              <span>{item.icon}</span>
              <strong className="text-white">{item.name}</strong>
              <span className="text-emerald-400 font-bold">{formatRupiah(item.amount)}</span>
              <span className="text-slate-500">({item.time})</span>
            </div>
          ))}
        </div>

        <span className="text-[10px] text-slate-400 hidden lg:block">
          Audit Syariah Terbuka & Bebas Riba
        </span>
      </div>

      {/* Success Modal & Digital e-Kuitansi (Ijab Qabul) */}
      {isSuccessModalOpen && lastReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-emerald-200 max-h-[90vh] overflow-y-auto">
            {/* Top Success Badge */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner border-2 border-emerald-300">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                +{lastReceipt.pointsAwarded} Poin Berdaya Ditambahkan!
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif">
                Alhamdulillah, Penyaluran Berhasil!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Dana kebajikan Anda telah sah diterima oleh Baitul Maal IslamiCity Global dan langsung
                dialokasikan untuk mustahiq & permodalan 0% riba.
              </p>
            </div>

            {/* Official Digital e-Receipt Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Tanda Terima Zakat & Infaq
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800">
                    {lastReceipt.trxId}
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Lunas (QRIS)
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Waktu Transaksi:</span>
                  <span className="font-semibold text-slate-900">{lastReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Donatur / Muzakki:</span>
                  <span className="font-bold text-slate-900">{lastReceipt.donorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Program Peruntukan:</span>
                  <span className="font-bold text-emerald-800 text-right max-w-[200px]">
                    {lastReceipt.programName}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 text-sm">
                  <span className="font-bold text-slate-700">Total Disalurkan:</span>
                  <span className="font-black text-emerald-800 text-base">
                    {formatRupiah(lastReceipt.amount)}
                  </span>
                </div>
              </div>

              {/* Doa / Hajat Display */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-xs space-y-1">
                <span className="font-bold text-[11px] text-amber-900 block flex items-center gap-1">
                  <span>🤲</span> Doa & Ijab Qabul:
                </span>
                <p className="italic text-[11px] leading-relaxed">"{lastReceipt.donorPrayer}"</p>
                <p className="text-[10px] text-amber-800 pt-1 border-t border-amber-200/60">
                  <em>
                    "Ajarakallahu fiima a'thaita, wa baaraka fiima abqaita, wa ja'alahu laka
                    thahuuraa."
                  </em>
                </p>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  const shareText = `Alhamdulillah, saya telah menyalurkan donasi sebesar ${formatRupiah(
                    lastReceipt.amount
                  )} untuk ${lastReceipt.programName} melalui QRIS Baitul Maal IslamiCity Global (Ref: ${
                    lastReceipt.trxId
                  }). Mari bersama berdayakan umat!`;
                  navigator.clipboard.writeText(shareText);
                  alert("Teks bukti e-Kuitansi berhasil disalin ke clipboard!");
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Copy className="w-4 h-4 text-amber-300" />
                <span>Salin Teks Kuitansi / Bukti Serah Terima</span>
              </button>

              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Selesai & Kembali ke Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
