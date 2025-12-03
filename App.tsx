
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { CaseCard } from './components/CaseCard';
import { CaseGroupCard } from './components/CaseGroupCard';
import { AIAssistant } from './components/AIAssistant';
import { CaseDetailView } from './components/CaseDetailView';
import { LoginPage } from './components/LoginPage';
import { AdminPanel } from './components/AdminPanel';
import { CaseStatus, CaseType, SearchFilters, Case, CaseGroup, CaseDetail, User } from './types';
import { Search, Loader2, LayoutGrid, ListFilter, Filter } from 'lucide-react';
import { caseService } from './services/caseService';
import { authService } from './services/authService';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);

  // Application Data State
  const [cases, setCases] = useState<Case[]>([]);
  const [groups, setGroups] = useState<CaseGroup[]>([]);
  const [selectedCaseDetail, setSelectedCaseDetail] = useState<CaseDetail | null>(null);
  
  // UI State
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false); // New state for admin view
  
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setSelectedCaseId(null);
    setShowAdminPanel(false);
  };

  // Initial Data Fetch
  useEffect(() => {
    if (!user) return; 

    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [casesData, groupsData] = await Promise.all([
          caseService.getAllCases(),
          caseService.getCaseGroups()
        ]);
        setCases(casesData);
        setGroups(groupsData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user, refreshTrigger]);

  // Fetch detail when selectedCaseId changes
  useEffect(() => {
    if (!user) return;

    const loadDetail = async () => {
      if (!selectedCaseId) {
        setSelectedCaseDetail(null);
        return;
      }

      setIsDetailLoading(true);
      try {
        const detail = await caseService.getCaseDetailById(selectedCaseId);
        setSelectedCaseDetail(detail);
      } catch (error) {
        console.error("Failed to load case detail", error);
      } finally {
        setIsDetailLoading(false);
      }
    };

    loadDetail();
  }, [selectedCaseId, user]);

  const refreshData = () => {
      setRefreshTrigger(prev => prev + 1);
      if(selectedCaseId) {
          setIsDetailLoading(true);
          caseService.getCaseDetailById(selectedCaseId)
            .then(detail => setSelectedCaseDetail(detail))
            .finally(() => setIsDetailLoading(false));
      }
  };

  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'ALL',
    court: 'ALL',
    status: 'ALL',
  });

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const matchQuery =
        item.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        item.caseNumber.toLowerCase().includes(filters.query.toLowerCase()) ||
        item.court.toLowerCase().includes(filters.query.toLowerCase());
      
      const matchType = filters.type === 'ALL' || item.type === filters.type;
      const matchCourt = filters.court === 'ALL' || item.court === filters.court;
      const matchStatus = filters.status === 'ALL' || item.status === filters.status;

      return matchQuery && matchType && matchCourt && matchStatus;
    });
  }, [filters, cases]);

  const filteredGroups = useMemo(() => {
     return groups.filter(g => 
        g.name.toLowerCase().includes(filters.query.toLowerCase()) && 
        (filters.type === 'ALL' || g.type === filters.type)
     );
  }, [filters, groups]);

  const contextData = useMemo(() => {
    if (selectedCaseDetail) {
      return `Đang xem chi tiết vụ án: ${selectedCaseDetail.title}. Số thụ lý: ${selectedCaseDetail.caseNumber}. Trạng thái: ${selectedCaseDetail.status}. Sự kiện tiếp theo: ${selectedCaseDetail.nextEventDescription} vào ngày ${selectedCaseDetail.nextEventDate}.`;
    }
    const summary = filteredCases.map(c => `Vụ án: ${c.title} (${c.status}) - ${c.court}`).join('; ');
    const groupSummary = filteredGroups.map(g => `Nhóm vụ án: ${g.name} (${g.caseCount} vụ)`).join('; ');
    return `Danh sách vụ án đang hiển thị: ${summary}. ${groupSummary}`;
  }, [filteredCases, filteredGroups, selectedCaseDetail]);

  const handleCaseSelect = (id: string) => {
    setSelectedCaseId(id);
    setShowAdminPanel(false);
    window.scrollTo(0, 0);
  };

  const handleDeleteCase = async (id: string) => {
      if (window.confirm('Bạn có chắc chắn muốn xóa vụ án này? Hành động này không thể hoàn tác.')) {
          try {
              await caseService.deleteCase(id);
              // Trigger refresh to reload list from storage
              refreshData();
          } catch (error) {
              console.error("Delete error", error);
              alert("Xóa thất bại. Vui lòng thử lại.");
          }
      }
  };

  const handleBack = () => {
    setSelectedCaseId(null);
    setShowAdminPanel(false);
  };
  
  const handleReset = () => {
      setSelectedCaseId(null);
      setShowAdminPanel(false);
      setFilters({
        query: '',
        type: 'ALL',
        court: 'ALL',
        status: 'ALL',
      });
  };

  const handleGroupSelect = (group: CaseGroup) => {
    setFilters(prev => ({ ...prev, type: group.type }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const toggleAdminPanel = () => {
      setShowAdminPanel(!showAdminPanel);
      setSelectedCaseId(null); // Close case detail if open
  }

  // --- VIEW RENDERING ---

  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-inter">
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onOpenAdmin={user.role === 'ADMIN' ? toggleAdminPanel : undefined}
        onReset={handleReset}
      />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* VIEW: Loading State */}
        {isLoading && !selectedCaseId && !showAdminPanel && (
            <div className="flex flex-col items-center justify-center h-96">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Đang tải dữ liệu vụ án...</p>
            </div>
        )}

        {/* VIEW: Admin Panel */}
        {showAdminPanel && user.role === 'ADMIN' && (
            <div className="animate-fade-in">
                 <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-800">Quản trị Hệ thống</h2>
                    <button onClick={() => setShowAdminPanel(false)} className="text-indigo-600 font-bold hover:underline">
                        Quay lại Trang chủ
                    </button>
                 </div>
                 <AdminPanel />
            </div>
        )}

        {/* VIEW: Case Detail */}
        {!showAdminPanel && !isLoading && selectedCaseId && (
            isDetailLoading || !selectedCaseDetail ? (
                <div className="flex flex-col items-center justify-center h-96 animate-fade-in">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Đang tải chi tiết hồ sơ...</p>
                </div>
            ) : (
                <CaseDetailView 
                    data={selectedCaseDetail} 
                    user={user}
                    onBack={handleBack} 
                    onUpdate={refreshData}
                />
            )
        )}

        {/* VIEW: Dashboard */}
        {!showAdminPanel && !isLoading && !selectedCaseId && (
          <div className="animate-fade-in">
            {/* Search & Filter Section */}
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 mb-10 max-w-4xl mx-auto sticky top-20 z-30 ring-1 ring-slate-900/5">
              <div className="flex flex-col md:flex-row">
                 <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-4 bg-transparent border-0 focus:ring-0 placeholder-slate-400 text-slate-700 text-base"
                    placeholder="Tìm theo tên đương sự, số thụ lý, số văn bản..."
                    value={filters.query}
                    onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                  />
                </div>
                <div className="flex items-center px-2 py-2 md:border-l border-slate-100 gap-2">
                     <div className="relative">
                        <select
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value as CaseStatus | 'ALL'})}
                        className="block w-full md:w-48 pl-3 pr-8 py-2.5 text-sm text-slate-600 border-none bg-slate-50 rounded-xl focus:ring-0 cursor-pointer hover:bg-slate-100 transition-colors appearance-none font-medium"
                        >
                        <option value="ALL">Tất cả trạng thái</option>
                        {Object.values(CaseStatus).map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                        </select>
                        <ListFilter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                     </div>
                     <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 flex items-center whitespace-nowrap">
                      Tìm kiếm
                    </button>
                </div>
              </div>
            </div>

            {/* Quick Filters Row */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
                 <button 
                    onClick={() => setFilters({...filters, type: 'ALL'})}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filters.type === 'ALL' ? 'bg-slate-800 text-white shadow-lg shadow-slate-300 ring-2 ring-slate-800 ring-offset-2' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200 shadow-sm'}`}
                 >
                    Tất cả
                 </button>
                 {Object.values(CaseType).map((type) => (
                    <button 
                        key={type}
                         onClick={() => setFilters({...filters, type: type as CaseType})}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filters.type === type ? 'bg-slate-800 text-white shadow-lg shadow-slate-300 ring-2 ring-slate-800 ring-offset-2' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200 shadow-sm'}`}
                    >
                        {type}
                    </button>
                  ))}
            </div>

            {/* Dashboard Content Container */}
            <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-200 overflow-hidden">
              
              {/* Results Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                   <div>
                      <h2 className="text-lg font-bold text-slate-800">Kết quả tra cứu</h2>
                      <p className="text-slate-500 text-xs font-medium mt-0.5">Danh sách hồ sơ phù hợp với bộ lọc</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 shadow-sm">
                        {filteredCases.length + filteredGroups.length} Hồ sơ
                    </span>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-lg border border-slate-100 hidden md:block">
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                </div>
              </div>

              {/* Grid Area */}
              <div className="p-6 md:p-8 bg-slate-50/50 min-h-[400px]">
                  {filteredCases.length === 0 && filteredGroups.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 h-full">
                          <div className="bg-slate-50 p-6 rounded-full mb-4 shadow-sm">
                             <Filter className="w-10 h-10 text-slate-300" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-700">Không tìm thấy kết quả</h3>
                          <p className="text-slate-500 text-sm mt-1 max-w-xs text-center">Chúng tôi không tìm thấy vụ án nào khớp với từ khóa hoặc bộ lọc hiện tại.</p>
                          <button 
                              onClick={() => setFilters({query: '', type: 'ALL', court: 'ALL', status: 'ALL'})}
                              className="mt-6 text-indigo-600 font-bold hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-6 py-2.5 rounded-xl transition-all text-sm shadow-sm"
                          >
                              Xóa bộ lọc & Tìm lại
                          </button>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGroups.map((group) => (
                            <CaseGroupCard 
                              key={group.id} 
                              data={group} 
                              onClick={() => handleGroupSelect(group)}
                            />
                        ))}

                        {filteredCases.map((item) => (
                            <CaseCard 
                              key={item.id} 
                              data={item} 
                              onClick={() => handleCaseSelect(item.id)}
                              canDelete={user.role === 'ADMIN'}
                              onDelete={handleDeleteCase}
                            />
                        ))}
                      </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </main>
      
      <AIAssistant contextData={contextData} />
    </div>
  );
};

export default App;
