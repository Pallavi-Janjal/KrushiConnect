import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { AppRoutes } from './routes/AppRoutes';
import { AppLoader } from './components/common/AppLoader';

// Remove the HTML-level splash (defined in index.html) once React renders
function dismissHtmlSplash() {
  const el = document.getElementById('html-splash');
  if (el) {
    el.classList.add('fade-out');
    setTimeout(() => el.remove(), 600);
  }
}

export function App() {
  const [appReady, setAppReady] = useState(false);

  // Dismiss HTML splash as soon as React renders (even before API is ready)
  useEffect(() => {
    dismissHtmlSplash();
  }, []);

  const handleReady = useCallback(() => {
    setAppReady(true);
  }, []);

  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppProvider>
            {/* Show React loader until server responds */}
            {!appReady && <AppLoader onReady={handleReady} />}

            {/* Render routes immediately so they can pre-fetch in background */}
            <div style={{ visibility: appReady ? 'visible' : 'hidden' }}>
              <AppRoutes />
            </div>
          </AppProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
