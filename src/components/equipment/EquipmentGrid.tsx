import React from 'react';
import { Equipment } from '../../types';
import { EquipmentCard } from './EquipmentCard';
import { SearchX } from 'lucide-react';

interface EquipmentGridProps {
  equipment: Equipment[];
  onRentClick?: (equipment: Equipment) => void;
  emptyTitle?: string;
  emptySubtitle?: string;
}

export const EquipmentGrid: React.FC<EquipmentGridProps> = ({
  equipment,
  onRentClick,
  emptyTitle = 'No Agricultural Equipment Found',
  emptySubtitle = 'Try adjusting your search query or filter parameters to discover available machinery.'
}) => {
  if (equipment.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center my-6 max-w-xl mx-auto shadow-xs">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">{emptyTitle}</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">{emptySubtitle}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {equipment.map(item => (
        <EquipmentCard key={item.id} equipment={item} onRentClick={onRentClick} />
      ))}
    </div>
  );
};
