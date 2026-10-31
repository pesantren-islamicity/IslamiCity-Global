import React, { useState, useMemo, useRef } from "react";
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
  Copy,
  Check,
  Navigation,
  SlidersHorizontal,
  Landmark,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface GeoImpactLocation {
  id: string;
  name: string;
  cityName: string;
  province: string;
  region: "Jawa" | "Sumatera" | "Kalimantan" | "Sulawesi" | "Bali-Nusra" | "Maluku-Papua";
  programType: "qardhul-hasan" | "green-coop" | "hybrid";
  category: "green-coop" | "qardhul-hasan" | "dapur-halal" | "maggot-aquaponik" | "wakaf-produktif";
  categoryLabel: string;
  latitude: number;
  longitude: number;
  dmsCoordinate: string;
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
}

// Bounds of Indonesia Archipelago for accurate Equirectangular Projection
const INDONESIA_GEO_BOUNDS = {
  minLng: 95.0,  // Sabang / Pulau Weh
  maxLng: 141.0, // Merauke
  minLat: -11.0, // Pulau Rote
  maxLat: 6.0,   // Pulau Rondo / Aceh Utara
};

export const GEO_IMPACT_LOCATIONS: GeoImpactLocation[] = [
  // --- JABODETABEK & JAWA BARAT ---
  {
    id: "GEO-JKT",
    name: "Sentra Cloud Kitchen Halal & Kurir Berkah Kemayoran",
    cityName: "Jakarta Pusat",
    province: "DKI Jakarta",
    region: "Jawa",
    programType: "qardhul-hasan",
    category: "dapur-halal",
    categoryLabel: "Dapur Halal Bersama",
    latitude: -6.1624,
    longitude: 106.8569,
    dmsCoordinate: "06°09'44.6\"S 106°51'24.8\"E",
    beneficiariesCount: 38,
    totalFundDisbursed: 350000000,
    jobsCreated: 46,
    monthlyTurnover: 88000000,
    leadPartner: "Koperasi Syariah Al-Hikmah Kemayoran",
    contactPerson: "Ustadz H. Rahmat Hidayat",
    phone: "+62 812-9901-4432",
    address: "Jl. Utan Panjang III No. 12, Kemayoran, Jakarta Pusat",
    coreCommodity: "Paket Bento Halal, Nasi Kebuli & Snack Box Syariah",
    description: "Pemberdayaan 38 kepala keluarga eks-buruh ritel supermarket modern melalui konsorsium katering halal terverifikasi bebas riba.",
    impactStory: "Seluruh anggota mandiri dengan laba bersih rata-rata Rp 7,8 Juta/bulan dan terbebas dari jeratan pinjol.",
    greenImpact: "100% kemasan bento daun pisang & besek bambu; minyak jelantah disuling jadi sabun cuci berkah.",
  },
  {
    id: "GEO-BGR",
    name: "Klaster Budidaya Maggot BSF & Aquaponik Sentul-Cibinong",
    cityName: "Bogor & Cibinong",
    province: "Jawa Barat",
    region: "Jawa",
    programType: "green-coop",
    category: "maggot-aquaponik",
    categoryLabel: "Mitra Green Coop (Sirkular)",
    latitude: -6.4828,
    longitude: 106.8536,
    dmsCoordinate: "06°28'58.1\"S 106°51'13.0\"E",
    beneficiariesCount: 32,
    totalFundDisbursed: 280000000,
    jobsCreated: 40,
    monthlyTurnover: 68000000,
    leadPartner: "Yayasan Eco-Pesantren Al-Barakah",
    contactPerson: "Ir. Ahmad Fauzi",
    phone: "+62 813-8821-7650",
    address: "Kawasan Hijau Cibinong Eco-Park, Kab. Bogor, Jawa Barat",
    coreCommodity: "Pakan Pelet Maggot Kering 45% Protein, Selada Air & Nila Organik",
    description: "Mengubah 3,5 ton sampah sisa pasar induk setiap minggu menjadi biomassa pakan unggas & pupuk kasgot organik berdaya jual tinggi.",
    impactStory: "Diinisiasi 6 mantan staf pabrik suku cadang otomotif yang terkena PHK massal tahun 2024.",
    greenImpact: "Mengurangi beban timbulan TPA Galuga hingga 14 ton sampah basah per bulan.",
  },
  {
    id: "GEO-BDG",
    name: "Bank Sampah Sirkular & Upcycling Tekstil Priangan",
    cityName: "Bandung & Cimahi",
    province: "Jawa Barat",
    region: "Jawa",
    programType: "green-coop",
    category: "green-coop",
    categoryLabel: "Koperasi Hijau",
    latitude: -6.9175,
    longitude: 107.6191,
    dmsCoordinate: "06°55'03.0\"S 107°37'08.8\"E",
    beneficiariesCount: 29,
    totalFundDisbursed: 290000000,
    jobsCreated: 37,
    monthlyTurnover: 82000000,
    leadPartner: "Koperasi Sirkular Priangan Mandiri",
    contactPerson: "Ibu Siti Rohmah, S.E.",
    phone: "+62 856-4321-9988",
    address: "Jl. Terusan Buah Batu No. 88, Bojongsoang, Bandung",
    coreCommodity: "Paving Block Limbah Plastik, Sajadah Perca Majalaya & Tote Bag Modis",
    description: "Mengolah kain perca garmen dan kantong plastik sekali pakai menjadi paving block ramah lingkungan dan kriya syariah bernilai tinggi.",
    impactStory: "Memberdayakan 29 buruh garmen wanita korban PHK pabrik tekstil Majalaya dengan upah di atas UMR.",
    greenImpact: "Daur ulang 2,2 ton plastik daur ulang per bulan berpadu tabungan emas infaq warga.",
  },
  {
    id: "GEO-CRB",
    name: "Solar Dome Pengering Hasil Laut Nelayan Pantura",
    cityName: "Cirebon",
    province: "Jawa Barat",
    region: "Jawa",
    programType: "qardhul-hasan",
    category: "qardhul-hasan",
    categoryLabel: "Penerima Manfaat Qardhul Hasan",
    latitude: -6.7320,
    longitude: 108.5714,
    dmsCoordinate: "06°43'55.2\"S 108°34'17.0\"E",
    beneficiariesCount: 18,
    totalFundDisbursed: 155000000,
    jobsCreated: 24,
    monthlyTurnover: 52000000,
    leadPartner: "Paguyuban Nelayan Mandiri Barokah",
    contactPerson: "Pak Kusnadi",
    phone: "+62 819-0988-7711",
    address: "Kawasan Pesisir Kejawanan, Lemahwungkuk, Kota Cirebon",
    coreCommodity: "Ikan Teri Nasi Surya, Terasi Udang Rebon & Abon Cumi Higienis",
    description: "Teknologi Solar Dome pengering ikan surya bebas debu dan serangga untuk meningkatkan kualitas olahan hasil tangkapan nelayan.",
    impactStory: "Nelayan terbebas 100% dari jeratan tengkulak rente berkat akad Qardhul Hasan tanpa bunga sepeserpun.",
    greenImpact: "Menggantikan 100% proses pengasapan kayu bakar dengan energi sinar matahari terpusat.",
  },

  // --- JAWA TENGAH & DIY ---
  {
    id: "GEO-SMG",
    name: "Hub Distribusi Pangan Murah Bebas Riba & Armada EV",
    cityName: "Semarang",
    province: "Jawa Tengah",
    region: "Jawa",
    programType: "green-coop",
    category: "green-coop",
    categoryLabel: "Koperasi Hijau",
    latitude: -6.9667,
    longitude: 110.4167,
    dmsCoordinate: "06°58'00.1\"S 110°25'00.1\"E",
    beneficiariesCount: 34,
    totalFundDisbursed: 330000000,
    jobsCreated: 42,
    monthlyTurnover: 125000000,
    leadPartner: "Koperasi B2B Umat Jateng",
    contactPerson: "Bambang Triyono",
    phone: "+62 812-2244-5566",
    address: "Kawasan Pergudangan Genuk Indah Blok B-4, Semarang",
    coreCommodity: "Beras Mentik Wangi Organik, Gula Semut Aren & Minyak Kelapa Murni",
    description: "Pusat logistik pangan terpadu menghubungkan 42 petani langsung dengan 120 warung kelontong RT/RW mitra binaan.",
    impactStory: "Memangkas rantai pasok hingga 4 lapis tengkulak; harga beli warung turun 18% dan marjin untung bertambah.",
    greenImpact: "Armada pengantaran menggunakan 9 unit motor listrik roda tiga nol emisi karbon.",
  },
  {
    id: "GEO-SLO",
    name: "Sentra Kumbung Jamur Tiram Organik Serbuk Sengon",
    cityName: "Solo & Sukoharjo",
    province: "Jawa Tengah",
    region: "Jawa",
    programType: "qardhul-hasan",
    category: "qardhul-hasan",
    categoryLabel: "Penerima Manfaat Qardhul Hasan",
    latitude: -7.5755,
    longitude: 110.8243,
    dmsCoordinate: "07°34'31.8\"S 110°49'27.5\"E",
    beneficiariesCount: 25,
    totalFundDisbursed: 220000000,
    jobsCreated: 31,
    monthlyTurnover: 58000000,
    leadPartner: "Kelompok Tani Barakah Hijau",
    contactPerson: "Suradi Joyo",
    phone: "+62 878-3655-4321",
    address: "Desa Bekonang, Kec. Mojolaban, Sukoharjo, Jawa Tengah",
    coreCommodity: "Jamur Tiram Putih Segar, Baglog F2 & Keripik Jamur Crispy",
    description: "4 rumah kumbung mandiri berkapasitas 22.000 baglog yang diproduksi dari serbuk kayu sisa industri mebel Solo Raya.",
    impactStory: "Dikelola bersama oleh 7 orang mantan teknisi pabrik benang yang terkena PHK massal.",
    greenImpact: "Mengurangi pembakaran limbah serbuk gergaji kayu sengon dan jati di pinggir jalan desa.",
  },
  {
    id: "GEO-YOG",
    name: "Hub Agensi Freelance Syariah & Ta'awun Programmer",
    cityName: "Yogyakarta",
    province: "D.I. Yogyakarta",
    region: "Jawa",
    programType: "qardhul-hasan",
    category: "qardhul-hasan",
    categoryLabel: "Penerima Manfaat Qardhul Hasan",
    latitude: -7.7956,
    longitude: 110.3695,
    dmsCoordinate: "07°47'44.2\"S 110°22'10.2\"E",
    beneficiariesCount: 22,
    totalFundDisbursed: 180000000,
    jobsCreated: 30,
    monthlyTurnover: 98000000,
    leadPartner: "Komunitas Muamalah Digital Nusantara",
    contactPerson: "Fikri Ramadhan, S.Kom.",
    phone: "+62 813-9090-1234",
    address: "Jl. Kaliurang KM 9, Sinduharjo, Sleman, Yogyakarta",
    coreCommodity: "Aplikasi POS Kasir Syariah, Website UMKM Halal & Desain Grafis Kemasan",
    description: "Ruang kolaborasi kreatif dan subsidi perangkat laptop/server bagi talenta IT korban badai PHK tech startup.",
    impactStory: "Telah melahirkan 12 produk digital mikro syariah dan memfasilitasi 90 UMKM masuk pasar online.",
    greenImpact: "Gedung coworking 100% menggunakan pembangkit listrik tenaga surya (PLTS) Atap 3.500 Wp.",
  },

  // --- JAWA TIMUR ---
  {
    id: "GEO-SBY",
    name: "Sentra Katering Halal Rumah Sakit & Dapur Bersama",
    cityName: "Surabaya",
    province: "Jawa Timur",
    region: "Jawa",
    programType: "qardhul-hasan",
    category: "dapur-halal",
    categoryLabel: "Dapur Halal Bersama",
    latitude: -7.2575,
    longitude: 112.7521,
    dmsCoordinate: "07°15'27.0\"S 112°45'07.6\"E",
    beneficiariesCount: 36,
    totalFundDisbursed: 360000000,
    jobsCreated: 48,
    monthlyTurnover: 118000000,
    leadPartner: "Sentra Kuliner Kaffah Berkah Jatim",
    contactPerson: "Hj. Endang Sulastri",
    phone: "+62 811-3344-900",
    address: "Jl. Rungkut Industri III No. 25, Rungkut, Surabaya",
    coreCommodity: "Katering Diet Halal Pasien, Roti Gandum & Sari Kedelai Non-GMO",
    description: "Fasilitas dapur komunal bersertifikat Halal MUI yang melayani pasokan konsumsi 4 rumah sakit Islam terkemuka.",
    impactStory: "Menyelamatkan 36 pekerja perempuan korban PHK pabrik alas kaki dengan sistem bagi hasil adil.",
    greenImpact: "Zero waste kitchen: seluruh sisa sayur dan kulit buah diolah menjadi eco-enzyme pembersih lantai.",
  },
  {
    id: "GEO-MLG",
    name: "Klaster Peternakan Puyuh Organik & Olahan Apel",
    cityName: "Malang & Batu",
    province: "Jawa Timur",
    region: "Jawa",
    programType: "green-coop",
    category: "maggot-aquaponik",
    categoryLabel: "Mitra Green Coop (Sirkular)",
    latitude: -7.9666,
    longitude: 112.6326,
    dmsCoordinate: "07°57'59.8\"S 112°37'57.4\"E",
    beneficiariesCount: 24,
    totalFundDisbursed: 210000000,
    jobsCreated: 32,
    monthlyTurnover: 64000000,
    leadPartner: "Koperasi Agro Syariah Brawijaya",
    contactPerson: "drh. Hendro Wibowo",
    phone: "+62 812-3321-8899",
    address: "Kawasan Agro Dau, Kab. Malang, Jawa Timur",
    coreCommodity: "Telur Puyuh Organik Rendah Kolesterol & Sari Apel Murni",
    description: "Integrasi kandang puyuh modern sistem baterai berpadu maggot BSF untuk menekan biaya pakan hingga 35%.",
    impactStory: "Omzet meningkat stabil, didampingi dokter hewan alumni perguruan tinggi terkemuka di Malang.",
    greenImpact: "Kotoran puyuh dan kasgot diolah menjadi pupuk kandang tanaman apel organik petani setempat.",
  },
  {
    id: "GEO-BWI",
    name: "Sentra Bioflok Ikan Sidat & Kerapu Berkelanjutan",
    cityName: "Banyuwangi",
    province: "Jawa Timur",
    region: "Jawa",
    programType: "green-coop",
    category: "green-coop",
    categoryLabel: "Koperasi Hijau",
    latitude: -8.2192,
    longitude: 114.3691,
    dmsCoordinate: "08°13'09.1\"S 114°22'08.8\"E",
    beneficiariesCount: 19,
    totalFundDisbursed: 195000000,
    jobsCreated: 27,
    monthlyTurnover: 72000000,
    leadPartner: "Koperasi Mina Bahari Syariah Blambangan",
    contactPerson: "H. Abdul Manan",
    phone: "+62 813-3600-4411",
    address: "Kecamatan Muncar, Kab. Banyuwangi, Jawa Timur",
    coreCommodity: "Ikan Sidat Kualitas Ekspor, Ikan Kerapu Cantang & Pakan Fermentasi",
    description: "Budidaya perikanan air tawar & payau menggunakan kolam terpal bioflok hemat air dan ramah pesisir.",
    impactStory: "Menyerap 19 mantan buruh pabrik pengalengan ikan yang mengalami penurunan kuota kerja.",
    greenImpact: "Mencegah perburuan benih sidat liar secara eksploitatif dengan teknologi pembesaran terkontrol.",
  },

  // --- SUMATERA ---
  {
    id: "GEO-ACH",
    name: "Wakaf Produktif Kopi Gayo Organik & Pengeringan Surya",
    cityName: "Banda Aceh & Bener Meriah",
    province: "Aceh",
    region: "Sumatera",
    programType: "hybrid",
    category: "wakaf-produktif",
    categoryLabel: "Aset Wakaf Produktif & Qardh",
    latitude: 5.5483,
    longitude: 95.3238,
    dmsCoordinate: "05°32'53.9\"N 95°19'25.7\"E",
    beneficiariesCount: 28,
    totalFundDisbursed: 275000000,
    jobsCreated: 38,
    monthlyTurnover: 95000000,
    leadPartner: "Baitul Maal Muamalah Serambi Mekkah",
    contactPerson: "Teuku H. Fachruddin",
    phone: "+62 852-6011-2233",
    address: "Jl. Teuku Umar No. 45, Banda Aceh & Kebun Bener Meriah",
    coreCommodity: "Biji Kopi Arabika Gayo Specialty Grade 1, Cascara Tea & Kopi Bubuk Wine",
    description: "Tanah wakaf seluas 4,2 hektar dikelola bersama petani eks-pekerja kebun swasta dengan sistem bagi hasil syariah 60:40.",
    impactStory: "Mendongkrak pendapatan petani gayo hingga 2,5 kali lipat berkat sertifikasi Fairtrade & Organik.",
    greenImpact: "Pertanian metode agroforestri menanam pohon pelindung lamtoro untuk mencegah erosi lereng bukit.",
  },
  {
    id: "GEO-MDN",
    name: "Sentra Olahan Kelapa Terpadu & Sabun Alami Deli",
    cityName: "Medan & Deli Serdang",
    province: "Sumatera Utara",
    region: "Sumatera",
    programType: "green-coop",
    category: "green-coop",
    categoryLabel: "Koperasi Hijau",
    latitude: 3.5952,
    longitude: 98.6722,
    dmsCoordinate: "03°35'42.7\"N 98°40'19.9\"E",
    beneficiariesCount: 26,
    totalFundDisbursed: 240000000,
    jobsCreated: 34,
    monthlyTurnover: 76000000,
    leadPartner: "Koperasi Hijau Mandiri Deli Sejahtera",
    contactPerson: "Syahputra Harahap",
    phone: "+62 812-6500-7788",
    address: "Jl. Medan-Batang Kuis KM 12, Deli Serdang, Sumut",
    coreCommodity: "Minyak VCO Cold-Pressed, Sabun Herbal Kelapa & Briket Tempurung Arang",
    description: "Pabrik mini pengolahan kelapa bulat zero waste tanpa bahan pengawet sintesis kimiawi.",
    impactStory: "Membina 26 mantan sopir angkutan dan staf logistik pelabuhan Belawan menjadi pengusaha sabun herbal.",
    greenImpact: "Zero waste: tempurung dibuat arang aktif shisha, air kelapa menjadi nata de coco.",
  },
  {
    id: "GEO-PDG",
    name: "Lumbung Padi Organik Solok & Dapur Rendang Higienis",
    cityName: "Padang & Solok",
    province: "Sumatera Barat",
    region: "Sumatera",
    programType: "qardhul-hasan",
    category: "qardhul-hasan",
    categoryLabel: "Penerima Manfaat Qardhul Hasan",
    latitude: -0.9471,
    longitude: 100.4172,
    dmsCoordinate: "00°56'49.6\"S 100°25'01.9\"E",
    beneficiariesCount: 22,
    totalFundDisbursed: 215000000,
    jobsCreated: 29,
    monthlyTurnover: 70000000,
    leadPartner: "Koperasi Saudagar Minang Kaffah",
    contactPerson: "Datuk H. Marah Rusli",
    phone: "+62 813-7400-3322",
    address: "Jl. Khatib Sulaiman No. 78, Kota Padang, Sumbar",
    coreCommodity: "Beras Solok Bareh Solok Asli, Rendang Sapi Kemasan Retort Steril",
    description: "Pengembangan padi organik varietas lokal Solok dan dapur sterilisasi rendang tahan 12 bulan tanpa bahan kimia.",
    impactStory: "Membantu 22 ibu rumah tangga dan korban perampingan biro perjalanan umroh mandiri pangan.",
    greenImpact: "Pemberantasan hama tikus menggunakan burung hantu Tyto Alba pengganti racun kimia sintetis.",
  },
  {
    id: "GEO-PLM",
    name: "Sentra Pempek Ikan Gabus Rawa Bebas Formalin",
    cityName: "Palembang",
    province: "Sumatera Selatan",
    region: "Sumatera",
    programType: "qardhul-hasan",
    category: "dapur-halal",
    categoryLabel: "Dapur Halal Bersama",
    latitude: -2.9761,
    longitude: 104.7754,
    dmsCoordinate: "02°58'34.0\"S 104°46'31.4\"E",
    beneficiariesCount: 20,
    totalFundDisbursed: 175000000,
    jobsCreated: 27,
    monthlyTurnover: 62000000,
    leadPartner: "Sentra Kuliner Sriwijaya Berkah",
    contactPerson: "H. Kemas Ridwan",
    phone: "+62 821-7890-5544",
    address: "Kawasan Seberang Ulu 1, Palembang, Sumatera Selatan",
    coreCommodity: "Pempek Ikan Gabus Rawa Liar, Cuko Asli Gula Batok Linggau & Kerupuk Kemplang",
    description: "Standardisasi produksi pempek berbahan ikan gabus air tawar kaya albumin untuk kesehatan dan pemulihan pasca operasi.",
    impactStory: "Dikelola 20 pemuda eks-pekerja retail elektronik dengan sistem penjualan daring ke seluruh Indonesia.",
    greenImpact: "Menggunakan kemasan vakum berbahan pati jagung (biodegradable polylactic acid) yang terurai alami.",
  },

  // --- KALIMANTAN ---
  {
    id: "GEO-PTK",
    name: "Sentra Bio-Briket Tempurung Kelapa & Madu Kelulut Hutan",
    cityName: "Pontianak & Kubu Raya",
    province: "Kalimantan Barat",
    region: "Kalimantan",
    programType: "green-coop",
    category: "green-coop",
    categoryLabel: "Koperasi Hijau",
    latitude: -0.0263,
    longitude: 109.3425,
    dmsCoordinate: "00°01'34.7\"S 109°20'33.0\"E",
    beneficiariesCount: 18,
    totalFundDisbursed: 185000000,
    jobsCreated: 25,
    monthlyTurnover: 55000000,
    leadPartner: "Koperasi Khatulistiwa Hijau Mandiri",
    contactPerson: "Gusti Syahril",
    phone: "+62 853-4800-1122",
    address: "Jl. Parit H. Husin II, Kota Pontianak, Kalbar",
    coreCommodity: "Briket Arang Hexagonal Ramah Asap, Madu Trigona Kelulut Murni",
    description: "Unit usaha pengolahan limbah batok kelapa pesisir Pontianak menjadi briket ekspor kualitas shisha/BBQ.",
    impactStory: "Menyerap 18 pemuda mantan buruh dermaga Sungai Kapuas dengan penghasilan konsisten di atas rata-rata.",
    greenImpact: "Mencegah penebangan kayu bakau untuk arang tradisional melalui pemanfaatan 100% limbah pertanian kelapa.",
  },
  {
    id: "GEO-BPN",
    name: "Hub Logistik Hijau Penyangga IKN Nusantara & Hidroponik",
    cityName: "Balikpapan & Penajam",
    province: "Kalimantan Timur",
    region: "Kalimantan",
    programType: "hybrid",
    category: "wakaf-produktif",
    categoryLabel: "Aset Wakaf Produktif & Qardh",
    latitude: -1.2379,
    longitude: 116.8529,
    dmsCoordinate: "01°14'16.4\"S 116°51'10.4\"E",
    beneficiariesCount: 24,
    totalFundDisbursed: 260000000,
    jobsCreated: 33,
    monthlyTurnover: 86000000,
    leadPartner: "Koperasi Mitra Hijau Penyangga IKN",
    contactPerson: "Ir. H. Muhammad Dani",
    phone: "+62 811-5400-3399",
    address: "Jl. Soekarno-Hatta KM 15, Balikpapan Utara, Kaltim",
    coreCommodity: "Sayuran Hidroponik Greenhouse, Buah Naga Organik & Daging Ayam Halal",
    description: "Klaster penyangga pasokan makanan sehat untuk kebutuhan ribuan pekerja konstruksi dan ASN di kawasan IKN.",
    impactStory: "Melibatkan 24 mantan pekerja subkontraktor migas yang beralih profesi menjadi petani hidroponik modern.",
    greenImpact: "Greenhouse pintar bertenaga surya 100% daur ulang air nutrisi sistem NFT tertutup bebas residu pestisida.",
  },
  {
    id: "GEO-BJM",
    name: "Kerajinan Serat Purun Rawa Gambut & Sasirangan Pewarna Alami",
    cityName: "Banjarmasin & Banjarbaru",
    province: "Kalimantan Selatan",
    region: "Kalimantan",
    programType: "qardhul-hasan",
    category: "qardhul-hasan",
    categoryLabel: "Penerima Manfaat Qardhul Hasan",
    latitude: -3.3194,
    longitude: 114.5908,
    dmsCoordinate: "03°19'09.8\"S 114°35'26.9\"E",
    beneficiariesCount: 20,
    totalFundDisbursed: 160000000,
    jobsCreated: 26,
    monthlyTurnover: 48000000,
    leadPartner: "Baitul Maal Banua Sejahtera",
    contactPerson: "Hj. Noor Laila",
    phone: "+62 878-1500-6677",
    address: "Kawasan Wisata Sungai Martapura, Kota Banjarmasin",
    coreCommodity: "Tikar Purun Rawa Anyam, Tas Ramah Lingkungan & Kain Sasirangan Alami",
    description: "Pemberdayaan kaum ibu pengrajin tanaman purun lahan basah gambut dengan pewarna herbal dari kulit kayu ulin dan kunyit.",
    impactStory: "Membebaskan 20 pengrajin dari sistem ijon tengkulak perahu; omzet per pengrajin naik 70%.",
    greenImpact: "Konservasi ekosistem rawa gambut purun yang mencegah bahaya kebakaran hutan tahunan.",
  },

  // --- SULAWESI ---
  {
    id: "GEO-MKS",
    name: "Sentra Pengering Surya Rumput Laut & Olahan Ikan Sunu",
    cityName: "Makassar & Takalar",
    province: "Sulawesi Selatan",
    region: "Sulawesi",
    programType: "green-coop",
    category: "green-coop",
    categoryLabel: "Koperasi Hijau",
    latitude: -5.1477,
    longitude: 119.4327,
    dmsCoordinate: "05°08'51.7\"S 119°25'57.7\"E",
    beneficiariesCount: 27,
    totalFundDisbursed: 250000000,
    jobsCreated: 36,
    monthlyTurnover: 84000000,
    leadPartner: "Koperasi Pesisir Anging Mammiri",
    contactPerson: "Dg. Sitaba",
    phone: "+62 811-4100-9988",
    address: "Kawasan Pesisir Barombong, Kec. Tamalate, Kota Makassar",
    coreCommodity: "Rumput Laut Gracilaria Ekspor, Kerupuk Karang Ikan & Abon Tuna",
    description: "Kubah pengering tenaga surya (Solar Dome) untuk menjaga higienitas rumput laut dari kontaminasi debu dan pasir pantai.",
    impactStory: "Kualitas kadar air rumput laut mencapai standar ekspor Jepang; pendapatan nelayan terdampak PHK melonjak 50%.",
    greenImpact: "Menghentikan penggunaan bahan pengawet belerang pada proses pengeringan rumput laut.",
  },
  {
    id: "GEO-MND",
    name: "Pabrik Mini VCO Fermentasi Dingin & Briket Minahasa",
    cityName: "Manado & Tomohon",
    province: "Sulawesi Utara",
    region: "Sulawesi",
    programType: "green-coop",
    category: "green-coop",
    categoryLabel: "Koperasi Hijau",
    latitude: 1.4748,
    longitude: 124.8421,
    dmsCoordinate: "01°28'29.3\"N 124°50'31.6\"E",
    beneficiariesCount: 16,
    totalFundDisbursed: 145000000,
    jobsCreated: 22,
    monthlyTurnover: 46000000,
    leadPartner: "Koperasi Nyiur Melambai Sejahtera",
    contactPerson: "Ferry Pontoh",
    phone: "+62 813-4000-5544",
    address: "Jl. Raya Tomohon-Manado KM 8, Kota Tomohon, Sulut",
    coreCommodity: "Minyak VCO Sentrifugasi Dingin, Sabun Kelapa Transparan & Cocopeat",
    description: "Teknologi pengolahan kelapa segar tanpa pemanasan suhu tinggi untuk menjaga antioksidan asam laurat alami.",
    impactStory: "16 mantan staf kargo penerbangan dan perhotelan kini mengelola rantai pasok kelapa dari 50 petani Minahasa.",
    greenImpact: "Zero waste: tempurung jadi briket arang, sabut kelapa jadi media tanam cocopeat pembibitan hutan.",
  },

  // --- BALI & NUSA TENGGARA ---
  {
    id: "GEO-DPS",
    name: "Sentra Katering Halal Wisatawan Muslim Bali Berdaya",
    cityName: "Denpasar & Kuta",
    province: "Bali",
    region: "Bali-Nusra",
    programType: "qardhul-hasan",
    category: "dapur-halal",
    categoryLabel: "Dapur Halal Bersama",
    latitude: -8.6705,
    longitude: 115.2126,
    dmsCoordinate: "08°40'13.8\"S 115°12'45.4\"E",
    beneficiariesCount: 17,
    totalFundDisbursed: 150000000,
    jobsCreated: 23,
    monthlyTurnover: 56000000,
    leadPartner: "Paguyuban Pengusaha Muslim Bali Berdaya",
    contactPerson: "H. Syamsul Bahri",
    phone: "+62 818-0500-2211",
    address: "Jl. Imam Bonjol No. 198, Pemecutan Klod, Denpasar Barat",
    coreCommodity: "Nasi Kotak Halal Tour, Ayam Betutu Rempah Organik & Sambal Matah Higienis",
    description: "Layanan penyediaan makanan halal bersertifikat resmi bagi rombongan wisatawan domestik dan internasional.",
    impactStory: "Membantu 17 pramuwisata & pengemudi travel pariwisata yang sempat kehilangan pekerjaan kembali bangkit.",
    greenImpact: "Katering bekerjasama dengan bank sampah lokal; 100% sisa makanan dialirkan untuk pakan maggot.",
  },
  {
    id: "GEO-LOP",
    name: "Sentra Daun Kelor (Moringa) Organik & Kolam Bioflok Nila",
    cityName: "Mataram & Lombok Barat",
    province: "Nusa Tenggara Barat",
    region: "Bali-Nusra",
    programType: "green-coop",
    category: "maggot-aquaponik",
    categoryLabel: "Mitra Green Coop (Sirkular)",
    latitude: -8.5833,
    longitude: 116.1167,
    dmsCoordinate: "08°35'00.0\"S 116°07'00.1\"E",
    beneficiariesCount: 19,
    totalFundDisbursed: 165000000,
    jobsCreated: 25,
    monthlyTurnover: 50000000,
    leadPartner: "Pondok Pemberdayaan Umat Sasak",
    contactPerson: "Tuan Guru H. Lalu Syarif",
    phone: "+62 878-6400-9900",
    address: "Desa Gunung Sari, Kec. Gunungsari, Lombok Barat, NTB",
    coreCommodity: "Kapsul Teh Daun Kelor Organik, Tepung Kelor Halus & Ikan Nila Bioflok",
    description: "Perkebunan kelor organik kaya multivitamin dipadukan dengan 14 kolam terpal bulat bioflok hemat air.",
    impactStory: "Menyerap 19 mantan buruh tambang dan buruh migran yang kembali ke tanah air tanpa modal kerja.",
    greenImpact: "Pohon kelor menyerap emisi karbon tinggi dan mereklamasi lahan kritis bekas tambang galian C.",
  },

  // --- MALUKU & PAPUA ---
  {
    id: "GEO-AMB",
    name: "Koperasi Rempah Pala Pusaka & Minyak Kayu Putih Murni",
    cityName: "Ambon & Pulau Buru",
    province: "Maluku",
    region: "Maluku-Papua",
    programType: "green-coop",
    category: "green-coop",
    categoryLabel: "Koperasi Hijau",
    latitude: -3.6547,
    longitude: 128.1906,
    dmsCoordinate: "03°39'16.9\"S 128°11'26.2\"E",
    beneficiariesCount: 15,
    totalFundDisbursed: 135000000,
    jobsCreated: 20,
    monthlyTurnover: 42000000,
    leadPartner: "Koperasi Rempah Berkah Maluku",
    contactPerson: "Usman Pattimura",
    phone: "+62 822-4800-1177",
    address: "Kawasan Pesisir Hitu, Kec. Leihitu, Kab. Maluku Tengah",
    coreCommodity: "Biji Pala Super Grade A, Fuli Kering Merah & Minyak Kayu Putih Asli Buru",
    description: "Pengemasan vakum modern dan sertifikasi keaslian minyak atsiri warisan kepulauan rempah nusantara.",
    impactStory: "15 mantan pelaut dan pekerja kargo kapal kini mengelola sentra ekspor rempah dengan penghasilan adil.",
    greenImpact: "Melestarikan pohon pala tua warisan leluhur dan mencegah pembalakan liar di perbukitan hutan Hitu.",
  },
  {
    id: "GEO-JYP",
    name: "Sentra Olahan Sagu Higienis & Keripik Keladi Bebas Gluten",
    cityName: "Jayapura & Keerom",
    province: "Papua",
    region: "Maluku-Papua",
    programType: "qardhul-hasan",
    category: "qardhul-hasan",
    categoryLabel: "Penerima Manfaat Qardhul Hasan",
    latitude: -2.5337,
    longitude: 140.7181,
    dmsCoordinate: "02°32'01.3\"S 140°43'05.2\"E",
    beneficiariesCount: 12,
    totalFundDisbursed: 110000000,
    jobsCreated: 16,
    monthlyTurnover: 35000000,
    leadPartner: "Baitul Maal Cendrawasih Mandiri",
    contactPerson: "Muhammad Rumagesan",
    phone: "+62 812-4899-7700",
    address: "Distrik Sentani Timur, Kab. Jayapura, Papua",
    coreCommodity: "Tepung Sagu Basah Higienis, Keripik Keladi Balado & Sinole Manis",
    description: "Modernisasi alat pemarut dan pemeras sagu higienis sebagai pangan lokal bergizi bebas gluten pengganti terigu.",
    impactStory: "12 pemuda eks-buruh logistik pelabuhan Jayapura kini menjadi distributor sagu kemasan terbesar di Sentani.",
    greenImpact: "Melestarikan hutan sagu alami di pesisir Danau Sentani sebagai benteng ekologis penyimpan air tanah.",
  },
];

interface PetaSebaranDampakProps {
  onOpenApplyModal?: () => void;
}

export const PetaSebaranDampak: React.FC<PetaSebaranDampakProps> = ({ onOpenApplyModal }) => {
  const [selectedProgram, setSelectedProgram] = useState<"all" | "qardhul-hasan" | "green-coop">("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeLocation, setActiveLocation] = useState<GeoImpactLocation>(GEO_IMPACT_LOCATIONS[0]);
  const [hoveredLocation, setHoveredLocation] = useState<GeoImpactLocation | null>(null);
  const [copiedCoordsId, setCopiedCoordsId] = useState<string | null>(null);
  const [cursorCoordinates, setCursorCoordinates] = useState<{ lat: string; lng: string } | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Filter Locations based on Program, Region, and Search Query
  const filteredLocations = useMemo(() => {
    return GEO_IMPACT_LOCATIONS.filter((loc) => {
      const matchProgram =
        selectedProgram === "all" ||
        loc.programType === selectedProgram ||
        loc.programType === "hybrid";

      const matchRegion = selectedRegion === "all" || loc.region === selectedRegion;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === "" ||
        loc.name.toLowerCase().includes(q) ||
        loc.cityName.toLowerCase().includes(q) ||
        loc.province.toLowerCase().includes(q) ||
        loc.leadPartner.toLowerCase().includes(q) ||
        loc.coreCommodity.toLowerCase().includes(q) ||
        loc.dmsCoordinate.toLowerCase().includes(q);

      return matchProgram && matchRegion && matchSearch;
    });
  }, [selectedProgram, selectedRegion, searchQuery]);

  // Aggregate Metrics
  const aggregateMetrics = useMemo(() => {
    const totalDisbursed = GEO_IMPACT_LOCATIONS.reduce((sum, loc) => sum + loc.totalFundDisbursed, 0);
    const totalBeneficiaries = GEO_IMPACT_LOCATIONS.reduce((sum, loc) => sum + loc.beneficiariesCount, 0);
    const totalJobs = GEO_IMPACT_LOCATIONS.reduce((sum, loc) => sum + loc.jobsCreated, 0);
    const totalTurnover = GEO_IMPACT_LOCATIONS.reduce((sum, loc) => sum + loc.monthlyTurnover, 0);

    return {
      totalDisbursed,
      totalBeneficiaries,
      totalJobs,
      totalTurnover,
      locationsCount: GEO_IMPACT_LOCATIONS.length,
    };
  }, []);

  // Format Currency
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Convert Latitude / Longitude into Cartesian % within Indonesia Viewport
  const getCoordinatesPercent = (lat: number, lng: number) => {
    const { minLng, maxLng, minLat, maxLat } = INDONESIA_GEO_BOUNDS;
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return {
      x: Math.min(98, Math.max(2, x)),
      y: Math.min(92, Math.max(8, y)),
    };
  };

  // Handle Mouse Hover on Map to Calculate Real GPS Coordinates Under Cursor
  const handleMapMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const xPercent = (e.clientX - rect.left) / rect.width;
    const yPercent = (e.clientY - rect.top) / rect.height;

    const { minLng, maxLng, minLat, maxLat } = INDONESIA_GEO_BOUNDS;
    const currentLng = minLng + xPercent * (maxLng - minLng);
    const currentLat = maxLat - yPercent * (maxLat - minLat);

    setCursorCoordinates({
      lat: currentLat.toFixed(4) + (currentLat >= 0 ? "° N" : "° S"),
      lng: currentLng.toFixed(4) + "° E",
    });
  };

  const handleCopyCoordinates = (loc: GeoImpactLocation) => {
    const text = `${loc.latitude}, ${loc.longitude} (${loc.cityName})`;
    navigator.clipboard.writeText(text);
    setCopiedCoordsId(loc.id);
    setTimeout(() => setCopiedCoordsId(null), 2500);
  };

  return (
    <div
      id="peta-sebaran-dampak"
      className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden space-y-0 transition-all"
    >
      {/* Header Banner with Geographical Theme */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-950 p-6 sm:p-8 text-white relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: "20s" }} />
              <span>Sistem Pemetaan Geospasial Nusantara • Berbasis Data Koordinat GPS</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-white tracking-tight leading-tight">
              Peta Sebaran Dampak: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200">
                Penerima Qardhul Hasan & Mitra Green Coop
              </span>
            </h2>

            <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">
              Jelajahi visualisasi titik sebaran geografis penerima modal usaha <strong>Qardhul Hasan (0% Riba)</strong>,
              klaster budidaya sirkular, dan <strong>Mitra Koperasi Hijau (Green Coop)</strong> di seluruh Indonesia,
              terverifikasi dengan koordinat lintang & bujur autentik dari Sabang hingga Merauke.
            </p>
          </div>

          {/* Aggregate Metrics in Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-700/50 shrink-0 shadow-lg">
            <div className="text-center p-2.5 bg-slate-950/70 rounded-xl border border-emerald-800/60">
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Titik GPS Sentra</div>
              <div className="text-base sm:text-lg font-black text-amber-300 font-serif">
                {aggregateMetrics.locationsCount} Wilayah
              </div>
            </div>

            <div className="text-center p-2.5 bg-slate-950/70 rounded-xl border border-emerald-800/60">
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Penerima Binaan</div>
              <div className="text-base sm:text-lg font-black text-emerald-300 font-serif">
                {aggregateMetrics.totalBeneficiaries} UMKM
              </div>
            </div>

            <div className="text-center p-2.5 bg-slate-950/70 rounded-xl border border-emerald-800/60">
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Dana Bergulir</div>
              <div className="text-base sm:text-lg font-black text-teal-300 font-serif">
                {formatIDR(aggregateMetrics.totalDisbursed)}
              </div>
            </div>

            <div className="text-center p-2.5 bg-slate-950/70 rounded-xl border border-emerald-800/60">
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Pekerja Berdaya</div>
              <div className="text-base sm:text-lg font-black text-lime-300 font-serif">
                {aggregateMetrics.totalJobs} Jiwa
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Dual Program Filter, Search & GIS Mode */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Program Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedProgram("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedProgram === "all"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span>Semua Program ({GEO_IMPACT_LOCATIONS.length})</span>
          </button>

          <button
            onClick={() => setSelectedProgram("qardhul-hasan")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedProgram === "qardhul-hasan"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-amber-50 border border-slate-200"
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-amber-300" />
            <span>Qardhul Hasan 0% Riba</span>
          </button>

          <button
            onClick={() => setSelectedProgram("green-coop")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedProgram === "green-coop"
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200"
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-300" />
            <span>Mitra Green Coop</span>
          </button>
        </div>

        {/* Region & Search Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Region Dropdown */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:border-emerald-600"
          >
            <option value="all">Semua Wilayah Pulau</option>
            <option value="Jawa">Pulau Jawa</option>
            <option value="Sumatera">Pulau Sumatera</option>
            <option value="Kalimantan">Pulau Kalimantan</option>
            <option value="Sulawesi">Pulau Sulawesi</option>
            <option value="Bali-Nusra">Bali & Nusa Tenggara</option>
            <option value="Maluku-Papua">Maluku & Papua</option>
          </select>

          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kota, komoditas, koordinat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500"
            />
          </div>

          {/* Toggle View Mode (Map / Grid Table) */}
          <div className="flex rounded-xl bg-slate-200 p-0.5 border border-slate-300">
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "map" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Peta GPS
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "list" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tabel Koordinat
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Map & Detail Layout */}
      {viewMode === "map" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* ================= MAP CANVAS (8 COLS) ================= */}
          <div className="lg:col-span-8 p-4 sm:p-6 bg-slate-950 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative">
            {/* Equator & GIS Coordinates Header Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>Batas Geografis: 6°00' LU s/d 11°00' LS • 95°00' BT s/d 141°00' BT</span>
              </div>

              {cursorCoordinates ? (
                <div className="font-mono text-[11px] text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  Kursor: {cursorCoordinates.lat}, {cursorCoordinates.lng}
                </div>
              ) : (
                <div className="font-mono text-[11px] text-slate-500">
                  Arahkan kursor pada peta untuk membaca koordinat GPS
                </div>
              )}
            </div>

            {/* Interactive Archipelago Map Box */}
            <div
              ref={mapContainerRef}
              onMouseMove={handleMapMouseMove}
              onMouseLeave={() => setCursorCoordinates(null)}
              className="relative w-full aspect-[16/9] min-h-[380px] sm:min-h-[460px] my-4 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800/90 overflow-hidden shadow-inner cursor-crosshair select-none"
            >
              {/* GIS Grid: Meridian & Parallel Lines */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                {/* Khatulistiwa Line (0° Latitude) */}
                <div className="absolute left-0 right-0 top-[27.27%] border-t-2 border-dashed border-amber-400 flex items-center justify-end pr-2">
                  <span className="text-[9px] font-mono text-amber-300 bg-slate-950 px-1 rounded">
                    Khatulistiwa 0°00'00"
                  </span>
                </div>

                {/* -5° South Latitude */}
                <div className="absolute left-0 right-0 top-[58.82%] border-t border-slate-700 flex items-center justify-end pr-2">
                  <span className="text-[8px] font-mono text-slate-500 bg-slate-950 px-1 rounded">5°00'00" LS</span>
                </div>

                {/* -10° South Latitude */}
                <div className="absolute left-0 right-0 top-[90%] border-t border-slate-700 flex items-center justify-end pr-2">
                  <span className="text-[8px] font-mono text-slate-500 bg-slate-950 px-1 rounded">10°00'00" LS</span>
                </div>

                {/* Meridians (100°E, 110°E, 120°E, 130°E, 140°E) */}
                <div className="absolute top-0 bottom-0 left-[10.87%] border-l border-slate-700"></div>
                <div className="absolute top-0 bottom-0 left-[32.61%] border-l border-slate-700"></div>
                <div className="absolute top-0 bottom-0 left-[54.35%] border-l border-slate-700"></div>
                <div className="absolute top-0 bottom-0 left-[76.09%] border-l border-slate-700"></div>
                <div className="absolute top-0 bottom-0 left-[97.83%] border-l border-slate-700"></div>
              </div>

              {/* High-Contrast Architectural Vector Silhouettes of Indonesian Islands */}
              <svg
                viewBox="0 0 1000 500"
                className="w-full h-full object-contain pointer-events-none opacity-45"
              >
                <defs>
                  <linearGradient id="islandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#047857" />
                    <stop offset="50%" stopColor="#065f46" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                </defs>

                {/* SUMATERA */}
                <path
                  d="M 60,60 L 110,100 L 150,160 L 210,240 L 240,290 L 220,310 L 180,260 L 140,210 L 100,160 L 70,110 Z"
                  fill="url(#islandGrad)"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />

                {/* JAWA & MADURA */}
                <path
                  d="M 230,340 L 330,345 L 430,355 L 470,365 L 470,375 L 350,370 L 240,360 Z"
                  fill="url(#islandGrad)"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />
                <ellipse cx="450" cy="348" rx="25" ry="8" fill="url(#islandGrad)" stroke="#10b981" strokeWidth="1" />

                {/* KALIMANTAN */}
                <path
                  d="M 320,120 L 410,110 L 470,160 L 480,230 L 440,270 L 350,265 L 310,210 Z"
                  fill="url(#islandGrad)"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />

                {/* SULAWESI */}
                <path
                  d="M 540,140 L 590,145 L 610,170 L 560,195 L 580,230 L 560,280 L 540,280 L 545,210 L 525,185 Z"
                  fill="url(#islandGrad)"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />

                {/* BALI, LOMBOK, SUMBAWA, FLORES, TIMOR */}
                <ellipse cx="490" cy="375" rx="10" ry="6" fill="url(#islandGrad)" stroke="#10b981" strokeWidth="1" />
                <ellipse cx="515" cy="377" rx="12" ry="7" fill="url(#islandGrad)" stroke="#10b981" strokeWidth="1" />
                <ellipse cx="555" cy="380" rx="20" ry="7" fill="url(#islandGrad)" stroke="#10b981" strokeWidth="1" />
                <ellipse cx="610" cy="380" rx="30" ry="7" fill="url(#islandGrad)" stroke="#10b981" strokeWidth="1" />
                <ellipse cx="670" cy="390" rx="25" ry="8" fill="url(#islandGrad)" stroke="#10b981" strokeWidth="1" />

                {/* MALUKU (HALMAHERA & BURU & SERAM) */}
                <path d="M 690,120 L 710,135 L 705,170 L 690,150 Z" fill="url(#islandGrad)" stroke="#10b981" strokeWidth="1" />
                <ellipse cx="675" cy="225" rx="16" ry="10" fill="url(#islandGrad)" stroke="#10b981" strokeWidth="1" />
                <ellipse cx="730" cy="228" rx="25" ry="9" fill="url(#islandGrad)" stroke="#10b981" strokeWidth="1" />

                {/* PAPUA */}
                <path
                  d="M 760,200 L 810,195 L 870,225 L 940,240 L 945,340 L 880,335 L 820,290 L 780,240 Z"
                  fill="url(#islandGrad)"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />
              </svg>

              {/* Geographic Pins Placed on Exact Calculated GPS Percentages */}
              {filteredLocations.map((loc) => {
                const { x, y } = getCoordinatesPercent(loc.latitude, loc.longitude);
                const isSelected = activeLocation?.id === loc.id;
                const isHovered = hoveredLocation?.id === loc.id;
                const isGreen = loc.category === "green-coop" || loc.category === "maggot-aquaponik";
                const isQardh = loc.category === "qardhul-hasan" || loc.category === "dapur-halal";

                return (
                  <div
                    key={loc.id}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                    onClick={() => setActiveLocation(loc)}
                    onMouseEnter={() => setHoveredLocation(loc)}
                    onMouseLeave={() => setHoveredLocation(null)}
                  >
                    {/* Ripple Wave Animation for Active/Selected Pin */}
                    {isSelected && (
                      <span className="absolute -inset-2 rounded-full bg-amber-400/30 animate-ping"></span>
                    )}

                    {/* Outer Glow Ring */}
                    <div
                      className={`relative flex items-center justify-center rounded-full transition-all duration-300 shadow-lg ${
                        isSelected
                          ? "w-8 h-8 sm:w-9 sm:h-9 bg-amber-400 text-slate-950 ring-4 ring-amber-300/40 scale-110"
                          : isGreen
                          ? "w-6 h-6 sm:w-7 sm:h-7 bg-emerald-500 text-slate-950 ring-2 ring-emerald-300/30 hover:scale-125"
                          : isQardh
                          ? "w-6 h-6 sm:w-7 sm:h-7 bg-amber-500 text-slate-950 ring-2 ring-amber-300/30 hover:scale-125"
                          : "w-6 h-6 sm:w-7 sm:h-7 bg-indigo-500 text-white ring-2 ring-indigo-300/30 hover:scale-125"
                      }`}
                    >
                      {isGreen ? (
                        <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : isQardh ? (
                        <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </div>

                    {/* Tooltip on Hover */}
                    {(isHovered || isSelected) && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none z-30 whitespace-nowrap animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/50 shadow-xl text-left">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                            <span className="text-xs font-bold text-white">{loc.cityName}</span>
                          </div>
                          <div className="text-[10px] text-amber-300 font-mono">
                            {loc.latitude.toFixed(4)}°, {loc.longitude.toFixed(4)}°
                          </div>
                          <div className="text-[10px] text-emerald-300 font-medium">
                            {loc.categoryLabel} • {loc.beneficiariesCount} UMKM
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Map Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-[11px]">Mitra Green Coop (Sirkular & Hijau)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-[11px]">Penerima Qardhul Hasan (0% Bunga)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span className="text-[11px]">Aset Wakaf Produktif Terpadu</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400">
                Menampilkan <strong className="text-white">{filteredLocations.length}</strong> dari{" "}
                <strong className="text-emerald-400">{GEO_IMPACT_LOCATIONS.length}</strong> Titik Koordinat Nasional
              </div>
            </div>
          </div>

          {/* ================= DETAIL DOSSIER PANEL (4 COLS) ================= */}
          <div className="lg:col-span-4 p-5 sm:p-6 bg-white flex flex-col justify-between space-y-4">
            {activeLocation ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Header Category & City Badge */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                        activeLocation.programType === "green-coop"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : activeLocation.programType === "qardhul-hasan"
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : "bg-indigo-100 text-indigo-900 border-indigo-300"
                      }`}
                    >
                      {activeLocation.categoryLabel}
                    </span>

                    <span className="text-[11px] text-slate-500 font-bold">
                      {activeLocation.province}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-serif leading-snug">
                    {activeLocation.name}
                  </h3>
                  <div className="text-xs text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{activeLocation.cityName}, {activeLocation.region}</span>
                  </div>
                </div>

                {/* GPS Coordinates Card with 1-Click Copy */}
                <div className="p-3 rounded-xl bg-slate-900 text-white space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-amber-400" />
                      <span>Koordinat GPS Presisi:</span>
                    </span>
                    <button
                      onClick={() => handleCopyCoordinates(activeLocation)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Salin Koordinat Lintang & Bujur"
                    >
                      {copiedCoordsId === activeLocation.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin GPS</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="font-mono text-xs sm:text-sm font-bold text-amber-300">
                    {activeLocation.dmsCoordinate}
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">
                    Desimal: {activeLocation.latitude.toFixed(6)}, {activeLocation.longitude.toFixed(6)}
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="text-slate-500 text-[10px] uppercase font-bold">Dana Tersalurkan</div>
                    <div className="font-extrabold text-emerald-950 text-sm mt-0.5 font-serif">
                      {formatIDR(activeLocation.totalFundDisbursed)}
                    </div>
                    <div className="text-[10px] text-emerald-700">100% Bebas Riba</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="text-slate-500 text-[10px] uppercase font-bold">Penerima Binaan</div>
                    <div className="font-extrabold text-amber-950 text-sm mt-0.5 font-serif">
                      {activeLocation.beneficiariesCount} UMKM
                    </div>
                    <div className="text-[10px] text-amber-700">{activeLocation.jobsCreated} Tenaga Kerja</div>
                  </div>
                </div>

                {/* Core Commodity & Description */}
                <div className="space-y-2 text-xs text-slate-700 leading-relaxed border-t border-slate-100 pt-3">
                  <div>
                    <strong className="text-slate-900 block font-semibold">Komoditas & Produk Unggulan:</strong>
                    <span className="text-slate-600">{activeLocation.coreCommodity}</span>
                  </div>

                  <div>
                    <strong className="text-slate-900 block font-semibold">Profil Pemberdayaan:</strong>
                    <p className="text-slate-600 text-justify">{activeLocation.description}</p>
                  </div>

                  {/* Impact Story */}
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/90 text-amber-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-900">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Kisah Dampak & Pemulihan PHK:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed italic">
                      "{activeLocation.impactStory}"
                    </p>
                  </div>

                  {/* Green Impact */}
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/90 text-emerald-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                      <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Dampak Ekologi Hijau:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {activeLocation.greenImpact}
                    </p>
                  </div>

                  {/* Address & Contact Person */}
                  <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                    <div>Mitra Pengelola: <strong className="text-slate-800">{activeLocation.leadPartner}</strong></div>
                    <div>PJ: <strong className="text-slate-800">{activeLocation.contactPerson}</strong> ({activeLocation.phone})</div>
                    <div>Alamat: {activeLocation.address}</div>
                  </div>
                </div>

                {/* CTAs: Google Maps External & Apply Partner */}
                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${activeLocation.latitude},${activeLocation.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    <span>Buka Titik Koordinat di Google Maps</span>
                  </a>

                  {onOpenApplyModal && (
                    <button
                      onClick={onOpenApplyModal}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Coins className="w-3.5 h-3.5 text-amber-300" />
                      <span>Ajukan Dana Qardhul Hasan di Wilayah Ini</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
                <Compass className="w-8 h-8 text-slate-300 animate-spin" />
                <p className="text-xs">Klik salah satu titik pin pada peta untuk meninjau data geospasial lengkap.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ================= TABLE LIST VIEW (GIS DATASET) ================= */
        <div className="p-6 bg-white overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Titik Sentra & Kota</th>
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4 font-mono">Koordinat GPS (Lat, Lng)</th>
                <th className="py-3 px-4 text-center">Penerima</th>
                <th className="py-3 px-4 text-right">Dana Tersalurkan</th>
                <th className="py-3 px-4">Mitra Pengelola</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLocations.map((loc) => (
                <tr
                  key={loc.id}
                  onClick={() => {
                    setActiveLocation(loc);
                    setViewMode("map");
                  }}
                  className="hover:bg-emerald-50/60 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{loc.name}</div>
                    <div className="text-[11px] text-slate-500">{loc.cityName}, {loc.province}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        loc.programType === "green-coop"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-amber-100 text-amber-800 border-amber-300"
                      }`}
                    >
                      {loc.categoryLabel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    <div className="text-xs font-bold text-amber-800">{loc.dmsCoordinate}</div>
                    <div className="text-[10px] text-slate-400">{loc.latitude}, {loc.longitude}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                    {loc.beneficiariesCount} UMKM
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-emerald-800">
                    {formatIDR(loc.totalFundDisbursed)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div>{loc.leadPartner}</div>
                    <div className="text-[10px] text-slate-400">{loc.contactPerson}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLocation(loc);
                        setViewMode("map");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-800 text-white font-bold text-[10px] hover:bg-emerald-700 cursor-pointer"
                    >
                      Buka Peta
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
