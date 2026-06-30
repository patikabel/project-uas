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
} from "lucide-react";

type TabType = "warga" | "admin";
type ModeType = "login" | "register";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<TabType>("warga");
  const [mode, setMode] = useState<ModeType>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [wargaEmail, setWargaEmail] = useState("");
  const [wargaPassword, setWargaPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const isWargaFormValid = wargaEmail.length > 0 && wargaPassword.length > 0;
  const isAdminFormValid = adminEmail.length > 0 && adminPassword.length > 0;

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
              onClick={() => { setActiveTab("warga"); setMode("login"); }}
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
              onClick={() => { setActiveTab("admin"); setMode("login"); }}
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

          {/* Mode Toggle - Only for Warga */}
          {activeTab === "warga" && (
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
          )}

          {/* Warga Login Form */}
          {activeTab === "warga" && mode === "login" && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-border max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-accent-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Masuk sebagai Warga
                </h3>
                <p className="text-sm text-muted mt-1">
                  Gunakan akun warga Anda untuk mengakses platform
                </p>
              </div>

              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Masukkan email Anda"
                      value={wargaEmail}
                      onChange={(e) => setWargaEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Mail className="w-5 h-5 text-muted/40" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password Anda"
                      value={wargaPassword}
                      onChange={(e) => setWargaPassword(e.target.value)}
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
                  href="/dashboard"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors shadow-sm ${
                    isWargaFormValid
                      ? "bg-primary text-white hover:bg-primary-dark"
                      : "bg-muted/30 text-muted/60 cursor-not-allowed"
                  }`}
                  onClick={(e) => {
                    if (!isWargaFormValid) e.preventDefault();
                  }}
                >
                  Masuk
                  <ArrowRight className="w-4 h-4" />
                </a>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-muted">atau</span>
                </div>
              </div>

              {/* Google Login Button */}
              <a
                href="/dashboard"
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-border py-3 rounded-xl font-semibold text-foreground hover:bg-accent-light/30 hover:border-accent transition-all shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Masuk dengan Google
              </a>

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

          {/* Warga Register Form */}
          {activeTab === "warga" && mode === "register" && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-border max-w-lg mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-accent-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Registrasi Warga
                </h3>
                <p className="text-sm text-muted mt-1">
                  Buat akun untuk menggunakan hak demokrasi Anda
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
                    <label className="block text-sm font-medium text-foreground mb-2">NIK</label>
                    <input
                      type="text"
                      placeholder="16 digit NIK"
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
                    <a href="#" className="text-primary hover:text-primary-dark font-medium">Syarat & Ketentuan</a>{" "}
                    dan{" "}
                    <a href="#" className="text-primary hover:text-primary-dark font-medium">Kebijakan Privasi</a>
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

          {/* Admin Login Form */}
          {activeTab === "admin" && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-border max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-accent-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Masuk sebagai Admin/Petugas
                </h3>
                <p className="text-sm text-muted mt-1">
                  Gunakan akun administrator atau petugas
                </p>
              </div>

              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email / Username
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Masukkan email atau username"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted/50 focus:outline-none input-focus"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Mail className="w-5 h-5 text-muted/40" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password Anda"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
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
                  href="/admin/dashboard"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors shadow-sm ${
                    isAdminFormValid
                      ? "bg-primary text-white hover:bg-primary-dark"
                      : "bg-muted/30 text-muted/60 cursor-not-allowed"
                  }`}
                  onClick={(e) => {
                    if (!isAdminFormValid) e.preventDefault();
                  }}
                >
                  Masuk
                  <ArrowRight className="w-4 h-4" />
                </a>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted">
                  Akun admin hanya bisa dibuat oleh database
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
