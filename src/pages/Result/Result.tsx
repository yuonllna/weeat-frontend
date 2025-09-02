import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Result.css';
import { IoIosArrowBack } from "react-icons/io";

// SVG 파일들 import
import button2 from '../../assets/button_2.svg';
import readyMsg from '../../assets/ready_msg.svg';
import category from '../../assets/category.svg';
import dist from '../../assets/dist.svg';
import budget from '../../assets/budget.svg';
import filledStar from '../../assets/filledstar.svg';
import star from '../../assets/star.svg';


// 가게 데이터 타입 정의
interface Restaurant {
  place: {
    id: number;
    name: string;
    address: string;
    category: string;
    distance_note: string;
    budget_range: string;
    hero_image_url: string;
    rating?: number; // 평점 (리뷰가 있는 경우에만)
    review_count?: number; // 리뷰 수
  };
  menu: {
    id: number;
    name: string;
    price: number;
    place_id: number;
  };
  category: string;
}

const Result: React.FC = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 백엔드 API에서 가게 추천 데이터 가져오기
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/v1/recommendations');
        
        if (!response.ok) {
          throw new Error('추천 데이터를 가져오는데 실패했습니다.');
        }
        
        const data = await response.json();
        console.log('API 응답 데이터:', data); // 디버깅용 로그 추가
        console.log('첫 번째 가게 데이터:', data[0]); // 첫 번째 가게의 상세 구조 확인
        console.log('첫 번째 가게의 review_count:', data[0]?.place?.review_count); // review_count 값 확인
        setRestaurants(data);
      } catch (err) {
        console.error('API 호출 오류:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        
        // 에러 시 더미 데이터로 대체
        setRestaurants([
          {
                         place: {
               id: 1,
               name: "지중해 레스토랑",
               address: "서울시 강남구 테헤란로 456",
               category: "지중해식",
               distance_note: "15분",
               budget_range: "2.0-3.0",
               hero_image_url: "",
               rating: 4.2,
               review_count: 15
             },
            menu: {
              id: 101,
              name: "파스타",
              price: 15000,
              place_id: 1
            },
            category: "지중해식"
          },
          {
                         place: {
               id: 2,
               name: "맥도날드",
               address: "서울시 마포구 홍대입구 789",
               category: "패스트푸드",
               distance_note: "8분",
               budget_range: "0.5-1.0",
               hero_image_url: "",
               rating: 3.8,
               review_count: 8
             },
            menu: {
              id: 102,
              name: "빅맥",
              price: 5000,
              place_id: 2
            },
            category: "패스트푸드"
          },
          {
                         place: {
               id: 3,
               name: "스시로",
               address: "서울시 서대문구 연세로 123",
               category: "일식",
               distance_note: "12분",
               budget_range: "1.5-2.5",
               hero_image_url: "",
               rating: 4.5,
               review_count: 23
             },
            menu: {
              id: 103,
              name: "초밥",
              price: 20000,
              place_id: 3
            },
            category: "일식"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleGoBack = () => {
    navigate('/roulette');
  };

  const handleRefresh = () => {
    // 로딩 상태로 변경하고 API를 다시 호출
    setLoading(true);
    setError(null);
    
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/recommendations');
        
        if (!response.ok) {
          throw new Error('추천 데이터를 가져오는데 실패했습니다.');
        }
        
        const data = await response.json();
        console.log('새로운 API 응답 데이터:', data);
        setRestaurants(data);
      } catch (err) {
        console.error('API 호출 오류:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  };



  // 별 렌더링 함수
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating); // 정수 부분만 추출
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<img key={i} src={filledStar} alt="채워진 별" className="star-icon" />);
      } else {
        stars.push(<img key={i} src={star} alt="빈 별" className="star-icon" />);
      }
    }
    
    return stars;
  };



  if (loading) {
    return (
      <div className="result-container">
        <div className="loading">추천 가게를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="result-container">
        <div className="error-message">
          <p>{error}</p>
          <p>기본 추천 가게를 보여드립니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="result-container">
             {/* 푸파에너지 이미지와 뒤로가기 버튼 */}
      <div className="header-content">
        <button className="back-button" onClick={handleGoBack}>
          <IoIosArrowBack className="back-arrow" />
        </button>
        <img src={readyMsg} alt="푸파 에너지 장전 완료!" className="ready-msg-image" />
      </div>

      {/* 레스토랑 리스트 */}
      <div className="restaurant-list">
        {restaurants.map((restaurant, index) => (
          <div 
            key={restaurant.place.id || index} 
            className="restaurant-card"
            onClick={() => navigate(`/store-detail/${restaurant.place.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="image-placeholder">
              {restaurant.place.hero_image_url && (
                <img src={restaurant.place.hero_image_url} alt={restaurant.place.name} className="restaurant-image" />
              )}
            </div>
            <div className="restaurant-info">
              <div className="restaurant-details">
                <h3 className="restaurant-name">{restaurant.place.name}</h3>
                <p className="restaurant-address">{restaurant.place.address}</p>
                                 <div className="rating-section">
                   <span className="rating-score">
                     {restaurant.place.rating ? restaurant.place.rating.toFixed(1) : '0.0'}
                   </span>
                   <div className="stars-container">
                     {renderStars(restaurant.place.rating || 0)}
                   </div>
                   {restaurant.place.review_count !== undefined && restaurant.place.review_count !== null && (
                     <span className="review-count">({restaurant.place.review_count})</span>
                   )}
                 </div>
              </div>
              <div className="service-info">
                <div className="service-item">
                  <img src={category} alt="카테고리" className="service-icon" />
                  <span className="service-text">{restaurant.place.category}</span>
                </div>
                <div className="service-item">
                  <img src={dist} alt="거리" className="service-icon" />
                  <span className="service-text">{restaurant.place.distance_note}</span>
                </div>
                <div className="service-item">
                  <img src={budget} alt="가격" className="service-icon" />
                  <span className="service-text">{restaurant.place.budget_range}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Result 페이지 전용 버튼 */}
      <div className="result-button-container">
        <button className="result-button refresh-button" onClick={handleRefresh}>
          <img src={button2} alt="다시!!!" className="button-image" />
          <span className="button-text">다시!!!</span>
        </button>
      </div>
    </div>
  );
};

export default Result;
