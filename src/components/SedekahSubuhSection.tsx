import React, { useState, useEffect } from "react";
import {
  Heart,
  Bell,
  Clock,
  Coins,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Calendar,
  Zap,
  TrendingUp,
  Volume2,
  VolumeX,
  Smartphone,
  Info,
  Check,
  Flame,
  ArrowRight,
  RefreshCw,
  Sliders,
  Send,
  BookOpen,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useEmpowerment } from "../context/EmpowermentContext";

interface SedekahTransaction {
  id: string;
  date: string;
  time: string;
  amount: number;
  program: string;
  method: string;
  status: "Berhasil" | "Auto-Debited" | "Manual 1-Tap";
  prayerWish?: string;
}

interface SedekahSubuhConfig {
  isEnabled: boolean;
  dailyAmount: number;
  customAmount: string;
  scheduledTime: string; // "04:45" | "05:15" | "05:45" | "custom"
  customTime: string;
  programId: string;
  paymentMethod: "dompet-syariah" | "qris-autodebit" | "bsi-va" | "muamalat-va" | "manual-reminder";
  browserNotification: boolean;
  soundAlert: boolean;
  phoneWhatsapp: string;
  personalPrayer: string;
}

const PROGRAM_OPTIONS = [
  {
    id: "operasional-qardh",
    name: "Operasional Penyaluran Qardhul Hasan (0% Riba)",
    desc: "Membantu biaya verifikasi fiqih, pembinaan mustahiq, dan audit syariah permodalan korban PHK.",
    tag: "Paling Utama",
    color: "emerald",
  },
  {
    id: "dapur-berkah",
    name: "Dapur Berkah & Sembako Darurat PHK",
    desc: "Suplai beras, telur, minyak goreng, dan lauk siap saji bagi keluarga korban PHK pra-sejahtera.",
    tag: "Kebutuhan Darurat",
    color: "amber",
  },
  {
    id: "beasiswa-skill",
    name: "Beasiswa Pelatihan Kerja & Green Skills",
    desc: "Subsidi sertifikasi halal, pelatihan ternak maggot/aquaponik, dan kursus digital marketing wirausaha.",
    tag: "Investasi SDM",
    color: "teal",
  },
  {
    id: "dakwah-tv",
    name: "Pemeliharaan Server & Siaran TV Dakwah Umat",
    desc: "Mendukung kelancaran siaran live edukasi syariah dan kajian muamalah di global.islamicity.tv.",
    tag: "Dakwah Digital",
    color: "blue",
  },
  {
    id: "semua-program",
    name: "Baitul Maal Terpadu (Semua Program Berkah)",
    desc: "Alokasi fleksibel sesuai skala prioritas mendesak asnaf fakir, miskin, dan gharimin.",
    tag: "Terpadu",
    color: "slate",
  },
];

const PRESET_AMOUNTS = [
  { value: 2000, label: "Rp 2.000", monthly: "Rp 60.000 / bln", desc: "Ringan & Istiqomah" },
  { value: 5000, label: "Rp 5.000", monthly: "Rp 150.000 / bln", desc: "Paling Populer", popular: true },
  { value: 10000, label: "Rp 10.000", monthly: "Rp 300.000 / bln", desc: "Keluarga Berkah" },
  { value: 25000, label: "Rp 25.000", monthly: "Rp 750.000 / bln", desc: "Pemberdayaan Nyata" },
  { value: 50000, label: "Rp 50.000", monthly: "Rp 1.500.000 / bln", desc: "Sultan Berjamaah" },
];

const TIME_OPTIONS = [
  { id: "04:45", label: "04:45 WIB", note: "Adzan Subuh & Fajar Shodiq" },
  { id: "05:15", label: "05:15 WIB", note: "Pasca Shalat & Dzikir Pagi (Dianjurkan)", recommended: true },
  { id: "05:45", label: "05:45 WIB", note: "Menjelang Terbit Matahari (Syuruq)" },
  { id: "custom", label: "Waktu Khusus", note: "Tentukan Jam Sendiri" },
];

const HAJAT_PRESETS = [
  "Semoga Allah membuka pintu rezeki yang berkah, halal, dan berlimpah untuk keluarga kami.",
  "Ya Allah, lindungi keluarga kami dari jeratan utang riba & berikan kemudahan usaha baru.",
  "Semoga sedekah subuh ini menjadi wasilah kesembuhan dan tolak bala bagi keluarga kami.",
  "Ya Allah, gantikan mata pencaharian yang hilang dengan jalan rezeki yang lebih mulia dan bertakwa.",
];

export const SedekahSubuhSection: React.FC = () => {
  // Local storage key
  const STORAGE_CONFIG_KEY = "islamicity_sedekah_subuh_config_v1";
  const STORAGE_HISTORY_KEY = "islamicity_sedekah_subuh_history_v1";
  const STORAGE_STREAK_KEY = "islamicity_sedekah_subuh_streak_v1";

  // Initial state from localStorage
  const [config, setConfig] = useState<SedekahSubuhConfig>(() => {
    const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore fallback
      }
    }
    return {
      isEnabled: true,
      dailyAmount: 5000,
      customAmount: "",
      scheduledTime: "05:15",
      customTime: "05:00",
      programId: "operasional-qardh",
      paymentMethod: "qris-autodebit",
      browserNotification: true,
      soundAlert: true,
      phoneWhatsapp: "081234567890",
      personalPrayer: "Semoga Allah melipatgandakan rezeki halal dan melapangkan usaha jamaah PHK.",
    };
  });

  const [transactions, setTransactions] = useState<SedekahTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_HISTORY_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      {
        id: "SUB-0817",
        date: "17 Agu 2026",
        time: "05:15 WIB",
        amount: 5000,
        program: "Operasional Penyaluran Qardhul Hasan (0% Riba)",
        method: "QRIS Auto-Debit",
        status: "Auto-Debited",
        prayerWish: "Semoga berkah pembuka rizki dan tolak bala.",
      },
      {
        id: "SUB-0816",
        date: "16 Agu 2026",
        time: "05:15 WIB",
        amount: 5000,
        program: "Dapur Berkah & Sembako Darurat PHK",
        method: "QRIS Auto-Debit",
        status: "Auto-Debited",
      },
      {
        id: "SUB-0815",
        date: "15 Agu 2026",
        time: "05:20 WIB",
        amount: 10000,
        program: "Operasional Penyaluran Qardhul Hasan (0% Riba)",
        method: "Manual 1-Tap",
        status: "Berhasil",
      },
      {
        id: "SUB-0814",
        date: "14 Agu 2026",
        time: "05:15 WIB",
        amount: 5000,
        program: "Beasiswa Pelatihan Kerja & Green Skills",
        method: "QRIS Auto-Debit",
        status: "Auto-Debited",
      },
    ];
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_STREAK_KEY);
    return saved ? parseInt(saved, 10) || 14 : 14;
  });

  const { awardPoints } = useEmpowerment();

  // UI Interactive States
  const [isSavedBanner, setIsSavedBanner] = useState(false);
  const [isTestNotifModal, setIsTestNotifModal] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<string>(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "default"
  );
  const [isDonatingNow, setIsDonatingNow] = useState(false);
  const [todayDonated, setTodayDonated] = useState(false);
  const [activeTab, setActiveTab] = useState<"jadwal" | "riwayat" | "fadhilah">("jadwal");

  // Save config to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
  }, [config]);

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // Save streak to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_STREAK_KEY, streakDays.toString());
  }, [streakDays]);

  // Sync with SedekahSubuhWidget events
  useEffect(() => {
    const handleSync = () => {
      const savedStreak = localStorage.getItem(STORAGE_STREAK_KEY);
      if (savedStreak) setStreakDays(parseInt(savedStreak, 10) || 14);
      const savedTx = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (savedTx) {
        try {
          setTransactions(JSON.parse(savedTx));
        } catch (e) {
          // ignore
        }
      }
      const lastDate = localStorage.getItem("islamicity_sedekah_subuh_last_date_v1");
      const todayStr = new Date().toISOString().slice(0, 10);
      if (lastDate === todayStr) {
        setTodayDonated(true);
      }
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("islamicity_sedekah_subuh_event", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("islamicity_sedekah_subuh_event", handleSync);
    };
  }, []);

  const effectiveAmount = config.customAmount
    ? parseInt(config.customAmount, 10) || 0
    : config.dailyAmount;

  const totalDonated = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Play peaceful Islamic chime via Web Audio API
  const playSubuhChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const now = ctx.currentTime;
      
      // Peaceful pleasant melodic sequence (E4, G#4, B4, E5)
      const notes = [329.63, 415.3, 493.88, 659.25];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + index * 0.18);
        
        gain.gain.setValueAtTime(0, now + index * 0.18);
        gain.gain.linearRampToValueAtTime(0.18, now + index * 0.18 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.18 + 1.2);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + index * 0.18);
        osc.stop(now + index * 0.18 + 1.3);
      });
    } catch (err) {
      console.log("Audio chime skipped:", err);
    }
  };

  // Request browser notification permission
  const handleRequestNotificationPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        if (permission === "granted") {
          new Notification("🔔 Notifikasi Sedekah Subuh IslamiCity Aktif!", {
            body: "Alhamdulillah! Pengingat harian sedekah subuh & doa malaikat siap menyapa Anda setiap fajar.",
            icon: "/favicon.ico",
          });
          playSubuhChime();
        }
      } catch (err) {
        console.error("Notification permission error:", err);
      }
    }
  };

  // Test Notification simulation
  const handleTriggerTestNotification = () => {
    if (config.soundAlert) {
      playSubuhChime();
    }

    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification("🌅 Waktu Sedekah Subuh Baitul Maal", {
        body: `Bismillah! ${formatRupiah(effectiveAmount)} untuk ${
          PROGRAM_OPTIONS.find((p) => p.id === config.programId)?.name
        }. Doa Malaikat: "Ya Allah, berikan ganti bagi orang yang berinfaq!"`,
        icon: "/favicon.ico",
      });
    }

    setIsTestNotifModal(true);
  };

  // Manual 1-Tap Sedekah Subuh Now
  const handleDonateNow = () => {
    setIsDonatingNow(true);

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
      const dateStr = now.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

      const newTx: SedekahTransaction = {
        id: `SUB-${Date.now().toString().slice(-4)}`,
        date: dateStr,
        time: timeStr,
        amount: effectiveAmount,
        program: PROGRAM_OPTIONS.find((p) => p.id === config.programId)?.name || "Baitul Maal Terpadu",
        method: "Manual 1-Tap",
        status: "Berhasil",
        prayerWish: config.personalPrayer || "Semoga berkah pembuka rezeki berlimpah.",
      };

      setTransactions((prev) => [newTx, ...prev]);
      const nextStreak = streakDays + 1;
      setStreakDays(nextStreak);
      localStorage.setItem(STORAGE_STREAK_KEY, nextStreak.toString());
      localStorage.setItem("islamicity_sedekah_subuh_last_date_v1", now.toISOString().slice(0, 10));
      setTodayDonated(true);
      setIsDonatingNow(false);

      // Dispatch sync event so SedekahSubuhWidget updates instantly
      window.dispatchEvent(new CustomEvent("islamicity_sedekah_subuh_event"));

      // Award empowerment points for Infaq Sedekah Subuh
      awardPoints(
        50,
        "Sedekah Subuh Baitul Maal",
        "Infaq & Sedekah",
        `Tunaikan sedekah subuh berkah ${formatRupiah(effectiveAmount)} untuk operasional Baitul Maal.`,
        "subuh-warrior"
      );

      if (config.soundAlert) {
        playSubuhChime();
      }

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#f59e0b", "#065f46", "#34d399", "#fbbf24"],
      });
    }, 600);
  };

  const handleSaveSettings = () => {
    setIsSavedBanner(true);
    setTimeout(() => setIsSavedBanner(false), 3000);
  };

  return (
    <div
      id="sedekah-subuh-section"
      className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden transition-all space-y-0"
    >
      {/* Header Banner with Subuh Spiritual Atmosphere */}
      <div className="relative bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-950 p-6 sm:p-8 text-white overflow-hidden border-b border-emerald-800/60">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 -mb-10 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Gerakan Sedekah Subuh Berkelanjutan • Baitul Maal IslamiCity</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight leading-tight">
              Sedekah Subuh Otomatis: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200">
                Kunci Pembuka Rezeki & Penguat Baitul Maal
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Jadwalkan donasi harian berkah sebelum fajar untuk menjaga operasional penyaluran dana talangan{" "}
              <strong>Qardhul Hasan 0% Bunga</strong>, suplai dapur sembako darurat korban PHK, dan beasiswa kerja halal.
            </p>
          </div>

          {/* Quick Metrics & Streak Card */}
          <div className="bg-emerald-900/60 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-emerald-700/60 flex items-center justify-around gap-4 shrink-0 shadow-lg">
            <div className="text-center px-2">
              <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-bounce" />
                <span>Streak Subuh</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-serif">{streakDays} Hari</div>
              <p className="text-[10px] text-emerald-200/80 mt-0.5">Istiqomah Berinfaq</p>
            </div>

            <div className="w-px h-12 bg-emerald-700/60"></div>

            <div className="text-center px-2">
              <div className="flex items-center justify-center gap-1 text-emerald-300 font-bold text-xs uppercase tracking-wider mb-1">
                <Coins className="w-4 h-4 text-emerald-300" />
                <span>Terkumpul</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 font-serif">
                {formatRupiah(totalDonated)}
              </div>
              <p className="text-[10px] text-emerald-200/80 mt-0.5">{transactions.length}x Donasi Tercatat</p>
            </div>
          </div>
        </div>

        {/* Hadith Quote Strip */}
        <div className="mt-6 pt-5 border-t border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-200/90">
          <div className="flex items-center gap-2 italic">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
            <span>
              "Setiap subuh dua malaikat berdoa: 'Ya Allah, berikanlah ganti bagi orang yang berinfaq...'" (HR. Bukhari & Muslim)
            </span>
          </div>
          <button
            onClick={() => setActiveTab("fadhilah")}
            className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 shrink-0 underline cursor-pointer text-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Baca Fadhilah & Niat Sedekah Subuh</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("jadwal")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "jadwal"
                ? "bg-emerald-800 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Pengaturan Jadwal & Notifikasi</span>
            {config.isEnabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("riwayat")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "riwayat"
                ? "bg-emerald-800 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Riwayat & Dampak ({transactions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("fadhilah")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "fadhilah"
                ? "bg-emerald-800 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Dalil, Doa & Fiqih Sedekah</span>
          </button>
        </div>

        {/* 1-Tap Sedekah Subuh Now Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDonateNow}
            disabled={isDonatingNow}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-4 h-4 fill-slate-950 text-slate-950 animate-pulse" />
            <span>
              {isDonatingNow ? "Memproses..." : todayDonated ? "Sedekah Lagi Hari Ini" : "Tunaikan Sedekah Subuh Sekarang"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Tab Contents */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* ================= TAB 1: PENGATURAN JADWAL ================= */}
        {activeTab === "jadwal" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Status Activation Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-md transition-all ${
                    config.isEnabled ? "bg-emerald-600" : "bg-slate-400"
                  }`}
                >
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      Status Sedekah Subuh Otomatis
                    </h3>
                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        config.isEnabled
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-slate-100 text-slate-600 border-slate-300"
                      }`}
                    >
                      {config.isEnabled ? "AKTIF SETIAP SUBUH" : "DIJEDA SEMENTARA"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Donasi sebesar <strong className="text-emerald-800">{formatRupiah(effectiveAmount)}</strong> akan disalurkan otomatis pada jam{" "}
                    <strong className="text-emerald-800">{config.scheduledTime === "custom" ? config.customTime : config.scheduledTime} WIB</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <button
                  onClick={() => setConfig((prev) => ({ ...prev, isEnabled: !prev.isEnabled }))}
                  className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    config.isEnabled ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                  role="switch"
                  aria-checked={config.isEnabled}
                >
                  <span
                    className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      config.isEnabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Grid 2 Columns: Nominal & Jadwal Waktu */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Nominal Donasi Harian */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        1. Nominal Donasi Harian
                      </h4>
                      <p className="text-[11px] text-slate-500">Pilih nominal yang ringan namun istiqomah</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                    Bebas Ubah Kapan Saja
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {PRESET_AMOUNTS.map((preset) => {
                    const isSelected = !config.customAmount && config.dailyAmount === preset.value;
                    return (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            dailyAmount: preset.value,
                            customAmount: "",
                          }))
                        }
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer relative ${
                          isSelected
                            ? "bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-500/20 text-emerald-950 font-bold"
                            : "bg-white border-slate-200 hover:border-emerald-300 text-slate-800"
                        }`}
                      >
                        {preset.popular && (
                          <span className="absolute -top-2 right-2 text-[9px] font-bold px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full shadow-2xs">
                            Favorit
                          </span>
                        )}
                        <div className="text-sm sm:text-base font-extrabold">{preset.label}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{preset.monthly}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount Input */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Atau Masukkan Nominal Kustom Sendiri (Rp):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                    <input
                      type="number"
                      placeholder="Contoh: 15000"
                      value={config.customAmount}
                      onChange={(e) =>
                        setConfig((prev) => ({ ...prev, customAmount: e.target.value }))
                      }
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm font-semibold text-slate-900"
                    />
                  </div>
                </div>

                {/* Projection Summary Box */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-center justify-between">
                  <span>Proyeksi Infaq 1 Bulan (30 Hari):</span>
                  <span className="font-extrabold text-emerald-800 text-sm">
                    {formatRupiah(effectiveAmount * 30)}
                  </span>
                </div>
              </div>

              {/* Card 2: Waktu Eksekusi Subuh */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        2. Waktu Donasi & Pengingat
                      </h4>
                      <p className="text-[11px] text-slate-500">Momen terbaik saat malaikat subuh turun</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded">
                    WIB (Waktu Indonesia Barat)
                  </span>
                </div>

                <div className="space-y-2.5">
                  {TIME_OPTIONS.map((time) => {
                    const isSelected = config.scheduledTime === time.id;
                    return (
                      <label
                        key={time.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-teal-50/90 border-teal-600 ring-2 ring-teal-500/20 text-teal-950 font-bold"
                            : "bg-white border-slate-200 hover:border-teal-300 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="subuh-time"
                            value={time.id}
                            checked={isSelected}
                            onChange={() =>
                              setConfig((prev) => ({ ...prev, scheduledTime: time.id }))
                            }
                            className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                          />
                          <div>
                            <div className="text-xs sm:text-sm font-bold flex items-center gap-2">
                              <span>{time.label}</span>
                              {time.recommended && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  Dianjurkan
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">{time.note}</div>
                          </div>
                        </div>
                      </label>
                    );
                  })}

                  {/* Custom Time Picker */}
                  {config.scheduledTime === "custom" && (
                    <div className="pt-2 pl-7">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Pilih Jam Kustom (HH:mm WIB):
                      </label>
                      <input
                        type="time"
                        value={config.customTime}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, customTime: e.target.value }))
                        }
                        className="px-3 py-2 rounded-xl border border-slate-300 focus:border-teal-500 font-bold text-slate-900 text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Grid 2 Columns: Alokasi Program Baitul Maal & Metode Pembayaran */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 3: Pilihan Alokasi Program Baitul Maal */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        3. Alokasi Dana Baitul Maal
                      </h4>
                      <p className="text-[11px] text-slate-500">Pilih program utama penerima manfaat</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {PROGRAM_OPTIONS.map((prog) => {
                    const isSelected = config.programId === prog.id;
                    return (
                      <label
                        key={prog.id}
                        className={`block p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-500/20 text-emerald-950"
                            : "bg-white border-slate-200 hover:border-emerald-300 text-slate-700"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="prog-target"
                            value={prog.id}
                            checked={isSelected}
                            onChange={() =>
                              setConfig((prev) => ({ ...prev, programId: prog.id }))
                            }
                            className="mt-1 w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                          />
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs sm:text-sm font-bold text-slate-900">
                                {prog.name}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0">
                                {prog.tag}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed">{prog.desc}</p>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Card 4: Metode Autodebit & Notifikasi Pengingat */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        4. Metode & Notifikasi Pengingat
                      </h4>
                      <p className="text-[11px] text-slate-500">Pengingat subuh otomatis ke gadget Anda</p>
                    </div>
                  </div>
                </div>

                {/* Payment / Execution Mode */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Pilihan Saluran Eksekusi:
                  </label>
                  <select
                    value={config.paymentMethod}
                    onChange={(e: any) =>
                      setConfig((prev) => ({ ...prev, paymentMethod: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 font-semibold text-xs sm:text-sm text-slate-900 bg-slate-50"
                  >
                    <option value="qris-autodebit">QRIS Auto-Debit (GoPay / OVO / ShopeePay / DANA)</option>
                    <option value="dompet-syariah">Dompet Infaq Berkah IslamiCity (Saldo Internal)</option>
                    <option value="bsi-va">BSI Virtual Account Auto-Debited (Bank Syariah Indonesia)</option>
                    <option value="muamalat-va">Bank Muamalat Virtual Account</option>
                    <option value="manual-reminder">Pengingat 1-Tap (Notifikasi Masuk, Eksekusi Manual)</option>
                  </select>
                </div>

                {/* Notification Toggles */}
                <div className="space-y-3 pt-2">
                  {/* Browser Web Push Notification */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-emerald-700">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Notifikasi Pop-up Web Browser
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {notificationPermission === "granted"
                            ? "Izin Browser Aktif (Akan Muncul Tepat Subuh)"
                            : "Perlu Izin Notifikasi Browser"}
                        </div>
                      </div>
                    </div>

                    {notificationPermission !== "granted" ? (
                      <button
                        type="button"
                        onClick={handleRequestNotificationPermission}
                        className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                      >
                        Izinkan
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Aktif
                      </span>
                    )}
                  </div>

                  {/* Sound Chime Alert */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-amber-700">
                        {config.soundAlert ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Suara Nada Pengingat Subuh (Chime Harmoni)
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Bunyi nada lembut saat waktu fajar tiba
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, soundAlert: !prev.soundAlert }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        config.soundAlert ? "bg-amber-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          config.soundAlert ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* WhatsApp Reminder Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Nomor WhatsApp untuk Ringkasan Laporan & Doa Harian:</span>
                    </label>
                    <input
                      type="tel"
                      value={config.phoneWhatsapp}
                      onChange={(e) =>
                        setConfig((prev) => ({ ...prev, phoneWhatsapp: e.target.value }))
                      }
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 text-xs sm:text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Test Notification Trigger */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleTriggerTestNotification}
                    className="w-full py-2.5 px-4 rounded-xl border border-dashed border-teal-400 bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Bell className="w-4 h-4 text-teal-700 animate-bounce" />
                    <span>Uji Coba Notifikasi & Suara Pengingat Sekarang</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Personal Prayer / Hajat Notes */}
            <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-200 text-amber-900">
                    <Heart className="w-5 h-5 fill-amber-700 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-950 text-sm sm:text-base">
                      Hajat Khusus & Doa Pribadi Anda Saat Sedekah Subuh
                    </h4>
                    <p className="text-[11px] text-amber-800">
                      Doa yang Anda tuliskan akan diaminkan oleh tim Baitul Maal dan para santri setiap subuh
                    </p>
                  </div>
                </div>
              </div>

              {/* Preset Prayers */}
              <div className="flex flex-wrap gap-2">
                {HAJAT_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, personalPrayer: preset }))}
                    className="text-[11px] px-3 py-1.5 rounded-full bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-medium transition-all text-left cursor-pointer"
                  >
                    "{preset.slice(0, 50)}..."
                  </button>
                ))}
              </div>

              <textarea
                rows={2}
                value={config.personalPrayer}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, personalPrayer: e.target.value }))
                }
                placeholder="Tuliskan permohonan hajat, kelapangan rezeki, kesembuhan, atau doa khusus Anda di sini..."
                className="w-full p-3 rounded-xl border border-amber-300 focus:border-emerald-500 text-xs sm:text-sm text-slate-900 bg-white"
              ></textarea>
            </div>

            {/* Save Buttons & Status Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pengaturan otomatis tersimpan di peramban dan sinkron dengan sistem Baitul Maal.</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Konfigurasi Jadwal</span>
                </button>
              </div>
            </div>

            {isSavedBanner && (
              <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>Alhamdulillah! Jadwal Sedekah Subuh & Preferensi Notifikasi berhasil diperbarui.</span>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: RIWAYAT & DAMPAK ================= */}
        {activeTab === "riwayat" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Impact Summary Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                  Total Sedekah Subuh
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950 mt-1 font-serif">
                  {formatRupiah(totalDonated)}
                </div>
                <p className="text-xs text-emerald-700 mt-1">100% dialokasikan ke Baitul Maal</p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                  Konsistensi / Streak
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-950 mt-1 font-serif">
                  {streakDays} Hari Subuh
                </div>
                <p className="text-xs text-amber-700 mt-1">Pahala istiqomah yang dicintai Allah</p>
              </div>

              <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200">
                <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                  Estimasi Jiwa Terbantu
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-teal-950 mt-1 font-serif">
                  {Math.max(1, Math.floor(totalDonated / 15000))} Keluarga PHK
                </div>
                <p className="text-xs text-teal-700 mt-1">Penerima paket pangan & modal Qardh</p>
              </div>
            </div>

            {/* Transactions Ledger Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-800">
                  Buku Catatan Amal Sedekah Subuh ({transactions.length} Transaksi)
                </h4>
                <span className="text-xs text-slate-500">Tersimpan Otomatis</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100/75 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Waktu</th>
                      <th className="py-3 px-4">Program Penyaluran</th>
                      <th className="py-3 px-4">Metode</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                          <div>{tx.date}</div>
                          <div className="text-[11px] text-slate-400 font-normal">{tx.time}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800">{tx.program}</div>
                          {tx.prayerWish && (
                            <div className="text-[11px] italic text-slate-500 mt-0.5">
                              "{tx.prayerWish}"
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                          {tx.method}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              tx.status === "Auto-Debited"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-teal-100 text-teal-800"
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-emerald-800 whitespace-nowrap">
                          {formatRupiah(tx.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: FADHILAH & DOA ================= */}
        {activeTab === "fadhilah" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Quran Verse */}
            <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  Firman Allah Subhanahu Wa Ta'ala: QS. Saba' [34:39]
                </span>
                <span className="bg-amber-200/70 px-2 py-0.5 rounded">Kalamullah</span>
              </div>
              <div className="text-right font-serif text-lg sm:text-xl text-emerald-950 leading-loose pt-1">
                وَمَا أَنْفَقْتُمْ مِنْ شَيْءٍ فَهُوَ يُخْلِفُهُ ۖ وَهُوَ خَيْرُ الرَّازِقِينَ
              </div>
              <p className="text-xs sm:text-sm italic text-amber-950 border-t border-amber-200 pt-2 leading-relaxed">
                "Dan apa saja yang kamu infakkan, Allah akan menggantinya dan Dialah Pemberi rezeki yang terbaik."
              </p>
            </div>

            {/* Hadith Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Doa Dua Malaikat Setiap Pagi (HR. Bukhari no. 1442)</span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Rasulullah ﷺ bersabda: <em>"Tidak ada suatu hari pun di mana seorang hamba bangun pada waktu pagi melainkan ada dua malaikat yang turun..."</em>. 
                  Malaikat pertama berdoa agar Allah mengganti dan melipatgandakan harta orang yang berinfaq di pagi hari.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-teal-50/80 border border-teal-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
                  <Sparkles className="w-4 h-4 text-teal-700" />
                  <span>Amalan Kecil yang Paling Dicintai Allah</span>
                </div>
                <p className="text-xs text-teal-900 leading-relaxed">
                  Rasulullah ﷺ bersabda: <em>"Amalan yang paling dicintai oleh Allah adalah amalan yang berkelanjutan (istiqomah) walaupun sedikit."</em> (HR. Bukhari & Muslim).
                  Sedekah Subuh Rp 2.000 atau Rp 5.000 setiap hari jauh lebih utama daripada jumlah besar yang hanya dilakukan sesekali.
                </p>
              </div>
            </div>

            {/* Niat & Lafadz Doa Sedekah Subuh */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
              <h4 className="font-bold text-amber-300 text-sm sm:text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Niat & Lafadz Doa Sedekah Subuh</span>
              </h4>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
                  <div className="text-emerald-400 font-bold text-xs">Lafadz Niat:</div>
                  <div className="text-right font-serif text-base sm:text-lg text-white">
                    نَوَيْتُ التَّقَرُّبَ إِلَى اللهِ تَعَالَى بِهَذِهِ الصَّدَقَةِ ابْتِغَاءَ مَرْضَاتِهِ
                  </div>
                  <div className="text-xs italic text-slate-300">
                    "Nawaitut taqorruba ilallahi ta'ala bi hadzihis shodaqoti ibtigho-a mardhotih."
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Artinya: "Saya berniat mendekatkan diri kepada Allah Ta'ala dengan sedekah ini semata-mata mencari ridho-Nya."
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
                  <div className="text-amber-400 font-bold text-xs">Doa Permohonan Keberkahan & Pengganti Harta:</div>
                  <div className="text-right font-serif text-base sm:text-lg text-white">
                    اللَّهُمَّ أَعْطِ مُنْفِقًا خَلَفًا وَأَصْلِحْ لِي شَأْنِي كُلَّهُ
                  </div>
                  <div className="text-xs italic text-slate-300">
                    "Allahumma a'thi munfiqan khalafa, wa ashlih lii sya'nii kullahu."
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Artinya: "Ya Allah, berikanlah ganti kepada orang yang berinfaq, dan perbaikilah segala urusanku."
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Test Notification Interactive Modal */}
      {isTestNotifModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-800">
                <Bell className="w-5 h-5 animate-pulse" />
                <span className="font-bold text-base">Preview Notifikasi Pengingat Subuh</span>
              </div>
              <button
                onClick={() => setIsTestNotifModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Notification Card Mock */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-[11px] text-emerald-400">
                <span className="font-bold">🌅 global.islamicity.tv • Fajar Tiba</span>
                <span>{config.scheduledTime === "custom" ? config.customTime : config.scheduledTime} WIB</span>
              </div>
              <div className="space-y-1">
                <h5 className="font-bold text-sm text-white font-serif">
                  Saatnya Sedekah Subuh Baitul Maal ({formatRupiah(effectiveAmount)})
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "Ya Allah, berikanlah ganti bagi orang yang berinfaq di waktu subuh ini."
                </p>
                <div className="text-[11px] text-amber-300 pt-1">
                  🎯 Target: {PROGRAM_OPTIONS.find((p) => p.id === config.programId)?.name}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Ini adalah simulasi tampilan pengingat harian yang akan muncul otomatis di layar Anda setiap waktu subuh.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsTestNotifModal(false);
                  handleDonateNow();
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                Tunaikan Donasi Sekarang
              </button>
              <button
                onClick={() => setIsTestNotifModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
