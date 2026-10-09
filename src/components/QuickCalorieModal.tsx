import React, { useState } from 'react';
import { SlidersHorizontal, X, CheckCircle } from 'lucide-react';
import { DiurnalSlot } from '../types';
import { sounds } from '../utils/audio';

interface QuickCalorieModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSlot: DiurnalSlot;
  onCommit: (calories: number, label: string, slot: DiurnalSlot) => void;
}

export const QuickCalorieModal: React.FC<QuickCalorieModalProps> = ({
  isOpen,
  onClose,
  activeSlot,
  onCommit,
}) => {
  const [calories, setCalories] = useState<number>(250);
  const [label, setLabel] = useState<string>('Apothecary Quick Log');
  const [selectedSlot, setSelectedSlot] = useState<DiurnalSlot>(activeSlot);

  if (!isOpen) return null;

  const quickPresets = [100, 200, 350, 500];

  const handleAdjust = (delta: number) => {
    sounds.playClick(650);
    setCalories((prev) => Math.max(10, Math.min(2000, prev + delta)));
  };

  const handleCommit = () => {
    sounds.playStamp();
    onCommit(calories, label.trim() || 'Quick Calorie Dial', selectedSlot);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#1e2028] via-[#17181f] to-[#121316] border border-[#3e372c] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.1)] relative">
        {/* Decorative rivets */}
        <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-[#c6a87d]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#c6a87d]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#312c24]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#15161c] border border-[#4a4233] flex items-center justify-center">
              <SlidersHorizontal size={14} className="text-[#c6a87d]" />
            </div>
            <div>
              <h3 className="font-serif-title text-[17px] text-[#f5eee5] font-semibold leading-tight">
                Quick Calorie
              </h3>
              <p className="font-sans-ui text-[10px] uppercase tracking-wider text-[#c6a87d] font-bold">
                Manual Vernier Dial
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick(500);
              onClose();
            }}
            className="text-[#a7a195] hover:text-[#ff6b6b] transition-colors p-1 cursor-pointer"
            type="button"
          >
            <X size={18} strokeWidth={2.4} />
          </button>
        </div>

        {/* Slot selector */}
        <div className="my-3">
          <label className="block font-sans-ui text-[10px] uppercase tracking-wider text-[#a7a195] font-bold mb-1.5">
            Diurnal Assignment
          </label>
          <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-[#14151a] border border-[#363026]">
            {(['Morning', 'Midday', 'Vesper', 'Bite'] as DiurnalSlot[]).map((s) => (
              <button
                key={s}
                onClick={() => {
                  sounds.playClick(600);
                  setSelectedSlot(s);
                }}
                type="button"
                className={`py-1 rounded-lg font-sans-ui text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                  selectedSlot === s
                    ? 'bg-[#2b251b] border border-[#d4af37]/60 text-[#f5e2ad]'
                    : 'text-[#8b8476] hover:text-[#f5eee5]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Central Drum Readout */}
        <div className="my-4 p-4 rounded-xl bg-[#14151b] border border-[#3b3429] shadow-[inset_0_3px_8px_rgba(0,0,0,0.8)] flex flex-col items-center">
          <span className="font-sans-ui text-[9px] uppercase tracking-widest text-[#c6a87d] font-bold mb-1">
            Calibrated Caloric Imprint
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-title text-[48px] text-[#f5eee5] font-bold tracking-tight leading-none">
              {calories}
            </span>
            <span className="font-sans-ui text-[12px] uppercase tracking-wider text-[#c6a87d] font-bold">
              kcal
            </span>
          </div>

          {/* Stepper buttons */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => handleAdjust(-50)}
              type="button"
              className="px-3 py-1 rounded-lg bg-[#22242e] border border-[#3d372e] text-[#e8c99b] font-sans-ui text-[12px] font-bold active:scale-95 cursor-pointer"
            >
              -50
            </button>
            <button
              onClick={() => handleAdjust(-10)}
              type="button"
              className="px-3 py-1 rounded-lg bg-[#22242e] border border-[#3d372e] text-[#e8c99b] font-sans-ui text-[12px] font-bold active:scale-95 cursor-pointer"
            >
              -10
            </button>
            <button
              onClick={() => handleAdjust(10)}
              type="button"
              className="px-3 py-1 rounded-lg bg-[#22242e] border border-[#3d372e] text-[#e8c99b] font-sans-ui text-[12px] font-bold active:scale-95 cursor-pointer"
            >
              +10
            </button>
            <button
              onClick={() => handleAdjust(50)}
              type="button"
              className="px-3 py-1 rounded-lg bg-[#22242e] border border-[#3d372e] text-[#e8c99b] font-sans-ui text-[12px] font-bold active:scale-95 cursor-pointer"
            >
              +50
            </button>
          </div>

          {/* Presets */}
          <div className="flex items-center gap-1.5 mt-3">
            {quickPresets.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  sounds.playClick(750);
                  setCalories(preset);
                }}
                type="button"
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans-ui font-bold border cursor-pointer ${
                  calories === preset
                    ? 'bg-[#3b2f1e] border-[#d4af37] text-[#f5e2ad]'
                    : 'bg-[#1a1c22] border-[#312c24] text-[#a7a195]'
                }`}
              >
                {preset} kcal
              </button>
            ))}
          </div>
        </div>

        {/* Note / Label input */}
        <div className="mb-4">
          <label className="block font-sans-ui text-[10px] uppercase tracking-wider text-[#a7a195] font-bold mb-1">
            Description / Item
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g., Afternoon Herbal Infusion & Honey"
            className="w-full px-3 py-2 rounded-lg bg-[#14151a] border border-[#363026] text-[#f5eee5] font-sans-ui text-[13px] placeholder:text-[#6e685c] focus:outline-none focus:border-[#c6a87d]"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleCommit}
          type="button"
          className="w-full py-3 rounded-xl bg-gradient-to-b from-[#4a3d28] via-[#2d2417] to-[#17140f] border border-[#d4af37]/50 text-[#f5eee5] font-serif-title text-[15px] font-semibold tracking-wide shadow-[0_6px_16px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(245,226,173,0.3)] active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle size={18} strokeWidth={2.4} className="text-[#d4af37]" />
          Record {calories} kcal into {selectedSlot}
        </button>
      </div>
    </div>
  );
};
