import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  ChevronRight, 
  CheckCircle2,
  Clock,
  XCircle,
  BellRing,
  Loader2
} from 'lucide-react';
import Button from './components/ui/Button';
import Badge from './components/ui/Badge';
import Card from './components/ui/Card';
import Input from './components/ui/Input';
import LoadingOverlay from './components/ui/LoadingOverlay';
import ConfirmModal from './components/ui/ConfirmModal';
import { ASSETS } from './assets';

const UITemplate = () => {
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [showConfirmDemo, setShowConfirmDemo] = useState(false);

  const triggerLoading = () => {
    setIsLoadingDemo(true);
    setTimeout(() => setIsLoadingDemo(false), 3000);
  };

  return (
    <div className="space-y-12 pb-20 max-w-6xl mx-auto">
      <LoadingOverlay isVisible={isLoadingDemo} message="Demonstrating Load..." />
      <ConfirmModal 
        isOpen={showConfirmDemo}
        title="Confirm This Action?"
        message="This is a demonstration of the HUREMA modular confirmation modal. It replaces traditional browser alerts or Swal."
        onConfirm={() => setShowConfirmDemo(false)}
        onCancel={() => setShowConfirmDemo(false)}
        variant="warning"
      />

      <header className="border-b border-slate-200 pb-8">
        <h1 className="text-4xl font-extrabold text-primary-950">HUREMA Design System</h1>
        <p className="text-slate-500 mt-2">Core components and styles for HRIS HUREMA.</p>
      </header>

      {/* Brand Identity */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <div className="w-2 h-8 bg-primary-950 rounded-full"></div>
          Brand Identity
        </h2>
        <Card className="flex items-center gap-8">
          <div className="w-24 h-24 bg-primary-950 rounded-3xl flex items-center justify-center shadow-xl shadow-primary-900/30 overflow-hidden">
             <img src={ASSETS.LOGO_ICON} alt="Logo" className="w-full h-full object-cover p-3" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">HUREMA Logo Mark</h3>
            <p className="text-sm text-slate-500 mt-1">Primary branding icon used in sidebars and loading states.</p>
          </div>
        </Card>
      </section>

      {/* Interaction Patterns */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <div className="w-2 h-8 bg-primary-950 rounded-full"></div>
          Interaction & Feedback
        </h2>
        <Card className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center space-y-4">
            <Loader2 className="text-primary-950 animate-spin" size={40} />
            <div>
              <h4 className="font-bold text-slate-900">Process Loading</h4>
              <p className="text-xs text-slate-500">Full-screen blocking overlay for critical save operations.</p>
            </div>
            <Button variant="primary" size="sm" onClick={triggerLoading}>Test 3s Loading</Button>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center space-y-4">
            <BellRing className="text-amber-500" size={40} />
            <div>
              <h4 className="font-bold text-slate-900">Confirmation Dialog</h4>
              <p className="text-xs text-slate-500">Accessible modal for dangerous or final decisions.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowConfirmDemo(true)}>Open Modal</Button>
          </div>
        </Card>
      </section>

      {/* Skeleton Demo */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <div className="w-2 h-8 bg-primary-950 rounded-full"></div>
          Skeleton States (Level 1)
        </h2>
        <Card className="space-y-6">
          <div className="flex items-center gap-4 animate-pulse">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 w-1/3 bg-slate-100 rounded-lg"></div>
              <div className="h-3 w-1/4 bg-slate-50 rounded-lg"></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 animate-pulse">
            <div className="h-24 bg-slate-50 rounded-2xl"></div>
            <div className="h-24 bg-slate-50 rounded-2xl"></div>
            <div className="h-24 bg-slate-50 rounded-2xl"></div>
          </div>
        </Card>
      </section>

      {/* Buttons Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <div className="w-2 h-8 bg-primary-950 rounded-full"></div>
          Interactive Elements (Atomic)
        </h2>
        <Card className="flex flex-wrap gap-4 items-center">
          <Button icon={<Plus size={18} />}>Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Link</Button>
          <Button variant="danger">Danger Action</Button>
        </Card>
      </section>

      {/* Forms Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <div className="w-2 h-8 bg-primary-950 rounded-full"></div>
          Forms & Inputs
        </h2>
        <Card className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input 
            label="Standard Input" 
            placeholder="Search anything..." 
            icon={<Search size={18} />} 
          />
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 ml-1">Status Badges</label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success" icon={<CheckCircle2 size={14} />}>Active</Badge>
              <Badge variant="warning" icon={<Clock size={14} />}>On Leave</Badge>
              <Badge variant="error" icon={<XCircle size={14} />}>Terminated</Badge>
              <Badge variant="primary">New Hire</Badge>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default UITemplate;