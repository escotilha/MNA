import { AnalysisResults } from './analysis';

export interface SavedAnalysis {
  id: string;
  companyName: string;
  industry?: string;
  date: string;
  results: AnalysisResults;
}

export interface SavedAnalysisState {
  analyses: SavedAnalysis[];
  selectedAnalysis: SavedAnalysis | null;
}

export interface SavedAnalysisContextType {
  state: SavedAnalysisState;
  saveAnalysis: (analysis: Omit<SavedAnalysis, 'id' | 'date'>) => void;
  loadAnalysis: (id: string) => void;
  deleteAnalysis: (id: string) => void;
}
