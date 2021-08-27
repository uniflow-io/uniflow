import React, { FC } from 'react';
import Contact, { ContactProps } from '../views/contact';
import { withPage } from '../helpers';
import { PageProps } from 'gatsby';

const Page: FC<PageProps> = ({ location }) => {
  const ContactPage = withPage<ContactProps>(Contact, 'contact', {
    location,
    title: 'Contact',
    description: 'Contact',
  });

  return <ContactPage />;
};

export default Page;
