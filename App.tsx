import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TERMS_DATA } from './constants';
import { Flashcard } from './components/Flashcard';
import { GameControls } from './components/GameControls';
import { fetchDefinition } from './services/geminiService';
import { FetchStatus } from './types';
import { BookOpen, Layers, ShieldCheck, BarChart3, Target, Cpu, Users } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Legal & Regulatory',
  'Advertising Ecosystem',
  'Metrics & KPIs',
  'Insurance Concepts',
  'GOAL Strategy',
  'Technology',
  'Competitors'
];

const CategoryIcon = ({ name }: { name: string }) => {
    switch(name) {
        case 'Legal & Regulatory': return <ShieldCheck className="w-4 h-4" />;
        case 'Advertising Ecosystem': return <Layers className="w-4 h-4" />;
        case 'Metrics & KPIs': return <BarChart3 className="w-4 h-4" />;
        case 'Insurance Concepts': return <BookOpen className="w-4 h-4" />;
        case 'GOAL Strategy': return <Target className="w-4 h-4" />;
        case 'Technology': return <Cpu className="w-4 h-4" />;
        case 'Competitors': return <Users className="w-4 h-4" />;
        default: return <Target className="w-4 h-4" />;
    }
};

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [definitionsCache, setDefinitionsCache] = useState<Record<string, string>>({});
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>(FetchStatus.IDLE);
  
  // Filter cards based on category
  const activeCards = useMemo(() => {
    if (selectedCategory === 'All') return TERMS_DATA;
    return TERMS_DATA.filter(t => t.category === selectedCategory);
  }, [selectedCategory]);

  const currentCard = activeCards[currentIndex];

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedCategory]);

  // Fetch definition when card is flipped if not in cache
  useEffect(() => {
    const loadDefinition = async () => {
      if (!currentCard || definitionsCache[currentCard.id]) {
        setFetchStatus(FetchStatus.SUCCESS);
        return;
      }

      setFetchStatus(FetchStatus.LOADING);
      const definition = await fetchDefinition(currentCard.term, currentCard.category);
      
      setDefinitionsCache(prev => ({
        ...prev,
        [currentCard.id]: definition
      }));
      setFetchStatus(FetchStatus.SUCCESS);
    };

    // Pre-fetch next card's definition silently to improve UX
    const prefetchNext = async () => {
        const nextIdx = currentIndex + 1;
        if (nextIdx < activeCards.length) {
            const nextCard = activeCards[nextIdx];
            if (!definitionsCache[nextCard.id]) {
                const def = await fetchDefinition(nextCard.term, nextCard.category);
                setDefinitionsCache(prev => ({ ...prev, [nextCard.id]: def }));
            }
        }
    }

    if (isFlipped) {
      loadDefinition();
    } else {
        // If we are looking at the front, we can quietly check if we have the data, or prepare.
        // We do nothing until flip to save tokens, OR we can fetch on mount.
        // Let's fetch on flip to be conservative with API calls, but maybe fetch when the card loads?
        // Let's trigger fetch immediately when the card becomes active so it's ready by the time they flip.
        loadDefinition();
        prefetchNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCard, isFlipped, currentIndex]); // Removed definitionsCache from deps to avoid loop

  const handleNext = () => {
    if (currentIndex < activeCards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 200); // Small delay for animation
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 200);
    }
  };

  const handleCorrect = () => {
    setSessionScore(prev => prev + 1);
    handleNext();
  };

  const handleIncorrect = () => {
    // Logic: Maybe shuffle it back into the deck? For now, just move next.
    handleNext();
  };

  const handleReset = () => {
    setSessionScore(0);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen bg-[#0B1221] text-white selection:bg-blue-500 selection:text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             {/* Simple Logo Representation */}
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                G
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">GOAL <span className="text-slate-400 font-normal">Academy</span></h1>
            </div>
          </div>
          <div className="text-xs text-slate-400 hidden sm:block">
            Internal Training Module v1.0
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-8 px-4 w-full max-w-7xl mx-auto">
        
        {/* Category Navigation */}
        <div className="w-full overflow-x-auto pb-4 mb-8 no-scrollbar">
          <div className="flex gap-2 justify-center min-w-max px-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 ring-1 ring-blue-500'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {cat !== 'All' && <CategoryIcon name={cat} />}
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Text */}
        <div className="mb-6 text-slate-400 text-sm font-medium">
          Card {currentIndex + 1} of {activeCards.length}
        </div>

        {/* Game Area */}
        <div className="w-full flex-1 flex flex-col items-center justify-start">
            {currentCard && (
                <Flashcard
                    term={currentCard}
                    definition={definitionsCache[currentCard.id] || null}
                    isFlipped={isFlipped}
                    status={fetchStatus}
                    onFlip={() => setIsFlipped(!isFlipped)}
                />
            )}
            
            <GameControls 
                onNext={handleNext}
                onPrev={handlePrev}
                onCorrect={handleCorrect}
                onIncorrect={handleIncorrect}
                onReset={handleReset}
                score={sessionScore}
                total={sessionScore + (currentIndex + 1 - sessionScore)} // Rough estimate of attempts
                isFlipped={isFlipped}
                canGoNext={currentIndex < activeCards.length - 1}
                canGoPrev={currentIndex > 0}
            />
        </div>

      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-600 text-xs border-t border-slate-900 bg-[#060912]">
        <p>&copy; {new Date().getFullYear()} Goal Platform LLC. Confidential & Proprietary Training Material.</p>
        <p className="mt-1">Powered by Google Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;