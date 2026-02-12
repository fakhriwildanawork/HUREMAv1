import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  MoreVertical, 
  Mail, 
  Calendar,
  Filter,
  Download,
  Upload,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Employee } from '../types';

const EmployeeList = ({ employees, onAdd }: { employees: Employee[], onAdd: (emp: Employee) => void }) => {
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAddEmployee = () => {
    const id = crypto.randomUUID();
    const newDraft: Employee = {
      id,
      name: '',
      role: '',
      department: '',
      status: 'Draft',
      email: '',
      joinDate: new Date().toISOString().split('T')[0]
    };
    onAdd(newDraft);
    navigate(`/employees/${id}`, { 
      state: { employee: newDraft, isNew: true } 
    });
  };

  const simulateUpload = () => {
    setIsUploading(true);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 10;
      setUploadProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setShowUploadModal(false);
          setUploadProgress(0);
        }, 500);
      }
    }, 150);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-primary-950 tracking-tight">Employee Hub</h2>
          <p className="text-slate-500 font-medium">Registry of company human resources.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 flex items-center gap-2 transition-all shadow-sm"
          >
            <Upload size={18} /> Bulk Import
          </button>
          <button 
            onClick={handleAddEmployee}
            className="px-6 py-2.5 bg-primary-950 text-white rounded-xl font-bold hover:bg-primary-900 flex items-center gap-2 shadow-xl shadow-primary-900/20 transition-all active:scale-95"
          >
            <Plus size={18} /> New Employee
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
             <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, dept..." 
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-950 w-full sm:w-80 outline-none transition-all"
              />
            </div>
            <button className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
              <Filter size={20} />
            </button>
          </div>
          <button className="text-primary-700 text-sm font-black flex items-center hover:underline decoration-2 underline-offset-4">
            <Download size={18} className="mr-2" /> Download Registry
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Full Member</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Department</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Onboarded</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-primary-50/30 transition-all group cursor-pointer" onClick={() => navigate(`/employees/${emp.id}`)}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300 overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                        <img src={`https://picsum.photos/seed/${emp.id}/100/100`} alt="" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{emp.name || 'New Registration'}</p>
                        <p className="text-xs text-slate-400 font-medium flex items-center mt-0.5">
                          <Mail size={12} className="mr-1.5" /> {emp.email || 'pending-auth@hurema.com'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm text-slate-700 font-bold">{emp.role || 'Assigning...'}</p>
                    <p className="text-xs text-slate-400 font-medium">{emp.department || 'Waiting'}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      emp.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                      emp.status === 'On Leave' ? 'bg-amber-100 text-amber-800' :
                      emp.status === 'Draft' ? 'bg-primary-100 text-primary-800' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {emp.status === 'Active' && <CheckCircle2 size={12} className="mr-1.5" />}
                      {emp.status === 'On Leave' && <Clock size={12} className="mr-1.5" />}
                      {emp.status === 'Terminated' && <XCircle size={12} className="mr-1.5" />}
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs text-slate-500 font-bold flex items-center">
                      <Calendar size={14} className="mr-2 text-slate-400" />
                      {new Date(emp.joinDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </td>
                  <td className="px-8 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                    <button className="text-slate-300 hover:text-primary-950 p-2 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-primary-950">Resource Upload</h3>
              <button onClick={() => !isUploading && setShowUploadModal(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                <XCircle size={28} />
              </button>
            </div>
            
            <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
              External documents are stored securely via <span className="text-primary-700 font-bold">Google Drive APIS</span>. Metadata links persist in Supabase.
            </p>

            {isUploading ? (
              <div className="space-y-6 py-10">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-primary-700">
                  <span>Pushing to Cloud Storage...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-primary-950 h-4 rounded-full transition-all duration-300 shadow-lg shadow-primary-900/40" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div 
                className="group border-3 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center space-y-4 cursor-pointer hover:border-primary-950 hover:bg-primary-50/50 transition-all"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.onchange = () => simulateUpload();
                  input.click();
                }}
              >
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-950 group-hover:scale-110 transition-transform shadow-sm">
                  <Upload size={32} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-slate-900">Drag & drop files here</p>
                  <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tighter">Support: CSV, PDF, JPG (Max 50MB)</p>
                </div>
              </div>
            )}

            <div className="mt-10 flex justify-end">
              <button 
                disabled={isUploading}
                onClick={() => setShowUploadModal(false)}
                className="px-8 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl disabled:opacity-50 transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;