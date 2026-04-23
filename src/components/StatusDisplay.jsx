import React from 'react';

export default function StatusDisplay({ status }) {
  // PENDING, TEXT_SUCCESS, FIRST_SUCCESS, SUCCESS, etc.
  
  const getStatusText = () => {
    switch(status) {
      case 'PENDING':
        return 'Warming up the AI...';
      case 'TEXT_SUCCESS':
        return 'Writing the lyrics...';
      case 'FIRST_SUCCESS':
        return 'Composing the first track...';
      case 'SUCCESS':
        return 'Your music is ready!';
      case 'CREATE_TASK_FAILED':
      case 'GENERATE_AUDIO_FAILED':
      case 'CALLBACK_EXCEPTION':
      case 'SENSITIVE_WORD_ERROR':
        return 'Generation failed. Please try again.';
      default:
        return 'Generating your masterpiece...';
    }
  };

  const isError = ['CREATE_TASK_FAILED', 'GENERATE_AUDIO_FAILED', 'CALLBACK_EXCEPTION', 'SENSITIVE_WORD_ERROR'].includes(status);
  const isComplete = status === 'SUCCESS';

  if (isError) {
    return (
      <div className="glass-panel status-display" style={{ borderColor: 'var(--danger-color)' }}>
        <h3 style={{ color: 'var(--danger-color)' }}>{getStatusText()}</h3>
      </div>
    );
  }

  if (isComplete) {
    return null; // Don't show loader when complete
  }

  return (
    <div className="glass-panel status-display">
      <div className="loader"></div>
      <h3 className="status-text">{getStatusText()}</h3>
      <p style={{ color: 'var(--text-secondary)' }}>
        This usually takes about 30-40 seconds.
      </p>
    </div>
  );
}
