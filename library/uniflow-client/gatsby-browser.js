import './src/assets/styles/index.scss';
import React from 'react';
import Layout from './src/layouts';
import App from './src/app';
export const wrapPageElement = ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>;
};
export const wrapRootElement = App;
