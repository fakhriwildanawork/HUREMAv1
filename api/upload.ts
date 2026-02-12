
// Vercel Serverless Function: api/upload.ts
// Handler untuk upload file ke Google Drive secara aman (Server-side)

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Ambil folderId dari FormData (biasanya diproses dengan library seperti busboy/formidable)
    // Di Google Drive API, metadata folder diletakkan di field 'parents'
    
    // PSEUDO-LOGIC UNTUK INTEGRASI DRIVE REAL:
    /*
    const metadata = {
      name: fileName,
      parents: [req.body.folderId], // INI CARA MENGARAHKAN FOLDER
      mimeType: fileMimeType
    };
    
    // Multipart upload request ke: 
    // https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart
    */

    // Simulasi respons sukses dengan folder destination log
    console.log("File akan disimpan ke folder:", req.body?.folderId || "Root");

    // Simulasi ID yang dihasilkan setelah upload berhasil
    const mockFileId = "1UmaXPeAlyh90w5mkB3fiefHaMEUzP0bS"; 

    return res.status(200).json({ 
      success: true, 
      fileId: mockFileId,
      folderTarget: req.body?.folderId
    });

  } catch (error: any) {
    console.error("Vercel API Drive Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
