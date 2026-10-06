"use client";
export default function ErrorPage({ reset }: { reset: () => void }) { return <div className="container page-space"><h1>Halaman belum dapat dimuat.</h1><p>Data sementara tidak dapat diakses. Silakan coba lagi.</p><button className="button" onClick={reset}>Coba lagi</button></div>; }
