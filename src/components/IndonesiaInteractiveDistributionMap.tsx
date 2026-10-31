import React, { useState, useMemo } from "react";
import {
  MapPin,
  Leaf,
  Coins,
  Utensils,
  Bug,
  Building2,
  Users,
  Search,
  Filter,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Compass,
  CheckCircle2,
  Info,
  Maximize2,
  Globe,
  Phone,
  Store,
  RefreshCw,
  Eye,
  BadgeCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface BeneficiaryLocation {
  id: string;
  cityName: string;
  province: string;
  region: "Jawa" | "Sumatera" | "Kalimantan" | "Sulawesi" | "Bali-Nusra" | "Maluku-Papua";
  category: "green-coop" | "unit-mandiri" | "dapur-halal" | "maggot-aquaponik" | "wakaf-produktif";
  categoryLabel: string;
  title: string;
  beneficiariesCount: number;
  totalFundDisbursed: number;
  jobsCreated: number;
  monthlyTurnover: number;
  leadPartner: string;
  contactPerson: string;
  phone: string;
  address: string;
  coreCommodity: string;
  description: string;
  impactStory: string;
  greenImpact: string;
  xPercent: number; // Coordinate percentage on Indonesia SVG Map (0 - 100)
  yPercent: number; // Coordinate percentage on Indonesia SVG Map (0 - 100)
}

const BENEFICIARY_LOCATIONS: BeneficiaryLocation[] = [
  // --- JABODETABEK & JAWA BARAT ---
  {
    id: "LOC-JKT",
    cityName: "Jakarta Pusat",
    province: "DKI Jakarta",
    region: "Jawa",
    category: "dapur-halal",
    categoryLabel: "Dapur Halal Bersama",
    title: "Sentra Cloud Kitchen Halal & Kurir Berkah Eks-Retail",
    beneficiariesCount: 34,
    totalFundDisbursed: 320000000,
    jobsCreated: 42,
    monthlyTurnover: 85000000,
    leadPartner: "Koperasi Syariah Al-Hikmah Kemayoran",
    contactPerson: "Ustadz H. Rahmat Hidayat",
    phone: "+62 812-9901-4432",
    address: "Jl. Utan Panjang III No. 12, Kemayoran, Jakarta Pusat",
    coreCommodity: "Paket Catering Bento Halal, Nasi Kebuli & Snack Box Syariah",
    description: "Pemberdayaan 34 bapak & ibu mantan karyawan ritel swalayan memproduksi 450 paket makan siang higienis per hari untuk perkantoran dan sekolah.",
    impactStory: "Omset rata-rata meningkat dari Rp 0 saat PHK menjadi Rp 7,5 Jt/bulan per kepala keluarga.",
    greenImpact: "100% kemasan besek bambu ramah lingkungan & pemanfaatan jelantah menjadi lilin aroma terapi.",
    xPercent: 28.5,
    yPercent: 68.2,
  },
  {
    id: "LOC-BGR",
    cityName: "Bogor & Cibinong",
    province: "Jawa Barat",
    region: "Jawa",
    category: "maggot-aquaponik",
    categoryLabel: "Sentra Maggot & Aquaponik",
    title: "Klaster Budidaya Maggot BSF & Sayur Aquaponik Masjid",
    beneficiariesCount: 28,
    totalFundDisbursed: 245000000,
    jobsCreated: 36,
    monthlyTurnover: 62000000,
    leadPartner: "Yayasan Eco-Pesantren Al-Barakah",
    contactPerson: "Ir. Ahmad Fauzi",
    phone: "+62 813-8821-7650",
    address: "Kompleks Masjid Eco-Green Al-Barakah, Cibinong, Kab. Bogor",
    coreCommodity: "Pakan Pelet Maggot Kering, Sayur Selada Hidroponik & Lele Organik",
    description: "Mengolah 2,5 ton limbah organik pasar tradisional per minggu menjadi pakan ikan berprotein 45% dan pupuk kasgot premium.",
    impactStory: "Dipimpin teknisi mantan pabrik otomotif membina 27 rekan seprofesi korban PHK mandiri pakan ikan.",
    greenImpact: "Mereduksi 10 ton timbunan sampah organik per bulan dari TPA Galuga Bogor.",
    xPercent: 29.2,
    yPercent: 71.0,
  },
  {
    id: "LOC-BDG",
    cityName: "Bandung & Cimahi",
    province: "Jawa Barat",
    region: "Jawa",
    category: "green-coop",
    categoryLabel: "Koperasi Hijau",
    title: "Bank Sampah Berkah & Kriya Upcycling Tekstil-Plastik",
    beneficiariesCount: 26,
    totalFundDisbursed: 260000000,
    jobsCreated: 34,
    monthlyTurnover: 78000000,
    leadPartner: "Koperasi Sirkular Priangan Mandiri",
    contactPerson: "Ibu Siti Rohmah, S.E.",
    phone: "+62 856-4321-9988",
    address: "Jl. Terusan Buah Batu No. 88, Bojongsoang, Bandung",
    coreCommodity: "Paving Block Plastik Daur Ulang, Tote Bag Modis & Sajadah Perca",
    description: "Mengolah limbah kantong kresek dan perca tekstil pabrik Majalaya menjadi produk fungsional bernilai jual tinggi.",
    impactStory: "Memberdayakan 26 mantan buruh jahit garmen dengan bagi hasil koperasi di atas UMK Jawa Barat.",
    greenImpact: "Mendaur ulang 1,8 ton plastik dan 800 kg perca per bulan dengan tabungan emas infaq warga.",
    xPercent: 31.8,
    yPercent: 72.8,
  },
  {
    id: "LOC-CRB",
    cityName: "Cirebon",
    province: "Jawa Barat",
    region: "Jawa",
    category: "unit-mandiri",
    categoryLabel: "Unit Usaha Mandiri",
    title: "Sentra Olahan Hasil Laut & Pengeringan Ikan Surya Higienis",
    beneficiariesCount: 16,
    totalFundDisbursed: 140000000,
    jobsCreated: 21,
    monthlyTurnover: 48000000,
    leadPartner: "Paguyuban Nelayan & Buruh Pantai Utara",
    contactPerson: "Pak Kusnadi",
    phone: "+62 819-0988-7711",
    address: "Kawasan Pesisir Kejawanan, Lemahwungkuk, Kota Cirebon",
    coreCommodity: "Ikan Teri Nasi Surya, Terasi Udang Rebon Organik & Abon Cumi",
    description: "Peralatan solar dryer dome bebas lalat dan abu jalanan untuk meningkatkan higienitas olahan ikan asin tradisional.",
    impactStory: "Nilai jual ikan asin naik 60% dan seluruh nelayan bebas dari jeratan rentenir bakul.",
    greenImpact: "100% energi pengeringan tenaga surya tanpa bahan bakar solar atau minyak tanah.",
    xPercent: 34.6,
    yPercent: 70.4,
  },

  // --- JAWA TENGAH & DIY ---
  {
    id: "LOC-SMG",
    cityName: "Semarang",
    province: "Jawa Tengah",
    region: "Jawa",
    category: "green-coop",
    categoryLabel: "Koperasi Hijau",
    title: "Konsorsium Pengadaan Bersama Bahan Pokok Sembako & Kurir EV",
    beneficiariesCount: 30,
    totalFundDisbursed: 310000000,
    jobsCreated: 38,
    monthlyTurnover: 120000000,
    leadPartner: "Koperasi B2B Umat Jateng",
    contactPerson: "Bambang Triyono",
    phone: "+62 812-2244-5566",
    address: "Kawasan Pergudangan Genuk Indah Blok B-4, Semarang",
    coreCommodity: "Beras Organik Mentik Wangi, Minyak Goreng Kelapa & Gula Semut",
    description: "Hub distribusi pasokan pangan pokok langsung dari petani ke 110 warung kelontong binaan tanpa perantara tengkulak.",
    impactStory: "Memangkas harga beli warung hingga 18%, marjin laba pedagang naik dan harga jual ke warga lebih murah.",
    greenImpact: "Distribusi lokal menggunakan 8 unit armada motor listrik roda tiga ramah lingkungan.",
    xPercent: 37.8,
    yPercent: 71.8,
  },
  {
    id: "LOC-SLO",
    cityName: "Solo & Sukoharjo",
    province: "Jawa Tengah",
    region: "Jawa",
    category: "unit-mandiri",
    categoryLabel: "Unit Usaha Mandiri",
    title: "Kumbung Jamur Tiram Organik & Sentra Olahan Keripik",
    beneficiariesCount: 22,
    totalFundDisbursed: 205000000,
    jobsCreated: 28,
    monthlyTurnover: 54000000,
    leadPartner: "Kelompok Tani Barakah Hijau",
    contactPerson: "Suradi Joyo",
    phone: "+62 878-3655-4321",
    address: "Desa Bekonang, Kec. Mojolaban, Sukoharjo, Jawa Tengah",
    coreCommodity: "Jamur Tiram Segar, Baglog Bibit F2, Keripik Jamur Crispy Halal",
    description: "3 sentra rumah kumbung 18.000 baglog serbuk kayu sengon dengan panen harian 100-140 kg jamur tiram putih segar.",
    impactStory: "Didirikan 6 alumni PHK garmen tekstil Solo yang kini mandiri menghidupi puluhan buruh harian.",
    greenImpact: "Zero chemical waste dan memanfaatkan limbah serbuk gergaji mebel kayu jati lokal.",
    xPercent: 39.5,
    yPercent: 73.5,
  },
  {
    id: "LOC-YOG",
    cityName: "Yogyakarta",
    province: "D.I. Yogyakarta",
    region: "Jawa",
    category: "unit-mandiri",
    categoryLabel: "Unit Usaha Mandiri",
    title: "Hub Freelance Syariah & Ta'awun Agensi Digital Mandiri",
    beneficiariesCount: 19,
    totalFundDisbursed: 165000000,
    jobsCreated: 26,
    monthlyTurnover: 92000000,
    leadPartner: "Komunitas Muamalah Digital Nusantara",
    contactPerson: "Fikri Ramadhan, S.Kom.",
    phone: "+62 813-9090-1234",
    address: "Jl. Kaliurang KM 9, Sinduharjo, Sleman, Yogyakarta",
    coreCommodity: "Jasa Website UMKM Halal, Branding Kemasan, & Software Kasir Syariah",
    description: "Coworking space dan penyediaan perangkat komputasi bagi 19 programmer & desainer grafis korban PHK startup teknologi.",
    impactStory: "Telah mendigitalkan 85 UMKM syariah di Jogja-Solo dengan skema akad ijarah dan barter jasa.",
    greenImpact: "Operasional 100% paperless dan didukung PLTS atap surya 2.200 Wp.",
    xPercent: 38.0,
    yPercent: 74.8,
  },

  // --- JAWA TIMUR ---
  {
    id: "LOC-SBY",
    cityName: "Surabaya & Sidoarjo",
    province: "Jawa Timur",
    region: "Jawa",
    category: "dapur-halal",
    categoryLabel: "Dapur Halal Bersama",
    title: "Sentra Cloud Kitchen Halal & Katering Rumah Sakit Islam",
    beneficiariesCount: 33,
    totalFundDisbursed: 340000000,
    jobsCreated: 44,
    monthlyTurnover: 110000000,
    leadPartner: "Sentra Kuliner Kaffah Berkah Jatim",
    contactPerson: "Hj. Endang Sulastri",
    phone: "+62 811-3344-900",
    address: "Jl. Rungkut Industri III No. 25, Surabaya, Jawa Timur",
    coreCommodity: "Diet Catering Halal Pasien, Roti Gandum & Sari Kedelai Non-GMO",
    description: "Fasilitas dapur bersama standar BPOM dan Halal MUI yang memasok menu makanan sehat untuk RS Islam dan klinik terdekat.",
    impactStory: "Menyerap 33 mantan staf pabrik plastik dan katering hotel yang sempat menganggur berbulan-bulan.",
    greenImpact: "Program porsi presisi anti-mubazir dan minyak goreng kelapa bersertifikasi RSPO.",
    xPercent: 44.0,
    yPercent: 72.0,
  },
  {
    id: "LOC-MLG",
    cityName: "Malang & Batu",
    province: "Jawa Timur",
    region: "Jawa",
    category: "wakaf-produktif",
    categoryLabel: "Wakaf Produktif Aset",
    title: "Kebun Apel & Sayur Organik Terintegrasi Pupuk Hayati",
    beneficiariesCount: 24,
    totalFundDisbursed: 280000000,
    jobsCreated: 31,
    monthlyTurnover: 70000000,
    leadPartner: "Koperasi Tani Pesantren Al-Fattah",
    contactPerson: "Gus Muhsin Al-Banjari",
    phone: "+62 821-4155-6677",
    address: "Desa Bumiaji, Kec. Bumiaji, Kota Batu, Jawa Timur",
    coreCommodity: "Apel Manalagi Organik, Sari Apel Bebas Gula Biang & Sayur Dataran Tinggi",
    description: "Aset tanah wakaf produktif seluas 4,2 hektar dikelola bersama petani eks-buruh musiman dengan sistem bagi hasil adil.",
    impactStory: "Memulihkan kesuburan tanah pegunungan dan menjamin dividen rutin untuk beasiswa santri yatim dhuafa.",
    greenImpact: "Konservasi sumber resapan air Brantas dan 100% bebas pestisida kimia sintetis.",
    xPercent: 43.5,
    yPercent: 74.5,
  },

  // --- SUMATERA ---
  {
    id: "LOC-MDN",
    cityName: "Medan & Deli Serdang",
    province: "Sumatera Utara",
    region: "Sumatera",
    category: "green-coop",
    categoryLabel: "Koperasi Hijau",
    title: "Armada Gerobak Kopi & Roti Tenaga Surya (Solar Food Cart)",
    beneficiariesCount: 18,
    totalFundDisbursed: 180000000,
    jobsCreated: 24,
    monthlyTurnover: 52000000,
    leadPartner: "Generasi Hijau Berdaya Medan",
    contactPerson: "Zulkifli Lubis",
    phone: "+62 813-7500-1122",
    address: "Jl. Brigjend Katamso No. 104, Medan Maimun, Kota Medan",
    coreCommodity: "Kopi Arabika Sidikalang, Roti Canai Gandum & Teh Tarik Organik",
    description: "18 unit gerobak kuliner modern beratap solar cell 200Wp beroperasi mandiri tanpa perlu menyewa sambungan listrik PLN pinggir jalan.",
    impactStory: "Penjualan rata-rata 75 cup kopi per gerobak per hari menghasilkan laba bersih Rp 4,5 Jt per pedagang.",
    greenImpact: "Bebas polusi asap genset dan menggunakan cup kertas daur ulang bersertifikasi FSC.",
    xPercent: 12.5,
    yPercent: 28.5,
  },
  {
    id: "LOC-PDG",
    cityName: "Padang & Bukittinggi",
    province: "Sumatera Barat",
    region: "Sumatera",
    category: "dapur-halal",
    categoryLabel: "Dapur Halal Bersama",
    title: "Sentra Rendang Kemasan Vacuum & Bumbu Alami Minang",
    beneficiariesCount: 16,
    totalFundDisbursed: 155000000,
    jobsCreated: 22,
    monthlyTurnover: 65000000,
    leadPartner: "Koperasi Muslimah Mandiri Ranah Minang",
    contactPerson: "Uni Yuliana Tanjung",
    phone: "+62 852-6300-8899",
    address: "Kawasan Pasar Bawah, Bukittinggi, Sumatera Barat",
    coreCommodity: "Rendang Daging Sapi Suwir, Rendang Jamur Vegan & Sambal Ijo Padang",
    description: "Sentra olahan masakan Minang terstandarisasi sterilisasi retort steril tanpa pengawet sintesis kimia dengan masa simpan 1 tahun.",
    impactStory: "Tembus pasar oleh-oleh jamaah umrah dan ekspor halal food ke Malaysia dan Singapura.",
    greenImpact: "Kayu bakar digantikan briket biomassa tempurung kelapa hemat asap dan limbah minyak diolah.",
    xPercent: 16.0,
    yPercent: 44.0,
  },
  {
    id: "LOC-PLB",
    cityName: "Palembang",
    province: "Sumatera Selatan",
    region: "Sumatera",
    category: "unit-mandiri",
    categoryLabel: "Unit Usaha Mandiri",
    title: "Sentra Pempek Ikan Patin Bioflok & Cuka Organik Gula Aren",
    beneficiariesCount: 14,
    totalFundDisbursed: 135000000,
    jobsCreated: 18,
    monthlyTurnover: 42000000,
    leadPartner: "Paguyuban Usaha Mandiri Musi",
    contactPerson: "M. Ridwan Syahputra",
    phone: "+62 821-7899-4455",
    address: "Jl. KH. Azhari 7 Ulu, Seberang Ulu I, Palembang",
    coreCommodity: "Pempek Lenjer & Kapal Selam Patin Segar, Cuko Kental Gula Batok Aren",
    description: "Integrasi kolam bioflok pembesaran ikan patin air tawar dengan bengkel pembuatan pempek bebas pemutih dan bebas boraks.",
    impactStory: "14 pemuda korban pengurangan karyawan subkontraktor kini punya gerai pempek mandiri.",
    greenImpact: "Air endapan kolam dialirkan menjadi pupuk tanaman cabai rawit dan daun bawang pekarangan.",
    xPercent: 22.5,
    yPercent: 54.0,
  },
  {
    id: "LOC-ACH",
    cityName: "Banda Aceh & Aceh Besar",
    province: "Aceh",
    region: "Sumatera",
    category: "green-coop",
    categoryLabel: "Koperasi Hijau",
    title: "Penyulingan Minyak Nilam Atsiri & Parfum Sunnah Bebas Alkohol",
    beneficiariesCount: 12,
    totalFundDisbursed: 110000000,
    jobsCreated: 16,
    monthlyTurnover: 38000000,
    leadPartner: "Baitul Mal & Koperasi Serambi Berkah",
    contactPerson: "Teuku Iskandar Muda",
    phone: "+62 853-6011-2233",
    address: "Kecamatan Darul Imarah, Kab. Aceh Besar, Aceh",
    coreCommodity: "Minyak Nilam Grade-A (Patchouli Oil), Sabun Mandi Herbal & Parfum Attar",
    description: "Penyulingan uap daun nilam segar hasil kebun rakyat dengan ketel stainless standar farmasi internasional.",
    impactStory: "Petani binaan menerima harga beli stabil Rp 650.000/kg minyak nilam tanpa potongan calo.",
    greenImpact: "Ampas sisa sulingan nilam difermentasi menjadi kompos organik penangkal jamur tanaman.",
    xPercent: 8.5,
    yPercent: 18.0,
  },

  // --- KALIMANTAN ---
  {
    id: "LOC-BPN",
    cityName: "Balikpapan & Penajam (IKN)",
    province: "Kalimantan Timur",
    region: "Kalimantan",
    category: "green-coop",
    categoryLabel: "Koperasi Hijau",
    title: "Sentra Upcycling Kayu Palet Pelabuhan & Mebel Ramah Lingkungan",
    beneficiariesCount: 14,
    totalFundDisbursed: 145000000,
    jobsCreated: 20,
    monthlyTurnover: 58000000,
    leadPartner: "Koperasi Tukang Kayu Syariah Kaltim",
    contactPerson: "H. Danang Prasetyo",
    phone: "+62 812-5400-3322",
    address: "Jl. Soekarno-Hatta KM 13, Balikpapan Utara, Kalimantan Timur",
    coreCommodity: "Meja Belajar Santri, Rak Display Toko & Dekorasi Interior Ramah Lingkungan",
    description: "Mengolah limbah peti kemas kayu pinus pelabuhan Semayang menjadi mebel minimalis untuk perkantoran dan sekolah.",
    impactStory: "14 tukang kayu eks-pabrik plywood kembali bekerja produktif dengan pendapatan rata-rata Rp 5,8 Jt/bulan.",
    greenImpact: "Menyelamatkan ribuan kubik kayu hutan alami melalui daur ulang kayu palet peti kemas.",
    xPercent: 49.5,
    yPercent: 47.0,
  },
  {
    id: "LOC-BJM",
    cityName: "Banjarmasin & Banjarbaru",
    province: "Kalimantan Selatan",
    region: "Kalimantan",
    category: "dapur-halal",
    categoryLabel: "Dapur Halal Bersama",
    title: "Pasar Kuliner Halal Terapung & Olahan Ikan Baung Rawa",
    beneficiariesCount: 15,
    totalFundDisbursed: 130000000,
    jobsCreated: 19,
    monthlyTurnover: 45000000,
    leadPartner: "Sentra Muamalah Martapura Berkah",
    contactPerson: "Hj. Noor Laila",
    phone: "+62 813-4800-7766",
    address: "Dermaga Pasar Terapung Lok Baintan, Kab. Banjar, Kalsel",
    coreCommodity: "Soto Banjar Rempah Asli, Ikan Baung Asap & Wadai Tradisional Banjar",
    description: "15 unit jukung kuliner higienis berstandar halal melayani wisatawan sungai dengan sistem barcode QRIS syariah.",
    impactStory: "Menyerap kembali tenaga kerja pariwisata yang sempat terkena pengurangan pekerja hotel.",
    greenImpact: "Gerakan zero single-use plastic di sepanjang aliran sungai Martapura.",
    xPercent: 46.5,
    yPercent: 57.0,
  },
  {
    id: "LOC-PTK",
    cityName: "Pontianak & Kubu Raya",
    province: "Kalimantan Barat",
    region: "Kalimantan",
    category: "maggot-aquaponik",
    categoryLabel: "Sentra Maggot & Aquaponik",
    title: "Kebun Lidah Buaya Organik (Aloe Vera) & Minuman Segar Alami",
    beneficiariesCount: 11,
    totalFundDisbursed: 95000000,
    jobsCreated: 15,
    monthlyTurnover: 32000000,
    leadPartner: "Kelompok Tani Khatulistiwa Mandiri",
    contactPerson: "Dedi Suhendra",
    phone: "+62 857-5000-8811",
    address: "Siantan Hulu, Kec. Pontianak Utara, Kota Pontianak",
    coreCommodity: "Minuman Jeli Aloe Vera Segar, Dodol Lidah Buaya & Gel Perawatan Kulit",
    description: "Pemanfaatan pekarangan tanah gambut terlindungi untuk budidaya lidah buaya raksasa tanpa pupuk kimia.",
    impactStory: "Memberdayakan 11 eks-buruh sawit mandiri memproduksi minuman sari lidah buaya kemasan.",
    greenImpact: "Konservasi air tanah gambut dan penghijauan kawasan perkotaan khatulistiwa.",
    xPercent: 36.5,
    yPercent: 44.0,
  },

  // --- SULAWESI ---
  {
    id: "LOC-MKS",
    cityName: "Makassar & Gowa",
    province: "Sulawesi Selatan",
    region: "Sulawesi",
    category: "unit-mandiri",
    categoryLabel: "Unit Usaha Mandiri",
    title: "Sentra Rumput Laut Halal & Ikan Kering Solar Dryer Dome",
    beneficiariesCount: 18,
    totalFundDisbursed: 175000000,
    jobsCreated: 24,
    monthlyTurnover: 68000000,
    leadPartner: "Koperasi Nelayan Syariah Barombong",
    contactPerson: "Dg. Sitaba",
    phone: "+62 811-4100-9988",
    address: "Kawasan Pesisir Barombong, Kec. Tamalate, Kota Makassar",
    coreCommodity: "Rumput Laut Gracilaria Kering, Ikan Sunu Kering Higienis & Kerupuk Karang",
    description: "Pembangunan kubah pengering surya (Solar Dome) untuk menjaga higienitas rumput laut dari kontaminasi debu pantai.",
    impactStory: "Kualitas rumput laut naik kelas standar ekspor, pendapatan nelayan melonjak 45%.",
    greenImpact: "Pengeringan higienis tanpa menggunakan kayu bakar hutan bakau pesisir.",
    xPercent: 57.0,
    yPercent: 62.0,
  },
  {
    id: "LOC-MND",
    cityName: "Manado & Tomohon",
    province: "Sulawesi Utara",
    region: "Sulawesi",
    category: "green-coop",
    categoryLabel: "Koperasi Hijau",
    title: "Pabrik Mini Virgin Coconut Oil (VCO) Halal & Briket Tempurung",
    beneficiariesCount: 12,
    totalFundDisbursed: 105000000,
    jobsCreated: 16,
    monthlyTurnover: 41000000,
    leadPartner: "Koperasi Nyiur Melambai Sejahtera",
    contactPerson: "Ferry Pontoh",
    phone: "+62 813-4000-5544",
    address: "Jl. Raya Tomohon-Manado KM 8, Kota Tomohon, Sulut",
    coreCommodity: "Minyak VCO Fermentasi Dingin, Sabun Kelapa Alami & Briket Arang Shisha",
    description: "Unit pengolahan kelapa segar metode sentrifugasi dingin tanpa pemanasan kimia berkhasiat suplemen kesehatan.",
    impactStory: "12 mantan staf kargo logistik kini mengelola rantai pasok kelapa dari 40 petani pedalaman Minahasa.",
    greenImpact: "Zero waste: tempurung jadi briket arang, sabut kelapa jadi media tanam cocopeat.",
    xPercent: 64.0,
    yPercent: 29.0,
  },

  // --- BALI & NUSA TENGGARA ---
  {
    id: "LOC-DPS",
    cityName: "Denpasar & Kuta",
    province: "Bali",
    region: "Bali-Nusra",
    category: "dapur-halal",
    categoryLabel: "Dapur Halal Bersama",
    title: "Sentra Katering Halal Wisatawan Muslim & Bekal Sehat",
    beneficiariesCount: 13,
    totalFundDisbursed: 115000000,
    jobsCreated: 17,
    monthlyTurnover: 50000000,
    leadPartner: "Paguyuban Pengusaha Muslim Bali Berdaya",
    contactPerson: "H. Syamsul Bahri",
    phone: "+62 818-0500-2211",
    address: "Jl. Imam Bonjol No. 198, Pemecutan Klod, Denpasar Barat",
    coreCommodity: "Nasi Kotak Halal Tour, Ayam Betutu Halal Rempah Organik & Sambal Matah",
    description: "Menyediakan makanan halal terverifikasi resmi untuk rombongan wisata domestik dan mancanegara.",
    impactStory: "Membantu 13 pramuwisata & sopir travel terdampak pandemi kembali stabil berpenghasilan.",
    greenImpact: "Bekerjasama dengan bank sampah setempat memilah seluruh sisa organik untuk maggot.",
    xPercent: 49.0,
    yPercent: 77.0,
  },
  {
    id: "LOC-LOP",
    cityName: "Mataram & Lombok Barat",
    province: "Nusa Tenggara Barat",
    region: "Bali-Nusra",
    category: "maggot-aquaponik",
    categoryLabel: "Sentra Maggot & Aquaponik",
    title: "Sentra Daun Kelor (Moringa) Organik & Kolam Bioflok Nila",
    beneficiariesCount: 15,
    totalFundDisbursed: 130000000,
    jobsCreated: 20,
    monthlyTurnover: 43000000,
    leadPartner: "Pondok Pemberdayaan Umat Sasak",
    contactPerson: "Tuan Guru H. Lalu Syarif",
    phone: "+62 878-6400-9900",
    address: "Desa Gunung Sari, Kec. Gunungsari, Lombok Barat, NTB",
    coreCommodity: "Kapsul Teh Daun Kelor Organik, Tepung Kelor & Ikan Nila Merah Bioflok",
    description: "Perkebunan kelor organik kaya nutrisi dipadukan dengan 12 kolam terpal bulat bioflok hemat air.",
    impactStory: "Menyerap 15 mantan buruh tambang dan buruh migran yang pulang ke tanah air.",
    greenImpact: "Pohon kelor menyuburkan lahan kritis dan menyerap emisi karbon tinggi.",
    xPercent: 52.5,
    yPercent: 78.0,
  },

  // --- MALUKU & PAPUA ---
  {
    id: "LOC-AMB",
    cityName: "Ambon & Pulau Buru",
    province: "Maluku",
    region: "Maluku-Papua",
    category: "green-coop",
    categoryLabel: "Koperasi Hijau",
    title: "Koperasi Rempah Pala, Cengkeh & Minyak Kayu Putih Murni",
    beneficiariesCount: 10,
    totalFundDisbursed: 90000000,
    jobsCreated: 14,
    monthlyTurnover: 35000000,
    leadPartner: "Koperasi Rempah Berkah Maluku",
    contactPerson: "Usman Pattimura",
    phone: "+62 822-4800-1177",
    address: "Kawasan Pesisir Hitu, Kec. Leihitu, Kab. Maluku Tengah",
    coreCommodity: "Biji Pala Super, Fuli Mawar, Cengkeh Kering & Minyak Kayu Putih Buru",
    description: "Pengemasan vakum dan sertifikasi keaslian minyak kayu putih alami warisan bumi Maluku.",
    impactStory: "10 pemuda pelaut lokal kini menjadi entrepreneur rempah nusantara dengan omset stabil.",
    greenImpact: "Konservasi pohon pala pusaka dan pencegahan pembalakan hutan adat.",
    xPercent: 76.0,
    yPercent: 52.0,
  },
  {
    id: "LOC-JYP",
    cityName: "Jayapura & Keerom",
    province: "Papua",
    region: "Maluku-Papua",
    category: "unit-mandiri",
    categoryLabel: "Unit Usaha Mandiri",
    title: "Sentra Pengolahan Sagu Higienis & Keripik Keladi Bebas Gluten",
    beneficiariesCount: 8,
    totalFundDisbursed: 80000000,
    jobsCreated: 11,
    monthlyTurnover: 28000000,
    leadPartner: "Baitul Maal Cendrawasih Mandiri",
    contactPerson: "Muhammad Rumagesan",
    phone: "+62 812-4899-7700",
    address: "Distrik Sentani Timur, Kab. Jayapura, Papua",
    coreCommodity: "Tepung Sagu Basah Higienis, Keripik Keladi Balado & Sinole Manis",
    description: "Modernisasi mesin pemarut dan pemeras sagu higienis sebagai pangan lokal bergizi pengganti terigu.",
    impactStory: "8 eks-buruh logistik pelabuhan Jayapura kini menjadi produsen sagu kemasan terlaris di pasar lokal.",
    greenImpact: "Melestarikan hutan sagu alami sebagai benteng ketahanan pangan nusantara.",
    xPercent: 91.0,
    yPercent: 50.0,
  },
];

interface IndonesiaInteractiveDistributionMapProps {
  onOpenApplyModal?: () => void;
  onSelectLocation?: (location: BeneficiaryLocation) => void;
}

export const IndonesiaInteractiveDistributionMap: React.FC<IndonesiaInteractiveDistributionMapProps> = ({
  onOpenApplyModal,
  onSelectLocation,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeLocation, setActiveLocation] = useState<BeneficiaryLocation | null>(
    BENEFICIARY_LOCATIONS[0]
  );
  const [hoveredLocation, setHoveredLocation] = useState<BeneficiaryLocation | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [zoomRegion, setZoomRegion] = useState<string>("all");

  // Currency Formatter
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Filter Locations
  const filteredLocations = useMemo(() => {
    return BENEFICIARY_LOCATIONS.filter((loc) => {
      const matchRegion = selectedRegion === "all" || loc.region === selectedRegion;
      const matchCategory = selectedCategory === "all" || loc.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        loc.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.leadPartner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.coreCommodity.toLowerCase().includes(searchQuery.toLowerCase());

      return matchRegion && matchCategory && matchSearch;
    });
  }, [selectedRegion, selectedCategory, searchQuery]);

  // Aggregate Stats
  const stats = useMemo(() => {
    const totalBeneficiaries = BENEFICIARY_LOCATIONS.reduce(
      (sum, l) => sum + l.beneficiariesCount,
      0
    );
    const totalDisbursed = BENEFICIARY_LOCATIONS.reduce(
      (sum, l) => sum + l.totalFundDisbursed,
      0
    );
    const totalJobs = BENEFICIARY_LOCATIONS.reduce((sum, l) => sum + l.jobsCreated, 0);
    const totalTurnover = BENEFICIARY_LOCATIONS.reduce((sum, l) => sum + l.monthlyTurnover, 0);
    const totalCities = BENEFICIARY_LOCATIONS.length;

    return {
      totalBeneficiaries,
      totalDisbursed,
      totalJobs,
      totalTurnover,
      totalCities,
    };
  }, []);

  const getMarkerColor = (category: BeneficiaryLocation["category"]) => {
    switch (category) {
      case "green-coop":
        return {
          bg: "bg-emerald-600",
          border: "border-emerald-200",
          ring: "ring-emerald-400",
          text: "text-emerald-700",
          badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
          icon: Leaf,
        };
      case "unit-mandiri":
        return {
          bg: "bg-amber-500",
          border: "border-amber-200",
          ring: "ring-amber-400",
          text: "text-amber-700",
          badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
          icon: Coins,
        };
      case "dapur-halal":
        return {
          bg: "bg-teal-600",
          border: "border-teal-200",
          ring: "ring-teal-400",
          text: "text-teal-700",
          badgeBg: "bg-teal-100 text-teal-900 border-teal-300",
          icon: Utensils,
        };
      case "maggot-aquaponik":
        return {
          bg: "bg-lime-600",
          border: "border-lime-200",
          ring: "ring-lime-400",
          text: "text-lime-700",
          badgeBg: "bg-lime-100 text-lime-900 border-lime-300",
          icon: Bug,
        };
      case "wakaf-produktif":
        return {
          bg: "bg-indigo-600",
          border: "border-indigo-200",
          ring: "ring-indigo-400",
          text: "text-indigo-700",
          badgeBg: "bg-indigo-100 text-indigo-900 border-indigo-300",
          icon: Building2,
        };
      default:
        return {
          bg: "bg-emerald-600",
          border: "border-emerald-200",
          ring: "ring-emerald-400",
          text: "text-emerald-700",
          badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
          icon: MapPin,
        };
    }
  };

  return (
    <div
      id="peta-sebaran-penerima-manfaat"
      className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden space-y-0 transition-all"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-950 p-6 sm:p-8 text-white relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span>Peta Sebaran Nasional Terverifikasi • 18 Titik Sentra Nusantara</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight">
              Peta Sebaran Koperasi Hijau & Unit Usaha Mandiri
            </h2>
            <p className="text-emerald-100/85 text-xs sm:text-sm leading-relaxed">
              Pantau titik-titik sebaran sentra usaha mandiri, koperasi hijau bebas riba, dapur halal bersama,
              klaster budidaya maggot BSF, dan aset wakaf produktif binaan <strong>IslamiCity Global</strong> dari Aceh hingga Papua.
            </p>
          </div>

          {/* Aggregate Metrics in Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-center p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <div className="text-[10px] text-slate-400 font-medium">Titik Sentra</div>
              <div className="text-base font-bold text-amber-300">{stats.totalCities} Wilayah</div>
            </div>
            <div className="text-center p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <div className="text-[10px] text-slate-400 font-medium">Penerima Binaan</div>
              <div className="text-base font-bold text-emerald-300">{stats.totalBeneficiaries} UMKM</div>
            </div>
            <div className="text-center p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <div className="text-[10px] text-slate-400 font-medium">Dana Bergulir</div>
              <div className="text-base font-bold text-teal-300">Rp 3,18 M+</div>
            </div>
            <div className="text-center p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <div className="text-[10px] text-slate-400 font-medium">Tenaga Kerja</div>
              <div className="text-base font-bold text-lime-300">{stats.totalJobs} Pekerja</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              Semua Sentra ({BENEFICIARY_LOCATIONS.length})
            </button>
            <button
              onClick={() => setSelectedCategory("green-coop")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === "green-coop"
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-50"
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-500" />
              <span>Koperasi Hijau</span>
            </button>
            <button
              onClick={() => setSelectedCategory("unit-mandiri")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === "unit-mandiri"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-white text-amber-900 border border-amber-200 hover:bg-amber-50"
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>Unit Usaha Mandiri</span>
            </button>
            <button
              onClick={() => setSelectedCategory("dapur-halal")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === "dapur-halal"
                  ? "bg-teal-700 text-white shadow-xs"
                  : "bg-white text-teal-900 border border-teal-200 hover:bg-teal-50"
              }`}
            >
              <Utensils className="w-3.5 h-3.5 text-teal-500" />
              <span>Dapur Halal Bersama</span>
            </button>
            <button
              onClick={() => setSelectedCategory("maggot-aquaponik")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === "maggot-aquaponik"
                  ? "bg-lime-700 text-white shadow-xs"
                  : "bg-white text-lime-900 border border-lime-200 hover:bg-lime-50"
              }`}
            >
              <Bug className="w-3.5 h-3.5 text-lime-600" />
              <span>Maggot & Agribisnis</span>
            </button>
          </div>

          {/* Search Box & View Mode Toggle */}
          <div className="flex items-center gap-2">
            <div className="relative min-w-[200px] flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari kota, komoditas, atau mitra..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-300 text-xs focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white"
              />
            </div>

            <div className="flex bg-slate-200 p-0.5 rounded-xl shrink-0">
              <button
                onClick={() => setViewMode("map")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === "map"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Peta</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === "list"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Direktori ({filteredLocations.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Region Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-1 text-[11px] font-semibold text-slate-600 pt-1 border-t border-slate-200/80">
          <span className="text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter Pulau:
          </span>
          {[
            { id: "all", label: "Seluruh Nusantara" },
            { id: "Jawa", label: "Jawa (8 Sentra)" },
            { id: "Sumatera", label: "Sumatera (4 Sentra)" },
            { id: "Kalimantan", label: "Kalimantan (3 Sentra)" },
            { id: "Sulawesi", label: "Sulawesi (2 Sentra)" },
            { id: "Bali-Nusra", label: "Bali & Nusra (2 Sentra)" },
            { id: "Maluku-Papua", label: "Maluku & Papua (2 Sentra)" },
          ].map((reg) => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegion(reg.id)}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedRegion === reg.id
                  ? "bg-emerald-800 text-white font-bold shadow-xs"
                  : "hover:bg-slate-200 text-slate-700"
              }`}
            >
              {reg.label}
            </button>
          ))}

          {(selectedRegion !== "all" || selectedCategory !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedRegion("all");
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="ml-auto text-[10px] text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Stage */}
      {viewMode === "map" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Map Canvas Area (col-span-8) */}
          <div className="lg:col-span-8 p-4 sm:p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 relative overflow-hidden flex flex-col justify-between min-h-[480px]">
            {/* Ambient Lighting & Radar Grid */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
            <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Map Top Radar Status */}
            <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-emerald-200 font-semibold uppercase tracking-wider text-[11px]">
                  Archipelago Radar Monitor • Live Coordinates
                </span>
              </div>
              <div className="text-[11px] text-slate-300 hidden sm:flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Klik pin lokasi untuk inspeksi profil & kontak mitra</span>
              </div>
            </div>

            {/* SVG Interactive Map Container */}
            <div className="relative w-full aspect-[2.1/1] my-4 rounded-2xl bg-slate-900/80 border border-slate-800 p-2 sm:p-4 overflow-hidden shadow-2xl flex items-center justify-center select-none">
              {/* SVG Stylized Indonesia Archipelago Map */}
              <svg
                viewBox="0 0 1000 480"
                className="w-full h-full text-emerald-900/60 drop-shadow-md"
                fill="currentColor"
              >
                {/* Lat-Long Grid Lines */}
                <g className="opacity-15 stroke-emerald-500" strokeWidth="0.5" strokeDasharray="3,3">
                  <line x1="0" y1="120" x2="1000" y2="120" />
                  <line x1="0" y1="240" x2="1000" y2="240" />
                  <line x1="0" y1="360" x2="1000" y2="360" />
                  <line x1="250" y1="0" x2="250" y2="480" />
                  <line x1="500" y1="0" x2="500" y2="480" />
                  <line x1="750" y1="0" x2="750" y2="480" />
                </g>

                {/* SUMATERA */}
                <path
                  d="M60,110 Q90,90 120,130 Q160,200 200,280 Q220,320 240,360 Q220,370 190,320 Q140,250 100,180 Q60,140 60,110 Z"
                  className="fill-emerald-800/40 hover:fill-emerald-700/60 transition-colors cursor-pointer"
                  onClick={() => setSelectedRegion("Sumatera")}
                />
                {/* JAWA & MADURA */}
                <path
                  d="M260,375 Q320,370 380,380 Q450,385 520,380 Q530,370 510,365 Q440,365 370,360 Q280,360 260,375 Z"
                  className="fill-emerald-800/40 hover:fill-emerald-700/60 transition-colors cursor-pointer"
                  onClick={() => setSelectedRegion("Jawa")}
                />
                {/* KALIMANTAN */}
                <path
                  d="M340,160 Q400,130 460,150 Q520,170 530,240 Q510,310 440,320 Q370,300 340,240 Q330,190 340,160 Z"
                  className="fill-emerald-800/40 hover:fill-emerald-700/60 transition-colors cursor-pointer"
                  onClick={() => setSelectedRegion("Kalimantan")}
                />
                {/* SULAWESI */}
                <path
                  d="M550,180 Q590,140 620,170 Q600,210 570,220 Q610,250 630,290 Q600,310 570,270 Q550,290 540,350 Q530,320 540,260 Q530,220 550,180 Z"
                  className="fill-emerald-800/40 hover:fill-emerald-700/60 transition-colors cursor-pointer"
                  onClick={() => setSelectedRegion("Sulawesi")}
                />
                {/* BALI & NUSA TENGGARA */}
                <path
                  d="M530,385 Q560,385 600,390 Q650,395 700,390 Q680,405 620,400 Q560,395 530,385 Z"
                  className="fill-emerald-800/40 hover:fill-emerald-700/60 transition-colors cursor-pointer"
                  onClick={() => setSelectedRegion("Bali-Nusra")}
                />
                {/* MALUKU */}
                <path
                  d="M720,220 Q750,210 760,250 Q730,280 720,240 Z M730,300 Q760,310 740,340 Q710,330 730,300 Z"
                  className="fill-emerald-800/40 hover:fill-emerald-700/60 transition-colors cursor-pointer"
                  onClick={() => setSelectedRegion("Maluku-Papua")}
                />
                {/* PAPUA */}
                <path
                  d="M800,220 Q840,190 890,210 Q940,240 960,300 Q950,360 880,370 Q830,360 810,310 Q830,280 790,260 Q780,230 800,220 Z"
                  className="fill-emerald-800/40 hover:fill-emerald-700/60 transition-colors cursor-pointer"
                  onClick={() => setSelectedRegion("Maluku-Papua")}
                />
              </svg>

              {/* Interactive Location Markers */}
              {filteredLocations.map((loc) => {
                const colorInfo = getMarkerColor(loc.category);
                const isSelected = activeLocation?.id === loc.id;
                const isHovered = hoveredLocation?.id === loc.id;
                const IconComp = colorInfo.icon;

                return (
                  <div
                    key={loc.id}
                    style={{
                      left: `${loc.xPercent}%`,
                      top: `${loc.yPercent}%`,
                    }}
                    onClick={() => {
                      setActiveLocation(loc);
                      if (onSelectLocation) onSelectLocation(loc);
                    }}
                    onMouseEnter={() => setHoveredLocation(loc)}
                    onMouseLeave={() => setHoveredLocation(null)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                  >
                    {/* Pulsing Ripple for Selected or Hovered */}
                    {(isSelected || isHovered) && (
                      <span
                        className={`absolute -inset-2.5 rounded-full ${colorInfo.bg} opacity-70 animate-ping pointer-events-none`}
                      ></span>
                    )}

                    {/* Marker Badge Pin */}
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-lg transition-all ${
                        colorInfo.bg
                      } text-white border-2 ${
                        isSelected
                          ? "scale-125 border-amber-300 ring-4 ring-amber-400/50 z-30"
                          : "border-white/90"
                      }`}
                    >
                      <IconComp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </motion.div>

                    {/* Floating City Label */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold whitespace-nowrap shadow-md pointer-events-none transition-all ${
                        isSelected
                          ? "bg-amber-400 text-slate-950 scale-105 z-30 font-black"
                          : "bg-slate-900/90 text-slate-200 border border-slate-700/80 group-hover:bg-slate-800"
                      }`}
                    >
                      {loc.cityName.split(" ")[0]}
                    </div>

                    {/* Rich Hover Popup Card */}
                    <AnimatePresence>
                      {isHovered && !isSelected && (
                        <motion.div
                          initial={{ opacity: 0, y: 5, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-emerald-500/60 shadow-2xl text-white text-[11px] space-y-1 z-40 pointer-events-none"
                        >
                          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                            <span className="text-[9px] font-extrabold uppercase text-amber-300">
                              {loc.categoryLabel}
                            </span>
                            <span className="text-[9px] text-slate-400">{loc.region}</span>
                          </div>
                          <div className="font-bold text-white text-xs leading-tight">
                            {loc.cityName}: {loc.title}
                          </div>
                          <div className="text-[10px] text-emerald-200 flex justify-between pt-1 border-t border-slate-800">
                            <span>{loc.beneficiariesCount} UMKM • +{loc.jobsCreated} Kerja</span>
                            <span className="font-bold text-amber-300">{formatIDR(loc.totalFundDisbursed)}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Map Legend */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
              <div className="flex flex-wrap items-center gap-3.5 text-[11px]">
                <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Koperasi Hijau
                </span>
                <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Unit Usaha Mandiri
                </span>
                <span className="flex items-center gap-1.5 text-teal-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span> Dapur Halal Bersama
                </span>
                <span className="flex items-center gap-1.5 text-lime-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-lime-600"></span> Maggot & Agribisnis
                </span>
                <span className="flex items-center gap-1.5 text-indigo-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> Wakaf Produktif
                </span>
              </div>

              <span className="text-slate-400 text-[10px]">
                Menampilkan <strong>{filteredLocations.length}</strong> titik sentra aktif
              </span>
            </div>
          </div>

          {/* Selected Location Detail Card (col-span-4) */}
          <div className="lg:col-span-4 p-6 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between space-y-4">
            {activeLocation ? (
              <div className="space-y-4">
                <div className="space-y-1.5 border-b border-slate-200 pb-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold border ${
                        getMarkerColor(activeLocation.category).badgeBg
                      }`}
                    >
                      {activeLocation.categoryLabel}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      Pulau {activeLocation.region}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif leading-tight">
                    {activeLocation.cityName}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {activeLocation.province} • Mitra: <strong>{activeLocation.leadPartner}</strong>
                  </p>
                </div>

                {/* Title & Core Description */}
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-emerald-900 leading-snug">
                    {activeLocation.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeLocation.description}
                  </p>
                </div>

                {/* Core Commodity Tag */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 space-y-1 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Komoditas & Produk Unggulan:
                  </span>
                  <div className="text-xs font-semibold text-emerald-900">
                    🌾 {activeLocation.coreCommodity}
                  </div>
                </div>

                {/* Impact KPIs Matrix */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-0.5">
                    <div className="text-[10px] text-slate-500 font-medium">Dana Bergulir</div>
                    <div className="text-sm font-extrabold text-emerald-700">
                      {formatIDR(activeLocation.totalFundDisbursed)}
                    </div>
                    <div className="text-[9px] text-slate-400">100% Bebas Riba</div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-0.5">
                    <div className="text-[10px] text-slate-500 font-medium">Penerima Binaan</div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {activeLocation.beneficiariesCount} UMKM
                    </div>
                    <div className="text-[9px] text-teal-600 font-semibold">
                      +{activeLocation.jobsCreated} Tenaga Kerja
                    </div>
                  </div>
                </div>

                {/* Stories & Green Impact */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Dampak Ekonomi & Ta'awun:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{activeLocation.impactStory}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/90 text-emerald-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-800 text-[11px]">
                      <Leaf className="w-3.5 h-3.5" />
                      <span>Dampak Ekologis & Sirkular:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{activeLocation.greenImpact}</p>
                  </div>
                </div>

                {/* Contact and Address */}
                <div className="p-3 rounded-xl bg-slate-100/90 border border-slate-200 text-slate-700 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-500">Penanggung Jawab:</span>
                    <strong className="text-slate-900">{activeLocation.contactPerson}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-500">Hotline / WhatsApp:</span>
                    <span className="font-mono text-emerald-700 font-bold">{activeLocation.phone}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Compass className="w-8 h-8 mx-auto text-slate-300 animate-spin" />
                <p className="text-xs">Pilih salah satu titik pin di peta untuk melihat detail sentra binaan.</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              {onOpenApplyModal && (
                <button
                  onClick={onOpenApplyModal}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Coins className="w-4 h-4 text-amber-300" />
                  <span>Ajukan Kemitraan & Modal Bebas Riba</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <p className="text-[10px] text-slate-500 text-center">
                Terintegrasi dengan Baitul Maal & Dewan Pengawas Syariah IslamiCity.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* List Directory View */
        <div className="p-6 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocations.map((loc) => {
              const colorInfo = getMarkerColor(loc.category);
              const IconComp = colorInfo.icon;
              const isSelected = activeLocation?.id === loc.id;

              return (
                <div
                  key={loc.id}
                  onClick={() => {
                    setActiveLocation(loc);
                    setViewMode("map");
                  }}
                  className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer hover:shadow-md flex flex-col justify-between space-y-3 ${
                    isSelected ? "border-emerald-500 ring-2 ring-emerald-200" : "border-slate-200"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${colorInfo.badgeBg}`}
                      >
                        {loc.categoryLabel}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">{loc.region}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm font-serif">{loc.cityName}</h4>
                    <p className="text-xs font-semibold text-emerald-800">{loc.title}</p>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{loc.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">Dana Bergulir:</span>
                      <strong className="text-emerald-700 font-bold">{formatIDR(loc.totalFundDisbursed)}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">Binaan / Kerja:</span>
                      <span className="text-slate-800 font-bold text-[11px]">
                        {loc.beneficiariesCount} UMKM (+{loc.jobsCreated} Pekerja)
                      </span>
                    </div>

                    <button
                      type="button"
                      className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-emerald-900 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Lihat di Peta Radar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
