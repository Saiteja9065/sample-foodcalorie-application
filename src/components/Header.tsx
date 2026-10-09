import React from 'react';
import { Volume2, VolumeX, Clock } from 'lucide-react';
import { APP_EMBLEM_URL, USER_AVATAR_URL } from '../data/foods';
import { sounds } from '../utils/audio';

interface HeaderProps {
  onOpenProfile: () => void;
  activeSlot: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenProfile,
  activeSlot,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 pt-safe bg-[#141518]/92 backdrop-blur-xl border-b border-[#36312a]/80 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
      <div className="h-16 px-4 max-w-md mx-auto flex items-center justify-between">
        {/* Emblem & Branding */}
        <div className="flex items-center gap-2.5">
          <img
            alt="Nourish & Flow Tactile Emblem"
            className="h-8 w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] filter brightness-95 contrast-125 select-none"
            src={APP_EMBLEM_URL}
          />
          <div className="flex flex-col justify-center">
            <span className="font-serif-title text-[18px] font-semibold text-[#f5f1e8] tracking-tight leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Nourish &amp; Flow
            </span>
            <span className="font-sans-ui text-[10px] text-[#c6a87d] uppercase tracking-widest font-bold mt-0.5 leading-none">
              Apothecary &amp; Meter
            </span>
          </div>
        </div>

        {/* Right status & controls (all strictly h-8 for vertical alignment) */}
        <div className="flex items-center gap-2">
          {/* Sound ratchet toggle */}
          <button
            onClick={() => {
              onToggleSound();
              sounds.playClick(soundEnabled ? 400 : 900);
            }}
            title={soundEnabled ? 'Mechanical Audio Active' : 'Audio Muted'}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1e2026] border border-[#3a352c] text-[#c6a87d] hover:text-[#f5f1e8] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.06)] active:scale-95 transition-all cursor-pointer"
            type="button"
          >
            {soundEnabled ? (
              <Volume2 size={15} strokeWidth={2.2} />
            ) : (
              <VolumeX size={15} strokeWidth={2.2} />
            )}
          </button>

          {/* Diurnal status badge */}
          <div className="hidden xs:flex items-center gap-1.5 h-8 px-2.5 rounded-full bg-[#1e2026] border border-[#3a352c] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.06)]">
            <Clock size={13} strokeWidth={2.4} className="text-[#c6a87d]" />
            <span className="font-sans-ui text-[10px] text-[#f5f1e8] font-bold tracking-wider uppercase leading-none">
              {activeSlot}
            </span>
          </div>

          {/* Profile Button with Brass Rim */}
          <button
            onClick={() => {
              sounds.playClick(750);
              onOpenProfile();
            }}
            type="button"
            className="relative flex items-center justify-center w-8 h-8 p-0.5 rounded-full bg-gradient-to-b from-[#967d56] via-[#4d3e2a] to-[#25201a] shadow-[0_3px_8px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <div className="w-full h-full p-[1.5px] rounded-full bg-[#17181c] flex items-center justify-center">
              <img
                alt="Apothecary Profile"
                className="w-full h-full rounded-full object-cover shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] ring-1 ring-[#c6a87d]/30"
                src={USER_AVATAR_URL}
              />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
