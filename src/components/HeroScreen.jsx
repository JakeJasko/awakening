import React from 'react';
import { Compass, BookOpen, Award, ArrowRight, Play, Sparkles, CheckCircle } from 'lucide-react';
import ArcFilterBar from './ArcFilterBar';
import EpisodeCard from './EpisodeCard';
import { EPISODES_DATA } from '../data/episodesData';
import { ALL_EPISODES_CATALOG, ARCS } from '../data/syllabusData';

export default function HeroScreen({
  progress,
  selectedArc,
  onSelectArc,
  searchQuery,
  onSearchChange,
  onSelectEpisode,
  onOpenGlossary,
  onOpenSyllabus
}) {
  // Combine rich quiz episodes with catalog
  const completedCount = Object.keys(progress.completedEpisodes || {}).length;
  const totalQuizEpisodes = EPISODES_DATA.length;

  // Identify next uncompleted milestone episode in trajectory
  const nextEpisode = EPISODES_DATA.find((ep) => !progress?.completedEpisodes?.[ep.id || ep.number]) || EPISODES_DATA[0];
  const allCompleted = completedCount > 0 && completedCount >= totalQuizEpisodes;

  // Filter episodes based on selected Arc and searchQuery
  const displayEpisodes = EPISODES_DATA.filter((ep) => {
    const matchesArc = selectedArc === 'all' || ep.arc === selectedArc;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesArc;

    const inTitle = ep.title.toLowerCase().includes(q);
    const inSubtitle = (ep.subtitle || '').toLowerCase().includes(q);
    const inSummary = (ep.summary || ep.thesis || '').toLowerCase().includes(q);
    const inThinkers = (ep.keyThinkers || []).some((t) => t.toLowerCase().includes(q));
    const inConcepts = (ep.keyConcepts || []).some((c) => c.toLowerCase().includes(q));

    return matchesArc && (inTitle || inSubtitle || inSummary || inThinkers || inConcepts);
  });

  return (
    <div className="animate-fade-in content-container">
      {/* Top Epigraph & Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.85rem',
          borderRadius: 'var(--radius-pill)',
          backgroundColor: 'var(--color-terracotta-light)',
          border: '1px solid var(--color-terracotta-border)',
          color: 'var(--color-terracotta)',
          fontFamily: 'var(--font-roman)',
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.12em',
          marginBottom: '0.75rem'
        }}>
          <Sparkles size={12} />
          <span>DR. JOHN VERVAEKE’S 50-PART ODYSSEY</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 6vw, 2.75rem)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.025em',
          lineHeight: 1.15,
          marginBottom: '0.5rem'
        }}>
          Awakening from the Meaning Crisis
        </h1>

        <p style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: '16px',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          maxWidth: '520px',
          margin: '0 auto'
        }}>
          An interactive epistemic companion and episode-by-episode mastery quiz to cultivate wisdom and examine self-deception.
        </p>
      </div>

      {/* Progress & Quick Stats Card */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}>
        <div>
          <span style={{
            fontFamily: 'var(--font-roman)',
            fontSize: '10.5px',
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: 'var(--color-terracotta)',
            display: 'block'
          }}>
            YOUR STUDY TRAJECTORY
          </span>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--text-primary)'
          }}>
            {completedCount === 0 ? 'Journey Awaiting Inception' : `${completedCount} of ${totalQuizEpisodes} Milestone Quizzes Completed`}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            data-testid="study-trajectory-action-btn"
            onClick={() => onSelectEpisode(nextEpisode)}
            className="touch-active"
            title={completedCount === 0 
              ? 'Begin Episode I Companion & Quiz' 
              : allCompleted 
                ? 'Review Trajectory from Episode I' 
                : `Continue with Next Episode: Episode ${nextEpisode.roman || nextEpisode.id} (${nextEpisode.title})`}
            aria-label={completedCount === 0 
              ? 'Begin Episode I' 
              : allCompleted 
                ? 'Review Trajectory from Episode I' 
                : `Continue with Next Episode (Episode ${nextEpisode.roman || nextEpisode.id})`}
            style={{
              padding: '0.65rem 1.15rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-terracotta)',
              color: 'white',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <span>
              {completedCount === 0 
                ? 'Begin Episode I' 
                : allCompleted 
                  ? 'Review Trajectory (Episode I)' 
                  : `Continue with Next Episode (Ep. ${nextEpisode.roman || nextEpisode.id})`}
            </span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* 5 Arcs Architecture Preview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '0.5rem',
        marginBottom: '1.5rem'
      }}>
        {ARCS.map((arc) => (
          <div
            key={arc.id}
            onClick={() => onSelectArc(arc.id)}
            className="touch-active"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: selectedArc === arc.id ? `2px solid ${arc.color}` : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 0.65rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem',
              boxShadow: 'var(--shadow-subtle)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              backgroundColor: arc.color
            }} />

            <span style={{
              fontFamily: 'var(--font-roman)',
              fontSize: '10px',
              fontWeight: 800,
              color: arc.color
            }}>
              ARC {arc.roman}
            </span>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.25
            }}>
              {arc.title.split('&')[0]}
            </span>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
              {arc.episodesRange}
            </span>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <ArcFilterBar
        selectedArc={selectedArc}
        onSelectArc={onSelectArc}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      {/* Episodes List */}
      <div style={{ marginTop: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.85rem'
        }}>
          <span style={{
            fontFamily: 'var(--font-roman)',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: 'var(--text-muted)'
          }}>
            EPISODE COMPANIONS & MASTERY QUIZZES ({displayEpisodes.length})
          </span>

          <button
            onClick={onOpenSyllabus}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-terracotta)',
              textDecoration: 'underline'
            }}
          >
            View all 50 in Syllabus
          </button>
        </div>

        {displayEpisodes.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)'
          }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              No episodes match your search query "{searchQuery}".
            </p>
            <button
              onClick={() => {
                onSearchChange('');
                onSelectArc('all');
              }}
              style={{
                fontSize: '12.5px',
                color: 'var(--color-terracotta)',
                fontWeight: 700,
                textDecoration: 'underline'
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          displayEpisodes.map((ep) => (
            <EpisodeCard
              key={ep.id}
              episode={ep}
              progress={progress}
              onSelectEpisode={onSelectEpisode}
            />
          ))
        )}
      </div>

      {/* Bottom Secondary Links */}
      <div style={{
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-subtle)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <button
            onClick={onOpenGlossary}
            className="touch-active"
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              textDecoration: 'underline',
              fontWeight: 600
            }}
          >
            Open Cognitive Lexicon & 4 Ways of Knowing
          </button>

          <button
            onClick={onOpenSyllabus}
            className="touch-active"
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              textDecoration: 'underline',
              fontWeight: 600
            }}
          >
            Explore Complete 50-Episode Curriculum
          </button>
        </div>

        <p style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          fontStyle: 'italic'
        }}>
          «The unexamined life is not worth living» — Socrates
        </p>
      </div>
    </div>
  );
}
