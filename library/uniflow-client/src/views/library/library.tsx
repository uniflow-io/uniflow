import React from 'react';
import Navigation, { NavigationProps } from './navigation';
import MDXDocument from './library.mdx';
import { MDXProvider } from '../../components';
import { FC } from 'react';

export interface LibraryProps {
  library: NavigationProps['library'];
}

const Library: FC<LibraryProps> = (props) => {
  const { library } = props;

  return (
    <div className="container-fluid">
      <div className="row flex-sm-nowrap">
        <Navigation library={library} />
        <section className="section section-with-sidebar col">
          <MDXProvider>
            <MDXDocument />
          </MDXProvider>
        </section>
      </div>
    </div>
  );
};

export default Library;
