import React, { useEffect } from 'react';
import { TopNavBar } from './components/TopNavBar.jsx';
import { ControlsPanel } from './components/ControlsPanel.jsx';
import { GameStage } from './components/GameStage.jsx';
import { LeaderboardPanel } from './components/LeaderboardPanel.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { AchievementsModal } from './components/AchievementsModal.jsx';
import { PlayerProfileModal } from './components/PlayerProfileModal.jsx';
import { PlayersModal } from './components/PlayersModal.jsx';
import { initCrashdownRuntime } from './engine/runtime.js';

export default function App() {
  useEffect(() => {
    initCrashdownRuntime();
  }, []);

  return (
    <>
      <TopNavBar />
      <div className="app-shell">
        <ControlsPanel />
        <GameStage />
        <LeaderboardPanel />
      </div>
      <AuthModal />
      <AchievementsModal />
      <PlayerProfileModal />
      <PlayersModal />
    </>
  );
}
