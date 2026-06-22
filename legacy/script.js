// --- DYNAMIC DATA OBJECT (Default Fallback) ---
const defaultData = {
  name: "Saniya",
  heroHeading: "babuiii ek chiz dikhau dekhoge aap?",
  romanticAudio: "romantic.mp3",
  birthdayAudio: "birthday.mp3",
  birthdayText: "Happy Birthday ❤️",
  letter: [
    "Pata hai, kabhi kabhi lagta hai life kitni simple thi… phir tum aaye aur sab kuch special ban gaya. Tum sirf ek insaan nahi ho mere liye… tum meri <span class=\"highlight\">aadat</span> ban gaye ho, meri smile ka reason ho, aur mera safe place bhi.",
    "Mere <span class=\"highlight\">babuu</span>… jab bhi tum mujhe hasate ho na, lagta hai duniya ki saari tension khatam ho gayi. Aur mera cute sa <span class=\"highlight\">babuii</span>, tumhari choti choti baatein hi meri sabse badi khushi hain.",
    "Mere <span class=\"highlight\">januu</span>, tumhare bina sab adhura lagta hai… sach me. Aur haan, mera pyara sa <span class=\"highlight\">baccha</span>, tum khud nahi jaante kitne special ho mere liye.",
    "<span class=\"highlight\" style=\"font-size: 1.5rem\">I love you…</span> hamesha ❤️"
  ],
  images: [
    { src: "pic1.jpg", caption: "My favorite moment with you ❤️", isFavorite: true },
    { src: "pic2.jpg", caption: "Our first memory ❤️", isFavorite: false },
    { src: "pic3.jpg", caption: "You + Me = Forever 💕", isFavorite: false }
  ],
  reasons: [
    { front: "Your smile 😊", back: "Because it makes even my worst days feel like a dream.", special: false },
    { front: "Your anger 😂", back: "Even when you're 'angry', you look the absolute cutest.", special: false },
    { front: "The way you care", back: "You look after me in ways I didn't even know I needed.", special: false },
    { front: "How you understand me", back: "I don't even have to say a word, and you already know.", special: false },
    { front: "The way you stay", back: "Through every high and low, you are my constant.", special: false },
    { front: "Because you are YOU ❤️", back: "I love you... simply because there's no one else like you.", special: true }
  ],
  noButtonMessages: ["Nhi dekhoge aap?", "Gandi baat 😒", "YES Click kro n!", "Motuuu plz 😂" , "nhi kr rhe aap click" , "chalo fir pakad ke dikhao" , "dikhao dikhao.."],
  letterIntro: "Happy Birthday meri jaan ❤️",
  vowText: "No matter what...<br />I’ll always choose you ❤️"
};

const firebaseConfig = {
  apiKey: "AIzaSyCO4UywUXpi6nAgUcs7zRCXOGzAVSpe88o",
  authDomain: "birthday-website-fc974.firebaseapp.com",
  databaseURL: "https://birthday-website-fc974-default-rtdb.firebaseio.com",
  projectId: "birthday-website-fc974",
  storageBucket: "birthday-website-fc974.firebasestorage.app",
  messagingSenderId: "343976486142",
  appId: "1:343976486142:web:a980a2cab267e8ce2671af"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let userData = defaultData;

/* --- DOM ELEMENTS --- */
const noBtn = document.getElementById('no-btn');
const romanticAudio = document.getElementById('romantic-audio');
const bdaySong = document.getElementById('birthday-song');

let msgIdx = 0;

function applyData(data) {
  try {
    const heading = document.getElementById("hero-heading");
    if (heading) {
      heading.innerText = data.heroHeading || "Something special for you ❤️";
    }
  } catch(e) {
    console.error("Error setting heading:", e);
  }

  // SHOW BUTTONS NO MATTER WHAT
  try {
    const yesBtn = document.getElementById("yes-btn");
    const noBtn = document.getElementById("no-btn");
    if (yesBtn) yesBtn.style.display = "inline-block";
    if (noBtn) noBtn.style.display = "inline-block";
  } catch(e) {
    console.error("Error showing buttons:", e);
  }
}

function fallbackData() {
  try {
    const local = localStorage.getItem("birthdayData");
    if (local) {
      userData = JSON.parse(local);
    } else {
      userData = defaultData;
    }
  } catch (e) {
    console.error("localStorage failed, using defaultData", e);
    userData = defaultData;
  }
  
  initAppUI();
  applyData(userData);
}

function loadWebsiteData() {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (id) {
      db.ref("websites/" + id).once("value")
      .then(snapshot => {
        const data = snapshot.val();
        if (data) {
          userData = data;
          initAppUI();
          applyData(userData);
        } else {
          console.log("No data found");
          fallbackData();
        }
      }).catch(error => {
        console.error("Firebase failed:", error);
        fallbackData();
      });
    } else {
      fallbackData();
    }
  } catch (e) {
    console.error("Critical error loading data:", e);
    fallbackData();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadWebsiteData();
});

function initAppUI() {
    try {
        // Audio sources assignment
        document.getElementById("romantic-audio").src = userData.romanticAudio || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
        romanticAudio.onerror = () => {
            console.log("Audio failed, using fallback");
            document.getElementById("romantic-audio").src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
        };

        document.getElementById("birthday-song").src = userData.birthdayAudio || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";
        bdaySong.onerror = () => {
            console.log("Audio failed, using fallback");
            document.getElementById("birthday-song").src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";
        };

        // Pre-load images to avoid layout shifts later
        if(userData.images) {
            userData.images.forEach(imgData => {
                const img = new Image();
                img.onerror = function() {
                  this.src = "https://via.placeholder.com/300x400?text=Memory";
                  imgData.src = this.src; // safe fallback for gallery
                };
                img.src = imgData.src;
            });
        }
    } catch (e) {
        console.error("Error in initAppUI:", e);
    }
}

/* --- INTERACTIVE NO BUTTON --- */
function moveNo() {
  noBtn.classList.add('moving');
  noBtn.innerText = userData.noButtonMessages[msgIdx];
  msgIdx = (msgIdx + 1) % userData.noButtonMessages.length;
  
  const maxX = window.innerWidth - noBtn.offsetWidth - 20;
  const maxY = window.innerHeight - noBtn.offsetHeight - 20;
  
  noBtn.style.left = Math.max(20, Math.random() * maxX) + 'px';
  noBtn.style.top = Math.max(20, Math.random() * maxY) + 'px';
}
noBtn.addEventListener('mouseover', moveNo);
noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNo(); }, {passive: false});

/* --- LOADING & TRANSITIONS --- */
function startLoading() {
  const landing = document.getElementById('landing-screen');
  const loading = document.getElementById('loading-screen');
  
  landing.style.opacity = '0';
  setTimeout(() => {
    landing.style.display = 'none';
    loading.style.display = 'flex';
    romanticAudio.play().catch(e => console.log('Audio play ignored prior to interaction'));
    
    setTimeout(() => {
      loading.style.opacity = '1'; // original fading behavior
    }, 50);

    setTimeout(() => {
      loading.style.opacity = '0';
      setTimeout(() => {
        loading.style.display = 'none';
        startSurprise();
      }, 1000);
    }, 3000);
  }, 500);
}

/* --- CAKE & TYPING EFFECT --- */
function startSurprise() {
  const surprise = document.getElementById('final-surprise');
  surprise.style.display = 'block'; // restored to block
  setTimeout(() => { 
    surprise.style.opacity = '1'; 
    typeMessage(userData.birthdayText);
  }, 100);
}

function typeMessage(text) {
  let i = 0; 
  const target = document.getElementById('typed-text');
  
  function type() {
    if (i < text.length) {
      target.innerHTML += text.charAt(i); 
      i++;
      setTimeout(type, 150); // Original timing
    } else { 
      // Add name glow at the end
      setTimeout(() => {
        target.innerHTML += ` <span class="name-glow">${userData.name}</span>`;
        setTimeout(showCake, 1000); 
      }, 100);
    }
  }
  type();
}

function showCake() {
  const c = document.getElementById('cake-container');
  c.style.display = 'block';
  setTimeout(() => {
      c.style.opacity = '1'; 
      c.style.transform = 'scale(1)'; 
      injectCandles();
  }, 100);
}

function injectCandles() {
  const g = document.getElementById('candles-group');
  [-30, 0, 30].forEach((p, idx) => {
    const can = document.createElement('div'); 
    can.className = 'candle';
    can.style.left = `calc(50% + ${p}px)`;
    
    const f = document.createElement('div'); 
    f.className = 'flame';
    
    can.appendChild(f); 
    g.appendChild(can);
    
    setTimeout(() => { 
      can.style.transform = 'scale(1)';
      setTimeout(() => f.style.opacity = '1', 500);
    }, idx * 300);
  });
  
  setTimeout(() => {
    const action = document.getElementById('action-container');
    action.style.display = 'block';
    setTimeout(() => action.style.opacity = '1', 50);
  }, 1500);
}

function blowCandles() {
  document.querySelectorAll('.flame').forEach(f => f.style.opacity = '0');
  romanticAudio.pause();
  
  setTimeout(() => {
    bdaySong.currentTime = 21; // skip intro if requested, but works generally
    bdaySong.play().catch(e => console.log('Audio blocked'));
    startBalloons();
  }, 500);
}

/* --- BALLOONS & CELEBRATION --- */
function startBalloons() {
  const colors = ['#ffd6e8', '#e6ccff', '#ffe5d9']; // Original pastel colors
  
  const balloonInterval = setInterval(() => {
    const b = document.createElement('div'); 
    b.className = 'balloon';
    b.style.left = Math.random() * 100 + 'vw';
    b.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    b.style.width = b.style.height = (Math.random() * 30 + 30) + 'px';
    b.style.animationDuration = (Math.random() * 5 + 5) + 's';
    
    document.getElementById('balloon-container').appendChild(b);
  }, 600);

  // Stop spawning after a while to prevent overlay lag if they stay long
  setTimeout(() => clearInterval(balloonInterval), 15000);

  setTimeout(() => {
    const entry = document.getElementById('letter-entry');
    entry.style.display = 'flex';
    setTimeout(() => entry.style.opacity = '1', 50);
    entry.onclick = startLetter;
    
    // Stop birthday song when letter entry appears as requested
    try {
        if(bdaySong) {
            bdaySong.pause();
            bdaySong.currentTime = 0;
        }
    } catch(e) {}
  }, 10000);
}

/* --- LOVE LETTER --- */
function startLetter() {
  document.getElementById('letter-entry').style.display = 'none';
  document.getElementById('final-surprise').style.display = 'none';
  
  const letterSec = document.getElementById('love-letter-section');
  letterSec.style.display = 'block'; // Original used block
  
  // Inject dynamic paragraphs
  const scrollContent = document.getElementById('scroll-content');
  
  let parasHTML = '';
  // Convert line breaks and array properly
  let rawLetter = userData.letter || [];
  let paragraphs = Array.isArray(rawLetter) ? rawLetter : String(rawLetter).split('\n');
  paragraphs.forEach(para => {
    if(para.trim().length > 0)
        parasHTML += `<p class="letter-para">${para}</p>`;
  });
  parasHTML += `<button class="btn btn-yes" style="width: 100%; margin-top: 20px" onclick="goToGallery()">View Our Memories ✨</button>`;
  
  scrollContent.innerHTML = parasHTML;

  typeLetterIntro();
}

function typeLetterIntro() {
  let text = userData.letterIntro;
  let i = 0;
  const target = document.getElementById('letter-line1');
  
  function typeLine() {
    if (i < text.length) {
      target.innerHTML += text.charAt(i);
      i++; 
      setTimeout(typeLine, 100);
    } else { 
      initScrollReveal(); 
    }
  }
  typeLine();
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { 
      if (e.isIntersecting) e.target.classList.add('reveal'); 
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.letter-para').forEach(p => observer.observe(p));
}

/* --- GALLERY --- */
function goToGallery() {
    document.getElementById('love-letter-section').style.display = 'none';
    const memorySec = document.getElementById('memories-section');
    memorySec.style.display = 'block';
    
    // Inject images dynamically
    const grid = document.getElementById('gallery-grid');
    grid.innerHTML = ''; // clear if any
    
    (userData.images || []).forEach(img => {
      const favClass = img.isFavorite ? 'favorite' : '';
      grid.innerHTML += `
        <div class="memory-card ${favClass}">
          <img src="${img.src}" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x400?text=Memory';" />
          <div class="card-caption">${img.caption || ''}</div>
        </div>
      `;
    });

    createSparkles();
}

function createSparkles() {
  setInterval(() => {
    const s = document.createElement('div'); 
    s.className = 'sparkle';
    s.innerText = ['✨', '💖', '🌸'][Math.floor(Math.random() * 3)];
    s.style.left = Math.random() * 100 + 'vw';
    s.style.top = '100vh';
    s.style.animationDuration = (Math.random() * 3 + 3) + 's';
    
    document.getElementById('sparkle-container').appendChild(s);
    setTimeout(() => s.remove(), 5000);
  }, 500);
}

/* --- REASONS SECTION --- */
function showReasons() {
    document.getElementById('memories-section').style.display = 'none';
    const reasonSec = document.getElementById('reasons-section');
    reasonSec.style.display = 'block';
    
    initReasons();
    window.scrollTo(0, 0);
}

function createHeartBurst(x, y) {
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
}

function initReasons() {
  const grid = document.getElementById('reasons-grid');
  grid.innerHTML = '';
  
  (userData.reasons || []).forEach((data, index) => {
    const card = document.createElement('div');
    card.className = `reason-card ${data.special ? 'special-card' : ''}`;
    card.innerHTML = `
      <div class="card-face card-front">${data.front}</div>
      <div class="card-face card-back">${data.back}</div>
    `;
    
    card.onclick = (e) => {
      const isFlipping = !card.classList.contains('is-flipped');
      card.classList.toggle('is-flipped');
      if (isFlipping) {
        createHeartBurst(e.clientX || (e.touches && e.touches[0].clientX) || window.innerWidth/2, 
                         e.clientY || (e.touches && e.touches[0].clientY) || window.innerHeight/2);
      }
    };
    grid.appendChild(card);
    
    // Staggered reveal
    setTimeout(() => card.classList.add('reveal'), 500 + (index * 300));
  });
  
  setTimeout(() => {
    document.getElementById('final-text').style.opacity = "1";
    document.getElementById('umh-extension').style.opacity = "1";
  }, 500 + (userData.reasons.length * 300) + 1000);
}

/* --- UNLOCK MY HEART MODULAR LOGIC --- */
(function() {
  const btn = document.getElementById('umh-main-btn');
  const ring = document.getElementById('umh-ring-circle');
  const status = document.getElementById('umh-status-text');
  const overlay = document.getElementById('umh-secret-overlay');
  
  let holdTimer;
  let progress = 0;
  const holdDuration = 2500; 
  const interval = 50; 
  const step = (interval / holdDuration) * 100;

  function startHold(e) {
    if(e.cancelable) e.preventDefault();
    if(progress >= 100) return;
    
    holdTimer = setInterval(() => {
      progress += step;
      if (progress >= 100) {
        progress = 100;
        clearInterval(holdTimer);
        umhTriggerUnlock();
      }
      updateRing(progress);
      status.innerText = "Wait... don’t rush ❤️";
      status.style.color = "#ff75a0";
    }, interval);
  }

  function endHold() {
    clearInterval(holdTimer);
    
    if (progress < 100) {
      progress = 0;
      updateRing(0);
      status.innerText = "Press and hold to reveal a secret...";
      status.style.color = "#a389f4";
    }
  }

  function updateRing(perc) {
    const offset = 440 - (perc / 100) * 440;
    ring.style.strokeDashoffset = offset;
  }

  btn.addEventListener('mousedown', startHold);
  btn.addEventListener('touchstart', startHold, {passive: false});
  window.addEventListener('mouseup', endHold);
  window.addEventListener('touchend', endHold);

  const secretMessages = [
    { type: 'type', text: "I don’t say this often..." },
    { type: 'fade', text: "But you mean everything to me 💕" },
    { type: 'fade', text: "You’re my peace, my chaos, my happiness..." },
    { type: 'fade', text: "And honestly… I’m lucky to have you 💫" }
  ];

  function umhTriggerUnlock() {
    btn.style.opacity = '0';
    btn.style.pointerEvents = 'none';
    
    overlay.style.display = 'flex';
    setTimeout(() => overlay.style.opacity = '1', 50);
    
    umhRunSequence();
  }

  async function umhRunSequence() {
    const display = document.getElementById('umh-message-sequence');
    display.innerHTML = "";
    
    for (let i = 0; i < secretMessages.length; i++) {
      const msg = secretMessages[i];
      if (msg.type === 'type') {
        await typeEffect(display, msg.text);
      } else {
        display.innerHTML = `<p class="umh-fade-up">${msg.text}</p>`;
      }
      await new Promise(r => setTimeout(r, 2500));
    }

    display.innerHTML = "";
    document.getElementById('umh-interaction-ui').style.display = 'flex';
  }

  function typeEffect(element, text) {
    return new Promise(resolve => {
      let i = 0;
      element.innerHTML = "";
      const timer = setInterval(() => {
        element.innerHTML += text.charAt(i);
        i++;
        if (i >= text.length) {
          clearInterval(timer);
          resolve();
        }
      }, 80);
    });
  }

  window.umhReact = function(type) {
    document.getElementById('umh-interaction-ui').style.display = 'none';
    const vow = document.getElementById('umh-final-vow');
    
    vow.innerHTML = userData.vowText;
    vow.style.display = 'block';
    vow.classList.add('umh-fade-up');
    
    createHeartBurst(window.innerWidth/2, window.innerHeight/2);
    
    setTimeout(() => {
      document.getElementById('umh-replay-btn').style.display = 'inline-block';
    }, 2000);
  };

  window.umhResetSequence = function() {
    document.getElementById('umh-final-vow').style.display = 'none';
    document.getElementById('umh-replay-btn').style.display = 'none';
    umhRunSequence();
  };

})();
