import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import './MLExperience.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface MLExperienceProps {
  addXP: (amount: number) => void;
  addBadge: (badge: string) => void;
  updateProgress: (progress: number) => void;
}

const MLExperience: React.FC<MLExperienceProps> = ({ addXP, addBadge, updateProgress }) => {
  const [currentGame, setCurrentGame] = useState<'classification' | 'regression' | 'tree' | null>(null);
  const [score, setScore] = useState(0);
  const [completedGames, setCompletedGames] = useState<string[]>([]);

  // Image Classification Game State
  const [draggedImage, setDraggedImage] = useState<string | null>(null);
  const [classificationScore, setClassificationScore] = useState(0);
  const [classifiedItems, setClassifiedItems] = useState<string[]>([]);

  // Linear Regression State
  const [dataPoints, setDataPoints] = useState<{x: number, y: number}[]>([]);
  const [regressionLine, setRegressionLine] = useState<{slope: number, intercept: number} | null>(null);

  // Decision Tree State
  const [treeNodes, setTreeNodes] = useState<any[]>([]);
  const [currentNode, setCurrentNode] = useState(0);

  const images = [
    { name: '🐱', category: '동물', id: 'cat' },
    { name: '🚗', category: '교통수단', id: 'car' },
    { name: '🌸', category: '식물', id: 'flower' },
    { name: '🐕', category: '동물', id: 'dog' },
    { name: '✈️', category: '교통수단', id: 'plane' },
    { name: '🌳', category: '식물', id: 'tree' },
    { name: '🦋', category: '동물', id: 'butterfly' },
    { name: '🚲', category: '교통수단', id: 'bike' }
  ];

  const categories = ['동물', '교통수단', '식물'];

  useEffect(() => {
    const progress = (completedGames.length / 3) * 100;
    updateProgress(progress);
  }, [completedGames, updateProgress]);

  const handleDragStart = (e: React.DragEvent, imageId: string) => {
    setDraggedImage(imageId);
  };

  const handleDrop = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    if (!draggedImage) return;

    const image = images.find(img => img.id === draggedImage);
    if (image && image.category === category) {
      setClassificationScore(prev => prev + 10);
      setClassifiedItems(prev => [...prev, draggedImage]);
      addXP(10);

      if (classifiedItems.length + 1 === images.length) {
        addBadge('분류 마스터');
        completeGame('classification');
      }
    } else {
      setClassificationScore(prev => Math.max(0, prev - 5));
    }
    setDraggedImage(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const addDataPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = (1 - (e.clientY - rect.top) / rect.height) * 100;

    const newPoints = [...dataPoints, { x, y }];
    setDataPoints(newPoints);

    if (newPoints.length >= 3) {
      calculateRegression(newPoints);
    }
  };

  const calculateRegression = (points: {x: number, y: number}[]) => {
    const n = points.length;
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    setRegressionLine({ slope, intercept });

    if (points.length >= 5) {
      addXP(20);
      addBadge('회귀 분석가');
      completeGame('regression');
    }
  };

  const buildDecisionTree = () => {
    const nodes = [
      { question: '나이가 18세 이상인가요?', left: 1, right: 2 },
      { question: '학생인가요?', left: 3, right: 4 },
      { question: '직장인인가요?', left: 5, right: 6 },
      { result: '학생 할인 적용' },
      { result: '성인 요금 적용' },
      { result: '직장인 할인 적용' },
      { result: '일반 성인 요금' }
    ];

    setTreeNodes(nodes);
    setCurrentNode(0);
  };

  const navigateTree = (direction: 'left' | 'right') => {
    const node = treeNodes[currentNode];
    if (node && (node.left !== undefined || node.right !== undefined)) {
      const nextNode = direction === 'left' ? node.left : node.right;
      setCurrentNode(nextNode);

      const nextNodeData = treeNodes[nextNode];
      if (nextNodeData && nextNodeData.result) {
        addXP(15);
        addBadge('의사결정 트리 마스터');
        completeGame('tree');
      }
    }
  };

  const completeGame = (gameType: string) => {
    if (!completedGames.includes(gameType)) {
      setCompletedGames(prev => [...prev, gameType]);
    }
  };

  const resetGame = () => {
    setCurrentGame(null);
    setDraggedImage(null);
    setClassificationScore(0);
    setClassifiedItems([]);
    setDataPoints([]);
    setRegressionLine(null);
    setTreeNodes([]);
    setCurrentNode(0);
  };

  const chartData = {
    datasets: [
      {
        label: '데이터 포인트',
        data: dataPoints,
        backgroundColor: 'rgba(102, 126, 234, 0.6)',
        borderColor: 'rgba(102, 126, 234, 1)',
        showLine: false,
      },
      ...(regressionLine ? [{
        label: '회귀선',
        data: [
          { x: 0, y: regressionLine.intercept },
          { x: 100, y: regressionLine.slope * 100 + regressionLine.intercept }
        ],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        type: 'line' as const,
        pointRadius: 0,
      }] : [])
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: '선형 회귀 시각화'
      },
      legend: {
        display: true
      }
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        min: 0,
        max: 100
      },
      y: {
        min: 0,
        max: 100
      }
    }
  };

  return (
    <div className="ml-experience">
      <div className="ml-header">
        <h1>🤖 머신러닝 체험존</h1>
        <p>재미있는 게임을 통해 머신러닝의 핵심 개념을 배워보세요!</p>
        <div className="progress-overview">
          <div className="progress-item">
            <span>완료한 게임: {completedGames.length}/3</span>
            <div className="mini-progress">
              <div
                className="mini-progress-fill"
                style={{ width: `${(completedGames.length / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {!currentGame && (
        <div className="game-selection">
          <h2>게임을 선택하세요</h2>
          <div className="games-grid">
            <div
              className={`game-card ${completedGames.includes('classification') ? 'completed' : ''}`}
              onClick={() => setCurrentGame('classification')}
            >
              <div className="game-icon">🖼️</div>
              <h3>이미지 분류 게임</h3>
              <p>이미지를 올바른 카테고리로 드래그해보세요</p>
              {completedGames.includes('classification') && <div className="completed-badge">✓</div>}
            </div>

            <div
              className={`game-card ${completedGames.includes('regression') ? 'completed' : ''}`}
              onClick={() => setCurrentGame('regression')}
            >
              <div className="game-icon">📈</div>
              <h3>선형 회귀 도구</h3>
              <p>데이터 점을 클릭하여 회귀선을 만들어보세요</p>
              {completedGames.includes('regression') && <div className="completed-badge">✓</div>}
            </div>

            <div
              className={`game-card ${completedGames.includes('tree') ? 'completed' : ''}`}
              onClick={() => { setCurrentGame('tree'); buildDecisionTree(); }}
            >
              <div className="game-icon">🌳</div>
              <h3>의사결정 트리</h3>
              <p>질문에 답하며 의사결정 과정을 체험해보세요</p>
              {completedGames.includes('tree') && <div className="completed-badge">✓</div>}
            </div>
          </div>
        </div>
      )}

      {currentGame === 'classification' && (
        <div className="classification-game">
          <div className="game-header">
            <h2>🖼️ 이미지 분류 게임</h2>
            <div className="score">점수: {classificationScore}</div>
            <button onClick={resetGame} className="back-btn">← 돌아가기</button>
          </div>

          <div className="classification-area">
            <div className="images-to-classify">
              <h3>분류할 이미지들</h3>
              <div className="images-grid">
                {images.map(image => (
                  !classifiedItems.includes(image.id) && (
                    <div
                      key={image.id}
                      className="image-item"
                      draggable
                      onDragStart={(e) => handleDragStart(e, image.id)}
                    >
                      <div className="image-emoji">{image.name}</div>
                    </div>
                  )
                ))}
              </div>
            </div>

            <div className="category-boxes">
              <h3>카테고리</h3>
              <div className="categories">
                {categories.map(category => (
                  <div
                    key={category}
                    className="category-box"
                    onDrop={(e) => handleDrop(e, category)}
                    onDragOver={handleDragOver}
                  >
                    <h4>{category}</h4>
                    <div className="category-items">
                      {images
                        .filter(img => img.category === category && classifiedItems.includes(img.id))
                        .map(img => (
                          <span key={img.id} className="classified-item">{img.name}</span>
                        ))
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentGame === 'regression' && (
        <div className="regression-game">
          <div className="game-header">
            <h2>📈 선형 회귀 시각화 도구</h2>
            <div className="score">데이터 포인트: {dataPoints.length}</div>
            <button onClick={resetGame} className="back-btn">← 돌아가기</button>
          </div>

          <div className="regression-content">
            <div className="instructions">
              <p>그래프 영역을 클릭하여 데이터 포인트를 추가하세요. 3개 이상의 점을 찍으면 회귀선이 자동으로 생성됩니다!</p>
            </div>

            <div className="chart-container">
              <Line data={chartData} options={chartOptions} />
            </div>

            {regressionLine && (
              <div className="regression-info">
                <h4>회귀선 정보</h4>
                <p>기울기: {regressionLine.slope.toFixed(2)}</p>
                <p>y절편: {regressionLine.intercept.toFixed(2)}</p>
              </div>
            )}

            <button
              onClick={() => {
                setDataPoints([]);
                setRegressionLine(null);
              }}
              className="reset-chart-btn"
            >
              차트 초기화
            </button>
          </div>
        </div>
      )}

      {currentGame === 'tree' && (
        <div className="tree-game">
          <div className="game-header">
            <h2>🌳 의사결정 트리 체험</h2>
            <button onClick={resetGame} className="back-btn">← 돌아가기</button>
          </div>

          <div className="tree-content">
            <div className="tree-explanation">
              <p>의사결정 트리는 질문과 답변을 통해 결론에 도달하는 알고리즘입니다.</p>
            </div>

            {treeNodes[currentNode] && (
              <div className="tree-node">
                {treeNodes[currentNode].question ? (
                  <div className="question-node">
                    <h3>{treeNodes[currentNode].question}</h3>
                    <div className="decision-buttons">
                      <button
                        onClick={() => navigateTree('left')}
                        className="decision-btn yes"
                      >
                        예
                      </button>
                      <button
                        onClick={() => navigateTree('right')}
                        className="decision-btn no"
                      >
                        아니오
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="result-node">
                    <h3>🎉 결과</h3>
                    <p>{treeNodes[currentNode].result}</p>
                    <button onClick={() => setCurrentNode(0)} className="restart-btn">
                      다시 시작
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MLExperience;