"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
export function LoginForm({ next }: { next: string }) {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
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
    <label>Password<input name="password" type="password" autoComplete="current-password" placeholder="Password akun Anda" required maxLength={200} /></label>
    {error && <p className="error" role="alert">{error}</p>}
    <button className="button full" disabled={busy}>{busy ? "Memeriksa akun…" : "Masuk portal"}<span aria-hidden>→</span></button>
  </form>;
}
