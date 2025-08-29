import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// 페이지 컴포넌트들 import
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Roulette from './pages/Roulette/Roulette';
import Result from './pages/Result/Result';
import StoreDetail from './pages/StoreDetail/StoreDetail';
import ReviewWrite from './pages/ReviewWrite/ReviewWrite';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 기본 경로를 Login으로 리다이렉트 */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* 각 페이지 라우트 */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/roulette" element={<Roulette />} />
          <Route path="/result" element={<Result />} />
          <Route path="/store-detail" element={<StoreDetail />} />
          <Route path="/review-write" element={<ReviewWrite />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
