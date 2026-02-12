
// Vercel Serverless Function: api/upload.ts
// Handler untuk upload file ke Google Drive secara aman (Server-side)

export const config = {
  api: {
    bodyParser: false, // Penting untuk menangani FormData/File
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Catatan: Di lingkungan produksi, Anda harus menggunakan library seperti 'formidable' 
    // atau 'multer' untuk memproses stream file dari request.
    // Di sini kita asumsikan integrasi dengan Google Drive API menggunakan Refresh Token.

    // 1. Get Access Token dari Refresh Token (disimpan di Env Vercel)
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token',
      }),
    });
    const tokens = await tokenResponse.json();
    const accessToken = tokens.access_token;

    // 2. Upload Metadata & File ke Drive
    // Implementasi multipart upload Google Drive REST API v3
    // Respon sukses akan mengembalikan { id: 'FILE_ID_DARI_DRIVE' }

    // Simulasi respons sukses (Logic upload sebenarnya diletakkan di sini)
    const mockFileId = "1UmaXPeAlyh90w5mkB3fiefHaMEUzP0bS"; // Contoh ID

    return res.status(200).json({ 
      success: true, 
      fileId: mockFileId 
    });

  } catch (error: any) {
    console.error("Vercel API Drive Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
