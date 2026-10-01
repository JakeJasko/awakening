import React from 'react';
import { Search, X } from 'lucide-react';
import { ARCS } from '../data/syllabusData';

export default function ArcFilterBar({
  selectedArc,
  onSelectArc,
  searchQuery,
  onSearchChange
}) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {/* Search Input */}
      <div style={{
        position: 'relative',
        marginBottom: '0.85rem'
      }}>
        <div style={{
          position: 'absolute',
          left: '0.9rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          <Search size={16} />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by topic, thinker (Socrates, Buddha...), or concept..."
          aria-label="Search episodes by topic, thinker, or concept"
          style={{
            width: '100%',
            height: '44px',
            padding: '0 2.5rem 0 2.4rem',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border-strong)',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            outline: 'none',
            boxShadow: 'var(--shadow-subtle)',
            transition: 'border-color 0.15s ease'
          }}
        />

        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            aria-label="Clear search input"
            style={{
              position: 'absolute',
              right: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Horizontal Arc Filter Pills */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        overflowX: 'auto',
        paddingBottom: '0.35rem',
        scrollbarWidth: 'none'
      }}>
        <button
          onClick={() => onSelectArc('all')}
          className="touch-active"
          style={{
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '12.5px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-roman)',
            border: selectedArc === 'all' ? '1.5px solid var(--color-terracotta)' : '1px solid var(--border-subtle)',
            backgroundColor: selectedArc === 'all' ? 'var(--color-terracotta-light)' : 'var(--bg-surface)',
            color: selectedArc === 'all' ? 'var(--color-terracotta)' : 'var(--text-secondary)'
          }}
        >
          ALL ARCS
        </button>

        {ARCS.map((arc) => {
          const isSelected = selectedArc === arc.id;
          return (
            <button
              key={arc.id}
              onClick={() => onSelectArc(arc.id)}
              className="touch-active"
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '12px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                border: isSelected ? `1.5px solid ${arc.color}` : '1px solid var(--border-subtle)',
                backgroundColor: isSelected ? arc.bg : 'var(--bg-surface)',
                color: isSelected ? arc.color : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span style={{ fontFamily: 'var(--font-roman)', fontWeight: 700 }}>
                ARC {arc.roman}
              </span>
              <span className="hide-on-mobile" style={{ fontSize: '11px', opacity: 0.85 }}>
                ({arc.episodesRange})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
