import React, { useState, useMemo } from "react";
import {
  Coins,
  TrendingUp,
  Users,
  ShieldCheck,
  Award,
  ArrowUpRight,
  Sparkles,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
  Filter,
  DollarSign,
  HeartHandshake,
  Activity,
  Briefcase,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  Building2,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ZakatInfaqAnalyticsDashboardProps {
  onOpenApplyModal?: () => void;
  onOpenDonateModal?: () => void;
}

// Monthly trend data for Zakat/Infaq & Qardhul Hasan
const monthlyTrendData = [
  {
    month: "Sep 25",
    terhimpun: 1450,
    tersalurkan: 1200,
    pengembalianBergulir: 320,
    usahaBangkit: 24,
  },
  {
    month: "Okt 25",
    terhimpun: 1820,
    tersalurkan: 1650,
    pengembalianBergulir: 490,
    usahaBangkit: 38,
  },
  {
    month: "Nov 25",
    terhimpun: 2150,
    tersalurkan: 1980,
    pengembalianBergulir: 680,
    usahaBangkit: 49,
  },
  {
    month: "Des 25",
    terhimpun: 2780,
    tersalurkan: 2400,
    pengembalianBergulir: 890,
    usahaBangkit: 65,
  },
  {
    month: "Jan 26",
    terhimpun: 3420,
    tersalurkan: 3100,
    pengembalianBergulir: 1150,
    usahaBangkit: 82,
  },
  {
    month: "Feb 26 (Live)",
    terhimpun: 4120,
    tersalurkan: 3850,
    pengembalianBergulir: 1420,
    usahaBangkit: 106,
  },
];

// Distribution by Business Sector
const sectorDistribution = [
  { name: "Pertanian Hijau & Maggot BSF", value: 36, amount: 1386000000, color: "#10b981" },
  { name: "Sentra Kuliner Halal Komunitas", value: 27, amount: 1039500000, color: "#0d9488" },
  { name: "Bengkel & Teknologi Terapan", value: 18, amount: 693000000, color: "#0284c7" },
  { name: "Koperasi Grosir Sembako Jamaah", value: 12, amount: 462000000, color: "#f59e0b" },
  { name: "Bank Sampah & Daur Ulang Berkah", value: 7, amount: 269500000, color: "#84cc16" },
];

// Economic Impact comparison (Before vs After 3-6 months assistance)
const impactMetricsData = [
  {
    metric: "Rata-rata Pendapatan Keluarga",
    sebelum: 2.1,
    sesudah: 6.8,
    unit: "Juta Rp/Bln",
    growth: "+223%",
  },
  {
    metric: "Penciptaan Lapangan Kerja Baru",
    sebelum: 1.0,
    sesudah: 3.4,
    unit: "Orang/Unit",
    growth: "+240%",
  },
  {
    metric: "Kepemilikan Tabungan Darurat",
    sebelum: 0.8,
    sesudah: 4.5,
    unit: "Juta Rp",
    growth: "+462%",
  },
  {
    metric: "Kemandirian Pangan Mandiri",
    sebelum: 30,
    sesudah: 88,
    unit: "% Kecukupan",
    growth: "+193%",
  },
];

// Live Real-Time Activity Feed
const recentDisbursementFeed = [
  {
    id: "TX-9901",
    penerima: "Ahmad Fauzi (Eks Manufaktur)",
    usaha: "Budidaya Maggot & Pupuk Kasgot",
    lokasi: "Bogor, Jawa Barat",
    nominal: "Rp 15.000.000",
    tipe: "Qardhul Hasan 0%",
    waktu: "12 menit lalu",
    dampak: "Mempekerjakan 3 eks-buruh pabrik",
    status: "Tersalurkan",
  },
  {
    id: "TX-9902",
    penerima: "Siti Nurhaliza (Eks Retail)",
    usaha: "Katering Halal Komunitas",
    lokasi: "Depok, Jawa Barat",
    nominal: "Rp 8.000.000",
    tipe: "Qardhul Hasan 0%",
    waktu: "48 menit lalu",
    dampak: "Suplai 60 porsi bekal sehat/hari",
    status: "Tersalurkan",
  },
  {
    id: "TX-9903",
    penerima: "Kelompok Tani Barakah Hijau",
    usaha: "Kumbung Jamur Tiram Organik",
    lokasi: "Sukoharjo, Jateng",
    nominal: "Rp 28.500.000",
    tipe: "Mudharabah Jamaah",
    waktu: "2 jam lalu",
    dampak: "5 Kepala Keluarga mandiri",
    status: "Tersalurkan",
  },
  {
    id: "TX-9904",
    penerima: "Hendra Kurniawan (Eks Fintech)",
    usaha: "Bengkel Konversi Motor Listrik",
    lokasi: "Bandung, Jawa Barat",
    nominal: "Rp 20.000.000",
    tipe: "Qardhul Hasan 0%",
    waktu: "4 jam lalu",
    dampak: "2 mekanik muda terbina",
    status: "Disetujui",
  },
];

export const ZakatInfaqAnalyticsDashboard: React.FC<ZakatInfaqAnalyticsDashboardProps> = ({
  onOpenApplyModal,
  onOpenDonateModal,
}) => {
  const [timeframe, setTimeframe] = useState<"all" | "q1" | "month">("all");
  const [selectedChartTab, setSelectedChartTab] = useState<"trend" | "impact" | "sector">("trend");
  const [multiplierInput, setMultiplierInput] = useState<number>(10000000);

  // Currency Formatter
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Multiplier calculations (How dana bergulir multiplies over 3 years)
  const multiplierImpact = useMemo(() => {
    const fundedBusinesses = Math.max(1, Math.floor(multiplierInput / 5000000) * 3);
    const workersEmployed = Math.round(fundedBusinesses * 2.8);
    const familyMembersSupported = workersEmployed * 4;
    const estimatedNewZakatGenerated = multiplierInput * 0.15;

    return {
      fundedBusinesses,
      workersEmployed,
      familyMembersSupported,
      estimatedNewZakatGenerated,
    };
  }, [multiplierInput]);

  return (
    <div
      id="zakat-infaq-analytics-dashboard"
      className="bg-white rounded-3xl border border-emerald-200/90 shadow-xl overflow-hidden transition-all"
    >
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 sm:p-8 text-white relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Transparansi Real-Time 100% Bebas Riba
              </span>
              <span className="inline-flex items-center gap-1 text-slate-300 text-xs bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Audit Fiqih DSN-MUI & BAZNAS Terakreditasi
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight">
              Dashboard Analitik Zakat, Infaq & Qardhul Hasan
            </h2>
            <p className="text-emerald-100/85 text-xs sm:text-sm leading-relaxed">
              Monitoring langsung penghimpunan dana kebajikan umat, penyaluran pinjaman kebajikan (0% bunga),
              serta dampak riil kebangkitan ekonomi mustahik menjadi muzakki berdaya.
            </p>
          </div>

          {/* Timeframe & Refresh Action */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <div className="bg-slate-800/90 p-1 rounded-xl border border-slate-700 flex items-center gap-1 text-xs">
              <button
                onClick={() => setTimeframe("month")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  timeframe === "month"
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Bulan Ini
              </button>
              <button
                onClick={() => setTimeframe("q1")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  timeframe === "q1"
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Q1 2026
              </button>
              <button
                onClick={() => setTimeframe("all")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  timeframe === "all"
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Semua Data
              </button>
            </div>

            {onOpenApplyModal && (
              <button
                onClick={onOpenApplyModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-emerald-950 text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Ajukan Qardhul Hasan</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards Row (6 Metric Badges) */}
      <div className="p-6 sm:p-8 bg-slate-50/70 border-b border-slate-200/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* KPI 1 */}
          <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-xs space-y-1.5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Dana Qardhul Hasan</span>
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <Coins className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold text-slate-900">Rp 3,85 M</div>
            <div className="flex items-center text-[11px] font-medium text-emerald-700 gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>100% Tersalurkan (0% Bunga)</span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-white p-4 rounded-2xl border border-teal-200/80 shadow-xs space-y-1.5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Zakat & Infaq Terhimpun</span>
              <div className="p-1.5 rounded-lg bg-teal-100 text-teal-800">
                <HeartHandshake className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold text-slate-900">Rp 4,12 M</div>
            <div className="flex items-center text-[11px] font-medium text-teal-700 gap-1">
              <span className="font-semibold text-teal-800">+24.2%</span>
              <span>Penghimpunan Jamaah</span>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-white p-4 rounded-2xl border border-blue-200/80 shadow-xs space-y-1.5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Penerima Manfaat Eks-PHK</span>
              <div className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold text-slate-900">384 UMKM</div>
            <div className="flex items-center text-[11px] font-medium text-blue-700 gap-1">
              <span>1.280 Jiwa Keluarga</span>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs space-y-1.5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Rasio Pengembalian Amanah</span>
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold text-slate-900">99,4%</div>
            <div className="flex items-center text-[11px] font-medium text-amber-700 gap-1">
              <span>NFR Rendah • Amanah Bergulir</span>
            </div>
          </div>

          {/* KPI 5 */}
          <div className="bg-white p-4 rounded-2xl border border-purple-200/80 shadow-xs space-y-1.5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Mustahik ➔ Muzakki</span>
              <div className="p-1.5 rounded-lg bg-purple-100 text-purple-800">
                <Award className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold text-slate-900">64,2%</div>
            <div className="flex items-center text-[11px] font-medium text-purple-700 gap-1">
              <span>Transformasi Kemandirian</span>
            </div>
          </div>

          {/* KPI 6 */}
          <div className="bg-white p-4 rounded-2xl border border-lime-200/80 shadow-xs space-y-1.5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Kenaikan Omset Usaha</span>
              <div className="p-1.5 rounded-lg bg-lime-100 text-lime-800">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold text-slate-900">+142,8%</div>
            <div className="flex items-center text-[11px] font-medium text-lime-700 gap-1">
              <span>Rata-rata 3 Bulan Binaan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Tabs */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* Visualizer Tab Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedChartTab("trend")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedChartTab === "trend"
                  ? "bg-emerald-800 text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Tren Penyaluran & Dana Bergulir</span>
            </button>

            <button
              onClick={() => setSelectedChartTab("impact")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedChartTab === "impact"
                  ? "bg-emerald-800 text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dampak Ekonomi Nyata Penerima</span>
            </button>

            <button
              onClick={() => setSelectedChartTab("sector")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedChartTab === "sector"
                  ? "bg-emerald-800 text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <PieIcon className="w-4 h-4" />
              <span>Distribusi Sektor Usaha Mandiri</span>
            </button>
          </div>

          <span className="text-xs text-slate-500 flex items-center gap-1.5 self-end sm:self-auto">
            <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            Data diperbarui otomatis setiap jam
          </span>
        </div>

        {/* Tab 1: Trend Penyaluran & Dana Bergulir (Area Chart) */}
        {selectedChartTab === "trend" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
              <p>
                Menampilkan perbandingan <strong>Total Dana Terhimpun (Zakat/Infaq)</strong>,{" "}
                <strong>Penyaluran Qardhul Hasan (Juta Rp)</strong>, dan{" "}
                <strong>Dana Cicilan Pokok yang Berhasil Bergulir Kembali</strong> untuk mendanai wirausaha berikutnya.
              </p>
              <div className="flex items-center gap-4 text-xs font-medium shrink-0">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-600"></span> Penyaluran Modal (Juta Rp)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span> Dana Bergulir Kembali (Juta Rp)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-teal-400"></span> Zakat & Infaq Terhimpun
                </span>
              </div>
            </div>

            <div className="h-72 w-full bg-slate-50/50 p-4 rounded-2xl border border-slate-200/80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyTrendData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTersalurkan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorBergulir" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorTerhimpun" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      fontSize: "12px",
                    }}
                    formatter={(value: any, name: any) => {
                      if (name === "tersalurkan") return [`Rp ${value} Juta`, "Penyaluran Qardhul Hasan"];
                      if (name === "pengembalianBergulir") return [`Rp ${value} Juta`, "Dana Bergulir Kembali"];
                      if (name === "terhimpun") return [`Rp ${value} Juta`, "Zakat/Infaq Terhimpun"];
                      return [value, name];
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="terhimpun"
                    stroke="#0d9488"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTerhimpun)"
                  />
                  <Area
                    type="monotone"
                    dataKey="tersalurkan"
                    stroke="#059669"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTersalurkan)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pengembalianBergulir"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorBergulir)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 2: Dampak Ekonomi Nyata (Bar Chart Before vs After) */}
        {selectedChartTab === "impact" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
              <p>
                Riset evaluasi dampak sosial-ekonomi terhadap <strong>384 Mustahik & Alumni PHK</strong> sebelum vs sesudah
                menerima pembiayaan Qardhul Hasan dan pembinaan ekosistem IslamiCity.
              </p>
              <div className="flex items-center gap-4 text-xs font-medium shrink-0">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-400"></span> Kondisi Saat PHK / Awal
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-600"></span> Setelah 3 Bulan Binaan Mandiri
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 h-72 w-full bg-slate-50/50 p-4 rounded-2xl border border-slate-200/80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={impactMetricsData}
                    margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="metric" tick={{ fill: "#475569", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        color: "#fff",
                        borderRadius: "12px",
                        border: "none",
                        fontSize: "12px",
                      }}
                      formatter={(value: any, name: any) => {
                        return [value, name === "sebelum" ? "Sebelum" : "Sesudah Binaan"];
                      }}
                    />
                    <Bar dataKey="sebelum" fill="#94a3b8" radius={[6, 6, 0, 0]} name="Kondisi Awal" />
                    <Bar dataKey="sesudah" fill="#059669" radius={[6, 6, 0, 0]} name="Pasca Binaan" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Impact Highlights */}
              <div className="lg:col-span-4 space-y-3">
                {impactMetricsData.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800">{item.metric}</div>
                      <div className="text-[11px] text-slate-500">
                        {item.sebelum} ➔ <strong className="text-emerald-700 font-bold">{item.sesudah} {item.unit}</strong>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                      {item.growth}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Sektor Usaha Mandiri (Pie & Detailed List) */}
        {selectedChartTab === "sector" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 h-72 w-full bg-slate-50/50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {sectorDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: "12px",
                      border: "none",
                      fontSize: "12px",
                    }}
                    formatter={(value: any, name: any) => [`${value}% Porsi Penyaluran`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="lg:col-span-6 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Alokasi Modal Produktif Berdasarkan Klaster
              </h4>
              {sectorDistribution.map((sec, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between hover:border-emerald-400 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: sec.color }}
                    ></span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{sec.name}</div>
                      <div className="text-[11px] text-slate-500">{formatIDR(sec.amount)}</div>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {sec.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Multiplier Effect Interactive Simulator & Live Transaction Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-slate-200">
          {/* Multiplier Simulator */}
          <div className="lg:col-span-6 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-6 rounded-3xl text-white space-y-5 border border-emerald-800/60 shadow-lg">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Simulasi Efek Bergulir (Multiplier Effect)
              </div>
              <h3 className="text-lg font-bold font-serif text-white">
                Hitung Dampak Zakat/Infaq Anda dalam 3 Tahun
              </h3>
              <p className="text-xs text-emerald-200/80">
                Karena dana Qardhul Hasan dikembalikan 100% tanpa bunga dan diputar kembali ke mustahik baru,
                nilai infaq Anda terus berlipat ganda menjadi amal jariyah abadi.
              </p>
            </div>

            {/* Slider Input */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Nilai Zakat / Infaq Anda:</span>
                <span className="text-amber-300 font-bold text-sm">
                  {formatIDR(multiplierInput)}
                </span>
              </div>
              <input
                type="range"
                min={2000000}
                max={50000000}
                step={1000000}
                value={multiplierInput}
                onChange={(e) => setMultiplierInput(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Rp 2 Juta</span>
                <span>Rp 25 Juta</span>
                <span>Rp 50 Juta</span>
              </div>
            </div>

            {/* Simulated Outcomes */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-xs space-y-1">
                <div className="text-[11px] text-emerald-200 font-medium">Usaha Mandiri Didanai</div>
                <div className="text-xl font-extrabold text-amber-300">
                  {multiplierImpact.fundedBusinesses} Unit Usaha
                </div>
                <div className="text-[10px] text-slate-300">Secara bergulir 3 siklus</div>
              </div>

              <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-xs space-y-1">
                <div className="text-[11px] text-emerald-200 font-medium">Tenaga Kerja Terserap</div>
                <div className="text-xl font-extrabold text-emerald-300">
                  {multiplierImpact.workersEmployed} Orang
                </div>
                <div className="text-[10px] text-slate-300">Korban PHK terselamatkan</div>
              </div>

              <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-xs space-y-1">
                <div className="text-[11px] text-emerald-200 font-medium">Jiwa Keluarga Terbantu</div>
                <div className="text-xl font-extrabold text-teal-300">
                  {multiplierImpact.familyMembersSupported} Jiwa
                </div>
                <div className="text-[10px] text-slate-300">Kebutuhan makan & sekolah</div>
              </div>

              <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-xs space-y-1">
                <div className="text-[11px] text-emerald-200 font-medium">Zakat Baru Tercipta</div>
                <div className="text-xl font-extrabold text-amber-200">
                  {formatIDR(multiplierImpact.estimatedNewZakatGenerated)}
                </div>
                <div className="text-[10px] text-slate-300">Dari mustahik jadi muzakki</div>
              </div>
            </div>
          </div>

          {/* Live Feed Penyaluran Terkini */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-serif">
                  Aktivitas Penyaluran & Pengembalian Terkini
                </h4>
                <p className="text-xs text-slate-500">
                  Transparansi penerima manfaat dan realisasi akad syariah.
                </p>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Live Audit
              </span>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {recentDisbursementFeed.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-500/70 transition-all shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{item.penerima}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        {item.lokasi}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-700">{item.nominal}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-medium text-slate-700">{item.usaha}</span>
                    <span className="text-[11px] text-slate-400">{item.waktu}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                    <span className="text-emerald-800 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {item.dampak}
                    </span>
                    <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded text-[10px]">
                      {item.tipe}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
