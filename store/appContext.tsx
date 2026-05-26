import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { socketService } from '../services/socketService';
import { UNIVERSITIES, University } from '../constants/Universities';

interface UserInfo {
  name: string;
  fullName?: string;
  studentId?: string;
  id?: string;
  image?: string;
  gender: 'male' | 'female' | 'other';
}

interface AppState {
  university: University | null;
  setUniversity: (uni: University) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  isLoading: boolean;
  userProgress: number;
  user: UserInfo;
  themeOverride: 'light' | 'dark' | null;
  setThemeOverride: (theme: 'light' | 'dark' | null) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [university, setUniv] = useState<University | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProgress, setUserProgress] = useState(35); // Initial mock progress
  const [themeOverride, setTheme] = useState<'light' | 'dark' | null>(null);
  const [language, setLang] = useState('English');
  const [user, setUser] = useState<UserInfo>({
    name: 'John Doe',
    gender: 'male',
    // image: 'https://i.pravatar.cc/150?u=john', // Example user image
  });

  useEffect(() => {
    // Load persisted state
    const loadState = async () => {
      try {
        const savedUni = await AsyncStorage.getItem('selected_uni');
        if (savedUni) {
          const found = UNIVERSITIES.find((u: University) => u.id === savedUni);
          if (found) setUniv(found);
        }
        
        const token = await AsyncStorage.getItem('jwt_token');
        if (token) {
          try {
            const profileData = await api.getProfile();
            setUser({
              name: profileData.fullName || 'User',
              fullName: profileData.fullName,
              studentId: profileData.studentId,
              id: profileData._id,
              gender: 'male',
            });
            setIsAuthenticated(true);
            socketService.connect();
            if (profileData._id) {
              socketService.joinRoom(profileData._id); // Join personal room
            }
          } catch (apiErr) {
            console.error('Failed to validate token via API:', apiErr);
            // Optionally clear token if unauthorized, but keep simple for now
            setIsAuthenticated(false);
          }
        }
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
    if (!auth) {
      await AsyncStorage.removeItem('jwt_token');
      socketService.disconnect();
    }
  };

  return (
    <AppContext.Provider value={{ 
      university, 
      setUniversity, 
      isAuthenticated, 
      setIsAuthenticated: updateAuth,
      isLoading,
      userProgress,
      user,
      themeOverride,
      setThemeOverride: setTheme,
      language,
      setLanguage: setLang
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
