import React, { useState } from 'react';
import './DataScience.css';

interface DataScienceProps {
  addXP: (amount: number) => void;
  addBadge: (badge: string) => void;
  updateProgress: (progress: number) => void;
}

const DataScience: React.FC<DataScienceProps> = ({ addXP, addBadge, updateProgress }) => {
  const [currentTool, setCurrentTool] = useState<'preprocessing' | 'bias' | 'visualization' | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const tools = [
    {
      id: 'preprocessing',
      title: '데이터 전처리 시뮬레이터',
      description: '실제 데이터를 정리하고 가공하는 과정을 체험해보세요',
      icon: '🔧',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'bias',
      title: '편향 데이터 문제 체험',
      description: '데이터의 편향성이 AI 결과에 미치는 영향을 알아보세요',
      icon: '⚖️',
      color: 'from-red-500 to-pink-600'
    },
    {
      id: 'visualization',
      title: '차트/그래프 해석 연습',
      description: '다양한 시각화 도구로 데이터를 분석해보세요',
      icon: '📊',
      color: 'from-green-500 to-emerald-600'
    }
  ];

  return (
    <div className="data-science">
      <div className="ds-header">
        <h1>📊 데이터 사이언스 기초</h1>
        <p>데이터의 힘을 발견하고 올바르게 해석하는 방법을 배워보세요!</p>
      </div>

      <div className="tools-grid">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className={`tool-card ${completedTasks.includes(tool.id) ? 'completed' : ''}`}
            onClick={() => setCurrentTool(tool.id as any)}
          >
            <div className={`tool-header bg-gradient-to-br ${tool.color}`}>
              <div className="tool-icon">{tool.icon}</div>
            </div>
            <div className="tool-content">
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
            </div>
          </div>
        ))}
      </div>

      {currentTool && (
        <div className="tool-modal">
          <div className="modal-content">
            <button onClick={() => setCurrentTool(null)} className="close-btn">×</button>
            <h2>도구 준비 중...</h2>
            <p>이 기능은 곧 업데이트될 예정입니다!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataScience;