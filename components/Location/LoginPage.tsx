
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { ASSETS } from '../assets';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { SupabaseService } from '../services/supabase';

const LoginPage = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Untuk demo cepat, kita gunakan login manual jika Supabase belum di-set
      if (!process.env.SUPABASE_URL) {
        setTimeout(() => {
          onLoginSuccess();
        }, 1000);
        return;
      }
      
      await SupabaseService.signIn(email);
      setIsSent(true);
    } catch (error) {
      alert("Gagal mengirim email login. Pastikan konfigurasi Supabase benar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center p-6 bg-[radial-gradient(#005E4E0a_1px,transparent_1px)] [background-size:40px_40px]">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary-950 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-primary-900/40 p-4">
            <img src={ASSETS.LOGO_ICON} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-950 tracking-tight">HUREMA HRIS</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">{ASSETS.CLIENT_NAME}</p>
          </div>
        </div>

        <Card className="shadow-2xl shadow-primary-900/5 !p-10 border-slate-100">
          {isSent ? (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Check Your Email</h3>
                <p className="text-sm text-slate-500 font-medium">We've sent a magic link to <br/><span className="text-primary-950 font-bold">{email}</span></p>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setIsSent(false)}>Back to Login</Button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Sign In</h3>
                <p className="text-xs text-slate-400 font-medium">Masukan email terdaftar untuk akses dashboard.</p>
              </div>
              
              <Input 
                label="Email Perusahaan"
                type="email"
                placeholder="admin@hurema.com"
                icon={<Mail size={18} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button 
                type="submit" 
                className="w-full justify-center group" 
                isLoading={isLoading}
              >
                Kirim Link Login <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <div className="pt-4 border-t border-slate-50 text-center">
                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Powered by Supabase & Google Drive</p>
              </div>
            </form>
          )}
        </Card>

        <p className="text-center text-xs text-slate-400 font-medium">
          Lupa akses? Hubungi <span className="text-primary-950 font-black">IT Support MID</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
