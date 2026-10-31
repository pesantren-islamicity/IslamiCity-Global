import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Tv,
  Coins,
  Briefcase,
  Leaf,
  LayoutDashboard,
  ShieldCheck,
  PhoneCall,
  Menu,
  X,
  Clock,
  HeartHandshake,
  GraduationCap,
} from "lucide-react";
import { ActiveTab } from "../types";
import { useEmpowerment } from "../context/EmpowermentContext";

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenHotlineModal: () => void;
  onOpenApplyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenHotlineModal,
  onOpenApplyModal,
}) => {
  const { userProfile, currentTier, setIsProfileModalOpen } = useEmpowerment();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      id: "dashboard" as ActiveTab,
      label: "Beranda Utama",
      icon: LayoutDashboard,
      badge: "Kaffah",
    },
    {
      id: "academy" as ActiveTab,
      label: "Islamicity Academy",
      icon: GraduationCap,
      badge: "Peradaban",
    },
    {
      id: "ai-pivot" as ActiveTab,
      label: "AI Karir & Usaha",
      icon: Sparkles,
      badge: "Cerdas",
    },
    {
      id: "syariah-finance" as ActiveTab,
      label: "Permodalan Syariah",
      icon: Coins,
      badge: "0% Riba",
    },
    {
      id: "muamalah-jobs" as ActiveTab,
      label: "Bursa Halal & Barter",
      icon: Briefcase,
      badge: "Muamalah",
    },
    {
      id: "green-coop" as ActiveTab,
      label: "Koperasi Hijau",
      icon: Leaf,
      badge: "Green",
    },
    {
      id: "islamicity-tv" as ActiveTab,
      label: "Islamicity TV",
      icon: Tv,
      badge: "LIVE",
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-emerald-950/95 backdrop-blur-md border-b border-emerald-800/60 text-white shadow-lg">
      {/* Top micro-bar */}
      <div className="bg-emerald-900/90 px-4 py-1.5 text-xs text-emerald-200/90 border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Jaringan Solusi Umat Berdaya
            </span>
            <span className="hidden sm:inline text-emerald-400/60">•</span>
            <span className="hidden sm:inline text-emerald-200">
              🌐 global.islamicity.tv
            </span>
            <span className="hidden md:inline text-emerald-400/60">•</span>
            <span className="hidden md:inline text-emerald-300/80">
              Gerakan Atasi PHK & Pengangguran Menuju Kaffah
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto text-xs">
            <div className="hidden lg:flex items-center gap-1.5 text-amber-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentTime} WIB</span>
              <span className="text-emerald-400/70">| 29 Sya'ban 1447 H</span>
            </div>
            <button
              onClick={onOpenHotlineModal}
              className="inline-flex items-center gap-1 text-rose-300 hover:text-rose-100 bg-rose-950/60 hover:bg-rose-900/70 px-2.5 py-0.5 rounded border border-rose-700/50 transition-colors font-medium cursor-pointer"
            >
              <PhoneCall className="w-3 h-3 text-rose-400" />
              <span>Hotline Krisis PHK 24/7</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Identity */}
          <div
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-md flex items-center justify-center border border-emerald-400/40 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-serif">
                  IslamiCity <span className="text-emerald-400">Global</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded">
                  TV & Umat
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/80 -mt-0.5 font-sans">
                Berdakwah • Bersyariah • Berjamaah • Bermuamalah Hijau
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-emerald-800 text-white shadow-inner border border-emerald-600/60"
                      : "text-emerald-100/90 hover:bg-emerald-900/60 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-amber-300" : "text-emerald-400"
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.badge === "LIVE" ? (
                    <span className="ml-1 px-1.5 py-0.2 text-[9px] font-bold bg-rose-600 text-white rounded animate-pulse">
                      LIVE
                    </span>
                  ) : (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-normal ${
                        isActive
                          ? "bg-emerald-950/60 text-emerald-200"
                          : "bg-emerald-900/50 text-emerald-300/70"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTA & Profile Button */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* User Profile & Level Badge */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/80 hover:border-amber-400/60 transition-all cursor-pointer group shadow-sm"
              title="Buka Profil & Level Pemberdayaan"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-emerald-400 p-0.5 shadow-xs flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center text-xs font-bold text-amber-300 font-serif">
                    {userProfile.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                </div>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-900"></span>
              </div>

              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-bold text-white group-hover:text-amber-300 transition-colors truncate max-w-[100px]">
                    {userProfile.name.split(" ")[0]}
                  </span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Lvl {currentTier.level}
                  </span>
                </div>
                <div className="text-[10px] text-emerald-300/80 font-medium">
                  {userProfile.totalPoints} Poin
                </div>
              </div>
            </button>

            <button
              onClick={onOpenApplyModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer transform active:scale-95"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-950" />
              <span>Daftar Bantuan / Modal</span>
            </button>
          </div>

          {/* Mobile menu toggle button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-900 focus:outline-none"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-emerald-950 border-b border-emerald-800 px-4 pt-2 pb-5 space-y-1.5 shadow-2xl">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium w-full text-left transition-colors ${
                    isActive
                      ? "bg-emerald-800 text-white font-semibold border border-emerald-600"
                      : "text-emerald-100 hover:bg-emerald-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-amber-300" : "text-emerald-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300">
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-emerald-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsProfileModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-900 border border-emerald-700/80 flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-950 text-amber-300 flex items-center justify-center font-bold text-xs border border-emerald-500/40">
                  {userProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{userProfile.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black">
                      Lvl {currentTier.level}
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-300">{currentTier.name} • {userProfile.totalPoints} Poin</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-amber-300 underline">Buka Profil</span>
            </button>

            <button
              onClick={() => {
                onOpenApplyModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
            >
              Daftar Bantuan & Permodalan Syariah
            </button>
            <button
              onClick={() => {
                onOpenHotlineModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 text-center text-xs font-medium text-rose-300 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 rounded-lg flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Hotline Pendampingan Korban PHK 24 Jam
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
