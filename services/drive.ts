
/**
 * HUREMA Google Drive Storage Service
 * Berkomunikasi dengan Vercel Serverless Function untuk keamanan API Key.
 */

export const DriveService = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Gagal upload ke Google Drive');
      }

      const result = await response.json();
      return result.fileId; // Mengembalikan ID file dari Google Drive
    } catch (error) {
      console.error("Drive Upload Error:", error);
      throw error;
    }
  },
  
  getFileUrl: (fileId: string) => {
    // URL thumbnail/view Google Drive
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
};
