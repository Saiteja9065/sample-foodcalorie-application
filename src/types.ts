export type DiurnalSlot = 'Morning' | 'Midday' | 'Vesper' | 'Bite';

export interface FoodItem {
  id: string;
  name: string;
  grade: string;
  description: string;
  imageUrl: string;
  baseWeightGrams: number;
  baseCalories: number;
  baseProteinGrams: number;
  baseFatGrams: number;
  baseCarbsGrams: number;
  fiberGrams?: number;
  category: 'seafood' | 'poultry' | 'bakery' | 'beverage' | 'grain' | 'produce';
  highlightTag?: string;
  isFavorite?: boolean;
}

export interface LoggedEntry {
  id: string;
  foodId: string;
  name: string;
  slot: DiurnalSlot;
  weightGrams: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  timestamp: string;
  timeFormatted: string;
  imageUrl: string;
  note?: string;
}

export interface DailyTargets {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  waterMl: number;
}
