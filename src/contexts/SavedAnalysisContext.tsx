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
      const newAnalysis: SavedAnalysis = {
        ...action.payload,
        id: uuidv4(),
        date: new Date().toISOString(),
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
      const selectedAnalysis = state.analyses.find((a) => a.id === action.payload) || null;
      return {
        ...state,
        selectedAnalysis,
      };
    }
    case 'DELETE_ANALYSIS': {
      const analyses = state.analyses.filter((a) => a.id !== action.payload);
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
  const [state, dispatch] = useReducer(savedAnalysisReducer, initialState);

  useEffect(() => {
    const savedAnalyses = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedAnalyses) {
      dispatch({ type: 'SET_ANALYSES', payload: JSON.parse(savedAnalyses) });
    }
  }, []);

  const saveAnalysis = (analysis: Omit<SavedAnalysis, 'id' | 'date'>) => {
    dispatch({ type: 'SAVE_ANALYSIS', payload: analysis });
  };

  const loadAnalysis = (id: string) => {
    dispatch({ type: 'LOAD_ANALYSIS', payload: id });
  };

  const deleteAnalysis = (id: string) => {
    dispatch({ type: 'DELETE_ANALYSIS', payload: id });
  };

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
