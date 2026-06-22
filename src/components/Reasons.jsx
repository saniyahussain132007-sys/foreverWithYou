import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataProvider';

export default function Reasons({ visible }) {
  const { data } = useData();
  const [revealedCards, setRevealedCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  const [showFinalText, setShowFinalText] = useState(false);
  const [progress, setProgress] = useState(0);
  const [holdTimer, setHoldTimer] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [secretIdx, setSecretIdx] = useState(0);
  const [interactionVisible, setInteractionVisible] = useState(false);
  const [finalVowVisible, setFinalVowVisible] = useState(false);
  const [replayBtnVisible, setReplayBtnVisible] = useState(false);
  const [currentSecretText, setCurrentSecretText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const secretMessages = [
    { type: 'type', text: "I don’t say this often..." },
    { type: 'fade', text: "But you mean everything to me 💕" },
    { type: 'fade', text: "You’re my peace, my chaos, my happiness..." },
    { type: 'fade', text: "And honestly… I’m lucky to have you 💫" }
  ];

  useEffect(() => {
    if (visible && data) {
      const reasonsCount = (data.reasons || []).length;
      data.reasons.forEach((_, index) => {
        setTimeout(() => {
          setRevealedCards(prev => [...prev, index]);
        }, 500 + index * 300);
      });

      setTimeout(() => {
        setShowFinalText(true);
      }, 500 + reasonsCount * 300 + 1000);
    }
  }, [visible, data]);

  const createHeartBurst = (x, y) => {
    for (let i = 0; i < 6; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.innerText = ['❤️', '💖', '💕', '🌸'][Math.floor(Math.random() * 4)];
      const tx = (Math.random() - 0.5) * 200 + 'px';
      const ty = (Math.random() * -150) - 50 + 'px';
      const tr = (Math.random() * 90 - 45) + 'deg';
      
      heart.style.setProperty('--tx', tx);
      heart.style.setProperty('--ty', ty);
      heart.style.setProperty('--tr', tr);
      heart.style.left = x + 'px';
      heart.style.top = y + 'px';
      
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1000);
    }
  };

  const handleCardClick = (index, e) => {
    const isFlipping = !flippedCards[index];
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }));
    
    if (isFlipping) {
      const x = e.clientX || (e.touches && e.touches[0].clientX) || window.innerWidth / 2;
      const y = e.clientY || (e.touches && e.touches[0].clientY) || window.innerHeight / 2;
      createHeartBurst(x, y);
    }
  };

  const startHold = (e) => {
    if (e.cancelable) e.preventDefault();
    if (progress >= 100) return;

    const intervalTime = 50;
    const holdDuration = 2500;
    const step = (intervalTime / holdDuration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          triggerUnlock();
          return 100;
        }
        return next;
      });
    }, intervalTime);

    setHoldTimer(timer);
  };

  const endHold = () => {
    if (holdTimer) clearInterval(holdTimer);
    if (progress < 100) {
      setProgress(0);
    }
  };

  const triggerUnlock = () => {
    setUnlocked(true);
    setOverlayVisible(true);
    setTimeout(() => {
      setOverlayOpacity(1);
      runSequence();
    }, 50);
  };

  const runSequence = async () => {
    setInteractionVisible(false);
    setFinalVowVisible(false);
    setReplayBtnVisible(false);
    
    for (let i = 0; i < secretMessages.length; i++) {
      const msg = secretMessages[i];
      setSecretIdx(i);
      
      if (msg.type === 'type') {
        await typeEffect(msg.text);
      } else {
        setCurrentSecretText(msg.text);
      }
      await new Promise(r => setTimeout(r, 2500));
    }

    setCurrentSecretText('');
    setInteractionVisible(true);
  };

  const typeEffect = (text) => {
    return new Promise(resolve => {
      setIsTyping(true);
      let i = 0;
      setCurrentSecretText('');
      const timer = setInterval(() => {
        setCurrentSecretText(prev => prev + text.charAt(i));
        i++;
        if (i >= text.length) {
          clearInterval(timer);
          setIsTyping(false);
          resolve();
        }
      }, 80);
    });
  };

  const handleReact = (type) => {
    setInteractionVisible(false);
    setFinalVowVisible(true);
    createHeartBurst(window.innerWidth / 2, window.innerHeight / 2);
    setTimeout(() => {
      setReplayBtnVisible(true);
    }, 2000);
  };

  const resetSequence = () => {
    runSequence();
  };

  if (!visible) return null;

  const ringDashOffset = 440 - (progress / 100) * 440;

  return (
    <section id="reasons-section" style={{
      display: 'block',
      padding: '80px 20px',
      background: '#fffafc',
      minHeight: '100vh'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 className="heading" style={{ color: '#b03060', fontSize: '3rem' }}>
          Reasons I Love You ❤️
        </h2>
        <p style={{ color: '#a389f4', fontFamily: '"Poppins", sans-serif' }}>
          Tap each card to see why...
        </p>
      </div>

      <div className="reasons-grid" id="reasons-grid">
        {(data?.reasons || []).map((reason, idx) => (
          <div 
            key={idx}
            className={`reason-card ${reason.special ? 'special-card' : ''} ${revealedCards.includes(idx) ? 'reveal' : ''} ${flippedCards[idx] ? 'is-flipped' : ''}`}
            onClick={(e) => handleCardClick(idx, e)}
          >
            <div className="card-face card-front">{reason.front}</div>
            <div className="card-face card-back">{reason.back}</div>
          </div>
        ))}
      </div>

      <div id="final-text" style={{
        opacity: showFinalText ? 1 : 0,
        textAlign: 'center',
        marginTop: '60px',
        paddingBottom: '20px',
        transition: '2s'
      }}>
        <h3 style={{
          fontFamily: '"Parisienne", cursive',
          fontSize: '2.5rem',
          color: '#ff75a0'
        }}>
          And these are just a few… <br />
          I could go on forever ❤️
        </h3>
      </div>

      <section id="umh-extension" className="umh-section-wrapper" style={{ 
        paddingBottom: '0px',
        opacity: showFinalText ? 1 : 0,
        transition: '2s'
      }}>
        <div className="umh-hold-container">
          <svg className="umh-progress-ring" width="160" height="160">
            <circle 
              id="umh-ring-circle" 
              stroke="#ff75a0" 
              strokeWidth="8" 
              fill="transparent" 
              r="70" 
              cx="80" 
              cy="80" 
              style={{ strokeDashoffset: ringDashOffset }}
            />
          </svg>
          <button 
            id="umh-main-btn" 
            className="umh-btn-premium"
            style={{ opacity: unlocked ? 0 : 1, pointerEvents: unlocked ? 'none' : 'auto' }}
            onMouseDown={startHold}
            onTouchStart={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchEnd={endHold}
          >
            Unlock My Heart 💜
          </button>
        </div>
        {!unlocked && (
          <p id="umh-status-text" className="umh-instruction" style={{ color: progress > 0 ? '#ff75a0' : '#a389f4' }}>
            {progress > 0 ? "Wait... don’t rush ❤️" : "Press and hold to reveal a secret..."}
          </p>
        )}
      </section>

      {overlayVisible && (
        <div id="umh-secret-overlay" className="umh-overlay" style={{ display: 'flex', opacity: overlayOpacity }}>
          <div className="umh-content-box">
            <div id="umh-message-sequence" className="umh-text-display">
              {currentSecretText && (
                secretMessages[secretIdx].type === 'type' ? (
                  currentSecretText
                ) : (
                  <p className="umh-fade-up">{currentSecretText}</p>
                )
              )}
            </div>

            <div className="umh-interaction-card">
                <p className="umh-interaction-text">Did this make you cry?</p>
                <div className="umh-react-buttons">
                  <button className="umh-react-btn" onClick={() => handleReact('smile')}>Smile? 😊</button>
                  <button className="umh-react-btn" onClick={() => handleReact('cry')}>Cry a little? 😭</button>
                </div>
              </div>

            {finalVowVisible && (
              <div 
                id="umh-final-vow" 
                className="umh-vow-text umh-fade-up" 
                style={{ display: 'block' }}
                dangerouslySetInnerHTML={{ __html: data?.vowText }}
              ></div>
            )}

            {replayBtnVisible && (
              <button 
                id="umh-replay-btn" 
                style={{
                  display: 'inline-block',
                  background: 'none',
                  border: 'none',
                  color: '#a389f4',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  marginTop: '30px'
                }} 
                onClick={resetSequence}
              >
                Read it again 💌
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
