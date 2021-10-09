import React from 'react';
import Tags, { TagsProps } from '@uniflow-io/uniflow-client/src/views/blog/tags';
import { withPage } from '@uniflow-io/uniflow-client/src/helpers';
import { PageProps } from 'gatsby';

export interface TagsTemplateData {}

export interface TagsTemplateContext {
  tags: TagsProps['tags'];
}

export default ({
  location,
  pageContext: { tags },
}: PageProps<TagsTemplateData, TagsTemplateContext>) => {
  const TagsPage = withPage(Tags, 'tags', {
    location,
    title: 'Tags',
    description: 'Tags',
  });

  return <TagsPage tags={tags} />;
};
