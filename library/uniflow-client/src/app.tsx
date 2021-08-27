import React, { StrictMode } from 'react';
import { Children } from 'react';
import { ReactChild } from 'react';
import { FC } from 'react';
import {
  AppProvider,
  AuthProvider,
  FeedProvider,
  LogsProvider,
  GraphProvider,
  UserProvider,
} from './contexts';
import { composeWrappers } from './helpers';

export interface AppProps {
  element: any;
}

const App: FC<AppProps> = ({ element }) => {
  const Providers = composeWrappers([
    (props) => <AppProvider>{props.children}</AppProvider>,
    (props) => <AuthProvider>{props.children}</AuthProvider>,
    (props) => <FeedProvider>{props.children}</FeedProvider>,
    (props) => <LogsProvider>{props.children}</LogsProvider>,
    (props) => <GraphProvider>{props.children}</GraphProvider>,
    (props) => <UserProvider>{props.children}</UserProvider>,
  ]);

  return (
    <StrictMode>
      <Providers>{element}</Providers>
    </StrictMode>
  );
};

export default App;
