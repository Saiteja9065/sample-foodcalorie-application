import React, { useState } from 'react';
import {
  Scan,
  RefreshCw,
  Scale,
  ScanLine,
  CheckCircle,
  FlaskConical,
} from 'lucide-react';
import { FoodItem } from '../types';
import { sounds } from '../utils/audio';

interface AiScanViewProps {
  foods: FoodItem[];
  onTransferToScale: (food: FoodItem, estimatedWeight: number) => void;
}

export const AiScanView: React.FC<AiScanViewProps> = ({
  foods,
  onTransferToScale,
}) => {
  const [selectedSpecimenIndex, setSelectedSpecimenIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [opticalScanGrams, setOpticalScanGrams] = useState(180);

  const currentSpecimen = foods[selectedSpecimenIndex] || foods[0];

  const handleNextSpecimen = () => {
    sounds.playClick(700);
    const nextIdx = (selectedSpecimenIndex + 1) % foods.length;
    setSelectedSpecimenIndex(nextIdx);
    setOpticalScanGrams(foods[nextIdx].baseWeightGrams);
  };

  const handleTriggerAnalysis = () => {
    sounds.playScan();
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      sounds.playClick(950);
    }, 1200);
  };

  const handleTransfer = () => {
    sounds.playStamp();
    onTransferToScale(currentSpecimen, opticalScanGrams);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pb-28 pt-2 space-y-5 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="font-sans-ui text-[10px] uppercase tracking-widest text-[#00b4d8] font-bold flex items-center gap-1.5">
            <Scan size={14} strokeWidth={2.4} />
            Apothecary Optical Analyzer
          </span>
          <h2 className="font-serif-title text-[20px] text-[#f5eee5] font-semibold">
            Macro Lens &amp; Specimen Scan
          </h2>
        </div>
        <button
          onClick={handleNextSpecimen}
          type="button"
          className="px-2.5 py-1 rounded-xl bg-[#1e2026] border border-[#3b3429] text-[#c6a87d] hover:text-[#f5eee5] font-sans-ui text-[11px] font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
        >
          <span>Cycle Specimen</span>
          <RefreshCw size={13} strokeWidth={2.4} />
        </button>
      </div>

      {/* Optical Viewfinder Chassis */}
      <div className="relative w-full aspect-square max-h-[340px] rounded-2xl overflow-hidden bg-[#0c0d10] border-2 border-[#4b4335] shadow-[0_12px_28px_rgba(0,0,0,0.85),inset_0_2px_8px_rgba(0,0,0,0.9)] flex items-center justify-center">
        {/* Specimen imagery */}
        <img
          src={currentSpecimen.imageUrl}
          alt={currentSpecimen.name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isAnalyzing ? 'scale-105 filter blur-[0.5px] brightness-90' : 'scale-100'
          }`}
        />

        {/* Viewfinder reticle & crosshair overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle grid */}
          <div
            className="w-full h-full opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0, 180, 216, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 180, 216, 0.4) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Concentric rings */}
          <div className="absolute inset-8 rounded-full border border-[#00b4d8]/30 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border border-[#00b4d8]/40 border-dashed animate-spin" style={{ animationDuration: '30s' }} />
          </div>

          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#00b4d8]" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#00b4d8]" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#00b4d8]" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#00b4d8]" />

          {/* Scanning laser beam */}
          {isAnalyzing && (
            <div className="absolute inset-x-2 h-[2px] bg-gradient-to-r from-transparent via-[#00b4d8] to-transparent shadow-[0_0_16px_#00b4d8] animate-bounce" />
          )}

          {/* Optics Metadata Readout */}
          <div className="absolute top-4 inset-x-6 flex items-center justify-between text-[10px] font-sans-ui text-[#00b4d8] font-bold tracking-widest drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            <span>OPTIC 50MM • F/1.8</span>
            <span>AI BIO-ANALYSIS</span>
          </div>

          <div className="absolute bottom-4 inset-x-4 p-2.5 rounded-xl bg-[#14151a]/90 backdrop-blur-md border border-[#3b3529] shadow-lg flex items-center justify-between">
            <div>
              <span className="font-sans-ui text-[9px] uppercase tracking-wider text-[#4edea3] font-bold flex items-center gap-1">
                <CheckCircle size={11} strokeWidth={2.4} />
                {currentSpecimen.grade}
              </span>
              <span className="font-serif-title text-[15px] text-[#f5eee5] font-bold">
                {currentSpecimen.name}
              </span>
            </div>
            <div className="text-right">
              <span className="font-serif-title text-[15px] text-[#f5e2ad] font-bold block leading-none">
                ~{opticalScanGrams}g
              </span>
              <span className="font-sans-ui text-[9px] text-[#a7a195]">Mass Estimate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spectrometry Matrix Deck */}
      <section className="p-4 rounded-2xl bg-gradient-to-b from-[#1c1e26] via-[#16171e] to-[#121316] border border-[#3e372c] shadow-[0_6px_16px_rgba(0,0,0,0.5)] space-y-3">
        <div className="flex items-center justify-between border-b border-[#2d2922] pb-2">
          <span className="font-sans-ui text-[10px] uppercase tracking-wider text-[#c6a87d] font-bold flex items-center gap-1.5">
            <FlaskConical size={14} strokeWidth={2.4} className="text-[#00b4d8]" />
            Biochemical Composition
          </span>
          <span className="font-sans-ui text-[10px] text-[#4edea3] font-bold">
            99.4% Confidence
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded-xl bg-[#14151b] border border-[#2e2a22]">
            <span className="font-sans-ui text-[9px] uppercase text-[#c6a87d] block font-bold">Energy</span>
            <span className="font-serif-title text-[16px] text-[#f5eee5] font-bold">
              {Math.round(currentSpecimen.baseCalories * (opticalScanGrams / currentSpecimen.baseWeightGrams))}
            </span>
            <span className="font-sans-ui text-[8px] text-[#a7a195]">kcal</span>
          </div>
          <div className="p-2 rounded-xl bg-[#14151b] border border-[#2e2a22]">
            <span className="font-sans-ui text-[9px] uppercase text-[#6bb9f0] block font-bold">Protein</span>
            <span className="font-serif-title text-[16px] text-[#f5eee5] font-bold">
              {Math.round(currentSpecimen.baseProteinGrams * (opticalScanGrams / currentSpecimen.baseWeightGrams))}g
            </span>
            <span className="font-sans-ui text-[8px] text-[#6bb9f0]">Muscle</span>
          </div>
          <div className="p-2 rounded-xl bg-[#14151b] border border-[#2e2a22]">
            <span className="font-sans-ui text-[9px] uppercase text-[#ea580c] block font-bold">Lipids</span>
            <span className="font-serif-title text-[16px] text-[#f5eee5] font-bold">
              {Math.round(currentSpecimen.baseFatGrams * (opticalScanGrams / currentSpecimen.baseWeightGrams))}g
            </span>
            <span className="font-sans-ui text-[8px] text-[#ea580c]">Fats</span>
          </div>
          <div className="p-2 rounded-xl bg-[#14151b] border border-[#2e2a22]">
            <span className="font-sans-ui text-[9px] uppercase text-[#e5a93c] block font-bold">Carbs</span>
            <span className="font-serif-title text-[16px] text-[#f5eee5] font-bold">
              {Math.round(currentSpecimen.baseCarbsGrams * (opticalScanGrams / currentSpecimen.baseWeightGrams))}g
            </span>
            <span className="font-sans-ui text-[8px] text-[#a7a195]">Carbs</span>
          </div>
        </div>

        {/* Scan Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleTriggerAnalysis}
            disabled={isAnalyzing}
            type="button"
            className="flex-1 py-3 rounded-xl bg-[#222530] border border-[#3b3844] text-[#00b4d8] font-sans-ui text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <ScanLine size={16} strokeWidth={2.4} />
            {isAnalyzing ? 'Analyzing...' : 'Re-scan Specimen'}
          </button>

          <button
            onClick={handleTransfer}
            type="button"
            className="flex-1 py-3 rounded-xl bg-gradient-to-b from-[#4a3d28] via-[#2d2417] to-[#17140f] border border-[#d4af37]/60 text-[#f5eee5] font-serif-title text-[14px] font-bold tracking-wide flex items-center justify-center gap-2 shadow-[0_6px_16px_rgba(0,0,0,0.7)] active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Scale size={16} strokeWidth={2.4} className="text-[#d4af37]" />
            Place on Scale
          </button>
        </div>
      </section>
    </div>
  );
};
