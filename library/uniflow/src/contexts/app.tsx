import React, { useContext, useEffect, useState } from 'react';
import { FC } from 'react';

export interface AppProviderProps {
  children: React.ReactNode;
}

type Theme = 'light' | 'dark' | 'sepia';

export interface AppProviderState {
  page: string;
  theme: Theme;
  setPage: (page: string) => void;
  switchTheme: Function;
}

export const AppContext = React.createContext<AppProviderState>({
  page: 'home',
  theme: 'light',
  setPage: () => {
    throw new Error('AppContext not yet initialized.');
  },
  switchTheme: () => {
    throw new Error('AppContext not yet initialized.');
  },
});
AppContext.displayName = 'AppContext';

export const AppProvider: FC<AppProviderProps> = (props) => {
  const [page, setPage] = useState<string>('home');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(JSON.parse(localStorage.getItem('theme') || '"light"'));
  });

  return (
    <AppContext.Provider
      value={{
        page,
        theme,
        setPage,
        switchTheme: () => {
          let switchTheme: Theme = 'light';
          if (theme === 'light') {
            switchTheme = 'dark';
          } else if (theme === 'dark') {
            switchTheme = 'sepia';
          } else if (theme === 'sepia') {
            switchTheme = 'light';
          }
          setTheme(switchTheme);

          localStorage.setItem('theme', JSON.stringify(switchTheme));
        },
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export const AppConsumer = AppContext.Consumer;

export function useApp() {
  return useContext(AppContext);
}
