"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
  IconBell,
  IconHeadphones,
  IconMapPin,
  IconChartBar,
  IconUsers,
  IconSettings,
  IconFileText,
  IconEye,
  IconTrash,
  IconTrendingUp,
  IconChartPie,
  IconDownload,
  IconNews,
  IconPlus,
  IconEdit,
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// === Schema validasi Zod: form tambah/edit kandidat ===
const kandidatSchema = z.object({
  nama: z.string().min(2, "Nama harus minimal 2 karakter"),
  visi: z.string().min(10, "Visi harus minimal 10 karakter"),
});

// === Schema validasi Zod: form ganti kata sandi ===
const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Kata sandi lama harus diisi"),
    newPassword: z.string().min(6, "Kata sandi baru minimal 6 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi harus diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

// === Warna badge status ===
const STATUS_COLORS: Record<string, string> = {
  Diproses: "bg-primary/10 text-primary",
  Diterima: "bg-accent-light text-primary-dark",
  Selesai: "bg-success/10 text-success",
};

// === Data desa untuk filter ===
const daftarDesa = [
  "Desa Batu Ampar", "Desa Sempaja", "Desa Prapatan", "Desa Klandasan",
  "Desa Damai", "Desa Manggar",
];

// === Tipe data ===
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

interface Kandidat {
  id: number;
  nama: string;
  visi: string;
  foto: string;
  suara: number;
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

interface NotifItem {
  id: number;
  type: "aspirasi" | "chat";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// === Data awal aspirasi ===
const initialAspirasiList: Aspirasi[] = [
  { id: "ASP-001", judul: "Jalan Rusak di RT 05", kategori: "Infrastruktur", deskripsi: "Jalan di RT 05 mengalami kerusakan parah akibat hujan deras. Lubang-lubang besar membahayakan pengendara dan pejalan kaki.", status: "Diproses", tanggal: "27 Jun 2026", desa: "Desa Batu Ampar" },
  { id: "ASP-002", judul: "Pencemaran Sungai", kategori: "Lingkungan", deskripsi: "Sungai di sekitar Desa Sempaja tercemar limbah domestik. Warga meminta penanganan segera.", status: "Diterima", tanggal: "26 Jun 2026", desa: "Desa Sempaja" },
  { id: "ASP-003", judul: "Lambatnya Pengurusan Dokumen", kategori: "Pelayanan", deskripsi: "Pengurusan dokumen kependudukan di kantor desa memakan waktu terlalu lama.", status: "Selesai", tanggal: "25 Jun 2026", desa: "Desa Prapatan" },
  { id: "ASP-004", judul: "Penerangan Jalan Mati", kategori: "Keamanan", deskripsi: "Lampu penerangan jalan di beberapa titik sudah mati selama 2 minggu.", status: "Diproses", tanggal: "24 Jun 2026", desa: "Desa Klandasan" },
  { id: "ASP-005", judul: "Kurangnya Fasilitas Puskesmas", kategori: "Kesehatan", deskripsi: "Puskesmas desa kekurangan alat kesehatan dan tenaga medis.", status: "Diterima", tanggal: "23 Jun 2026", desa: "Desa Damai" },
  { id: "ASP-006", judul: "Kekurangan Guru", kategori: "Pendidikan", deskripsi: "Sekolah desa kekurangan guru tetap, terutama mata pelajaran IPA dan Matematika.", status: "Diproses", tanggal: "22 Jun 2026", desa: "Desa Manggar" },
];

// === Data awal warga ===
const initialWargaList: Warga[] = [
  { id: "W-001", nama: "Abel Zihan", nik: "6472012345678901", desa: "Desa Batu Ampar", email: "abelzihan@gmail.com", telepon: "089608574922", status: "Aktif", tanggalDaftar: "10 Jun 2026" },
  { id: "W-002", nama: "Rina Wati", nik: "6472012345678902", desa: "Desa Sempaja", email: "rinawati@gmail.com", telepon: "081234567890", status: "Aktif", tanggalDaftar: "12 Jun 2026" },
  { id: "W-003", nama: "Supriadi", nik: "6472012345678903", desa: "Desa Prapatan", email: "supriadi@gmail.com", telepon: "085678901234", status: "Aktif", tanggalDaftar: "15 Jun 2026" },
  { id: "W-004", nama: "Maya Putri", nik: "6472012345678904", desa: "Desa Klandasan", email: "mayaputri@gmail.com", telepon: "087890123456", status: "Aktif", tanggalDaftar: "18 Jun 2026" },
  { id: "W-005", nama: "Joko Susilo", nik: "6472012345678905", desa: "Desa Damai", email: "jokosusilo@gmail.com", telepon: "089012345678", status: "Tidak Aktif", tanggalDaftar: "20 Jun 2026" },
  { id: "W-006", nama: "Sari Dewi", nik: "6472012345678906", desa: "Desa Manggar", email: "saridewi@gmail.com", telepon: "083456789012", status: "Aktif", tanggalDaftar: "22 Jun 2026" },
];

// === Data awal kandidat ===
const initialKandidatList: Kandidat[] = [
  { id: 1, nama: "Siti Aminah", visi: "Desa yang maju, sejahtera, dan berdaya saing tinggi melalui inovasi teknologi dan pemberdayaan UMKM.", foto: "👩", suara: 1842 },
  { id: 2, nama: "Budi Santoso", visi: "Transparansi anggaran, partisipasi warga aktif, dan pembangunan infrastruktur merata di semua dusun.", foto: "👨", suara: 1654 },
  { id: 3, nama: "Rahmawati", visi: "Lingkungan hijau, clean energy, dan kesehatan masyarakat yang prima untuk generasi masa depan.", foto: "👩", suara: 1520 },
];

// === Data chat rooms admin ===
const chatRooms: ChatRoom[] = [
  { id: 1, wargaName: "Rina Wati", role: "Warga Desa Sempaja", status: "online", lastMessage: "", lastTime: "", messages: [] },
  { id: 2, wargaName: "Supriadi", role: "Warga Desa Prapatan", status: "online", lastMessage: "", lastTime: "", messages: [] },
  { id: 3, wargaName: "Maya Putri", role: "Warga Desa Klandasan", status: "offline", lastMessage: "", lastTime: "", messages: [] },
];

// === Balasan otomatis admin ===
const autoReplies: Record<string, string[]> = {
  "Rina Wati": ["Terima kasih atas aspirasinya. Kami akan segera menindaklanjuti.", "Laporan Anda sudah kami terima dan akan diproses."],
  "Supriadi": ["Halo! Ada yang bisa kami bantu?", "Kami akan koordinasi dengan tim terkait."],
  "Maya Putri": ["Terima kasih pesannya. Akan segera kami tindaklanjuti.", "Kami catat laporan Anda. Terima kasih."],
};

// === Papan publik data ===
const papanPublikData = [
  { id: 1, desa: "Desa Batu Ampar", judul: "Perbaikan Jalan Rusak di RT 05", kategori: "Infrastruktur", votes: 234, status: "Aktif", waktu: "2 jam lalu", deskripsi: "Jalan di RT 05 mengalami kerusakan parah." },
  { id: 2, desa: "Desa Sempaja", judul: "Distribusi Air Bersih untuk Warga", kategori: "Pelayanan", votes: 189, status: "Aktif", waktu: "5 jam lalu", deskripsi: "Beberapa RT masih mengalami kekurangan air bersih." },
  { id: 3, desa: "Desa Prapatan", judul: "Penerangan Jalan Umum Mati", kategori: "Keamanan", votes: 156, status: "Aktif", waktu: "1 hari lalu", deskripsi: "Lampu penerangan jalan sudah mati selama 2 minggu." },
  { id: 4, desa: "Desa Klandasan", judul: "Fasilitas Posyandu yang Layak", kategori: "Kesehatan", votes: 142, status: "Aktif", waktu: "1 hari lalu", deskripsi: "Posyandu membutuhkan perbaikan fasilitas." },
  { id: 5, desa: "Desa Damai", judul: "Pembangunan Trotoar Pejalan Kaki", kategori: "Infrastruktur", votes: 128, status: "Selesai", waktu: "2 hari lalu", deskripsi: "Warga mengusulkan pembangunan trotoar." },
  { id: 6, desa: "Desa Manggar", judul: "Pengadaan Sampah Organik", kategori: "Lingkungan", votes: 98, status: "Aktif", waktu: "3 hari lalu", deskripsi: "Sampah organik belum ditangani dengan baik." },
];

// === Helper: parse tanggal Indonesia ===
function parseTanggalIndo(tgl: string): string {
  const months: Record<string, string> = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", Mei: "05", Jun: "06", Jul: "07", Agu: "08", Sep: "09", Okt: "10", Nov: "11", Des: "12" };
  const parts = tgl.split(" ");
  if (parts.length < 3) return tgl;
  return `${parts[2]}-${months[parts[1]] || "01"}-${parts[0].padStart(2, "0")}`;
}

// ============================================================
// KOMPONEN HALAMAN DASHBOARD ADMIN
// ============================================================
export default function AdminDashboardPage() {
  // === State UI ===
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("statistik");
  const [showNotif, setShowNotif] = useState(false);

  // === State data ===
  const [aspirasiList, setAspirasiList] = useState<Aspirasi[]>(initialAspirasiList);
  const [wargaList] = useState<Warga[]>(initialWargaList);
  const [kandidatList, setKandidatList] = useState<Kandidat[]>(initialKandidatList);
  const [chatRoomsList, setChatRoomsList] = useState<ChatRoom[]>(chatRooms);
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const [papanVotes] = useState<Record<number, number>>({ 1: 234, 2: 189, 3: 156, 4: 142, 5: 128, 6: 98 });

  // === State berita ===
  const [beritaList, setBeritaList] = useState<Array<{
    id: number; judul: string; kategori: string; deskripsi: string;
    tanggal: string; penulis: string; gambar: string; konten: string;
  }>>([]);
  const [showFormBerita, setShowFormBerita] = useState(false);
  const [editBeritaId, setEditBeritaId] = useState<number | null>(null);
  const [formBeritaJudul, setFormBeritaJudul] = useState("");
  const [formBeritaKategori, setFormBeritaKategori] = useState("Pemilihan");
  const [formBeritaDeskripsi, setFormBeritaDeskripsi] = useState("");
  const [formBeritaKonten, setFormBeritaKonten] = useState("");
  const [formBeritaGambar, setFormBeritaGambar] = useState("https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&h=400&fit=crop");
  const [selectedBeritaDetail, setSelectedBeritaDetail] = useState<(typeof beritaList)[0] | null>(null);

  // === State form kandidat ===
  const [showFormKandidat, setShowFormKandidat] = useState(false);
  const [showEditKandidat, setShowEditKandidat] = useState(false);
  const [editKandidatId, setEditKandidatId] = useState<number | null>(null);
  const [formKandidatNama, setFormKandidatNama] = useState("");
  const [formKandidatVisi, setFormKandidatVisi] = useState("");
  const [formKandidatFoto, setFormKandidatFoto] = useState("👤");

  // === State filter ===
  const [aspirasiFilter, setAspirasiFilter] = useState("Semua");
  const [aspirasiDateStart, setAspirasiDateStart] = useState("");
  const [aspirasiDateEnd, setAspirasiDateEnd] = useState("");
  const [wargaSearch, setWargaSearch] = useState("");
  const [wargaFilter, setWargaFilter] = useState("Semua");
  const [globalFilter, setGlobalFilter] = useState("");

  // === State modals ===
  const [selectedAspirasi, setSelectedAspirasi] = useState<Aspirasi | null>(null);
  const [selectedWarga, setSelectedWarga] = useState<Warga | null>(null);
  const [selectedKandidatDetail, setSelectedKandidatDetail] = useState<Kandidat | null>(null);
  const [selectedPapanPublik, setSelectedPapanPublik] = useState<(typeof papanPublikData)[0] | null>(null);
  const [statModal, setStatModal] = useState<"voting" | "aspirasi-terbaru" | "kandidat" | null>(null);
  const [statBubbleModal, setStatBubbleModal] = useState<"aspirasi" | "warga" | "suara" | "selesai" | null>(null);

  // === State profil ===
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("Admin Azelina");
  const [profileEmail, setProfileEmail] = useState("admin@azelina.id");
  const [profilePhone, setProfilePhone] = useState("081234567890");
  const [profileAddress, setProfileAddress] = useState("Kantor Desa Batu Ampar");
  const [profileDesa, setProfileDesa] = useState("Desa Batu Ampar");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showSandiSuccess, setShowSandiSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // === Load aspirasi dari warga via localStorage (client-side only) ===
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("aspirasi_warga") || "[]");
      if (stored.length > 0) {
        const wargaAspirasi = stored.map((a: Aspirasi & { desa?: string }) => ({
          id: a.id,
          judul: a.judul,
          kategori: a.kategori,
          deskripsi: a.deskripsi,
          status: a.status,
          tanggal: a.tanggal,
          desa: a.desa || "Desa Batu Ampar",
        }));
        setAspirasiList([...wargaAspirasi, ...initialAspirasiList]);
      }
    } catch {}
    // Load chat dari localStorage
    try {
      const stored = JSON.parse(localStorage.getItem("chat_messages") || "[]");
      if (stored.length > 0) {
        setChatRoomsList((prev) => prev.map((room) => {
          const roomMessages = stored.filter((m: ChatMessage & { roomId: number }) => m.roomId === room.id);
          if (roomMessages.length > 0) {
            const lastMsg = roomMessages[roomMessages.length - 1];
            return { ...room, messages: roomMessages, lastMessage: lastMsg.text, lastTime: lastMsg.time };
          }
          return room;
        }));
      }
    } catch {}
    // Load data voting dari warga via localStorage
    try {
      const voteData = JSON.parse(localStorage.getItem("voting_data") || "{}");
      if (voteData.voted && voteData.candidateId) {
        setKandidatList((prev) => prev.map((k) =>
          k.id === voteData.candidateId ? { ...k, suara: k.suara + 1 } : k
        ));
      }
    } catch {}
    // Load berita dari localStorage
    try {
      const stored = JSON.parse(localStorage.getItem("berita_list") || "[]");
      if (stored.length > 0) {
        setBeritaList(stored);
      }
    } catch {}
  }, []);

  // === Derived data ===
  const aspirasiDiproses = useMemo(() => aspirasiList.filter((a) => a.status === "Diproses").length, [aspirasiList]);
  const aspirasiSelesai = useMemo(() => aspirasiList.filter((a) => a.status === "Selesai").length, [aspirasiList]);
  const aspirasiDiterima = useMemo(() => aspirasiList.filter((a) => a.status === "Diterima").length, [aspirasiList]);
  const wargaAktif = useMemo(() => wargaList.filter((w) => w.status === "Aktif").length, [wargaList]);
  const totalSuara = useMemo(() => kandidatList.reduce((sum, k) => sum + k.suara, 0), [kandidatList]);

  // === Filter aspirasi ===
  const filteredAspirasi = useMemo(() => aspirasiList
    .filter((a) => aspirasiFilter === "Semua" || a.status === aspirasiFilter)
    .filter((a) => {
      if (!aspirasiDateStart && !aspirasiDateEnd) return true;
      const tgl = parseTanggalIndo(a.tanggal);
      if (aspirasiDateStart && tgl < aspirasiDateStart) return false;
      if (aspirasiDateEnd && tgl > aspirasiDateEnd) return false;
      return true;
    }), [aspirasiList, aspirasiFilter, aspirasiDateStart, aspirasiDateEnd]);

  // === Filter warga ===
  const filteredWarga = useMemo(() => wargaSearch
    ? wargaList.filter((w) => w.nama.toLowerCase().includes(wargaSearch.toLowerCase()) || w.desa.toLowerCase().includes(wargaSearch.toLowerCase()))
    : wargaList, [wargaList, wargaSearch]);

  const wargaTableData = useMemo(() => filteredWarga.filter((w) => wargaFilter === "Semua" || w.status === wargaFilter), [filteredWarga, wargaFilter]);

  // === Kolom tabel aspirasi (TanStack Table) ===
  const aspirasiColumns: ColumnDef<Aspirasi>[] = useMemo(() => [
    { accessorKey: "id", header: "ID", cell: ({ row }) => <span className="font-mono text-muted-foreground text-sm">{row.original.id}</span> },
    { accessorKey: "judul", header: "Judul", cell: ({ row }) => <span className="font-medium text-foreground">{row.original.judul}</span> },
    { accessorKey: "kategori", header: "Kategori", cell: ({ row }) => <Badge className="bg-primary/10 text-primary border-0 hover:bg-primary/10">{row.original.kategori}</Badge> },
    { accessorKey: "desa", header: "Desa" },
    { accessorKey: "tanggal", header: "Tanggal" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge className={`border-0 hover:bg-transparent ${STATUS_COLORS[row.original.status] || ""}`}>{row.original.status}</Badge> },
    { id: "aksi", header: "Aksi", cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedAspirasi(row.original); }} className="hover:text-primary">
          <IconEye className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={(e) => {
          e.stopPropagation();
          if (!confirm(`Hapus aspirasi "${row.original.judul}"?`)) return;
          setAspirasiList(aspirasiList.filter((a) => a.id !== row.original.id));
          try {
            const stored = JSON.parse(localStorage.getItem("aspirasi_warga") || "[]");
            localStorage.setItem("aspirasi_warga", JSON.stringify(stored.filter((a: Aspirasi) => a.id !== row.original.id)));
          } catch {}
          setNotifications([{ id: Date.now(), type: "aspirasi" as const, title: "Aspirasi Dihapus", message: `"${row.original.judul}" telah dihapus`, time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }), read: false }, ...notifications]);
          toast.success("Aspirasi Dihapus!", {
            description: `"${row.original.judul}" telah berhasil dihapus.`,
          });
        }} className="hover:text-red-500">
          <IconTrash className="w-4 h-4" />
        </Button>
      </div>
    ) },
  ], []);

  // === Kolom tabel warga (TanStack Table) ===
  const wargaColumns: ColumnDef<Warga>[] = useMemo(() => [
    { accessorKey: "id", header: "ID", cell: ({ row }) => <span className="font-mono text-muted-foreground text-sm">{row.original.id}</span> },
    { accessorKey: "nama", header: "Nama", cell: ({ row }) => <span className="font-medium text-foreground">{row.original.nama}</span> },
    { accessorKey: "nik", header: "NIK", cell: ({ row }) => <span className="font-mono text-muted-foreground text-sm">{row.original.nik}</span> },
    { accessorKey: "desa", header: "Desa" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge className={`border-0 hover:bg-transparent ${row.original.status === "Aktif" ? "bg-success/10 text-success" : "bg-muted/10 text-muted-foreground"}`}>{row.original.status}</Badge> },
    { id: "aksi", header: "Aksi", cell: ({ row }) => (
      <Button variant="ghost" size="sm" onClick={() => setSelectedWarga(row.original)} className="hover:text-primary">
        <IconEye className="w-4 h-4" />
      </Button>
    ) },
  ], []);

  // === Inisialisasi TanStack Table: Aspirasi ===
  const aspirasiTable = useReactTable({
    data: filteredAspirasi,
    columns: aspirasiColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  // === Inisialisasi TanStack Table: Warga ===
  const wargaTable = useReactTable({
    data: wargaTableData,
    columns: wargaColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // === Handler: download laporan PDF ===
  const handleDownloadLaporan = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header gradient pink
    doc.setFillColor(201, 61, 114);
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setFillColor(224, 114, 154);
    doc.rect(0, 35, pageWidth, 8, "F");

    // Judul
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20); doc.setFont("helvetica", "bold");
    doc.text("LAPORAN AZELINA.ID", pageWidth / 2, 18, { align: "center" });
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.text("Platform E-Voting & Aspirasi Anonim", pageWidth / 2, 26, { align: "center" });
    doc.text(`Dicetak: ${new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}`, pageWidth / 2, 33, { align: "center" });

    let y = 52;
    doc.setTextColor(0, 0, 0);

    // Ringkasan statistik
    doc.setFillColor(252, 228, 239);
    doc.roundedRect(14, y, pageWidth - 28, 36, 3, 3, "F");
    doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(201, 61, 114);
    doc.text("Ringkasan Statistik", 20, y + 8);
    doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(60, 60, 60);
    doc.text(`Total Aspirasi: ${aspirasiList.length}`, 20, y + 16);
    doc.text(`Diterima: ${aspirasiDiterima}  |  Diproses: ${aspirasiDiproses}  |  Selesai: ${aspirasiSelesai}`, 20, y + 22);
    doc.text(`Warga Aktif: ${wargaAktif} dari ${wargaList.length}`, 20, y + 28);
    doc.text(`Total Suara Voting: ${totalSuara.toLocaleString("id-ID")}`, 20, y + 34);
    y += 44;

    // Garis pemisah
    doc.setDrawColor(201, 61, 114); doc.setLineWidth(0.5);
    doc.line(14, y, pageWidth - 14, y); y += 8;

    // Tabel Aspirasi
    doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(201, 61, 114);
    doc.text("Data Aspirasi", 14, y); y += 4;
    autoTable(doc, { startY: y, head: [["ID", "Judul", "Kategori", "Desa", "Tanggal", "Status"]], body: aspirasiList.map((a) => [a.id, a.judul, a.kategori, a.desa, a.tanggal, a.status]), styles: { fontSize: 8, cellPadding: 3 }, headStyles: { fillColor: [201, 61, 114], textColor: 255, fontStyle: "bold" }, alternateRowStyles: { fillColor: [252, 228, 239] }, margin: { left: 14, right: 14 } });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;

    // Garis pemisah
    doc.setDrawColor(201, 61, 114); doc.setLineWidth(0.5);
    doc.line(14, y, pageWidth - 14, y); y += 8;

    // Tabel Voting
    doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(201, 61, 114);
    doc.text("Hasil Voting", 14, y); y += 4;
    autoTable(doc, { startY: y, head: [["No", "Kandidat", "Visi", "Suara", "Persentase"]], body: [...kandidatList].sort((a, b) => b.suara - a.suara).map((k, i) => [String(i + 1), k.nama, k.visi.length > 50 ? k.visi.substring(0, 50) + "..." : k.visi, k.suara.toLocaleString("id-ID"), `${((k.suara / totalSuara) * 100).toFixed(1)}%`]), styles: { fontSize: 8, cellPadding: 3 }, headStyles: { fillColor: [201, 61, 114], textColor: 255, fontStyle: "bold" }, alternateRowStyles: { fillColor: [252, 228, 239] }, margin: { left: 14, right: 14 } });

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFillColor(201, 61, 114);
      doc.rect(0, doc.internal.pageSize.getHeight() - 12, pageWidth, 12, "F");
      doc.setFontSize(8); doc.setFont("helvetica", "normal");
      doc.setTextColor(255, 255, 255);
      doc.text("Azelina.id - E-Voting & Aspirasi Anonim", pageWidth / 2, doc.internal.pageSize.getHeight() - 5, { align: "center" });
    }

    doc.save("laporan-azelina.pdf");
  };

  // === Handler: download aspirasi PDF ===
  const handleDownloadAspirasiPdf = (aspirasi: Aspirasi) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header pink
    doc.setFillColor(201, 61, 114);
    doc.rect(0, 0, pageWidth, 35, "F");
    doc.setFillColor(224, 114, 154);
    doc.rect(0, 30, pageWidth, 8, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16); doc.setFont("helvetica", "bold");
    doc.text("LAPORAN ASPIRASI", pageWidth / 2, 14, { align: "center" });
    doc.setFontSize(9); doc.setFont("helvetica", "normal");
    doc.text(`Azelina.id - ${new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}`, pageWidth / 2, 22, { align: "center" });

    let y = 48;
    doc.setTextColor(0, 0, 0);

    // Info box
    doc.setFillColor(252, 228, 239);
    doc.roundedRect(14, y, pageWidth - 28, 48, 3, 3, "F");

    const fields = [
      { label: "ID Aspirasi", value: aspirasi.id }, { label: "Judul", value: aspirasi.judul },
      { label: "Kategori", value: aspirasi.kategori }, { label: "Status", value: aspirasi.status },
      { label: "Desa", value: aspirasi.desa }, { label: "Tanggal", value: aspirasi.tanggal },
    ];
    let fy = y + 8;
    fields.forEach((f) => {
      doc.setFont("helvetica", "bold"); doc.setTextColor(201, 61, 114); doc.text(f.label + ":", 20, fy);
      doc.setFont("helvetica", "normal"); doc.setTextColor(60, 60, 60); doc.text(f.value, 55, fy);
      fy += 6;
    });
    y += 56;

    // Garis
    doc.setDrawColor(201, 61, 114); doc.setLineWidth(0.5);
    doc.line(14, y, pageWidth - 14, y); y += 8;

    // Deskripsi
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(201, 61, 114);
    doc.text("Deskripsi", 14, y); y += 6;
    doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(aspirasi.deskripsi, pageWidth - 28);
    doc.text(lines, 14, y);

    // Footer
    doc.setFillColor(201, 61, 114);
    doc.rect(0, doc.internal.pageSize.getHeight() - 12, pageWidth, 12, "F");
    doc.setFontSize(8); doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 255, 255);
    doc.text("Azelina.id - E-Voting & Aspirasi Anonim", pageWidth / 2, doc.internal.pageSize.getHeight() - 5, { align: "center" });

    doc.save(`aspirasi-${aspirasi.id}.pdf`);
  };

  // === Handler: kirim chat ===
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedChatRoom) return;
    const userTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const newMsg: ChatMessage = { id: Date.now(), sender: "petugas", name: profileName, text: chatMessage, time: userTime };

    // Simpan ke localStorage
    try {
      const stored = JSON.parse(localStorage.getItem("chat_messages") || "[]");
      localStorage.setItem("chat_messages", JSON.stringify([...stored, { ...newMsg, roomId: selectedChatRoom.id }]));
    } catch {}

    const currentRoom = selectedChatRoom;
    const updatedRooms = chatRoomsList.map((room) => {
      if (room.id === currentRoom.id) { const u = { ...room, messages: [...room.messages, newMsg], lastMessage: chatMessage, lastTime: "Sekarang" }; setSelectedChatRoom(u); return u; } return room;
    });
    setChatRoomsList(updatedRooms); setChatMessage("");
  };

  // === Menu sidebar ===
  const sidebarMenu = [
    { label: "Manajemen", items: [
      { icon: IconChartBar, label: "Statistik", href: "#statistik" },
      { icon: IconMessage, label: "Kelola Aspirasi", href: "#aspirasi" },
      { icon: IconClipboardList, label: "Kelola Voting", href: "#voting" },
      { icon: IconUsers, label: "Kelola Warga", href: "#warga" },
      { icon: IconNews, label: "Kelola Berita", href: "#berita" },
      { icon: IconWorld, label: "Papan Publik", href: "#papan" },
    ]},
    { label: "Komunikasi", items: [{ icon: IconHeadphones, label: "Chat Warga", href: "#chat" }] },
    { label: "Pengaturan", items: [
      { icon: IconUser, label: "Profil Saya", href: "#profil" },
      { icon: IconLock, label: "Ganti Kata Sandi", href: "#sandi" },
      { icon: IconLogout, label: "Keluar", href: "/login" },
    ]},
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* === Sidebar admin === */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 px-5 h-16 border-b border-border flex-shrink-0">
          <Image src="/logo-zibel.jpeg" alt="Azelina.id" width={40} height={40} className="w-10 h-10 rounded-xl object-cover border-[2.5px] border-amber-400" />
          <div><h1 className="text-lg font-bold text-foreground">Azelina.id</h1><p className="text-xs text-primary font-semibold">Dashboard Admin</p></div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-muted-foreground hover:text-foreground"><IconX className="w-5 h-5" /></button>
        </div>
        <nav className="p-4 space-y-6">
          {sidebarMenu.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <a key={item.label} href={item.href} onClick={(e) => { if (item.href.startsWith("#")) { e.preventDefault(); setActiveSection(item.href.replace("#", "")); setSidebarOpen(false); } if (item.label === "Keluar") window.location.href = item.href; }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeSection === item.href.replace("#", "") ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-accent-light/50"}`}>
                    <item.icon className="w-5 h-5" />{item.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* === Konten utama === */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 z-30 bg-white border-b border-border h-16 flex items-center">
          <div className="flex items-center justify-between w-full px-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground"><IconMenu className="w-6 h-6" /></button>
              <div><h2 className="text-lg font-bold text-foreground">Selamat Datang, {profileName}!</h2><p className="text-sm text-muted-foreground">Kelola platform Azelina.id</p></div>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifikasi */}
              <div className="relative">
                <button onClick={() => setShowNotif(!showNotif)} className="relative p-2 rounded-xl hover:bg-accent-light/50 transition-colors">
                  <IconBell className="w-5 h-5 text-muted-foreground" />
                  {notifications.filter((n) => !n.read).length > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">{notifications.filter((n) => !n.read).length}</span>}
                </button>
                {showNotif && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-border z-50">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">Notifikasi</h4>
                      {notifications.length > 0 && <button onClick={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))} className="text-xs text-primary hover:text-primary-dark font-medium">Tandai semua dibaca</button>}
                    </div>
                    <ScrollArea className="max-h-80">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center"><IconBell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" /><p className="text-sm text-muted-foreground">Belum ada notifikasi</p></div>
                      ) : (
                        <div className="divide-y divide-border">
                          {notifications.map((item) => (
                            <div key={item.id} onClick={() => setNotifications(notifications.map((n) => n.id === item.id ? { ...n, read: true } : n))} className={`p-4 hover:bg-accent-light/30 transition-colors cursor-pointer ${!item.read ? "bg-primary/5" : ""}`}>
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${item.type === "aspirasi" ? "bg-primary/10" : "bg-success/10"}`}>{item.type === "aspirasi" ? <IconMessage className="w-4 h-4 text-primary" /> : <IconHeadphones className="w-4 h-4 text-success" />}</div>
                                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-foreground">{item.title}</p><p className="text-xs text-muted-foreground mt-0.5 truncate">{item.message}</p><p className="text-xs text-muted-foreground mt-1">{item.time}</p></div>
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
              <div className="flex items-center gap-3">
                {profilePhoto ? (
                  profilePhoto.startsWith("data:") ? (
                    <img src={profilePhoto} alt="Foto Profil" className="w-9 h-9 rounded-xl object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-xl">{profilePhoto}</div>
                  )
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><IconSettings className="w-5 h-5 text-primary" /></div>
                )}
                <div className="hidden sm:block"><p className="text-sm font-semibold text-foreground">{profileName}</p><p className="text-xs text-primary font-medium">Administrator</p></div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* === Statistik ringkas === */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[
              { onClick: () => setStatBubbleModal("aspirasi"), value: aspirasiList.length, label: "Total Aspirasi", icon: IconMessage, color: "text-primary" },
              { onClick: () => setStatBubbleModal("warga"), value: wargaAktif, label: "Warga Aktif", icon: IconUsers, color: "text-primary-light" },
              { onClick: () => setStatBubbleModal("suara"), value: totalSuara.toLocaleString("id-ID"), label: "Total Suara", icon: IconClipboardList, color: "text-success" },
              { onClick: () => setStatBubbleModal("selesai"), value: aspirasiSelesai, label: "Aspirasi Selesai", icon: IconTrendingUp, color: "text-primary" },
            ].map((stat) => (
              <Card key={stat.label} onClick={stat.onClick} className="stat-card border-2 border-amber-300 hover:bg-accent-light hover:border-primary transition-all cursor-pointer group">
                <CardContent className="p-3 sm:p-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-accent-light group-hover:bg-primary/10 flex items-center justify-center transition-colors"><stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color} group-hover:text-primary transition-colors`} /></div>
                    <div><p className="text-lg sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{stat.value}</p><p className="text-[10px] sm:text-xs text-muted-foreground group-hover:text-primary transition-colors">{stat.label}</p></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* === Section: Statistik === */}
          {activeSection === "statistik" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-foreground">Statistik Platform</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Aspirasi per status */}
                <Card className="border-border"><CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4"><IconChartPie className="w-5 h-5 text-primary" /><h4 className="font-semibold text-foreground">Aspirasi per Status</h4></div>
                  <div className="space-y-3">
                    {[
                      { label: "Diterima", count: aspirasiDiterima, color: "bg-primary/40" },
                      { label: "Diproses", count: aspirasiDiproses, color: "bg-primary" },
                      { label: "Selesai", count: aspirasiSelesai, color: "bg-success" },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${s.color}`} /><span className="text-sm text-muted-foreground">{s.label}</span></div><span className="text-sm font-bold text-foreground">{s.count}</span></div>
                        <div className="w-full bg-accent-light rounded-full h-2 mt-1"><div className={`${s.color} rounded-full h-2`} style={{ width: `${(s.count / aspirasiList.length) * 100}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </CardContent></Card>

                {/* Hasil voting */}
                <Card onClick={() => setStatModal("voting")} className="border-border hover:shadow-lg hover:border-accent transition-all cursor-pointer"><CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4"><IconChartBar className="w-5 h-5 text-primary" /><h4 className="font-semibold text-foreground">Hasil Voting Real-time</h4><IconEye className="w-4 h-4 text-muted-foreground ml-auto" /></div>
                  <div className="space-y-4">
                    {kandidatList.map((k) => (
                      <div key={k.id}>
                        <div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2"><span className="text-lg">{k.foto}</span><span className="text-sm font-medium text-foreground">{k.nama}</span></div><span className="text-sm font-bold text-primary">{k.suara.toLocaleString("id-ID")}</span></div>
                        <div className="w-full bg-accent-light rounded-full h-3"><div className="bg-primary rounded-full h-3 transition-all" style={{ width: `${(k.suara / totalSuara) * 100}%` }} /></div>
                        <p className="text-xs text-muted-foreground mt-1 text-right">{((k.suara / totalSuara) * 100).toFixed(1)}%</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between"><span className="text-sm text-muted-foreground">Total Suara Masuk</span><span className="text-lg font-bold text-foreground">{totalSuara.toLocaleString("id-ID")}</span></div>
                </CardContent></Card>

                {/* Aspirasi terbaru */}
                <Card onClick={() => setStatModal("aspirasi-terbaru")} className="border-border hover:shadow-lg hover:border-accent transition-all cursor-pointer"><CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4"><IconFileText className="w-5 h-5 text-primary" /><h4 className="font-semibold text-foreground">Aspirasi Terbaru</h4><IconEye className="w-4 h-4 text-muted-foreground ml-auto" /></div>
                  <div className="space-y-3">
                    {aspirasiList.slice(0, 4).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-accent-light/30">
                        <div className="min-w-0"><p className="text-sm font-medium text-foreground truncate">{item.judul}</p><p className="text-xs text-muted-foreground">{item.desa} &bull; {item.tanggal}</p></div>
                        <Badge className={`border-0 hover:bg-transparent flex-shrink-0 ml-2 ${STATUS_COLORS[item.status] || ""}`}>{item.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent></Card>

                {/* Kandidat terpopuler */}
                <Card onClick={() => setStatModal("kandidat")} className="border-border hover:shadow-lg hover:border-accent transition-all cursor-pointer"><CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4"><IconTrendingUp className="w-5 h-5 text-primary" /><h4 className="font-semibold text-foreground">Kandidat Terpopuler</h4><IconEye className="w-4 h-4 text-muted-foreground ml-auto" /></div>
                  <div className="space-y-3">
                    {[...kandidatList].sort((a, b) => b.suara - a.suara).map((k, i) => (
                      <div key={k.id} className="flex items-center gap-3 p-3 rounded-xl bg-accent-light/30">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${i === 0 ? "bg-primary text-white" : "bg-accent-light text-primary"}`}>{i + 1}</div>
                        <span className="text-lg">{k.foto}</span>
                        <div className="flex-1 min-w-0"><p className="text-sm font-medium text-foreground">{k.nama}</p><p className="text-xs text-muted-foreground">{k.suara.toLocaleString("id-ID")} suara</p></div>
                        <span className="text-sm font-bold text-primary">{((k.suara / totalSuara) * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent></Card>
              </div>
            </div>
          )}

          {/* === Section: Kelola Aspirasi === */}
          {activeSection === "aspirasi" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-xl font-bold text-foreground">Kelola Aspirasi</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {["Semua", "Diterima", "Diproses", "Selesai"].map((f) => (
                    <Button key={f} variant={aspirasiFilter === f ? "default" : "outline"} onClick={() => setAspirasiFilter(f)}
                      className={aspirasiFilter === f ? "bg-primary text-white shadow-sm" : "border-border"}>
                      {f}
                    </Button>
                  ))}
                </div>
              </div>
              {/* Filter tanggal */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2"><span className="text-sm font-medium text-muted-foreground">Dari:</span><Input type="date" value={aspirasiDateStart} onChange={(e) => setAspirasiDateStart(e.target.value)} className="w-40 input-focus" /></div>
                <div className="flex items-center gap-2"><span className="text-sm font-medium text-muted-foreground">Sampai:</span><Input type="date" value={aspirasiDateEnd} onChange={(e) => setAspirasiDateEnd(e.target.value)} className="w-40 input-focus" /></div>
                {(aspirasiDateStart || aspirasiDateEnd) && <Button variant="ghost" onClick={() => { setAspirasiDateStart(""); setAspirasiDateEnd(""); }} className="text-xs text-primary hover:text-primary-dark">Reset Tanggal</Button>}
              </div>
              {/* Tabel aspirasi TanStack Table */}
              <Card className="border-border">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      {aspirasiTable.getHeaderGroups().map((hg) => (
                        <TableRow key={hg.id}>
                          {hg.headers.map((h) => <TableHead key={h.id} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>)}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {aspirasiTable.getRowModel().rows.length === 0 ? (
                        <TableRow><TableCell colSpan={aspirasiColumns.length} className="text-center py-8"><IconMessage className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">Tidak ada aspirasi</p></TableCell></TableRow>
                      ) : aspirasiTable.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} onClick={() => setSelectedAspirasi(row.original)} className="hover:bg-accent-light/20 transition-colors cursor-pointer">
                          {row.getVisibleCells().map((cell) => <TableCell key={cell.id} onClick={(e) => { if (cell.column.id === "aksi") e.stopPropagation(); }} className="px-6 py-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          )}

          {/* === Section: Kelola Voting === */}
          {activeSection === "voting" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">Kelola Voting</h3>
                <Button onClick={() => setShowFormKandidat(true)} className="bg-primary text-white hover:bg-primary-dark shadow-sm"><IconUser className="w-4 h-4 mr-2" /> Tambah Kandidat</Button>
              </div>
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <IconClipboardList className="w-5 h-5 text-primary" /><h4 className="font-semibold text-foreground">Pemilihan Kepala Desa 2026</h4>
                    <Badge className="bg-success/10 text-success border-0 hover:bg-success/10 ml-auto">Aktif</Badge>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {kandidatList.map((k) => (
                      <div key={k.id} onClick={() => setSelectedKandidatDetail(k)} className="p-5 rounded-xl border-2 border-border hover:border-accent transition-all cursor-pointer">
                        <div className="flex items-center justify-end gap-1 mb-2">
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setEditKandidatId(k.id); setFormKandidatNama(k.nama); setFormKandidatVisi(k.visi); setFormKandidatFoto(k.foto); setShowEditKandidat(true); }} className="hover:text-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></Button>
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); if (confirm(`Hapus kandidat ${k.nama}?`)) { setKandidatList(kandidatList.filter((x) => x.id !== k.id)); setNotifications([{ id: Date.now(), type: "aspirasi", title: "Kandidat Dihapus", message: `${k.nama} telah dihapus`, time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }), read: false }, ...notifications]); toast.success("Kandidat Dihapus!", { description: `${k.nama} telah berhasil dihapus.` }); } }} className="hover:text-red-500"><IconTrash className="w-4 h-4" /></Button>
                        </div>
                        <div className="w-16 h-16 rounded-xl bg-accent-light flex items-center justify-center mx-auto mb-3 text-3xl">{k.foto}</div>
                        <h5 className="font-bold text-foreground text-center mb-1">{k.nama}</h5>
                        <p className="text-xs text-muted-foreground text-center leading-relaxed mb-3">{k.visi}</p>
                        <div className="text-center"><span className="text-2xl font-bold text-primary">{k.suara.toLocaleString("id-ID")}</span><p className="text-xs text-muted-foreground">suara</p></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* === Section: Kelola Warga === */}
          {activeSection === "warga" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">Kelola Warga</h3>
                <Input value={wargaSearch} onChange={(e) => setWargaSearch(e.target.value)} placeholder="Cari warga..." className="w-64 input-focus" />
              </div>
              {/* Tab filter */}
              <Tabs value={wargaFilter} onValueChange={setWargaFilter}>
                <TabsList className="bg-white p-1.5 shadow-sm border border-border h-auto w-full max-w-md">
                  {["Semua", "Aktif", "Tidak Aktif"].map((tab) => (
                    <TabsTrigger key={tab} value={tab} className="flex-1 data-[state=active]:tab-active data-[state=active]:shadow-md">
                      {tab}
                      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${wargaFilter === tab ? "bg-white/20" : "bg-accent-light"}`}>
                        {tab === "Semua" ? wargaList.length : wargaList.filter((w) => w.status === (tab === "Aktif" ? "Aktif" : "Tidak Aktif")).length}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              {/* Tabel warga TanStack Table */}
              <Card className="border-border">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      {wargaTable.getHeaderGroups().map((hg) => (
                        <TableRow key={hg.id}>
                          {hg.headers.map((h) => <TableHead key={h.id} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>)}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {wargaTable.getRowModel().rows.length === 0 ? (
                        <TableRow><TableCell colSpan={wargaColumns.length} className="text-center py-8"><IconUsers className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">Tidak ada warga</p></TableCell></TableRow>
                      ) : wargaTable.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} className="hover:bg-accent-light/20 transition-colors">
                          {row.getVisibleCells().map((cell) => <TableCell key={cell.id} className="px-6 py-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          )}

          {/* === Section: Papan Publik === */}
          {activeSection === "papan" && (
            <div className="space-y-6">
              <div><h3 className="text-xl font-bold text-foreground">Papan Publik</h3><p className="text-sm text-muted-foreground">Kelola aspirasi publik yang tampil untuk warga</p></div>
              <div className="grid md:grid-cols-2 gap-4">
                {papanPublikData.map((item) => (
                  <Card key={item.id} onClick={() => setSelectedPapanPublik(item)} className="border-border hover:border-accent hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><IconMapPin className="w-3 h-3" />{item.desa}</span>
                          <Badge className="bg-primary/10 text-primary border-0 hover:bg-primary/10">{item.kategori}</Badge>
                        </div>
                        <Badge className={`border-0 hover:bg-transparent ${item.status === "Aktif" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"}`}>{item.status}</Badge>
                      </div>
                      <h5 className="font-semibold text-foreground mb-3">{item.judul}</h5>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1"><IconClipboardList className="w-4 h-4" />{papanVotes[item.id] || item.votes} suara</span>
                        <span className="text-xs text-muted-foreground">{item.waktu}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* === Section: Kelola Berita === */}
          {activeSection === "berita" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Kelola Berita</h3>
                  <p className="text-sm text-muted-foreground">Tambah, edit, atau hapus berita desa</p>
                </div>
                <Button onClick={() => { setEditBeritaId(null); setFormBeritaJudul(""); setFormBeritaKategori("Pemilihan"); setFormBeritaDeskripsi(""); setFormBeritaKonten(""); setFormBeritaGambar("https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&h=400&fit=crop"); setShowFormBerita(true); }} className="bg-primary text-white hover:bg-primary-dark shadow-sm">
                  <IconPlus className="w-4 h-4 mr-2" /> Tambah Berita
                </Button>
              </div>
              {beritaList.length === 0 ? (
                <Card className="border-border">
                  <CardContent className="p-8 text-center">
                    <IconNews className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">Belum ada berita</p>
                    <p className="text-xs text-muted-foreground mt-1">Klik &quot;Tambah Berita&quot; untuk membuat berita baru</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {beritaList.map((berita) => (
                    <Card key={berita.id} className="border-border hover:shadow-md transition-all overflow-hidden">
                      <div className="relative h-40 overflow-hidden">
                        <img src={berita.gambar} alt={berita.judul} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-primary/10 text-primary border-0 hover:bg-primary/10">{berita.kategori}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h5 className="font-bold text-foreground mb-1 line-clamp-1">{berita.judul}</h5>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{berita.deskripsi}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{berita.tanggal}</span>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => {
                              setEditBeritaId(berita.id);
                              setFormBeritaJudul(berita.judul);
                              setFormBeritaKategori(berita.kategori);
                              setFormBeritaDeskripsi(berita.deskripsi);
                              setFormBeritaKonten(berita.konten);
                              setFormBeritaGambar(berita.gambar);
                              setShowFormBerita(true);
                            }} className="hover:text-primary h-8 w-8 p-0">
                              <IconEdit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => {
                              if (!confirm(`Hapus berita "${berita.judul}"?`)) return;
                              const updated = beritaList.filter((b) => b.id !== berita.id);
                              setBeritaList(updated);
                              localStorage.setItem("berita_list", JSON.stringify(updated));
                              toast.success("Berita Dihapus!", { description: `"${berita.judul}" telah dihapus.` });
                            }} className="hover:text-red-500 h-8 w-8 p-0">
                              <IconTrash className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === Section: Chat Warga === */}
          {activeSection === "chat" && (
            <div className="flex gap-6 h-[calc(100vh-200px)]">
              <div className="w-80 flex-shrink-0 bg-white rounded-xl border border-border flex flex-col">
                <div className="p-4 border-b border-border"><h3 className="text-lg font-bold text-foreground">Chat Warga</h3><p className="text-xs text-muted-foreground">Balas pesan dari warga</p></div>
                <div className="flex-1 overflow-y-auto">
                  {chatRoomsList.map((room) => (
                    <div key={room.id} onClick={() => setSelectedChatRoom(room)} className={`p-4 border-b border-border cursor-pointer transition-colors ${selectedChatRoom?.id === room.id ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-accent-light/30"}`}>
                      <div className="flex items-center gap-3">
                        <div className="relative"><div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center"><IconUser className="w-5 h-5 text-primary" /></div><span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${room.status === "online" ? "bg-success" : "bg-muted/30"}`} /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between"><h5 className="font-semibold text-foreground text-sm">{room.wargaName}</h5><span className="text-xs text-muted-foreground">{room.lastTime || ""}</span></div>
                          <p className="text-xs text-muted-foreground">{room.role}</p><p className="text-xs text-muted-foreground truncate mt-0.5">{room.lastMessage || "Klik untuk membalas"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {selectedChatRoom ? (
                <div className="flex-1 bg-white rounded-xl border border-border flex flex-col">
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <div className="relative"><div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center"><IconUser className="w-5 h-5 text-primary" /></div><span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${selectedChatRoom.status === "online" ? "bg-success" : "bg-muted/30"}`} /></div>
                    <div><h5 className="font-semibold text-foreground">{selectedChatRoom.wargaName}</h5><p className="text-xs text-muted-foreground">{selectedChatRoom.status === "online" ? "Online" : "Offline"}</p></div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedChatRoom.messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "petugas" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs lg:max-w-md ${msg.sender === "petugas" ? "bg-primary text-white rounded-2xl rounded-br-md" : "bg-accent-light text-foreground rounded-2xl rounded-bl-md"} px-4 py-3`}>
                          <p className="text-sm">{msg.text}</p><p className={`text-xs mt-1 ${msg.sender === "petugas" ? "text-white/70" : "text-muted-foreground"}`}>{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-border">
                    <form onSubmit={handleSendChat} className="flex items-center gap-3">
                      <Input value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} placeholder="Ketik balasan..." className="input-focus" />
                      <Button type="submit" className="p-3 bg-primary text-white hover:bg-primary-dark rounded-xl"><IconSend className="w-5 h-5" /></Button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="flex-1 bg-white rounded-xl border border-border flex items-center justify-center"><div className="text-center"><IconHeadphones className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">Pilih warga untuk membalas chat</p></div></div>
              )}
            </div>
          )}

          {/* === Section: Profil === */}
          {activeSection === "profil" && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">Profil Saya</h3>
                {!isEditingProfile ? <Button onClick={() => setIsEditingProfile(true)} className="bg-primary text-white hover:bg-primary-dark shadow-sm"><IconUser className="w-4 h-4 mr-2" /> Edit Profil</Button> : <div className="flex gap-2"><Button variant="outline" onClick={() => setIsEditingProfile(false)} className="border-border">Batal</Button><Button onClick={() => setIsEditingProfile(false)} className="bg-primary text-white hover:bg-primary-dark shadow-sm">Simpan</Button></div>}
              </div>
              <Card className="border-border"><CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                  <div className="relative group">
                    {profilePhoto ? (
                      profilePhoto.startsWith("data:") ? (
                        <img src={profilePhoto} alt="Foto Profil" className="w-20 h-20 rounded-xl object-cover border-2 border-amber-400" />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center border-2 border-amber-400 text-4xl">{profilePhoto}</div>
                      )
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center border-2 border-amber-400"><IconSettings className="w-10 h-10 text-primary" /></div>
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
                  <div><h4 className="text-lg font-bold text-foreground">{profileName}</h4><p className="text-sm text-primary font-medium">Administrator &bull; {profileDesa}</p></div>
                </div>
                <div className="space-y-4">
                  {[{ label: "Nama Lengkap", value: profileName, set: setProfileName, type: "text" }, { label: "Email", value: profileEmail, set: setProfileEmail, type: "email" }, { label: "Telepon", value: profilePhone, set: setProfilePhone, type: "tel" }, { label: "Alamat", value: profileAddress, set: setProfileAddress, type: "text" }].map((f) => (
                    <div key={f.label}><Label className="mb-2">{f.label}</Label>{isEditingProfile ? <Input type={f.type} value={f.value} onChange={(e) => f.set(e.target.value)} className="input-focus" /> : <p className="text-foreground font-medium">{f.value}</p>}</div>
                  ))}
                  <div><Label className="mb-2">Desa</Label>{isEditingProfile ? <Select value={profileDesa} onValueChange={(v) => v && setProfileDesa(v)}><SelectTrigger className="input-focus"><SelectValue /></SelectTrigger><SelectContent>{daftarDesa.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select> : <p className="text-foreground font-medium">{profileDesa}</p>}</div>
                </div>
              </CardContent></Card>
            </div>
          )}

          {/* === Section: Ganti Kata Sandi === */}
          {activeSection === "sandi" && (
            <div className="max-w-md">
              <h3 className="text-xl font-bold text-foreground mb-6">Ganti Kata Sandi</h3>
              <Card className="border-border"><CardContent className="p-6">
                {showSandiSuccess ? (
                  <div className="text-center py-8"><div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4"><IconCircleCheck className="w-8 h-8 text-success" /></div><h4 className="text-lg font-bold text-foreground mb-2">Kata Sandi Berhasil Diganti!</h4><p className="text-sm text-muted-foreground mb-6">Kata sandi Anda telah berhasil diperbarui.</p><Button onClick={() => setShowSandiSuccess(false)} className="bg-primary text-white hover:bg-primary-dark">Kembali</Button></div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setShowSandiSuccess(true); }} className="space-y-4">
                    <div><Label className="mb-2">Kata Sandi Lama</Label><Input type="password" placeholder="Masukkan kata sandi lama" className="input-focus" required /></div>
                    <div><Label className="mb-2">Kata Sandi Baru</Label><Input type="password" placeholder="Masukkan kata sandi baru" className="input-focus" required /></div>
                    <div><Label className="mb-2">Konfirmasi Kata Sandi</Label><Input type="password" placeholder="Ulangi kata sandi baru" className="input-focus" required /></div>
                    <Button type="submit" className="w-full bg-primary text-white hover:bg-primary-dark shadow-sm">Simpan Perubahan</Button>
                  </form>
                )}
              </CardContent></Card>
            </div>
          )}
        </main>
      </div>

      {/* === Modal: Detail Aspirasi === */}
      <Dialog open={!!selectedAspirasi} onOpenChange={(o) => !o && setSelectedAspirasi(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Aspirasi</DialogTitle><p className="text-sm text-muted-foreground">{selectedAspirasi?.id}</p>
            <div className="flex items-center gap-2 mt-2">
              <Button size="sm" onClick={() => selectedAspirasi && handleDownloadAspirasiPdf(selectedAspirasi)} className="bg-primary text-white hover:bg-primary-dark"><IconDownload className="w-3.5 h-3.5 mr-1" /> PDF</Button>
              <Button size="sm" variant="destructive" onClick={() => {
                if (!selectedAspirasi) return;
                if (!confirm(`Hapus aspirasi "${selectedAspirasi.judul}"?`)) return;
                // Hapus dari state
                setAspirasiList(aspirasiList.filter((a) => a.id !== selectedAspirasi.id));
                // Hapus dari localStorage
                try {
                  const stored = JSON.parse(localStorage.getItem("aspirasi_warga") || "[]");
                  localStorage.setItem("aspirasi_warga", JSON.stringify(stored.filter((a: Aspirasi) => a.id !== selectedAspirasi.id)));
                } catch {}
                setSelectedAspirasi(null);
                setNotifications([{ id: Date.now(), type: "aspirasi" as const, title: "Aspirasi Dihapus", message: `"${selectedAspirasi.judul}" telah dihapus`, time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }), read: false }, ...notifications]);
                toast.success("Aspirasi Dihapus!", {
                  description: `"${selectedAspirasi.judul}" telah berhasil dihapus.`,
                });
              }} className="hover:bg-red-600"><IconTrash className="w-3.5 h-3.5 mr-1" /> Hapus</Button>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Judul</Label><p className="text-foreground font-semibold">{selectedAspirasi?.judul}</p></div>
            <div className="flex gap-4"><div className="flex-1"><Label>Kategori</Label><p className="text-foreground font-medium">{selectedAspirasi?.kategori}</p></div>
              <div className="flex-1"><Label>Ubah Status</Label>
                <select value={selectedAspirasi?.status || ""} onChange={(e) => {
                  if (!selectedAspirasi) return;
                  const val = e.target.value;
                  setAspirasiList(aspirasiList.map((a) => a.id === selectedAspirasi.id ? { ...a, status: val } : a));
                  setSelectedAspirasi({ ...selectedAspirasi, status: val });
                }} className="w-full text-sm px-3 py-2 rounded-lg border border-border text-foreground focus:outline-none input-focus mt-1">
                  <option value="Diterima">Diterima</option>
                  <option value="Diproses">Diproses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>
            <div><Label>Desa</Label><p className="text-foreground font-medium">{selectedAspirasi?.desa}</p></div>
            <div><Label>Tanggal</Label><p className="text-foreground font-medium">{selectedAspirasi?.tanggal}</p></div>
            <div><Label>Deskripsi</Label><p className="text-foreground leading-relaxed bg-accent-light/30 p-4 rounded-xl">{selectedAspirasi?.deskripsi}</p></div>
          </div>
        </DialogContent>
      </Dialog>

      {/* === Modal: Detail Warga === */}
      <Dialog open={!!selectedWarga} onOpenChange={(o) => !o && setSelectedWarga(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Detail Warga</DialogTitle><p className="text-sm text-muted-foreground">{selectedWarga?.id}</p></DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-accent-light flex items-center justify-center"><IconUser className="w-8 h-8 text-primary" /></div>
              <div><h4 className="text-lg font-bold text-foreground">{selectedWarga?.nama}</h4><Badge className={`border-0 hover:bg-transparent ${selectedWarga?.status === "Aktif" ? "bg-success/10 text-success" : "bg-muted/10 text-muted-foreground"}`}>{selectedWarga?.status}</Badge></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>NIK</Label><p className="text-foreground font-mono">{selectedWarga?.nik}</p></div>
              <div><Label>Desa</Label><p className="text-foreground font-medium">{selectedWarga?.desa}</p></div>
              <div><Label>Email</Label><p className="text-foreground font-medium">{selectedWarga?.email}</p></div>
              <div><Label>Telepon</Label><p className="text-foreground font-medium">{selectedWarga?.telepon}</p></div>
            </div>
            <div><Label>Tanggal Daftar</Label><p className="text-foreground font-medium">{selectedWarga?.tanggalDaftar}</p></div>
          </div>
        </DialogContent>
      </Dialog>

      {/* === Modal: Tambah/Edit Kandidat === */}
      <Dialog open={showFormKandidat || showEditKandidat} onOpenChange={(o) => { if (!o) { setShowFormKandidat(false); setShowEditKandidat(false); setEditKandidatId(null); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{showEditKandidat ? "Edit" : "Tambah"} Kandidat</DialogTitle></DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const r = kandidatSchema.safeParse({ nama: formKandidatNama, visi: formKandidatVisi });
            if (!r.success) return;
            if (showEditKandidat && editKandidatId) {
              setKandidatList(kandidatList.map((k) => k.id === editKandidatId ? { ...k, nama: formKandidatNama, visi: formKandidatVisi, foto: formKandidatFoto } : k));
              setNotifications([{ id: Date.now(), type: "aspirasi", title: "Kandidat Diperbarui", message: `Data ${formKandidatNama} berhasil diperbarui`, time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }), read: false }, ...notifications]);
              toast.success("Kandidat Diperbarui!", { description: `Data ${formKandidatNama} berhasil diperbarui.` });
            } else {
              setKandidatList([...kandidatList, { id: kandidatList.length + 1, nama: formKandidatNama, visi: formKandidatVisi, foto: formKandidatFoto, suara: 0 }]);
              setNotifications([{ id: Date.now(), type: "aspirasi", title: "Kandidat Ditambahkan", message: `${formKandidatNama} berhasil ditambahkan`, time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }), read: false }, ...notifications]);
              toast.success("Kandidat Ditambahkan!", { description: `${formKandidatNama} berhasil ditambahkan.` });
            }
            setFormKandidatNama(""); setFormKandidatVisi(""); setFormKandidatFoto("👤"); setShowFormKandidat(false); setShowEditKandidat(false); setEditKandidatId(null);
          }} className="space-y-5">
            <div>
              <Label className="mb-2">Foto / Avatar</Label>
              <div className="flex flex-wrap gap-2">
                {["👤", "👩", "👨", "👩‍💼", "👨‍💼", "👩‍🔧", "👨‍🔧", "👩‍🏫", "👨‍🏫"].map((a) => (
                  <Button key={a} type="button" variant="outline" onClick={() => setFormKandidatFoto(a)} className={`w-12 h-12 text-2xl border-2 ${formKandidatFoto === a ? "border-primary bg-primary/5" : "border-border"}`}>{a}</Button>
                ))}
              </div>
            </div>
            <div><Label className="mb-2">Nama Lengkap</Label><Input value={formKandidatNama} onChange={(e) => setFormKandidatNama(e.target.value)} placeholder="Masukkan nama kandidat" className="input-focus" required /></div>
            <div><Label className="mb-2">Visi & Misi</Label><Textarea rows={3} value={formKandidatVisi} onChange={(e) => setFormKandidatVisi(e.target.value)} placeholder="Tuliskan visi dan misi kandidat..." className="input-focus resize-none" required /></div>
            <Button type="submit" className="w-full bg-primary text-white hover:bg-primary-dark shadow-sm"><IconUser className="w-4 h-4 mr-2" /> {showEditKandidat ? "Simpan Perubahan" : "Tambah Kandidat"}</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* === Modal: Detail Kandidat === */}
      <Dialog open={!!selectedKandidatDetail} onOpenChange={(o) => !o && setSelectedKandidatDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Detail Kandidat</DialogTitle></DialogHeader>
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-xl bg-accent-light flex items-center justify-center mx-auto text-4xl">{selectedKandidatDetail?.foto}</div>
            <h4 className="text-xl font-bold text-foreground">{selectedKandidatDetail?.nama}</h4>
            <div><Label>Visi & Misi</Label><p className="text-foreground leading-relaxed bg-accent-light/30 p-4 rounded-xl mt-2">{selectedKandidatDetail?.visi}</p></div>
            <div className="pt-4 border-t border-border">
              <span className="text-3xl font-bold text-primary">{selectedKandidatDetail?.suara.toLocaleString("id-ID")}</span>
              <p className="text-sm text-muted-foreground">suara diterima</p>
              <p className="text-lg font-bold text-foreground mt-1">{selectedKandidatDetail ? `${((selectedKandidatDetail.suara / totalSuara) * 100).toFixed(1)}%` : "0%"}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* === Modal: Detail Papan Publik === */}
      <Dialog open={!!selectedPapanPublik} onOpenChange={(o) => !o && setSelectedPapanPublik(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{selectedPapanPublik?.judul}</DialogTitle><p className="text-sm text-muted-foreground">{selectedPapanPublik?.desa}</p></DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2"><Badge className="bg-primary/10 text-primary border-0 hover:bg-primary/10">{selectedPapanPublik?.kategori}</Badge><Badge className={`border-0 hover:bg-transparent ${selectedPapanPublik?.status === "Aktif" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"}`}>{selectedPapanPublik?.status}</Badge></div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground"><span className="flex items-center gap-1"><IconMapPin className="w-4 h-4" />{selectedPapanPublik?.desa}</span><span className="flex items-center gap-1"><IconClock className="w-4 h-4" />{selectedPapanPublik?.waktu}</span></div>
            <div><Label>Deskripsi</Label><p className="text-foreground leading-relaxed bg-accent-light/30 p-4 rounded-xl mt-2">{selectedPapanPublik?.deskripsi}</p></div>
            <div className="flex items-center gap-2 pt-4 border-t border-border"><IconClipboardList className="w-5 h-5 text-primary" /><span className="text-lg font-bold text-foreground">{selectedPapanPublik && (papanVotes[selectedPapanPublik.id] || selectedPapanPublik.votes)}</span><span className="text-sm text-muted-foreground">suara mendukung</span></div>
          </div>
        </DialogContent>
      </Dialog>

      {/* === Modal: Statistik - Voting === */}
      <Dialog open={statModal === "voting"} onOpenChange={(o) => !o && setStatModal(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><IconChartBar className="w-5 h-5 text-primary" /></div><div><DialogTitle>Hasil Voting Real-time</DialogTitle><p className="text-sm text-muted-foreground">Total {totalSuara.toLocaleString("id-ID")} suara masuk</p></div></div>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(85vh-120px)]">
            <div className="space-y-6">
              {[...kandidatList].sort((a, b) => b.suara - a.suara).map((k, i) => (
                <div key={k.id}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${i === 0 ? "bg-primary text-white" : "bg-accent-light text-primary"}`}>{i + 1}</div>
                    <span className="text-2xl">{k.foto}</span>
                    <div className="flex-1"><h4 className="font-bold text-foreground">{k.nama}</h4><p className="text-xs text-muted-foreground">{k.visi}</p></div>
                    <div className="text-right"><p className="text-2xl font-bold text-primary">{k.suara.toLocaleString("id-ID")}</p><p className="text-sm font-bold text-foreground">{((k.suara / totalSuara) * 100).toFixed(1)}%</p></div>
                  </div>
                  <div className="w-full bg-accent-light rounded-full h-4"><div className="bg-primary rounded-full h-4 transition-all" style={{ width: `${(k.suara / totalSuara) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* === Modal: Statistik - Aspirasi Terbaru === */}
      <Dialog open={statModal === "aspirasi-terbaru"} onOpenChange={(o) => !o && setStatModal(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><IconFileText className="w-5 h-5 text-primary" /></div><div><DialogTitle>Semua Aspirasi</DialogTitle><p className="text-sm text-muted-foreground">{aspirasiList.length} aspirasi dari warga</p></div></div>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(85vh-120px)]">
            <div className="space-y-3">
              {aspirasiList.map((item) => (
                <div key={item.id} onClick={() => { setStatModal(null); setSelectedAspirasi(item); }} className="p-4 rounded-xl bg-accent-light/30 hover:bg-accent-light/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><span className="text-xs font-mono text-muted-foreground">{item.id}</span><Badge className="bg-primary/10 text-primary border-0 hover:bg-primary/10">{item.kategori}</Badge></div><Badge className={`border-0 hover:bg-transparent ${STATUS_COLORS[item.status] || ""}`}>{item.status}</Badge></div>
                  <h4 className="font-semibold text-foreground mb-1">{item.judul}</h4>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.deskripsi}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-1"><IconMapPin className="w-3 h-3" />{item.desa}</span><span className="flex items-center gap-1"><IconClock className="w-3 h-3" />{item.tanggal}</span></div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* === Modal: Statistik - Kandidat === */}
      <Dialog open={statModal === "kandidat"} onOpenChange={(o) => !o && setStatModal(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><IconTrendingUp className="w-5 h-5 text-primary" /></div><div><DialogTitle>Kandidat Terpopuler</DialogTitle><p className="text-sm text-muted-foreground">Peringkat berdasarkan jumlah suara</p></div></div>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(85vh-120px)]">
            <div className="space-y-4">
              {[...kandidatList].sort((a, b) => b.suara - a.suara).map((k, i) => (
                <div key={k.id} className="p-5 rounded-xl bg-accent-light/30 hover:bg-accent-light/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${i === 0 ? "bg-primary text-white" : i === 1 ? "bg-primary/20 text-primary" : "bg-accent-light text-primary"}`}>{i + 1}</div>
                    <span className="text-3xl">{k.foto}</span>
                    <div className="flex-1"><h4 className="font-bold text-foreground text-lg">{k.nama}</h4><p className="text-sm text-muted-foreground">{k.visi}</p></div>
                    <div className="text-right"><p className="text-3xl font-bold text-primary">{k.suara.toLocaleString("id-ID")}</p><p className="text-sm font-bold text-foreground">{((k.suara / totalSuara) * 100).toFixed(1)}%</p><p className="text-xs text-muted-foreground">suara</p></div>
                  </div>
                  <div className="mt-3 w-full bg-white rounded-full h-3"><div className="bg-primary rounded-full h-3 transition-all" style={{ width: `${(k.suara / totalSuara) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* === Modal: Stat Bubble - Total Aspirasi === */}
      <Dialog open={statBubbleModal === "aspirasi"} onOpenChange={(o) => !o && setStatBubbleModal(null)}>
        <DialogContent className="max-w-lg max-h-[85vh]">
          <DialogHeader><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><IconMessage className="w-5 h-5 text-primary" /></div><div><DialogTitle>Total Aspirasi</DialogTitle><p className="text-sm text-muted-foreground">{aspirasiList.length} aspirasi dari warga</p></div></div></DialogHeader>
          <ScrollArea className="max-h-[calc(85vh-120px)]"><div className="space-y-3">{aspirasiList.map((item) => (<div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-accent-light/30"><div className="min-w-0"><p className="text-sm font-medium text-foreground">{item.judul}</p><p className="text-xs text-muted-foreground">{item.desa} &bull; {item.tanggal}</p></div><Badge className={`border-0 hover:bg-transparent flex-shrink-0 ml-2 ${STATUS_COLORS[item.status] || ""}`}>{item.status}</Badge></div>))}</div></ScrollArea>
        </DialogContent>
      </Dialog>

      {/* === Modal: Stat Bubble - Warga Aktif === */}
      <Dialog open={statBubbleModal === "warga"} onOpenChange={(o) => !o && setStatBubbleModal(null)}>
        <DialogContent className="max-w-lg max-h-[85vh]">
          <DialogHeader><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><IconUsers className="w-5 h-5 text-primary" /></div><div><DialogTitle>Warga Aktif</DialogTitle><p className="text-sm text-muted-foreground">{wargaAktif} dari {wargaList.length} warga terdaftar</p></div></div></DialogHeader>
          <ScrollArea className="max-h-[calc(85vh-120px)]"><div className="space-y-3">{wargaList.filter((w) => w.status === "Aktif").map((w) => (<div key={w.id} className="flex items-center gap-3 p-4 rounded-xl bg-accent-light/30"><div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center flex-shrink-0"><IconUser className="w-5 h-5 text-primary" /></div><div className="flex-1 min-w-0"><p className="text-sm font-medium text-foreground">{w.nama}</p><p className="text-xs text-muted-foreground">{w.desa} &bull; {w.email}</p></div><Badge className="bg-success/10 text-success border-0 hover:bg-success/10">Aktif</Badge></div>))}</div></ScrollArea>
        </DialogContent>
      </Dialog>

      {/* === Modal: Stat Bubble - Total Suara === */}
      <Dialog open={statBubbleModal === "suara"} onOpenChange={(o) => !o && setStatBubbleModal(null)}>
        <DialogContent className="max-w-lg max-h-[85vh]">
          <DialogHeader><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><IconClipboardList className="w-5 h-5 text-primary" /></div><div><DialogTitle>Total Suara</DialogTitle><p className="text-sm text-muted-foreground">{totalSuara.toLocaleString("id-ID")} suara masuk</p></div></div></DialogHeader>
          <ScrollArea className="max-h-[calc(85vh-120px)]"><div className="space-y-4">{[...kandidatList].sort((a, b) => b.suara - a.suara).map((k, i) => (<div key={k.id} className="p-4 rounded-xl bg-accent-light/30"><div className="flex items-center gap-3 mb-2"><div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${i === 0 ? "bg-primary text-white" : "bg-accent-light text-primary"}`}>{i + 1}</div><span className="text-xl">{k.foto}</span><div className="flex-1"><p className="font-semibold text-foreground">{k.nama}</p></div><div className="text-right"><p className="text-lg font-bold text-primary">{k.suara.toLocaleString("id-ID")}</p><p className="text-xs text-muted-foreground">{((k.suara / totalSuara) * 100).toFixed(1)}%</p></div></div><div className="w-full bg-white rounded-full h-2"><div className="bg-primary rounded-full h-2" style={{ width: `${(k.suara / totalSuara) * 100}%` }} /></div></div>))}</div></ScrollArea>
        </DialogContent>
      </Dialog>

      {/* === Modal: Stat Bubble - Aspirasi Selesai === */}
      <Dialog open={statBubbleModal === "selesai"} onOpenChange={(o) => !o && setStatBubbleModal(null)}>
        <DialogContent className="max-w-lg max-h-[85vh]">
          <DialogHeader><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center"><IconCircleCheck className="w-5 h-5 text-success" /></div><div><DialogTitle>Aspirasi Selesai</DialogTitle><p className="text-sm text-muted-foreground">{aspirasiSelesai} aspirasi telah diselesaikan</p></div></div></DialogHeader>
          <ScrollArea className="max-h-[calc(85vh-120px)]">
            {aspirasiList.filter((a) => a.status === "Selesai").length === 0 ? (
              <div className="text-center py-8"><IconCircleCheck className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">Belum ada aspirasi yang selesai</p></div>
            ) : (
              <div className="space-y-3">{aspirasiList.filter((a) => a.status === "Selesai").map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-success/5 border border-success/20">
                  <div className="flex items-center justify-between mb-2"><span className="text-xs font-mono text-muted-foreground">{item.id}</span><Badge className="bg-success/10 text-success border-0 hover:bg-success/10">Selesai</Badge></div>
                  <h4 className="font-semibold text-foreground mb-1">{item.judul}</h4><p className="text-sm text-muted-foreground mb-2">{item.deskripsi}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-1"><IconMapPin className="w-3 h-3" />{item.desa}</span><span className="flex items-center gap-1"><IconClock className="w-3 h-3" />{item.tanggal}</span></div>
                </div>
              ))}</div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* === Modal: Tambah/Edit Berita === */}
      <Dialog open={showFormBerita} onOpenChange={(o) => { if (!o) { setShowFormBerita(false); setEditBeritaId(null); } }}>
        <DialogContent className="max-w-lg max-h-[85vh]">
          <DialogHeader><DialogTitle>{editBeritaId ? "Edit" : "Tambah"} Berita</DialogTitle></DialogHeader>
          <ScrollArea className="max-h-[calc(85vh-120px)]">
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!formBeritaJudul.trim() || !formBeritaDeskripsi.trim() || !formBeritaKonten.trim()) return;
              const now = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
              if (editBeritaId) {
                const updated = beritaList.map((b) => b.id === editBeritaId ? { ...b, judul: formBeritaJudul, kategori: formBeritaKategori, deskripsi: formBeritaDeskripsi, konten: formBeritaKonten, gambar: formBeritaGambar } : b);
                setBeritaList(updated);
                localStorage.setItem("berita_list", JSON.stringify(updated));
                toast.success("Berita Diperbarui!", { description: `"${formBeritaJudul}" berhasil diperbarui.` });
              } else {
                const newBerita = { id: Date.now(), judul: formBeritaJudul, kategori: formBeritaKategori, deskripsi: formBeritaDeskripsi, konten: formBeritaKonten, gambar: formBeritaGambar, tanggal: now, penulis: profileName };
                const updated = [newBerita, ...beritaList];
                setBeritaList(updated);
                localStorage.setItem("berita_list", JSON.stringify(updated));
                toast.success("Berita Ditambahkan!", { description: `"${formBeritaJudul}" berhasil ditambahkan.` });
              }
              setShowFormBerita(false); setEditBeritaId(null);
            }} className="space-y-4">
              <div><Label className="mb-2">Judul Berita</Label><Input value={formBeritaJudul} onChange={(e) => setFormBeritaJudul(e.target.value)} placeholder="Masukkan judul berita" className="input-focus" required /></div>
              <div><Label className="mb-2">Kategori</Label>
                <select value={formBeritaKategori} onChange={(e) => setFormBeritaKategori(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-foreground focus:outline-none input-focus">
                  <option value="Pemilihan">Pemilihan</option>
                  <option value="Pembangunan">Pembangunan</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Prestasi">Prestasi</option>
                  <option value="Infrastruktur">Infrastruktur</option>
                </select>
              </div>
              <div><Label className="mb-2">URL Gambar</Label><Input value={formBeritaGambar} onChange={(e) => setFormBeritaGambar(e.target.value)} placeholder="https://..." className="input-focus" required />
                <p className="text-xs text-muted-foreground mt-1">Gunakan gambar dari Unsplash/Pexels untuk gambar online</p>
              </div>
              {formBeritaGambar && <div className="relative h-32 rounded-lg overflow-hidden border border-border"><img src={formBeritaGambar} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /></div>}
              <div><Label className="mb-2">Deskripsi Singkat</Label><Textarea rows={2} value={formBeritaDeskripsi} onChange={(e) => setFormBeritaDeskripsi(e.target.value)} placeholder="Ringkasan berita..." className="input-focus resize-none" required /></div>
              <div><Label className="mb-2">Konten Lengkap</Label><Textarea rows={5} value={formBeritaKonten} onChange={(e) => setFormBeritaKonten(e.target.value)} placeholder="Isi berita lengkap..." className="input-focus resize-none" required /></div>
              <Button type="submit" className="w-full bg-primary text-white hover:bg-primary-dark shadow-sm">
                <IconNews className="w-4 h-4 mr-2" /> {editBeritaId ? "Simpan Perubahan" : "Tambah Berita"}
              </Button>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* === Modal: Picker Avatar === */}
      <Dialog open={showAvatarPicker} onOpenChange={setShowAvatarPicker}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Ubah Foto Profil</DialogTitle></DialogHeader>
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
          <div className="grid grid-cols-4 gap-3">
            {["👩", "👨", "👩‍💼", "👨‍💼", "👩‍🔧", "👨‍🔧", "👩‍🏫", "👨‍🏫", "👩‍⚕️", "👨‍⚕️", "👩‍🍳", "👨‍🍳", "🧑‍🎓", "🧑‍💻", "🧑‍🔬", "🧑‍🎨"].map((a) => (
              <Button key={a} type="button" variant="outline" onClick={() => { setProfilePhoto(a); setShowAvatarPicker(false); }} className={`w-full aspect-square text-3xl border-2 ${profilePhoto === a ? "border-primary bg-primary/5" : "border-border"}`}>{a}</Button>
            ))}
          </div>
          <Button variant="ghost" onClick={() => { setProfilePhoto(null); setShowAvatarPicker(false); }} className="w-full text-muted-foreground hover:text-foreground">Hapus Foto (Gunakan Default)</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
