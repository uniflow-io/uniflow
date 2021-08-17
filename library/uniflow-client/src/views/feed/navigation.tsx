import React, { useState } from 'react';
import { Link } from 'gatsby';
import { navigate } from 'gatsby';
import {
  getOrderedFeed,
  createProgram,
  getFeedItem,
  createFolder,
  toFeedPath,
  useFeed,
  commitSetSlugFeed,
  FeedItem,
} from '../../contexts/feed';
import { commitAddLog, useLogs } from '../../contexts/logs';
import { faBars, faFolder, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth, useUser } from '../../contexts';

export interface NavigationProps {}

export interface NavigationState {}

function Navigation(props: NavigationProps) {
  const [search, setSearch] = useState<string>('')
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true)
  const { auth } = useAuth()
  const { logsDispatch } = useLogs()
  const { user, userDispatch } = useUser()
  const { feed, feedDispatch } = useFeed()
  const { authDispatch } = useAuth()

  const onSearch: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearch(event.target.value);
  };

  const onToggle: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setIsCollapsed(!isCollapsed);
  };

  const onCreateFolder: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    const folderPath = feed.parentFolder
      ? `${feed.parentFolder.path}/${feed.parentFolder.slug}`
      : '/';

    try {
      const item = await createFolder(
        {
          name: search,
          path: folderPath,
        },
        auth.uid,
        auth.token
      )(feedDispatch, userDispatch, authDispatch)
      commitSetSlugFeed(null)(feedDispatch);
      navigate(toFeedPath(item, user));
    } catch (error) {
      return commitAddLog(error.message)(logsDispatch);
    }
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const { feed } = props;
    const folderPath = feed.parentFolder
      ? `${feed.parentFolder.path}/${feed.parentFolder.slug}`
      : '/';

    try {
      const item = await createProgram(
        {
          name: search,
          clients: ['uniflow'],
          tags: [],
          path: folderPath,
        },
        auth.uid,
        auth.token
      )(feedDispatch, userDispatch, authDispatch)
      navigate(toFeedPath(item, user));
    } catch (error) {
      return commitAddLog(error.message)(logsDispatch);
    }
  };

  const currentItem = getFeedItem(feed);
  const folderActiveClass = () => {
    return feed.parentFolder &&
      feed.parentFolder.slug === feed.slug
      ? 'active'
      : undefined;
  };
  const itemActiveClass = (item: FeedItem) => {
    return currentItem && currentItem.entity.slug === item.entity.slug ? 'active' : undefined;
  };

  return (
    <div className="sidebar">
      <form
        className="sidebar-search d-flex align-items-center"
        role="search"
        onSubmit={onSubmit}
      >
        <div className="input-group">
          <input
            type="search"
            className="form-control ds-input"
            placeholder="Search..."
            aria-label="Search for..."
            value={search}
            onChange={onSearch}
          />
          {search && (
            <button className="input-group-text" type="button" onClick={onCreateFolder}>
              <FontAwesomeIcon icon={faFolder} />
            </button>
          )}
        </div>
        <button
          className="btn d-sm-none p-0 ml-3 isCollapsedd"
          type="button"
          onClick={onToggle}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </form>
      <nav className={`sidebar-nav${isCollapsed ? ' d-none d-sm-block' : ''}`}>
        <div className="sidebar-section">
          <ul className="sidebar-items">
            {feed.parentFolder && [
              <li key={'back'}>
                <span className="link">
                  <FontAwesomeIcon icon={faArrowLeft} /> Back
                </span>
                <Link to={toFeedPath(feed.parentFolder, user, true)}>
                  Back
                </Link>
              </li>,
              <li className={folderActiveClass()} key={'folder'}>
                <span className="link">.</span>
                <Link to={toFeedPath(feed.parentFolder, user)}>.</Link>
              </li>,
            ]}
            {getOrderedFeed(feed, search).map((item, i) => (
              <li className={itemActiveClass(item)} key={i}>
                <span className="link">
                  {item.type === 'folder' && (
                    <>
                      <FontAwesomeIcon icon={faFolder} /> {item.entity.name}{' '}
                    </>
                  )}
                  {item.type === 'program' && <>{item.entity.name} </>}
                  {item.type === 'program' && 'tags' in item.entity &&
                    item.entity.tags.map((tag, j) => (
                      <span key={j} className="badge badge-light mr-1">
                        {tag}
                      </span>
                    ))}
                </span>
                <Link to={toFeedPath(item.entity, user)}>{item.entity.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
