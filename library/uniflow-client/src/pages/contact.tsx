import React from 'react';
import Contact, { ContactProps } from '../views/contact';
import { withPage } from '../helpers';
import { PageProps } from 'gatsby';

export default ({ location }: PageProps) => {
  const ContactPage = withPage<ContactProps>(Contact, 'contact', {
    location,
    title: 'Contact',
    description: 'Contact',
  });

  return <ContactPage />;
};
