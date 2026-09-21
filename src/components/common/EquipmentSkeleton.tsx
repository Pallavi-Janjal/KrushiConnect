import React from 'react';
import { Tractor, Loader2 } from 'lucide-react';

export const EquipmentSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs overflow-hidden flex flex-col animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[16/10] w-full bg-slate-200 dark:bg-slate-700">
        <div className="absolute top-3 left-3 w-20 h-6 bg-slate-300 dark:bg-slate-600 rounded-md"></div>
        <div className="absolute top-3 right-3 w-16 h-5 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
      </div>

      {/* Body Skeleton */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Title */}
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4"></div>
          
          {/* Rating & HP */}
          <div className="flex items-center justify-between pt-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-14"></div>
          </div>

          {/* Location & Owner */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-16"></div>
            <div className="h-8 bg-slate-300 dark:bg-slate-600 rounded-lg w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoadingEquipmentSection: React.FC<{ count?: number; message?: string }> = ({
  count = 8,
  message = 'Loading agricultural machinery from MongoDB Atlas...'
}) => {
  return (
    <div className="space-y-6">
      {/* Friendly Animated Notice Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-lime-50 to-emerald-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 sm:p-5 flex items-center justify-center gap-3 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-[#166534] dark:bg-emerald-600 text-white flex items-center justify-center shadow-md animate-bounce shrink-0">
          <Tractor className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-[#166534] dark:text-emerald-400">{message}</h4>
            <Loader2 className="w-4 h-4 text-[#166534] dark:text-emerald-400 animate-spin" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Connecting to cloud database. This takes just a moment...
          </p>
        </div>
      </div>

      {/* Grid of Skeleton Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: count }).map((_, i) => (
          <EquipmentSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
