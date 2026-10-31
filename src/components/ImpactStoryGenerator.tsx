import React, { useState } from "react";
import {
  Sparkles,
  Share2,
  Copy,
  Check,
  Heart,
  Quote,
  Send,
  MessageCircle,
  Twitter,
  Linkedin,
  Instagram,
  Coins,
  Leaf,
  Users,
  Award,
  RefreshCw,
  Download,
  Flame,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { QardhulHasanApplication, ImpactStory } from "../types";
import { useEmpowerment } from "../context/EmpowermentContext";
import confetti from "canvas-confetti";

interface ImpactStoryGeneratorProps {
  applications: QardhulHasanApplication[];
  onOpenApplyModal?: () => void;
  onOpenDonateModal?: () => void;
}

type SocialPlatform = "instagram" | "whatsapp" | "twitter" | "linkedin";
type NarrativeAngle = "bangkit-phk" | "berkah-riba-free" | "green-circular" | "keluarga-mandiri";

export const ImpactStoryGenerator: React.FC<ImpactStoryGeneratorProps> = ({
  applications,
  onOpenApplyModal,
  onOpenDonateModal,
}) => {
  const { awardPoints } = useEmpowerment();

  // Fallback initial application if none passed
  const availableProjects = applications.length > 0 ? applications : [
    {
      id: "QH-001",
      name: "Ahmad Fauzi, S.T.",
      formerCompany: "PT Manufaktur Komponen Otomotif",
      businessPlanTitle: "Budidaya Maggot BSF & Pupuk Organik Cair Zero-Waste",
      businessCategory: "Pertanian & Green Eco",
      amountRequested: 15000000,
      repaymentPeriodMonths: 12,
      monthlyRepaymentAbility: 1250000,
      status: "Tersalurkan" as const,
      submittedAt: "2026-01-20",
      notes: "Sudah bermitra dengan warung makan untuk pengolahan sampah organik harian. 0% bunga.",
      isGreenCertified: true,
    }
  ];

  const [selectedProjectId, setSelectedProjectId] = useState<string>(availableProjects[0]?.id || "");
  const [platform, setPlatform] = useState<SocialPlatform>("instagram");
  const [narrativeAngle, setNarrativeAngle] = useState<NarrativeAngle>("bangkit-phk");
  const [callToActionType, setCallToActionType] = useState<"sedekah-subuh" | "qardh" | "koperasi">("sedekah-subuh");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedStory, setGeneratedStory] = useState<ImpactStory | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeViewTab, setActiveViewTab] = useState<"visual-card" | "raw-text">("visual-card");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedProject = availableProjects.find((p) => p.id === selectedProjectId) || availableProjects[0];

  // Default sample story pre-loaded for immediate delight
  const defaultSampleStory: ImpactStory = {
    headline: "Dari Korban PHK Pabrik Jadi Pelopor Usaha Maggot BSF Hijau! 🌿",
    hook: "Kehilangan pekerjaan di awal 2026 bukan akhir dari ikhtiar Pak Ahmad Fauzi...",
    bodyParagraphs: [
      "Setelah 12 tahun mendedikasikan diri di industri otomotif, kabar PHK massal datang tanpa peringatan. Namun alih-alih terpuruk atau tergiur pinjol riba, beliau memilih bersujud dan mencari jalan halal.",
      "Melalui program Qardhul Hasan (Pinjaman Kebaikan 0% Bunga) sebesar Rp 15.000.000 dari Baitul Maal IslamiCity, Pak Ahmad memulai budidaya Maggot BSF & pupuk organik cair.",
      "Kini, usahanya mengolah lebih dari 250 kg sampah organik pasar setiap pekan, mempekerjakan 2 rekan sesama korban PHK, dan membukukan omzet berkah tanpa setitik pun jeratan bunga.",
    ],
    spiritualInsight: "QS. At-Talaq [65:2-3] — 'Barangsiapa bertakwa kepada Allah niscaya Dia akan mengadakan baginya jalan keluar, dan memberinya rezeki dari arah yang tiada disangka-sangkanya.'",
    quoteByBeneficiary: "Alhamdulillah, modal Qardhul Hasan tanpa riba ini adalah nafas baru bagi anak dan istri saya. Berkahnya luar biasa.",
    impactHighlights: [
      { label: "Plafon Modal", value: "Rp 15.000.000 (0% Bunga)" },
      { label: "Dampak Hijau", value: "250 kg Sampah Organik/Pekan" },
      { label: "Serapan Kerja", value: "3 Rekan Alumni PHK" },
      { label: "Status Akad", value: "Tersalurkan & Mandiri" },
    ],
    callToActionText: "Mari gandakan senyum saudara-saudara kita. Salurkan Sedekah Subuh terbaikmu ke Baitul Maal IslamiCity untuk mendanai lebih banyak modal kebaikan!",
    hashtags: [
      "#QardhulHasan",
      "#BangkitPascaPHK",
      "#BebasRiba",
      "#GreenEconomy",
      "#IslamiCityGlobal",
      "#BaitulMaal",
    ],
    formattedShareText: `🌟 Dari Korban PHK Pabrik Jadi Pelopor Usaha Maggot BSF Hijau! 🌿
━━━━━━━━━━━━━━━━━━━━━━━━
Kehilangan pekerjaan di awal 2026 bukan akhir dari ikhtiar Pak Ahmad Fauzi...

Setelah 12 tahun mendedikasikan diri di industri otomotif, kabar PHK massal datang tanpa peringatan. Namun alih-alih terpuruk atau tergiur pinjol riba, beliau memilih bersujud dan mencari jalan halal.

Melalui program Qardhul Hasan (Pinjaman Kebaikan 0% Bunga) sebesar Rp 15.000.000 dari Baitul Maal IslamiCity, Pak Ahmad memulai budidaya Maggot BSF & pupuk organik cair.

Kini, usahanya mengolah lebih dari 250 kg sampah organik pasar setiap pekan, mempekerjakan 2 rekan sesama korban PHK, dan membukukan omzet berkah tanpa setitik pun jeratan bunga.

💬 "Alhamdulillah, modal Qardhul Hasan tanpa riba ini adalah nafas baru bagi anak dan istri saya. Berkahnya luar biasa." — Pak Ahmad Fauzi

📖 Hikmah: QS. At-Talaq [65:2-3] — 'Barangsiapa bertakwa kepada Allah niscaya Dia akan mengadakan baginya jalan keluar, dan memberinya rezeki dari arah yang tiada disangka-sangkanya.'

📊 Ringkasan Dampak Nyata:
• Modal Qardh: Rp 15.000.000 (0% Bunga)
• Dampak Hijau: 250 kg Sampah Organik/Pekan
• Lapangan Kerja: 3 Jiwa Berdaya

💚 Mari gandakan senyum saudara-saudara kita. Salurkan Sedekah Subuh terbaikmu ke Baitul Maal IslamiCity untuk mendanai lebih banyak modal kebaikan!

#QardhulHasan #BangkitPascaPHK #BebasRiba #GreenEconomy #IslamiCityGlobal #BaitulMaal
🌐 Baca selengkapnya: https://global.islamicity.tv`,
  };

  const activeStory = generatedStory || defaultSampleStory;

  const handleGenerateStory = async () => {
    if (!selectedProject) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/gemini/impact-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: {
            name: selectedProject.name,
            formerCompany: selectedProject.formerCompany,
            businessPlanTitle: selectedProject.businessPlanTitle,
            businessCategory: selectedProject.businessCategory || "Usaha Mandiri Berkah",
            amountRequested: selectedProject.amountRequested,
            repaymentPeriodMonths: selectedProject.repaymentPeriodMonths,
            status: selectedProject.status,
            isGreenCertified: selectedProject.isGreenCertified,
            notes: selectedProject.notes,
          },
          platform,
          narrativeAngle,
          callToAction: callToActionType,
        }),
      });

      const data = await res.json();
      if (data.success && data.story) {
        setGeneratedStory(data.story);
        
        // Award points for community storytelling & dakwah outreach
        awardPoints(
          50,
          "Duta Inspirasi Umat (AI Impact Story)",
          "Edukasi Dakwah",
          `Membuat dan mengamplifikasi kisah dampak Qardhul Hasan: ${selectedProject.name}.`,
          "ai-strategist"
        );

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } else {
        setErrorMsg(data.error || "Gagal memproses cerita dampak AI.");
      }
    } catch (err: any) {
      console.error("Error generating impact story:", err);
      setErrorMsg("Terjadi kendala jaringan saat menghubungi server AI.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = () => {
    if (!activeStory) return;
    navigator.clipboard.writeText(activeStory.formattedShareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    // Award bonus points for active sharing
    awardPoints(
      25,
      "Penyebar Kebaikan & Syiar Berkah",
      "Edukasi Dakwah",
      "Menyalin dan menyebarkan kisah dampak ke media sosial komunitas.",
      "ai-strategist"
    );
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(activeStory.formattedShareText);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `🌟 ${activeStory.headline}\n\n${activeStory.hook}\n\nKisah kebangkitan korban PHK lewat Qardhul Hasan 0% bunga IslamiCity:\nhttps://global.islamicity.tv\n\n${activeStory.hashtags.slice(0, 3).join(" ")}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([activeStory.formattedShareText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Kisah_Dampak_QardhulHasan_${selectedProject.name.replace(/\s+/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getPlatformTheme = () => {
    switch (platform) {
      case "instagram":
        return {
          bgHeader: "bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500",
          name: "Instagram / Threads Feed & Story",
          icon: <Instagram className="w-4 h-4 text-pink-200" />,
        };
      case "whatsapp":
        return {
          bgHeader: "bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800",
          name: "WhatsApp Broadcast / Status Jamaah",
          icon: <MessageCircle className="w-4 h-4 text-emerald-200" />,
        };
      case "twitter":
        return {
          bgHeader: "bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900",
          name: "Twitter / X Viral Thread",
          icon: <Twitter className="w-4 h-4 text-sky-300" />,
        };
      case "linkedin":
        return {
          bgHeader: "bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900",
          name: "LinkedIn / Portal Umat Profesional",
          icon: <Linkedin className="w-4 h-4 text-blue-200" />,
        };
      default:
        return {
          bgHeader: "bg-gradient-to-r from-emerald-900 to-teal-900",
          name: "Media Sosial Komunitas",
          icon: <Share2 className="w-4 h-4 text-emerald-200" />,
        };
    }
  };

  const currentTheme = getPlatformTheme();

  return (
    <div className="bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/20 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-md space-y-6">
      {/* Header Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-100 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>AI Storyteller • Real-Time Qardhul Hasan Impact</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            AI Generator Kisah Dampak & Sukses Berdaya
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Ambil data riil pembiayaan <strong>Qardhul Hasan (0% Bunga)</strong> dan ubah menjadi cerita inspiratif ramah media sosial dalam hitungan detik untuk menggerakkan kepedulian umat.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <Award className="w-4 h-4 text-amber-600" />
            <span>+50 Poin Tiap Cerita Dibuat</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls vs Result Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Generator Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-700" />
              1. Pilih Proyek / Penerima Manfaat
            </span>
            <span className="text-[11px] text-emerald-800 font-semibold">
              {availableProjects.length} Proyek Riil
            </span>
          </div>

          {/* Project Selector Card */}
          <div className="space-y-2">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm font-semibold text-slate-900 bg-white"
            >
              {availableProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.businessPlanTitle} (Rp {(p.amountRequested || 0).toLocaleString("id-ID")})
                </option>
              ))}
            </select>

            {/* Quick Beneficiary Snapshot */}
            {selectedProject && (
              <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 text-sm">
                    {selectedProject.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                    {selectedProject.status}
                  </span>
                </div>
                <div className="text-slate-600">
                  Mantan: <span className="text-slate-800 font-medium">{selectedProject.formerCompany}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="px-2 py-0.5 rounded bg-white text-emerald-900 font-bold border border-emerald-200 text-[10px]">
                    💰 Rp {(selectedProject.amountRequested || 0).toLocaleString("id-ID")} (0% Bunga)
                  </span>
                  {selectedProject.isGreenCertified && (
                    <span className="px-2 py-0.5 rounded bg-lime-100 text-lime-900 font-bold border border-lime-300 text-[10px] flex items-center gap-1">
                      <Leaf className="w-2.5 h-2.5" />
                      Green Eco
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Platform Selector */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Platform Target & Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPlatform("instagram")}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  platform === "instagram"
                    ? "bg-pink-50 border-pink-400 text-pink-900 shadow-2xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Instagram className="w-4 h-4 text-pink-600" />
                <span>Instagram / Reel</span>
              </button>

              <button
                type="button"
                onClick={() => setPlatform("whatsapp")}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  platform === "whatsapp"
                    ? "bg-emerald-50 border-emerald-400 text-emerald-900 shadow-2xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Broadcast</span>
              </button>

              <button
                type="button"
                onClick={() => setPlatform("twitter")}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  platform === "twitter"
                    ? "bg-sky-50 border-sky-400 text-sky-900 shadow-2xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Twitter className="w-4 h-4 text-sky-600" />
                <span>Twitter / X Thread</span>
              </button>

              <button
                type="button"
                onClick={() => setPlatform("linkedin")}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  platform === "linkedin"
                    ? "bg-blue-50 border-blue-400 text-blue-900 shadow-2xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Linkedin className="w-4 h-4 text-blue-600" />
                <span>LinkedIn Umat</span>
              </button>
            </div>
          </div>

          {/* Narrative Angle */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              3. Sudut Pandang Cerita (Narrative Angle)
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setNarrativeAngle("bangkit-phk")}
                className={`p-2 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                  narrativeAngle === "bangkit-phk"
                    ? "bg-amber-50 border-amber-400 text-amber-950 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                🌅 Bangkit Pasca-PHK
              </button>
              <button
                type="button"
                onClick={() => setNarrativeAngle("berkah-riba-free")}
                className={`p-2 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                  narrativeAngle === "berkah-riba-free"
                    ? "bg-amber-50 border-amber-400 text-amber-950 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                🛡️ Bebas Riba 0% Bunga
              </button>
              <button
                type="button"
                onClick={() => setNarrativeAngle("green-circular")}
                className={`p-2 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                  narrativeAngle === "green-circular"
                    ? "bg-amber-50 border-amber-400 text-amber-950 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                🌿 Green Eco & Sirkular
              </button>
              <button
                type="button"
                onClick={() => setNarrativeAngle("keluarga-mandiri")}
                className={`p-2 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                  narrativeAngle === "keluarga-mandiri"
                    ? "bg-amber-50 border-amber-400 text-amber-950 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                👨‍👩‍👧 Nafkah Keluarga
              </button>
            </div>
          </div>

          {/* Call to Action focus */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              4. Aksi Ajakan (Call-to-Action)
            </label>
            <select
              value={callToActionType}
              onChange={(e) => setCallToActionType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
            >
              <option value="sedekah-subuh">💚 Ajak Jamaah Sedekah Subuh & Infaq Baitul Maal</option>
              <option value="qardh">🌟 Ajak Korban PHK Lain Ajukan Modal Qardhul Hasan (0%)</option>
              <option value="koperasi">🤝 Ajak Kolaborasi di Koperasi Hijau & B2B Buying</option>
            </select>
          </div>

          {/* Error notice if any */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Action Button: Generate Story with Gemini AI */}
          <button
            type="button"
            onClick={handleGenerateStory}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                <span>AI Sedang Merangkai Kisah Inspiratif...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Kisah Dampak AI (+50 Poin)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Interactive Story Visual Card & Text Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Card Header with View Switcher and Share Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
            {/* View Tab Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveViewTab("visual-card")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeViewTab === "visual-card"
                    ? "bg-white text-emerald-950 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                📱 Pratinjau Kartu Visual
              </button>
              <button
                type="button"
                onClick={() => setActiveViewTab("raw-text")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeViewTab === "raw-text"
                    ? "bg-white text-emerald-950 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                📝 Teks Siap Salin
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyText}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  copied
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                }`}
                title="Salin Teks Lengkap"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Tersalin!" : "Salin"}</span>
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                title="Bagikan ke WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleShareTwitter}
                className="p-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors cursor-pointer"
                title="Bagikan ke X / Twitter"
              >
                <Twitter className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleDownloadTxt}
                className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                title="Unduh Berkas .txt"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Visual Card View */}
          {activeViewTab === "visual-card" ? (
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-lg space-y-0 transition-all">
              {/* Platform Mockup Top Banner */}
              <div className={`${currentTheme.bgHeader} p-4 sm:p-5 text-white flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner">
                    {selectedProject.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm">{selectedProject.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    </div>
                    <span className="text-[11px] text-white/80 block">
                      Penerima Manfaat Qardhul Hasan • {currentTheme.name}
                    </span>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 text-amber-200">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Kisah Sukses AI</span>
                </div>
              </div>

              {/* Story Content Body */}
              <div className="p-5 sm:p-7 space-y-5">
                {/* Catchy Headline */}
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 leading-snug">
                    {activeStory.headline}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-800 italic">
                    "{activeStory.hook}"
                  </p>
                </div>

                {/* Narrative Paragraphs */}
                <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed border-l-2 border-emerald-300 pl-3.5 py-0.5">
                  {activeStory.bodyParagraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                {/* Beneficiary Quote Box */}
                {activeStory.quoteByBeneficiary && (
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-emerald-50 rounded-2xl border border-amber-200/80 text-xs sm:text-sm text-slate-800 relative">
                    <Quote className="w-5 h-5 text-amber-400 absolute top-3 right-3 opacity-60" />
                    <div className="font-serif italic font-medium text-emerald-950">
                      "{activeStory.quoteByBeneficiary}"
                    </div>
                    <div className="text-[11px] text-amber-900 font-bold mt-1.5">
                      — {selectedProject.name} (Penerima Qardhul Hasan)
                    </div>
                  </div>
                )}

                {/* Real-time Impact Metrics Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {activeStory.impactHighlights.map((hl, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                        {hl.label}
                      </span>
                      <strong className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5">
                        {hl.value}
                      </strong>
                    </div>
                  ))}
                </div>

                {/* Spiritual Insight Box */}
                <div className="p-3.5 rounded-xl bg-emerald-950 text-white text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold uppercase tracking-wider text-[10px]">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Hikmah Qur'ani & Muamalah</span>
                  </div>
                  <p className="text-emerald-100 leading-relaxed italic">
                    {activeStory.spiritualInsight}
                  </p>
                </div>

                {/* Call to Action Text */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-semibold flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
                  <span>{activeStory.callToActionText}</span>
                </div>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeStory.hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-emerald-100 hover:text-emerald-900 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Raw Text View (Easy Direct Copy) */
            <div className="bg-slate-900 text-emerald-100 rounded-3xl p-5 sm:p-6 font-mono text-xs leading-relaxed space-y-4 border border-slate-800 shadow-lg max-h-[550px] overflow-y-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-slate-400">
                <span className="text-[11px] font-bold">📄 Teks Lengkap Siap Salin ({platform.toUpperCase()} Format):</span>
                <span className="text-[10px]">{activeStory.formattedShareText.length} Karakter</span>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200 leading-relaxed select-all">
                {activeStory.formattedShareText}
              </pre>
            </div>
          )}

          {/* Bottom Direct CTA Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Kisah ini diperbarui otomatis dengan data transaksi nyata Baitul Maal.</span>
            </div>

            <div className="flex items-center gap-2">
              {onOpenDonateModal && (
                <button
                  type="button"
                  onClick={onOpenDonateModal}
                  className="px-3.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs transition-colors cursor-pointer"
                >
                  💚 Sedekah Subuh Sekarang
                </button>
              )}
              {onOpenApplyModal && (
                <button
                  type="button"
                  onClick={onOpenApplyModal}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  Ajukan Qardhul Hasan (0%)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
