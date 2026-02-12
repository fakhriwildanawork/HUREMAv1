
/**
 * HUREMA Google Drive Storage Service
 * Berkomunikasi dengan Vercel Serverless Function untuk keamanan API Key.
 */

const getSafeEnv = (key: string): string => {
  // @ts-ignore
  if (import.meta.env && import.meta.env[key]) return import.meta.env[key];
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) return process.env[key];
  } catch (e) {}
  return '';
};

// Mengambil Folder ID dari Env atau Fallback ke Default
export const DEFAULT_FOLDER_ID = getSafeEnv('VITE_GOOGLE_DRIVE_FOLDER_ID') || "1vL82ItStGxRXWvupbpmjeZbZe80IXHqF"; 

export const DriveService = {
  uploadFile: async (file: File, folderId: string = DEFAULT_FOLDER_ID): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', folderId);

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
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
};
