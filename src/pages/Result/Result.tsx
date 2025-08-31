import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Result.css';

// SVG 파일들 import
import button2 from '../../assets/button_2.svg';
import readyMsg from '../../assets/ready_msg.svg';
import category from '../../assets/category.svg';
import dist from '../../assets/dist.svg';
import budget from '../../assets/budget.svg';
import filledStar from '../../assets/filledstar.svg';
import star from '../../assets/star.svg';

const Result: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/roulette');
  };

  return (
    <div className="result-container">
      {/* 헤더 타이틀 */}
      <div className="header-title">
        <img src={readyMsg} alt="푸파 에너지 장전 완료!" className="ready-msg-image" />
      </div>

      {/* 레스토랑 리스트 */}
      <div className="restaurant-list">
        {/* 레스토랑 카드 1 */}
        <div className="restaurant-card">
          <div className="image-placeholder"></div>
          <div className="restaurant-info">
            <div className="restaurant-details">
              <h3 className="restaurant-name">모미지</h3>
              <p className="restaurant-address">서울시 서대문구 중로뭐시기 30로 21</p>
              <div className="rating-section">
                <span className="rating-score">4.0</span>
                <div className="stars">
                  <img src={filledStar} alt="별" className="star filled" />
                  <img src={filledStar} alt="별" className="star filled" />
                  <img src={filledStar} alt="별" className="star filled" />
                  <img src={filledStar} alt="별" className="star filled" />
                  <img src={star} alt="별" className="star" />
                </div>
                <span className="review-count">(21)</span>
              </div>
            </div>
            <div className="service-info">
              <div className="service-item">
                <img src={category} alt="카테고리" className="service-icon" />
                <span className="service-text">일식</span>
              </div>
              <div className="service-item">
                <img src={dist} alt="거리" className="service-icon" />
                <span className="service-text">12분</span>
              </div>
              <div className="service-item">
                <img src={budget} alt="가격" className="service-icon" />
                <span className="service-text">1.2-1.4</span>
              </div>
            </div>
          </div>
        </div>

        {/* 레스토랑 카드 2 */}
        <div className="restaurant-card">
          <div className="image-placeholder"></div>
          <div className="restaurant-info">
            <div className="restaurant-details">
              <h3 className="restaurant-name">모미지</h3>
              <p className="restaurant-address">서울시 서대문구 중로뭐시기 30로 21</p>
              <div className="rating-section">
                <span className="rating-score">4.0</span>
                <div className="stars">
                  <img src={filledStar} alt="별" className="star filled" />
                  <img src={filledStar} alt="별" className="star filled" />
                  <img src={filledStar} alt="별" className="star filled" />
                  <img src={filledStar} alt="별" className="star filled" />
                  <img src={star} alt="별" className="star" />
                </div>
                <span className="review-count">(21)</span>
              </div>
            </div>
            <div className="service-info">
              <div className="service-item">
                <img src={category} alt="카테고리" className="service-icon" />
                <span className="service-text">일식</span>
              </div>
              <div className="service-item">
                <img src={dist} alt="거리" className="service-icon" />
                <span className="service-text">12분</span>
              </div>
              <div className="service-item">
                <img src={budget} alt="가격" className="service-icon" />
                <span className="service-text">1.2-1.4</span>
              </div>
            </div>
          </div>
        </div>

        {/* 레스토랑 카드 3 */}
        <div className="restaurant-card">
          <div className="image-placeholder"></div>
          <div className="restaurant-info">
            <div className="restaurant-details">
              <h3 className="restaurant-name">모미지</h3>
              <p className="restaurant-address">서울시 서대문구 중로뭐시기 30로 21</p>
              <div className="rating-section">
                <span className="rating-score">4.0</span>
                <div className="stars">
                  <img src={filledStar} alt="별" className="star filled" />
                  <img src={filledStar} alt="별" className="star filled" />
                  <img src={filledStar} alt="별" className="star filled" />
                  <img src={filledStar} alt="별" className="star filled" />
                  <img src={star} alt="별" className="star" />
                </div>
                <span className="review-count">(21)</span>
              </div>
            </div>
            <div className="service-info">
              <div className="service-item">
                <img src={category} alt="카테고리" className="service-icon" />
                <span className="service-text">일식</span>
              </div>
              <div className="service-item">
                <img src={dist} alt="거리" className="service-icon" />
                <span className="service-text">12분</span>
              </div>
              <div className="service-item">
                <img src={budget} alt="가격" className="service-icon" />
                <span className="service-text">1.2-1.4</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="bottom-button-section">
        <button className="again-button" onClick={handleGoBack}>
          <img src={button2} alt="다시!!!!" className="button-image" />
          <span className="button-text">다시!!!!</span>
        </button>
      </div>
    </div>
  );
};

export default Result;
