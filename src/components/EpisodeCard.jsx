import React from 'react';
import { PlayCircle, Award, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { ARCS } from '../data/syllabusData';

export default function EpisodeCard({
  episode,
  progress,
  onSelectEpisode
}) {
  const arcMeta = ARCS.find((a) => a.id === episode.arc) || ARCS[0];
  const isCompleted = progress && progress.completedEpisodes && progress.completedEpisodes[episode.id || episode.number];
  const completedData = isCompleted ? progress.completedEpisodes[episode.id || episode.number] : null;

  return (
    <div
      onClick={() => onSelectEpisode(episode)}
      className="touch-active"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: isCompleted ? '1.5px solid var(--color-success)' : '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        marginBottom: '1rem',
        boxShadow: 'var(--shadow-card)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem'
      }}
    >
      {/* Top Arc Color Strip */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3.5px',
        backgroundColor: arcMeta.color
      }} />

      {/* Top Meta Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.4rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            fontFamily: 'var(--font-roman)',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: arcMeta.color
          }}>
            EPISODE {episode.roman || episode.number}
          </span>
          <span style={{ color: 'var(--border-strong)', fontSize: '11px' }}>•</span>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-muted)'
          }}>
            ARC {arcMeta.roman}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '11.5px',
            color: 'var(--text-muted)',
            fontVariantNumeric: 'tabular-nums'
          }}>
            <Clock size={12} />
            <span>{episode.duration}</span>
          </div>

          {completedData && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              fontSize: '11px',
              fontWeight: 700
            }}>
              <CheckCircle size={12} />
              <span>{completedData.percentage}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Episode Title */}
      <div>
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
          marginBottom: '0.2rem'
        }}>
          {episode.title}
        </h3>
        {episode.subtitle && (
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: 1.4
          }}>
            {episode.subtitle}
          </p>
        )}
      </div>

      {/* Summary Snippet */}
      <p style={{
        fontSize: '13.5px',
        color: 'var(--text-secondary)',
        lineHeight: 1.55,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {episode.thesis ? episode.thesis.split('\n\n')[0] : episode.summary}
      </p>

      {/* Key Concepts Chips */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.35rem',
        marginTop: '0.2rem'
      }}>
        {(episode.keyConcepts || episode.keyTerms || []).slice(0, 3).map((term, i) => (
          <span
            key={i}
            style={{
              padding: '0.2rem 0.55rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: 500
            }}
          >
            {term}
          </span>
        ))}
      </div>

      {/* Bottom Action Footer */}
      <div style={{
        marginTop: '0.5rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{
          fontSize: '12px',
          fontWeight: 600,
          color: episode.hasQuiz !== false ? 'var(--color-terracotta)' : 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          {episode.hasQuiz !== false ? (
            <>
              <Award size={14} />
              <span>Interactive Quiz & Companion</span>
            </>
          ) : (
            <>
              <PlayCircle size={14} />
              <span>Syllabus & Video Guide</span>
            </>
          )}
        </span>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: '12.5px',
          fontWeight: 700,
          color: 'var(--text-primary)'
        }}>
          <span>Explore</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
}
