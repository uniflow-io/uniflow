import React, { useState } from 'react';
import { fetchSettings } from '../contexts/user';
import { matchRoute } from '../routes';
import { fetchFeed, getFeedItem, commitSetSlugFeed, useFeed } from '../contexts/feed';
import { useEffect } from 'react';
import { WindowLocation } from '@reach/router';
import { useAuth, useUser } from '../contexts';

export interface UserManagerProps {
  location: WindowLocation
}

function UserManager(props: UserManagerProps) {
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const { auth, authDispatch } = useAuth()
  const { userDispatch } = useUser()
  const { feed, feedDispatch } = useFeed()
  const { location } = props;

  const isCachedFeed = (uid: string, paths: string[] = []) => {
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
      if (item && item.type === 'folder') {
        return false;
      }

      commitSetSlugFeed(slug)(feedDispatch);
      return true;
    } else if (paths.length === 1 && feed.parentFolder) {
      const parentFolderRealPath = `${
        feed.parentFolder.path === '/' ? '' : feed.parentFolder.path
      }/${feed.parentFolder.slug}`;
      if (parentFolderRealPath === path) {
        commitSetSlugFeed(null)(feedDispatch);
        return true;
      }
    } else if (paths.length > 1 && feed.parentFolder) {
      const parentFolderRealPath = `${
        feed.parentFolder.path === '/' ? '' : feed.parentFolder.path
      }/${feed.parentFolder.slug}`;
      if (parentFolderRealPath === path) {
        commitSetSlugFeed(null)(feedDispatch);
        return true;
      } else if (parentFolderRealPath === parentPath) {
        if (item && item.type === 'folder') {
          return false;
        }

        commitSetSlugFeed(slug)(feedDispatch);

        return true;
      }
    }

    return false;
  };

  const onFetchItem = async (uid: string, paths: string[] = []) => {
    if (isFetching || isCachedFeed(uid, paths)) {
      return;
    }

    setIsFetching(true)

    const token = auth.isAuthenticated ? auth.token : undefined;
    await fetchFeed(uid, paths, token)(feedDispatch, userDispatch, authDispatch);

    setIsFetching(false)
  };

  const onLocation = async (location: WindowLocation) => {
    const match = matchRoute(location.pathname);

    if (match) {
      const params = match.match.params;
      const paths = [params.slug1, params.slug2, params.slug3, params.slug4, params.slug5].filter(
        (path) => !!path
      );
      if (match.route === 'feed' && auth.isAuthenticated && auth.uid) {
        await onFetchItem(auth.uid, paths);
      } else if (match.route === 'userFeed') {
        await onFetchItem(params.uid, paths);
      }
    }
  };

  const onFetchUser = async (uid: string, token: string) => {
    await Promise.all([fetchSettings(uid, token)(userDispatch, authDispatch)]);
  };

  useEffect(() => {
    if (auth.isAuthenticated && auth.uid && auth.token) {
      onFetchUser(auth.uid, auth.token);
    }
  }, [auth.token])

  useEffect(() => {
    onLocation(location);
  }, [location])

  return <></>;
}

export default UserManager;
