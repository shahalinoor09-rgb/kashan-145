
import React from 'react';
import { BusinessProfile, INDUSTRIES, COMPANY_SIZES } from '../types';

interface SidebarProps {
  profile: BusinessProfile;
  setProfile: (profile: BusinessProfile) => void;
  onClearHistory: () => void;
  onExportChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ profile, setProfile, onClearHistory, onExportChat }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <aside className="w-full lg:w-80 bg-white border-r border-slate-200 h-full flex flex-col overflow-y-auto custom-scrollbar p-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
          <i className="fa-solid fa-briefcase text-blue-600"></i>
          Business Profile
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Industry</label>
            <select 
              name="industry"
              value={profile.industry}
              onChange={handleChange}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
            >
              <option value="">Select Industry</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Company Size</label>
            <select 
              name="companySize"
              value={profile.companySize}
              onChange={handleChange}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
            >
              <option value="">Select Size</option>
              {COMPANY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Target Market</label>
            <input 
              type="text"
              name="targetMarket"
              value={profile.targetMarket}
              onChange={handleChange}
              placeholder="e.g. Gen Z in USA"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Primary Goal</label>
            <textarea 
              name="businessGoal"
              value={profile.businessGoal}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. Scale to $1M ARR"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm resize-none"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Actions</h3>
        <div className="space-y-2">
          <button 
            onClick={onExportChat}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors text-sm"
          >
            <span>Export Insights</span>
            <i className="fa-solid fa-file-export text-slate-400"></i>
          </button>
          <button 
            onClick={onClearHistory}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-sm"
          >
            <span>Clear History</span>
            <i className="fa-solid fa-trash-can text-red-400"></i>
          </button>
        </div>
      </div>

      <div className="mt-auto pt-6 text-center">
        <p className="text-[10px] text-slate-400">Powered by Gemini AI Engine</p>
      </div>
    </aside>
  );
};

export default Sidebar;
