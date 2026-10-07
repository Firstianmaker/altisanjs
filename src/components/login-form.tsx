"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
export function LoginForm({ next }: { next: string }) {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [showPassword, setShowPassword] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError("");
    const data = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.get("email"), password: data.get("password") }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      router.push(result.role === "ADMIN" ? "/admin" : next); router.refresh();
    } catch (e) { setError((e as Error).message || "Login belum berhasil. Coba lagi."); setBusy(false); }
  }
  return <form onSubmit={submit} className="form-stack">
    <label>Email<input name="email" type="email" autoComplete="username" placeholder="Email akun Anda" required maxLength={200} /></label>
    <label>Password<span className="password-field"><input name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Password akun Anda" required maxLength={200} /><button className="password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} aria-pressed={showPassword}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{showPassword ? <><path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.3 4.2 9 7-.3 1.1-1 2.3-2.1 3.4" /><path d="M6.2 6.2C4.4 7.3 3.3 9 3 12c.7 2.8 4 7 9 7 1 0 1.9-.2 2.8-.5" /></> : <><path d="M2.5 12s3.3-7 9.5-7 9.5 7 9.5 7-3.3 7-9.5 7-9.5-7-9.5-7Z" /><circle cx="12" cy="12" r="3" /></>}</svg></button></span></label>
    {error && <p className="error" role="alert">{error}</p>}
    <button className="button full" disabled={busy}>{busy ? "Memeriksa akun…" : "Masuk portal"}<span aria-hidden>→</span></button>
  </form>;
}
