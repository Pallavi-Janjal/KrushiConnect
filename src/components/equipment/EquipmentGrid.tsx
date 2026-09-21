import React from 'react';
import { Equipment } from '../../types';
import { EquipmentCard } from './EquipmentCard';
import { LoadingEquipmentSection } from '../common/EquipmentSkeleton';
import { SearchX } from 'lucide-react';

interface EquipmentGridProps {
  equipment: Equipment[];
  loading?: boolean;
  onRentClick?: (equipment: Equipment) => void;
  emptyTitle?: string;
  emptySubtitle?: string;
}

export const EquipmentGrid: React.FC<EquipmentGridProps> = ({
  equipment,
  loading = false,
  onRentClick,
  emptyTitle = 'No Agricultural Equipment Found',
  emptySubtitle = 'Try adjusting your search query or filter parameters to discover available machinery.'
}) => {
  if (loading) {
    return <LoadingEquipmentSection count={6} message="Fetching machinery from database..." />;
  }

  if (equipment.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-12 text-center my-6 max-w-xl mx-auto shadow-xs">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-750 dark:bg-slate-700 text-slate-400 dark:text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{emptyTitle}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">{emptySubtitle}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {equipment.map(item => (
        <EquipmentCard key={item.id} equipment={item} onRentClick={onRentClick} />
      ))}
    </div>
  );
};
