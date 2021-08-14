import React from 'react';
import { connect } from 'react-redux';
import { commitSetPage } from '../reducers/app/actions';
import Helmet from 'react-helmet';

export default function withPage(Component, page, seo) {
  class PageHelper extends React.Component {
    componentDidMount() {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
      this.props.dispatch(commitSetPage(page));
    }

    render() {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'env' does not exist on type 'Readonly<{}... Remove this comment to see the full error message
      const { env } = this.props;

      return (
        <>
          {seo && (
            <Helmet>
              <title>{seo.title}</title>
              <link rel="canonical" href={`${env.url}${seo.location.pathname}`} />
              {seo.description && <meta name="description" content={seo.description} />}

              <meta property="og:title" content={seo.title} />
              {seo.description && <meta property="og:description" content={seo.description} />}
              <meta property="og:url" content={`${env.url}${seo.location.pathname}`} />
              {seo.type && <meta property="og:type" content={seo.type} />}
              {seo.title && <meta property="og:title" content={seo.title} />}
              {seo.image &&
                typeof seo.image === 'string' && [
                  <meta key="og:image" property="og:image" content={`${env.url}${seo.image}`} />,
                  <meta key="og:image:width" property="og:image:width" content="" />,
                  <meta key="og:image:height" property="og:image:height" content="" />,
                ]}
              {seo.image &&
                typeof seo.image !== 'string' && [
                  <meta
                    key="og:image"
                    property="og:image"
                    content={`${env.url}${seo.image.url}`}
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
                <meta name="twitter:image" content={`${env.url}${seo.image}`} />
              )}
              {seo.image && typeof seo.image !== 'string' && (
                <meta property="twitter:image" content={`${env.url}${seo.image.url}`} />
              )}
            </Helmet>
          )}
          <Component {...this.props} />
        </>
      );
    }
  }

  return connect((state) => ({
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'env' does not exist on type 'DefaultRoot... Remove this comment to see the full error message
    env: state.env,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'app' does not exist on type 'DefaultRoot... Remove this comment to see the full error message
    app: state.app,
  }))(PageHelper);
}
