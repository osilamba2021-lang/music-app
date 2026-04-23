import React, { useState, useEffect } from 'react';
import MusicForm from './components/MusicForm';
import StatusDisplay from './components/StatusDisplay';
import SongCard from './components/SongCard';
import { generateMusic, getTaskDetails } from './services/sunoApi';

export default function App() {
  const [taskId, setTaskId] = useState(null);
  const [status, setStatus] = useState(null); // 'PENDING', 'SUCCESS', etc.
  const [songs, setSongs] = useState([]);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState(null);

  // Poll for status when taskId is present and not complete
  useEffect(() => {
    let intervalId;

    const pollStatus = async () => {
      if (!taskId) return;

      try {
        const data = await getTaskDetails(taskId);
        setStatus(data.status);
        
        // If success, store songs and stop polling
        if (data.status === 'SUCCESS' && data.response?.sunoData) {
          setSongs(data.response.sunoData);
          setIsPolling(false);
        } else if (['CREATE_TASK_FAILED', 'GENERATE_AUDIO_FAILED', 'CALLBACK_EXCEPTION', 'SENSITIVE_WORD_ERROR'].includes(data.status)) {
          setIsPolling(false);
          setError(`Task failed with status: ${data.status}`);
        }
      } catch (err) {
        console.error('Polling error:', err);
        // Don't stop polling on a single network error, but handle persistent errors if needed
      }
    };

    if (isPolling && taskId) {
      // Poll immediately once, then every 5 seconds
      pollStatus();
      intervalId = setInterval(pollStatus, 5000);
    }

    return () => clearInterval(intervalId);
  }, [taskId, isPolling]);

  const handleGenerate = async ({ prompt, model, instrumental }) => {
    setError(null);
    setSongs([]);
    setStatus('PENDING');
    
    try {
      const newTaskId = await generateMusic(prompt, model, instrumental);
      setTaskId(newTaskId);
      setIsPolling(true);
    } catch (err) {
      setError(err.message || 'An error occurred while generating music.');
      setStatus(null);
    }
  };

  return (
    <div className="app-container">
      <div className="jukebox-chassis">
        <header className="jukebox-header">
          <h1>Vintage Suno</h1>
          <p>Drop a coin and generate incredible songs in seconds.</p>
        </header>

        <div className="jukebox-control-panel form-wrapper">
          <MusicForm 
            onSubmit={handleGenerate} 
            isLoading={isPolling || status === 'PENDING'} 
          />
        </div>

        {error && (
          <div className="jukebox-error">
            <p>{error}</p>
          </div>
        )}

        {isPolling && <StatusDisplay status={status} />}

        {songs.length > 0 && (
          <div className="results-section">
            <h2 className="results-title">Now Playing</h2>
            <div className="results-grid">
              {songs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
