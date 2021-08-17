import React from 'react';
import Blog, { BlogProps } from '../views/blog/blog';
import { withPage } from '../helpers';
import { PageProps } from 'gatsby';

export default ({ location }: PageProps) => {
  const BlogPage = withPage<BlogProps>(Blog, 'blog', {
    location,
    title: 'Blog',
    description: 'Blog',
  });

  return <BlogPage />;
};
