import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, RotateCcw, Share2, ArrowRight, CheckCircle2, XCircle, 
  HelpCircle, BookOpen, ChevronDown, ChevronUp, Sparkles 
} from 'lucide-react';
import { getMasteryTitle } from '../utils/cardRenderer';

export default function EpisodeScoreModal({
  isOpen,
  episode,
  results,
  onClose,
  onRetake,
  onOpenShareCard,
  onNextEpisode
}) {
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (isOpen && results) {
      try {
        if (results.percentage >= 80) {
          confetti({
            particleCount: 70,
            spread: 75,
            origin: { y: 0.4 },
            colors: ['#B84A39', '#2B4E7A', '#C28222', '#D5CCC0']
          });
        }
      } catch (e) {
        // ignore in test/headless environments
      }
    }
  }, [isOpen, results]);

  if (!isOpen || !results) return null;

  const { score, total, percentage, answers } = results;
  const mastery = getMasteryTitle(percentage);
  const questions = episode.questions || [];

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div 
        className="modal-sheet" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px' }}
      >
        {/* Top Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Award size={18} color="var(--color-terracotta)" />
            <span style={{
              fontFamily: 'var(--font-roman)',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: 'var(--text-primary)'
            }}>
              EPISTEMIC MASTERY DOSSIER
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-muted)'
            }}
          >
            Done
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Spotlight Card */}
          <div style={{
            textAlign: 'center',
            backgroundColor: 'var(--bg-subtle)',
            border: `2px solid ${mastery.color}`,
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem 1.25rem',
            marginBottom: '1.25rem',
            position: 'relative'
          }}>
            <span style={{
              fontFamily: 'var(--font-roman)',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.14em',
              color: mastery.color,
              display: 'block',
              marginBottom: '0.25rem'
            }}>
              {mastery.greek}
            </span>

            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.8rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.2,
              marginBottom: '0.5rem'
            }}>
              {mastery.title}
            </h2>

            {/* Score Ring / Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 1.25rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--bg-surface)',
              border: `1.5px solid ${mastery.color}`,
              boxShadow: 'var(--shadow-card)',
              margin: '0.5rem 0'
            }}>
              <span style={{
                fontFamily: 'var(--font-roman)',
                fontSize: '20px',
                fontWeight: 800,
                color: mastery.color
              }}>
                {score} / {total}
              </span>
              <span style={{ color: 'var(--border-strong)' }}>|</span>
              <span style={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--text-primary)'
              }}>
                {percentage}% Score
              </span>
            </div>

            <p style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '13.5px',
              color: 'var(--text-secondary)',
              marginTop: '0.75rem',
              lineHeight: 1.5
            }}>
              «{episode.quote || 'The unexamined life is not worth living.'}»
            </p>
          </div>

          {/* Action Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.65rem',
            marginBottom: '1rem'
          }}>
            <button
              onClick={onOpenShareCard}
              className="touch-active"
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-terracotta)',
                color: 'var(--text-on-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                fontSize: '13px',
                fontWeight: 700,
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <Share2 size={15} />
              <span>Share Dossier</span>
            </button>

            <button
              onClick={onRetake}
              className="touch-active"
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-strong)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                fontSize: '13px',
                fontWeight: 600
              }}
            >
              <RotateCcw size={15} />
              <span>Retake Quiz</span>
            </button>
          </div>

          {onNextEpisode && (
            <button
              onClick={onNextEpisode}
              className="touch-active"
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--bg-surface)',
                border: '1.5px solid var(--color-terracotta)',
                color: 'var(--color-terracotta)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '14px',
                fontWeight: 700,
                marginBottom: '1rem'
              }}
            >
              <span>Advance to Next Milestone Episode</span>
              <ArrowRight size={16} />
            </button>
          )}

          {/* Collapsible Answer Audit */}
          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '0.85rem'
          }}>
            <button
              onClick={() => setShowReview(!showReview)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '13.5px'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <BookOpen size={15} color="var(--color-terracotta)" />
                <span>Review All {total} Questions & Explanations</span>
              </span>
              {showReview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showReview && (
              <div className="animate-fade-in" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginTop: '0.75rem'
              }}>
                {questions.map((q, idx) => {
                  const userAnswer = answers[q.id];
                  const isCorrect = userAnswer === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      style={{
                        padding: '0.85rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-surface)',
                        border: isCorrect ? '1px solid var(--color-success)' : '1px solid var(--border-strong)',
                        fontSize: '13px'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.35rem'
                      }}>
                        <span style={{ fontFamily: 'var(--font-roman)', fontWeight: 700, fontSize: '11px', color: 'var(--text-muted)' }}>
                          QUESTION {idx + 1}
                        </span>
                        {isCorrect ? (
                          <span style={{ color: 'var(--color-success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '11.5px' }}>
                            <CheckCircle2 size={12} /> Correct
                          </span>
                        ) : (
                          <span style={{ color: 'var(--color-error)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '11.5px' }}>
                            <XCircle size={12} /> Incorrect
                          </span>
                        )}
                      </div>

                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem', lineHeight: 1.4 }}>
                        {q.question}
                      </div>

                      <div style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.5, backgroundColor: 'var(--bg-subtle)', padding: '0.5rem', borderRadius: '4px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Vervaeke’s Insight: </span>
                        {q.explanation.whyCorrect}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
