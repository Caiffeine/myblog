import { useState, useRef, useEffect } from 'react';

// Music playlist with local MP3 files
const SONGS = [
  { file: '/music/Dreams - Fleetwood Mac.mp3', title: 'Dreams', artist: 'Fleetwood Mac' },
  { file: '/music/Is It a Crime - Sade.mp3', title: 'Is It a Crime', artist: 'Sade' },
  { file: '/music/Champagne Supernova - Oasis.mp3', title: 'Champagne Supernova', artist: 'Oasis' },
  { file: '/music/Here Comes The Sun - The Beatles.mp3', title: 'Here Comes The Sun', artist: 'The Beatles' },
];

// Spinning Vinyl Component
function Vinyl({ isPlaying, size = 120 }: { isPlaying: boolean; size?: number }) {
  return (
    <div 
      className={`relative rounded-full ${isPlaying ? 'animate-spin' : ''}`}
      style={{ 
        width: size, 
        height: size,
        animationDuration: '3s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite'
      }}
    >
      {/* Outer vinyl ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-lg">
        {/* Grooves */}
        <div className="absolute inset-2 rounded-full border border-gray-700/30" />
        <div className="absolute inset-4 rounded-full border border-gray-700/20" />
        <div className="absolute inset-6 rounded-full border border-gray-700/30" />
        <div className="absolute inset-8 rounded-full border border-gray-700/20" />
        <div className="absolute inset-10 rounded-full border border-gray-700/30" />
        
        {/* Shiny reflection */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
      </div>
      
      {/* Label center */}
      <div 
        className="absolute rounded-full bg-gradient-to-br from-olive-green to-ink flex items-center justify-center shadow-inner"
        style={{
          width: size * 0.35,
          height: size * 0.35,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Center hole */}
        <div className="w-2 h-2 rounded-full bg-gray-900" />
      </div>
    </div>
  );
}

// Mini vinyl for collapsed state
function MiniVinyl({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div 
      className={`relative w-9 h-9 rounded-full flex-shrink-0 ${isPlaying ? 'animate-spin' : ''}`}
      style={{ 
        animationDuration: '2s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite'
      }}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="absolute inset-1 rounded-full border border-gray-700/30" />
        <div className="absolute inset-2 rounded-full border border-gray-700/20" />
      </div>
      <div className="absolute w-3 h-3 rounded-full bg-olive-green top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <div className="w-1 h-1 rounded-full bg-gray-900" />
      </div>
    </div>
  );
}

export function MusicPlayer() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.2);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentSong = SONGS[currentTrack];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play();
    }
  }, [currentTrack, isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => setCurrentTrack((prev) => (prev + 1) % SONGS.length);
  const prevTrack = () => setCurrentTrack((prev) => (prev - 1 + SONGS.length) % SONGS.length);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleEnded = () => nextTrack();

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Audio element - always mounted */}
      <audio
        ref={audioRef}
        src={currentSong.file}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* Hidden state - floating button with mini vinyl */}
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-paper hover:bg-paper border border-border-color text-ink pl-2 pr-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          aria-label="Show music player"
        >
          <MiniVinyl isPlaying={isPlaying} />
          <span className="font-mono text-xs uppercase tracking-wide text-ink/70">
            {isPlaying ? 'Playing' : 'Music'}
          </span>
        </button>
      )}

      {/* Player UI */}
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-50" style={{ maxWidth: 'calc(100vw - 48px)' }}>
          <div className={`bg-paper border border-border-color rounded-xl shadow-xl overflow-hidden transition-all duration-300 ${
            isExpanded ? 'w-[300px] sm:w-[340px]' : 'w-auto'
          }`}>
            
            {/* COLLAPSED STATE */}
            {!isExpanded && (
              <div className="flex items-center gap-3 px-3 py-2.5">
                {/* Mini Vinyl */}
                <button onClick={togglePlay} className="relative" aria-label={isPlaying ? 'Pause' : 'Play'}>
                  <MiniVinyl isPlaying={isPlaying} />
                  {/* Play/Pause overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 rounded-full transition-colors">
                    <div className="opacity-0 hover:opacity-100 transition-opacity">
                      {isPlaying ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                          <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
                        </svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </button>

                {/* Song info */}
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-sm text-ink truncate">{currentSong.title}</p>
                  <p className="text-[10px] text-ink/50 truncate">{currentSong.artist}</p>
                </div>

                {/* Expand button */}
                <button
                  onClick={() => setIsExpanded(true)}
                  className="p-2 text-ink/40 hover:text-ink transition-colors rounded-full hover:bg-ink/5"
                  aria-label="Expand player"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>
            )}

            {/* EXPANDED STATE */}
            {isExpanded && (
              <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40">Now Playing</span>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1.5 text-ink/40 hover:text-ink transition-colors rounded-full hover:bg-ink/5"
                    aria-label="Collapse"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 15l-6-6-6 6"/>
                    </svg>
                  </button>
                </div>

                {/* Vinyl with controls */}
                <div className="flex flex-col items-center mb-4">
                  {/* Vinyl record */}
                  <div className="relative mb-4">
                    <Vinyl isPlaying={isPlaying} size={120} />
                    {/* Play/Pause button overlay */}
                    <button
                      onClick={togglePlay}
                      className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 rounded-full transition-colors"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-paper/90 rounded-full shadow-md opacity-0 hover:opacity-100 transition-opacity">
                        {isPlaying ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-ink">
                            <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-ink ml-0.5">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Song Info */}
                  <h3 className="font-serif text-lg text-ink leading-tight text-center">{currentSong.title}</h3>
                  <p className="text-sm text-ink/50 mt-0.5">{currentSong.artist}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-1 bg-border-color rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-olive-green [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[11px] text-ink/40 tabular-nums">{formatTime(progress)}</span>
                    <span className="text-[11px] text-ink/40 tabular-nums">{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-6 mb-4">
                  <button onClick={prevTrack} className="p-2 text-ink/60 hover:text-olive-green transition-colors" aria-label="Previous">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                    </svg>
                  </button>
                  
                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 flex items-center justify-center bg-olive-green hover:bg-ink text-paper rounded-full transition-colors shadow-md"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>
                  
                  <button onClick={nextTrack} className="p-2 text-ink/60 hover:text-olive-green transition-colors" aria-label="Next">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                    </svg>
                  </button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-3 mb-4 px-1">
                  <button
                    onClick={() => setVolume(volume === 0 ? 0.2 : 0)}
                    className="text-ink/50 hover:text-olive-green transition-colors"
                    aria-label={volume === 0 ? 'Unmute' : 'Mute'}
                  >
                    {volume === 0 ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                        <line x1="23" y1="9" x2="17" y2="15"/>
                        <line x1="17" y1="9" x2="23" y2="15"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                      </svg>
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="flex-1 h-1 bg-border-color rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-olive-green [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <span className="text-[10px] text-ink/40 w-7 text-right tabular-nums">{Math.round(volume * 100)}%</span>
                </div>

                {/* Track List */}
                <div className="border-t border-border-color pt-3">
                  <p className="text-[10px] uppercase tracking-widest text-ink/40 mb-2">Playlist</p>
                  <div className="space-y-0.5 max-h-[140px] overflow-y-auto">
                    {SONGS.map((song, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTrack(index)}
                        className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-colors text-left ${
                          index === currentTrack 
                            ? 'bg-olive-green/10 text-olive-green' 
                            : 'hover:bg-ink/5 text-ink/70'
                        }`}
                      >
                        {/* Mini vinyl indicator */}
                        <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center ${
                          index === currentTrack ? 'bg-gray-900' : 'bg-gray-200'
                        }`}>
                          {index === currentTrack ? (
                            <div className={`w-2 h-2 rounded-full bg-olive-green ${isPlaying ? 'animate-pulse' : ''}`} />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs truncate ${index === currentTrack ? 'font-medium' : ''}`}>{song.title}</p>
                          <p className="text-[9px] opacity-60 truncate">{song.artist}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hide button */}
                <button
                  onClick={() => setIsVisible(false)}
                  className="w-full mt-3 py-1.5 text-center text-[10px] text-ink/40 hover:text-ink/60 transition-colors"
                >
                  Hide Player
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
