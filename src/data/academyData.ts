import { AcademyModule, TerritoryPilot } from "../types";

export const ACADEMY_MODULES: AcademyModule[] = [
  {
    id: "module-01",
    moduleNumber: 1,
    title: "Masjid Berdaya: Transformasi Sentra Ibadah Menjadi Baitul Maal & Posko Peradaban RT/RW",
    pillar: "Masjid & Ruhiyah",
    description: "Panduan praktis mengaktifkan masjid/musholla lingkungan sebagai pusat penanganan kemiskinan, kas Qardhul Hasan mikro, dan pembinaan ruhiyah warga.",
    targetAudience: "DKM Masjid, Pengurus Musholla, Ketua RT/RW, Tokoh Agama",
    durationHours: 4,
    lessonsCount: 4,
    pointsReward: 100,
    icon: "🕌",
    badgeEarned: "Duta Masjid Berdaya",
    lessons: [
      {
        id: "m1-l1",
        title: "Konsep Qaryah Mubarakah: Masjid Sebagai Jantung Solusi Umat",
        duration: "15 Menit",
        summary: "Mengembalikan fungsi masjid ala Nabawi: bukan hanya tempat ritual shalat, melainkan sentra musyawarah, baitul maal, dan perlindungan sosial bagi warga miskin.",
        keyPoints: [
          "Masjid tidak boleh membiarkan ada warga sekitarnya yang kelaparan atau terjerat rentenir.",
          "Membuat pemetaan mustahik & muzakki presisi dalam radius 40 rumah dari masjid.",
          "Menyisihkan saldo kas masjid untuk dana produktif darurat (Baitul Maal Kasih Sayang)."
        ],
        actionItemSOP: "Lakukan sensus sosial 40 rumah sekitar masjid dan bentuk Unit Layanan Baitul Maal DKM.",
      },
      {
        id: "m1-l2",
        title: "SOP Pendirian Kas Qardhul Hasan Masjid Tanpa Riba",
        duration: "20 Menit",
        summary: "Teknis menghimpun dana infaq bergulir untuk dipinjamkan 0% bunga bagi warga korban PHK dan pedagang kecil sekitar lingkungan.",
        keyPoints: [
          "Akad Qardhul Hasan murni: pinjaman pokok tanpa tambahan biaya administrasi berbunga.",
          "Verifikasi kelayakan berbasis silaturahmi & rekomendasi ketua RT.",
          "Sistem cicilan berkah harian/mingguan dengan pendampingan usaha jamaah."
        ],
        actionItemSOP: "Terbitkan SK Tim Baitul Maal Masjid dan alokasikan 20% kas infaq Jumat untuk modal Qardh.",
      },
      {
        id: "m1-l3",
        title: "Gerakan Shalat Subuh Berjamaah & Kuliah Subuh Muamalah",
        duration: "15 Menit",
        summary: "Membangun kekompakan spiritual warga melalui shalat subuh seramai shalat Jumat dan edukasi fiqih perniagaan halal.",
        keyPoints: [
          "Program sarapan berkah gratis pasca Subuh untuk mempererat ukhuwah warga.",
          "Kajian mingguan fiqih muamalah kontemporer: bahaya riba, transaksi digital halal, etika berniaga.",
          "Kaderisasi pemuda masjid sebagai relawan digitalisasi ZISWAF."
        ],
        actionItemSOP: "Jadwalkan program 'Subuh Berkah Serentak' dan undang pemateri praktisi muamalah syariah.",
      },
      {
        id: "m1-l4",
        title: "Digitalisasi Kas Masjid Transparan & QRIS Berkah RT/RW",
        duration: "18 Menit",
        summary: "Meningkatkan kepercayaan warga melalui laporan keuangan digital real-time dan kemudahan sedekah non-tunai.",
        keyPoints: [
          "Dashboard kas online yang bisa diakses seluruh warga melalui tautan WhatsApp RT.",
          "Pemasangan QRIS resmi infaq subuh di setiap tiang/kotak infaq masjid.",
          "Audit publik mingguan dalam buletin subuh."
        ],
        actionItemSOP: "Integrasikan rekening DKM dengan sistem pelaporan terbuka dan cetak standing QRIS masjid.",
      }
    ],
    quizQuestions: [
      {
        question: "Berapa radius minimal rumah sekitar masjid yang wajib dipastikan tidak ada yang kelaparan menurut sunnah?",
        options: ["10 Rumah", "40 Rumah ke setiap penjuru", "100 Meter saja", "Hanya jamaah tetap masjid"],
        correctIndex: 1,
        explanation: "Dalam tradisi Rasulullah SAW dan fiqih Islam, tetangga masjid didefinisikan hingga 40 rumah ke empat penjuru mata angin."
      },
      {
        question: "Apakah kas infaq masjid diperbolehkan dipinjamkan dengan akad Qardhul Hasan (0% bunga) untuk menolong warga terjerat pinjol?",
        options: [
          "Tidak boleh, kas masjid harus disimpan mengendap di bank",
          "Boleh dan sangat dianjurkan sebagai fungsi Baitul Maal, dengan pencatatan amanah dan persetujuan musyawarah",
          "Boleh asalkan ditarik bunga 5% untuk keuntungan masjid",
          "Hanya boleh jika peminjam memberikan jaminan sertifikat tanah"
        ],
        correctIndex: 1,
        explanation: "Dana infaq/sedekah masjid dapat dikelola produktif sebagai Qardhul Hasan untuk kemaslahatan mustahik tanpa mengambil riba tambahan."
      }
    ]
  },
  {
    id: "module-02",
    moduleNumber: 2,
    title: "Ekonomi Bebas Riba & Koperasi Hijau: Membangun Kemandirian Finansial RT/RW",
    pillar: "Ekonomi Bebas Riba",
    description: "Strategi mendirikan Lumbung Pangan RT, Bank Sampah Berkah, dan Koperasi Konsumen Syariah berbasis warga tanpa pinjol.",
    targetAudience: "Pengurus Koperasi, Karang Taruna, Ibu-Ibu PKK, Wirausahawan Lokal",
    durationHours: 5,
    lessonsCount: 4,
    pointsReward: 120,
    icon: "🌾",
    badgeEarned: "Pelopor Koperasi Hijau",
    lessons: [
      {
        id: "m2-l1",
        title: "Pembebasan Warga dari Jeratan Rentenir & Pinjaman Online",
        duration: "20 Menit",
        summary: "Langkah terpadu satgas RT/RW dalam mengidentifikasi, mengadvokasi, dan merestrukturisasi hutang warga rentan ke sistem syariah.",
        keyPoints: [
          "Membuka posko konseling hutang rahasia (Baitul Maal Crisis Desk).",
          "Take-over hutang riba menggunakan dana Zakat/Infaq khusus asnaf Gharimin.",
          "Mewajibkan penerima manfaat mengikuti pelatihan wirausaha atau barter skill."
        ],
        actionItemSOP: "Deklarasikan 'Zona RT/RW Bebas Riba & Rentenir' dan pasang hotline pendampingan.",
      },
      {
        id: "m2-l2",
        title: "Pendirian Lumbung Pangan & Kios Sembako Syariah RT/RW",
        duration: "25 Menit",
        summary: "Model bisnis koperasi belanja kolektif warga untuk memotong rantai pasok dan menyediakan beras/minyak berkualitas harga grosir.",
        keyPoints: [
          "Skema patungan modal syirkah warga (Rp 50.000 - Rp 200.000/KK).",
          "Membeli langsung dari petani pesantren binaan Green Coop IslamiCity.",
          "Sistem kupon pangan bersubsidi bagi keluarga prasejahtera dan lansia dhuafa."
        ],
        actionItemSOP: "Kumpulkan iuran pokok syirkah warga untuk membuka etalase lumbung sembako di balai warga.",
      },
      {
        id: "m2-l3",
        title: "Pasar Subuh & Barter Skill Antar Tetangga",
        duration: "18 Menit",
        summary: "Mengoptimalkan perputaran uang di dalam lingkungan sendiri melalui bazar halal mingguan dan tukar jasa antar warga.",
        keyPoints: [
          "Menjadikan halaman masjid/lapangan RT sebagai arena bazar usaha warga setiap Ahad pagi.",
          "Membuat grup katalog usaha warga (kuliner, servis AC, les privat, laundry).",
          "Mempromosikan prinsip 'Beli dari Tetangga Sebelum Beli dari Toko Luar'."
        ],
        actionItemSOP: "Rilis direktori 'Katalog Usaha Warga RT' dan selenggarakan Festival Bazar Subuh Ahad.",
      },
      {
        id: "m2-l4",
        title: "Distribusi Surplus Koperasi untuk Dana Sosial Lingkungan",
        duration: "15 Menit",
        summary: "Mekanisme pembagian SHU (Sisa Hasil Usaha) koperasi yang 30%-nya dialokasikan untuk beasiswa anak yatim dan dana darurat warga.",
        keyPoints: [
          "Transparansi pembagian dividen mudharabah kepada anggota penanam modal.",
          "Alokasi dana sosial abadi untuk beasiswa pendidikan dasar anak yatim RT.",
          "Cadangan kas santunan kematian dan kelahiran warga."
        ],
        actionItemSOP: "Tuangkan pasal pembagian 30% SHU sosial dalam AD/ART Koperasi Berkah RT.",
      }
    ],
    quizQuestions: [
      {
        question: "Asnaf zakat manakah yang berhak menerima bantuan pelunasan hutang mendesak non-maksiat?",
        options: ["Amil", "Gharimin (orang yang terlilit hutang)", "Ibnu Sabil", "Muallaf"],
        correctIndex: 1,
        explanation: "Gharimin adalah salah satu dari 8 golongan (asnaf) penerima zakat yang berhak dibantu untuk membebaskan diri dari jeratan hutang."
      }
    ]
  },
  {
    id: "module-03",
    moduleNumber: 3,
    title: "Sosial & Ta'awun: Satgas Tanggap PHK & Jaring Pengaman Kerabat Lingkungan",
    pillar: "Sosial & Ta'awun",
    description: "Membangun sistem deteksi dini kerentanan sosial, sedekah subuh berantai, dan pendampingan psikososial keluarga ter-PHK.",
    targetAudience: "Satgas Sosial RT, Kader Posyandu, Relawan Kemanusiaan, Pengurus RW",
    durationHours: 3.5,
    lessonsCount: 3,
    pointsReward: 90,
    icon: "🤝",
    badgeEarned: "Penggerak Ta'awun Umat",
    lessons: [
      {
        id: "m3-l1",
        title: "Pemetaan Cepat Kerentanan Ekonomi & Korban PHK",
        duration: "18 Menit",
        summary: "Metode pendataan manusiawi tanpa mempermalukan martabat warga yang baru saja kehilangan mata pencaharian.",
        keyPoints: [
          "Format kuesioner rahasia berbasis WhatsApp atau kunjungan silaturahmi berkah.",
          "Kategorisasi kebutuhan: pangan mendesak, modal usaha, atau relokasi pekerjaan.",
          "Menjaga kerahasiaan data pribadi sesuai etika ukhuwah Islamiyah."
        ],
        actionItemSOP: "Update matriks kondisi sosial keluarga RT/RW setiap awal bulan.",
      },
      {
        id: "m3-l2",
        title: "Gerakan Berbagi Kaleng Sedekah Subuh di Setiap Rumah",
        duration: "15 Menit",
        summary: "Menghidupkan kebiasaan sedekah koin/uang kertas setiap shalat Subuh yang dihimpun setiap pekan untuk kas peduli tetangga.",
        keyPoints: [
          "Membagikan kaleng/celengan 'Sedekah Subuh Berkah' ke seluruh pintu rumah warga.",
          "Penarikan mingguan oleh relawan remaja masjid.",
          "Penggunaan dana murni untuk santunan cepat tanpa birokrasi berbelit."
        ],
        actionItemSOP: "Bagikan 50 kaleng sedekah subuh perdana dan tunjuk amil penanggung jawab.",
      },
      {
        id: "m3-l3",
        title: "Klinik Konseling Jiwa & Penguatan Mental Berbasis Sunnah",
        duration: "20 Menit",
        summary: "Pendampingan emosional bagi kepala keluarga yang mengalami stres, depresi, atau kecemasan akibat PHK mendadak.",
        keyPoints: [
          "Membuka sesi curhat bersama ustadz/konselor muslim terpercaya di masjid.",
          "Terapi ruqyah syar'iyyah, dzikir pagi-petang, dan tadabbur ayat-ayat optimisme rezeki.",
          "Menghilangkan stigma 'menganggur' menjadi 'fase hijrah menuju wirausaha mandiri'."
        ],
        actionItemSOP: "Jadwalkan 'Majelis Curhat & Doa Bersama' rutin malam Jumat di musholla.",
      }
    ],
    quizQuestions: [
      {
        question: "Mengapa menjaga martabat (harga diri) korban PHK saat menyalurkan bantuan sosial sangat krusial?",
        options: [
          "Agar mereka tidak meminta bantuan lagi",
          "Karena Islam melarang mengungkit-ungkit sedekah (al-mann) dan menyakiti perasaan penerima (al-adza)",
          "Agar foto penyerahan bantuan terlihat lebih bagus",
          "Tidak ada alasan khusus"
        ],
        correctIndex: 1,
        explanation: "Al-Qur'an Surah Al-Baqarah: 262-264 melarang keras merusak pahala sedekah dengan menyebut-nyebutnya atau menyakiti perasaan mustahik."
      }
    ]
  },
  {
    id: "module-04",
    moduleNumber: 4,
    title: "Ekologi & Ketahanan Pangan: Urban Farming Sirkular, Maggot BSF & Energi Hijau",
    pillar: "Ekologi & Pangan",
    description: "Mengubah lahan kosong RT/RW menjadi sentra pangan hidroponik/organik, mengolah sampah dapur jadi pakan ikan, dan hemat energi surya.",
    targetAudience: "Komunitas Hijau RT, Karang Taruna, Penggerak Lingkungan, Pengurus Bank Sampah",
    durationHours: 4.5,
    lessonsCount: 4,
    pointsReward: 110,
    icon: "🌱",
    badgeEarned: "Ksatria Bumi Thoyyibah",
    lessons: [
      {
        id: "m4-l1",
        title: "Pemanfaatan Lahan Tidur & Gang Rumah Menjadi Kebun Pangan Organik",
        duration: "20 Menit",
        summary: "Teknik urban farming sederhana di gang sempit menggunakan pot vertikal, paralon aquaponik, dan polybag sayuran.",
        keyPoints: [
          "Pemilihan komoditas cepat panen: kangkung (21 hari), bayam, cabai rawit, tomat.",
          "Memanfaatkan air limbah wudhu masjid yang telah disaring untuk menyiram tanaman.",
          "Hasil panen dibagikan bergilir kepada janda dhuafa dan warga sekitar."
        ],
        actionItemSOP: "Dirikan 1 unit instalasi sayur vertikal percontohan di gang utama RT.",
      },
      {
        id: "m4-l2",
        title: "Pengolahan Sampah Organik Rumah Tangga Berbasis Biokonversi Maggot BSF",
        duration: "22 Menit",
        summary: "Solusi nol sampah organik di tingkat RT dengan mengembangbiakkan larva lalat Black Soldier Fly (BSF) sebagai pakan ternak tinggi protein.",
        keyPoints: [
          "Satu kilogram maggot mampu menghabiskan 2-5 kg sisa makanan per hari tanpa bau.",
          "Maggot segar menjadi pakan gratis lele dan ayam petelur warga.",
          "Kasgot (bekas maggot) menjadi pupuk organik super subur untuk kebun warga."
        ],
        actionItemSOP: "Buat 1 biopond maggot komunal di sudut TPS RT dan latih 5 pemuda pengelola.",
      },
      {
        id: "m4-l3",
        title: "Bank Sampah Berkah: Ubah Plastik & Logam Menjadi Tabungan Emas/Infaq",
        duration: "18 Menit",
        summary: "Mekanisme pemilahan sampah anorganik yang disetor berkala dan dikonversi menjadi tabungan emas syariah atau kas musholla.",
        keyPoints: [
          "Jadwal timbang sampah 2 minggu sekali di balai warga.",
          "Kemitraan langsung dengan pengepul daur ulang terpercaya.",
          "Buku tabungan sampah digital untuk setiap kepala keluarga."
        ],
        actionItemSOP: "Luncurkan program 'Sedekah Sampah Plastik Menuju Baitullah' di lingkungan RW.",
      },
      {
        id: "m4-l4",
        title: "Penerangan Jalan Hemat Energi & Panel Surya Masjid Komunal",
        duration: "15 Menit",
        summary: "Menerapkan lampu solar cell otomatis untuk jalan gang RT guna menghemat iuran listrik warga hingga 70%.",
        keyPoints: [
          "Pengadaan lampu PJUTS (Penerangan Jalan Umum Tenaga Surya) swadaya warga.",
          "Instalasi panel surya 1000 Wp di atap musholla untuk cadangan listrik saat padam.",
          "Edukasi hemat energi sebagai bagian dari pengamalan ajaran anti-mubazir (tabdzir)."
        ],
        actionItemSOP: "Pasang 3 titik lampu solar cell di gang rawan gelap RT.",
      }
    ],
    quizQuestions: [
      {
        question: "Apa keuntungan utama biokonversi sampah organik menggunakan Maggot BSF di tingkat RT?",
        options: [
          "Menimbulkan bau menyengat",
          "Mengurai sampah organik sangat cepat, tidak menularkan penyakit, dan menghasilkan pakan berprotein tinggi gratis",
          "Membutuhkan biaya listrik yang sangat mahal",
          "Hanya bisa hidup di laboratorium"
        ],
        correctIndex: 1,
        explanation: "Larva BSF sangat efisien mereduksi sisa makanan secara higienis dalam hitungan jam dan hasilnya bernilai ekonomi tinggi sebagai pakan ternak."
      }
    ]
  },
  {
    id: "module-05",
    moduleNumber: 5,
    title: "Tata Kelola Syura & Digitalisasi Wilayah: Kepemimpinan Amanah Menuju Baldatun Thoyyibatun",
    pillar: "Tata Kelola Syura",
    description: "Model musyawarah digital transparan, pembuatan e-voting warga, akuntabilitas dana kas, dan penyusunan RPJM-RT 3 tahun.",
    targetAudience: "Ketua RT/RW, Sekretaris & Bendahara, Pengurus Lembaga Kemasyarakatan Kelurahan",
    durationHours: 4,
    lessonsCount: 3,
    pointsReward: 100,
    icon: "⚖️",
    badgeEarned: "Pemimpin Syura Amanah",
    lessons: [
      {
        id: "m5-l1",
        title: "Prinsip Syura & Partisipasi Inklusif Seluruh Lapisan Warga",
        duration: "20 Menit",
        summary: "Menggantikan pola kepemimpinan otoriter/pasif dengan musyawarah syariah yang melibatkan bapak-bapak, ibu-ibu, pemuda, dan lansia.",
        keyPoints: [
          "Ayat rujukan: Surah Asy-Syura: 38 (Wa amruhum syura bainahum).",
          "Mekanisme polling digital via WhatsApp sebelum keputusan besar diambil.",
          "Transparansi agenda dan notulensi rapat yang dikirim ke seluruh ponsel warga."
        ],
        actionItemSOP: "Susun jadwal Musyawarah Warga Triwulanan dengan format laporan terbuka.",
      },
      {
        id: "m5-l2",
        title: "Buku Kas RT Digital: Laporan Real-Time Anti Syak Wasangka",
        duration: "18 Menit",
        summary: "Penerapan aplikasi pembukuan kas lingkungan yang menampilkan setiap rupiah pemasukan dan pengeluaran secara terbuka.",
        keyPoints: [
          "Pencatatan iuran kebersihan, keamanan, dan dana sosial dalam spreadsheet terenkripsi.",
          "Upload bukti struk belanja ke folder Google Drive bersama.",
          "Menghilangkan potensi fitnah dan meningkatkan kepatuhan pembayaran iuran warga."
        ],
        actionItemSOP: "Publikasikan link transparansi kas RT di papan pengumuman digital.",
      },
      {
        id: "m5-l3",
        title: "Penyusunan Masterplan RPJM-RT (Rencana Pembangunan Jangka Menengah)",
        duration: "25 Menit",
        summary: "Panduan merumuskan target 3 tahunan RT/RW menuju predikat 'Kampung Berkah Bebas Miskin & Berwawasan Lingkungan'.",
        keyPoints: [
          "Matriks SWOT potensi wilayah (SDM, aset kosong, demografi).",
          "Penetapan Key Performance Indicators (KPI) Baldatun Thoyyibatun.",
          "Roadmap tahun ke-1 (Darurat Sosial & Kebersihan), tahun ke-2 (Kemandirian Ekonomi), tahun ke-3 (Ekspansi Kebaikan)."
        ],
        actionItemSOP: "Gunakan AI Masterplan Generator Islamicity Academy untuk mencetak dokumen RPJM-RT resmi.",
      }
    ],
    quizQuestions: [
      {
        question: "Prinsip utama kepemimpinan wilayah dalam Islam yang diperintahkan dalam Surah Asy-Syura ayat 38 adalah:",
        options: [
          "Keputusan mutlak di tangan ketua RT tanpa perlu bertanya",
          "Musyawarah mufakat (Syura) secara transparan dan mengedepankan kemaslahatan bersama",
          "Menyerahkan seluruh keputusan ke pihak swasta",
          "Menunggu instruksi tanpa ada inisiatif"
        ],
        correctIndex: 1,
        explanation: "Surah Asy-Syura ayat 38 menegaskan bahwa urusan umat diselesaikan melalui musyawarah (Syura) di antara mereka dengan semangat ukhuwah."
      }
    ]
  }
];

export const MOCK_TERRITORY_PILOTS: TerritoryPilot[] = [
  {
    id: "pilot-01",
    name: "Kampung Berkah RW 07 Citarum Harum",
    level: "RW",
    location: "Kelurahan Dayeuhkolot, Kec. Dayeuhkolot, Kab. Bandung, Jawa Barat",
    leaderName: "Ustadz Dadan Purnama (Ketua RW 07)",
    familiesCount: 240,
    ibtScore: 94,
    keyPrograms: [
      "Sentra Maggot BSF 500kg/hari",
      "Baitul Maal Kas Masjid Rp 65 Jt (0% Riba)",
      "Lumbung Beras Syariah Warga",
      "100% Bebas Bank Emok / Rentenir"
    ],
    impactStats: {
      layoffVictimsEmpowered: 38,
      zeroRibaFamilies: 185,
      monthlyZiswafCollected: 18500000,
      wasteDivertedKg: 4200
    },
    imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
    status: "Percontohan Mandiri"
  },
  {
    id: "pilot-02",
    name: "Kelurahan Sukamiskin Mandiri Pangan & Halal",
    level: "Kelurahan",
    location: "Kecamatan Arcamanik, Kota Bandung, Jawa Barat",
    leaderName: "Drs. H. Farhan Sanjaya (Lurah Binaan)",
    familiesCount: 1850,
    ibtScore: 89,
    keyPrograms: [
      "Koperasi Konsumen Syariah Kelurahan",
      "Instalasi Aquaponik di 12 RW",
      "Posko Tanggap Darurat PHK 24 Jam",
      "Bazar Ahad Subuh Barakah"
    ],
    impactStats: {
      layoffVictimsEmpowered: 92,
      zeroRibaFamilies: 720,
      monthlyZiswafCollected: 54000000,
      wasteDivertedKg: 12500
    },
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    status: "Percontohan Mandiri"
  },
  {
    id: "pilot-03",
    name: "Kecamatan Cileungsi Hijau Berdaya",
    level: "Kecamatan",
    location: "Kabupaten Bogor, Jawa Barat",
    leaderName: "Tim Penggerak Camat & Forum DKM Cileungsi",
    familiesCount: 14500,
    ibtScore: 82,
    keyPrograms: [
      "Pabrik Mini Pelet Maggot BSF Terpadu",
      "Jaringan 45 Masjid Ramah Dhuafa",
      "Bursa Tenaga Kerja Muamalah Lokal",
      "Pusat Pelatihan Vokasi Syariah"
    ],
    impactStats: {
      layoffVictimsEmpowered: 215,
      zeroRibaFamilies: 2400,
      monthlyZiswafCollected: 142000000,
      wasteDivertedKg: 38000
    },
    imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    status: "Akselerasi Binaan"
  },
  {
    id: "pilot-04",
    name: "RT 04 / RW 09 Rawa Lumbu Berkah",
    level: "RT",
    location: "Kelurahan Bojong Rawalumbu, Kec. Rawalumbu, Kota Bekasi",
    leaderName: "Ir. H. Gunawan Wibisono (Ketua RT 04)",
    familiesCount: 65,
    ibtScore: 91,
    keyPrograms: [
      "Kaleng Sedekah Subuh di 65 Rumah",
      "Green House Sayur Hidroponik Lorong",
      "Gerobak Listrik Barter Warga",
      "Dashboard Kas Transparan Online"
    ],
    impactStats: {
      layoffVictimsEmpowered: 14,
      zeroRibaFamilies: 58,
      monthlyZiswafCollected: 7200000,
      wasteDivertedKg: 1100
    },
    imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80",
    status: "Percontohan Mandiri"
  }
];

export const IBT_CRITERIA_RUBRIC = [
  {
    category: "Pilar 1: Keagamaan & Masjid (Ruhiyah)",
    weight: 25,
    items: [
      "Shalat Subuh berjamaah aktif & ada sarapan berkah warga",
      "Masjid memiliki saldo kas Baitul Maal untuk bantuan pangan dhuafa",
      "Tersedia layanan Qardhul Hasan (pinjaman darurat 0% bunga)",
      "Kajian fiqih muamalah/ekonomi syariah diselenggarakan berkala"
    ]
  },
  {
    category: "Pilar 2: Ketahanan Ekonomi & Bebas Riba (Iqtishoduna)",
    weight: 25,
    items: [
      "Tidak ada warga yang terjerat rentenir / pinjol ilegal",
      "Tersedia Lumbung Pangan / Koperasi Sembako murah warga",
      "Bazar Subuh mingguan atau grup barter produk tetangga aktif",
      "Ada pendampingan usaha khusus korban PHK & kepala keluarga rentan"
    ]
  },
  {
    category: "Pilar 3: Solidaritas Sosial & Ta'awun",
    weight: 20,
    items: [
      "Database keluarga pra-sejahtera dan korban PHK terdata rapi",
      "Gerakan Kaleng Sedekah Subuh berjalan di minimal 50% rumah",
      "Santunan rutin untuk anak yatim dan janda lanjut usia",
      "Posko konseling dan pendampingan mental warga berjalan"
    ]
  },
  {
    category: "Pilar 4: Ekologi & Ketahanan Pangan Hijau (Bi'ah Thoyyibah)",
    weight: 15,
    items: [
      "Adanya instalasi kebun sayur/urban farming di lahan kosong/gang",
      "Pengolahan sampah organik dapur (Maggot BSF / Kompos komunal)",
      "Bank Sampah anorganik aktif dengan penimbangan berkala",
      "Penerangan jalan gang hemat energi / tenaga surya"
    ]
  },
  {
    category: "Pilar 5: Tata Kelola Syura & Transparansi",
    weight: 15,
    items: [
      "Laporan kas RT/RW/Masjid dapat diakses warga secara digital real-time",
      "Keputusan penting diambil melalui musyawarah warga (Syura)",
      "Memiliki dokumen perencanaan target wilayah (RPJM-RT)",
      "Struktur satgas pemuda/karang taruna aktif berkontribusi"
    ]
  }
];
