
import React, { useState, useEffect } from 'react';
import { CaseDetail, User, CaseStatus, Party, TimelineEvent, Representative } from '../types';
import { CaseTimeline } from './CaseTimeline';
import { CaseSidebar } from './CaseSidebar';
import { ArrowLeft, Clock, Files, FileText, Download, Edit, Save, X, Loader2, Plus, Trash2, UserPlus, GripVertical, Calendar, Building, AlertCircle } from 'lucide-react';
import { caseService } from '../services/caseService';

interface CaseDetailViewProps {
  data: CaseDetail;
  user: User;
  onBack: () => void;
  onUpdate: () => void;
}

type EditTab = 'GENERAL' | 'PARTIES' | 'TIMELINE' | 'DOCUMENTS';

export const CaseDetailView: React.FC<CaseDetailViewProps> = ({ data, user, onBack, onUpdate }) => {
  const [viewTab, setViewTab] = useState<'TIMELINE' | 'DOCUMENTS'>('TIMELINE');
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editTab, setEditTab] = useState<EditTab>('GENERAL');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CaseDetail>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const canEdit = user.role === 'ADMIN';

  const handleSave = async () => {
    setIsSaving(true);
    try {
        await caseService.updateCaseDetail(formData);
        setIsEditing(false);
        onUpdate();
    } catch (error) {
        console.error("Save failed", error);
        alert("Lưu thất bại. Vui lòng thử lại.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
    setEditTab('GENERAL');
  };

  // --- Form Helper Functions ---

  const updateField = (field: keyof CaseDetail, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Parties Helpers
  const updateParty = (index: number, field: keyof Party, value: any) => {
    const newParties = [...formData.parties];
    newParties[index] = { ...newParties[index], [field]: value };
    updateField('parties', newParties);
  };
  
  const addParty = () => {
    const newParty: Party = { role: 'Đương sự mới', name: '', representatives: [] };
    updateField('parties', [...formData.parties, newParty]);
  };

  const removeParty = (index: number) => {
    const newParties = formData.parties.filter((_, i) => i !== index);
    updateField('parties', newParties);
  };

  const addRepresentative = (partyIndex: number) => {
     const newParties = [...formData.parties];
     const newRep: Representative = { name: '', type: 'Ủy quyền' };
     newParties[partyIndex].representatives = [...newParties[partyIndex].representatives, newRep];
     updateField('parties', newParties);
  };

  const updateRepresentative = (partyIndex: number, repIndex: number, field: keyof Representative, value: string) => {
    const newParties = [...formData.parties];
    newParties[partyIndex].representatives[repIndex] = { 
        ...newParties[partyIndex].representatives[repIndex], 
        [field]: value 
    };
    updateField('parties', newParties);
  };

  const removeRepresentative = (partyIndex: number, repIndex: number) => {
    const newParties = [...formData.parties];
    newParties[partyIndex].representatives = newParties[partyIndex].representatives.filter((_, i) => i !== repIndex);
    updateField('parties', newParties);
  };

  // Timeline Helpers
  const updateEvent = (index: number, field: keyof TimelineEvent, value: any) => {
    const newTimeline = [...formData.timeline];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    updateField('timeline', newTimeline);
  };

  const addEvent = () => {
    const newEvent: TimelineEvent = {
        id: `evt_${Date.now()}`,
        date: new Date().toLocaleDateString('en-GB'),
        type: 'DOCUMENT',
        title: 'Sự kiện mới',
        summary: ''
    };
    // Add to beginning of list
    updateField('timeline', [newEvent, ...formData.timeline]);
  };

  const removeEvent = (index: number) => {
    const newTimeline = formData.timeline.filter((_, i) => i !== index);
    updateField('timeline', newTimeline);
  };

  // Document Helpers
  const addDocument = () => {
      const newDoc = { title: 'Tài liệu mới', date: new Date().toLocaleDateString('en-GB'), type: 'Khác' };
      updateField('documents', [newDoc, ...formData.documents]);
  };

  const updateDocument = (index: number, field: string, value: string) => {
      const newDocs = [...formData.documents];
      // @ts-ignore
      newDocs[index] = { ...newDocs[index], [field]: value };
      updateField('documents', newDocs);
  };

  const removeDocument = (index: number) => {
      const newDocs = formData.documents.filter((_, i) => i !== index);
      updateField('documents', newDocs);
  };

  // --- RENDERERS ---

  const renderEditHeader = () => (
    <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-indigo-100 shadow-sm sticky top-20 z-30">
        <div className="flex items-center">
            <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                <Edit className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
                <h2 className="text-lg font-bold text-slate-800">Chỉnh sửa hồ sơ vụ án</h2>
                <p className="text-xs text-slate-500">Đang cập nhật dữ liệu với quyền Quản trị viên</p>
            </div>
        </div>
        <div className="flex space-x-3">
            <button 
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all text-sm font-bold"
            >
                <X className="w-4 h-4 mr-2" />
                Hủy bỏ
            </button>
            <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all text-sm font-bold"
            >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Lưu thay đổi
            </button>
        </div>
    </div>
  );

  const renderEditTabs = () => (
    <div className="flex space-x-1 mb-6 bg-slate-200/50 p-1 rounded-xl w-fit">
        {(['GENERAL', 'PARTIES', 'TIMELINE', 'DOCUMENTS'] as EditTab[]).map((tab) => (
            <button
                key={tab}
                onClick={() => setEditTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    editTab === tab 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
            >
                {tab === 'GENERAL' && 'Thông tin chung'}
                {tab === 'PARTIES' && 'Đương sự'}
                {tab === 'TIMELINE' && 'Dòng thời gian'}
                {tab === 'DOCUMENTS' && 'Tài liệu'}
            </button>
        ))}
    </div>
  );

  // --- MAIN EDIT FORM CONTENT ---

  if (isEditing) {
    return (
        <div className="animate-fade-in pb-20">
            {renderEditHeader()}
            
            <div className="max-w-5xl mx-auto">
                {renderEditTabs()}

                {/* TAB: GENERAL */}
                {editTab === 'GENERAL' && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8 animate-fade-in">
                        <section>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4 border-b border-slate-100 pb-2">Thông tin cơ bản</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Tên vụ án</label>
                                    <input 
                                        type="text" 
                                        value={formData.title}
                                        onChange={(e) => updateField('title', e.target.value)}
                                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Số thụ lý</label>
                                    <input 
                                        type="text" 
                                        value={formData.caseNumber}
                                        onChange={(e) => updateField('caseNumber', e.target.value)}
                                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Tòa án</label>
                                    <input 
                                        type="text" 
                                        value={formData.court}
                                        onChange={(e) => updateField('court', e.target.value)}
                                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Thẩm phán</label>
                                    <input 
                                        type="text" 
                                        value={formData.judge}
                                        onChange={(e) => updateField('judge', e.target.value)}
                                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Trạng thái hiện tại</label>
                                    <select 
                                        value={formData.status}
                                        onChange={(e) => updateField('status', e.target.value)}
                                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                                    >
                                        {Object.values(CaseStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4 border-b border-slate-100 pb-2">Sự kiện tiếp theo</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
                                <div>
                                    <label className="block text-xs font-bold text-indigo-900 mb-1.5">Ngày diễn ra</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-indigo-400" />
                                        <input 
                                            type="text" 
                                            value={formData.nextEventDate}
                                            onChange={(e) => updateField('nextEventDate', e.target.value)}
                                            placeholder="DD/MM/YYYY"
                                            className="w-full pl-9 p-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-indigo-900 mb-1.5">Mô tả sự kiện</label>
                                    <input 
                                        type="text" 
                                        value={formData.nextEventDescription}
                                        onChange={(e) => updateField('nextEventDescription', e.target.value)}
                                        className="w-full p-2.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {/* TAB: PARTIES */}
                {editTab === 'PARTIES' && (
                    <div className="space-y-4 animate-fade-in">
                         <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-bold text-slate-500 uppercase">Danh sách đương sự</h3>
                            <button onClick={addParty} className="flex items-center text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                                <Plus className="w-3.5 h-3.5 mr-1.5" /> Thêm đương sự
                            </button>
                        </div>
                        {formData.parties.map((party, pIdx) => (
                            <div key={pIdx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group">
                                <button onClick={() => removeParty(pIdx)} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors p-1">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="md:col-span-1">
                                         <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Vai trò</label>
                                         <input 
                                            value={party.role} 
                                            onChange={(e) => updateParty(pIdx, 'role', e.target.value)}
                                            className="w-full p-2 border border-slate-200 rounded bg-slate-50 text-sm font-bold text-slate-700 focus:bg-white focus:border-indigo-400 focus:outline-none transition-colors"
                                            placeholder="VD: Nguyên đơn"
                                         />
                                    </div>
                                    <div className="md:col-span-2">
                                         <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Họ và tên / Tên tổ chức</label>
                                         <input 
                                            value={party.name} 
                                            onChange={(e) => updateParty(pIdx, 'name', e.target.value)}
                                            className="w-full p-2 border border-slate-200 rounded bg-slate-50 text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-400 focus:outline-none transition-colors"
                                            placeholder="Nhập tên..."
                                         />
                                    </div>
                                </div>

                                <div className="pl-4 border-l-2 border-slate-100">
                                    <div className="flex items-center mb-2">
                                        <span className="text-xs font-semibold text-slate-500 mr-3">Người đại diện</span>
                                        <button onClick={() => addRepresentative(pIdx)} className="text-[10px] text-indigo-600 font-bold hover:underline flex items-center">
                                            <Plus className="w-3 h-3 mr-1" /> Thêm
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {party.representatives.map((rep, rIdx) => (
                                            <div key={rIdx} className="flex gap-2 items-center">
                                                <input 
                                                    value={rep.name}
                                                    onChange={(e) => updateRepresentative(pIdx, rIdx, 'name', e.target.value)}
                                                    className="flex-grow p-1.5 text-xs border border-slate-200 rounded"
                                                    placeholder="Tên người đại diện"
                                                />
                                                <input 
                                                    value={rep.type}
                                                    onChange={(e) => updateRepresentative(pIdx, rIdx, 'type', e.target.value)}
                                                    className="w-32 p-1.5 text-xs border border-slate-200 rounded"
                                                    placeholder="Loại đại diện"
                                                />
                                                <button onClick={() => removeRepresentative(pIdx, rIdx)} className="text-slate-400 hover:text-rose-500">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* TAB: TIMELINE */}
                {editTab === 'TIMELINE' && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-bold text-slate-500 uppercase">Diễn biến vụ án</h3>
                            <button onClick={addEvent} className="flex items-center text-xs font-bold text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                                <Plus className="w-3.5 h-3.5 mr-1.5" /> Thêm sự kiện mới
                            </button>
                        </div>
                        {formData.timeline.map((event, idx) => (
                             <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 relative">
                                <button onClick={() => removeEvent(idx)} className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 p-1">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                
                                <div className="w-full md:w-48 space-y-3 flex-shrink-0">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ngày diễn ra</label>
                                        <input 
                                            value={event.date}
                                            onChange={(e) => updateEvent(idx, 'date', e.target.value)}
                                            className="w-full p-2 border border-slate-200 rounded text-sm font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Loại sự kiện</label>
                                        <select 
                                            value={event.type}
                                            onChange={(e) => updateEvent(idx, 'type', e.target.value)}
                                            className="w-full p-2 border border-slate-200 rounded text-sm bg-slate-50"
                                        >
                                            <option value="TRIAL">Xét xử</option>
                                            <option value="DOCUMENT">Văn bản</option>
                                            <option value="POSTPONEMENT">Tạm hoãn</option>
                                            <option value="REQUEST">Yêu cầu</option>
                                            <option value="ONSITE">Thẩm định tại chỗ</option>
                                        </select>
                                    </div>
                                     <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Giờ (nếu có)</label>
                                        <input 
                                            value={event.time || ''}
                                            onChange={(e) => updateEvent(idx, 'time', e.target.value)}
                                            className="w-full p-2 border border-slate-200 rounded text-sm"
                                            placeholder="--:--"
                                        />
                                    </div>
                                </div>

                                <div className="flex-grow space-y-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tiêu đề sự kiện</label>
                                        <input 
                                            value={event.title}
                                            onChange={(e) => updateEvent(idx, 'title', e.target.value)}
                                            className="w-full p-2 border border-slate-200 rounded text-sm font-bold text-indigo-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tóm tắt nội dung</label>
                                        <textarea 
                                            value={event.summary}
                                            onChange={(e) => updateEvent(idx, 'summary', e.target.value)}
                                            className="w-full p-2 border border-slate-200 rounded text-sm h-20 resize-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                         <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Số văn bản</label>
                                            <input 
                                                value={event.docNumber || ''}
                                                onChange={(e) => updateEvent(idx, 'docNumber', e.target.value)}
                                                className="w-full p-2 border border-slate-200 rounded text-xs"
                                            />
                                        </div>
                                         <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Trạng thái (Tag)</label>
                                            <input 
                                                value={event.statusTag || ''}
                                                onChange={(e) => updateEvent(idx, 'statusTag', e.target.value)}
                                                className="w-full p-2 border border-slate-200 rounded text-xs"
                                                placeholder="VD: Sắp diễn ra"
                                            />
                                        </div>
                                    </div>
                                </div>
                             </div>
                        ))}
                    </div>
                )}

                 {/* TAB: DOCUMENTS */}
                 {editTab === 'DOCUMENTS' && (
                    <div className="space-y-4 animate-fade-in">
                         <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-bold text-slate-500 uppercase">Thư viện tài liệu</h3>
                            <button onClick={addDocument} className="flex items-center text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                                <Plus className="w-3.5 h-3.5 mr-1.5" /> Thêm tài liệu
                            </button>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                             <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tên tài liệu</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-40">Loại</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Ngày BH</th>
                                        <th className="px-6 py-3 text-right w-20"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {formData.documents.map((doc, idx) => (
                                        <tr key={idx}>
                                            <td className="px-6 py-4">
                                                <input 
                                                    value={doc.title}
                                                    onChange={(e) => updateDocument(idx, 'title', e.target.value)}
                                                    className="w-full p-1.5 border border-slate-200 rounded text-sm font-medium"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input 
                                                    value={doc.type}
                                                    onChange={(e) => updateDocument(idx, 'type', e.target.value)}
                                                    className="w-full p-1.5 border border-slate-200 rounded text-sm text-slate-600"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input 
                                                    value={doc.date}
                                                    onChange={(e) => updateDocument(idx, 'date', e.target.value)}
                                                    className="w-full p-1.5 border border-slate-200 rounded text-sm text-slate-600"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                 <button onClick={() => removeDocument(idx)} className="text-slate-400 hover:text-rose-500 p-2">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                             {formData.documents.length === 0 && (
                                 <div className="p-8 text-center text-slate-400 text-sm">Chưa có tài liệu nào.</div>
                             )}
                        </div>
                    </div>
                 )}
            </div>
        </div>
    );
  }

  // --- VIEW MODE RENDER ---

  return (
    <div className="animate-fade-in pb-10">
      {/* Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div className="flex-1">
             <button 
                onClick={onBack}
                className="group flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors px-3 py-2 -ml-3 rounded-lg hover:bg-indigo-50 w-fit mb-2"
            >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Quay lại danh sách
            </button>
            <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                    {data.title}
                </h1>
                {canEdit && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex-shrink-0 flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors text-xs font-bold"
                    >
                        <Edit className="w-3.5 h-3.5 mr-1.5" />
                        Sửa hồ sơ
                    </button>
                )}
            </div>
            
            <p className="text-sm text-slate-500 flex items-center font-medium mt-2">
                <Clock className="w-3.5 h-3.5 mr-2 text-indigo-500" />
                Cập nhật lần cuối: <span className="text-slate-700 ml-1">{data.date}</span>
            </p>
        </div>
        
        {/* View Toggle Tabs */}
        <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm self-start">
            <button
                onClick={() => setViewTab('TIMELINE')}
                className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-lg transition-all ${
                    viewTab === 'TIMELINE' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
            >
                <Clock className="w-4 h-4 mr-2" />
                Diễn biến
            </button>
            <button
                onClick={() => setViewTab('DOCUMENTS')}
                className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-lg transition-all ${
                    viewTab === 'DOCUMENTS' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
            >
                <Files className="w-4 h-4 mr-2" />
                Thư viện
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Main Content (70%) */}
        <div className="lg:col-span-8">
          {viewTab === 'TIMELINE' ? (
             <CaseTimeline events={data.timeline} />
          ) : (
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
                 <div className="p-8 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center">
                        <Files className="w-5 h-5 mr-3 text-indigo-600" />
                        Tài liệu hồ sơ vụ án
                    </h3>
                    <p className="text-sm text-slate-500 mt-2">Tổng hợp các văn bản, quyết định và hồ sơ liên quan đến vụ án.</p>
                 </div>
                 <div className="divide-y divide-slate-50">
                    {data.documents.map((doc, idx) => (
                        <div key={idx} className="p-6 hover:bg-slate-50 flex items-center justify-between group transition-colors">
                            <div className="flex items-start">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl mr-5 group-hover:scale-110 transition-transform shadow-sm">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{doc.title}</h4>
                                    <div className="flex items-center text-xs text-slate-500 mt-1.5">
                                        <span className="bg-slate-100 px-2.5 py-0.5 rounded-md text-slate-600 font-semibold mr-3 border border-slate-200">{doc.type}</span>
                                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {doc.date}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all border border-transparent hover:border-indigo-100">
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    {data.documents.length === 0 && (
                        <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                            <div className="bg-slate-50 p-4 rounded-full mb-3">
                                <Files className="w-8 h-8 text-slate-300" />
                            </div>
                            Chưa có tài liệu nào được cập nhật.
                        </div>
                    )}
                 </div>
             </div>
          )}
        </div>

        {/* Right Column - Sidebar (30%) */}
        <div className="lg:col-span-4">
            <CaseSidebar data={data} />
        </div>
      </div>
    </div>
  );
};
