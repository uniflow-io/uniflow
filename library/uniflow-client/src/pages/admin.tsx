import React from 'react';
import Admin, { AdminProps } from '../views/admin';
import { requireAuthentication, withPage } from '../helpers';
import { PageProps } from 'gatsby';
import { ROLE } from '../models/api-type-interface';

export default ({ location }: PageProps) => {
  const AdminPage = withPage<AdminProps>(Admin, 'admin', {
    location,
    title: 'Admin',
    description: 'Admin',
  });
  const AuthAdminPage = requireAuthentication<AdminProps>(AdminPage, ROLE.SUPER_ADMIN);

  return <AuthAdminPage />;
};
