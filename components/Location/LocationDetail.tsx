
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
  AlertCircle,
  FolderOpen
} from 'lucide-react';
import { Location } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingOverlay from '../ui/LoadingOverlay';
import MapPicker from '../ui/MapPicker';
import Badge from '../ui/Badge';
import { DriveService, DEFAULT_FOLDER_ID } from '../../services/drive';

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

    const localUrl = URL.createObjectURL(file);
    setLocalPhotoPreview(localUrl);
    setUploadingPhoto(true);

    try {
      // Mengirim file dan Folder ID tujuan
      const driveFileId = await DriveService.uploadFile(file, DEFAULT_FOLDER_ID);
      handleFieldChange({ photo_drive_id: driveFileId });
      alert("Foto berhasil disinkronkan ke Google Drive!");
    } catch (err: any) {
      alert("Gagal upload foto: " + err.message);
      setLocalPhotoPreview(null);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!location.name) {
      alert("Nama lokasi wajib diisi!");
      return;
    }

    setIsSaving(true);
    try {
      // Memanggil fungsi onUpdate yang akan mengeksekusi SupabaseService.saveLocation
      await onUpdate(location as Location);
      setIsDirty(false);
      alert("Data lokasi berhasil disimpan ke Supabase.");
    } catch (err: any) {
      alert("Gagal menyimpan ke database: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (confirm("Hapus permanen titik lokasi ini?")) {
      onDelete(location.id!);
      navigate('/master/lokasi');
    }
  };

  const detectMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung browser.");
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
      () => {
        alert("Gagal deteksi lokasi.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      <LoadingOverlay isVisible={isSaving || uploadingPhoto} message={uploadingPhoto ? "Mengunggah ke Drive" : "Menyimpan ke Supabase"} />

      <div className="flex items-center justify-between">
        <button onClick={handleBack} className="flex items-center text-slate-500 hover:text-primary-950 font-bold transition-all group">
          <div className="p-2 group-hover:bg-primary-50 rounded-xl transition-colors mr-2">
            <ArrowLeft size={20} />
          </div>
          Kembali ke Master
        </button>
        <div className="flex items-center space-x-3">
          {isDirty && (
            <Badge variant="primary" className="animate-pulse hidden sm:flex">
              <AlertCircle size={14} className="mr-2" /> Belum Tersimpan
            </Badge>
          )}
          <button onClick={handleDelete} className="px-5 py-2.5 text-rose-600 font-bold hover:bg-rose-50 rounded-xl flex items-center gap-2 transition-colors">
            <Trash2 size={18} /> Hapus
          </button>
          <Button onClick={handleSave} disabled={!isDirty || isSaving} className="px-8 shadow-xl shadow-primary-900/30">
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-8">
          <Card className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2 bg-primary-950 text-white rounded-lg">
                <Building2 size={20} />
              </div>
              <h3 className="font-black text-slate-900">Konfigurasi Titik</h3>
            </div>

            <div className="space-y-5">
              <Input label="Nama Lokasi" value={location.name || ''} onChange={(e) => handleFieldChange({ name: e.target.value })} />
              <Input label="Alamat" icon={<MapPin size={18} />} value={location.address || ''} onChange={(e) => handleFieldChange({ address: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Lat" type="number" value={location.latitude || ''} onChange={(e) => handleFieldChange({ latitude: parseFloat(e.target.value) })} />
                <Input label="Lng" type="number" value={location.longitude || ''} onChange={(e) => handleFieldChange({ longitude: parseFloat(e.target.value) })} />
              </div>
            </div>

            <Button variant="outline" className="w-full gap-2" onClick={detectMyLocation} isLoading={isLocating} icon={<Navigation size={18} />}>
              Gunakan GPS Saat Ini
            </Button>
          </Card>

          <Card className="space-y-6">
            <h3 className="font-black text-slate-900 flex items-center gap-2">
              <Camera size={20} className="text-slate-400" /> Foto Lokasi
            </h3>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 group cursor-pointer hover:border-primary-950 transition-colors overflow-hidden relative"
            >
              {localPhotoPreview || location.photo_drive_id ? (
                <img src={localPhotoPreview || DriveService.getFileUrl(location.photo_drive_id!)} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="text-center">
                  <Upload size={24} className="mx-auto mb-2" />
                  <p className="text-[10px] font-black uppercase">Klik untuk unggah</p>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <FolderOpen size={16} className="text-primary-950" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Folder Drive</p>
                <p className="text-[11px] font-mono text-slate-600 truncate">{DEFAULT_FOLDER_ID}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <Card noPadding className="h-full min-h-[500px] flex flex-col">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-black text-slate-900">Peta Geofencing</h3>
              <p className="text-xs text-slate-400 font-medium">Titik tengah absensi mobile.</p>
            </div>
            <div className="flex-1 p-4">
              <MapPicker 
                lat={location.latitude || -6.2088} 
                lng={location.longitude || 106.8456} 
                radius={location.radius_meters || 100}
                onPositionChange={(lat, lng) => handleFieldChange({ latitude: lat, longitude: lng })}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LocationDetail;
