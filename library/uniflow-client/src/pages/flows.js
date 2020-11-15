import React from 'react'
import { PublicPrograms } from '../views'
import { withPage } from '../helpers'

export default ({ location }) => {
  const FlowsPage = withPage(PublicPrograms, 'flows', {
    location: location,
    title: 'Uniflow',
    description: 'Unified Workflow Automation Tool',
  })

  return <FlowsPage />
}
