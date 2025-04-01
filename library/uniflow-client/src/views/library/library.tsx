import React from 'react';
import Navigation, { NavigationProps } from './navigation';
import { Link } from 'gatsby';
import { pathTo } from '../../routes';
//import MDXDocument from './library.mdx';
//import { MDXProvider } from '../../components';
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
          {/* <MDXProvider>
            <MDXDocument />
          </MDXProvider> */}
          <h1 id="library">Library</h1>
          <p>Uniflow Library list all <a href="https://www.npmjs.com/search?q=keywords:uniflow">NPM</a> public packages view as Card.</p>
          <p>Each Card that can combine multiple Catalogs such as Flows and Clients.</p>
          <p>Use the search bar to the left to find a Card.</p>
          <p>Flows and Clients are <Link to={pathTo('doc', {'slug': 'concepts'})}>key</Link> part of Uniflow.</p>
          <p>To make you own Flow or Client public, you can get more information at <Link to={pathTo('doc', {'slug': 'submitting-to-library'})}>Submitting to Library</Link></p>
          <p>If you are looking why we structured the whole project around Library concept, be sure get more interest by reading <a href="https://en.wikipedia.org/wiki/The_Library_of_Babel">The Library of Babel</a></p>
        </section>
      </div>
    </div>
  );
};

export default Library;
