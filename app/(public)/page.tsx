"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Shield,
  Vote,
  MessageSquare,
  Lock,
  CheckCircle,
  Users,
  BarChart3,
  Eye,
  EyeOff,
  X,
  MapPin,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: Vote,
    title: "E-Voting Aman",
    description: "Sistem pemungutan suara digital yang terenkripsi dan tidak dapat dimanipulasi.",
    color: "text-primary",
  },
  {
    icon: MessageSquare,
    title: "Aspirasi Anonim",
    description: "Sampaikan aspirasi Anda tanpa takut identitas terungkap. Kerahasiaan terjamin.",
    color: "text-primary-light",
  },
  {
    icon: Shield,
    title: "Mitigasi Politik Uang",
    description: "Melawan praktik politik uang melalui transparansi dan partisipasi warga.",
    color: "text-primary",
  },
  {
    icon: Lock,
    title: "Terenkripsi",
    description: "Semua data dilindungi dengan enkripsi tingkat militer. Tidak ada yang bisa meretas.",
    color: "text-primary-light",
  },
];

const stats = [
  { label: "Desa Terdaftar", value: "12", icon: Users, color: "text-primary" },
  { label: "Suara Terkumpul", value: "0", icon: Vote, color: "text-primary-light" },
  { label: "Aspirasi Masuk", value: "0", icon: MessageSquare, color: "text-primary" },
  { label: "Tingkat Partisipasi", value: "0%", icon: BarChart3, color: "text-primary-light" },
];

const desaBalikpapan = [
  { name: "Desa Batu Ampar", kecamatan: "Batu Ampar", status: "Aktif" },
  { name: "Desa Sempaja", kecamatan: "Sungai Kunjang", status: "Aktif" },
  { name: "Desa Gunung Samarinda", kecamatan: "Balikpapan Utara", status: "Aktif" },
  { name: "Desa Prapatan", kecamatan: "Balikpapan Kota", status: "Aktif" },
  { name: "Desa Klandasan", kecamatan: "Balikpapan Kota", status: "Aktif" },
  { name: "Desa Damai", kecamatan: "Balikpapan Utara", status: "Aktif" },
  { name: "Desa Manggar", kecamatan: "Balikpapan Timur", status: "Aktif" },
  { name: "Desa Sepinggan", kecamatan: "Balikpapan Selatan", status: "Aktif" },
  { name: "Desa Gunung Bahagia", kecamatan: "Balikpapan Selatan", status: "Aktif" },
  { name: "Desa Teritip", kecamatan: "Balikpapan Timur", status: "Aktif" },
  { name: "Desa Lamaru", kecamatan: "Balikpapan Timur", status: "Aktif" },
  { name: "Desa Baru Tengah", kecamatan: "Balikpapan Barat", status: "Aktif" },
];

const suaraPerDesa = [
  { desa: "Desa Batu Ampar", suara: 1842, persentase: 89 },
  { desa: "Desa Sempaja", suara: 1654, persentase: 92 },
  { desa: "Desa Gunung Samarinda", suara: 1520, persentase: 85 },
  { desa: "Desa Prapatan", suara: 1387, persentase: 91 },
  { desa: "Desa Klandasan", suara: 1295, persentase: 88 },
  { desa: "Desa Damai", suara: 1180, persentase: 86 },
  { desa: "Desa Manggar", suara: 1045, persentase: 83 },
  { desa: "Desa Sepinggan", suara: 987, persentase: 90 },
  { desa: "Desa Gunung Bahagia", suara: 923, persentase: 84 },
  { desa: "Desa Teritip", suara: 876, persentase: 87 },
  { desa: "Desa Lamaru", suara: 842, persentase: 82 },
  { desa: "Desa Baru Tengah", suara: 869, persentase: 85 },
];

const aspirasiTerbaru = [
  { id: "ASP-001", desa: "Desa Batu Ampar", kategori: "Infrastruktur", judul: "Jalan Rusak di RT 05", tanggal: "27 Jun 2026", status: "Diproses" },
  { id: "ASP-002", desa: "Desa Sempaja", kategori: "Lingkungan", judul: "Pencemaran Sungai", tanggal: "26 Jun 2026", status: "Diterima" },
  { id: "ASP-003", desa: "Desa Prapatan", kategori: "Pelayanan", judul: "Lambatnya Pengurusan Dokumen", tanggal: "25 Jun 2026", status: "Selesai" },
  { id: "ASP-004", desa: "Desa Klandasan", kategori: "Keamanan", judul: "Penerangan Jalan Mati", tanggal: "24 Jun 2026", status: "Diproses" },
  { id: "ASP-005", desa: "Desa Damai", kategori: "Kesehatan", judul: "Kurangnya Fasilitas Puskesmas", tanggal: "23 Jun 2026", status: "Diterima" },
  { id: "ASP-006", desa: "Desa Manggar", kategori: "Pendidikan", judul: "Kekurangan Guru", tanggal: "22 Jun 2026", status: "Diproses" },
];

const partisipasiPerKecamatan = [
  { kecamatan: "Balikpapan Kota", pemilih: 4200, partisipan: 3780, persentase: 90 },
  { kecamatan: "Balikpapan Utara", pemilih: 3800, partisipan: 3230, persentase: 85 },
  { kecamatan: "Balikpapan Selatan", pemilih: 3500, partisipan: 3150, persentase: 90 },
  { kecamatan: "Balikpapan Timur", pemilih: 3200, partisipan: 2624, persentase: 82 },
  { kecamatan: "Balikpapan Barat", pemilih: 2800, partisipan: 2408, persentase: 86 },
  { kecamatan: "Sungai Kunjang", pemilih: 2100, partisipan: 1890, persentase: 90 },
  { kecamatan: "Batu Ampar", pemilih: 1500, partisipan: 1275, persentase: 85 },
];

type ModalType = "desa" | "suara" | "aspirasi" | "partisipasi" | null;

export default function Home() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[480px]">
        <Image
          src="/gambar1.jpeg"
          alt="Demokrasi Desa"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-lg lg:max-w-xl">
            <div className="inline-flex items-center gap-2 bg-black/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Aman & Terpercaya
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Demokrasi Desa{" "}
              <span className="text-white/90">Digital & Adil</span>
            </h2>
            <p className="text-base lg:text-lg text-white/90 mb-8 leading-relaxed text-justify">
              Platform ini hadir sebagai ruang aman untuk mengawal demokrasi desa dari praktik politik uang. Website ini menyediakan fasilitas edukasi hak pilih dan wadah pelaporan kecurangan yang dijamin 100% anonim. Melalui sistem perlindungan identitas yang ketat, warga dapat dengan berani bersuara tanpa takut diintimidasi, memastikan setiap suara yang diberikan tetap murni demi mewujudkan ekosistem desa yang jujur, transparan, dan bermanfaat.
            </p>
            <p className="slogan text-2xl lg:text-3xl font-semibold text-white italic mt-2 whitespace-nowrap">
              &ldquo;Suara Cantik untuk Desa yang Berintegritas&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-10 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const modalType: ModalType = ["desa", "suara", "aspirasi", "partisipasi"][index] as ModalType;
            return (
              <div
                key={stat.label}
                onClick={() => setActiveModal(modalType)}
                className="stat-card rounded-xl p-5 shadow-lg border border-border cursor-pointer hover:shadow-xl hover:border-accent transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-accent-light flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-accent-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-sm font-semibold text-primary tracking-wider uppercase mb-4 block">
              Apa itu Azelina.id?
            </span>
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Platform E-Voting & Aspirasi Anonim
            </h3>
            <p className="text-muted text-lg leading-relaxed">
              <span className="text-foreground font-semibold">Azelina.id</span> adalah platform digital yang dirancang
              khusus untuk <span className="text-primary font-medium">pemungutan suara elektronik (e-voting)</span> dan
              <span className="text-primary font-medium"> aspirasi anonim</span> di tingkat desa. Kami hadir untuk
              membantu masyarakat menyuarakan hak demokrasi mereka secara aman, transparan, dan bebas dari intervensi
              praktik politik uang.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-primary tracking-wider uppercase mb-2 block">
              Mengapa Azelina.id?
            </span>
            <h3 className="text-3xl font-bold text-foreground mb-3">Fitur Utama</h3>
            <p className="text-muted max-w-2xl mx-auto">
              Solusi digital untuk demokrasi desa yang lebih transparan, adil, dan bebas dari praktik politik uang
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 border border-border hover:border-accent hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-4">
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2">{feature.title}</h4>
                <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20 bg-accent-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold text-primary tracking-wider uppercase mb-2 block">
                Privasi Terjamin
              </span>
              <h3 className="text-3xl font-bold text-foreground mb-4">Anonimitas adalah Hak Anda</h3>
              <p className="text-muted mb-6 leading-relaxed">
                Sistem kami dirancang dengan prinsip &ldquo;zero-knowledge&rdquo; - bahkan pengelola platform tidak dapat mengetahui
                siapa yang memilih siapa. Setiap suara terenkripsi dan terpisah dari identitas pemilih.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Enkripsi End-to-End</h4>
                    <p className="text-sm text-muted">Data suara terenkripsi dari perangkat hingga server</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Zero-Knowledge Proof</h4>
                    <p className="text-sm text-muted">Bukti kriptografis tanpa mengungkapkan identitas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Tidak Ada Jejak Digital</h4>
                    <p className="text-sm text-muted">Tidak ada log yang menghubungkan suara dengan pemilih</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-border shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <EyeOff className="w-6 h-6 text-primary" />
                <h4 className="text-lg font-bold text-foreground">Contoh Anonimitas</h4>
              </div>
              <div className="space-y-4">
                <div className="bg-accent-light rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-primary/70" />
                    <span className="text-sm font-medium text-foreground">Yang Dilihat Sistem:</span>
                  </div>
                  <p className="text-sm text-muted font-mono">Suara #8F3A2B → Kandidat A</p>
                </div>
                <div className="bg-accent-light rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <EyeOff className="w-4 h-4 text-primary/70" />
                    <span className="text-sm font-medium text-foreground">Yang Tidak Diketahui:</span>
                  </div>
                  <p className="text-sm text-muted font-mono">Siapa pemilik Suara #8F3A2B</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Daftar Desa */}
      {activeModal === "desa" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">Desa Terdaftar</h3>
                <p className="text-sm text-muted mt-1">12 desa di Kota Balikpapan</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div className="space-y-3">
                {desaBalikpapan.map((desa) => (
                  <div key={desa.name} className="flex items-center justify-between p-4 rounded-xl bg-accent-light/30 hover:bg-accent-light/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{desa.name}</h4>
                        <p className="text-xs text-muted">Kecamatan {desa.kecamatan}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-success/10 text-success">{desa.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suara Terkumpul */}
      {activeModal === "suara" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">Suara Terkumpul</h3>
                <p className="text-sm text-muted mt-1">Total 0 suara dari 12 desa</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div className="space-y-3">
                {suaraPerDesa.map((item) => (
                  <div key={item.desa} className="p-4 rounded-xl bg-accent-light/30 hover:bg-accent-light/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{item.desa}</h4>
                      <span className="text-sm font-bold text-primary">{item.suara.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="w-full bg-accent-light rounded-full h-2">
                      <div className="bg-primary rounded-full h-2" style={{ width: `${item.persentase}%` }} />
                    </div>
                    <p className="text-xs text-muted mt-1">{item.persentase}% partisipasi</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Aspirasi Masuk */}
      {activeModal === "aspirasi" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">Aspirasi Masuk</h3>
                <p className="text-sm text-muted mt-1">Total 0 aspirasi dari warga</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div className="space-y-3">
                {aspirasiTerbaru.map((item) => {
                  const statusColor: Record<string, string> = {
                    Diproses: "bg-primary/10 text-primary",
                    Diterima: "bg-accent-light text-primary-dark",
                    Selesai: "bg-success/10 text-success",
                  };
                  return (
                    <div key={item.id} className="p-4 rounded-xl bg-accent-light/30 hover:bg-accent-light/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted">{item.id}</span>
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">{item.kategori}</span>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[item.status] || ""}`}>{item.status}</span>
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">{item.judul}</h4>
                      <div className="flex items-center gap-3 text-xs text-muted">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.desa}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.tanggal}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tingkat Partisipasi */}
      {activeModal === "partisipasi" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">Tingkat Partisipasi</h3>
                <p className="text-sm text-muted mt-1">Rata-rata 0% partisipasi warga</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div className="space-y-3">
                {partisipasiPerKecamatan.map((item) => (
                  <div key={item.kecamatan} className="p-4 rounded-xl bg-accent-light/30 hover:bg-accent-light/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{item.kecamatan}</h4>
                      <span className="text-sm font-bold text-primary">{item.persentase}%</span>
                    </div>
                    <div className="w-full bg-accent-light rounded-full h-2 mb-2">
                      <div className="bg-primary rounded-full h-2" style={{ width: `${item.persentase}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-muted">
                      <span>{item.partisipan.toLocaleString("id-ID")} partisipan</span>
                      <span>dari {item.pemilih.toLocaleString("id-ID")} pemilih</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
