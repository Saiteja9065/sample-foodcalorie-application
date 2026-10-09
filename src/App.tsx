/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DiurnalSlot, FoodItem, LoggedEntry, DailyTargets } from './types';
import {
  DEFAULT_FOODS,
  INITIAL_LOGGED_ENTRIES,
  DEFAULT_TARGETS,
} from './data/foods';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { LogView } from './components/LogView';
import { TodayView } from './components/TodayView';
import { AiScanView } from './components/AiScanView';
import { SummaryView } from './components/SummaryView';
import { ProfileModal } from './components/ProfileModal';
import { sounds } from './utils/audio';

export default function App() {
  // Navigation & Slot state (defaulting to the exact screen in the prompt: Log tab + Midday slot)
  const [activeTab, setActiveTab] = useState<TabType>('log');
  const [activeSlot, setActiveSlot] = useState<DiurnalSlot>('Midday');

  // Food catalog & scale state
  const [foods] = useState<FoodItem[]>(DEFAULT_FOODS);
  const [currentScaleFood, setCurrentScaleFood] = useState<FoodItem>(DEFAULT_FOODS[0]);
  const [scaleWeightGrams, setScaleWeightGrams] = useState<number>(180);

  // Diary logs & targets
  const [loggedEntries, setLoggedEntries] = useState<LoggedEntry[]>(INITIAL_LOGGED_ENTRIES);
  const [waterIntakeMl, setWaterIntakeMl] = useState<number>(1750);
  const [targets, setTargets] = useState<DailyTargets>(DEFAULT_TARGETS);

  // Audio & Settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const handleToggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  const handleCommitLogEntry = (
    newEntry: Omit<LoggedEntry, 'id' | 'timestamp' | 'timeFormatted'>
  ) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const entry: LoggedEntry = {
      ...newEntry,
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: now.toISOString(),
      timeFormatted,
    };
    setLoggedEntries((prev) => [entry, ...prev]);
  };

  const handleDeleteEntry = (id: string) => {
    setLoggedEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddWater = (amountMl: number) => {
    setWaterIntakeMl((prev) => Math.min(6000, prev + amountMl));
  };

  const handleResetLedger = () => {
    setLoggedEntries([]);
    setWaterIntakeMl(0);
  };

  const handleTransferFromAiScan = (food: FoodItem, estimatedWeight: number) => {
    setCurrentScaleFood(food);
    setScaleWeightGrams(estimatedWeight);
    setActiveTab('log');
  };

  return (
    <div className="min-h-screen bg-[#121316] text-[#f5f1e8] flex flex-col items-center relative overflow-x-hidden">
      {/* Top Fixed Horology Header */}
      <Header
        activeSlot={activeSlot}
        onOpenProfile={() => setIsProfileOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main View Area */}
      <main className="w-full flex-1 pt-18 min-h-screen">
        {activeTab === 'log' && (
          <LogView
            activeSlot={activeSlot}
            onSlotChange={setActiveSlot}
            foods={foods}
            currentScaleFood={currentScaleFood}
            onSelectScaleFood={setCurrentScaleFood}
            scaleWeightGrams={scaleWeightGrams}
            onScaleWeightChange={setScaleWeightGrams}
            onCommitLogEntry={handleCommitLogEntry}
          />
        )}

        {activeTab === 'today' && (
          <TodayView
            entries={loggedEntries}
            targets={targets}
            waterIntakeMl={waterIntakeMl}
            onAddWater={handleAddWater}
            onSelectSlot={(slot) => {
              setActiveSlot(slot);
              setActiveTab('log');
            }}
            onDeleteEntry={handleDeleteEntry}
          />
        )}

        {activeTab === 'ai-scan' && (
          <AiScanView
            foods={foods}
            onTransferToScale={handleTransferFromAiScan}
          />
        )}

        {activeTab === 'summary' && (
          <SummaryView
            entries={loggedEntries}
            targets={targets}
            waterIntakeMl={waterIntakeMl}
          />
        )}
      </main>

      {/* Fixed Bottom Horology & Apothecary Navigation */}
      <Navigation activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Settings & Apothecary Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        targets={targets}
        onUpdateTargets={setTargets}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onResetLedger={handleResetLedger}
      />
    </div>
  );
}
