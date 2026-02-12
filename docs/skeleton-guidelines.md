# HUREMA Skeleton Loading Pattern

Gunakan pola ini untuk **Level 1 Loading** (UX Transisional) guna mencegah *Layout Shift* dan memberikan feedback instan kepada user.

## 1. Prinsip Utama
Skeleton harus menyerupai bentuk konten asli sesering mungkin. Gunakan warna `bg-slate-100` atau `bg-slate-200` dengan animasi `animate-pulse`.

## 2. Contoh Implementasi Tailwind

### Profil/Karyawan Kecil
```html
<div className="flex items-center gap-4 animate-pulse">
  <div className="w-12 h-12 bg-slate-200 rounded-2xl"></div>
  <div className="space-y-2">
    <div className="h-4 w-32 bg-slate-200 rounded-lg"></div>
    <div className="h-3 w-24 bg-slate-100 rounded-lg"></div>
  </div>
</div>
```

### Baris Tabel
```html
<div className="w-full h-16 bg-slate-50/50 flex items-center px-8 gap-10 animate-pulse">
  <div className="flex-1 h-4 bg-slate-200 rounded"></div>
  <div className="w-32 h-4 bg-slate-200 rounded"></div>
  <div className="w-24 h-8 bg-slate-100 rounded-xl"></div>
</div>
```

## 3. Best Practices
1. **Match Border Radius**: Jika card asli memiliki `rounded-3xl`, skeleton juga wajib `rounded-3xl`.
2. **Opacity Stack**: Gunakan tingkat kegelapan yang berbeda untuk membedakan judul (lebih gelap) dan deskripsi (lebih terang).
3. **Ghost Text**: Jangan gunakan skeleton untuk teks yang sangat pendek (seperti angka "0"), biarkan teks asli muncul atau gunakan angka 0 sementara.
