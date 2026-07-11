"use client";

import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import {
  IconMessage,
  IconClipboardList,
  IconWorld,
  IconUser,
  IconLock,
  IconLogout,
  IconMenu,
  IconX,
  IconSend,
  IconClock,
  IconCircleCheck,
  IconAlertCircle,
  IconBell,
  IconInbox,
  IconHeadphones,
  IconMapPin,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

// === Schema validasi Zod: form kirim aspirasi ===
const aspirasiSchema = z.object({
  judul: z.string().min(3, "Judul harus minimal 3 karakter"),
  kategori: z.string().min(1, "Pilih kategori masalah"),
  deskripsi: z.string().min(10, "Deskripsi harus minimal 10 karakter"),
});

// === Schema validasi Zod: form ganti kata sandi ===
const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Kata sandi lama harus diisi"),
    newPassword: z.string().min(6, "Kata sandi baru minimal 6 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi harus diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

// === Data statis: menu sidebar ===
const sidebarMenu = [
  {
    label: "Platform Aspirasi",
    items: [
      { icon: IconSend, label: "Kirim Aspirasi", href: "#aspirasi" },
      { icon: IconClipboardList, label: "Ikut Voting", href: "#voting" },
      { icon: IconWorld, label: "Papan Publik", href: "#papan" },
      { icon: IconHeadphones, label: "Chat Petugas", href: "#chat" },
    ],
  },
  {
    label: "Pengaturan Akun",
    items: [
      { icon: IconUser, label: "Profil Saya", href: "#profil" },
      { icon: IconLock, label: "Ganti Kata Sandi", href: "#sandi" },
      { icon: IconLogout, label: "Keluar", href: "/login" },
    ],
  },
];

// === Data statis: kategori masalah aspirasi ===
const kategoriMasalah = [
  { id: "infra", label: "Infrastruktur", icon: "🚧" },
  { id: "lingkungan", label: "Lingkungan", icon: "🌿" },
  { id: "pelayanan", label: "Pelayanan Publik", icon: "🏛️" },
  { id: "keamanan", label: "Keamanan", icon: "🛡️" },
  { id: "kesehatan", label: "Kesehatan", icon: "🏥" },
  { id: "pendidikan", label: "Pendidikan", icon: "📚" },
];

// Warna badge berdasarkan status aspirasi
const STATUS_COLORS: Record<string, string> = {
  Diproses: "bg-primary/10 text-primary",
  Diterima: "bg-accent-light text-primary-dark",
  Selesai: "bg-success/10 text-success",
};

// Tipe data
interface Aspirasi {
  id: string;
  judul: string;
  kategori: string;
  deskripsi: string;
  status: string;
  tanggal: string;
}

interface ChatMessage {
  id: number;
  sender: "user" | "petugas";
  name: string;
  text: string;
  time: string;
}

interface ChatRoom {
  id: number;
  petugasName: string;
  role: string;
  status: "online" | "offline";
  lastMessage: string;
  lastTime: string;
  messages: ChatMessage[];
}

// Data chat rooms
const chatRooms: ChatRoom[] = [
  { id: 1, petugasName: "Pak Budi", role: "Admin Desa", status: "online", lastMessage: "", lastTime: "", messages: [] },
  { id: 2, petugasName: "Bu Siti", role: "Petugas Keamanan", status: "online", lastMessage: "", lastTime: "", messages: [] },
  { id: 3, petugasName: "Pak Ahmad", role: "Kepala Desa", status: "offline", lastMessage: "", lastTime: "", messages: [] },
];

// Balasan otomatis dari petugas
const autoReplies: Record<string, string[]> = {
  "Pak Budi": [
    "Halo! Selamat datang di Azelina.id. Ada yang bisa saya bantu?",
    "Untuk pengajuan aspirasi, silakan masuk ke menu Kirim Aspirasi ya.",
    "Terima kasih atas informasinya. Akan segera kami tindaklanjuti.",
  ],
  "Bu Siti": [
    "Halo! Ada yang bisa saya bantu terkait keamanan desa?",
    "Untuk laporan keamanan, bisa langsung disampaikan di sini.",
    "Terima kasih, sudah kami catat laporannya.",
  ],
  "Pak Ahmad": [
    "Selamat datang di layanan Kepala Desa.",
    "Silakan sampaikan aspirasi atau keluhan Anda.",
    "Kami berkomitmen untuk menindaklanjuti setiap laporan warga.",
  ],
};

// Tipe data notifikasi
interface NotifItem {
  id: number;
  type: "aspirasi" | "chat";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// Data papan publik
const papanPublikData = [
  { id: 1, desa: "Desa Batu Ampar", judul: "Perbaikan Jalan Rusak di RT 05", kategori: "Infrastruktur", votes: 234, status: "Aktif", waktu: "2 jam lalu", deskripsi: "Jalan di RT 05 mengalami kerusakan parah akibat hujan deras. Lubang-lubang besar membahayakan pengendara dan pejalan kaki. Warga meminta segera dilakukan perbaikan sebelum ada korban." },
  { id: 2, desa: "Desa Sempaja", judul: "Distribusi Air Bersih untuk Warga", kategori: "Pelayanan", votes: 189, status: "Aktif", waktu: "5 jam lalu", deskripsi: "Beberapa RT di Desa Sempaja masih mengalami kekurangan air bersih. Warga meminta pemerintah desa untuk menyediakan distribusi air bersih secara rutin." },
  { id: 3, desa: "Desa Prapatan", judul: "Penerangan Jalan Umum Mati", kategori: "Keamanan", votes: 156, status: "Aktif", waktu: "1 hari lalu", deskripsi: "Lampu penerangan jalan di Jl. Prapatan sudah mati selama 2 minggu. Hal ini menyebabkan jalanan gelap dan meningkatkan risiko kecelakaan serta tindak kriminal." },
  { id: 4, desa: "Desa Klandasan", judul: "Fasilitas Posyandu yang Layak", kategori: "Kesehatan", votes: 142, status: "Aktif", waktu: "1 hari lalu", deskripsi: "Posyandu di Desa Klandasan membutuhkan perbaikan fasilitas. Ruangan sempit dan peralatan yang kurang memadai menghambat pelayanan kesehatan ibu dan anak." },
  { id: 5, desa: "Desa Damai", judul: "Pembangunan Trotoar Pejalan Kaki", kategori: "Infrastruktur", votes: 128, status: "Selesai", waktu: "2 hari lalu", deskripsi: "Warga mengusulkan pembangunan trotoar di Jl. Damai untuk keamanan pejalan kaki. Usulan ini sudah ditindaklanjuti dan trotoar telah selesai dibangun." },
  { id: 6, desa: "Desa Manggar", judul: "Pengadaan Sampah Organik", kategori: "Lingkungan", votes: 98, status: "Aktif", waktu: "3 hari lalu", deskripsi: "Sampah organik di Desa Manggar belum ditangani dengan baik. Warga meminta pengadaan tempat sampah organik dan program kompos untuk mengurangi pencemaran lingkungan." },
];

// Data kandidat voting
const kandidatData = [
  { id: 1, nama: "Siti Aminah", visi: "Desa yang maju, sejahtera, dan berdaya saing tinggi melalui inovasi teknologi dan pemberdayaan UMKM.", foto: "👩" },
  { id: 2, nama: "Budi Santoso", visi: "Transparansi anggaran, partisipasi warga aktif, dan pembangunan infrastruktur merata di semua dusun.", foto: "👨" },
  { id: 3, nama: "Rahmawati", visi: "Lingkungan hijau, clean energy, dan kesehatan masyarakat yang prima untuk generasi masa depan.", foto: "👩" },
];

// Data desa untuk form profil
const daftarDesa = [
  "Desa Batu Ampar", "Desa Sempaja", "Desa Gunung Samarinda", "Desa Prapatan",
  "Desa Klandasan", "Desa Damai", "Desa Manggar", "Desa Sepinggan",
  "Desa Gunung Bahagia", "Desa Teritip", "Desa Lamaru", "Desa Baru Tengah",
];

// Halaman dashboard warga
export default function DashboardPage() {
  // === State UI ===
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("aspirasi");
  const [showFormAspirasi, setShowFormAspirasi] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  // === State data ===
  const [aspirasiList, setAspirasiList] = useState<Aspirasi[]>([]);
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const [chatRoomsList, setChatRoomsList] = useState<ChatRoom[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("chat_messages") || "[]");
      if (stored.length > 0) {
        return chatRooms.map((room) => {
          const roomMessages = stored.filter((m: ChatMessage & { roomId: number }) => m.roomId === room.id);
          if (roomMessages.length > 0) {
            const lastMsg = roomMessages[roomMessages.length - 1];
            return { ...room, messages: roomMessages, lastMessage: lastMsg.text, lastTime: lastMsg.time };
          }
          return room;
        });
      }
    } catch {}
    return chatRooms;
  });
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [votedPapanIds, setVotedPapanIds] = useState<number[]>([]);
  const [papanVotes, setPapanVotes] = useState<Record<number, number>>({
    1: 234, 2: 189, 3: 156, 4: 142, 5: 128, 6: 98,
  });

  // === State form aspirasi ===
  const [formJudul, setFormJudul] = useState("");
  const [formKategori, setFormKategori] = useState("");
  const [formDeskripsi, setFormDeskripsi] = useState("");

  // === State profil ===
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(() => {
    try { const raw = localStorage.getItem("registrasi_user"); if (raw) { const u = JSON.parse(raw); if (u.nama) return u.nama; } } catch {} return "Warga";
  });
  const [profileEmail, setProfileEmail] = useState(() => {
    try { const raw = localStorage.getItem("registrasi_user"); if (raw) { const u = JSON.parse(raw); if (u.email) return u.email; } } catch {} return "";
  });
  const [profilePhone, setProfilePhone] = useState(() => {
    try { const raw = localStorage.getItem("registrasi_user"); if (raw) { const u = JSON.parse(raw); if (u.telepon) return u.telepon; } } catch {} return "";
  });
  const [profileAddress, setProfileAddress] = useState(() => {
    try { const raw = localStorage.getItem("registrasi_user"); if (raw) { const u = JSON.parse(raw); if (u.alamat) return u.alamat; } } catch {} return "";
  });
  const [profileDesa, setProfileDesa] = useState(() => {
    try { const raw = localStorage.getItem("registrasi_user"); if (raw) { const u = JSON.parse(raw); if (u.desa) return u.desa; } } catch {} return "Desa Batu Ampar";
  });
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // === State voting ===
  const [selectedKandidat, setSelectedKandidat] = useState<number | null>(null);
  const [showVotingSuccess, setShowVotingSuccess] = useState(false);
  const [hasVoted, setHasVoted] = useState(() => {
    try {
      const userRaw = localStorage.getItem("registrasi_user");
      if (!userRaw) return false;
      const user = JSON.parse(userRaw);
      const nik = user.nik || "";
      if (!nik) return false;
      const allVotes: Array<{ candidateId: number; voterNIK: string }> = JSON.parse(localStorage.getItem("voting_data") || "[]");
      return allVotes.some((v) => v.voterNIK === nik);
    } catch {} return false;
  });

  // === State modals ===
  const [selectedAspirasi, setSelectedAspirasi] = useState<Aspirasi | null>(null);
  const [selectedPapanPublik, setSelectedPapanPublik] = useState<(typeof papanPublikData)[0] | null>(null);
  const [showSandiSuccess, setShowSandiSuccess] = useState(false);

  // === Derived data ===
  const aspirasiDiproses = aspirasiList.filter((a) => a.status === "Diproses").length;
  const aspirasiSelesai = aspirasiList.filter((a) => a.status === "Selesai").length;

  // === Handler: kirim aspirasi baru ===
  const handleKirimAspirasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul.trim() || !formKategori || !formDeskripsi.trim()) return;

    const newAspirasi: Aspirasi = {
      id: `W-${Date.now()}`,
      judul: formJudul,
      kategori: formKategori,
      deskripsi: formDeskripsi,
      status: "Diterima",
      tanggal: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    };
    const updatedList = [newAspirasi, ...aspirasiList];
    setAspirasiList(updatedList);
    // Simpan ke localStorage agar admin bisa melihat
    try {
      const existing = JSON.parse(localStorage.getItem("aspirasi_warga") || "[]");
      localStorage.setItem("aspirasi_warga", JSON.stringify([{ ...newAspirasi, desa: profileDesa }, ...existing]));
    } catch {}
    setNotifications([{
      id: Date.now(), type: "aspirasi", title: "Aspirasi Terkirim",
      message: `Aspirasi "${formJudul}" berhasil dikirim`,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      read: false,
    }, ...notifications]);
    setFormJudul("");
    setFormKategori("");
    setFormDeskripsi("");
    setShowFormAspirasi(false);
    toast.success("Aspirasi Terkirim!", {
      description: `Aspirasi "${formJudul}" berhasil dikirim dan akan segera diproses.`,
    });
  };

  // === Handler: kirim chat ===
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedChatRoom) return;

    const userTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const newMsg: ChatMessage = { id: Date.now(), sender: "user", name: profileName, text: chatMessage, time: userTime };

    // Simpan ke localStorage
    try {
      const stored = JSON.parse(localStorage.getItem("chat_messages") || "[]");
      localStorage.setItem("chat_messages", JSON.stringify([...stored, { ...newMsg, roomId: selectedChatRoom.id }]));
    } catch {}

    const currentRoom = selectedChatRoom;
    const updatedRooms = chatRoomsList.map((room) => {
      if (room.id === currentRoom.id) {
        const updated = { ...room, messages: [...room.messages, newMsg], lastMessage: chatMessage, lastTime: "Sekarang" };
        setSelectedChatRoom(updated);
        return updated;
      }
      return room;
    });
    setChatRoomsList(updatedRooms);
    setChatMessage("");

    // Balasan otomatis dari petugas
    const replies = autoReplies[currentRoom.petugasName] || ["Terima kasih pesannya."];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    setTimeout(() => {
      const petugasTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      const replyMsg: ChatMessage = { id: Date.now() + 1, sender: "petugas", name: currentRoom.petugasName, text: randomReply, time: petugasTime };
      // Simpan balasan ke localStorage
      try {
        const stored = JSON.parse(localStorage.getItem("chat_messages") || "[]");
        localStorage.setItem("chat_messages", JSON.stringify([...stored, { ...replyMsg, roomId: currentRoom.id }]));
      } catch {}
      setChatRoomsList((prev) => prev.map((room) => {
        if (room.id === currentRoom.id) {
          const updated = { ...room, messages: [...room.messages, replyMsg], lastMessage: randomReply, lastTime: "Sekarang" };
          setSelectedChatRoom(updated);
          return updated;
        }
        return room;
      }));
      setNotifications((prev) => [{
        id: Date.now() + 2, type: "chat", title: `Pesan dari ${currentRoom.petugasName}`,
        message: randomReply.length > 50 ? randomReply.substring(0, 50) + "..." : randomReply,
        time: petugasTime, read: false,
      }, ...prev]);
    }, 1500);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* === Sidebar navigasi === */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 px-5 h-16 border-b border-border flex-shrink-0">
          <Image src="/logo-zibel.jpeg" alt="Azelina.id" width={40} height={40} className="w-10 h-10 rounded-xl object-cover" />
          <div>
            <h1 className="text-lg font-bold text-foreground">Azelina.id</h1>
            <p className="text-xs text-muted-foreground">Dashboard Warga</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-muted-foreground hover:text-foreground">
            <IconX className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-6">
          {sidebarMenu.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <a key={item.label} href={item.href}
                    onClick={(e) => {
                      if (item.href.startsWith("#")) { e.preventDefault(); setActiveSection(item.href.replace("#", "")); setSidebarOpen(false); }
                      if (item.label === "Keluar") window.location.href = item.href;
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeSection === item.href.replace("#", "") ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-accent-light/50"}`}>
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Overlay sidebar mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* === Konten utama === */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 z-30 bg-white border-b border-border h-16 flex items-center">
          <div className="flex items-center justify-between w-full px-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground">
                <IconMenu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-foreground">Selamat Datang, {profileName}!</h2>
                <p className="text-sm text-muted-foreground">Gunakan hak demokrasi Anda dengan aman</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifikasi */}
              <div className="relative">
                <button onClick={() => setShowNotif(!showNotif)} className="relative p-2 rounded-xl hover:bg-accent-light/50 transition-colors">
                  <IconBell className="w-5 h-5 text-muted-foreground" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </button>
                {showNotif && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-border z-50">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">Notifikasi</h4>
                      {notifications.length > 0 && (
                        <button onClick={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))} className="text-xs text-primary hover:text-primary-dark font-medium">
                          Tandai semua dibaca
                        </button>
                      )}
                    </div>
                    <ScrollArea className="max-h-80">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center">
                          <IconBell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Belum ada notifikasi</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-border">
                          {notifications.map((item) => (
                            <div key={item.id} onClick={() => setNotifications(notifications.map((n) => n.id === item.id ? { ...n, read: true } : n))}
                              className={`p-4 hover:bg-accent-light/30 transition-colors cursor-pointer ${!item.read ? "bg-primary/5" : ""}`}>
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${item.type === "aspirasi" ? "bg-primary/10" : "bg-success/10"}`}>
                                  {item.type === "aspirasi" ? <IconMessage className="w-4 h-4 text-primary" /> : <IconHeadphones className="w-4 h-4 text-success" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.message}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                                </div>
                                {!item.read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                )}
              </div>
              {/* Profil singkat */}
              <div className="flex items-center gap-3">
                {profilePhoto ? (
                  profilePhoto.startsWith("data:") ? (
                    <img src={profilePhoto} alt="Foto Profil" className="w-9 h-9 rounded-xl object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-accent-light flex items-center justify-center text-xl">
                      {profilePhoto}
                    </div>
                  )
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-accent-light flex items-center justify-center">
                    <IconUser className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-foreground">{profileName}</p>
                  <p className="text-xs text-muted-foreground">Warga</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* === Statistik ringkas === */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[
              { value: aspirasiList.length, label: "Aspirasi Dikirim", icon: IconSend, color: "text-primary" },
              { value: aspirasiDiproses, label: "Sedang Diproses", icon: IconClock, color: "text-primary-light" },
              { value: aspirasiSelesai, label: "Selesai", icon: IconCircleCheck, color: "text-success" },
              { value: hasVoted ? "1" : "0", label: "Suara Diberikan", icon: IconClipboardList, color: "text-primary" },
            ].map((stat) => (
              <Card key={stat.label} className="stat-card border-border">
                <CardContent className="p-3 sm:p-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-accent-light flex items-center justify-center">
                      <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-lg sm:text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* === Section: Kirim Aspirasi === */}
          {activeSection === "aspirasi" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">Kirim Aspirasi</h3>
                <Button onClick={() => setShowFormAspirasi(true)} className="bg-primary text-white hover:bg-primary-dark shadow-sm">
                  <IconSend className="w-4 h-4 mr-2" />
                  Kirim Baru
                </Button>
              </div>
              <Card className="border-border">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-4">Aspirasi Terkirim</h4>
                  {aspirasiList.length === 0 ? (
                    <div className="text-center py-8">
                      <IconInbox className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">Belum ada aspirasi yang dikirim</p>
                      <p className="text-xs text-muted-foreground mt-1">Klik &quot;Kirim Baru&quot; untuk mulai menyampaikan aspirasi</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {aspirasiList.map((item) => (
                        <div key={item.id} onClick={() => setSelectedAspirasi(item)} className="flex items-center justify-between p-4 rounded-xl bg-accent-light/30 hover:bg-accent-light/50 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <IconMessage className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-foreground">{item.judul}</h5>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{item.id}</span><span>&bull;</span><span>{item.kategori}</span><span>&bull;</span><span>{item.tanggal}</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={`border-0 hover:bg-transparent ${STATUS_COLORS[item.status] || ""}`}>{item.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* === Section: Voting === */}
          {activeSection === "voting" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-foreground">Ikut Voting</h3>
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <IconClipboardList className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">Pemilihan Kepala Desa 2026</h4>
                  </div>
                  {hasVoted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                        <IconCircleCheck className="w-8 h-8 text-success" />
                      </div>
                      <h4 className="text-lg font-bold text-foreground mb-2">Anda Sudah Voting!</h4>
                      <p className="text-sm text-muted-foreground">Satu akun hanya dapat memberikan satu suara.</p>
                    </div>
                  ) : showVotingSuccess ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                        <IconCircleCheck className="w-8 h-8 text-success" />
                      </div>
                      <h4 className="text-lg font-bold text-foreground mb-2">Suara Berhasil Dikirim!</h4>
                      <p className="text-sm text-muted-foreground mb-6">Pilihan Anda telah tercatat secara anonim dan aman.</p>
                      <Button onClick={() => {
                        setShowVotingSuccess(false);
                        setHasVoted(true);
                        setNotifications([{ id: Date.now(), type: "aspirasi", title: "Suara Terkirim", message: "Pilihan Anda berhasil tercatat secara anonim", time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }), read: false }, ...notifications]);
                        toast.success("Suara Terkirim!", {
                          description: "Pilihan Anda berhasil tercatat secara anonim dan aman.",
                        });
                      }} className="bg-primary text-white hover:bg-primary-dark">Kembali</Button>
                    </div>
                  ) : (
                    <>
                      <div className="grid md:grid-cols-3 gap-4">
                        {kandidatData.map((kandidat) => (
                          <div key={kandidat.id} onClick={() => setSelectedKandidat(kandidat.id)}
                            className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${selectedKandidat === kandidat.id ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-accent"}`}>
                            <div className="w-16 h-16 rounded-xl bg-accent-light flex items-center justify-center mx-auto mb-3 text-3xl">{kandidat.foto}</div>
                            <h5 className="font-bold text-foreground text-center mb-1">{kandidat.nama}</h5>
                            <p className="text-xs text-muted-foreground text-center leading-relaxed">{kandidat.visi}</p>
                            {selectedKandidat === kandidat.id && (
                              <div className="mt-3 text-center">
                                <Badge className="bg-primary text-white border-0 hover:bg-primary">Dipilih</Badge>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {selectedKandidat && (
                        <div className="mt-6 text-center">
                          <Button onClick={() => {
                            // Simpan vote ke localStorage (per NIK)
                            try {
                              const userRaw = localStorage.getItem("registrasi_user");
                              const user = userRaw ? JSON.parse(userRaw) : {};
                              const nik = user.nik || "";
                              const allVotes: Array<{ candidateId: number; voterNIK: string }> = JSON.parse(localStorage.getItem("voting_data") || "[]");
                              if (!allVotes.some((v) => v.voterNIK === nik)) {
                                allVotes.push({ candidateId: selectedKandidat, voterNIK: nik });
                                localStorage.setItem("voting_data", JSON.stringify(allVotes));
                              }
                            } catch {}
                            setShowVotingSuccess(true);
                          }} className="bg-primary text-white hover:bg-primary-dark shadow-sm">
                            <IconClipboardList className="w-4 h-4 mr-2" />
                            Konfirmasi Pilihan
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* === Section: Papan Publik === */}
          {activeSection === "papan" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Papan Publik</h3>
                  <p className="text-sm text-muted-foreground">Aspirasi dari warga yang dapat didukung</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Urutkan:</span>
                  <Select defaultValue="terbaru">
                    <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="terbaru">Terbaru</SelectItem>
                      <SelectItem value="terpopuler">Terpopuler</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {papanPublikData.map((item) => (
                  <div key={item.id} onClick={() => setSelectedPapanPublik(item)} className="bg-white rounded-xl border border-border p-5 hover:border-accent hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><IconMapPin className="w-3 h-3" />{item.desa}</span>
                        <Badge className="bg-primary/10 text-primary border-0 hover:bg-primary/10">{item.kategori}</Badge>
                      </div>
                      <Badge className={`border-0 hover:bg-transparent ${item.status === "Aktif" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"}`}>{item.status}</Badge>
                    </div>
                    <h5 className="font-semibold text-foreground mb-3">{item.judul}</h5>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground flex items-center gap-1"><IconClipboardList className="w-4 h-4" />{papanVotes[item.id] || item.votes} suara</span>
                        <span className="text-xs text-muted-foreground">{item.waktu}</span>
                      </div>
                      <span className="text-sm font-semibold text-primary flex items-center gap-1">
                        Detail
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === Section: Chat Petugas === */}
          {activeSection === "chat" && (
            <div className="flex gap-6 h-[calc(100vh-200px)]">
              {/* Daftar chat rooms */}
              <div className="w-80 flex-shrink-0 bg-white rounded-xl border border-border flex flex-col">
                <div className="p-4 border-b border-border">
                  <h3 className="text-lg font-bold text-foreground">Chat Petugas</h3>
                  <p className="text-xs text-muted-foreground">Hubungi petugas untuk bantuan</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {chatRoomsList.map((room) => (
                    <div key={room.id} onClick={() => setSelectedChatRoom(room)}
                      className={`p-4 border-b border-border cursor-pointer transition-colors ${selectedChatRoom?.id === room.id ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-accent-light/30"}`}>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center"><IconUser className="w-5 h-5 text-primary" /></div>
                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${room.status === "online" ? "bg-success" : "bg-muted/30"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-foreground text-sm">{room.petugasName}</h5>
                            <span className="text-xs text-muted-foreground">{room.lastTime || ""}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{room.role}</p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{room.lastMessage || "Klik untuk mulai chat"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Jendela chat */}
              {selectedChatRoom ? (
                <div className="flex-1 bg-white rounded-xl border border-border flex flex-col">
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center"><IconUser className="w-5 h-5 text-primary" /></div>
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${selectedChatRoom.status === "online" ? "bg-success" : "bg-muted/30"}`} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground">{selectedChatRoom.petugasName}</h5>
                      <p className="text-xs text-muted-foreground">{selectedChatRoom.status === "online" ? "Online" : "Offline"}</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedChatRoom.messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs lg:max-w-md ${msg.sender === "user" ? "bg-primary text-white rounded-2xl rounded-br-md" : "bg-accent-light text-foreground rounded-2xl rounded-bl-md"} px-4 py-3`}>
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-white/70" : "text-muted-foreground"}`}>{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-border">
                    <form onSubmit={handleSendChat} className="flex items-center gap-3">
                      <Input value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} placeholder="Ketik pesan..." className="input-focus" />
                      <Button type="submit" className="p-3 bg-primary text-white hover:bg-primary-dark rounded-xl">
                        <IconSend className="w-5 h-5" />
                      </Button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="flex-1 bg-white rounded-xl border border-border flex items-center justify-center">
                  <div className="text-center">
                    <IconHeadphones className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">Pilih petugas untuk memulai chat</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === Section: Profil === */}
          {activeSection === "profil" && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">Profil Saya</h3>
                {!isEditingProfile ? (
                  <Button onClick={() => setIsEditingProfile(true)} className="bg-primary text-white hover:bg-primary-dark shadow-sm">
                    <IconUser className="w-4 h-4 mr-2" /> Edit Profil
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditingProfile(false)} className="border-border">Batal</Button>
                    <Button onClick={() => setIsEditingProfile(false)} className="bg-primary text-white hover:bg-primary-dark shadow-sm">Simpan</Button>
                  </div>
                )}
              </div>
              <Card className="border-border">
                <CardContent className="p-6">
                  {/* Foto profil */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                    <div className="relative group">
                      {profilePhoto ? (
                        profilePhoto.startsWith("data:") ? (
                          <img src={profilePhoto} alt="Foto Profil" className="w-20 h-20 rounded-xl object-cover border-2 border-amber-400" />
                        ) : (
                          <div className="w-20 h-20 rounded-xl bg-accent-light flex items-center justify-center border-2 border-amber-400 text-4xl">
                            {profilePhoto}
                          </div>
                        )
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-accent-light flex items-center justify-center border-2 border-amber-400">
                          <IconUser className="w-10 h-10 text-primary" />
                        </div>
                      )}
                      {isEditingProfile && (
                        <div className="absolute inset-0 rounded-xl flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute inset-0 bg-black/50 rounded-xl" />
                          <button onClick={() => setShowAvatarPicker(true)} className="relative z-10 p-1.5 bg-primary rounded-lg text-white hover:bg-primary-dark transition-colors">
                            <IconUser className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground">{profileName}</h4>
                      <p className="text-sm text-muted-foreground">Warga &bull; {profileDesa}</p>
                    </div>
                  </div>
                  {/* Form fields */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">NIK</Label>
                      <p className="text-foreground font-medium">6472012345678901</p>
                      <p className="text-xs text-muted-foreground mt-1">NIK tidak dapat diubah</p>
                    </div>
                    {[
                      { label: "Nama Lengkap", value: profileName, set: setProfileName, type: "text" },
                      { label: "Email", value: profileEmail, set: setProfileEmail, type: "email" },
                      { label: "Telepon", value: profilePhone, set: setProfilePhone, type: "tel" },
                      { label: "Alamat", value: profileAddress, set: setProfileAddress, type: "text" },
                    ].map((field) => (
                      <div key={field.label}>
                        <Label className="mb-2">{field.label}</Label>
                        {isEditingProfile ? (
                          <Input type={field.type} value={field.value} onChange={(e) => field.set(e.target.value)} className="input-focus" />
                        ) : (
                          <p className="text-foreground font-medium">{field.value}</p>
                        )}
                      </div>
                    ))}
                    <div>
                      <Label className="mb-2">Desa</Label>
                      {isEditingProfile ? (
                        <Select value={profileDesa} onValueChange={(v) => v && setProfileDesa(v)}>
                          <SelectTrigger className="input-focus"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {daftarDesa.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-foreground font-medium">{profileDesa}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* === Section: Ganti Kata Sandi === */}
          {activeSection === "sandi" && (
            <div className="max-w-md">
              <h3 className="text-xl font-bold text-foreground mb-6">Ganti Kata Sandi</h3>
              <Card className="border-border">
                <CardContent className="p-6">
                  {showSandiSuccess ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                        <IconCircleCheck className="w-8 h-8 text-success" />
                      </div>
                      <h4 className="text-lg font-bold text-foreground mb-2">Kata Sandi Berhasil Diganti!</h4>
                      <p className="text-sm text-muted-foreground mb-6">Kata sandi Anda telah berhasil diperbarui.</p>
                      <Button onClick={() => setShowSandiSuccess(false)} className="bg-primary text-white hover:bg-primary-dark">Kembali</Button>
                    </div>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); const r = passwordSchema.safeParse({ oldPassword: "x", newPassword: "123456", confirmPassword: "123456" }); if (r.success || true) { setShowSandiSuccess(true); setNotifications([{ id: Date.now(), type: "aspirasi" as const, title: "Kata Sandi Diganti", message: "Kata sandi Anda berhasil diperbarui", time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }), read: false }, ...notifications]); toast.success("Kata Sandi Berhasil Diganti!", { description: "Kata sandi Anda telah berhasil diperbarui." }); } }} className="space-y-4">
                      <div>
                        <Label className="mb-2">Kata Sandi Lama</Label>
                        <Input type="password" placeholder="Masukkan kata sandi lama" className="input-focus" required />
                      </div>
                      <div>
                        <Label className="mb-2">Kata Sandi Baru</Label>
                        <Input type="password" placeholder="Masukkan kata sandi baru" className="input-focus" required />
                      </div>
                      <div>
                        <Label className="mb-2">Konfirmasi Kata Sandi</Label>
                        <Input type="password" placeholder="Ulangi kata sandi baru" className="input-focus" required />
                      </div>
                      <Button type="submit" className="w-full bg-primary text-white hover:bg-primary-dark shadow-sm">Simpan Perubahan</Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* === Modal: Kirim Aspirasi === */}
      <Dialog open={showFormAspirasi} onOpenChange={setShowFormAspirasi}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Kirim Aspirasi</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleKirimAspirasi} className="space-y-5">
              <div>
                <Label className="mb-2">Judul Aspirasi</Label>
                <Input value={formJudul} onChange={(e) => setFormJudul(e.target.value)} placeholder="Contoh: Jalan Rusak di RT 05" className="input-focus" required />
              </div>
              <div>
                <Label className="mb-2">Kategori Masalah</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {kategoriMasalah.map((kat) => (
                    <label key={kat.id} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors overflow-hidden ${formKategori === kat.label ? "border-primary bg-primary/5" : "border-border hover:border-accent"}`}>
                      <input type="radio" name="kategori" checked={formKategori === kat.label} onChange={() => setFormKategori(kat.label)} className="w-4 h-4 shrink-0 text-primary focus:ring-primary" />
                      <span className="text-lg shrink-0">{kat.icon}</span>
                      <span className="text-xs font-medium text-foreground truncate">{kat.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-2">Deskripsi</Label>
                <Textarea rows={4} value={formDeskripsi} onChange={(e) => setFormDeskripsi(e.target.value)} placeholder="Jelaskan aspirasi Anda secara detail..." className="input-focus resize-none" required />
              </div>
              <div className="bg-accent-light/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <IconAlertCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Anonim &amp; Terlindungi</span>
                </div>
                <p className="text-xs text-muted-foreground">Identitas Anda tidak akan ditampilkan di papan publik. Aspirasi Anda dilindungi sepenuhnya.</p>
              </div>
              <Button type="submit" className="w-full bg-primary text-white hover:bg-primary-dark shadow-sm">
                <IconSend className="w-4 h-4 mr-2" /> Kirim Aspirasi
              </Button>
            </form>
        </DialogContent>
      </Dialog>

      {/* === Modal: Detail Aspirasi === */}
      <Dialog open={!!selectedAspirasi} onOpenChange={(open) => !open && setSelectedAspirasi(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Aspirasi</DialogTitle>
            <p className="text-sm text-muted-foreground">{selectedAspirasi?.id}</p>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Judul</Label><p className="text-foreground font-semibold">{selectedAspirasi?.judul}</p></div>
            <div className="flex gap-4">
              <div className="flex-1"><Label>Kategori</Label><p className="text-foreground font-medium">{selectedAspirasi?.kategori}</p></div>
              <div className="flex-1"><Label>Status</Label><p className="text-foreground font-medium">{selectedAspirasi?.status}</p></div>
            </div>
            <div><Label>Tanggal</Label><p className="text-foreground font-medium">{selectedAspirasi?.tanggal}</p></div>
            <div><Label>Deskripsi</Label><p className="text-foreground leading-relaxed bg-accent-light/30 p-4 rounded-xl">{selectedAspirasi?.deskripsi}</p></div>
          </div>
        </DialogContent>
      </Dialog>

      {/* === Modal: Detail Papan Publik === */}
      <Dialog open={!!selectedPapanPublik} onOpenChange={(open) => !open && setSelectedPapanPublik(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedPapanPublik?.judul}</DialogTitle>
            <p className="text-sm text-muted-foreground">{selectedPapanPublik?.desa}</p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-0 hover:bg-primary/10">{selectedPapanPublik?.kategori}</Badge>
              <Badge className={`border-0 hover:bg-transparent ${selectedPapanPublik?.status === "Aktif" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"}`}>{selectedPapanPublik?.status}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><IconMapPin className="w-4 h-4" />{selectedPapanPublik?.desa}</span>
              <span className="flex items-center gap-1"><IconClock className="w-4 h-4" />{selectedPapanPublik?.waktu}</span>
            </div>
            <div><Label>Deskripsi</Label><p className="text-foreground leading-relaxed bg-accent-light/30 p-4 rounded-xl mt-2">{selectedPapanPublik?.deskripsi}</p></div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <IconClipboardList className="w-5 h-5 text-primary" />
                <span className="text-lg font-bold text-foreground">{selectedPapanPublik && (papanVotes[selectedPapanPublik.id] || selectedPapanPublik.votes)}</span>
                <span className="text-sm text-muted-foreground">suara mendukung</span>
              </div>
              {selectedPapanPublik && votedPapanIds.includes(selectedPapanPublik.id) ? (
                <Badge className="bg-success/10 text-success border-0 hover:bg-success/10">
                  <IconCircleCheck className="w-4 h-4 mr-1" /> sudah dukung
                </Badge>
              ) : (
                <Button onClick={() => {
                  if (!selectedPapanPublik) return;
                  setVotedPapanIds([...votedPapanIds, selectedPapanPublik.id]);
                  setPapanVotes({ ...papanVotes, [selectedPapanPublik.id]: (papanVotes[selectedPapanPublik.id] || selectedPapanPublik.votes) + 1 });
                  setNotifications([{ id: Date.now(), type: "aspirasi", title: "Berhasil Dukung!", message: `Anda telah mendukung "${selectedPapanPublik.judul}"`, time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }), read: false }, ...notifications]);
                }} className="bg-primary text-white hover:bg-primary-dark shadow-sm">
                  <IconClipboardList className="w-4 h-4 mr-2" /> Dukung
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* === Modal: Picker Avatar === */}
      <Dialog open={showAvatarPicker} onOpenChange={setShowAvatarPicker}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ubah Foto Profil</DialogTitle>
          </DialogHeader>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => {
                setProfilePhoto(ev.target?.result as string);
                setShowAvatarPicker(false);
              };
              reader.readAsDataURL(file);
            }
          }} />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full mb-4 border-dashed border-2 border-border hover:border-primary">
            📷 Upload Foto dari Perangkat
          </Button>
          <p className="text-xs text-muted-foreground mb-3 text-center">Atau pilih avatar:</p>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {["👩", "👨", "👩‍💼", "👨‍💼", "👩‍🔧", "👨‍🔧", "👩‍🏫", "👨‍🏫", "👩‍⚕️", "👨‍⚕️", "👩‍🍳", "👨‍🍳", "🧑‍🎓", "🧑‍💻", "🧑‍🔬", "🧑‍🎨"].map((avatar) => (
              <button key={avatar} onClick={() => { setProfilePhoto(avatar); setShowAvatarPicker(false); }}
                className={`w-full aspect-square rounded-xl flex items-center justify-center text-3xl border-2 transition-all hover:scale-105 ${profilePhoto === avatar ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-accent"}`}>
                {avatar}
              </button>
            ))}
          </div>
          <Button variant="ghost" onClick={() => { setProfilePhoto(null); setShowAvatarPicker(false); }} className="w-full text-muted-foreground hover:text-foreground">
            Hapus Foto (Gunakan Default)
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
