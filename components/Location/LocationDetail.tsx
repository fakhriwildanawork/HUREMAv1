
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation as useRouteLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  MapPin, 
  Navigation, 
  Building2, 
  Target,
  Camera,
  Upload,
  ExternalLink,
  History,
  AlertCircle
} from 'lucide-react';
import { Location } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import LoadingOverlay from './ui/LoadingOverlay';
import MapPicker from './ui/MapPicker';
import Badge from './ui/Badge';
import { DriveService } from '../../services/drive';

const LocationDetail = ({ locations, onUpdate, onDelete }: { 
  locations: Location[], 
  onUpdate: (loc: Location) => void,
  onDelete: (id: string) => void 
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const routeLocation = useRouteLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const foundLocation = locations.find(l => l.id === id);
  const [location, setLocation] = useState<Partial<Location>>(foundLocation || { id });
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [localPhotoPreview, setLocalPhotoPreview] = useState<string | null>(null);

  // Auto detect location for NEW items
  useEffect(() => {
    if (routeLocation.state?.isNew && !foundLocation?.latitude) {
      detectMyLocation();
    }
  }, []);

  const handleBack = () => {
    if (isDirty) {
      if (confirm("Ada perubahan yang belum disimpan. Yakin ingin kembali?")) {
        navigate('/master/lokasi');
      }
    } else {
      navigate('/master/lokasi');
    }
  };

  const handleFieldChange = (updates: Partial<Location>) => {
    setLocation(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // OPTIMISTIC UI: Tampilkan preview instan
    const localUrl = URL.createObjectURL(file);
    setLocalPhotoPreview(localUrl);
    setUploadingPhoto(true);

    try {
      const driveFileId = await DriveService.uploadFile(file);
      handleFieldChange({ photo_drive_id: driveFileId });
    } catch (err: any) {
      alert("Gagal upload foto: " + err.message);
      setLocalPhotoPreview(null); // Revert if failed
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulation: Supabase Record Update
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    onUpdate(location as Location);
    setIsDirty(false);
    setIsSaving(false);
  };

  const handleDelete = () => {
    if (confirm("Hapus permanen titik lokasi ini? Data absensi yang terkait mungkin akan terdampak.")) {
      onDelete(location.id!);
      navigate('/master/lokasi');
    }
  };

  const detectMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung oleh browser Anda.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleFieldChange({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setIsLocating(false);
      },
      (error) => {
        console.error("Error detecting location", error);
        alert("Gagal mendeteksi lokasi. Pastikan izin GPS aktif dan akurasi tinggi diizinkan.");
        setIsLocating(false);
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0 
      }
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      <LoadingOverlay isVisible={isSaving} message="Menyimpan Data Lokasi" submessage="Sinkronisasi koordinat ke Supabase..." />

      <div className="flex items-center justify-between">
        <button 
          onClick={handleBack}
          className="flex items-center text-slate-500 hover:text-primary-950 font-bold transition-all group"
        >
          <div className="p-2 group-hover:bg-primary-50 rounded-xl transition-colors mr-2">
            <ArrowLeft size={20} />
          </div>
          Kembali ke Master
        </button>
        <div className="flex items-center space-x-3">
          {isDirty && (
            <span className="hidden md:flex items-center gap-2 text-primary-800 text-[10px] font-black uppercase tracking-widest bg-primary-100 px-4 py-2 rounded-xl animate-pulse">
              <AlertCircle size={14} /> Belum Tersimpan
            </span>
          )}
          <button 
            onClick={handleDelete}
            className="px-5 py-2.5 text-rose-600 font-bold hover:bg-rose-50 rounded-xl flex items-center gap-2 transition-colors"
          >
            <Trash2 size={18} /> Hapus
          </button>
          <Button 
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="px-8 shadow-xl shadow-primary-900/30"
          >
            Update Lokasi
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-5 space-y-8">
          <Card className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2 bg-primary-950 text-white rounded-lg">
                <Building2 size={20} />
              </div>
              <h3 className="font-black text-slate-900">Detail Titik Kantor</h3>
            </div>

            <div className="space-y-5">
              <Input 
                label="Nama Lokasi" 
                placeholder="Misal: Kantor Pusat Jakarta"
                value={location.name || ''}
                onChange={(e) => handleFieldChange({ name: e.target.value })}
              />
              <Input 
                label="Alamat Lengkap" 
                placeholder="Jl. Nama Jalan No..."
                icon={<MapPin size={18} />}
                value={location.address || ''}
                onChange={(e) => handleFieldChange({ address: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Latitude" 
                  type="number"
                  step="0.00000001"
                  value={location.latitude || ''}
                  onChange={(e) => handleFieldChange({ latitude: parseFloat(e.target.value) })}
                />
                <Input 
                  label="Longitude" 
                  type="number"
                  step="0.00000001"
                  value={location.longitude || ''}
                  onChange={(e) => handleFieldChange({ longitude: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 ml-1">Radius Toleransi (Meter)</label>
                  <span className="text-[10px] font-black text-primary-950 bg-primary-50 px-2 py-0.5 rounded-lg">{location.radius_meters}m</span>
                </div>
                <div className="flex items-center gap-4">
                  <input 
                    type="range"
                    min="50"
                    max="1000"
                    step="50"
                    value={location.radius_meters || 100}
                    onChange={(e) => handleFieldChange({ radius_meters: parseInt(e.target.value) })}
                    className="flex-1 accent-primary-950"
                  />
                  <Target size={20} className="text-slate-300" />
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full justify-center gap-2"
              onClick={detectMyLocation}
              isLoading={isLocating}
              icon={<Navigation size={18} />}
            >
              Gunakan Lokasi Saya Saat Ini
            </Button>
          </Card>

          {/* Photo Section */}
          <Card className="space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="font-black text-slate-900 flex items-center gap-2">
                 <Camera size={20} className="text-slate-400" /> Foto Lokasi
               </h3>
               <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-black text-primary-950 uppercase tracking-widest hover:underline decoration-2"
               >
                 Upload Baru
               </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
              className="hidden" 
              accept="image/*" 
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 group cursor-pointer hover:border-primary-950 transition-colors overflow-hidden relative"
            >
              {localPhotoPreview || location.photo_drive_id ? (
                <img 
                  src={localPhotoPreview || DriveService.getFileUrl(location.photo_drive_id!)} 
                  className={`w-full h-full object-cover transition-opacity ${uploadingPhoto ? 'opacity-50' : 'opacity-100'}`} 
                  alt="Location" 
                />
              ) : (
                <>
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-tighter">Klik untuk unggah foto kantor</p>
                </>
              )}
              
              {uploadingPhoto && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary-950/20 backdrop-blur-[2px]">
                   <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">Uploading...</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Map Column */}
        <div className="lg:col-span-7 flex flex-col">
          <Card noPadding className="flex-1 relative min-h-[500px] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900">Peta Geofencing</h3>
                <p className="text-xs text-slate-400 font-medium italic">Geser pin untuk menentukan titik absensi presisi.</p>
              </div>
              <div className="px-3 py-1.5 bg-secondary text-primary-950 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-secondary/20">
                Live Preview
              </div>
            </div>
            <div className="flex-1 relative p-4">
              <MapPicker 
                lat={location.latitude || -6.2088} 
                lng={location.longitude || 106.8456} 
                radius={location.radius_meters || 100}
                onPositionChange={(lat, lng) => handleFieldChange({ latitude: lat, longitude: lng })}
              />
            </div>
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Akurasi GPS</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isLocating ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                  <p className="text-xs font-bold text-slate-700">{isLocating ? 'Mendeteksi...' : 'Tinggi (Precise)'}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Google Drive Sync</p>
                <div className="flex items-center gap-2">
                  <Badge variant={location.photo_drive_id ? "success" : "info"} className="!px-2 !py-0.5">
                    {location.photo_drive_id ? "SYNCED" : "READY"}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="mt-8 bg-primary-950 text-white rounded-3xl p-6 flex items-center justify-between shadow-2xl shadow-primary-900/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <History size={80} />
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                <ExternalLink size={24} className="text-secondary" />
              </div>
              <div>
                <h4 className="font-black text-sm">Integrasi Sistem</h4>
                <p className="text-xs text-slate-300 font-medium">Titik ini akan menjadi acuan absensi mobile seluruh karyawan.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetail;
