import React from 'react';
import { Blog } from '../views';
import { withPage } from '../helpers';

export default ({ location }) => {
  const BlogPage = withPage(Blog, 'blog', {
    location: location,
    title: 'Blog',
    description: 'Blog',
  });

  return <BlogPage />;
};
