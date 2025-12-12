import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { BlogsPage } from './pages/BlogsPage';
import { PostDetailPage } from './pages/PostDetailPage';
import './App.css';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Check if user has seen the welcome screen before
    const hasSeenWelcome = localStorage.getItem('welcomeScreenSeen');
    if (hasSeenWelcome) {
      setShowWelcome(false);
    }
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    localStorage.setItem('welcomeScreenSeen', 'true');
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* Welcome Screen - shows only on first visit */}
      {showWelcome && <WelcomeScreen onComplete={handleWelcomeComplete} />}

      {/* Noise texture overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Floating Navigation - hidden during welcome */}
      {!showWelcome && <Navbar />}

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
      </Routes>

      {/* Footer */}
      <footer className="border-t border-border-color px-6 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-mono text-sm text-ink/50 tracking-wide">
            © {new Date().getFullYear()} Kobie's Blog. Created with WordPress.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
