import React from 'react';
import { Sun, Moon, BookOpen, Compass, Award, Download } from 'lucide-react';
import AudioCompanionHeader from './AudioCompanionHeader';

export default function Header({
  theme,
  onToggleTheme,
  onNavigateHome,
  onOpenGlossary,
  onOpenSyllabus,
  completedCount,
  totalQuizEpisodes,
  audioState,
  onPlayPauseAudio,
  onToggleAudioVideo,
  onCloseAudio,
  pwa
}) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backgroundColor: 'var(--bg-canvas)',
      borderBottom: '1px solid var(--border-subtle)',
      backdropFilter: 'blur(8px)',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Header Row */}
      <div style={{
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
      {/* Brand Emblem / Home Link */}
      <button
        type="button"
        onClick={onNavigateHome}
        className="touch-active"
        title="Return to all episodes (Home)"
        aria-label="Awakening - Return to all episodes (Home)"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          background: 'none',
          border: 'none',
          padding: '0.2rem 0.35rem',
          margin: '-0.2rem -0.35rem',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          textAlign: 'left',
          textDecoration: 'none'
        }}
      >
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: 'var(--radius-sm)',
          border: '1.5px solid var(--color-terracotta)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-roman)',
          fontWeight: 800,
          fontSize: '13px',
          color: 'var(--color-terracotta)',
          letterSpacing: '0.05em',
          backgroundColor: 'var(--bg-surface)',
          flexShrink: 0,
          transition: 'transform 0.15s ease'
        }}>
          Ω
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontFamily: 'var(--font-roman)',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: 'var(--text-primary)',
            lineHeight: 1.15
          }}>
            AWAKENING
          </span>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '11px',
            fontStyle: 'italic',
            color: 'var(--text-muted)'
          }}>
            Vervaeke Epistemic Companion
          </span>
        </div>
      </button>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
        {/* Completed Badge */}
        {completedCount > 0 && (
          <div
            title={`${completedCount} of ${totalQuizEpisodes} milestone episodes mastered`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--arc-1-bg)',
              border: '1px solid var(--arc-1-border)',
              color: 'var(--arc-1-color)',
              fontSize: '11.5px',
              fontWeight: 700,
              fontFamily: 'var(--font-roman)'
            }}
          >
            <Award size={13} />
            <span>{completedCount}/{totalQuizEpisodes}</span>
          </div>
        )}

        {/* Glossary Trigger */}
        <button
          onClick={onOpenGlossary}
          className="touch-active"
          title="Open Cognitive Lexicon & 4 Ways of Knowing"
          aria-label="Open Cognitive Lexicon & 4 Ways of Knowing"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.45rem 0.75rem',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border-strong)',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          <BookOpen size={14} color="var(--color-terracotta)" />
          <span className="hide-on-mobile">Lexicon</span>
        </button>

        {/* Syllabus Trigger */}
        <button
          onClick={onOpenSyllabus}
          className="touch-active"
          title="Browse 50-Episode Master Syllabus"
          aria-label="Browse 50-Episode Master Syllabus"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.45rem 0.75rem',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border-strong)',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          <Compass size={14} color="var(--arc-2-color)" />
          <span className="hide-on-mobile">Syllabus</span>
        </button>

        {/* PWA Install Trigger (Chrome / Supported Browsers) */}
        {pwa?.isInstallable && (
          <button
            type="button"
            onClick={pwa.promptInstall}
            className="touch-active pwa-install-btn"
            title="Install Awakening Epistemic Companion as a desktop or mobile app"
            aria-label="Install Awakening Epistemic Companion as a desktop or mobile app"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--color-terracotta)',
              backgroundColor: 'rgba(226, 125, 96, 0.12)',
              color: 'var(--color-terracotta)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Download size={14} />
            <span className="hide-on-mobile">Install App</span>
          </button>
        )}

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="touch-active"
          title={`Switch to ${theme === 'light' ? 'Obsidian Dark' : 'Parchment Light'} Mode`}
          aria-label={`Switch to ${theme === 'light' ? 'Obsidian Dark' : 'Parchment Light'} Mode`}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
      </div>

      {/* Integrated Minimal Audio Companion Bar */}
      {audioState && audioState.isOpen && audioState.episode && (
        <AudioCompanionHeader
          episode={audioState.episode}
          isOpen={audioState.isOpen}
          isPlaying={audioState.isPlaying}
          showVideo={audioState.showVideo}
          onPlayPause={onPlayPauseAudio}
          onToggleVideo={onToggleAudioVideo}
          onClose={onCloseAudio}
        />
      )}
    </header>
  );
}
