
import React, { useState } from 'react';
import { TimelineEvent } from '../types';
import { Gavel, FileText, PauseCircle, AlertCircle, ChevronDown, ChevronUp, ExternalLink, MapPin, ArrowRightCircle, CheckCircle2, Clock, Inbox } from 'lucide-react';

interface CaseTimelineProps {
  events: TimelineEvent[];
}

export const CaseTimeline: React.FC<CaseTimelineProps> = ({ events }) => {
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});

  const toggleEvent = (id: string) => {
    setExpandedEvents(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'TRIAL': return <Gavel className="w-4 h-4 text-white" />;
      case 'DOCUMENT': return <FileText className="w-4 h-4 text-white" />;
      case 'POSTPONEMENT': return <PauseCircle className="w-4 h-4 text-white" />;
      case 'REQUEST': return <ArrowRightCircle className="w-4 h-4 text-white" />;
      case 'ONSITE': return <MapPin className="w-4 h-4 text-white" />;
      default: return <FileText className="w-4 h-4 text-white" />;
    }
  };

  const getEventStyle = (type: string, statusTag?: string) => {
    // Return bg color and ring color
    if (statusTag === 'Quá hạn') return 'bg-rose-500 ring-rose-200';
    if (statusTag === 'Sắp diễn ra') return 'bg-indigo-600 ring-indigo-200';
    
    switch (type) {
      case 'TRIAL': return 'bg-indigo-600 ring-indigo-200';
      case 'POSTPONEMENT': return 'bg-amber-500 ring-amber-200';
      case 'REQUEST': return 'bg-orange-500 ring-orange-200';
      case 'ONSITE': return 'bg-emerald-600 ring-emerald-200';
      default: return 'bg-slate-400 ring-slate-200';
    }
  };

  const getStatusTagColor = (tag?: string) => {
      if (!tag) return 'bg-slate-100 text-slate-600';
      const lower = tag.toLowerCase();
      if (lower.includes('quá hạn') || lower.includes('khẩn')) return 'bg-rose-100 text-rose-700 border border-rose-200';
      if (lower.includes('sắp') || lower.includes('chờ')) return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
      if (lower.includes('hoàn tất') || lower.includes('đã')) return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      return 'bg-slate-100 text-slate-600 border border-slate-200';
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-full">
      <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center">
        <Clock className="w-5 h-5 mr-3 text-indigo-600" />
        Dòng thời gian sự kiện
      </h3>
      
      {events.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-12 text-slate-400">
             <div className="bg-slate-50 p-4 rounded-full mb-3">
                 <Inbox className="w-8 h-8 text-slate-300" />
             </div>
             <p className="text-sm font-medium">Chưa có sự kiện nào được ghi nhận.</p>
         </div>
      ) : (
        <div className="relative pl-4 sm:pl-0">
            <div className="space-y-0">
            {events.map((event, index) => {
                const isExpanded = expandedEvents[event.id];
                const isLast = index === events.length - 1;
                const isUpcoming = event.statusTag === 'Sắp diễn ra';
                const style = getEventStyle(event.type, event.statusTag);
                
                return (
                <div key={event.id} className="relative flex group min-h-[100px]">
                    {/* Connecting Line */}
                    {!isLast && (
                        <div 
                            className={`absolute left-[110px] sm:left-[130px] top-8 bottom-0 w-0.5 -ml-[1px]
                            ${isUpcoming ? 'border-l-2 border-dashed border-indigo-300' : 'bg-slate-200'}`}
                        ></div>
                    )}

                    {/* Date Column (Left) */}
                    <div className="w-[90px] sm:w-[110px] flex-shrink-0 text-right pr-8 pt-1.5">
                    <span className={`text-sm font-bold block ${isUpcoming ? 'text-indigo-600' : 'text-slate-700'}`}>{event.date}</span>
                    {event.time && (
                        <span className="text-xs text-slate-500 font-medium bg-slate-50 px-1.5 py-0.5 rounded inline-block mt-1">{event.time}</span>
                    )}
                    </div>

                    {/* Dot & Icon on Line */}
                    <div className={`absolute left-[110px] sm:left-[130px] -translate-x-1/2 top-1 w-8 h-8 rounded-full flex items-center justify-center z-10 ring-4 shadow-sm transition-all duration-300 group-hover:scale-110 ${style}`}>
                    {getIcon(event.type)}
                    </div>

                    {/* Content Column (Right) */}
                    <div className="flex-1 pl-8 sm:pl-12 pt-0 pb-8">
                    <div 
                        onClick={() => toggleEvent(event.id)}
                        className={`
                            cursor-pointer border rounded-xl p-4 transition-all duration-200 relative
                            ${isUpcoming ? 'bg-indigo-50/30 border-indigo-200 shadow-sm' : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm'}
                            ${isExpanded ? 'bg-slate-50 border-slate-200 ring-1 ring-slate-200' : ''}
                        `}
                    >
                        {/* Arrow pointing to dot */}
                        <div className={`absolute top-3 -left-1.5 w-3 h-3 transform rotate-45 border-l border-b ${isUpcoming ? 'bg-[#F0F4FF] border-indigo-200' : 'bg-white border-transparent group-hover:bg-slate-50 group-hover:border-slate-200'} ${isExpanded ? '!bg-slate-50 !border-slate-200' : ''}`}></div>

                        <div className="flex items-start justify-between relative z-10">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <h4 className={`text-base font-bold ${isUpcoming ? 'text-indigo-900' : 'text-slate-800'}`}>{event.title}</h4>
                                {event.statusTag && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${getStatusTagColor(event.statusTag)}`}>
                                    {event.statusTag}
                                </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-2">{event.summary}</p>
                        </div>
                        
                        <button className={`p-1 rounded-full hover:bg-slate-200 transition-colors ${isExpanded ? 'bg-slate-200' : ''}`}>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </button>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-slate-200 animate-fade-in">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                {event.docNumber && (
                                    <div className="flex items-center text-slate-500 text-xs bg-white p-2 rounded border border-slate-100">
                                        <FileText className="w-3.5 h-3.5 mr-2 text-indigo-500" />
                                        <span>Văn bản: <span className="font-semibold text-slate-700">{event.docNumber}</span></span>
                                    </div>
                                )}
                                {event.statusTag === 'Đã hoàn tất' && (
                                    <div className="flex items-center text-emerald-600 text-xs bg-emerald-50 p-2 rounded border border-emerald-100">
                                        <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                                        <span>Trạng thái: Hoàn thành</span>
                                    </div>
                                )}
                            </div>

                            {event.reason && (
                            <div className="bg-amber-50 border border-amber-100 text-amber-900 p-3 rounded-lg text-sm flex items-start mb-3">
                                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-amber-600" />
                                <div>
                                    <span className="font-bold block text-amber-700 text-xs uppercase mb-0.5">Lý do hoãn/thay đổi:</span>
                                    {event.reason}
                                </div>
                            </div>
                            )}
                            
                            {event.documentLink && (
                            <div className="flex justify-end">
                                <a href={event.documentLink} className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors">
                                    Xem văn bản chi tiết
                                    <ExternalLink className="w-3 h-3 ml-1.5" />
                                </a>
                            </div>
                            )}
                        </div>
                        )}
                    </div>
                    </div>
                </div>
                );
            })}
            </div>
        </div>
      )}
    </div>
  );
};
