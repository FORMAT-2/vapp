import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Music, VolumeX, Gift, Trophy, Star } from 'lucide-react';

// Combine all styles
const styles = `
  #root {
    width: 100%;  
    min-height: 100vh;
    margin: 0;
    padding: 0;
    background-color: white;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }

  @keyframes fall {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(360deg); opacity: 0.7; }
  }

  @keyframes heartBeat {
    0% { transform: scale(1); }
    15% { transform: scale(1.15); }
    30% { transform: scale(1); }
    45% { transform: scale(1.15); }
    60% { transform: scale(1); }
  }

  @keyframes messagePopup {
    0% { transform: scale(0); opacity: 0; }
    70% { transform: scale(1.1); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes giftAppear {
    0% { transform: translateY(20px) scale(0); opacity: 0; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
  }

  @keyframes slideIn {
    0% { transform: translateX(-100%); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }

  @keyframes bubbleFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(10deg); }
  }

  .message-popup {
    position: absolute;
    background: white;
    padding: 0.75rem 1.5rem;
    border-radius: 20px;
    box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
    color: #ff1493;
    font-weight: bold;
    animation: messagePopup 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    pointer-events: none;
    z-index: 1000;
  }

  .gift-box {
    animation: giftAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    cursor: pointer;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .gift-box:hover {
    transform: scale(1.1);
  }

  .wish-paper {
    background: linear-gradient(135deg, #fff9f9, #fff5f7);
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 90%;
    text-align: center;
    animation: messagePopup 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .heart-button {
    animation: heartBeat 2s infinite;
  }

  @keyframes scaleIn {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  .animate-float {
    animation: float 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    will-change: transform;
  }

  .animate-fall {
    animation: fall 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    will-change: transform;
  }

  .animate-scale {
    animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .heart {
    position: fixed;
    opacity: 0.3;
    color: #ff69b4;
  }

  .letter {
    background-color: #fff5f7;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    margin: 0 auto;
    transform-origin: top center;
    transition: transform 1.5s;
  }

  .button {
    background: linear-gradient(135deg, #ff69b4, #ff1493);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 9999px;
    border: none;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
    will-change: transform, box-shadow;
    backface-visibility: hidden;
    transform: translateZ(0);
  }

  .button:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4);
  }

  .button:active {
    transform: translateY(1px) scale(1.02);
  }

  .screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    position: relative;
  }

  .photo-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding: 1rem;
    max-width: 800px;
    width: 100%;
  }

  .photo-card {
    position: relative;
    width: 100%;
    height: 200px;
    perspective: 1000px;
    cursor: pointer;
  }

  .photo-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }

  .photo-card:hover .photo-inner {
    transform: rotateY(180deg);
  }

  .photo-front, .photo-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 8px;
    overflow: hidden;
  }

  .photo-front img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .photo-back {
    background: #fff5f7;
    transform: rotateY(180deg);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    color: #ff1493;
    font-weight: bold;
  }

  .progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: rgba(255, 105, 180, 0.2);
    z-index: 1000;
  }

  .progress-fill {
    height: 100%;
    background: #ff69b4;
    transition: width 0.5s ease;
  }

  .achievement {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
    animation: slideIn 0.5s ease forwards;
    z-index: 1000;
  }

  .bubble {
    position: absolute;
    pointer-events: none;
    animation: bubbleFloat 3s ease-in-out infinite;
  }

  .hint-text {
    position: absolute;
    background: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 100;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .photo-card:hover .hint-text {
    opacity: 1;
  }

  .mini-game {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: messagePopup 0.5s forwards;
  }

  .name-input {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #ff69b4;
    border-radius: 9999px;
    padding: 0.75rem 1.5rem;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    text-align: center;
    outline: none;
    transition: all 0.3s;
    width: 300px;
  }

  .name-input:focus {
    border-color: #ff1493;
    box-shadow: 0 0 10px rgba(255, 105, 180, 0.3);
  }

  .control-button {
    position: fixed;
    z-index: 1000;
    background: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: all 0.3s;
  }

  .control-button:hover {
    transform: scale(1.1);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  }

  .music-control {
    top: 1rem;
    right: 1rem;
  }

  .game-control {
    top: 1rem;
    left: 1rem;
  }

  .game-heart {
    position: absolute;
    cursor: pointer;
    transition: all 0.3s;
  }

  .game-heart:hover {
    transform: scale(1.2);
  }

  .score-display {
    position: fixed;
    top: 4rem;
    left: 1rem;
    background: white;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    color: #ff1493;
    font-weight: bold;
    z-index: 1000;
  }

  .hidden-message {
    position: absolute;
    background: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    color: #ff1493;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }

  .letter:hover .hidden-message {
    opacity: 1;
  }

  .no-button {
    position: relative;
    transition: all 0.3s;
  }

  .flower {
    position: absolute;
    will-change: transform;
    z-index: 50;
  }
`;

function App() {
  // States
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [showFlowers, setShowFlowers] = useState(false);
  const [letterUnfolded, setLetterUnfolded] = useState(false);
  const [name, setName] = useState('');
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [foundHearts, setFoundHearts] = useState(0);
  const [sparkles, setSparkles] = useState([]);
  const [gameActive, setGameActive] = useState(false);
  const [gameHearts, setGameHearts] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [progress, setProgress] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [showGiftMessage, setShowGiftMessage] = useState(true);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [miniGameScore, setMiniGameScore] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const [hints, setHints] = useState({});
  const [showGiftBox, setShowGiftBox] = useState(false);
  const [showWishPaper, setShowWishPaper] = useState(false);
  const [allHeartsCollected, setAllHeartsCollected] = useState(false);

  // Refs for audio
  const audioRef = useRef(new Audio('https://pixabay.com/music/beats-lofi-study-112191/'));
  const clickSoundRef = useRef(new Audio('https://pixabay.com/sound-effects/pop-39222/'));
  const achievementSoundRef = useRef(new Audio('https://pixabay.com/sound-effects/success-1-6297/'));

  // Initialize styles
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  // Music control
  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    if (musicPlaying) {
      audio.play().catch(() => console.log('Playback prevented'));
    } else {
      audio.pause();
    }
    return () => audio.pause();
  }, [musicPlaying]);

  // Progress tracking
  useEffect(() => {
    const totalSteps = 5;
    const currentProgress = ((Object.keys(screens).indexOf(currentScreen) + 1) / totalSteps) * 100;
    setProgress(currentProgress);
  }, [currentScreen]);

  // Achievement system
  const unlockAchievement = (title, description) => {
    const newAchievement = { title, description, timestamp: Date.now() };
    setAchievements(prev => [...prev, newAchievement]);
    achievementSoundRef.current.play().catch(console.error);
  };

  // Generate hearts
  const generateHearts = () => {
    const hearts = [];
    for (let i = 0; i < 40; i++) {
      hearts.push(
        <Heart
          key={i}
          className="heart animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: `scale(${Math.random() * 0.5 + 0.5})`
          }}
          size={24}
        />
      );
    }
    return hearts;
  };

  // Flower shower component
  const FlowerShower = () => {
    if (!showFlowers) return null;
    
    const flowers = ['🌸', '🌹', '🌺', '🌻', '🌼'];
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => {
          const randomDelay = Math.random() * 5;
          const randomDuration = 3 + Math.random() * 2;
          const randomSize = 20 + Math.random() * 20;
          
          return (
            <div
              key={i}
              className="flower absolute"
              style={{
                left: `${Math.random() * 100}%`,
                animation: `fall ${randomDuration}s linear ${randomDelay}s infinite`,
                fontSize: `${randomSize}px`,
                transform: `rotate(${Math.random() * 360}deg)`,
                top: `-${randomSize}px`,
              }}
            >
              {flowers[Math.floor(Math.random() * flowers.length)]}
            </div>
          );
        })}
      </div>
    );
  };

  // Add sparkle effect
  const addSparkle = (e) => {
    const sparkleCount = 3;
    const newSparkles = Array.from({ length: sparkleCount }, (_, i) => ({
      id: Date.now() + i,
      x: e.clientX + (Math.random() * 20 - 10),
      y: e.clientY + (Math.random() * 20 - 10),
      scale: 0.5 + Math.random() * 0.5,
      rotation: Math.random() * 360
    }));

    setSparkles(prev => [...prev, ...newSparkles]);

    newSparkles.forEach((sparkle, index) => {
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== sparkle.id));
      }, 600 + index * 100);
    });
  };

  // Mini-game component
  const MiniGame = () => {
    const [targets, setTargets] = useState([]);
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setShowMiniGame(false);
            if (miniGameScore > 5) {
              unlockAchievement('Game Master', 'Scored high in the mini-game!');
            }
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      const interval = setInterval(() => {
        const newTarget = {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
        };
        setTargets(prev => [...prev, newTarget]);
      }, 2000);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="mini-game">
        <h3 className="text-xl font-bold text-pink-500 mb-4">
          Catch the Hearts! ({timeLeft}s)
        </h3>
        <div className="relative w-64 h-64 bg-pink-50 rounded-lg overflow-hidden">
          {targets.map(target => (
            <Heart
              key={target.id}
              className="absolute cursor-pointer transition-transform hover:scale-110"
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
              }}
              onClick={() => {
                setMiniGameScore(prev => prev + 1);
                setTargets(prev => prev.filter(t => t.id !== target.id));
                clickSoundRef.current.play().catch(console.error);
              }}
              color="#ff69b4"
              size={24}
            />
          ))}
        </div>
        <div className="mt-4 text-center">
          Score: {miniGameScore}
        </div>
      </div>
    );
  };

  // Start game function
  const startGame = () => {
    setGameActive(true);
    setFoundHearts(0);
    const hearts = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * (window.innerWidth - 50),
      y: Math.random() * (window.innerHeight - 50)
    }));
    setGameHearts(hearts);
  };

  // Collect heart function
  const collectHeart = (heartId) => {
    setGameHearts(prev => prev.filter(h => h.id !== heartId));
    setFoundHearts(prev => prev + 1);
    clickSoundRef.current.play().catch(console.error);

    if (foundHearts + 1 === 10) {
      setAllHeartsCollected(true);
      setTimeout(() => {
        setShowGiftBox(true);
        unlockAchievement('Heart Collector', 'Found all hidden hearts!');
      }, 1000);
    }
  };

  // Love message template
  const loveMessage = `Dearest ${name || '[Your Name]'},

Every moment with you feels like a beautiful dream come true. Your smile lights up my world in ways I never thought possible. You're not just my partner - you're my best friend, my confidante, and my favorite person in the whole world.

I cherish every laugh we share, every small moment we create together, and all the memories we've built. You make my life complete in ways I never knew I needed.

With all my love,
[Your Name]`;

  // Screen components
  const screens = {
    welcome: (
      <div className="screen">
        <input
          type="text"
          className="name-input animate-scale"
          placeholder="Enter your valentine's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && setCurrentScreen('landing')}
        />
        <button
          className="button animate-scale"
          onClick={() => {
            setMusicPlaying(true);
            setCurrentScreen('landing');
            unlockAchievement('Journey Begins', 'Started a romantic adventure!');
          }}
        >
          Begin Our Journey ✨
        </button>
      </div>
    ),

    landing: (
      <div className="screen">
        <button
          className="button heart-button"
          onMouseEnter={() => setShowGiftMessage(true)}
          onMouseLeave={() => setShowGiftMessage(false)}
          onClick={() => {
            setShowFlowers(true);
            setShowGiftMessage(false);
            setTimeout(() => {
              setCurrentScreen('letter');
              setLetterUnfolded(true);
            }, 1000);
          }}
        >
          Open My Heart ❤️
        </button>
        {showGiftMessage && (
          <div className="message-popup" style={{ top: '60%' }}>
            Click me to reveal a surprise! ✨
          </div>
        )}
        {gameActive && (
          <>
            <div className="score-display">
              Hearts found: {foundHearts}/10
            </div>
            {gameHearts.map(heart => (
              <Heart
                key={heart.id}
                className="game-heart"
                style={{
                  left: heart.x,
                  top: heart.y
                }}
                onClick={() => collectHeart(heart.id)}
                color="#ff69b4"
                size={24}
              />
            ))}
          </>
        )}
        {allHeartsCollected && showGiftBox && (
          <div 
            className="gift-box"
            onClick={() => setShowWishPaper(true)}
            style={{
              position: 'fixed',
              bottom: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '4rem',
              cursor: 'pointer'
            }}
          >
            🎁
          </div>
        )}
        {showWishPaper && (
          <div className="wish-paper">
            <h3 style={{ 
              fontSize: '1.5rem', 
              color: '#ff1493',
              marginBottom: '1rem'
            }}>
              Make a Wish 💫
            </h3>
            <p style={{ 
              fontStyle: 'italic',
              color: '#666',
              lineHeight: '1.6'
            }}>
              As you found all the hearts filled with love,
              it's time to make a special wish.
              Close your eyes, make your wish,
              and know that it's already coming true...
            </p>
            <button
              className="button"
              style={{ marginTop: '1rem' }}
              onClick={() => {
                setShowWishPaper(false);
                setCurrentScreen('letter');
                unlockAchievement('Wish Maker', 'Made a special wish!');
              }}
            >
              Continue ✨
            </button>
          </div>
        )}
      </div>
    ),

    letter: (
      <div className="screen">
        <div className="letter" style={{
          transform: letterUnfolded ? 'scale(1)' : 'scale(0)'
        }}>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'serif' }}>
            {loveMessage}
          </pre>
          <div className="hidden-message">
            P.S. You're amazing! 💫
          </div>
          <button
            className="button"
            onClick={() => {
              setLetterUnfolded(false);
              setTimeout(() => {
                setCurrentScreen('photos');
                unlockAchievement('Love Letter', 'Read a heartfelt message!');
              }, 1000);
            }}
            onMouseMove={addSparkle}
          >
            See Our Memories 📸
          </button>
        </div>
      </div>
    ),

    photos: (
      <div className="screen">
        <div className="photo-grid">
          {[
            "Our first date 💝",
            "That magical evening ✨",
            "Adventure time! 🌟",
            "Sweet memories 💖"
          ].map((memory, i) => (
            <div key={i} className="photo-card">
              <div className="photo-inner">
                <div className="photo-front">
                  <img src={`/api/placeholder/200/200`} alt={`Memory ${i + 1}`} />
                  <div className="hint-text">
                    Click to reveal our special memory! ✨
                  </div>
                </div>
                <div className="photo-back">
                  {memory}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="button"
          onClick={() => {
            setCurrentScreen('final');
            unlockAchievement('Memory Master', 'Explored all our special moments!');
          }}
          onMouseMove={addSparkle}
        >
          One Last Surprise 🎁
        </button>
      </div>
    ),

    final: (
      <div className="screen">
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#ff69b4',
          marginBottom: '2rem',
          animation: 'float 2s infinite'
        }}>
          Will you be my Valentine? 💝
        </h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            className="button"
            onClick={() => {
              setShowSuccessMessage(true);
              clickSoundRef.current.play().catch(console.error);
              unlockAchievement('True Love', 'Said YES to love! 💖');
            }}
            onMouseMove={addSparkle}
          >
            Yes! 💖
          </button>
          <button
            className="button no-button"
            onMouseEnter={(e) => {
              const button = e.target;
              const buttonRect = button.getBoundingClientRect();
              const padding = 20;
              
              const maxX = window.innerWidth - buttonRect.width - padding;
              const maxY = window.innerHeight - buttonRect.height - padding;
              
              const newX = Math.min(Math.max(padding, Math.random() * maxX), maxX);
              const newY = Math.min(Math.max(padding, Math.random() * maxY), maxY);
              
              const currentX = buttonRect.left;
              const currentY = buttonRect.top;
              
              const deltaX = newX - currentX;
              const deltaY = newY - currentY;
              
              button.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
              button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            }}
          >
            No 💔
          </button>
        </div>
        {showSuccessMessage && (
          <div style={{
            marginTop: '2rem',
            fontSize: '1.5rem',
            color: '#4CAF50',
            animation: 'float 2s infinite'
          }}>
            Yay! I knew you'd say yes! 🎉💕
          </div>
        )}
      </div>
    )
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Progress Bar */}
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Control Buttons */}
      <button 
        className="control-button music-control" 
        onClick={() => setMusicPlaying(!musicPlaying)}
      >
        {musicPlaying ? <Music size={24} /> : <VolumeX size={24} />}
      </button>
      <button 
        className="control-button game-control" 
        onClick={startGame}
      >
        <Gift size={24} />
      </button>

      {/* Effects */}
      {generateHearts()}
      <FlowerShower />
      {sparkles.map(sparkle => (
        <Sparkles
        key={sparkle.id}
        className="sparkle"
        style={{
          left: sparkle.x,
          top: sparkle.y
        }}
        size={24}
      />
    ))}

    {/* Achievements Display */}
    {achievements.map((achievement, index) => (
      <div 
        key={achievement.timestamp}
        className="achievement"
        style={{ bottom: `${20 + index * 80}px` }}
      >
        <Trophy className="text-pink-500 mb-2" size={24} />
        <h4 className="font-bold text-pink-500">{achievement.title}</h4>
        <p className="text-sm text-gray-600">{achievement.description}</p>
      </div>
    ))}

    {/* Mini Game */}
    {showMiniGame && <MiniGame />}

    {/* Main Screen Content */}
    {screens[currentScreen]}

    {/* Floating Bubbles */}
    {Array.from({ length: 15 }).map((_, i) => (
      <div
        key={i}
        className="bubble"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`
        }}
      >
        💝
      </div>
    ))}
  </div>
);
}

export default App;