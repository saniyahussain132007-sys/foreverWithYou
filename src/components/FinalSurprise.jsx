import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataProvider';

export default function FinalSurprise({ visible, onComplete }) {
  const { data } = useData();
  const [typedTextHTML, setTypedTextHTML] = useState('');
  const [showCake, setShowCake] = useState(false);
  const [cakeOpacity, setCakeOpacity] = useState(0);
  const [cakeScale, setCakeScale] = useState(0);
  const [candles, setCandles] = useState([]);
  const [showAction, setShowAction] = useState(false);
  const [actionOpacity, setActionOpacity] = useState(0);
  const [candlesBlown, setCandlesBlown] = useState(false);
  
  // Track this locally because we only want to run it once when become visible
  const didRunRef = useRef(false);

  useEffect(() => {
    if (visible && !didRunRef.current && data) {
      didRunRef.current = true;
      
      const text = data.birthdayText || "Happy Birthday ❤️";
      let i = 0;
      let currentHTML = '';
      
      const type = () => {
        if (i < text.length) {
          currentHTML += text.charAt(i);
          setTypedTextHTML(currentHTML);
          i++;
          setTimeout(type, 150);
        } else {
          setTimeout(() => {
            currentHTML += ` <span class="name-glow">${data.name}</span>`;
            setTypedTextHTML(currentHTML);
            setTimeout(triggerShowCake, 1000);
          }, 100);
        }
      };
      
      setTimeout(type, 100); // initial delay before typing starts based on original script
    }
  }, [visible, data]);

  const triggerShowCake = () => {
    setShowCake(true);
    setTimeout(() => {
      setCakeOpacity(1);
      setCakeScale(1);
      injectCandles();
    }, 100);
  };

  const injectCandles = () => {
    const candlePositions = [-30, 0, 30];
    const initialCandles = candlePositions.map((p, idx) => ({
      id: idx,
      pos: `calc(50% + ${p}px)`,
      scale: 0,
      flameOpacity: 0
    }));

    setCandles(initialCandles);

    initialCandles.forEach((c, idx) => {
      setTimeout(() => {
        setCandles(prev => prev.map(item => 
          item.id === c.id ? { ...item, scale: 1 } : item
        ));
        setTimeout(() => {
          setCandles(prev => prev.map(item => 
            item.id === c.id ? { ...item, flameOpacity: 1 } : item
          ));
        }, 500);
      }, idx * 300);
    });

    setTimeout(() => {
      setShowAction(true);
      setTimeout(() => setActionOpacity(1), 50);
    }, 1500);
  };

  const blowCandles = () => {
    setCandles(prev => prev.map(c => ({ ...c, flameOpacity: 0 })));
    setCandlesBlown(true);
    
    // In React, we pass the "done" event up to the main orchestrator so it can play the new song and move to next stage (balloons)
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 500);
  };

  if (!visible) return null;

  return (
    <section id="final-surprise" className="wrapper" style={{ display: 'block', opacity: 1 }}>
      <div id="typing-container" className="typing-box">
        <span id="typed-text" dangerouslySetInnerHTML={{ __html: typedTextHTML }}></span>
        <span className="cursor"></span>
      </div>
      
      <div id="cake-container" className="cake-wrapper" style={{ display: showCake ? 'block' : 'none', opacity: cakeOpacity, transform: `scale(${cakeScale})` }}>
        <div className="layer layer-bottom"></div>
        <div className="layer layer-top"></div>
        <div className="icing"></div>
        <div id="candles-group">
          {candles.map((c) => (
            <div key={c.id} className="candle" style={{ left: c.pos, transform: `scale(${c.scale})` }}>
              <div className="flame" style={{ opacity: candlesBlown ? 0 : c.flameOpacity }}></div>
            </div>
          ))}
        </div>
      </div>

      <div id="action-container" style={{ display: showAction ? 'block' : 'none', marginTop: '30px', opacity: actionOpacity, transition: '1s' }}>
        <button className="btn btn-yes" onClick={blowCandles}>
          Blow Candles 🎂
        </button>
      </div>
    </section>
  );
}
