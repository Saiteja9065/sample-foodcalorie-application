import React, { useState } from 'react';
import {
  Gauge,
  Droplets,
  Layers,
  BookOpen,
  Trash2,
  PenTool,
} from 'lucide-react';
import { LoggedEntry, DailyTargets, DiurnalSlot } from '../types';
import { sounds } from '../utils/audio';

interface TodayViewProps {
  entries: LoggedEntry[];
  targets: DailyTargets;
  waterIntakeMl: number;
  onAddWater: (amountMl: number) => void;
  onSelectSlot: (slot: DiurnalSlot) => void;
  onDeleteEntry: (id: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  entries,
  targets,
  waterIntakeMl,
  onAddWater,
  onSelectSlot,
  onDeleteEntry,
}) => {
  const [selectedFilterSlot, setSelectedFilterSlot] = useState<DiurnalSlot | 'All'>('All');

  // Aggregated totals
  const totalCalories = entries.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = entries.reduce((acc, curr) => acc + curr.protein, 0);
  const totalFat = entries.reduce((acc, curr) => acc + curr.fat, 0);
  const totalCarbs = entries.reduce((acc, curr) => acc + curr.carbs, 0);

  const caloriesRemaining = Math.max(0, targets.calories - totalCalories);
  const caloriePercent = Math.min(100, Math.round((totalCalories / targets.calories) * 100));

  // Diurnal slot breakdowns
  const slotTotals = {
    Morning: entries.filter((e) => e.slot === 'Morning').reduce((s, e) => s + e.calories, 0),
    Midday: entries.filter((e) => e.slot === 'Midday').reduce((s, e) => s + e.calories, 0),
    Vesper: entries.filter((e) => e.slot === 'Vesper').reduce((s, e) => s + e.calories, 0),
    Bite: entries.filter((e) => e.slot === 'Bite').reduce((s, e) => s + e.calories, 0),
  };

  // Water calculations
  const waterPercent = Math.min(100, Math.round((waterIntakeMl / targets.waterMl) * 100));

  // Filtered entries
  const displayedEntries =
    selectedFilterSlot === 'All'
      ? entries
      : entries.filter((e) => e.slot === selectedFilterSlot);

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pb-28 pt-2 space-y-6 select-none">
      {/* Horology Caloric Chronometer & Balance Gauge */}
      <section className="w-full relative rounded-2xl bg-gradient-to-b from-[#1e2028] via-[#17181f] to-[#121316] p-4 border border-[#3e372c] shadow-[0_8px_24px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.08)]">
        {/* Brass corner studs */}
        <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-[#c6a87d] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
        <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#c6a87d] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />

        <div className="flex items-center justify-between border-b border-[#312c24] pb-2.5">
          <div className="flex items-center gap-2">
            <Gauge size={17} strokeWidth={2.4} className="text-[#c6a87d]" />
            <div>
              <span className="font-sans-ui text-[9px] uppercase tracking-widest text-[#c6a87d] font-bold block">
                Horological Chronometer
              </span>
              <h2 className="font-serif-title text-[17px] text-[#f5eee5] font-semibold leading-none">
                Diurnal Caloric Balance
              </h2>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#242630] border border-[#3f382e] font-sans-ui text-[10px] text-[#4edea3] font-bold">
            {caloriePercent}% Allocated
          </span>
        </div>

        {/* Circular Dial Face */}
        <div className="relative my-3 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Outer knurled rim */}
            <div className="absolute inset-0 rounded-full border-4 border-[#2c2720] shadow-[inset_0_2px_6px_rgba(0,0,0,0.8),0_4px_12px_rgba(0,0,0,0.7)]" />

            <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#1b1d24"
                strokeWidth="7"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#horoGradient)"
                strokeWidth="7"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * Math.min(1, totalCalories / targets.calories))}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
              <defs>
                <linearGradient id="horoGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#b8860b" />
                  <stop offset="70%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#4edea3" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Recessed Core with Serif Readout */}
            <div className="absolute w-32 h-32 rounded-full bg-[#131418] border border-[#3b3429] shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center text-center">
              <span className="font-sans-ui text-[9px] uppercase tracking-widest text-[#a7a195] font-bold">
                Consumed
              </span>
              <span className="font-serif-title text-[30px] font-bold text-[#f5eee5] leading-none my-0.5">
                {totalCalories}
              </span>
              <span className="font-sans-ui text-[10px] text-[#c6a87d] font-semibold">
                of {targets.calories} kcal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-2 text-center">
            <div>
              <span className="font-sans-ui text-[9px] uppercase tracking-wider text-[#a7a195] font-bold block">
                Remaining
              </span>
              <span className="font-serif-title text-[16px] text-[#4edea3] font-bold">
                {caloriesRemaining} kcal
              </span>
            </div>
            <div className="w-[1px] h-6 bg-[#2d2922]" />
            <div>
              <span className="font-sans-ui text-[9px] uppercase tracking-wider text-[#a7a195] font-bold block">
                Diurnal Target
              </span>
              <span className="font-serif-title text-[16px] text-[#f5eee5] font-bold">
                {targets.calories} kcal
              </span>
            </div>
          </div>
        </div>

        {/* 4 Diurnal Slot Summary Chips */}
        <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-[#2d2922]">
          {(['Morning', 'Midday', 'Vesper', 'Bite'] as DiurnalSlot[]).map((slot) => {
            const val = slotTotals[slot];
            return (
              <button
                key={slot}
                onClick={() => {
                  sounds.playClick(650);
                  onSelectSlot(slot);
                }}
                type="button"
                className="p-2 rounded-xl bg-[#17181f] border border-[#312c24] hover:border-[#c6a87d]/50 transition-all text-center cursor-pointer"
              >
                <span className="font-sans-ui text-[9px] uppercase text-[#a7a195] block font-bold">
                  {slot}
                </span>
                <span className="font-serif-title text-[14px] text-[#f5eee5] font-bold block mt-0.5">
                  {val}
                </span>
                <span className="font-sans-ui text-[8px] text-[#c6a87d]">kcal</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Optic Glass Hydration Cylinder & Macro Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Optic Glass Hydration Vessel */}
        <section className="relative rounded-2xl bg-gradient-to-b from-[#1e2027] via-[#171920] to-[#131419] p-4 border border-[#3e372c] shadow-[0_8px_20px_rgba(0,0,0,0.6)] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#2d2922]">
            <div className="flex items-center gap-1.5">
              <Droplets size={16} strokeWidth={2.4} className="text-[#6bb9f0]" />
              <h3 className="font-serif-title text-[16px] text-[#f5eee5] font-semibold">
                Hydration Vessel
              </h3>
            </div>
            <span className="font-sans-ui text-[10px] text-[#6bb9f0] font-bold">
              {waterIntakeMl} / {targets.waterMl} ml
            </span>
          </div>

          {/* Borosilicate Glass Column Simulation */}
          <div className="relative my-3 w-full h-32 rounded-xl bg-[#0f1218] border-2 border-[#2b3a4a]/80 overflow-hidden shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)] flex items-end">
            {/* Glass Etchings */}
            <div className="absolute inset-y-2 left-2 flex flex-col justify-between text-[8px] font-sans-ui font-bold text-[#44627d] z-20 pointer-events-none">
              <span>{targets.waterMl}ml</span>
              <span>{Math.round(targets.waterMl * 0.75)}ml</span>
              <span>{Math.round(targets.waterMl * 0.5)}ml</span>
              <span>{Math.round(targets.waterMl * 0.25)}ml</span>
            </div>

            {/* Aqueous Liquid Fluid Fill */}
            <div
              className="w-full bg-gradient-to-t from-[#0284c7] via-[#0284c7]/90 to-[#38bdf8] transition-all duration-500 relative"
              style={{ height: `${Math.max(8, waterPercent)}%` }}
            >
              {/* Meniscus reflection highlight */}
              <div className="absolute -top-1 inset-x-0 h-2 bg-[#70c7ff] rounded-[50%] blur-[1px] opacity-80" />
            </div>

            {/* Specular reflections on glass front */}
            <div className="absolute inset-y-0 left-6 w-3 bg-white/5 pointer-events-none" />
            <div className="absolute inset-y-0 right-3 w-1.5 bg-white/10 pointer-events-none" />
          </div>

          {/* Quick Water Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playDrop();
                onAddWater(250);
              }}
              type="button"
              className="flex-1 py-1.5 rounded-lg bg-[#182a3a] border border-[#234b6e] text-[#6bb9f0] hover:text-[#ffffff] font-sans-ui text-[11px] font-bold active:scale-95 transition-all shadow-[0_2px_4px_rgba(0,0,0,0.4)] cursor-pointer"
            >
              +250 ml Draft
            </button>
            <button
              onClick={() => {
                sounds.playDrop();
                onAddWater(500);
              }}
              type="button"
              className="flex-1 py-1.5 rounded-lg bg-[#182a3a] border border-[#234b6e] text-[#6bb9f0] hover:text-[#ffffff] font-sans-ui text-[11px] font-bold active:scale-95 transition-all shadow-[0_2px_4px_rgba(0,0,0,0.4)] cursor-pointer"
            >
              +500 ml Flagon
            </button>
          </div>
        </section>

        {/* Macronutrient Balances */}
        <section className="relative rounded-2xl bg-gradient-to-b from-[#1e2027] via-[#171920] to-[#131419] p-4 border border-[#3e372c] shadow-[0_8px_20px_rgba(0,0,0,0.6)] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#2d2922]">
            <div className="flex items-center gap-1.5">
              <Layers size={16} strokeWidth={2.4} className="text-[#c6a87d]" />
              <h3 className="font-serif-title text-[16px] text-[#f5eee5] font-semibold">
                Macro Proportions
              </h3>
            </div>
            <span className="font-sans-ui text-[10px] text-[#c6a87d] font-bold">Equilibrium</span>
          </div>

          <div className="space-y-2.5 my-2">
            {/* Protein */}
            <div>
              <div className="flex justify-between text-[11px] font-sans-ui mb-1">
                <span className="text-[#6bb9f0] font-bold">Protein</span>
                <span className="text-[#f5eee5] font-bold">
                  {totalProtein}g <span className="text-[#a7a195] font-normal">/ {targets.protein}g</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#14151a] border border-[#2e2a22] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0096c7] to-[#6bb9f0] rounded-full"
                  style={{ width: `${Math.min(100, (totalProtein / targets.protein) * 100)}%` }}
                />
              </div>
            </div>

            {/* Lipids / Fat */}
            <div>
              <div className="flex justify-between text-[11px] font-sans-ui mb-1">
                <span className="text-[#ea580c] font-bold">Lipids</span>
                <span className="text-[#f5eee5] font-bold">
                  {totalFat}g <span className="text-[#a7a195] font-normal">/ {targets.fat}g</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#14151a] border border-[#2e2a22] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#c2410c] to-[#ea580c] rounded-full"
                  style={{ width: `${Math.min(100, (totalFat / targets.fat) * 100)}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div>
              <div className="flex justify-between text-[11px] font-sans-ui mb-1">
                <span className="text-[#e5a93c] font-bold">Carbohydrates</span>
                <span className="text-[#f5eee5] font-bold">
                  {totalCarbs}g <span className="text-[#a7a195] font-normal">/ {targets.carbs}g</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#14151a] border border-[#2e2a22] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#b45309] to-[#e5a93c] rounded-full"
                  style={{ width: `${Math.min(100, (totalCarbs / targets.carbs) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-[#14151a] border border-[#2b271f] text-center">
            <span className="font-sans-ui text-[10px] text-[#a7a195]">
              Caloric Ratio: P {Math.round((totalProtein * 4 / (totalCalories || 1)) * 100)}% • F {Math.round((totalFat * 9 / (totalCalories || 1)) * 100)}% • C {Math.round((totalCarbs * 4 / (totalCalories || 1)) * 100)}%
            </span>
          </div>
        </section>
      </div>

      {/* Chronological Apothecary Register */}
      <section className="relative w-full rounded-2xl bg-[#181920] p-4 border border-[#36312a] shadow-[0_6px_16px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-3 border-b border-[#2e2a22] pb-2">
          <div className="flex items-center gap-1.5">
            <BookOpen size={16} strokeWidth={2.2} className="text-[#c6a87d]" />
            <h3 className="font-serif-title text-[17px] text-[#f5eee5]">Today's Recorded Ledger</h3>
          </div>

          {/* Filter pills */}
          <div className="flex gap-1">
            {(['All', 'Morning', 'Midday', 'Vesper'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  sounds.playClick(600);
                  setSelectedFilterSlot(filter);
                }}
                type="button"
                className={`px-2 py-0.5 rounded-full text-[9px] font-sans-ui font-bold uppercase transition-all cursor-pointer ${
                  selectedFilterSlot === filter
                    ? 'bg-[#2b251b] border border-[#d4af37]/60 text-[#f5e2ad]'
                    : 'text-[#8e8779] hover:text-[#f5eee5]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {displayedEntries.length === 0 ? (
          <div className="text-center py-8 text-[#8e8779]">
            <PenTool size={26} strokeWidth={1.8} className="mx-auto mb-1 text-[#8e8779]" />
            <p className="font-serif-title text-[15px] text-[#f5eee5]">No ledger entries yet</p>
            <p className="font-sans-ui text-[11px] mt-0.5">Use the Log screen or AI Scan to record meals</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayedEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#1d1f27] border border-[#332f26] shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#14151b] border border-[#3a352c] flex-shrink-0">
                    <img src={entry.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-sans-ui text-[13px] text-[#f5eee5] font-semibold block leading-tight">
                      {entry.name}
                    </span>
                    <span className="font-sans-ui text-[10px] text-[#a7a195] flex items-center gap-1.5 mt-0.5">
                      <span className="text-[#c6a87d] font-bold uppercase">{entry.slot}</span>
                      <span>•</span>
                      <span>{entry.timeFormatted}</span>
                      <span>•</span>
                      <span>{entry.weightGrams}g</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-serif-title text-[15px] text-[#f5e2ad] font-bold block leading-none">
                      +{entry.calories}
                    </span>
                    <span className="font-sans-ui text-[9px] text-[#a7a195]">kcal</span>
                  </div>

                  <button
                    onClick={() => {
                      sounds.playClick(450);
                      onDeleteEntry(entry.id);
                    }}
                    type="button"
                    title="Remove from ledger"
                    className="p-1 rounded text-[#8e8779] hover:text-[#ff6b6b] transition-colors cursor-pointer"
                  >
                    <Trash2 size={15} strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
