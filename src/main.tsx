import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 카카오 SDK 타입 선언
declare global {
  interface Window {
    Kakao: any;
  }
}

// 카카오 SDK 초기화
const JAVASCRIPT_KEY = import.meta.env.VITE_APP_JAVASCRIPT_KEY;

window.Kakao.init(JAVASCRIPT_KEY);
window.Kakao.isInitialized();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
