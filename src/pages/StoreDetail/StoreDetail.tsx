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

interface Review {
  id: number;
  place_id: number;
  phone_number: string;
  rating: number;
  content: string;
  created_at: string;
  photo_urls: string; // JSON 문자열로 저장됨
  parsed_photo_urls?: string[]; // 파싱된 이미지 URL 배열
}

const StoreDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentReviewImages, setCurrentReviewImages] = useState<string[]>([]);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  useEffect(() => {
    const fetchPlaceDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://43.202.164.138:8000/api/v1/places/${id}`);
        
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

  const fetchReviews = async (placeId: string) => {
    try {
      setReviewsLoading(true);
      setReviewsError(null);
      const response = await fetch(`http://43.202.164.138:8000/api/v1/places/${placeId}/reviews`);
      
      if (!response.ok) {
        throw new Error('후기를 가져오는데 실패했습니다.');
      }
      
      const data = await response.json();
      console.log('후기 데이터:', data);
      // 최신순으로 정렬 (created_at 기준 내림차순)
      const sortedReviews = data.sort((a: Review, b: Review) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      // photo_urls JSON 문자열을 파싱하여 이미지 URL 배열로 변환
      sortedReviews.forEach((review: any) => {
        try {
          if (review.photo_urls && typeof review.photo_urls === 'string') {
            let cleanJsonString = review.photo_urls.trim();
            
            // Python 리스트 형태의 문자열을 JSON 형태로 변환
            if (cleanJsonString.startsWith("['") && cleanJsonString.endsWith("']")) {
              // "['url1', 'url2']" 형태를 "[\"url1\", \"url2\"]" 형태로 변환
              cleanJsonString = cleanJsonString.replace(/'/g, '"');
              review.parsed_photo_urls = JSON.parse(cleanJsonString);
            } else if (cleanJsonString.startsWith('[') && cleanJsonString.endsWith(']')) {
              // 이미 JSON 형태인 경우
              review.parsed_photo_urls = JSON.parse(cleanJsonString);
            } else {
              // 단일 URL인 경우 배열로 감싸기
              review.parsed_photo_urls = [cleanJsonString];
            }
          } else if (Array.isArray(review.photo_urls)) {
            // 이미 배열인 경우
            review.parsed_photo_urls = review.photo_urls;
          } else {
            review.parsed_photo_urls = [];
          }
        } catch (error) {
          console.error('photo_urls 파싱 오류:', error, '원본 데이터:', review.photo_urls);
          // 파싱 실패 시 빈 배열로 설정
          review.parsed_photo_urls = [];
        }
      });
      
      setReviews(sortedReviews);
    } catch (err) {
      console.error('후기 API 호출 오류:', err);
      setReviewsError(err instanceof Error ? err.message : '후기를 불러올 수 없습니다.');
    } finally {
      setReviewsLoading(false);
    }
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
          PLACE_ID: id || '1', // 가게 ID를 템플릿 인자로 전달
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
    const hasHalfStar = rating % 1 >= 0.5; // 0.5 이상이면 반별 표시
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<img key={i} src={filledStar} alt="채워진 별" className="star filled" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<img key={i} src={filledStar} alt="반별" className="star half" />);
      } else {
        stars.push(<img key={i} src={star} alt="빈 별" className="star" />);
      }
    }
    
    return stars;
  };

  const getAnonymousName = (index: number, totalCount: number) => {
    return `익명${totalCount - index}`;
  };

  // 이미지 모달 관련 함수들
  const openImageModal = (images: string[], startIndex: number = 0) => {
    setCurrentReviewImages(images);
    setCurrentImageIndex(startIndex);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % currentReviewImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + currentReviewImages.length) % currentReviewImages.length);
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isImageModalOpen) return;
    
    if (event.key === 'Escape') {
      closeImageModal();
    } else if (event.key === 'ArrowLeft') {
      prevImage();
    } else if (event.key === 'ArrowRight') {
      nextImage();
    }
  };

  // 터치/마우스 드래그 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentReviewImages.length > 1) {
      nextImage();
    }
    if (isRightSwipe && currentReviewImages.length > 1) {
      prevImage();
    }
  };

  // 마우스 드래그 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStartX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setTouchEndX(e.clientX);
    
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentReviewImages.length > 1) {
      nextImage();
    }
    if (isRightSwipe && currentReviewImages.length > 1) {
      prevImage();
    }
  };

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isImageModalOpen, currentReviewImages.length]);

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
            onClick={() => {
              setActiveTab('reviews');
              if (id && reviews.length === 0 && !reviewsLoading) {
                fetchReviews(id);
              }
            }}
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
            {reviewsLoading ? (
              <div className="reviews-loading">후기를 불러오는 중...</div>
            ) : reviewsError ? (
              <div className="reviews-error">{reviewsError}</div>
            ) : reviews.length === 0 ? (
              <div className="reviews-empty">아직 작성된 후기가 없습니다.</div>
            ) : (
              <div className="reviews-list">
                {reviews.map((review, index) => (
                  <div key={review.id} className="review-item">
                    {/* 이름 (왼쪽 정렬, 18px) */}
                    <div className="review-name">
                      {getAnonymousName(index, reviews.length)}
                    </div>
                    
                    {/* 별점과 날짜 (같은 줄) */}
                    <div className="review-rating-date-row">
                      <div className="review-rating-left">
                        <span className="rating-number">{review.rating}</span>
                        <div className="review-stars">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <span className="review-date">
                        {new Date(review.created_at).toLocaleDateString('ko-KR', {
                          year: '2-digit',
                          month: '2-digit',
                          day: '2-digit'
                        }).replace(/\./g, '.').replace(/\s/g, '')}
                      </span>
                    </div>
                    
                    {/* 사진 (가운데 정렬, 여러장이면 스와이프) */}
                    {review.parsed_photo_urls && review.parsed_photo_urls.length > 0 && (
                      <div className="review-images-container">
                        <div className="review-images-scroll">
                          {review.parsed_photo_urls.map((photoUrl, photoIndex) => {
                             // 이미 완전한 URL인 경우 그대로 사용, 상대 경로인 경우 API 도메인으로 변환
                             let fullImageUrl = photoUrl;
                             
                             if (photoUrl.startsWith('http')) {
                               // 이미 완전한 URL (S3 URL 포함)
                               fullImageUrl = photoUrl;
                             } else if (photoUrl.startsWith('/static/uploads/')) {
                               // 로컬 경로를 API 도메인으로 변환
                               fullImageUrl = `http://43.202.164.138:8000${photoUrl}`;
                             } else if (photoUrl.startsWith('static/uploads/')) {
                               // static/uploads/로 시작하는 경우
                               fullImageUrl = `http://43.202.164.138:8000/${photoUrl}`;
                             } else {
                               // 기타 상대 경로인 경우 API 도메인으로 가정
                               fullImageUrl = `http://43.202.164.138:8000/${photoUrl}`;
                             }
                            
                            return (
                              <img 
                                key={photoIndex} 
                                src={fullImageUrl} 
                                alt={`리뷰 이미지 ${photoIndex + 1}`} 
                                className="review-image"
                                onClick={() => openImageModal(review.parsed_photo_urls!, photoIndex)}
                                onError={(e) => {
                                  console.error('이미지 로딩 실패:', fullImageUrl);
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* 리뷰 내용 (양쪽 정렬, 16px) */}
                    <div className="review-content">
                      {review.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
        <button 
          className="action-button review-button"
          onClick={() => navigate(`/review-write/${id}`)}
        >
          <img src={button4} alt="후기 작성하기" className="button-image" />
          <span className="button-text">후기 작성하기</span>
        </button>
      </div>

      {/* 이미지 모달 */}
      {isImageModalOpen && (
        <div className="image-modal-overlay" onClick={closeImageModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* 닫기 버튼 */}
            <button className="modal-close-btn" onClick={closeImageModal}>
              ×
            </button>
            
            {/* 이미지 */}
            <div 
              className="modal-image-container"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            >
              <img 
                src={currentReviewImages[currentImageIndex]} 
                alt={`이미지 ${currentImageIndex + 1}`}
                className="modal-image"
                draggable={false}
              />
            </div>
            
            {/* 이미지 인디케이터 (여러 장일 때만 표시) */}
            {currentReviewImages.length > 1 && (
              <div className="modal-indicators">
                {currentReviewImages.map((_, index) => (
                  <button
                    key={index}
                    className={`modal-indicator ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreDetail;
