import React from 'react';
import { Gauge, Camera, FileText, BookOpen } from 'lucide-react';
import { sounds } from '../utils/audio';

export type TabType = 'today' | 'ai-scan' | 'log' | 'summary';

interface NavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onChangeTab }) => {
  const handleTabClick = (tab: TabType) => {
    if (tab === 'ai-scan') {
      sounds.playScan();
    } else {
      sounds.playClick(650);
    }
    onChangeTab(tab);
  };

  const navItems = [
    {
      id: 'today' as TabType,
      label: 'Today',
      icon: Gauge,
      activeColor: 'text-[#c6a87d]',
      activeBorder: 'border-[#4a4233]',
    },
    {
      id: 'ai-scan' as TabType,
      label: 'AI Scan',
      icon: Camera,
      activeColor: 'text-[#00b4d8]',
      activeBorder: 'border-[#1b4d63]',
    },
    {
      id: 'log' as TabType,
      label: 'Log',
      icon: FileText,
      activeColor: 'text-[#e8c99b]',
      activeBorder: 'border-[#4a4233]',
    },
    {
      id: 'summary' as TabType,
      label: 'Summary',
      icon: BookOpen,
      activeColor: 'text-[#c6a87d]',
      activeBorder: 'border-[#4a4233]',
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#141518]/95 backdrop-blur-xl border-t border-[#36312a]/80 shadow-[0_-4px_24px_rgba(0,0,0,0.7)]">
      <div className="grid grid-cols-4 items-center h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              type="button"
              className={`group flex flex-col items-center justify-center h-13 mx-1 py-1 rounded-xl transition-all duration-150 cursor-pointer ${
                isActive
                  ? `text-[#f5eee5] font-bold bg-[#262832] border ${item.activeBorder} shadow-[0_2px_8px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.15)]`
                  : 'text-[#a7a195] hover:text-[#f5eee5]'
              }`}
            >
              {/* Perfectly sized & aligned icon badge across all 4 items */}
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-lg transition-transform group-active:scale-95 ${
                  isActive
                    ? 'bg-[#18191f] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.06)]'
                    : 'bg-[#1a1b20] border border-[#2e2a22] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.04)]'
                }`}
              >
                <Icon
                  size={17}
                  strokeWidth={2.2}
                  className={
                    isActive ? item.activeColor : 'text-[#a7a195] group-hover:text-[#f5eee5]'
                  }
                />
              </div>

              {/* Perfectly aligned label on same horizontal baseline */}
              <span className="font-sans-ui text-[10px] uppercase tracking-wider mt-1 text-inherit font-bold leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
