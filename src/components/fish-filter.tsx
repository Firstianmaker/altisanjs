"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function FishFilter({ products, selected, status }: {
  products: { id: string; name: string }[]; selected: string[]; status?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(selected);
  const [pending, startTransition] = useTransition();
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    function closeOutside(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);
  function apply(ids: string[]) {
    const query = new URLSearchParams();
    if (status) query.set("status", status);
    ids.forEach(id => query.append("fish", id));
    setOpen(false);
    trigger.current?.focus();
    startTransition(() => router.push(`/admin${query.size ? `?${query}` : ""}`, { scroll: false }));
  }
  return <div className="fish-filter" ref={container} onKeyDown={event => {
    if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
  }} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <button className={`fish-filter-trigger ${selected.length ? "is-active" : ""}`} ref={trigger} type="button" aria-label={`Filter ikan${selected.length ? `, ${selected.length} dipilih` : ""}`} title="Filter ikan" aria-expanded={open} aria-controls="fish-filter-options" disabled={pending} onClick={() => { setDraft(selected); setOpen(!open); }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" /></svg>
      {selected.length > 0 && <span>{selected.length}</span>}
    </button>
    {open && <form id="fish-filter-options" className="fish-filter-popover" onSubmit={event => { event.preventDefault(); apply(draft); }}>
      <fieldset><legend>Filter ikan</legend><p>Pilih satu atau beberapa komoditas.</p>
        {products.map(product => <label key={product.id} className="fish-filter-option"><input type="checkbox" value={product.id} checked={draft.includes(product.id)} onChange={event => setDraft(current => event.target.checked ? [...current, product.id] : current.filter(id => id !== product.id))} /><span>{product.name}</span></label>)}
      </fieldset>
      <div className="fish-filter-actions"><button type="button" className="text-button" onClick={() => { setDraft([]); apply([]); }}>Reset ikan</button><button className="button small" type="submit">Terapkan</button></div>
    </form>}
  </div>;
}
