
/**
 * HUREMA Google Drive Storage Service
 * Berkomunikasi dengan Vercel Serverless Function untuk keamanan API Key.
 */

// Ganti ID ini dengan Folder ID tujuan Anda dari Google Drive
export const DEFAULT_FOLDER_ID = "1vL82ItStGxRXWvupbpmjeZbZe80IXHqF"; 

export const DriveService = {
  uploadFile: async (file: File, folderId: string = DEFAULT_FOLDER_ID): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', folderId); // Kirim folderId ke API

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal upload ke Google Drive');
      }

      const result = await response.json();
      return result.fileId; 
    } catch (error) {
      console.error("Drive Upload Error:", error);
      throw error;
    }
  },
  
  getFileUrl: (fileId: string) => {
    if (!fileId) return `https://picsum.photos/seed/hurema/400/300`;
    // Gunakan thumbnail link resmi Google Drive
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
};
