import React, { useState } from 'react';
import { BookOpen, Flame, Plus, Check } from 'lucide-react';
import { FoodItem } from '../types';
import { sounds } from '../utils/audio';

interface LedgerArchivesProps {
  foods: FoodItem[];
  onSelectFood: (food: FoodItem) => void;
  onQuickAdd: (food: FoodItem) => void;
}

export const LedgerArchives: React.FC<LedgerArchivesProps> = ({
  foods,
  onSelectFood,
  onQuickAdd,
}) => {
  const [activeTab, setActiveTab] = useState<'recent' | 'favorites'>('recent');
  const [addedId, setAddedId] = useState<string | null>(null);

  const displayedFoods = activeTab === 'favorites'
    ? foods.filter((f) => f.isFavorite)
    : foods;

  const handleQuickAddClick = (e: React.MouseEvent, food: FoodItem) => {
    e.stopPropagation();
    sounds.playStamp();
    setAddedId(food.id);
    onQuickAdd(food);
    setTimeout(() => {
      setAddedId(null);
    }, 1200);
  };

  return (
    <section className="w-full relative">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-1.5">
          <BookOpen size={16} strokeWidth={2.2} className="text-[#c6a87d]" />
          <h3 className="font-serif-title text-[18px] text-[#f5eee5]">Ledger Archives</h3>
        </div>

        <div className="flex items-center gap-1 text-[#a7a195]">
          <button
            onClick={() => {
              sounds.playClick(600);
              setActiveTab('recent');
            }}
            type="button"
            className={`px-2.5 py-0.5 rounded-full font-sans-ui text-[10px] uppercase font-bold transition-all cursor-pointer ${
              activeTab === 'recent'
                ? 'bg-[#20222a] border border-[#3f382e] text-[#f5eee5] shadow-[0_1px_0_rgba(255,255,255,0.05)]'
                : 'text-[#a7a195] hover:text-[#f5eee5]'
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => {
              sounds.playClick(650);
              setActiveTab('favorites');
            }}
            type="button"
            className={`px-2.5 py-0.5 rounded-full font-sans-ui text-[10px] uppercase font-bold transition-all cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-[#20222a] border border-[#3f382e] text-[#f5eee5] shadow-[0_1px_0_rgba(255,255,255,0.05)]'
                : 'text-[#a7a195] hover:text-[#f5eee5]'
            }`}
          >
            Favorites
          </button>
        </div>
      </div>

      {/* Paper Sheet Container with Binder Punches */}
      <div className="relative w-full rounded-2xl bg-[#181920] p-3 pl-6 border border-[#36312a] shadow-[0_6px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] space-y-2">
        {/* Binder Ring Hole Punches */}
        <div className="absolute left-2 top-6 w-3 h-3 rounded-full bg-[#101115] shadow-[inset_0_2px_3px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.05)]" />
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#101115] shadow-[inset_0_2px_3px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.05)]" />
        <div className="absolute left-2 bottom-6 w-3 h-3 rounded-full bg-[#101115] shadow-[inset_0_2px_3px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.05)]" />

        {displayedFoods.map((food) => {
          const isJustAdded = addedId === food.id;

          return (
            <div
              key={food.id}
              onClick={() => {
                sounds.playClick(700);
                onSelectFood(food);
              }}
              className="group flex items-center justify-between p-2.5 rounded-xl bg-[#1d1f27] border border-[#332f26] shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all hover:bg-[#22242e] hover:border-[#4d3e2a] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#14151b] border border-[#3a352c] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] flex-shrink-0">
                  <img
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    src={food.imageUrl}
                  />
                </div>
                <div>
                  <span className="font-sans-ui text-[14px] text-[#f5eee5] font-semibold block leading-snug">
                    {food.name}
                  </span>
                  <span className="font-sans-ui text-[11px] text-[#a7a195] flex items-center gap-1.5 mt-0.5">
                    <Flame size={12} strokeWidth={2.4} className="text-[#f59e0b] flex-shrink-0" />
                    <span>{food.baseCalories} kcal • {food.baseWeightGrams}g Portion</span>
                  </span>
                </div>
              </div>

              {/* Quick Add Button */}
              <button
                onClick={(e) => handleQuickAddClick(e, food)}
                type="button"
                title={`Quick add ${food.name}`}
                className={`w-8 h-8 rounded-lg border text-[#e8c99b] flex items-center justify-center transition-all cursor-pointer ${
                  isJustAdded
                    ? 'bg-[#1b3325] border-[#4edea3] text-[#4edea3] shadow-[0_0_8px_#4edea3]'
                    : 'bg-[#262832] border-[#443e33] shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] active:translate-y-0.5 active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] hover:text-[#f5eee5] hover:border-[#675c54]'
                }`}
              >
                {isJustAdded ? (
                  <Check size={16} strokeWidth={2.8} />
                ) : (
                  <Plus size={16} strokeWidth={2.4} />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
