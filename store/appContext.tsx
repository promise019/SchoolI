import React, { createContext, useContext, useState, useEffect } from 'react';
// Mock storage for demo purposes
const MockStorage = {
  getItem: async (key: string) => null,
  setItem: async (key: string, value: string) => {},
};
const AsyncStorage = MockStorage;
import { UNIVERSITIES, University } from '../constants/Universities';

interface AppState {
  university: University | null;
  setUniversity: (uni: University) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  isLoading: boolean;
  userProgress: number;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [university, setUniv] = useState<University | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProgress, setUserProgress] = useState(35); // Initial mock progress

  useEffect(() => {
    // Load persisted state
    const loadState = async () => {
      try {
        const savedUni = await AsyncStorage.getItem('selected_uni');
        if (savedUni) {
          const found = UNIVERSITIES.find(u => u.id === savedUni);
          if (found) setUniv(found);
        }
        
        const auth = await AsyncStorage.getItem('is_authenticated');
        if (auth === 'true') setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to load app state', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadState();
  }, []);

  const setUniversity = async (uni: University) => {
    setUniv(uni);
    await AsyncStorage.setItem('selected_uni', uni.id);
  };

  const updateAuth = async (auth: boolean) => {
    setIsAuthenticated(auth);
    await AsyncStorage.setItem('is_authenticated', String(auth));
  };

  return (
    <AppContext.Provider value={{ 
      university, 
      setUniversity, 
      isAuthenticated, 
      setIsAuthenticated: updateAuth,
      isLoading,
      userProgress
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
