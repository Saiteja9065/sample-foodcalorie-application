import React from 'react';

interface NutritionalMatrixProps {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  proteinGoalPercent?: number;
  fatHighlight?: string;
  carbsHighlight?: string;
}

export const NutritionalMatrix: React.FC<NutritionalMatrixProps> = ({
  calories,
  protein,
  fat,
  carbs,
  proteinGoalPercent = 42,
  fatHighlight = 'Omega-3',
  carbsHighlight = '0% sugar',
}) => {
  return (
    <div className="grid grid-cols-4 gap-2 pt-1 text-center">
      {/* Energy / Calories */}
      <div className="p-2 rounded-xl bg-[#17181e] border border-[#363128] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.04)]">
        <span className="font-sans-ui text-[10px] text-[#c6a87d] uppercase tracking-wider block font-bold">
          Energy
        </span>
        <span className="font-serif-title text-[18px] text-[#f5eee5] font-bold block leading-snug">
          {calories}
        </span>
        <span className="font-sans-ui text-[9px] text-[#a7a195] block -mt-0.5">
          kcal
        </span>
      </div>

      {/* Protein */}
      <div className="p-2 rounded-xl bg-[#17181e] border border-[#363128] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.04)]">
        <span className="font-sans-ui text-[10px] text-[#6bb9f0] uppercase tracking-wider block font-bold">
          Protein
        </span>
        <span className="font-serif-title text-[18px] text-[#f5eee5] font-bold block leading-snug">
          {protein}
          <span className="text-xs font-normal">g</span>
        </span>
        <span className="font-sans-ui text-[9px] text-[#6bb9f0] font-semibold block -mt-0.5">
          {proteinGoalPercent}% goal
        </span>
      </div>

      {/* Lipids / Fat */}
      <div className="p-2 rounded-xl bg-[#17181e] border border-[#363128] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.04)]">
        <span className="font-sans-ui text-[10px] text-[#ea580c] uppercase tracking-wider block font-bold">
          Lipids
        </span>
        <span className="font-serif-title text-[18px] text-[#f5eee5] font-bold block leading-snug">
          {fat}
          <span className="text-xs font-normal">g</span>
        </span>
        <span className="font-sans-ui text-[9px] text-[#ea580c] font-semibold block -mt-0.5">
          {fatHighlight}
        </span>
      </div>

      {/* Carbs */}
      <div className="p-2 rounded-xl bg-[#17181e] border border-[#363128] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.04)]">
        <span className="font-sans-ui text-[10px] text-[#e5a93c] uppercase tracking-wider block font-bold">
          Carbs
        </span>
        <span className="font-serif-title text-[18px] text-[#f5eee5] font-bold block leading-snug">
          {carbs}
          <span className="text-xs font-normal">g</span>
        </span>
        <span className="font-sans-ui text-[9px] text-[#a7a195] block -mt-0.5">
          {carbsHighlight}
        </span>
      </div>
    </div>
  );
};
