import React from 'react';
import { CaseGroup } from '../types';
import { Users, FolderOpen, ArrowRight } from 'lucide-react';

interface CaseGroupCardProps {
  data: CaseGroup;
  onClick?: () => void;
}

export const CaseGroupCard: React.FC<CaseGroupCardProps> = ({ data, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-white relative overflow-hidden group h-full flex flex-col cursor-pointer"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-indigo-400 opacity-10 rounded-full blur-xl"></div>

      <div className="p-6 relative z-10 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-6">
            <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md shadow-inner border border-white/10">
                 <FolderOpen className="w-6 h-6 text-indigo-100" />
            </div>
            <span className="bg-indigo-950/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-md border border-white/10 text-indigo-100">
                Nhóm vụ án
            </span>
        </div>

        <h3 className="text-lg font-bold text-white mb-3 leading-snug tracking-tight">
          {data.name}
        </h3>

        <div className="flex items-center text-indigo-100 text-sm mb-6">
            <span className="bg-white/10 px-2.5 py-1 rounded-lg text-xs font-semibold mr-2 border border-white/10">
                {data.caseCount} Vụ án
            </span>
            <span className="text-xs font-medium opacity-80 border-l border-white/20 pl-2 ml-1">{data.type}</span>
        </div>

        <div className="bg-black/20 rounded-xl p-4 backdrop-blur-md border border-white/5 mt-auto group-hover:bg-black/30 transition-colors">
            <div className="flex items-center text-xs font-bold text-indigo-200 mb-3 uppercase tracking-wide">
                <Users className="w-3.5 h-3.5 mr-1.5" />
                Nguyên đơn chính
            </div>
            <ul className="text-sm text-indigo-50 space-y-2">
                {data.plaintiffs.slice(0, 3).map((p, idx) => (
                    <li key={idx} className="truncate flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2"></div>
                        {p}
                    </li>
                ))}
            </ul>
        </div>
      </div>
      
      {/* Footer Action */}
      <div className="px-6 py-3 bg-black/10 border-t border-white/5 flex justify-between items-center text-xs font-medium text-indigo-100 group-hover:text-white transition-colors">
         <span>Xem danh sách</span>
         <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};