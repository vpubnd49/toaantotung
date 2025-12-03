
import React from 'react';
import { CaseDetail } from '../types';
import { Calendar, User, History, ArrowDown, FileCheck, Scale, AlertTriangle, Building, Gavel, ChevronRight, Ban } from 'lucide-react';

interface CaseSidebarProps {
  data: CaseDetail;
}

export const CaseSidebar: React.FC<CaseSidebarProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* 1. Case Summary Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-5 flex items-center text-sm uppercase tracking-wide">
          <FileCheck className="w-5 h-5 mr-2 text-indigo-600" />
          Tổng quan
        </h3>
        
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
            <div>
              <span className="block text-slate-400 text-xs font-semibold uppercase mb-1">Số thụ lý</span>
              <span className="font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-100 inline-block">{data.caseNumber}</span>
            </div>
            <div>
              <span className="block text-slate-400 text-xs font-semibold uppercase mb-1">Trạng thái</span>
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold
                ${data.status === 'Quá hạn' ? 'bg-rose-100 text-rose-700' : 
                  data.status === 'Hoàn thành' ? 'bg-emerald-100 text-emerald-700' : 
                  data.status === 'Tạm hoãn' ? 'bg-amber-100 text-amber-700' :
                  'bg-indigo-100 text-indigo-700'}`}>
                {data.status}
              </span>
            </div>
            
             <div className="col-span-2 pt-2 border-t border-slate-50">
              <span className="block text-slate-400 text-xs font-semibold uppercase mb-1">Giai đoạn tố tụng</span>
              <span className="font-bold text-slate-800 flex items-center">
                 <Gavel className="w-4 h-4 mr-2 text-slate-400" />
                 {data.caseStage}
              </span>
            </div>

            <div className="col-span-2 pt-2 border-t border-slate-50">
              <span className="block text-slate-400 text-xs font-semibold uppercase mb-1">Thẩm phán</span>
              <span className="font-medium text-slate-800 flex items-center">
                 <User className="w-4 h-4 mr-2 text-slate-400" />
                 {data.judge}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-4">
            <span className="text-xs font-bold text-indigo-700 uppercase flex items-center mb-2">
              <Calendar className="w-3.5 h-3.5 mr-1.5" /> Sự kiện tiếp theo
            </span>
            <div className="text-sm font-bold text-indigo-900 leading-snug">{data.nextEventDescription}</div>
            <div className="text-xs font-bold text-indigo-600 mt-2 bg-white inline-block px-2 py-1 rounded border border-indigo-100 shadow-sm">
                {data.nextEventDate}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Involved Parties Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-5 flex items-center text-sm uppercase tracking-wide">
          <User className="w-5 h-5 mr-2 text-indigo-600" />
          Đương sự
        </h3>
        
        <div className="space-y-6">
          {data.parties.map((party, idx) => (
            <div key={idx} className="relative pl-4 border-l-2 border-slate-100 hover:border-indigo-400 transition-colors group">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{party.role}</div>
              <div className="text-sm font-bold text-slate-900 mb-2">{party.name}</div>
              
              {party.representatives && party.representatives.length > 0 ? (
                <div className="space-y-2 mt-2">
                    {party.representatives.map((rep, rIdx) => (
                        <div key={rIdx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs relative flex items-center justify-between">
                            <div>
                                <div className="font-semibold text-slate-700 flex items-center">
                                    <Scale className="w-3 h-3 mr-1.5 text-slate-400" />
                                    {rep.name}
                                </div>
                                <div className="text-slate-500 ml-4.5 mt-0.5">{rep.type}</div>
                            </div>
                        </div>
                    ))}
                    {party.hasHistory && (
                        <button className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center mt-2 font-semibold hover:bg-indigo-50 px-2 py-1 rounded transition-colors w-fit">
                            <History className="w-3 h-3 mr-1.5" /> Lịch sử ủy quyền
                        </button>
                    )}
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic bg-slate-50 px-2 py-1 rounded inline-block">Vắng mặt/Chưa có ĐD</div>
              )}
            </div>
          ))}
          {data.parties.length === 0 && (
             <div className="text-center text-slate-400 text-xs italic py-2">Đang cập nhật danh sách đương sự</div>
          )}
        </div>
      </div>

      {/* 3. Challenged Decisions Chain */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-5 flex items-center text-sm uppercase tracking-wide">
          <AlertTriangle className="w-5 h-5 mr-2 text-indigo-600" />
          Quyết định bị kiện
        </h3>
        
        {data.challengedActions.length > 0 ? (
            <div className="relative pl-2">
            {data.challengedActions.map((action, idx) => (
                <div key={idx} className="relative pb-8 last:pb-0 group">
                {/* Connector Line */}
                {idx !== data.challengedActions.length - 1 && (
                    <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-slate-100 group-hover:bg-indigo-200 transition-colors"></div>
                )}
                {idx !== data.challengedActions.length - 1 && (
                    <ArrowDown className="absolute left-[7px] top-[calc(100%-12px)] w-2.5 h-2.5 text-slate-300 z-0" />
                )}
                
                <div className="flex items-start">
                    {/* Step Number Bubble */}
                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-colors flex items-center justify-center flex-shrink-0 z-10 font-bold text-[10px] mt-0.5">
                    {action.step}
                    </div>
                    
                    <div className="ml-3 flex-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        {action.docType}
                    </div>
                    <div className="text-sm font-bold text-slate-800 leading-tight mb-1 group-hover:text-indigo-700 transition-colors">
                        {action.docNumber}
                    </div>
                    <div className="flex items-center text-xs text-slate-500">
                        <Building className="w-3 h-3 mr-1 text-slate-400" />
                        {action.issuer}
                    </div>
                    <div className="mt-1.5 text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-100 inline-block px-1.5 py-0.5 rounded">
                        {action.date}
                    </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        ) : (
             <div className="text-center py-4 text-slate-400 flex flex-col items-center">
                 <Ban className="w-6 h-6 mb-2 opacity-50" />
                 <span className="text-xs">Không có dữ liệu về quyết định hành chính bị khiếu kiện.</span>
             </div>
        )}
      </div>
    </div>
  );
};
