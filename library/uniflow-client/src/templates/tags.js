import React from 'react'
import { Tags } from '../views'
import { withPage } from '../helpers'

export default ({ location, pageContext: { tags } }) => {
  const TagsPage = withPage(Tags, 'tags', {
    location: location,
    title: 'Tags',
    description: 'Tags',
  })

  return <TagsPage tags={tags} />
}
