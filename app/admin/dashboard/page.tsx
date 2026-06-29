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
  Headphones,
  MapPin,
  BarChart3,
  Users,
  Settings,
  FileText,
  Eye,
  Trash2,
  CheckSquare,
  TrendingUp,
  PieChart,
} from "lucide-react";

const sidebarMenu = [
  {
    label: "Manajemen",
    items: [
      { icon: BarChart3, label: "Statistik", href: "#statistik" },
      { icon: MessageSquare, label: "Kelola Aspirasi", href: "#aspirasi" },
      { icon: Vote, label: "Kelola Voting", href: "#voting" },
      { icon: Users, label: "Kelola Warga", href: "#warga" },
      { icon: Globe, label: "Papan Publik", href: "#papan" },
    ],
  },
  {
    label: "Komunikasi",
    items: [
      { icon: Headphones, label: "Chat Warga", href: "#chat" },
    ],
  },
  {
    label: "Pengaturan",
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
  desa: string;
}

interface Warga {
  id: string;
  nama: string;
  nik: string;
  desa: string;
  email: string;
  telepon: string;
  status: "Aktif" | "Tidak Aktif";
  tanggalDaftar: string;
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
  wargaName: string;
  role: string;
  status: "online" | "offline";
  lastMessage: string;
  lastTime: string;
  messages: ChatMessage[];
}

interface Kandidat {
  id: number;
  nama: string;
  visi: string;
  foto: string;
  suara: number;
}

const initialAspirasiList: Aspirasi[] = [
  { id: "ASP-001", judul: "Jalan Rusak di RT 05", kategori: "Infrastruktur", deskripsi: "Jalan di RT 05 mengalami kerusakan parah akibat hujan deras. Lubang-lubang besar membahayakan pengendara dan pejalan kaki.", status: "Diproses", tanggal: "27 Jun 2026", desa: "Desa Batu Ampar" },
  { id: "ASP-002", judul: "Pencemaran Sungai", kategori: "Lingkungan", deskripsi: "Sungai di sekitar Desa Sempaja tercemar limbah domestik. Warga meminta penanganan segera.", status: "Diterima", tanggal: "26 Jun 2026", desa: "Desa Sempaja" },
  { id: "ASP-003", judul: "Lambatnya Pengurusan Dokumen", kategori: "Pelayanan", deskripsi: "Pengurusan dokumen kependudukan di kantor desa memakan waktu terlalu lama.", status: "Selesai", tanggal: "25 Jun 2026", desa: "Desa Prapatan" },
  { id: "ASP-004", judul: "Penerangan Jalan Mati", kategori: "Keamanan", deskripsi: "Lampu penerangan jalan di beberapa titik sudah mati selama 2 minggu.", status: "Diproses", tanggal: "24 Jun 2026", desa: "Desa Klandasan" },
  { id: "ASP-005", judul: "Kurangnya Fasilitas Puskesmas", kategori: "Kesehatan", deskripsi: "Puskesmas desa kekurangan alat kesehatan dan tenaga medis.", status: "Diterima", tanggal: "23 Jun 2026", desa: "Desa Damai" },
  { id: "ASP-006", judul: "Kekurangan Guru", kategori: "Pendidikan", deskripsi: "Sekolah desa kekurangan guru tetap, terutama mata pelajaran IPA dan Matematika.", status: "Diproses", tanggal: "22 Jun 2026", desa: "Desa Manggar" },
];

const initialWargaList: Warga[] = [
  { id: "W-001", nama: "Abel Zihan", nik: "6472012345678901", desa: "Desa Batu Ampar", email: "abelzihan@gmail.com", telepon: "089608574922", status: "Aktif", tanggalDaftar: "10 Jun 2026" },
  { id: "W-002", nama: "Rina Wati", nik: "6472012345678902", desa: "Desa Sempaja", email: "rinawati@gmail.com", telepon: "081234567890", status: "Aktif", tanggalDaftar: "12 Jun 2026" },
  { id: "W-003", nama: "Supriadi", nik: "6472012345678903", desa: "Desa Prapatan", email: "supriadi@gmail.com", telepon: "085678901234", status: "Aktif", tanggalDaftar: "15 Jun 2026" },
  { id: "W-004", nama: "Maya Putri", nik: "6472012345678904", desa: "Desa Klandasan", email: "mayaputri@gmail.com", telepon: "087890123456", status: "Aktif", tanggalDaftar: "18 Jun 2026" },
  { id: "W-005", nama: "Joko Susilo", nik: "6472012345678905", desa: "Desa Damai", email: "jokosusilo@gmail.com", telepon: "089012345678", status: "Tidak Aktif", tanggalDaftar: "20 Jun 2026" },
  { id: "W-006", nama: "Sari Dewi", nik: "6472012345678906", desa: "Desa Manggar", email: "saridewi@gmail.com", telepon: "083456789012", status: "Aktif", tanggalDaftar: "22 Jun 2026" },
];

const initialKandidatList: Kandidat[] = [
  { id: 1, nama: "Siti Aminah", visi: "Desa yang maju, sejahtera, dan berdaya saing tinggi melalui inovasi teknologi dan pemberdayaan UMKM.", foto: "👩", suara: 1842 },
  { id: 2, nama: "Budi Santoso", visi: "Transparansi anggaran, partisipasi warga aktif, dan pembangunan infrastruktur merata di semua dusun.", foto: "👨", suara: 1654 },
  { id: 3, nama: "Rahmawati", visi: "Lingkungan hijau, clean energy, dan kesehatan masyarakat yang prima untuk generasi masa depan.", foto: "👩", suara: 1520 },
];

const chatRooms: ChatRoom[] = [
  { id: 1, wargaName: "Rina Wati", role: "Warga Desa Sempaja", status: "online", lastMessage: "", lastTime: "", messages: [] },
  { id: 2, wargaName: "Supriadi", role: "Warga Desa Prapatan", status: "online", lastMessage: "", lastTime: "", messages: [] },
  { id: 3, wargaName: "Maya Putri", role: "Warga Desa Klandasan", status: "offline", lastMessage: "", lastTime: "", messages: [] },
];

const autoReplies: Record<string, string[]> = {
  "Rina Wati": [
    "Terima kasih atas aspirasinya. Kami akan segera menindaklanjuti.",
    "Laporan Anda sudah kami terima dan akan diproses.",
    "Silakan sampaikan keluhan Anda, kami siap membantu.",
  ],
  "Supriadi": [
    "Halo! Ada yang bisa kami bantu?",
    "Terima kasih telah menghubungi kami.",
    "Kami akan koordinasi dengan tim terkait.",
  ],
  "Maya Putri": [
    "Terima kasih pesannya. Akan segera kami tindaklanjuti.",
    "Kami catat laporan Anda. Terima kasih.",
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

export default function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("statistik");
  const [aspirasiList, setAspirasiList] = useState<Aspirasi[]>(initialAspirasiList);
  const [wargaList] = useState<Warga[]>(initialWargaList);
  const [kandidatList, setKandidatList] = useState<Kandidat[]>(initialKandidatList);
  const [showFormKandidat, setShowFormKandidat] = useState(false);
  const [formKandidatNama, setFormKandidatNama] = useState("");
  const [formKandidatVisi, setFormKandidatVisi] = useState("");
  const [formKandidatFoto, setFormKandidatFoto] = useState("👤");
  const [selectedAspirasi, setSelectedAspirasi] = useState<Aspirasi | null>(null);
  const [selectedWarga, setSelectedWarga] = useState<Warga | null>(null);
  const [selectedKandidatDetail, setSelectedKandidatDetail] = useState<Kandidat | null>(null);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const [chatRoomsList, setChatRoomsList] = useState<ChatRoom[]>(chatRooms);
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("Admin Azelina");
  const [profileEmail, setProfileEmail] = useState("admin@azelina.id");
  const [profilePhone, setProfilePhone] = useState("081234567890");
  const [profileAddress, setProfileAddress] = useState("Kantor Desa Batu Ampar");
  const [profileDesa, setProfileDesa] = useState("Desa Batu Ampar");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showSandiSuccess, setShowSandiSuccess] = useState(false);
  const [aspirasiFilter, setAspirasiFilter] = useState("Semua");
  const [wargaSearch, setWargaSearch] = useState("");
  const [wargaFilter, setWargaFilter] = useState("Semua");
  const [selectedPapanPublik, setSelectedPapanPublik] = useState<{ id: number; desa: string; judul: string; kategori: string; votes: number; status: string; waktu: string; deskripsi: string } | null>(null);
  const [statModal, setStatModal] = useState<"aspirasi-status" | "voting" | "aspirasi-terbaru" | "kandidat" | null>(null);
  const [statBubbleModal, setStatBubbleModal] = useState<"aspirasi" | "warga" | "suara" | "selesai" | null>(null);
  const [papanVotes, setPapanVotes] = useState<Record<number, number>>({
    1: 234, 2: 189, 3: 156, 4: 142, 5: 128, 6: 98,
  });

  const aspirasiDiproses = aspirasiList.filter((a) => a.status === "Diproses").length;
  const aspirasiSelesai = aspirasiList.filter((a) => a.status === "Selesai").length;
  const aspirasiDiterima = aspirasiList.filter((a) => a.status === "Diterima").length;
  const wargaAktif = wargaList.filter((w) => w.status === "Aktif").length;
  const totalSuara = kandidatList.reduce((sum, k) => sum + k.suara, 0);

  const filteredAspirasi = aspirasiFilter === "Semua"
    ? aspirasiList
    : aspirasiList.filter((a) => a.status === aspirasiFilter);

  const filteredWarga = wargaSearch
    ? wargaList.filter((w) => w.nama.toLowerCase().includes(wargaSearch.toLowerCase()) || w.desa.toLowerCase().includes(wargaSearch.toLowerCase()))
    : wargaList;

  const handleStatusChange = (aspirasiId: string, newStatus: string) => {
    setAspirasiList(aspirasiList.map((a) => a.id === aspirasiId ? { ...a, status: newStatus } : a));
    setNotifications([{
      id: Date.now(),
      type: "aspirasi",
      title: "Status Diperbarui",
      message: `Aspirasi ${aspirasiId} diubah ke "${newStatus}"`,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      read: false,
    }, ...notifications]);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 p-6 border-b border-border">
          <Image src="/logo-zibel.jpeg" alt="Azelina.id" width={40} height={40} className="w-10 h-10 rounded-xl object-cover border-[2.5px] border-amber-400" />
          <div>
            <h1 className="text-lg font-bold text-foreground">Azelina.id</h1>
            <p className="text-xs text-primary font-semibold">Dashboard Admin</p>
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
                <h2 className="text-lg font-bold text-foreground">Selamat Datang, Admin!</h2>
                <p className="text-sm text-muted">Kelola platform Azelina.id</p>
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
                              onClick={() => setNotifications(notifications.map((n) => n.id === item.id ? { ...n, read: true } : n))}
                              className={`p-4 hover:bg-accent-light/30 transition-colors cursor-pointer ${!item.read ? "bg-primary/5" : ""}`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${item.type === "aspirasi" ? "bg-primary/10" : "bg-success/10"}`}>
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
                                {!item.read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />}
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
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-foreground">{profileName}</p>
                  <p className="text-xs text-primary font-medium">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div onClick={() => setStatBubbleModal("aspirasi")} className="stat-card rounded-xl p-5 border-2 border-amber-300 hover:bg-accent-light hover:border-primary transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-accent-light group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{aspirasiList.length}</p>
                  <p className="text-xs text-muted group-hover:text-primary transition-colors">Total Aspirasi</p>
                </div>
              </div>
            </div>
            <div onClick={() => setStatBubbleModal("warga")} className="stat-card rounded-xl p-5 border-2 border-amber-300 hover:bg-accent-light hover:border-primary transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-accent-light group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <Users className="w-5 h-5 text-primary-light group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{wargaAktif}</p>
                  <p className="text-xs text-muted group-hover:text-primary transition-colors">Warga Aktif</p>
                </div>
              </div>
            </div>
            <div onClick={() => setStatBubbleModal("suara")} className="stat-card rounded-xl p-5 border-2 border-amber-300 hover:bg-accent-light hover:border-primary transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-accent-light group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <Vote className="w-5 h-5 text-success group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{totalSuara.toLocaleString("id-ID")}</p>
                  <p className="text-xs text-muted group-hover:text-primary transition-colors">Total Suara</p>
                </div>
              </div>
            </div>
            <div onClick={() => setStatBubbleModal("selesai")} className="stat-card rounded-xl p-5 border-2 border-amber-300 hover:bg-accent-light hover:border-primary transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-accent-light group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{aspirasiSelesai}</p>
                  <p className="text-xs text-muted group-hover:text-primary transition-colors">Aspirasi Selesai</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistik Section */}
          {activeSection === "statistik" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-foreground">Statistik Platform</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Aspirasi per Status */}
                <div className="bg-white rounded-xl border border-border p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <PieChart className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">Aspirasi per Status</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-primary/20" />
                        <span className="text-sm text-muted">Diterima</span>
                      </div>
                      <span className="text-sm font-bold text-foreground">{aspirasiDiterima}</span>
                    </div>
                    <div className="w-full bg-accent-light rounded-full h-2">
                      <div className="bg-primary/40 rounded-full h-2" style={{ width: `${(aspirasiDiterima / aspirasiList.length) * 100}%` }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-sm text-muted">Diproses</span>
                      </div>
                      <span className="text-sm font-bold text-foreground">{aspirasiDiproses}</span>
                    </div>
                    <div className="w-full bg-accent-light rounded-full h-2">
                      <div className="bg-primary rounded-full h-2" style={{ width: `${(aspirasiDiproses / aspirasiList.length) * 100}%` }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-success" />
                        <span className="text-sm text-muted">Selesai</span>
                      </div>
                      <span className="text-sm font-bold text-foreground">{aspirasiSelesai}</span>
                    </div>
                    <div className="w-full bg-accent-light rounded-full h-2">
                      <div className="bg-success rounded-full h-2" style={{ width: `${(aspirasiSelesai / aspirasiList.length) * 100}%` }} />
                    </div>
                  </div>
                </div>

                {/* Hasil Voting */}
                <div onClick={() => setStatModal("voting")} className="bg-white rounded-xl border border-border p-6 hover:shadow-lg hover:border-accent transition-all cursor-pointer">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">Hasil Voting Real-time</h4>
                    <Eye className="w-4 h-4 text-muted ml-auto" />
                  </div>
                  <div className="space-y-4">
                    {kandidatList.map((kandidat) => (
                      <div key={kandidat.id}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{kandidat.foto}</span>
                            <span className="text-sm font-medium text-foreground">{kandidat.nama}</span>
                          </div>
                          <span className="text-sm font-bold text-primary">{kandidat.suara.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="w-full bg-accent-light rounded-full h-3">
                          <div
                            className="bg-primary rounded-full h-3 transition-all"
                            style={{ width: `${(kandidat.suara / totalSuara) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted mt-1 text-right">{((kandidat.suara / totalSuara) * 100).toFixed(1)}%</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted">Total Suara Masuk</span>
                      <span className="text-lg font-bold text-foreground">{totalSuara.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                </div>

                {/* Aspirasi Terbaru */}
                <div onClick={() => setStatModal("aspirasi-terbaru")} className="bg-white rounded-xl border border-border p-6 hover:shadow-lg hover:border-accent transition-all cursor-pointer">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">Aspirasi Terbaru</h4>
                    <Eye className="w-4 h-4 text-muted ml-auto" />
                  </div>
                  <div className="space-y-3">
                    {aspirasiList.slice(0, 4).map((item) => {
                      const statusColor: Record<string, string> = {
                        Diproses: "bg-primary/10 text-primary",
                        Diterima: "bg-accent-light text-primary-dark",
                        Selesai: "bg-success/10 text-success",
                      };
                      return (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-accent-light/30">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.judul}</p>
                            <p className="text-xs text-muted">{item.desa} &bull; {item.tanggal}</p>
                          </div>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${statusColor[item.status] || ""}`}>{item.status}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Kandidat Terpopuler */}
                <div onClick={() => setStatModal("kandidat")} className="bg-white rounded-xl border border-border p-6 hover:shadow-lg hover:border-accent transition-all cursor-pointer">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">Kandidat Terpopuler</h4>
                    <Eye className="w-4 h-4 text-muted ml-auto" />
                  </div>
                  <div className="space-y-3">
                    {[...kandidatList].sort((a, b) => b.suara - a.suara).map((kandidat, index) => (
                      <div key={kandidat.id} className="flex items-center gap-3 p-3 rounded-xl bg-accent-light/30">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${index === 0 ? "bg-primary text-white" : "bg-accent-light text-primary"}`}>
                          {index + 1}
                        </div>
                        <span className="text-lg">{kandidat.foto}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{kandidat.nama}</p>
                          <p className="text-xs text-muted">{kandidat.suara.toLocaleString("id-ID")} suara</p>
                        </div>
                        <span className="text-sm font-bold text-primary">{((kandidat.suara / totalSuara) * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Kelola Aspirasi Section */}
          {activeSection === "aspirasi" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">Kelola Aspirasi</h3>
                <div className="flex items-center gap-2">
                  {["Semua", "Diterima", "Diproses", "Selesai"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setAspirasiFilter(filter)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        aspirasiFilter === filter
                          ? "bg-primary text-white shadow-sm"
                          : "bg-white text-muted border border-border hover:border-accent"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">ID</th>
                        <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Judul</th>
                        <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Kategori</th>
                        <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Desa</th>
                        <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Tanggal</th>
                        <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Status</th>
                        <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredAspirasi.map((item) => {
                        const statusColor: Record<string, string> = {
                          Diproses: "bg-primary/10 text-primary",
                          Diterima: "bg-accent-light text-primary-dark",
                          Selesai: "bg-success/10 text-success",
                        };
                        return (
                          <tr key={item.id} onClick={() => setSelectedAspirasi(item)} className="hover:bg-accent-light/20 transition-colors cursor-pointer">
                            <td className="px-6 py-4 text-sm font-mono text-muted">{item.id}</td>
                            <td className="px-6 py-4 text-sm font-medium text-foreground">{item.judul}</td>
                            <td className="px-6 py-4"><span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">{item.kategori}</span></td>
                            <td className="px-6 py-4 text-sm text-muted">{item.desa}</td>
                            <td className="px-6 py-4 text-sm text-muted">{item.tanggal}</td>
                            <td className="px-6 py-4">
                              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[item.status] || ""}`}>{item.status}</span>
                            </td>
                            <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={item.status}
                                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                className="text-xs px-2 py-1 rounded-lg border border-border text-foreground focus:outline-none input-focus"
                              >
                                <option value="Diterima">Diterima</option>
                                <option value="Diproses">Diproses</option>
                                <option value="Selesai">Selesai</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {filteredAspirasi.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-muted/30 mx-auto mb-3" />
                    <p className="text-muted">Tidak ada aspirasi dengan status &quot;{aspirasiFilter}&quot;</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Kelola Voting Section */}
          {activeSection === "voting" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">Kelola Voting</h3>
                <button
                  onClick={() => setShowFormKandidat(true)}
                  className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                >
                  <User className="w-4 h-4" />
                  Tambah Kandidat
                </button>
              </div>
              <div className="bg-white rounded-xl border border-border p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Vote className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-foreground">Pemilihan Kepala Desa 2026</h4>
                  <span className="text-xs px-2.5 py-1 bg-success/10 text-success rounded-full font-medium ml-auto">Aktif</span>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {kandidatList.map((kandidat) => (
                    <div
                      key={kandidat.id}
                      onClick={() => setSelectedKandidatDetail(kandidat)}
                      className="p-5 rounded-xl border-2 border-border hover:border-accent transition-all cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-xl bg-accent-light flex items-center justify-center mx-auto mb-3 text-3xl">
                        {kandidat.foto}
                      </div>
                      <h5 className="font-bold text-foreground text-center mb-1">{kandidat.nama}</h5>
                      <p className="text-xs text-muted text-center leading-relaxed mb-3">{kandidat.visi}</p>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-primary">{kandidat.suara.toLocaleString("id-ID")}</span>
                        <p className="text-xs text-muted">suara</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Kelola Warga Section */}
          {activeSection === "warga" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">Kelola Warga</h3>
                <div className="relative">
                  <input
                    type="text"
                    value={wargaSearch}
                    onChange={(e) => setWargaSearch(e.target.value)}
                    placeholder="Cari warga..."
                    className="w-64 px-4 py-2.5 rounded-xl border border-border text-sm text-foreground placeholder:text-muted/50 focus:outline-none input-focus"
                  />
                </div>
              </div>

              {/* Tab Filter */}
              <div className="flex bg-white rounded-xl p-1.5 shadow-sm border border-border">
                {["Semua", "Aktif", "Tidak Aktif"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setWargaFilter(tab)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                      wargaFilter === tab
                        ? "tab-active shadow-md"
                        : "text-muted hover:text-foreground hover:bg-accent-light/50"
                    }`}
                  >
                    {tab}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${wargaFilter === tab ? "bg-white/20" : "bg-accent-light"}`}>
                      {tab === "Semua" ? wargaList.length : wargaList.filter((w) => w.status === (tab === "Aktif" ? "Aktif" : "Tidak Aktif")).length}
                    </span>
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">ID</th>
                        <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Nama</th>
                        <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">NIK</th>
                        <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Desa</th>
                        <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Status</th>
                        <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredWarga.filter((w) => wargaFilter === "Semua" || w.status === wargaFilter).map((item) => (
                        <tr key={item.id} className="hover:bg-accent-light/20 transition-colors">
                          <td className="px-6 py-4 text-sm font-mono text-muted">{item.id}</td>
                          <td className="px-6 py-4 text-sm font-medium text-foreground">{item.nama}</td>
                          <td className="px-6 py-4 text-sm font-mono text-muted">{item.nik}</td>
                          <td className="px-6 py-4 text-sm text-muted">{item.desa}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${item.status === "Aktif" ? "bg-success/10 text-success" : "bg-muted/10 text-muted"}`}>{item.status}</span>
                          </td>
                          <td className="px-6 py-4">
                            <button onClick={() => setSelectedWarga(item)} className="p-1.5 rounded-lg hover:bg-accent-light text-muted hover:text-primary transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredWarga.filter((w) => wargaFilter === "Semua" || w.status === wargaFilter).length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted/30 mx-auto mb-3" />
                    <p className="text-muted">Tidak ada warga dengan status &quot;{wargaFilter}&quot;</p>
                  </div>
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
                  <p className="text-sm text-muted">Kelola aspirasi publik yang tampil untuk warga</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { id: 1, desa: "Desa Batu Ampar", judul: "Perbaikan Jalan Rusak di RT 05", kategori: "Infrastruktur", votes: 234, status: "Aktif", waktu: "2 jam lalu", deskripsi: "Jalan di RT 05 mengalami kerusakan parah akibat hujan deras." },
                  { id: 2, desa: "Desa Sempaja", judul: "Distribusi Air Bersih untuk Warga", kategori: "Pelayanan", votes: 189, status: "Aktif", waktu: "5 jam lalu", deskripsi: "Beberapa RT di Desa Sempaja masih mengalami kekurangan air bersih." },
                  { id: 3, desa: "Desa Prapatan", judul: "Penerangan Jalan Umum Mati", kategori: "Keamanan", votes: 156, status: "Aktif", waktu: "1 hari lalu", deskripsi: "Lampu penerangan jalan di Jl. Prapatan sudah mati selama 2 minggu." },
                  { id: 4, desa: "Desa Klandasan", judul: "Fasilitas Posyandu yang Layak", kategori: "Kesehatan", votes: 142, status: "Aktif", waktu: "1 hari lalu", deskripsi: "Posyandu di Desa Klandasan membutuhkan perbaikan fasilitas." },
                  { id: 5, desa: "Desa Damai", judul: "Pembangunan Trotoar Pejalan Kaki", kategori: "Infrastruktur", votes: 128, status: "Selesai", waktu: "2 hari lalu", deskripsi: "Warga mengusulkan pembangunan trotoar di Jl. Damai." },
                  { id: 6, desa: "Desa Manggar", judul: "Pengadaan Sampah Organik", kategori: "Lingkungan", votes: 98, status: "Aktif", waktu: "3 hari lalu", deskripsi: "Sampah organik di Desa Manggar belum ditangani dengan baik." },
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
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.status === "Aktif" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"}`}>{item.status}</span>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Warga Section */}
          {activeSection === "chat" && (
            <div className="flex gap-6 h-[calc(100vh-200px)]">
              <div className="w-80 flex-shrink-0 bg-white rounded-xl border border-border flex flex-col">
                <div className="p-4 border-b border-border">
                  <h3 className="text-lg font-bold text-foreground">Chat Warga</h3>
                  <p className="text-xs text-muted">Balas pesan dari warga</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {chatRoomsList.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedChatRoom(room)}
                      className={`p-4 border-b border-border cursor-pointer transition-colors ${
                        selectedChatRoom?.id === room.id ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-accent-light/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${room.status === "online" ? "bg-success" : "bg-muted/30"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-foreground text-sm">{room.wargaName}</h5>
                            <span className="text-xs text-muted">{room.lastTime || ""}</span>
                          </div>
                          <p className="text-xs text-muted">{room.role}</p>
                          <p className="text-xs text-muted truncate mt-0.5">{room.lastMessage || "Klik untuk membalas"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedChatRoom ? (
                <div className="flex-1 bg-white rounded-xl border border-border flex flex-col">
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${selectedChatRoom.status === "online" ? "bg-success" : "bg-muted/30"}`} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground">{selectedChatRoom.wargaName}</h5>
                      <p className="text-xs text-muted">{selectedChatRoom.status === "online" ? "Online" : "Offline"}</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedChatRoom.messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "petugas" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs lg:max-w-md ${
                          msg.sender === "petugas"
                            ? "bg-primary text-white rounded-2xl rounded-br-md"
                            : "bg-accent-light text-foreground rounded-2xl rounded-bl-md"
                        } px-4 py-3`}>
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.sender === "petugas" ? "text-white/70" : "text-muted"}`}>{msg.time}</p>
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
                          sender: "petugas",
                          name: profileName,
                          text: chatMessage,
                          time: userTime,
                        };

                        const currentRoom = selectedChatRoom;
                        const updatedRooms = chatRoomsList.map((room) => {
                          if (room.id === currentRoom.id) {
                            const updatedRoom = { ...room, messages: [...room.messages, newMsg], lastMessage: chatMessage, lastTime: "Sekarang" };
                            setSelectedChatRoom(updatedRoom);
                            return updatedRoom;
                          }
                          return room;
                        });
                        setChatRoomsList(updatedRooms);
                        setChatMessage("");

                        const replies = autoReplies[currentRoom.wargaName] || ["Terima kasih pesannya."];
                        const randomReply = replies[Math.floor(Math.random() * replies.length)];

                        setTimeout(() => {
                          const wargaTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
                          const replyMsg: ChatMessage = { id: Date.now() + 1, sender: "user", name: currentRoom.wargaName, text: randomReply, time: wargaTime };
                          setChatRoomsList((prev) => prev.map((room) => {
                            if (room.id === currentRoom.id) {
                              const updatedRoom = { ...room, messages: [...room.messages, replyMsg], lastMessage: randomReply, lastTime: "Sekarang" };
                              setSelectedChatRoom(updatedRoom);
                              return updatedRoom;
                            }
                            return room;
                          }));
                        }, 1500);
                      }}
                      className="flex items-center gap-3"
                    >
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Ketik balasan..."
                        className="flex-1 px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus"
                      />
                      <button type="submit" className="p-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors">
                        <Send className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="flex-1 bg-white rounded-xl border border-border flex items-center justify-center">
                  <div className="text-center">
                    <Headphones className="w-12 h-12 text-muted/30 mx-auto mb-3" />
                    <p className="text-muted">Pilih warga untuk membalas chat</p>
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
                  <button onClick={() => setIsEditingProfile(true)} className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm">
                    <User className="w-4 h-4" />
                    Edit Profil
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditingProfile(false)} className="inline-flex items-center gap-2 bg-accent-light text-primary px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent transition-colors">Batal</button>
                    <button onClick={() => setIsEditingProfile(false)} className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm">Simpan</button>
                  </div>
                )}
              </div>
              <div className="bg-white rounded-xl border border-border p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                  <div className="relative group">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Foto Profil" className="w-20 h-20 rounded-xl object-cover border-2 border-amber-400" />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center border-2 border-amber-400">
                        <Settings className="w-10 h-10 text-primary" />
                      </div>
                    )}
                    {isEditingProfile && (
                      <div className="absolute inset-0 rounded-xl flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute inset-0 bg-black/50 rounded-xl" />
                        <button onClick={() => setShowAvatarPicker(true)} className="relative z-10 p-1.5 bg-primary rounded-lg text-white hover:bg-primary-dark transition-colors" title="Pilih Avatar">
                          <User className="w-3.5 h-3.5" />
                        </button>
                        <label className="relative z-10 p-1.5 bg-primary rounded-lg text-white hover:bg-primary-dark transition-colors cursor-pointer" title="Upload Foto">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
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
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground">{profileName}</h4>
                    <p className="text-sm text-primary font-medium">Administrator &bull; {profileDesa}</p>
                    {isEditingProfile && (
                      <button onClick={() => setShowAvatarPicker(true)} className="text-xs text-primary hover:text-primary-dark font-medium mt-1">Ganti Avatar</button>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Nama Lengkap</label>
                    {isEditingProfile ? (
                      <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus" />
                    ) : (
                      <p className="text-foreground font-medium">{profileName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    {isEditingProfile ? (
                      <input type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus" />
                    ) : (
                      <p className="text-foreground font-medium">{profileEmail}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Telepon</label>
                    {isEditingProfile ? (
                      <input type="tel" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus" />
                    ) : (
                      <p className="text-foreground font-medium">{profilePhone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Alamat</label>
                    {isEditingProfile ? (
                      <input type="text" value={profileAddress} onChange={(e) => setProfileAddress(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus" />
                    ) : (
                      <p className="text-foreground font-medium">{profileAddress}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Desa</label>
                    {isEditingProfile ? (
                      <select value={profileDesa} onChange={(e) => setProfileDesa(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border text-foreground focus:outline-none input-focus">
                        <option value="Desa Batu Ampar">Desa Batu Ampar</option>
                        <option value="Desa Sempaja">Desa Sempaja</option>
                        <option value="Desa Prapatan">Desa Prapatan</option>
                      </select>
                    ) : (
                      <p className="text-foreground font-medium">{profileDesa}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Avatar Picker */}
          {showAvatarPicker && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAvatarPicker(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground">Pilih Avatar</h3>
                  <button onClick={() => setShowAvatarPicker(false)} className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {["👩", "👨", "👩‍💼", "👨‍💼", "👩‍🔧", "👨‍🔧", "👩‍🏫", "👨‍🏫", "👩‍⚕️", "👨‍⚕️", "👩‍🍳", "👨‍🍳", "🧑‍🎓", "🧑‍💻", "🧑‍🔬", "🧑‍🎨"].map((avatar) => (
                      <button
                        key={avatar}
                        onClick={() => { setProfilePhoto(avatar); setShowAvatarPicker(false); }}
                        className={`w-full aspect-square rounded-xl flex items-center justify-center text-3xl border-2 transition-all hover:scale-105 ${
                          profilePhoto === avatar ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-accent"
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-border pt-4">
                    <label className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-border hover:border-accent transition-colors cursor-pointer text-sm font-medium text-muted hover:text-foreground">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Upload dari File
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => { setProfilePhoto(reader.result as string); setShowAvatarPicker(false); };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <button
                      onClick={() => { setProfilePhoto(null); setShowAvatarPicker(false); }}
                      className="w-full mt-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-accent-light/50 transition-colors"
                    >
                      Hapus Foto (Gunakan Default)
                    </button>
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
                    <p className="text-sm text-muted mb-6">Kata sandi Anda telah berhasil diperbarui.</p>
                    <button onClick={() => setShowSandiSuccess(false)} className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-sm">Kembali</button>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setShowSandiSuccess(true); }} className="space-y-4">
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
                    <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-sm">Simpan Perubahan</button>
                  </form>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

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
                <label className="text-sm font-medium text-muted">Desa</label>
                <p className="text-foreground font-medium">{selectedAspirasi.desa}</p>
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

      {/* Modal Detail Warga */}
      {selectedWarga && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedWarga(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">Detail Warga</h3>
                <p className="text-sm text-muted">{selectedWarga.id}</p>
              </div>
              <button onClick={() => setSelectedWarga(null)} className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-accent-light flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground">{selectedWarga.nama}</h4>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${selectedWarga.status === "Aktif" ? "bg-success/10 text-success" : "bg-muted/10 text-muted"}`}>{selectedWarga.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted">NIK</label>
                  <p className="text-foreground font-mono">{selectedWarga.nik}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted">Desa</label>
                  <p className="text-foreground font-medium">{selectedWarga.desa}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted">Email</label>
                  <p className="text-foreground font-medium">{selectedWarga.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted">Telepon</label>
                  <p className="text-foreground font-medium">{selectedWarga.telepon}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted">Tanggal Daftar</label>
                <p className="text-foreground font-medium">{selectedWarga.tanggalDaftar}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form Tambah Kandidat */}
      {showFormKandidat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFormKandidat(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">Tambah Kandidat</h3>
              <button onClick={() => setShowFormKandidat(false)} className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!formKandidatNama || !formKandidatVisi) return;
                  const newKandidat: Kandidat = {
                    id: kandidatList.length + 1,
                    nama: formKandidatNama,
                    visi: formKandidatVisi,
                    foto: formKandidatFoto,
                    suara: 0,
                  };
                  setKandidatList([...kandidatList, newKandidat]);
                  setNotifications([{
                    id: Date.now(),
                    type: "aspirasi",
                    title: "Kandidat Ditambahkan",
                    message: `${formKandidatNama} berhasil ditambahkan sebagai kandidat`,
                    time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                    read: false,
                  }, ...notifications]);
                  setFormKandidatNama("");
                  setFormKandidatVisi("");
                  setFormKandidatFoto("👤");
                  setShowFormKandidat(false);
                }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Foto / Avatar</label>
                  <div className="flex flex-wrap gap-2">
                    {["👤", "👩", "👨", "👩‍💼", "👨‍💼", "👩‍🔧", "👨‍🔧", "👩‍🏫", "👨‍🏫"].map((avatar) => (
                      <button
                        key={avatar}
                        type="button"
                        onClick={() => setFormKandidatFoto(avatar)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2 transition-all ${
                          formKandidatFoto === avatar ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-accent"
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    value={formKandidatNama}
                    onChange={(e) => setFormKandidatNama(e.target.value)}
                    placeholder="Masukkan nama kandidat"
                    className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Visi & Misi</label>
                  <textarea
                    rows={3}
                    value={formKandidatVisi}
                    onChange={(e) => setFormKandidatVisi(e.target.value)}
                    placeholder="Tuliskan visi dan misi kandidat..."
                    className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus resize-none"
                    required
                  />
                </div>
                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-sm">
                  <User className="w-4 h-4" />
                  Tambah Kandidat
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Kandidat */}
      {selectedKandidatDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedKandidatDetail(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">Detail Kandidat</h3>
              <button onClick={() => setSelectedKandidatDetail(null)} className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 rounded-xl bg-accent-light flex items-center justify-center mx-auto mb-3 text-4xl">{selectedKandidatDetail.foto}</div>
                <h4 className="text-xl font-bold text-foreground">{selectedKandidatDetail.nama}</h4>
              </div>
              <div>
                <label className="text-sm font-medium text-muted">Visi & Misi</label>
                <p className="text-foreground leading-relaxed bg-accent-light/30 p-4 rounded-xl">{selectedKandidatDetail.visi}</p>
              </div>
              <div className="text-center pt-4 border-t border-border">
                <span className="text-3xl font-bold text-primary">{selectedKandidatDetail.suara.toLocaleString("id-ID")}</span>
                <p className="text-sm text-muted">suara diterima</p>
                <p className="text-lg font-bold text-foreground mt-1">{((selectedKandidatDetail.suara / totalSuara) * 100).toFixed(1)}%</p>
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
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${selectedPapanPublik.status === "Aktif" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"}`}>{selectedPapanPublik.status}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{selectedPapanPublik.desa}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{selectedPapanPublik.waktu}</span>
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Statistik: Aspirasi per Status */}
      {statModal === "aspirasi-status" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setStatModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Aspirasi per Status</h3>
                  <p className="text-sm text-muted">{aspirasiList.length} total aspirasi</p>
                </div>
              </div>
              <button onClick={() => setStatModal(null)} className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
              {["Diterima", "Diproses", "Selesai"].map((status) => {
                const filtered = aspirasiList.filter((a) => a.status === status);
                const statusColor: Record<string, string> = {
                  Diproses: "bg-primary/10 text-primary",
                  Diterima: "bg-accent-light text-primary-dark",
                  Selesai: "bg-success/10 text-success",
                };
                return (
                  <div key={status} className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${statusColor[status]}`}>{status}</span>
                      <span className="text-sm text-muted">({filtered.length} aspirasi)</span>
                    </div>
                    <div className="space-y-2">
                      {filtered.map((item) => (
                        <div key={item.id} onClick={() => { setStatModal(null); setSelectedAspirasi(item); }} className="flex items-center justify-between p-4 rounded-xl bg-accent-light/30 hover:bg-accent-light/50 transition-colors cursor-pointer">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">{item.judul}</p>
                            <p className="text-xs text-muted">{item.desa} &bull; {item.tanggal}</p>
                          </div>
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium flex-shrink-0 ml-2">{item.kategori}</span>
                        </div>
                      ))}
                      {filtered.length === 0 && <p className="text-sm text-muted text-center py-4">Tidak ada aspirasi</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal Statistik: Hasil Voting */}
      {statModal === "voting" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setStatModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Hasil Voting Real-time</h3>
                  <p className="text-sm text-muted">Total {totalSuara.toLocaleString("id-ID")} suara masuk</p>
                </div>
              </div>
              <button onClick={() => setStatModal(null)} className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
              {[...kandidatList].sort((a, b) => b.suara - a.suara).map((kandidat, index) => (
                <div key={kandidat.id} className="mb-6 last:mb-0">
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${index === 0 ? "bg-primary text-white" : "bg-accent-light text-primary"}`}>
                      {index + 1}
                    </div>
                    <span className="text-2xl">{kandidat.foto}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground">{kandidat.nama}</h4>
                      <p className="text-xs text-muted">{kandidat.visi}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{kandidat.suara.toLocaleString("id-ID")}</p>
                      <p className="text-sm font-bold text-foreground">{((kandidat.suara / totalSuara) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-accent-light rounded-full h-4">
                    <div className="bg-primary rounded-full h-4 transition-all" style={{ width: `${(kandidat.suara / totalSuara) * 100}%` }} />
                  </div>
                </div>
              ))}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-muted font-medium">Total Seluruh Suara</span>
                  <span className="text-2xl font-bold text-foreground">{totalSuara.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Statistik: Aspirasi Terbaru */}
      {statModal === "aspirasi-terbaru" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setStatModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Semua Aspirasi</h3>
                  <p className="text-sm text-muted">{aspirasiList.length} aspirasi dari warga</p>
                </div>
              </div>
              <button onClick={() => setStatModal(null)} className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
              <div className="space-y-3">
                {aspirasiList.map((item) => {
                  const statusColor: Record<string, string> = {
                    Diproses: "bg-primary/10 text-primary",
                    Diterima: "bg-accent-light text-primary-dark",
                    Selesai: "bg-success/10 text-success",
                  };
                  return (
                    <div key={item.id} onClick={() => { setStatModal(null); setSelectedAspirasi(item); }} className="p-4 rounded-xl bg-accent-light/30 hover:bg-accent-light/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted">{item.id}</span>
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">{item.kategori}</span>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[item.status] || ""}`}>{item.status}</span>
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">{item.judul}</h4>
                      <p className="text-sm text-muted mb-2 line-clamp-2">{item.deskripsi}</p>
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

      {/* Modal Statistik: Kandidat Terpopuler */}
      {statModal === "kandidat" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setStatModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Kandidat Terpopuler</h3>
                  <p className="text-sm text-muted">Peringkat berdasarkan jumlah suara</p>
                </div>
              </div>
              <button onClick={() => setStatModal(null)} className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
              <div className="space-y-4">
                {[...kandidatList].sort((a, b) => b.suara - a.suara).map((kandidat, index) => (
                  <div key={kandidat.id} className="p-5 rounded-xl bg-accent-light/30 hover:bg-accent-light/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${index === 0 ? "bg-primary text-white" : index === 1 ? "bg-primary/20 text-primary" : "bg-accent-light text-primary"}`}>
                        {index + 1}
                      </div>
                      <span className="text-3xl">{kandidat.foto}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground text-lg">{kandidat.nama}</h4>
                        <p className="text-sm text-muted">{kandidat.visi}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary">{kandidat.suara.toLocaleString("id-ID")}</p>
                        <p className="text-sm font-bold text-foreground">{((kandidat.suara / totalSuara) * 100).toFixed(1)}%</p>
                        <p className="text-xs text-muted">suara</p>
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-white rounded-full h-3">
                      <div className="bg-primary rounded-full h-3 transition-all" style={{ width: `${(kandidat.suara / totalSuara) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-border text-center">
                <span className="text-sm text-muted">Total Suara: </span>
                <span className="text-xl font-bold text-foreground">{totalSuara.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Stat Bubble: Total Aspirasi */}
      {statBubbleModal === "aspirasi" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setStatBubbleModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Total Aspirasi</h3>
                  <p className="text-sm text-muted">{aspirasiList.length} aspirasi dari warga</p>
                </div>
              </div>
              <button onClick={() => setStatBubbleModal(null)} className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
              <div className="space-y-3">
                {aspirasiList.map((item) => {
                  const statusColor: Record<string, string> = {
                    Diproses: "bg-primary/10 text-primary",
                    Diterima: "bg-accent-light text-primary-dark",
                    Selesai: "bg-success/10 text-success",
                  };
                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-accent-light/30">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{item.judul}</p>
                        <p className="text-xs text-muted">{item.desa} &bull; {item.tanggal}</p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ml-2 ${statusColor[item.status] || ""}`}>{item.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Stat Bubble: Warga Aktif */}
      {statBubbleModal === "warga" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setStatBubbleModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Warga Aktif</h3>
                  <p className="text-sm text-muted">{wargaAktif} dari {wargaList.length} warga terdaftar</p>
                </div>
              </div>
              <button onClick={() => setStatBubbleModal(null)} className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
              <div className="space-y-3">
                {wargaList.filter((w) => w.status === "Aktif").map((warga) => (
                  <div key={warga.id} className="flex items-center gap-3 p-4 rounded-xl bg-accent-light/30">
                    <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{warga.nama}</p>
                      <p className="text-xs text-muted">{warga.desa} &bull; {warga.email}</p>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-success/10 text-success">Aktif</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Stat Bubble: Total Suara */}
      {statBubbleModal === "suara" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setStatBubbleModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Vote className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Total Suara</h3>
                  <p className="text-sm text-muted">{totalSuara.toLocaleString("id-ID")} suara masuk</p>
                </div>
              </div>
              <button onClick={() => setStatBubbleModal(null)} className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
              <div className="space-y-4">
                {[...kandidatList].sort((a, b) => b.suara - a.suara).map((kandidat, index) => (
                  <div key={kandidat.id} className="p-4 rounded-xl bg-accent-light/30">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${index === 0 ? "bg-primary text-white" : "bg-accent-light text-primary"}`}>{index + 1}</div>
                      <span className="text-xl">{kandidat.foto}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{kandidat.nama}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{kandidat.suara.toLocaleString("id-ID")}</p>
                        <p className="text-xs text-muted">{((kandidat.suara / totalSuara) * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-white rounded-full h-2">
                      <div className="bg-primary rounded-full h-2" style={{ width: `${(kandidat.suara / totalSuara) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Stat Bubble: Aspirasi Selesai */}
      {statBubbleModal === "selesai" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setStatBubbleModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Aspirasi Selesai</h3>
                  <p className="text-sm text-muted">{aspirasiSelesai} aspirasi telah diselesaikan</p>
                </div>
              </div>
              <button onClick={() => setStatBubbleModal(null)} className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
              {aspirasiList.filter((a) => a.status === "Selesai").length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-muted/30 mx-auto mb-3" />
                  <p className="text-muted">Belum ada aspirasi yang selesai</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {aspirasiList.filter((a) => a.status === "Selesai").map((item) => (
                    <div key={item.id} className="p-4 rounded-xl bg-success/5 border border-success/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-muted">{item.id}</span>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-success/10 text-success">Selesai</span>
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">{item.judul}</h4>
                      <p className="text-sm text-muted mb-2">{item.deskripsi}</p>
                      <div className="flex items-center gap-3 text-xs text-muted">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.desa}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.tanggal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
