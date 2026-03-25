import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 🔥 TELEGRAM WEBAPP INIT (Before React)
function initTelegramWebApp() {
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    
    // Essential setup
    tg.ready();
    tg.expand();  // Fullscreen
    
    // Theme sync
    document.body.style.backgroundColor = tg.colorScheme === 'dark' 
      ? '#1a1a1a' 
      : '#f8fdf8';
    
    // Vibrate on interactions (mobile)
    document.addEventListener('click', () => tg.HapticFeedback.impactOccurred('light'));
    
    console.log('✅ Telegram WebApp initialized');
  }
}

// Init before React
initTelegramWebApp();

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
