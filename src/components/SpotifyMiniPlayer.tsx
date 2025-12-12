import { useState } from 'react';

// Curated song list with correct Spotify track IDs
const SONGS = [
  { id: '1SvET7grrtsHT0CkyJjJcZ', title: 'Is It a Crime', artist: 'Sade' },
  { id: '0ofHAoxe9vBkTCp2UQIavz', title: 'Dreams', artist: 'Fleetwood Mac' },
  { id: '1wo3UYTeizJHkwYIuLuBPF', title: 'Champagne Supernova', artist: 'Oasis' },
  { id: '6dGnYIeXmHdcikdzNNDMm2', title: 'Here Comes the Sun', artist: 'The Beatles' },
];

export function SpotifyMiniPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(0);

  const currentSong = SONGS[currentTrack];
  const spotifyEmbedUrl = `https://open.spotify.com/embed/track/${currentSong.id}?utm_source=generator&theme=0`;

  const nextTrack = () => setCurrentTrack((prev) => (prev + 1) % SONGS.length);
  const prevTrack = () => setCurrentTrack((prev) => (prev - 1 + SONGS.length) % SONGS.length);

  // Minimized floating button
  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 z-50 bg-olive-green hover:bg-ink text-paper p-2.5 rounded-full shadow-md transition-all duration-300 hover:scale-105 border border-border-color"
        aria-label="Show music player"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      </button>
    );
  }

  return (
    <div 
      className="fixed bottom-6 right-6 z-50"
      style={{ maxWidth: 'calc(100vw - 48px)' }}
    >
      {/* Minimalistic Player Container */}
      <div 
        className={`bg-paper border border-border-color rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
          isExpanded ? 'w-[280px] sm:w-[320px]' : 'w-[52px]'
        }`}
      >
        {/* Collapsed: Just a music icon */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full h-[52px] flex items-center justify-center text-olive-green hover:text-ink transition-colors"
            aria-label="Expand player"
          >
            <div className="flex items-center gap-0.5">
              <div className="w-0.5 h-3 bg-olive-green rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <div className="w-0.5 h-4 bg-olive-green rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <div className="w-0.5 h-2 bg-olive-green rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
              <div className="w-0.5 h-5 bg-olive-green rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
            </div>
          </button>
        )}

        {/* Expanded Player */}
        {isExpanded && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-border-color">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink/50">Now Playing</span>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-ink/40 hover:text-ink transition-colors"
                aria-label="Minimize"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 15l-6-6-6 6"/>
                </svg>
              </button>
            </div>

            {/* Track Selector */}
            <div className="flex items-center justify-between px-3 py-2 bg-ink/[0.02]">
              <button
                onClick={prevTrack}
                className="text-ink/40 hover:text-olive-green transition-colors p-1"
                aria-label="Previous"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>
              
              <div className="flex-1 text-center px-2 overflow-hidden">
                <p className="font-serif text-sm text-ink truncate">{currentSong.title}</p>
                <p className="font-mono text-[10px] text-ink/50 truncate">{currentSong.artist}</p>
              </div>
              
              <button
                onClick={nextTrack}
                className="text-ink/40 hover:text-olive-green transition-colors p-1"
                aria-label="Next"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                </svg>
              </button>
            </div>

            {/* Track dots */}
            <div className="flex justify-center gap-1.5 py-2 border-b border-border-color">
              {SONGS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTrack(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentTrack 
                      ? 'bg-olive-green' 
                      : 'bg-border-color hover:bg-ink/30'
                  }`}
                  aria-label={`Track ${index + 1}`}
                />
              ))}
            </div>

            {/* Spotify Embed */}
            <iframe
              key={currentSong.id}
              src={spotifyEmbedUrl}
              width="100%"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title={currentSong.title}
              className="block"
            />

            {/* Close button */}
            <button
              onClick={() => setIsVisible(false)}
              className="w-full py-2 text-center font-mono text-[10px] uppercase tracking-widest text-ink/40 hover:text-ink/60 hover:bg-ink/[0.02] transition-colors border-t border-border-color"
            >
              Hide Player
            </button>
          </>
        )}
      </div>
    </div>
  );
}
