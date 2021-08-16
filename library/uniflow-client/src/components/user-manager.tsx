import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSettings } from '../reducers/user/actions';
import { matchRoute } from '../routes';
import { fetchFeed, getFeedItem, commitSetSlugFeed } from '../reducers/feed/actions';

export interface UserManagerProps {}

class UserManager extends Component<UserManagerProps> {
  state = {
    fetching: false,
  };

  componentDidMount() {
    const { auth, location } = this.props;

    if (auth.isAuthenticated) {
      this.onFetchUser(auth.uid, auth.token);
    }

    this.onLocation(location);
  }

  componentDidUpdate(prevProps) {
    const { auth, location } = this.props;

    if (auth.isAuthenticated && auth.token !== prevProps.auth.token) {
      this.onFetchUser(auth.uid, auth.token);
    }

    if (location.href !== prevProps.location.href) {
      this.onLocation(location);
    }
  }

  onLocation = (location) => {
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

  onFetchUser = async (uid, token) => {
    await Promise.all([this.props.dispatch(fetchSettings(uid, token))]);

    const { location } = this.props;
    this.onLocation(location);
  };

  isCachedFeed = (uid, paths = []) => {
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
      if (item.type === 'folder') {
        return false;
      }

      this.props.dispatch(commitSetSlugFeed(slug));
      return true;
    } else if (paths.length === 1 && feed.parentFolder) {
      const parentFolderRealPath = `${
        feed.parentFolder.path === '/' ? '' : feed.parentFolder.path
      }/${feed.parentFolder.slug}`;
      if (parentFolderRealPath === path) {
        this.props.dispatch(commitSetSlugFeed(null));
        return true;
      }
    } else if (paths.length > 1 && feed.parentFolder) {
      const parentFolderRealPath = `${
        feed.parentFolder.path === '/' ? '' : feed.parentFolder.path
      }/${feed.parentFolder.slug}`;
      if (parentFolderRealPath === path) {
        this.props.dispatch(commitSetSlugFeed(null));
        return true;
      } else if (parentFolderRealPath === parentPath) {
        if (item.type === 'folder') {
          return false;
        }

        this.props.dispatch(commitSetSlugFeed(slug));

        return true;
      }
    }

    return false;
  };

  onFetchItem = async (uid, paths = []) => {
    const { fetching } = this.state;
    const { auth } = this.props;

    if (fetching) {
      return;
    }

    await new Promise((resolve) => {
      this.setState({ fetching: true }, resolve);
    });

    if (this.isCachedFeed(uid, paths)) {
      return;
    }

    const token = auth.isAuthenticated ? auth.token : null;
    await this.props.dispatch(fetchFeed(uid, paths, token));

    await new Promise((resolve) => {
      this.setState({ fetching: false }, resolve);
    });
  };

  render() {
    return <></>;
  }
}

export default connect((state) => {
  return {
    auth: state.auth,
    user: state.user,
    feed: state.feed,
  };
})(UserManager);
