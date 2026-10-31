import React, { useState } from "react";
import {
  ActiveTab,
  QardhulHasanApplication,
  CrowdfundProject,
  JobOpportunity,
  SkillBarterListing,
} from "./types";
import {
  initialApplications,
  mockCrowdfundProjects,
  mockJobs,
  mockBarterListings,
  mockBlueprints,
  mockTVBroadcasts,
  mockChatMessages,
} from "./data/mockData";
import { Header } from "./components/Header";
import { DashboardView } from "./components/DashboardView";
import { AIPivotView } from "./components/AIPivotView";
import { SyariahFinanceView } from "./components/SyariahFinanceView";
import { MuamalahJobsView } from "./components/MuamalahJobsView";
import { GreenCoopView } from "./components/GreenCoopView";
import { IslamicityTVView } from "./components/IslamicityTVView";
import { IslamicityAcademyView } from "./components/IslamicityAcademyView";
import { UserProfileModal, EmpowermentRewardToast } from "./components/UserProfileModal";
import { NotifikasiKeberkahan } from "./components/NotifikasiKeberkahan";
import { EmpowermentProvider, useEmpowerment } from "./context/EmpowermentContext";
import {
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  Sparkles,
  Leaf,
  Coins,
  Send,
  X,
  Radio,
  Tv,
} from "lucide-react";
import confetti from "canvas-confetti";

function MainApp() {
  const { awardPoints } = useEmpowerment();
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [applications, setApplications] =
    useState<QardhulHasanApplication[]>(initialApplications);
  const [crowdfundProjects, setCrowdfundProjects] =
    useState<CrowdfundProject[]>(mockCrowdfundProjects);
  const [jobs, setJobs] = useState<JobOpportunity[]>(mockJobs);
  const [barterListings, setBarterListings] =
    useState<SkillBarterListing[]>(mockBarterListings);

  // Modals
  const [isHotlineOpen, setIsHotlineOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Qardhul Hasan Form State
  const [applicantName, setApplicantName] = useState("");
  const [applicantCompany, setApplicantCompany] = useState("");
  const [businessTitle, setBusinessTitle] = useState("");
  const [amountRequested, setAmountRequested] = useState<number>(10000000);
  const [repaymentMonths, setRepaymentMonths] = useState<number>(12);
  const [monthlyAbility, setMonthlyAbility] = useState<number>(850000);
  const [notes, setNotes] = useState("");
  const [isGreenCert, setIsGreenCert] = useState(true);
  const [applySuccess, setApplySuccess] = useState(false);

  // Emergency Intake State
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyCity, setEmergencyCity] = useState("");
  const [emergencyIssue, setEmergencyIssue] = useState("phk_baru");
  const [emergencySent, setEmergencySent] = useState(false);

  const handleInvestProject = (projectId: string, amount: number) => {
    const proj = crowdfundProjects.find((p) => p.id === projectId);
    setCrowdfundProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const newAmount = p.currentAmount + amount;
          return {
            ...p,
            currentAmount: newAmount,
            investorsCount: p.investorsCount + 1,
            isFunded: newAmount >= p.targetAmount,
          };
        }
        return p;
      })
    );

    // Award points for Green Coop Crowdfund investment
    if (proj) {
      awardPoints(
        200,
        "Investasi Crowdfunding Syariah",
        "Green Coop",
        `Penyertaan modal mudharabah Rp ${amount.toLocaleString("id-ID")} pada proyek: ${proj.title}.`,
        "green-pioneer"
      );
    }
  };

  const handleAddJob = (newJob: JobOpportunity) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  const handleAddBarter = (newBarter: SkillBarterListing) => {
    setBarterListings((prev) => [newBarter, ...prev]);
  };

  const handleApplyQardh = (e: React.FormEvent) => {
    e.preventDefault();
    const newApp: QardhulHasanApplication = {
      id: `QH-${Date.now().toString().slice(-4)}`,
      name: applicantName,
      formerCompany: applicantCompany,
      businessPlanTitle: businessTitle,
      amountRequested: Number(amountRequested),
      repaymentPeriodMonths: Number(repaymentMonths),
      monthlyRepaymentAbility: Number(monthlyAbility),
      status: "Ditinjau",
      submittedAt: "Hari ini",
      isGreenCertified: isGreenCert,
      notes: notes || "Pengajuan modal usaha mandiri bebas riba pasca PHK.",
    };

    setApplications((prev) => [newApp, ...prev]);
    setApplySuccess(true);

    // Award points for initiating Qardhul Hasan application
    awardPoints(
      100,
      "Pengajuan Modal Qardhul Hasan (0%)",
      "Infaq & Sedekah",
      `Mengajukan pinjaman kebaikan bebas riba Rp ${amountRequested.toLocaleString("id-ID")} untuk usaha '${businessTitle}'.`,
      "baitul-maal-supporter"
    );

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      setApplySuccess(false);
      setIsApplyModalOpen(false);
      // Reset form
      setApplicantName("");
      setApplicantCompany("");
      setBusinessTitle("");
      setNotes("");
    }, 2500);
  };

  const handleEmergencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmergencySent(true);
    setTimeout(() => {
      setEmergencySent(false);
      setIsHotlineOpen(false);
      setEmergencyPhone("");
      setEmergencyName("");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenHotline={() => setIsHotlineOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === "dashboard" && (
          <DashboardView
            setActiveTab={setActiveTab}
            onOpenApplyModal={() => setIsApplyModalOpen(true)}
            onOpenHotlineModal={() => setIsHotlineOpen(true)}
            qardhulHasanApplications={applications}
            crowdfundProjects={crowdfundProjects}
            onInvestProject={handleInvestProject}
            onInstantDonateProject={(projectId, amount) => {
              setCrowdfundProjects((prev) =>
                prev.map((p) => {
                  if (p.id === projectId) {
                    const newAmount = p.currentAmount + amount;
                    return {
                      ...p,
                      currentAmount: newAmount,
                      investorsCount: p.investorsCount + 1,
                      isFunded: newAmount >= p.targetAmount,
                    };
                  }
                  return p;
                })
              );
            }}
          />
        )}

        {activeTab === "academy" && <IslamicityAcademyView />}

        {activeTab === "ai-pivot" && <AIPivotView />}

        {activeTab === "syariah-finance" && (
          <SyariahFinanceView
            applications={applications}
            onOpenApplyModal={() => setIsApplyModalOpen(true)}
            crowdfundProjects={crowdfundProjects}
            onInvestProject={handleInvestProject}
          />
        )}

        {activeTab === "muamalah-jobs" && (
          <MuamalahJobsView
            jobs={jobs}
            barterListings={barterListings}
            onAddJob={handleAddJob}
            onAddBarter={handleAddBarter}
          />
        )}

        {activeTab === "green-coop" && (
          <GreenCoopView blueprints={mockBlueprints} />
        )}

        {activeTab === "islamicity-tv" && (
          <IslamicityTVView
            broadcasts={mockTVBroadcasts}
            initialChatMessages={mockChatMessages}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white border-t border-slate-800 mt-12 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-400 flex items-center justify-center text-slate-950 font-black text-base shadow-sm">
                  ☪
                </div>
                <span className="text-xl font-bold font-serif tracking-tight">
                  ISLAMICITY GLOBAL
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                Platform Solusi Cerdas Berdaya Mengatasi PHK dan Pengangguran
                Menuju Kaffah, Berdaulat, Adil, dan Makmur. Terintegrasi dengan
                siaran <strong>global.islamicity.tv</strong>.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] text-emerald-400">
                <span>• Berdakwah</span>
                <span>• Bersyariah</span>
                <span>• Berjamaah</span>
                <span>• Bermuamalah</span>
                <span>• Green Berkelanjutan</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-amber-400 uppercase tracking-wider block">
                Kanal Pemberdayaan
              </span>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <button
                    onClick={() => setActiveTab("academy")}
                    className="hover:text-emerald-300 font-semibold transition-colors cursor-pointer text-emerald-400"
                  >
                    🎓 Islamicity Academy (RT/RW Berdaya)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("ai-pivot")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    AI Career Pivot & Fiqih Clinic
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("syariah-finance")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Dana Qardhul Hasan & Crowdfunding
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("muamalah-jobs")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Bursa Kerja Halal & Skill Barter
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("green-coop")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Koperasi Hijau & B2B Group Buying
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-amber-400 uppercase tracking-wider block">
                Layanan Darurat & TV
              </span>
              <p className="text-slate-400">
                Hotline Bebas Pulsa:{" "}
                <strong className="text-white">0800-ISLAMICITY-1</strong>
              </p>
              <p className="text-slate-400">
                Email Konsultasi:{" "}
                <strong className="text-white">darurat@islamicity.tv</strong>
              </p>
              <p className="text-slate-400">
                Siaran TV:{" "}
                <strong className="text-emerald-400">global.islamicity.tv</strong>
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <span>
              © {new Date().getFullYear()} Islamicity Global Foundation. Seluruh
              hak cipta dilindungi undang-undang & amanah syariah.
            </span>
            <div className="flex gap-4">
              <span>Bebas Riba 100%</span>
              <span>•</span>
              <span>Standar DSN-MUI</span>
              <span>•</span>
              <span>Green Circular Economy</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= MODAL: HOTLINE DARURAT PHK ================= */}
      {isHotlineOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-rose-700 uppercase bg-rose-50 px-2 py-0.5 rounded">
                  24/7 Layanan Siaga Umat
                </span>
                <h3 className="font-bold text-slate-900 text-lg sm:text-xl font-serif mt-1">
                  Hotline & Pendampingan Darurat PHK
                </h3>
              </div>
              <button
                onClick={() => setIsHotlineOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {emergencySent ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">
                  Laporan Anda Telah Diterima Tim Siaga!
                </h4>
                <p className="text-xs text-slate-600">
                  Konselor dan relawan pendamping syariah akan menghubungi Anda
                  melalui WhatsApp/Telepon dalam waktu maksimal 15 menit. Tenang
                  dan sabar, insyaAllah ada jalan keluar berkah.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Emergency Contact Quick Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                    <span className="text-emerald-800 font-bold block">
                      📞 Bebas Pulsa (Konseling):
                    </span>
                    <strong className="text-emerald-950 text-sm">
                      0800-ISLAMICITY-1
                    </strong>
                    <span className="text-[10px] text-slate-500 block">
                      Senin - Ahad (24 Jam)
                    </span>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                    <span className="text-amber-800 font-bold block">
                      💬 WhatsApp Darurat:
                    </span>
                    <strong className="text-amber-950 text-sm">
                      +62 812-777-KAFFAH
                    </strong>
                    <span className="text-[10px] text-slate-500 block">
                      Respon Cepat Tim Baitul Maal
                    </span>
                  </div>
                </div>

                <form onSubmit={handleEmergencySubmit} className="space-y-3 text-xs">
                  <span className="font-bold text-slate-800 block text-xs uppercase tracking-wider">
                    Atau Kirim Permintaan Hubungi Balik (Call Me Back):
                  </span>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nama Lengkap Anda:
                    </label>
                    <input
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      placeholder="Nama Anda"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Nomor HP / WhatsApp:
                      </label>
                      <input
                        type="text"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        placeholder="0812-xxxx-xxxx"
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
                        value={emergencyCity}
                        onChange={(e) => setEmergencyCity(e.target.value)}
                        placeholder="Contoh: Bekasi"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Bantuan Utama yang Dibutuhkan Segera:
                    </label>
                    <select
                      value={emergencyIssue}
                      onChange={(e) => setEmergencyIssue(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    >
                      <option value="phk_baru">
                        Konseling Mental & Bimbingan Awal Pasca PHK
                      </option>
                      <option value="dana_mendesak">
                        Permohonan Paket Sembako / Bantuan Pangan Darurat
                      </option>
                      <option value="hukum_pesangon">
                        Konsultasi Hukum Syariah Terkait Hak Pesangon yang Macet
                      </option>
                      <option value="bimbingan_usaha">
                        Konsultasi Ide Usaha Hijau & Pivot Karir Cepat
                      </option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsHotlineOpen(false)}
                      className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Tutup
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Permintaan Bantuan</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: AJUKAN DANA QARDHUL HASAN ================= */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                  Bebas Bunga • 0% Riba
                </span>
                <h3 className="font-bold text-slate-900 text-lg sm:text-xl font-serif mt-1">
                  Pengajuan Modal Qardhul Hasan
                </h3>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {applySuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">
                  Alhamdulillah, Berkas Berhasil Diajukan!
                </h4>
                <p className="text-xs text-slate-600">
                  Data pengajuan modal usaha Anda telah masuk ke daftar verifikasi
                  tim Dewan Pengawas Baitul Maal. Anda dapat memantau statusnya
                  pada menu Permodalan Syariah.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplyQardh} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Lengkap Pemohon:
                  </label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Sesuai KTP"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Perusahaan / Tempat Kerja Sebelumnya (PHK):
                  </label>
                  <input
                    type="text"
                    value={applicantCompany}
                    onChange={(e) => setApplicantCompany(e.target.value)}
                    placeholder="Contoh: PT Surya Tekstil / Pabrik Sepatu"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Rencana Nama / Jenis Usaha:
                  </label>
                  <input
                    type="text"
                    value={businessTitle}
                    onChange={(e) => setBusinessTitle(e.target.value)}
                    placeholder="Contoh: Budidaya Maggot BSF & Lele Organik"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Plafon Modal Diajukan (Rp):
                    </label>
                    <input
                      type="number"
                      step={500000}
                      value={amountRequested}
                      onChange={(e) => setAmountRequested(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Tenor Pengembalian (Bulan):
                    </label>
                    <select
                      value={repaymentMonths}
                      onChange={(e) =>
                        setRepaymentMonths(Number(e.target.value))
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    >
                      <option value={6}>6 Bulan</option>
                      <option value={12}>12 Bulan (1 Tahun)</option>
                      <option value={18}>18 Bulan</option>
                      <option value={24}>24 Bulan (2 Tahun)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Estimasi Kemampuan Cicilan Pokok Bulanan (Rp):
                  </label>
                  <input
                    type="number"
                    step={50000}
                    value={monthlyAbility}
                    onChange={(e) => setMonthlyAbility(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:border-emerald-500"
                    required
                  />
                  <span className="text-[10px] text-slate-400">
                    * Qardhul Hasan tidak mengenakan bunga sepeserpun, hanya
                    pengembalian pokok modal.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Uraian Singkat Rencana Usaha:
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Jelaskan target pasar, lokasi, dan kesiapan operasional..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-500"
                  />
                </div>

                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGreenCert}
                    onChange={(e) => setIsGreenCert(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-700 text-xs">
                    🌱 Usaha memiliki aspek Green / Ramah Lingkungan / Daur Ulang
                  </span>
                </label>

                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Kirim Berkas Pengajuan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* User Profile & Empowerment Level Modal */}
      <UserProfileModal />

      {/* Real-time Points & Badge Celebration Reward Toast */}
      <EmpowermentRewardToast />

      {/* Periodic Blessing Notifications (Notifikasi Keberkahan) */}
      <NotifikasiKeberkahan onNavigateTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <EmpowermentProvider>
      <MainApp />
    </EmpowermentProvider>
  );
}

