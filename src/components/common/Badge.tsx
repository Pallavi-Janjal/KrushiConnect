import React from 'react';

interface BadgeProps {
  status: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  let style = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = status;

  const s = status.toUpperCase();

  if (s === 'PENDING') {
    style = 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold';
    label = 'PENDING (Awaiting Owner Approval)';
  } else if (s === 'APPROVED') {
    style = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold';
    label = 'APPROVED (Owner Accepted)';
  } else if (s === 'REJECTED') {
    style = 'bg-rose-100 text-rose-900 border-rose-300 font-extrabold';
    label = 'REJECTED (Owner Declined)';
  } else if (s === 'ACTIVE') {
    style = 'bg-blue-100 text-blue-900 border-blue-300 font-extrabold';
    label = 'ACTIVE (In Progress)';
  } else if (s === 'COMPLETED') {
    style = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    label = 'COMPLETED';
  } else if (s === 'HEALTHY' || s === 'AVAILABLE') {
    style = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
  } else if (s === 'DUE SOON' || s === 'PLANNED') {
    style = 'bg-amber-50 text-amber-800 border-amber-200/80';
  } else if (s === 'MAINTENANCE' || s === 'OVERDUE' || s === 'CANCELLED' || s === 'UNAVAILABLE') {
    style = 'bg-rose-50 text-rose-800 border-rose-200/80';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${style} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75"></span>
      {label}
    </span>
  );
};

