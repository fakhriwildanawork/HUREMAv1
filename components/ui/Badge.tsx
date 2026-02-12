import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary';
  icon?: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', icon, className = '' }) => {
  const baseStyles = "inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest";
  
  const variants = {
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    error: "bg-rose-50 text-rose-700",
    info: "bg-sky-50 text-sky-700",
    neutral: "bg-slate-100 text-slate-600",
    primary: "bg-primary-50 text-primary-700"
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;