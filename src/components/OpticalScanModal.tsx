import React, { useState, useEffect } from 'react';
import { ScanBarcode, X, ScanLine, CheckCircle, Scale } from 'lucide-react';
import { FoodItem } from '../types';
import { sounds } from '../utils/audio';

interface OpticalScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  foods: FoodItem[];
  onSelectFood: (food: FoodItem) => void;
}

export const OpticalScanModal: React.FC<OpticalScanModalProps> = ({
  isOpen,
  onClose,
  foods,
  onSelectFood,
}) => {
  const [isScanning, setIsScanning] = useState(true);
  const [detectedItem, setDetectedItem] = useState<FoodItem | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      setDetectedItem(null);
      sounds.playScan();

      const timer = setTimeout(() => {
        setIsScanning(false);
        const sample = foods[Math.floor(Math.random() * foods.length)];
        setDetectedItem(sample);
        sounds.playClick(900);
      }, 1600);

      return () => clearTimeout(timer);
    }
  }, [isOpen, foods]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (detectedItem) {
      sounds.playStamp();
      onSelectFood(detectedItem);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#1b1d24] to-[#121316] border border-[#3e372c] p-4 shadow-[0_16px_36px_rgba(0,0,0,0.9)] relative flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#312c24]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#14151a] border border-[#4a4233] flex items-center justify-center">
              <ScanBarcode size={15} className="text-[#6bb9f0]" />
            </div>
            <div>
              <h3 className="font-serif-title text-[17px] text-[#f5eee5] font-semibold leading-tight">
                Optical Scan
              </h3>
              <p className="font-sans-ui text-[10px] uppercase tracking-wider text-[#6bb9f0] font-bold">
                Apothecary Barcode Beam
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

        {/* Viewfinder Window */}
        <div className="relative my-4 w-full aspect-square max-h-[260px] rounded-xl overflow-hidden bg-[#0c0d10] border border-[#363026] shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] flex items-center justify-center">
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                'linear-gradient(#6bb9f0 1px, transparent 1px), linear-gradient(90deg, #6bb9f0 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Crosshair corners */}
          <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#6bb9f0]" />
          <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-[#6bb9f0]" />
          <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-[#6bb9f0]" />
          <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#6bb9f0]" />

          {/* Scanning laser beam */}
          {isScanning ? (
            <>
              <div className="absolute inset-x-4 h-[2px] bg-gradient-to-r from-transparent via-[#6bb9f0] to-transparent shadow-[0_0_12px_#6bb9f0] animate-bounce" />
              <div className="flex flex-col items-center z-10">
                <ScanLine size={36} className="text-[#6bb9f0] animate-pulse" />
                <span className="font-sans-ui text-[11px] uppercase tracking-widest text-[#a7a195] font-bold mt-2">
                  Acquiring Specimen...
                </span>
              </div>
            </>
          ) : detectedItem ? (
            <div className="relative w-full h-full p-3 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent">
              <img
                src={detectedItem.imageUrl}
                alt={detectedItem.name}
                className="absolute inset-0 w-full h-full object-cover -z-10"
              />
              <div className="p-2.5 rounded-lg bg-[#14151a]/95 border border-[#4a4233] shadow-lg backdrop-blur-sm">
                <span className="font-sans-ui text-[9px] uppercase tracking-wider text-[#4edea3] font-bold flex items-center gap-1">
                  <CheckCircle size={11} strokeWidth={2.4} />
                  Identified Specimen
                </span>
                <h4 className="font-serif-title text-[15px] text-[#f5eee5] font-bold">
                  {detectedItem.name}
                </h4>
                <p className="font-sans-ui text-[11px] text-[#c6a87d]">
                  {detectedItem.baseCalories} kcal • {detectedItem.baseWeightGrams}g Portion
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Specimen quick select buttons */}
        <div className="mb-4">
          <span className="font-sans-ui text-[10px] uppercase tracking-wider text-[#a7a195] font-bold block mb-1.5">
            Or Match Archival Specimen:
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {foods.slice(0, 4).map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  sounds.playClick(700);
                  setIsScanning(false);
                  setDetectedItem(f);
                }}
                type="button"
                className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg border text-left flex items-center gap-1.5 transition-all cursor-pointer ${
                  detectedItem?.id === f.id
                    ? 'bg-[#252834] border-[#6bb9f0] text-[#f5eee5]'
                    : 'bg-[#15161c] border-[#332f26] text-[#a7a195]'
                }`}
              >
                <img src={f.imageUrl} alt="" className="w-5 h-5 rounded object-cover" />
                <span className="font-sans-ui text-[11px] font-semibold">{f.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleApply}
          disabled={!detectedItem || isScanning}
          type="button"
          className="w-full py-2.5 rounded-xl bg-gradient-to-b from-[#25394f] via-[#1a2939] to-[#121c27] border border-[#6bb9f0]/50 text-[#f5eee5] font-sans-ui text-[13px] font-bold tracking-wider uppercase shadow-[0_6px_16px_rgba(0,0,0,0.7)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Scale size={16} strokeWidth={2.4} className="text-[#6bb9f0]" />
          Mount to Balance Scale
        </button>
      </div>
    </div>
  );
};
