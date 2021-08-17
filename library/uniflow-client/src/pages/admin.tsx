import React from 'react';
import Admin, { AdminProps } from '../views/admin';
import { requireAuthentication, withPage } from '../helpers';
import { PageProps } from 'gatsby';

export default ({ location }: PageProps) => {
  const AdminPage = withPage<AdminProps>(Admin, 'admin', {
    location,
    title: 'Admin',
    description: 'Admin',
  });
  const AuthAdminPage = requireAuthentication<AdminProps>(AdminPage, 'ROLE_SUPER_ADMIN');

  return <AuthAdminPage />;
};
