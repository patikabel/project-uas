import {
  BookOpen,
  Vote,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  Clock,
  User,
  Shield,
  CheckCircle,
  AlertTriangle,
  FileText,
  Users,
  Scale,
} from "lucide-react";

const articles = [
  {
    id: 1,
    title: "Mengapa E-Voting Penting untuk Demokrasi Desa?",
    excerpt: "E-voting memberikan solusi modern untuk meningkatkan partisipasi warga dalam pemilihan tingkat desa dengan cara yang aman dan transparan.",
    category: "E-Voting",
    date: "25 Jun 2026",
    readTime: "5 menit",
    icon: Vote,
  },
  {
    id: 2,
    title: "Mengenal Politik Uang dan Dampaknya terhadap Demokrasi",
    excerpt: "Praktik politik uang masih menjadi tantangan besar dalam demokrasi desa. Pelajari bagaimana platform kami membantu mengatasinya.",
    category: "Politik Uang",
    date: "23 Jun 2026",
    readTime: "7 menit",
    icon: AlertTriangle,
  },
  {
    id: 3,
    title: "Hak-hak Warga dalam Pemilihan Umum",
    excerpt: "Setiap warga negara Indonesia memiliki hak-hak dasar dalam pemilihan umum. Kenali hak Anda untuk berpartisipasi secara aktif.",
    category: "Hak Pilih",
    date: "20 Jun 2026",
    readTime: "4 menit",
    icon: Scale,
  },
  {
    id: 4,
    title: "Cara Kerja Enkripsi dalam E-Voting",
    excerpt: "Bagaimana teknologi enkripsi melindungi suara Anda dari manipulasi dan menjaga kerahasiaan pilihan Anda.",
    category: "Teknologi",
    date: "18 Jun 2026",
    readTime: "6 menit",
    icon: Shield,
  },
  {
    id: 5,
    title: "Partisipasi Warga: Kunci Demokrasi yang Sehat",
    excerpt: "Partisipasi aktif warga adalah fondasi demokrasi. Pelajari cara berkontribusi secara positif di desa Anda.",
    category: "Partisipasi",
    date: "15 Jun 2026",
    readTime: "5 menit",
    icon: Users,
  },
  {
    id: 6,
    title: "Memahami Surat Suara Digital",
    excerpt: "Panduan lengkap tentang cara membaca dan menggunakan surat suara digital dalam sistem e-voting kami.",
    category: "Panduan",
    date: "12 Jun 2026",
    readTime: "3 menit",
    icon: FileText,
  },
];

const voterRights = [
  {
    title: "Hak Memilih",
    description: "Setiap warga yang telah memenuhi syarat memiliki hak untuk memilih secara bebas tanpa tekanan.",
    icon: Vote,
  },
  {
    title: "Hak Dipilih",
    description: "Setiap warga berhak untuk mencalonkan diri sebagai kandidat dalam pemilihan.",
    icon: User,
  },
  {
    title: "Hak Informasi",
    description: "Warga berhak mendapatkan informasi yang jelas dan lengkap tentang kandidat dan proses pemilihan.",
    icon: BookOpen,
  },
  {
    title: "Hak Keamanan",
    description: "Warga berhak merasa aman saat menggunakan hak pilihnya tanpa ancaman atau kekerasan.",
    icon: Shield,
  },
  {
    title: "Hak Kerahasiaan",
    description: "Pilihan warga harus dijaga kerahasiaannya. Tidak ada yang boleh mengetahui pilihan Anda.",
    icon: CheckCircle,
  },
  {
    title: "Hak Keberatan",
    description: "Warga berhak mengajukan keberatan jika terjadi pelanggaran dalam proses pemilihan.",
    icon: Scale,
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Registrasi Akun",
    description: "Buat akun Azelina.id dengan data diri yang valid. Verifikasi identitas dilakukan melalui sistem yang aman.",
  },
  {
    step: 2,
    title: "Verifikasi Warga",
    description: "Sistem akan memverifikasi bahwa Anda adalah warga desa yang terdaftar dalam Daftar Pemilih Tetap (DPT).",
  },
  {
    step: 3,
    title: "Pelajari Kandidat",
    description: "Baca profil, visi, misi, dan program setiap kandidat yang tersedia di platform kami.",
  },
  {
    step: 4,
    title: "Gunakan Hak Suara",
    description: "Pilih kandidat Anda secara aman. Suara Anda terenkripsi dan tidak dapat dilacak ke identitas Anda.",
  },
  {
    step: 5,
    title: "Pantau Hasil",
    description: "Lihat hasil pemungutan suara secara real-time dan transparan melalui dashboard publik.",
  },
];

const faqs = [
  {
    question: "Apakah e-voting ini aman dari kecurangan?",
    answer:
      "Ya, sistem kami menggunakan enkripsi end-to-end dan teknologi blockchain untuk memastikan setiap suara tercatat secara permanen dan tidak dapat dimanipulasi. Selain itu, sistem zero-knowledge proof memastikan tidak ada yang dapat melacak suara ke pemilih.",
  },
  {
    question: "Bagaimana cara kerja anonimitas dalam platform ini?",
    answer:
      "Setiap suara dienkripsi sebelum dikirim ke server. Sistem kami memisahkan identitas pemilih dari suara yang diberikan menggunakan teknologi zero-knowledge proof. Bahkan administrator platform tidak dapat mengetahui siapa yang memilih siapa.",
  },
  {
    question: "Apakah saya bisa mengubah pilihan saya setelah memberikan suara?",
    answer:
      "Tidak, setelah suara dikonfirmasi dan terenkripsi, pilihan tidak dapat diubah. Ini untuk mencegah manipulasi dan memastikan integritas pemungutan suara. Pastikan pilihan Anda sudah tepat sebelum mengonfirmasi.",
  },
  {
    question: "Bagaimana jika saya mengalami kendala teknis saat voting?",
    answer:
      "Tim support kami siap membantu Anda 24/7. Anda dapat menghubungi kami melalui hotline 0800-1234-5678 atau email support@Azelina.id. Kami juga menyediakan panduan troubleshooting di halaman bantuan.",
  },
  {
    question: "Apakah data saya aman di platform ini?",
    answer:
      "Ya, kami menggunakan standar keamanan tertinggi. Semua data dienkripsi baik saat transit maupun saat disimpan (at rest). Kami juga tidak pernah menjual atau membagikan data pihak ketiga.",
  },
  {
    question: "Bagaimana cara saya mendaftar sebagai pemilih?",
    answer:
      "Kunjungi halaman Login, pilih 'Akses Warga', lalu klik 'Registrasi'. Isi data diri Anda lengkap dengan NIK dan nomor KK. Sistem akan memverifikasi data Anda dengan database kependudukan desa.",
  },
  {
    question: "Apakah bisa menggunakan platform ini dari HP?",
    answer:
      "Tentu bisa! Platform kami dirancang responsive dan dapat diakses dari perangkat apapun - komputer, tablet, atau smartphone. Cukup buka browser dan kunjungi website kami.",
  },
  {
    question: "Bagaimana jika saya tidak memiliki akses internet?",
    answer:
      "Kami menyediakan pojok internet gratis di Kantor Desa selama masa pemungutan suara. Anda juga bisa meminta bantu petugas desa untuk membantu proses voting Anda.",
  },
];

export default function EdukasiPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-black/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              Edukasi Publik
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Waspada & Cerdas{" "}
              <span className="text-white/90">Berdemokrasi</span>
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-xl leading-relaxed">
              Pelajari hak Anda sebagai warga, cara kerja e-voting, dan bagaimana melawan politik uang untuk demokrasi desa
              yang lebih baik.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto gap-2 py-3" aria-label="Edukasi">
            <a
              href="#artikel"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-primary bg-accent-light hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/30 transition-all whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" />
              Artikel
            </a>
            <a
              href="#hak-pilih"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-primary bg-accent-light hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/30 transition-all whitespace-nowrap"
            >
              <Shield className="w-4 h-4" />
              Hak Pilih Warga
            </a>
            <a
              href="#cara-kerja"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-primary bg-accent-light hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/30 transition-all whitespace-nowrap"
            >
              <Vote className="w-4 h-4" />
              Cara Kerja
            </a>
            <a
              href="#faq"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-primary bg-accent-light hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/30 transition-all whitespace-nowrap"
            >
              <HelpCircle className="w-4 h-4" />
              FAQ
            </a>
          </nav>
        </div>
      </section>

      {/* Articles Section */}
      <section id="artikel" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h3 className="text-3xl font-bold text-foreground mb-3">Artikel Terbaru</h3>
            <p className="text-muted">Informasi dan panduan seputar demokrasi desa dan e-voting</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group bg-white rounded-xl p-6 border border-border hover:border-accent hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-4">
                  <article.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs px-2.5 py-0.5 bg-accent-light text-primary rounded-full font-medium">
                    {article.category}
                  </span>
                  <span className="text-xs text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2">{article.title}</h4>
                <p className="text-sm text-muted leading-relaxed mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">{article.date}</span>
                  <span className="text-sm font-semibold text-muted group-hover:text-primary flex items-center gap-1 transition-colors">
                    Baca
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Voter Rights Section */}
      <section id="hak-pilih" className="py-20 bg-accent-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-primary tracking-wider uppercase mb-2 block">Hak Konstitusional</span>
            <h3 className="text-3xl font-bold text-foreground mb-3">Hak Pilih Warga</h3>
            <p className="text-muted max-w-2xl mx-auto">
              Kenali hak-hak Anda sebagai warga negara dalam pemilihan umum. Hak ini dilindungi oleh undang-undang.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {voterRights.map((right) => (
              <div
                key={right.title}
                className="bg-white rounded-xl p-6 border border-border hover:border-accent hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-4">
                  <right.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2">{right.title}</h4>
                <p className="text-sm text-muted leading-relaxed">{right.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="cara-kerja" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-primary tracking-wider uppercase mb-2 block">Panduan Lengkap</span>
            <h3 className="text-3xl font-bold text-foreground mb-3">Cara Kerja Azelina.id</h3>
            <p className="text-muted max-w-2xl mx-auto">
              Ikuti langkah-langkah berikut untuk menggunakan hak demokrasi Anda melalui platform kami
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
                    <h4 className="text-lg font-bold text-foreground mb-2">{item.title}</h4>
                    <p className="text-muted leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-accent-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-primary tracking-wider uppercase mb-2 block">Pertanyaan Umum</span>
            <h3 className="text-3xl font-bold text-foreground mb-3">FAQ</h3>
            <p className="text-muted max-w-2xl mx-auto">
              Temukan jawaban atas pertanyaan yang sering ditanyakan tentang platform Azelina.id
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="faq-item bg-white rounded-xl border border-border overflow-hidden group">
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none">
                  <h4 className="text-base font-semibold text-foreground">{faq.question}</h4>
                  <ChevronDown className="w-5 h-5 text-muted flex-shrink-0 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-muted leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">Siap Berpartisipasi?</h3>
            <p className="text-white/90 mb-8 text-lg">
              Setelah memahami hak dan cara kerja kami, saatnya gunakan hak demokrasi Anda secara aman dan anonim.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl text-base font-bold hover:bg-white/90 transition-colors shadow-lg"
              >
                Masuk & Gunakan Hak Suara
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
