import React from 'react';
import Flows, { FlowsProps } from '../views/flows';
import { withPage } from '../helpers';
import { PageProps } from 'gatsby';

export default ({ location }: PageProps) => {
  const FlowsPage = withPage<FlowsProps>(Flows, 'flows', {
    location,
    title: 'Uniflow',
    description: 'Unified Workflow Automation Tool',
  });

  return <FlowsPage />;
};
