"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MessageSquare,
  Vote,
  Globe,
  User,
  Lock,
  LogOut,
  Menu,
  X,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Bell,
  Inbox,
  Headphones,
  MapPin,
} from "lucide-react";

const sidebarMenu = [
  {
    label: "Platform Aspirasi",
    items: [
      { icon: Send, label: "Kirim Aspirasi", href: "#aspirasi" },
      { icon: Vote, label: "Ikut Voting", href: "#voting" },
      { icon: Globe, label: "Papan Publik", href: "#papan" },
      { icon: Headphones, label: "Chat Petugas", href: "#chat" },
    ],
  },
  {
    label: "Pengaturan Akun",
    items: [
      { icon: User, label: "Profil Saya", href: "#profil" },
      { icon: Lock, label: "Ganti Kata Sandi", href: "#sandi" },
      { icon: LogOut, label: "Keluar", href: "/login" },
    ],
  },
];

const kategoriMasalah = [
  { id: "infra", label: "Infrastruktur", icon: "🚧" },
  { id: "lingkungan", label: "Lingkungan", icon: "🌿" },
  { id: "pelayanan", label: "Pelayanan Publik", icon: "🏛️" },
  { id: "keamanan", label: "Keamanan", icon: "🛡️" },
  { id: "kesehatan", label: "Kesehatan", icon: "🏥" },
  { id: "pendidikan", label: "Pendidikan", icon: "📚" },
];

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

const chatRooms: ChatRoom[] = [
  {
    id: 1,
    petugasName: "Pak Budi",
    role: "Admin Desa",
    status: "online",
    lastMessage: "",
    lastTime: "",
    messages: [],
  },
  {
    id: 2,
    petugasName: "Bu Siti",
    role: "Petugas Keamanan",
    status: "online",
    lastMessage: "",
    lastTime: "",
    messages: [],
  },
  {
    id: 3,
    petugasName: "Pak Ahmad",
    role: "Kepala Desa",
    status: "offline",
    lastMessage: "",
    lastTime: "",
    messages: [],
  },
];

const autoReplies: Record<string, string[]> = {
  "Pak Budi": [
    "Halo! Selamat datang di Azelina.id. Ada yang bisa saya bantu?",
    "Untuk pengajuan aspirasi, silakan masuk ke menu Kirim Aspirasi ya.",
    "Terima kasih atas informasinya. Akan segera kami tindaklanjuti.",
    "Jika ada pertanyaan lain, jangan ragu untuk bertanya.",
  ],
  "Bu Siti": [
    "Halo! Ada yang bisa saya bantu terkait keamanan desa?",
    "Untuk laporan keamanan, bisa langsung disampaikan di sini.",
    "Terima kasih, sudah kami catat laporannya.",
    "Saya akan bantu koordinasi dengan tim terkait.",
  ],
  "Pak Ahmad": [
    "Selamat datang di layanan Kepala Desa.",
    "Silakan sampaikan aspirasi atau keluhan Anda.",
    "Kami berkomitmen untuk menindaklanjuti setiap laporan warga.",
    "Terima kasih atas partisipasi Anda dalam demokrasi desa.",
  ],
};

interface NotifItem {
  id: number;
  type: "aspirasi" | "chat";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("aspirasi");
  const [showFormAspirasi, setShowFormAspirasi] = useState(false);
  const [aspirasiList, setAspirasiList] = useState<Aspirasi[]>([]);
  const [selectedAspirasi, setSelectedAspirasi] = useState<Aspirasi | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("Abel Zihan");
  const [profileEmail, setProfileEmail] = useState("abelzihan@gmail.com");
  const [profilePhone, setProfilePhone] = useState("089608574922");
  const [profileAddress, setProfileAddress] = useState("Jl. Al-Falah Dahor 2");
  const [profileDesa, setProfileDesa] = useState("Desa Batu Ampar");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const [chatRoomsList, setChatRoomsList] = useState<ChatRoom[]>(chatRooms);
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [selectedPapanPublik, setSelectedPapanPublik] = useState<{ id: number; desa: string; judul: string; kategori: string; votes: number; status: string; waktu: string; deskripsi: string } | null>(null);
  const [showSandiSuccess, setShowSandiSuccess] = useState(false);
  const [selectedKandidat, setSelectedKandidat] = useState<number | null>(null);
  const [showVotingSuccess, setShowVotingSuccess] = useState(false);
  const [votedPapanIds, setVotedPapanIds] = useState<number[]>([]);
  const [papanVotes, setPapanVotes] = useState<Record<number, number>>({
    1: 234, 2: 189, 3: 156, 4: 142, 5: 128, 6: 98,
  });

  const [formJudul, setFormJudul] = useState("");
  const [formKategori, setFormKategori] = useState("");
  const [formDeskripsi, setFormDeskripsi] = useState("");

  const handleKirimAspirasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul || !formKategori || !formDeskripsi) return;

    const newAspirasi: Aspirasi = {
      id: `ASP-${String(aspirasiList.length + 1).padStart(3, "0")}`,
      judul: formJudul,
      kategori: formKategori,
      deskripsi: formDeskripsi,
      status: "Diterima",
      tanggal: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    };

    setAspirasiList([newAspirasi, ...aspirasiList]);
    setNotifications([{
      id: Date.now(),
      type: "aspirasi",
      title: "Aspirasi Terkirim",
      message: `Aspirasi "${formJudul}" berhasil dikirim`,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      read: false,
    }, ...notifications]);
    setFormJudul("");
    setFormKategori("");
    setFormDeskripsi("");
    setShowFormAspirasi(false);
  };

  const aspirasiDiproses = aspirasiList.filter((a) => a.status === "Diproses").length;
  const aspirasiSelesai = aspirasiList.filter((a) => a.status === "Selesai").length;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 p-6 border-b border-border">
          <Image src="/logo-zibel.jpeg" alt="Azelina.id" width={40} height={40} className="w-10 h-10 rounded-xl object-cover" />
          <div>
            <h1 className="text-lg font-bold text-foreground">Azelina.id</h1>
            <p className="text-xs text-muted">Dashboard Warga</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-muted hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-6">
          {sidebarMenu.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 px-3">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      if (item.href.startsWith("#")) {
                        e.preventDefault();
                        setActiveSection(item.href.replace("#", ""));
                        setSidebarOpen(false);
                      }
                      if (item.label === "Keluar") {
                        window.location.href = item.href;
                      }
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeSection === item.href.replace("#", "")
                        ? "bg-primary text-white shadow-sm"
                        : "text-muted hover:text-foreground hover:bg-accent-light/50"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted hover:text-foreground">
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-foreground">Selamat Datang, Warga!</h2>
                <p className="text-sm text-muted">Gunakan hak demokrasi Anda dengan aman</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotif(!showNotif)}
                  className="relative p-2 rounded-xl hover:bg-accent-light/50 transition-colors"
                >
                  <Bell className="w-5 h-5 text-muted" />
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
                        <button
                          onClick={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))}
                          className="text-xs text-primary hover:text-primary-dark font-medium"
                        >
                          Tandai semua dibaca
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center">
                          <Bell className="w-10 h-10 text-muted/30 mx-auto mb-2" />
                          <p className="text-sm text-muted">Belum ada notifikasi</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-border">
                          {notifications.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => {
                                setNotifications(notifications.map((n) =>
                                  n.id === item.id ? { ...n, read: true } : n
                                ));
                              }}
                              className={`p-4 hover:bg-accent-light/30 transition-colors cursor-pointer ${
                                !item.read ? "bg-primary/5" : ""
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                  item.type === "aspirasi" ? "bg-primary/10" : "bg-success/10"
                                }`}>
                                  {item.type === "aspirasi" ? (
                                    <MessageSquare className="w-4 h-4 text-primary" />
                                  ) : (
                                    <Headphones className="w-4 h-4 text-success" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                                  <p className="text-xs text-muted mt-0.5 truncate">{item.message}</p>
                                  <p className="text-xs text-muted mt-1">{item.time}</p>
                                </div>
                                {!item.read && (
                                  <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent-light flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-foreground">Abel Zihan</p>
                  <p className="text-xs text-muted">Warga</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="stat-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-accent-light flex items-center justify-center">
                  <Send className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{aspirasiList.length}</p>
                  <p className="text-xs text-muted">Aspirasi Dikirim</p>
                </div>
              </div>
            </div>
            <div className="stat-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-accent-light flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary-light" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{aspirasiDiproses}</p>
                  <p className="text-xs text-muted">Sedang Diproses</p>
                </div>
              </div>
            </div>
            <div className="stat-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-accent-light flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{aspirasiSelesai}</p>
                  <p className="text-xs text-muted">Selesai</p>
                </div>
              </div>
            </div>
            <div className="stat-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-accent-light flex items-center justify-center">
                  <Vote className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-xs text-muted">Suara Diberikan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kirim Aspirasi Section */}
          {activeSection === "aspirasi" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">Kirim Aspirasi</h3>
                <button
                  onClick={() => setShowFormAspirasi(true)}
                  className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  Kirim Baru
                </button>
              </div>

              {/* Aspirasi Terkirim */}
              <div className="bg-white rounded-xl border border-border p-6">
                <h4 className="font-semibold text-foreground mb-4">Aspirasi Terkirim</h4>
                {aspirasiList.length === 0 ? (
                  <div className="text-center py-8">
                    <Inbox className="w-12 h-12 text-muted/30 mx-auto mb-3" />
                    <p className="text-muted">Belum ada aspirasi yang dikirim</p>
                    <p className="text-xs text-muted mt-1">Klik &quot;Kirim Baru&quot; untuk mulai menyampaikan aspirasi</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {aspirasiList.map((item) => {
                      const statusColor: Record<string, string> = {
                        Diproses: "bg-primary/10 text-primary",
                        Diterima: "bg-accent-light text-primary-dark",
                        Selesai: "bg-success/10 text-success",
                      };
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedAspirasi(item)}
                          className="flex items-center justify-between p-4 rounded-xl bg-accent-light/30 hover:bg-accent-light/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <MessageSquare className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-foreground">{item.judul}</h5>
                              <div className="flex items-center gap-2 text-xs text-muted">
                                <span>{item.id}</span>
                                <span>&bull;</span>
                                <span>{item.kategori}</span>
                                <span>&bull;</span>
                                <span>{item.tanggal}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[item.status] || ""}`}>{item.status}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Voting Section */}
          {activeSection === "voting" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-foreground">Ikut Voting</h3>
              <div className="bg-white rounded-xl border border-border p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Vote className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-foreground">Pemilihan Kepala Desa 2026</h4>
                </div>
                {showVotingSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-success" />
                    </div>
                    <h4 className="text-lg font-bold text-foreground mb-2">Suara Berhasil Dikirim!</h4>
                    <p className="text-sm text-muted mb-6">Pilihan Anda telah tercatat secara anonim dan aman. Terima kasih telah berpartisipasi dalam demokrasi desa.</p>
                    <button
                      onClick={() => { setShowVotingSuccess(false); setSelectedKandidat(null); }}
                      className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                    >
                      Kembali
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { id: 1, nama: "Siti Aminah", visi: "Desa yang maju, sejahtera, dan berdaya saing tinggi melalui inovasi teknologi dan pemberdayaan UMKM.", foto: "👩" },
                        { id: 2, nama: "Budi Santoso", visi: "Transparansi anggaran, partisipasi warga aktif, dan pembangunan infrastruktur merata di semua dusun.", foto: "👨" },
                        { id: 3, nama: "Rahmawati", visi: "Lingkungan hijau, clean energy, dan kesehatan masyarakat yang prima untuk generasi masa depan.", foto: "👩" },
                      ].map((kandidat) => (
                        <div
                          key={kandidat.id}
                          onClick={() => setSelectedKandidat(kandidat.id)}
                          className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedKandidat === kandidat.id
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-border hover:border-accent"
                          }`}
                        >
                          <div className="w-16 h-16 rounded-xl bg-accent-light flex items-center justify-center mx-auto mb-3 text-3xl">
                            {kandidat.foto}
                          </div>
                          <h5 className="font-bold text-foreground text-center mb-1">{kandidat.nama}</h5>
                          <p className="text-xs text-muted text-center leading-relaxed">{kandidat.visi}</p>
                          {selectedKandidat === kandidat.id && (
                            <div className="mt-3 text-center">
                              <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary text-white">Dipilih</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {selectedKandidat && (
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => setShowVotingSuccess(true)}
                          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                        >
                          <Vote className="w-4 h-4" />
                          Konfirmasi Pilihan
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Papan Publik Section */}
          {activeSection === "papan" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Papan Publik</h3>
                  <p className="text-sm text-muted">Aspirasi dari warga yang dapat didukung</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">Urutkan:</span>
                  <select className="text-xs px-3 py-1.5 rounded-lg border border-border text-foreground focus:outline-none">
                    <option>Terbaru</option>
                    <option>Terpopuler</option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { id: 1, desa: "Desa Batu Ampar", judul: "Perbaikan Jalan Rusak di RT 05", kategori: "Infrastruktur", votes: 234, status: "Aktif", waktu: "2 jam lalu", deskripsi: "Jalan di RT 05 mengalami kerusakan parah akibat hujan deras. Lubang-lubang besar membahayakan pengendara dan pejalan kaki. Warga meminta segera dilakukan perbaikan sebelum ada korban." },
                  { id: 2, desa: "Desa Sempaja", judul: "Distribusi Air Bersih untuk Warga", kategori: "Pelayanan", votes: 189, status: "Aktif", waktu: "5 jam lalu", deskripsi: "Beberapa RT di Desa Sempaja masih mengalami kekurangan air bersih. Warga meminta pemerintah desa untuk menyediakan distribusi air bersih secara rutin." },
                  { id: 3, desa: "Desa Prapatan", judul: "Penerangan Jalan Umum Mati", kategori: "Keamanan", votes: 156, status: "Aktif", waktu: "1 hari lalu", deskripsi: "Lampu penerangan jalan di Jl. Prapatan sudah mati selama 2 minggu. Hal ini menyebabkan jalanan gelap dan meningkatkan risiko kecelakaan serta tindak kriminal." },
                  { id: 4, desa: "Desa Klandasan", judul: "Fasilitas Posyandu yang Layak", kategori: "Kesehatan", votes: 142, status: "Aktif", waktu: "1 hari lalu", deskripsi: "Posyandu di Desa Klandasan membutuhkan perbaikan fasilitas. Ruangan sempit dan peralatan yang kurang memadai menghambat pelayanan kesehatan ibu dan anak." },
                  { id: 5, desa: "Desa Damai", judul: "Pembangunan Trotoar Pejalan Kaki", kategori: "Infrastruktur", votes: 128, status: "Selesai", waktu: "2 hari lalu", deskripsi: "Warga mengusulkan pembangunan trotoar di Jl. Damai untuk keamanan pejalan kaki. Usulan ini sudah ditindaklanjuti dan trotoar telah selesai dibangun." },
                  { id: 6, desa: "Desa Manggar", judul: "Pengadaan Sampah Organik", kategori: "Lingkungan", votes: 98, status: "Aktif", waktu: "3 hari lalu", deskripsi: "Sampah organik di Desa Manggar belum ditangani dengan baik. Warga meminta pengadaan tempat sampah organik dan program kompos untuk mengurangi pencemaran lingkungan." },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPapanPublik(item)}
                    className="bg-white rounded-xl border border-border p-5 hover:border-accent hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item.desa}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">{item.kategori}</span>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        item.status === "Aktif" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                      }`}>{item.status}</span>
                    </div>
                    <h5 className="font-semibold text-foreground mb-3">{item.judul}</h5>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted flex items-center gap-1">
                          <Vote className="w-4 h-4" />
                          {papanVotes[item.id] || item.votes} suara
                        </span>
                        <span className="text-xs text-muted">{item.waktu}</span>
                      </div>
                      <span className="text-sm font-semibold text-primary flex items-center gap-1">
                        Detail
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Petugas Section */}
          {activeSection === "chat" && (
            <div className="flex gap-6 h-[calc(100vh-200px)]">
              {/* Chat List */}
              <div className="w-80 flex-shrink-0 bg-white rounded-xl border border-border flex flex-col">
                <div className="p-4 border-b border-border">
                  <h3 className="text-lg font-bold text-foreground">Chat Petugas</h3>
                  <p className="text-xs text-muted">Hubungi petugas untuk bantuan</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {chatRoomsList.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedChatRoom(room)}
                      className={`p-4 border-b border-border cursor-pointer transition-colors ${
                        selectedChatRoom?.id === room.id
                          ? "bg-primary/5 border-l-2 border-l-primary"
                          : "hover:bg-accent-light/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            room.status === "online" ? "bg-success" : "bg-muted/30"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-foreground text-sm">{room.petugasName}</h5>
                            <span className="text-xs text-muted">{room.lastTime || ""}</span>
                          </div>
                          <p className="text-xs text-muted">{room.role}</p>
                          <p className="text-xs text-muted truncate mt-0.5">
                            {room.lastMessage || "Klik untuk mulai chat"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Window */}
              {selectedChatRoom ? (
                <div className="flex-1 bg-white rounded-xl border border-border flex flex-col">
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        selectedChatRoom.status === "online" ? "bg-success" : "bg-muted/30"
                      }`} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground">{selectedChatRoom.petugasName}</h5>
                      <p className="text-xs text-muted">{selectedChatRoom.status === "online" ? "Online" : "Offline"}</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedChatRoom.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${
                          msg.sender === "user"
                            ? "bg-primary text-white rounded-2xl rounded-br-md"
                            : "bg-accent-light text-foreground rounded-2xl rounded-bl-md"
                        } px-4 py-3`}>
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-white/70" : "text-muted"}`}>{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-border">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!chatMessage.trim() || !selectedChatRoom) return;
                        
                        const userTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
                        const newMsg: ChatMessage = {
                          id: Date.now(),
                          sender: "user",
                          name: profileName,
                          text: chatMessage,
                          time: userTime,
                        };
                        
                        const currentRoom = selectedChatRoom;
                        const updatedRooms = chatRoomsList.map((room) => {
                          if (room.id === currentRoom.id) {
                            const updatedRoom = {
                              ...room,
                              messages: [...room.messages, newMsg],
                              lastMessage: chatMessage,
                              lastTime: "Sekarang",
                            };
                            setSelectedChatRoom(updatedRoom);
                            return updatedRoom;
                          }
                          return room;
                        });
                        setChatRoomsList(updatedRooms);
                        setChatMessage("");

                        // Auto reply dari petugas
                        const replies = autoReplies[currentRoom.petugasName] || ["Terima kasih pesannya."];
                        const randomReply = replies[Math.floor(Math.random() * replies.length)];
                        
                        setTimeout(() => {
                          const petugasTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
                          const replyMsg: ChatMessage = {
                            id: Date.now() + 1,
                            sender: "petugas",
                            name: currentRoom.petugasName,
                            text: randomReply,
                            time: petugasTime,
                          };
                          setChatRoomsList((prev) => prev.map((room) => {
                            if (room.id === currentRoom.id) {
                              const updatedRoom = {
                                ...room,
                                messages: [...room.messages, replyMsg],
                                lastMessage: randomReply,
                                lastTime: "Sekarang",
                              };
                              setSelectedChatRoom(updatedRoom);
                              return updatedRoom;
                            }
                            return room;
                          }));
                          setNotifications((prev) => [{
                            id: Date.now() + 2,
                            type: "chat",
                            title: `Pesan dari ${currentRoom.petugasName}`,
                            message: randomReply.length > 50 ? randomReply.substring(0, 50) + "..." : randomReply,
                            time: petugasTime,
                            read: false,
                          }, ...prev]);
                        }, 1500);
                      }}
                      className="flex items-center gap-3"
                    >
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Ketik pesan..."
                        className="flex-1 px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus"
                      />
                      <button
                        type="submit"
                        className="p-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="flex-1 bg-white rounded-xl border border-border flex items-center justify-center">
                  <div className="text-center">
                    <Headphones className="w-12 h-12 text-muted/30 mx-auto mb-3" />
                    <p className="text-muted">Pilih petugas untuk memulai chat</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profil Section */}
          {activeSection === "profil" && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">Profil Saya</h3>
                {!isEditingProfile ? (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                  >
                    <User className="w-4 h-4" />
                    Edit Profil
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="inline-flex items-center gap-2 bg-accent-light text-primary px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                    >
                      Simpan
                    </button>
                  </div>
                )}
              </div>
              <div className="bg-white rounded-xl border border-border p-6">
                {/* Foto Profil */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                  <div className="relative group">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Foto Profil" className="w-20 h-20 rounded-xl object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-accent-light flex items-center justify-center">
                        <User className="w-10 h-10 text-primary" />
                      </div>
                    )}
                    {isEditingProfile && (
                      <label className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <span className="text-white text-xs font-medium">Ganti Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setProfilePhoto(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground">{profileName}</h4>
                    <p className="text-sm text-muted">Warga &bull; {profileDesa}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted">NIK</label>
                    <p className="text-foreground font-medium">6472012345678901</p>
                    <p className="text-xs text-muted mt-1">NIK tidak dapat diubah</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Desa</label>
                    {isEditingProfile ? (
                      <select
                        value={profileDesa}
                        onChange={(e) => setProfileDesa(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border text-foreground focus:outline-none input-focus"
                      >
                        <option value="Desa Batu Ampar">Desa Batu Ampar</option>
                        <option value="Desa Sempaja">Desa Sempaja</option>
                        <option value="Desa Gunung Samarinda">Desa Gunung Samarinda</option>
                        <option value="Desa Prapatan">Desa Prapatan</option>
                        <option value="Desa Klandasan">Desa Klandasan</option>
                        <option value="Desa Damai">Desa Damai</option>
                        <option value="Desa Manggar">Desa Manggar</option>
                        <option value="Desa Sepinggan">Desa Sepinggan</option>
                        <option value="Desa Gunung Bahagia">Desa Gunung Bahagia</option>
                        <option value="Desa Teritip">Desa Teritip</option>
                        <option value="Desa Lamaru">Desa Lamaru</option>
                        <option value="Desa Baru Tengah">Desa Baru Tengah</option>
                      </select>
                    ) : (
                      <p className="text-foreground font-medium">{profileDesa}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Nama Lengkap</label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{profileName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    {isEditingProfile ? (
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{profileEmail}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Telepon</label>
                    {isEditingProfile ? (
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{profilePhone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Alamat</label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={profileAddress}
                        onChange={(e) => setProfileAddress(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{profileAddress}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ganti Kata Sandi Section */}
          {activeSection === "sandi" && (
            <div className="max-w-md">
              <h3 className="text-xl font-bold text-foreground mb-6">Ganti Kata Sandi</h3>
              <div className="bg-white rounded-xl border border-border p-6">
                {showSandiSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-success" />
                    </div>
                    <h4 className="text-lg font-bold text-foreground mb-2">Kata Sandi Berhasil Diganti!</h4>
                    <p className="text-sm text-muted mb-6">Kata sandi Anda telah berhasil diperbarui. Gunakan kata sandi baru untuk login berikutnya.</p>
                    <button
                      onClick={() => setShowSandiSuccess(false)}
                      className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                    >
                      Kembali
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setShowSandiSuccess(true);
                      setNotifications([{
                        id: Date.now(),
                        type: "aspirasi",
                        title: "Kata Sandi Diganti",
                        message: "Kata sandi Anda berhasil diperbarui",
                        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                        read: false,
                      }, ...notifications]);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Kata Sandi Lama</label>
                      <input type="password" placeholder="Masukkan kata sandi lama" className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Kata Sandi Baru</label>
                      <input type="password" placeholder="Masukkan kata sandi baru" className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Konfirmasi Kata Sandi</label>
                      <input type="password" placeholder="Ulangi kata sandi baru" className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus" required />
                    </div>
                    <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-sm">
                      Simpan Perubahan
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal Kirim Aspirasi */}
      {showFormAspirasi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFormAspirasi(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">Kirim Aspirasi</h3>
              <button onClick={() => setShowFormAspirasi(false)} className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <form onSubmit={handleKirimAspirasi} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Judul Aspirasi</label>
                  <input
                    type="text"
                    value={formJudul}
                    onChange={(e) => setFormJudul(e.target.value)}
                    placeholder="Contoh: Jalan Rusak di RT 05"
                    className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Kategori Masalah</label>
                  <div className="grid grid-cols-3 gap-2">
                    {kategoriMasalah.map((kat) => (
                      <label
                        key={kat.id}
                        className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                          formKategori === kat.label
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-accent"
                        }`}
                      >
                        <input
                          type="radio"
                          name="kategori"
                          checked={formKategori === kat.label}
                          onChange={() => setFormKategori(kat.label)}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-lg">{kat.icon}</span>
                        <span className="text-xs font-medium text-foreground">{kat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Deskripsi</label>
                  <textarea
                    rows={4}
                    value={formDeskripsi}
                    onChange={(e) => setFormDeskripsi(e.target.value)}
                    placeholder="Jelaskan aspirasi Anda secara detail..."
                    className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus resize-none"
                    required
                  />
                </div>
                <div className="bg-accent-light/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Anonim &amp; Terlindungi</span>
                  </div>
                  <p className="text-xs text-muted">Identitas Anda tidak akan ditampilkan di papan publik. Aspirasi Anda dilindungi sepenuhnya.</p>
                </div>
                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-sm">
                  <Send className="w-4 h-4" />
                  Kirim Aspirasi
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Aspirasi */}
      {selectedAspirasi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedAspirasi(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">Detail Aspirasi</h3>
                <p className="text-sm text-muted">{selectedAspirasi.id}</p>
              </div>
              <button onClick={() => setSelectedAspirasi(null)} className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-muted">Judul</label>
                <p className="text-foreground font-semibold">{selectedAspirasi.judul}</p>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted">Kategori</label>
                  <p className="text-foreground font-medium">{selectedAspirasi.kategori}</p>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted">Status</label>
                  <p className="text-foreground font-medium">{selectedAspirasi.status}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted">Tanggal</label>
                <p className="text-foreground font-medium">{selectedAspirasi.tanggal}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted">Deskripsi</label>
                <p className="text-foreground leading-relaxed bg-accent-light/30 p-4 rounded-xl">{selectedAspirasi.deskripsi}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Papan Publik */}
      {selectedPapanPublik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedPapanPublik(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">{selectedPapanPublik.judul}</h3>
                <p className="text-sm text-muted">{selectedPapanPublik.desa}</p>
              </div>
              <button onClick={() => setSelectedPapanPublik(null)} className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full font-medium">{selectedPapanPublik.kategori}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  selectedPapanPublik.status === "Aktif" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                }`}>{selectedPapanPublik.status}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {selectedPapanPublik.desa}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedPapanPublik.waktu}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-muted">Deskripsi</label>
                <p className="text-foreground leading-relaxed bg-accent-light/30 p-4 rounded-xl mt-2">{selectedPapanPublik.deskripsi}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Vote className="w-5 h-5 text-primary" />
                  <span className="text-lg font-bold text-foreground">{papanVotes[selectedPapanPublik.id] || selectedPapanPublik.votes}</span>
                  <span className="text-sm text-muted">suara mendukung</span>
                </div>
                {votedPapanIds.includes(selectedPapanPublik.id) ? (
                  <span className="inline-flex items-center gap-2 bg-success/10 text-success px-6 py-2.5 rounded-xl font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    sudah dukung
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setVotedPapanIds([...votedPapanIds, selectedPapanPublik.id]);
                      setPapanVotes({ ...papanVotes, [selectedPapanPublik.id]: (papanVotes[selectedPapanPublik.id] || selectedPapanPublik.votes) + 1 });
                      setNotifications([{
                        id: Date.now(),
                        type: "aspirasi",
                        title: "Berhasil Dukung!",
                        message: `Anda telah mendukung "${selectedPapanPublik.judul}"`,
                        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                        read: false,
                      }, ...notifications]);
                    }}
                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                  >
                    <Vote className="w-4 h-4" />
                    Dukung
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
