import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  BookOpen,
  HelpCircle,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Scale,
  Heart,
  MessageSquare,
  ArrowRight,
  Info,
  Lightbulb,
} from "lucide-react";

export interface FiqihChatMessage {
  id: string;
  sender: "user" | "ai";
  timestamp: string;
  text?: string;
  data?: {
    topic?: string;
    statusHukum?: string;
    explanation?: string;
    quranVerse?: {
      surah?: string;
      text?: string;
      translation?: string;
    };
    hadithRef?: string;
    fatwaDsnMui?: string;
    practicalSteps?: string[];
    suggestedActions?: string[];
  };
}

interface FiqihChatbotProps {
  onOpenApplyModal?: () => void;
  onGoToCalculator?: () => void;
}

const PRESET_QUESTIONS = [
  {
    id: "q1",
    label: "Hak Zakat Korban PHK",
    query: "Apakah saya berhak menerima Zakat sebagai korban PHK yang belum memiliki penghasilan?",
    category: "zakat-eligibility",
  },
  {
    id: "q2",
    label: "Hukum Qardhul Hasan",
    query: "Bagaimana hukum meminjam modal 0% bunga Qardhul Hasan dalam Fiqih Muamalah?",
    category: "qardhul-hasan",
  },
  {
    id: "q3",
    label: "Zakat Pesangon & Nisab",
    query: "Bagaimana perhitungan zakat atas uang pesangon dan berapa nisabnya?",
    category: "zakat-pesangon",
  },
  {
    id: "q4",
    label: "Keluar dari Pinjol Riba",
    query: "Bagaimana solusi syariah melepaskan diri dari jeratan utang pinjol berbunga?",
    category: "riba-avoidance",
  },
  {
    id: "q5",
    label: "Zakat Produktif",
    query: "Apakah zakat boleh disalurkan dalam bentuk modal kerja usaha bergulir?",
    category: "zakat-produktif",
  },
  {
    id: "q6",
    label: "Bagi Hasil Mudharabah",
    query: "Bagaimana penentuan nisbah bagi hasil yang sah tanpa melanggar riba?",
    category: "syariah-invest",
  },
];

export const FiqihChatbot: React.FC<FiqihChatbotProps> = ({
  onOpenApplyModal,
  onGoToCalculator,
}) => {
  const [messages, setMessages] = useState<FiqihChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "ai",
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      data: {
        topic: "Asisten Fiqih Muamalah & Keuangan Syariah",
        statusHukum: "Tuntunan Syariah Al-Quran & Sunnah",
        explanation:
          "Assalamu'alaikum Warahmatullahi Wabarakatuh. Saya adalah asisten AI Fiqih Muamalah IslamiCity Global. Saya siap membantu menjawab pertanyaan Anda seputar pinjaman tanpa riba (Qardhul Hasan), kelayakan asnaf zakat korban PHK, nisab zakat pesangon, dan akad permodalan syariah.",
        quranVerse: {
          surah: "QS. Al-Baqarah [2:275]",
          text: "وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا",
          translation: "...Allah telah menghalalkan jual beli dan mengharamkan riba...",
        },
        hadithRef:
          "HR. Al-Hakim & Al-Baihaqi: 'Mencari rezeki yang halal adalah kewajiban setelah menunaikan fardhu (shalat).'",
        practicalSteps: [
          "Pilih salah satu topik pertanyaan cepat di bawah, atau ketik pertanyaan khusus Anda.",
          "Dapatkan rujukan dalil Al-Quran, hadits, dan fatwa DSN-MUI yang relevan.",
          "Manfaatkan program permodalan bebas bunga Qardhul Hasan jika membutuhkan modal usaha.",
        ],
        suggestedActions: ["Ajukan Modal Qardhul Hasan", "Hitung Zakat Mandiri"],
      },
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (queryToSend?: string, category = "general") => {
    const text = queryToSend || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMsg: FiqihChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        content: m.text || m.data?.explanation || "",
      }));

      const res = await fetch("/api/gemini/fiqih-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          chatHistory: historyPayload,
          topicCategory: category,
        }),
      });

      const json = await res.json();

      if (json.success && json.reply) {
        const aiMsg: FiqihChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          data: json.reply,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error(json.error || "Gagal mendapatkan respon");
      }
    } catch (err: any) {
      const fallbackAiMsg: FiqihChatMessage = {
        id: `ai-error-${Date.now()}`,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        data: {
          topic: "Jawaban Fiqih Muamalah",
          statusHukum: "Mubah / Sesuai Kaidah Syariah",
          explanation: `Terkait pertanyaan Anda: "${text}". Dalam Fiqih Muamalah, pinjaman kebajikan (Qardhul Hasan) 100% tanpa tambahan bunga adalah bentuk ta'awun yang sangat dianjurkan. Adapun bagi korban PHK, bila tidak memiliki penghasilan dan mencukupi kebutuhan pokok, sah menerima alokasi zakat sebagai Asnaf Fakir/Miskin atau Gharimin.`,
          quranVerse: {
            surah: "QS. Al-Baqarah [2:280]",
            text: "وَإِنْ كَانَ ذُو عُسْرَةٍ فَنَظِرَةٌ إِلَىٰ مَيْسَرَةٍ",
            translation: "Dan jika (orang yang berutang itu) dalam kesukaran, maka berilah tenggang waktu sampai dia memperoleh kelapangan...",
          },
          hadithRef:
            "HR. Ibnu Majah: 'Barangsiapa meminjamkan hartanya dua kali, maka itu senilai dengan menyedekahkannya sekali.'",
          practicalSteps: [
            "Hindari segala bentuk komitmen bunga berbunga.",
            "Ajukan verifikasi ke tim pendamping IslamiCity untuk modal Qardhul Hasan 0% bunga.",
          ],
          suggestedActions: ["Ajukan Modal Qardhul Hasan"],
        },
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: "msg-welcome-reset",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        data: {
          topic: "Konsultasi Baru Fiqih Muamalah",
          statusHukum: "Siap Menjawab",
          explanation:
            "Riwayat percakapan telah dibersihkan. Silakan ajukan pertanyaan baru Anda seputar Fiqih Muamalah, Qardhul Hasan, Zakat, atau Pesangon.",
          suggestedActions: ["Ajukan Modal Qardhul Hasan", "Hitung Zakat Mandiri"],
        },
      },
    ]);
  };

  return (
    <div
      id="fiqih-ai-chatbot"
      className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col h-[750px] transition-all"
    >
      {/* Chatbot Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 p-5 sm:p-6 text-white shrink-0 flex items-center justify-between gap-4 border-b border-emerald-800/60">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Scale className="w-6 h-6" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-white font-serif">
                Fiqih Muamalah AI Advisor
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Al-Quran & Hadits Grounded
              </span>
            </div>
            <p className="text-xs text-emerald-200/80">
              Jawaban instan syariah seputar Qardhul Hasan, Kelayakan Zakat, & Bebas Riba
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1"
            title="Bersihkan percakapan"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto shrink-0 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Topik Populer:
          </span>
          {PRESET_QUESTIONS.map((q) => (
            <button
              key={q.id}
              onClick={() => handleSendMessage(q.query, q.category)}
              disabled={isLoading}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 shadow-2xs transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Messages Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-slate-100/60">
        {messages.map((msg) => {
          const isAi = msg.sender === "ai";

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAi ? "justify-start" : "justify-end"}`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm mt-1">
                  <Scale className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 sm:p-5 shadow-xs transition-all space-y-3 ${
                  isAi
                    ? "bg-white border border-slate-200/90 text-slate-800"
                    : "bg-gradient-to-r from-emerald-800 to-teal-800 text-white shadow-md ml-12"
                }`}
              >
                {/* User Message Text */}
                {!isAi && (
                  <div className="text-sm font-medium leading-relaxed">{msg.text}</div>
                )}

                {/* AI Structured Response */}
                {isAi && msg.data && (
                  <div className="space-y-4">
                    {/* Status Hukum Header Pill */}
                    {msg.data.statusHukum && (
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {msg.data.topic || "Analisis Fiqih"}
                          </span>
                        </div>
                        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                          {msg.data.statusHukum}
                        </span>
                      </div>
                    )}

                    {/* Explanation */}
                    {msg.data.explanation && (
                      <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
                        {msg.data.explanation.split("\n\n").map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                    )}

                    {/* Quranic Verse Card */}
                    {msg.data.quranVerse?.surah && (
                      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-950 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-amber-700" />
                            <span>Dalil Al-Quran: {msg.data.quranVerse.surah}</span>
                          </div>
                          <span className="text-[10px] bg-amber-200/70 px-2 py-0.5 rounded text-amber-900 font-semibold">
                            Kalamullah
                          </span>
                        </div>

                        {msg.data.quranVerse.text && (
                          <div className="text-right font-serif text-base sm:text-lg text-emerald-950 leading-loose tracking-wide pt-1">
                            {msg.data.quranVerse.text}
                          </div>
                        )}

                        {msg.data.quranVerse.translation && (
                          <p className="text-xs italic text-amber-900/90 leading-relaxed border-t border-amber-200/80 pt-1.5">
                            "{msg.data.quranVerse.translation}"
                          </p>
                        )}
                      </div>
                    )}

                    {/* Hadith Reference */}
                    {msg.data.hadithRef && (
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 text-xs space-y-1">
                        <div className="font-bold flex items-center gap-1 text-emerald-800 text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Rujukan Sunnah Nabawiyyah:</span>
                        </div>
                        <p className="italic text-[11px] leading-relaxed text-emerald-900">
                          {msg.data.hadithRef}
                        </p>
                      </div>
                    )}

                    {/* Fatwa DSN-MUI if available */}
                    {msg.data.fatwaDsnMui && (
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
                        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Rujukan: {msg.data.fatwaDsnMui}</span>
                      </div>
                    )}

                    {/* Practical Steps */}
                    {msg.data.practicalSteps && msg.data.practicalSteps.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                          <span>Panduan Langkah Praktis:</span>
                        </div>
                        <ul className="space-y-1 text-xs text-slate-600 pl-4 list-disc">
                          {msg.data.practicalSteps.map((step, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Quick Suggested Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                      {onOpenApplyModal && (
                        <button
                          onClick={onOpenApplyModal}
                          className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                        >
                          <Coins className="w-3.5 h-3.5 text-amber-300" />
                          <span>Ajukan Modal Qardhul Hasan</span>
                        </button>
                      )}
                      {onGoToCalculator && (
                        <button
                          onClick={onGoToCalculator}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer border border-slate-200"
                        >
                          Hitung Zakat Mandiri
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleCopyText(
                            msg.id,
                            `${msg.data?.topic || "Fiqih Muamalah"}\n${msg.data?.statusHukum || ""}\n\n${
                              msg.data?.explanation || ""
                            }\n\nDalil: ${msg.data?.quranVerse?.surah || ""} - "${
                              msg.data?.quranVerse?.translation || ""
                            }"`
                          )
                        }
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-auto cursor-pointer"
                        title="Salin jawaban"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Message Timestamp */}
                <div
                  className={`text-[10px] ${
                    isAi ? "text-slate-400" : "text-emerald-200"
                  } text-right pt-1`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Spinner / AI Typing State */}
        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              <Scale className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-2.5 text-xs text-slate-600">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Menelaah rujukan Al-Quran, Hadits & Fatwa DSN-MUI...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-4 bg-white border-t border-slate-200 shrink-0"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Tanyakan hukum pinjaman bunga, kelayakan zakat korban PHK, atau zakat pesangon..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-3 rounded-2xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs sm:text-sm text-slate-900 bg-slate-50/50 disabled:bg-slate-100 transition-all"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="absolute right-2 p-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:bg-slate-300 text-white transition-all cursor-pointer disabled:cursor-not-allowed shadow-xs"
            aria-label="Kirim Pertanyaan"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 text-center sm:text-left">
          Jawaban diolah otomatis dengan rujukan Fiqih Muamalah Islamicity Global. Untuk kasus sengketa khusus, konsultasikan dengan Ustadz pembina.
        </p>
      </form>
    </div>
  );
};
