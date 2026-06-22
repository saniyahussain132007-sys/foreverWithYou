import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataProvider';

export default function LoveLetter({ visible, onNext }) {
  const { data } = useData();
  const [typedIntro, setTypedIntro] = useState('');
  const [showContent, setShowContent] = useState(false);
  const contentRef = useRef(null);
  const didRunRef = useRef(false);

  useEffect(() => {
    if (visible && !didRunRef.current && data) {
      didRunRef.current = true;
      
      const text = data.letterIntro || "Happy Birthday meri jaan ❤️";
      let i = 0;
      
      const typeLine = () => {
        if (i < text.length) {
          setTypedIntro(prev => prev + text.charAt(i));
          i++;
          setTimeout(typeLine, 100);
        } else {
          setShowContent(true);
        }
      };
      
      setTimeout(typeLine, 500);
    }
  }, [visible, data]);

  useEffect(() => {
    if (showContent) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add('reveal');
        });
      }, { threshold: 0.1 });

      const paragraphs = document.querySelectorAll('.letter-para');
      paragraphs.forEach(p => observer.observe(p));

      return () => observer.disconnect();
    }
  }, [showContent]);

  if (!visible) return null;

  const rawLetter = data?.letter || [];
  const paragraphs = Array.isArray(rawLetter) ? rawLetter : String(rawLetter).split('\n');

  return (
    <section id="love-letter-section" className="letter-wrapper" style={{ display: 'block' }}>
      <div className="letter-container">
        <h2 className="heading" style={{ fontSize: '2.5rem', textAlign: 'center' }}>
          A Letter Just For You… 💌
        </h2>
        <p id="letter-line1" style={{
          fontWeight: 600,
          fontSize: '1.2rem',
          marginBottom: '20px',
          color: 'var(--accent-text)',
          minHeight: '1.5em'
        }}>
          {typedIntro}
        </p>
        <div id="scroll-content">
          {showContent && paragraphs.map((para, idx) => (
            para.trim().length > 0 && (
              <p 
                key={idx} 
                className="letter-para" 
                dangerouslySetInnerHTML={{ __html: para }}
              ></p>
            )
          ))}
          {showContent && (
            <button 
              className="btn btn-yes" 
              style={{ width: '100%', marginTop: '20px' }} 
              onClick={onNext}
            >
              View Our Memories ✨
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
