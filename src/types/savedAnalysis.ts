import { AnalysisResults } from './analysis';

export interface SavedAnalysisSummary {
  valuation: number;
  enterpriseValue: number;
  ltmEbitda: number;
  irr: number;
  moic: number;
  paybackPeriod: number;
}

export interface SavedAnalysis {
  id: string;
  companyName: string;
  industry?: string;
  date: string;
  results: AnalysisResults;
  summary: SavedAnalysisSummary;
}

export interface SavedAnalysisState {
  analyses: SavedAnalysis[];
  selectedAnalysis: SavedAnalysis | null;
}

export interface SavedAnalysisContextType {
  state: SavedAnalysisState;
  saveAnalysis: (analysis: Omit<SavedAnalysis, 'id' | 'date' | 'summary'>) => void;
  loadAnalysis: (id: string) => void;
  deleteAnalysis: (id: string) => void;
}
