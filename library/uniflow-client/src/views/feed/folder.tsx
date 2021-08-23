import React, { useMemo, useState } from 'react';
import { navigate } from 'gatsby';
import debounce from 'lodash/debounce';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from "@reach/router";
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
import { ApiValidateException } from '../../models';
import { ApiValidateExceptionErrors } from '../../models/api-validate-exception';

export interface FolderProps {
  folder: FolderFeedType
}

export interface FolderState {}

function Folder(props: FolderProps) {
  const [folderTreeEdit, setFolderTreeEdit] = useState<boolean>(false)
  const [folderTree, setFolderTree] = useState<PathType[]>([])
  const [errors, setErrors] = useState<ApiValidateExceptionErrors>({})
  const { user, userDispatch } = useUser()
  const { auth, authDispatch } = useAuth()
  const { feed, feedDispatch, feedRef } = useFeed()
  const { folder } = props;
  const location = useLocation()

  useEffect(() => {
    setFolderTreeEdit(false)
    setFolderTree([props.folder.path])

    return () => {
      onUpdate.cancel()
    }
  }, [props.folder.uid])

  const onUpdate = useMemo(() => debounce(async () => {
    if(feedRef.current.parentFolder && auth.token) {
      try {
        setErrors({})
        await updateParentFolder(feedRef.current.parentFolder, auth.token)(feedDispatch, userDispatch, authDispatch);
  
        const path = toFeedPath(feedRef.current.parentFolder, user)
        if(feedRef.current.parentFolder.slug && path !== location.pathname) {
          navigate(path);
        }
      } catch(error) {
        if (error instanceof ApiValidateException) {
          setErrors({ ...error.errors })
        }
      }
    }
  }, 1000), [props.folder.uid])

  const onDelete: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    if(auth.token) {
      await deleteParentFolder(folder, auth.token)(feedDispatch, userDispatch, authDispatch);
      navigate(toFeedPath(folder, user, true));
    }
  };

  const onChangeName: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    commitSetParentFolderFeed({
      ...folder,
      ...{ name: event.target.value },
    })(feedDispatch)
    onUpdate();
  };

  const onChangeSlug: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    commitSetParentFolderFeed({
      ...folder,
      ...{ slug: event.target.value },
    })(feedDispatch)
    onUpdate();
  };

  const onChangePath = async (selected: PathType) => {
    commitSetParentFolderFeed({
      ...folder,
      ...{ path: selected },
    })(feedDispatch)
    onUpdate();
  };

  const onFolderEdit: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    if(feed.uid) {
      let folderTree = await getFolderTree(feed.uid, auth.token)(feedDispatch, userDispatch, authDispatch);
      folderTree = folderTree.filter((value) => {
        return value.indexOf(`${folder.path === '/' ? '' : folder.path}/${folder.slug}`) !== 0;
      });
  
      setFolderTreeEdit(true)
      setFolderTree(folderTree)
    }
  };

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
            Name
          </label>

          <div className="col-sm-10">
            <input
              type="text"
              className={`form-control${errors.name ? ' is-invalid' : ''}`}
              id="folder-name"
              value={folder.name}
              onChange={onChangeName}
              placeholder="Name"
            />
            {errors.name &&
              errors.name.map((message, i) => (
                <div
                  key={`error-${i}`}
                  className="invalid-feedback"
                >
                  {message}
                </div>
              ))}
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="folder-slug" className="col-sm-2 col-form-label">
            Slug
          </label>

          <div className="col-sm-10">
            <input
              type="text"
              className={`form-control${errors.slug ? ' is-invalid' : ''}`}
              id="folder-slug"
              value={folder.slug}
              onChange={onChangeSlug}
              placeholder="Slug"
            />
            {errors.slug &&
              errors.slug.map((message, i) => (
                <div
                  key={`error-${i}`}
                  className="invalid-feedback"
                >
                  {message}
                </div>
              ))}
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
              <span>
                <button type="button" className="btn btn-secondary" onClick={onFolderEdit}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>{' '}
                {folder.path}
              </span>
            )}
            {errors.path &&
              errors.path.map((message, i) => (
                <div
                  key={`error-${i}`}
                  className="invalid-feedback"
                >
                  {message}
                </div>
              ))}
          </div>
        </div>
      </form>
    </section>
  );
}

export default Folder;
