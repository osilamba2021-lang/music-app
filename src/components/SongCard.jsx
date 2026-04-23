import React from 'react';
import { Download, Music } from 'lucide-react';

export default function SongCard({ song }) {
  // song corresponds to one object in sunoData array
  
  return (
    <div className="glass-panel song-card">
      <div className="song-image-container">
        {song.imageUrl ? (
          <img src={song.imageUrl} alt={song.title || 'Song Cover'} className="song-image" />
        ) : (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)' }}>
            <Music size={64} opacity={0.2} />
          </div>
        )}
      </div>
      
      <div className="song-info">
        <h3 className="song-title">{song.title || 'Untitled Track'}</h3>
        {song.tags && <span className="song-tags">{song.tags}</span>}
        
        <audio controls src={song.streamAudioUrl || song.audioUrl}>
          Your browser does not support the audio element.
        </audio>
        
        {song.prompt && (
          <div className="lyrics-container">
            {song.prompt}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <a 
            href={song.audioUrl || song.streamAudioUrl} 
            download={`${song.title || 'suno-song'}.mp3`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-download"
          >
            <Download size={16} />
            Download MP3
          </a>
        </div>
      </div>
    </div>
  );
}
