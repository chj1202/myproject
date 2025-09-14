import React from 'react';
import { UserProgress } from '../App';
import './Progress.css';

interface ProgressProps {
  userProgress: UserProgress;
}

const Progress: React.FC<ProgressProps> = ({ userProgress }) => {
  const totalProgress = Object.values(userProgress.moduleProgress).reduce((sum, progress) => sum + progress, 0) / 4;

  const modules = [
    { name: '머신러닝 체험', key: 'ml', icon: '🤖', progress: userProgress.moduleProgress.ml },
    { name: '데이터 사이언스', key: 'dataScience', icon: '📊', progress: userProgress.moduleProgress.dataScience },
    { name: 'AI 윤리', key: 'ethics', icon: '⚖️', progress: userProgress.moduleProgress.ethics },
    { name: '실습 도구', key: 'tools', icon: '🛠️', progress: userProgress.moduleProgress.tools },
  ];

  const achievements = [
    { name: 'AI 초보자', icon: '🌱', unlocked: userProgress.level >= 2 },
    { name: '학습 열정가', icon: '🔥', unlocked: userProgress.xp >= 100 },
    { name: '완벽주义者', icon: '⭐', unlocked: totalProgress >= 100 },
    { name: '배지 수집가', icon: '🏆', unlocked: userProgress.badges.length >= 5 },
  ];

  return (
    <div className="progress">
      <div className="progress-header">
        <h1>📈 나의 학습 진행도</h1>
        <p>지금까지의 학습 여정을 확인해보세요!</p>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <div className="stat-value">{userProgress.level}</div>
            <div className="stat-label">레벨</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💎</div>
          <div className="stat-info">
            <div className="stat-value">{userProgress.xp}</div>
            <div className="stat-label">경험치</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏅</div>
          <div className="stat-info">
            <div className="stat-value">{userProgress.badges.length}</div>
            <div className="stat-label">배지</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-value">{Math.round(totalProgress)}%</div>
            <div className="stat-label">전체 진행도</div>
          </div>
        </div>
      </div>

      <div className="modules-progress">
        <h2>모듈별 진행도</h2>
        <div className="modules-grid">
          {modules.map((module) => (
            <div key={module.key} className="module-progress-card">
              <div className="module-header">
                <div className="module-icon">{module.icon}</div>
                <h3>{module.name}</h3>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${module.progress}%` }}
                ></div>
              </div>
              <div className="progress-percentage">{module.progress}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="achievements-section">
        <h2>달성한 업적</h2>
        <div className="achievements-grid">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-name">{achievement.name}</div>
              {achievement.unlocked && <div className="unlock-badge">✓</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="badges-section">
        <h2>획득한 배지</h2>
        {userProgress.badges.length > 0 ? (
          <div className="badges-list">
            {userProgress.badges.map((badge, index) => (
              <div key={index} className="badge-item">
                <span className="badge-icon">🏆</span>
                <span className="badge-name">{badge}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-badges">
            <p>아직 획득한 배지가 없습니다. 학습을 시작해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;