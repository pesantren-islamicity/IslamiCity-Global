import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  Sparkles,
  Heart,
  Landmark,
  Users,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  Pause,
  Play,
  ArrowRight,
  TrendingUp,
  Clock,
  ChevronRight,
  RefreshCw,
  Sliders,
  Calendar,
  Layers,
  MapPin,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import { ActiveTab } from "../types";
import { useEmpowerment } from "../context/EmpowermentContext";

export interface KeberkahanNotification {
  id: string;
  type: "wakaf-progres" | "relawan-kegiatan" | "dampak-mitra" | "sedekah-subuh" | "pelatihan-akademi";
  title: string;
  message: string;
  highlightText?: string;
  categoryBadge: string;
  categoryColor: "emerald" | "amber" | "teal" | "blue" | "purple";
  iconType: "wakaf" | "relawan" | "dampak" | "sedekah" | "akademi";
  timeAgo: string;
  targetTab: ActiveTab;
  targetElementId?: string;
  actionButtonLabel: string;
  initialAamiinCount: number;
  progressPercent?: number; // for waqf projects
  progressDetail?: string;
  volunteerDate?: string;
  volunteerLocation?: string;
}

const NOTIFICATION_COLLECTION: KeberkahanNotification[] = [
  {
    id: "notif-wakaf-01",
    type: "wakaf-progres",
    title: "Update Progres Wakaf Produktif",
    message: "Alhamdulillah! Wakaf Sentra Agroforestri & Kebun Organik Pesantren telah mencapai",
    highlightText: "77.5% Terkumpul (Rp 387,5 Juta)",
    categoryBadge: "Wakaf Produktif (Lahan 5.000m²)",
    categoryColor: "emerald",
    iconType: "wakaf",
    timeAgo: "2 menit lalu",
    targetTab: "dashboard",
    targetElementId: "gerbang-wakaf-produktif",
    actionButtonLabel: "Lihat Detail Wakaf",
    initialAamiinCount: 234,
    progressPercent: 77.5,
    progressDetail: "Sisa 1.125 unit (m²) sebelum serah terima lahan tahap I",
  },
  {
    id: "notif-relawan-01",
    type: "relawan-kegiatan",
    title: "Pengingat Jadwal Kegiatan Relawan",
    message: "Besok Pagi: Pendampingan Kurasi & Kemasan Produk UMKM Dapur Halal Batch #4 bersama 12 mantan pekerja manufaktur.",
    highlightText: "Sabtu, 09.00 WIB • Sentra Dapur Halal",
    categoryBadge: "Aksi Relawan Lapangan",
    categoryColor: "teal",
    iconType: "relawan",
    timeAgo: "5 menit lalu",
    targetTab: "muamalah-jobs",
    targetElementId: "bursa-relawan-komunitas",
    actionButtonLabel: "Cek Jadwal & Partisipasi",
    initialAamiinCount: 189,
    volunteerDate: "Sabtu, 09.00 - 12.00 WIB",
    volunteerLocation: "Sentra Halal Kramat Jati & Daring Zoom",
  },
  {
    id: "notif-dampak-01",
    type: "dampak-mitra",
    title: "Kabar Bahagia: Mitra Qardhul Hasan Mandiri",
    message: "Pak Hendra (Alumni PHK Otomotif) telah berhasil melunasi amanah cicilan pokok bulan ke-6 dari usaha Konversi Motor Listrik.",
    highlightText: "100% Bebas Riba • Buka 3 Lowongan Baru",
    categoryBadge: "Dampak Ta'awun Nyata",
    categoryColor: "amber",
    iconType: "dampak",
    timeAgo: "12 menit lalu",
    targetTab: "syariah-finance",
    actionButtonLabel: "Lihat Jejak Dampak",
    initialAamiinCount: 312,
  },
  {
    id: "notif-wakaf-02",
    type: "wakaf-progres",
    title: "Milestone Tercapai: Solar Dryer Dome",
    message: "Pemasangan panel surya & ruang pengering higienis di Banyuwangi telah selesai 100%! Siap uji coba operasional pakan.",
    highlightText: "100% Funded • 820 Wakif Terlibat",
    categoryBadge: "Wakaf Aset Berkelanjutan",
    categoryColor: "emerald",
    iconType: "wakaf",
    timeAgo: "18 menit lalu",
    targetTab: "green-coop",
    actionButtonLabel: "Lihat Laporan Operasional",
    initialAamiinCount: 420,
    progressPercent: 100,
    progressDetail: "Tahap serah terima nazhir & pelatihan 15 peternak lokal",
  },
  {
    id: "notif-relawan-02",
    type: "relawan-kegiatan",
    title: "Peluang Relawan Fiqih & Literasi Digital",
    message: "Dibutuhkan 3 relawan mentor IT untuk mendampingi pembuatan katalog online 20 UMKM binaan Pesantren Cisarua.",
    highlightText: "Sisa 2 Kuota Mentor • Fleksibel / Remote",
    categoryBadge: "Relawan Ahli & Barter Skill",
    categoryColor: "blue",
    iconType: "relawan",
    timeAgo: "25 menit lalu",
    targetTab: "muamalah-jobs",
    actionButtonLabel: "Daftar Jadi Relawan",
    initialAamiinCount: 145,
    volunteerDate: "Mulai Pekan Depan (2 Jam/Pekan)",
    volunteerLocation: "Online / Kolaborasi Daring",
  },
  {
    id: "notif-sedekah-01",
    type: "sedekah-subuh",
    title: "Pengingat Sedekah & Doa Berkah Fajar",
    message: "Salurkan sedekah fajar dan raih doa malaikat: 'Ya Allah, berikanlah ganti bagi orang yang berinfak.' (HR. Bukhari & Muslim).",
    highlightText: "Dana Talangan 0% Riba untuk Korban PHK",
    categoryBadge: "Sedekah Subuh Baitul Maal",
    categoryColor: "purple",
    iconType: "sedekah",
    timeAgo: "30 menit lalu",
    targetTab: "dashboard",
    targetElementId: "qris-zakat-infaq-section",
    actionButtonLabel: "Salurkan via QRIS",
    initialAamiinCount: 528,
  },
  {
    id: "notif-akademi-01",
    type: "pelatihan-akademi",
    title: "Kelas Baru di Islamicity Academy",
    message: "Modul Praktis 'Manajemen Keuangan Rumah Tangga Pasca-PHK dengan Formula 40/30/20/10' kini telah dibuka untuk umum.",
    highlightText: "Gratis • Dibimbing Dewan Pengawas Syariah",
    categoryBadge: "Akademi Muamalah",
    categoryColor: "teal",
    iconType: "akademi",
    timeAgo: "45 menit lalu",
    targetTab: "academy",
    actionButtonLabel: "Mulai Belajar",
    initialAamiinCount: 267,
  },
];

interface NotifikasiKeberkahanProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const NotifikasiKeberkahan: React.FC<NotifikasiKeberkahanProps> = ({
  onNavigateTab,
}) => {
  const { awardPoints } = useEmpowerment();

  // Settings
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isSoundActive, setIsSoundActive] = useState<boolean>(true);
  const [frequencyInterval, setFrequencyInterval] = useState<number>(25); // in seconds
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Active Toast State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [toastAutoDismissProgress, setToastAutoDismissProgress] = useState<number>(100);

  // User Interaction State
  const [aamiinedNotifs, setAamiinedNotifs] = useState<Record<string, number>>({});
  const [readNotifIds, setReadNotifIds] = useState<Set<string>>(new Set());
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerCategoryFilter, setDrawerCategoryFilter] = useState<string>("all");

  const intervalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Web Audio chime synthesizer
  const playBlessingChime = useCallback(() => {
    if (!isSoundActive) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const now = ctx.currentTime;
      // Soft gentle pentatonic blessing chords (E5 -> G#5 -> B5)
      const notes = [659.25, 830.61, 987.77];
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        
        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.04, now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.6);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.65);
      });
    } catch {
      // Audio context might be restricted before user gesture
    }
  }, [isSoundActive]);

  // Show a notification by index
  const triggerNotification = useCallback(
    (index: number) => {
      if (!isEnabled) return;
      const targetNotif = NOTIFICATION_COLLECTION[index % NOTIFICATION_COLLECTION.length];
      setCurrentIndex(index % NOTIFICATION_COLLECTION.length);
      setIsToastVisible(true);
      setToastAutoDismissProgress(100);
      playBlessingChime();

      setReadNotifIds((prev) => new Set([...prev, targetNotif.id]));
    },
    [isEnabled, playBlessingChime]
  );

  // Initial popup after component mount (after 6 seconds)
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      triggerNotification(0);
    }, 6000);
    return () => clearTimeout(initialTimer);
  }, [triggerNotification]);

  // Periodic Timer setup
  useEffect(() => {
    if (!isEnabled || isPaused) {
      if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
      return;
    }

    intervalTimerRef.current = setInterval(() => {
      if (!isToastVisible && !isDrawerOpen) {
        setCurrentIndex((prev) => {
          const next = (prev + 1) % NOTIFICATION_COLLECTION.length;
          triggerNotification(next);
          return next;
        });
      }
    }, frequencyInterval * 1000);

    return () => {
      if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
    };
  }, [isEnabled, isPaused, frequencyInterval, isToastVisible, isDrawerOpen, triggerNotification]);

  // Auto-dismiss countdown for current active toast
  useEffect(() => {
    if (!isToastVisible || isHovered) {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    const durationMs = 8000; // 8 seconds display
    const tickMs = 100;
    const decrement = (tickMs / durationMs) * 100;

    progressTimerRef.current = setInterval(() => {
      setToastAutoDismissProgress((prev) => {
        if (prev <= decrement) {
          setIsToastVisible(false);
          return 0;
        }
        return prev - decrement;
      });
    }, tickMs);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isToastVisible, isHovered]);

  const activeNotif = NOTIFICATION_COLLECTION[currentIndex];

  const handleAamiin = (notifId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Prevent duplicate points reward for the same notification in session
    const isAlreadyDone = !!aamiinedNotifs[notifId];
    const newCount = (aamiinedNotifs[notifId] || 0) + 1;

    setAamiinedNotifs((prev) => ({
      ...prev,
      [notifId]: newCount,
    }));

    // Mini confetti
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { x: 0.85, y: 0.85 },
      colors: ["#10b981", "#fbbf24", "#34d399", "#f59e0b"],
    });

    if (!isAlreadyDone) {
      awardPoints(
        5,
        "Mengaminkan Doa & Progres Kebaikan",
        "Keberkahan Jamaah",
        `Mengaminkan ${activeNotif?.title} untuk keberkahan sesama.`,
        "doa-mustajab"
      );
    }
  };

  const handleActionClick = (notif: KeberkahanNotification) => {
    setIsToastVisible(false);
    onNavigateTab(notif.targetTab);

    if (notif.targetElementId) {
      setTimeout(() => {
        const el = document.getElementById(notif.targetElementId!);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 200);
    }
  };

  const getBadgeStyle = (color: KeberkahanNotification["categoryColor"]) => {
    switch (color) {
      case "emerald":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "amber":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "teal":
        return "bg-teal-100 text-teal-800 border-teal-300";
      case "blue":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "purple":
        return "bg-purple-100 text-purple-900 border-purple-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  const getIconElement = (type: KeberkahanNotification["iconType"]) => {
    switch (type) {
      case "wakaf":
        return <Landmark className="w-4 h-4 text-emerald-600" />;
      case "relawan":
        return <Users className="w-4 h-4 text-teal-600" />;
      case "dampak":
        return <TrendingUp className="w-4 h-4 text-amber-600" />;
      case "sedekah":
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case "akademi":
        return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
    }
  };

  const filteredDrawerNotifications = NOTIFICATION_COLLECTION.filter((n) => {
    if (drawerCategoryFilter === "all") return true;
    if (drawerCategoryFilter === "wakaf") return n.type === "wakaf-progres";
    if (drawerCategoryFilter === "relawan") return n.type === "relawan-kegiatan";
    if (drawerCategoryFilter === "dampak") return n.type === "dampak-mitra" || n.type === "sedekah-subuh";
    return true;
  });

  return (
    <>
      {/* Floating Floating Notification Widget Bubble (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5 pointer-events-auto">
        {/* Active Animated Toast Popup */}
        <AnimatePresence>
          {isToastVisible && activeNotif && (
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="w-[330px] sm:w-[380px] bg-white rounded-3xl border-2 border-emerald-400/80 shadow-2xl shadow-emerald-950/20 overflow-hidden relative"
            >
              {/* Top Linear Dismiss Progress Bar */}
              <div className="h-1 w-full bg-slate-100 relative overflow-hidden">
                <div
                  style={{ width: `${toastAutoDismissProgress}%` }}
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400 transition-all duration-100 ease-linear"
                ></div>
              </div>

              {/* Toast Content Area */}
              <div className="p-4 sm:p-5 space-y-3">
                {/* Header: Icon, Badge & Controls */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
                      {getIconElement(activeNotif.iconType)}
                    </div>
                    <div>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getBadgeStyle(
                          activeNotif.categoryColor
                        )}`}
                      >
                        {activeNotif.categoryBadge}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{activeNotif.timeAgo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      onClick={() => setIsSoundActive(!isSoundActive)}
                      title={isSoundActive ? "Mute Suara" : "Aktifkan Suara"}
                      className="p-1 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      {isSoundActive ? (
                        <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <VolumeX className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => setIsToastVisible(false)}
                      title="Tutup Notifikasi"
                      className="p-1 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title and Message */}
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-serif leading-snug">
                    {activeNotif.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeNotif.message}{" "}
                    {activeNotif.highlightText && (
                      <strong className="text-emerald-900 font-bold bg-emerald-50 px-1 py-0.5 rounded">
                        {activeNotif.highlightText}
                      </strong>
                    )}
                  </p>
                </div>

                {/* Optional Waqf Mini Progress Bar */}
                {activeNotif.progressPercent !== undefined && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-slate-600">Progres Pengumpulan:</span>
                      <span className="text-emerald-800 font-mono">
                        {activeNotif.progressPercent}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${activeNotif.progressPercent}%` }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
                      ></div>
                    </div>
                    {activeNotif.progressDetail && (
                      <div className="text-[10px] text-slate-500">
                        {activeNotif.progressDetail}
                      </div>
                    )}
                  </div>
                )}

                {/* Optional Volunteer Details */}
                {activeNotif.volunteerDate && (
                  <div className="p-2.5 rounded-xl bg-teal-50/80 border border-teal-200/80 text-[11px] text-teal-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-teal-700" />
                      <span>{activeNotif.volunteerDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-teal-800 text-[10px]">
                      <MapPin className="w-3 h-3 text-teal-600" />
                      <span>{activeNotif.volunteerLocation}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons: Aamiin & Main CTA */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  {/* Aamiin button with point feedback */}
                  <button
                    onClick={(e) => handleAamiin(activeNotif.id, e)}
                    className="py-1.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:scale-102"
                  >
                    <Heart className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>Aamiinkan</span>
                    <span className="text-[10px] bg-amber-200/80 px-1.5 py-0.2 rounded-full font-mono">
                      {activeNotif.initialAamiinCount + (aamiinedNotifs[activeNotif.id] || 0)}
                    </span>
                  </button>

                  {/* Direct Action Button */}
                  <button
                    onClick={() => handleActionClick(activeNotif)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm hover:shadow"
                  >
                    <span>{activeNotif.actionButtonLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Bell Trigger Pill Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white text-xs font-bold border-2 border-emerald-500/70 shadow-xl hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
        >
          <div className="relative">
            <Bell className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950 animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950"></span>
          </div>
          <span className="hidden sm:inline">Notifikasi Keberkahan</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-400/40">
            {NOTIFICATION_COLLECTION.length} Kabar
          </span>
        </button>
      </div>

      {/* Full Notification Center Modal / Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-end animate-in fade-in">
          <div className="w-full max-w-md h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-amber-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-serif text-white">
                      Pusat Notifikasi Keberkahan
                    </h3>
                    <p className="text-[11px] text-emerald-200">
                      Jejak Progres Wakaf & Kegiatan Relawan
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Settings Bar */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Pemunculan Berkala:</span>
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                      isPaused
                        ? "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                    }`}
                  >
                    {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                    <span>{isPaused ? "Dijeda" : "Aktif (Tiap 25s)"}</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    const randomIdx = Math.floor(Math.random() * NOTIFICATION_COLLECTION.length);
                    triggerNotification(randomIdx);
                    setIsDrawerOpen(false);
                  }}
                  className="text-[11px] text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Tes Pop-up</span>
                </button>
              </div>
            </div>

            {/* Category Sub-Filters */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
              {[
                { id: "all", label: "Semua" },
                { id: "wakaf", label: "Wakaf Produktif" },
                { id: "relawan", label: "Kegiatan Relawan" },
                { id: "dampak", label: "Dampak & Sedekah" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDrawerCategoryFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer text-xs ${
                    drawerCategoryFilter === tab.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Notification List Scroll */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {filteredDrawerNotifications.map((notif) => {
                const totalAamiin = notif.initialAamiinCount + (aamiinedNotifs[notif.id] || 0);

                return (
                  <div
                    key={notif.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getBadgeStyle(
                          notif.categoryColor
                        )}`}
                      >
                        {notif.categoryBadge}
                      </span>
                      <span className="text-[10px] text-slate-400">{notif.timeAgo}</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 font-serif leading-tight">
                        {notif.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {notif.message}{" "}
                        {notif.highlightText && (
                          <strong className="text-emerald-900 font-bold">
                            {notif.highlightText}
                          </strong>
                        )}
                      </p>
                    </div>

                    {/* Progress Bar if exists */}
                    {notif.progressPercent !== undefined && (
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[10px] space-y-1">
                        <div className="flex justify-between font-bold text-slate-700">
                          <span>Progres:</span>
                          <span className="text-emerald-800">{notif.progressPercent}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${notif.progressPercent}%` }}
                            className="h-full bg-emerald-600 rounded-full"
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Volunteer Schedule if exists */}
                    {notif.volunteerDate && (
                      <div className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-[10px] text-teal-900 space-y-0.5">
                        <div className="font-bold">{notif.volunteerDate}</div>
                        <div className="text-teal-700">{notif.volunteerLocation}</div>
                      </div>
                    )}

                    {/* Actions in drawer item */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <button
                        onClick={(e) => handleAamiin(notif.id, e)}
                        className="text-[11px] font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>Aamiinkan ({totalAamiin})</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDrawerOpen(false);
                          handleActionClick(notif);
                        }}
                        className="text-[11px] font-bold text-emerald-800 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>{notif.actionButtonLabel}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Semua progres terverifikasi oleh Nazhir & Baitul Maal</span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Tutup Notifikasi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
