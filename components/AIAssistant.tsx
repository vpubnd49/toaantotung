import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { generateLegalAnalysis } from '../services/geminiService';

interface AIAssistantProps {
  contextData: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ contextData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setResponse('');
    
    try {
        const result = await generateLegalAnalysis(query, contextData);
        setResponse(result);
    } catch (e) {
        setResponse("Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu này.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all duration-200 z-40 group flex items-center ring-4 ring-white/50"
      >
        <Sparkles className="w-6 h-6 mr-2 group-hover:animate-pulse" />
        <span className="font-medium pr-1">Trợ lý AI</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh] animate-fade-in border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-indigo-50 flex justify-between items-center bg-indigo-600 text-white">
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 p-1.5 rounded-lg">
                   <Sparkles className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="font-bold text-sm">Trợ lý Pháp lý</h3>
                   <p className="text-[10px] text-indigo-100 font-medium opacity-90">Powered by Gemini AI</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-5 flex-1 overflow-y-auto bg-slate-50 min-h-[300px]">
              {response ? (
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">Câu trả lời từ AI</h4>
                  <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {response}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
                    <div className="bg-indigo-50 p-4 rounded-full">
                        <MessageSquare className="w-8 h-8 text-indigo-400" />
                    </div>
                    <p className="text-sm text-slate-500 max-w-[250px]">
                        Đặt câu hỏi về các vụ án hiện tại, thủ tục tố tụng hoặc tra cứu văn bản pháp luật.
                    </p>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Hỏi về vụ án này..."
                  className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm transition-all"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};