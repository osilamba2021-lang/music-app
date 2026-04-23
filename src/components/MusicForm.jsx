import React, { useState } from 'react';
import { Music, Wand2 } from 'lucide-react';

export default function MusicForm({ onSubmit, isLoading }) {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('V5');
  const [instrumental, setInstrumental] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmit({ prompt, model, instrumental });
  };

  return (
    <div className="glass-panel">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="prompt">What's your song idea?</label>
          <textarea
            id="prompt"
            className="form-control"
            placeholder="E.g., A calm and relaxing piano track with soft melodies..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            maxLength={500}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="model">AI Model</label>
          <select
            id="model"
            className="form-control"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={isLoading}
          >
            <option value="V5">V5 (Latest, Superior Expression)</option>
            <option value="V5_5">V5_5 (Custom Voice)</option>
            <option value="V4_5PLUS">V4.5+ (Richer Sound)</option>
            <option value="V4_5ALL">V4.5-All (Better Structure)</option>
            <option value="V4_5">V4.5</option>
            <option value="V4">V4</option>
          </select>
        </div>

        <div className="form-group">
          <label>Options</label>
          <div 
            className="switch-container" 
            onClick={() => !isLoading && setInstrumental(!instrumental)}
          >
            <div className={`switch ${instrumental ? 'active' : ''}`}>
              <div className="switch-thumb"></div>
            </div>
            <span>Instrumental (No Lyrics)</span>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn-submit" 
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? (
            <>
              <div className="loader" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
              Generating...
            </>
          ) : (
            <>
              <Wand2 size={20} />
              Create Music
            </>
          )}
        </button>
      </form>
    </div>
  );
}
