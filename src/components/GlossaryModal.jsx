import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, X, Search, Sparkles, Filter, ArrowRight } from 'lucide-react';
import { GLOSSARY_TERMS, GLOSSARY_CATEGORIES } from '../data/glossaryData';

// Normalization helper for resilient fuzzy/partial matching
function normalize(str) {
  return (str || '')
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/[()\/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesConcept(itemTerm, query) {
  if (!query) return false;
  const nItem = normalize(itemTerm);
  const nQuery = normalize(query);
  if (!nQuery) return false;
  if (nItem === nQuery) return true;
  if (nItem.includes(nQuery) || nQuery.includes(nItem)) return true;
  const words = nQuery.split(' ').filter((w) => w.length > 2);
  if (words.length > 0 && words.every((w) => nItem.includes(w))) return true;
  return false;
}

function isTermInEpisode(item, episode) {
  if (!episode) return false;
  const epNum = episode.id || episode.number;
  if (item.keyEpisodes && item.keyEpisodes.includes(epNum)) {
    return true;
  }
  if (episode.keyConcepts && Array.isArray(episode.keyConcepts)) {
    return episode.keyConcepts.some((kc) => matchesConcept(item.term, kc));
  }
  return false;
}

export default function GlossaryModal({
  isOpen,
  onClose,
  onSelectEpisodeFromTerm,
  initialOptions
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedTerm, setHighlightedTerm] = useState(null);
  const [activeEpisodeFilter, setActiveEpisodeFilter] = useState(null);
  const [isEpisodeOnlyFilter, setIsEpisodeOnlyFilter] = useState(false);

  const listContainerRef = useRef(null);
  const scrolledRef = useRef(false);

  // Sync state whenever modal opens with new initialOptions
  useEffect(() => {
    if (isOpen) {
      scrolledRef.current = false;
      if (initialOptions?.term) {
        setHighlightedTerm(initialOptions.term);
        setSearchQuery(initialOptions.term);
        setActiveEpisodeFilter(initialOptions.episode || null);
        setIsEpisodeOnlyFilter(false);
        setSelectedCategory('All');
      } else if (initialOptions?.episode) {
        setHighlightedTerm(null);
        setSearchQuery('');
        setActiveEpisodeFilter(initialOptions.episode);
        setIsEpisodeOnlyFilter(true);
        setSelectedCategory('All');
      } else {
        setHighlightedTerm(null);
        setSearchQuery('');
        setActiveEpisodeFilter(null);
        setIsEpisodeOnlyFilter(false);
        setSelectedCategory('All');
      }
    }
  }, [isOpen, initialOptions]);

  if (!isOpen) return null;

  // Filtered terms computation
  const filteredTerms = GLOSSARY_TERMS.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    
    // Episode filter (when opened via "View in Lexicon" in episode context)
    const matchesEp = (!isEpisodeOnlyFilter || !activeEpisodeFilter) || isTermInEpisode(item, activeEpisodeFilter);

    // Search query
    const cleanSearch = searchQuery.trim().toLowerCase();
    const matchesSearch =
      cleanSearch === '' ||
      matchesConcept(item.term, cleanSearch) ||
      item.term.toLowerCase().includes(cleanSearch) ||
      item.shortDef.toLowerCase().includes(cleanSearch) ||
      item.fullDef.toLowerCase().includes(cleanSearch) ||
      (item.greekOrLatin && item.greekOrLatin.toLowerCase().includes(cleanSearch));

    return matchesCat && matchesEp && matchesSearch;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setHighlightedTerm(null);
    setIsEpisodeOnlyFilter(false);
    setSelectedCategory('All');
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    // If user explicitly clicks a category tab, let them browse that category
    if (isEpisodeOnlyFilter) {
      setIsEpisodeOnlyFilter(false);
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div 
        className="modal-sheet" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', maxHeight: '88vh' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-terracotta-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-terracotta)',
              flexShrink: 0
            }}>
              <BookOpen size={18} />
            </div>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-roman)',
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '0.1em',
                color: 'var(--text-primary)',
                lineHeight: 1.2
              }}>
                COGNITIVE LEXICON & CONCEPTS
              </h3>
              <p style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '11px',
                color: 'var(--text-muted)'
              }}>
                Dr. John Vervaeke’s Conceptual Architecture & Psychotechnologies
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="touch-active"
            style={{
              padding: '0.35rem',
              borderRadius: 'var(--radius-pill)',
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
            aria-label="Close Lexicon"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div style={{
          padding: '0.85rem 1.25rem 0.5rem',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0
        }}>
          {/* Search bar with clear button */}
          <div style={{ position: 'relative', marginBottom: '0.65rem' }}>
            <div style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none'
            }}>
              <Search size={15} />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts (4 Ways of Knowing, Nomological Order, RR...)"
              style={{
                width: '100%',
                height: '38px',
                padding: '0 2.2rem 0 2.2rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-strong)',
                backgroundColor: 'var(--bg-canvas)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '50%'
                }}
                aria-label="Clear search query"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            overflowX: 'auto',
            paddingBottom: '0.4rem',
            scrollbarWidth: 'none'
          }}>
            {GLOSSARY_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    border: isActive ? '1px solid var(--color-terracotta)' : '1px solid var(--border-subtle)',
                    backgroundColor: isActive ? 'var(--color-terracotta-light)' : 'var(--bg-subtle)',
                    color: isActive ? 'var(--color-terracotta)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Notice Bar */}
        {(isEpisodeOnlyFilter && activeEpisodeFilter) && (
          <div style={{
            padding: '0.65rem 1.25rem',
            backgroundColor: 'var(--color-terracotta-light)',
            borderBottom: '1px solid var(--color-terracotta-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            flexWrap: 'wrap',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Filter size={14} color="var(--color-terracotta)" />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-terracotta-dark)' }}>
                Showing concepts for <strong>Episode {activeEpisodeFilter.roman || activeEpisodeFilter.id}</strong> ({filteredTerms.length} terms)
              </span>
            </div>
            <button
              onClick={handleResetFilters}
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--color-terracotta)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--color-terracotta-border)',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer'
              }}
            >
              Show All Concepts ({GLOSSARY_TERMS.length})
            </button>
          </div>
        )}

        {/* Highlighted Concept Notice Bar (if filtering by specific term) */}
        {(!isEpisodeOnlyFilter && highlightedTerm && searchQuery === highlightedTerm) && (
          <div style={{
            padding: '0.55rem 1.25rem',
            backgroundColor: 'var(--bg-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              <Sparkles size={13} color="var(--color-terracotta)" />
              <span>Filtered to concept: <strong style={{ color: 'var(--color-terracotta)' }}>{highlightedTerm}</strong></span>
            </div>
            <button
              onClick={handleResetFilters}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                backgroundColor: 'transparent',
                border: 'none',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              Show All Concepts ({GLOSSARY_TERMS.length})
            </button>
          </div>
        )}

        {/* Body Terms List */}
        <div 
          ref={listContainerRef}
          className="modal-body" 
          style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
        >
          {filteredTerms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '14px', marginBottom: '0.75rem' }}>No concepts matching your search.</p>
              <button
                onClick={handleResetFilters}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--color-terracotta)',
                  backgroundColor: 'var(--color-terracotta-light)',
                  border: '1px solid var(--color-terracotta-border)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-pill)',
                  cursor: 'pointer'
                }}
              >
                Reset Search & View All
              </button>
            </div>
          ) : (
            filteredTerms.map((item) => {
              const isSelected = highlightedTerm && matchesConcept(item.term, highlightedTerm);
              const isEpisodeCore = activeEpisodeFilter && isTermInEpisode(item, activeEpisodeFilter);

              return (
                <div
                  key={item.id}
                  data-term-id={item.id}
                  ref={(el) => {
                    if (isSelected && el && !scrolledRef.current) {
                      scrolledRef.current = true;
                      setTimeout(() => {
                        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                      }, 100);
                    }
                  }}
                  style={{
                    backgroundColor: isSelected ? 'var(--color-terracotta-subtle)' : 'var(--bg-surface-elevated)',
                    border: isSelected 
                      ? '2px solid var(--color-terracotta)' 
                      : isEpisodeCore 
                        ? '1.5px solid var(--color-terracotta-border)' 
                        : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.1rem 1.15rem',
                    boxShadow: isSelected 
                      ? '0 0 0 3px var(--color-terracotta-light), 0 8px 24px rgba(184, 80, 50, 0.16)' 
                      : 'var(--shadow-subtle)',
                    transition: 'border 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  {/* Top Bar inside card: Selected Badge / Greek / Category */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.4rem',
                    flexWrap: 'wrap',
                    gap: '0.35rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '0.15rem 0.45rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-subtle)',
                        fontSize: '10.5px',
                        fontWeight: 600,
                        color: 'var(--text-muted)'
                      }}>
                        {item.category}
                      </span>

                      {isSelected && (
                        <span 
                          className="selected-concept-badge"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.15rem 0.55rem',
                            borderRadius: 'var(--radius-pill)',
                            backgroundColor: 'var(--color-terracotta)',
                            color: '#ffffff',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            letterSpacing: '0.03em'
                          }}
                        >
                          ✦ Selected Concept
                        </span>
                      )}

                      {!isSelected && isEpisodeCore && activeEpisodeFilter && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          padding: '0.12rem 0.45rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--color-terracotta-light)',
                          color: 'var(--color-terracotta)',
                          fontSize: '10px',
                          fontWeight: 700,
                          border: '1px solid var(--color-terracotta-border)'
                        }}>
                          Ep {activeEpisodeFilter.roman || activeEpisodeFilter.id} Core Concept
                        </span>
                      )}
                    </div>

                    {item.greekOrLatin && (
                      <span style={{
                        fontFamily: 'var(--font-roman)',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--color-terracotta)'
                      }}>
                        {item.greekOrLatin}
                      </span>
                    )}
                  </div>

                  {/* Term Title */}
                  <h4 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '16.5px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '0.4rem',
                    lineHeight: 1.3
                  }}>
                    {item.term}
                  </h4>

                  {/* Definition */}
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.55,
                    marginBottom: '0.6rem'
                  }}>
                    {item.fullDef}
                  </p>

                  {/* Why it matters / Relevance */}
                  {item.relevance && (
                    <div style={{
                      fontSize: '12px',
                      fontStyle: 'italic',
                      color: 'var(--text-muted)',
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '0.6rem',
                      lineHeight: 1.45
                    }}>
                      <strong style={{ fontStyle: 'normal', color: 'var(--text-primary)' }}>Why it matters: </strong>
                      {item.relevance}
                    </div>
                  )}

                  {/* Key Episodes Footer Navigation */}
                  {item.keyEpisodes && item.keyEpisodes.length > 0 && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      flexWrap: 'wrap'
                    }}>
                      <span>Key Episodes:</span>
                      {item.keyEpisodes.map((epNum) => (
                        <button
                          key={epNum}
                          type="button"
                          onClick={() => onSelectEpisodeFromTerm && onSelectEpisodeFromTerm(epNum)}
                          className="touch-active"
                          style={{
                            padding: '0.12rem 0.45rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: (activeEpisodeFilter && (activeEpisodeFilter.id === epNum || activeEpisodeFilter.number === epNum))
                              ? 'var(--color-terracotta-light)' 
                              : 'var(--bg-subtle)',
                            border: (activeEpisodeFilter && (activeEpisodeFilter.id === epNum || activeEpisodeFilter.number === epNum))
                              ? '1px solid var(--color-terracotta-border)' 
                              : '1px solid var(--border-subtle)',
                            fontWeight: 700,
                            color: (activeEpisodeFilter && (activeEpisodeFilter.id === epNum || activeEpisodeFilter.number === epNum))
                              ? 'var(--color-terracotta)' 
                              : 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem'
                          }}
                          title={`Navigate to Episode ${epNum}`}
                        >
                          Ep {epNum}
                          <ArrowRight size={10} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
