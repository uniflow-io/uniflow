import React from 'react';
import { AppProvider, AuthProvider, FeedProvider, LogsProvider, GraphProvider, UserProvider } from './contexts';
import { composeWrappers } from './helpers';

export default ({ element }) => {
  const Providers = composeWrappers([
    props => <AppProvider>{props.children}</AppProvider>,
    props => <AuthProvider>{props.children}</AuthProvider>,
    props => <FeedProvider>{props.children}</FeedProvider>,
    props => <LogsProvider>{props.children}</LogsProvider>,
    props => <GraphProvider>{props.children}</GraphProvider>,
    props => <UserProvider>{props.children}</UserProvider>,
  ]);

  return <Providers>{element}</Providers>
}
