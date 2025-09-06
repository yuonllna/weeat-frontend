import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import filledStar from '../../assets/filledstar.svg';
import star from '../../assets/star.svg';
import addIcon from '../../assets/add.svg';
import noticeIcon from '../../assets/notice_none.svg';
import button5 from '../../assets/button_5.svg';
import button6 from '../../assets/button_6.svg';
import './ReviewWrite.css';

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
}

const ReviewWrite: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const fetchPlaceDetail = async () => {
      try {
        setLoading(true);
        
        // URL 파라미터 검증 및 정리
        let placeId = id;
        if (!placeId || placeId === '{place_id}' || placeId === '%7Bplace_id%7D') {
          throw new Error('유효하지 않은 가게 ID입니다.');
        }
        
        console.log('요청할 가게 ID:', placeId);
        const response = await fetch(`http://43.202.164.138:8000/api/v1/places/${placeId}`);
        
        if (!response.ok) {
          throw new Error('가게 정보를 가져오는데 실패했습니다.');
        }
        
        const data = await response.json();
        console.log('가게 상세 데이터:', data);
        setPlace(data);
      } catch (err) {
        console.error('API 호출 오류:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        
        // 에러 시 더미 데이터로 대체
        setPlace({
          id: 1,
          name: "모미지식당",
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

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      setSelectedImages(prev => [...prev, ...newImages]);
      
      // 미리보기 URL 생성
      const newPreviews = newImages.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/\D/g, '');
    
    // 010-XXXX-XXXX 형식으로 포맷팅
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(event.target.value);
    setPhoneNumber(formatted);
  };

  const removeImage = (index: number) => {
    // URL 해제
    URL.revokeObjectURL(imagePreviews[index]);
    
    // 배열에서 제거
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // 전화번호 형식 검증
  const isValidPhoneNumber = (phone: string) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  // 모든 필수 정보가 입력되었는지 확인
  const isFormComplete = () => {
    return rating > 0 && reviewText.trim() !== '' && isValidPhoneNumber(phoneNumber);
  };

  // 후기 등록 처리
  const handleSubmitReview = async () => {
    if (!isFormComplete()) {
      alert('모든 필수 정보를 입력해주세요.');
      return;
    }
    
    try {
      // FormData 생성 (이미지 파일 포함)
      const formData = new FormData();
      formData.append('rating', rating.toString());
      formData.append('content', reviewText);
      formData.append('phone_number', phoneNumber);
      
      // 이미지 파일들 추가
      selectedImages.forEach((image, index) => {
        formData.append('files', image);
      });
      
      // FormData에 파일이 제대로 추가되었는지 확인
      console.log('FormData 내용 확인:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, value.name, value.size, 'bytes');
        } else {
          console.log(`${key}:`, value);
        }
      }
      
      // 디버깅: 전송할 데이터 확인
      console.log('전송할 데이터:', {
        placeId: id,
        rating,
        content: reviewText,
        phoneNumber,
        imageCount: selectedImages.length
      });
      
      const response = await fetch(`http://43.202.164.138:8000/api/v1/places/${id}/reviews`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 응답 오류:', errorText);
        throw new Error('후기 등록에 실패했습니다.');
      }
      
      const result = await response.json();
      console.log('후기 등록 성공:', result);
      
      alert('후기가 등록되었습니다!');
      navigate(-1);
    } catch (error) {
      console.error('후기 등록 오류:', error);
      alert('후기 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <img
          key={i}
          src={i < rating ? filledStar : star}
          alt={i < rating ? "채워진 별" : "빈 별"}
          className="star"
          onClick={() => handleStarClick(i)}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="review-write-container">
        <div className="loading">가게 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="review-write-container">
        <div className="error-message">
          <p>{error}</p>
          <p>가게 정보를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-write-container">
      {/* 헤더 */}
      <div className="review-header">
        <button className="back-button" onClick={handleGoBack}>
          <IoIosArrowBack className="back-arrow" />
        </button>
      </div>

      {/* 가게 정보 */}
      <div className="restaurant-info">
        <h1 className="restaurant-name">{place.name}</h1>
        <p className="restaurant-address">{place.address.replace(/\n/g, ' ')}</p>
      </div>

      {/* 리뷰 입력 섹션 */}
      <div className="review-input-section">
        <p className="rating-prompt">다녀온 경험을 <span className="highlight">솔직하게</span> 남겨주세요!</p>
        
        {/* 별점 */}
        <div className="star-rating">
          {renderStars()}
        </div>

        {/* 사진/영상 업로드 */}
        {imagePreviews.length === 0 ? (
          <div className="photo-upload-area">
            <p className="upload-text">사진이나 영상을 추가해주세요</p>
            <label htmlFor="image-upload" className="upload-button">
              <img src={addIcon} alt="추가" className="add-icon" />
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <div className="image-previews">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="preview-block">
                <img src={preview} alt={`미리보기 ${index + 1}`} className="preview-image" />
                <button 
                  type="button" 
                  className="remove-image-btn"
                  onClick={() => removeImage(index)}
                >
                  ×
                </button>
              </div>
            ))}
            {/* 추가 이미지 업로드 버튼 */}
            <div className="add-more-block">
              <label htmlFor="image-upload-more" className="add-more-button">
                <img src={addIcon} alt="추가" className="add-icon" />
              </label>
              <input
                id="image-upload-more"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        )}

        {/* 리뷰 텍스트 */}
        <textarea
          className="review-textarea"
          placeholder="솔직하게 리뷰를 작성해주세요!"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
      </div>

      {/* 공지사항과 전화번호 */}
      <div className="notice-section">
        <div className="notice-box">
          <img src={noticeIcon} alt="알림" className="notice-icon" />
          <p className="notice-text">
            <span className="notice-highlight">현재 추첨을 통해 리워드를 드리는 이벤트 진행 중입니다!</span><br />
            전화번호는 추첨용으로만 사용되며,<br />
            이벤트 종료 후 즉시 폐기됩니다!
          </p>
        </div>
        
        <input
          type="tel"
          className="phone-input"
          placeholder="전화번호"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          maxLength={13}
        />
        
        {/* 뒤로 가기 / 후기 등록하기 버튼 */}
        <div className="button-section">
          {isFormComplete() ? (
            <button className="submit-review-button" onClick={handleSubmitReview}>
              <img src={button6} alt="후기 등록하기" className="button-image" />
              <span className="button-text">후기 등록하기</span>
            </button>
          ) : (
            <button className="go-back-button" onClick={handleGoBack}>
              <img src={button5} alt="뒤로 가기" className="button-image" />
              <span className="button-text">뒤로 가기</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewWrite;
