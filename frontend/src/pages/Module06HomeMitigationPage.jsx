import plesterItem from "../assets/items/plester-cutout.png";
import headDaily from "../assets/ui/head_daily.png";
import homePoster from "../assets/ui/06-home-clean.png";
import inspectionBoard from "../assets/ui/06-inspeksi-crop-cutout.png";
import dangerScale from "../assets/ui/06-skala3-crop-cutout.png";
import mejaIllustration from "../assets/npc/mejaa-cutout.png";
import aquariumItem from "../assets/items/aquarium-cutout.png";
import bupetItem from "../assets/items/bupet-cutout.png";
import gasItem from "../assets/items/gas-cutout.png";
import kabelItem from "../assets/items/kabel-cutout.png";
import kacaItem from "../assets/items/kaca-cutout.png";
import lemariItem from "../assets/items/lemaritinggi-cutout.png";
import mainanItem from "../assets/items/mainan-cutout.png";
import rakSepatuItem from "../assets/items/rak-cutout.png";
import sofaItem from "../assets/items/sofa-cutout.png";
import tvItem from "../assets/items/tvatas-cutout.png";
import tanamanItem from "../assets/items/vas-cutout.png";
import komporItem from "../assets/items/bupet-cutout.png";
import { rewardItems } from "./bookRewards";

const inspectionObjects = [
  {
    id: "gas",
    number: "1",
    name: "Tabung Gas",
    status: "Bahaya",
    risk: "Bisa bocor, terguling, atau memicu kebakaran saat gempa.",
    fix: "Pastikan tabung gas berdiri stabil, jauh dari sumber panas, dan selang/regulator rutin dicek.",
    image: gasItem,
    x: "94.2%",
    y: "63.2%",
  },
  {
    id: "kabel",
    number: "2",
    name: "Kabel Longgar",
    status: "Bahaya",
    risk: "Bisa tersandung, korsleting, atau menghambat jalur evakuasi.",
    fix: "Rapikan kabel ke sisi dinding, gunakan pengikat kabel, dan jangan menutup jalur menuju pintu keluar.",
    image: kabelItem,
    x: "20.9%",
    y: "34.4%",
  },
  {
    id: "tv",
    number: "3",
    name: "TV di Tempat Tinggi",
    status: "Bahaya",
    risk: "Dapat jatuh dari rak dan menimpa orang saat guncangan.",
    fix: "Turunkan TV ke meja rendah atau kunci dengan bracket kuat yang menempel ke dinding.",
    image: tvItem,
    x: "32.6%",
    y: "17.4%",
  },
  {
    id: "sofa",
    number: "4",
    name: "Sofa Single",
    status: "Aman",
    risk: "Benda rendah dan stabil, tidak mudah jatuh atau melukai.",
    fix: "Tetap pastikan posisinya tidak menghalangi akses menuju pintu keluar.",
    image: sofaItem,
    x: "14.7%",
    y: "58.8%",
  },
  {
    id: "kaca",
    number: "5",
    name: "Benda Kaca di Lemari",
    status: "Bahaya",
    risk: "Kaca mudah pecah dan serpihannya bisa melukai.",
    fix: "Simpan benda kaca di rak bawah atau lemari tertutup yang terkunci rapat.",
    image: kacaItem,
    x: "38.5%",
    y: "24.6%",
  },
  {
    id: "kompor",
    number: "6",
    name: "Kompor Panas",
    status: "Waspada",
    risk: "Perlu dimatikan setelah aman karena bisa memicu kebakaran.",
    fix: "Setelah guncangan berhenti dan kondisi aman, matikan kompor serta sumber gas/listrik.",
    image: komporItem,
    x: "91.7%",
    y: "44.6%",
  },
  {
    id: "rak-buku",
    number: "7",
    name: "Rak Buku Tinggi",
    status: "Bahaya",
    risk: "Bisa roboh jika tidak dikunci atau diikat ke dinding.",
    fix: "Ikat rak tinggi ke dinding dan simpan barang berat pada rak bagian bawah.",
    image: lemariItem,
    x: "81.7%",
    y: "31.1%",
  },
  {
    id: "tanaman",
    number: "8",
    name: "Tanaman di Lantai",
    status: "Aman",
    risk: "Letaknya rendah sehingga risiko jatuh lebih kecil.",
    fix: "Jaga agar pot tidak menghalangi jalur evakuasi.",
    image: tanamanItem,
    x: "14.7%",
    y: "76.9%",
  },
  {
    id: "aquarium",
    number: "9",
    name: "Akuarium",
    status: "Waspada",
    risk: "Kaca dan air bisa pecah atau tumpah, menyebabkan luka atau lantai licin.",
    fix: "Letakkan akuarium di tempat rendah dan stabil, jauh dari jalur evakuasi utama.",
    image: aquariumItem,
    x: "64.6%",
    y: "62.3%",
  },
  {
    id: "mainan",
    number: "10",
    name: "Mainan Berserakan",
    status: "Waspada",
    risk: "Bisa membuat tersandung saat bergerak menuju pintu keluar.",
    fix: "Rapikan mainan ke kotak penyimpanan dan kosongkan area depan pintu.",
    image: mainanItem,
    x: "22.7%",
    y: "93.8%",
  },
  {
    id: "meja-hiasan",
    number: "11",
    name: "Meja Kecil dengan Hiasan",
    status: "Waspada",
    risk: "Benda di atas meja bisa jatuh dan mengganggu evakuasi.",
    fix: "Kurangi hiasan mudah pecah dan simpan barang kecil di wadah tertutup.",
    image: bupetItem,
    x: "81.6%",
    y: "71.3%",
  },
  {
    id: "rak-sepatu",
    number: "12",
    name: "Rak Sepatu",
    status: "Aman",
    risk: "Rendah dan tidak terlalu berisiko jika posisinya rapi.",
    fix: "Susun sepatu agar tidak tercecer ke jalur keluar.",
    image: rakSepatuItem,
    x: "89.4%",
    y: "91.6%",
  },
];

const requiredDangerIds = ["gas", "kabel", "tv", "kaca", "rak-buku"];

// Koordinat presisi untuk 5 kolom sejajar
const inspectionSlotPositions = [
  { x: 5.0,  y: 28.0, w: 16.0, h: 62.0 },
  { x: 23.5, y: 28.0, w: 16.0, h: 62.0 },
  { x: 42.0, y: 28.0, w: 16.0, h: 62.0 },
  { x: 60.5, y: 28.0, w: 16.0, h: 62.0 },
  { x: 79.0, y: 28.0, w: 16.0, h: 62.0 },
];

export const moduleMeta = {
  id: "mitigasi-rumah",
  number: "06",
  navLabel: "Mitigation",
  title: "Home Mitigation",
  icon: plesterItem,
  image: homePoster,
  posterStyle: {
    "--quest-poster-width": "100%",
    "--quest-poster-max-height": "min(250px, 28vh)",
    "--quest-poster-offset-y": "0px",
  },
  headerImage: headDaily,
  subtitle: "deteksi dan kurangi bahaya bencana di rumah",
  pageTitle: "Detektor Bahaya",
  pageSubtitle: "Klik nomor pada untuk memeriksa risikonya.",
  description: "Temukan benda yang berpotensi membahayakan saat gempa dan pelajari cara mengurangi risikonya.",
  bookLayout: "split-comic",
  leftPosterOnly: true,
  hideTip: true,
  rewards: [rewardItems.masker, rewardItems.obat],
  tip: "Mitigasi terbaik terasa membosankan karena dilakukan sebelum bahaya muncul, tapi efeknya besar saat keadaan berubah.",
  gameplay: {
    type: "inspection",
    label: "Room Inspection",
    requiredActions: requiredDangerIds,
    objects: inspectionObjects,
    leftTitle: "Danger Detector",
    leftText: "Klik objek bernomor di ruangan untuk melihat status dan risikonya.",
  },
};

const Module06HomeMitigationPage = ({ module, gameplay, activeDetail, completedActions, markAction, setActiveDetail, placement = "default" }) => {
  const selectedObject = gameplay.objects.find((object) => object.id === activeDetail) ?? gameplay.objects[0];
  const foundDangerCount = requiredDangerIds.filter((id) => completedActions.includes(id)).length;
  
  const storedDangerObjects = completedActions
    .filter((actionId) => requiredDangerIds.includes(actionId))
    .map((actionId) => gameplay.objects.find((object) => object.id === actionId))
    .filter(Boolean)
    .slice(0, requiredDangerIds.length);
    
  const canPreviewNonDanger = foundDangerCount < requiredDangerIds.length;
  // Menampilkan preview objek Aman/Waspada (seperti sofa, pot, mainan) HANYA jika misi bahaya belum 100% selesai
  const previewObject = selectedObject.status !== "Bahaya" && canPreviewNonDanger ? selectedObject : null;
  
  const displayedInspectionObjects = previewObject
    ? [...storedDangerObjects, previewObject].slice(0, requiredDangerIds.length)
    : storedDangerObjects;

  // === FUNGSI KLIK YANG SEHAT ===
  const inspectObject = (object) => {
    // 1. Selalu laporkan semua benda yang diklik ke sistem agar UI tombol dan papan inspeksi merespon
    setActiveDetail(module.id, object.id);

    // 2. Jika benda yang diklik adalah BAHAYA, kirim datanya untuk dicatat sebagai misi berhasil
    if (object.status === "Bahaya") {
      markAction(object.id, object.id);
    }
  };

  if (placement === "left") {
    return (
      <section className="quest-gameplay quest-gameplay--module06 quest-gameplay--module06-left">
        <figure className="quest-module06-home-poster">
          <img src={homePoster} alt="" />
          {gameplay.objects.map((object) => (
            <button
              key={object.id}
              type="button"
              className={[
                "quest-module06-hotspot",
                activeDetail === object.id ? "is-active" : "",
                completedActions.includes(object.id) ? "is-found" : "",
              ].filter(Boolean).join(" ")}
              style={{
                // Hanya mengandalkan CSS bawaan class milikmu agar tidak bertabrakan
                "--module06-x": object.x,
                "--module06-y": object.y,
              }}
              onClick={() => inspectObject(object)}
              aria-label={`${object.number}. ${object.name}`}
            >
              {object.number}
            </button>
          ))}
        </figure>
      </section>
    );
  }

  return (
    <section 
      className="quest-gameplay quest-gameplay--module06 quest-gameplay--module06-right"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <img 
          className="quest-module06-scale" 
          src={dangerScale} 
          alt="Skala Bahaya" 
          style={{ width: "100%", height: "auto", objectFit: "contain", display: "block" }}
        />
      </div>

      <figure 
        className="quest-module06-inspection-board" 
        style={{ 
          position: "relative", 
          width: "100%", 
          margin: "1rem 0", 
          display: "flex", 
          justifyContent: "center" 
        }}
      >
        <img 
          className="quest-module06-inspection-board__frame" 
          src={inspectionBoard} 
          alt="Papan Inspeksi" 
          style={{ width: "100%", height: "auto", display: "block" }} 
        />
       {displayedInspectionObjects.map((object, index) => (
  <figcaption
    key={object.id}
    className={`quest-module06-inspection-slot is-${object.status.toLowerCase()}`}
    style={{
      position: "absolute",
      left: `${inspectionSlotPositions[index].x}%`,
      top: `${inspectionSlotPositions[index].y}%`,
      width: `${inspectionSlotPositions[index].w}%`,
      height: `${inspectionSlotPositions[index].h}%`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "15% 4% 5% 4%", // Padding disesuaikan agar lebih proporsional
      boxSizing: "border-box",
      textAlign: "center",
      overflow: "hidden" 
    }}
  >
    {/* Wrapper gambar fleksibel */}
      <div style={{ 
      flex: "1 1 auto", // Mengisi ruang yang tersedia secara proporsional
      width: "100%", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      marginBottom: "8px",
      minHeight: "0" // Mencegah flex item meluap
    }}>
      <img 
        src={object.image} 
        alt={object.name} 
        style={{ 
          maxWidth: "100%", 
          maxHeight: "100%", 
          objectFit: "contain" // Menjaga aspek rasio gambar
        }} 
      />
      </div>
    
      {/* Teks tetap di bawah */}
      <strong style={{ 
      fontSize: "clamp(6px, 0.9vw, 9px)", 
      lineHeight: "1", 
      marginBottom: "4px",
      color: "#111"
      }}>
      {object.name}
      </strong>
       <small style={{ 
      fontSize: "clamp(5px, 0.6vw, 8px)", 
      lineHeight: "1.2", 
      color: "#333",
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical",
      overflow: "hidden"
        }}>
      {object.risk}
      </small>
      </figcaption>
      ))}
      </figure>

      <div style={{ width: "100%", marginTop: "auto" }}>        
        <p 
          className="quest-module06-found" 
          style={{ textAlign: "center", marginTop: "10px", fontWeight: "bold" }}
        >
          {foundDangerCount} / {requiredDangerIds.length} bahaya ditemukan
        </p>
      </div>
    </section>
  );
};

export default Module06HomeMitigationPage;