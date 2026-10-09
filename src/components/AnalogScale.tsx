import React from 'react';
import { Minus, Plus, Scale, X } from 'lucide-react';
import { FoodItem } from '../types';
import { sounds } from '../utils/audio';

interface AnalogScaleProps {
  food: FoodItem;
  weightGrams: number;
  onWeightChange: (newWeight: number) => void;
  onClearFood?: () => void;
}

export const AnalogScale: React.FC<AnalogScaleProps> = ({
  food,
  weightGrams,
  onWeightChange,
  onClearFood,
}) => {
  const handleDecrement = (amount = 10) => {
    const next = Math.max(10, weightGrams - amount);
    sounds.playClick(600);
    onWeightChange(next);
  };

  const handleIncrement = (amount = 10) => {
    const next = Math.min(600, weightGrams + amount);
    sounds.playClick(720);
    onWeightChange(next);
  };

  // Compute dynamic rotation angle for analog needle
  // Baseline: 0g -> -60deg, 180g -> 18deg, 360g -> 54deg
  const needleAngle = Math.min(65, Math.max(-65, -60 + (weightGrams / 180) * 78));

  // Compute progress for arc track
  const arcProgress = Math.min(1, Math.max(0.05, weightGrams / 350));
  const arcDash = 260;
  const strokeOffset = arcDash - arcDash * arcProgress;

  return (
    <section className="w-full relative rounded-2xl bg-gradient-to-b from-[#1e2027] via-[#191a21] to-[#15161c] p-4 border border-[#3e372c] shadow-[0_8px_24px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.08)]">
      {/* Corner Decorative Copper Rivets */}
      <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-gradient-to-br from-[#c6a87d] to-[#403527] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_1px_2px_rgba(0,0,0,0.8)]" />
      <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-gradient-to-br from-[#c6a87d] to-[#403527] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_1px_2px_rgba(0,0,0,0.8)]" />

      {/* Active Item Header */}
      <div className="flex items-start justify-between border-b border-[#312c24] pb-3">
        <div className="flex gap-3 items-center">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#14151a] border border-[#4a4233] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.08)] flex-shrink-0">
            <img
              alt={food.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              src={food.imageUrl}
            />
          </div>
          <div>
            <span className="font-sans-ui text-[10px] uppercase tracking-wider text-[#c6a87d] font-bold">
              {food.grade}
            </span>
            <h2 className="font-serif-title text-[18px] text-[#f5eee5] font-semibold leading-tight mt-0.5">
              {food.name}
            </h2>
            <p className="font-sans-ui text-[12px] text-[#a7a195] line-clamp-1">{food.description}</p>
          </div>
        </div>

        {onClearFood && (
          <button
            onClick={() => {
              sounds.playClick(500);
              onClearFood();
            }}
            className="p-1 rounded-full text-[#a7a195] hover:text-[#ff6b6b] transition-colors flex items-center justify-center cursor-pointer"
            title="Remove from scale"
            type="button"
          >
            <X size={18} strokeWidth={2.4} />
          </button>
        )}
      </div>

      {/* Horology & Scale Dial Visual */}
      <div className="my-4 py-2 px-3 rounded-xl bg-[#14151b] border border-[#363026] shadow-[inset_0_3px_6px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.04)] flex flex-col items-center">
        <div className="w-full flex items-center justify-between text-[#a7a195] px-1 mb-1">
          <span className="font-sans-ui text-[9px] uppercase tracking-widest font-bold text-[#c6a87d] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
            Analog Spring Beam
          </span>
          <span className="font-sans-ui text-[9px] uppercase tracking-widest font-bold text-[#a7a195]">
            Balance Meter
          </span>
        </div>

        {/* Balance Dial Face SVG */}
        <div className="relative w-full max-w-[260px] h-20 flex items-center justify-center select-none">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 240 80">
            <defs>
              <linearGradient id="springArcGlow" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#b8860b" />
                <stop offset="60%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#4edea3" />
              </linearGradient>
              <filter id="needleGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* Scale background arc track */}
            <path
              d="M 20 70 A 100 100 0 0 1 220 70"
              fill="none"
              stroke="#2d303a"
              strokeLinecap="round"
              strokeWidth="6"
            />

            {/* Dynamic Active spring arc */}
            <path
              d="M 20 70 A 100 100 0 0 1 220 70"
              fill="none"
              stroke="url(#springArcGlow)"
              strokeLinecap="round"
              strokeWidth="6"
              strokeDasharray="260"
              strokeDashoffset={strokeOffset}
              style={{ transition: 'stroke-dashoffset 0.25s cubic-bezier(0.2, 0.8, 0.3, 1)' }}
            />

            {/* Graduation ticks */}
            <g opacity="0.85" stroke="#716758" strokeWidth="1.5">
              <line x1="26" x2="33" y1="64" y2="60" />
              <line x1="48" x2="54" y1="46" y2="43" />
              <line x1="75" x2="79" y1="33" y2="39" />
              <line x1="106" x2="108" y1="26" y2="33" />
              <line x1="135" x2="133" y1="26" y2="33" />
              <line x1="165" x2="161" y1="33" y2="39" />
              <line x1="192" x2="186" y1="46" y2="43" />
              <line x1="214" x2="207" y1="64" y2="60" />
            </g>

            {/* Sub-graduation fine ticks */}
            <g opacity="0.4" stroke="#d4af37" strokeWidth="1">
              <line x1="37" x2="42" y1="55" y2="52" />
              <line x1="61" x2="64" y1="39" y2="44" />
              <line x1="90" x2="91" y1="29" y2="34" />
              <line x1="120" x2="120" y1="25" y2="32" stroke="#4edea3" strokeWidth="1.5" />
              <line x1="150" x2="149" y1="29" y2="34" />
              <line x1="178" x2="175" y1="39" y2="44" />
              <line x1="203" x2="198" y1="55" y2="52" />
            </g>

            {/* Needle Indicator Pivot with Spring Physics Transition */}
            <g
              transform={`rotate(${needleAngle}, 120, 85)`}
              filter="url(#needleGlow)"
              style={{
                transition: 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transformOrigin: '120px 85px',
              }}
            >
              <polygon fill="#d4af37" points="118,85 122,85 120.5,15 119.5,15" />
              <circle cx="120" cy="18" fill="#f5e2ad" r="2.5" />
              <line stroke="#ffffff" strokeWidth="0.75" x1="120" x2="120" y1="85" y2="18" />
            </g>

            {/* Central pivot jewel / brass bolt */}
            <circle cx="120" cy="78" fill="#1e1810" r="7" stroke="#d4af37" strokeWidth="2" />
            <circle cx="120" cy="78" fill="#4edea3" r="2" opacity="0.8" />
          </svg>

          <span className="absolute bottom-0.5 font-sans-ui text-[9px] uppercase tracking-wider text-[#a7a195] font-bold">
            Tare Calibrated • {((weightGrams / food.baseWeightGrams)).toFixed(2)}x
          </span>
        </div>

        {/* Rotary Stepper Counter Module */}
        <div className="mt-2 w-full flex items-center justify-between px-2 pt-2 border-t border-[#2e2a22]">
          {/* Minus Button */}
          <button
            onClick={() => handleDecrement(10)}
            className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#282a35] to-[#1a1c22] border border-[#443e33] shadow-[0_2px_5px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center text-[#e8c99b] hover:text-[#f5eee5] hover:border-[#675c54] transition-all cursor-pointer"
            title="Decrease 10g"
            type="button"
          >
            <Minus size={20} strokeWidth={2.4} />
          </button>

          {/* Mechanical Drum Window with weight readout */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#111216] border border-[#3b3429] shadow-[inset_0_3px_6px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.05)]">
            <Scale size={16} strokeWidth={2.2} className="text-[#c6a87d]" />
            <span
              className="font-serif-title text-[32px] text-[#f5eee5] tracking-tight font-bold min-w-[58px] text-center"
              id="weight-display"
            >
              {weightGrams}
            </span>
            <span className="font-sans-ui text-[10px] uppercase tracking-wider text-[#a7a195] font-bold self-end pb-1">
              Grams
            </span>
          </div>

          {/* Plus Button */}
          <button
            onClick={() => handleIncrement(10)}
            className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#282a35] to-[#1a1c22] border border-[#443e33] shadow-[0_2px_5px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center text-[#e8c99b] hover:text-[#f5eee5] hover:border-[#675c54] transition-all cursor-pointer"
            title="Increase 10g"
            type="button"
          >
            <Plus size={20} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </section>
  );
};
