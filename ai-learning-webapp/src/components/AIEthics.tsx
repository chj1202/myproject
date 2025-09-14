import React, { useState } from 'react';
import './AIEthics.css';

interface AIEthicsProps {
  addXP: (amount: number) => void;
  addBadge: (badge: string) => void;
  updateProgress: (progress: number) => void;
}

const AIEthics: React.FC<AIEthicsProps> = ({ addXP, addBadge, updateProgress }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [userChoices, setUserChoices] = useState<number[]>([]);

  const scenarios = [
    {
      title: '자율주행차의 딜레마',
      situation: '자율주행차가 브레이크 고장으로 멈출 수 없는 상황에서 5명의 보행자와 1명의 승객 중 누구를 구해야 할까요?',
      options: [
        { text: '5명의 보행자를 구한다', points: 10 },
        { text: '1명의 승객을 구한다', points: 5 },
        { text: '판단을 미룬다', points: 3 }
      ]
    },
    {
      title: 'AI 채용 시스템의 공정성',
      situation: 'AI 채용 시스템이 특정 성별을 선호하는 편향을 보인다면 어떻게 해야 할까요?',
      options: [
        { text: '즉시 시스템을 중단한다', points: 15 },
        { text: '편향을 수정한 후 재사용한다', points: 10 },
        { text: '현재 시스템을 계속 사용한다', points: 0 }
      ]
    }
  ];

  const handleChoice = (choiceIndex: number) => {
    const newChoices = [...userChoices, choiceIndex];
    setUserChoices(newChoices);
    addXP(scenarios[currentScenario].options[choiceIndex].points);

    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      addBadge('윤리 수호자');
      updateProgress(100);
    }
  };

  return (
    <div className="ai-ethics">
      <div className="ethics-header">
        <h1>⚖️ AI 윤리 학습</h1>
        <p>AI가 가져올 윤리적 딜레마를 함께 고민해보세요</p>
      </div>

      {currentScenario < scenarios.length ? (
        <div className="scenario-card">
          <div className="scenario-header">
            <h2>{scenarios[currentScenario].title}</h2>
            <div className="scenario-progress">
              {currentScenario + 1} / {scenarios.length}
            </div>
          </div>

          <div className="scenario-situation">
            <p>{scenarios[currentScenario].situation}</p>
          </div>

          <div className="options-container">
            {scenarios[currentScenario].options.map((option, index) => (
              <button
                key={index}
                className="option-btn"
                onClick={() => handleChoice(index)}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="completion-card">
          <h2>🎉 모든 시나리오 완료!</h2>
          <p>AI 윤리에 대한 깊이 있는 고민을 해보셨습니다.</p>
          <button onClick={() => {
            setCurrentScenario(0);
            setUserChoices([]);
          }}>
            다시 시작하기
          </button>
        </div>
      )}
    </div>
  );
};

export default AIEthics;