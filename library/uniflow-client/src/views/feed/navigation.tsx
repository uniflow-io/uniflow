import React, { Component } from 'react';
import { Link } from 'gatsby';
import { navigate } from 'gatsby';
import { connect } from 'react-redux';
import {
  getOrderedFeed,
  createProgram,
  setSlugFeed,
  getFeedItem,
  createFolder,
  toFeedPath,
} from '../../reducers/feed/actions';
import { commitAddLog } from '../../reducers/logs/actions';
import { faBars, faFolder, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Navigation extends Component {
  state = {
    search: '',
    collapse: true,
  };

  onSearch = (event) => {
    this.setState({ search: event.target.value });
  };

  onToggle = (event) => {
    this.setState({ collapse: !this.state.collapse });
  };

  onCreateFolder = async (event) => {
    event.preventDefault();
    const { feed } = this.props;
    const folderPath = feed.parentFolder
      ? `${feed.parentFolder.path}/${feed.parentFolder.slug}`
      : '/';

    try {
      const item = await this.props.dispatch(createFolder(
          {
            name: this.state.search,
            path: folderPath,
          },
          this.props.auth.uid,
          this.props.auth.token
        )
      )
      await this.props.dispatch(setSlugFeed(null))
      navigate(toFeedPath(item, this.props.user));
    } catch(error) {
      return this.props.dispatch(commitAddLog(error.message));
    }
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const { feed } = this.props;
    const folderPath = feed.parentFolder
      ? `${feed.parentFolder.path}/${feed.parentFolder.slug}`
      : '/';

    try {
      const item = await this.props.dispatch(createProgram(
          {
            name: this.state.search,
            clients: ['uniflow'],
            tags: [],
            path: folderPath,
          },
          this.props.auth.uid,
          this.props.auth.token
        )
      )
      navigate(toFeedPath(item, this.props.user));
    } catch(error) {
      return this.props.dispatch(commitAddLog(log.message));
    }
  };

  render() {
    const { user, feed } = this.props;
    const currentItem = getFeedItem(feed);
    const isFolderActive = () => {
      return this.props.feed.parentFolder &&
        this.props.feed.parentFolder.slug === this.props.feed.slug
        ? 'active'
        : null;
    };
    const isActive = (item) => {
      return currentItem && currentItem.entity.slug === item.entity.slug ? 'active' : null;
    };

    return (
      <div className="sidebar">
        <form
          className="sidebar-search d-flex align-items-center"
          role="search"
          onSubmit={this.onSubmit}
        >
          <div className="input-group">
            <input
              type="search"
              className="form-control ds-input"
              placeholder="Search..."
              aria-label="Search for..."
              value={this.state.search}
              onChange={this.onSearch}
            />
            {this.state.search && (
              <button className="input-group-text" type="button" onClick={this.onCreateFolder}>
                <FontAwesomeIcon icon={faFolder} />
              </button>
            )}
          </div>
          <button
            className="btn d-sm-none p-0 ml-3 collapsed"
            type="button"
            onClick={this.onToggle}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </form>
        <nav className={`sidebar-nav${this.state.collapse ? ' d-none d-sm-block' : ''}`}>
          <div className="sidebar-section">
            <ul className="sidebar-items">
              {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'feed' does not exist on type 'Readonly<{... Remove this comment to see the full error message */}
              {this.props.feed.parentFolder && [
                <li key={'back'}>
                  <span className="link">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back
                  </span>
                  {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'feed' does not exist on type 'Readonly<{... Remove this comment to see the full error message */}
                  <Link to={toFeedPath(this.props.feed.parentFolder, this.props.user, true)}>
                    Back
                  </Link>
                </li>,
                <li className={isFolderActive()} key={'folder'}>
                  <span className="link">.</span>
                  {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'feed' does not exist on type 'Readonly<{... Remove this comment to see the full error message */}
                  <Link to={toFeedPath(this.props.feed.parentFolder, this.props.user)}>.</Link>
                </li>,
              ]}
              {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'feed' does not exist on type 'Readonly<{... Remove this comment to see the full error message */}
              {getOrderedFeed(this.props.feed, this.state.search).map((item, i) => (
                <li className={isActive(item)} key={i}>
                  <span className="link">
                    {item.type === 'folder' && (
                      <>
                        <FontAwesomeIcon icon={faFolder} /> {item.entity.name}{' '}
                      </>
                    )}
                    {item.type === 'program' && <>{item.entity.name} </>}
                    {item.type === 'program' &&
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
}

export default connect((state) => ({
  auth: state.auth,
  user: state.user,
  feed: state.feed,
}))(Navigation);
