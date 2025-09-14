import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserProgress } from '../App';
import './Navbar.css';

interface NavbarProps {
  userProgress: UserProgress;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ userProgress, darkMode, setDarkMode }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '홈', icon: '🏠' },
    { path: '/ml-experience', label: 'ML 체험', icon: '🤖' },
    { path: '/data-science', label: '데이터 사이언스', icon: '📊' },
    { path: '/ai-ethics', label: 'AI 윤리', icon: '⚖️' },
    { path: '/practical-tools', label: '실습 도구', icon: '🛠️' },
    { path: '/progress', label: '진행도', icon: '📈' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">AI Learning Hub</span>
        </Link>
      </div>

      <div className="navbar-menu">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="navbar-user">
        <div className="user-stats">
          <div className="level-badge">
            <span className="level-icon">⭐</span>
            <span>Lv.{userProgress.level}</span>
          </div>
          <div className="xp-bar">
            <div
              className="xp-fill"
              style={{ width: `${(userProgress.xp % 100)}%` }}
            ></div>
            <span className="xp-text">{userProgress.xp % 100}/100 XP</span>
          </div>
        </div>

        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle theme"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;