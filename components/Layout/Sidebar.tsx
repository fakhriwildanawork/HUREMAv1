
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut,
  X,
  FileText,
  Clock,
  BookOpen,
  Palette,
  ChevronLeft,
  Menu,
  ChevronDown,
  MapPin,
  TrendingUp,
  CreditCard,
  Database
} from 'lucide-react';
import { ASSETS } from '../../assets';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const SidebarLink = ({ to, icon: Icon, label, active, isCollapsed, isSubItem = false }: { to: string, icon: any, label: string, active: boolean, isCollapsed: boolean, isSubItem?: boolean }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-primary-950 text-white shadow-lg shadow-primary-900/30' 
        : 'text-slate-500 hover:bg-primary-50 hover:text-primary-700'
    } ${isCollapsed ? 'justify-center px-0' : ''} ${isSubItem && !isCollapsed ? 'ml-6' : ''}`}
    title={isCollapsed ? label : ''}
  >
    <Icon size={isSubItem ? 16 : 20} className="shrink-0" />
    {!isCollapsed && <span className={`font-bold tracking-tight whitespace-nowrap ${isSubItem ? 'text-xs' : 'text-sm'}`}>{label}</span>}
  </Link>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const [isMasterOpen, setIsMasterOpen] = useState(location.pathname.startsWith('/master') || location.pathname === '/employees' || location.pathname === '/documents');

  const toggleMaster = () => setIsMasterOpen(!isMasterOpen);

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transform transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      md:relative md:translate-x-0
      ${isCollapsed ? 'md:w-20' : 'md:w-72'}
    `}>
      <div className={`p-6 flex items-center justify-between ${isCollapsed ? 'flex-col gap-4' : ''}`}>
        <Link to="/" className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 flex items-center justify-center overflow-hidden shrink-0">
            <img src={ASSETS.LOGO_ICON} alt="Hurema Logo" className="w-full h-full object-contain" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">{ASSETS.CLIENT_NAME}</span>
            </div>
          )}
        </Link>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={onToggleCollapse} 
            className="hidden md:flex p-1.5 text-slate-400 hover:text-primary-950 hover:bg-slate-50 rounded-lg transition-all"
          >
            {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-primary-950">
            <X size={24} />
          </button>
        </div>
      </div>

      <nav className={`px-4 space-y-1.5 mt-2 overflow-y-auto max-h-[calc(100vh-140px)] ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        <div className="w-full">
          <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} isCollapsed={isCollapsed} />
          
          <div className="w-full">
            <button
              onClick={toggleMaster}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-slate-500 hover:bg-primary-50 hover:text-primary-700 ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <Database size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-bold text-sm tracking-tight">Master Data</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown size={16} className={`transition-transform duration-200 ${isMasterOpen ? 'rotate-180' : ''}`} />
              )}
            </button>
            
            {isMasterOpen && (
              <div className="mt-1 space-y-1">
                <SidebarLink to="/master/lokasi" icon={MapPin} label="Lokasi Kantor" active={location.pathname === '/master/lokasi'} isCollapsed={isCollapsed} isSubItem />
                <SidebarLink to="/employees" icon={Users} label="Karyawan" active={location.pathname.startsWith('/employees')} isCollapsed={isCollapsed} isSubItem />
                <SidebarLink to="/master/jadwal" icon={Clock} label="Jadwal Kerja" active={location.pathname === '/master/jadwal'} isCollapsed={isCollapsed} isSubItem />
                <SidebarLink to="/master/performa" icon={TrendingUp} label="Review Performa" active={location.pathname === '/master/performa'} isCollapsed={isCollapsed} isSubItem />
                <SidebarLink to="/master/keuangan" icon={CreditCard} label="Payroll & Pajak" active={location.pathname === '/master/keuangan'} isCollapsed={isCollapsed} isSubItem />
                <SidebarLink to="/documents" icon={FileText} label="Cloud Archive" active={location.pathname === '/documents'} isCollapsed={isCollapsed} isSubItem />
              </div>
            )}
          </div>

          <SidebarLink to="/attendance" icon={Clock} label="Log Presensi" active={location.pathname === '/attendance'} isCollapsed={isCollapsed} />
        </div>
        
        <div className={`pt-6 mt-6 border-t border-slate-100 w-full ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
           <SidebarLink to="/ui-template" icon={Palette} label="Design Guide" active={location.pathname === '/ui-template'} isCollapsed={isCollapsed} />
           <SidebarLink to="/settings" icon={Settings} label="Pengaturan" active={location.pathname === '/settings'} isCollapsed={isCollapsed} />
          
          <button className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all mt-8 font-bold text-sm ${isCollapsed ? 'justify-center px-0' : ''}`}>
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && <span className="tracking-tight">Keluar Sistem</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
