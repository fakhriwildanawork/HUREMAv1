
import React from 'react';
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  Clock,
  TrendingUp,
  ArrowRight,
  Target
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';
import { Employee } from '../../types';

const attendanceData = [
  { name: 'Mon', present: 480, absent: 20 },
  { name: 'Tue', present: 475, absent: 25 },
  { name: 'Wed', present: 490, absent: 10 },
  { name: 'Thu', present: 485, absent: 15 },
  { name: 'Fri', present: 460, absent: 40 },
];

const growthData = [
  { month: 'Jan', count: 420 },
  { month: 'Feb', count: 435 },
  { month: 'Mar', count: 450 },
  { month: 'Apr', count: 468 },
  { month: 'May', count: 485 },
  { month: 'Jun', count: 500 },
];

const StatCard = ({ title, value, icon: Icon, trend, colorClass, iconBg }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between group">
    <div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{title}</p>
      <h3 className="text-3xl font-black text-slate-900 group-hover:text-primary-950 transition-colors">{value}</h3>
      <div className="flex items-center mt-3 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
        <TrendingUp size={14} className="mr-1" />
        {trend}
      </div>
    </div>
    <div className={`p-4 rounded-2xl ${iconBg} ${colorClass} shadow-lg shadow-black/5`}>
      <Icon size={24} />
    </div>
  </div>
);

const Dashboard = ({ employees = [] }: { employees: Employee[] }) => {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const onLeaveEmployees = employees.filter(e => e.status === 'On Leave').length;
  const turnoverCount = employees.filter(e => e.status === 'Terminated').length;

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-primary-950 tracking-tight">Main Dashboard</h2>
          <p className="text-slate-500 font-medium">Monitoring 500 employees threshold across Supabase instance.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Last Update: Today, 09:40 AM</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Workforce" 
          value={totalEmployees.toString()} 
          icon={Users} 
          trend="+12% from last month"
          iconBg="bg-primary-950"
          colorClass="text-white"
        />
        <StatCard 
          title="Active Presence" 
          value={activeEmployees.toString()} 
          icon={UserCheck} 
          trend={`${((activeEmployees / (totalEmployees || 1)) * 100).toFixed(0)}% attendance`}
          iconBg="bg-secondary"
          colorClass="text-primary-950"
        />
        <StatCard 
          title="Leave Requests" 
          value={onLeaveEmployees.toString()} 
          icon={Clock} 
          trend="2 needing approval"
          iconBg="bg-amber-100"
          colorClass="text-amber-700"
        />
        <StatCard 
          title="Retention Rate" 
          value={`${(100 - (turnoverCount / (totalEmployees || 1)) * 100).toFixed(1)}%`} 
          icon={Target} 
          trend="Target: 95.0%"
          iconBg="bg-slate-100"
          colorClass="text-slate-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="font-black text-slate-900 text-lg">Weekly Presence Analysis</h3>
              <p className="text-sm text-slate-400">Aggregated attendance from mobile logs.</p>
            </div>
            <button className="text-primary-950 text-sm font-bold flex items-center hover:bg-primary-50 px-4 py-2 rounded-xl transition-all">
              Full Report <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Bar dataKey="present" fill="#005E4E" radius={[8, 8, 0, 0]} barSize={44} />
                <Bar dataKey="absent" fill="#E2E8F0" radius={[8, 8, 0, 0]} barSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-black text-slate-900 text-lg mb-2">Growth Tracker</h3>
          <p className="text-sm text-slate-400 mb-8">Quarterly hiring performance.</p>
          <div className="h-64 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E8C1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00E8C1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" hide />
                <YAxis hide domain={['dataMin - 50', 'dataMax + 50']} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#005E4E" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorPrimary)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex justify-between items-center text-sm mb-3">
              <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Scaling Target</span>
              <span className="text-primary-950 font-black">520 / 500</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div className="bg-primary-950 h-3 rounded-full transition-all duration-1000" style={{ width: '92%' }}></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-3 italic font-medium">92% of the free tier capacity reached.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
