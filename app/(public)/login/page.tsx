"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import {
  IconShield,
  IconUser,
  IconLock,
  IconEye,
  IconEyeOff,
  IconArrowRight,
  IconUsers,
  IconSettings,
  IconMail,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// === Schema validasi Zod untuk form login warga ===
const wargaLoginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password harus diisi"),
});

// === Schema validasi Zod untuk form registrasi warga ===
const wargaRegisterSchema = z
  .object({
    namaLengkap: z.string().min(2, "Nama harus minimal 2 karakter"),
    nik: z.string().length(16, "NIK harus 16 digit"),
    email: z.string().email("Email tidak valid"),
    telepon: z.string().min(10, "Nomor telepon tidak valid"),
    alamat: z.string().min(5, "Alamat harus diisi"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

// === Schema validasi Zod untuk form login admin ===
const adminLoginSchema = z.object({
  email: z.string().min(1, "Email/Username harus diisi"),
  password: z.string().min(1, "Password harus diisi"),
});

type TabType = "warga" | "admin";
type ModeType = "login" | "register";

// Halaman login & registrasi
export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<TabType>("warga");
  const [mode, setMode] = useState<ModeType>("login");
  const [showPassword, setShowPassword] = useState(false);

  // State form warga login
  const [wargaEmail, setWargaEmail] = useState("");
  const [wargaPassword, setWargaPassword] = useState("");

  // State form admin login
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // Validasi form
  const isWargaFormValid = wargaEmail.length > 0 && wargaPassword.length > 0;
  const isAdminFormValid = adminEmail.length > 0 && adminPassword.length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* === Hero Section: header gradient === */}
      <section className="hero-gradient relative overflow-hidden min-h-[400px] lg:min-h-[480px]">
        <div className="absolute inset-0 bg-black/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-black/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <IconLock className="w-4 h-4" />
              Akses Terjamin
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Masuk ke{" "}
              <span className="text-white/90">Azelina.id</span>
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-xl leading-relaxed">
              Akses platform e-voting dan aspirasi anonim. Pilih jenis akses
              sesuai dengan peran Anda.
            </p>
          </div>
        </div>
      </section>

      {/* === Form Section: tab selector + form === */}
      <section className="py-16 bg-accent-light/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Selector: Warga vs Admin */}
          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              setActiveTab(v as TabType);
              setMode("login");
            }}
            className="mb-8"
          >
            <TabsList className="bg-white p-1.5 shadow-sm border border-border h-auto w-full">
              <TabsTrigger
                value="warga"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold data-[state=active]:tab-active data-[state=active]:shadow-md"
              >
                <IconUsers className="w-4 h-4" />
                Akses Warga
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold data-[state=active]:tab-active data-[state=active]:shadow-md"
              >
                <IconSettings className="w-4 h-4" />
                Akses Admin / Petugas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="warga">
              {/* Mode Toggle: Masuk vs Registrasi */}
              {activeTab === "warga" && (
                <div className="flex justify-center gap-4 mb-8">
                  <Button
                    variant={mode === "login" ? "default" : "outline"}
                    onClick={() => setMode("login")}
                    className={
                      mode === "login"
                        ? "bg-primary text-white shadow-sm"
                        : "bg-white text-muted-foreground border border-border hover:border-accent"
                    }
                  >
                    Masuk
                  </Button>
                  <Button
                    variant={mode === "register" ? "default" : "outline"}
                    onClick={() => setMode("register")}
                    className={
                      mode === "register"
                        ? "bg-primary text-white shadow-sm"
                        : "bg-white text-muted-foreground border border-border hover:border-accent"
                    }
                  >
                    Registrasi
                  </Button>
                </div>
              )}

              {/* === Form Login Warga === */}
              {mode === "login" && (
                <Card className="bg-white max-w-md mx-auto shadow-lg border-border">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-accent-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <IconUser className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">
                        Masuk sebagai Warga
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Gunakan akun warga Anda untuk mengakses platform
                      </p>
                    </div>

                    <form className="space-y-5">
                      {/* Field email */}
                      <div>
                        <Label className="mb-2">Email</Label>
                        <div className="relative">
                          <Input
                            type="email"
                            placeholder="Masukkan email Anda"
                            value={wargaEmail}
                            onChange={(e) => setWargaEmail(e.target.value)}
                            className="input-focus"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <IconMail className="w-5 h-5 text-muted-foreground/40" />
                          </div>
                        </div>
                      </div>

                      {/* Field password */}
                      <div>
                        <Label className="mb-2">Password</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Masukkan password Anda"
                            value={wargaPassword}
                            onChange={(e) => setWargaPassword(e.target.value)}
                            className="input-focus"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground"
                          >
                            {showPassword ? (
                              <IconEyeOff className="w-5 h-5" />
                            ) : (
                              <IconEye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Ingat saya & lupa password */}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox />
                          <span className="text-sm text-muted-foreground">
                            Ingat saya
                          </span>
                        </label>
                        <a
                          href="#"
                          className="text-sm text-primary hover:text-primary-dark font-medium"
                        >
                          Lupa password?
                        </a>
                      </div>

                      {/* Tombol masuk */}
                      <Link
                        href="/dashboard"
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors shadow-sm ${
                          isWargaFormValid
                            ? "bg-primary text-white hover:bg-primary-dark"
                            : "bg-muted/30 text-muted-foreground/60 cursor-not-allowed pointer-events-none"
                        }`}
                      >
                        Masuk
                        <IconArrowRight className="w-4 h-4" />
                      </Link>
                    </form>

                    {/* Divider "atau" */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white text-muted-foreground">atau</span>
                      </div>
                    </div>

                    {/* Tombol Google Login */}
                    <a
                      href="/dashboard"
                      className="w-full flex items-center justify-center gap-3 bg-white border-2 border-border py-3 rounded-xl font-semibold text-foreground hover:bg-accent-light/30 hover:border-accent transition-all shadow-sm"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Masuk dengan Google
                    </a>

                    {/* Link registrasi */}
                    <div className="mt-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        Belum punya akun?{" "}
                        <button
                          onClick={() => setMode("register")}
                          className="text-primary hover:text-primary-dark font-semibold"
                        >
                          Registrasi sekarang
                        </button>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* === Form Registrasi Warga === */}
              {mode === "register" && (
                <Card className="bg-white max-w-lg mx-auto shadow-lg border-border">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-accent-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <IconUser className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">
                        Registrasi Warga
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Buat akun untuk menggunakan hak demokrasi Anda
                      </p>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const userData = {
                          nama: formData.get("namaLengkap") || "Warga Baru",
                          email: formData.get("email") || "",
                          telepon: formData.get("telepon") || "",
                          alamat: formData.get("alamat") || "",
                          nik: formData.get("nik") || "",
                          desa: formData.get("desa") || "Desa Batu Ampar",
                        };
                        localStorage.setItem("registrasi_user", JSON.stringify(userData));
                        window.location.href = "/dashboard";
                      }}
                      className="space-y-5"
                    >
                      {/* Baris nama & NIK */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="mb-2">Nama Lengkap</Label>
                          <Input
                            name="namaLengkap"
                            placeholder="Nama sesuai KTP"
                            className="input-focus"
                          />
                        </div>
                        <div>
                          <Label className="mb-2">NIK</Label>
                          <Input
                            name="nik"
                            placeholder="16 digit NIK"
                            className="input-focus"
                          />
                        </div>
                      </div>

                      {/* Field email */}
                      <div>
                        <Label className="mb-2">Email</Label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="email@contoh.com"
                          className="input-focus"
                        />
                      </div>

                      {/* Field telepon */}
                      <div>
                        <Label className="mb-2">Nomor Telepon</Label>
                        <Input
                          name="telepon"
                          type="tel"
                          placeholder="08xxxxxxxxxx"
                          className="input-focus"
                        />
                      </div>

                      {/* Field desa */}
                      <div>
                        <Label className="mb-2">Desa</Label>
                        <select
                          name="desa"
                          className="w-full px-4 py-3 rounded-xl border border-border text-foreground focus:outline-none input-focus"
                          defaultValue=""
                          required
                        >
                          <option value="" disabled>Pilih desa Anda</option>
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
                      </div>

                      {/* Field alamat */}
                      <div>
                        <Label className="mb-2">Alamat</Label>
                        <Input
                          name="alamat"
                          placeholder="Alamat sesuai KTP"
                          className="input-focus"
                        />
                      </div>

                      {/* Field password */}
                      <div>
                        <Label className="mb-2">Password</Label>
                        <div className="relative">
                          <Input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Buat password yang kuat"
                            className="input-focus"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground"
                          >
                            {showPassword ? (
                              <IconEyeOff className="w-5 h-5" />
                            ) : (
                              <IconEye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Field konfirmasi password */}
                      <div>
                        <Label className="mb-2">Konfirmasi Password</Label>
                        <Input
                          name="confirmPassword"
                          type="password"
                          placeholder="Ulangi password"
                          className="input-focus"
                        />
                      </div>

                      {/* Persetujuan syarat & ketentuan */}
                      <div className="flex items-start gap-2">
                        <Checkbox className="mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          Saya menyetujui{" "}
                          <a
                            href="#"
                            className="text-primary hover:text-primary-dark font-medium"
                          >
                            Syarat & Ketentuan
                          </a>{" "}
                          dan{" "}
                          <a
                            href="#"
                            className="text-primary hover:text-primary-dark font-medium"
                          >
                            Kebijakan Privasi
                          </a>
                        </span>
                      </div>

                      {/* Tombol daftar */}
                      <Button
                        type="submit"
                        className="w-full bg-primary text-white hover:bg-primary-dark shadow-sm"
                      >
                        Daftar Sekarang
                        <IconArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>

                    <div className="mt-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        Sudah punya akun?{" "}
                        <button
                          onClick={() => setMode("login")}
                          className="text-primary hover:text-primary-dark font-semibold"
                        >
                          Masuk sekarang
                        </button>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="admin">
              {/* === Form Login Admin === */}
              <Card className="bg-white max-w-md mx-auto shadow-lg border-border">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-accent-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <IconSettings className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      Masuk sebagai Admin/Petugas
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Gunakan akun administrator atau petugas
                    </p>
                  </div>

                  <form className="space-y-5">
                    {/* Field email/username admin */}
                    <div>
                      <Label className="mb-2">Email / Username</Label>
                      <div className="relative">
                        <Input
                          type="email"
                          placeholder="Masukkan email atau username"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          className="input-focus"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <IconMail className="w-5 h-5 text-muted-foreground/40" />
                        </div>
                      </div>
                    </div>

                    {/* Field password admin */}
                    <div>
                      <Label className="mb-2">Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Masukkan password Anda"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="input-focus"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground"
                        >
                          {showPassword ? (
                            <IconEyeOff className="w-5 h-5" />
                          ) : (
                            <IconEye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Ingat saya & lupa password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox />
                        <span className="text-sm text-muted-foreground">
                          Ingat saya
                        </span>
                      </label>
                      <a
                        href="#"
                        className="text-sm text-primary hover:text-primary-dark font-medium"
                      >
                        Lupa password?
                      </a>
                    </div>

                    {/* Tombol masuk admin */}
                    <Link
                      href="/admin/dashboard"
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors shadow-sm ${
                        isAdminFormValid
                          ? "bg-primary text-white hover:bg-primary-dark"
                          : "bg-muted/30 text-muted-foreground/60 cursor-not-allowed pointer-events-none"
                      }`}
                    >
                      Masuk
                      <IconArrowRight className="w-4 h-4" />
                    </Link>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Akun admin hanya bisa dibuat oleh database
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* === Info Cards: keamanan & anonimitas === */}
          <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-2xl mx-auto">
            {[
              {
                icon: IconShield,
                title: "Keamanan Terjamin",
                desc: "Semua data Anda dilindungi dengan enkripsi end-to-end. Identitas Anda tidak akan pernah terungkap.",
              },
              {
                icon: IconLock,
                title: "Anonimitas Penuh",
                desc: "Suara Anda tidak dapat dilacak. Sistem zero-knowledge memastikan kerahasiaan pilihan Anda.",
              },
            ].map((item) => (
              <Card key={item.title} className="bg-white border-border">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
