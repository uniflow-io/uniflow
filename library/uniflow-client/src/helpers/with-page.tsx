import React, { ComponentType } from 'react';
import Helmet from 'react-helmet';
import Container from '../container';
import { Env } from '../services';
import { useEffect } from 'react';
import { useApp } from '../contexts/app';
import { WindowLocation, createMemorySource, createHistory, LocationProvider } from '@reach/router';

const container = new Container();
const env = container.get(Env);

export interface WithPageProps {
  location: WindowLocation
}

export default function withPage<T>(Component: ComponentType<T>, page: string, seo: {
  title: string,
  description: string,
  location: WindowLocation,
  type?: string,
  image?: string | {url: string, width: string, height: string}
}) {
  function PageHelper(props: T) {
    const app = useApp();
    const source = createMemorySource(location.pathname)
    const history = createHistory(source)

    useEffect(() => {
      app.setPage(page);
    });

    return (
      <>
        {seo && (
          <Helmet>
            <title>{seo.title}</title>
            <link rel="canonical" href={`${env.get('clientUrl')}${seo.location.pathname}`} />
            {seo.description && <meta name="description" content={seo.description} />}

            <meta property="og:title" content={seo.title} />
            {seo.description && <meta property="og:description" content={seo.description} />}
            <meta property="og:url" content={`${env.get('clientUrl')}${seo.location.pathname}`} />
            {seo.type && <meta property="og:type" content={seo.type} />}
            {seo.title && <meta property="og:title" content={seo.title} />}
            {seo.image &&
              typeof seo.image === 'string' && [
                <meta
                  key="og:image"
                  property="og:image"
                  content={`${env.get('clientUrl')}${seo.image}`}
                />,
                <meta key="og:image:width" property="og:image:width" content="" />,
                <meta key="og:image:height" property="og:image:height" content="" />,
              ]}
            {seo.image &&
              typeof seo.image !== 'string' && [
                <meta
                  key="og:image"
                  property="og:image"
                  content={`${env.get('clientUrl')}${seo.image.url}`}
                />,
                <meta key="og:image:width" property="og:image:width" content={seo.image.width} />,
                <meta
                  key="og:image:height"
                  property="og:image:height"
                  content={seo.image.height}
                />,
              ]}

            {seo.title && <meta name="twitter:title" content={seo.title} />}
            {seo.description && <meta name="twitter:description" content={seo.description} />}
            {seo.image && typeof seo.image === 'string' && (
              <meta name="twitter:image" content={`${env.get('clientUrl')}${seo.image}`} />
            )}
            {seo.image && typeof seo.image !== 'string' && (
              <meta property="twitter:image" content={`${env.get('clientUrl')}${seo.image.url}`} />
            )}
          </Helmet>
        )}
        <LocationProvider history={history}>
          <Component {...props} />
        </LocationProvider>
      </>
    );
  }

  return PageHelper;
}
