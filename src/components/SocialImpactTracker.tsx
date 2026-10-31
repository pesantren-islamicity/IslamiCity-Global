import React, { useState, useMemo } from "react";
import {
  Leaf,
  Users,
  TrendingUp,
  Wind,
  Trees,
  Recycle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Info,
  Calendar,
  ExternalLink,
  Layers,
  BarChart3,
  Award,
  Download,
  FileSpreadsheet,
  FileText,
  UserCheck,
  Star,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { useEmpowerment } from "../context/EmpowermentContext";
import { SocialImpactExportModal } from "./SocialImpactExportModal";

export interface GreenCoopImpactProject {
  id: string;
  name: string;
  shortName: string;
  category: "Ekonomi Sirkular" | "Energi Terbarukan" | "Pertanian Organik" | "Zero Waste";
  livesImpacted: number; // in people
  co2ReducedKg: number; // in kg of CO2 equivalent
  treesEquivalent: number; // equivalent trees planted
  fundingAmount: number; // in IDR
  status: "Terdanai Penuh" | "Operasional Aktif";
  location: string;
  summary: string;
  fundedYear: string;
}

export const DEFAULT_GREEN_COOP_PROJECTS: GreenCoopImpactProject[] = [
  {
    id: "GCP-01",
    name: "Pengolahan Sampah Maggot BSF & Biokonversi Pasar",
    shortName: "Maggot BSF Sirkular",
    category: "Ekonomi Sirkular",
    livesImpacted: 520,
    co2ReducedKg: 2150,
    treesEquivalent: 108,
    fundingAmount: 50000000,
    status: "Operasional Aktif",
    location: "Pasar Induk Cibinong, Bogor",
    summary: "Menyerap 1,5 ton sampah basah per hari, mengubah limbah jadi pakan berprotein & kasgot pupuk.",
    fundedYear: "2025/2026",
  },
  {
    id: "GCP-02",
    name: "Sentra Budidaya Jamur Tiram Organik & Olahan Krispi",
    shortName: "Jamur Tiram Organik",
    category: "Pertanian Organik",
    livesImpacted: 380,
    co2ReducedKg: 1340,
    treesEquivalent: 67,
    fundingAmount: 35000000,
    status: "Operasional Aktif",
    location: "Sukoharjo, Jawa Tengah",
    summary: "Memanfaatkan 6.000 baglog serbuk gergaji mebel lokal dengan siklus panen 100% alami tanpa pestisida.",
    fundedYear: "2025/2026",
  },
  {
    id: "GCP-03",
    name: "Armada Gerobak Kopi & Kuliner Solar Cart Rooftop",
    shortName: "Solar Cart Kopi",
    category: "Energi Terbarukan",
    livesImpacted: 290,
    co2ReducedKg: 1680,
    treesEquivalent: 84,
    fundingAmount: 40000000,
    status: "Operasional Aktif",
    location: "Kuningan & Senayan, Jakarta",
    summary: "4 armada gerobak kopi bertenaga panel surya 200Wp, menggantikan genset berbahan bakar bensin bising.",
    fundedYear: "2025/2026",
  },
  {
    id: "GCP-04",
    name: "Kebun Aquaponik & Kolam Nila Atap Masjid Jamik",
    shortName: "Aquaponik Masjid",
    category: "Pertanian Organik",
    livesImpacted: 440,
    co2ReducedKg: 920,
    treesEquivalent: 46,
    fundingAmount: 30000000,
    status: "Operasional Aktif",
    location: "Sleman, D.I. Yogyakarta",
    summary: "Integrasi air kolam ikan dengan sayur pakcoy & selada hidroganik, hemat 90% air dibanding tanam biasa.",
    fundedYear: "2025/2026",
  },
  {
    id: "GCP-05",
    name: "Bank Sampah & Sentra Upcycling Plastik Bernilai Emas",
    shortName: "Bank Sampah Emas",
    category: "Zero Waste",
    livesImpacted: 610,
    co2ReducedKg: 2840,
    treesEquivalent: 142,
    fundingAmount: 45000000,
    status: "Operasional Aktif",
    location: "Bandung Wetan, Jawa Barat",
    summary: "Menghimpun pilahan plastik warga menjadi tabungan emas kurban & bahan baku papan daur ulang.",
    fundedYear: "2025/2026",
  },
  {
    id: "GCP-06",
    name: "Dapur Halal Bersama & Cloud Kitchen Zero Food Waste",
    shortName: "Dapur Zero Waste",
    category: "Zero Waste",
    livesImpacted: 480,
    co2ReducedKg: 1470,
    treesEquivalent: 74,
    fundingAmount: 42000000,
    status: "Operasional Aktif",
    location: "Surabaya Timur, Jawa Timur",
    summary: "Pemberdayaan ibu mantan pekerja pabrik dengan kemasan daun/besek & pengolahan jelantah jadi biodiesel.",
    fundedYear: "2025/2026",
  },
];

interface SocialImpactTrackerProps {
  projects?: GreenCoopImpactProject[];
  onNavigateToGreenCoop?: () => void;
}

export const SocialImpactTracker: React.FC<SocialImpactTrackerProps> = ({
  projects = DEFAULT_GREEN_COOP_PROJECTS,
  onNavigateToGreenCoop,
}) => {
  const { userProfile, currentTier, setIsProfileModalOpen } = useEmpowerment();
  const [metricMode, setMetricMode] = useState<"both" | "lives" | "co2">("both");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeProject, setActiveProject] = useState<GreenCoopImpactProject | null>(projects[0] || null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(true);

  // Personal contribution metrics (calculated based on logged-in user profile & activities)
  const personalContribution = useMemo(() => {
    // Proyek GCP-01 didanai Rp 500.000 + pengadaan kemasan hijau Rp 420.000
    const totalDonation = 920000;
    const personalLives = 9;
    const personalCo2Kg = 38.6;
    const personalTrees = 2;
    const fundedProjectIds = ["GCP-01"];

    return {
      isLoggedIn: isUserLoggedIn,
      userProfile,
      currentTier,
      totalDonation,
      personalLives,
      personalCo2Kg,
      personalTrees,
      fundedProjectIds,
    };
  }, [isUserLoggedIn, userProfile, currentTier]);

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  // Aggregate totals
  const totalLivesImpacted = useMemo(() => {
    return projects.reduce((acc, curr) => acc + curr.livesImpacted, 0);
  }, [projects]);

  const totalCo2ReducedKg = useMemo(() => {
    return projects.reduce((acc, curr) => acc + curr.co2ReducedKg, 0);
  }, [projects]);

  const totalCo2Tons = (totalCo2ReducedKg / 1000).toFixed(2);

  const totalTreesEquivalent = useMemo(() => {
    return projects.reduce((acc, curr) => acc + curr.treesEquivalent, 0);
  }, [projects]);

  const totalCapitalFunded = useMemo(() => {
    return projects.reduce((acc, curr) => acc + curr.fundingAmount, 0);
  }, [projects]);

  // Chart data format
  const chartData = useMemo(() => {
    return filteredProjects.map((p) => ({
      id: p.id,
      name: p.shortName,
      fullName: p.name,
      livesImpacted: p.livesImpacted,
      co2Reduced: p.co2ReducedKg,
      co2Tons: (p.co2ReducedKg / 1000).toFixed(2),
      category: p.category,
      raw: p,
    }));
  }, [filteredProjects]);

  const categories = ["all", "Ekonomi Sirkular", "Energi Terbarukan", "Pertanian Organik", "Zero Waste"];

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs backdrop-blur-md max-w-xs space-y-2">
          <div className="font-bold text-slate-100 border-b border-slate-700/80 pb-1.5 flex items-center justify-between gap-2">
            <span>{data.fullName}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-300 font-normal">
              {data.category}
            </span>
          </div>
          <div className="space-y-1 text-slate-300">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-teal-300">
                <Users className="w-3.5 h-3.5" />
                Jiwa Terdampak:
              </span>
              <strong className="text-white font-bold">{data.livesImpacted.toLocaleString("id-ID")} Jiwa</strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <Wind className="w-3.5 h-3.5" />
                Reduksi Emisi CO₂:
              </span>
              <strong className="text-white font-bold">{data.co2Reduced.toLocaleString("id-ID")} kg ({data.co2Tons} Ton)</strong>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-800 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Trees className="w-3 h-3 text-lime-400" />
                Setara Serapan Pohon:
              </span>
              <span className="text-lime-300 font-semibold">{data.raw.treesEquivalent} Pohon</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="social-impact-tracker" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
      {/* Header and Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verifikasi Dampak Hijau & Kemanusiaan</span>
            </span>
            {isUserLoggedIn && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                <UserCheck className="w-3 h-3 text-teal-600" />
                <span>Akun Terhubung: {userProfile.name.split(" ")[0]}</span>
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            Social Impact Tracker
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Visualisasi transparan dampak nyata proyek <strong>Green Coop</strong> yang telah didanai jamaah:
            jumlah jiwa terbina bebas riba dan reduksi emisi karbon (CO₂) demi kelestarian bumi nusantara.
          </p>
        </div>

        {/* Global Key Impact Cards & Export Action Button */}
        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-teal-50/90 border border-teal-200/90 flex flex-col justify-between min-w-[100px]">
              <div className="flex items-center justify-between text-teal-800 text-[10px] font-semibold">
                <span>Total Jiwa</span>
                <Users className="w-3 h-3 text-teal-600" />
              </div>
              <div className="mt-1">
                <span className="text-lg sm:text-xl font-black text-teal-950 font-serif">
                  {totalLivesImpacted.toLocaleString("id-ID")}
                </span>
                <span className="text-[10px] text-teal-700 ml-0.5 font-medium">Jiwa</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/90 border border-emerald-200/90 flex flex-col justify-between min-w-[100px]">
              <div className="flex items-center justify-between text-emerald-800 text-[10px] font-semibold">
                <span>Reduksi CO₂</span>
                <Wind className="w-3 h-3 text-emerald-600" />
              </div>
              <div className="mt-1">
                <span className="text-lg sm:text-xl font-black text-emerald-950 font-serif">
                  {totalCo2Tons}
                </span>
                <span className="text-[10px] text-emerald-700 ml-0.5 font-medium">Ton</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-lime-50/90 border border-lime-200/90 flex flex-col justify-between min-w-[100px]">
              <div className="flex items-center justify-between text-lime-900 text-[10px] font-semibold">
                <span>Pohon</span>
                <Trees className="w-3 h-3 text-lime-700" />
              </div>
              <div className="mt-1">
                <span className="text-lg sm:text-xl font-black text-lime-950 font-serif">
                  {totalTreesEquivalent.toLocaleString("id-ID")}
                </span>
                <span className="text-[10px] text-lime-800 ml-0.5 font-medium">Phn</span>
              </div>
            </div>
          </div>

          {/* Export Action Button */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer border border-emerald-600 shrink-0 group"
            title="Ekspor Laporan Audit Dampak Sosial & Lingkungan dalam PDF atau CSV"
          >
            <Download className="w-4 h-4 text-amber-300 group-hover:-translate-y-0.5 transition-transform" />
            <div className="text-left">
              <span className="block leading-tight font-extrabold text-[12px]">Ekspor Laporan</span>
              <span className="block text-[10px] text-emerald-200 font-normal">PDF Resmi & CSV Data</span>
            </div>
          </button>
        </div>
      </div>

      {/* HIGHLIGHTED PERSONAL CONTRIBUTION BANNER (If Logged In) */}
      {isUserLoggedIn ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white border border-emerald-700 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-700/60 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm shadow-sm font-serif shrink-0">
                {userProfile.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-white text-sm sm:text-base font-serif">
                    Kontribusi Pribadi Anda Terverifikasi
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                    Lvl {currentTier.level} {currentTier.name}
                  </span>
                </div>
                <p className="text-xs text-emerald-200">
                  {userProfile.name} • {userProfile.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Laporan Saya (PDF/CSV)</span>
              </button>
              <button
                onClick={() => setIsUserLoggedIn(false)}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] transition-colors cursor-pointer"
                title="Beralih ke mode tamu tanpa data pribadi"
              >
                Mode Tamu
              </button>
            </div>
          </div>

          {/* 4 Personal Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-emerald-200 block uppercase tracking-wider">Modal Anda Disalurkan</span>
              <strong className="text-base sm:text-lg text-amber-300 font-bold">
                Rp {personalContribution.totalDonation.toLocaleString("id-ID")}
              </strong>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-emerald-200 block uppercase tracking-wider">Jiwa Dhuafa Terbina</span>
              <strong className="text-base sm:text-lg text-teal-300 font-bold">
                ~{personalContribution.personalLives} Jiwa
              </strong>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-emerald-200 block uppercase tracking-wider">Reduksi Karbon Pribadi</span>
              <strong className="text-base sm:text-lg text-emerald-300 font-bold">
                {personalContribution.personalCo2Kg} kg CO₂
              </strong>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-emerald-200 block uppercase tracking-wider">Setara Serapan Pohon</span>
              <strong className="text-base sm:text-lg text-lime-300 font-bold">
                ~{personalContribution.personalTrees} Pohon
              </strong>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-emerald-200/90 pt-1">
            <span className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>
                Didanai pada: <strong>Proyek GCP-01 (Maggot BSF Pasar)</strong> & Konsorsium Kemasan Hijau GP-02.
              </span>
            </span>
            <span className="hidden sm:inline text-emerald-300/70">
              Akad Syirkah Mudharabah & Hibah Muqayyadah (0% Riba)
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Info className="w-4 h-4 text-slate-500 shrink-0" />
            <span>
              Anda sedang dalam <strong>Mode Tamu Publik</strong>. Menampilkan statistik agregat seluruh jamaah.
            </span>
          </div>
          <button
            onClick={() => setIsUserLoggedIn(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Masuk Sebagai {userProfile.name.split(" ")[0]} (Sorot Kontribusi Pribadi)</span>
          </button>
        </div>
      )}

      {/* Control Bar: Metric Selector & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Metric Mode Toggle (Interactive segmented buttons) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setMetricMode("both")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              metricMode === "both"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Gabungan (Jiwa & CO₂)
          </button>
          <button
            onClick={() => setMetricMode("lives")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              metricMode === "lives"
                ? "bg-teal-700 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Hanya Jiwa</span>
          </button>
          <button
            onClick={() => setMetricMode("co2")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              metricMode === "co2"
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Hanya CO₂ (kg)</span>
          </button>
        </div>

        {/* Category Filter Pills (Functional interactive buttons) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1 shrink-0">Kategori:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer text-xs ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-200/70 border border-slate-200/80"
              }`}
            >
              {cat === "all" ? "Semua Proyek" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Bar Chart Area */}
      <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-6 border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Grafik Komparasi Dampak per Proyek Koperasi Hijau
            </h3>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-teal-600 inline-block" />
              <span>Jiwa Terdampak (Orang)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
              <span>Reduksi CO₂ (kg)</span>
            </span>
          </div>
        </div>

        {/* BarChart Container */}
        <div className="w-full h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 15, right: 20, left: -5, bottom: 25 }}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload.length) {
                  const clicked = e.activePayload[0].payload.raw;
                  setActiveProject(clicked);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#475569", fontSize: 11, fontWeight: 500 }}
                axisLine={{ stroke: "#CBD5E1" }}
                tickLine={false}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                tick={{ fill: "#64748B", fontSize: 11 }}
                axisLine={{ stroke: "#CBD5E1" }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 10, fontSize: 12 }}
              />

              {(metricMode === "both" || metricMode === "lives") && (
                <Bar
                  dataKey="livesImpacted"
                  name="Jiwa Terdampak"
                  fill="#0F766E"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={45}
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={`cell-lives-${entry.id}`}
                      fill={activeProject?.id === entry.id ? "#042F2E" : "#0F766E"}
                      className="cursor-pointer transition-colors"
                    />
                  ))}
                </Bar>
              )}

              {(metricMode === "both" || metricMode === "co2") && (
                <Bar
                  dataKey="co2Reduced"
                  name="Reduksi CO₂ (kg)"
                  fill="#10B981"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={45}
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={`cell-co2-${entry.id}`}
                      fill={activeProject?.id === entry.id ? "#065F46" : "#10B981"}
                      className="cursor-pointer transition-colors"
                    />
                  ))}
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-[11px] text-slate-500 mt-2 text-center">
          💡 Klik batang grafik atau kartu proyek di bawah untuk melihat rincian kalkulasi audit dampak sosial & lingkungan.
        </p>
      </div>

      {/* Selected Project Dossier / Highlight */}
      {activeProject && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white border border-emerald-800 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium">
                <span>{activeProject.category}</span>
                <span aria-hidden="true">·</span>
                <span>{activeProject.location}</span>
                <span aria-hidden="true">·</span>
                <span>Tahun {activeProject.fundedYear}</span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold font-serif text-white mt-1">
                {activeProject.name}
              </h4>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              {isUserLoggedIn && personalContribution.fundedProjectIds.includes(activeProject.id) && (
                <span className="text-xs bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Didanai Anda (Rp 500.000)</span>
                </span>
              )}
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-400/30 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {activeProject.status}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {activeProject.summary}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Jiwa Penerima</span>
              <strong className="text-base sm:text-lg text-teal-300 font-bold">
                {activeProject.livesImpacted.toLocaleString("id-ID")} Jiwa
              </strong>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Reduksi Emisi</span>
              <strong className="text-base sm:text-lg text-emerald-300 font-bold">
                {activeProject.co2ReducedKg.toLocaleString("id-ID")} kg CO₂
              </strong>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Setara Pohon</span>
              <strong className="text-base sm:text-lg text-lime-300 font-bold">
                {activeProject.treesEquivalent} Pohon
              </strong>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Modal Terdanai</span>
              <strong className="text-base sm:text-lg text-amber-300 font-bold">
                Rp {activeProject.fundingAmount.toLocaleString("id-ID")}
              </strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
            <span className="text-slate-300 text-[11px]">
              🔒 Data diaudit berkala sesuai standar Pelaporan ESG Syariah & Fiqih Bi'ah (Kelestarian Lingkungan).
            </span>

            {onNavigateToGreenCoop && (
              <button
                onClick={onNavigateToGreenCoop}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Lihat Blueprint & Beli Bersama di Green Coop</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grid of Funded Projects Cards */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Daftar Proyek Koperasi Hijau Terdanai ({filteredProjects.length})
          </h4>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Data Semua Proyek</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredProjects.map((p) => {
            const isSelected = activeProject?.id === p.id;
            const isFundedByMe = isUserLoggedIn && personalContribution.fundedProjectIds.includes(p.id);

            return (
              <div
                key={p.id}
                onClick={() => setActiveProject(p)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative ${
                  isSelected
                    ? "bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-500"
                    : isFundedByMe
                    ? "bg-emerald-50/40 border-emerald-300 hover:border-emerald-400"
                    : "bg-slate-50 hover:bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                {isFundedByMe && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-2xs">
                    <Star className="w-2.5 h-2.5 fill-slate-950" />
                    <span>Didanai Anda</span>
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5 pr-20">
                    <span className="font-semibold text-emerald-800">{p.category}</span>
                    <span>{p.location.split(",")[0]}</span>
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm leading-snug">
                    {p.name}
                  </h5>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {p.summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Jiwa Terdampak</span>
                    <strong className="text-teal-700 font-bold">
                      {p.livesImpacted.toLocaleString("id-ID")} Jiwa
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Reduksi CO₂</span>
                    <strong className="text-emerald-700 font-bold">
                      {p.co2ReducedKg.toLocaleString("id-ID")} kg
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Modal Component */}
      <SocialImpactExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        projects={projects}
        personalInfo={personalContribution}
        onToggleLogin={() => setIsUserLoggedIn(!isUserLoggedIn)}
      />
    </div>
  );
};
