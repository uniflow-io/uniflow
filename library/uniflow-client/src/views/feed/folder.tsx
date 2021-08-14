import React, { Component } from 'react';
import { navigate } from 'gatsby';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  getFolderTree,
  updateParentFolder,
  deleteParentFolder,
  setParentFolderFeed,
  toFeedPath,
} from '../../reducers/feed/actions';
import { Select } from '../../components';

class Folder extends Component {
  state = {
    slug: null,
    folderTreeEdit: false,
    folderTree: [],
  };

  componentDidMount() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'folder' does not exist on type 'Readonly... Remove this comment to see the full error message
    const { folder } = this.props;

    this.setState({ folderTree: [folder.path] });
  }

  componentDidUpdate(prevProps) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'folder' does not exist on type 'Readonly... Remove this comment to see the full error message
    if (this.props.folder.uid !== prevProps.folder.uid) {
      this.setState({
        slug: null,
        folderTreeEdit: false,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'folder' does not exist on type 'Readonly... Remove this comment to see the full error message
        folderTree: [this.props.folder.path],
      });
    }
  }

  onChangeTitle = (event) => {
    this.props
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
      .dispatch(
        setParentFolderFeed({
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'folder' does not exist on type 'Readonly... Remove this comment to see the full error message
          ...this.props.folder,
          ...{ name: event.target.value },
        })
      )
      .then(() => {
        this.onUpdate();
      });
  };

  onChangeSlug = (event) => {
    this.setState({ slug: event.target.value }, this.onUpdate);
  };

  onChangePath = (selected) => {
    this.props
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
      .dispatch(
        setParentFolderFeed({
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'folder' does not exist on type 'Readonly... Remove this comment to see the full error message
          ...this.props.folder,
          ...{ path: selected },
        })
      )
      .then(() => {
        this.onUpdate();
      });
  };

  onUpdate = debounce(() => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'folder' does not exist on type 'Readonly... Remove this comment to see the full error message
    const { folder } = this.props;
    folder.slug = this.state.slug ?? folder.slug;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
    this.props.dispatch(updateParentFolder(folder, this.props.auth.token)).then((folder) => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
      const path = toFeedPath(folder, this.props.user);
      if (typeof window !== `undefined` && window.location.pathname !== path) {
        navigate(path);
      }
    });
  }, 500);

  onDelete = (event) => {
    event.preventDefault();

    return (
      this.props
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
        .dispatch(deleteParentFolder(this.props.folder, this.props.auth.token))
        .then(() => {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'folder' does not exist on type 'Readonly... Remove this comment to see the full error message
          navigate(toFeedPath(this.props.folder, this.props.user, true));
        })
    );
  };

  onFolderEdit = (event) => {
    event.preventDefault();

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'feed' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const { feed, folder } = this.props;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
    this.props.dispatch(getFolderTree(feed.uid, this.props.auth.token)).then((folderTree) => {
      folderTree = folderTree.filter((value) => {
        return value.indexOf(`${folder.path === '/' ? '' : folder.path}/${folder.slug}`) !== 0;
      });

      this.setState({
        folderTreeEdit: true,
        folderTree: folderTree,
      });
    });
  };

  render() {
    const { folderTreeEdit, folderTree } = this.state;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'folder' does not exist on type 'Readonly... Remove this comment to see the full error message
    const { folder } = this.props;
    folder.slug = this.state.slug ?? folder.slug;

    return (
      <section className="section col">
        <div className="row">
          <div className="col">
            <h3>Infos</h3>
          </div>
          <div className="d-block col-auto">
            <div className="btn-toolbar" role="toolbar" aria-label="folder actions">
              <div className="btn-group-sm" role="group">
                <button type="button" className="btn" onClick={this.onDelete}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <form className="form-sm-horizontal">
          <div className="row mb-3">
            <label htmlFor="info_name_{{ _uid }}" className="col-sm-2 col-form-label">
              Title
            </label>

            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="info_name_{{ _uid }}"
                value={folder.name}
                onChange={this.onChangeTitle}
                placeholder="Title"
              />
            </div>
          </div>

          <div className="row mb-3">
            <label htmlFor="info_slug_{{ _uid }}" className="col-sm-2 col-form-label">
              Slug
            </label>

            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="info_slug_{{ _uid }}"
                value={folder.slug}
                onChange={this.onChangeSlug}
                placeholder="Slug"
              />
            </div>
          </div>

          <div className="row mb-3">
            <label htmlFor="info_path_{{ _uid }}" className="col-sm-2 col-form-label">
              Path
            </label>

            <div className="col-sm-10">
              {(folderTreeEdit && (
                <Select
                  // @ts-expect-error ts-migrate(2322) FIXME: Type '{ value: any; onChange: (selected: any) => v... Remove this comment to see the full error message
                  value={folder.path}
                  onChange={this.onChangePath}
                  className="form-control"
                  id="info_path_{{ _uid }}"
                  options={folderTree.map((value) => {
                    return { value: value, label: value };
                  })}
                />
              )) || (
                <div>
                  <button type="button" className="btn btn-secondary" onClick={this.onFolderEdit}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>{' '}
                  {folder.path}
                </div>
              )}
            </div>
          </div>
        </form>
      </section>
    );
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
})(Folder);
