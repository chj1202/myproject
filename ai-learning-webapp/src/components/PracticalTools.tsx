import React, { useState } from 'react';
import './PracticalTools.css';

interface PracticalToolsProps {
  addXP: (amount: number) => void;
  addBadge: (badge: string) => void;
  updateProgress: (progress: number) => void;
}

const PracticalTools: React.FC<PracticalToolsProps> = ({ addXP, addBadge, updateProgress }) => {
  const [currentTool, setCurrentTool] = useState<'blocks' | 'chatbot' | 'recommendation' | null>(null);
  const [chatbotResponses, setChatbotResponses] = useState<{question: string, answer: string}[]>([]);
  const [userInput, setUserInput] = useState('');

  const tools = [
    {
      id: 'blocks',
      title: '블록 코딩 인터페이스',
      description: '드래그 앤 드롭으로 AI 알고리즘을 만들어보세요',
      icon: '🧩'
    },
    {
      id: 'chatbot',
      title: '간단한 챗봇 만들기',
      description: '나만의 챗봇을 만들고 대화해보세요',
      icon: '🤖'
    },
    {
      id: 'recommendation',
      title: '추천 알고리즘 체험',
      description: '추천 시스템이 어떻게 작동하는지 알아보세요',
      icon: '💡'
    }
  ];

  const handleChatbotSubmit = () => {
    if (userInput.trim()) {
      const responses = [
        '안녕하세요! 무엇을 도와드릴까요?',
        'AI에 대해 궁금한 것이 있으신가요?',
        '흥미로운 질문이네요!',
        '더 자세히 설명해 주시겠어요?',
        'AI 학습이 재미있으시나요?'
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatbotResponses(prev => [...prev, { question: userInput, answer: randomResponse }]);
      setUserInput('');
      addXP(5);
    }
  };

  return (
    <div className="practical-tools">
      <div className="tools-header">
        <h1>🛠️ 실습 도구</h1>
        <p>직접 만들고 체험하며 AI 기술을 배워보세요!</p>
      </div>

      {!currentTool && (
        <div className="tools-selection">
          <div className="tools-grid">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="tool-card"
                onClick={() => setCurrentTool(tool.id as any)}
              >
                <div className="tool-icon">{tool.icon}</div>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentTool === 'chatbot' && (
        <div className="chatbot-tool">
          <div className="tool-header">
            <h2>🤖 나만의 챗봇</h2>
            <button onClick={() => setCurrentTool(null)} className="back-btn">← 돌아가기</button>
          </div>

          <div className="chatbot-container">
            <div className="chat-messages">
              {chatbotResponses.map((chat, index) => (
                <div key={index} className="chat-exchange">
                  <div className="user-message">
                    <strong>나:</strong> {chat.question}
                  </div>
                  <div className="bot-message">
                    <strong>AI:</strong> {chat.answer}
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="챗봇에게 메시지를 보내보세요..."
                onKeyPress={(e) => e.key === 'Enter' && handleChatbotSubmit()}
              />
              <button onClick={handleChatbotSubmit}>전송</button>
            </div>
          </div>
        </div>
      )}

      {(currentTool === 'blocks' || currentTool === 'recommendation') && (
        <div className="coming-soon">
          <div className="tool-header">
            <h2>🚧 준비 중</h2>
            <button onClick={() => setCurrentTool(null)} className="back-btn">← 돌아가기</button>
          </div>
          <div className="coming-soon-content">
            <div className="coming-soon-icon">⚠️</div>
            <h3>이 도구는 곧 출시될 예정입니다!</h3>
            <p>더 멋진 기능으로 찾아뵙겠습니다.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticalTools;