export interface Term {
  id: string;
  category: string;
  term: string;
  definition?: string; // Optional because we fetch it via AI
}

export interface GameState {
  currentCardIndex: number;
  isFlipped: boolean;
  score: number;
  sessionTotal: number;
  history: Record<string, boolean>; // id -> answered correctly
}

export enum FetchStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}