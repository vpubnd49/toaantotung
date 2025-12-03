
import React from 'react';
import { Scale, Bell, LogOut, Settings } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onOpenAdmin?: () => void;
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onOpenAdmin, onReset }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
        {/* Logo Area - click to reset state, not reload page */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-2 rounded-xl shadow-lg shadow-indigo-200">
            <Scale className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none hidden sm:block">
              Vụ án Tố tụng
            </h1>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold hidden sm:block">Hệ thống quản lý</span>
          </div>
          <h1 className="text-lg font-bold text-slate-800 sm:hidden">
            Vụ án Tố tụng
          </h1>
        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

          <div className="flex items-center space-x-3 group pl-2">
            <div className="flex flex-col items-end hidden md:block">
              <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors">
                {user.fullName}
              </span>
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                {user.role === 'ADMIN' ? 'Quản trị viên' : 'Thành viên'}
              </span>
            </div>
            <img 
              src={user.avatarUrl} 
              alt={user.fullName}
              className="h-9 w-9 rounded-full border border-slate-200 shadow-sm bg-white object-cover"
            />
            
            {user.role === 'ADMIN' && onOpenAdmin && (
                <button 
                    onClick={onOpenAdmin}
                    className="ml-2 p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors border border-transparent hover:border-indigo-100"
                    title="Quản trị hệ thống"
                >
                    <Settings className="w-5 h-5" />
                </button>
            )}

            <button 
                onClick={onLogout}
                className="ml-1 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                title="Đăng xuất"
            >
                <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
