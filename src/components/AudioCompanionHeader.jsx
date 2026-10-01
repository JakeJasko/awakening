import React, { useRef, useEffect } from 'react';
import { Play, Pause, ExternalLink, X, Video, Headphones, ChevronDown, ChevronUp } from 'lucide-react';

export default function AudioCompanionHeader({
  episode,
  isOpen,
  isPlaying,
  showVideo,
  onPlayPause,
  onToggleVideo,
  onClose
}) {
  const iframeRef = useRef(null);

  // Send play/pause commands to YouTube iframe via postMessage
  useEffect(() => {
    if (!iframeRef.current || !isOpen) return;
    try {
      const command = isPlaying ? 'playVideo' : 'pauseVideo';
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: command, args: '' }),
        '*'
      );
    } catch (e) {
      // Ignore cross-origin error before ready
    }
  }, [isPlaying, isOpen, episode?.youtubeId]);

  if (!isOpen || !episode || !episode.youtubeId) return null;

  const playlistUrl = `https://www.youtube.com/watch?v=${episode.youtubeId}&list=PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ&index=${episode.number || episode.id}`;

  return (
    <div style={{
      borderTop: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-surface)',
      boxShadow: '0 2px 8px rgba(35, 31, 28, 0.04)',
      transition: 'all 0.2s ease'
    }}>
      {/* Slim Audio Bar (42px) */}
      <div style={{
        padding: '0.4rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        minHeight: '42px',
        flexWrap: 'nowrap'
      }}>
        {/* Left Track Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          minWidth: 0,
          flex: 1
        }}>
          {/* Animated Audio Waveform */}
          <div 
            title={isPlaying ? "Audio playing" : "Audio paused"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2.5px',
              height: '14px',
              flexShrink: 0
            }}
          >
            <span className={`wave-bar ${isPlaying ? 'wave-1' : 'static'}`} />
            <span className={`wave-bar ${isPlaying ? 'wave-2' : 'static'}`} />
            <span className={`wave-bar ${isPlaying ? 'wave-3' : 'static'}`} />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            minWidth: 0,
            overflow: 'hidden'
          }}>
            <span style={{
              fontFamily: 'var(--font-roman)',
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--color-terracotta)',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}>
              EP {episode.roman || episode.number || episode.id}
            </span>

            <span style={{ color: 'var(--border-strong)', flexShrink: 0 }}>•</span>

            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}>
              {episode.title}
            </span>

            {episode.duration && (
              <span className="hide-on-mobile" style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                ({episode.duration})
              </span>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          flexShrink: 0
        }}>
          {/* Play/Pause Button */}
          <button
            onClick={onPlayPause}
            className="touch-active"
            title={isPlaying ? "Pause audio" : "Play audio"}
            aria-label={isPlaying ? "Pause audio companion" : "Play audio companion"}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-terracotta)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-subtle)'
            }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: '1px' }} />}
          </button>

          {/* Video Toggle Button */}
          <button
            onClick={onToggleVideo}
            className="touch-active"
            title={showVideo ? "Hide video drawer" : "Show lecture video"}
            aria-label={showVideo ? "Hide video drawer" : "Show lecture video"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: showVideo ? 'var(--bg-subtle)' : 'transparent',
              color: showVideo ? 'var(--color-terracotta)' : 'var(--text-secondary)',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Video size={13} />
            <span className="hide-on-mobile">{showVideo ? 'Hide Video' : 'Watch Video'}</span>
            {showVideo ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {/* Open on YouTube */}
          <a
            href={playlistUrl}
            target="_blank"
            rel="noreferrer"
            title="Open episode in official YouTube playlist"
            aria-label="Open episode in official YouTube playlist"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.25rem 0.55rem',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontSize: '11.5px',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <span className="hide-on-mobile">YouTube</span>
            <ExternalLink size={12} />
          </a>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="touch-active"
            title="Close audio companion"
            aria-label="Close audio companion"
            style={{
              padding: '0.25rem',
              borderRadius: 'var(--radius-pill)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Collapsible Video Preview (Only expanded when user explicitly clicks Watch Video) */}
      {showVideo ? (
        <div style={{
          padding: '0.75rem 1.25rem 1rem',
          backgroundColor: 'var(--bg-subtle)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '640px',
            position: 'relative',
            paddingBottom: 'min(56.25%, 360px)',
            height: 0,
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-card)',
            backgroundColor: '#000'
          }}>
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${episode.youtubeId}?enablejsapi=1&autoplay=1&rel=0`}
              title={`Awakening from the Meaning Crisis - Episode ${episode.id || episode.number}`}
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
        </div>
      ) : (
        /* Audio-only background iframe: kept active in viewport without blocking anything */
        <div style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          opacity: 0.001,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}>
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${episode.youtubeId}?enablejsapi=1&autoplay=1&rel=0`}
            title={`Awakening from the Meaning Crisis - Audio ${episode.id || episode.number}`}
            style={{ width: '1px', height: '1px', border: 'none' }}
            allow="autoplay; encrypted-media"
          />
        </div>
      )}
    </div>
  );
}
