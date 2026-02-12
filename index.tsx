
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Critical Render Error:", error);
  rootElement.innerHTML = `
    <div style="padding: 40px; text-align: center; font-family: sans-serif;">
      <h1 style="color: #e11d48;">Aplikasi Gagal Dimuat</h1>
      <p style="color: #64748b;">Terjadi kesalahan saat inisialisasi modul. Silakan cek konsol developer browser (F12).</p>
      <pre style="background: #f1f5f9; padding: 20px; border-radius: 12px; display: inline-block; text-align: left; margin-top: 20px;">${error}</pre>
    </div>
  `;
}
