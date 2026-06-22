import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataProvider';

export default function Memories({ visible, onNext }) {
  const { data } = useData();
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    if (visible) {
      const interval = setInterval(() => {
        const id = Date.now() + Math.random();
        const emoji = ['✨', '💖', '🌸'][Math.floor(Math.random() * 3)];
        const left = Math.random() * 100 + 'vw';
        const duration = (Math.random() * 3 + 3) + 's';
        
        setSparkles(prev => [...prev.slice(-20), { id, emoji, left, duration }]);
        
        setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== id));
        }, 5000);
      }, 500);

      return () => clearInterval(interval);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <section id="memories-section" style={{ display: 'block' }}>
      <div id="sparkle-container">
        {sparkles.map(s => (
          <div 
            key={s.id} 
            className="sparkle" 
            style={{ 
              left: s.left, 
              top: '100vh', 
              animationDuration: s.duration 
            }}
          >
            {s.emoji}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2 className="gallery-title" style={{
          fontFamily: '"Parisienne"',
          fontSize: '3rem',
          color: '#ff99cc'
        }}>
          Our Beautiful Memories
        </h2>
        <p style={{ color: '#b3a2c7' }}>Every moment with you is a treasure.</p>
      </div>

      <div className="gallery-grid" id="gallery-grid">
        {(data?.images || []).map((img, idx) => (
          <div key={idx} className={`memory-card ${img.isFavorite ? 'favorite' : ''}`}>
            <img 
              src={img.src} 
              alt={img.caption}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x400?text=Memory';
              }} 
            />
            <div className="card-caption">{img.caption || ''}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', padding: '50px' }}>
        <button className="btn btn-yes" onClick={onNext}>
          Next Surprise ✨
        </button>
      </div>
    </section>
  );
}
