
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Camera, 
  Mail, 
  Briefcase, 
  Building2, 
  CalendarDays,
  ShieldCheck,
  History,
  Upload,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Employee } from '../types';
import { DriveService } from '../services/drive';
import LoadingOverlay from './ui/LoadingOverlay';

const EmployeeDetail = ({ employees, onUpdate, onDelete }: { 
  employees: Employee[], 
  onUpdate: (emp: Employee) => void,
  onDelete: (id: string) => void 
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const foundEmployee = employees.find(e => e.id === id);
  const [employee, setEmployee] = useState<Partial<Employee>>(foundEmployee || { id });
  const [isHydrating, setIsHydrating] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    const hydrateDefaults = async () => {
      if (employee.status === 'Draft' && !employee.name) {
        setIsHydrating(true);
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          const updatedDraft: Employee = {
            ...employee as Employee,
            status: 'Active',
            joinDate: new Date().toISOString().split('T')[0],
            department: 'Unassigned Branch',
          };
          setEmployee(updatedDraft);
          onUpdate(updatedDraft);
        } catch (e) {
          console.error("Lazy hydration failed", e);
        } finally {
          setIsHydrating(false);
        }
      }
    };
    hydrateDefaults();
  }, [id]);

  const handleBack = () => {
    if (isDirty) {
      if (confirm("Ada perubahan yang belum disimpan. Ingin membuangnya?")) {
        navigate('/employees');
      }
    } else {
      navigate('/employees');
    }
  };

  const handleFieldChange = (updates: Partial<Employee>) => {
    setEmployee(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      // 1. Upload ke Google Drive via Vercel API
      const driveFileId = await DriveService.uploadFile(file);
      
      // 2. Update state lokal dengan ID baru
      handleFieldChange({ profileImageId: driveFileId });
      
      alert("Foto berhasil diunggah ke Google Drive!");
    } catch (err: any) {
      alert("Gagal upload: " + err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      onUpdate(employee as Employee);
      setIsDirty(false);
      // Di sini fungsi onUpdate di App.tsx akan memicu SupabaseService.saveEmployee
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (confirm("Hapus permanen data karyawan ini?")) {
      onDelete(employee.id!);
      navigate('/employees');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20 relative">
      <LoadingOverlay 
        isVisible={isSaving || uploadingPhoto} 
        message={uploadingPhoto ? "Mengunggah ke Drive" : "Menyimpan ke Supabase"} 
        submessage="Sedang mensinkronisasi data cloud Anda..." 
      />

      <div className="flex items-center justify-between">
        <button 
          onClick={handleBack}
          className="flex items-center text-slate-500 hover:text-primary-950 font-bold transition-all group"
        >
          <div className="p-2 group-hover:bg-primary-50 rounded-xl transition-colors mr-2">
            <ArrowLeft size={20} />
          </div>
          Kembali ke Hub
        </button>
        <div className="flex items-center space-x-3">
          {isDirty && (
            <span className="flex items-center gap-2 text-primary-800 text-[10px] font-black uppercase tracking-widest bg-primary-100 px-4 py-2 rounded-xl animate-pulse">
              <AlertCircle size={14} /> Ada Perubahan
            </span>
          )}
          <button 
            onClick={handleDelete}
            className="px-5 py-2.5 text-rose-600 font-bold hover:bg-rose-50 rounded-xl flex items-center gap-2 transition-colors"
          >
            <Trash2 size={18} /> Hapus
          </button>
          <button 
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className={`px-8 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl transition-all active:scale-95 ${
              isDirty 
                ? 'bg-primary-950 text-white hover:bg-primary-800 shadow-primary-900/30' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Save size={18} /> Simpan Data
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-40 bg-gradient-to-br from-primary-950 via-primary-800 to-secondary relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="px-10 pb-10">
          <div className="relative -mt-16 flex items-end justify-between mb-10">
            <div className="relative group">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                className="hidden" 
                accept="image/*"
              />
              <div 
                className="w-40 h-40 rounded-[2rem] bg-white p-1.5 shadow-2xl border border-slate-100 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-full h-full rounded-[1.8rem] bg-slate-50 flex items-center justify-center text-slate-300 overflow-hidden relative border border-slate-100">
                  {employee.profileImageId ? (
                    <img 
                      src={DriveService.getFileUrl(employee.profileImageId)} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" 
                    />
                  ) : employee.name ? (
                    <img 
                      src={`https://picsum.photos/seed/${employee.id}/200/200`} 
                      alt="" 
                      className="w-full h-full object-cover grayscale opacity-50" 
                    />
                  ) : (
                    <Camera size={48} className="text-slate-200" />
                  )}
                  <div className="absolute inset-0 bg-primary-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                    <Upload size={28} />
                    <span className="text-[10px] font-black uppercase tracking-tighter mt-2">Ganti Foto</span>
                  </div>
                </div>
              </div>
            </div>
            {isHydrating && (
              <div className="mb-6 flex items-center text-primary-950 text-xs font-black uppercase tracking-widest bg-secondary px-4 py-2 rounded-xl animate-pulse shadow-lg shadow-secondary/20">
                <ShieldCheck size={16} className="mr-2" /> Sinkronisasi Supabase
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Informasi Pribadi</label>
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-slate-500 ml-1">Nama Lengkap Karyawan</p>
                    <input 
                      type="text"
                      value={employee.name || ''}
                      onChange={(e) => handleFieldChange({ name: e.target.value })}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-50 focus:border-primary-950 outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-slate-500 ml-1">Alamat Email</p>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="email"
                        value={employee.email || ''}
                        onChange={(e) => handleFieldChange({ email: e.target.value })}
                        placeholder="karyawan@perusahaan.co.id"
                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-50 focus:border-primary-950 outline-none font-bold text-slate-900 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest text-[10px]">Departemen Utama</p>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <select 
                    value={employee.department || ''}
                    onChange={(e) => handleFieldChange({ department: e.target.value })}
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-50 focus:border-primary-950 outline-none font-bold text-slate-900 appearance-none cursor-pointer"
                  >
                    <option value="Tech">Technology & Core</option>
                    <option value="Creative">Creative Studio</option>
                    <option value="Human Resource">Human Resource</option>
                    <option value="Commercial">Commercial Ops</option>
                    <option value="Finance">Finance & Tax</option>
                    <option value="Unassigned Branch">Unassigned Branch</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Metadata Pekerjaan</label>
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-slate-500 ml-1">Jabatan / Role</p>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="text"
                        value={employee.role || ''}
                        onChange={(e) => handleFieldChange({ role: e.target.value })}
                        placeholder="e.g. Lead Engineer"
                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-50 focus:border-primary-950 outline-none font-bold text-slate-900 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-slate-500 ml-1">Tanggal Bergabung</p>
                    <div className="relative">
                      <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="date"
                        value={employee.joinDate || ''}
                        onChange={(e) => handleFieldChange({ joinDate: e.target.value })}
                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-50 focus:border-primary-950 outline-none font-bold text-slate-900 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest text-[10px]">Status Karyawan</p>
                <div className="flex gap-3">
                  {['Active', 'On Leave', 'Terminated'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleFieldChange({ status: status as any })}
                      className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl border-2 transition-all ${
                        employee.status === status 
                          ? 'bg-primary-950 border-primary-950 text-white shadow-xl shadow-primary-900/20' 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-primary-100 hover:text-primary-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary-950 text-white rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-primary-900/30">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-white/10 rounded-[1.5rem] backdrop-blur-sm shadow-inner">
            <History size={32} className="text-secondary" />
          </div>
          <div>
            <h4 className="font-black text-lg">Cloud Storage Governance</h4>
            <p className="text-sm text-slate-300 font-medium">Semua lampiran dipetakan ke <strong>Google Drive ID</strong> melalui Vercel Functions secara aman.</p>
          </div>
        </div>
        <button 
          onClick={() => employee.profileImageId && window.open(`https://drive.google.com/file/d/${employee.profileImageId}/view`, '_blank')}
          disabled={!employee.profileImageId}
          className="w-full md:w-auto px-10 py-4 bg-white text-primary-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-secondary transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          Lihat File Asli <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
};

export default EmployeeDetail;
