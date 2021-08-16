import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { Link } from 'gatsby';
import { Editor } from '../components';

const components = {
  h1: (props) => (
    <h3 className={'mb-3'} {...props}>
      {props.children}
    </h3>
  ),
  h2: (props) => <h4 {...props}>{props.children}</h4>,
  h3: (props) => <h5 {...props}>{props.children}</h5>,
  h4: (props) => <h5 {...props}>{props.children}</h5>,
  a: (props) => {
    if (props.href.indexOf('https://uniflow.io') === 0) {
      const to = props.href.slice('https://uniflow.io'.length);
      return <Link to={to.length === 0 ? '/' : to}>{props.children}</Link>;
    }

    return (
      <a href={props.href} target="_blank" rel="noopener noreferrer">
        {props.children}
      </a>
    );
  },
  img: (props) => (
    <span className="d-flex">
      <img className="img-fluid mx-auto" alt={props.alt} {...props} />
    </span>
  ),
  Link,
  code: (props) => {
    let language = 'html';
    if (props.className === 'language-javascript') {
      language = 'javascript';
    }
    if (props.className === 'language-jsx') {
      language = 'jsx';
    }

    return <Editor language={language} readonly={true} value={props.children} />;
  },
};

export default (props) => <MDXProvider components={components}>{props.children}</MDXProvider>;
