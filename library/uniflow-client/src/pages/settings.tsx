import React from 'react';
import Settings, { SettingsProps } from '../views/settings';
import { requireAuthentication, withPage } from '../helpers';
import { PageProps } from 'gatsby';

export default ({ location }: PageProps) => {
  const AuthSettings = withPage<SettingsProps>(Settings, 'settings', {
    location,
    title: 'Settings',
    description: 'Settings',
  });
  const AuthSettingsPage = requireAuthentication<SettingsProps>(AuthSettings);

  return <AuthSettingsPage />;
};
