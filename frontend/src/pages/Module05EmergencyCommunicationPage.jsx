import radioItem from "../assets/items/radio-cutout.png";
import headCommand from "../assets/ui/head_com.png";
import callPoster from "../assets/ui/05-call-clean.png";
import callInfo from "../assets/ui/05-call2-clean.png";
import callHotline from "../assets/ui/05-call3-clean.png";
import timsarPoint from "../assets/npc/timsar-point-clean.png";
import { rewardItems } from "./bookRewards";

export const moduleMeta = {
  id: "komunikasi-darurat",
  number: "05",
  navLabel: "Communication",
  title: "Emergency Call",
  icon: radioItem,
  image: callPoster,
  // Atur besar/posisi poster modul ini dari sini.
  posterStyle: {
    "--quest-poster-width": "min(100%, 755px)",
    "--quest-poster-offset-y": "-60px",
  },
  headerImage: headCommand,
  subtitle: "Tetap berkomunikasi saat kondisi darurat",
  pageTitle: "Tetap terhubung saat darurat",
  description: "Susun alur komunikasi keluarga, gunakan SMS saat jaringan padat, dan simpan kanal informasi darurat yang resmi.",
  quiz: {
    question: "Kenapa SMS sering lebih berguna saat jaringan padat?",
    answer: "Lebih ringan daripada panggilan suara",
    options: ["Lebih ringan daripada panggilan suara", "Tidak perlu sinyal sama sekali", "Selalu mengirim lokasi otomatis"],
  },
  leftPosterOnly: true,
  hideTip: true,
  rewards: [rewardItems.radio, rewardItems.baterai],
  tip: "Jangan menyebarkan kabar yang belum jelas. Ikuti kanal resmi agar keluarga tidak mengambil keputusan dari rumor.",
  gameplay: {
    type: "message",
    label: "Message Board",
    requiredActions: [],
    messages: [
      { id: "rumor", title: "Teruskan kabar belum jelas", detail: "Kabar tanpa sumber bisa membuat keluarga bergerak ke tempat salah." },
      { id: "priority-safe", title: "SMS singkat + lokasi", detail: "Prioritas benar: kabar kondisi, lokasi, dan titik kumpul.", correct: true },
      { id: "call-spam", title: "Telepon berkali-kali", detail: "Panggilan berulang dapat membebani jaringan yang sedang padat." },
    ],
    familyTree: ["Ayah", "Ibu", "Anak", "Kontak luar kota"],
    leftTitle: "Notification",
    leftText: "Pilih pesan prioritas sebelum jaringan penuh.",
  },
};

const Module05EmergencyCommunicationPage = ({ module, gameplay, activeDetail, markAction, setActiveDetail, renderQuizBlock }) => {
  return (
    <section className="quest-gameplay quest-gameplay--message quest-gameplay--module05">
      <img className="quest-module05-call-card quest-module05-call-card--hotline" src={callHotline} alt="" />

      <article className="quest-module05-info-header">
        <strong>Emergency Call Guide</strong>
        <span>Simpan nomor penting, kirim pesan singkat, dan sampaikan lokasi dengan jelas.</span>
      </article>

      {renderQuizBlock()}

      <div className="quest-module05-call-row">
        <img className="quest-module05-call-card quest-module05-call-card--info" src={callInfo} alt="" />
        <img className="quest-module05-timsar-point" src={timsarPoint} alt="" />
      </div>
    </section>
  );
};

export default Module05EmergencyCommunicationPage;
