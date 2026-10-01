import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Download, Copy, Check, X, Share2, Sparkles } from 'lucide-react';
import { generateEpisodeCard } from '../utils/cardRenderer';

export default function ShareCardModal({
  isOpen,
  onClose,
  episode,
  score,
  total,
  percentage
}) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (isOpen && episode) {
      setIsGenerating(true);
      generateEpisodeCard({ episode, score, total, percentage })
        .then((url) => {
          if (isMounted) {
            setImageUrl(url);
            setIsGenerating(false);
          }
        })
        .catch((err) => {
          console.error('Error generating card', err);
          if (isMounted) setIsGenerating(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, episode, score, total, percentage]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `Awakening_Ep_${episode.id || episode.number}_Mastery_Dossier.png`;
    a.click();
  };

  const handleCopy = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (e) {
      console.warn('Clipboard copy failed, opening in new tab', e);
      window.open(imageUrl, '_blank');
    }
  };

  const modalContent = (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div 
        className="modal-sheet" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Share2 size={16} color="var(--color-terracotta)" />
            <span style={{
              fontFamily: 'var(--font-roman)',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: 'var(--text-primary)'
            }}>
              EPISTEMIC DOSSIER CARD
            </span>
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

        {/* Modal Body */}
        <div className="modal-body" style={{ textAlign: 'center' }}>
          {isGenerating ? (
            <div style={{ padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <p>Rendering high-resolution classical dossier...</p>
            </div>
          ) : imageUrl ? (
            <>
              <div style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
                marginBottom: '1.25rem',
                border: '1px solid var(--border-subtle)',
                maxHeight: '440px'
              }}>
                <img
                  src={imageUrl}
                  alt="Epistemic Mastery Dossier"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem'
              }}>
                <button
                  onClick={handleDownload}
                  className="touch-active"
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--color-terracotta)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    boxShadow: 'var(--shadow-card)'
                  }}
                >
                  <Download size={15} />
                  <span>Download Card</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="touch-active"
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-strong)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    fontSize: '13.5px',
                    fontWeight: 600
                  }}
                >
                  {isCopied ? <Check size={15} color="var(--color-success)" /> : <Copy size={15} />}
                  <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Image'}</span>
                </button>
              </div>
            </>
          ) : (
            <p>Could not generate card preview.</p>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
}
