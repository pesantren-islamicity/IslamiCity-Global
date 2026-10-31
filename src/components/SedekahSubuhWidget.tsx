import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Flame,
  Bell,
  Sparkles,
  CheckCircle2,
  Clock,
  Volume2,
  VolumeX,
  Coins,
  ChevronRight,
  TrendingUp,
  Award,
  Sun,
  ShieldCheck,
  Zap,
  Info,
  BookOpen,
  Calendar,
  Share2,
  Check,
  Sliders,
  AlertCircle
} from "lucide-react";
import confetti from "canvas-confetti";
import { useEmpowerment } from "../context/EmpowermentContext";

interface SedekahSubuhWidgetProps {
  onOpenDetailedSettings?: () => void;
}

interface Milestone {
  days: number;
  bonusPoints: number;
  title: string;
  badgeName: string;
  badgeIcon: string;
}

const STREAK_MILESTONES: Milestone[] = [
  { days: 7, bonusPoints: 50, title: "Peka Fajar (7 Hari)", badgeName: "Istiqomah 7 Hari", badgeIcon: "🌱" },
  { days: 14, bonusPoints: 100, title: "Penjaga Subuh (14 Hari)", badgeName: "Ksatria 14 Hari", badgeIcon: "🌅" },
  { days: 21, bonusPoints: 150, title: "Pejuang Berkah (21 Hari)", badgeName: "Mujahid Subuh", badgeIcon: "⭐" },
  { days: 30, bonusPoints: 300, title: "Penakluk Fajar Utama (30 Hari)", badgeName: "Ksatria Sedekah Subuh", badgeIcon: "👑" },
  { days: 40, bonusPoints: 500, title: "Benteng Baitul Maal (40 Hari)", badgeName: "Waliyyul Infaq", badgeIcon: "💎" },
];

const PRESET_AMOUNTS = [
  { amount: 2000, label: "Rp 2.000", points: 50, desc: "Ringan & Istiqomah" },
  { amount: 5000, label: "Rp 5.000", points: 75, desc: "Paling Populer", popular: true },
  { amount: 10000, label: "Rp 10.000", points: 100, desc: "Keluarga Berkah" },
  { amount: 25000, label: "Rp 25.000", points: 150, desc: "Pemberdayaan Nyata" },
  { amount: 50000, label: "Rp 50.000", points: 250, desc: "Sultan Berjamaah" },
];

const TARGET_PROGRAMS = [
  {
    id: "operasional-qardh",
    name: "Modal Qardhul Hasan (0% Riba)",
    icon: "🤝",
    desc: "Dana talangan bergulir tanpa bunga untuk korban PHK mulai usaha mandiri.",
  },
  {
    id: "dapur-berkah",
    name: "Dapur Sembako Darurat PHK",
    icon: "🍲",
    desc: "Suplai beras, telur & makanan harian keluarga pekerja terdampak.",
  },
  {
    id: "beasiswa-skill",
    name: "Beasiswa Pelatihan Kerja & Green Skills",
    icon: "🎓",
    desc: "Subsidi pelatihan vokasi, ternak maggot, hidroponik & digital wirausaha.",
  },
];

export const SedekahSubuhWidget: React.FC<SedekahSubuhWidgetProps> = ({ onOpenDetailedSettings }) => {
  const { awardPoints } = useEmpowerment();

  // Storage keys matching SedekahSubuhSection
  const STORAGE_STREAK_KEY = "islamicity_sedekah_subuh_streak_v1";
  const STORAGE_CONFIG_KEY = "islamicity_sedekah_subuh_config_v1";
  const STORAGE_HISTORY_KEY = "islamicity_sedekah_subuh_history_v1";
  const STORAGE_LAST_DONATION_KEY = "islamicity_sedekah_subuh_last_date_v1";
  const STORAGE_BEST_STREAK_KEY = "islamicity_sedekah_subuh_best_streak_v1";
  const STORAGE_TOTAL_POINTS_KEY = "islamicity_sedekah_subuh_total_points_v1";

  // State
  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_STREAK_KEY);
    return saved ? parseInt(saved, 10) || 14 : 14;
  });

  const [bestStreak, setBestStreak] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_BEST_STREAK_KEY);
    return saved ? parseInt(saved, 10) || 28 : 28;
  });

  const [totalSubuhPoints, setTotalSubuhPoints] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_TOTAL_POINTS_KEY);
    return saved ? parseInt(saved, 10) || 850 : 850;
  });

  // Selected Donation State
  const [selectedAmount, setSelectedAmount] = useState<number>(5000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("operasional-qardh");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [todayDonated, setTodayDonated] = useState<boolean>(false);
  const [isReminderActive, setIsReminderActive] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<string>("05:15");
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);

  // Modal & Tabs
  const [showHadithModal, setShowHadithModal] = useState<boolean>(false);
  const [showReminderSettingsModal, setShowReminderSettingsModal] = useState<boolean>(false);
  const [showTestAlertModal, setShowTestAlertModal] = useState<boolean>(false);
  const [recentDonationSuccess, setRecentDonationSuccess] = useState<boolean>(false);
  const [unlockedMilestone, setUnlockedMilestone] = useState<Milestone | null>(null);

  // Time & Subuh Detection
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
  const [isSubuhWindow, setIsSubuhWindow] = useState<boolean>(false);
  const [countdownToSubuh, setCountdownToSubuh] = useState<string>("");

  // Check today's donation state from storage
  useEffect(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const lastDate = localStorage.getItem(STORAGE_LAST_DONATION_KEY);
    if (lastDate === todayStr) {
      setTodayDonated(true);
    }
  }, []);

  // Listen to external sync updates
  useEffect(() => {
    const handleSync = () => {
      const savedStreak = localStorage.getItem(STORAGE_STREAK_KEY);
      if (savedStreak) setStreakDays(parseInt(savedStreak, 10) || 14);
      const todayStr = new Date().toISOString().slice(0, 10);
      const lastDate = localStorage.getItem(STORAGE_LAST_DONATION_KEY);
      if (lastDate === todayStr) setTodayDonated(true);
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("islamicity_sedekah_subuh_event", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("islamicity_sedekah_subuh_event", handleSync);
    };
  }, []);

  // Live Clock & Subuh Window calculation
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTimeStr(timeStr + " WIB");

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentTotalMin = hours * 60 + minutes;

      // Subuh window typically 04:30 to 06:15 (270 min to 375 min)
      const subuhStartMin = 4 * 60 + 30; // 04:30
      const subuhEndMin = 6 * 60 + 15;   // 06:15

      const isInSubuh = currentTotalMin >= subuhStartMin && currentTotalMin <= subuhEndMin;
      setIsSubuhWindow(isInSubuh);

      // Calculate countdown to next Subuh (04:45 WIB = 285 min)
      let targetMin = subuhStartMin;
      let diffMin = 0;
      if (currentTotalMin < subuhStartMin) {
        diffMin = subuhStartMin - currentTotalMin;
      } else {
        // Next day Subuh
        diffMin = 24 * 60 - currentTotalMin + subuhStartMin;
      }

      const diffHours = Math.floor(diffMin / 60);
      const diffMins = diffMin % 60;
      setCountdownToSubuh(`${diffHours} jam ${diffMins} menit`);
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Soft Islamic harmonic chime via Web Audio API
  const playHarmonicChime = () => {
    if (!isSoundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Gentle peaceful ascending Islamic chord (F4, A4, C5, F5, A5)
      const frequencies = [349.23, 440.0, 523.25, 698.46, 880.0];
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.16);

        gain.gain.setValueAtTime(0, now + idx * 0.16);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.16 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.16 + 1.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.16);
        osc.stop(now + idx * 0.16 + 1.5);
      });
    } catch (e) {
      console.log("Audio chime error:", e);
    }
  };

  // Next milestone calculation
  const nextMilestone =
    STREAK_MILESTONES.find((m) => m.days > streakDays) || STREAK_MILESTONES[STREAK_MILESTONES.length - 1];
  const previousMilestoneDays =
    STREAK_MILESTONES.slice()
      .reverse()
      .find((m) => m.days <= streakDays)?.days || 0;

  const milestoneProgress = Math.min(
    100,
    Math.max(
      0,
      ((streakDays - previousMilestoneDays) /
        ((nextMilestone.days - previousMilestoneDays) || 1)) *
        100
    )
  );

  const daysToNextMilestone = Math.max(0, nextMilestone.days - streakDays);

  // Compute effective amount
  const effectiveAmount = customAmount ? parseInt(customAmount, 10) || selectedAmount : selectedAmount;

  // Base points for donation
  const basePoints =
    effectiveAmount >= 50000
      ? 250
      : effectiveAmount >= 25000
      ? 150
      : effectiveAmount >= 10000
      ? 100
      : effectiveAmount >= 5000
      ? 75
      : 50;

  // Format currency
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Handle 1-Tap Sedekah Subuh
  const handleTunaikanSedekah = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const newStreak = streakDays + 1;
      const todayStr = new Date().toISOString().slice(0, 10);
      const now = new Date();
      const dateStr = now.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
      const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

      setStreakDays(newStreak);
      localStorage.setItem(STORAGE_STREAK_KEY, newStreak.toString());
      localStorage.setItem(STORAGE_LAST_DONATION_KEY, todayStr);
      setTodayDonated(true);

      // Update best streak if exceeded
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
        localStorage.setItem(STORAGE_BEST_STREAK_KEY, newStreak.toString());
      }

      // Check if a milestone was hit
      const hitMilestone = STREAK_MILESTONES.find((m) => m.days === newStreak);
      let awardedPoints = basePoints;

      if (hitMilestone) {
        awardedPoints += hitMilestone.bonusPoints;
        setUnlockedMilestone(hitMilestone);
      }

      const newTotalPoints = totalSubuhPoints + awardedPoints;
      setTotalSubuhPoints(newTotalPoints);
      localStorage.setItem(STORAGE_TOTAL_POINTS_KEY, newTotalPoints.toString());

      // Save to transaction history
      try {
        const prog = TARGET_PROGRAMS.find((p) => p.id === selectedProgram)?.name || "Baitul Maal Terpadu";
        const existingRaw = localStorage.getItem(STORAGE_HISTORY_KEY);
        const existingList = existingRaw ? JSON.parse(existingRaw) : [];
        const newTx = {
          id: `SUB-${Date.now().toString().slice(-4)}`,
          date: dateStr,
          time: timeStr,
          amount: effectiveAmount,
          program: prog,
          method: "Sedekah Subuh 1-Tap",
          status: "Berhasil",
          prayerWish: "Semoga Allah melipatgandakan rezeki dan memelihara istiqomah subuh.",
        };
        localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify([newTx, ...existingList]));
      } catch (err) {
        console.error("Failed saving transaction", err);
      }

      // Notify external components
      window.dispatchEvent(new CustomEvent("islamicity_sedekah_subuh_event"));

      // Award points into global empowerment context
      awardPoints(
        awardedPoints,
        `Sedekah Subuh Streak Hari Ke-${newStreak}`,
        "Infaq & Sedekah",
        `Sedekah Subuh berkah ${formatRupiah(effectiveAmount)} untuk Baitul Maal. Streak ${newStreak} Hari berturut-turut!`,
        hitMilestone ? "subuh-warrior" : undefined
      );

      // Sound & Confetti
      playHarmonicChime();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#10b981", "#34d399", "#fbbf24", "#047857"],
      });

      setIsProcessing(false);
      setRecentDonationSuccess(true);
      setTimeout(() => setRecentDonationSuccess(false), 8000);
    }, 700);
  };

  // Trigger test reminder alert
  const handleTestReminderAlert = () => {
    playHarmonicChime();

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("🌅 Waktu Sedekah Subuh Tiba! (Pengingat Fajar)", {
          body: `Bismillah! Mari raih doa dua malaikat pagi ini. Sedekah berkah mulai Rp 2.000 untuk mustahiq & korban PHK.`,
          icon: "/favicon.ico",
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }

    setShowTestAlertModal(true);
  };

  // 7-Day Day-of-Week Calendar Array
  const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Ahd"];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // 0 = Mon, 6 = Sun

  return (
    <div
      id="sedekah-subuh-widget"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 border-2 border-amber-500/30 shadow-2xl text-white p-5 sm:p-7 space-y-6 transition-all"
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 -mb-16 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Bar: Morning Status & Automatic Reminder Indicator */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-800/60">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Badge Fajar */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
            <Sun className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: "12s" }} />
            <span>Pengingat Sedekah Subuh Otomatis</span>
          </div>

          {/* Subuh Live Window Badge */}
          {isSubuhWindow ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-xs font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Waktu Fajar Berkah Sedang Berlangsung</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/80 text-emerald-300/90 border border-emerald-700/50 text-xs font-medium">
              <Clock className="w-3 h-3 text-amber-300" />
              <span>Fajar Berikutnya: {countdownToSubuh} (04:30 WIB)</span>
            </div>
          )}

          <div className="text-xs text-emerald-300/80 font-mono hidden sm:inline-block">
            {currentTimeStr}
          </div>
        </div>

        {/* Audio Alert & Reminder Quick Toggles */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setIsSoundEnabled((prev) => !prev)}
            className={`p-2 rounded-xl text-xs flex items-center gap-1.5 font-semibold border transition-all cursor-pointer ${
              isSoundEnabled
                ? "bg-amber-500/20 border-amber-400/40 text-amber-300"
                : "bg-slate-900/60 border-slate-700 text-slate-400"
            }`}
            title={isSoundEnabled ? "Suara Harmoni Fajar Aktif" : "Suara Dibisukan"}
          >
            {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[11px] hidden sm:inline">{isSoundEnabled ? "Suara Aktif" : "Bisu"}</span>
          </button>

          <button
            onClick={handleTestReminderAlert}
            className="px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700/80 text-emerald-100 border border-emerald-600/50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Bell className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
            <span>Simulasi Pengingat</span>
          </button>

          <button
            onClick={() => setShowReminderSettingsModal(true)}
            className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border border-emerald-700/50 text-xs transition-colors cursor-pointer"
            title="Pengaturan Jam Pengingat Otomatis"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Side (Streak & Milestones) / Right Side (1-Tap Sedekah & Points) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ================= LEFT SECTION: PELACAKAN STREAK SUBUH (7 COLS) ================= */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5 bg-slate-900/60 backdrop-blur-md rounded-2xl p-5 border border-emerald-700/50 shadow-md">
          {/* Streak Overview Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative shrink-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 p-0.5 shadow-lg flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center">
                    <Flame className="w-6 h-6 sm:w-7 sm:h-7 fill-amber-400 text-orange-500 animate-bounce" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-xs">
                  {streakDays} Hari
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                    Pelacak Streak Sedekah Subuh
                  </span>
                  {todayDonated ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Hari Ini Tertunaikan
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-300" /> Belum Sedekah Hari Ini
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white font-serif mt-0.5 flex items-center gap-2">
                  <span>Streak Istiqomah: {streakDays} Hari</span>
                  <span className="text-xs font-normal text-emerald-300/80 font-sans">
                    (Rekor: {bestStreak} Hari)
                  </span>
                </h3>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  Setiap subuh berturut-turut menambah kelipatan <strong className="text-amber-300">Poin Keberkahan</strong> untuk naik Level Pemberdayaan!
                </p>
              </div>
            </div>

            {/* Total Points Collected from Subuh */}
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-700/60 text-right shrink-0">
              <div className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider">
                Total Poin Subuh
              </div>
              <div className="text-lg sm:text-xl font-black text-amber-300 font-serif flex items-center justify-end gap-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>+{totalSubuhPoints} Poin</span>
              </div>
            </div>
          </div>

          {/* 7-Day Day-of-Week Interactive Visual Calendar */}
          <div className="space-y-2 bg-slate-950/70 p-3.5 rounded-xl border border-emerald-800/60">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Riwayat 7 Hari Terakhir Pekan Ini:</span>
              </span>
              <span className="text-[11px] text-emerald-300/90 font-medium">
                {todayDonated ? "Alhamdulillah, istiqomah terjaga!" : "Tunaikan subuh untuk jaga api streak!"}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1">
              {dayNames.map((dayName, idx) => {
                const isToday = idx === todayDayIndex;
                const isPast = idx < todayDayIndex;
                // For demonstration, past days within streak are active, today depends on todayDonated
                const isCompleted = isPast ? true : isToday ? todayDonated : false;

                return (
                  <div
                    key={dayName}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl text-center border transition-all ${
                      isCompleted
                        ? "bg-gradient-to-b from-amber-500/20 to-emerald-900/40 border-amber-400/50 text-white shadow-xs"
                        : isToday
                        ? "bg-amber-500/10 border-amber-400/80 text-amber-200 ring-2 ring-amber-400/30 animate-pulse"
                        : "bg-slate-900/60 border-slate-800 text-slate-500"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase">{dayName}</span>
                    <div className="mt-1 flex items-center justify-center">
                      {isCompleted ? (
                        <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ) : isToday ? (
                        <Clock className="w-4 h-4 text-amber-300" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-slate-700"></div>
                      )}
                    </div>
                    <span className="text-[9px] mt-1 font-semibold">
                      {isCompleted ? "Berkah" : isToday ? "Hari Ini" : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Milestone Progress Bar to Next Bonus Points */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Milestone Berikutnya: <strong className="text-amber-300 font-bold">{nextMilestone.title}</strong>
                </span>
              </span>
              <span className="font-extrabold text-amber-300">
                {daysToNextMilestone === 0
                  ? "Tercapai Hari Ini! 🎉"
                  : `${daysToNextMilestone} Hari Lagi (+${nextMilestone.bonusPoints} Poin Bonus)`}
              </span>
            </div>

            {/* Bar */}
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-emerald-800/60 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-teal-300 rounded-full transition-all duration-700"
                style={{ width: `${milestoneProgress}%` }}
              ></div>
            </div>

            {/* Milestones pill indicators */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-0.5">
              <span>7 Hari (+50 Poin)</span>
              <span>14 Hari (+100 Poin)</span>
              <span>21 Hari (+150 Poin)</span>
              <span className="text-amber-300 font-bold">30 Hari (+300 Poin + Gelar)</span>
            </div>
          </div>

          {/* Bottom Link: Hadith & Fadhilah */}
          <div className="pt-2 border-t border-emerald-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-200/90">
            <div className="flex items-center gap-2 italic text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
              <span>"Tidak ada hari saat pagi hamba melainkan 2 malaikat berdoa meminta ganti harta..." (HR. Bukhari)</span>
            </div>
            <button
              onClick={() => setShowHadithModal(true)}
              className="text-amber-300 hover:text-amber-200 font-bold underline cursor-pointer text-[11px] flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3" />
              <span>Fadhilah & Doa</span>
            </button>
          </div>
        </div>

        {/* ================= RIGHT SECTION: 1-TAP SEDEKAH & TAMBAH POIN (5 COLS) ================= */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4 bg-gradient-to-b from-slate-900/90 to-emerald-950/90 backdrop-blur-md rounded-2xl p-5 border border-amber-500/40 shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-400 text-slate-950">
                  <Zap className="w-4 h-4 fill-slate-950" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-white font-serif">
                    Tunaikan Sedekah Subuh
                  </h4>
                  <p className="text-[11px] text-emerald-200/80">Raih Poin Keberkahan & Doa Malaikat Fajar</p>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                +{basePoints} Poin
              </span>
            </div>

            {/* Preset Amount Chips */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 block">
                Pilih Nominal Sedekah Subuh:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {PRESET_AMOUNTS.slice(0, 3).map((item) => (
                  <button
                    key={item.amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(item.amount);
                      setCustomAmount("");
                    }}
                    className={`py-2 px-1.5 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                      !customAmount && selectedAmount === item.amount
                        ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black"
                        : "bg-slate-900/80 hover:bg-slate-800 text-white border-slate-700"
                    }`}
                  >
                    <div>{item.label}</div>
                    <div className="text-[9px] opacity-80">+{item.points} Poin</div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                {PRESET_AMOUNTS.slice(3, 5).map((item) => (
                  <button
                    key={item.amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(item.amount);
                      setCustomAmount("");
                    }}
                    className={`py-2 px-2 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                      !customAmount && selectedAmount === item.amount
                        ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black"
                        : "bg-slate-900/80 hover:bg-slate-800 text-white border-slate-700"
                    }`}
                  >
                    <div>{item.label}</div>
                    <div className="text-[9px] opacity-80">+{item.points} Poin</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Field */}
            <div className="pt-1">
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                <input
                  type="number"
                  placeholder="Nominal kustom (Contoh: 15000)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-amber-400 text-xs font-bold text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Program Selector */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-bold text-slate-300 block">
                Target Penyaluran Baitul Maal:
              </label>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-amber-400 text-xs font-semibold text-emerald-200"
              >
                {TARGET_PROGRAMS.map((prog) => (
                  <option key={prog.id} value={prog.id}>
                    {prog.icon} {prog.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleTunaikanSedekah}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm sm:text-base shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 transform active:scale-98"
            >
              <Flame className="w-5 h-5 fill-slate-950 text-slate-950 animate-bounce" />
              <span>
                {isProcessing
                  ? "Menyalurkan Sedekah Subuh..."
                  : todayDonated
                  ? `Sedekah Lagi Hari Ini (${formatRupiah(effectiveAmount)})`
                  : `Tunaikan Sedekah Subuh (${formatRupiah(effectiveAmount)})`}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 font-extrabold ml-1">
                +{basePoints} Poin
              </span>
            </button>

            {/* Detailed Config Jump Button */}
            <button
              onClick={() => {
                if (onOpenDetailedSettings) {
                  onOpenDetailedSettings();
                } else {
                  const el = document.getElementById("sedekah-subuh-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-emerald-800/40"
            >
              <span>Buka Konfigurasi Autodebit, WA & Buku Kas Amal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {recentDonationSuccess && (
        <div className="relative z-10 p-4 rounded-2xl bg-gradient-to-r from-emerald-900/90 via-teal-900/90 to-emerald-900/90 border border-emerald-400/60 shadow-xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-extrabold text-sm text-white font-serif flex items-center gap-2">
                <span>Alhamdulillah! Sedekah Subuh Berhasil Tertunaikan</span>
                <span className="text-amber-300 text-xs font-sans font-bold">+{basePoints} Poin Berdaya Ditambahkan</span>
              </h5>
              <p className="text-xs text-emerald-200 mt-0.5">
                Streak Anda bertambah menjadi <strong className="text-amber-300 font-bold">{streakDays} Hari</strong>. Doa Malaikat: "Ya Allah, gantikanlah harta bagi orang yang berinfaq di waktu pagi!"
              </p>
            </div>
          </div>

          <div className="shrink-0 hidden sm:block">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950">
              🔥 Streak Aktif
            </span>
          </div>
        </div>
      )}

      {/* Milestone Unlocked Modal */}
      {unlockedMilestone && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-amber-400 shadow-2xl text-center space-y-4 animate-in zoom-in-95 text-white">
            <div className="text-5xl">{unlockedMilestone.badgeIcon}</div>
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Milestone Keberkahan Terbuka!
              </div>
              <h3 className="text-2xl font-black font-serif text-white">
                {unlockedMilestone.title}
              </h3>
              <p className="text-xs text-emerald-200 leading-relaxed">
                Masya Allah! Anda telah konsisten bersedekah subuh selama <strong>{unlockedMilestone.days} Hari Berturut-turut</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-sm font-bold flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Bonus +{unlockedMilestone.bonusPoints} Poin Keberkahan Ditambahkan!</span>
            </div>

            <button
              onClick={() => setUnlockedMilestone(null)}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm cursor-pointer shadow-lg"
            >
              Alhamdulillah, Teruskan Istiqomah!
            </button>
          </div>
        </div>
      )}

      {/* Reminder Settings Modal */}
      {showReminderSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl text-slate-900 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-800">
                <Bell className="w-5 h-5 text-emerald-700" />
                <h4 className="font-bold text-base">Atur Jadwal Pengingat Pagi Subuh</h4>
              </div>
              <button
                onClick={() => setShowReminderSettingsModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pilih Waktu Pengingat Subuh:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { time: "04:45", label: "04:45 WIB (Adzan Fajar)" },
                    { time: "05:00", label: "05:00 WIB (Shalat Subuh)" },
                    { time: "05:15", label: "05:15 WIB (Pasca Dzikir)" },
                    { time: "05:30", label: "05:30 WIB (Fajar Emas)" },
                  ].map((t) => (
                    <button
                      key={t.time}
                      type="button"
                      onClick={() => setReminderTime(t.time)}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        reminderTime === t.time
                          ? "bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-500/20"
                          : "bg-white border-slate-200 text-slate-700 hover:border-emerald-300"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Nada Harmoni Chime:</span>
                  <button
                    onClick={() => setIsSoundEnabled((prev) => !prev)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      isSoundEnabled ? "bg-amber-400 text-slate-950" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isSoundEnabled ? "Aktif" : "Non-Aktif"}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Bunyi nada fajar lembut saat waktu sedekah subuh tiba.
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowReminderSettingsModal(false);
                  handleTestReminderAlert();
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                Simpan & Uji Coba Pengingat
              </button>
              <button
                onClick={() => setShowReminderSettingsModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Alert Modal */}
      {showTestAlertModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <Bell className="w-5 h-5 text-amber-500 animate-pulse" />
                <span>Simulasi Notifikasi Sedekah Subuh</span>
              </div>
              <button
                onClick={() => setShowTestAlertModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Notification Card Mock */}
            <div className="p-4 rounded-2xl bg-slate-950 text-white space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold">
                <span>🌅 global.islamicity.tv • Fajar Telah Tiba</span>
                <span>{reminderTime} WIB</span>
              </div>
              <h5 className="font-bold text-sm text-white font-serif">
                Saatnya Sedekah Subuh ({formatRupiah(effectiveAmount)})
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Tidak ada satu subuh pun melainkan dua malaikat turun berdoa: 'Ya Allah, berikanlah ganti bagi orang yang berinfaq...'"
              </p>
              <div className="text-[11px] text-emerald-300 pt-1 font-semibold">
                🎯 Target: {TARGET_PROGRAMS.find((p) => p.id === selectedProgram)?.name}
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Pengingat ini akan berbunyi dan muncul setiap pukul <strong>{reminderTime} WIB</strong> di gawai Anda agar streak subuh dan poin keberkahan Anda terus berlipat ganda!
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowTestAlertModal(false);
                  handleTunaikanSedekah();
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer shadow-sm"
              >
                Tunaikan Sedekah Sekarang (+{basePoints} Poin)
              </button>
              <button
                onClick={() => setShowTestAlertModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hadith & Fadhilah Modal */}
      {showHadithModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl text-slate-900 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-base">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <span>Fadhilah & Doa Sedekah Subuh</span>
              </div>
              <button
                onClick={() => setShowHadithModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Hadith 1 */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>Doa Dua Malaikat Setiap Pagi (HR. Bukhari no. 1442)</span>
                <span className="bg-amber-200/70 px-2 py-0.5 rounded text-[10px]">Hadits Shahih</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">
                Rasulullah ﷺ bersabda: <em>"Tidak ada suatu hari pun di mana seorang hamba bangun pada waktu pagi melainkan ada dua malaikat yang turun. Malaikat pertama berdoa: 'Ya Allah, berikanlah ganti bagi orang yang berinfaq.' Sedangkan malaikat kedua berdoa: 'Ya Allah, berikanlah kehancuran bagi orang yang menahan hartanya.'"</em>
              </p>
            </div>

            {/* Hadith 2 */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <span>Amalan Istiqomah Paling Dicintai Allah (HR. Muslim no. 782)</span>
                <span className="bg-emerald-200/70 px-2 py-0.5 rounded text-[10px]">Hadits Shahih</span>
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed">
                Rasulullah ﷺ bersabda: <em>"Amalan yang paling dicintai oleh Allah Ta'ala adalah amalan yang kontinu (istiqomah berkelanjutan) meskipun sedikit."</em>
              </p>
            </div>

            {/* Lafadz Doa */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
              <div className="text-xs font-bold text-amber-300">Doa Permohonan Keberkahan Subuh:</div>
              <div className="text-right font-serif text-lg text-white leading-loose">
                اللَّهُمَّ أَعْطِ مُنْفِقًا خَلَفًا وَبَارِكْ لِي فِي رِزْقِي وَأَصْلِحْ شَأْنِي
              </div>
              <p className="text-xs italic text-slate-300">
                "Allahumma a'thi munfiqan khalafan, wa baarik lii fii rizqii wa ashlih sya'nii."
              </p>
              <p className="text-[11px] text-slate-400">
                Artinya: "Ya Allah, berikanlah ganti kepada orang yang berinfaq, berkahilah rezekiku, dan perbaikilah segala urusanku."
              </p>
            </div>

            <button
              onClick={() => setShowHadithModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
            >
              Tutup & Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
