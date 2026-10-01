import React, { useState, useRef, useEffect } from 'react';
import { Check, X, ArrowRight, ArrowLeft, HelpCircle, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI'];

export default function EpisodeQuiz({
  episode,
  onFinishQuiz,
  onBackToOverview
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({}); // questionId -> selectedIndex
  const [slideDirection, setSlideDirection] = useState('next');
  const cardRef = useRef(null);
  const explanationRef = useRef(null);
  const shouldScrollToExplanation = useRef(false);

  const questions = episode.questions || [];
  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;

  if (!currentQ) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p>No questions currently loaded for this episode.</p>
        <button
          onClick={onBackToOverview}
          style={{
            marginTop: '1rem',
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--color-terracotta)',
            color: 'white'
          }}
        >
          Return to Overview
        </button>
      </div>
    );
  }

  const isCurrentSubmitted = isSubmitted;
  const isCorrect = isCurrentSubmitted && selectedOption === currentQ.correctIndex;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (idx) => {
    if (isSubmitted) return; // locked once checked
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    shouldScrollToExplanation.current = true;
    setIsSubmitted(true);
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: selectedOption
    }));
  };

  // Scroll down smoothly to reveal explanation & next inquiry button upon answer submission
  useEffect(() => {
    if (isSubmitted && shouldScrollToExplanation.current) {
      shouldScrollToExplanation.current = false;
      const timer = setTimeout(() => {
        if (!explanationRef.current) return;
        const header = document.querySelector('header');
        const headerHeight = header ? header.getBoundingClientRect().height : 60;
        const offset = headerHeight + 20;
        const rect = explanationRef.current.getBoundingClientRect();
        const absoluteElementTop = rect.top + window.pageYOffset;
        const targetScrollY = Math.max(0, absoluteElementTop - offset);

        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth'
        });
      }, 70);

      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setSlideDirection('next');
      const nextIndex = currentIndex + 1;
      const nextQ = questions[nextIndex];
      setCurrentIndex(nextIndex);
      // If user had already answered nextQ in a previous traversal
      const existingAnswer = userAnswers[nextQ.id];
      if (existingAnswer !== undefined) {
        setSelectedOption(existingAnswer);
        setIsSubmitted(true);
      } else {
        setSelectedOption(null);
        setIsSubmitted(false);
      }
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      // Calculate score and finish using merged answers
      const allAnswers = { ...userAnswers, [currentQ.id]: selectedOption };
      let score = 0;
      questions.forEach((q) => {
        if (allAnswers[q.id] === q.correctIndex) {
          score += 1;
        }
      });
      const percentage = Math.round((score / totalQuestions) * 100);
      onFinishQuiz({
        score,
        total: totalQuestions,
        percentage,
        answers: allAnswers
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSlideDirection('prev');
      const prevIndex = currentIndex - 1;
      const prevQ = questions[prevIndex];
      setCurrentIndex(prevIndex);
      setSelectedOption(userAnswers[prevQ.id] !== undefined ? userAnswers[prevQ.id] : null);
      setIsSubmitted(userAnswers[prevQ.id] !== undefined);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '7.5rem' }}>
      {/* Quiz Progress Header */}
      <div style={{
        marginBottom: '1.25rem',
        backgroundColor: 'var(--bg-surface)',
        padding: '0.85rem 1.15rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.45rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              fontFamily: 'var(--font-roman)',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: 'var(--color-terracotta)'
            }}>
              QUESTION {ROMAN_NUMERALS[currentIndex] || currentIndex + 1} OF {ROMAN_NUMERALS[totalQuestions - 1] || totalQuestions}
            </span>
            <span style={{ color: 'var(--border-strong)' }}>•</span>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase'
            }}>
              EPISODE {episode.roman || episode.id}
            </span>
          </div>

          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            color: 'var(--text-muted)'
          }}>
            {progressPercent}%
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          height: '3.5px',
          width: '100%',
          backgroundColor: 'var(--border-subtle)',
          borderRadius: 'var(--radius-pill)',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: 'var(--color-terracotta)',
            transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            borderRadius: 'var(--radius-pill)'
          }} />
        </div>
      </div>

      {/* Main Question Card */}
      <div
        key={currentQ.id}
        ref={cardRef}
        className={slideDirection === 'next' ? 'animate-slide-next' : 'animate-slide-prev'}
      >
        {/* Scenario Box */}
        {currentQ.scenario && (
          <div style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.1rem 1.25rem',
            marginBottom: '1rem',
            borderLeft: '4px solid var(--color-terracotta)'
          }}>
            <span style={{
              fontFamily: 'var(--font-roman)',
              fontSize: '10.5px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'var(--color-terracotta)',
              display: 'block',
              marginBottom: '0.35rem'
            }}>
              THOUGHT EXPERIMENT / SCENARIO
            </span>
            <p style={{
              fontSize: '14.5px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6
            }}>
              {currentQ.scenario}
            </p>
          </div>
        )}

        {/* Question Prompt */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          marginBottom: '1.25rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.2rem, 3.5vw, 1.45rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.35
          }}>
            {currentQ.question}
          </h3>
        </div>

        {/* Options List */}
        <div 
          role="radiogroup" 
          aria-label="Episode inquiry options"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}
        >
          {currentQ.options.map((optionText, idx) => {
            const isSelected = selectedOption === idx;
            const isThisCorrect = currentQ.correctIndex === idx;

            // Determine border & background based on state
            let bg = 'var(--bg-surface)';
            let borderColor = 'var(--border-subtle)';
            let textColor = 'var(--text-primary)';
            let stampBg = 'var(--bg-subtle)';
            let stampColor = 'var(--text-secondary)';
            let stampBorder = 'var(--border-strong)';

            if (isSelected && !isSubmitted) {
              bg = 'var(--color-terracotta-light)';
              borderColor = 'var(--color-terracotta)';
              stampBg = 'var(--color-terracotta)';
              stampColor = 'var(--text-on-accent)';
              stampBorder = 'var(--color-terracotta)';
            } else if (isSubmitted) {
              if (isThisCorrect) {
                bg = 'var(--color-success-bg)';
                borderColor = 'var(--color-success)';
                stampBg = 'var(--color-success)';
                stampColor = 'var(--text-on-accent)';
                stampBorder = 'var(--color-success)';
              } else if (isSelected && !isThisCorrect) {
                bg = 'var(--color-error-bg)';
                borderColor = 'var(--color-error)';
                stampBg = 'var(--color-error)';
                stampColor = 'var(--text-on-accent)';
                stampBorder = 'var(--color-error)';
              }
            }

            return (
              <button
                key={idx}
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelectOption(idx)}
                className="touch-active"
                style={{
                  textAlign: 'left',
                  width: '100%',
                  padding: '1rem 1.15rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: bg,
                  border: `1.5px solid ${borderColor}`,
                  boxShadow: isSelected ? 'var(--shadow-card)' : 'var(--shadow-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  cursor: isSubmitted ? 'default' : 'pointer'
                }}
              >
                {/* Stamp Circle */}
                <div style={{
                  flexShrink: 0,
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-pill)',
                  border: `1.5px solid ${stampBorder}`,
                  backgroundColor: stampBg,
                  color: stampColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-roman)',
                  fontWeight: 800,
                  fontSize: '11px',
                  marginTop: '1px'
                }}>
                  {isSubmitted && isThisCorrect ? (
                    <Check size={14} strokeWidth={3} />
                  ) : isSubmitted && isSelected && !isThisCorrect ? (
                    <X size={14} strokeWidth={3} />
                  ) : (
                    ROMAN_NUMERALS[idx]
                  )}
                </div>

                {/* Option Text */}
                <div style={{
                  flex: 1,
                  fontSize: '14.5px',
                  color: textColor,
                  lineHeight: 1.5,
                  fontWeight: isSelected ? 600 : 400
                }}>
                  {optionText}
                </div>
              </button>
            );
          })}
        </div>

        {/* Didactic Deep Dive (Revealed upon submission) */}
        {isSubmitted && currentQ.explanation && (
          <div
            ref={explanationRef}
            data-testid="quiz-explanation-box"
            tabIndex={-1}
            className="animate-fade-in"
            style={{
              scrollMarginTop: '90px',
              backgroundColor: isCorrect ? 'var(--color-success-bg)' : 'var(--bg-surface)',
              border: isCorrect ? '1.5px solid var(--color-success)' : '1.5px solid var(--border-strong)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            {/* Header banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
              color: isCorrect ? 'var(--color-success)' : 'var(--color-terracotta)'
            }}>
              {isCorrect ? (
                <>
                  <CheckCircle2 size={20} />
                  <span style={{ fontFamily: 'var(--font-roman)', fontWeight: 800, fontSize: '13px', letterSpacing: '0.08em' }}>
                    COGNITIVE CONTACT ACHIEVED • CORRECT UNDERSTANDING
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle size={20} />
                  <span style={{ fontFamily: 'var(--font-roman)', fontWeight: 800, fontSize: '13px', letterSpacing: '0.08em' }}>
                    EPISTEMIC ILLUSION DETECTED • REVIEW THE VERVAEKEAN ARGUMENT
                  </span>
                </>
              )}
            </div>

            {/* Why Correct explanation */}
            <div style={{ marginBottom: '0.85rem' }}>
              <span style={{
                fontFamily: 'var(--font-roman)',
                fontSize: '10.5px',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                display: 'block',
                marginBottom: '0.2rem'
              }}>
                WHY THIS IS TRUE TO THE COGNITIVE SCIENCE
              </span>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                {currentQ.explanation.whyCorrect}
              </p>
            </div>

            {/* Common Trap explanation */}
            {currentQ.explanation.commonTrap && (
              <div style={{ marginBottom: '0.85rem' }}>
                <span style={{
                  fontFamily: 'var(--font-roman)',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.08em',
                  display: 'block',
                  marginBottom: '0.2rem'
                }}>
                  THE COMMON COGNITIVE TRAP / COUNTERFEIT
                </span>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {currentQ.explanation.commonTrap}
                </p>
              </div>
            )}

            {/* Timestamp reference */}
            {currentQ.explanation.timestampRef && (
              <div style={{
                paddingTop: '0.6rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '12px',
                color: 'var(--text-muted)'
              }}>
                <BookOpen size={13} color="var(--color-terracotta)" />
                <span>{currentQ.explanation.timestampRef}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky Bottom Thumb Navigation Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--bg-canvas)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '0.85rem 1.25rem',
        zIndex: 30,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: 'var(--max-content-width)',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="touch-active"
              style={{
                height: '52px',
                padding: '0 1.25rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-strong)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '14px',
                fontWeight: 600
              }}
            >
              <ArrowLeft size={16} />
              <span className="hide-on-mobile">Previous</span>
            </button>
          )}

          {!isSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className="touch-active"
              style={{
                flex: 1,
                height: '52px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: selectedOption !== null ? 'var(--color-terracotta)' : 'var(--border-strong)',
                color: 'var(--text-on-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '15px',
                fontWeight: 700,
                cursor: selectedOption !== null ? 'pointer' : 'not-allowed',
                opacity: selectedOption !== null ? 1 : 0.6,
                boxShadow: selectedOption !== null ? 'var(--shadow-card)' : 'none'
              }}
            >
              <span>Submit & Examine Reason</span>
              <Check size={16} />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="touch-active"
              style={{
                flex: 1,
                height: '52px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-terracotta)',
                color: 'var(--text-on-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <span>{currentIndex === totalQuestions - 1 ? 'Analyze Mastery Results' : 'Proceed to Next Inquiry'}</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
