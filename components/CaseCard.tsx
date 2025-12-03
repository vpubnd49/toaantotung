
import React from 'react';
import { Case, CaseStatus } from '../types';
import { FileText, Calendar, Building2, ChevronRight, Trash2 } from 'lucide-react';

interface CaseCardProps {
  data: Case;
  onClick: () => void;
  canDelete?: boolean;
  onDelete?: (id: string) => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({ data, onClick, canDelete, onDelete }) => {
  const getStatusStyles = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.COMPLETED:
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/20';
      case CaseStatus.PENDING:
        return 'bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/20';
      case CaseStatus.OVERDUE:
        return 'bg-rose-50 text-rose-700 border-rose-100 ring-rose-500/20';
      case CaseStatus.POSTPONED:
         return 'bg-orange-50 text-orange-700 border-orange-100 ring-orange-500/20';
      case CaseStatus.UPCOMING:
         return 'bg-blue-50 text-blue-700 border-blue-100 ring-blue-500/20';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100 ring-slate-500/20';
    }
  };

  const statusClass = getStatusStyles(data.status);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
        onDelete(data.id);
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-300 hover:ring-4 hover:ring-indigo-50/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full relative overflow-hidden"
    >
      {/* Decorative top bar */}
      <div className={`h-1.5 w-full ${
         data.status === CaseStatus.COMPLETED ? 'bg-emerald-500' :
         data.status === CaseStatus.PENDING ? 'bg-amber-500' :
         data.status === CaseStatus.OVERDUE ? 'bg-rose-500' :
         data.status === CaseStatus.UPCOMING ? 'bg-blue-500' :
         'bg-slate-300'
      }`}></div>

      <div className="p-5 flex-1 flex flex-col relative">
        {/* Delete Button for Admin */}
        {canDelete && (
            <button 
                onClick={handleDelete}
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white hover:bg-rose-500 rounded-lg transition-all z-20 opacity-0 group-hover:opacity-100"
                title="Xóa vụ án"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        )}

        <div className="flex justify-between items-start mb-3 pr-8">
             <span className="text-[10px] text-slate-500 font-bold bg-slate-50 px-2 py-1 rounded-md border border-slate-100 flex items-center shadow-sm">
                <Calendar className="w-3 h-3 mr-1.5 text-slate-400" /> {data.date}
            </span>
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border shadow-sm ${statusClass}`}>
              {data.status}
            </span>
        </div>

        <h3 className="text-base font-bold text-slate-800 mb-4 line-clamp-2 leading-snug group-hover:text-indigo-700 transition-colors">
          {data.title}
        </h3>

        <div className="space-y-3 mt-auto">
          <div className="flex items-center text-sm group/item">
             <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center mr-3 border border-indigo-100 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-colors shadow-sm">
                <FileText className="w-4 h-4" />
             </div>
             <div className="flex-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Số thụ lý</p>
                <div className="font-semibold text-slate-700 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md text-xs inline-block group-hover:bg-white group-hover:border-indigo-100 transition-colors">
                    {data.caseNumber}
                </div>
            </div>
          </div>
          <div className="flex items-center text-sm group/item">
             <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center mr-3 border border-indigo-100 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-colors shadow-sm">
                <Building2 className="w-4 h-4" />
             </div>
             <div className="flex-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Tòa án</p>
                <p className="font-medium text-slate-600 text-xs line-clamp-1">{data.court}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-5 py-3 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
         <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
            {data.type}
         </span>
         <span className="text-xs font-bold text-indigo-600 flex items-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            Chi tiết <ChevronRight className="w-3 h-3 ml-1" />
         </span>
      </div>
    </div>
  );
};
