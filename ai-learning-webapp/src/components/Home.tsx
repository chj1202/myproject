import React from 'react';
import { Link } from 'react-router-dom';
import { UserProgress } from '../App';
import './Home.css';

interface HomeProps {
  userProgress: UserProgress;
}

const Home: React.FC<HomeProps> = ({ userProgress }) => {
  const modules = [
    {
      id: 'ml',
      title: '머신러닝 체험',
      description: '이미지 분류, 선형회귀, 의사결정 트리를 직접 체험해보세요',
      icon: '🤖',
      path: '/ml-experience',
      progress: userProgress.moduleProgress.ml,
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'dataScience',
      title: '데이터 사이언스 기초',
      description: '데이터 전처리, 편향 분석, 시각화를 배워보세요',
      icon: '📊',
      path: '/data-science',
      progress: userProgress.moduleProgress.dataScience,
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'ethics',
      title: 'AI 윤리 학습',
      description: 'AI의 윤리적 딜레마와 편향성 문제를 탐구해보세요',
      icon: '⚖️',
      path: '/ai-ethics',
      progress: userProgress.moduleProgress.ethics,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'tools',
      title: '실습 도구',
      description: '블록 코딩, 챗봇 만들기, 추천 시스템을 구현해보세요',
      icon: '🛠️',
      path: '/practical-tools',
      progress: userProgress.moduleProgress.tools,
      color: 'from-indigo-500 to-pink-600'
    }
  ];

  const achievements = [
    { name: 'AI 초보자', icon: '🌱', condition: userProgress.level >= 2 },
    { name: 'ML 마스터', icon: '🧠', condition: userProgress.moduleProgress.ml >= 100 },
    { name: '데이터 탐험가', icon: '🔍', condition: userProgress.moduleProgress.dataScience >= 100 },
    { name: '윤리 수호자', icon: '🛡️', condition: userProgress.moduleProgress.ethics >= 100 },
    { name: '도구 장인', icon: '⚡', condition: userProgress.moduleProgress.tools >= 100 }
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            AI 학습의 모든 것을
            <span className="gradient-text">재미있게!</span>
          </h1>
          <p className="hero-description">
            고등학생을 위한 인터랙티브 AI 학습 플랫폼입니다.
            게임을 하듯 즐겁게 AI의 세계를 탐험해보세요!
          </p>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-value">{userProgress.level}</div>
              <div className="stat-label">레벨</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{userProgress.xp}</div>
              <div className="stat-label">경험치</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{userProgress.badges.length}</div>
              <div className="stat-label">배지</div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-icon">🚀</div>
          <div className="floating-icon">💡</div>
          <div className="floating-icon">🎯</div>
          <div className="floating-icon">⭐</div>
        </div>
      </section>

      <section className="modules">
        <h2 className="section-title">학습 모듈</h2>
        <div className="modules-grid">
          {modules.map((module) => (
            <Link key={module.id} to={module.path} className="module-card">
              <div className={`module-header bg-gradient-to-br ${module.color}`}>
                <div className="module-icon">{module.icon}</div>
                <div className="module-progress">
                  <div
                    className="progress-fill"
                    style={{ width: `${module.progress}%` }}
                  ></div>
                  <span className="progress-text">{module.progress}%</span>
                </div>
              </div>
              <div className="module-content">
                <h3 className="module-title">{module.title}</h3>
                <p className="module-description">{module.description}</p>
                <div className="module-footer">
                  <span className="start-button">시작하기 →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="achievements">
        <h2 className="section-title">도전 과제</h2>
        <div className="achievements-grid">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`achievement-card ${achievement.condition ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-name">{achievement.name}</div>
              {achievement.condition && (
                <div className="achievement-badge">✓</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="quick-start">
        <div className="quick-start-content">
          <h2>지금 바로 시작해보세요!</h2>
          <p>재미있는 AI 게임으로 학습 여행을 떠나보세요</p>
          <div className="quick-buttons">
            <Link to="/ml-experience" className="quick-btn primary">
              🤖 ML 체험하기
            </Link>
            <Link to="/data-science" className="quick-btn secondary">
              📊 데이터 분석하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;