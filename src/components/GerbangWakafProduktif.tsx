import React, { useState } from "react";
import {
  Landmark,
  Leaf,
  Sprout,
  Cog,
  Truck,
  Sun,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  Heart,
  FileCheck2,
  QrCode,
  Download,
  Share2,
  X,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Clock,
  Check,
  BookOpen,
  MapPin,
  Flame,
} from "lucide-react";
import { ProductiveWaqfAsset, WaqfDonor } from "../types";
import { initialProductiveWaqfAssets, initialWaqfDonors } from "../data/mockData";
import { useEmpowerment } from "../context/EmpowermentContext";
import { InteractiveWaqfProgressBar } from "./InteractiveWaqfProgressBar";
import { motion } from "motion/react";
import confetti from "canvas-confetti";

interface GerbangWakafProduktifProps {
  onOpenApplyModal?: () => void;
}

type CategoryFilter = "Semua" | "Lahan Pertanian" | "Mesin Produksi" | "Logistik & Armada" | "Energi Terbarukan";

export const GerbangWakafProduktif: React.FC<GerbangWakafProduktifProps> = ({
  onOpenApplyModal,
}) => {
  const { awardPoints, userProfile } = useEmpowerment();

  const [assets, setAssets] = useState<ProductiveWaqfAsset[]>(initialProductiveWaqfAssets);
  const [donors, setDonors] = useState<WaqfDonor[]>(initialWaqfDonors);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("Semua");

  // Selected asset for Waqf Modal
  const [selectedAsset, setSelectedAsset] = useState<ProductiveWaqfAsset | null>(null);
  const [detailModalAsset, setDetailModalAsset] = useState<ProductiveWaqfAsset | null>(null);

  // Form State for Waqf Pledge
  const [unitsToBuy, setUnitsToBuy] = useState<number>(1);
  const [customAmount, setCustomAmount] = useState<number>(0);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [waqfType, setWaqfType] = useState<"abadi" | "berjangka">("abadi");
  const [tenorYears, setTenorYears] = useState<number>(3);
  const [donorName, setDonorName] = useState<string>(userProfile.name || "");
  const [onBehalfOf, setOnBehalfOf] = useState<string>("");
  const [phone, setPhone] = useState<string>(userProfile.phone || "0812-3456-7890");
  const [city, setCity] = useState<string>(userProfile.city || "Bandung");
  const [message, setMessage] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "bsi_va" | "muamalat_va" | "transfer">("qris");
  const [acceptedIkrar, setAcceptedIkrar] = useState<boolean>(true);

  // Simulation Slider State
  const [simUnits, setSimUnits] = useState<number>(5);

  // Success State & Digital Certificate
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [completedPledge, setCompletedPledge] = useState<{
    id: string;
    assetTitle: string;
    donorName: string;
    amount: number;
    units: number;
    unitName: string;
    date: string;
    waqfType: string;
    bwiNo: string;
    nazhir: string;
  } | null>(null);

  const [copiedCert, setCopiedCert] = useState<boolean>(false);

  // Filtered Assets
  const filteredAssets = activeCategory === "Semua"
    ? assets
    : assets.filter((a) => a.category === activeCategory);

  // Overall Aggregate Numbers
  const totalTarget = assets.reduce((sum, a) => sum + a.targetAmount, 0);
  const totalCollected = assets.reduce((sum, a) => sum + a.collectedAmount, 0);
  const totalWakif = assets.reduce((sum, a) => sum + a.wakifCount, 0);
  const aggregatePercentage = Math.min(100, Math.round((totalCollected / totalTarget) * 100));

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const calculateTotalPledge = () => {
    if (!selectedAsset) return 0;
    if (isCustomMode) return customAmount;
    return unitsToBuy * selectedAsset.unitPrice;
  };

  const handleOpenWaqfModal = (asset: ProductiveWaqfAsset) => {
    setSelectedAsset(asset);
    setUnitsToBuy(1);
    setIsCustomMode(false);
    setCustomAmount(asset.unitPrice);
    setIsSuccess(false);
  };

  const handleQuickWaqf = (asset: ProductiveWaqfAsset, units: number) => {
    setSelectedAsset(asset);
    setUnitsToBuy(units);
    setIsCustomMode(false);
    setCustomAmount(units * asset.unitPrice);
    setIsSuccess(false);
  };

  const handleSubmitWaqf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    const totalAmount = calculateTotalPledge();
    if (totalAmount <= 0) return;

    const unitsCount = isCustomMode
      ? Math.max(1, Math.floor(totalAmount / selectedAsset.unitPrice))
      : unitsToBuy;

    const certId = `WKF-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const donorDisplayName = isAnonymous ? "Hamba Allah" : (onBehalfOf ? `${donorName} (atas nama ${onBehalfOf})` : donorName);

    // Update Asset State
    setAssets((prev) =>
      prev.map((a) =>
        a.id === selectedAsset.id
          ? {
              ...a,
              collectedAmount: a.collectedAmount + totalAmount,
              allocatedUnits: a.allocatedUnits + unitsCount,
              wakifCount: a.wakifCount + 1,
            }
          : a
      )
    );

    // Add to Live Donor Feed
    const newDonor: WaqfDonor = {
      id: `wd-${Date.now()}`,
      donorName: isAnonymous ? "Hamba Allah" : donorName,
      isAnonymous,
      assetTitle: selectedAsset.title,
      amount: totalAmount,
      units: unitsCount,
      timeAgo: "Baru saja",
      message: message || "Semoga menjadi amal jariyah yang mengalirkan pahala abadi.",
      city: city || "Indonesia",
    };

    setDonors((prev) => [newDonor, ...prev]);

    // Set Certificate details
    setCompletedPledge({
      id: certId,
      assetTitle: selectedAsset.title,
      donorName: donorDisplayName,
      amount: totalAmount,
      units: unitsCount,
      unitName: selectedAsset.unitName,
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      waqfType: waqfType === "abadi" ? "Wakaf Uang Abadi (Muabbad)" : `Wakaf Uang Berjangka (${tenorYears} Tahun)`,
      bwiNo: selectedAsset.bwiRegistrationNo,
      nazhir: selectedAsset.nazhirName,
    });

    setIsSuccess(true);

    // Award Points and Trigger Celebration
    awardPoints(
      250,
      `Wakaf Produktif: ${selectedAsset.title}`,
      "Infaq & Sedekah",
      `Menyalurkan ${unitsCount} ${selectedAsset.unitName} (${formatRupiah(totalAmount)}) untuk aset produktif Green Coop.`,
      "waqf-benefactor"
    );

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleCopyCertText = () => {
    if (!completedPledge) return;
    const shareText = `📜 AKTA IKRAR WAKAF TUNAI PRODUKTIF DIGITAL
No. Registrasi: ${completedPledge.id}
Nazhir Resmi: ${completedPledge.nazhir} (${completedPledge.bwiNo})
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Alhamdulillah, telah diterima penyerahan Wakaf Tunai Produktif:
• Wakif: ${completedPledge.donorName}
• Peruntukan Aset: ${completedPledge.assetTitle}
• Nilai Wakaf: ${formatRupiah(completedPledge.amount)} (${completedPledge.units} ${completedPledge.unitName})
• Sifat Akad: ${completedPledge.waqfType}
• Tanggal Ikrar: ${completedPledge.date}

"Apabila manusia meninggal dunia, maka terputuslah semua amalnya kecuali tiga perkara: sedekah jariyah (wakaf), ilmu yang bermanfaat, dan anak sholeh yang mendoakannya." (HR. Muslim)

🌐 Disalurkan melalui Ekosistem Wakaf IslamiCity Global: https://global.islamicity.tv`;

    navigator.clipboard.writeText(shareText);
    setCopiedCert(true);
    setTimeout(() => setCopiedCert(false), 2500);
  };

  return (
    <div id="gerbang-wakaf-section" className="space-y-8">
      {/* Top Banner: Gerbang Wakaf Produktif */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border border-emerald-700/60 p-6 sm:p-9 text-white shadow-xl">
        {/* Glow ambient decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 -mb-20 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-500/60 text-emerald-200 text-xs font-bold uppercase tracking-wider shadow-inner">
              <Landmark className="w-3.5 h-3.5 text-amber-300" />
              <span>Gerbang Wakaf Produktif Abadi • Bersertifikat BWI</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-200/90 bg-slate-800/60 px-3 py-1 rounded-full border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Diawasi DPS DSN-MUI • No. Reg: BWI-NZ-3.3.00428</span>
            </div>
          </div>

          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-white tracking-tight leading-tight">
              Investasi Akhirat Berkelanjutan: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-teal-200 to-emerald-300">
                Wakaf Tunai Kolektif Aset Produktif
              </span>
            </h2>
            <p className="text-xs sm:text-base text-emerald-100/90 leading-relaxed">
              Bukan sekadar bantuan habis pakai. Wakaf tunai Anda diwujudkan menjadi <strong>lahan pertanian abadi</strong>, <strong>mesin industri pakan BSF</strong>, dan <strong>armada usaha hijau</strong> yang terus memproduksi hasil panen & keuntungan untuk membiayai modal <em>Qardhul Hasan</em> korban PHK selamanya.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
            <div className="bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-600/30">
              <span className="text-[10px] sm:text-xs text-emerald-300 uppercase tracking-wider font-semibold block">
                Total Wakaf Terhimpun
              </span>
              <strong className="text-base sm:text-xl font-bold text-white block mt-0.5">
                {formatRupiah(totalCollected)}
              </strong>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${aggregatePercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 h-full rounded-full"
                ></motion.div>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                {aggregatePercentage}% dari target {formatRupiah(totalTarget)}
              </span>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-600/30">
              <span className="text-[10px] sm:text-xs text-teal-300 uppercase tracking-wider font-semibold block">
                Total Wakif Tergabung
              </span>
              <strong className="text-base sm:text-xl font-bold text-white block mt-0.5">
                {totalWakif.toLocaleString("id-ID")} Jiwa
              </strong>
              <p className="text-[10px] text-teal-300/80 mt-1">
                Berjamaah dari 34 Provinsi
              </p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-600/30">
              <span className="text-[10px] sm:text-xs text-lime-300 uppercase tracking-wider font-semibold block">
                Aset Produktif Aktif
              </span>
              <strong className="text-base sm:text-xl font-bold text-white block mt-0.5">
                4 Portofolio Hijau
              </strong>
              <p className="text-[10px] text-lime-300/80 mt-1">
                Lahan, Mesin, Logistik & PLTS
              </p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-600/30">
              <span className="text-[10px] sm:text-xs text-amber-300 uppercase tracking-wider font-semibold block">
                Pemberdayaan Korban PHK
              </span>
              <strong className="text-base sm:text-xl font-bold text-white block mt-0.5">
                185+ Kepala Keluarga
              </strong>
              <p className="text-[10px] text-amber-300/80 mt-1">
                Mandiri Bekerja & Bebas Riba
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs & Interactive Asset Showcase */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
              Pilihan Portofolio Aset Wakaf Produktif
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Pilih aset wakaf yang ingin Anda biayai secara kolektif mulai dari Rp 100.000 per meter/lot:
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            {(["Semua", "Lahan Pertanian", "Mesin Produksi", "Logistik & Armada", "Energi Terbarukan"] as CategoryFilter[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-emerald-800 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Asset Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAssets.map((asset) => {
            const percent = Math.min(100, Math.round((asset.collectedAmount / asset.targetAmount) * 100));
            const remaining = asset.targetAmount - asset.collectedAmount;

            return (
              <div
                key={asset.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-emerald-500/50 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image & Category Header */}
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-900">
                    <img
                      src={asset.imageUrl}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                    {/* Category & Urgency Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-300 font-bold text-xs border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
                        {asset.category === "Lahan Pertanian" && <Sprout className="w-3.5 h-3.5" />}
                        {asset.category === "Mesin Produksi" && <Cog className="w-3.5 h-3.5" />}
                        {asset.category === "Logistik & Armada" && <Truck className="w-3.5 h-3.5" />}
                        {asset.category === "Energi Terbarukan" && <Sun className="w-3.5 h-3.5" />}
                        <span>{asset.category}</span>
                      </span>

                      {asset.urgencyTag && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md animate-pulse">
                          {asset.urgencyTag}
                        </span>
                      )}
                    </div>

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-3 left-4 right-4 text-white space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-300">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{asset.location}</span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold font-serif text-white line-clamp-1">
                        {asset.title}
                      </h4>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {asset.subtitle}
                    </p>

                    {/* Key Impact & Dividend Box */}
                    <div className="p-3 bg-emerald-50/90 rounded-2xl border border-emerald-200/80 text-xs space-y-2">
                      <div className="flex items-start gap-2">
                        <Leaf className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-950 block">Dampak Ekonomi Green Coop:</strong>
                          <span className="text-emerald-900">{asset.greenCoopImpact}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 pt-1 border-t border-emerald-200/60">
                        <Heart className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-950 block">Aliran Manfaat Jariyah:</strong>
                          <span className="text-slate-700">{asset.dividendAllocation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Real-Time Animated Progress Bar */}
                    <div className="pt-1">
                      <InteractiveWaqfProgressBar
                        asset={asset}
                        onQuickWaqf={handleQuickWaqf}
                        showSimControls={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDetailModalAsset(asset)}
                    className="sm:w-1/3 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer text-center"
                  >
                    Detail Legalitas
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenWaqfModal(asset)}
                    className="sm:w-2/3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Landmark className="w-4 h-4 text-amber-300" />
                    <span>Tunaikan Wakaf Tunai</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Simulation: Aliran Pahala Jariyah & Dampak Nyata */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-emerald-700/50 shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-800/80 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Kalkulator Simulasi Manfaat Abadi
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif">
              Seberapa Besar Dampak Wakaf Tunai Anda?
            </h3>
          </div>
          <p className="text-xs text-emerald-200/80 max-w-md">
            Geser slider untuk melihat proyeksi hasil panen, lapangan kerja, dan dana kebajikan yang dihasilkan dari wakaf Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Slider Control (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-200 font-semibold">Pilihan Porsi Wakaf Kolektif:</span>
                <span className="text-amber-300 font-bold text-sm">{simUnits} Unit / Meter² ({formatRupiah(simUnits * 100000)})</span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                value={simUnits}
                onChange={(e) => setSimUnits(Number(e.target.value))}
                className="w-full h-2 bg-emerald-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-emerald-300/60 font-mono">
                <span>1 Unit (Rp 100 Rb)</span>
                <span>10 Unit (Rp 1 Jt)</span>
                <span>25 Unit (Rp 2.5 Jt)</span>
                <span>50 Unit (Rp 5 Jt)</span>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-900/60 rounded-2xl border border-emerald-600/40 text-xs text-emerald-100 space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Pahala Jariyah Mengalir Tiada Henti</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Selama aset wakaf berproduksi dan mempekerjakan alumni PHK, pahala mengalir tanpa henti ke buku catatan amal Anda dan keluarga, bahkan setelah wafat.
              </p>
            </div>
          </div>

          {/* Outcome Simulation Badges (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-emerald-500/30 text-center space-y-1">
              <Sprout className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <span className="text-[10px] uppercase font-bold text-emerald-300">Hasil Panen Bersih</span>
              <strong className="text-lg font-bold text-white block">
                {(simUnits * 24).toLocaleString("id-ID")} kg/Tahun
              </strong>
              <span className="text-[10px] text-slate-300">Sayur & Bahan Pangan</span>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-emerald-500/30 text-center space-y-1">
              <Users className="w-6 h-6 text-teal-400 mx-auto mb-1" />
              <span className="text-[10px] uppercase font-bold text-teal-300">Nafkah Saudara PHK</span>
              <strong className="text-lg font-bold text-white block">
                {Math.max(1, Math.round(simUnits * 0.4))} Keluarga
              </strong>
              <span className="text-[10px] text-slate-300">Terbina Mandiri</span>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-emerald-500/30 text-center space-y-1">
              <Landmark className="w-6 h-6 text-amber-400 mx-auto mb-1" />
              <span className="text-[10px] uppercase font-bold text-amber-300">Suntikan Modal Qardh</span>
              <strong className="text-lg font-bold text-white block">
                {formatRupiah(simUnits * 45000)}/Tahun
              </strong>
              <span className="text-[10px] text-slate-300">Dana Bergulir 0% Bunga</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Wakif Donor Stream & Trust Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Donor Feed (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
              <h4 className="font-bold text-slate-900 font-serif text-base sm:text-lg">
                Aliran Wakif Berjamaah (Live Feed)
              </h4>
            </div>
            <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {donors.length} Transaksi Terbaru
            </span>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {donors.map((donor) => (
              <div
                key={donor.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {donor.isAnonymous ? "HA" : donor.donorName.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs sm:text-sm text-slate-900 font-bold">
                        {donor.isAnonymous ? "Hamba Allah" : donor.donorName}
                      </strong>
                      <span className="text-[10px] text-slate-400 font-medium">• {donor.city}</span>
                    </div>
                    <span className="text-xs text-emerald-800 font-semibold block">
                      Wakaf {donor.units} Unit • {donor.assetTitle}
                    </span>
                    {donor.message && (
                      <p className="text-xs text-slate-600 italic">
                        "{donor.message}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs sm:text-sm font-bold text-emerald-900 block">
                    {formatRupiah(donor.amount)}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 flex items-center justify-end gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {donor.timeAgo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sharia Governance & Nazhir Accountability (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50/90 to-teal-50/90 rounded-3xl p-6 border border-emerald-200/90 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Prinsip Keamanan & Amanah Nazhir</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Aset Kekal (Tawqid):</strong> Pokok harta wakaf tidak boleh dijual, dihibahkan, ataupun diwariskan.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Audit Transparan:</strong> Laporan operasional aset dan distribusi dividen dipublikasikan berkala di dashboard.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Legalitas Sah:</strong> Dilengkapi Akta Ikrar Wakaf (AIW) resmi dari KUA/BWI setempat.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Penerbitan Sertifikat:</strong> Setiap wakif langsung memperoleh Akta Ikrar Wakaf Digital ber-QR Code.
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-emerald-200/80 flex items-center justify-between text-xs">
            <div className="text-[11px] text-slate-500">
              Butuh konsultasi wakaf perusahaan / tanah keluarga?
            </div>
            <a
              href="https://wa.me/62812777000?text=Halo%20Nazhir%20Wakaf%20IslamiCity,%20saya%20ingin%20konsultasi%20wakaf%20produktif"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 underline"
            >
              Hubungi Nazhir ↗
            </a>
          </div>
        </div>
      </div>

      {/* ================= MODAL: TUNAISIKAN WAKAF TUNAI ================= */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                  Akad Wakaf Tunai Produktif
                </span>
                <h3 className="font-bold text-slate-900 text-lg sm:text-xl font-serif mt-1">
                  {selectedAsset.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAsset(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSuccess && completedPledge ? (
              /* Success & Digital Waqf Certificate Screen */
              <div className="py-4 space-y-5">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xl font-serif">
                    Alhamdulillah, Akad Wakaf Sah!
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Semoga Allah Ta'ala menerima wakaf tunai Anda sebagai sedekah jariyah abadi yang tak terputus pahalanya.
                  </p>
                </div>

                {/* Digital Certificate Card (Akta Ikrar Wakaf) */}
                <div className="bg-gradient-to-br from-amber-50/80 via-emerald-50/50 to-teal-50/80 rounded-2xl p-5 border-2 border-amber-300/80 shadow-md relative overflow-hidden space-y-4">
                  <div className="flex justify-between items-start border-b border-amber-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-sm">
                        ☪
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                          Akta Ikrar Wakaf Tunai Digital
                        </span>
                        <strong className="text-xs text-slate-900 font-serif">
                          Yayasan Wakaf IslamiCity Global
                        </strong>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 font-mono block">
                        No: {completedPledge.id}
                      </span>
                      <span className="text-[9px] bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded font-bold">
                        SAH SYARIAH
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                        Nama Wakif
                      </span>
                      <strong className="text-slate-900 text-sm font-serif">
                        {completedPledge.donorName}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                        Nilai Wakaf
                      </span>
                      <strong className="text-emerald-900 text-sm font-bold">
                        {formatRupiah(completedPledge.amount)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                        Peruntukan Aset
                      </span>
                      <span className="text-slate-800 text-xs font-medium line-clamp-1">
                        {completedPledge.assetTitle}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                        Porsi Unit
                      </span>
                      <span className="text-slate-800 text-xs font-medium">
                        {completedPledge.units} {completedPledge.unitName}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white/90 rounded-xl border border-amber-200/70 text-[11px] text-slate-700 italic">
                    "Tercatat sah dalam register Badan Wakaf Indonesia (BWI) No. {completedPledge.bwiNo}."
                  </div>
                </div>

                {/* Action Buttons in Success Screen */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCopyCertText}
                    className="w-full sm:w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCert ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    <span>{copiedCert ? "Tersalin!" : "Salin Ikrar & Bagikan"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAsset(null)}
                    className="w-full sm:w-1/2 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    Selesai & Tutup
                  </button>
                </div>
              </div>
            ) : (
              /* Waqf Form */
              <form onSubmit={handleSubmitWaqf} className="space-y-4 text-xs">
                {/* Asset Pricing Summary */}
                <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-800 font-bold uppercase block">
                      Harga Satuan Wakaf:
                    </span>
                    <strong className="text-sm font-bold text-emerald-950">
                      {formatRupiah(selectedAsset.unitPrice)} / {selectedAsset.unitName}
                    </strong>
                  </div>
                  <span className="text-[11px] text-emerald-900 bg-white px-2.5 py-1 rounded-xl border border-emerald-200 font-semibold">
                    Lokasi: {selectedAsset.location.split(",")[0]}
                  </span>
                </div>

                {/* Unit / Lot Selector */}
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    1. Tentukan Porsi Unit / Nominal Wakaf:
                  </label>

                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 5, 10].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setIsCustomMode(false);
                          setUnitsToBuy(preset);
                        }}
                        className={`py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                          !isCustomMode && unitsToBuy === preset
                            ? "bg-emerald-800 text-white border-emerald-800 shadow-xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {preset} {selectedAsset.unitName.split(" ")[0]}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCustomMode(!isCustomMode)}
                      className={`text-[11px] px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${
                        isCustomMode
                          ? "bg-amber-100 border-amber-300 text-amber-900"
                          : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {isCustomMode ? "✓ Nominal Kustom Aktif" : "Input Nominal Bebas"}
                    </button>

                    {isCustomMode && (
                      <input
                        type="number"
                        min={selectedAsset.unitPrice}
                        step={50000}
                        value={customAmount}
                        onChange={(e) => setCustomAmount(Number(e.target.value))}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900"
                        placeholder="Contoh: 1000000"
                      />
                    )}
                  </div>
                </div>

                {/* Sifat Akad Wakaf: Abadi vs Berjangka */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    2. Sifat Akad Wakaf:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWaqfType("abadi")}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        waqfType === "abadi"
                          ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <strong className="block text-xs">🏛️ Wakaf Abadi (Muabbad)</strong>
                      <span className="text-[10px] text-slate-500 font-normal">Pokok dana abadi selamanya</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWaqfType("berjangka")}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        waqfType === "berjangka"
                          ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <strong className="block text-xs">⏳ Wakaf Berjangka (Mu'aqqat)</strong>
                      <span className="text-[10px] text-slate-500 font-normal">Pokok dikembalikan setelah tenor</span>
                    </button>
                  </div>
                </div>

                {/* Donor Details */}
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Nama Wakif:
                      </label>
                      <input
                        type="text"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="Nama Lengkap"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Atas Nama / Ditujukan Untuk (Opsional):
                      </label>
                      <input
                        type="text"
                        value={onBehalfOf}
                        onChange={(e) => setOnBehalfOf(e.target.value)}
                        placeholder="Contoh: Orang Tua / Alm. Ayahanda"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Nomor WhatsApp:
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0812-xxxx-xxxx"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Kota Domisili:
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Contoh: Bandung"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Doa / Pesan Kebaikan (Opsional):
                    </label>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tuliskan doa agar diaminkan jamaah..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-emerald-500"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-0.5">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-slate-700 text-xs">
                      Sembunyikan nama saya pada papan wakif publik (Tampil sebagai Hamba Allah)
                    </span>
                  </label>
                </div>

                {/* Syariah Payment Methods */}
                <div className="space-y-1.5 pt-1">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    3. Metode Pembayaran Syariah:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("qris")}
                      className={`p-2 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                        paymentMethod === "qris"
                          ? "bg-emerald-800 text-white border-emerald-800"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      QRIS Instant
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("bsi_va")}
                      className={`p-2 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                        paymentMethod === "bsi_va"
                          ? "bg-emerald-800 text-white border-emerald-800"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      BSI VA
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("muamalat_va")}
                      className={`p-2 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                        paymentMethod === "muamalat_va"
                          ? "bg-emerald-800 text-white border-emerald-800"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      Muamalat VA
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("transfer")}
                      className={`p-2 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                        paymentMethod === "transfer"
                          ? "bg-emerald-800 text-white border-emerald-800"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      Transfer Bank
                    </button>
                  </div>
                </div>

                {/* Lafadz Ikrar Wakaf Tunai Box */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950 space-y-1">
                  <span className="font-bold block text-amber-900 uppercase tracking-wider">
                    Lafadz Ikrar Wakaf Tunai:
                  </span>
                  <p className="italic font-serif leading-relaxed">
                    "Bismillahirrohmanirrohim. Saya ({donorName || "Wakif"}) berikrar mewakafkan dana sejumlah {formatRupiah(calculateTotalPledge())} secara tunai karena Allah Ta'ala untuk aset {selectedAsset.title}, yang pengelolaannya diserahkan kepada Nazhir IslamiCity demi kemaslahatan ekonomi umat."
                  </p>
                  <label className="flex items-center gap-1.5 pt-1 text-xs font-bold text-amber-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedIkrar}
                      onChange={(e) => setAcceptedIkrar(e.target.checked)}
                      required
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Saya membaca & menyetujui ikrar wakaf di atas dengan ikhlas.</span>
                  </label>
                </div>

                {/* Total & Submit Button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      Total Nilai Wakaf:
                    </span>
                    <strong className="text-base sm:text-lg font-extrabold text-emerald-950">
                      {formatRupiah(calculateTotalPledge())}
                    </strong>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedAsset(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Batal
                    </button>

                    <button
                      type="submit"
                      disabled={!acceptedIkrar || calculateTotalPledge() <= 0}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Landmark className="w-4 h-4 text-amber-300" />
                      <span>Sah & Tunaikan Wakaf</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: DETAIL SPESIFIKASI & LEGALITAS ================= */}
      {detailModalAsset && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                  Legalitas & Spesifikasi Aset
                </span>
                <h3 className="font-bold text-slate-900 text-lg font-serif mt-1">
                  {detailModalAsset.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalAsset(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              {/* Live Real-Time Progress in Modal */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Progres Ketercapaian Target Real-time:
                </span>
                <InteractiveWaqfProgressBar
                  asset={detailModalAsset}
                  onQuickWaqf={(asset, units) => {
                    setDetailModalAsset(null);
                    handleQuickWaqf(asset, units);
                  }}
                  showSimControls={true}
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Nazhir:</span>
                  <strong className="text-slate-900">{detailModalAsset.nazhirName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor BWI:</span>
                  <strong className="text-emerald-800">{detailModalAsset.bwiRegistrationNo}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pengawas Syariah:</span>
                  <strong className="text-slate-900">{detailModalAsset.shariaSupervision}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Penerima:</span>
                  <strong className="text-slate-900">{detailModalAsset.beneficiaryTarget}</strong>
                </div>
              </div>

              <div>
                <strong className="block text-slate-900 mb-2 font-bold uppercase tracking-wider text-[11px]">
                  Spesifikasi Teknis & Aset Fisik:
                </strong>
                <ul className="space-y-1.5">
                  {detailModalAsset.specs.map((spec, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-emerald-50/60 p-2 rounded-xl border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 space-y-1">
                <strong className="block font-bold">Skema Pemanfaatan Berkah:</strong>
                <p className="text-[11px] leading-relaxed">
                  {detailModalAsset.dividendAllocation}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={() => setDetailModalAsset(null)}
                className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  const asset = detailModalAsset;
                  setDetailModalAsset(null);
                  handleOpenWaqfModal(asset);
                }}
                className="w-2/3 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Landmark className="w-4 h-4 text-amber-300" />
                <span>Tunaikan Wakaf untuk Aset Ini</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
