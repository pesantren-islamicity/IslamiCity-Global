import React, { useState } from "react";
import {
  ShieldAlert,
  Sparkles,
  Coins,
  Briefcase,
  Leaf,
  Tv,
  ArrowRight,
  TrendingUp,
  Users,
  CheckCircle2,
  HelpCircle,
  Play,
  Heart,
  Scale,
  Calculator,
  Compass,
  Zap,
} from "lucide-react";
import { ActiveTab, QardhulHasanApplication, CrowdfundProject } from "../types";
import { ZakatInfaqAnalyticsDashboard } from "./ZakatInfaqAnalyticsDashboard";
import { SelfZakatInfaqCalculator } from "./SelfZakatInfaqCalculator";
import { PetaSebaranDampak } from "./PetaSebaranDampak";
import { SocialImpactTracker } from "./SocialImpactTracker";
import { IndonesiaInteractiveDistributionMap } from "./IndonesiaInteractiveDistributionMap";
import { SedekahSubuhSection } from "./SedekahSubuhSection";
import { SedekahSubuhWidget } from "./SedekahSubuhWidget";
import { ImpactStoryGenerator } from "./ImpactStoryGenerator";
import { GerbangWakafProduktif } from "./GerbangWakafProduktif";
import { CrowdfundProjectsSection } from "./CrowdfundProjectsSection";
import { QRISZakatInfaqSection } from "./QRISZakatInfaqSection";
import { mockCrowdfundProjects } from "../data/mockData";
import { useEmpowerment } from "../context/EmpowermentContext";
import { Award, Star, Lock, Landmark, GraduationCap, QrCode } from "lucide-react";

interface DashboardViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenApplyModal: () => void;
  onOpenHotlineModal: () => void;
  qardhulHasanApplications?: QardhulHasanApplication[];
  crowdfundProjects?: CrowdfundProject[];
  onInvestProject?: (projectId: string, amount: number) => void;
  onInstantDonateProject?: (projectId: string, amount: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  onOpenApplyModal,
  onOpenHotlineModal,
  qardhulHasanApplications = [],
  crowdfundProjects = [],
  onInvestProject,
  onInstantDonateProject,
}) => {
  const { userProfile, currentTier, nextTier, allBadges, setIsProfileModalOpen } = useEmpowerment();

  // Quick severance calculator state
  const [severanceInput, setSeveranceInput] = useState<number>(30000000);
  const [monthlyExpense, setMonthlyExpense] = useState<number>(4500000);

  // 40/30/20/10 Rule calculation
  const emergencyFund = severanceInput * 0.4;
  const businessFund = severanceInput * 0.3;
  const skillFund = severanceInput * 0.2;
  const charityFund = severanceInput * 0.1;
  const runwayMonths = (emergencyFund / (monthlyExpense || 1)).toFixed(1);

  // Progress to next tier
  let progressPercent = 100;
  let pointsNeeded = 0;
  if (nextTier) {
    const tierRange = nextTier.minPoints - currentTier.minPoints;
    const currentProgress = userProfile.totalPoints - currentTier.minPoints;
    progressPercent = Math.min(100, Math.max(0, (currentProgress / (tierRange || 1)) * 100));
    pointsNeeded = nextTier.minPoints - userProfile.totalPoints;
  }

  const unlockedBadges = allBadges.filter((b) => b.isUnlocked);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner with Islamic Resilience Theme */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 border border-emerald-700/50 shadow-2xl p-6 sm:p-10 text-white">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Gerakan Penyelamatan Ekonomi Umat • global.islamicity.tv
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif text-white leading-tight">
            Solusi Cerdas Berdaya: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300">
              Atasi PHK & Pengangguran
            </span>{" "}
            Menuju Kaffah, Berdaulat, Adil & Makmur
          </h1>

          <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-3xl">
            Terkikisnya lapangan kerja korporasi bukan akhir segalanya. Bersama
            ekosistem <strong>IslamiCity Global</strong>, kami hadirkan model
            ekonomi berbasis <em>Berdakwah</em>, <em>Bersyariah</em>,{" "}
            <em>Berjamaah</em>, <em>Bermuamalah</em>, dan{" "}
            <em>Green Berkelanjutan</em> untuk mencetak jutaan wirausahawan
            mandiri dan lapangan kerja berkah bebas riba.
          </p>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={() => setActiveTab("ai-pivot")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-emerald-950 font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-emerald-950" />
              <span>AI Konsultan: Panduan 30 Hari Bangkit</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab("academy")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-black text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-slate-950" />
              <span>Islamicity Academy</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 font-extrabold">
                RT/RW Berdaya
              </span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById("qris-zakat-infaq-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-slate-950" />
              <span>QRIS Zakat & Infaq</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 font-extrabold">
                Baitul Maal
              </span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById("sedekah-subuh-widget");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm border border-emerald-400/40 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-amber-300 text-amber-300 animate-pulse" />
              <span>Sedekah Subuh & Streak Poin</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/50 text-amber-300 font-extrabold border border-amber-300/40">
                Pengingat Pagi
              </span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById("peta-sebaran-dampak");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-teal-900/80 hover:bg-teal-800/80 text-teal-100 font-bold text-sm border border-teal-500/50 shadow-md transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>Peta Sebaran Dampak GPS</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById("social-impact-tracker-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-900/80 hover:bg-emerald-800/80 text-emerald-100 font-bold text-sm border border-emerald-500/50 shadow-md transition-all cursor-pointer"
            >
              <Leaf className="w-4 h-4 text-lime-300" />
              <span>Social Impact Tracker</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById("ai-impact-story-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-teal-800/80 hover:bg-teal-700/80 text-teal-100 font-medium text-sm border border-teal-600/70 shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>AI Cerita Sukses Umat</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById("crowdfund-projects-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-600/90 to-emerald-700/90 hover:from-amber-500 hover:to-emerald-600 text-amber-100 font-medium text-sm border border-amber-400/50 shadow-md transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Crowdfunding & Sedekah Instan</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById("gerbang-wakaf-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-700/90 to-emerald-800/90 hover:from-amber-600 hover:to-emerald-700 text-amber-100 font-medium text-sm border border-amber-500/50 shadow-md transition-all cursor-pointer"
            >
              <Landmark className="w-4 h-4 text-amber-300" />
              <span>Gerbang Wakaf Produktif</span>
            </button>

            <button
              onClick={() => setActiveTab("syariah-finance")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-800/80 hover:bg-emerald-700/80 text-white font-medium text-sm border border-emerald-600/70 shadow-md transition-all cursor-pointer"
            >
              <Coins className="w-4 h-4 text-amber-300" />
              <span>Dana Qardhul Hasan (0% Bunga)</span>
            </button>

            <button
              onClick={onOpenHotlineModal}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-950/70 hover:bg-rose-900/80 text-rose-200 font-medium text-sm border border-rose-700/60 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Hotline Krisis PHK</span>
            </button>
          </div>
        </div>
      </section>

      {/* Component: QRIS Zakat & Infaq Baitul Maal (Top Feature) */}
      <section>
        <QRISZakatInfaqSection />
      </section>

      {/* Component: Sedekah Subuh - Pengingat Otomatis & Pelacak Streak Poin Keberkahan */}
      <section>
        <SedekahSubuhWidget
          onOpenDetailedSettings={() => {
            const el = document.getElementById("sedekah-subuh-section");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </section>

      {/* Component: Widget Level Pemberdayaan Pengguna */}
      <section className="bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/40 rounded-3xl p-5 sm:p-7 border border-emerald-200/90 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* User Info & Tier Badge */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-500 to-teal-400 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-serif text-lg sm:text-xl font-bold text-amber-300">
                  {userProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 px-2 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-xs border border-amber-200 flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-slate-950" />
                <span>Lvl {currentTier.level}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  Tingkat Pemberdayaan Anda
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  {userProfile.role}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
                <span>{userProfile.name}</span>
                <span className="text-emerald-700 text-sm font-sans font-bold">
                  — Level {currentTier.level}: {currentTier.name}
                </span>
              </h3>
              <p className="text-xs text-slate-600">
                Gelar: <strong className="text-slate-800">{currentTier.title}</strong> • Terkumpul{" "}
                <strong className="text-emerald-800 font-bold">{userProfile.totalPoints} Poin Berdaya</strong>
              </p>
            </div>
          </div>

          {/* Quick Badges & Profile CTA Button */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            {/* Unlocked Badges Preview Pill */}
            <div className="flex items-center gap-1.5 p-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex -space-x-1">
                {unlockedBadges.slice(0, 4).map((badge) => (
                  <div
                    key={badge.id}
                    className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xs shadow-2xs"
                    title={badge.name}
                  >
                    {badge.icon}
                  </div>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700 pl-1">
                {unlockedBadges.length} Lencana
              </span>
            </div>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Buka Profil & Level Pemberdayaan</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Next Level Perks */}
        <div className="pt-2 border-t border-emerald-100/90 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>
                Menuju{" "}
                <strong className="text-slate-900">
                  {nextTier ? `Level ${nextTier.level}: ${nextTier.name}` : "Level Puncak (Muhsinun)"}
                </strong>
              </span>
              <span className="font-bold text-emerald-800">
                {nextTier ? `${pointsNeeded} Poin Lagi (${Math.round(progressPercent)}%)` : "Poin Maksimal"}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="md:col-span-4 flex items-center justify-end gap-2 text-xs text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">
              Infaq subuh, barter skill, & investasi Green Coop tambah poin!
            </span>
          </div>
        </div>
      </section>

      {/* Feature Banner: Islamicity Academy - Baldatun Thoyyibatun RT/RW */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-600/50 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/60 text-emerald-200 text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>Pusat Kaderisasi & Pembangunan Teritorial</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold font-serif leading-tight">
              Islamicity Academy: Cetak RT/RW & Kelurahan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-teal-200 to-emerald-300">
                Baldatun Thoyyibatun wa Rabbun Ghofur
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Pelajari 5 modul terapan, hitung skor Indeks Baldatun Thoyyibatun (IBT) wilayah Anda, dan rancang <strong>Blueprint 100 Hari Transformasi Wilayah</strong> bersama AI Arsitek Peradaban.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] text-emerald-300 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-emerald-700/50">🕌 Masjid Sentra Baitul Maal</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-emerald-700/50">🌾 Lumbung Pangan Bebas Riba</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-emerald-700/50">🌱 Maggot BSF & Urban Farming</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-emerald-700/50">⚖️ Musyawarah Syura Digital</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => setActiveTab("academy")}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Masuk Islamicity Academy</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-emerald-300/80 text-center font-medium">
              ✨ Dapatkan hingga +250 Poin Berdaya & Syahadah Kader
            </span>
          </div>
        </div>
      </section>

      {/* Component: Sedekah Subuh Otomatis Baitul Maal */}
      <section id="sedekah-subuh-section">
        <SedekahSubuhSection />
      </section>

      {/* Component: AI-driven Impact Story Generator (Real-time Qardhul Hasan) */}
      <section id="ai-impact-story-section">
        <ImpactStoryGenerator
          applications={qardhulHasanApplications}
          onOpenApplyModal={onOpenApplyModal}
          onOpenDonateModal={() => {
            const el = document.getElementById("sedekah-subuh-section");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </section>

      {/* Component: Gerbang Wakaf Produktif Aset Green Coop */}
      <section id="gerbang-wakaf-section">
        <GerbangWakafProduktif onOpenApplyModal={onOpenApplyModal} />
      </section>

      {/* Component: Proyek Crowdfunding Berdaya Umat (Dengan Fitur Sedekah Instan 1-Klik) */}
      <section id="crowdfund-projects-section">
        <CrowdfundProjectsSection
          projects={crowdfundProjects && crowdfundProjects.length > 0 ? crowdfundProjects : mockCrowdfundProjects}
          onInvestProject={onInvestProject}
          onInstantDonate={onInstantDonateProject}
          onNavigateToFinance={() => setActiveTab("syariah-finance")}
        />
      </section>

      {/* Component: Dashboard Analitik Zakat, Infaq & Qardhul Hasan */}
      <section>
        <ZakatInfaqAnalyticsDashboard
          onOpenApplyModal={onOpenApplyModal}
          onOpenDonateModal={() => setActiveTab("syariah-finance")}
        />
      </section>

      {/* Component: Peta Sebaran Dampak (Qardhul Hasan & Mitra Green Coop GPS) */}
      <section>
        <PetaSebaranDampak
          onOpenApplyModal={onOpenApplyModal}
        />
      </section>

      {/* Component: Social Impact Tracker (Lives Impacted & CO2 Reduced by Funded Green Coop Projects) */}
      <section id="social-impact-tracker-section">
        <SocialImpactTracker
          onNavigateToGreenCoop={() => setActiveTab("green-coop")}
        />
      </section>

      {/* Live Impact Counters (Real-time Umat Metrics) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:border-emerald-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Dana Qardhul Hasan
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">Rp 2,85 M+</div>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">
              100% Bebas Riba Tersalurkan
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:border-emerald-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Korban PHK Terbina
            </span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">1.942 Jiwa</div>
            <p className="text-xs text-teal-600 font-medium mt-0.5">
              Tergabung di 88 Jamaah Usaha
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:border-emerald-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Peluang Kerja Hijau & Halal
            </span>
            <div className="p-2 rounded-lg bg-lime-50 text-lime-700">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">430+ Proyek</div>
            <p className="text-xs text-lime-700 font-medium mt-0.5">
              Sirkular, Organik & Digital
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:border-emerald-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pemirsa TV Edukasi Umat
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <Tv className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">58.400+</div>
            <p className="text-xs text-amber-600 font-medium mt-0.5">
              global.islamicity.tv streaming
            </p>
          </div>
        </div>
      </section>

      {/* 5 Core Pillars Pathway */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Arsitektur Solusi Terintegrasi
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif mt-1">
              5 Pilar Ekonomi Islamicity Menuju Kemakmuran Kaffah
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            Dirancang khusus untuk membimbing korban PHK dari fase krisis mental
            hingga menjadi pilar kemandirian ekonomi umat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Pillar 1: Berdakwah */}
          <div
            onClick={() => setActiveTab("islamicity-tv")}
            className="group bg-slate-800/70 hover:bg-slate-800 rounded-2xl p-4 border border-slate-700/60 hover:border-emerald-500/60 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/30">
                1
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                Berdakwah & Mentalitas
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pemulihan tauhid, tawakkal, dan pemahaman bahwa rezeki di tangan
                Allah, bukan di tangan korporasi/majikan.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-medium text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Nonton TV Islamicity</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Pillar 2: Bersyariah */}
          <div
            onClick={() => setActiveTab("syariah-finance")}
            className="group bg-slate-800/70 hover:bg-slate-800 rounded-2xl p-4 border border-slate-700/60 hover:border-amber-500/60 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-sm border border-amber-500/30">
                2
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                Bersyariah & Bebas Riba
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Akses dana Qardhul Hasan 0% bunga, micro-wakaf produktif, dan
                skema mudharabah/musyarakah aman dari pinjol.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-medium text-amber-300 group-hover:translate-x-1 transition-transform">
              <span>Ajukan Modal 0% Riba</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Pillar 3: Berjamaah */}
          <div
            onClick={() => setActiveTab("green-coop")}
            className="group bg-slate-800/70 hover:bg-slate-800 rounded-2xl p-4 border border-slate-700/60 hover:border-teal-500/60 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm border border-teal-500/30">
                3
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-teal-300 transition-colors">
                Berjamaah & Koperasi
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pengadaan bahan baku bersama (Konsorsium B2B) agar biaya modal
                turun hingga 35% bagi wirausaha mikro.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-medium text-teal-400 group-hover:translate-x-1 transition-transform">
              <span>Gabung Koperasi Jamaah</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Pillar 4: Bermuamalah */}
          <div
            onClick={() => setActiveTab("muamalah-jobs")}
            className="group bg-slate-800/70 hover:bg-slate-800 rounded-2xl p-4 border border-slate-700/60 hover:border-blue-500/60 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">
                4
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-blue-300 transition-colors">
                Bermuamalah & Barter
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bursa proyek halal, freelance, dan pertukaran keahlian (Skill
                Barter) tanpa uang tunai saat modal terbatas.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-medium text-blue-400 group-hover:translate-x-1 transition-transform">
              <span>Lihat Bursa & Barter</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Pillar 5: Green Berkelanjutan */}
          <div
            onClick={() => setActiveTab("green-coop")}
            className="group bg-slate-800/70 hover:bg-slate-800 rounded-2xl p-4 border border-slate-700/60 hover:border-lime-500/60 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-lime-500/20 text-lime-400 flex items-center justify-center font-bold text-sm border border-lime-500/30">
                5
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-lime-300 transition-colors">
                Green & Berkelanjutan
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Blueprint usaha ramah lingkungan: Maggot BSF, Aquaponik masjid,
                Bank Sampah Berkah, dan energi terbarukan.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-medium text-lime-400 group-hover:translate-x-1 transition-transform">
              <span>Unduh Blueprint Hijau</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Severance & Runway Simulator (Simulasi Pesangon Berdaya 40/30/20/10) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-serif">
                Kalkulator Alokasi Pesangon Berdaya (Metode Syariah 40/30/20/10)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Jangan habiskan uang pesangon untuk konsumtif atau investasi
                bodong. Amankan ketahanan keluarga Anda.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("ai-pivot")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-lg border border-emerald-200 transition-colors cursor-pointer self-start md:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Konsultasikan via AI</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Form Inputs */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Total Uang Pesangon / Tabungan Saat Ini:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">
                  Rp
                </span>
                <input
                  type="number"
                  value={severanceInput}
                  onChange={(e) =>
                    setSeveranceInput(Math.max(0, Number(e.target.value)))
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-slate-900 font-semibold text-base"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {[15000000, 30000000, 50000000, 100000000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setSeveranceInput(preset)}
                    className="text-[11px] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    {preset / 1000000} Juta
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kebutuhan Pokok Keluarga per Bulan:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">
                  Rp
                </span>
                <input
                  type="number"
                  value={monthlyExpense}
                  onChange={(e) =>
                    setMonthlyExpense(Math.max(1, Number(e.target.value)))
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-slate-900 font-semibold text-base"
                />
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <Compass className="w-4 h-4" />
                <span>Nafas Keamanan Keluarga (Emergency Runway):</span>
              </div>
              <p>
                Dengan porsi 40% Dana Darurat, keluarga Anda terlindungi selama{" "}
                <strong className="text-emerald-800 font-bold text-sm">
                  {runwayMonths} Bulan
                </strong>{" "}
                tanpa penghasilan tetap sementara Anda membangun usaha baru.
              </p>
            </div>
          </div>

          {/* Visualization breakdown */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  40% Dana Darurat Hidup
                </span>
                <span className="bg-emerald-200/70 px-2 py-0.5 rounded text-emerald-800">
                  Wajib
                </span>
              </div>
              <div className="text-xl font-bold text-emerald-950">
                {formatRupiah(emergencyFund)}
              </div>
              <p className="text-[11px] text-emerald-800/80">
                Khusus untuk belanja makan, sewa, sekolah anak, dan kesehatan.
                Jangan diinvestasikan!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-teal-900">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                  30% Modal Usaha Halal
                </span>
                <span className="bg-teal-200/70 px-2 py-0.5 rounded text-teal-800">
                  Produktif
                </span>
              </div>
              <div className="text-xl font-bold text-teal-950">
                {formatRupiah(businessFund)}
              </div>
              <p className="text-[11px] text-teal-800/80">
                Bahan baku, peralatan usaha hijau, atau modal awal kemitraan
                koperasi berjamaah.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  20% Upgrade Skill & Halal
                </span>
                <span className="bg-blue-200/70 px-2 py-0.5 rounded text-blue-800">
                  Investasi Diri
                </span>
              </div>
              <div className="text-xl font-bold text-blue-950">
                {formatRupiah(skillFund)}
              </div>
              <p className="text-[11px] text-blue-800/80">
                Kursus keahlian baru, sertifikasi halal, atau perlengkapan kerja
                digital/teknis.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                  10% Infaq & Wakaf Berkah
                </span>
                <span className="bg-amber-200/70 px-2 py-0.5 rounded text-amber-800">
                  Pembuka Rizki
                </span>
              </div>
              <div className="text-xl font-bold text-amber-950">
                {formatRupiah(charityFund)}
              </div>
              <p className="text-[11px] text-amber-800/80">
                Sedekah penolak bala & pembuka jalan rezeki tak terduga (QS.
                At-Talaq: 2-3).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Component: Kalkulator Zakat & Infaq Mandiri */}
      <section>
        <SelfZakatInfaqCalculator
          onDirectDonate={(amount, type) => {
            // Optional callback when user proceeds
          }}
        />
      </section>

      {/* Featured Live TV Banner preview */}
      <section className="bg-gradient-to-r from-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            SIARAN LANGSUNG • global.islamicity.tv
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
            Kajian Fiqih Muamalah: Solusi Bangkit Pasca-PHK Tanpa Terjebak Pinjol
            Riba
          </h3>
          <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
            Bersama Dr. KH. M. Shiddiq Al-Jawi, M.Si (Pakar Fiqih Ekonomi
            Syariah). Kupas tuntas cara mengelola utang masa lalu, hak pesangon,
            dan permodalan Qardhul Hasan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("islamicity-tv")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Tonton Live TV Sekarang</span>
          </button>
        </div>
      </section>

      {/* Daily Spiritual Recharge */}
      <section className="bg-emerald-50/90 rounded-2xl p-6 border border-emerald-200/80 text-emerald-950 flex flex-col md:flex-row items-center gap-5">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
          <Heart className="w-6 h-6" />
        </div>
        <div className="space-y-1 text-center md:text-left">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Penyejuk Hati & Etos Kerja Nabawi
          </div>
          <p className="text-sm sm:text-base font-medium italic text-emerald-900">
            "Tidaklah seseorang memakan makanan yang lebih baik daripada hasil
            usaha tangannya sendiri. Dan sesungguhnya Nabi Allah Daud 'alaihissalam
            dahulu makan dari hasil usaha tangannya sendiri."
          </p>
          <span className="text-xs text-emerald-700 font-semibold block">
            — HR. Bukhari no. 2072
          </span>
        </div>
      </section>
    </div>
  );
};
