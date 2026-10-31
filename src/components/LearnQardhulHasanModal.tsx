import React, { useState } from "react";
import {
  X,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Coins,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Users,
  Leaf,
  Scale,
  BookOpen,
  ArrowRight,
  Info,
} from "lucide-react";

interface LearnQardhulHasanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApplyModal?: () => void;
}

export const LearnQardhulHasanModal: React.FC<LearnQardhulHasanModalProps> = ({
  isOpen,
  onClose,
  onOpenApplyModal,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  if (!isOpen) return null;

  const faqs = [
    {
      q: "Dari mana asal sumber dana Qardhul Hasan di IslamiCity?",
      a: "Dana Qardhul Hasan bersumber dari dana kebajikan infaq produktif, sedekah para muzakki/donatur, bagian dari dana wakaf uang bergulir, dan zakat fakir-miskin produktif yang diamanahkan kepada platform tanpa tuntutan imbal hasil finansial.",
    },
    {
      q: "Apakah peminjam dikenakan biaya administrasi atau bunga tersembunyi?",
      a: "Sama sekali TIDAK (0% bunga, 0% provisi, 0% denda). Anda hanya wajib mengembalikan nilai pokok yang dipinjam persis sesuai nominal yang diterima.",
    },
    {
      q: "Bagaimana jika usaha penerima modal mengalami kendala berat pasca-PHK?",
      a: "Platform menyediakan tim pendamping bisnis syariah untuk restrukturisasi dan konsultasi. Sesuai prinsip QS. Al-Baqarah: 280, jika debitur dalam kesulitan nyata, diberikan penundaan waktu tanpa denda sepeserpun, atau dipertimbangkan diputihkan melalui alokasi zakat darurat.",
    },
    {
      q: "Bagaimana dana ini bisa terus bertumbuh membantu umat lain?",
      a: "Sistem 'Dana Bergulir' (Revolving Fund): saat Anda berhasil bangkit dan mengembalikan modal pokok, dana tersebut seketika langsung disalurkan kembali kepada rekan-rekan korban PHK lainnya yang sedang mengantre membutuhkan modal awal.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-3xl w-full border border-emerald-500/30 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Islamic Aesthetics */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Panduan Edukasi Fiqih Muamalah
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                Mengenal Akad Qardhul Hasan
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed max-w-2xl mt-1">
            Solusi permodalan kebajikan <strong>100% Bebas Bunga & Bebas Riba</strong> yang dirancang untuk
            memulihkan martabat ekonomi korban PHK menuju kemandirian berdaulat.
          </p>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm">
          {/* Definition in Plain Language */}
          <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4.5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-base font-serif">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              <span>Apa Itu Qardhul Hasan dalam Bahasa Sederhana?</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
              Secara harfiah, <em>Qardhul Hasan</em> berarti <strong>"Pinjaman Kebaikan"</strong>. Ini adalah
              akad pinjaman murni tanpa mencari keuntungan finansial sedikit pun. Anda meminjam modal Rp 5.000.000,
              maka Anda hanya mengembalikan persis Rp 5.000.000 secara mencicil tanpa tambahan bunga, biaya tersembunyi,
              maupun denda keterlambatan.
            </p>
            <div className="text-xs font-semibold text-emerald-800 italic pt-1 border-t border-emerald-200">
              "Siapakah yang mau memberi pinjaman kepada Allah, pinjaman yang baik (menafkahkan hartanya di jalan Allah),
              maka Allah akan melipatgandakan pembayaran kepadanya dengan lipat ganda yang banyak..." (QS. Al-Baqarah: 245)
            </div>
          </div>

          {/* 4 Core Pillars of Qardhul Hasan */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>4 Prinsip Utama Qardhul Hasan</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5 hover:border-emerald-400 transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <span>Nol Bunga & Nol Riba (0% Interest)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Diharamkan mengambil manfaat atau keuntungan tambahan dari akad utang-piutang. Pinjam 100, kembali 100.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5 hover:border-emerald-400 transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
                  <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <span>Akad Kebajikan & Solidaritas Sosial</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bukan transaksi komersial. Tujuannya murni menolong sesama muslim (ta'awun) agar terhindar dari lilitan pinjol.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5 hover:border-emerald-400 transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <span>Akhlak Mulia & Kelonggaran Waktu</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tidak ada intimidasi debt collector. Jika terjadi musibah riil, diberikan kelonggaran waktu tanpa denda.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5 hover:border-emerald-400 transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold text-lime-900">
                  <div className="w-6 h-6 rounded-lg bg-lime-100 text-lime-700 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <span>Dana Bergulir Berkelanjutan</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cicilan pokok yang Anda bayarkan tidak lenyap, melainkan langsung dicairkan untuk korban PHK berikutnya.
                </p>
              </div>
            </div>
          </div>

          {/* Comparison Table: Conventional Pinjol vs Qardhul Hasan */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>Perbandingan: Pinjaman Konvensional / Pinjol vs Qardhul Hasan</span>
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Fitur / Kriteria</th>
                    <th className="p-3 bg-rose-50/60 text-rose-900 border-x border-rose-200">
                      Pinjaman Konvensional / Pinjol
                    </th>
                    <th className="p-3 bg-emerald-50 text-emerald-900">
                      Qardhul Hasan IslamiCity
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Tingkat Bunga</td>
                    <td className="p-3 bg-rose-50/30 text-rose-800">
                      12% - 36%+ per tahun (Bunga berbunga)
                    </td>
                    <td className="p-3 bg-emerald-50/30 text-emerald-800 font-bold">
                      0% (Nol Bunga Selamanya)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Biaya Admin & Denda</td>
                    <td className="p-3 bg-rose-50/30 text-rose-800">
                      Potongan pencairan awal & denda harian
                    </td>
                    <td className="p-3 bg-emerald-50/30 text-emerald-800 font-bold">
                      0% (Tanpa Biaya Admin & Denda)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Fokus Tujuan</td>
                    <td className="p-3 bg-rose-50/30 text-rose-800">
                      Maksimalisasi laba pemilik modal
                    </td>
                    <td className="p-3 bg-emerald-50/30 text-emerald-800">
                      Kemandirian ekonomi & martabat umat
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Metode Penagihan</td>
                    <td className="p-3 bg-rose-50/30 text-rose-800">
                      Teror kontak & rasa malu sosial
                    </td>
                    <td className="p-3 bg-emerald-50/30 text-emerald-800 font-medium">
                      Musyawarah, pendampingan & doa
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Pendampingan Usaha</td>
                    <td className="p-3 bg-rose-50/30 text-slate-500">Tidak ada pendampingan</td>
                    <td className="p-3 bg-emerald-50/30 text-emerald-800 font-medium">
                      Bimbingan mentor bisnis & pasar halal
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Social Impact Flow */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Dampak Sosial: Transformasi Mustahiq Menjadi Muzakki</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dengan modal Qardhul Hasan, korban PHK memulai usaha mikro yang riil. Begitu usaha mandiri dan
              menghasilkan laba, mereka melunasi modal pokok dan kemudian bertransformasi menjadi donatur baru yang
              membantu saudaranya yang lain.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="p-2 bg-slate-800 rounded-xl border border-slate-700">
                <div className="font-bold text-amber-400">Tahap 1: Resiliensi</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Bebas dari utang riba</div>
              </div>
              <div className="p-2 bg-slate-800 rounded-xl border border-slate-700">
                <div className="font-bold text-emerald-400">Tahap 2: Mandiri</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Omset stabil & melunasi</div>
              </div>
              <div className="p-2 bg-slate-800 rounded-xl border border-slate-700">
                <div className="font-bold text-teal-400">Tahap 3: Berdaya</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Membayar zakat & infaq</div>
              </div>
            </div>
          </div>

          {/* Accordion FAQs */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Pertanyaan yang Sering Diajukan (FAQ)</span>
            </h3>
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full p-3.5 text-left text-xs font-bold text-slate-800 hover:bg-slate-50 flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-emerald-600 text-base font-bold shrink-0">
                      {activeFaq === index ? "−" : "+"}
                    </span>
                  </button>
                  {activeFaq === index && (
                    <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-[11px] text-slate-500 text-center sm:text-left">
            Diawasi oleh Dewan Pengawas Syariah (DPS) & Fiqih Muamalah Center.
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Tutup Penjelasan
            </button>
            {onOpenApplyModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenApplyModal();
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Coins className="w-4 h-4 text-amber-300" />
                <span>Ajukan Qardhul Hasan Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
