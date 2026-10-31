import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initializer for Gemini SDK
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "IslamiCity Global Backend",
    timestamp: new Date().toISOString(),
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// 1. AI Career & Business Pivot for Layoff Victims (Pemberdayaan Korban PHK)
app.post("/api/gemini/career-pivot", async (req, res) => {
  try {
    const { background, skills, budget, location, interest, familyDependents } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback robust simulation if API key is not yet configured
      return res.json({
        success: true,
        isFallback: true,
        plan: {
          title: `Rencana Bangkit Berdaya: Transformasi ke ${interest || "Wirausaha Mandiri"}`,
          summary: `Strategi transisi komprehensif bagi mantan pekerja dengan modal ${budget || "terbatas"}, mengedepankan prinsip syariah dan keberlanjutan hijau.`,
          recommendedBusinessModels: [
            {
              name: `Layanan ${interest || "Keahlian"} Berbasis Jamaah`,
              akad: "Ijarah & Mudharabah",
              estimatedStartupCost: budget || "Rp 5.000.000 - Rp 15.000.000",
              breakEvenEstimate: "2 - 3 Bulan",
              greenAspect: "Paperless workflow, eco-friendly packaging, dan efisiensi energi.",
              shariaComplianceNote: "Bebas dari riba, transparan dalam spesifikasi layanan, ujrah (upah) disepakati di awal.",
            },
            {
              name: "Kemitraan Distribusi Produk Halal & Hijau",
              akad: "Murabahah & Wakalah bil Ujrah",
              estimatedStartupCost: "Rp 3.000.000 - Rp 8.000.000",
              breakEvenEstimate: "1 - 2 Bulan",
              greenAspect: "Mendukung rantai pasok lokal rendah emisi dan minim sampah.",
              shariaComplianceNote: "Barang riil, tidak ada spekulasi (gharar), margin keuntungan wajar dan disepakati.",
            },
          ],
          weeklyActionRoadmap: [
            {
              week: "Minggu 1: Pembersihan Niat & Audit Aset",
              steps: [
                "Menata spiritualitas: Shalat Taubat & Dhuha, sedekah subuh pembuka rezeki.",
                "Mengamankan Dana Darurat 40% dari pesangon untuk kebutuhan pokok 4-6 bulan.",
                "Identifikasi 3 keahlian utama yang dapat dimonetisasi segera.",
              ],
            },
            {
              week: "Minggu 2: Validasi Pasar & Akad Syariah",
              steps: [
                "Survei 15 calon pelanggan potensial di lingkungan jamaah / online.",
                "Menyiapkan draft akad muamalah (syarat & ketentuan halal).",
                "Membuat branding islami & profil digital di Pasar Islamicity.",
              ],
            },
            {
              week: "Minggu 3: Peluncuran MVP (Minimum Viable Product)",
              steps: [
                "Buka penawaran perdana (pre-order atau jasa pertama) tanpa modal besar.",
                "Dapatkan 5 testimoni pertama dari pembeli awal.",
                "Pencatatan keuangan terpisah antara uang pribadi dan kas usaha.",
              ],
            },
            {
              week: "Minggu 4: Berjamaah & Scaling Up",
              steps: [
                "Ajukan permodalan Qardhul Hasan atau Musyarakah jika pesanan meluas.",
                "Ajak rekan sesama alumni PHK untuk kolaborasi bagi tugas.",
                "Alokasikan 2.5% - 5% laba bersih untuk infaq berkah.",
              ],
            },
          ],
          quranInspiration: {
            verse: "QS. At-Talaq [65:2-3]",
            text: "Barangsiapa bertakwa kepada Allah niscaya Dia akan mengadakan baginya jalan keluar, dan memberinya rezeki dari arah yang tiada disangka-sangkanya.",
          },
        },
      });
    }

    const prompt = `Anda adalah Dewan Penasihat Ekonomi Syariah & Konsultan Karir Senior dari platform IslamiCity Global (global.islamicity.tv).
Bantu seorang korban PHK / pencari kerja bangkit dengan rencana usaha/karir yang komprehensif, berbasis syariah, berjamaah, dan green berkelanjutan.

Profil Pengguna:
- Latar belakang profesi sebelumnya: ${background || "Karyawan swasta"}
- Keterampilan utama: ${skills || "Komunikasi, Operasional, Teknis"}
- Modal / Alokasi Pesangon yang dialokasikan: ${budget || "Rp 10.000.000"}
- Lokasi / Kota: ${location || "Indonesia"}
- Minat bidang: ${interest || "Usaha Kuliner Organik & Halal"}
- Tanggungan keluarga: ${familyDependents || "1 istri & 2 anak"}

Berikan output dalam format JSON murni dengan struktur berikut:
{
  "title": "Judul rencana strategi yang membakar semangat dan solutif",
  "summary": "Ringkasan analisis peluang dan solusi ekonomi 2-3 kalimat",
  "recommendedBusinessModels": [
    {
      "name": "Nama ide usaha/karir 1",
      "akad": "Akad syariah yang tepat (Mudharabah / Musyarakah / Murabahah / Ijarah)",
      "estimatedStartupCost": "Perkiraan modal awal",
      "breakEvenEstimate": "Estimasi BEP",
      "greenAspect": "Aspek ramah lingkungan / sirkular / hemat energi",
      "shariaComplianceNote": "Panduan kepatuhan syariah & bebas riba"
    },
    {
      "name": "Nama ide usaha/karir 2",
      "akad": "Akad syariah",
      "estimatedStartupCost": "Perkiraan modal",
      "breakEvenEstimate": "Estimasi BEP",
      "greenAspect": "Aspek ramah lingkungan",
      "shariaComplianceNote": "Panduan kepatuhan syariah"
    }
  ],
  "weeklyActionRoadmap": [
    {
      "week": "Minggu 1: Pembersihan Niat & Audit Aset",
      "steps": ["Langkah 1", "Langkah 2", "Langkah 3"]
    },
    {
      "week": "Minggu 2: Validasi & Persiapan Muamalah",
      "steps": ["Langkah 1", "Langkah 2", "Langkah 3"]
    },
    {
      "week": "Minggu 3: Eksekusi & Penjualan Perdana",
      "steps": ["Langkah 1", "Langkah 2", "Langkah 3"]
    },
    {
      "week": "Minggu 4: Berjamaah & Ekspansi Berkah",
      "steps": ["Langkah 1", "Langkah 2", "Langkah 3"]
    }
  ],
  "quranInspiration": {
    "verse": "Ayat Al-Quran atau Hadits Relevan",
    "text": "Terjemahan dan pesan motivasi spiritual"
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction:
          "Anda adalah pakar pemberdayaan ekonomi syariah dan konsultan karir Islamicity Global yang bijak, solutif, empatik, dan berlandaskan Fiqih Muamalah serta Green Economy.",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, plan: parsed });
  } catch (error: any) {
    console.error("Error in career-pivot:", error);
    res.status(500).json({ success: false, error: error.message || "Gagal memproses data" });
  }
});

// 2. Sharia Clinic & Fiqih Muamalah Advisor
app.post("/api/gemini/syariah-clinic", async (req, res) => {
  try {
    const { question, contextType } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: true,
        isFallback: true,
        answer: {
          statusHukum: "Mubah / Dianjurkan dengan Catatan Syariah",
          penjelasan: `Pertanyaan Anda mengenai "${question || "transaksi bisnis"}" dianalisis berdasarkan kaidah Fiqih Muamalah: "Al-ashlu fil mu'amalati al-ibahah illa an yadulla dalilun 'ala tahrimiha" (Hukum asal muamalah adalah boleh kecuali ada dalil yang mengharamkannya).`,
          poinKritis: [
            "Pastikan terbebas dari Riba (tambahan bunga tanpa dasar kompensasi riil).",
            "Hindari Gharar (ketidakjelasan objek, harga, atau waktu serah terima).",
            "Hindari Maysir (spekulasi atau perjudian untung-untungan).",
            "Gunakan akad tertulis yang jelas dengan saksi atau catatan digital.",
          ],
          rekomendasiAkad: "Akad Mudharabah (Bagi Hasil Pengelola-Pemodal) atau Murabahah (Jual Beli Margin Transparan).",
          dalilRujukan: "QS. Al-Baqarah: 275 ('Allah menghalalkan jual beli dan mengharamkan riba') & Fatwa DSN-MUI.",
          langkahPraktis: [
            "Buat surat perjanjian kerja sama bermaterai yang memuat hak dan kewajiban.",
            "Tentukan nisbah bagi hasil berdasarkan keuntungan aktual, bukan persentase modal.",
            "Lakukan audit berkala dan transparansi pembukuan secara berjamaah.",
          ],
        },
      });
    }

    const prompt = `Sebagai Dewan Pakar Fiqih Muamalah dan Ekonomi Islam dari Islamicity Global (global.islamicity.tv), jawablah konsultasi hukum dan etika bisnis syariah berikut:
Pertanyaan Jamaah: "${question}"
Konteks: ${contextType || "Umum / Usaha"}

Berikan jawaban terstruktur dalam JSON format:
{
  "statusHukum": "Contoh: Halal / Mubah dengan Syarat / Perlu Penyesuaian Akad / Haram/Riba",
  "penjelasan": "Uraian fiqih yang jelas, mudah dipahami masyarakat awam, dan solutif (2-3 paragraf)",
  "poinKritis": [
    "Poin penting 1 untuk dihindari",
    "Poin penting 2 untuk dipenuhi"
  ],
  "rekomendasiAkad": "Nama akad yang tepat dan mekanismenya",
  "dalilRujukan": "Ayat Al-Quran, Hadits Shahih, atau Kaidah Fiqih relevan",
  "langkahPraktis": [
    "Langkah konkrit 1",
    "Langkah konkrit 2",
    "Langkah konkrit 3"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction:
          "Anda adalah Mufti & Ahli Fiqih Muamalah Islamicity Global yang moderat, solutif, menolong umat bangkit dari riba, dan memberikan alternatif bisnis syariah yang berkah.",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, answer: parsed });
  } catch (error: any) {
    console.error("Error in syariah-clinic:", error);
    res.status(500).json({ success: false, error: error.message || "Gagal memproses konsultasi" });
  }
});

// 3. Green Sharia Business Proposal Generator (Blueprint Usaha Hijau & Crowdfund)
app.post("/api/gemini/green-proposal", async (req, res) => {
  try {
    const { businessName, category, targetBudget, membersCount, location } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: true,
        isFallback: true,
        proposal: {
          namaProyek: businessName || "Sentra Usaha Hijau Umat Berkah",
          kategori: category || "Pertanian Organik & Pengolahan Sampah",
          ringkasanEksekutif: "Inisiatif pemberdayaan ekonomi sirkular berbasis masjid/komunitas untuk menyerap tenaga kerja korban PHK melalui usaha ramah lingkungan berakad Musyarakah.",
          anggaranRencana: {
            alokasiAlat: "45%",
            alokasiBahanBaku: "30%",
            alokasiOperasional: "15%",
            danaDaruratDanInfaq: "10%",
          },
          targetDampakHijau: [
            "Mereduksi hingga 500 kg limbah organik per minggu menjadi kompos & pakan bernilai tinggi.",
            "Menghemat konsumsi energi fosil dengan pemanfaatan panel surya skala mikro.",
            "Menghasilkan produk 100% bebas bahan kimia sintetis berbahaya.",
          ],
          targetDampakSosialEkonomi: [
            `Membuka lapangan kerja langsung bagi ${membersCount || "5"} orang korban PHK di wilayah ${location || "Komunitas"}.`,
            "Pemberian upah layak (Ujrah bil Ma'ruf) di atas rata-rata UMR lokal.",
            "20% laba disalurkan untuk dana beasiswa anak yatim dan kas masjid.",
          ],
          skemaBagiHasil: "Nisbah 60% untuk Pengelola Usaha (Mudharib) : 40% untuk Pemodal Jamaah (Shahibul Maal).",
        },
      });
    }

    const prompt = `Buatkan Proposal Rancang Bangun Usaha Hijau Syariah (Green Islamic Business Blueprint) untuk diajukan ke Crowdfunding Jamaah Islamicity:
- Nama Usaha: ${businessName || "Koperasi Hijau Berkah"}
- Kategori Usaha: ${category || "Green Circular Economy / Halal Food"}
- Target Pendanaan: ${targetBudget || "Rp 25.000.000"}
- Jumlah Pekerja / Anggota PHK yang diberdayakan: ${membersCount || "4"} orang
- Lokasi: ${location || "Bandung, Jawa Barat"}

Format JSON:
{
  "namaProyek": "Nama resmi proyek usaha",
  "kategori": "Kategori",
  "ringkasanEksekutif": "Ringkasan persuasif 3-4 kalimat",
  "anggaranRencana": {
    "alokasiAlat": "persentase & rincian",
    "alokasiBahanBaku": "persentase & rincian",
    "alokasiOperasional": "persentase & rincian",
    "danaDaruratDanInfaq": "persentase & rincian"
  },
  "targetDampakHijau": [
    "Dampak 1 pengurangan emisi / limbah / sirkular",
    "Dampak 2 efisiensi energi / pelestarian alam",
    "Dampak 3 sertifikasi green halal"
  ],
  "targetDampakSosialEkonomi": [
    "Dampak 1 penyerapan tenaga kerja korban PHK",
    "Dampak 2 peningkatan taraf hidup keluarga",
    "Dampak 3 kontribusi zakat/wakaf produktif"
  ],
  "skemaBagiHasil": "Rincian nisbah bagi hasil dan akad (Musyarakah/Mudharabah)"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "Anda adalah analis investasi sosial syariah & konsultan Green Economy Islamicity Global.",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, proposal: parsed });
  } catch (error: any) {
    console.error("Error in green-proposal:", error);
    res.status(500).json({ success: false, error: error.message || "Gagal membuat proposal" });
  }
});

// 4. Fiqih Muamalah AI Chatbot (Qardhul Hasan, Zakat Eligibility & Syariah Finance Advisor)
app.post("/api/gemini/fiqih-chat", async (req, res) => {
  try {
    const { message, chatHistory = [], topicCategory = "general" } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ success: false, error: "Pesan pertanyaan tidak boleh kosong." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Robust contextual fallback generator
      const lower = message.toLowerCase();
      let fallbackTopic = "Fiqih Muamalah & Keuangan Syariah";
      let statusHukum = "Mubah & Dianjurkan (Sesuai Syariat)";
      let explanation = "";
      let quranVerse = {
        surah: "QS. Al-Baqarah [2:245]",
        text: "مَنْ ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا فَيُضَاعِفَهُ لَهُ أَضْعَافًا كَثِيرَةً",
        translation: "Siapakah yang mau memberi pinjaman kepada Allah, pinjaman yang baik (menafkahkan hartanya di jalan Allah), maka Allah akan melipatgandakan pembayaran kepadanya dengan lipat ganda yang banyak.",
      };
      let hadithRef = "HR. Ibnu Majah no. 2431: 'Sedekah dilipatgandakan sepuluh kali lipat, sedangkan pinjaman kebajikan (Qardh) dilipatgandakan delapan belas kali lipat.'";
      let practicalSteps = [
        "Pastikan akad bebas dari klausul bunga tambahan (riba qardh).",
        "Buat pencatatan tertulis yang transparan mengenai tenggat waktu dan hak kewajiban.",
        "Niatkan untuk kemandirian ekonomi keluarga dan ta'awun antar-sesama muslim.",
      ];
      let suggestedActions = ["Ajukan Qardhul Hasan", "Hitung Zakat Mandiri"];

      if (lower.includes("zakat") && (lower.includes("phk") || lower.includes("berhak") || lower.includes("asnaf") || lower.includes("terima"))) {
        fallbackTopic = "Kelayakan Menerima Zakat bagi Korban PHK";
        statusHukum = "Berhak Menerima Zakat (Mustahiq Asnaf Fakir/Miskin atau Gharimin)";
        explanation = `Seorang korban PHK yang kehilangan sumber penghasilan utama dan tidak memiliki tabungan yang mencukupi kebutuhan pokok keluarga (kifayah) termasuk dalam golongan **Fakir/Miskin** atau **Gharimin** (orang yang terbelit utang untuk kebutuhan darurat). 

Menurut Fatwa MUI dan kesepakatan jumhur ulama, dana zakat diperbolehkan disalurkan dalam bentuk **Zakat Produktif** (modal usaha bergulir atau peralatan kerja) agar mustahiq dapat segera berdaya dan bertransformasi menjadi muzakki.`;
        quranVerse = {
          surah: "QS. At-Taubah [9:60]",
          text: "إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا...",
          translation: "Sesungguhnya zakat-zakat itu, hanyalah untuk orang-orang fakir, orang-orang miskin, pengurus-pengurus zakat...",
        };
        hadithRef = "HR. Muslim: 'Tidak halal zakat bagi orang kaya dan orang yang kuat lagi mampu berusaha (kecuali yang tidak menemukan jalan mencari nafkah).'";
        practicalSteps = [
          "Daftarkan diri ke program pendampingan ekonomi mustahiq IslamiCity.",
          "Gunakan bantuan untuk kebutuhan pokok mendesak dan modal kerja halal.",
          "Ikuti pelatihan wirausaha hijau agar segera mandiri finansial.",
        ];
      } else if (lower.includes("pesangon") || lower.includes("nisab") || lower.includes("profesi")) {
        fallbackTopic = "Hukum Zakat Pesangon & Nisab Harta";
        statusHukum = "Wajib Zakat Jika Mencapai Nisab 85g Emas / 524kg Beras";
        explanation = `Uang pesangon yang diterima sekaligus dianalogikan sebagai *Zakat Mal Mustafad* (harta perolehan baru yang halal). 

- Jika total pesangon setelah dikurangi utang jatuh tempo dan kebutuhan darurat pokok bulanan masih melebihi **Nisab setara 85 gram emas** (sekitar Rp 114,7 Juta) atau nisab zakat profesi (524 kg beras / ~Rp 7,8 Juta), maka dikeluarkan zakatnya sebesar **2,5%** pada saat diterima.
- Dianjurkan menerapkan formula syariah 40/30/20/10: 40% Dana Darurat, 30% Modal Usaha, 20% Peningkatan Skill, 10% Infaq & Zakat.`;
        quranVerse = {
          surah: "QS. Al-Baqarah [2:267]",
          text: "يَا أَيُّهَا الَّذِينَ آمَنُوا أَنْفِقُوا مِنْ طَيِّبَاتِ مَا كَسَبْتُمْ...",
          translation: "Wahai orang-orang yang beriman! Infakkanlah sebagian dari hasil usahamu yang baik-baik...",
        };
      } else if (lower.includes("pinjol") || lower.includes("bunga") || lower.includes("riba")) {
        fallbackTopic = "Hukum Riba & Solusi Melepaskan Diri dari Utang Pinjol";
        statusHukum = "Haram Mutlak (Wajib Segera Bertaubat & Diberi Solusi Qardh)";
        explanation = `Bunga pinjol dan pinjaman berbunga termasuk **Riba An-Nasi'ah** yang diharamkan secara mutlak dalam Al-Quran. 

Langkah solutif bagi yang terlanjur terjebak:
1. Bayar hanya nilai pokok yang sah jika memungkinkan, dan minta restrukturisasi tanpa bunga.
2. Ajukan bantuan dana talangan Qardhul Hasan 0% bunga dari platform IslamiCity.
3. Hindari metode 'gali lubang tutup lubang' dengan pinjaman baru.`;
        quranVerse = {
          surah: "QS. Al-Baqarah [2:275-279]",
          text: "وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا...",
          translation: "Allah telah menghalalkan jual beli dan mengharamkan riba... Dan jika kamu bertaubat, maka bagi kamu pokok hartamu; kamu tidak menganiaya dan tidak pula dianiaya.",
        };
      }

      return res.json({
        success: true,
        isFallback: true,
        reply: {
          topic: fallbackTopic,
          statusHukum,
          explanation,
          quranVerse,
          hadithRef,
          fatwaDsnMui: "Fatwa DSN-MUI No. 19/DSN-MUI/IV/2001 tentang Akad Qardh & Fatwa MUI tentang Zakat Produktif.",
          practicalSteps,
          suggestedActions,
        },
      });
    }

    const conversationContext = chatHistory
      .slice(-6)
      .map((h: any) => `${h.role === "user" ? "Pengguna" : "Ustadz AI Fiqih"}: ${h.content}`)
      .join("\n");

    const prompt = `Anda adalah "Asisten Pakar Fiqih Muamalah & Keuangan Syariah" resmi dari ekosistem IslamiCity Global (global.islamicity.tv).
Tugas Anda: Memberikan jawaban berbasis Al-Quran, Hadits Shahih, dan Fatwa DSN-MUI secara instan, jelas, empatik, dan solutif dengan bahasa yang mudah dipahami oleh masyarakat umum, terutama mereka yang terdampak PHK atau sedang mencari kepastian hukum syariah terkait:
1. Pinjaman Tanpa Bunga / Akad Qardhul Hasan vs Pinjol/Riba
2. Kelayakan Menerima Zakat (Asnaf Zakat bagi Korban PHK & Fakir/Miskin/Gharimin)
3. Zakat Pesangon, Zakat Penghasilan, Zakat Maal, dan Nisab Emas/Beras
4. Akad Mudharabah, Musyarakah, Murabahah, dan Koperasi Syariah Hijau (Green Coop)

Riwayat percakapan sebelumnya:
${conversationContext || "Tidak ada riwayat sebelumnya"}

Pertanyaan Pengguna Saat Ini:
"${message}"
Kategori Topik: ${topicCategory}

Format Output WAJIB berupa JSON murni dengan skema berikut:
{
  "topic": "Ringkasan topik pertanyaan dalam 3-6 kata",
  "statusHukum": "Status hukum ringkas (cth: Halal / Wajib / Berhak Menerima Zakat / Haram Riba / Mubah Dianjurkan)",
  "explanation": "Penjelasan hukum syariah dalam bahasa Indonesia yang jernih, runtut, empatik, dan solutif (2-4 paragraf singkat)",
  "quranVerse": {
    "surah": "Nama Surat & Ayat (cth: QS. Al-Baqarah [2:245])",
    "text": "Teks potongan ayat dalam huruf Arab (opsional, jika relevan)",
    "translation": "Terjemahan ayat Al-Quran dalam bahasa Indonesia"
  },
  "hadithRef": "Matan hadits shahih beserta perawinya (cth: HR. Ibnu Majah, HR. Bukhari, atau HR. Muslim)",
  "fatwaDsnMui": "Rujukan fatwa DSN-MUI atau kaidah fiqih muamalah terkait",
  "practicalSteps": [
    "Langkah praktis 1 yang dapat langsung dilakukan jamaah",
    "Langkah praktis 2",
    "Langkah praktis 3"
  ],
  "suggestedActions": [
    "Label aksi cepat 1 (cth: Ajukan Modal Qardhul Hasan)",
    "Label aksi cepat 2 (cth: Hitung Zakat Mandiri)"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction:
          "Anda adalah Dewan Pakar Fiqih Muamalah IslamiCity Global. Anda menjunjung tinggi ketegasan dalam keharaman riba namun sangat empatik, bijaksana, dan memberikan solusi konkrit (Qardhul Hasan & Zakat Produktif) bagi umat yang sedang diuji kesulitan ekonomi.",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, reply: parsed });
  } catch (error: any) {
    console.error("Error in fiqih-chat:", error);
    res.status(500).json({ success: false, error: error.message || "Gagal memproses tanya-jawab fiqih" });
  }
});

// 5. AI-Driven Impact Story Generator for Qardhul Hasan Projects
app.post("/api/gemini/impact-story", async (req, res) => {
  try {
    const { project, platform = "instagram", narrativeAngle = "bangkit-phk", callToAction = "sedekah-subuh" } = req.body;

    if (!project || !project.name) {
      return res.status(400).json({ success: false, error: "Data proyek / penerima manfaat Qardhul Hasan diperlukan." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // High-quality contextual fallback
      const amountStr = project.amountRequested
        ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(project.amountRequested)
        : "Rp 15.000.000";

      const headline = `Kisah Nyata: Dari PHK Menjadi Berdaya & Bebas Riba bersama Qardhul Hasan 🌱`;
      const hook = `Kehilangan pekerjaan bukan akhir dari segalanya. Kenalkan ${project.name}, sosok pejuang tangguh yang bangkit membuktikan bahwa berkah syariah itu nyata!`;
      
      const bodyParagraphs = [
        `Diterpa badai pemutusan hubungan kerja di ${project.formerCompany || "industri manufaktur"}, beliau tidak menyerah pada keputusasaan ataupun pinjaman berbunga tinggi.`,
        `Melalui program Qardhul Hasan (Pinjaman Kebajikan 0% Bunga) sebesar ${amountStr} dari Baitul Maal IslamiCity, ${project.name} memulai inisiatif '${project.businessPlanTitle || "Wirausaha Berkah"}'.`,
        `Hari ini, usahanya ${project.isGreenCertified ? "telah tersertifikasi ramah lingkungan dan " : ""}mampu memberikan penghidupan halal mandiri bagi keluarga serta menebar manfaat bagi lingkungan sekitar.`,
      ];

      const spiritualInsight = "QS. At-Talaq [65:2-3] — 'Barangsiapa bertakwa kepada Allah niscaya Dia akan mengadakan baginya jalan keluar, dan memberinya rezeki dari arah yang tiada disangka-sangkanya.'";
      const quoteByBeneficiary = `"Alhamdulillah, modal Qardhul Hasan tanpa riba ini adalah nafas baru bagi keluarga saya. Terima kasih kepada seluruh muhsinin dan jamaah IslamiCity."`;

      const impactHighlights = [
        { label: "Penerima Manfaat", value: project.name },
        { label: "Plafon Modal", value: `${amountStr} (0% Riba)` },
        { label: "Kategori Usaha", value: project.businessCategory || "Usaha Mandiri Hijau" },
        { label: "Status Program", value: project.status || "Tersalurkan & Mandiri" },
      ];

      const ctaText = callToAction === "qardh"
        ? "🌟 Sedang terdampak PHK dan butuh modal usaha 0% bunga? Ajukan program Qardhul Hasan di IslamiCity Global sekarang!"
        : "💚 Mari lipatgandakan kebaikan ini. Sisihkan Sedekah Subuh / Infaq terbaikmu di Baitul Maal IslamiCity untuk menolong saudara kita lainnya!";

      const hashtags = [
        "#QardhulHasan",
        "#EkonomiSyariah",
        "#BebasRiba",
        "#BangkitPascaPHK",
        "#KisahInspiratif",
        "#BaitulMaal",
        "#IslamiCityGlobal",
      ];

      const formattedShareText = `🌟 ${headline}
━━━━━━━━━━━━━━━━━━
${hook}

${bodyParagraphs.join("\n\n")}

💬 "${quoteByBeneficiary}"

📖 Hikmah: ${spiritualInsight}

📊 Ringkasan Dampak:
• Modal Usaha: ${amountStr} (0% Bunga)
• Usaha: ${project.businessPlanTitle}
• Kategori: ${project.businessCategory || "Usaha Mandiri"}

${ctaText}

${hashtags.join(" ")}
🌐 https://global.islamicity.tv`;

      return res.json({
        success: true,
        isFallback: true,
        story: {
          headline,
          hook,
          bodyParagraphs,
          spiritualInsight,
          quoteByBeneficiary,
          impactHighlights,
          callToActionText: ctaText,
          hashtags,
          formattedShareText,
        },
      });
    }

    const platformGuides: Record<string, string> = {
      instagram: "Format Instagram/Threads: visual, menyentuh emosi, bertutur hangat, gunakan emoji rapi, batasi 3-4 paragraf berjarak, sertakan kutipan dan hashtag populer.",
      whatsapp: "Format WhatsApp Broadcast / Status: pesan personal, penuh doa dan sapaan hangat kepada jamaah/komunitas, penomoran rapi, dan ajakan sedekah yang menggugah hati.",
      twitter: "Format Twitter/X: singkat, padat, 'thread hook' kuat yang memicu retweet/komentar, data riil, dan hikmah spiritual singkat.",
      linkedin: "Format LinkedIn: profesional, fokus pada resiliensi karir, transformasi keahlian, model ekonomi syariah inklusif dan dampak green circular economy.",
      general: "Format umum: seimbang antara narasi inspiratif, data dampak, dan seruan kebaikan berjamaah.",
    };

    const angleGuides: Record<string, string> = {
      "bangkit-phk": "Tekankan perjuangan mengatasi PHK, menolak putus asa, dan beralih menjadi mandiri berwirausaha.",
      "berkah-riba-free": "Soroti keagungan pinjaman kebaikan Qardhul Hasan yang 100% bebas bunga dan melindungi umat dari jeratan pinjol riba.",
      "green-circular": "Fokus pada inovasi ramah lingkungan (zero waste, maggot, aquaponik, organik) dan pelestarian bumi.",
      "keluarga-mandiri": "Fokus pada ketahanan nafkah keluarga, biaya sekolah anak yang terselamatkan, dan ketenteraman rumah tangga.",
    };

    const prompt = `Anda adalah Creative Storyteller & Head of Public Outreach dari ekosistem IslamiCity Global (global.islamicity.tv).
Tugas Anda: Buat Kisah Sukses Dampak Nyata (Impact Success Story) yang sangat inspiratif, mengharukan, autentik, dan ramah media sosial berdasarkan data proyek Qardhul Hasan berikut:

Data Penerima Manfaat / Proyek:
- Nama: ${project.name}
- Mantan Perusahaan (PHK): ${project.formerCompany || "Pabrik / Perusahaan Swasta"}
- Judul Rencana Usaha: ${project.businessPlanTitle}
- Kategori Usaha: ${project.businessCategory || "Usaha Hijau & Berkah"}
- Plafon Modal Qardhul Hasan: Rp ${(project.amountRequested || 10000000).toLocaleString("id-ID")} (0% Bunga)
- Periode Tenor: ${project.repaymentPeriodMonths || 12} Bulan
- Status Penyaluran: ${project.status || "Tersalurkan"}
- Aspek Green / Ramah Lingkungan: ${project.isGreenCertified ? "Ya (Sertifikasi Green)" : "Standar Usaha Halal"}
- Catatan Tambahan: ${project.notes || "Operasional lancar dan mulai memberikan hasil positif"}

Preferensi Pembuatan Kisah:
- Platform Target: ${platform} (${platformGuides[platform] || platformGuides.general})
- Sudut Pandang (Angle): ${narrativeAngle} (${angleGuides[narrativeAngle] || angleGuides["bangkit-phk"]})
- Pilihan CTA: ${callToAction}

Keluarkan format JSON murni sesuai skema berikut:
{
  "headline": "Judul kisah yang memikat dengan emoji yang pas (1 kalimat)",
  "hook": "Kalimat pembuka yang langsung menarik perhatian pembaca di detik pertama",
  "bodyParagraphs": [
    "Paragraf 1: Latar belakang dan situasi sulit pasca PHK",
    "Paragraf 2: Titik balik saat mendapatkan bantuan Qardhul Hasan 0% bunga dari Baitul Maal",
    "Paragraf 3: Hasil nyata dan dampak positif yang dicapai saat ini"
  ],
  "spiritualInsight": "Kutipan Ayat Al-Quran (Surah & No. Ayat) atau Hadits Shahih yang relevan dengan terjemahan singkat",
  "quoteByBeneficiary": "Kutipan langsung menyentuh hati dari penerima manfaat (1-2 kalimat)",
  "impactHighlights": [
    { "label": "Plafon Modal", "value": "Rp ... (0% Bunga)" },
    { "label": "Kategori", "value": "..." },
    { "label": "Dampak Sosial", "value": "..." }
  ],
  "callToActionText": "Kalimat ajakan bertindak (CTA) untuk pembaca",
  "hashtags": ["#QardhulHasan", "#BangkitPascaPHK", "#EkonomiSyariah", "#IslamiCityGlobal"],
  "formattedShareText": "Teks lengkap siap salin (termasuk emoji, paragraf rapi, kutipan, CTA, dan hashtag) yang siap langsung di-copy-paste ke ${platform}"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction:
          "Anda adalah penulis cerita dampak kemanusiaan dan ekonomi syariah terbaik di Indonesia. Anda menggabungkan empati, akurasi data proyek, nilai-nilai spiritualitas Islam yang luhur, dan copywriting media sosial yang viral dan memikat.",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, story: parsed });
  } catch (error: any) {
    console.error("Error in impact-story:", error);
    res.status(500).json({ success: false, error: error.message || "Gagal membuat kisah dampak AI" });
  }
});

// 9. AI Islamicity Academy: Masterplan Arsitek Wilayah Baldatun Thoyyibatun (RT/RW, Kelurahan, Kecamatan)
app.post("/api/gemini/academy-masterplan", async (req, res) => {
  try {
    const { territoryName, level, demographicContext, mainChallenges, priorityPillars, targetMonths } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      // Robust Fallback Masterplan
      return res.json({
        success: true,
        isFallback: true,
        masterplan: {
          territoryName: territoryName || "Lingkungan Percontohan Berkah",
          level: level || "RW",
          demographicContext: demographicContext || "Kawasan padat penduduk dengan potensi pemuda dan jamaah masjid yang antusias.",
          mainChallenge: mainChallenges || "Tingkat pengangguran pasca-PHK, sampah organik belum terkelola, dan kas sosial warga masih minim.",
          visionStatement: `Mewujudkan ${territoryName || "Wilayah Ini"} sebagai Kawasan Peradaban Mandiri, Sejahtera Bebas Riba, dan Lestari Lingkungan yang Baldatun Thoyyibatun wa Rabbun Ghofur.`,
          ibtTargetScore: 92,
          hundredDaysRoadmap: [
            {
              phase: "Fase 1 (Hari 1 - 30)",
              timeline: "Konsolidasi & Sensus Kerentanan",
              milestone: "Database Warga Presisi & Peluncuran Baitul Maal Darurat",
              tasks: [
                "Musyawarah Syura bersama Tokoh Masyarakat, DKM, dan Karang Taruna.",
                "Sensus sosial 40 rumah sekitar masjid untuk mendata keluarga rentan PHK & dhuafa.",
                "Penyediaan 50 Kaleng Sedekah Subuh di rumah warga dan standing QRIS Infaq.",
                "Deklarasi Komitmen Wilayah Bebas Rentenir & Pinjol Ilegal."
              ]
            },
            {
              phase: "Fase 2 (Hari 31 - 60)",
              timeline: "Akselerasi Ekonomi & Ekologi",
              milestone: "Lumbung Pangan & Sentra Maggot BSF Beroperasi",
              tasks: [
                "Pendirian Kios Sembako Murah / Lumbung Beras Warga dengan modal syirkah iuran.",
                "Pembuatan 1 Biopond Maggot BSF komunal untuk mengolah 50-100 kg sampah pasar/dapur harian.",
                "Penyaluran putaran perdana Qardhul Hasan (0% bunga) bagi 5 pelaku usaha mikro ter-PHK.",
                "Pelaksanaan perdana Pasar Subuh & Barter Skill Ahad Pagi di halaman masjid."
              ]
            },
            {
              phase: "Fase 3 (Hari 61 - 100)",
              timeline: "Kemandirian & Institusionalisasi",
              milestone: "Sertifikasi Wilayah Baldatun Thoyyibatun & Laporan Kas Real-Time",
              tasks: [
                "Peluncuran Dashboard Kas Transparan Online untuk iuran dan dana ZISWAF warga.",
                "Panen perdana sayuran kebun lorong vertikal dan distribusi ke keluarga dhuafa.",
                "Evaluasi Indeks Baldatun Thoyyibatun (IBT) mencapai skor target > 85%.",
                "Replikasi model ke RT/RW tetangga melalui forum silaturahmi kelurahan."
              ]
            }
          ],
          pillars: [
            {
              pillarName: "1. Pilar Masjid & Ruhiyah (Sentra Baitul Maal)",
              pillarIcon: "🕌",
              strategicGoal: "Menjadikan masjid sebagai sentra solusi kemiskinan dan pembinaan spiritual jamaah 24/7.",
              keyActionItems: [
                "Gerakan Shalat Subuh Berjamaah & Sarapan Berkah berkala.",
                "Pembentukan Posko Baitul Maal DKM untuk layanan pinjaman Qardh 0% bunga.",
                "Kajian mingguan Fiqih Muamalah praktis dan konseling keluarga sakinah."
              ],
              budgetEstimate: "Rp 5.000.000 (Infaq Subuh & Wakaf Tunai)",
              stakeholders: ["DKM Masjid", "Ustadz Lingkungan", "Remaja Masjid (RISMA)"],
              quickWins30Days: "Peluncuran celengan sedekah subuh di 100% pintu rumah warga."
            },
            {
              pillarName: "2. Pilar Ekonomi Bebas Riba & Koperasi Hijau",
              pillarIcon: "🌾",
              strategicGoal: "Membangun ketahanan pangan mandiri dan membebaskan warga dari jeratan rentenir.",
              keyActionItems: [
                "Pendirian Lumbung Sembako Grosir Warga berbasis kemitraan Green Coop.",
                "Bursa Kerja & Barter Skill antar tetangga via grup peradaban.",
                "Dana bergulir Qardhul Hasan untuk wirausaha kuliner dan jasa alumni PHK."
              ],
              budgetEstimate: "Rp 15.000.000 (Syirkah Warga & Kemitraan IslamiCity)",
              stakeholders: ["Pengurus Koperasi", "Pelaku UMKM", "Ibu-Ibu PKK"],
              quickWins30Days: "Buka etalase sembako subsidi perdana dan posko pendampingan hutang."
            },
            {
              pillarName: "3. Pilar Sosial & Ta'awun Umat",
              pillarIcon: "🤝",
              strategicGoal: "Mewujudkan jaring pengaman sosial di mana tidak ada tetangga yang tidur kelaparan.",
              keyActionItems: [
                "Database digital keluarga asnaf zakat & korban PHK terverifikasi.",
                "Santunan pendidikan beasiswa tahfidz anak buruh/pekerja informal.",
                "Klinik konseling mental & ruqyah syar'iyyah untuk penguatan ketahanan jiwa."
              ],
              budgetEstimate: "Rp 4.500.000 (Kas Zakat & Donasi Komunitas)",
              stakeholders: ["Satgas Sosial RW", "Kader Posyandu", "Relawan Kemanusiaan"],
              quickWins30Days: "Penyaluran paket sembako berkah bagi 15 keluarga paling rentan."
            },
            {
              pillarName: "4. Pilar Ekologi & Pangan Sirkular (Bi'ah Thoyyibah)",
              pillarIcon: "🌱",
              strategicGoal: "Zero waste organik dan ketahanan pangan pekarangan ramah iklim.",
              keyActionItems: [
                "Biokonversi sampah dapur rumah tangga menggunakan Maggot BSF.",
                "Instalasi kebun sayur hidroponik / pot vertikal di lorong gang RT.",
                "Bank Sampah Berkah konversi plastik jadi tabungan emas syariah."
              ],
              budgetEstimate: "Rp 7.000.000 (Swadaya & Hibah Hijau)",
              stakeholders: ["Karang Taruna", "Penggerak Lingkungan Hidup", "Pengurus TPS"],
              quickWins30Days: "Pembuatan 1 demoplot biopond maggot dan 20 rak pot sayur vertikal."
            },
            {
              pillarName: "5. Pilar Tata Kelola Syura & Transparansi",
              pillarIcon: "⚖️",
              strategicGoal: "Kepemimpinan amanah, musyawarah mufakat, dan keterbukaan kas lingkungan.",
              keyActionItems: [
                "Buku kas RT/RW digital dengan update laporan otomatis ke WhatsApp grup warga.",
                "Forum Musyawarah Syura Triwulanan penyerapan aspirasi warga.",
                "Dokumen RPJM-RT 3 Tahun tersusun rapi dan disepakati bersama."
              ],
              budgetEstimate: "Rp 1.000.000 (Operasional & Sistem)",
              stakeholders: ["Ketua RT/RW", "Sekretaris & Bendahara", "Dewan Penasehat"],
              quickWins30Days: "Rilis link transparansi kas RT dan notulensi musyawarah perdana."
            }
          ],
          fundingStrategy: [
            { source: "Infaq Sedekah Subuh Warga", allocation: "35%", mechanism: "Kaleng sedekah subuh ditarik mingguan oleh amil pemuda masjid." },
            { source: "Syirkah Iuran Modal Usaha Koperasi", allocation: "40%", mechanism: "Penyertaan modal warga Rp 100.000/KK dengan akad bagi hasil." },
            { source: "ZISWAF & Qardhul Hasan IslamiCity", allocation: "20%", mechanism: "Suntikan dana kebajikan bergulir dari Baitul Maal pusat." },
            { source: "Hasil Penjualan Bank Sampah & Maggot", allocation: "5%", mechanism: "Daur ulang sampah bernilai ekonomi langsung masuk kas RT." }
          ],
          institutionalSetup: [
            { bodyName: "Majelis Syura Wilayah", role: "Pengambil keputusan strategis dan penjaga arah syariat lingkungan.", membership: "Ketua RT/RW, Ketua DKM, Tokoh Masyarakat, Perwakilan Pemuda & Wanita" },
            { bodyName: "Unit Baitul Maal Lingkungan", role: "Pengelola kas sosial, ZISWAF, dan penyaluran Qardhul Hasan mikro.", membership: "Amil Amanah DKM & Bendahara RT" },
            { bodyName: "Satgas Hijau & Ketahanan Pangan", role: "Pengelola urban farming, maggot BSF, dan bank sampah lingkungan.", membership: "Karang Taruna & Komunitas Lingkungan Hidup" }
          ],
          quranicReference: {
            surah: "Saba'",
            verse: "15",
            translation: "(Negerimu) adalah negeri yang baik (makmur dan tenteram) dan (Tuhanmu) adalah Tuhan Yang Maha Pengampun (Baldatun Thoyyibatun wa Rabbun Ghofur)."
          }
        }
      });
    }

    const prompt = `Anda adalah Arsitek Peradaban Islam dan Konsultan Pembangunan Wilayah Komprehensif (Spesialis Kecamatan, Kelurahan, RW, dan RT) dari Islamicity Academy.
Tugas Anda adalah merancang "Masterplan Strategis & Blueprint 100 Hari Transformasi Wilayah Menuju Baldatun Thoyyibatun wa Rabbun Ghofur".

DATA INPUT WILAYAH:
- Nama Wilayah: ${territoryName || "Wilayah Binaan"}
- Tingkat Wilayah: ${level || "RW"}
- Konteks Demografi & Potensi: ${demographicContext || "Kawasan perumahan/perkampungan dengan jamaah masjid aktif dan banyak korban PHK yang butuh mata pencaharian."}
- Tantangan Utama: ${mainChallenges || "Banyak pengangguran, rentan terjerat pinjol/rentenir, pengelolaan sampah belum maksimal, kas sosial terbatas."}
- Prioritas Pilar: ${priorityPillars ? JSON.stringify(priorityPillars) : "Kelima Pilar Lengkap"}
- Target Waktu: ${targetMonths || "100 Hari / 3 Bulan"}

SUSUN MASTERPLAN STRATEGIS DALAM FORMAT JSON BERIKUT (HARUS PERSIS VALID JSON):
{
  "territoryName": "${territoryName || "Wilayah Binaan"}",
  "level": "${level || "RW"}",
  "demographicContext": "Ringkasan analisis demografi & potensi unik wilayah ini (2 kalimat)",
  "mainChallenge": "Deskripsi tajam masalah riil yang akan diselesaikan (2 kalimat)",
  "visionStatement": "Kalimat visi mulia Baldatun Thoyyibatun yang membakar semangat warga",
  "ibtTargetScore": 95,
  "hundredDaysRoadmap": [
    {
      "phase": "Fase 1 (Hari 1 - 30): Fondasi & Sensus",
      "timeline": "Bulan ke-1",
      "milestone": "Nama milestone utama fase 1",
      "tasks": ["Tugas aksi 1", "Tugas aksi 2", "Tugas aksi 3", "Tugas aksi 4"]
    },
    {
      "phase": "Fase 2 (Hari 31 - 60): Akselerasi Program",
      "timeline": "Bulan ke-2",
      "milestone": "Nama milestone utama fase 2",
      "tasks": ["Tugas aksi 1", "Tugas aksi 2", "Tugas aksi 3", "Tugas aksi 4"]
    },
    {
      "phase": "Fase 3 (Hari 61 - 100): Kemandirian & Keberlanjutan",
      "timeline": "Bulan ke-3",
      "milestone": "Nama milestone utama fase 3",
      "tasks": ["Tugas aksi 1", "Tugas aksi 2", "Tugas aksi 3", "Tugas aksi 4"]
    }
  ],
  "pillars": [
    {
      "pillarName": "1. Pilar Masjid & Ruhiyah (Sentra Baitul Maal)",
      "pillarIcon": "🕌",
      "strategicGoal": "Tujuan strategis pilar ini",
      "keyActionItems": ["Aksi konkret 1", "Aksi konkret 2", "Aksi konkret 3"],
      "budgetEstimate": "Estimasi biaya & sumber (cth: Rp 5.000.000)",
      "stakeholders": ["DKM", "Ustadz", "Remaja Masjid"],
      "quickWins30Days": "Hasil instan yang langsung terlihat dalam 30 hari"
    },
    {
      "pillarName": "2. Pilar Ekonomi Bebas Riba & Koperasi Hijau",
      "pillarIcon": "🌾",
      "strategicGoal": "Tujuan strategis pilar ini",
      "keyActionItems": ["Aksi konkret 1", "Aksi konkret 2", "Aksi konkret 3"],
      "budgetEstimate": "Estimasi biaya & sumber",
      "stakeholders": ["Pengurus Koperasi", "UMKM", "Ibu PKK"],
      "quickWins30Days": "Hasil instan 30 hari"
    },
    {
      "pillarName": "3. Pilar Sosial & Ta'awun Umat",
      "pillarIcon": "🤝",
      "strategicGoal": "Tujuan strategis pilar ini",
      "keyActionItems": ["Aksi konkret 1", "Aksi konkret 2", "Aksi konkret 3"],
      "budgetEstimate": "Estimasi biaya & sumber",
      "stakeholders": ["Satgas Sosial", "Posyandu", "Relawan"],
      "quickWins30Days": "Hasil instan 30 hari"
    },
    {
      "pillarName": "4. Pilar Ekologi & Pangan Sirkular (Bi'ah Thoyyibah)",
      "pillarIcon": "🌱",
      "strategicGoal": "Tujuan strategis pilar ini",
      "keyActionItems": ["Aksi konkret 1", "Aksi konkret 2", "Aksi konkret 3"],
      "budgetEstimate": "Estimasi biaya & sumber",
      "stakeholders": ["Karang Taruna", "Komunitas Lingkungan"],
      "quickWins30Days": "Hasil instan 30 hari"
    },
    {
      "pillarName": "5. Pilar Tata Kelola Syura & Transparansi",
      "pillarIcon": "⚖️",
      "strategicGoal": "Tujuan strategis pilar ini",
      "keyActionItems": ["Aksi konkret 1", "Aksi konkret 2", "Aksi konkret 3"],
      "budgetEstimate": "Estimasi biaya & sumber",
      "stakeholders": ["Ketua RT/RW", "Sekretaris", "Tokoh Warga"],
      "quickWins30Days": "Hasil instan 30 hari"
    }
  ],
  "fundingStrategy": [
    { "source": "Infaq Sedekah Subuh Warga", "allocation": "35%", "mechanism": "Mekanisme pengumpulan dan pertanggungjawaban" },
    { "source": "Iuran Syirkah Koperasi", "allocation": "40%", "mechanism": "Mekanisme permodalan warga" },
    { "source": "Zakat & Qardhul Hasan", "allocation": "20%", "mechanism": "Mekanisme penyaluran bebas riba" },
    { "source": "Ekonomi Sirkular / Sampah", "allocation": "5%", "mechanism": "Mekanisme monetisasi limbah & hasil kebun" }
  ],
  "institutionalSetup": [
    { "bodyName": "Majelis Syura Wilayah", "role": "Peran utama", "membership": "Anggota yang terlibat" },
    { "bodyName": "Baitul Maal Lingkungan", "role": "Peran utama", "membership": "Anggota yang terlibat" },
    { "bodyName": "Satgas Hijau & Ketahanan Pangan", "role": "Peran utama", "membership": "Anggota yang terlibat" }
  ],
  "quranicReference": {
    "surah": "Saba'",
    "verse": "15",
    "translation": "(Negerimu) adalah negeri yang baik (makmur dan tenteram) dan (Tuhanmu) adalah Tuhan Yang Maha Pengampun (Baldatun Thoyyibatun wa Rabbun Ghofur)."
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction:
          "Anda adalah Guru Besar Manajemen Pembangunan Wilayah Syariah dan Pakar Sosiologi Perkotaan/Pedesaan Islam. Rencana aksi yang Anda susun harus sangat aplikatif, realistis untuk diterapkan di tingkat RT/RW/Kelurahan, bebas dari teori kosong, mengedepankan pemberdayaan ekonomi korban PHK, ukhuwah, kelestarian alam, dan nilai-nilai Al-Qur'an dan Sunnah.",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, masterplan: parsed });
  } catch (error: any) {
    console.error("Error in academy-masterplan:", error);
    res.status(500).json({ success: false, error: error.message || "Gagal merancang masterplan wilayah AI" });
  }
});


// Vite Middleware / Static serving
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`IslamiCity Global Server running on port ${PORT}`);
  });
}

setupViteOrStatic();
