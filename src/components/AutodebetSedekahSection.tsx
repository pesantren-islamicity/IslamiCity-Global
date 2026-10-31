import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Sliders,
  DollarSign,
  Heart,
  Check,
  Info,
  Building2,
  Users,
  AlertCircle,
  HelpCircle,
  Volume2,
  VolumeX,
  CreditCard,
  Zap,
  Repeat,
  Share2,
  ChevronRight,
  UserCheck,
  Eye,
  BadgeCheck,
  Lock,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useEmpowerment } from "../context/EmpowermentContext";

export interface VerifiedBeneficiary {
  id: string;
  name: string;
  category: "phk-qardh" | "dapur-dhuafa" | "beasiswa-yatim" | "lansia-gharimin" | "petani-hijau";
  categoryLabel: string;
  location: string;
  asnafType: "Fakir & Miskin" | "Gharimin" | "Gharimin & Miskin" | "Fisabilillah" | "Ibnu Sabil";
  leadPartner: string;
  beneficiariesCount: number;
  auditScore: number; // e.g. 99.2%
  urgency: "Sangat Mendesak" | "Prioritas Utama" | "Berkelanjutan";
  description: string;
  impactTarget: string;
  icon: string;
}

export interface AutodebetConfig {
  isActive: boolean;
  sourceType: "sisa-saldo" | "omset-persen" | "nominal-tetap";
  fixedAmount: number;
  incomePercent: number; // e.g. 2.5%
  roundUpTo: number; // e.g. 5000 (round up to nearest Rp 5.000)
  frequency: "harian" | "jumat-berkah" | "mingguan" | "bulanan";
  executionTime: string; // "05:00" | "12:30" | "18:15"
  paymentChannel: "dompet-syariah" | "bsi-autodebit" | "muamalat-debit" | "qris-ewallet" | "bca-syariah";
  beneficiaryMode: "semua-terpadu" | "pilihan-spesifik";
  selectedBeneficiaryIds: string[];
  monthlyMaxLimit: number; // Safety Cap: Rp 200.000 / month
  customNotes: string;
}

export interface AutodebetExecutionRecord {
  id: string;
  date: string;
  time: string;
  amount: number;
  sourceLabel: string;
  beneficiaryName: string;
  channel: string;
  status: "Berhasil" | "Tersalurkan";
  receiptNo: string;
}

const VERIFIED_BENEFICIARIES: VerifiedBeneficiary[] = [
  {
    id: "BEN-01",
    name: "Modal Talangan Qardhul Hasan Korban PHK Pabrik & Ritel",
    category: "phk-qardh",
    categoryLabel: "Modal Usaha 0% Riba",
    location: "Jabodetabek, Bandung & Surabaya",
    asnafType: "Gharimin & Miskin",
    leadPartner: "Baitul Maal Koperasi Al-Hikmah",
    beneficiariesCount: 142,
    auditScore: 99.5,
    urgency: "Sangat Mendesak",
    description: "Pemberian dana pinjaman kebajikan tanpa bunga dan tanpa jaminan untuk membeli gerobak, etalase, dan bahan baku usaha kuliner mandiri.",
    impactTarget: "142 Kepala Keluarga kembali mandiri berpenghasilan halal di atas rata-rata.",
    icon: "🤝",
  },
  {
    id: "BEN-02",
    name: "Dapur Berkah & Sembako Darurat Keluarga Pra-Sejahtera",
    category: "dapur-dhuafa",
    categoryLabel: "Pangan & Gizi Darurat",
    location: "Cirebon, Semarang & Solo",
    asnafType: "Fakir & Miskin",
    leadPartner: "Sentra Dapur Kaffah Nusantara",
    beneficiariesCount: 280,
    auditScore: 99.8,
    urgency: "Prioritas Utama",
    description: "Penyaluran beras organik, minyak kelapa, telur, dan lauk siap saji bergizi tinggi bagi lansia dan keluarga pekerja yang belum dapat pekerjaan.",
    impactTarget: "Mencegah kelaparan dan stunting pada 180 balita dari keluarga ter-PHK.",
    icon: "🍲",
  },
  {
    id: "BEN-03",
    name: "Beasiswa Vokasi Green Skills & Sertifikasi Halal Santri Yatim",
    category: "beasiswa-yatim",
    categoryLabel: "Pendidikan & Keahlian",
    location: "Bogor, Malang & Lombok",
    asnafType: "Fisabilillah",
    leadPartner: "Yayasan Eco-Pesantren Al-Barakah",
    beneficiariesCount: 85,
    auditScore: 98.9,
    urgency: "Berkelanjutan",
    description: "Kursus wirausaha maggot BSF, instalasi PLTS surya hemat energi, dan pelatihan digital marketing untuk anak yatim korban PHK.",
    impactTarget: "Mencetak 85 wirausahawan hijau muda berakhlak mulia dan tersertifikasi.",
    icon: "🎓",
  },
  {
    id: "BEN-04",
    name: "Bantuan Pelunasan Hutang Riba Darurat & Santunan Lansia Dhuafa",
    category: "lansia-gharimin",
    categoryLabel: "Bebas Rente & Lansia",
    location: "Yogyakarta, Padang & Banjarmasin",
    asnafType: "Gharimin",
    leadPartner: "Lembaga Advokasi Anti-Riba Umat",
    beneficiariesCount: 64,
    auditScore: 99.2,
    urgency: "Sangat Mendesak",
    description: "Pembebasan mustahiq dari jeratan rentenir keliling dan pinjol ilegal yang menyita rumah atau perabotan keluarga pra-sejahtera.",
    impactTarget: "64 keluarga terbebas tuntas dari teror penagih utang dan kembali damai beribadah.",
    icon: "🛡️",
  },
  {
    id: "BEN-05",
    name: "Kemitraan Benih Padi Organik & Solar Dome Nelayan Pesisir",
    category: "petani-hijau",
    categoryLabel: "Ketahanan Pangan Sirkular",
    location: "Banyuwangi, Makassar & Ambon",
    asnafType: "Fisabilillah",
    leadPartner: "Koperasi Mina Bahari & Tani Syariah",
    beneficiariesCount: 110,
    auditScore: 99.1,
    urgency: "Prioritas Utama",
    description: "Penyediaan benih padi non-kimia dan kubah pengering surya (solar dome) ikan asin higienis agar nelayan dan petani tidak berutang ke tengkulak.",
    impactTarget: "110 nelayan dan petani berdaulat secara ekonomi dengan hasil panen bebas residu kimia.",
    icon: "🌾",
  },
];

const PRESET_ROUND_UPS = [
  { value: 1000, label: "Rp 1.000", desc: "Bulatkan ke ribuan terdekat (Contoh: Rp 18.200 → Debet Rp 800)" },
  { value: 2000, label: "Rp 2.000", desc: "Bulatkan ke Rp 2.000 terdekat (Contoh: Rp 18.200 → Debet Rp 1.800)" },
  { value: 5000, label: "Rp 5.000", desc: "Bulatkan ke Rp 5.000 terdekat (Contoh: Rp 26.300 → Debet Rp 3.700)", popular: true },
  { value: 10000, label: "Rp 10.000", desc: "Bulatkan ke Rp 10.000 terdekat (Contoh: Rp 42.000 → Debet Rp 8.000)" },
];

export const AutodebetSedekahSection: React.FC = () => {
  const STORAGE_CONFIG_KEY = "islamicity_autodebet_sedekah_config_v1";
  const STORAGE_HISTORY_KEY = "islamicity_autodebet_sedekah_history_v1";

  const { awardPoints } = useEmpowerment();

  // State Config
  const [config, setConfig] = useState<AutodebetConfig>(() => {
    const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      isActive: true,
      sourceType: "sisa-saldo",
      fixedAmount: 5000,
      incomePercent: 2.5,
      roundUpTo: 5000,
      frequency: "harian",
      executionTime: "05:00",
      paymentChannel: "dompet-syariah",
      beneficiaryMode: "semua-terpadu",
      selectedBeneficiaryIds: ["BEN-01", "BEN-02"],
      monthlyMaxLimit: 150000,
      customNotes: "Semoga berkah pembuka pintu rezeki halal dan perlindungan keluarga.",
    };
  });

  // State Execution History
  const [history, setHistory] = useState<AutodebetExecutionRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_HISTORY_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: "REC-901",
        date: "25 Sep 2026",
        time: "05:00 WIB",
        amount: 3800,
        sourceLabel: "Pembulatan Sisa Belanja (Rp 5.000)",
        beneficiaryName: "Modal Talangan Qardhul Hasan Korban PHK",
        channel: "Dompet Syariah Berkah",
        status: "Tersalurkan",
        receiptNo: "AD-BTL-99201",
      },
      {
        id: "REC-900",
        date: "24 Sep 2026",
        time: "05:00 WIB",
        amount: 5000,
        sourceLabel: "Sedekah Subuh Harian Terjadwal",
        beneficiaryName: "Dapur Berkah & Sembako Darurat",
        channel: "BSI Autodebit",
        status: "Tersalurkan",
        receiptNo: "AD-BTL-99184",
      },
      {
        id: "REC-899",
        date: "23 Sep 2026",
        time: "05:00 WIB",
        amount: 4200,
        sourceLabel: "Pembulatan Sisa Belanja",
        beneficiaryName: "Beasiswa Vokasi Green Skills Santri",
        channel: "Dompet Syariah Berkah",
        status: "Tersalurkan",
        receiptNo: "AD-BTL-99167",
      },
    ];
  });

  // Interactive UI State
  const [isSimulating, setIsSimulating] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [lastExecutedRecord, setLastExecutedRecord] = useState<AutodebetExecutionRecord | null>(null);
  const [activeTab, setActiveTab] = useState<"jadwal" | "penerima" | "riwayat" | "fiqih">("jadwal");
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  // Save Config to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
  }, [config]);

  // Save History to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  // Currency Formatter
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Web Audio peaceful chime
  const playHarmonicChime = () => {
    if (isSoundMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Soft ascending prayer notes: C4, E4, G4, C5
      const notes = [261.63, 329.63, 392.0, 523.25];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        gain.gain.setValueAtTime(0, now + idx * 0.15);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.15 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 1.3);
      });
    } catch (e) {
      console.log("Audio chime skipped:", e);
    }
  };

  // Calculate estimated monthly debit
  const calculateEstimatedMonthly = () => {
    if (!config.isActive) return 0;
    if (config.sourceType === "nominal-tetap") {
      if (config.frequency === "harian") return config.fixedAmount * 30;
      if (config.frequency === "jumat-berkah") return config.fixedAmount * 4;
      if (config.frequency === "mingguan") return config.fixedAmount * 4;
      return config.fixedAmount;
    }
    if (config.sourceType === "sisa-saldo") {
      // average round-up ~ Rp 2.500 per day
      return 2500 * 30;
    }
    // omset persen (assuming daily net income Rp 100.000)
    return (100000 * (config.incomePercent / 100)) * 30;
  };

  // Execute 1-Click Simulation Autodebet
  const handleSimulateDebit = () => {
    setIsSimulating(true);

    setTimeout(() => {
      const now = new Date();
      const dateStr = now.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
      const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

      // Determine simulated amount
      let simAmount = config.fixedAmount;
      let label = "Sedekah Terjadwal Rutin";
      if (config.sourceType === "sisa-saldo") {
        simAmount = Math.floor(Math.random() * (config.roundUpTo - 500)) + 800;
        label = `Pembulatan Sisa Belanja (Batas ${formatIDR(config.roundUpTo)})`;
      } else if (config.sourceType === "omset-persen") {
        simAmount = Math.round(150000 * (config.incomePercent / 100));
        label = `Titipan ${config.incomePercent}% Pendapatan Bersih Hari Ini`;
      }

      // Pick beneficiary
      let targetBeneficiary = VERIFIED_BENEFICIARIES[0].name;
      if (config.beneficiaryMode === "pilihan-spesifik" && config.selectedBeneficiaryIds.length > 0) {
        const found = VERIFIED_BENEFICIARIES.find((b) => b.id === config.selectedBeneficiaryIds[0]);
        if (found) targetBeneficiary = found.name;
      } else {
        targetBeneficiary = "Baitul Maal Terpadu (Prioritas Mendesak Asnaf)";
      }

      const receipt = `AD-BTL-${Date.now().toString().slice(-5)}`;

      const newRecord: AutodebetExecutionRecord = {
        id: `REC-${Date.now().toString().slice(-4)}`,
        date: dateStr,
        time: timeStr,
        amount: simAmount,
        sourceLabel: label,
        beneficiaryName: targetBeneficiary,
        channel:
          config.paymentChannel === "dompet-syariah"
            ? "Dompet Syariah Berkah"
            : config.paymentChannel === "bsi-autodebit"
            ? "BSI Autodebit Syariah"
            : config.paymentChannel === "muamalat-debit"
            ? "Bank Muamalat Hijrah"
            : "QRIS Auto-Debit",
        status: "Tersalurkan",
        receiptNo: receipt,
      };

      setHistory((prev) => [newRecord, ...prev]);
      setLastExecutedRecord(newRecord);
      setIsSimulating(false);
      setShowSuccessToast(true);

      // Award Points in Empowerment Context
      awardPoints(
        75,
        "Autodebet Sedekah Terjadwal",
        "Infaq & Sedekah",
        `Sedekah otomatis ${formatIDR(simAmount)} berhasil disalurkan ke ${targetBeneficiary}.`,
        "baitul-maal-supporter"
      );

      playHarmonicChime();

      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#f59e0b", "#34d399", "#fbbf24"],
      });

      setTimeout(() => setShowSuccessToast(false), 7000);
    }, 700);
  };

  const toggleBeneficiary = (id: string) => {
    setConfig((prev) => {
      const exists = prev.selectedBeneficiaryIds.includes(id);
      if (exists) {
        // keep at least 1
        if (prev.selectedBeneficiaryIds.length === 1) return prev;
        return {
          ...prev,
          selectedBeneficiaryIds: prev.selectedBeneficiaryIds.filter((item) => item !== id),
        };
      } else {
        return {
          ...prev,
          selectedBeneficiaryIds: [...prev.selectedBeneficiaryIds, id],
        };
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden space-y-0 transition-all">
      {/* Top Header Banner with Spiritual Golden Dawn Aesthetics */}
      <div className="relative bg-gradient-to-r from-slate-950 via-emerald-950 to-amber-950 p-6 sm:p-8 text-white overflow-hidden border-b border-emerald-800/60">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 -mb-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Sistem Donasi Terjadwal Otomatis • Baitul Maal Syariah</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight leading-tight">
              Autodebet Sedekah Berkah: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200">
                Dari Sisa Saldo & Pendapatan Harian
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Jaga amalan sedekah tetap istiqomah setiap hari tanpa lupa. Konfigurasikan pendebetan otomatis dari pembulatan receh sisa belanja,
              persentase omset usaha harian, atau nominal terjadwal yang dialokasikan langsung ke penerima manfaat terverifikasi syariah.
            </p>
          </div>

          {/* Quick Autodebet Summary Card */}
          <div className="bg-emerald-900/60 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-emerald-700/60 flex items-center justify-around gap-4 shrink-0 shadow-lg">
            <div className="text-center px-2">
              <div className="flex items-center justify-center gap-1 text-emerald-300 font-bold text-xs uppercase tracking-wider mb-1">
                <Repeat className="w-4 h-4 text-amber-400" />
                <span>Status Jadwal</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-serif">
                {config.isActive ? "AKTIF" : "DIJEDA"}
              </div>
              <p className="text-[10px] text-emerald-200/80 mt-0.5">
                {config.frequency === "harian" ? "Setiap Hari (Fajar)" : config.frequency === "jumat-berkah" ? "Setiap Jumat" : "Bulanan"}
              </p>
            </div>

            <div className="w-px h-12 bg-emerald-700/60"></div>

            <div className="text-center px-2">
              <div className="flex items-center justify-center gap-1 text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Est. Sedekah/Bln</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-300 font-serif">
                {formatIDR(calculateEstimatedMonthly())}
              </div>
              <p className="text-[10px] text-emerald-200/80 mt-0.5">Maks. {formatIDR(config.monthlyMaxLimit)}</p>
            </div>
          </div>
        </div>

        {/* Hadith Quote Banner */}
        <div className="mt-6 pt-5 border-t border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-200/90">
          <div className="flex items-center gap-2 italic">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
            <span>
              "Amalan yang paling dicintai oleh Allah adalah amalan yang berkelanjutan (istiqomah) walaupun sedikit." (HR. Bukhari & Muslim)
            </span>
          </div>
          <button
            onClick={() => setActiveTab("fiqih")}
            className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 shrink-0 underline cursor-pointer text-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Dasar Hukum & Fiqih Wakalah Autodebet</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("jadwal")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "jadwal"
                ? "bg-emerald-800 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>1. Pengaturan Sumber & Jadwal</span>
            {config.isActive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
          </button>

          <button
            onClick={() => setActiveTab("penerima")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "penerima"
                ? "bg-emerald-800 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>2. Penerima Manfaat Terverifikasi ({VERIFIED_BENEFICIARIES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("riwayat")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "riwayat"
                ? "bg-emerald-800 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>3. Buku Riwayat Eksekusi ({history.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("fiqih")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "fiqih"
                ? "bg-emerald-800 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>4. Fiqih & Fatwa Syariah</span>
          </button>
        </div>

        {/* 1-Click Simulation Execution CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateDebit}
            disabled={isSimulating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-4 h-4 fill-slate-950 text-slate-950 animate-pulse" />
            <span>{isSimulating ? "Memproses Pemotongan..." : "Simulasi Eksekusi Autodebet Sekarang"}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Panels */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* ================= TAB 1: PENGATURAN SUMBER & JADWAL ================= */}
        {activeTab === "jadwal" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Master Activation Toggle Bar */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-md transition-all ${
                    config.isActive ? "bg-emerald-600" : "bg-slate-400"
                  }`}
                >
                  <Repeat className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      Status Layanan Autodebet Sedekah
                    </h3>
                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        config.isActive
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-slate-100 text-slate-600 border-slate-300"
                      }`}
                    >
                      {config.isActive ? "AKTIF TERJADWAL" : "DIJEDA SEMENTARA"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {config.isActive
                      ? `Sedekah akan didebet otomatis secara ${config.frequency} melalui ${config.paymentChannel} dengan batas aman maksimal ${formatIDR(config.monthlyMaxLimit)}/bulan.`
                      : "Jadwal autodebet sedang dijeda. Tidak ada penarikan dana sedekah yang akan dilakukan."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <button
                  onClick={() => setConfig((prev) => ({ ...prev, isActive: !prev.isActive }))}
                  className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    config.isActive ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                  role="switch"
                  aria-checked={config.isActive}
                >
                  <span
                    className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      config.isActive ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Grid 2 Columns: Sumber Dana & Metode Frekuensi */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Pilihan Sumber Dana Sedekah */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        1. Sumber Dana & Skema Sedekah
                      </h4>
                      <p className="text-[11px] text-slate-500">Pilih model debet yang paling nyaman bagi Anda</p>
                    </div>
                  </div>
                </div>

                {/* 3 Source Radio Options */}
                <div className="space-y-3">
                  {/* Option A: Sisa Saldo / Round-up */}
                  <label
                    className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                      config.sourceType === "sisa-saldo"
                        ? "bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-500/20 text-emerald-950 font-bold"
                        : "bg-white border-slate-200 hover:border-emerald-300 text-slate-800"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="sourceType"
                        value="sisa-saldo"
                        checked={config.sourceType === "sisa-saldo"}
                        onChange={() => setConfig((prev) => ({ ...prev, sourceType: "sisa-saldo" }))}
                        className="mt-1 w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">A. Pembulatan Receh Sisa Belanja (Spare Change)</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                            Paling Ringan
                          </span>
                        </div>
                        <p className="text-xs font-normal text-slate-600 leading-relaxed">
                          Sisa uang receh dari pembulatan transaksi harian Anda otomatis dialihkan ke Baitul Maal setiap malam.
                        </p>

                        {/* Round-up selector if active */}
                        {config.sourceType === "sisa-saldo" && (
                          <div className="pt-2">
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Pilih Nilai Pembulatan:
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {PRESET_ROUND_UPS.map((rup) => (
                                <button
                                  key={rup.value}
                                  type="button"
                                  onClick={() => setConfig((prev) => ({ ...prev, roundUpTo: rup.value }))}
                                  className={`p-2 rounded-lg text-left text-xs font-bold border transition-all ${
                                    config.roundUpTo === rup.value
                                      ? "bg-emerald-600 text-white border-emerald-700"
                                      : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300"
                                  }`}
                                >
                                  <div>{rup.label}</div>
                                  <div className="text-[9px] opacity-80 font-normal">Contoh belanja dibulatkan ke {rup.label}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>

                  {/* Option B: Persentase Pendapatan Harian */}
                  <label
                    className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                      config.sourceType === "omset-persen"
                        ? "bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-500/20 text-emerald-950 font-bold"
                        : "bg-white border-slate-200 hover:border-emerald-300 text-slate-800"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="sourceType"
                        value="omset-persen"
                        checked={config.sourceType === "omset-persen"}
                        onChange={() => setConfig((prev) => ({ ...prev, sourceType: "omset-persen" }))}
                        className="mt-1 w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">B. Persentase Pendapatan Harian / Omset Usaha</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Cocok untuk Pedagang & Freelancer
                          </span>
                        </div>
                        <p className="text-xs font-normal text-slate-600 leading-relaxed">
                          Menyisihkan porsi berkah tetap dari pendapatan bersih harian (contoh: 2.5% hak dhuafa dari hasil usaha harian).
                        </p>

                        {config.sourceType === "omset-persen" && (
                          <div className="pt-2 flex items-center gap-3">
                            {[1, 2.5, 3, 5].map((pct) => (
                              <button
                                key={pct}
                                type="button"
                                onClick={() => setConfig((prev) => ({ ...prev, incomePercent: pct }))}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                  config.incomePercent === pct
                                    ? "bg-emerald-600 text-white border-emerald-700"
                                    : "bg-white text-slate-700 border-slate-200"
                                }`}
                              >
                                {pct}% Pendapatan
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </label>

                  {/* Option C: Nominal Tetap Berkala */}
                  <label
                    className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                      config.sourceType === "nominal-tetap"
                        ? "bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-500/20 text-emerald-950 font-bold"
                        : "bg-white border-slate-200 hover:border-emerald-300 text-slate-800"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="sourceType"
                        value="nominal-tetap"
                        checked={config.sourceType === "nominal-tetap"}
                        onChange={() => setConfig((prev) => ({ ...prev, sourceType: "nominal-tetap" }))}
                        className="mt-1 w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">C. Nominal Tetap Terjadwal (Fixed Recurring)</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            Pasti & Terukur
                          </span>
                        </div>
                        <p className="text-xs font-normal text-slate-600 leading-relaxed">
                          Mendebet nominal pasti secara berkala pada jadwal yang Anda tentukan.
                        </p>

                        {config.sourceType === "nominal-tetap" && (
                          <div className="pt-2 grid grid-cols-4 gap-2">
                            {[2000, 5000, 10000, 25000].map((amt) => (
                              <button
                                key={amt}
                                type="button"
                                onClick={() => setConfig((prev) => ({ ...prev, fixedAmount: amt }))}
                                className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center border transition-all ${
                                  config.fixedAmount === amt
                                    ? "bg-emerald-600 text-white border-emerald-700"
                                    : "bg-white text-slate-700 border-slate-200"
                                }`}
                              >
                                {formatIDR(amt)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Card 2: Frekuensi Jadwal & Kanal Pembayaran */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        2. Frekuensi & Kanal Autodebet
                      </h4>
                      <p className="text-[11px] text-slate-500">Waktu pelaksanaan dan rekening penarikan</p>
                    </div>
                  </div>
                </div>

                {/* Frequency selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Pilih Frekuensi Penarikan Sedekah:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "harian", label: "Setiap Hari (Fajar)", desc: "Pahala sedekah subuh malaikat" },
                      { id: "jumat-berkah", label: "Setiap Jumat Berkah", desc: "Waktu mustajab sayyidul ayyam" },
                      { id: "mingguan", label: "Mingguan (Hari Senin)", desc: "Awal pekan berkah berbisnis" },
                      { id: "bulanan", label: "Bulanan (Hari Gajian)", desc: "Tiap tgl 1 atau 25 awal bulan" },
                    ].map((f: any) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setConfig((prev) => ({ ...prev, frequency: f.id }))}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          config.frequency === f.id
                            ? "bg-teal-50 border-teal-600 ring-2 ring-teal-500/20 text-teal-950 font-bold"
                            : "bg-white border-slate-200 text-slate-700 hover:border-teal-300"
                        }`}
                      >
                        <div className="text-xs font-bold">{f.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{f.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Execution Time */}
                <div className="space-y-1 pt-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Jam Eksekusi Otomatis:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { time: "05:00", label: "05:00 WIB (Subuh)" },
                      { time: "12:30", label: "12:30 WIB (Dzuhur)" },
                      { time: "18:15", label: "18:15 WIB (Maghrib)" },
                    ].map((t) => (
                      <button
                        key={t.time}
                        type="button"
                        onClick={() => setConfig((prev) => ({ ...prev, executionTime: t.time }))}
                        className={`py-2 px-2 rounded-xl text-center text-xs font-bold border transition-all ${
                          config.executionTime === t.time
                            ? "bg-teal-600 text-white border-teal-700"
                            : "bg-white text-slate-700 border-slate-200"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kanal Pembayaran */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Pilih Saluran / Rekening Autodebet:
                  </label>
                  <select
                    value={config.paymentChannel}
                    onChange={(e: any) => setConfig((prev) => ({ ...prev, paymentChannel: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-900 focus:border-emerald-600"
                  >
                    <option value="dompet-syariah">Dompet Syariah Berkah (Saldo Internal IslamiCity)</option>
                    <option value="bsi-autodebit">BSI Autodebit Syariah (Bank Syariah Indonesia)</option>
                    <option value="muamalat-debit">Bank Muamalat Hijrah Debit Otomatis</option>
                    <option value="qris-ewallet">QRIS Auto-Debit (GoPay / ShopeePay / DANA / OVO)</option>
                    <option value="bca-syariah">BCA Syariah Tahapan Berkah</option>
                  </select>
                </div>

                {/* Monthly Safety Limit Cap */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-amber-900">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Batas Aman Maksimal per Bulan (Safety Cap):</span>
                    </span>
                    <span className="text-emerald-800 font-extrabold">{formatIDR(config.monthlyMaxLimit)}</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Sistem otomatis menghentikan pendebetan jika total sedekah dalam 1 bulan telah menyentuh batas aman ini.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PENERIMA MANFAAT TERVERIFIKASI ================= */}
        {activeTab === "penerima" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Mode Alokasi Selector */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Metode Penyaluran Dana Autodebet Anda:
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih apakah dana disalurkan secara terpadu oleh tim Baitul Maal atau memilih langsung penerima manfaat yang Anda kehendaki.
                </p>
              </div>

              <div className="flex rounded-xl bg-slate-200 p-1 border border-slate-300 shrink-0">
                <button
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, beneficiaryMode: "semua-terpadu" }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    config.beneficiaryMode === "semua-terpadu"
                      ? "bg-emerald-800 text-white shadow-xs"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                >
                  Baitul Maal Terpadu (Semua Asnaf)
                </button>
                <button
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, beneficiaryMode: "pilihan-spesifik" }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    config.beneficiaryMode === "pilihan-spesifik"
                      ? "bg-emerald-800 text-white shadow-xs"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                >
                  Pilihan Mandiri ({config.selectedBeneficiaryIds.length} Terpilih)
                </button>
              </div>
            </div>

            {/* List of Verified Beneficiaries */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {VERIFIED_BENEFICIARIES.map((ben) => {
                const isSelected =
                  config.beneficiaryMode === "semua-terpadu" ||
                  config.selectedBeneficiaryIds.includes(ben.id);

                return (
                  <div
                    key={ben.id}
                    onClick={() => {
                      if (config.beneficiaryMode === "pilihan-spesifik") {
                        toggleBeneficiary(ben.id);
                      }
                    }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 relative ${
                      isSelected
                        ? "bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                        : "bg-slate-50/70 border-slate-200 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Bar with Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-2xl">{ben.icon}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <BadgeCheck className="w-3 h-3 text-emerald-600" />
                            <span>Audit {ben.auditScore}%</span>
                          </span>

                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            Asnaf {ben.asnafType}
                          </span>
                        </div>
                      </div>

                      {/* Title & Location */}
                      <div>
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900 font-serif leading-snug">
                          {ben.name}
                        </h4>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <span>Wilayah: {ben.location}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {ben.description}
                      </p>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-emerald-900 space-y-0.5">
                        <div className="font-bold flex items-center gap-1 text-emerald-800">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Target Dampak Nyata:</span>
                        </div>
                        <div>{ben.impactTarget}</div>
                      </div>
                    </div>

                    {/* Bottom Status & Selection Pill */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">
                        Binaan: <strong className="text-slate-800">{ben.beneficiariesCount} Jiwa/UMKM</strong>
                      </span>

                      {isSelected ? (
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Penerima Aktif</span>
                        </span>
                      ) : (
                        <span className="font-semibold text-slate-400">Klik untuk Pilih</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 3: BUKU RIWAYAT EKSEKUSI ================= */}
        {activeTab === "riwayat" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Ledger Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Buku Catatan Amal Autodebet Sedekah ({history.length} Catatan)
                  </h4>
                  <p className="text-xs text-slate-500">Transparansi penyaluran otomatis terhubung ke sistem Baitul Maal</p>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  100% Bebas Riba
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100/75 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Waktu & Tanggal</th>
                      <th className="py-3 px-4">Skema Sumber Dana</th>
                      <th className="py-3 px-4">Penerima Manfaat Terverifikasi</th>
                      <th className="py-3 px-4">Kanal Debet</th>
                      <th className="py-3 px-4 text-right">Nominal</th>
                      <th className="py-3 px-4 text-center">Status & Resi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                          <div>{rec.date}</div>
                          <div className="text-[11px] text-slate-400 font-normal">{rec.time}</div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {rec.sourceLabel}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{rec.beneficiaryName}</div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                          {rec.channel}
                        </td>

                        <td className="py-3.5 px-4 text-right font-black text-emerald-800 whitespace-nowrap">
                          {formatIDR(rec.amount)}
                        </td>

                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{rec.status}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {rec.receiptNo}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: FIQIH & FATWA SYARIAH ================= */}
        {activeTab === "fiqih" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Akad Wakalah Explanation */}
            <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Akad Syariah: Wakalah bil Ujrah / Ta'awun Fil Khair</span>
                </span>
                <span className="bg-amber-200/70 px-2.5 py-0.5 rounded-full text-[10px]">Fatwa DSN-MUI No. 10/DSN-MUI/IV/2000</span>
              </div>
              <h3 className="font-bold text-amber-950 text-base font-serif">
                Keabsahan Autodebet Sedekah dalam Fiqih Muamalah Kontemporer
              </h3>
              <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                Autodebet sedekah menggunakan akad <strong>Wakalah</strong>, di mana donatur (<em>Muwakkil</em>) memberikan kuasa kepada pengelola Baitul Maal (<em>Wakil</em>) untuk memotong saldo terjadwal dan menyalurkannya langsung kepada asnaf fakir miskin yang berhak. Akad ini sah, berpahala terus-menerus, dan menguatkan istiqomah berinfaq.
              </p>
            </div>

            {/* Hadith & Fadhilah Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="font-bold text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Doa Malaikat Fajar Setiap Pagi</span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Rasulullah ﷺ bersabda: <em>"Setiap pagi dua malaikat berdoa; salah satunya memohon: 'Ya Allah, berikanlah ganti berlipat bagi orang yang berinfaq di waktu pagi'."</em> (HR. Bukhari & Muslim).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 space-y-2">
                <div className="font-bold text-teal-900 text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-700" />
                  <span>Sedekah Memadamkan Murka Allah & Tolak Bala</span>
                </div>
                <p className="text-xs text-teal-900 leading-relaxed">
                  Rasulullah ﷺ bersabda: <em>"Sedekah secara rahasia dan rutin memadamkan murka Allah Ta'ala serta menghindarkan pelakunya dari kematian yang buruk."</em> (HR. At-Thabrani).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Execution Toast / Success Modal */}
      {showSuccessToast && lastExecutedRecord && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-slate-950 text-white rounded-3xl p-5 border-2 border-amber-400 shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500 text-slate-950 font-bold shrink-0 mt-0.5">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold uppercase tracking-wider">Autodebet Berhasil Tertunaikan</span>
                <span className="text-slate-400 font-mono text-[10px]">{lastExecutedRecord.receiptNo}</span>
              </div>
              <h5 className="font-extrabold text-base text-amber-300 font-serif">
                {formatIDR(lastExecutedRecord.amount)} Tersalurkan
              </h5>
              <p className="text-xs text-slate-300">
                Penerima: <strong className="text-white">{lastExecutedRecord.beneficiaryName}</strong>
              </p>
              <div className="text-[11px] text-emerald-300 pt-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>+75 Poin Berdaya Keberkahan ditambahkan ke Profil Anda!</span>
              </div>
            </div>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
