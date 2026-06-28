import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import Link from "next/link";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Azelina.id - Platform E-Voting & Aspirasi Anonim",
  description:
    "Platform digital untuk e-voting dan aspirasi anonim dalam mitigasi politik uang di tingkat desa. Suara Anda aman dan terjamin kerahasiaannya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo-zibel.jpeg" alt="Azelina.id Logo" width={40} height={40} className="w-10 h-10 rounded-xl object-cover shadow-sm hover:scale-110 transition-transform cursor-pointer" />
                <div>
                  <h1 className="text-lg font-bold text-foreground leading-tight">Azelina.id</h1>
                  <p className="text-xs text-muted">E-Voting & Aspirasi Anonim</p>
                </div>
              </Link>
              <nav className="hidden md:flex items-center gap-8">
                <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Beranda
                </Link>
                <Link href="/edukasi" className="text-sm font-medium text-muted hover:text-primary transition-colors">
                  Edukasi Publik
                </Link>
              </nav>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Masuk
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="footer-gradient text-white py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-10">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <Image src="/logo-zibel.jpeg" alt="Azelina.id Logo" width={40} height={40} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-lg font-bold">Azelina.id</h4>
                    <p className="text-xs text-white/60">E-Voting & Aspirasi Anonim</p>
                  </div>
                </div>
                <p className="text-sm text-white/70 leading-relaxed max-w-md">
                  Platform digital untuk e-voting dan aspirasi anonim dalam mitigasi politik uang di tingkat desa. Suara Anda
                  aman dan terjamin kerahasiaannya.
                </p>
              </div>
              <div>
                <h5 className="font-semibold mb-4">Tautan</h5>
                <ul className="space-y-2.5 text-sm text-white/70">
                  <li>
                    <Link href="/" className="hover:text-white transition-colors">
                      Beranda
                    </Link>
                  </li>
                  <li>
                    <Link href="/edukasi" className="hover:text-white transition-colors">
                      Edukasi Publik
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-4">Kontak</h5>
                <ul className="space-y-3 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>azelinaid@gmail.com</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div className="flex flex-col">
                      <span>089608574922 (Abel)</span>
                      <span>082295484382 (Zihan)</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Jl. Al-Falah Dahor 2</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 mt-10 pt-8 text-center text-sm text-white/50">
              &copy; 2026 Azelina.id. Hak Cipta Dilindungi.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
