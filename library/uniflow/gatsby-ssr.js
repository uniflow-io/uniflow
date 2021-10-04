import 'reflect-metadata';
import React from 'react';
import Layout from './src/components/layout';
import App from './src/app';
/*
// bug with SSR generation, not integrating it now
export const wrapPageElement = ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>;
};
export const wrapRootElement = App;
*/
