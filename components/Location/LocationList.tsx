
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  MapPin, 
  Search, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  XCircle,
  Building2
} from 'lucide-react';
import { Location } from '../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Input from '../ui/Input';
import Button from '../ui/Button';

const LocationList = ({ locations, onAdd }: { locations: Location[], onAdd: (loc: Location) => void }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLocations = locations.filter(loc => {
    const searchString = searchTerm.toLowerCase();
    // Frontend simulation of the SQL search_all logic
    return loc.name.toLowerCase().includes(searchString) || 
           loc.address.toLowerCase().includes(searchString);
  });

  const handleAddLocation = () => {
    const id = crypto.randomUUID();
    const newDraft: Location = {
      id,
      name: '',
      address: '',
      latitude: -6.2088,
      longitude: 106.8456,
      radius_meters: 100,
      is_active: true
    };
    onAdd(newDraft);
    navigate(`/master/lokasi/${id}`, { 
      state: { location: newDraft, isNew: true } 
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-primary-950 tracking-tight">Master Lokasi</h2>
          <p className="text-slate-500 font-medium">Manajemen titik absensi dan geofencing kantor.</p>
        </div>
        <Button 
          onClick={handleAddLocation}
          icon={<Plus size={18} />}
          className="shadow-xl shadow-primary-900/20"
        >
          Tambah Lokasi
        </Button>
      </div>

      <Card noPadding>
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
             <Input 
                placeholder="Cari lokasi atau alamat..." 
                icon={<Search size={18} />} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80"
             />
             <button className="p-3 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
              <Filter size={20} />
            </button>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {filteredLocations.length} Lokasi Terdaftar
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Nama Lokasi</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Koordinat</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Radius</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLocations.map((loc) => (
                <tr key={loc.id} className="hover:bg-primary-50/30 transition-all group cursor-pointer" onClick={() => navigate(`/master/lokasi/${loc.id}`)}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-950 flex items-center justify-center shrink-0">
                        <Building2 size={24} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-900 truncate">{loc.name || 'Lokasi Baru'}</p>
                        <p className="text-xs text-slate-400 font-medium truncate flex items-center mt-0.5">
                          <MapPin size={12} className="mr-1.5 shrink-0" /> {loc.address || 'Alamat belum diatur'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded w-fit">
                      {loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}
                    </p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm text-slate-700 font-bold">{loc.radius_meters}m</p>
                  </td>
                  <td className="px-8 py-5">
                    <Badge variant={loc.is_active ? 'success' : 'neutral'} icon={loc.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}>
                      {loc.is_active ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-slate-300 group-hover:text-primary-950 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLocations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Search size={48} className="opacity-20" />
                      <p className="font-bold">Tidak ada lokasi ditemukan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default LocationList;
