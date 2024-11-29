import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { SavedAnalysis, SavedAnalysisContextType, SavedAnalysisState } from '../types/savedAnalysis';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = 'savedAnalyses';

type Action =
  | { type: 'SAVE_ANALYSIS'; payload: Omit<SavedAnalysis, 'id' | 'date'> }
  | { type: 'LOAD_ANALYSIS'; payload: string }
  | { type: 'DELETE_ANALYSIS'; payload: string }
  | { type: 'SET_ANALYSES'; payload: SavedAnalysis[] };

const initialState: SavedAnalysisState = {
  analyses: [],
  selectedAnalysis: null,
};

function savedAnalysisReducer(state: SavedAnalysisState, action: Action): SavedAnalysisState {
  switch (action.type) {
    case 'SAVE_ANALYSIS': {
      const summary = {
        valuation: action.payload.results.valuation,
        enterpriseValue: action.payload.results.enterpriseValue,
        ltmEbitda: action.payload.results.ltmEbitda,
        irr: action.payload.results.returnMetrics.irr,
        moic: action.payload.results.returnMetrics.moic,
        paybackPeriod: action.payload.results.returnMetrics.paybackPeriod.years,
      };
      
      const newAnalysis: SavedAnalysis = {
        ...action.payload,
        id: uuidv4(),
        date: new Date().toISOString(),
        summary,
      };
      const analyses = [...state.analyses, newAnalysis];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(analyses));
      return {
        ...state,
        analyses,
        selectedAnalysis: newAnalysis,
      };
    }
    case 'LOAD_ANALYSIS': {
      const selectedAnalysis = state.analyses.find(
        (analysis) => analysis.id === action.payload
      );
      return {
        ...state,
        selectedAnalysis,
      };
    }
    case 'DELETE_ANALYSIS': {
      const analyses = state.analyses.filter(
        (analysis) => analysis.id !== action.payload
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(analyses));
      return {
        ...state,
        analyses,
        selectedAnalysis: state.selectedAnalysis?.id === action.payload ? null : state.selectedAnalysis,
      };
    }
    case 'SET_ANALYSES': {
      return {
        ...state,
        analyses: action.payload,
      };
    }
    default:
      return state;
  }
}

export const SavedAnalysisContext = createContext<SavedAnalysisContextType | undefined>(undefined);

export function SavedAnalysisProvider({ children }: { children: React.ReactNode }) {
  console.log('SavedAnalysisProvider rendering');
  const [state, dispatch] = useReducer(savedAnalysisReducer, initialState);

  useEffect(() => {
    console.log('SavedAnalysisProvider useEffect running');
    const savedAnalyses = localStorage.getItem(LOCAL_STORAGE_KEY);
    console.log('Saved analyses from localStorage:', savedAnalyses);
    if (savedAnalyses) {
      try {
        const parsedAnalyses = JSON.parse(savedAnalyses);
        console.log('Parsed analyses:', parsedAnalyses);
        dispatch({ type: 'SET_ANALYSES', payload: parsedAnalyses });
      } catch (error) {
        console.error('Error parsing saved analyses:', error);
      }
    }
  }, []);

  const saveAnalysis = (analysis: Omit<SavedAnalysis, 'id' | 'date'>) => {
    console.log('Saving analysis:', analysis);
    dispatch({ type: 'SAVE_ANALYSIS', payload: analysis });
  };

  const loadAnalysis = (id: string) => {
    console.log('Loading analysis:', id);
    dispatch({ type: 'LOAD_ANALYSIS', payload: id });
  };

  const deleteAnalysis = (id: string) => {
    console.log('Deleting analysis:', id);
    dispatch({ type: 'DELETE_ANALYSIS', payload: id });
  };

  console.log('Current state:', state);

  return (
    <SavedAnalysisContext.Provider
      value={{
        state,
        saveAnalysis,
        loadAnalysis,
        deleteAnalysis,
      }}
    >
      {children}
    </SavedAnalysisContext.Provider>
  );
}

export function useSavedAnalysis() {
  const context = useContext(SavedAnalysisContext);
  if (context === undefined) {
    throw new Error('useSavedAnalysis must be used within a SavedAnalysisProvider');
  }
  return context;
}
