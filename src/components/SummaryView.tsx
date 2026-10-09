import React, { useState } from 'react';
import { BookOpen, Copy, Check } from 'lucide-react';
import { LoggedEntry, DailyTargets } from '../types';
import { sounds } from '../utils/audio';

interface SummaryViewProps {
  entries: LoggedEntry[];
  targets: DailyTargets;
  waterIntakeMl: number;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  entries,
  targets,
  waterIntakeMl,
}) => {
  const [copiedNotice, setCopiedNotice] = useState(false);

  const totalCalories = entries.reduce((s, e) => s + e.calories, 0);
  const totalProtein = entries.reduce((s, e) => s + e.protein, 0);
  const totalFat = entries.reduce((s, e) => s + e.fat, 0);
  const totalCarbs = entries.reduce((s, e) => s + e.carbs, 0);

  // Simulated 7-day archival trajectory
  const pastDays = [
    { day: 'Thu', date: 'Oct 02', kcal: 2110 },
    { day: 'Fri', date: 'Oct 03', kcal: 2180 },
    { day: 'Sat', date: 'Oct 04', kcal: 1950 },
    { day: 'Sun', date: 'Oct 05', kcal: 2240 },
    { day: 'Mon', date: 'Oct 06', kcal: 2090 },
    { day: 'Tue', date: 'Oct 07', kcal: 2130 },
    { day: 'Wed (Today)', date: 'Oct 08', kcal: totalCalories },
  ];

  const handleExportLedger = () => {
    sounds.playStamp();
    const ledgerText = `--- NOURISH & FLOW APOTHECARY LEDGER ---
Date: October 08, 2026
Total Energy: ${totalCalories} / ${targets.calories} kcal
Protein: ${totalProtein}g | Lipids: ${totalFat}g | Carbs: ${totalCarbs}g
Hydration: ${waterIntakeMl}ml / ${targets.waterMl}ml
Logged Entries (${entries.length}):
${entries.map((e) => `• [${e.slot}] ${e.name} (${e.weightGrams}g): ${e.calories} kcal`).join('\n')}
------------------------------------------`;

    navigator.clipboard?.writeText(ledgerText);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pb-28 pt-2 space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="font-sans-ui text-[10px] uppercase tracking-widest text-[#c6a87d] font-bold flex items-center gap-1.5">
            <BookOpen size={14} strokeWidth={2.4} />
            Apothecary Archives
          </span>
          <h2 className="font-serif-title text-[20px] text-[#f5eee5] font-semibold">
            Nutritional Codex &amp; Ledger
          </h2>
        </div>
        <button
          onClick={handleExportLedger}
          type="button"
          className="px-3 py-1.5 rounded-xl bg-gradient-to-b from-[#2b271d] to-[#1c1912] border border-[#d4af37]/50 text-[#f5e2ad] font-sans-ui text-[11px] font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
        >
          {copiedNotice ? (
            <Check size={14} strokeWidth={2.6} className="text-[#4edea3]" />
          ) : (
            <Copy size={14} strokeWidth={2.2} />
          )}
          <span>{copiedNotice ? 'Copied Codex!' : 'Export Entry'}</span>
        </button>
      </div>

      {/* Parchment Ledger Summary Card */}
      <section className="relative w-full rounded-2xl bg-[#181920] p-4 pl-6 border border-[#36312a] shadow-[0_8px_20px_rgba(0,0,0,0.6)]">
        {/* Binder Ring Holes */}
        <div className="absolute left-2 top-6 w-3 h-3 rounded-full bg-[#101115] shadow-[inset_0_2px_3px_rgba(0,0,0,0.9)]" />
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#101115] shadow-[inset_0_2px_3px_rgba(0,0,0,0.9)]" />
        <div className="absolute left-2 bottom-6 w-3 h-3 rounded-full bg-[#101115] shadow-[inset_0_2px_3px_rgba(0,0,0,0.9)]" />

        <div className="border-b border-[#2d2922] pb-3 mb-3">
          <span className="font-serif-title text-[17px] text-[#f5eee5] font-semibold block">
            Diurnal Equilibrium Score
          </span>
          <p className="font-sans-ui text-[12px] text-[#a7a195] mt-0.5">
            Measured against natural metabolic rhythms and whole-food caloric density
          </p>
        </div>

        {/* 7-day trajectory bars */}
        <div className="space-y-2 mb-4">
          <span className="font-sans-ui text-[9px] uppercase tracking-widest text-[#c6a87d] font-bold block mb-1">
            7-Day Caloric Trajectory
          </span>
          {pastDays.map((item, idx) => {
            const barWidth = Math.min(100, Math.round((item.kcal / targets.calories) * 100));
            const isToday = idx === pastDays.length - 1;

            return (
              <div key={item.date} className="flex items-center gap-2 text-[11px] font-sans-ui">
                <span
                  className={`w-20 ${
                    isToday ? 'text-[#f5e2ad] font-bold' : 'text-[#8e8779]'
                  }`}
                >
                  {item.day}
                </span>
                <div className="flex-1 h-2 rounded-full bg-[#131418] border border-[#2b271e] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isToday
                        ? 'bg-gradient-to-r from-[#b8860b] to-[#4edea3]'
                        : 'bg-[#5b513f]'
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <span
                  className={`w-14 text-right font-serif-title text-[12px] ${
                    isToday ? 'text-[#f5eee5] font-bold' : 'text-[#a7a195]'
                  }`}
                >
                  {item.kcal} kcal
                </span>
              </div>
            );
          })}
        </div>

        {/* Holistic Nutrient Breakdown */}
        <div className="pt-3 border-t border-[#2d2922] grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-[#14151b] border border-[#2b271f]">
            <span className="font-sans-ui text-[9px] uppercase text-[#6bb9f0] block font-bold">
              Total Protein
            </span>
            <span className="font-serif-title text-[16px] text-[#f5eee5] font-bold">{totalProtein}g</span>
            <span className="font-sans-ui text-[8px] text-[#a7a195]">Target: {targets.protein}g</span>
          </div>
          <div className="p-2 rounded-lg bg-[#14151b] border border-[#2b271f]">
            <span className="font-sans-ui text-[9px] uppercase text-[#ea580c] block font-bold">
              Total Lipids
            </span>
            <span className="font-serif-title text-[16px] text-[#f5eee5] font-bold">{totalFat}g</span>
            <span className="font-sans-ui text-[8px] text-[#a7a195]">Target: {targets.fat}g</span>
          </div>
          <div className="p-2 rounded-lg bg-[#14151b] border border-[#2b271f]">
            <span className="font-sans-ui text-[9px] uppercase text-[#e5a93c] block font-bold">
              Total Carbs
            </span>
            <span className="font-serif-title text-[16px] text-[#f5eee5] font-bold">{totalCarbs}g</span>
            <span className="font-sans-ui text-[8px] text-[#a7a195]">Target: {targets.carbs}g</span>
          </div>
        </div>
      </section>

      {/* Historical Logs List */}
      <section className="space-y-2">
        <span className="font-sans-ui text-[10px] uppercase tracking-widest text-[#a7a195] font-bold px-1 block">
          All Chronological Registers ({entries.length})
        </span>
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between p-3 rounded-xl bg-[#1a1b22] border border-[#332f26] shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#121316] border border-[#38332a] flex-shrink-0">
                <img src={entry.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-serif-title text-[14px] text-[#f5eee5] font-semibold leading-tight">
                  {entry.name}
                </h4>
                <span className="font-sans-ui text-[10px] text-[#c6a87d] font-bold uppercase mt-0.5 block">
                  {entry.slot} • {entry.timeFormatted} • {entry.weightGrams}g
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-serif-title text-[16px] text-[#f5e2ad] font-bold block leading-none">
                +{entry.calories}
              </span>
              <span className="font-sans-ui text-[9px] text-[#a7a195]">kcal</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
