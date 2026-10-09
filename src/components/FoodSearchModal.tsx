import React, { useState } from 'react';
import { BookOpen, Search, X, Scale } from 'lucide-react';
import { FoodItem } from '../types';
import { sounds } from '../utils/audio';

interface FoodSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  foods: FoodItem[];
  onSelectFood: (food: FoodItem) => void;
  initialQuery?: string;
}

export const FoodSearchModal: React.FC<FoodSearchModalProps> = ({
  isOpen,
  onClose,
  foods,
  onSelectFood,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Catalog' },
    { id: 'seafood', label: 'Coldwater & Sea' },
    { id: 'poultry', label: 'Poultry & Game' },
    { id: 'produce', label: 'Botanical & Orchard' },
    { id: 'grain', label: 'Ancient Grains' },
    { id: 'bakery', label: 'Hearth & Bakery' },
    { id: 'beverage', label: 'Elixirs & Infusions' },
  ];

  const filtered = foods.filter((food) => {
    const matchesQuery =
      food.name.toLowerCase().includes(query.toLowerCase()) ||
      food.description.toLowerCase().includes(query.toLowerCase()) ||
      food.grade.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md h-[85vh] max-h-[620px] rounded-2xl bg-gradient-to-b from-[#1b1c24] via-[#16171e] to-[#121316] border border-[#3e372c] p-4 shadow-[0_16px_36px_rgba(0,0,0,0.9)] flex flex-col relative">
        {/* Header with Search Input */}
        <div className="pb-3 border-b border-[#312c24]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans-ui text-[10px] uppercase tracking-widest text-[#c6a87d] font-bold flex items-center gap-1.5">
              <BookOpen size={14} strokeWidth={2.4} />
              Apothecary Nutritional Repository
            </span>
            <button
              onClick={() => {
                sounds.playClick(500);
                onClose();
              }}
              type="button"
              className="text-[#a7a195] hover:text-[#ff6b6b] p-1 cursor-pointer"
            >
              <X size={18} strokeWidth={2.4} />
            </button>
          </div>

          <div className="relative w-full rounded-xl bg-[#14151a] p-1 border border-[#3b3429] shadow-[inset_0_3px_6px_rgba(0,0,0,0.7)]">
            <div className="flex items-center px-3 py-2 bg-[#191b22] rounded-lg">
              <Search size={18} strokeWidth={2.4} className="text-[#c6a87d] mr-2 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search food or apothecary ingredient..."
                className="w-full bg-transparent border-0 p-0 text-[#f5f1e8] font-sans-ui text-[14px] placeholder:text-[#787265] focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  type="button"
                  className="text-[#a7a195] hover:text-[#f5eee5] mr-1 cursor-pointer"
                >
                  <X size={15} strokeWidth={2.4} />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-1.5 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  sounds.playClick(600);
                  setSelectedCategory(c.id);
                }}
                type="button"
                className={`flex-shrink-0 px-2.5 py-1 rounded-full font-sans-ui text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-[#2b251b] border border-[#d4af37]/70 text-[#f5e2ad]'
                    : 'bg-[#181920] border border-[#312c24] text-[#8b8476] hover:text-[#f5eee5]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto my-2 space-y-2 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#a7a195]">
              <Search size={30} className="mx-auto text-[#635c4f] mb-2 block" />
              <p className="font-serif-title text-[16px] text-[#f5eee5]">No Specimen Found</p>
              <p className="font-sans-ui text-[12px] mt-1">Try another ingredient query or botanical name</p>
            </div>
          ) : (
            filtered.map((food) => (
              <div
                key={food.id}
                onClick={() => {
                  sounds.playClick(750);
                  onSelectFood(food);
                  onClose();
                }}
                className="group flex items-center justify-between p-2.5 rounded-xl bg-[#1d1f27] border border-[#332f26] hover:border-[#c6a87d]/60 hover:bg-[#22242e] transition-all cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#14151a] border border-[#3a352c] flex-shrink-0">
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <span className="font-sans-ui text-[10px] uppercase tracking-wider text-[#c6a87d] font-bold">
                      {food.grade}
                    </span>
                    <h4 className="font-serif-title text-[15px] text-[#f5eee5] font-semibold leading-tight">
                      {food.name}
                    </h4>
                    <span className="font-sans-ui text-[11px] text-[#a7a195] block mt-0.5">
                      {food.baseCalories} kcal • P: {food.baseProteinGrams}g • F: {food.baseFatGrams}g • C: {food.baseCarbsGrams}g
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-lg bg-[#262832] border border-[#443e33] flex items-center justify-center text-[#e8c99b] group-hover:text-[#4edea3]">
                  <Scale size={16} strokeWidth={2.2} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
