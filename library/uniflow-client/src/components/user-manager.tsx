import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSettings } from '../reducers/user/actions';
import { matchRoute } from '../routes';
import { fetchFeed, getFeedItem, commitSetSlugFeed } from '../reducers/feed/actions';

class UserManager extends Component {
  state = {
    fetching: false,
  };

  componentDidMount() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'auth' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const { auth, location } = this.props;

    if (auth.isAuthenticated) {
      this.onFetchUser(auth.uid, auth.token);
    }

    this.onLocation(location);
  }

  componentDidUpdate(prevProps) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'auth' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const { auth, location } = this.props;

    if (auth.isAuthenticated && auth.token !== prevProps.auth.token) {
      this.onFetchUser(auth.uid, auth.token);
    }

    if (location.href !== prevProps.location.href) {
      this.onLocation(location);
    }
  }

  onLocation = (location) => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'auth' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const { auth } = this.props;
    const match = matchRoute(location.pathname);

    if (match) {
      const params = match.match.params;
      const paths = [params.slug1, params.slug2, params.slug3, params.slug4, params.slug5].filter(
        (path) => !!path
      );
      if (match.route === 'feed' && auth.isAuthenticated) {
        this.onFetchItem(auth.uid, paths);
      } else if (match.route === 'userFeed') {
        this.onFetchItem(params.uid, paths);
      }
    }
  };

  onFetchUser = (uid, token) => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
    Promise.all([this.props.dispatch(fetchSettings(uid, token))]).then(() => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'location' does not exist on type 'Readon... Remove this comment to see the full error message
      const { location } = this.props;

      this.onLocation(location);
    });
  };

  isCachedFeed = (uid, paths = []) => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'feed' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const { feed } = this.props;
    if (
      feed.uid === undefined ||
      feed.slug === undefined ||
      feed.parentFolder === undefined ||
      feed.uid !== uid
    ) {
      return false;
    }

    const path = `/${paths.join('/')}`;
    const parentPath = `/${paths.slice(0, -1).join('/')}`;
    const slug = paths.length > 0 ? paths[paths.length - 1] : null;
    const item = getFeedItem(feed, slug);

    if (paths.length === 0 && feed.parentFolder === null) {
      return true;
    } else if (paths.length === 1 && feed.parentFolder === null) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'unknown'.
      if (item.type === 'folder') {
        return false;
      }

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
      this.props.dispatch(commitSetSlugFeed(slug));
      return true;
    } else if (paths.length === 1 && feed.parentFolder) {
      const parentFolderRealPath = `${
        feed.parentFolder.path === '/' ? '' : feed.parentFolder.path
      }/${feed.parentFolder.slug}`;
      if (parentFolderRealPath === path) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
        this.props.dispatch(commitSetSlugFeed(null));
        return true;
      }
    } else if (paths.length > 1 && feed.parentFolder) {
      const parentFolderRealPath = `${
        feed.parentFolder.path === '/' ? '' : feed.parentFolder.path
      }/${feed.parentFolder.slug}`;
      if (parentFolderRealPath === path) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
        this.props.dispatch(commitSetSlugFeed(null));
        return true;
      } else if (parentFolderRealPath === parentPath) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'unknown'.
        if (item.type === 'folder') {
          return false;
        }

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
        this.props.dispatch(commitSetSlugFeed(slug));

        return true;
      }
    }

    return false;
  };

  onFetchItem = (uid, paths = []) => {
    const { fetching } = this.state;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'auth' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const { auth } = this.props;

    if (fetching) {
      return;
    }

    Promise.resolve()
      .then(async () => {
        return new Promise((resolve) => {
          // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '(value: unknown) => void' is not... Remove this comment to see the full error message
          this.setState({ fetching: true }, resolve);
        });
      })
      .then(async () => {
        if (this.isCachedFeed(uid, paths)) {
          return;
        }

        const token = auth.isAuthenticated ? auth.token : null;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
        return this.props.dispatch(fetchFeed(uid, paths, token));
      })
      .then(async () => {
        return new Promise((resolve) => {
          // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '(value: unknown) => void' is not... Remove this comment to see the full error message
          this.setState({ fetching: false }, resolve);
        });
      });
  };

  render() {
    return <></>;
  }
}

export default connect((state) => {
  return {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'auth' does not exist on type 'DefaultRoo... Remove this comment to see the full error message
    auth: state.auth,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'DefaultRoo... Remove this comment to see the full error message
    user: state.user,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'feed' does not exist on type 'DefaultRoo... Remove this comment to see the full error message
    feed: state.feed,
  };
})(UserManager);
