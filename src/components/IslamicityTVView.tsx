import React, { useState } from "react";
import {
  Tv,
  Play,
  Volume2,
  VolumeX,
  Radio,
  Users,
  MessageSquare,
  Send,
  Download,
  BookOpen,
  Calendar,
  Sparkles,
  Share2,
  CheckCircle2,
  ThumbsUp,
  Heart,
} from "lucide-react";
import { TVBroadcast, ChatMessage } from "../types";

interface IslamicityTVViewProps {
  broadcasts: TVBroadcast[];
  initialChatMessages: ChatMessage[];
}

export const IslamicityTVView: React.FC<IslamicityTVViewProps> = ({
  broadcasts,
  initialChatMessages,
}) => {
  const [currentBroadcast, setCurrentBroadcast] = useState<TVBroadcast>(
    broadcasts[0]
  );
  const [isMuted, setIsMuted] = useState(false);
  const [likesCount, setLikesCount] = useState(482);
  const [hasLiked, setHasLiked] = useState(false);

  // Live Chat State
  const [chatList, setChatList] = useState<ChatMessage[]>(initialChatMessages);
  const [chatInput, setChatInput] = useState("");
  const [userNameInput, setUserNameInput] = useState("Jamaah Mandiri");
  const [userCityInput, setUserCityInput] = useState("Jakarta");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      user: userNameInput || "Hamba Allah",
      city: userCityInput || "Indonesia",
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      badge: "Jamaah Live",
    };

    setChatList((prev) => [...prev, newMsg]);
    setChatInput("");
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-800 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider animate-pulse">
            <Radio className="w-3.5 h-3.5" />
            <span>LIVE BROADCAST • global.islamicity.tv</span>
          </span>
          <span className="text-xs text-emerald-300 font-medium">
            Kanal Edukasi, Fiqih Muamalah & Pemberdayaan Ekonomi Umat
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-white">
          Islamicity TV: Suara Kebangkitan Ekonomi Kaffah
        </h1>
        <p className="text-emerald-100/90 text-sm sm:text-base max-w-3xl leading-relaxed">
          Siaran langsung kajian Fiqih Muamalah kontemporer, bedah usaha hijau,
          panduan permodalan syariah bebas riba, dan konsultasi interaktif
          bersama para pakar ekonomi Islam terkemuka.
        </p>
      </div>

      {/* Main Broadcast Screen & Live Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Top: Interactive Live Stream Player */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl aspect-video flex flex-col justify-between p-5 sm:p-6 text-white group">
            {/* Background Graphic Simulated Broadcast */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-emerald-950/40 to-slate-900/60 z-0"></div>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Top Bar on Screen */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-rose-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                  LIVE STREAM
                </span>
                <span className="bg-slate-900/80 backdrop-blur-sm text-emerald-300 text-xs px-2.5 py-0.5 rounded-full border border-emerald-800/60 flex items-center gap-1.5 font-mono">
                  <Users className="w-3 h-3 text-emerald-400" />
                  {currentBroadcast.viewers.toLocaleString("id-ID")} Jamaah Nonton
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 text-xs flex items-center gap-1 cursor-pointer"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="hidden sm:inline">
                    {isMuted ? "Unmute" : "Audio Aktif"}
                  </span>
                </button>
              </div>
            </div>

            {/* Center Stage Presenter Simulated Visual */}
            <div className="relative z-10 my-auto text-center space-y-3 max-w-xl mx-auto py-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg animate-pulse">
                <Play className="w-8 h-8 fill-slate-950 ml-1" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Sedang Mengudara
                </div>
                <h2 className="text-lg sm:text-2xl font-bold font-serif text-white leading-snug">
                  {currentBroadcast.title}
                </h2>
                <p className="text-xs sm:text-sm text-emerald-200 font-medium">
                  Narasumber: {currentBroadcast.speaker} (
                  {currentBroadcast.speakerTitle})
                </p>
              </div>
            </div>

            {/* Bottom Floating Bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-slate-300">
                  Kualitas: <strong>1080p 60FPS • Syariah Feed</strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                    hasLiked
                      ? "bg-rose-950/80 border-rose-600 text-rose-300"
                      : "bg-slate-900/80 border-slate-700 text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      hasLiked ? "fill-rose-500 text-rose-500" : ""
                    }`}
                  />
                  <span>{likesCount} Doa & Dukungan</span>
                </button>

                <button
                  onClick={() =>
                    alert(
                      "Tautan siaran global.islamicity.tv berhasil disalin ke clipboard!"
                    )
                  }
                  className="p-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
                  title="Bagikan Siaran"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Description & Speaker Bio */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {currentBroadcast.category}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">
                  Deskripsi & Rangkuman Kajian
                </h3>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {currentBroadcast.timeSlot}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {currentBroadcast.description}
            </p>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
              <div className="text-slate-600">
                <strong>Catatan Kajian:</strong> Dilarang melakukan transaksi
                spekulasi (gharar), prioritaskan akad yang transparan, dan jalin
                komunikasi berjamaah.
              </div>
            </div>
          </div>
        </div>

        {/* Right / Bottom: Interactive Live Chat Room */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[580px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-sm">Live Chat Jamaah</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Moderasi Syariah Aktif
            </span>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/70 text-xs">
            {chatList.map((msg) => (
              <div
                key={msg.id}
                className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{msg.user}</span>
                    <span className="text-[10px] text-slate-400">
                      ({msg.city})
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{msg.time}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{msg.text}</p>
                {msg.badge && (
                  <span className="inline-block text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                    {msg.badge}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Chat Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3.5 bg-white border-t border-slate-200 space-y-2"
          >
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Nama Anda"
                value={userNameInput}
                onChange={(e) => setUserNameInput(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-emerald-500"
              />
              <input
                type="text"
                placeholder="Kota"
                value={userCityInput}
                onChange={(e) => setUserCityInput(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tulis pesan / pertanyaan kajian..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Playlist / Archived Talks */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              Jadwal & Rekaman Siaran Unggulan
            </h3>
            <p className="text-xs text-slate-500">
              Pilih episode untuk ditonton ulang atau disiarkan ke majelis ta'lim
              komunitas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {broadcasts.map((b) => {
            const isPlaying = currentBroadcast.id === b.id;
            return (
              <div
                key={b.id}
                onClick={() => setCurrentBroadcast(b)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isPlaying
                    ? "bg-emerald-950 text-white border-emerald-700 shadow-md"
                    : "bg-white text-slate-900 border-slate-200 hover:border-emerald-400"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isPlaying
                          ? "bg-emerald-800 text-emerald-200"
                          : "bg-emerald-50 text-emerald-800"
                      }`}
                    >
                      {b.category}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        isPlaying ? "text-amber-300" : "text-slate-400"
                      }`}
                    >
                      {b.duration}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm leading-snug">{b.title}</h4>
                  <p
                    className={`text-xs ${
                      isPlaying ? "text-emerald-200" : "text-slate-500"
                    }`}
                  >
                    {b.speaker}
                  </p>
                </div>

                <div
                  className={`pt-2 border-t text-[11px] flex items-center justify-between ${
                    isPlaying
                      ? "border-emerald-800 text-emerald-300"
                      : "border-slate-100 text-slate-400"
                  }`}
                >
                  <span>{b.timeSlot}</span>
                  <span className="font-bold flex items-center gap-1">
                    <Play className="w-3 h-3 fill-current" />
                    {isPlaying ? "Sedang Diputar" : "Putar Video"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Free E-Book & Guide Download Library */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Perpustakaan Digital Umat
            </span>
            <h3 className="text-xl font-bold text-white font-serif mt-1">
              Unduh Panduan & E-Book Fiqih Muamalah Gratis
            </h3>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Materi resmi disusun oleh Dewan Syariah & Praktisi Green Economy
            untuk dibagikan tanpa biaya hak cipta (Wakaf Ilmu).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 w-fit rounded-lg">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-white">
                Buku Saku: Fiqih Bertahan & Bangkit Pasca-PHK
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Panduan spiritual, adab menghadapi PHK, hak pesangon, dan doa-doa
                mustajab pelancar rezeki.
              </p>
            </div>
            <button
              onClick={() =>
                alert("E-Book 'Fiqih Bangkit Pasca-PHK' berhasil diunduh (PDF)!")
              }
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh E-Book (PDF)</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="p-2 bg-amber-500/20 text-amber-400 w-fit rounded-lg">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-white">
                Kompilasi Draft Akad Syariah Siap Pakai
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Template surat perjanjian Mudharabah, Musyarakah, Murabahah, dan
                Ijarah yang sesuai fatwa DSN-MUI.
              </p>
            </div>
            <button
              onClick={() =>
                alert("Template Draft Akad Syariah (DOCX/PDF) berhasil diunduh!")
              }
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Template Akad</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="p-2 bg-lime-500/20 text-lime-400 w-fit rounded-lg">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-white">
                Manual Teknis Usaha Sirkular Maggot & Organik
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                SOP budidaya, formula pakan, penanganan hama, dan analisis
                kelayakan finansial usaha hijau.
              </p>
            </div>
            <button
              onClick={() =>
                alert("Manual Teknis Usaha Hijau berhasil diunduh!")
              }
              className="w-full py-2 bg-lime-600 hover:bg-lime-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Manual Hijau</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
