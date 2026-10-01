import React, { useState } from 'react';
import { Play, ChevronDown, ChevronUp, ExternalLink, X, Headphones } from 'lucide-react';

export default function YouTubeDrawer({ episode, isOpen, onClose }) {
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen || !episode || !episode.youtubeId) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '70px',
      right: '16px',
      zIndex: 35,
      width: isMinimized ? '280px' : '360px',
      maxWidth: 'calc(100vw - 32px)',
      backgroundColor: 'var(--bg-surface)',
      border: '1.5px solid var(--border-strong)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-float)',
      overflow: 'hidden',
      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* Header Bar */}
      <div style={{
        padding: '0.65rem 0.85rem',
        backgroundColor: 'var(--bg-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer'
      }} onClick={() => setIsMinimized(!isMinimized)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden' }}>
          <Headphones size={15} color="var(--color-terracotta)" />
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
          }}>
            Audio/Video Companion • Ep {episode.roman || episode.id}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            style={{ color: 'var(--text-muted)' }}
          >
            {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Video Frame */}
      {!isMinimized && (
        <div>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={`https://www.youtube.com/embed/${episode.youtubeId}`}
              title={`Awakening from the Meaning Crisis - Episode ${episode.id}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div style={{
            padding: '0.5rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11.5px',
            backgroundColor: 'var(--bg-surface)'
          }}>
            <span style={{ color: 'var(--text-muted)' }}>Dr. John Vervaeke</span>
            <a
              href={`https://www.youtube.com/watch?v=${episode.youtubeId}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: 'var(--color-terracotta)',
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              <span>Open in YouTube</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
