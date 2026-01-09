import React from 'react';
import { Check, X, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface GameControlsProps {
  onNext: () => void;
  onPrev: () => void;
  onCorrect: () => void;
  onIncorrect: () => void;
  onReset: () => void;
  score: number;
  total: number;
  isFlipped: boolean;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onNext,
  onPrev,
  onCorrect,
  onIncorrect,
  onReset,
  score,
  total,
  isFlipped,
  canGoNext,
  canGoPrev
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 px-4">
      {/* Scoring Section - Only visible when flipped to encourage self-assessment */}
      <div className={`transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={(e) => { e.stopPropagation(); onIncorrect(); }}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-medium transition-colors border border-red-500/20"
          >
            <X className="w-5 h-5" />
            Needs Study
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onCorrect(); }}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl font-medium transition-colors border border-emerald-500/20"
          >
            <Check className="w-5 h-5" />
            Got It
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between border border-slate-700">
        <button
          onClick={onPrev}
          disabled={!canGoPrev}
          className="p-2 rounded-lg hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="block text-xs text-slate-400 uppercase tracking-wider font-bold">Score</span>
            <span className="text-xl font-bold text-blue-400">{score}</span>
          </div>
          
          <div className="h-8 w-px bg-slate-700"></div>

          <div className="text-center">
             <button 
               onClick={onReset}
               className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
               title="Reset Session"
             >
                <RotateCcw className="w-3 h-3" />
                RESET
             </button>
          </div>
          
          <div className="h-8 w-px bg-slate-700"></div>

           <div className="text-center">
            <span className="block text-xs text-slate-400 uppercase tracking-wider font-bold">Progress</span>
            <span className="text-xl font-bold text-white">{total > 0 ? Math.round((score / total) * 100) : 0}%</span>
          </div>
        </div>

        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="p-2 rounded-lg hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};