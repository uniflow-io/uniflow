import React from 'react';
import Navigation, { NavigationProps } from './navigation';
import MDXDocument from './library.mdx';
import { MDXProvider } from '../../components';

export interface LibraryProps {
  library: NavigationProps['library']
}

function Library(props: LibraryProps) {
  const { library } = props;

  return (
    <div className="container-fluid">
      <div className="row flex-xl-nowrap">
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

export default Library;
