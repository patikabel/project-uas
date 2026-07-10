import Image from "next/image";
import Link from "next/link";
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconLogin,
} from "@tabler/icons-react";
import ScrollToTop from "./scroll-to-top";

// Layout publik: header navigasi + footer
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* === Header navigasi sticky === */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & brand */}
            <ScrollToTop className="flex items-center gap-3">
              <Image
                src="/logo-zibel.jpeg"
                alt="Azelina.id Logo"
                width={40}
                height={40}
                className="w-10 h-10 rounded-xl object-cover shadow-sm border-[2.5px] border-amber-400 hover:scale-110 transition-transform cursor-pointer"
              />
              <div>
                <h1 className="text-lg font-bold text-foreground leading-tight">
                  Azelina.id
                </h1>
                <p className="text-xs text-muted-foreground">
                  E-Voting & Aspirasi Anonim
                </p>
              </div>
            </ScrollToTop>

            {/* Navigasi desktop */}
            <nav className="hidden md:flex items-center gap-3">
              <Link
                href="/"
                className="text-sm font-semibold text-primary bg-accent-light border border-amber-300 px-5 py-2.5 rounded-xl hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                Beranda
              </Link>
              <Link
                href="/edukasi"
                className="text-sm font-semibold text-primary bg-accent-light border border-amber-300 px-5 py-2.5 rounded-xl hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                Edukasi Publik
              </Link>
            </nav>

            {/* Tombol masuk */}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
            >
              <IconLogin className="w-4 h-4" />
              Masuk
            </Link>
          </div>
        </div>
      </header>

      {/* === Konten utama === */}
      <main className="flex-1">{children}</main>

      {/* === Footer === */}
      <footer className="footer-gradient text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10">
            {/* Brand & deskripsi */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/logo-zibel.jpeg"
                  alt="Azelina.id Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-xl object-cover border-[2.5px] border-amber-400"
                />
                <div>
                  <h4 className="text-lg font-bold">Azelina.id</h4>
                  <p className="text-xs text-white/60">
                    E-Voting & Aspirasi Anonim
                  </p>
                </div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed max-w-md">
                Platform digital untuk e-voting dan aspirasi anonim dalam
                mitigasi politik uang di tingkat desa. Suara Anda aman dan
                terjamin kerahasiaannya.
              </p>
            </div>

            {/* Tautan navigasi */}
            <div>
              <h5 className="font-semibold mb-4">Tautan</h5>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link
                    href="/edukasi"
                    className="hover:text-white transition-colors"
                  >
                    Edukasi Publik
                  </Link>
                </li>
              </ul>
            </div>

            {/* Informasi kontak */}
            <div>
              <h5 className="font-semibold mb-4">Kontak</h5>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <IconMail className="w-4 h-4" />
                  <span>azelinaid@gmail.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconPhone className="w-4 h-4" />
                  <div className="flex flex-col">
                    <span>089608574922 (Abel)</span>
                    <span>082295484382 (Zihan)</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <IconMapPin className="w-4 h-4 mt-0.5" />
                  <span>Jl. Al-Falah Dahor 2</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Hak cipta */}
          <div className="border-t border-white/10 mt-10 pt-8 text-center text-sm text-white/50">
            &copy; 2026 Azelina.id. Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>
    </>
  );
}
