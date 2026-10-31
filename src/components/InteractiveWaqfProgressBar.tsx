import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Zap,
  Clock,
  Layers,
  Info,
  ChevronRight,
  ShieldCheck,
  Flame,
  Plus,
} from "lucide-react";
import { ProductiveWaqfAsset } from "../types";

interface InteractiveWaqfProgressBarProps {
  asset: ProductiveWaqfAsset;
  onQuickWaqf?: (asset: ProductiveWaqfAsset, units: number) => void;
  showSimControls?: boolean;
  compact?: boolean;
}

interface MilestoneStage {
  percent: number;
  label: string;
  detail: string;
}

export const InteractiveWaqfProgressBar: React.FC<InteractiveWaqfProgressBarProps> = ({
  asset,
  onQuickWaqf,
  showSimControls = true,
  compact = false,
}) => {
  const [hoveredMilestone, setHoveredMilestone] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [previewUnits, setPreviewUnits] = useState<number>(0);
  const [isSimActive, setIsSimActive] = useState<boolean>(false);

  // Calculate base percentages
  const currentPercent = useMemo(() => {
    if (asset.targetAmount <= 0) return 0;
    return Math.min(100, (asset.collectedAmount / asset.targetAmount) * 100);
  }, [asset.collectedAmount, asset.targetAmount]);

  const remainingAmount = Math.max(0, asset.targetAmount - asset.collectedAmount);
  const remainingUnits = Math.max(0, asset.totalUnits - asset.allocatedUnits);

  // Projected percentage if user adds previewUnits
  const projectedAmount = previewUnits * asset.unitPrice;
  const projectedPercent = useMemo(() => {
    if (previewUnits <= 0) return currentPercent;
    const newTotal = asset.collectedAmount + projectedAmount;
    return Math.min(100, (newTotal / asset.targetAmount) * 100);
  }, [currentPercent, projectedAmount, asset.collectedAmount, asset.targetAmount, previewUnits]);

  const addedPercent = Math.max(0, projectedPercent - currentPercent);

  // Format currency
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Dynamic Milestone stages depending on asset category
  const milestones: MilestoneStage[] = useMemo(() => {
    switch (asset.category) {
      case "Lahan Pertanian":
        return [
          { percent: 25, label: "DP Lahan", detail: "Uang muka pembebasan lahan & cek legalitas BPN" },
          { percent: 50, label: "Akta AIW", detail: "Pelunasan tanah & penerbitan Akta Ikrar Wakaf BWI" },
          { percent: 75, label: "Olah Tanah", detail: "Land clearing, irigasi organik & semai bibit unggul" },
          { percent: 100, label: "Panen Abadi", detail: "Panen raya perdana & distribusi dividen qardh" },
        ];
      case "Mesin Produksi":
        return [
          { percent: 25, label: "DP Fabrikasi", detail: "Pemesanan rangka & motor listrik stainless 5.5 HP" },
          { percent: 50, label: "Perakitan", detail: "Pelunasan mesin & rotary drum dryer pakan BSF" },
          { percent: 75, label: "Uji Coba", detail: "Instalasi bio-ozon & uji lab standar nutrisi pakan" },
          { percent: 100, label: "Produksi 2T/Hari", detail: "Operasional penuh subsidi 50% peternak rakyat" },
        ];
      case "Logistik & Armada":
        return [
          { percent: 25, label: "Rangka Baja", detail: "Pencetakan sasis baja ringan galvanis 50 unit" },
          { percent: 50, label: "PLTS & Baterai", detail: "Pemasangan atap surya 200Wp & aki Lithium LiFePO4" },
          { percent: 75, label: "Sistem POS", detail: "Peralatan masak induksi & integrasi QRIS syariah" },
          { percent: 100, label: "50 Armada Jalan", detail: "Penyerahan kepada 50 wirausaha alumni PHK" },
        ];
      case "Energi Terbarukan":
      default:
        return [
          { percent: 25, label: "Modul Surya", detail: "Pengadaan 30 solar panel mono Tier-1 500Wp" },
          { percent: 50, label: "Inverter Hybrid", detail: "Instalasi inverter 15 kW & wiring cerdas" },
          { percent: 75, label: "Pompa Bioflok", detail: "Koneksi pompa brushless DC ke 20 kolam lele" },
          { percent: 100, label: "Listrik Mandiri", detail: "Hemat energi 85% & panen berkah rutin" },
        ];
    }
  }, [asset.category]);

  const handleBarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setHoverPosition(pct);
  };

  const handleBarMouseLeave = () => {
    setHoverPosition(null);
  };

  return (
    <div className="space-y-2.5">
      {/* Top Header Metrics & Real-time Status */}
      <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-600">Terkumpul:</span>
          <motion.strong
            key={asset.collectedAmount}
            initial={{ scale: 1.15, color: "#047857" }}
            animate={{ scale: 1, color: "#0f172a" }}
            transition={{ duration: 0.3 }}
            className="font-bold text-slate-900"
          >
            {formatRupiah(asset.collectedAmount)}
          </motion.strong>
          <span className="text-slate-400">/ {formatRupiah(asset.targetAmount)}</span>
        </div>

        <div className="flex items-center gap-2">
          {previewUnits > 0 ? (
            <motion.span
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[11px] shadow-xs"
            >
              <Sparkles className="w-3 h-3" />
              <span>
                {currentPercent.toFixed(1)}% + {addedPercent.toFixed(1)}% = {projectedPercent.toFixed(1)}%
              </span>
            </motion.span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100/90 text-emerald-900 font-extrabold text-[11px] border border-emerald-200">
              <TrendingUp className="w-3 h-3 text-emerald-700" />
              <span>{currentPercent.toFixed(1)}% Tercapai</span>
            </span>
          )}

          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            ({asset.allocatedUnits}/{asset.totalUnits} {asset.unitName})
          </span>
        </div>
      </div>

      {/* Main Interactive Progress Bar Container */}
      <div className="relative pt-1 pb-2 select-none">
        {/* Hover Scrubbing Tooltip */}
        <AnimatePresence>
          {hoverPosition !== null && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              style={{ left: `${hoverPosition}%` }}
              className="absolute -top-7 -translate-x-1/2 z-30 pointer-events-none bg-slate-950 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg border border-emerald-500/50 flex items-center gap-1 whitespace-nowrap"
            >
              <span>Target {hoverPosition.toFixed(0)}%:</span>
              <span className="text-amber-300">
                {formatRupiah((hoverPosition / 100) * asset.targetAmount)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outer Track */}
        <div
          onMouseMove={handleBarMouseMove}
          onMouseLeave={handleBarMouseLeave}
          className="relative w-full h-4 bg-slate-100 hover:bg-slate-200/80 transition-colors rounded-full p-0.5 border border-slate-200/90 shadow-inner cursor-crosshair overflow-visible"
        >
          {/* Base Real-Time Progress Bar */}
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative h-full rounded-full bg-gradient-to-r from-emerald-700 via-emerald-500 to-teal-400 shadow-sm"
            >
              {/* Animated Gleam/Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite] -skew-x-12"></div>
            </motion.div>

            {/* Projected Addition Bar (If previewing simulation) */}
            {previewUnits > 0 && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                style={{
                  left: `${currentPercent}%`,
                  width: `${addedPercent}%`,
                }}
                className="absolute top-0 bottom-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-r-full shadow-md animate-pulse origin-left"
              ></motion.div>
            )}
          </div>

          {/* Interactive Milestone Markers (25%, 50%, 75%, 100%) */}
          {milestones.map((m) => {
            const isAchieved = currentPercent >= m.percent;
            const isNextTarget = !isAchieved && (currentPercent + 25 >= m.percent);
            const isHovered = hoveredMilestone === m.percent;

            return (
              <div
                key={m.percent}
                style={{ left: `${m.percent}%` }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 group"
                onMouseEnter={() => setHoveredMilestone(m.percent)}
                onMouseLeave={() => setHoveredMilestone(null)}
              >
                {/* Milestone Node Pin */}
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-transform duration-200 cursor-pointer ${
                    isAchieved
                      ? "bg-emerald-600 text-white ring-2 ring-emerald-300 ring-offset-1 scale-105"
                      : isNextTarget
                      ? "bg-amber-400 text-slate-950 ring-2 ring-amber-300 ring-offset-1 animate-pulse"
                      : "bg-white text-slate-400 border border-slate-300 hover:border-emerald-500"
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${isAchieved ? "bg-white" : isNextTarget ? "bg-slate-950" : "bg-slate-300"}`} />
                </div>

                {/* Interactive Milestone Hover Popover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-6 -translate-x-1/2 left-1/2 z-40 w-52 bg-slate-900/95 backdrop-blur-md text-white p-2.5 rounded-xl shadow-xl border border-emerald-500/40 text-left pointer-events-none space-y-1"
                    >
                      <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                        <span className="text-[10px] font-black uppercase text-amber-300">
                          Milestone {m.percent}%
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            isAchieved
                              ? "bg-emerald-800 text-emerald-200"
                              : isNextTarget
                              ? "bg-amber-500 text-slate-950"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {isAchieved ? "Tercapai ✓" : isNextTarget ? "Target Aktif" : "Masa Datang"}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-white">{m.label}</div>
                      <p className="text-[10px] text-emerald-100/90 leading-tight">
                        {m.detail}
                      </p>
                      <div className="text-[10px] text-slate-400 pt-0.5">
                        Target Dana: <strong className="text-emerald-300">{formatRupiah((m.percent / 100) * asset.targetAmount)}</strong>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Milestone Labels below the bar */}
        <div className="relative w-full flex justify-between text-[10px] text-slate-500 font-medium pt-1 px-1">
          <span>0%</span>
          {milestones.map((m) => (
            <span
              key={m.percent}
              onClick={() => setHoveredMilestone(hoveredMilestone === m.percent ? null : m.percent)}
              className={`cursor-pointer transition-colors ${
                currentPercent >= m.percent
                  ? "text-emerald-800 font-bold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {m.percent}% {m.label.split(" ")[0]}
            </span>
          ))}
        </div>
      </div>

      {/* Sub-info: Unit price & Remaining shortfall */}
      <div className="flex flex-wrap justify-between items-center text-[11px] text-slate-600 pt-0.5 border-t border-slate-100">
        <div>
          <span>Harga: </span>
          <strong className="text-emerald-800 font-bold">{formatRupiah(asset.unitPrice)}</strong>
          <span className="text-slate-400"> / {asset.unitName}</span>
        </div>
        <div className="text-right">
          <span className="text-slate-500">Sisa Kebutuhan: </span>
          <strong className="text-amber-700 font-semibold">{formatRupiah(remainingAmount)}</strong>
          <span className="text-slate-400"> ({remainingUnits} unit)</span>
        </div>
      </div>

      {/* Interactive Real-Time Quick Simulation Booster (if enabled) */}
      {showSimControls && !compact && (
        <div className="mt-2 pt-2 bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-slate-50 p-2.5 rounded-2xl border border-emerald-200/70 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulasi Akselerasi Real-time:</span>
            </span>
            {previewUnits > 0 && (
              <button
                type="button"
                onClick={() => setPreviewUnits(0)}
                className="text-[10px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Reset Preview
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[1, 2, 5, 10].map((units) => {
              const isSelected = previewUnits === units;
              const unitCost = units * asset.unitPrice;

              return (
                <button
                  key={units}
                  type="button"
                  onMouseEnter={() => setPreviewUnits(units)}
                  onClick={() => setPreviewUnits(isSelected ? 0 : units)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? "bg-amber-500 text-slate-950 shadow-sm border border-amber-600"
                      : "bg-white hover:bg-emerald-100/80 text-emerald-900 border border-emerald-300/80"
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  <span>{units} {asset.unitName.split(" ")[0]}</span>
                  <span className="text-[10px] opacity-80 font-normal">({formatRupiah(unitCost)})</span>
                </button>
              );
            })}

            {previewUnits > 0 && onQuickWaqf && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                type="button"
                onClick={() => onQuickWaqf(asset, previewUnits)}
                className="ml-auto px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <span>Wakafkan {previewUnits} Unit</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
              </motion.button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
