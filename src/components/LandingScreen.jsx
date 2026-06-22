import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataProvider';

export default function LandingScreen({ onStart, visible, style }) {
  const { data } = useData();
  const [noBtnStyle, setNoBtnStyle] = useState({ display: 'inline-block' });
  const [msgIdx, setMsgIdx] = useState(0);

  const moveNo = () => {
    if (!data) return;
    const messages = data.noButtonMessages || ["No"];
    const text = messages[msgIdx % messages.length];
    setMsgIdx(prev => prev + 1);

    const maxX = window.innerWidth - 100 - 20; // safe arbitrary width since ref might not be available yet
    const maxY = window.innerHeight - 50 - 20;

    setNoBtnStyle({
      position: 'absolute',
      display: 'inline-block',
      left: Math.max(20, Math.random() * maxX) + 'px',
      top: Math.max(20, Math.random() * maxY) + 'px',
    });
    
    // We update text via DOM interaction since we need the class added for styling or we can just rely on React
  };

  if (!visible) return null;

  return (
    <main className="wrapper" id="landing-screen" style={style}>
      <h1 className="heading" id="hero-heading">
        {data?.heroHeading || "Something special for you ❤️"}
      </h1>
      <div className="btn-container">
        <button 
          className="btn btn-yes" 
          id="yes-btn" 
          onClick={onStart}
          style={{ display: 'inline-block' }}
        >
          YES
        </button>
        <button 
          className="btn btn-no moving" 
          id="no-btn"
          style={noBtnStyle}
          onMouseOver={moveNo}
          onTouchStart={(e) => { e.preventDefault(); moveNo(); }}
        >
          {data?.noButtonMessages ? data.noButtonMessages[(msgIdx === 0 ? 0 : msgIdx - 1) % data.noButtonMessages.length] : "NO"}
        </button>
      </div>
    </main>
  );
}
