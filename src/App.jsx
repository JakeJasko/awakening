import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroScreen from './components/HeroScreen';
import EpisodeHub from './components/EpisodeHub';
import GlossaryModal from './components/GlossaryModal';
import SyllabusModal from './components/SyllabusModal';
import { EPISODES_DATA } from './data/episodesData';
import { ALL_EPISODES_CATALOG, toRoman } from './data/syllabusData';
import { getStoredProgress, saveEpisodeProgress, saveReflection } from './utils/storage';
import { usePWAInstallPrompt } from './utils/pwa';
import './App.css';

export default function App() {
  const pwa = usePWAInstallPrompt();
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
    showVideo: false,
    seekSeconds: null,
    seekKey: 0
  });

  const normalizeEpisode = (ep) => {
    if (!ep) return null;
    const epNum = ep.id || ep.number;
    const richQuizEp = EPISODES_DATA.find((e) => e.id === epNum);
    if (richQuizEp) return richQuizEp;
    const catalogEp = ALL_EPISODES_CATALOG.find((e) => e.number === epNum) || ep;
    return {
      ...catalogEp,
      id: catalogEp.id || catalogEp.number,
      number: catalogEp.number || catalogEp.id,
      roman: catalogEp.roman || toRoman(catalogEp.id || catalogEp.number)
    };
  };

  const handleToggleAudioCompanion = (ep) => {
    const targetEp = normalizeEpisode(ep || activeEpisode || EPISODES_DATA[0]);
    const targetId = targetEp.id || targetEp.number;
    const currentAudioId = audioState.episode?.id || audioState.episode?.number;

    if (audioState.isOpen && currentAudioId === targetId) {
      setAudioState((prev) => ({
        ...prev,
        isPlaying: !prev.isPlaying
      }));
    } else {
      setAudioState({
        isOpen: true,
        episode: targetEp,
        isPlaying: true,
        showVideo: false,
        seekSeconds: null,
        seekKey: 0
      });
    }
  };

  const handleSeekAudioTimestamp = (ep, seconds) => {
    const targetEp = normalizeEpisode(ep || activeEpisode || EPISODES_DATA[0]);
    setAudioState((prev) => ({
      isOpen: true,
      episode: targetEp,
      isPlaying: true,
      showVideo: prev.isOpen ? prev.showVideo : false,
      seekSeconds: seconds,
      seekKey: (prev.seekKey || 0) + 1
    }));
  };

  const handlePlayPauseAudio = () => {
    setAudioState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleToggleAudioVideo = () => {
    setAudioState((prev) => ({ ...prev, showVideo: !prev.showVideo }));
  };

  const handleCloseAudio = () => {
    setAudioState((prev) => ({
      ...prev,
      isOpen: false,
      isPlaying: false,
      showVideo: false,
      seekSeconds: null
    }));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('awakening_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSelectEpisode = (ep) => {
    const normalized = normalizeEpisode(ep);
    if (!normalized) return;
    setActiveEpisode(normalized);
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

  const handleSaveReflection = (episodeId, reflectionText) => {
    const updated = saveReflection(episodeId, reflectionText);
    if (updated) {
      setProgress(updated);
    }
  };

  const handleNextEpisode = () => {
    if (!activeEpisode) return;
    const activeId = activeEpisode.id || activeEpisode.number;
    const currentIndex = EPISODES_DATA.findIndex((e) => e.id === activeId);
    if (currentIndex !== -1 && currentIndex < EPISODES_DATA.length - 1) {
      const nextEp = EPISODES_DATA[currentIndex + 1];
      setActiveEpisode(nextEp);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentIndex === -1) {
      const nextMilestone = EPISODES_DATA.find((e) => e.id > activeId);
      if (nextMilestone) {
        setActiveEpisode(nextMilestone);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        handleBackToHero();
      }
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
        pwa={pwa}
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
            onSaveReflection={handleSaveReflection}
            onNextEpisode={handleNextEpisode}
            onOpenGlossary={handleOpenGlossary}
            audioState={audioState}
            onToggleAudioCompanion={handleToggleAudioCompanion}
            onSeekAudioTimestamp={handleSeekAudioTimestamp}
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
          const found =
            EPISODES_DATA.find((e) => e.id === epNum) ||
            ALL_EPISODES_CATALOG.find((e) => e.number === epNum);
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
