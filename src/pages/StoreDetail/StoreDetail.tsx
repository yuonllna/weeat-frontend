import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import filledStar from '../../assets/filledstar.svg';
import star from '../../assets/star.svg';
import button3 from '../../assets/button_3.svg';
import button4 from '../../assets/button_4.svg';
import notice from '../../assets/notice.svg';
import categoryIcon from '../../assets/category.svg';
import distIcon from '../../assets/dist.svg';
import budgetIcon from '../../assets/budget.svg';
import menuIcon from '../../assets/menu.svg';
import './StoreDetail.css';

// 카카오 SDK 타입 선언
declare global {
  interface Window {
    Kakao: any;
  }
}

interface PlaceDetail {
  id: number;
  name: string;
  address: string;
  rating: number;
  review_count: number;
  category: string;
  distance_note: string;
  budget_range: number;
  hero_image_url?: string;
  menus?: Array<{
    id: number;
    name: string;
    price: number;
    place_id: number;
  }>;
}

const StoreDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  useEffect(() => {
    const fetchPlaceDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/v1/places/${id}`);
        
        if (!response.ok) {
          throw new Error('가게 정보를 가져오는데 실패했습니다.');
        }
        
        const data = await response.json();
        console.log('가게 상세 데이터:', data);
        console.log('review_count 값:', data.review_count);
        console.log('전체 필드들:', Object.keys(data));
        setPlace(data);
      } catch (err) {
        console.error('API 호출 오류:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        
        // 에러 시 더미 데이터로 대체
        setPlace({
          id: 1,
          name: "모미지",
          address: "서울시 서대문구 중로뭐시기 30로 21",
          rating: 4.0,
          review_count: 21,
          category: "일식",
          distance_note: "정문 12분",
          budget_range: 12000,
          hero_image_url: ""
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlaceDetail();
    }
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleKakaoShare = () => {
    try {
      // 카카오 SDK가 로드되었는지 확인
      if (typeof window !== 'undefined' && window.Kakao) {
        // 카카오톡 공유 시도
        shareToKakao();
      } else {
        // 카카오 SDK가 없는 경우 클립보드 복사
        copyToClipboard();
      }
    } catch (error) {
      console.error('공유 실패:', error);
      // 에러 발생 시 클립보드 복사로 대체
      copyToClipboard();
    }
  };

  const shareToKakao = () => {
    try {
      // 사용자 정의 템플릿으로 카카오톡 공유
      window.Kakao.Share.sendCustom({
        templateId: 123925,
        templateArgs: {
          PLACE: place?.name || '가게명',
          IMG: place?.hero_image_url || '',
        },
      });
    } catch (error) {
      console.error('카카오톡 공유 실패:', error);
      // 카카오톡 공유 실패 시 클립보드 복사로 대체
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      const shareText = `${place?.name} - 위잇\n${place?.name}의 상세 정보를 확인해보세요!\n주소: ${place?.address}\n카테고리: ${place?.category}\n평점: ${place?.rating}점\n${window.location.href}`;
      
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        alert('링크가 클립보드에 복사되었습니다!');
      } else {
        // 구형 브라우저 지원
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('링크가 클립보드에 복사되었습니다!');
      }
    } catch (error) {
      console.error('클립보드 복사 실패:', error);
      alert('공유에 실패했습니다. 링크를 직접 복사해주세요.');
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating); // 정수 부분만 추출
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<img key={i} src={filledStar} alt="채워진 별" className="star filled" />);
      } else {
        stars.push(<img key={i} src={star} alt="빈 별" className="star" />);
      }
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="store-detail-container">
        <div className="loading">가게 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="store-detail-container">
        <div className="error-message">
          <p>{error}</p>
          <p>가게 정보를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="store-detail-container">
      {/* 헤더 */}
      <div className="store-header">
        <button className="back-button" onClick={handleGoBack}>
          <IoIosArrowBack className="back-arrow" />
        </button>
      </div>

      {/* 히어로 섹션 */}
      <div className="hero-section">
        {place.hero_image_url ? (
          <img src={place.hero_image_url} alt={place.name} className="hero-image" />
        ) : (
          <div className="hero-placeholder"></div>
        )}
      </div>

      {/* 가게 정보 카드 */}
      <div className="info-card">
        <h1 className="store-name">{place.name}</h1>
        <p className="store-address">{place.address}</p>
        
        <div className="rating-section">
          <span className="rating-score">{place.rating.toFixed(1)}</span>
          <div className="stars">
            {renderStars(place.rating)}
          </div>
          <span className="review-count">({place.review_count})</span>
        </div>

        {/* 탭 인터페이스 */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            상세
          </button>
          <button 
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            후기
          </button>
        </div>

        {/* 탭 컨텐츠 */}
        {activeTab === 'details' && (
          <div className="tab-content">
            <div className="detail-item">
              <div className="detail-icon">
                <img src={categoryIcon} alt="카테고리" />
              </div>
              <span className="detail-text">{place.category}</span>
            </div>
            <div className="detail-item">
              <div className="detail-icon">
                <img src={distIcon} alt="거리" />
              </div>
              <span className="detail-text">{place.distance_note}</span>
            </div>
            <div className="detail-item">
              <div className="detail-icon">
                <img src={budgetIcon} alt="예산" />
              </div>
              <span className="detail-text">평균 {place.budget_range}원</span>
            </div>
            <div className="detail-item">
              <div className="detail-icon">
                <img src={menuIcon} alt="메뉴" />
              </div>
              <span className="detail-text">
                {place.menus && place.menus.length > 0 ? (
                  place.menus.slice(0, 3).map((menu, index) => (
                    <span key={menu.id}>
                      {menu.name}
                      {index < Math.min(place.menus!.length, 3) - 1 ? ', ' : ''}
                    </span>
                  ))
                ) : (
                  '메뉴 정보 없음'
                )}
              </span>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="tab-content">
            <p className="reviews-placeholder">후기 기능 준비 중입니다.</p>
          </div>
        )}
      </div>

      {/* Notice 섹션 - 상세탭 활성화시에만 표시 */}
      {activeTab === 'details' && (
        <div className="notice-section">
          <div className="notice-box">
            <img src={notice} alt="알림" className="notice-icon" />
            <p className="notice-text">
              방문 후기 작성을 위해, 이 페이지를 꼭<br />
              <span className="highlight-text">'내게 보내기'</span>로 카톡에 저장해주세요!
            </p>
          </div>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="action-buttons">
        <button className="action-button send-button" onClick={handleKakaoShare}>
          <img src={button3} alt="내게 보내기" className="button-image" />
          <span className="button-text">내게 보내기</span>
        </button>
        <button className="action-button review-button">
          <img src={button4} alt="후기 작성하기" className="button-image" />
          <span className="button-text">후기 작성하기</span>
        </button>
      </div>
    </div>
  );
};

export default StoreDetail;
