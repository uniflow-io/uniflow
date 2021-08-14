import React, { Component } from 'react';
import Navigation from './navigation';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './index.mdx' or its correspond... Remove this comment to see the full error message
import MDXDocument from './index.mdx';
import { MDXProvider } from '../../components';

class Library extends Component {
  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'library' does not exist on type 'Readonl... Remove this comment to see the full error message
    const { library } = this.props;

    return (
      <div className="container-fluid">
        <div className="row flex-xl-nowrap">
          {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
          <Navigation library={library} />
          <section className="section col">
            <MDXProvider>
              <MDXDocument />
            </MDXProvider>
          </section>
        </div>
      </div>
    );
  }
}

export default Library;
