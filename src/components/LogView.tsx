import React, { useState } from 'react';
import {
  Sunrise,
  Sun,
  Moon,
  Leaf,
  Search,
  Mic,
  ScanBarcode,
  SlidersHorizontal,
  Check,
  CheckCheck,
  Sliders,
} from 'lucide-react';
import { FoodItem, DiurnalSlot, LoggedEntry } from '../types';
import { AnalogScale } from './AnalogScale';
import { NutritionalMatrix } from './NutritionalMatrix';
import { LedgerArchives } from './LedgerArchives';
import { QuickCalorieModal } from './QuickCalorieModal';
import { OpticalScanModal } from './OpticalScanModal';
import { FoodSearchModal } from './FoodSearchModal';
import { sounds } from '../utils/audio';

interface LogViewProps {
  activeSlot: DiurnalSlot;
  onSlotChange: (slot: DiurnalSlot) => void;
  foods: FoodItem[];
  currentScaleFood: FoodItem;
  onSelectScaleFood: (food: FoodItem) => void;
  scaleWeightGrams: number;
  onScaleWeightChange: (weight: number) => void;
  onCommitLogEntry: (entry: Omit<LoggedEntry, 'id' | 'timestamp' | 'timeFormatted'>) => void;
}

export const LogView: React.FC<LogViewProps> = ({
  activeSlot,
  onSlotChange,
  foods,
  currentScaleFood,
  onSelectScaleFood,
  scaleWeightGrams,
  onScaleWeightChange,
  onCommitLogEntry,
}) => {
  const [isQuickCalorieOpen, setIsQuickCalorieOpen] = useState(false);
  const [isOpticalScanOpen, setIsOpticalScanOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [isCommittedBadge, setIsCommittedBadge] = useState(false);

  // Dynamic calculations based on scale weight
  const ratio = scaleWeightGrams / currentScaleFood.baseWeightGrams;
  const currentKcal = Math.round(currentScaleFood.baseCalories * ratio);
  const currentProtein = Math.round(currentScaleFood.baseProteinGrams * ratio);
  const currentFat = Math.round(currentScaleFood.baseFatGrams * ratio);
  const currentCarbs = Math.round(currentScaleFood.baseCarbsGrams * ratio);

  // Diurnal slot configuration
  const slots: { id: DiurnalSlot; label: string; icon: React.ReactNode }[] = [
    { id: 'Morning', label: 'Morning', icon: <Sunrise size={18} strokeWidth={2.2} /> },
    { id: 'Midday', label: 'Midday', icon: <Sun size={18} strokeWidth={2.2} /> },
    { id: 'Vesper', label: 'Vesper', icon: <Moon size={18} strokeWidth={2.2} /> },
    { id: 'Bite', label: 'Bite', icon: <Leaf size={18} strokeWidth={2.2} /> },
  ];

  const handleMicClick = () => {
    sounds.playClick(800);
    setIsListeningMic(true);
    setTimeout(() => {
      setIsListeningMic(false);
      setIsSearchOpen(true);
    }, 1000);
  };

  const handleCommitCurrentFood = () => {
    sounds.playStamp();
    setIsCommittedBadge(true);

    onCommitLogEntry({
      foodId: currentScaleFood.id,
      name: currentScaleFood.name,
      slot: activeSlot,
      weightGrams: scaleWeightGrams,
      calories: currentKcal,
      protein: currentProtein,
      fat: currentFat,
      carbs: currentCarbs,
      imageUrl: currentScaleFood.imageUrl,
    });

    setTimeout(() => {
      setIsCommittedBadge(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pb-28 pt-2 space-y-6 select-none">
      {/* Meal Category Selector: Raised Brass/Copper Segmented Deck */}
      <section className="w-full mt-1">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="font-sans-ui text-[10px] uppercase tracking-widest text-[#a7a195] flex items-center gap-1.5 font-bold">
            <Sliders size={13} strokeWidth={2.4} className="text-[#c6a87d]" />
            Registry Phase • Diurnal Slot
          </span>
          <span className="font-sans-ui text-[10px] text-[#c6a87d] font-bold tracking-wider">
            12:45 PM • {activeSlot.toUpperCase()}
          </span>
        </div>

        <div className="p-1.5 rounded-xl bg-[#16171b] border border-[#3b3429] shadow-[inset_0_2px_5px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.04)] grid grid-cols-4 gap-1.5">
          {slots.map((slot) => {
            const isActive = activeSlot === slot.id;
            return (
              <button
                key={slot.id}
                onClick={() => {
                  sounds.playClick(isActive ? 700 : 850);
                  onSlotChange(slot.id);
                }}
                type="button"
                className={`group relative py-2.5 px-1 rounded-lg flex flex-col items-center justify-center transition-all active:translate-y-0.5 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-b from-[#2e261a] via-[#1f1911] to-[#14100b] text-[#f5eee5] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),0_1px_0_rgba(212,175,55,0.3)] ring-1 ring-[#d4af37]/70'
                    : 'bg-[#1e2027] text-[#a7a195] border border-[#353026] shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] hover:text-[#f5eee5]'
                }`}
              >
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#4edea3] shadow-[0_0_8px_#4edea3]" />
                )}
                {/* Fixed size icon box ensures mathematical alignment across all 4 slots */}
                <div className={`w-5 h-5 mb-1 flex items-center justify-center ${isActive ? 'text-[#d4af37]' : 'text-inherit'}`}>
                  {slot.icon}
                </div>
                <span
                  className={`font-sans-ui text-[10px] tracking-tight leading-none ${
                    isActive ? 'font-bold text-[#f5eee5]' : 'font-semibold'
                  }`}
                >
                  {slot.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Search & Tactile Input Deck */}
      <section className="w-full space-y-2.5">
        {/* Debossed Search Well */}
        <div
          onClick={() => {
            sounds.playClick(600);
            setIsSearchOpen(true);
          }}
          className="relative w-full rounded-xl bg-[#14151a] p-1 border border-[#3b3429] shadow-[inset_0_3px_6px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.05)] cursor-pointer"
        >
          <div className="flex items-center px-3 py-2 bg-[#191b22] rounded-lg">
            <Search size={18} strokeWidth={2.4} className="text-[#c6a87d] mr-2.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] flex-shrink-0" />
            <input
              type="text"
              readOnly
              placeholder="Search 500,000+ foods or apothecary recipes..."
              className="w-full bg-transparent border-0 p-0 text-[#f5f1e8] font-sans-ui text-[13px] placeholder:text-[#787265] focus:outline-none cursor-pointer"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMicClick();
              }}
              type="button"
              className={`p-1 rounded-md transition-colors flex items-center justify-center cursor-pointer ${
                isListeningMic ? 'text-[#ff6b6b] animate-pulse' : 'text-[#a7a195] hover:text-[#d4af37]'
              }`}
              title="Voice Specimen Dictation"
            >
              <Mic size={17} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {/* Quick Action Mechanical Hardware Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Optical Scan Barcode Beam */}
          <button
            onClick={() => {
              sounds.playScan();
              setIsOpticalScanOpen(true);
            }}
            type="button"
            className="h-14 flex items-center justify-start gap-2.5 px-3 rounded-xl bg-gradient-to-b from-[#242630] via-[#1d1f26] to-[#17181f] border border-[#3d372e] shadow-[0_3px_8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-2px_0_rgba(0,0,0,0.5)] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] hover:border-[#4a4233] transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#14151a] flex items-center justify-center border border-[#4a4233] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] flex-shrink-0">
              <ScanBarcode size={17} strokeWidth={2.2} className="text-[#6bb9f0]" />
            </div>
            <div className="flex flex-col text-left justify-center">
              <span className="font-sans-ui text-[11px] text-[#f5eee5] font-bold leading-tight">
                Optical Scan
              </span>
              <span className="font-sans-ui text-[9px] text-[#a7a195] tracking-wider uppercase leading-none font-bold mt-0.5">
                Barcode Beam
              </span>
            </div>
          </button>

          {/* Quick Calorie Manual Dial */}
          <button
            onClick={() => {
              sounds.playClick(750);
              setIsQuickCalorieOpen(true);
            }}
            type="button"
            className="h-14 flex items-center justify-start gap-2.5 px-3 rounded-xl bg-gradient-to-b from-[#242630] via-[#1d1f26] to-[#17181f] border border-[#3d372e] shadow-[0_3px_8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-2px_0_rgba(0,0,0,0.5)] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] hover:border-[#4a4233] transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#14151a] flex items-center justify-center border border-[#4a4233] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] flex-shrink-0">
              <SlidersHorizontal size={16} strokeWidth={2.2} className="text-[#c6a87d]" />
            </div>
            <div className="flex flex-col text-left justify-center">
              <span className="font-sans-ui text-[11px] text-[#f5eee5] font-bold leading-tight">
                Quick Calorie
              </span>
              <span className="font-sans-ui text-[9px] text-[#a7a195] tracking-wider uppercase leading-none font-bold mt-0.5">
                Manual Dial
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* Mechanical Balance Portion Scale & Active Food Card */}
      <div className="space-y-2">
        <AnalogScale
          food={currentScaleFood}
          weightGrams={scaleWeightGrams}
          onWeightChange={onScaleWeightChange}
          onClearFood={() => {
            const next = foods.find((f) => f.id !== currentScaleFood.id) || foods[0];
            onSelectScaleFood(next);
            onScaleWeightChange(next.baseWeightGrams);
          }}
        />

        {/* Dynamic Nutritional Matrix */}
        <NutritionalMatrix
          calories={currentKcal}
          protein={currentProtein}
          fat={currentFat}
          carbs={currentCarbs}
          proteinGoalPercent={Math.min(100, Math.round((currentProtein / 85) * 100))}
          fatHighlight={currentScaleFood.highlightTag || 'Omega-3'}
          carbsHighlight={currentCarbs === 0 ? '0% sugar' : `${currentCarbs}g net`}
        />
      </div>

      {/* Recent & Favorite Logs: Apothecary Library Ledger */}
      <LedgerArchives
        foods={foods}
        onSelectFood={(selected) => {
          onSelectScaleFood(selected);
          onScaleWeightChange(selected.baseWeightGrams);
        }}
        onQuickAdd={(item) => {
          onCommitLogEntry({
            foodId: item.id,
            name: item.name,
            slot: activeSlot,
            weightGrams: item.baseWeightGrams,
            calories: item.baseCalories,
            protein: item.baseProteinGrams,
            fat: item.baseFatGrams,
            carbs: item.baseCarbsGrams,
            imageUrl: item.imageUrl,
          });
        }}
      />

      {/* Deep Burnished Brass CTA Action Strip */}
      <section className="w-full pt-1 pb-2">
        <button
          onClick={handleCommitCurrentFood}
          type="button"
          className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#4a3d28] via-[#2d2417] to-[#17140f] p-4 border border-[#d4af37]/40 shadow-[0_8px_20px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(245,226,173,0.35),inset_0_-3px_0_rgba(0,0,0,0.7)] active:translate-y-1 active:shadow-[0_2px_6px_rgba(0,0,0,0.9),inset_0_3px_5px_rgba(0,0,0,0.8)] transition-all cursor-pointer"
        >
          {/* Simulated stitched edge pattern */}
          <div className="absolute inset-x-2 top-1.5 h-[1px] bg-[#d4af37]/20 border-t border-dashed border-[#d4af37]/30" />
          <div className="absolute inset-x-2 bottom-1.5 h-[1px] bg-[#d4af37]/20 border-t border-dashed border-[#d4af37]/30" />

          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                  isCommittedBadge
                    ? 'bg-gradient-to-br from-[#4edea3] to-[#005236] text-[#002025] shadow-[0_0_12px_#4edea3]'
                    : 'bg-gradient-to-br from-[#f5e2ad] via-[#c59b27] to-[#6d5002] text-[#121316] shadow-[0_2px_6px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.4)]'
                }`}
              >
                {isCommittedBadge ? (
                  <CheckCheck size={18} strokeWidth={2.8} />
                ) : (
                  <Check size={18} strokeWidth={2.8} />
                )}
              </div>
              <div className="flex flex-col text-left justify-center">
                <span className="font-serif-title text-[18px] text-[#f5eee5] tracking-wide leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  {isCommittedBadge ? 'Imprinted to Ledger!' : `Imprint to ${activeSlot} Log`}
                </span>
                <span className="font-sans-ui text-[10px] text-[#c6a87d] uppercase tracking-widest mt-0.5 font-bold">
                  Apothecary Ledger Entry
                </span>
              </div>
            </div>

            <div className="h-9 flex items-center gap-1 px-3 rounded-xl bg-[#1c1912] border border-[#d4af37]/35 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.06)] flex-shrink-0">
              <span className="font-serif-title text-[18px] text-[#f5e2ad] font-bold leading-none">
                {isCommittedBadge ? 'SAVED' : `+${currentKcal}`}
              </span>
              <span className="font-sans-ui text-[9px] uppercase tracking-wider text-[#c6a87d] font-bold">
                kcal
              </span>
            </div>
          </div>
        </button>
      </section>

      {/* Modals */}
      <QuickCalorieModal
        isOpen={isQuickCalorieOpen}
        onClose={() => setIsQuickCalorieOpen(false)}
        activeSlot={activeSlot}
        onCommit={(calories, label, slot) => {
          onCommitLogEntry({
            foodId: 'manual-quick-cal',
            name: label,
            slot: slot,
            weightGrams: 100,
            calories: calories,
            protein: Math.round(calories * 0.05),
            fat: Math.round(calories * 0.03),
            carbs: Math.round(calories * 0.1),
            imageUrl: currentScaleFood.imageUrl,
          });
        }}
      />

      <OpticalScanModal
        isOpen={isOpticalScanOpen}
        onClose={() => setIsOpticalScanOpen(false)}
        foods={foods}
        onSelectFood={(food) => {
          onSelectScaleFood(food);
          onScaleWeightChange(food.baseWeightGrams);
        }}
      />

      <FoodSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        foods={foods}
        onSelectFood={(food) => {
          onSelectScaleFood(food);
          onScaleWeightChange(food.baseWeightGrams);
        }}
      />
    </div>
  );
};
