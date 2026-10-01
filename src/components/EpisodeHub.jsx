import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Headphones, BookOpen, Award, Sparkles, 
  Clock, Share2, CheckCircle2, RotateCcw, ExternalLink, Save, Check 
} from 'lucide-react';
import EpisodeQuiz from './EpisodeQuiz';
import EpisodeScoreModal from './EpisodeScoreModal';
import ShareCardModal from './ShareCardModal';
import { ARCS } from '../data/syllabusData';
import { saveReflection, getStoredProgress } from '../utils/storage';

export default function EpisodeHub({
  episode,
  progress,
  onBack,
  onSaveQuizResult,
  onNextEpisode,
  onOpenGlossary,
  audioState,
  onToggleAudioCompanion
}) {
  const [activeTab, setActiveTab] = useState('primer'); // 'primer' | 'quiz' | 'reflection'
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [isSavedNote, setIsSavedNote] = useState(false);
  const [latestResults, setLatestResults] = useState(null);

  const arcMeta = ARCS.find((a) => a.id === episode.arc) || ARCS[0];
  const episodeProgress = progress?.completedEpisodes?.[episode.id || episode.number];

  // Initialize reflection from storage
  useEffect(() => {
    if (progress?.reflections?.[episode.id || episode.number]) {
      setReflectionText(progress.reflections[episode.id || episode.number]);
    } else {
      setReflectionText('');
    }
    // Default to primer, reset modal states
    setActiveTab('primer');
    setIsScoreModalOpen(false);
    setIsShareModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [episode.id]);

  const handleFinishQuiz = (results) => {
    setLatestResults(results);
    onSaveQuizResult(episode.id || episode.number, results);
    setIsScoreModalOpen(true);
  };

  const handleSaveReflection = () => {
    saveReflection(episode.id || episode.number, reflectionText);
    setIsSavedNote(true);
    setTimeout(() => setIsSavedNote(false), 2000);
  };

  const handleRetakeQuiz = () => {
    setIsScoreModalOpen(false);
    setActiveTab('quiz');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in content-container">
      {/* Top Breadcrumb & Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <button
          onClick={onBack}
          className="touch-active"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.8rem',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={15} />
          <span>All Episodes</span>
        </button>

        <button
          onClick={() => onToggleAudioCompanion(episode)}
          className="touch-active"
          title={audioState?.isOpen && audioState?.episode?.id === (episode.id || episode.number) ? (audioState?.isPlaying ? 'Pause audio companion' : 'Resume audio companion') : 'Launch audio companion in header'}
          aria-label="Audio companion"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--color-terracotta)',
            backgroundColor: (audioState?.isOpen && audioState?.episode?.id === (episode.id || episode.number)) ? 'var(--color-terracotta)' : 'var(--color-terracotta-light)',
            color: (audioState?.isOpen && audioState?.episode?.id === (episode.id || episode.number)) ? 'white' : 'var(--color-terracotta)',
            fontSize: '12.5px',
            fontWeight: 700
          }}
        >
          <Headphones size={15} />
          <span>
            {audioState?.isOpen && audioState?.episode?.id === (episode.id || episode.number)
              ? (audioState?.isPlaying ? 'Audio Playing' : 'Audio Paused')
              : 'Audio Companion'}
          </span>
        </button>
      </div>

      {/* Hero Banner for Episode */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        marginBottom: '1.25rem',
        boxShadow: 'var(--shadow-card)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: arcMeta.color
        }} />

        {/* Episode Number and Arc Tag */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
          flexWrap: 'wrap',
          gap: '0.35rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{
              fontFamily: 'var(--font-roman)',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: arcMeta.color
            }}>
              EPISODE {episode.roman || episode.id}
            </span>
            <span style={{ color: 'var(--border-strong)' }}>•</span>
            <span style={{
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--text-muted)'
            }}>
              ARC {arcMeta.roman}: {arcMeta.title}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}>
            <Clock size={13} />
            <span>{episode.duration}</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.5rem, 5vw, 2rem)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
          marginBottom: '0.35rem'
        }}>
          {episode.title}
        </h1>

        {episode.subtitle && (
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '14.5px',
            color: 'var(--text-secondary)',
            lineHeight: 1.45,
            marginBottom: '0.85rem'
          }}>
            {episode.subtitle}
          </p>
        )}

        {/* Vervaeke Quote Pill */}
        {episode.quote && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--bg-subtle)',
            borderLeft: `3px solid ${arcMeta.color}`,
            borderRadius: 'var(--radius-sm)',
            fontSize: '13.5px',
            fontStyle: 'italic',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '0.85rem'
          }}>
            «{episode.quote}»
          </div>
        )}

        {/* Score Ribbon if previously completed */}
        {episodeProgress && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.65rem 0.85rem',
            backgroundColor: 'var(--color-success-bg)',
            border: '1px solid var(--color-success)',
            borderRadius: 'var(--radius-md)',
            marginTop: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-success)', fontSize: '13px', fontWeight: 700 }}>
              <CheckCircle2 size={16} />
              <span>Mastery Achieved: {episodeProgress.percentage}% ({episodeProgress.score}/{episodeProgress.total})</span>
            </div>

            <button
              onClick={() => {
                setLatestResults(episodeProgress);
                setIsShareModalOpen(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--color-success)',
                cursor: 'pointer'
              }}
            >
              <Share2 size={13} />
              <span>Dossier</span>
            </button>
          </div>
        )}
      </div>

      {/* 3 Main Navigation Tabs */}
      <div className="tabs-nav" role="tablist" aria-label="Episode Exploration Views">
        <button
          role="tab"
          aria-selected={activeTab === 'primer'}
          onClick={() => setActiveTab('primer')}
          className={`tab-btn ${activeTab === 'primer' ? 'active' : ''}`}
        >
          <BookOpen size={16} />
          <span>Episode Primer & Thesis</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'quiz'}
          onClick={() => setActiveTab('quiz')}
          className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
        >
          <Award size={16} />
          <span>Epistemic Quiz ({episode.questions?.length || 5} Qs)</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'reflection'}
          onClick={() => setActiveTab('reflection')}
          className={`tab-btn ${activeTab === 'reflection' ? 'active' : ''}`}
        >
          <Sparkles size={16} />
          <span>Practice & Reflection</span>
        </button>
      </div>

      {/* Tab 1: Primer & Core Thesis */}
      {activeTab === 'primer' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Detailed Thesis Card */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.35rem 1.25rem',
            boxShadow: 'var(--shadow-card)'
          }}>
            <span style={{
              fontFamily: 'var(--font-roman)',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: 'var(--color-terracotta)',
              display: 'block',
              marginBottom: '0.65rem'
            }}>
              THE CORE VERVAEKEAN THESIS
            </span>

            <div style={{
              fontSize: '15px',
              color: 'var(--text-primary)',
              lineHeight: 1.7,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}>
              {(episode.thesis || episode.summary).split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Key Thinkers & Traditions */}
          {episode.keyThinkers && (
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem'
            }}>
              <span style={{
                fontFamily: 'var(--font-roman)',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                display: 'block',
                marginBottom: '0.45rem'
              }}>
                KEY THINKERS & TRADITIONS EXAMINED
              </span>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {episode.keyThinkers.map((thinker, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-strong)',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: 'var(--text-primary)'
                    }}
                  >
                    {thinker}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Concepts Chips */}
          {episode.keyConcepts && (
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.45rem'
              }}>
                <span style={{
                  fontFamily: 'var(--font-roman)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.08em'
                }}>
                  PSYCHOTECHNOLOGIES & CONCEPTS
                </span>
                <button
                  type="button"
                  onClick={() => onOpenGlossary && onOpenGlossary({ episode })}
                  className="touch-active"
                  style={{
                    fontSize: '11.5px',
                    color: 'var(--color-terracotta)',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.1rem 0.35rem'
                  }}
                  title={`View all Episode ${episode.roman || episode.id} concepts in Lexicon`}
                >
                  View in Lexicon
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {episode.keyConcepts.map((concept, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => onOpenGlossary && onOpenGlossary({ term: concept, episode })}
                    className="touch-active"
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: 'var(--color-terracotta-light)',
                      border: '1px solid var(--color-terracotta-border)',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'var(--color-terracotta)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    title={`Inspect "${concept}" in Cognitive Lexicon`}
                  >
                    {concept}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Primary Action Button: Launch Quiz */}
          <button
            onClick={() => {
              setActiveTab('quiz');
              window.scrollTo({ top: 120, behavior: 'smooth' });
            }}
            className="touch-active"
            style={{
              width: '100%',
              minHeight: '54px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-terracotta)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '15px',
              fontWeight: 700,
              boxShadow: 'var(--shadow-card)',
              marginTop: '0.5rem'
            }}
          >
            <span>Begin Epistemic Quiz ({episode.questions?.length || 5} Questions)</span>
            <Award size={18} />
          </button>
        </div>
      )}

      {/* Tab 2: Epistemic Quiz Engine */}
      {activeTab === 'quiz' && (
        <EpisodeQuiz
          episode={episode}
          onFinishQuiz={handleFinishQuiz}
          onBackToOverview={() => setActiveTab('primer')}
        />
      )}

      {/* Tab 3: Practice & Socratic Reflection */}
      {activeTab === 'reflection' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Socratic Inquiry Prompt */}
          {episode.reflection?.socraticPrompt && (
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderLeft: '4px solid var(--color-terracotta)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem'
            }}>
              <span style={{
                fontFamily: 'var(--font-roman)',
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--color-terracotta)',
                letterSpacing: '0.1em',
                display: 'block',
                marginBottom: '0.35rem'
              }}>
                SOCRATIC INQUIRY PROMPT
              </span>
              <p style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '16px',
                fontStyle: 'italic',
                color: 'var(--text-primary)',
                lineHeight: 1.6
              }}>
                «{episode.reflection.socraticPrompt}»
              </p>
            </div>
          )}

          {/* Cultivation Practice */}
          {episode.reflection?.practice && (
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-subtle)'
            }}>
              <span style={{
                fontFamily: 'var(--font-roman)',
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--arc-4-color)',
                letterSpacing: '0.1em',
                display: 'block',
                marginBottom: '0.25rem'
              }}>
                ECOLOGY OF PRACTICES • RECOMMENDED CULTIVATION
              </span>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '0.5rem'
              }}>
                {episode.reflection.practice}
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                lineHeight: 1.6
              }}>
                {episode.reflection.practiceDescription}
              </p>
            </div>
          )}

          {/* Journal Note Box with Autosave */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem'
            }}>
              <span style={{
                fontFamily: 'var(--font-roman)',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: 'var(--text-primary)'
              }}>
                YOUR PERSONAL CONTEMPLATIVE NOTES & REALIZATIONS
              </span>

              {isSavedNote && (
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  color: 'var(--color-success)',
                  fontSize: '11.5px',
                  fontWeight: 600
                }}>
                  <Check size={13} />
                  <span>Saved</span>
                </span>
              )}
            </div>

            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="Reflect on how this episode's psychotechnology or cognitive insight applies to your everyday agency, relationships, or mindfulness..."
              style={{
                width: '100%',
                minHeight: '140px',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-strong)',
                backgroundColor: 'var(--bg-canvas)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical',
                marginBottom: '0.75rem'
              }}
            />

            <button
              onClick={handleSaveReflection}
              className="touch-active"
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-terracotta)',
                color: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '13px',
                fontWeight: 700
              }}
            >
              <Save size={14} />
              <span>Save Reflection</span>
            </button>
          </div>
        </div>
      )}

      {/* Score Modal */}
      <EpisodeScoreModal
        isOpen={isScoreModalOpen}
        episode={episode}
        results={latestResults}
        onClose={() => setIsScoreModalOpen(false)}
        onRetake={handleRetakeQuiz}
        onOpenShareCard={() => {
          setIsScoreModalOpen(false);
          setIsShareModalOpen(true);
        }}
        onNextEpisode={onNextEpisode}
      />

      {/* Share Card Modal */}
      <ShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        episode={episode}
        score={latestResults?.score ?? episodeProgress?.score ?? 0}
        total={latestResults?.total ?? episodeProgress?.total ?? 5}
        percentage={latestResults?.percentage ?? episodeProgress?.percentage ?? 0}
      />
    </div>
  );
}
