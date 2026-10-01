import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroScreen from './components/HeroScreen';
import EpisodeHub from './components/EpisodeHub';
import GlossaryModal from './components/GlossaryModal';
import SyllabusModal from './components/SyllabusModal';
import { EPISODES_DATA } from './data/episodesData';
import { getStoredProgress, saveEpisodeProgress } from './utils/storage';
import './App.css';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('awakening_theme') || 'light';
  });

  const [view, setView] = useState('hero'); // 'hero' | 'episode'
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [selectedArc, setSelectedArc] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [glossaryOptions, setGlossaryOptions] = useState(null);
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
  const [progress, setProgress] = useState(() => getStoredProgress());

  // Global Audio Companion State in Header
  const [audioState, setAudioState] = useState({
    isOpen: false,
    episode: null,
    isPlaying: true,
    showVideo: false
  });

  const handleToggleAudioCompanion = (ep) => {
    const targetEp = ep || activeEpisode || EPISODES_DATA[0];
    if (audioState.isOpen && audioState.episode?.id === (targetEp.id || targetEp.number)) {
      setAudioState((prev) => ({
        ...prev,
        isPlaying: !prev.isPlaying
      }));
    } else {
      setAudioState({
        isOpen: true,
        episode: targetEp,
        isPlaying: true,
        showVideo: false
      });
    }
  };

  const handlePlayPauseAudio = () => {
    setAudioState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleToggleAudioVideo = () => {
    setAudioState((prev) => ({ ...prev, showVideo: !prev.showVideo }));
  };

  const handleCloseAudio = () => {
    setAudioState((prev) => ({ ...prev, isOpen: false, isPlaying: false, showVideo: false }));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('awakening_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSelectEpisode = (ep) => {
    // Find rich episode in EPISODES_DATA or fallback
    const richEp = EPISODES_DATA.find((e) => e.id === (ep.id || ep.number)) || ep;
    setActiveEpisode(richEp);
    setView('episode');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHero = () => {
    setView('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setIsGlossaryOpen(false);
    setIsSyllabusOpen(false);
    setGlossaryOptions(null);
    setView('hero');
    setSearchQuery('');
    setSelectedArc('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveQuizResult = (episodeId, results) => {
    const updated = saveEpisodeProgress(episodeId, results);
    if (updated) {
      setProgress(updated);
    }
  };

  const handleNextEpisode = () => {
    if (!activeEpisode) return;
    const currentIndex = EPISODES_DATA.findIndex((e) => e.id === activeEpisode.id);
    if (currentIndex !== -1 && currentIndex < EPISODES_DATA.length - 1) {
      const nextEp = EPISODES_DATA[currentIndex + 1];
      setActiveEpisode(nextEp);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Return to hero if finished last
      handleBackToHero();
    }
  };

  const handleOpenGlossary = (options = null) => {
    setGlossaryOptions(options);
    setIsGlossaryOpen(true);
  };

  const handleCloseGlossary = () => {
    setIsGlossaryOpen(false);
    setGlossaryOptions(null);
  };

  const completedCount = Object.keys(progress.completedEpisodes || {}).length;

  return (
    <div className="app-container">
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onNavigateHome={handleNavigateHome}
        onOpenGlossary={() => handleOpenGlossary(null)}
        onOpenSyllabus={() => setIsSyllabusOpen(true)}
        completedCount={completedCount}
        totalQuizEpisodes={EPISODES_DATA.length}
        audioState={audioState}
        onPlayPauseAudio={handlePlayPauseAudio}
        onToggleAudioVideo={handleToggleAudioVideo}
        onCloseAudio={handleCloseAudio}
      />

      <main className="main-content">
        {view === 'hero' && (
          <HeroScreen
            progress={progress}
            selectedArc={selectedArc}
            onSelectArc={setSelectedArc}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectEpisode={handleSelectEpisode}
            onOpenGlossary={() => handleOpenGlossary(null)}
            onOpenSyllabus={() => setIsSyllabusOpen(true)}
          />
        )}

        {view === 'episode' && activeEpisode && (
          <EpisodeHub
            episode={activeEpisode}
            progress={progress}
            onBack={handleBackToHero}
            onSaveQuizResult={handleSaveQuizResult}
            onNextEpisode={handleNextEpisode}
            onOpenGlossary={handleOpenGlossary}
            audioState={audioState}
            onToggleAudioCompanion={handleToggleAudioCompanion}
          />
        )}
      </main>

      {/* Global Modals */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={handleCloseGlossary}
        initialOptions={glossaryOptions}
        onSelectEpisodeFromTerm={(epNum) => {
          handleCloseGlossary();
          const found = EPISODES_DATA.find((e) => e.id === epNum);
          if (found) handleSelectEpisode(found);
        }}
      />

      <SyllabusModal
        isOpen={isSyllabusOpen}
        onClose={() => setIsSyllabusOpen(false)}
        progress={progress}
        onSelectEpisode={handleSelectEpisode}
      />
    </div>
  );
}
