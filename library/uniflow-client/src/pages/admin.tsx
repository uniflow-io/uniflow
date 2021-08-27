import React, { FC } from 'react';
import Admin, { AdminProps } from '../views/admin';
import { requireAuthentication, withPage } from '../helpers';
import { PageProps } from 'gatsby';
import { ROLE } from '../models/api-type-interface';

const Page: FC<PageProps> = ({ location }) => {
  const AdminPage = withPage<AdminProps>(Admin, 'admin', {
    location,
    title: 'Admin',
    description: 'Admin',
  });
  const AuthAdminPage = requireAuthentication<AdminProps>(AdminPage, ROLE.SUPER_ADMIN);

  return <AuthAdminPage />;
};

export default Page;
