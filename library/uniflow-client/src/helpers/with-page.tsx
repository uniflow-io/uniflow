import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { commitSetPage } from '../reducers/app/actions';
import { env } from '../utils';

export default function withPage(Component, page, seo) {
  class PageHelper extends React.Component {
    componentDidMount() {
      this.props.dispatch(commitSetPage(page));
    }

    render() {
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
                <meta
                  property="twitter:image"
                  content={`${env.get('clientUrl')}${seo.image.url}`}
                />
              )}
            </Helmet>
          )}
          <Component {...this.props} />
        </>
      );
    }
  }

  return connect((state) => ({
    app: state.app,
  }))(PageHelper);
}
