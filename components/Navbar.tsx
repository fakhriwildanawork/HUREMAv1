import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Menu, 
  BrainCircuit 
} from 'lucide-react';

interface NavbarProps {
  onMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => (
  <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <button onClick={onMenuToggle} className="md:hidden text-slate-600 p-2 hover:bg-slate-100 rounded-lg">
        <Menu size={24} />
      </button>
      <div className="relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search records..." 
          className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-950 w-64 outline-none transition-all"
        />
      </div>
    </div>
    
    <div className="flex items-center space-x-4">
      <Link to="/ai-assistant" className="p-2 text-primary-950 bg-primary-50 hover:bg-primary-100 rounded-xl flex items-center gap-2 transition-all">
        <BrainCircuit size={20} />
        <span className="text-xs font-bold hidden lg:inline uppercase tracking-widest">Hurema AI</span>
      </Link>
      <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl relative">
        <Bell size={20} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </button>
      <div className="h-10 w-10 rounded-xl bg-primary-950 flex items-center justify-center text-white font-bold border border-primary-950 cursor-pointer shadow-md">
        AD
      </div>
    </div>
  </header>
);

export default Navbar;