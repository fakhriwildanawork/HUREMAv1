# Xeenaps UX & Data Persistence Pattern

Dokumen ini menjelaskan standar **Strategi Penyimpanan (Saving)** dan **Strategi Loading** yang digunakan dalam aplikasi HUREMA.

---

## 1. Hybrid Saving Strategy (Strategi Penyimpanan Hibrida)

HUREMA memisahkan logika penyimpanan berdasarkan konteks interaksi: **Drafting Mode** (Edit Teks) vs **Asset Mode** (Manipulasi File).

### A. Manual Save (Drafting Mode)
Digunakan pada halaman Form atau Detail View yang berisi banyak input teks (`EmployeeDetail`).

*   **Prinsip**: "Change requires Confirmation".
*   **Mekanisme**:
    1.  **State `isDirty`**: Berubah menjadi `true` saat user mengetik.
    2.  **Navigation Guard**: Jika `isDirty`, munculkan Alert untuk konfirmasi *Discard* atau *Cancel*.
    3.  **Eksekusi**: Data dikirim ke Supabase saat tombol Save ditekan secara eksplisit.

### B. Auto-Triggered Save (Asset Mode)
Digunakan pada upload dokumen atau foto profil.

*   **Prinsip**: "Atomic & Instant".
*   **Mekanisme**:
    1.  **Optimistic UI**: UI langsung menampilkan placeholder/ghost card.
    2.  **Background Process**: Upload ke Google Drive API.
    3.  **Silent Sync**: Setelah dapat Drive ID, sistem otomatis update metadata Supabase.

---

## 2. Tiered Loading Strategy

### Level 1: Initial Skeleton
Mencegah *Cumulative Layout Shift* (CLS).

### Level 2: Global Blocking Overlay
Digunakan saat proses **Manual Save**. Memblokir interaksi untuk mencegah *Race Condition*.

### Level 3: Local/Inline Loading
Digunakan pada **Auto-Triggered Save** (Upload File). User tetap bisa berinteraksi dengan bagian lain.
