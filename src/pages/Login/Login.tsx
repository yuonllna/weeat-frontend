import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 이메일 로그인 로직 구현
    console.log('이메일 로그인:', { email, password });
  };

  const handleKakaoLogin = () => {
    // TODO: 카카오 로그인 로직 구현
    console.log('카카오 로그인');
  };

  const handleGoogleLogin = () => {
    // TODO: 구글 로그인 로직 구현
    console.log('구글 로그인');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">로그인</h1>
        
        {/* 이메일 로그인 폼 */}
        <form onSubmit={handleEmailLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          
          <button type="submit" className="login-btn">
            로그인
          </button>
        </form>

        {/* 구분선 */}
        <div className="divider">
          <span>또는</span>
        </div>

        {/* 소셜 로그인 버튼들 */}
        <div className="social-login">
          <button onClick={handleKakaoLogin} className="kakao-btn">
            카카오로 로그인
          </button>
          
          <button onClick={handleGoogleLogin} className="google-btn">
            구글로 로그인
          </button>
        </div>

        {/* 회원가입 링크 */}
        <div className="signup-link">
          <p>
            계정이 없으신가요?{' '}
            <button onClick={handleSignUp} className="signup-btn">
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
