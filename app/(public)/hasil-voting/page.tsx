"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  IconClipboardList,
  IconUsers,
  IconTrendingUp,
  IconChartBar,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// === Data kandidat ===
const kandidatData = [
  { id: 1, nama: "Siti Aminah", visi: "Desa yang maju, sejahtera, dan berdaya saing tinggi melalui inovasi teknologi dan pemberdayaan UMKM.", foto: "👩", suara: 1842 },
  { id: 2, nama: "Budi Santoso", visi: "Transparansi anggaran, partisipasi warga aktif, dan pembangunan infrastruktur merata di semua dusun.", foto: "👨", suara: 1654 },
  { id: 3, nama: "Rahmawati", visi: "Lingkungan hijau, clean energy, dan kesehatan masyarakat yang prima untuk generasi masa depan.", foto: "👩", suara: 1520 },
];

// === Data desa ===
const desaData = [
  { name: "Desa Batu Ampar", suara: 1842, total: 2070, persentase: 89 },
  { name: "Desa Sempaja", suara: 1654, total: 1800, persentase: 92 },
  { name: "Desa Gunung Samarinda", suara: 1520, total: 1790, persentase: 85 },
  { name: "Desa Prapatan", suara: 1387, total: 1525, persentase: 91 },
  { name: "Desa Klandasan", suara: 1295, total: 1470, persentase: 88 },
  { name: "Desa Damai", suara: 1180, total: 1370, persentase: 86 },
  { name: "Desa Manggar", suara: 1045, total: 1260, persentase: 83 },
  { name: "Desa Sepinggan", suara: 987, total: 1097, persentase: 90 },
  { name: "Desa Gunung Bahagia", suara: 923, total: 1099, persentase: 84 },
  { name: "Desa Teritip", suara: 876, total: 1007, persentase: 87 },
  { name: "Desa Lamaru", suara: 842, total: 1027, persentase: 82 },
  { name: "Desa Baru Tengah", suara: 869, total: 1022, persentase: 85 },
];

// Halaman hasil voting publik
export default function HasilVotingPage() {
  const [kandidatList, setKandidatList] = useState(kandidatData);
  const totalSuara = kandidatList.reduce((sum, k) => sum + k.suara, 0);
  const totalDesa = desaData.length;
  const totalPartisipan = desaData.reduce((sum, d) => sum + d.suara, 0);
  const totalPemilih = desaData.reduce((sum, d) => sum + d.total, 0);
  const rataPartisipasi = Math.round((totalPartisipan / totalPemilih) * 100);

  // Load data voting dari localStorage (warga yang udah vote)
  useEffect(() => {
    try {
      const voteData = JSON.parse(localStorage.getItem("voting_data") || "{}");
      if (voteData.voted && voteData.candidateId) {
        setKandidatList((prev) =>
          prev.map((k) =>
            k.id === voteData.candidateId ? { ...k, suara: k.suara + 1 } : k
          )
        );
      }
    } catch {}
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* === Hero Section === */}
      <section className="relative overflow-hidden min-h-[300px] lg:min-h-[360px]">
        <Image
          src="/gambar1.jpeg"
          alt="Hasil Voting"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-black/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <IconClipboardList className="w-4 h-4" />
              Hasil Voting
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-white leading-[1.1] mb-4 tracking-tight">
              Pemilihan Kepala Desa <span className="text-white/90">2026</span>
            </h2>
            <p className="text-lg text-white/90 max-w-xl leading-relaxed">
              Hasil pemungutan suara secara real-time dari 12 desa di Balikpapan. Data diperbarui secara berkola.
            </p>
          </div>
        </div>
      </section>

      {/* === Statistik Ringkas === */}
      <section className="relative -mt-8 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: totalSuara.toLocaleString("id-ID"), label: "Total Suara", icon: IconClipboardList, color: "text-primary" },
            { value: `${totalDesa}`, label: "Desa Terlibat", icon: IconUsers, color: "text-primary-light" },
            { value: `${rataPartisipasi}%`, label: "Partisipasi", icon: IconTrendingUp, color: "text-success" },
            { value: `${kandidatList.length}`, label: "Kandidat", icon: IconChartBar, color: "text-primary" },
          ].map((stat) => (
            <Card key={stat.label} className="stat-card border-border shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-accent-light flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* === Hasil Voting Kandidat === */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-foreground mb-8">Perolehan Suara Kandidat</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[...kandidatList]
              .sort((a, b) => b.suara - a.suara)
              .map((kandidat, index) => (
                <Card
                  key={kandidat.id}
                  className={`border-border hover:shadow-lg transition-all ${
                    index === 0 ? "ring-2 ring-primary/30" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="text-center">
                      {index === 0 && (
                        <Badge className="bg-primary text-white border-0 mb-3">
                          🏆 Terpilih
                        </Badge>
                      )}
                      <div className="relative w-24 h-24 rounded-2xl bg-accent-light flex items-center justify-center mx-auto mb-4 text-5xl">
                        {kandidat.foto}
                        {index === 0 && (
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                            1
                          </div>
                        )}
                      </div>
                      <h4 className="text-xl font-bold text-foreground mb-1">
                        {kandidat.nama}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {kandidat.visi}
                      </p>
                      <div className="pt-4 border-t border-border">
                        <p className="text-3xl font-bold text-primary">
                          {kandidat.suara.toLocaleString("id-ID")}
                        </p>
                        <p className="text-sm text-muted-foreground">suara</p>
                        <p className="text-lg font-bold text-foreground mt-1">
                          {((kandidat.suara / totalSuara) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="w-full bg-accent-light rounded-full h-3 mt-4">
                        <div
                          className={`rounded-full h-3 transition-all ${
                            index === 0 ? "bg-primary" : "bg-primary/60"
                          }`}
                          style={{
                            width: `${(kandidat.suara / totalSuara) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* === Partisipasi Per Desa === */}
      <section className="py-12 bg-accent-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-foreground mb-8">Partisipasi Per Desa</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {desaData
              .sort((a, b) => b.persentase - a.persentase)
              .map((desa, index) => (
                <Card key={desa.name} className="bg-white border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                            index < 3
                              ? "bg-primary text-white"
                              : "bg-accent-light text-primary"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {desa.name}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-primary">
                        {desa.persentase}%
                      </span>
                    </div>
                    <div className="w-full bg-accent-light rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${desa.persentase}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {desa.suara.toLocaleString("id-ID")} / {desa.total.toLocaleString("id-ID")} pemilih
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* === Footer Info === */}
      <section className="py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            Data diperbarui secara real-time. Untuk informasi lebih lanjut, hubungi kantor desa masing-masing.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            &copy; 2026 Azelina.id - Platform E-Voting & Aspirasi Anonim
          </p>
        </div>
      </section>
    </div>
  );
}
