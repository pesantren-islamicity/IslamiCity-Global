import React, { useState } from "react";
import {
  Leaf,
  Users,
  Layers,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  Package,
  ShoppingCart,
  Building2,
  FileText,
  Clock,
  ShieldCheck,
  Check,
} from "lucide-react";
import { GreenBlueprint } from "../types";
import { useEmpowerment } from "../context/EmpowermentContext";
import { SocialImpactTracker } from "./SocialImpactTracker";

interface GreenCoopViewProps {
  blueprints: GreenBlueprint[];
}

export const GreenCoopView: React.FC<GreenCoopViewProps> = ({ blueprints }) => {
  const { awardPoints } = useEmpowerment();
  const [selectedBlueprint, setSelectedBlueprint] =
    useState<GreenBlueprint | null>(blueprints[0] || null);

  // Group Buying (Konsorsium B2B Jamaah) Mock Data
  const [groupPurchases, setGroupPurchases] = useState([
    {
      id: "GP-01",
      item: "Bibit Maggot BSF & Jaring Kasa Indukan Super",
      category: "Pakan & Sirkular",
      pricePerUnit: "Rp 85.000 / paket (Hemat 35%)",
      minQuota: 50,
      currentQuota: 42,
      deadline: "2 hari lagi",
      joined: false,
    },
    {
      id: "GP-02",
      item: "Kemasan Makanan Biodegradable Daun Singkong (1.000 pcs)",
      category: "Kemasan Hijau",
      pricePerUnit: "Rp 420.000 / kardus (Hemat 40%)",
      minQuota: 100,
      currentQuota: 88,
      deadline: "3 hari lagi",
      joined: true,
    },
    {
      id: "GP-03",
      item: "Baglog Jamur Tiram Siap Tumbuh (Per 500 pcs)",
      category: "Pertanian Organik",
      pricePerUnit: "Rp 1.100.000 / paket (Hemat 28%)",
      minQuota: 30,
      currentQuota: 21,
      deadline: "5 hari lagi",
      joined: false,
    },
    {
      id: "GP-04",
      item: "Panel Surya Polycrystalline 100Wp + Solar Charge Controller",
      category: "Energi Bersih",
      pricePerUnit: "Rp 680.000 / set (Hemat 32%)",
      minQuota: 20,
      currentQuota: 19,
      deadline: "Besok Sore",
      joined: false,
    },
  ]);

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleToggleJoin = (id: string) => {
    const item = groupPurchases.find((g) => g.id === id);
    const wasJoined = item?.joined;

    setGroupPurchases((prev) =>
      prev.map((gp) => {
        if (gp.id === id) {
          const newJoined = !gp.joined;
          return {
            ...gp,
            joined: newJoined,
            currentQuota: newJoined ? gp.currentQuota + 1 : gp.currentQuota - 1,
          };
        }
        return gp;
      })
    );

    if (!wasJoined && item) {
      awardPoints(
        200,
        "Konsorsium Green Coop Jamaah",
        "Green Coop",
        `Bergabung pengadaan kolektif: ${item.item} (${item.category}).`,
        "green-pioneer"
      );
    }
  };

  const handleAdoptBlueprint = (blueprint: GreenBlueprint) => {
    setDownloadSuccess(blueprint.title);
    awardPoints(
      100,
      "Adopsi Blueprint Usaha Hijau",
      "Green Coop",
      `Mempelajari dan menerapkan blueprint: ${blueprint.title} (${blueprint.category}).`,
      "blueprint-builder"
    );
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white border border-teal-800 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/20 text-lime-300 text-xs font-semibold border border-lime-400/30">
          <Leaf className="w-3.5 h-3.5" />
          <span>Green Circular Economy & Koperasi Syariah</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-white">
          Koperasi Hijau & Konsorsium Usaha Jamaah
        </h1>
        <p className="text-emerald-100/90 text-sm sm:text-base max-w-3xl leading-relaxed">
          Mengubah tantangan PHK menjadi kekuatan berjamaah. Pelajari blueprint
          usaha ramah lingkungan siap pakai, manfaatkan pengadaan bahan baku
          bersama berharga grosir, dan dirikan Koperasi Syariah Berkelanjutan.
        </p>
      </div>
      
      {/* Social Impact Tracker Component */}
      <section>
        <SocialImpactTracker />
      </section>

      {/* Blueprints Section */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Katalog Praktis
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Blueprint Usaha Hijau Siap Terap
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Pilih blueprint di bawah ini untuk melihat estimasi modal, siklus
            panen/BEP, dan alur operasional harian.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Blueprint selector cards */}
          <div className="lg:col-span-5 space-y-3">
            {blueprints.map((bp) => {
              const isSelected = selectedBlueprint?.id === bp.id;
              return (
                <div
                  key={bp.id}
                  onClick={() => setSelectedBlueprint(bp)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? "bg-emerald-900 text-white border-emerald-700 shadow-md scale-[1.01]"
                      : "bg-white text-slate-900 border-slate-200 hover:border-emerald-400"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isSelected
                          ? "bg-emerald-800 text-emerald-200"
                          : "bg-emerald-50 text-emerald-800"
                      }`}
                    >
                      {bp.category}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        isSelected ? "text-amber-300" : "text-slate-500"
                      }`}
                    >
                      Modal: {bp.startupCapitalRange}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm leading-snug">{bp.title}</h3>
                  <p
                    className={`text-xs ${
                      isSelected ? "text-emerald-200" : "text-slate-500"
                    }`}
                  >
                    {bp.tagline}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Blueprint */}
          {selectedBlueprint && (
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {selectedBlueprint.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mt-2">
                  {selectedBlueprint.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {selectedBlueprint.tagline}
                </p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    Modal Awal
                  </span>
                  <strong className="text-xs sm:text-sm text-emerald-800">
                    {selectedBlueprint.startupCapitalRange}
                  </strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    Estimasi BEP
                  </span>
                  <strong className="text-xs sm:text-sm text-teal-800">
                    {selectedBlueprint.bepMonths}
                  </strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    Tenaga Kerja PHK
                  </span>
                  <strong className="text-xs sm:text-sm text-amber-800">
                    {selectedBlueprint.jobsCreatedEstimate}
                  </strong>
                </div>
              </div>

              {/* Green Metrics */}
              <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-2">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>Dampak Lingkungan & Efisiensi Hijau:</span>
                </h4>
                <ul className="space-y-1">
                  {selectedBlueprint.greenMetrics.map((gm, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-emerald-950 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{gm}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Equipment Needed */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Peralatan & Bahan yang Diperlukan:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedBlueprint.equipmentNeeded.map((eq, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2"
                    >
                      <Package className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="text-slate-700">{eq}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Workflow */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Rutinitas Operasional Harian:</span>
                </h4>
                <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700">
                  {selectedBlueprint.dailyWorkflow.map((wf, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-emerald-700 shrink-0">
                        •
                      </span>
                      <span>{wf}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950">
                <div>
                  <div className="font-bold text-amber-900">
                    Akad Kemitraan: {selectedBlueprint.shariaContractType}
                  </div>
                  <div className="text-[11px] text-amber-800 mt-0.5">
                    Tersedia draft SOP operasional & perjanjian legal syariah siap pakai.
                  </div>
                </div>
                <button
                  onClick={() => handleAdoptBlueprint(selectedBlueprint)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-950" />
                  <span>Adopsi Blueprint & Unduh PDF</span>
                </button>
              </div>

              {downloadSuccess && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-950 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Blueprint '{downloadSuccess}' berhasil diadopsi! (+100 Poin Pemberdayaan)</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Group Purchasing / Konsorsium Belanja Bersama Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider">
              <ShoppingCart className="w-4 h-4" />
              <span>B2B Jamaah Group Buying</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-serif mt-1">
              Konsorsium Pengadaan Bahan Baku Bersama
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-md">
            Dengan memesan bahan baku secara kolektif antar sesama anggota
            koperasi, harga modal menjadi jauh lebih murah dibanding beli satuan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groupPurchases.map((gp) => {
            const quotaPct = Math.round((gp.currentQuota / gp.minQuota) * 100);
            return (
              <div
                key={gp.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                      {gp.category}
                    </span>
                    <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      ⏱️ {gp.deadline}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{gp.item}</h3>
                  <div className="text-xs font-bold text-emerald-700">
                    {gp.pricePerUnit}
                  </div>

                  {/* Quota Progress */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-medium text-slate-600">
                      <span>
                        Kuota: {gp.currentQuota} / {gp.minQuota} Anggota
                      </span>
                      <span className="font-bold text-slate-900">{quotaPct}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full"
                        style={{ width: `${Math.min(100, quotaPct)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleJoin(gp.id)}
                  className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    gp.joined
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  {gp.joined ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tergabung dalam Pengadaan Ini</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Gabung Beli Bersama</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
