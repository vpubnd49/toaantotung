
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';
import { cloudService, isCloudEnabled } from '../services/firebaseService';
import { Users, Upload, Download, RefreshCw, CheckCircle, AlertTriangle, Cloud, Plus, ArrowRight, Database } from 'lucide-react';
import { caseService } from '../services/caseService';
import { CaseType, CaseStatus } from '../types';
import { FIREBASE_CONFIG } from '../firebaseConfig';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'USERS' | 'DATA' | 'CLOUD'>('USERS');
  const [users, setUsers] = useState<User[]>([]);
  const [importStatus, setImportStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null);
  
  // Cloud Config State
  const [isCloudActive, setIsCloudActive] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  // Create Case State
  const [isCreating, setIsCreating] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState('');

  useEffect(() => {
    setUsers(storageService.getUsers());
    setIsCloudActive(isCloudEnabled());
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await storageService.importData(file);
      setImportStatus({ type: 'success', msg: 'Nhập dữ liệu thành công! (Lưu ý: Dữ liệu này chỉ vào LocalStorage. Hãy dùng nút Đồng bộ để đẩy lên Cloud)' });
    } catch (err) {
      setImportStatus({ type: 'error', msg: 'Lỗi: File không hợp lệ hoặc cấu trúc sai.' });
    }
  };

  const handleSyncToCloud = async () => {
      if (!isCloudActive) return;
      if (!window.confirm("Hành động này sẽ lấy dữ liệu mẫu (hoặc dữ liệu từ file bạn vừa import) và GHI ĐÈ lên Database Firebase của bạn. Bạn có chắc chắn không?")) return;
      
      setSyncStatus('Đang đồng bộ...');
      try {
          const cases = storageService.getCases();
          const groups = storageService.getGroups();
          const details = storageService.getCaseDetails();
          await cloudService.migrateToCloud(cases, groups, details);
          setSyncStatus('Đồng bộ thành công! Hãy tải lại trang để xem dữ liệu từ Cloud.');
      } catch (e) {
          console.error(e);
          setSyncStatus('Lỗi đồng bộ. Vui lòng kiểm tra console.');
      }
  };

  const handleCreateCase = async () => {
      if(!newCaseTitle.trim()) return;
      
      const newCase = {
          id: `case_${Date.now()}`,
          title: newCaseTitle,
          caseNumber: 'Đang cập nhật',
          court: 'Đang cập nhật',
          status: CaseStatus.PENDING,
          type: CaseType.CIVIL,
          date: new Date().toLocaleDateString('en-GB')
      };

      try {
          await caseService.createCase(newCase);
          alert("Tạo vụ án mới thành công!");
          setNewCaseTitle('');
          setIsCreating(false);
          window.location.reload();
      } catch (e) {
          alert("Lỗi khi tạo vụ án.");
      }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in min-h-[500px]">
      <div className="flex border-b border-slate-100 overflow-x-auto">
        <button 
            onClick={() => setActiveTab('USERS')}
            className={`flex-1 min-w-[140px] py-4 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'USERS' ? 'border-indigo-600 text-indigo-700 bg-indigo-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
        >
            <Users className="w-4 h-4 inline-block mr-2" />
            Thành viên
        </button>
        <button 
            onClick={() => setActiveTab('DATA')}
            className={`flex-1 min-w-[140px] py-4 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'DATA' ? 'border-indigo-600 text-indigo-700 bg-indigo-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
        >
            <RefreshCw className="w-4 h-4 inline-block mr-2" />
            Dữ liệu
        </button>
        <button 
            onClick={() => setActiveTab('CLOUD')}
            className={`flex-1 min-w-[140px] py-4 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'CLOUD' ? 'border-indigo-600 text-indigo-700 bg-indigo-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
        >
            <Cloud className="w-4 h-4 inline-block mr-2 text-emerald-500" />
            Kết nối Cloud
        </button>
      </div>

      <div className="p-8">
        {/* --- TAB: USERS --- */}
        {activeTab === 'USERS' && (
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-6">Danh sách tài khoản hệ thống</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                                <th className="p-4 font-bold rounded-tl-lg">Họ tên</th>
                                <th className="p-4 font-bold">Tên đăng nhập</th>
                                <th className="p-4 font-bold">Vai trò</th>
                                <th className="p-4 font-bold rounded-tr-lg">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {users.map((u, idx) => (
                                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-medium text-slate-800 flex items-center">
                                        <img src={u.avatarUrl} className="w-8 h-8 rounded-full mr-3 border border-slate-200 bg-white" alt="" />
                                        {u.fullName}
                                    </td>
                                    <td className="p-4 text-slate-600 font-mono">{u.username}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="flex items-center text-emerald-600 text-xs font-bold">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                                            Hoạt động
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* --- TAB: DATA --- */}
        {activeTab === 'DATA' && (
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Section: Create New Case */}
                <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                        <Plus className="w-5 h-5 mr-2 text-indigo-600" />
                        Tạo vụ án mới
                    </h3>
                    
                    {!isCreating ? (
                        <button 
                            onClick={() => setIsCreating(true)}
                            className="w-full py-3 border-2 border-dashed border-indigo-300 rounded-xl text-indigo-600 font-bold hover:bg-indigo-50 hover:border-indigo-400 transition-all"
                        >
                            + Nhấn vào đây để thêm vụ án trống
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <input 
                                type="text"
                                value={newCaseTitle}
                                onChange={(e) => setNewCaseTitle(e.target.value)}
                                placeholder="Nhập tên vụ án mới..."
                                className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            <button 
                                onClick={handleCreateCase}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 shadow-sm"
                            >
                                Tạo ngay
                            </button>
                            <button 
                                onClick={() => setIsCreating(false)}
                                className="bg-white text-slate-500 border border-slate-300 px-4 py-2 rounded-xl font-bold hover:bg-slate-50"
                            >
                                Hủy
                            </button>
                        </div>
                    )}
                </div>

                <div className="border-t border-slate-200 my-6"></div>

                {/* Section: Import/Export */}
                <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Công cụ Dữ liệu Local</h3>
                    <p className="text-slate-500 text-sm">Dùng để Import dữ liệu từ file vào bộ nhớ tạm trước khi đẩy lên Cloud.</p>
                </div>

                {importStatus && (
                    <div className={`p-4 rounded-xl border flex items-center ${importStatus.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                         {importStatus.type === 'success' ? <CheckCircle className="w-5 h-5 mr-3" /> : <AlertTriangle className="w-5 h-5 mr-3" />}
                         <span className="font-medium text-sm">{importStatus.msg}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group cursor-pointer relative">
                         <input 
                            type="file" 
                            accept=".json" 
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                         <div className="bg-indigo-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                             <Upload className="w-8 h-8 text-indigo-600" />
                         </div>
                         <h4 className="font-bold text-slate-700 mb-1">Import JSON</h4>
                         <p className="text-xs text-slate-500 text-center">Nạp dữ liệu vào bộ nhớ tạm</p>
                    </div>

                    <div 
                        onClick={storageService.exportData}
                        className="border-2 border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group cursor-pointer"
                    >
                         <div className="bg-emerald-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                             <Download className="w-8 h-8 text-emerald-600" />
                         </div>
                         <h4 className="font-bold text-slate-700 mb-1">Export JSON</h4>
                         <p className="text-xs text-slate-500 text-center">Sao lưu dữ liệu hiện tại</p>
                    </div>
                </div>
            </div>
        )}

        {/* --- TAB: CLOUD CONFIG --- */}
        {activeTab === 'CLOUD' && (
            <div className="max-w-3xl mx-auto">
                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800">Thông tin kết nối Cloud (Firebase)</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${isCloudActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                            {isCloudActive ? 'Đã kết nối' : 'Lỗi kết nối'}
                        </span>
                     </div>
                     
                     <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
                        <div className="grid grid-cols-2 gap-4 text-xs font-mono text-slate-600">
                            <div>
                                <span className="block text-slate-400 font-bold uppercase mb-1">Project ID</span>
                                {FIREBASE_CONFIG.projectId}
                            </div>
                            <div>
                                <span className="block text-slate-400 font-bold uppercase mb-1">Storage Bucket</span>
                                {FIREBASE_CONFIG.storageBucket}
                            </div>
                            <div className="col-span-2 border-t border-slate-100 pt-2 mt-2 text-indigo-600 italic">
                                * Cấu hình đã được tích hợp cứng vào ứng dụng (Hardcoded).
                            </div>
                        </div>
                     </div>

                     <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                         <div className="flex items-start mb-4">
                             <Database className="w-6 h-6 text-indigo-600 mr-3 mt-1" />
                             <div>
                                 <h4 className="font-bold text-indigo-900">Khởi tạo dữ liệu Cloud</h4>
                                 <p className="text-sm text-indigo-700 mt-1">
                                     Nếu database Firebase của bạn còn trống, hãy dùng nút bên dưới để đẩy toàn bộ dữ liệu mẫu (hoặc dữ liệu từ file bạn vừa import) lên Cloud.
                                 </p>
                             </div>
                         </div>
                         
                         <button 
                            onClick={handleSyncToCloud}
                            className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center"
                        >
                            <ArrowRight className="w-4 h-4 mr-2" /> 
                            Đồng bộ: Đẩy dữ liệu Local lên Cloud
                        </button>
                        
                        {syncStatus && (
                            <div className="mt-3 text-center text-sm font-bold text-indigo-600 bg-white p-2 rounded border border-indigo-100 animate-fade-in">
                                {syncStatus}
                            </div>
                        )}
                     </div>
                 </div>
            </div>
        )}
      </div>
    </div>
  );
};
