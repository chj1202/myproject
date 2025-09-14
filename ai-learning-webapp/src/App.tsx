import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Home from './components/Home';
import MLExperience from './components/MLExperience';
import DataScience from './components/DataScience';
import AIEthics from './components/AIEthics';
import PracticalTools from './components/PracticalTools';
import Progress from './components/Progress';

// Types
export interface UserProgress {
  level: number;
  xp: number;
  badges: string[];
  moduleProgress: {
    ml: number;
    dataScience: number;
    ethics: number;
    tools: number;
  };
}

const App: React.FC = () => {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    xp: 0,
    badges: [],
    moduleProgress: {
      ml: 0,
      dataScience: 0,
      ethics: 0,
      tools: 0
    }
  });

  const [darkMode, setDarkMode] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('aiLearningProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }

    const savedTheme = localStorage.getItem('aiLearningTheme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('aiLearningProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem('aiLearningTheme', darkMode ? 'dark' : 'light');
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  const addXP = (amount: number) => {
    setUserProgress(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      return {
        ...prev,
        xp: newXP,
        level: newLevel
      };
    });
  };

  const addBadge = (badgeName: string) => {
    setUserProgress(prev => {
      if (!prev.badges.includes(badgeName)) {
        return {
          ...prev,
          badges: [...prev.badges, badgeName]
        };
      }
      return prev;
    });
  };

  const updateModuleProgress = (module: keyof UserProgress['moduleProgress'], progress: number) => {
    setUserProgress(prev => ({
      ...prev,
      moduleProgress: {
        ...prev.moduleProgress,
        [module]: Math.max(prev.moduleProgress[module], progress)
      }
    }));
  };

  return (
    <Router>
      <div className={`app ${darkMode ? 'dark' : 'light'}`}>
        <Navbar
          userProgress={userProgress}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home userProgress={userProgress} />} />
            <Route
              path="/ml-experience"
              element={
                <MLExperience
                  addXP={addXP}
                  addBadge={addBadge}
                  updateProgress={(progress) => updateModuleProgress('ml', progress)}
                />
              }
            />
            <Route
              path="/data-science"
              element={
                <DataScience
                  addXP={addXP}
                  addBadge={addBadge}
                  updateProgress={(progress) => updateModuleProgress('dataScience', progress)}
                />
              }
            />
            <Route
              path="/ai-ethics"
              element={
                <AIEthics
                  addXP={addXP}
                  addBadge={addBadge}
                  updateProgress={(progress) => updateModuleProgress('ethics', progress)}
                />
              }
            />
            <Route
              path="/practical-tools"
              element={
                <PracticalTools
                  addXP={addXP}
                  addBadge={addBadge}
                  updateProgress={(progress) => updateModuleProgress('tools', progress)}
                />
              }
            />
            <Route path="/progress" element={<Progress userProgress={userProgress} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
