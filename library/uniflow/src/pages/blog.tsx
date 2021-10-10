import React, { FC } from 'react';
import Blog, { BlogProps } from '../views/blog/blog';
import { withPage } from '../helpers';
import { PageProps } from 'gatsby';

const Page: FC<PageProps> = ({ location }) => {
  const BlogPage = withPage<BlogProps>(Blog, 'blog', {
    location,
    title: 'Blog',
    description: 'Blog',
  });

  return <BlogPage />;
};

export default Page;
