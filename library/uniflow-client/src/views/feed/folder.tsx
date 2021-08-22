import React, { useState } from 'react';
import { navigate } from 'gatsby';
import debounce from 'lodash/debounce';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  getFolderTree,
  updateParentFolder,
  deleteParentFolder,
  toFeedPath,
  useFeed,
  commitSetParentFolderFeed,
  FolderFeedType,
} from '../../contexts/feed';
import { Select } from '../../components';
import { useEffect } from 'react';
import { useAuth, useUser } from '../../contexts';
import { PathType } from '../../models/type-interface';

export interface FolderProps {
  folder: FolderFeedType
}

export interface FolderState {}

function Folder(props: FolderProps) {
  const [folderTreeEdit, setFolderTreeEdit] = useState<boolean>(false)
  const [folderTree, setFolderTree] = useState<PathType[]>([])
  const { user, userDispatch } = useUser()
  const { auth, authDispatch } = useAuth()
  const { feed, feedDispatch, feedRef } = useFeed()

  useEffect(() => {
    setFolderTreeEdit(false)
    setFolderTree([props.folder.path])
  }, [props.folder.uid])

  const onChangeTitle: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    commitSetParentFolderFeed({
      ...props.folder,
      ...{ name: event.target.value },
    })(feedDispatch)
    onUpdate();
  };

  const onChangeSlug: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    commitSetParentFolderFeed({
      ...props.folder,
      ...{ slug: event.target.value },
    })(feedDispatch)
    onUpdate();
  };

  const onChangePath = async (selected: PathType) => {
    commitSetParentFolderFeed({
      ...props.folder,
      ...{ path: selected },
    })(feedDispatch)
    onUpdate();
  };

  const onUpdate = debounce(async () => {
    await updateParentFolder(feedRef.current.parentFolder, auth.token)(feedDispatch, userDispatch, authDispatch);
    navigate(toFeedPath(feedRef.current.parentFolder, user));
  }, 1000);

  const onDelete: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    await deleteParentFolder(props.folder, auth.token)(feedDispatch, userDispatch, authDispatch);
    navigate(toFeedPath(props.folder, user, true));
  };

  const onFolderEdit: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    const { folder } = props;

    let folderTree = await getFolderTree(feed.uid, auth.token)(feedDispatch, userDispatch, authDispatch);
    folderTree = folderTree.filter((value) => {
      return value.indexOf(`${folder.path === '/' ? '' : folder.path}/${folder.slug}`) !== 0;
    });

    setFolderTreeEdit(true)
    setFolderTree(folderTree)
  };

  const { folder } = props;

  return (
    <section className="section col">
      <div className="row">
        <div className="col">
          <h3>Infos</h3>
        </div>
        <div className="d-block col-auto">
          <div className="btn-toolbar" role="toolbar" aria-label="folder actions">
            <div className="btn-group-sm" role="group">
              <button type="button" className="btn" onClick={onDelete}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <form className="form-sm-horizontal">
        <div className="row mb-3">
          <label htmlFor="folder-name" className="col-sm-2 col-form-label">
            Title
          </label>

          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="folder-name"
              value={folder.name}
              onChange={onChangeTitle}
              placeholder="Title"
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="folder-slug" className="col-sm-2 col-form-label">
            Slug
          </label>

          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="folder-slug"
              value={folder.slug}
              onChange={onChangeSlug}
              placeholder="Slug"
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="folder-path" className="col-sm-2 col-form-label">
            Path
          </label>

          <div className="col-sm-10">
            {(folderTreeEdit && (
              <Select
                value={folder.path}
                onChange={onChangePath}
                className="form-control"
                id="folder-path"
                options={folderTree.map((value) => {
                  return { value: value, label: value };
                })}
              />
            )) || (
              <div>
                <button type="button" className="btn btn-secondary" onClick={onFolderEdit}>
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

export default Folder;
