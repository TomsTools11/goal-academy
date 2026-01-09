import React from 'react';
import { Term, FetchStatus } from '../types';
import { Loader2, Zap } from 'lucide-react';

interface FlashcardProps {
  term: Term;
  definition: string | null;
  isFlipped: boolean;
  status: FetchStatus;
  onFlip: () => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  term,
  definition,
  isFlipped,
  status,
  onFlip,
}) => {
  return (
    <div
      className="group w-full max-w-2xl h-80 sm:h-96 cursor-pointer perspective-1000 mx-auto"
      onClick={onFlip}
    >
      <div
        className={`relative w-full h-full duration-500 transform-style-3d transition-all ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of Card */}
        <div className="absolute w-full h-full bg-slate-800 rounded-2xl shadow-[0_0_25px_rgba(0,140,255,0.15)] border border-slate-700 p-8 flex flex-col items-center justify-center backface-hidden">
          <div className="absolute top-4 left-6">
            <span className="text-xs font-bold tracking-wider text-blue-400 uppercase bg-blue-900/30 px-3 py-1 rounded-full">
              {term.category}
            </span>
          </div>
          
          <div className="text-center">
             {/* Logo Icon Placeholder - Goal Target */}
            <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {term.term}
            </h2>
            <p className="mt-4 text-slate-400 text-sm font-medium">Tap to reveal</p>
          </div>
          
          <div className="absolute bottom-6 right-6">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          </div>
        </div>

        {/* Back of Card */}
        <div className="absolute w-full h-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center rotate-y-180 backface-hidden">
          <div className="w-full h-full overflow-y-auto flex flex-col items-center justify-center">
            {status === FetchStatus.LOADING ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="text-slate-500 text-sm">Consulting AI Knowledge Base...</span>
              </div>
            ) : (
              <div className="text-center max-w-lg">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Definition
                </h3>
                <p className="text-lg md:text-xl text-slate-800 leading-relaxed font-medium">
                  {definition}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};