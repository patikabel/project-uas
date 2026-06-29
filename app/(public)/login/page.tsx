"use client";

import { useState } from "react";
import {
  Shield,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Users,
  Settings,
  Mail,
  IdCard,
} from "lucide-react";

type TabType = "warga" | "admin";
type ModeType = "login" | "register";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<TabType>("warga");
  const [mode, setMode] = useState<ModeType>("login");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-black/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Lock className="w-4 h-4" />
              Akses Terjamin
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Masuk ke{" "}
              <span className="text-white/90">Azelina.id</span>
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-xl leading-relaxed">
              Akses platform e-voting dan aspirasi anonim. Pilih jenis akses sesuai dengan peran Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="py-16 bg-accent-light/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Selector */}
          <div className="flex bg-white rounded-xl p-1.5 shadow-sm border border-border mb-8">
            <button
              onClick={() => setActiveTab("warga")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "warga"
                  ? "tab-active shadow-md"
                  : "text-muted hover:text-foreground hover:bg-accent-light/50"
              }`}
            >
              <Users className="w-4 h-4" />
              Akses Warga
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "admin"
                  ? "tab-active shadow-md"
                  : "text-muted hover:text-foreground hover:bg-accent-light/50"
              }`}
            >
              <Settings className="w-4 h-4" />
              Akses Admin / Petugas
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setMode("login")}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                mode === "login"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-muted border border-border hover:border-accent"
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => setMode("register")}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                mode === "register"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-muted border border-border hover:border-accent"
              }`}
            >
              Registrasi
            </button>
          </div>

          {/* Login Form */}
          {mode === "login" && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-border max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-accent-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {activeTab === "warga" ? (
                    <User className="w-8 h-8 text-primary" />
                  ) : (
                    <Settings className="w-8 h-8 text-primary" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {activeTab === "warga" ? "Masuk sebagai Warga" : "Masuk sebagai Admin/Petugas"}
                </h3>
                <p className="text-sm text-muted mt-1">
                  {activeTab === "warga"
                    ? "Gunakan akun warga Anda untuk mengakses platform"
                    : "Gunakan akun administrator atau petugas"}
                </p>
              </div>

              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {activeTab === "warga" ? "NIK / Nomor Induk Kependudukan" : "Email / Username"}
                  </label>
                  <div className="relative">
                    <input
                      type={activeTab === "warga" ? "text" : "email"}
                      placeholder={activeTab === "warga" ? "Masukkan NIK Anda" : "Masukkan email atau username"}
                      className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {activeTab === "warga" ? (
                        <IdCard className="w-5 h-5 text-muted/40" />
                      ) : (
                        <Mail className="w-5 h-5 text-muted/40" />
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password Anda"
                      className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/40 hover:text-muted"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                    <span className="text-sm text-muted">Ingat saya</span>
                  </label>
                  <a href="#" className="text-sm text-primary hover:text-primary-dark font-medium">
                    Lupa password?
                  </a>
                </div>

                <a
                  href={activeTab === "admin" ? "/admin/dashboard" : "/dashboard"}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                >
                  Masuk
                  <ArrowRight className="w-4 h-4" />
                </a>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted">
                  Belum punya akun?{" "}
                  <button onClick={() => setMode("register")} className="text-primary hover:text-primary-dark font-semibold">
                    Registrasi sekarang
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Registration Form */}
          {mode === "register" && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-border max-w-lg mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-accent-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {activeTab === "warga" ? (
                    <User className="w-8 h-8 text-primary" />
                  ) : (
                    <Settings className="w-8 h-8 text-primary" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {activeTab === "warga" ? "Registrasi Warga" : "Registrasi Admin/Petugas"}
                </h3>
                <p className="text-sm text-muted mt-1">
                  {activeTab === "warga"
                    ? "Buat akun untuk menggunakan hak demokrasi Anda"
                    : "Daftar sebagai administrator atau petugas desa"}
                </p>
              </div>

              <form className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      placeholder="Nama sesuai KTP"
                      className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {activeTab === "warga" ? "NIK" : "NIP / NIK"}
                    </label>
                    <input
                      type="text"
                      placeholder={activeTab === "warga" ? "16 digit NIK" : "Nomor Induk Pegawai"}
                      className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="email@contoh.com"
                    className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nomor Telepon</label>
                  <input
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Alamat</label>
                  <input
                    type="text"
                    placeholder="Alamat sesuai KTP"
                    className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus"
                  />
                </div>

                {activeTab === "admin" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Jabatan</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-border text-foreground focus:outline-none input-focus">
                      <option value="">Pilih jabatan</option>
                      <option value="kepala_desa">Kepala Desa</option>
                      <option value="sekretaris">Sekretaris Desa</option>
                      <option value="bendahara">Bendahara Desa</option>
                      <option value="kasi">Kepala Seksi</option>
                      <option value="kaur">Kepala Urusan</option>
                      <option value="rt">Ketua RT</option>
                      <option value="rw">Ketua RW</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Buat password yang kuat"
                      className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/40 hover:text-muted"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Konfirmasi Password</label>
                  <input
                    type="password"
                    placeholder="Ulangi password"
                    className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus"
                  />
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary mt-0.5"
                  />
                  <span className="text-sm text-muted">
                    Saya menyetujui{" "}
                    <a href="#" className="text-primary hover:text-primary-dark font-medium">
                      Syarat & Ketentuan
                    </a>{" "}
                    dan{" "}
                    <a href="#" className="text-primary hover:text-primary-dark font-medium">
                      Kebijakan Privasi
                    </a>
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                >
                  Daftar Sekarang
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted">
                  Sudah punya akun?{" "}
                  <button onClick={() => setMode("login")} className="text-primary hover:text-primary-dark font-semibold">
                    Masuk sekarang
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Keamanan Terjamin</h4>
                  <p className="text-sm text-muted">
                    Semua data Anda dilindungi dengan enkripsi end-to-end. Identitas Anda tidak akan pernah terungkap.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Anonimitas Penuh</h4>
                  <p className="text-sm text-muted">
                    Suara Anda tidak dapat dilacak. Sistem zero-knowledge memastikan kerahasiaan pilihan Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
