import React from 'react';
import { X, Trash2, Sunrise, Sun, Moon, Leaf } from 'lucide-react';
import { DailyTargets } from '../types';
import { USER_AVATAR_URL } from '../data/foods';
import { sounds } from '../utils/audio';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  targets: DailyTargets;
  onUpdateTargets: (newTargets: DailyTargets) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetLedger: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  targets,
  onUpdateTargets,
  soundEnabled,
  onToggleSound,
  onResetLedger,
}) => {
  if (!isOpen) return null;

  const handleCalorieChange = (delta: number) => {
    sounds.playClick(650);
    onUpdateTargets({
      ...targets,
      calories: Math.max(1200, Math.min(4500, targets.calories + delta)),
    });
  };

  const handleWaterChange = (delta: number) => {
    sounds.playDrop();
    onUpdateTargets({
      ...targets,
      waterMl: Math.max(1000, Math.min(5000, targets.waterMl + delta)),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#1c1e26] via-[#16171e] to-[#121316] border border-[#3e372c] p-5 shadow-[0_16px_36px_rgba(0,0,0,0.9)] relative flex flex-col max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#312c24]">
          <div className="flex items-center gap-3">
            <div className="relative p-0.5 rounded-full bg-gradient-to-b from-[#967d56] to-[#25201a]">
              <img
                src={USER_AVATAR_URL}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-serif-title text-[17px] text-[#f5eee5] font-semibold leading-tight">
                Apothecary Ledger
              </h3>
              <p className="font-sans-ui text-[10px] uppercase tracking-widest text-[#c6a87d] font-bold">
                Practitioner Settings
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick(500);
              onClose();
            }}
            className="text-[#a7a195] hover:text-[#ff6b6b] p-1 cursor-pointer"
            type="button"
          >
            <X size={18} strokeWidth={2.4} />
          </button>
        </div>

        {/* Diurnal Clock Schema */}
        <div className="my-3 p-3 rounded-xl bg-[#14151b] border border-[#363026]">
          <span className="font-sans-ui text-[9px] uppercase tracking-widest text-[#c6a87d] font-bold block mb-2">
            Diurnal Phase Allocation
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-sans-ui">
            <div className="p-2 rounded-lg bg-[#191b22] border border-[#2b271f] flex flex-col">
              <span className="text-[#f5eee5] font-semibold flex items-center gap-1.5">
                <Sunrise size={13} className="text-[#d4af37]" />
                Morning
              </span>
              <span className="text-[#8e8779] text-[10px]">06:00 – 11:30 AM</span>
            </div>
            <div className="p-2 rounded-lg bg-[#191b22] border border-[#2b271f] flex flex-col">
              <span className="text-[#f5eee5] font-semibold flex items-center gap-1.5">
                <Sun size={13} className="text-[#4edea3]" />
                Midday
              </span>
              <span className="text-[#8e8779] text-[10px]">11:30 – 16:30 PM</span>
            </div>
            <div className="p-2 rounded-lg bg-[#191b22] border border-[#2b271f] flex flex-col">
              <span className="text-[#f5eee5] font-semibold flex items-center gap-1.5">
                <Moon size={13} className="text-[#6bb9f0]" />
                Vesper
              </span>
              <span className="text-[#8e8779] text-[10px]">16:30 – 21:00 PM</span>
            </div>
            <div className="p-2 rounded-lg bg-[#191b22] border border-[#2b271f] flex flex-col">
              <span className="text-[#f5eee5] font-semibold flex items-center gap-1.5">
                <Leaf size={13} className="text-[#ea580c]" />
                Bite
              </span>
              <span className="text-[#8e8779] text-[10px]">Intermittent / Any</span>
            </div>
          </div>
        </div>

        {/* Daily Target Calorie Dial */}
        <div className="my-2 p-3 rounded-xl bg-[#14151b] border border-[#363026]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-sans-ui text-[10px] uppercase tracking-wider text-[#a7a195] font-bold">
              Target Diurnal Fuel
            </span>
            <span className="font-serif-title text-[18px] text-[#f5eee5] font-bold">
              {targets.calories} <span className="text-[11px] font-sans-ui text-[#c6a87d]">kcal</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCalorieChange(-50)}
              className="px-3 py-1 rounded-lg bg-[#22242e] border border-[#3d372e] text-[#e8c99b] font-bold text-xs cursor-pointer"
            >
              -50
            </button>
            <input
              type="range"
              min="1400"
              max="3600"
              step="50"
              value={targets.calories}
              onChange={(e) =>
                onUpdateTargets({ ...targets, calories: parseInt(e.target.value) })
              }
              className="flex-1 accent-[#d4af37]"
            />
            <button
              onClick={() => handleCalorieChange(50)}
              className="px-3 py-1 rounded-lg bg-[#22242e] border border-[#3d372e] text-[#e8c99b] font-bold text-xs cursor-pointer"
            >
              +50
            </button>
          </div>
        </div>

        {/* Water Target */}
        <div className="my-2 p-3 rounded-xl bg-[#14151b] border border-[#363026]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-sans-ui text-[10px] uppercase tracking-wider text-[#a7a195] font-bold">
              Optic Glass Hydration Goal
            </span>
            <span className="font-serif-title text-[18px] text-[#6bb9f0] font-bold">
              {targets.waterMl} <span className="text-[11px] font-sans-ui text-[#8ec8f6]">ml</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleWaterChange(-250)}
              className="px-3 py-1 rounded-lg bg-[#22242e] border border-[#3d372e] text-[#6bb9f0] font-bold text-xs cursor-pointer"
            >
              -250
            </button>
            <input
              type="range"
              min="1500"
              max="4000"
              step="250"
              value={targets.waterMl}
              onChange={(e) =>
                onUpdateTargets({ ...targets, waterMl: parseInt(e.target.value) })
              }
              className="flex-1 accent-[#0284c7]"
            />
            <button
              onClick={() => handleWaterChange(250)}
              className="px-3 py-1 rounded-lg bg-[#22242e] border border-[#3d372e] text-[#6bb9f0] font-bold text-xs cursor-pointer"
            >
              +250
            </button>
          </div>
        </div>

        {/* Audio Ratchet Sound Setting */}
        <div className="my-2 p-3 rounded-xl bg-[#14151b] border border-[#363026] flex items-center justify-between">
          <div>
            <span className="font-sans-ui text-[12px] text-[#f5eee5] font-semibold block">
              Mechanical Audio Haptics
            </span>
            <span className="font-sans-ui text-[10px] text-[#8e8779]">
              Synthesized horology ratchet clicks &amp; brass stamps
            </span>
          </div>
          <button
            onClick={() => {
              onToggleSound();
              sounds.playClick(soundEnabled ? 400 : 900);
            }}
            type="button"
            className={`w-12 h-6 rounded-full transition-colors relative border cursor-pointer ${
              soundEnabled ? 'bg-[#3d3121] border-[#d4af37]' : 'bg-[#1b1c21] border-[#38332a]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full transition-transform absolute top-0.5 ${
                soundEnabled
                  ? 'translate-x-6 bg-[#d4af37] shadow-[0_0_6px_#d4af37]'
                  : 'translate-x-1 bg-[#5b554b]'
              }`}
            />
          </button>
        </div>

        {/* Clear / Reset action */}
        <div className="mt-4 pt-3 border-t border-[#312c24] flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Clear today\'s logged register items?')) {
                sounds.playStamp();
                onResetLedger();
                onClose();
              }
            }}
            type="button"
            className="text-[11px] font-sans-ui text-[#ff6b6b] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Trash2 size={13} />
            Reset Today's Entries
          </button>

          <button
            onClick={() => {
              sounds.playClick(750);
              onClose();
            }}
            type="button"
            className="px-4 py-1.5 rounded-lg bg-[#282a33] border border-[#443e33] text-[#f5eee5] font-sans-ui text-[12px] font-bold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
