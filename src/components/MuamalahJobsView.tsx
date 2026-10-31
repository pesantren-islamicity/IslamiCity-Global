import React, { useState } from "react";
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  PlusCircle,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Repeat,
  UserCheck,
  Share2,
  Mail,
} from "lucide-react";
import { JobOpportunity, SkillBarterListing } from "../types";
import { useEmpowerment } from "../context/EmpowermentContext";

interface MuamalahJobsViewProps {
  jobs: JobOpportunity[];
  barterListings: SkillBarterListing[];
  onAddJob: (job: JobOpportunity) => void;
  onAddBarter: (barter: SkillBarterListing) => void;
}

export const MuamalahJobsView: React.FC<MuamalahJobsViewProps> = ({
  jobs,
  barterListings,
  onAddJob,
  onAddBarter,
}) => {
  const { awardPoints } = useEmpowerment();
  const [activeTab, setActiveTab] = useState<"jobs" | "barter">("jobs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [onlyGreen, setOnlyGreen] = useState(false);

  // Modals
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isBarterModalOpen, setIsBarterModalOpen] = useState(false);
  const [appliedJobTitle, setAppliedJobTitle] = useState<string | null>(null);

  // New Job Form State
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobOrg, setNewJobOrg] = useState("");
  const [newJobType, setNewJobType] = useState<any>("Full-time");
  const [newJobCategory, setNewJobCategory] = useState<any>("Teknologi & Digital");
  const [newJobLocation, setNewJobLocation] = useState("");
  const [newJobComp, setNewJobComp] = useState("");
  const [newJobDesc, setNewJobDesc] = useState("");
  const [newJobReqs, setNewJobReqs] = useState("");
  const [newJobIsGreen, setNewJobIsGreen] = useState(false);

  // New Barter Form State
  const [barterName, setBarterName] = useState("");
  const [barterFormerRole, setBarterFormerRole] = useState("");
  const [barterCity, setBarterCity] = useState("");
  const [barterOffer, setBarterOffer] = useState("");
  const [barterSeek, setBarterSeek] = useState("");
  const [barterNotes, setBarterNotes] = useState("");
  const [barterWa, setBarterWa] = useState("");

  const categories = [
    "Semua",
    "Pertanian & Green Eco",
    "Teknologi & Digital",
    "Kuliner Halal",
    "Pendidikan & Dakwah",
    "Logistik & Jasa",
  ];

  // Filtering Jobs
  const filteredJobs = jobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "Semua" || j.category === selectedCategory;
    const matchRemote = !onlyRemote || j.isRemote;
    const matchGreen = !onlyGreen || j.greenBadge;
    return matchSearch && matchCategory && matchRemote && matchGreen;
  });

  // Filtering Barter Listings
  const filteredBarter = barterListings.filter((b) => {
    return (
      b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.offeredSkill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.soughtSkill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const reqArray = newJobReqs
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    const newJob: JobOpportunity = {
      id: `JOB-${Date.now().toString().slice(-4)}`,
      title: newJobTitle,
      organization: newJobOrg,
      type: newJobType,
      category: newJobCategory,
      location: newJobLocation,
      isRemote: newJobLocation.toLowerCase().includes("remote"),
      compensation: newJobComp,
      description: newJobDesc,
      requirements: reqArray.length > 0 ? reqArray : ["Amanah dan profesional"],
      greenBadge: newJobIsGreen,
      shariaVerified: true,
      contactEmail: "karir@islamicity.tv",
      postedAt: "Hari ini",
      applicantsCount: 0,
    };

    onAddJob(newJob);
    setIsJobModalOpen(false);
    // Reset form
    setNewJobTitle("");
    setNewJobOrg("");
    setNewJobDesc("");
    setNewJobComp("");
    setNewJobLocation("");
  };

  const handleCreateBarter = (e: React.FormEvent) => {
    e.preventDefault();
    const newBarter: SkillBarterListing = {
      id: `BARTER-${Date.now().toString().slice(-4)}`,
      userName: barterName,
      formerRole: barterFormerRole,
      city: barterCity,
      offeredSkill: barterOffer,
      soughtSkill: barterSeek,
      category: "Kemitraan Jamaah",
      notes: barterNotes,
      status: "Tersedia",
      createdAt: "Hari ini",
      contactWa: barterWa,
    };

    onAddBarter(newBarter);
    setIsBarterModalOpen(false);

    // Award points for sharing skill in Barter Muamalah
    awardPoints(
      75,
      "Pasang Tawaran Barter Skill",
      "Barter Keahlian",
      `Berbagi keahlian: ${barterOffer} ditukar ${barterSeek} tanpa uang tunai.`,
      "skill-sharer"
    );

    // Reset form
    setBarterName("");
    setBarterFormerRole("");
    setBarterCity("");
    setBarterOffer("");
    setBarterSeek("");
    setBarterNotes("");
    setBarterWa("");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-800 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Bursa Karir Halal & Pasar Muamalah Inklusif</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-white">
          Peluang Kerja Berkah & Barter Keahlian
        </h1>
        <p className="text-emerald-100/90 text-sm sm:text-base max-w-3xl leading-relaxed">
          Temukan lowongan kerja syariah, proyek freelance, magang vokasi, atau
          saling bertukar keahlian (Skill Barter) sesama alumni PHK tanpa beban
          uang tunai untuk saling menopang di masa transisi.
        </p>

        {/* Tab Toggle */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "jobs"
                ? "bg-amber-400 text-emerald-950 shadow-md font-bold"
                : "bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>1. Bursa Lowongan & Proyek Halal ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("barter")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "barter"
                ? "bg-amber-400 text-emerald-950 shadow-md font-bold"
                : "bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800"
            }`}
          >
            <Repeat className="w-4 h-4" />
            <span>2. Papan Barter Keahlian & Jasa ({barterListings.length})</span>
          </button>
        </div>
      </div>

      {/* ================= SECTION 1: JOBS ================= */}
      {activeTab === "jobs" && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari posisi, institusi, kota..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 w-56 sm:w-64"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-500 bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={onlyRemote}
                  onChange={(e) => setOnlyRemote(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Hanya Remote / WFH</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={onlyGreen}
                  onChange={(e) => setOnlyGreen(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>🌱 Green Jobs Saja</span>
              </label>

              <button
                onClick={() => setIsJobModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow transition-colors cursor-pointer ml-auto lg:ml-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Pasang Lowongan Halal</span>
              </button>
            </div>
          </div>

          {/* Job List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-emerald-500/60 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        {job.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mt-1.5 leading-snug">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        {job.organization}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {job.type}
                      </span>
                      {job.greenBadge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-lime-100 text-lime-800 flex items-center gap-1">
                          <Leaf className="w-2.5 h-2.5" /> Green Job
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs border border-slate-100">
                    <div className="font-bold text-emerald-800">
                      Ujrah / Kompensasi: {job.compensation}
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{job.location}</span>
                      {job.isRemote && (
                        <span className="text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.2 rounded ml-1">
                          Bisa Remote
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Requirements list */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Kualifikasi Utama:
                    </div>
                    <ul className="space-y-0.5">
                      {job.requirements.map((req, idx) => (
                        <li
                          key={idx}
                          className="text-[11px] text-slate-600 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {job.applicantsCount} Pelamar • Diposting: {job.postedAt}
                  </span>
                  <button
                    onClick={() => setAppliedJobTitle(job.title)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
                  >
                    <span>Lamar Sekarang</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SECTION 2: SKILL BARTER ================= */}
      {activeTab === "barter" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Papan Tukar Kebaikan (Skill & Service Barter)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Prinsip Ta'awun (saling tolong menolong). Tukarkan keahlian
                profesional Anda dengan kebutuhan usaha atau keluarga tanpa uang
                tunai.
              </p>
            </div>

            <button
              onClick={() => setIsBarterModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-500 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0"
            >
              <Repeat className="w-4 h-4" />
              <span>Tawarkan Barter Keahlian</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBarter.map((barter) => (
              <div
                key={barter.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-teal-500/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">
                        {barter.userName}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Ex: {barter.formerRole} • {barter.city}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      {barter.status}
                    </span>
                  </div>

                  {/* Offer vs Seek Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs space-y-1">
                      <span className="text-emerald-800 font-bold uppercase tracking-wider text-[10px] block">
                        🟢 Keahlian yang Ditawarkan:
                      </span>
                      <p className="text-emerald-950 font-medium leading-relaxed">
                        {barter.offeredSkill}
                      </p>
                    </div>

                    <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs space-y-1">
                      <span className="text-amber-800 font-bold uppercase tracking-wider text-[10px] block">
                        🟡 Kebutuhan yang Dicari:
                      </span>
                      <p className="text-amber-950 font-medium leading-relaxed">
                        {barter.soughtSkill}
                      </p>
                    </div>
                  </div>

                  {barter.notes && (
                    <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      "{barter.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Diposting: {barter.createdAt}
                  </span>
                  <a
                    href={`https://wa.me/${barter.contactWa.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Hubungi via WA ({barter.contactWa})</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Lamar Pekerjaan */}
      {appliedJobTitle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                  Formulir Lamaran Muamalah
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">
                  {appliedJobTitle}
                </h3>
              </div>
              <button
                onClick={() => setAppliedJobTitle(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Silakan lengkapi nomor kontak & tautan portofolio/CV Anda. Tim
                SDM perekrut akan menghubungi dalam 1x24 jam kerja melalui jalur
                resmi syariah.
              </p>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Lengkap:
                </label>
                <input
                  type="text"
                  placeholder="Nama sesuai KTP"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nomor WhatsApp & Email:
                </label>
                <input
                  type="text"
                  placeholder="0812-xxxx-xxxx / email@domain.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pengalaman Singkat / Link Portofolio:
                </label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan pengalaman & mengapa Anda cocok..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setAppliedJobTitle(null)}
                className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  alert(
                    "Alhamdulillah, berkas lamaran Anda telah terkirim! Tim perekrut akan segera menghubungi."
                  );
                  setAppliedJobTitle(null);
                }}
                className="w-2/3 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Kirim Berkas Lamaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Pasang Lowongan Baru */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                  Bursa Karir Halal
                </span>
                <h3 className="font-bold text-slate-900 text-lg">
                  Pasang Lowongan / Proyek Baru
                </h3>
              </div>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Judul Posisi:
                </label>
                <input
                  type="text"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="Contoh: Manajer Operasional Koperasi Sayur"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Lembaga / UMKM / Koperasi:
                </label>
                <input
                  type="text"
                  value={newJobOrg}
                  onChange={(e) => setNewJobOrg(e.target.value)}
                  placeholder="Contoh: Koperasi Berkah Hijau Sejahtera"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tipe Pekerjaan:
                  </label>
                  <select
                    value={newJobType}
                    onChange={(e) => setNewJobType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option>Full-time</option>
                    <option>Freelance / Proyek</option>
                    <option>Magang Muamalah</option>
                    <option>Kemitraan Usaha</option>
                    <option>Green Job</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kategori:
                  </label>
                  <select
                    value={newJobCategory}
                    onChange={(e) => setNewJobCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option>Teknologi & Digital</option>
                    <option>Pertanian & Green Eco</option>
                    <option>Kuliner Halal</option>
                    <option>Pendidikan & Dakwah</option>
                    <option>Logistik & Jasa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Lokasi:
                  </label>
                  <input
                    type="text"
                    value={newJobLocation}
                    onChange={(e) => setNewJobLocation(e.target.value)}
                    placeholder="Contoh: Bandung / Remote"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Ujrah / Gaji:
                  </label>
                  <input
                    type="text"
                    value={newJobComp}
                    onChange={(e) => setNewJobComp(e.target.value)}
                    placeholder="Contoh: Rp 4.500.000 / bln"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deskripsi Pekerjaan:
                </label>
                <textarea
                  rows={2}
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  placeholder="Uraian tugas pokok..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kualifikasi (Pisahkan dengan baris baru):
                </label>
                <textarea
                  rows={2}
                  value={newJobReqs}
                  onChange={(e) => setNewJobReqs(e.target.value)}
                  placeholder="Kualifikasi 1&#10;Kualifikasi 2"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newJobIsGreen}
                  onChange={(e) => setNewJobIsGreen(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span className="font-semibold text-slate-700">
                  🌱 Termasuk kategori Green Job / Berkelanjutan
                </span>
              </label>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Terbitkan Lowongan Halal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Pasang Barter Baru */}
      {isBarterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-teal-700 uppercase bg-teal-50 px-2 py-0.5 rounded">
                  Ta'awun Umat
                </span>
                <h3 className="font-bold text-slate-900 text-lg">
                  Tawarkan Barter Keahlian & Jasa
                </h3>
              </div>
              <button
                onClick={() => setIsBarterModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBarter} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Anda:
                </label>
                <input
                  type="text"
                  value={barterName}
                  onChange={(e) => setBarterName(e.target.value)}
                  placeholder="Contoh: Hendra Wijaya"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Profesi Sebelum PHK:
                  </label>
                  <input
                    type="text"
                    value={barterFormerRole}
                    onChange={(e) => setBarterFormerRole(e.target.value)}
                    placeholder="Contoh: Graphic Designer"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kota Domisili:
                  </label>
                  <input
                    type="text"
                    value={barterCity}
                    onChange={(e) => setBarterCity(e.target.value)}
                    placeholder="Contoh: Surabaya"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-emerald-800 mb-1">
                  🟢 Keahlian yang Anda Tawarkan:
                </label>
                <textarea
                  rows={2}
                  value={barterOffer}
                  onChange={(e) => setBarterOffer(e.target.value)}
                  placeholder="Contoh: Desain logo, kemasan produk, editing foto katalog..."
                  className="w-full px-3 py-2 rounded-xl border border-emerald-300 text-sm focus:border-emerald-500 bg-emerald-50/40"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-amber-800 mb-1">
                  🟡 Kebutuhan yang Anda Cari:
                </label>
                <textarea
                  rows={2}
                  value={barterSeek}
                  onChange={(e) => setBarterSeek(e.target.value)}
                  placeholder="Contoh: Bantuan pembukuan kas UMKM / Pasokan beras pangan..."
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 text-sm focus:border-emerald-500 bg-amber-50/40"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nomor Kontak WhatsApp:
                </label>
                <input
                  type="text"
                  value={barterWa}
                  onChange={(e) => setBarterWa(e.target.value)}
                  placeholder="Contoh: 0812-3456-7890"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Catatan Tambahan (Opsional):
                </label>
                <textarea
                  rows={2}
                  value={barterNotes}
                  onChange={(e) => setBarterNotes(e.target.value)}
                  placeholder="Kondisi atau kesepakatan yang diinginkan..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBarterModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Pasang Tawaran Barter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
