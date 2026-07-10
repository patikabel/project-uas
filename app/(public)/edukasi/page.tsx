"use client";

import Image from "next/image";
import { useState } from "react";
import {
  IconBook,
  IconClipboardList,
  IconHelp,
  IconArrowRight,
  IconClock,
  IconUser,
  IconShield,
  IconCircleCheck,
  IconAlertTriangle,
  IconFileText,
  IconUsers,
  IconScale,
  IconX,
} from "@tabler/icons-react";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// === Data artikel edukasi ===
const articles = [
  {
    id: 1,
    title: "Mengapa E-Voting Penting untuk Demokrasi Desa?",
    excerpt:
      "E-voting memberikan solusi modern untuk meningkatkan partisipasi warga dalam pemilihan tingkat desa dengan cara yang aman dan transparan.",
    category: "E-Voting",
    date: "25 Jun 2026",
    readTime: "5 menit",
    icon: IconClipboardList,
    content:
      "E-voting atau pemungutan suara elektronik merupakan metode modern yang memberikan banyak keuntungan bagi demokrasi desa. Pertama, e-voting meningkatkan partisipasi warga karena prosesnya lebih mudah dan cepat. Kedua, hasil perhitungan suara dapat diketahui secara real-time sehingga transparansi terjamin. Ketiga, sistem enkripsi yang digunakan memastikan setiap suara tercatat dengan aman dan tidak dapat dimanipulasi. Dengan adanya e-voting, warga desa dapat menjalankan hak demokrasi mereka dengan lebih percaya diri tanpa khawatir terjadi kecurangan. Platform Azelina.id hadir sebagai solusi terpercaya untuk mewujudkan demokrasi desa yang jujur dan transparan.",
  },
  {
    id: 2,
    title: "Mengenal Politik Uang dan Dampaknya terhadap Demokrasi",
    excerpt:
      "Praktik politik uang masih menjadi tantangan besar dalam demokrasi desa. Pelajari bagaimana platform kami membantu mengatasinya.",
    category: "Politik Uang",
    date: "23 Jun 2026",
    readTime: "7 menit",
    icon: IconAlertTriangle,
    content:
      "Politik uang adalah praktik memberikan uang atau barang berharga kepada pemilih dengan tujuan mempengaruhi pilihan mereka. Praktik ini sangat merugikan demokrasi karena membuat pemilihan tidak lagi didasarkan pada visi dan program kandidat, melainkan pada materi. Akibatnya, kandidat terpilih belum tentu yang terbaik untuk masyarakat. Melawan politik uang membutuhkan kesadaran seluruh warga untuk menolak praktik tersebut dan melaporkannya. Platform Azelina.id menyediakan saluran pelaporan anonim yang aman sehingga warga dapat melaporkan praktik politik uang tanpa takut diintimidasi.",
  },
  {
    id: 3,
    title: "Hak-hak Warga dalam Pemilihan Umum",
    excerpt:
      "Setiap warga negara Indonesia memiliki hak-hak dasar dalam pemilihan umum. Kenali hak Anda untuk berpartisipasi secara aktif.",
    category: "Hak Pilih",
    date: "20 Jun 2026",
    readTime: "4 menit",
    icon: IconScale,
    content:
      "Setiap warga negara Indonesia memiliki hak-hak dasar dalam pemilihan umum yang dilindungi oleh undang-undang. Hak-hak tersebut meliputi: hak memilih secara bebas tanpa tekanan, hak untuk mencalonkan diri sebagai kandidat, hak mendapatkan informasi yang jelas tentang kandidat, hak merasa aman saat menggunakan hak pilih, hak kerahasiaan pilihan, dan hak mengajukan keberatan jika terjadi pelanggaran. Mengenal hak-hak ini sangat penting agar warga dapat berpartisipasi secara aktif dan bertanggung jawab dalam setiap proses pemilihan.",
  },
  {
    id: 4,
    title: "Cara Kerja Enkripsi dalam E-Voting",
    excerpt:
      "Bagaimana teknologi enkripsi melindungi suara Anda dari manipulasi dan menjaga kerahasiaan pilihan Anda.",
    category: "Teknologi",
    date: "18 Jun 2026",
    readTime: "6 menit",
    icon: IconShield,
    content:
      "Enkripsi adalah teknologi keamanan yang mengubah data menjadi kode yang tidak dapat dibaca oleh pihak yang tidak berwenang. Dalam sistem e-voting, setiap suara yang diberikan oleh pemilih akan dienkripsi sebelum dikirim ke server. Proses ini memastikan bahwa tidak ada pihak yang dapat mengetahui pilihan pemilih, termasuk administrator sistem. Teknologi blockchain juga digunakan untuk mencatat setiap transaksi suara secara permanen dan tidak dapat diubah. Dengan kombinasi enkripsi dan blockchain, integritas dan kerahasiaan pemungutan suara dapat terjamin sepenuhnya.",
  },
  {
    id: 5,
    title: "Partisipasi Warga: Kunci Demokrasi yang Sehat",
    excerpt:
      "Partisipasi aktif warga adalah fondasi demokrasi. Pelajari cara berkontribusi secara positif di desa Anda.",
    category: "Partisipasi",
    date: "15 Jun 2026",
    readTime: "5 menit",
    icon: IconUsers,
    content:
      "Partisipasi aktif warga merupakan fondasi utama demokrasi yang sehat. Partisipasi tidak hanya berarti hadir memberikan suara saat pemilihan, tetapi juga aktif dalam memberikan masukan, mengawasi jalannya pemerintahan, dan melaporkan segala bentuk pelanggaran. Di tingkat desa, partisipasi warga sangat penting karena langsung mempengaruhi kebijakan yang berdampak pada kehidupan sehari-hari. Melalui platform Azelina.id, warga dapat berpartisipasi dengan lebih mudah melalui e-voting dan saluran aspirasi anonim yang aman.",
  },
  {
    id: 6,
    title: "Memahami Surat Suara Digital",
    excerpt:
      "Panduan lengkap tentang cara membaca dan menggunakan surat suara digital dalam sistem e-voting kami.",
    category: "Panduan",
    date: "12 Jun 2026",
    readTime: "3 menit",
    icon: IconFileText,
    content:
      "Surat suara digital dalam sistem e-voting dirancang untuk kemudahan penggunaan. Setiap pemilih akan melihat daftar kandidat lengkap dengan foto, nama, visi, misi, dan program kerja. Untuk memberikan suara, cukup klik pada kandidat pilihan Anda. Setelah memilih, sistem akan menampilkan konfirmasi untuk memastikan pilihan sudah benar. Setelah dikonfirmasi, suara Anda akan terenkripsi dan tidak dapat diubah. Fitur ini dirancang agar semua kalangan dapat dengan mudah menggunakan hak demokrasi mereka tanpa kendala teknis.",
  },
];

// === Data hak pilih warga ===
const voterRights = [
  {
    title: "Hak Memilih",
    description:
      "Setiap warga yang telah memenuhi syarat memiliki hak untuk memilih secara bebas tanpa tekanan.",
    icon: IconClipboardList,
    content:
      "Hak memilih adalah hak konstitusional setiap warga negara Indonesia yang telah memenuhi syarat. Hak ini menjamin bahwa setiap pemilih dapat menentukan pilihannya secara bebas, tanpa paksaan, ancaman, atau tekanan dari pihak manapun.",
  },
  {
    title: "Hak Dipilih",
    description:
      "Setiap warga berhak untuk mencalonkan diri sebagai kandidat dalam pemilihan.",
    icon: IconUser,
    content:
      "Hak dipilih adalah hak setiap warga negara untuk mencalonkan diri sebagai kandidat dalam pemilihan umum. Hak ini merupakan bagian penting dari demokrasi karena memberikan kesempatan kepada semua warga untuk berkontribusi dalam pemerintahan.",
  },
  {
    title: "Hak Informasi",
    description:
      "Warga berhak mendapatkan informasi yang jelas dan lengkap tentang kandidat dan proses pemilihan.",
    icon: IconBook,
    content:
      "Hak informasi menjamin bahwa setiap warga berhak mendapatkan akses terhadap informasi yang akurat, jelas, dan lengkap mengenai seluruh aspek pemilihan. Ini termasuk informasi tentang profil kandidat, visi dan misi, program kerja, serta tata cara pemungutan suara.",
  },
  {
    title: "Hak Keamanan",
    description:
      "Warga berhak merasa aman saat menggunakan hak pilihnya tanpa ancaman atau kekerasan.",
    icon: IconShield,
    content:
      "Hak keamanan menjamin bahwa setiap warga dapat menjalankan hak demokrasinya dalam kondisi yang aman dan tanpa rasa takut. Hak ini melindungi warga dari segala bentuk ancaman, kekerasan, intimidasi, atau tindakan lain yang dapat mengganggu kebebasan dalam memberikan suara.",
  },
  {
    title: "Hak Kerahasiaan",
    description:
      "Pilihan warga harus dijaga kerahasiaannya. Tidak ada yang boleh mengetahui pilihan Anda.",
    icon: IconCircleCheck,
    content:
      "Hak kerahasiaan menjamin bahwa pilihan setiap pemilih harus dijaga kerahasiaannya. Tidak ada pihak yang boleh mengetahui pilihan seseorang, baik sebelum, saat, maupun setelah pemungutan suara.",
  },
  {
    title: "Hak Keberatan",
    description:
      "Warga berhak mengajukan keberatan jika terjadi pelanggaran dalam proses pemilihan.",
    icon: IconScale,
    content:
      "Hak keberatan memberikan hak kepada setiap warga untuk menyampaikan keberatan jika mengetahui adanya pelanggaran dalam proses pemilihan. Keberatan ini dapat diajukan terkait berbagai hal seperti praktik politik uang, intimidasi terhadap pemilih, kecurangan dalam penghitungan suara.",
  },
];

// === Langkah-langkah cara kerja ===
const howItWorks = [
  {
    step: 1,
    title: "Registrasi Akun",
    description:
      "Buat akun Azelina.id dengan data diri yang valid. Verifikasi identitas dilakukan melalui sistem yang aman.",
  },
  {
    step: 2,
    title: "Verifikasi Warga",
    description:
      "Sistem akan memverifikasi bahwa Anda adalah warga desa yang terdaftar dalam Daftar Pemilih Tetap (DPT).",
  },
  {
    step: 3,
    title: "Pelajari Kandidat",
    description:
      "Baca profil, visi, misi, dan program setiap kandidat yang tersedia di platform kami.",
  },
  {
    step: 4,
    title: "Gunakan Hak Suara",
    description:
      "Pilih kandidat Anda secara aman. Suara Anda terenkripsi dan tidak dapat dilacak ke identitas Anda.",
  },
  {
    step: 5,
    title: "Pantau Hasil",
    description:
      "Lihat hasil pemungutan suara secara real-time dan transparan melalui dashboard publik.",
  },
];

// === Pertanyaan yang sering ditanyakan ===
const faqs = [
  {
    question: "Apakah e-voting ini aman dari kecurangan?",
    answer:
      "Ya, sistem kami menggunakan enkripsi end-to-end dan teknologi blockchain untuk memastikan setiap suara tercatat secara permanen dan tidak dapat dimanipulasi.",
  },
  {
    question: "Bagaimana cara kerja anonimitas dalam platform ini?",
    answer:
      "Setiap suara dienkripsi sebelum dikirim ke server. Sistem kami memisahkan identitas pemilih dari suara yang diberikan menggunakan teknologi zero-knowledge proof.",
  },
  {
    question: "Apakah saya bisa mengubah pilihan saya setelah memberikan suara?",
    answer:
      "Tidak, setelah suara dikonfirmasi dan terenkripsi, pilihan tidak dapat diubah. Ini untuk mencegah manipulasi dan memastikan integritas pemungutan suara.",
  },
  {
    question: "Bagaimana jika saya mengalami kendala teknis saat voting?",
    answer:
      "Tim support kami siap membantu Anda 24/7. Anda dapat menghubungi kami melalui hotline 0800-1234-5678 atau email support@Azelina.id.",
  },
  {
    question: "Apakah data saya aman di platform ini?",
    answer:
      "Ya, kami menggunakan standar keamanan tertinggi. Semua data dienkripsi baik saat transit maupun saat disimpan (at rest).",
  },
  {
    question: "Bagaimana cara saya mendaftar sebagai pemilih?",
    answer:
      "Kunjungi halaman Login, pilih 'Akses Warga', lalu klik 'Registrasi'. Isi data diri Anda lengkap dengan NIK dan nomor KK.",
  },
  {
    question: "Apakah bisa menggunakan platform ini dari HP?",
    answer:
      "Tentu bisa! Platform kami dirancang responsive dan dapat diakses dari perangkat apapun - komputer, tablet, atau smartphone.",
  },
  {
    question: "Bagaimana jika saya tidak memiliki akses internet?",
    answer:
      "Kami menyediakan pojok internet gratis di Kantor Desa selama masa pemungutan suara. Anda juga bisa meminta bantu petugas desa.",
  },
];

// Halaman edukasi publik
export default function EdukasiPage() {
  const [selectedArticle, setSelectedArticle] = useState<
    (typeof articles)[0] | null
  >(null);
  const [selectedRight, setSelectedRight] = useState<
    (typeof voterRights)[0] | null
  >(null);

  return (
    <div className="flex flex-col min-h-screen">
      {/* === Hero Section === */}
      <section className="relative overflow-hidden min-h-[400px] lg:min-h-[480px]">
        <Image
          src="/gambar2.png"
          alt="Edukasi Publik"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-black/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <IconBook className="w-4 h-4" />
              Edukasi Publik
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Waspada & Cerdas{" "}
              <span className="text-white/90">Berdemokrasi</span>
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl leading-relaxed text-justify">
              Demokrasi yang sehat berawal dari masyarakat yang cerdas, di sini
              anda dapat mempelajari dan memahami tata cara pelaporan dan
              e-voting yang aman, serta mengenali bahaya dari praktik politik
              uang untuk demokrasi desa yang lebih baik.
            </p>
          </div>
        </div>
      </section>

      {/* === Navigasi section sticky === */}
      <section className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto gap-2 py-3" aria-label="Edukasi">
            {[
              { href: "#artikel", icon: IconBook, label: "Artikel" },
              { href: "#hak-pilih", icon: IconShield, label: "Hak Pilih Warga" },
              { href: "#cara-kerja", icon: IconClipboardList, label: "Cara Kerja" },
              { href: "#faq", icon: IconHelp, label: "FAQ" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-primary bg-accent-light border border-amber-300 hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg hover:shadow-primary/30 transition-all whitespace-nowrap"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* === Section Artikel === */}
      <section id="artikel" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h3 className="text-3xl font-bold text-foreground mb-3">
              Artikel Terbaru
            </h3>
            <p className="text-muted-foreground">
              Informasi dan panduan seputar demokrasi desa dan e-voting
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group bg-white rounded-xl p-6 border border-border hover:border-accent hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-4">
                  <article.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-accent-light text-primary border-0 hover:bg-accent-light">
                    {article.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <IconClock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2">
                  {article.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{article.date}</span>
                  <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary flex items-center gap-1 transition-colors">
                    Baca
                    <IconArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* === Section Hak Pilih Warga === */}
      <section id="hak-pilih" className="py-20 bg-accent-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-primary tracking-wider uppercase mb-2 block">
              Hak Konstitusional
            </span>
            <h3 className="text-3xl font-bold text-foreground mb-3">
              Hak Pilih Warga
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kenali hak-hak Anda sebagai warga negara dalam pemilihan umum.
              Hak ini dilindungi oleh undang-undang.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {voterRights.map((right) => (
              <div
                key={right.title}
                className="group bg-white rounded-xl p-6 border border-border hover:border-accent hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedRight(right)}
              >
                <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-4">
                  <right.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2">
                  {right.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {right.description}
                </p>
                <div className="flex items-center justify-end">
                  <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary flex items-center gap-1 transition-colors">
                    Baca
                    <IconArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Section Cara Kerja === */}
      <section id="cara-kerja" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-primary tracking-wider uppercase mb-2 block">
              Panduan Lengkap
            </span>
            <h3 className="text-3xl font-bold text-foreground mb-3">
              Cara Kerja Azelina.id
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ikuti langkah-langkah berikut untuk menggunakan hak demokrasi
              Anda melalui platform kami
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {howItWorks.map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="step-number">{item.step}</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-border flex-1">
                    <h4 className="text-lg font-bold text-foreground mb-2">
                      {item.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === Section FAQ === */}
      <section id="faq" className="py-20 bg-accent-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-primary tracking-wider uppercase mb-2 block">
              Pertanyaan Umum
            </span>
            <h3 className="text-3xl font-bold text-foreground mb-3">FAQ</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Temukan jawaban atas pertanyaan yang sering ditanyakan tentang
              platform Azelina.id
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-white rounded-xl border border-border overflow-hidden px-5"
                >
                  <AccordionTrigger className="text-base font-semibold text-foreground hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* === CTA Section === */}
      <section className="py-20 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              Siap Berpartisipasi?
            </h3>
            <p className="text-white/90 mb-8 text-lg">
              Setelah memahami hak dan cara kerja kami, saatnya gunakan hak
              demokrasi Anda secara aman dan anonim.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl text-base font-bold hover:bg-white/90 transition-colors shadow-lg"
            >
              Masuk & Gunakan Hak Suara
              <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* === Modal: Detail Artikel === */}
      <Dialog
        open={!!selectedArticle}
        onOpenChange={(open) => !open && setSelectedArticle(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {selectedArticle && (
                <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
                  <selectedArticle.icon className="w-5 h-5 text-primary" />
                </div>
              )}
              <Badge className="bg-accent-light text-primary border-0 hover:bg-accent-light">
                {selectedArticle?.category}
              </Badge>
            </div>
            <DialogTitle className="mt-2">
              {selectedArticle?.title}
            </DialogTitle>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <IconClock className="w-3 h-3" />
                {selectedArticle?.readTime}
              </span>
              <span>{selectedArticle?.date}</span>
            </div>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(80vh-180px)]">
            <p className="text-muted-foreground leading-relaxed text-justify">
              {selectedArticle?.content}
            </p>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* === Modal: Detail Hak Pilih === */}
      <Dialog
        open={!!selectedRight}
        onOpenChange={(open) => !open && setSelectedRight(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {selectedRight && (
                <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
                  <selectedRight.icon className="w-5 h-5 text-primary" />
                </div>
              )}
              <Badge className="bg-accent-light text-primary border-0 hover:bg-accent-light">
                Hak Konstitusional
              </Badge>
            </div>
            <DialogTitle className="mt-2">
              {selectedRight?.title}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(80vh-180px)]">
            <p className="text-muted-foreground leading-relaxed text-justify">
              {selectedRight?.content}
            </p>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
