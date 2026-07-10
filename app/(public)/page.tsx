"use client";

import { useState } from "react";
import Image from "next/image";
import {
  IconShield,
  IconClipboardList,
  IconMessage,
  IconLock,
  IconCircleCheck,
  IconUsers,
  IconChartBar,
  IconEye,
  IconEyeOff,
  IconX,
  IconMapPin,
  IconClock,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// === Data statis: fitur utama platform ===
const features = [
  {
    icon: IconClipboardList,
    title: "E-Voting Aman",
    description:
      "Sistem pemungutan suara digital yang terenkripsi dan tidak dapat dimanipulasi.",
    color: "text-primary",
  },
  {
    icon: IconMessage,
    title: "Aspirasi Anonim",
    description:
      "Sampaikan aspirasi Anda tanpa takut identitas terungkap. Kerahasiaan terjamin.",
    color: "text-primary-light",
  },
  {
    icon: IconShield,
    title: "Mitigasi Politik Uang",
    description:
      "Melawan praktik politik uang melalui transparansi dan partisipasi warga.",
    color: "text-primary",
  },
  {
    icon: IconLock,
    title: "Terenkripsi",
    description:
      "Semua data dilindungi dengan enkripsi tingkat militer. Tidak ada yang bisa meretas.",
    color: "text-primary-light",
  },
];

// === Data statistik dashboard ===
const stats = [
  { label: "Desa Terdaftar", value: "12", icon: IconUsers, color: "text-primary" },
  { label: "Suara Terkumpul", value: "0", icon: IconClipboardList, color: "text-primary-light" },
  { label: "Aspirasi Masuk", value: "0", icon: IconMessage, color: "text-primary" },
  { label: "Tingkat Partisipasi", value: "0%", icon: IconChartBar, color: "text-primary-light" },
];

// === Data 12 desa di Balikpapan ===
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

// === Data suara per desa ===
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

// === Data aspirasi terbaru ===
const aspirasiTerbaru = [
  { id: "ASP-001", desa: "Desa Batu Ampar", kategori: "Infrastruktur", judul: "Jalan Rusak di RT 05", tanggal: "27 Jun 2026", status: "Diproses" },
  { id: "ASP-002", desa: "Desa Sempaja", kategori: "Lingkungan", judul: "Pencemaran Sungai", tanggal: "26 Jun 2026", status: "Diterima" },
  { id: "ASP-003", desa: "Desa Prapatan", kategori: "Pelayanan", judul: "Lambatnya Pengurusan Dokumen", tanggal: "25 Jun 2026", status: "Selesai" },
  { id: "ASP-004", desa: "Desa Klandasan", kategori: "Keamanan", judul: "Penerangan Jalan Mati", tanggal: "24 Jun 2026", status: "Diproses" },
  { id: "ASP-005", desa: "Desa Damai", kategori: "Kesehatan", judul: "Kurangnya Fasilitas Puskesmas", tanggal: "23 Jun 2026", status: "Diterima" },
  { id: "ASP-006", desa: "Desa Manggar", kategori: "Pendidikan", judul: "Kekurangan Guru", tanggal: "22 Jun 2026", status: "Diproses" },
];

// === Data partisipasi per kecamatan ===
const partisipasiPerKecamatan = [
  { kecamatan: "Balikpapan Kota", pemilih: 4200, partisipan: 3780, persentase: 90 },
  { kecamatan: "Balikpapan Utara", pemilih: 3800, partisipan: 3230, persentase: 85 },
  { kecamatan: "Balikpapan Selatan", pemilih: 3500, partisipan: 3150, persentase: 90 },
  { kecamatan: "Balikpapan Timur", pemilih: 3200, partisipan: 2624, persentase: 82 },
  { kecamatan: "Balikpapan Barat", pemilih: 2800, partisipan: 2408, persentase: 86 },
  { kecamatan: "Sungai Kunjang", pemilih: 2100, partisipan: 1890, persentase: 90 },
  { kecamatan: "Batu Ampar", pemilih: 1500, partisipan: 1275, persentase: 85 },
];

// Mapping warna badge status aspirasi
const STATUS_COLORS: Record<string, string> = {
  Diproses: "bg-primary/10 text-primary",
  Diterima: "bg-accent-light text-primary-dark",
  Selesai: "bg-success/10 text-success",
};

type ModalType = "desa" | "suara" | "aspirasi" | "partisipasi" | null;

// Halaman utama: landing page Azelina.id
export default function Home() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <div className="flex flex-col min-h-screen">
      {/* === Hero Section: banner utama === */}
      <section className="relative overflow-hidden min-h-[400px] lg:min-h-[480px]">
        <Image
          src="/gambar1.jpeg"
          alt="Demokrasi Desa"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-black/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <IconShield className="w-4 h-4" />
              Aman & Terpercaya
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Demokrasi Desa{" "}
              <span className="text-white/90">Digital & Adil</span>
            </h2>
            <p className="text-base lg:text-lg text-white/90 mb-8 leading-relaxed text-justify">
              Platform ini hadir sebagai ruang aman untuk mengawal demokrasi
              desa dari praktik politik uang. Website ini menyediakan fasilitas
              edukasi hak pilih dan wadah pelaporan kecurangan yang dijamin 100%
              anonim. Melalui sistem perlindungan identitas yang ketat, warga
              dapat dengan berani bersuara tanpa takut diintimidasi, memastikan
              setiap suara yang diberikan tetap murni demi mewujudkan ekosistem
              desa yang jujur, transparan, dan bermanfaat.
            </p>
            <p className="slogan text-2xl lg:text-3xl font-semibold text-white italic mt-2 whitespace-nowrap">
              &ldquo;Suara Cantik untuk Desa yang Berintegritas&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* === Stats Section: kartu statistik interaktif === */}
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
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* === About Section: penjelasan platform === */}
      <section className="py-20 bg-accent-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-sm font-semibold text-primary tracking-wider uppercase mb-4 block">
              Apa itu Azelina.id?
            </span>
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Platform E-Voting & Aspirasi Anonim
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              <span className="text-foreground font-semibold">
                Azelina.id
              </span>{" "}
              adalah platform digital yang dirancang khusus untuk{" "}
              <span className="text-primary font-medium">
                pemungutan suara elektronik (e-voting)
              </span>{" "}
              dan{" "}
              <span className="text-primary font-medium">
                aspirasi anonim
              </span>{" "}
              di tingkat desa. Kami hadir untuk membantu masyarakat menyuarakan
              hak demokrasi mereka secara aman, transparan, dan bebas dari
              intervensi praktik politik uang.
            </p>
          </div>
        </div>
      </section>

      {/* === Features Section: 4 kartu fitur utama === */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-primary tracking-wider uppercase mb-2 block">
              Mengapa Azelina.id?
            </span>
            <h3 className="text-3xl font-bold text-foreground mb-3">
              Fitur Utama
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Solusi digital untuk demokrasi desa yang lebih transparan, adil,
              dan bebas dari praktik politik uang
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
                <h4 className="text-lg font-bold text-foreground mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Privacy Section: penjelasan anonimitas === */}
      <section className="py-20 bg-accent-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Penjelasan fitur privasi */}
            <div>
              <span className="text-sm font-semibold text-primary tracking-wider uppercase mb-2 block">
                Privasi Terjamin
              </span>
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Anonimitas adalah Hak Anda
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Sistem kami dirancang dengan prinsip &ldquo;zero-knowledge&rdquo;
                - bahkan pengelola platform tidak dapat mengetahui siapa yang
                memilih siapa. Setiap suara terenkripsi dan terpisah dari
                identitas pemilih.
              </p>
              <div className="space-y-4">
                {[
                  {
                    title: "Enkripsi End-to-End",
                    desc: "Data suara terenkripsi dari perangkat hingga server",
                  },
                  {
                    title: "Zero-Knowledge Proof",
                    desc: "Bukti kriptografis tanpa mengungkapkan identitas",
                  },
                  {
                    title: "Tidak Ada Jejak Digital",
                    desc: "Tidak ada log yang menghubungkan suara dengan pemilih",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <IconCircleCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ilustrasi anonimitas */}
            <div className="bg-white rounded-2xl p-8 border border-border shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <IconEyeOff className="w-6 h-6 text-primary" />
                <h4 className="text-lg font-bold text-foreground">
                  Contoh Anonimitas
                </h4>
              </div>
              <div className="space-y-4">
                <div className="bg-accent-light rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <IconEye className="w-4 h-4 text-primary/70" />
                    <span className="text-sm font-medium text-foreground">
                      Yang Dilihat Sistem:
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">
                    Suara #8F3A2B → Kandidat A
                  </p>
                </div>
                <div className="bg-accent-light rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <IconEyeOff className="w-4 h-4 text-primary/70" />
                    <span className="text-sm font-medium text-foreground">
                      Yang Tidak Diketahui:
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">
                    Siapa pemilik Suara #8F3A2B
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Modal: Daftar Desa === */}
      <Dialog
        open={activeModal === "desa"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Desa Terdaftar</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              12 desa di Kota Balikpapan
            </p>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(80vh-120px)]">
            <div className="space-y-3">
              {desaBalikpapan.map((desa) => (
                <div
                  key={desa.name}
                  className="flex items-center justify-between p-4 rounded-xl bg-accent-light/30 hover:bg-accent-light/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconMapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {desa.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Kecamatan {desa.kecamatan}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-success/10 text-success border-0 hover:bg-success/10">
                    {desa.status}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* === Modal: Suara Terkumpul === */}
      <Dialog
        open={activeModal === "suara"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Suara Terkumpul</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Total 0 suara dari 12 desa
            </p>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(80vh-120px)]">
            <div className="space-y-3">
              {suaraPerDesa.map((item) => (
                <div
                  key={item.desa}
                  className="p-4 rounded-xl bg-accent-light/30 hover:bg-accent-light/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">
                      {item.desa}
                    </h4>
                    <span className="text-sm font-bold text-primary">
                      {item.suara.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="w-full bg-accent-light rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: `${item.persentase}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.persentase}% partisipasi
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* === Modal: Aspirasi Masuk === */}
      <Dialog
        open={activeModal === "aspirasi"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Aspirasi Masuk</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Total 0 aspirasi dari warga
            </p>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(80vh-120px)]">
            <div className="space-y-3">
              {aspirasiTerbaru.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-accent-light/30 hover:bg-accent-light/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">
                        {item.id}
                      </span>
                      <Badge className="bg-primary/10 text-primary border-0 hover:bg-primary/10">
                        {item.kategori}
                      </Badge>
                    </div>
                    <Badge
                      className={`border-0 hover:bg-transparent ${STATUS_COLORS[item.status] || ""}`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">
                    {item.judul}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <IconMapPin className="w-3 h-3" />
                      {item.desa}
                    </span>
                    <span className="flex items-center gap-1">
                      <IconClock className="w-3 h-3" />
                      {item.tanggal}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* === Modal: Tingkat Partisipasi === */}
      <Dialog
        open={activeModal === "partisipasi"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Tingkat Partisipasi</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Rata-rata 0% partisipasi warga
            </p>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(80vh-120px)]">
            <div className="space-y-3">
              {partisipasiPerKecamatan.map((item) => (
                <div
                  key={item.kecamatan}
                  className="p-4 rounded-xl bg-accent-light/30 hover:bg-accent-light/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">
                      {item.kecamatan}
                    </h4>
                    <span className="text-sm font-bold text-primary">
                      {item.persentase}%
                    </span>
                  </div>
                  <div className="w-full bg-accent-light rounded-full h-2 mb-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: `${item.persentase}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {item.partisipan.toLocaleString("id-ID")} partisipan
                    </span>
                    <span>
                      dari {item.pemilih.toLocaleString("id-ID")} pemilih
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
