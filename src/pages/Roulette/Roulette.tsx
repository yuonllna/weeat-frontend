import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Roulette.css';

// SVG 파일들 import
import logo from '../../assets/logo.svg';
import character1 from '../../assets/character_1.svg';
import button1 from '../../assets/button_1.svg';
import push from '../../assets/push.svg';
import sexyfood from '../../assets/sexyfood.svg';

const Roulette: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const navigate = useNavigate();

  const handleSpinRoulette = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // 즉시 result 페이지로 이동
    navigate('/result');
  };

  return (
    <div className="roulette-container">
      {/* 상단 로고 */}
      <div className="logo-section">
        <img src={logo} alt="Weeat Logo" className="logo" />
      </div>

      {/* 중앙 캐릭터 섹션 */}
      <div className="character-section">
        <div className="character-container">
          <img src={character1} alt="Character" className="character" />
          <img src={sexyfood} alt="Sexy Food" className="sexy-food" />
        </div>
      </div>

      {/* 버튼 섹션 */}
      <div className="button-section">
        <button 
          className={`spin-button ${isSpinning ? 'spinning' : ''}`}
          onClick={handleSpinRoulette}
          disabled={isSpinning}
        >
          <img src={button1} alt="오늘 뭐 먹지" className="button-image" />
          <span className="button-text">오늘 뭐 먹지</span>
        </button>
      </div>

      {/* 푸시 인디케이터 */}
      <div className="push-indicator">
        <img src={push} alt="Push" className="push-image" />
      </div>
    </div>
  );
};

export default Roulette;
