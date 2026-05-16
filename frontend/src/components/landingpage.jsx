import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AnimatedCanvasLayer from "./animation";
import Navbar from "./navbar";
import BantulMap from "../assets/bantul-map.png";
import BannerOne from "../assets/ban1.png";
import BannerTwo from "../assets/ban2.png";
import BannerThree from "../assets/ban3.png";
import BGMap from "../assets/BG_Map.png";
import ClassIllustration from "../assets/class-illustration.png";
import ClassIllustrationTwo from "../assets/class-illustration2.png";
import CommunityFirstIcon from "../assets/CommunityFirst.png";
import GunungkidulMap from "../assets/gunung-kidul-map.png";
import Head72Jam from "../assets/head_72jam.png";
import HeadCom from "../assets/head_com.png";
import HeadDaily from "../assets/head_daily.png";
import HeadDanger from "../assets/head_danger.png";
import HeadEvacuation from "../assets/head_evacuation.png";
import HeadHotspot from "../assets/head_hotspot.png";
import HeadRute from "../assets/head_rute.png";
import HeadSim from "../assets/head_sim.png";
import HeadUp from "../assets/head_up.png";
import HeroBg from "../assets/herobg.png";
import InfographicImage from "../assets/infografis.png";
import InteractiveMapIcon from "../assets/InteractiveMap.png";
import KitImage from "../assets/modul 7-72bag.png";
import LearnStimulateIcon from "../assets/Learn&Stimulate.png";
import RoutesImage from "../assets/modul5-rute.png";
import CommunicationImage from "../assets/modul8-comm.png";
import P3KImage from "../assets/p3k.png";
import HarianImage from "../assets/harian.png";
import LogoImage from "../assets/logo.png";
import SeismicMap from "../assets/seismic-map.png";
import SlemanMap from "../assets/sleman-map.png";
import TakeActionIcon from "../assets/TakeAction.png";

const CANVAS = { width: 14400, height: 9400 };
const LOCAL_STORAGE_KEY = "earthquake_edu_positions_v7";

const DEFAULT_PANELS = [
  { id: "hero", label: "Welcome", x: 6300, y: 3954, w: 1800, h: 1491 },
  { id: "about", label: "Tentang EduQuake", x: 760, y: 320, w: 1536, h: 1024, num: "01" },
  { id: "simulation", label: "Fitur Utama EduQuake", x: 2600, y: 320, w: 1536, h: 1024, num: "02" },
  { id: "riskmap", label: "Peta Risiko Yogyakarta", x: 4420, y: 320, w: 1536, h: 1024, num: "04" },
  { id: "kit", label: "Tas Siaga 72 Jam", x: 5440, y: 1710, w: 1220, h: 900, num: "05" },
  { id: "routes", label: "Jalur Evakuasi Aman", x: 760, y: 1680, w: 1536, h: 1024, num: "06" },
  { id: "communication", label: "Komunikasi Keluarga Darurat", x: 2500, y: 2700, w: 1320, h: 860, num: "07" },
  { id: "protocols", label: "Protokol Keselamatan Harian", x: 4250, y: 2860, w: 1500, h: 1450, num: "08" },
  { id: "seismic", label: "Fakta Seismik Yogyakarta", x: 620, y: 3080, w: 1580, h: 1250, num: "09" },
  { id: "quiz", label: "Kuis dan Materi Lanjutan", x: 5320, y: 3000, w: 1536, h: 1024, num: "10" },
  { id: "banner1", label: "Banner 1", x: 4300, y: 1460, w: 1360, h: 780, type: "banner" },
  { id: "banner2", label: "Banner 2", x: 3020, y: 4070, w: 1360, h: 780, type: "banner" },
  { id: "banner3", label: "Banner 3", x: 5620, y: 4200, w: 1360, h: 780, type: "banner" },
];

const BANNERS = [
  { id: "banner1", image: BannerOne, alt: "Banner kesiapsiagaan gempa 1", rotate: "rotate-[3deg]" },
  { id: "banner2", image: BannerTwo, alt: "Banner kesiapsiagaan gempa 2", rotate: "-rotate-[2deg]" },
  { id: "banner3", image: BannerThree, alt: "Banner kesiapsiagaan gempa 3", rotate: "rotate-[1deg]" },
];

const moduleMeta = {
  about: {
    icon: "shield",
    title: "Portal Kesiapsiagaan Gempa",
    subtitle: "Pahami portal, jelajahi modul, mulai belajar.",
    header: HeadUp,
    progress: 15,
    image: ClassIllustrationTwo,
    drawerTitle: "Portal Kesiapsiagaan Gempa",
    drawerKicker: "Website apa ini?",
    sections: [
      {
        icon: "info",
        title: "Apa itu EduQuake",
        body: "EduQuake adalah portal interaktif untuk menjelajahi hotspot seismik Yogyakarta, memahami risiko lokal, dan mempraktikkan tindakan aman bersama komunitas.",
      },
      {
        icon: "groups",
        title: "Target pengguna",
        body: "Keluarga, siswa, guru, komunitas warga, relawan, dan siapa pun yang perlu memahami langkah kesiapsiagaan gempa secara visual.",
      },
      {
        icon: "widgets",
        title: "Manfaat portal",
        list: ["Memahami risiko gempa di Yogyakarta", "Belajar prosedur keselamatan", "Mempersiapkan tas siaga", "Mengenali jalur evakuasi", "Mengatur komunikasi darurat keluarga"],
      },
    ],
  },
  simulation: {
    icon: "vibration",
    title: "Fitur Utama EduQuake",
    subtitle: "Jelajah • Belajar • Bertindak",
    header: HeadSim,
    progress: 28,
    image: ClassIllustration,
    drawerTitle: "Simulasi Tanggap Gempa",
    drawerKicker: "Skenario, langkah cepat, kesalahan umum",
    sections: [
      {
        icon: "tab",
        title: "Skenario utama",
        list: ["Saat berada di sekolah", "Saat berada di rumah", "Saat berada di ruang publik", "Saat berada di luar ruangan"],
      },
      {
        icon: "task_alt",
        title: "Urutan respon dasar",
        list: ["Tenang", "Drop", "Cover", "Hold", "Evaluasi kondisi", "Evakuasi setelah aman"],
      },
      {
        icon: "error",
        title: "Yang harus dihindari",
        list: ["Berlari saat guncangan masih kuat", "Berdiri dekat kaca", "Menggunakan lift", "Kembali masuk tanpa instruksi aman"],
      },
    ],
  },
  riskmap: {
    icon: "map",
    title: "Peta Risiko Yogyakarta",
    subtitle: "Kenali zona dan ancaman lokal",
    header: HeadHotspot,
    progress: 40,
    image: SeismicMap,
    drawerTitle: "Peta Risiko Yogyakarta",
    drawerKicker: "Zona, ancaman, rekomendasi",
    sections: [
      {
        icon: "location_on",
        title: "Profil zona",
        list: ["Bantul: prioritas penguatan bangunan dan latihan evakuasi warga", "Sleman: rawan efek sekunder dan perlu perhatian pada lereng dan struktur", "Gunung Kidul: risiko relatif lebih rendah tetapi jalur evakuasi tetap penting"],
      },
      {
        icon: "timeline",
        title: "Legenda",
        list: ["Risiko tinggi", "Risiko sedang", "Risiko rendah", "Sesar aktif", "Sesar utama", "Sungai"],
      },
      {
        icon: "hub",
        title: "Hubungan seismik",
        body: "Wilayah risiko dibaca bersama aktivitas lokal, kondisi tanah, akses evakuasi, dan kualitas bangunan.",
      },
    ],
  },
  kit: {
    icon: "backpack",
    title: "Tas Siaga 72 Jam",
    header: Head72Jam,
    progress: 50,
    image: KitImage,
    drawerTitle: "Tas Siaga 72 Jam",
    drawerKicker: "Checklist, fungsi item, penyimpanan",
    sections: [
      {
        icon: "checklist",
        title: "Checklist lengkap",
        list: ["Air minum minimal 3 liter per orang per hari", "Makanan siap saji atau tahan lama", "Kotak P3K dan obat pribadi", "Senter dan baterai cadangan", "Radio baterai atau hand crank", "Charger, powerbank, kabel", "Dokumen penting tahan air", "Pakaian, masker, peluit, alat kebersihan"],
      },
      {
        icon: "inventory_2",
        title: "Tips penyimpanan",
        body: "Simpan di lokasi mudah dijangkau, sesuaikan dengan anggota keluarga, dan cek masa berlaku makanan serta obat secara berkala.",
      },
      {
        icon: "track_changes",
        title: "Tujuan akhir",
        body: "Memastikan kebutuhan dasar tetap tersedia minimal 72 jam pascagempa.",
      },
    ],
  },
  routes: {
    icon: "route",
    title: "Jalur Evakuasi Aman",
    subtitle: "Rute jelas menuju titik aman",
    header: HeadEvacuation,
    progress: 60,
    image: RoutesImage,
    drawerTitle: "Jalur Evakuasi Aman",
    drawerKicker: "Peta jalur, titik kumpul, latihan",
    sections: [
      {
        icon: "directions_walk",
        title: "Langkah per langkah",
        list: ["Identifikasi jalur dari rumah, sekolah, atau kantor", "Pilih area terbuka dan aman", "Kenali alternatif bila jalur utama terhalang", "Tentukan titik kumpul keluarga atau kelompok", "Latih jalur evakuasi secara berkala"],
      },
      {
        icon: "warning",
        title: "Tips jalur aman",
        list: ["Hindari jalur sempit yang mudah macet", "Perhatikan bangunan tinggi, tiang, kabel, dan pohon besar", "Pastikan anak-anak tahu rute dasar", "Tempel peta rute sederhana di rumah atau sekolah"],
      },
      {
        icon: "flag",
        title: "Tujuan akhir",
        body: "Memastikan evakuasi cepat, tertib, dan menuju tempat yang tepat.",
      },
    ],
  },
  communication: {
    icon: "forum",
    title: "Komunikasi Keluarga Darurat",
    header: HeadCom,
    progress: 70,
    image: CommunicationImage,
    drawerTitle: "Komunikasi Keluarga Darurat",
    drawerKicker: "Diagram keluarga dan pusat komunikasi",
    sections: [
      {
        icon: "contact_phone",
        title: "Langkah komunikasi",
        list: ["Tentukan satu kontak luar daerah", "Pastikan semua anggota keluarga tahu nomor kontak", "Buat grup keluarga untuk update status", "Kirim pesan singkat: aman, lokasi, kebutuhan", "Gunakan SMS jika internet dan telepon padat"],
      },
      {
        icon: "emergency",
        title: "Nomor darurat",
        list: ["BNPB 117", "Pemadam 113", "Polisi 110"],
      },
      {
        icon: "tips_and_updates",
        title: "Tips",
        body: "Gunakan pesan singkat, simpan daftar kontak di ponsel dan tulisan fisik, serta ajarkan anak menyebut nama, alamat, dan nomor penting.",
      },
    ],
  },
  protocols: {
    icon: "health_and_safety",
    title: "Protokol Keselamatan Harian",
    header: HeadDaily,
    progress: 80,
    image: HarianImage,
    drawerTitle: "Protokol Keselamatan Harian",
    drawerKicker: "Sebelum, saat, dan setelah gempa",
    sections: [
      {
        icon: "crisis_alert",
        title: "Kondisi awal gempa",
        body: "Gempa sering muncul tanpa peringatan. Tanda yang dirasakan bisa berupa lantai bergetar, benda bergoyang, suara retakan, lampu menggantung bergerak, atau orang sekitar kehilangan keseimbangan.",
      },
      {
        icon: "school",
        title: "Sekolah, rumah, ruang publik",
        list: ["Sekolah: ikuti guru, rute keluar, titik kumpul", "Rumah: kunci furnitur, jalur keluar lapang", "Ruang publik: kenali pintu darurat, jauhi kaca dan benda gantung"],
      },
      {
        icon: "medical_services",
        title: "Setelah guncangan",
        list: ["Cek cedera ringan", "Matikan sumber api bila aman", "Ambil tas siaga", "Keluar tertib menuju titik kumpul", "Kirim status singkat ke keluarga"],
      },
    ],
  },
  seismic: {
    icon: "donut_large",
    title: "Fakta Seismik Yogyakarta",
    header: HeadDanger,
    progress: 90,
    image: InfographicImage,
    drawerTitle: "Fakta Seismik Yogyakarta",
    drawerKicker: "Sumber gempa, tanah, bangunan",
    sections: [
      {
        icon: "graphic_eq",
        title: "Ringkasan fakta",
        list: ["Aktivitas lokal berkaitan dengan koridor Sesar Opak", "Lapisan tanah tertentu dapat memperkuat guncangan", "Kualitas konstruksi memengaruhi tingkat kerusakan"],
      },
      {
        icon: "monitoring",
        title: "Arti statistik",
        list: ["Mw 6.6: ukuran energi skenario", "0.16 sampai 0.26g: rentang PGA", "23k+ struktur terpapar", "49k+ penduduk berpotensi terdampak"],
      },
      {
        icon: "groups",
        title: "Implikasi masyarakat",
        body: "Data seismik perlu diterjemahkan menjadi latihan, penguatan bangunan, dan kesiapan keluarga.",
      },
    ],
  },
  quiz: {
    icon: "quiz",
    title: "Kuis dan Materi Lanjutan",
    subtitle: "Uji pemahaman dan lanjut belajar",
    header: HeadRute,
    progress: 100,
    image: LearnStimulateIcon,
    drawerTitle: "Kuis dan Materi Lanjutan",
    drawerKicker: "Evaluasi dan rekomendasi belajar",
    sections: [
      {
        icon: "quiz",
        title: "Bentuk soal",
        list: ["Pilihan ganda", "Benar salah", "Cocokkan ikon dengan fungsi", "Skenario singkat"],
      },
      {
        icon: "travel_explore",
        title: "Cari materi baru",
        list: ["Artikel singkat", "Video edukasi", "Poster infografik", "Panduan resmi"],
      },
      {
        icon: "workspace_premium",
        title: "Output",
        body: "Nilai akhir, tingkat kesiapan, dan rekomendasi modul yang perlu diulang.",
      },
    ],
  },
};

const quickLinks = [
  ["hero", "Hero", "home"],
  ["about", "Tentang", "shield"],
  ["simulation", "Simulasi", "vibration"],
  ["riskmap", "Peta", "map"],
  ["kit", "Kit", "backpack"],
  ["routes", "Evakuasi", "route"],
  ["communication", "Komunikasi", "forum"],
  ["protocols", "Protokol", "health_and_safety"],
  ["seismic", "Fakta", "donut_large"],
  ["quiz", "Kuis", "quiz"],
];

const heroFeatures = [
  [InteractiveMapIcon, "Interactive Map", "Explore risk zones and fault lines.", "riskmap"],
  [LearnStimulateIcon, "Learn & Simulate", "Understand earthquakes through scenarios.", "simulation"],
  [TakeActionIcon, "Take Action", "Follow steps to prepare yourself and others.", "protocols"],
  [CommunityFirstIcon, "Community First", "Built for schools, families, and communities.", "communication"],
];

const hotspotZones = [
  {
    name: "Bantul",
    aliases: ["bantul"],
    risk: "Risiko tinggi",
    color: "#b83230",
    x: "26%",
    y: "66%",
    map: BantulMap,
    text: "Prioritas penguatan bangunan dan latihan evakuasi warga.",
    instructions: ["Audit rumah sederhana", "Latihan evakuasi RT/RW", "Titik kumpul terbuka"],
  },
  {
    name: "Sleman",
    aliases: ["sleman"],
    risk: "Risiko sedang",
    color: "#dc6d2f",
    x: "48%",
    y: "31%",
    map: SlemanMap,
    text: "Rawan efek sekunder dan perlu perhatian pada lereng dan struktur.",
    instructions: ["Rute alternatif", "Pantau info resmi", "Perkuat barang gantung"],
  },
  {
    name: "Gunung Kidul",
    aliases: ["gunung kidul", "gunungkidul", "kidul"],
    risk: "Risiko rendah",
    color: "#4a7c59",
    x: "70%",
    y: "70%",
    map: GunungkidulMap,
    text: "Risiko relatif lebih rendah tetapi jalur evakuasi tetap penting.",
    instructions: ["Tandai titik kumpul", "Simpan air bersih", "Latih SMS keluarga"],
  },
];

const kitItems = [
  ["water_drop", "Air minum", "Minimal 3 liter per orang per hari"],
  ["restaurant", "Makanan", "Siap saji atau tahan lama"],
  ["medical_services", "P3K", "Obat pribadi dan perban"],
  ["flashlight_on", "Senter", "Baterai cadangan"],
  ["radio", "Radio", "Baterai atau hand crank"],
  ["battery_charging_full", "Powerbank", "Charger dan kabel"],
  ["folder_shared", "Dokumen", "Wadah tahan air"],
  ["dry_cleaning", "Pakaian", "Pakaian, masker, peluit"],
];

const p3kItems = [
  ["healing", "Perban steril", "Menutup luka dan menjaga kebersihan"],
  ["sanitizer", "Antiseptik", "Membersihkan luka ringan"],
  ["medical_information", "Obat pribadi", "Obat rutin dan resep penting"],
  ["thermometer", "Termometer", "Memantau demam atau kondisi tubuh"],
  ["content_cut", "Gunting kecil", "Memotong kasa, plester, atau kain"],
  ["front_hand", "Sarung tangan", "Melindungi penolong dan korban"],
  ["compress", "Kasa tekan", "Membantu menghentikan perdarahan ringan"],
  ["description", "Catatan medis", "Alergi, golongan darah, kontak dokter"],
];

const quizQuestions = [
  {
    question: "Apa tindakan pertama saat gempa terasa kuat?",
    options: ["Berlari keluar rumah", "Lindungi kepala dan berlindung di tempat aman", "Matikan semua peralatan listrik", "Hubungi petugas segera"],
    answer: 1,
    tip: "Utamakan perlindungan diri sebelum bergerak ke tempat lain.",
  },
  {
    question: "Apa prinsip dasar saat berada di dalam ruangan?",
    options: ["Drop, Cover, Hold", "Run, Call, Wait", "Open, Push, Lift", "Stand, Watch, Record"],
    answer: 0,
    tip: "Merunduk, berlindung, dan berpegangan mengurangi risiko cedera.",
  },
  {
    question: "Mengapa lift harus dihindari setelah gempa?",
    options: ["Lift menjadi terlalu ramai", "Lift bisa macet atau kehilangan daya", "Lift hanya untuk petugas", "Lift memperlambat antrean"],
    answer: 1,
    tip: "Gunakan tangga darurat setelah guncangan berhenti dan jalur aman.",
  },
  {
    question: "Di luar ruangan, area mana yang paling aman?",
    options: ["Dekat kaca gedung", "Di bawah kabel listrik", "Area terbuka jauh dari bangunan", "Dekat tembok pagar"],
    answer: 2,
    tip: "Cari ruang terbuka yang jauh dari benda tinggi dan mudah runtuh.",
  },
  {
    question: "Apa fungsi utama tas siaga 72 jam?",
    options: ["Menyimpan barang dekoratif", "Menjamin kebutuhan dasar pascagempa", "Mengganti semua dokumen rumah", "Membawa alat berat"],
    answer: 1,
    tip: "Tas siaga membantu keluarga bertahan saat bantuan belum tiba.",
  },
  {
    question: "Apa yang perlu dilakukan pada jalur evakuasi keluarga?",
    options: ["Dibiarkan berubah tiap hari", "Dihafalkan satu orang saja", "Ditentukan dan dilatih berkala", "Dipilih setelah gempa terjadi"],
    answer: 2,
    tip: "Rute yang sudah dilatih membuat evakuasi lebih tertib.",
  },
  {
    question: "Kontak luar daerah berguna untuk apa?",
    options: ["Pusat kabar keluarga saat jaringan lokal padat", "Mengganti nomor darurat", "Menyimpan semua password", "Membeli perlengkapan"],
    answer: 0,
    tip: "Kontak luar daerah sering lebih mudah dihubungi saat area terdampak sibuk.",
  },
  {
    question: "Kapan evakuasi keluar bangunan sebaiknya dilakukan?",
    options: ["Saat guncangan masih paling kuat", "Setelah guncangan berhenti dan jalur aman", "Saat semua orang berteriak", "Sebelum melindungi kepala"],
    answer: 1,
    tip: "Bergerak saat guncangan kuat bisa meningkatkan risiko tertimpa atau terjatuh.",
  },
  {
    question: "Apa contoh benda rumah yang perlu diamankan sebelum gempa?",
    options: ["Furnitur tinggi dan barang gantung", "Bantal sofa kecil", "Karpet tipis", "Gelas kosong di meja"],
    answer: 0,
    tip: "Lemari, rak, dan barang gantung dapat jatuh saat guncangan.",
  },
  {
    question: "Sumber informasi gempa sebaiknya diambil dari mana?",
    options: ["Pesan berantai tanpa sumber", "Akun acak yang ramai", "Sumber resmi dan kanal kebencanaan tepercaya", "Komentar anonim"],
    answer: 2,
    tip: "Informasi resmi mengurangi panik dan keputusan yang keliru.",
  },
];

const isInteractiveTarget = (target) =>
  target instanceof Element &&
  target.closest("button, a, input, textarea, select, label, [data-no-drag]");

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const Icon = ({ name, className = "", label }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    aria-hidden={label ? undefined : "true"}
    aria-label={label}
  >
    {name}
  </span>
);

const ProgressBar = ({ value }) => (
  <div className="h-3 overflow-hidden rounded-full bg-[#e8dfcf]" aria-hidden="true">
    <div className="h-full rounded-full bg-[#4a7c59] transition-all duration-300" style={{ width: `${value}%` }} />
  </div>
);

const DetailButton = ({ children, onClick, icon = "chevron_right", className = "" }) => (
  <button
    type="button"
    data-no-drag
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#244832] px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(36,72,50,0.22)] transition hover:-translate-y-0.5 hover:bg-[#356947] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC6D2F] ${className}`}
  >
    {children}
    <Icon name={icon} className="text-lg" />
  </button>
);

const SectionCard = ({ icon, title, children, className = "" }) => (
  <article className={`rounded-[1.6rem] border border-[#d9ccb8] bg-[#fffaf0]/78 p-4 shadow-sm ${className}`}>
    <div className="mb-3 flex items-center gap-2 font-headline text-lg font-extrabold text-[#244832]">
      <Icon name={icon} className="text-2xl text-[#4a7c59]" />
      {title}
    </div>
    {children}
  </article>
);

const HeroCard = ({ panel, activePanel, centerPanel }) => (
  <section
    id="hero"
    data-panel-id="hero"
    className={`hero-card absolute overflow-hidden rounded-[2.35rem] border border-[#d1b985] text-center shadow-[0_44px_92px_rgba(46,50,48,0.28)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_60px_130px_rgba(36,72,50,0.34)] ${
      activePanel === "hero" ? "z-20 ring-8 ring-[#78A886]/25" : "z-10"
    }`}
    style={{
      left: panel.x,
      top: panel.y,
      width: panel.w,
      height: panel.h,
      backgroundImage: `url(${HeroBg})`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    }}
    onPointerDown={(event) => {
      if (!isInteractiveTarget(event.target)) {
        event.stopPropagation();
      }
    }}
  >
    <div className="pointer-events-none absolute right-[20px] top-[3px] z-0 h-[360px] w-[430px] rotate-[0deg]">
      <img src={LogoImage} alt="" className="h-full w-full object-contain drop-shadow-[0_12px_18px_rgba(52,40,21,0.2)]" />
    </div>

    <div className="relative mx-auto flex h-full max-w-[1220px] flex-col items-center px-8 pt-[250px]">
      <p className="text-[1.45rem] font-black uppercase tracking-[0.52em] text-[#4a7c59]">
        Explore - Learn - Prepare
      </p>
      <h1 className="mt-9 max-w-[1120px] font-headline text-[6.7rem] font-black leading-[1.02] text-[#173d2a] drop-shadow-sm">
        Understand Earthquakes.<br />Protect Our Community.
      </h1>
      <div className="mt-8 h-3 w-[460px] max-w-full rounded-full bg-[#c7b27f]" />
      <p className="mt-9 max-w-[920px] text-[1.45rem] font-medium leading-10 text-[#24352d]">
        EduQuake adalah portal interaktif untuk menjelajahi hotspot seismik Yogyakarta, memahami risiko lokal, dan mempraktikkan tindakan aman bersama komunitas.
      </p>
      <div className="mt-12 grid w-full max-w-[1040px] grid-cols-4 divide-x divide-[#c7b27f]">
      {heroFeatures.map(([image, title, text, id]) => (
        <button
          key={title}
          type="button"
          data-no-drag
          onClick={() => centerPanel(id)}
          className="group px-8 text-center transition-all duration-300 hover:-translate-y-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC6D2F]"
        >
          <span className="mx-auto grid h-28 w-28 place-items-center rounded-full border border-[#c7a969] bg-[#fff8e8]/70 transition group-hover:bg-[#fffaf0] group-hover:shadow-lg">
            <img src={image} alt="" className="h-16 w-16 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110" />
          </span>
          <span className="mt-5 block font-headline text-[1.55rem] font-black text-[#173d2a]">{title}</span>
          <span className="mt-3 block text-[1.05rem] leading-7 text-[#263730]">{text}</span>
        </button>
      ))}
      </div>
    <div className="mt-14 flex justify-center gap-10">
      <button
        type="button"
        data-no-drag
        onClick={() => centerPanel("riskmap")}
        className="inline-flex min-w-[430px] items-center justify-center gap-5 rounded-full border-4 border-[#c69a42] bg-[#13452f] px-10 py-5 text-[1.35rem] font-extrabold text-white shadow-[0_12px_26px_rgba(36,72,50,0.3)] transition-all hover:-translate-y-1 hover:bg-[#1d5f42] hover:shadow-xl active:scale-95"
      >
        <Icon name="map" className="text-4xl" />
        Start Exploring Map
        <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#c69a42] text-[#d7ad50]">
          <Icon name="chevron_right" className="text-2xl" />
        </span>
      </button>
      <button
        type="button"
        data-no-drag
        onClick={() => centerPanel("simulation")}
        className="inline-flex min-w-[350px] items-center justify-center gap-5 rounded-full border-4 border-[#173d2a] bg-[#fff8e7]/74 px-10 py-5 text-[1.35rem] font-extrabold text-[#173d2a] transition-all hover:-translate-y-1 hover:bg-[#fffaf0] hover:shadow-lg active:scale-95"
      >
        <Icon name="article" className="text-4xl" />
        View Guidelines
      </button>
    </div>
    </div>
  </section>
);

const BannerPanel = ({ panel, banner, activePanel, onMoveStart }) => (
  <section
    id={banner.id}
    data-panel-id={banner.id}
    aria-label={banner.alt}
    className={`banner absolute cursor-move overflow-hidden rounded-[2rem] shadow-[0_22px_52px_rgba(46,50,48,0.18)] transition duration-300 hover:-translate-y-3 hover:rotate-0 hover:scale-[1.035] hover:shadow-[0_32px_76px_rgba(36,72,50,0.26)] ${
      banner.rotate
    } ${activePanel === banner.id ? "z-20 ring-4 ring-[#78A886]/25" : "z-10"}`}
    style={{ left: panel.x, top: panel.y, width: panel.w, height: panel.h }}
    onPointerDown={(event) => onMoveStart(banner.id, event)}
  >
    <img src={banner.image} alt={banner.alt} className="h-full w-full object-cover" />
  </section>
);

const ModuleShell = ({
  id,
  panel,
  activePanel,
  children,
  meta,
  onMoveStart,
  onOpen,
}) => {
  const subtitle = meta.subtitle ?? "Belajar - Siap - Selamat";
  const compactHeader = id === "simulation";

  return (
    <section
      id={id}
      data-panel-id={id}
      tabIndex={0}
      role="button"
      aria-label={`Open ${meta.title} module detail`}
      onClick={(event) => {
        if (!isInteractiveTarget(event.target)) {
          onOpen(id);
        }
      }}
      onPointerDown={(event) => {
        if (!isInteractiveTarget(event.target)) {
          event.stopPropagation();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(id);
        }
      }}
      className={`module-card absolute overflow-hidden rounded-[2rem] border border-[#d7cab6] bg-[#fffaf0] text-left shadow-[0_24px_62px_rgba(46,50,48,0.16)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_86px_rgba(46,50,48,0.22)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#DC6D2F] ${
        activePanel === id ? "z-20 ring-4 ring-[#78A886]/25" : "z-10"
      }`}
      style={{
        left: panel.x,
        top: panel.y,
        width: panel.w,
        minHeight: panel.h,
      }}
    >
      <div className={`relative overflow-hidden rounded-t-[2rem] ${compactHeader ? "h-[172px]" : "h-[220px]"}`}>
        <img src={meta.header} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className={`module-number-tab absolute left-0 top-0 z-10 flex h-full items-center justify-center ${compactHeader ? "w-[100px]" : "w-[125px]"}`}>
          <span className={`font-headline font-black leading-none text-[#244832] ${compactHeader ? "text-[3.5rem]" : "text-[4.5rem]"}`}>
            {panel.num}
          </span>
        </div>
        <div className={`relative z-10 flex h-full flex-col justify-center pr-28 ${compactHeader ? "ml-[100px]" : "ml-[125px]"}`}>
          <p className={`${compactHeader ? "text-sm" : "text-lg"} font-black uppercase tracking-[0.42em] text-[#f8e0a8]`}>
            Modul
          </p>
          <h2 className={`mt-3 font-headline font-black leading-[0.96] drop-shadow text-[#244832] ${compactHeader ? "text-[2.65rem]" : "text-[3.5rem]"}`}>
            {meta.title}
          </h2>
          <div className={`flex items-center gap-3 font-extrabold drop-shadow text-[#244832] ${compactHeader ? "mt-3 text-[1.15rem]" : "mt-5 text-[1.55rem]"}`}>
            <Icon name={meta.icon} className={compactHeader ? "text-2xl" : "text-3xl"} />
            <span>{subtitle}</span>
          </div>
        </div>
        <button
          type="button"
          data-no-drag
          aria-label={`Move ${meta.title} panel`}
          onPointerDown={(event) => onMoveStart(id, event)}
          className="absolute right-7 top-7 z-20 flex h-16 w-16 cursor-move items-center justify-center rounded-full bg-[#fffaf0] text-[#244832] shadow-[0_12px_28px_rgba(42,36,24,0.22)] transition hover:scale-105 hover:bg-[#244832] hover:text-[#fffaf0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fffaf0]"
        >
          <Icon name="open_with" className="text-3xl" />
        </button>
      </div>
      <div className="relative p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_10%,rgba(120,168,134,0.12),transparent_28%),radial-gradient(circle_at_90%_85%,rgba(220,109,47,0.08),transparent_30%)]" />
        <div className="relative z-10">{children}</div>
      </div>
    </section>
  );
};

const Drawer = ({
  selected,
  onClose,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  position,
}) => {
  if (!selected) return null;

  const zone = selected.context?.zone;
  const base = moduleMeta[selected.id] ?? moduleMeta.about;
  const content = zone
    ? {
        ...base,
        drawerTitle: `${zone.name}: ${zone.risk}`,
        drawerKicker: "Profil zona dan rekomendasi",
        image: zone.map,
        progress: zone.name === "Bantul" ? 35 : zone.name === "Sleman" ? 55 : 75,
        sections: [
          { icon: "info", title: "Ancaman utama", body: zone.text },
          { icon: "checklist", title: "Rekomendasi kesiapsiagaan", list: zone.instructions },
        ],
      }
    : base;

  return (
    <>
      <button
        type="button"
        data-no-drag
        aria-label="Close module detail overlay"
        onClick={onClose}
        className="absolute inset-0 z-30 cursor-default bg-[#1b241f]/20 backdrop-blur-[1px]"
      />
      <aside
        data-no-drag
        role="dialog"
        aria-modal="true"
        aria-labelledby="module-drawer-title"
        className="absolute z-40 flex max-h-[calc(100vh-8rem)] w-[460px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[2rem] border border-[#d7cab6] bg-[#fffaf0]/96 shadow-[0_34px_90px_rgba(20,30,24,0.28)] backdrop-blur-xl"
        style={{ left: position.x, top: position.y }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="cursor-move border-b border-[#dfd3bf] bg-[#fff8ea] p-5" onPointerDown={onPointerDown}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6f2df] text-[#244832]">
                <Icon name={content.icon} className="text-3xl" />
              </span>
              <div>
                <p className="text-sm font-extrabold text-[#4a7c59]">{content.drawerKicker}</p>
                <h2 id="module-drawer-title" className="font-headline text-2xl font-extrabold text-[#244832]">
                  {content.drawerTitle}
                </h2>
              </div>
            </div>
            <button
              type="button"
              data-no-drag
              aria-label="Close module detail"
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#244832] shadow-sm transition hover:bg-[#244832] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC6D2F]"
            >
              <Icon name="close" className="text-xl" />
            </button>
          </div>
          <div className="mt-5 grid grid-cols-[1fr_4rem] items-center gap-4">
            <ProgressBar value={content.progress} />
            <p className="text-right font-headline text-2xl font-extrabold text-[#4a7c59]">{content.progress}%</p>
          </div>
        </div>
        <div className="mading-scroll overflow-y-auto p-5">
          <img src={content.image} alt="" className="mb-5 aspect-[1.55] w-full rounded-3xl border border-[#dfd3bf] object-cover shadow-sm" />
          <div className="space-y-4">
            {content.sections.map((section) => (
              <SectionCard key={section.title} icon={section.icon} title={section.title}>
                {section.body && <p className="text-sm leading-6 text-[#344039]">{section.body}</p>}
                {section.list && (
                  <ul className="space-y-2 text-sm leading-6 text-[#344039]">
                    {section.list.map((item) => (
                      <li key={item} className="flex gap-2">
                        <Icon name="check_circle" className="mt-0.5 text-lg text-[#4a7c59]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </SectionCard>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

const AboutBoard = () => (
  <div className="grid gap-7 md:grid-cols-[1.72fr_1fr]">
    <div className="overflow-hidden rounded-[1.55rem] border border-[#d7b979] bg-[#fffaf0]/88 p-3">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.25rem]">
        <img src={ClassIllustrationTwo} alt="Kelas kesiapsiagaan gempa" className="absolute inset-0 h-full w-full object-cover" />
        <a
          href="/simulation"
          data-no-drag
          className="absolute bottom-6 right-6 inline-flex items-center gap-2 rounded-full border border-[#244832]/20 bg-[#fffaf0]/92 px-5 py-3 text-sm font-extrabold text-[#244832] shadow-md backdrop-blur transition hover:-translate-y-0.5 hover:bg-[#244832] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC6D2F]"
        >
          <Icon name="play_arrow" className="text-xl" />
          Simulasi
        </a>
      </div>
      <div className="mt-4 grid grid-cols-4 divide-x divide-dashed divide-[#d5b879] rounded-[1.25rem] border border-[#d7b979] bg-[#fff8ea]/92 px-4 py-5">
        {[
          ["map", "Peta Interaktif", "Lihat potensi gempa dan fasilitas penting di Yogyakarta."],
          ["menu_book", "Belajar", "Modul pembelajaran ringkas, jelas, dan mudah dipahami."],
          ["health_and_safety", "Aksi Aman", "Panduan praktis langkah aman untuk semua situasi."],
          ["groups", "Komunitas", "Bergabung, berdiskusi, dan berbagi untuk komunitas tangguh."],
        ].map(([icon, title, text]) => (
          <article key={title} className="px-4 text-center">
            <Icon name={icon} className="text-5xl text-[#4a7c39]" />
            <h4 className="mt-2 font-headline text-xl font-black text-[#244832]">{title}</h4>
            <p className="mt-1 text-sm leading-5 text-[#344039]">{text}</p>
          </article>
        ))}
      </div>
    </div>
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[1.55rem] border border-[#d7b979] bg-[#fffaf0]">
        <div className="flex items-center gap-4 bg-[#244832] px-7 py-5 text-[#fffaf0]">
          <span className="grid h-14 w-14 place-items-center rounded-full border-2 border-[#fffaf0]">
            <Icon name="groups" className="text-3xl" />
          </span>
          <div>
            <h3 className="font-headline text-3xl font-black">Belajar Bersama</h3>
            <p className="mt-1 text-sm font-semibold text-[#f8e0a8]">Pengetahuan hari ini, keselamatan esok hari.</p>
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-dashed divide-[#d5b879] px-6 py-6 text-center">
          {[
            ["location_on", "Kenali Risiko", "Pahami potensi gempa di sekitar kita."],
            ["verified_user", "Siap & Tanggap", "Pelajari langkah aman sebelum, saat, dan sesudah gempa."],
            ["diversity_3", "Selamatkan Nyawa", "Aksi sederhana hari ini, selamatkan banyak nyawa."],
          ].map(([icon, title, text]) => (
            <article key={title} className="px-3">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#d7b979] bg-[#f8e0a8]/45 text-[#4a7c39]">
                <Icon name={icon} className="text-4xl" />
              </span>
              <h4 className="mt-4 font-headline text-lg font-black text-[#244832]">{title}</h4>
              <p className="mt-2 text-sm leading-5 text-[#344039]">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="rounded-[1.55rem] border border-[#d7b979] bg-[#f8e0a8]/36 p-6">
        <div className="mb-5 flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-[#b85e19] text-white">
            <Icon name="assignment" className="text-3xl" />
          </span>
          <h3 className="font-headline text-3xl font-black text-[#244832]">Langkah Awalmu</h3>
        </div>
        <ol className="space-y-5">
          {[
            "Jelajahi modul dan materi pembelajaran yang tersedia di portal.",
            "Ikuti simulasi untuk meningkatkan pemahaman dan kesiapsiagaan.",
            "Bagikan pengetahuan ini dan ajak komunitasmu untuk belajar bersama.",
          ].map((step, index) => (
            <li key={step} className="grid grid-cols-[3.4rem_1fr] gap-4 border-b border-dashed border-[#d5b879] pb-4 last:border-0 last:pb-0">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#244832] font-headline text-2xl font-black text-white">{index + 1}</span>
              <span className="text-base leading-7 text-[#344039]">{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  </div>
);

const SimulationBoard = ({ openDrawer }) => (
  <div className="space-y-7">
    <div className="grid gap-7 md:grid-cols-[2.35fr_0.95fr]">
      <section className="rounded-[1.55rem] border border-[#d7b979] bg-[#fffaf0]/82 p-8">
        <div className="grid grid-cols-2 gap-6">
          {[
            [InteractiveMapIcon, "Interactive Map", "Jelajahi zona risiko dan sesar aktif."],
            [LearnStimulateIcon, "Learn & Simulate", "Belajar melalui skenario dan simulasi."],
            [TakeActionIcon, "Take Action", "Ikuti langkah kesiapsiagaan praktis."],
            [CommunityFirstIcon, "Community First", "Bangun budaya aman bersama keluarga dan sekolah."],
          ].map(([image, title, text]) => (
            <article key={title} className="grid min-h-[196px] grid-cols-[132px_1fr] items-center gap-5 rounded-[1.2rem] border border-[#d7b979] bg-[#fffaf0]/95 p-5 shadow-[0_8px_18px_rgba(90,65,30,0.08)]">
              <span className="grid h-32 w-32 place-items-center overflow-hidden rounded-full border-2 border-[#d7b979] bg-[#f8e0a8]/34">
                <img src={image} alt="" className="h-24 w-24 object-contain" />
              </span>
              <div>
                <h3 className="font-headline text-[1.65rem] font-black leading-tight text-[#244832]">{title}</h3>
                <p className="mt-2 text-[1.08rem] leading-7 text-[#2e3230]">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <aside className="overflow-hidden rounded-[1.55rem] border border-[#d7b979] bg-[#fffaf0]">
        <div className="bg-[#244832] px-7 py-4 text-[#fffaf0]">
          <h3 className="font-headline text-2xl font-black">How it Works?</h3>
        </div>
        <div className="space-y-7 px-8 py-8">
          {[
            "Pilih modul",
            "Buka detail",
            "Pelajari dan praktikkan",
          ].map((text, index) => (
            <button key={text} type="button" data-no-drag onClick={() => index === 1 && openDrawer("simulation")} className="grid w-full grid-cols-[4.5rem_1fr] items-center gap-5 border-b border-dashed border-[#d5b879] pb-7 text-left last:border-0 last:pb-0">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[#244832] font-headline text-3xl font-black text-white">{index + 1}</span>
              <span className="text-[1.35rem] font-semibold leading-8 text-[#2e3230]">{text}</span>
            </button>
          ))}
        </div>
      </aside>
    </div>
    <div className="grid grid-cols-3 divide-x divide-dashed divide-[#d5b879] rounded-[1.55rem] border border-[#d7b979] bg-[#fff8ea]/92 px-9 py-5">
      {[
        ["touch_app", "Interaktif"],
        ["tips_and_updates", "Mudah Dipahami"],
        ["groups", "Berbasis Komunitas"],
      ].map(([icon, title]) => (
        <div key={title} className="flex items-center justify-center gap-5">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-[#4a7c39] text-[#fffaf0]">
            <Icon name={icon} className="text-4xl" />
          </span>
          <span className="text-2xl font-black text-[#244832]">{title}</span>
        </div>
      ))}
    </div>
  </div>
);

const RiskMapBoard = ({ openDrawer }) => {
  const [query, setQuery] = useState("");
  const normalized = query.toLowerCase().trim();
  const matchedZone = hotspotZones.find((zone) =>
    zone.aliases.some((alias) => normalized.includes(alias)),
  );
  const currentImage = matchedZone?.map ?? SeismicMap;
  const activeZone = matchedZone;

  return (
    <div className="grid gap-7 md:grid-cols-[2.05fr_1.15fr]">
      <section className="rounded-[1.55rem] border border-[#d7b979] bg-[#fffaf0]/82 p-5">
        <div className="relative min-h-[480px] overflow-hidden rounded-[1.35rem]">
          <img src={currentImage} alt="Peta risiko Yogyakarta" className="absolute inset-0 h-full w-full object-cover" />
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 860 520" aria-hidden="true">
            <path d="M250 105 C340 182 395 254 470 330 S610 438 712 470" fill="none" stroke="#8b5d25" strokeWidth="5" strokeDasharray="16 13" opacity="0.75" />
            <path d="M310 58 C365 140 445 220 540 315 S660 430 760 492" fill="none" stroke="#8b5d25" strokeWidth="4" strokeDasharray="14 12" opacity="0.56" />
            <path d="M320 70 C350 140 383 220 430 288" fill="none" stroke="#3d9ca8" strokeWidth="4" opacity="0.75" />
            <path d="M560 115 C590 195 640 270 705 340" fill="none" stroke="#3d9ca8" strokeWidth="4" opacity="0.68" />
          </svg>
          <div className="absolute left-7 top-[33%] rounded-[1.1rem] border border-[#d7b979] bg-[#fffaf0]/90 p-5 shadow-sm">
            <h3 className="font-headline text-xl font-black text-[#244832]">Legenda</h3>
            <div className="mt-4 space-y-3 text-sm font-semibold text-[#2e3230]">
              {[["#c94f30", "Risiko Tinggi"], ["#e4a62a", "Risiko Sedang"], ["#6e8b4d", "Risiko Rendah"]].map(([color, label]) => (
                <div key={label} className="flex items-center gap-3"><span className="h-6 w-8 rounded" style={{ background: color }} />{label}</div>
              ))}
              <div className="flex items-center gap-3"><span className="h-1 w-9 rounded bg-[#8b5d25]" />Sesar</div>
              <div className="flex items-center gap-3"><span className="h-1 w-9 rounded bg-[#3d9ca8]" />Sungai</div>
            </div>
          </div>
          <Icon name="explore" className="absolute right-10 top-8 text-6xl text-[#8b5d25]" />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-5">
          {hotspotZones.map((zone) => (
            <button
              key={zone.name}
              type="button"
              data-no-drag
              onClick={() => setQuery(zone.name)}
              className={`rounded-[1.1rem] border p-5 text-left transition hover:-translate-y-1 hover:shadow-md ${
                activeZone?.name === zone.name ? "border-[#4a7c39] bg-[#e6f2df]" : "border-[#d7b979] bg-[#fff8ea]"
              }`}
            >
              <span className="mb-3 grid h-14 w-14 place-items-center rounded-full text-white" style={{ background: zone.color }}>
                <Icon name={zone.name === "Bantul" ? "home" : zone.name === "Sleman" ? "landscape" : "directions_run"} className="text-3xl" />
              </span>
              <h3 className="font-headline text-2xl font-black text-[#244832]">{zone.name}</h3>
              <p className="mt-1 text-base leading-6 text-[#344039]">{zone.text}</p>
            </button>
          ))}
        </div>
      </section>
      <aside className="space-y-5">
        <section className="overflow-hidden rounded-[1.55rem] border border-[#d7b979] bg-[#fffaf0]">
          <div className="flex items-center gap-4 bg-[#244832] px-7 py-5 text-[#fffaf0]">
            <span className="grid h-14 w-14 place-items-center rounded-full border-2 border-[#fffaf0]">
              <Icon name="map" className="text-3xl" />
            </span>
            <h3 className="font-headline text-3xl font-black">Legenda Peta</h3>
          </div>
          <div className="space-y-5 p-7">
            {[["#c94f30", "Risiko Tinggi", "Potensi bahaya besar, dampak tinggi."], ["#e4a62a", "Risiko Sedang", "Potensi bahaya sedang, dampak sedang."], ["#6e8b4d", "Risiko Rendah", "Potensi bahaya kecil, dampak rendah."]].map(([color, title, text]) => (
              <div key={title} className="grid grid-cols-[3.5rem_1fr] gap-4">
                <span className="mt-1 h-8 w-12 rounded" style={{ background: color }} />
                <div>
                  <h4 className="text-xl font-black text-[#244832]">{title}</h4>
                  <p className="text-base leading-6 text-[#344039]">{text}</p>
                </div>
              </div>
            ))}
            <div className="border-t border-dashed border-[#d5b879] pt-5">
              <div className="grid grid-cols-[3.5rem_1fr] gap-4"><span className="mt-3 h-1 w-12 rounded bg-[#8b5d25]" /><p><b className="text-[#244832]">Sesar</b><br />Patahan atau rekahan bumi.</p></div>
              <div className="mt-4 grid grid-cols-[3.5rem_1fr] gap-4"><span className="mt-3 h-1 w-12 rounded bg-[#3d9ca8]" /><p><b className="text-[#244832]">Sungai</b><br />Aliran air utama.</p></div>
            </div>
          </div>
        </section>
        <section className="rounded-[1.55rem] border border-[#d7b979] bg-[#f8e0a8]/38 p-7">
          <div className="mb-5 flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-[#8b6b32] text-white">
              <Icon name="tips_and_updates" className="text-3xl" />
            </span>
            <h3 className="font-headline text-3xl font-black text-[#244832]">Tips Membaca Peta</h3>
          </div>
          <ol className="space-y-4 text-base leading-6 text-[#344039]">
            {["Perhatikan warna untuk tingkat risiko di setiap wilayah.", "Amati sesar dan sungai yang dapat memengaruhi bahaya.", "Gunakan peta untuk rencana kesiapsiagaan dan evakuasi."].map((tip, index) => (
              <li key={tip} className="grid grid-cols-[2.7rem_1fr] gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#244832] font-headline text-xl font-black text-white">{index + 1}</span>
                <span>{tip}</span>
              </li>
            ))}
          </ol>
          {activeZone && (
            <DetailButton onClick={() => openDrawer("riskmap", { zone: activeZone })} icon="open_in_new" className="mt-6 w-full">
              Buka detail {activeZone.name}
            </DetailButton>
          )}
        </section>
      </aside>
    </div>
  );
};

const KitBoard = () => {
  const [checked, setChecked] = useState(() => new Set());
  const [kitMode, setKitMode] = useState("kit");
  const currentItems = kitMode === "p3k" ? p3kItems : kitItems;
  const progress = Math.round((checked.size / (kitItems.length + p3kItems.length)) * 100);

  const toggleItem = (title) => {
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  return (
    <div className="grid gap-5 md:grid-cols-[0.92fr_1.08fr]">
      <div className="rounded-[1.8rem] border border-[#d9ccb8] bg-[#fffaf0]/80 p-4">
        <div className="mb-4 grid grid-cols-2 gap-2" data-no-drag>
          {[
            ["kit", "Tas 72 Jam"],
            ["p3k", "Detail P3K"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setKitMode(id)}
              className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
                kitMode === id ? "bg-[#244832] text-white" : "bg-[#fff8ea] text-[#244832] hover:bg-[#e6f2df]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <img
          src={kitMode === "p3k" ? P3KImage : KitImage}
          alt={kitMode === "p3k" ? "Perlengkapan P3K" : "Tas siaga 72 jam"}
          className="aspect-[1.12] w-full rounded-[1.6rem] object-cover"
        />
        <p className="mt-4 text-sm leading-6 text-[#344039]">
          {kitMode === "p3k"
            ? "P3K adalah bagian khusus dalam tas siaga untuk membersihkan luka ringan, menekan perdarahan, menyimpan obat pribadi, dan membantu pertolongan awal sebelum bantuan medis tiba."
            : "Tas siaga 72 jam adalah paket kebutuhan dasar agar keluarga tetap punya air, makanan, obat, penerangan, komunikasi, dan dokumen penting minimal tiga hari setelah gempa."}
        </p>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-3">
          {currentItems.map(([icon, title, meta]) => (
            <label key={title} data-no-drag className="group relative flex cursor-pointer gap-3 rounded-[1.5rem] border border-[#d9ccb8] bg-[#fffaf0]/84 p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <input
                type="checkbox"
                checked={checked.has(title)}
                onChange={() => toggleItem(title)}
                className="mt-1 h-5 w-5 accent-[#4a7c59]"
              />
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e6f2df] text-[#244832]">
                <Icon name={icon} className="text-2xl" />
              </span>
              <span>
                <span className="block font-headline text-lg font-extrabold text-[#244832]">{title}</span>
                <span className="mt-1 block text-sm leading-5 text-[#4a4e4a]">{meta}</span>
              </span>
            </label>
          ))}
        </div>
        <div className="mt-5 rounded-[1.6rem] border border-[#d9ccb8] bg-[#fff8ea] p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-headline text-2xl font-extrabold text-[#244832]">Progress kit siap</p>
            <p className="font-headline text-3xl font-extrabold text-[#4a7c59]">{progress}%</p>
          </div>
          <ProgressBar value={progress} />
        </div>
      </div>
    </div>
  );
};

const EvacuationBoard = () => (
  <div className="space-y-6">
    <div className="grid gap-7 md:grid-cols-[2.15fr_1fr]">
      <section className="overflow-hidden rounded-[1.55rem] border border-[#d7b979] bg-[#fffaf0]/82 p-4">
        <img src={RoutesImage} alt="Grafis jalur evakuasi" className="h-[572px] w-full rounded-[1.25rem] object-cover" />
      </section>
      <aside className="space-y-5">
        <section className="overflow-hidden rounded-[1.55rem] border border-[#d7b979] bg-[#fffaf0]">
          <div className="flex items-center gap-4 bg-[#f4e4c6] px-6 py-5">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#244832] text-white">
              <Icon name="assignment" className="text-3xl" />
            </span>
            <h3 className="font-headline text-3xl font-black text-[#244832]">Langkah-langkah</h3>
          </div>
          <ol className="space-y-5 px-7 py-6">
            {["Kenali rute dari rumah dan sekolah", "Pilih area terbuka yang aman", "Latih jalur secara berkala"].map((step, index) => (
              <li key={step} className="grid grid-cols-[3.4rem_1fr] gap-4 border-b border-dashed border-[#d5b879] pb-5 last:border-0 last:pb-0">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#244832] font-headline text-2xl font-black text-white">{index + 1}</span>
                <span className="text-xl leading-8 text-[#2e3230]">{step}</span>
              </li>
            ))}
          </ol>
        </section>
        <section className="rounded-[1.55rem] border border-[#d7b979] bg-[#dfe2c8]/72 p-6">
          <div className="mb-5 flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-[#4a7c39] text-white">
              <Icon name="tips_and_updates" className="text-3xl" />
            </span>
            <h3 className="font-headline text-3xl font-black text-[#244832]">Tips</h3>
          </div>
          <div className="space-y-4 text-xl text-[#2e3230]">
            {["Tandai jalur darurat", "Tetapkan titik kumpul keluarga"].map((tip) => (
              <p key={tip} className="flex items-center gap-4">
                <Icon name="check_circle" className="text-4xl text-[#4a7c39]" />
                {tip}
              </p>
            ))}
          </div>
        </section>
      </aside>
    </div>
    <div className="flex items-center gap-5 rounded-[1.25rem] border border-[#d7b979] bg-[#fff8ea]/92 px-7 py-5">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-[#4a7c39] text-[#fffaf0]">
        <Icon name="track_changes" className="text-4xl" />
      </span>
      <p className="text-[1.35rem] leading-8 text-[#2e3230]">
        <b className="font-headline text-2xl font-black text-[#244832]">Tujuan:</b> Memastikan setiap anggota keluarga mengetahui jalur evakuasi dan titik kumpul yang aman.
      </p>
    </div>
  </div>
);

const CommunicationBoard = () => (
  <div className="grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
    <div className="overflow-hidden rounded-[1.8rem] border border-[#d9ccb8] bg-[#fffaf0]/78 p-4">
      <img
        src={CommunicationImage}
        alt="Infografis komunikasi keluarga darurat"
        className="aspect-[1.15] w-full rounded-[1.4rem] object-cover"
      />
    </div>
    <div className="space-y-5">
      <SectionCard icon="call" title="Kontak Luar Daerah">
        <p className="text-sm leading-6 text-[#344039]">
          Satu kontak di luar area terdampak menjadi pusat kabar keluarga saat jaringan lokal padat.
        </p>
      </SectionCard>
      <SectionCard icon="format_list_numbered" title="Langkah-langkah" className="bg-[#f6ead6]/80">
        <ol className="space-y-3 text-sm leading-6 text-[#344039]">
          {["Tentukan kontak luar daerah.", "Buat grup keluarga untuk status singkat.", "Gunakan SMS saat telepon dan internet padat."].map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#244832] font-headline text-xl font-extrabold text-white">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </SectionCard>
      <SectionCard icon="emergency" title="Nomor darurat">
        <div className="grid grid-cols-3 gap-2 text-center text-sm font-extrabold text-[#244832]">
          {["BNPB 117", "Pemadam 113", "Polisi 110"].map((item) => (
            <span key={item} className="rounded-2xl bg-[#fff8ea] p-3">{item}</span>
          ))}
        </div>
      </SectionCard>
    </div>
  </div>
);

const ProtocolBoard = () => (
  <div className="overflow-hidden rounded-[1.8rem] border border-[#d9ccb8] bg-[#fffaf0]/80 p-4">
    <img
      src={HarianImage}
      alt="Infografis protokol keselamatan harian"
      className="aspect-[1448/1086] w-full rounded-[1.4rem] object-cover"
    />
  </div>
);

const SeismicBoard = () => (
  <div className="overflow-hidden rounded-[1.8rem] border border-[#d9ccb8] bg-[#fffaf0]/80 p-4">
    <img
      src={InfographicImage}
      alt="Infografis fakta seismik Yogyakarta"
      className="aspect-[1448/907] w-full rounded-[1.4rem] object-cover"
    />
  </div>
);

const QuizBoard = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const question = quizQuestions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];
  const score = quizQuestions.reduce((total, item, index) => total + (answers[index] === item.answer ? 1 : 0), 0);
  const answeredCount = Object.keys(answers).length;

  return (
  <div className="grid gap-7 md:grid-cols-[1.18fr_1fr]">
    <section className="rounded-[1.55rem] border border-[#d7b979] bg-[#fffaf0]/82 p-8">
      <div className="flex items-center justify-between border-b border-[#d7b979] pb-5">
        <div className="flex items-center gap-5">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-[#244832] text-[#fffaf0]">
            <Icon name="assignment" className="text-4xl" />
          </span>
          <div>
            <h3 className="font-headline text-3xl font-black text-[#244832]">Kuis Mini</h3>
            <p className="text-xl text-[#2e3230]">Uji pemahaman Anda</p>
          </div>
        </div>
        <span className="rounded-xl border border-[#d7b979] bg-[#fff8ea] px-6 py-2 font-headline text-[2.4rem] font-black leading-none text-[#4a7c39]">{score}/10</span>
      </div>
      <div className="mt-5 flex items-center gap-4">
        <div className="flex flex-1 items-center gap-3">
          {quizQuestions.map((item, index) => {
            const isAnswered = answers[index] !== undefined;
            const isCorrect = answers[index] === item.answer;
            return (
              <button
                key={item.question}
                type="button"
                data-no-drag
                aria-label={`Buka soal ${index + 1}`}
                onClick={() => setCurrentQuestion(index)}
                className={`h-5 w-5 rounded-full border-2 transition ${currentQuestion === index ? "scale-125 border-[#244832]" : ""} ${
                  isAnswered ? (isCorrect ? "bg-[#4a7c39] border-[#244832]" : "bg-[#dc6d2f] border-[#b85e19]") : "border-[#c9aa68] bg-[#fffaf0]"
                }`}
              />
            );
          })}
        </div>
        <span className="text-xl font-semibold text-[#2e3230]">{answeredCount} dari 10</span>
      </div>
      <div className="mt-5">
        <div className="flex items-center gap-5">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#4a7c39] font-headline text-2xl font-black text-white">{currentQuestion + 1}</span>
          <h4 className="font-headline text-2xl font-black text-[#244832]">{question.question}</h4>
        </div>
        <div className="mt-5 space-y-3">
          {question.options.map((text, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = question.answer === index;
            const showCorrect = selectedAnswer !== undefined && isCorrect;
            const showWrong = isSelected && !isCorrect;
            return (
              <button
                key={text}
                type="button"
                data-no-drag
                onClick={() => setAnswers((current) => ({ ...current, [currentQuestion]: index }))}
                className={`grid w-full grid-cols-[3rem_3rem_1fr] items-center rounded-xl border px-5 py-4 text-left text-[1.22rem] transition hover:bg-[#fff8ea] ${
                  showCorrect ? "border-[#4a7c39] bg-[#e6f2df]" : showWrong ? "border-[#dc6d2f] bg-[#fce8d9]" : "border-[#d7b979] bg-[#fffaf0]/82"
                }`}
              >
                <span className={`grid h-8 w-8 place-items-center rounded-full border-2 ${
                  showCorrect ? "border-[#4a7c39] bg-[#4a7c39] text-white" : showWrong ? "border-[#dc6d2f] bg-[#dc6d2f] text-white" : "border-[#d7b979] text-transparent"
                }`}>
                  {(showCorrect || showWrong) && <Icon name={showCorrect ? "check" : "close"} className="text-2xl" />}
                </span>
                <b>{String.fromCharCode(65 + index)}.</b>
                <span>{text}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-5 grid grid-cols-[4.8rem_1fr] items-center rounded-xl border border-[#d7b979] bg-[#efe9cd]/72 px-6 py-5">
          <Icon name="tips_and_updates" className="text-5xl text-[#4a7c39]" />
          <p className="text-lg leading-7 text-[#2e3230]"><b>Tip:</b> {question.tip}</p>
        </div>
        <div className="mt-5 flex justify-between gap-4">
          <button type="button" data-no-drag disabled={currentQuestion === 0} onClick={() => setCurrentQuestion((current) => Math.max(0, current - 1))} className="inline-flex items-center gap-2 rounded-full border border-[#d7b979] bg-[#fffaf0] px-5 py-3 font-extrabold text-[#244832] transition hover:bg-[#e6f2df] disabled:cursor-not-allowed disabled:opacity-45">
            <Icon name="chevron_left" className="text-xl" />
            Sebelumnya
          </button>
          <button type="button" data-no-drag disabled={currentQuestion === quizQuestions.length - 1} onClick={() => setCurrentQuestion((current) => Math.min(quizQuestions.length - 1, current + 1))} className="inline-flex items-center gap-2 rounded-full bg-[#244832] px-5 py-3 font-extrabold text-white transition hover:bg-[#356947] disabled:cursor-not-allowed disabled:opacity-45">
            Berikutnya
            <Icon name="chevron_right" className="text-xl" />
          </button>
        </div>
      </div>
    </section>
    <aside className="space-y-5">
      <section className="rounded-[1.55rem] border border-[#d7b979] bg-[#fffaf0]/82 p-8">
        <div className="mb-6 flex items-center gap-5">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-[#244832] text-[#fffaf0]">
            <Icon name="menu_book" className="text-4xl" />
          </span>
          <div>
            <h3 className="font-headline text-3xl font-black text-[#244832]">Materi Lanjutan</h3>
            <p className="text-xl text-[#2e3230]">Perdalam pengetahuan Anda</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {[
            ["article", "Artikel", "Baca artikel terkait", "#4a7c39"],
            ["play_arrow", "Video", "Tonton video edukatif", "#b85e19"],
            ["bar_chart", "Infografik", "Lihat infografik penting", "#1f6b8c"],
            ["auto_stories", "Panduan", "Unduh panduan praktis", "#c49016"],
          ].map(([icon, title, text, color]) => (
            <button key={title} type="button" data-no-drag className="grid min-h-[116px] grid-cols-[4rem_1fr_1.5rem] items-center gap-3 rounded-xl border border-[#d7b979] bg-[#fffaf0]/88 p-3 text-left transition hover:-translate-y-1 hover:shadow-md">
              <span className="grid h-14 w-14 place-items-center rounded-full text-white" style={{ background: color }}>
                <Icon name={icon} className="text-3xl" />
              </span>
              <span>
                <span className="block font-headline text-[1.35rem] font-black leading-tight text-[#244832]">{title}</span>
                <span className="mt-1 block text-base leading-5 text-[#2e3230]">{text}</span>
              </span>
              <Icon name="chevron_right" className="text-2xl text-[#244832]" />
            </button>
          ))}
        </div>
      </section>
      <section className="rounded-[1.55rem] border border-[#d7b979] bg-[#fffaf0]/82 p-8">
        <div className="mb-5 flex items-center gap-5">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-[#244832] text-[#fffaf0]">
            <Icon name="school" className="text-4xl" />
          </span>
          <div>
            <h3 className="font-headline text-3xl font-black text-[#244832]">Lanjut Belajar</h3>
            <p className="text-xl text-[#2e3230]">Rekomendasi untuk Anda</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-[#d7b979] bg-[#fff8ea]">
          {["Ulangi modul jalur evakuasi", "Buka materi kesiapsiagaan keluarga"].map((item, index) => (
            <button key={item} type="button" data-no-drag className="grid w-full grid-cols-[3rem_1fr_2rem] items-center border-b border-[#d7b979] px-5 py-4 text-left text-xl text-[#2e3230] last:border-0">
              <Icon name={index === 0 ? "sync" : "diversity_3"} className="text-3xl text-[#4a7c39]" />
              <span>{item}</span>
              <Icon name="chevron_right" className="text-3xl text-[#244832]" />
            </button>
          ))}
        </div>
      </section>
    </aside>
  </div>
  );
};

const LandingPage = () => {
  const viewportRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const modulePanelsRef = useRef(DEFAULT_PANELS);
  const dragRef = useRef({ active: false, panelId: null, lastX: 0, lastY: 0, lastTime: 0 });
  const drawerDragRef = useRef({ active: false, lastX: 0, lastY: 0 });

  const [activePanel, setActivePanel] = useState("hero");
  const [selectedDrawer, setSelectedDrawer] = useState(null);
  const [drawerPosition, setDrawerPosition] = useState({ x: 24, y: 104 });
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [dragSignal, setDragSignal] = useState(0);
  const [modulePanels, setModulePanels] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!saved) return DEFAULT_PANELS;
      const parsed = JSON.parse(saved);
      return DEFAULT_PANELS.map((defaultPanel) => ({
        ...defaultPanel,
        ...(defaultPanel.id === "hero" ? {} : (parsed.find((panel) => panel.id === defaultPanel.id) ?? {})),
      }));
    } catch {
      return DEFAULT_PANELS;
    }
  });

  const panelById = useMemo(() => Object.fromEntries(modulePanels.map((panel) => [panel.id, panel])), [modulePanels]);
  const getPanel = useCallback((id) => panelById[id] ?? DEFAULT_PANELS.find((panel) => panel.id === id), [panelById]);

  useEffect(() => {
    modulePanelsRef.current = modulePanels;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(modulePanels));
  }, [modulePanels]);

  const getBounds = useCallback(() => {
    const viewport = viewportRef.current;
    const width = viewport?.clientWidth ?? window.innerWidth;
    const height = viewport?.clientHeight ?? window.innerHeight;
    return { minX: width - CANVAS.width, maxX: 0, minY: height - CANVAS.height, maxY: 0, width, height };
  }, []);

  const applyPosition = useCallback(() => {
    const canvas = canvasRef.current;
    const bounds = getBounds();
    positionRef.current.x = clamp(positionRef.current.x, bounds.minX, bounds.maxX);
    positionRef.current.y = clamp(positionRef.current.y, bounds.minY, bounds.maxY);
    if (canvas) canvas.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0)`;
    const centerX = -positionRef.current.x + bounds.width / 2;
    const centerY = -positionRef.current.y + bounds.height / 2;
    const nearest = modulePanelsRef.current.reduce((current, panel) => {
      const distance = Math.hypot(centerX - (panel.x + panel.w / 2), centerY - (panel.y + panel.h / 2));
      return distance < current.distance ? { id: panel.id, distance } : current;
    }, { id: "hero", distance: Infinity });
    setActivePanel((current) => (current === nearest.id ? current : nearest.id));
  }, [getBounds]);

  const stopMomentum = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const animateMomentum = useCallback(function momentumStep() {
    positionRef.current.x += velocityRef.current.x;
    positionRef.current.y += velocityRef.current.y;
    velocityRef.current.x *= 0.92;
    velocityRef.current.y *= 0.92;
    applyPosition();
    if (Math.abs(velocityRef.current.x) > 0.08 || Math.abs(velocityRef.current.y) > 0.08) {
      rafRef.current = requestAnimationFrame(momentumStep);
    } else {
      rafRef.current = null;
    }
  }, [applyPosition]);

  const centerPanel = useCallback((panelId) => {
    const panel = getPanel(panelId);
    const bounds = getBounds();
    if (!panel) return;
    stopMomentum();
    positionRef.current = {
      x: bounds.width / 2 - panel.x - panel.w / 2,
      y: bounds.height / 2 - panel.y - panel.h / 2,
    };
    velocityRef.current = { x: 0, y: 0 };
    applyPosition();
  }, [applyPosition, getBounds, getPanel]);

  const openDrawer = useCallback((id, context = {}) => {
    if (id === "hero") return;
    const width = viewportRef.current?.clientWidth ?? window.innerWidth;
    setDrawerPosition({ x: Math.max(16, width - 492), y: 104 });
    setSelectedDrawer({ id, context });
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const heroPanel = modulePanelsRef.current.find((panel) => panel.id === "hero") ?? DEFAULT_PANELS[0];
      const bounds = getBounds();
      positionRef.current = {
        x: bounds.width / 2 - heroPanel.x - heroPanel.w / 2,
        y: bounds.height / 2 - heroPanel.y - heroPanel.h / 2,
      };
      velocityRef.current = { x: 0, y: 0 };
      applyPosition();
    });
    const onResize = () => applyPosition();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      stopMomentum();
    };
  }, [applyPosition, getBounds]);

  // Update Tab Browser: Judul dan Icon Gunung
  useEffect(() => {
    document.title = "EduQuake | Lindungi Komunitas";
    
    // Mengganti favicon secara dinamis dengan emoji gunung (🏔️)
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'shortcut icon';
    link.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏔️</text></svg>';
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  const resetPositions = () => {
    if (confirm("Reset posisi semua modul ke pengaturan awal?")) setModulePanels(DEFAULT_PANELS);
  };

  const shufflePanels = () => {
    const heroPanel = DEFAULT_PANELS.find((panel) => panel.id === "hero");
    setModulePanels((current) =>
      current.map((panel) => {
        if (panel.id === "hero") return heroPanel ?? panel;
        let nextX = panel.x;
        let nextY = panel.y;
        for (let attempt = 0; attempt < 14; attempt += 1) {
          nextX = Math.round(180 + Math.random() * (CANVAS.width - panel.w - 360));
          nextY = Math.round(220 + Math.random() * (CANVAS.height - panel.h - 420));
          if (!heroPanel) break;
          const apartFromHero =
            nextX + panel.w < heroPanel.x - 420 ||
            nextX > heroPanel.x + heroPanel.w + 420 ||
            nextY + panel.h < heroPanel.y - 420 ||
            nextY > heroPanel.y + heroPanel.h + 420;
          if (apartFromHero) break;
        }
        return { ...panel, x: nextX, y: nextY };
      }),
    );
    setShakeTrigger((current) => current + 1);
    setDragSignal((current) => current + 1);
  };

  const handlePanelMoveStart = (id, event) => {
    event.preventDefault();
    event.stopPropagation();
    stopMomentum();
    dragRef.current = { active: true, panelId: id, lastX: event.clientX, lastY: event.clientY, lastTime: performance.now() };
    velocityRef.current = { x: 0, y: 0 };
    viewportRef.current?.setPointerCapture(event.pointerId);
    setActivePanel(id);
  };

  const handlePointerDown = (event) => {
    if (event.button !== 0 || isInteractiveTarget(event.target)) return;
    stopMomentum();
    dragRef.current = { active: true, panelId: null, lastX: event.clientX, lastY: event.clientY, lastTime: performance.now() };
    velocityRef.current = { x: 0, y: 0 };
    viewportRef.current?.setPointerCapture(event.pointerId);
    viewportRef.current?.classList.add("is-dragging");
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current.active) return;
    const now = performance.now();
    const dx = event.clientX - dragRef.current.lastX;
    const dy = event.clientY - dragRef.current.lastY;
    const dt = Math.max(now - dragRef.current.lastTime, 16);
    if (dragRef.current.panelId) {
      setModulePanels((current) =>
        current.map((panel) =>
          panel.id === dragRef.current.panelId
            ? { ...panel, x: clamp(panel.x + dx, 80, CANVAS.width - panel.w - 80), y: clamp(panel.y + dy, 120, CANVAS.height - panel.h - 80) }
          : panel,
        ),
      );
      if (Math.abs(dx) + Math.abs(dy) > 8) setDragSignal((current) => current + 1);
    } else {
      positionRef.current.x += dx;
      positionRef.current.y += dy;
      velocityRef.current = { x: dx * (16 / dt), y: dy * (16 / dt) };
      applyPosition();
    }
    dragRef.current.lastX = event.clientX;
    dragRef.current.lastY = event.clientY;
    dragRef.current.lastTime = now;
  };

  const handlePointerUp = (event) => {
    if (!dragRef.current.active) return;
    const isMovingPanel = Boolean(dragRef.current.panelId);
    dragRef.current.active = false;
    dragRef.current.panelId = null;
    viewportRef.current?.classList.remove("is-dragging");
    if (viewportRef.current?.hasPointerCapture(event.pointerId)) viewportRef.current.releasePointerCapture(event.pointerId);
    if (!isMovingPanel) rafRef.current = requestAnimationFrame(animateMomentum);
  };

  const handleWheel = (event) => {
    event.preventDefault();
    stopMomentum();
    positionRef.current.x -= event.deltaX;
    positionRef.current.y -= event.deltaY;
    velocityRef.current = { x: -event.deltaX * 0.16, y: -event.deltaY * 0.16 };
    applyPosition();
    rafRef.current = requestAnimationFrame(animateMomentum);
  };

  const handleCanvasKeyDown = (event) => {
    const distance = event.shiftKey ? 180 : 80;
    const movement = {
      ArrowLeft: { x: distance, y: 0 },
      ArrowRight: { x: -distance, y: 0 },
      ArrowUp: { x: 0, y: distance },
      ArrowDown: { x: 0, y: -distance },
    }[event.key];
    if (!movement || selectedDrawer) return;
    event.preventDefault();
    stopMomentum();
    positionRef.current.x += movement.x;
    positionRef.current.y += movement.y;
    velocityRef.current = { x: 0, y: 0 };
    applyPosition();
  };

  const handleDrawerDown = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drawerDragRef.current = { active: true, lastX: event.clientX, lastY: event.clientY };
  };

  const handleDrawerMove = (event) => {
    if (!drawerDragRef.current.active) return;
    const viewport = viewportRef.current;
    const maxX = (viewport?.clientWidth ?? window.innerWidth) - 492;
    const maxY = (viewport?.clientHeight ?? window.innerHeight) - 180;
    const dx = event.clientX - drawerDragRef.current.lastX;
    const dy = event.clientY - drawerDragRef.current.lastY;
    setDrawerPosition((current) => ({
      x: clamp(current.x + dx, 16, Math.max(16, maxX)),
      y: clamp(current.y + dy, 88, Math.max(88, maxY)),
    }));
    drawerDragRef.current.lastX = event.clientX;
    drawerDragRef.current.lastY = event.clientY;
  };

  const handleDrawerUp = () => {
    drawerDragRef.current.active = false;
  };

  return (
    <div className="h-screen overflow-hidden bg-[#FFF6E6] text-[#2e3230] antialiased">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 px-4 py-4 sm:px-6">
        <div className="pointer-events-auto"><Navbar /></div>
      </div>
      <div
        ref={viewportRef}
        tabIndex={0}
        aria-label="Earthquake preparedness interactive canvas"
        className="explore-viewport relative h-screen w-screen cursor-grab overflow-hidden focus:outline-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        onKeyDown={handleCanvasKeyDown}
      >
        <div className="pointer-events-auto absolute left-6 top-28 z-20 flex max-w-[calc(100vw-3rem)] flex-wrap gap-2">
          {quickLinks.map(([id, label, icon]) => (
            <button key={id} type="button" data-no-drag aria-label={`Center ${label} panel`} onClick={() => centerPanel(id)} className="flex h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-[#d9ccb8] bg-[#fffaf0]/92 px-3 text-xs font-extrabold text-[#244832] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-[#244832] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC6D2F]">
              <Icon name={icon} className="text-lg" />
              <span className="hidden 2xl:inline">{label}</span>
            </button>
          ))}
          <button type="button" data-no-drag aria-label="Reset panel positions" onClick={resetPositions} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9ccb8] bg-[#fffaf0]/92 text-[#244832] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-[#DC6D2F] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244832]">
            <Icon name="restart_alt" className="text-xl" />
          </button>
          <button type="button" data-no-drag aria-label="Acak posisi modul" onClick={shufflePanels} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9ccb8] bg-[#fffaf0]/92 text-[#244832] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-[#244832] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC6D2F]">
            <Icon name="shuffle" className="text-xl" />
          </button>
          <button type="button" data-no-drag aria-label="Trigger alert shake" onClick={() => setShakeTrigger((current) => current + 1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9ccb8] bg-[#fffaf0]/92 text-[#4a7c59] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-[#4a7c59] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244832]">
            <Icon name="vibration" className="text-xl" />
          </button>
        </div>
        <div className="pointer-events-none absolute bottom-7 left-1/2 z-20 -translate-x-1/2 rounded-full bg-[#244832]/92 px-5 py-3 text-sm font-extrabold text-white shadow-lg">
          {getPanel(activePanel)?.label}
        </div>
        <Drawer selected={selectedDrawer} onClose={() => setSelectedDrawer(null)} position={drawerPosition} onPointerDown={handleDrawerDown} onPointerMove={handleDrawerMove} onPointerUp={handleDrawerUp} />
        <div
          ref={canvasRef}
          className="explore-canvas absolute left-0 top-0 overflow-hidden will-change-transform"
          style={{
            width: CANVAS.width,
            height: CANVAS.height,
          }}
        >
          <AnimatedCanvasLayer
            width={CANVAS.width}
            height={CANVAS.height}
            backgroundImage={`url(${BGMap})`}
            shakeTrigger={shakeTrigger}
            dragSignal={dragSignal}
          >
          {[
            ["Sleman", 1460, 1320],
            ["Merapi", 3560, 1240],
            ["Bantul", 2160, 2840],
            ["Gunungkidul", 5050, 2920],
          ].map(([label, x, y]) => (
            <span key={label} className="absolute rounded-full bg-[#fffaf0]/70 px-6 py-2 font-headline text-2xl font-extrabold text-[#6b5830] shadow-sm backdrop-blur" style={{ left: x, top: y }}>
              {label}
            </span>
          ))}
          {BANNERS.map((banner) => (
            <BannerPanel key={banner.id} panel={getPanel(banner.id)} banner={banner} activePanel={activePanel} onMoveStart={handlePanelMoveStart} />
          ))}
          <HeroCard panel={getPanel("hero")} activePanel={activePanel} centerPanel={centerPanel} />
          <ModuleShell id="about" panel={getPanel("about")} activePanel={activePanel} meta={moduleMeta.about} onMoveStart={handlePanelMoveStart} onOpen={openDrawer}>
            <AboutBoard />
          </ModuleShell>
          <ModuleShell id="simulation" panel={getPanel("simulation")} activePanel={activePanel} meta={moduleMeta.simulation} onMoveStart={handlePanelMoveStart} onOpen={openDrawer}>
            <SimulationBoard openDrawer={openDrawer} />
          </ModuleShell>
          <ModuleShell id="riskmap" panel={getPanel("riskmap")} activePanel={activePanel} meta={moduleMeta.riskmap} onMoveStart={handlePanelMoveStart} onOpen={openDrawer}>
            <RiskMapBoard openDrawer={openDrawer} />
          </ModuleShell>
          <ModuleShell id="kit" panel={getPanel("kit")} activePanel={activePanel} meta={moduleMeta.kit} onMoveStart={handlePanelMoveStart} onOpen={openDrawer}>
            <KitBoard />
          </ModuleShell>
          <ModuleShell id="routes" panel={getPanel("routes")} activePanel={activePanel} meta={moduleMeta.routes} onMoveStart={handlePanelMoveStart} onOpen={openDrawer}>
            <EvacuationBoard />
          </ModuleShell>
          <ModuleShell id="communication" panel={getPanel("communication")} activePanel={activePanel} meta={moduleMeta.communication} onMoveStart={handlePanelMoveStart} onOpen={openDrawer}>
            <CommunicationBoard />
          </ModuleShell>
          <ModuleShell id="protocols" panel={getPanel("protocols")} activePanel={activePanel} meta={moduleMeta.protocols} onMoveStart={handlePanelMoveStart} onOpen={openDrawer}>
            <ProtocolBoard />
          </ModuleShell>
          <ModuleShell id="seismic" panel={getPanel("seismic")} activePanel={activePanel} meta={moduleMeta.seismic} onMoveStart={handlePanelMoveStart} onOpen={openDrawer}>
            <SeismicBoard />
          </ModuleShell>
          <ModuleShell id="quiz" panel={getPanel("quiz")} activePanel={activePanel} meta={moduleMeta.quiz} onMoveStart={handlePanelMoveStart} onOpen={openDrawer}>
            <QuizBoard />
          </ModuleShell>
          </AnimatedCanvasLayer>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
