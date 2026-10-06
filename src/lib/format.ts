export const rupiah = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
export const kg = (value: number) => `${new Intl.NumberFormat("id-ID").format(value)} KG`;
export const dateText = (value: Date | string) => new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(value));
export const orderNumber = (id: string) => `AJS-${id.slice(-8).toUpperCase()}`;
