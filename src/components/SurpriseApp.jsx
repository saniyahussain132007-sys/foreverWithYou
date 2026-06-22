import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataProvider';
import LandingScreen from './LandingScreen';
import FinalSurprise from './FinalSurprise';
import LoveLetter from './LoveLetter';
import Memories from './Memories';
import Reasons from './Reasons';

export default function SurpriseApp() {
  const { data, loading } = useData();
  const [stage, setStage] = useState('landing'); // landing, loading, surprise, letter, memories, reasons
  const [stageStyle, setStageStyle] = useState({ opacity: 1 });
  
  const romanticAudioRef = useRef(null);
  const bdaySongRef = useRef(null);
  const balloonContainerRef = useRef(null);

  useEffect(() => {
    if (data) {
      // Audio sources assignment
      if (romanticAudioRef.current) {
        romanticAudioRef.current.src = data.romanticAudio || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
      }
      if (bdaySongRef.current) {
        bdaySongRef.current.src = data.birthdayAudio || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";
      }
    }
  }, [data]);

  const handleStart = () => {
    setStageStyle({ opacity: 0, transition: '0.5s' });
    setTimeout(() => {
      setStage('loading');
      setStageStyle({ opacity: 0 });
      romanticAudioRef.current.play().catch(e => console.log('Audio play ignored'));
      
      setTimeout(() => {
        setStageStyle({ opacity: 1, transition: '1s' });
      }, 50);

      setTimeout(() => {
        setStageStyle({ opacity: 0, transition: '1s' });
        setTimeout(() => {
          setStage('surprise');
          setStageStyle({ opacity: 1 });
        }, 1000);
      }, 3000);
    }, 500);
  };

  const handleSurpriseComplete = () => {
    if (romanticAudioRef.current) romanticAudioRef.current.pause();
    if (bdaySongRef.current) {
      bdaySongRef.current.currentTime = 21;
      bdaySongRef.current.play().catch(e => console.log('Audio blocked'));
    }
    startBalloons();
  };

  const startBalloons = () => {
    const colors = ['#ffd6e8', '#e6ccff', '#ffe5d9'];
    const interval = setInterval(() => {
      if (!balloonContainerRef.current) return;
      const b = document.createElement('div');
      b.className = 'balloon';
      b.style.left = Math.random() * 100 + 'vw';
      b.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      b.style.width = b.style.height = (Math.random() * 30 + 30) + 'px';
      b.style.animationDuration = (Math.random() * 5 + 5) + 's';
      balloonContainerRef.current.appendChild(b);
    }, 600);

    setTimeout(() => clearInterval(interval), 15000);

    setTimeout(() => {
      setStage('letter-entry'); // Show the "Tap to continue" overlay
    }, 10000);
  };

  const handleLetterEntryClick = () => {
    if (bdaySongRef.current) {
      bdaySongRef.current.pause();
      bdaySongRef.current.currentTime = 0;
    }
    setStage('letter');
  };

  if (loading) return null;

  return (
    <div className="app-root">
      <audio id="romantic-audio" ref={romanticAudioRef} loop></audio>
      <audio id="birthday-song" ref={bdaySongRef} loop></audio>

      <div className="bg-canvas"></div>
      <div id="hearts-layer"></div>
      <div id="balloon-container" ref={balloonContainerRef}></div>
      <div id="sparkle-container"></div>

      {stage === 'landing' && (
        <LandingScreen 
          visible={true} 
          onStart={handleStart} 
          style={stageStyle} 
        />
      )}

      {stage === 'loading' && (
        <div id="loading-screen" style={{ display: 'flex', ...stageStyle }}>
          <h2 className="loading-text" style={{ color: 'var(--accent-text)' }}>
            Preparing your surprise… ❤️
          </h2>
        </div>
      )}

      {stage === 'surprise' && (
        <FinalSurprise 
          visible={true} 
          onComplete={handleSurpriseComplete} 
        />
      )}

      {stage === 'letter-entry' && (
        <div 
          id="letter-entry" 
          className="entry-overlay" 
          style={{ display: 'flex', opacity: 1 }}
          onClick={handleLetterEntryClick}
        >
          <p style={{ color: 'var(--accent-text)', fontSize: '1.5rem' }}>
            Tap to continue… 💌
          </p>
        </div>
      )}

      {stage === 'letter' && (
        <LoveLetter 
          visible={true} 
          onNext={() => setStage('memories')} 
        />
      )}

      {stage === 'memories' && (
        <Memories 
          visible={true} 
          onNext={() => setStage('reasons')} 
        />
      )}

      {stage === 'reasons' && (
        <Reasons visible={true} />
      )}
    </div>
  );
}
