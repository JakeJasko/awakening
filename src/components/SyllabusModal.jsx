import React, { useState } from 'react';
import { Compass, X, ExternalLink, PlayCircle, Award, CheckCircle, BookOpen } from 'lucide-react';
import { ARCS, ALL_EPISODES_CATALOG } from '../data/syllabusData';

export default function SyllabusModal({
  isOpen,
  onClose,
  progress,
  onSelectEpisode
}) {
  const [selectedArc, setSelectedArc] = useState(1);

  if (!isOpen) return null;

  const currentArcMeta = ARCS.find((a) => a.id === selectedArc) || ARCS[0];
  const arcEpisodes = ALL_EPISODES_CATALOG.filter((ep) => ep.arc === selectedArc);

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div 
        className="modal-sheet" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={18} color="var(--arc-2-color)" />
            <div>
              <h3 style={{
                fontFamily: 'var(--font-roman)',
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '0.1em',
                color: 'var(--text-primary)',
                lineHeight: 1.2
              }}>
                50-EPISODE MASTER SYLLABUS
              </h3>
              <p style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '11px',
                color: 'var(--text-muted)'
              }}>
                Dr. John Vervaeke’s Complete Curriculum
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="touch-active"
            style={{
              padding: '0.35rem',
              borderRadius: 'var(--radius-pill)',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Arc Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          overflowX: 'auto',
          backgroundColor: 'var(--bg-surface)',
          flexShrink: 0,
          minHeight: '46px'
        }}>
          {ARCS.map((arc) => {
            const isSelected = selectedArc === arc.id;
            return (
              <button
                key={arc.id}
                data-arc-tab={arc.id}
                onClick={() => setSelectedArc(arc.id)}
                className="touch-active"
                style={{
                  flex: 1,
                  minHeight: '46px',
                  padding: '0.65rem 0.6rem',
                  fontSize: '12px',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-roman)',
                  letterSpacing: '0.06em',
                  borderBottom: isSelected ? `2.5px solid ${arc.color}` : '2.5px solid transparent',
                  color: isSelected ? arc.color : 'var(--text-secondary)',
                  backgroundColor: isSelected ? arc.bg : 'transparent',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                ARC {arc.roman}
              </button>
            );
          })}
        </div>

        {/* Arc Overview Banner */}
        <div style={{
          padding: '0.85rem 1.25rem',
          backgroundColor: currentArcMeta.bg,
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0
        }}>
          <h4 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.2rem'
          }}>
            {currentArcMeta.title}
          </h4>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            {currentArcMeta.description}
          </p>
        </div>

        {/* Episode Catalog List */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {arcEpisodes.map((ep) => {
            const completed = progress && progress.completedEpisodes && progress.completedEpisodes[ep.number];

            return (
              <div
                key={ep.number}
                data-episode-number={ep.number}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: completed ? '1px solid var(--color-success)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  boxShadow: 'var(--shadow-subtle)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
                    <span style={{
                      fontFamily: 'var(--font-roman)',
                      fontSize: '11px',
                      fontWeight: 800,
                      color: currentArcMeta.color
                    }}>
                      EP {ep.number}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '14.5px',
                      fontWeight: 700,
                      color: 'var(--text-primary)'
                    }}>
                      {ep.title}
                    </span>
                  </div>

                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {ep.duration}
                  </span>
                </div>

                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {ep.summary}
                </p>

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '0.2rem',
                  paddingTop: '0.4rem',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  <a
                    href={ep.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '11.5px',
                      color: 'var(--text-muted)',
                      textDecoration: 'none'
                    }}
                  >
                    <ExternalLink size={12} />
                    <span>Watch on YouTube</span>
                  </a>

                  {ep.hasQuiz ? (
                    <button
                      onClick={() => {
                        onClose();
                        onSelectEpisode(ep);
                      }}
                      className="touch-active"
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--color-terracotta)',
                        color: 'white',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <Award size={12} />
                      <span>{completed ? `Mastered (${completed.percentage}%)` : 'Launch Companion & Quiz'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onClose();
                        onSelectEpisode(ep);
                      }}
                      className="touch-active"
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-strong)',
                        color: 'var(--text-secondary)',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        cursor: 'pointer'
                      }}
                      title="Launch episode primer and audio companion"
                    >
                      <BookOpen size={12} color="var(--color-terracotta)" />
                      <span>Explore Primer & Audio</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
