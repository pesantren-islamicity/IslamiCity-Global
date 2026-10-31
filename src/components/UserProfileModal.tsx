import React, { useState } from "react";
import {
  X,
  Award,
  Star,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Coins,
  Briefcase,
  Leaf,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  User,
  MapPin,
  Mail,
  Phone,
  Edit3,
  Check,
  Flame,
  BookOpen,
  Share2,
} from "lucide-react";
import { useEmpowerment } from "../context/EmpowermentContext";
import { EMPOWERMENT_TIERS } from "../data/empowermentData";
import { EmpowermentBadge, PointActivity } from "../types";

export const UserProfileModal: React.FC = () => {
  const {
    userProfile,
    currentTier,
    nextTier,
    allBadges,
    isProfileModalOpen,
    setIsProfileModalOpen,
    updateUserProfile,
  } = useEmpowerment();

  const [activeTab, setActiveTab] = useState<
    "tiers" | "badges" | "activities" | "edit-profile" | "guide"
  >("tiers");

  // Edit profile form state
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
    city: userProfile.city,
    role: userProfile.role,
    bio: userProfile.bio,
    primarySkills: userProfile.primarySkills.join(", "),
  });
  const [isSaved, setIsSaved] = useState(false);
  const [activityCategoryFilter, setActivityCategoryFilter] = useState<string>("Semua");

  if (!isProfileModalOpen) return null;

  // Calculate percentage to next tier
  let progressPercent = 100;
  let pointsNeeded = 0;
  if (nextTier) {
    const tierRange = nextTier.minPoints - currentTier.minPoints;
    const currentProgress = userProfile.totalPoints - currentTier.minPoints;
    progressPercent = Math.min(100, Math.max(0, (currentProgress / (tierRange || 1)) * 100));
    pointsNeeded = nextTier.minPoints - userProfile.totalPoints;
  }

  const unlockedBadgesCount = allBadges.filter((b) => b.isUnlocked).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      role: formData.role as any,
      bio: formData.bio,
      primarySkills: formData.primarySkills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const filteredActivities =
    activityCategoryFilter === "Semua"
      ? userProfile.activities
      : userProfile.activities.filter((a) => a.category === activityCategoryFilter);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header Profile Hero Card */}
        <div className="relative bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-950 p-6 sm:p-8 text-white border-b border-emerald-800/60 shrink-0">
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Close Button */}
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="absolute top-4 right-4 text-emerald-300 hover:text-white bg-emerald-900/60 hover:bg-emerald-800 p-2 rounded-full transition-colors cursor-pointer"
            aria-label="Tutup Profil"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar & Level Badge Ring */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-emerald-500 to-teal-300 p-1 shadow-xl flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center font-serif text-2xl sm:text-3xl font-extrabold text-amber-300 border border-emerald-500/30">
                  {userProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1 border border-amber-200">
                <Star className="w-3 h-3 fill-slate-950" />
                <span>Lvl {currentTier.level}</span>
              </div>
            </div>

            {/* Profile Information & Level Title */}
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                  {userProfile.name}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-semibold">
                  {userProfile.role}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-200/80">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {userProfile.city}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  {userProfile.email}
                </span>
              </div>

              {/* Tier & Points Pill */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>
                    Level {currentTier.level}: {currentTier.name} ({currentTier.title})
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-900/60 border border-emerald-700/60 text-emerald-200 text-xs font-bold">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-white font-extrabold text-sm font-serif">
                    {userProfile.totalPoints}
                  </span>{" "}
                  Poin Berdaya
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-900/60 border border-teal-700/60 text-teal-200 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                  <span>
                    {unlockedBadgesCount} / {allBadges.length} Lencana
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress to Next Level Bar */}
          <div className="mt-5 pt-4 border-t border-emerald-800/60 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-200 font-medium flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Kemajuan Menuju Level Berikutnya:{" "}
                  <strong className="text-amber-300">
                    {nextTier ? `Level ${nextTier.level} (${nextTier.name})` : "Level Tertinggi Kaffah"}
                  </strong>
                </span>
              </span>
              <span className="text-emerald-200/90 font-bold">
                {nextTier ? `${pointsNeeded} Poin Lagi (${Math.round(progressPercent)}%)` : "Maksimal"}
              </span>
            </div>

            <div className="w-full h-2.5 bg-emerald-950/80 rounded-full overflow-hidden border border-emerald-800/80 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("tiers")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "tiers"
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Jenjang Level & Hak Istimewa</span>
          </button>

          <button
            onClick={() => setActiveTab("badges")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "badges"
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Koleksi Lencana ({unlockedBadgesCount}/{allBadges.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("activities")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "activities"
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Riwayat Poin Masuk ({userProfile.activities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("guide")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "guide"
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cara Raih Poin & Berkah</span>
          </button>

          <button
            onClick={() => setActiveTab("edit-profile")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ml-auto ${
              activeTab === "edit-profile"
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profil</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* ================= TAB 1: JENJANG LEVEL & PERKS ================= */}
          {activeTab === "tiers" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Filosofi Level Pemberdayaan Umat:</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Setiap kebaikan Anda — berinfaq subuh, berbagi ilmu di barter skill, maupun bersinergi di Green Coop — diapresiasi dengan poin kemuliaan dan hak istimewa di ekosistem IslamiCity.
                  </p>
                </div>
              </div>

              {/* Tiers Roadmap */}
              <div className="space-y-4">
                {EMPOWERMENT_TIERS.map((tier) => {
                  const isCurrent = tier.level === currentTier.level;
                  const isUnlocked = userProfile.totalPoints >= tier.minPoints;

                  return (
                    <div
                      key={tier.level}
                      className={`p-5 rounded-2xl border transition-all ${
                        isCurrent
                          ? "bg-gradient-to-r from-emerald-50/90 via-teal-50/80 to-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                          : isUnlocked
                          ? "bg-white border-slate-200"
                          : "bg-slate-50/70 border-slate-200 opacity-75"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
                              isCurrent
                                ? "bg-emerald-600"
                                : isUnlocked
                                ? "bg-teal-700"
                                : "bg-slate-400"
                            }`}
                          >
                            {tier.level}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                                Level {tier.level}: {tier.name}
                              </h4>
                              <span className="text-xs text-slate-500 font-medium">
                                ({tier.title})
                              </span>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-wider animate-pulse">
                                  Level Anda Saat Ini
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500">
                              Syarat:{" "}
                              <strong className="text-slate-800">
                                {tier.minPoints} -{" "}
                                {tier.maxPoints > 900000 ? "Tak Terbatas" : `${tier.maxPoints} Poin`}
                              </strong>
                            </p>
                          </div>
                        </div>

                        <div>
                          {isUnlocked ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Terbuka
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-200/80 px-2.5 py-1 rounded-lg">
                              <Lock className="w-3.5 h-3.5" />
                              Terkunci ({tier.minPoints - userProfile.totalPoints} Poin Lagi)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Perks Checklist */}
                      <div className="pt-3">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Hak Istimewa & Manfaat Ekosistem:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {tier.benefits.map((benefit, bIdx) => (
                            <div
                              key={bIdx}
                              className="flex items-start gap-2 text-xs text-slate-700"
                            >
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= TAB 2: KOLEKSI LENCANA ================= */}
          {activeTab === "badges" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Lencana Kehormatan & Kontribusi</h4>
                  <p className="text-xs text-slate-500">
                    Diperoleh saat Anda aktif berinfaq, berbarter ilmu, dan bergotong royong
                  </p>
                </div>
                <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  {unlockedBadgesCount} dari {allBadges.length} Terbuka
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allBadges.map((badge) => {
                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        badge.isUnlocked
                          ? "bg-white border-slate-200 shadow-sm hover:border-emerald-400"
                          : "bg-slate-50/70 border-slate-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner ${
                            badge.isUnlocked
                              ? "bg-gradient-to-br from-amber-100 to-emerald-100 border border-amber-300"
                              : "bg-slate-200 grayscale"
                          }`}
                        >
                          {badge.icon}
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h5 className="font-bold text-slate-900 text-sm">{badge.name}</h5>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                badge.isUnlocked
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              +{badge.pointsReward} Poin
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">{badge.description}</p>

                          <div className="pt-2 flex items-center justify-between text-[11px] border-t border-slate-100 mt-2">
                            <span className="text-slate-500">
                              Syarat: <strong className="text-slate-700">{badge.howToEarn}</strong>
                            </span>
                            {badge.isUnlocked ? (
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                {badge.unlockedAt || "Tercapai"}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-medium flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Belum
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= TAB 3: RIWAYAT POIN MASUK ================= */}
          {activeTab === "activities" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Catatan Perolehan Poin Berdaya</h4>
                  <p className="text-xs text-slate-500">
                    Total {userProfile.activities.length} aktivitas terverifikasi
                  </p>
                </div>

                {/* Filter buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Semua",
                    "Infaq & Sedekah",
                    "Barter Keahlian",
                    "Green Coop",
                    "AI Karir",
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActivityCategoryFilter(cat)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                        activityCategoryFilter === cat
                          ? "bg-emerald-800 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity items list */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {filteredActivities.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    Belum ada aktivitas di kategori ini.
                  </div>
                ) : (
                  filteredActivities.map((act) => (
                    <div
                      key={act.id}
                      className="p-4 hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            act.category === "Infaq & Sedekah"
                              ? "bg-amber-100 text-amber-800"
                              : act.category === "Barter Keahlian"
                              ? "bg-blue-100 text-blue-800"
                              : act.category === "Green Coop"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-teal-100 text-teal-800"
                          }`}
                        >
                          {act.category === "Infaq & Sedekah" ? (
                            <Coins className="w-4 h-4" />
                          ) : act.category === "Barter Keahlian" ? (
                            <Briefcase className="w-4 h-4" />
                          ) : act.category === "Green Coop" ? (
                            <Leaf className="w-4 h-4" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900">
                              {act.title}
                            </span>
                            <span className="text-[10px] px-2 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                              {act.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">{act.description}</p>
                          <div className="text-[11px] text-slate-400">
                            {act.date} • {act.time}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-0.5 text-xs sm:text-sm font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          +{act.points} Poin
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 4: PANDUAN CARA CEPAT RAIH POIN ================= */}
          {activeTab === "guide" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Aksi Nyata Berpahala & Poin Pemberdayaan</span>
                </div>
                <p className="text-amber-900/90 leading-relaxed">
                  Lakukan aktivitas berikut di aplikasi untuk mempercepat kenaikan Level Pemberdayaan Anda dan membuka seluruh hak istimewa di ekosistem IslamiCity.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                      <span className="text-xl">🌅</span> Sedekah Subuh Rutin
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      +50 Poin / hari
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Jadwalkan atau tunaikan donasi subuh otomatis untuk operasional Baitul Maal dan dapur sembako.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                      <span className="text-xl">🤝</span> Pasang Tawaran Barter Skill
                    </span>
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      +75 Poin
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tawarkan keahlian teknis/kreatif Anda di Bursa Barter Skill tanpa meminta bayaran uang tunai.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                      <span className="text-xl">🌿</span> Investasi Crowdfunding Green Coop
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      +200 Poin
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ikut serta membiayai proyek usaha sirkular (Maggot BSF, Aquaponik, Bio-Briket) berbasis bagi hasil.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                      <span className="text-xl">⚡</span> Konsultasi AI Pivot Karir
                    </span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      +50 Poin
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Susun rencana 30 hari bangkit mandiri dan evaluasi modal kerja bersama AI Konsultan IslamiCity.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5: EDIT BIODATA ================= */}
          {activeTab === "edit-profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap & Gelar:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-xs sm:text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status / Peran Utama di Ekosistem:
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e: any) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-xs sm:text-sm font-semibold bg-white"
                  >
                    <option value="Korban PHK Berdaya">Korban PHK Berdaya</option>
                    <option value="Wirausaha Muslim">Wirausaha Muslim</option>
                    <option value="Muzakki & Donatur">Muzakki & Donatur</option>
                    <option value="Mentor Keahlian">Mentor Keahlian & Barter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Email:
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kota / Wilayah Domisili:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-xs sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Keahlian Utama (Pisahkan dengan koma):
                  </label>
                  <input
                    type="text"
                    value={formData.primarySkills}
                    onChange={(e) => setFormData({ ...formData, primarySkills: e.target.value })}
                    placeholder="Contoh: Web Developer, Hidroponik, Pemasaran Digital"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-xs sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Biografi Singkat & Visi Berdaya:
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-500 text-xs sm:text-sm text-slate-900"
                  ></textarea>
                </div>
              </div>

              {isSaved && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-950 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Biodata profil berhasil diperbarui!</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan Biodata</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Bergabung sejak {userProfile.joinedDate}</span>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export const EmpowermentRewardToast: React.FC = () => {
  const { recentReward, clearRewardToast, setIsProfileModalOpen } = useEmpowerment();

  if (!recentReward) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 border border-amber-400/60 shadow-2xl animate-in slide-in-from-bottom-5 duration-300 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
            {recentReward.badgeIcon || "🌟"}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.2 rounded border border-amber-400/30">
                Poin Pemberdayaan Baru!
              </span>
            </div>
            <h5 className="font-bold text-sm text-white">{recentReward.title}</h5>
          </div>
        </div>

        <button
          onClick={clearRewardToast}
          className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
        <div className="text-emerald-400 font-bold">
          +{recentReward.points} Poin Berdaya
          {recentReward.badgeName && (
            <span className="text-amber-300 block text-[11px]">
              🎖️ Lencana Terbuka: {recentReward.badgeName}
            </span>
          )}
        </div>

        <button
          onClick={() => {
            clearRewardToast();
            setIsProfileModalOpen(true);
          }}
          className="text-amber-300 hover:text-amber-200 font-bold underline cursor-pointer text-xs"
        >
          Lihat Profil & Level
        </button>
      </div>
    </div>
  );
};
