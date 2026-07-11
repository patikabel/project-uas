import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

// Konfigurasi font global
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
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

// Metadata SEO
export const metadata: Metadata = {
  title: "Azelina.id - Platform E-Voting & Aspirasi Anonim",
  description:
    "Platform digital untuk e-voting dan aspirasi anonim dalam mitigasi politik uang di tingkat desa. Suara Anda aman dan terjamin kerahasiaannya.",
};

// Root layout: membungkus seluruh halaman
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn(
        "h-full",
        "antialiased",
        plusJakarta.variable,
        jetbrainsMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
