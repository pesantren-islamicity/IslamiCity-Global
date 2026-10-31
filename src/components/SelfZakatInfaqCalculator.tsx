import React, { useState, useMemo } from "react";
import {
  Calculator,
  Coins,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  Users,
  Copy,
  Check,
  Building2,
  Leaf,
  Info,
  DollarSign,
  Share2,
} from "lucide-react";
import confetti from "canvas-confetti";

interface SelfZakatInfaqCalculatorProps {
  onDirectDonate?: (amount: number, type: string) => void;
}

type ZakatType = "penghasilan" | "maal" | "perdagangan" | "infaq_produktif";

export const SelfZakatInfaqCalculator: React.FC<SelfZakatInfaqCalculatorProps> = ({
  onDirectDonate,
}) => {
  const [activeType, setActiveType] = useState<ZakatType>("penghasilan");
  const [goldPrice, setGoldPrice] = useState<number>(1420000); // Rp per gram update 2026
  const [ricePrice, setRicePrice] = useState<number>(15000); // Rp per kg beras

  // Zakat Penghasilan State
  const [monthlyIncome, setMonthlyIncome] = useState<number>(12000000);
  const [otherIncome, setOtherIncome] = useState<number>(2000000);
  const [monthlyDebtExpense, setMonthlyDebtExpense] = useState<number>(3000000);

  // Zakat Maal State
  const [cashSavings, setCashSavings] = useState<number>(85000000);
  const [goldWeightGrams, setGoldWeightGrams] = useState<number>(40);
  const [otherLiquidAssets, setOtherLiquidAssets] = useState<number>(20000000);
  const [shortTermLiabilities, setShortTermLiabilities] = useState<number>(15000000);

  // Zakat Perdagangan State
  const [currentAssets, setCurrentAssets] = useState<number>(60000000);
  const [inventoryValue, setInventoryValue] = useState<number>(45000000);
  const [receivables, setReceivables] = useState<number>(15000000);
  const [payableDebt, setPayableDebt] = useState<number>(20000000);

  // Infaq Produktif State
  const [infaqAmount, setInfaqAmount] = useState<number>(500000);
  const [infaqCategory, setInfaqCategory] = useState<string>(
    "Dana Bergulir Qardhul Hasan Modal Usaha Eks-PHK"
  );

  // Success Modal State
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Helper Currency Formatter
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Math.max(0, val));
  };

  // 1. Zakat Penghasilan Calculation (Nisab 524 kg beras / bulan)
  const nisabPenghasilanBulan = 524 * ricePrice; // ~Rp 7.860.000 / bulan
  const totalNetMonthlyIncome = Math.max(
    0,
    monthlyIncome + otherIncome - monthlyDebtExpense
  );
  const isPenghasilanWajib = totalNetMonthlyIncome >= nisabPenghasilanBulan;
  const zakatPenghasilanBulanan = isPenghasilanWajib
    ? totalNetMonthlyIncome * 0.025
    : 0;
  const zakatPenghasilanTahunan = zakatPenghasilanBulanan * 12;

  // 2. Zakat Maal Calculation (Nisab 85 gram emas)
  const nisabMaal = 85 * goldPrice; // ~Rp 120.700.000
  const totalMaalAssets =
    cashSavings + goldWeightGrams * goldPrice + otherLiquidAssets;
  const totalNetMaal = Math.max(0, totalMaalAssets - shortTermLiabilities);
  const isMaalWajib = totalNetMaal >= nisabMaal;
  const zakatMaalDue = isMaalWajib ? totalNetMaal * 0.025 : 0;

  // 3. Zakat Perdagangan (Nisab 85 gram emas)
  const totalTradingAssets = currentAssets + inventoryValue + receivables;
  const totalNetTrading = Math.max(0, totalTradingAssets - payableDebt);
  const isTradingWajib = totalNetTrading >= nisabMaal;
  const zakatTradingDue = isTradingWajib ? totalNetTrading * 0.025 : 0;

  // Current Active Payable Amount
  const currentPayableAmount = useMemo(() => {
    switch (activeType) {
      case "penghasilan":
        return zakatPenghasilanBulanan;
      case "maal":
        return zakatMaalDue;
      case "perdagangan":
        return zakatTradingDue;
      case "infaq_produktif":
        return infaqAmount;
      default:
        return 0;
    }
  }, [
    activeType,
    zakatPenghasilanBulanan,
    zakatMaalDue,
    zakatTradingDue,
    infaqAmount,
  ]);

  // Social Impact Estimation from Payable Amount
  const impactSummary = useMemo(() => {
    const amount = currentPayableAmount;
    const foodPackages = Math.max(1, Math.floor(amount / 150000));
    const microLoanPortion = Math.max(1, Math.floor(amount / 2500000));
    const traineesSupported = Math.max(1, Math.floor(amount / 350000));

    return {
      foodPackages,
      microLoanPortion,
      traineesSupported,
    };
  }, [currentPayableAmount]);

  const handleSalurkan = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setIsSuccessOpen(true);
    if (onDirectDonate) {
      onDirectDonate(currentPayableAmount, activeType);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  return (
    <div
      id="kalkulator-zakat-mandiri"
      className="bg-white rounded-3xl border border-emerald-300/80 shadow-xl overflow-hidden transition-all"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 p-6 sm:p-8 text-white relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <Calculator className="w-3.5 h-3.5" />
              <span>Kalkulator Syariah Mandiri • Standar BAZNAS & DSN-MUI</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
              Hitung Potensi Zakat & Infaq Produktif Anda
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/85 max-w-2xl">
              Bersihkan harta dan raih keberkahan rezeki dengan menyalurkan zakat, infaq, dan sedekah
              produktif untuk modal usaha mandiri bebas riba bagi saudara-saudara kita yang terdampak PHK.
            </p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-xs space-y-1 shrink-0">
            <div className="text-slate-400 font-medium flex items-center justify-between gap-3">
              <span>Nisab Emas (85g):</span>
              <strong className="text-amber-300 font-bold">{formatIDR(nisabMaal)}</strong>
            </div>
            <div className="text-slate-400 font-medium flex items-center justify-between gap-3">
              <span>Nisab Beras (524kg):</span>
              <strong className="text-emerald-300 font-bold">{formatIDR(nisabPenghasilanBulan)}/bln</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            onClick={() => setActiveType("penghasilan")}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeType === "penghasilan"
                ? "bg-emerald-800 text-white shadow-md"
                : "bg-white text-slate-700 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50"
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Zakat Penghasilan</span>
          </button>

          <button
            onClick={() => setActiveType("maal")}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeType === "maal"
                ? "bg-emerald-800 text-white shadow-md"
                : "bg-white text-slate-700 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Zakat Maal (Tabungan)</span>
          </button>

          <button
            onClick={() => setActiveType("perdagangan")}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeType === "perdagangan"
                ? "bg-emerald-800 text-white shadow-md"
                : "bg-white text-slate-700 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Zakat Perdagangan</span>
          </button>

          <button
            onClick={() => setActiveType("infaq_produktif")}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeType === "infaq_produktif"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-white text-amber-900 border border-amber-200 hover:border-amber-400 hover:bg-amber-50/50"
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-amber-600" />
            <span>Infaq Produktif Berdaya</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Form & Results Grid */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Column */}
        <div className="lg:col-span-7 space-y-5">
          {/* TAB 1: ZAKAT PENGHASILAN */}
          {activeType === "penghasilan" && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Zakat Profesi/Penghasilan</strong> wajib ditunaikan sebesar <strong>2,5%</strong> dari pendapatan
                  bersih bulanan jika telah mencapai nisab setara 524 kg beras (saat ini:{" "}
                  <strong>{formatIDR(nisabPenghasilanBulan)} / bulan</strong>).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Gaji / Penghasilan Pokok Bulanan:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">Rp</span>
                  <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Penghasilan Tambahan (Freelance / Bonus / Hasil Usaha):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">Rp</span>
                  <input
                    type="number"
                    value={otherIncome}
                    onChange={(e) => setOtherIncome(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pengeluaran Kebutuhan Pokok & Utang Rutin Bulanan:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">Rp</span>
                  <input
                    type="number"
                    value={monthlyDebtExpense}
                    onChange={(e) => setMonthlyDebtExpense(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-slate-900 font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ZAKAT MAAL */}
          {activeType === "maal" && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Zakat Maal (Harta Simpanan)</strong> wajib dikeluarkan <strong>2,5%</strong> setiap tahun jika
                  harta mengendap telah genap 1 tahun (haul) dan mencapai nisab 85 gram emas (saat ini:{" "}
                  <strong>{formatIDR(nisabMaal)}</strong>).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Uang Tunai, Tabungan & Deposito Syariah:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">Rp</span>
                  <input
                    type="number"
                    value={cashSavings}
                    onChange={(e) => setCashSavings(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Emas Simpanan (Gram):
                  </label>
                  <input
                    type="number"
                    value={goldWeightGrams}
                    onChange={(e) => setGoldWeightGrams(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-slate-900 font-semibold"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    = {formatIDR(goldWeightGrams * goldPrice)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Harga Emas Saat Ini (Rp/g):
                  </label>
                  <input
                    type="number"
                    value={goldPrice}
                    onChange={(e) => setGoldPrice(Math.max(100000, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Surat Berharga / Investasi Likuid Lainnya:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">Rp</span>
                  <input
                    type="number"
                    value={otherLiquidAssets}
                    onChange={(e) => setOtherLiquidAssets(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Utang Jangka Pendek Jatuh Tempo:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">Rp</span>
                  <input
                    type="number"
                    value={shortTermLiabilities}
                    onChange={(e) => setShortTermLiabilities(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-slate-900 font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ZAKAT PERDAGANGAN */}
          {activeType === "perdagangan" && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Zakat Perdagangan (Tijarah)</strong> dihitung dari (Aset Lancar + Nilai Stok Barang + Piutang
                  Lancar) dikurangi Utang Jatuh Tempo. Nisab setara 85 gram emas (<strong>{formatIDR(nisabMaal)}</strong>) per tahun.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Kas & Aset Lancar Usaha:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">Rp</span>
                    <input
                      type="number"
                      value={currentAssets}
                      onChange={(e) => setCurrentAssets(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 font-semibold text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nilai Stok Persediaan Barang:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">Rp</span>
                    <input
                      type="number"
                      value={inventoryValue}
                      onChange={(e) => setInventoryValue(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 font-semibold text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Piutang Lancar (Dapat Ditagih):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">Rp</span>
                    <input
                      type="number"
                      value={receivables}
                      onChange={(e) => setReceivables(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 font-semibold text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Utang Usaha Jatuh Tempo:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">Rp</span>
                    <input
                      type="number"
                      value={payableDebt}
                      onChange={(e) => setPayableDebt(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 font-semibold text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INFAQ PRODUKTIF BERDAYA */}
          {activeType === "infaq_produktif" && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Infaq & Sedekah Produktif</strong> tidak dibatasi nisab maupun haul. Berapapun nominal Anda
                  akan diputar menjadi modal usaha bergulir (Qardhul Hasan) 100% bebas bunga untuk para mustahik korban PHK.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pilih / Masukkan Nominal Infaq Produktif:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">Rp</span>
                  <input
                    type="number"
                    value={infaqAmount}
                    onChange={(e) => setInfaqAmount(Math.max(10000, Number(e.target.value)))}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-slate-900 font-bold text-lg"
                  />
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {[100000, 250000, 500000, 1000000, 2500000, 5000000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setInfaqAmount(preset)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        infaqAmount === preset
                          ? "bg-amber-600 text-white shadow-xs"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {formatIDR(preset)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Alokasi Peruntukan Penyaluran:
                </label>
                <select
                  value={infaqCategory}
                  onChange={(e) => setInfaqCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-amber-500 text-slate-800 text-xs font-medium bg-white"
                >
                  <option value="Dana Bergulir Qardhul Hasan Modal Usaha Eks-PHK">
                    Dana Bergulir Qardhul Hasan (Pinjaman Modal Usaha 0% Bunga)
                  </option>
                  <option value="Bantuan Pangan & Sembako Darurat Keluarga Terdampak">
                    Bantuan Pangan & Sembako Darurat Keluarga Korban PHK
                  </option>
                  <option value="Beasiswa Pelatihan Green Skills (Maggot & Aquaponik)">
                    Beasiswa Pelatihan Green Jobs (Maggot BSF, Aquaponik & Daur Ulang)
                  </option>
                  <option value="Pengadaan Bersama Konsorsium Koperasi Bahan Baku UMKM">
                    Subsidi Pengadaan Bersama Bahan Baku UMKM Jamaah
                  </option>
                  <option value="Operasional Studio Dakwah & TV Edukasi global.islamicity.tv">
                    Operasional Dakwah & TV Edukasi Fiqih Muamalah
                  </option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Right Calculation Outcome Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 rounded-3xl p-6 text-white space-y-5 border border-emerald-800/80 shadow-lg flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Hasil Perhitungan Syariah
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-800/80 text-emerald-200">
                Tarif 2.5%
              </span>
            </div>

            {/* Status Nisab Check */}
            {activeType !== "infaq_produktif" && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                  (activeType === "penghasilan" && isPenghasilanWajib) ||
                  (activeType === "maal" && isMaalWajib) ||
                  (activeType === "perdagangan" && isTradingWajib)
                    ? "bg-emerald-900/60 border-emerald-500/50 text-emerald-200"
                    : "bg-amber-950/60 border-amber-500/50 text-amber-200"
                }`}
              >
                <span>Status Kewajiban Syariah:</span>
                <strong className="font-extrabold text-sm">
                  {(activeType === "penghasilan" && isPenghasilanWajib) ||
                  (activeType === "maal" && isMaalWajib) ||
                  (activeType === "perdagangan" && isTradingWajib)
                    ? "WAJIB ZAKAT (Tercapai Nisab)"
                    : "BELUM WAJIB ZAKAT (Boleh Infaq)"}
                </strong>
              </div>
            )}

            {/* Primary Payable Value */}
            <div className="space-y-1">
              <div className="text-xs text-emerald-200 font-medium">
                {activeType === "penghasilan"
                  ? "Kewajiban Zakat Penghasilan Bulanan:"
                  : activeType === "maal"
                  ? "Kewajiban Zakat Maal Tahunan:"
                  : activeType === "perdagangan"
                  ? "Kewajiban Zakat Perdagangan Tahunan:"
                  : "Potensi Donasi Infaq Produktif:"}
              </div>
              <div className="text-3xl font-extrabold text-amber-300 tracking-tight">
                {formatIDR(currentPayableAmount)}
              </div>
              {activeType === "penghasilan" && isPenghasilanWajib && (
                <div className="text-[11px] text-slate-300">
                  Setara dengan <strong>{formatIDR(zakatPenghasilanTahunan)} / tahun</strong>
                </div>
              )}
            </div>

            {/* Impact Projection */}
            <div className="space-y-2 pt-2 border-t border-emerald-800/60">
              <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Dampak Nyata Jika Disalurkan ke Ekosistem:
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-xs">
                  <div className="text-[10px] text-emerald-200">Paket Pangan Sembako</div>
                  <div className="text-base font-bold text-white">
                    {impactSummary.foodPackages} Keluarga
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-xs">
                  <div className="text-[10px] text-emerald-200">Pemberdayaan Modal Usaha</div>
                  <div className="text-base font-bold text-amber-300">
                    {impactSummary.microLoanPortion} Unit UMKM
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 space-y-2">
            <button
              onClick={handleSalurkan}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-emerald-950 font-extrabold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-95"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-950" />
              <span>Salurkan Dana Kebaikan Ini</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-emerald-200/70 text-center">
              100% Bebas Potongan Ilegal • Disalurkan Langsung Melalui Rekening Khusus Syariah
            </p>
          </div>
        </div>
      </div>

      {/* Tuntunan Niat & Doa Syariah */}
      <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200/80 text-slate-700 text-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Doa Muzakki Menunaikan Zakat / Infaq:</span>
            </div>
            <p className="italic text-slate-600 font-serif text-sm">
              "Rabbana taqabbal minna, innaka Antas-Sami'ul 'Alim."
            </p>
            <p className="text-[11px] text-slate-500">
              "Ya Tuhan kami, terimalah daripada kami (amalan kami), sesungguhnya Engkaulah Yang Maha Mendengar lagi Maha Mengetahui." (QS. Al-Baqarah: 127)
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-[11px] text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
              📜 Fatwa DSN-MUI No. 19/DSN-MUI/IV/2001
            </span>
          </div>
        </div>
      </div>

      {/* Modal Penyaluran Donasi / Rekening Virtual Account */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-emerald-300 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold font-serif text-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span>Instruksi Penyaluran Dana Berkah</span>
              </div>
              <button
                onClick={() => setIsSuccessOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <div className="text-slate-500">Total Komitmen Penyaluran:</div>
                <div className="text-2xl font-extrabold text-emerald-950">
                  {formatIDR(currentPayableAmount)}
                </div>
                <div className="text-[11px] text-emerald-800 font-medium capitalize">
                  Kategori: {activeType.replace("_", " ")}
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-800">
                  Salurkan Melalui Rekening Virtual Account / Kas Syariah:
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        Bank Syariah Indonesia (BSI)
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        a.n. Yayasan IslamiCity Peduli PHK Umat
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      Bebas Riba
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      7720-2026-0088
                    </span>
                    <button
                      onClick={() => copyToClipboard("772020260088")}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded transition-colors cursor-pointer"
                    >
                      {copiedAccount ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin No. Rekening</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Setelah melakukan transfer, konfirmasi akan terverifikasi secara otomatis dan tercatat dalam
                  <strong> Dashboard Analitik Real-Time</strong> serta laporan audit berkala jamaah.
                </p>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setIsSuccessOpen(false)}
                className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Saya Sudah Paham & Siap Menunaikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
