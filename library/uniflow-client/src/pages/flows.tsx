import React, { FC } from 'react';
import Flows, { FlowsProps } from '../views/flows';
import { withPage } from '../helpers';
import { PageProps } from 'gatsby';

const Page: FC<PageProps> = ({ location }) => {
  const FlowsPage = withPage<FlowsProps>(Flows, 'flows', {
    location,
    title: 'Uniflow',
    description: 'Unified Workflow Automation Tool',
  });

  return <FlowsPage />;
};

export default Page;
