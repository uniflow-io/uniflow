import React, { MutableRefObject, RefObject, useContext, useReducer } from 'react';
import Container from '../container';
import { Api } from '../services';
import request from 'axios';
import moment, { Moment } from 'moment';
import { commitLogoutUser, UserDispath, UserProviderState } from './user';
import { pathTo } from '../routes';
import { useReducerRef } from '../hooks/use-reducer-ref';
import { AuthDispath } from './auth';
import { FolderApiType, ProgramApiType, UserApiType } from '../models/api-type-interface';
import { SlugType, UuidType } from '../models/type-interface';

const container = new Container();
const api = container.get(Api);

export type ProgramFeedType = ProgramApiType & {
  data: string
  updated: Moment
}

export type FolderFeedType = FolderApiType & {
  updated: Moment
}

export interface FeedItem {
  type: 'program'|'folder'
  entity: ProgramFeedType|FolderFeedType
}

export enum FeedActionTypes {
  COMMIT_CLEAR_FEED = 'COMMIT_CLEAR_FEED',
  COMMIT_UPDATE_FEED = 'COMMIT_UPDATE_FEED',
  COMMIT_DELETE_FEED = 'COMMIT_DELETE_FEED',
  COMMIT_SET_PARENT_FOLDER_FEED = 'COMMIT_SET_PARENT_FOLDER_FEED',
  COMMIT_SET_SLUG_FEED = 'COMMIT_SET_SLUG_FEED',
  COMMIT_SET_UID_FEED = 'COMMIT_SET_UID_FEED',
}

export type FeedAction = 
  | { type: FeedActionTypes.COMMIT_CLEAR_FEED }
  | { type: FeedActionTypes.COMMIT_UPDATE_FEED, item: FeedItem }
  | { type: FeedActionTypes.COMMIT_DELETE_FEED, item: FeedItem }
  | { type: FeedActionTypes.COMMIT_SET_PARENT_FOLDER_FEED, parentFolder: FolderFeedType|null }
  | { type: FeedActionTypes.COMMIT_SET_SLUG_FEED, slug: SlugType|null }
  | { type: FeedActionTypes.COMMIT_SET_UID_FEED, uid: UuidType }

export type FeedDispath = React.Dispatch<FeedAction>

export interface FeedProviderProps {
  children: React.ReactNode;
}

export interface FeedProviderState {
  items: {[key: string]: FeedItem},
  parentFolder?: FolderFeedType|null,
  slug?: SlugType|null,
  uid?: UuidType,
}

const defaultState = {
  items: {},
  parentFolder: undefined,
  slug: undefined,
  uid: undefined,
};

const fetchCollection = async (uid, type, path, page, config, items = []) => {
  const response = await request.get(
    `${api.getBaseUrl()}/users/${uid}/${type}?page=${page}${path ? `&path=${path}` : ''}`,
    config
  );
  const { data, total } = response.data;
  items = items.concat(data);
  if (items.length < total) {
    return await fetchCollection(uid, type, path, page + 1, config, items);
  }

  return items;
};

export const commitClearFeed = () => {
  return (dispatch: FeedDispath) => {
    dispatch({
      type: FeedActionTypes.COMMIT_CLEAR_FEED,
    });
  };
};

export const commitUpdateFeed = (item: FeedItem) => {
  return (dispatch: FeedDispath) => {
    dispatch({
      type: FeedActionTypes.COMMIT_UPDATE_FEED,
      item,
    });
  };
};

export const commitDeleteFeed = (item: FeedItem) => {
  return (dispatch: FeedDispath) => {
    dispatch({
      type: FeedActionTypes.COMMIT_DELETE_FEED,
      item,
    });
  };
};

export const commitSetParentFolderFeed = (parentFolder: FolderFeedType|null) => {
  return (dispatch: FeedDispath) => {
    dispatch({
      type: FeedActionTypes.COMMIT_SET_PARENT_FOLDER_FEED,
      parentFolder,
    });
  };
};

export const commitSetSlugFeed = (slug: SlugType|null) => {
  return (dispatch: FeedDispath) => {
    dispatch({
      type: FeedActionTypes.COMMIT_SET_SLUG_FEED,
      slug,
    });
  };
};

export const commitSetUidFeed = (uid: UuidType) => {
  return (dispatch: FeedDispath) => {
    dispatch({
      type: FeedActionTypes.COMMIT_SET_UID_FEED,
      uid,
    });
  };
};

export const getFeedItem = (feed: FeedProviderState, slug = feed.slug): FeedItem|undefined => {
  if (slug === undefined) return undefined;

  if (slug === null && feed.parentFolder) {
    return {
      type: 'folder',
      entity: feed.parentFolder,
    };
  }

  for (const item of Object.values(feed.items)) {
    if (item.entity.slug === slug) {
      return item;
    }
  }

  return undefined;
};

export const toFeedPath = (entity: ProgramFeedType|FolderFeedType, user: UserProviderState, toParent: boolean = false) => {
  const paths = entity.path === '/' ? [] : entity.path.split('/').slice(1);
  if (!toParent) {
    paths.push(entity.slug);
  }

  const slugs: {[key: string]: string} = {};
  for (let i = 0; i < paths.length; i++) {
    slugs[`slug${i + 1}`] = paths[i];
  }

  const isCurrentUser = entity.user === user.uid || entity.user === user.username;
  if (isCurrentUser) {
    return pathTo('feed', slugs);
  }

  return pathTo('userFeed', Object.assign({ uid: entity.user }, slugs));
};

export const getTags = (feed: FeedProviderState) => {
  let tags = Object.keys(feed.items).reduce(function (currentTags: string[], key) {
    const entity = feed.items[key].entity
    const tags = 'tags' in entity ? entity.tags : []
    return currentTags.concat();
  }, []);

  // filter unique
  tags = tags.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });

  return tags;
};

export const getOrderedFeed = (feed: FeedProviderState, filter?: string) => {
  let keys = Object.keys(feed.items);

  if (filter !== undefined) {
    keys = keys.filter((key) => {
      const item = feed.items[key];
      let words: string[] = [];
      if (item.type === 'program') {
        words.push(item.entity.name);
        const tags = 'tags' in item.entity ? item.entity.tags : []
        for (let i = 0; i < tags.length; i++) {
          words.push(tags[i]);
        }
      } else if (item.type === 'folder') {
        words.push(item.entity.name);
      }
      const searchWords = words.join(' ').toLowerCase();

      return searchWords.indexOf(filter) !== -1;
    });
  }

  keys.sort((keyA, keyB) => {
    const itemA = feed.items[keyA];
    const itemB = feed.items[keyB];

    return moment(itemB.entity.updated).diff(moment(itemA.entity.updated));
  });

  return keys.map((key) => {
    return feed.items[key];
  });
};

export const fetchFeed = (uid: UuidType, paths: string[], token?: string) => {
  return async (dispatch: FeedDispath, userDispatch: UserDispath, authDispath: AuthDispath) => {
    let config = {};
    if (token) {
      config = {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`,
        },
      };
    }

    const path = `/${paths.join('/')}`;
    const parentPath = `/${paths.slice(0, -1).join('/')}`;
    const parentParentPath = `/${paths.slice(0, -2).join('/')}`;
    const slug = paths.length > 0 ? paths[paths.length - 1] : null;
    const parentSlug = paths.length > 1 ? paths[paths.length - 2] : null;
    let feedFolderPath = parentPath;
    let feedProgramPath = parentPath;
    let parentFolderFound: boolean | undefined = undefined;

    commitSetUidFeed(uid)(dispatch);
    commitSetSlugFeed(slug)(dispatch);
    commitSetParentFolderFeed(null)(dispatch);
    commitClearFeed()(dispatch);

    if (paths.length > 0) {
      const folders = await fetchCollection(uid, 'folders', parentPath, 1, config);
      parentFolderFound = false;
      for (const folder of folders) {
        if (folder.path === parentPath && folder.slug === slug) {
          commitSetSlugFeed(null)(dispatch);
          commitSetParentFolderFeed(folder)(dispatch);
          feedFolderPath = path;
          feedProgramPath = path;
          parentFolderFound = true;
        }
      }

      if (parentFolderFound === false) {
        for (const folder of folders) {
          commitUpdateFeed({
            type: 'folder',
            entity: folder,
          })(dispatch)
        }
        feedFolderPath = parentParentPath;
      }
    }

    try {
      const [folders, programs] = await Promise.all([
        fetchCollection(uid, 'folders', feedFolderPath, 1, config),
        fetchCollection(uid, 'programs', feedProgramPath, 1, config),
      ]);
      if (parentFolderFound === true || parentFolderFound === undefined) {
        for (const folder of folders) {
          commitUpdateFeed({
            type: 'folder',
            entity: folder,
          })(dispatch)
        }
      }
      if (parentFolderFound === false) {
        for (const folder of folders) {
          if (folder.path === parentParentPath && folder.slug === parentSlug) {
            commitSetParentFolderFeed(folder)(dispatch);
          }
        }
      }

      for (const program of programs) {
        commitUpdateFeed({
          type: 'program',
          entity: program,
        })(dispatch)
      }
    } catch (error) {
      if (error.request.status === 401) {
        commitLogoutUser()(userDispatch, authDispath);
      } else {
        throw error;
      }
    }
  };
};

export const serializeFlowsData = (graph) => {
  const data = [];

  for (let i = 0; i < graph.length; i++) {
    data.push({
      flow: graph[i].flow,
      data: graph[i].data,
    });
  }

  return JSON.stringify(data);
};

export const deserializeFlowsData = (raw) => {
  const data = JSON.parse(raw);

  const graph = [];

  for (let i = 0; i < data.length; i++) {
    graph.push({
      flow: data[i].flow,
      data: data[i].data,
    });
  }

  return graph;
};

export const createProgram = (program: ProgramFeedType, uid: UuidType, token: string) => {
  return async (dispatch: FeedDispath, userDispatch: UserDispath, authDispath: AuthDispath) => {
    const data = {
      name: program.name,
      ...(program.slug && { slug: program.slug }),
      path: program.path,
      clients: program.clients,
      tags: program.tags,
      description: program.description,
    };

    try {
      program = await api.createUserProgram({uid}, data, {token})

      commitUpdateFeed({
        type: 'program',
        entity: program,
      })(dispatch)

      return program;
    } catch (error) {
      if (error.request.status === 401) {
        commitLogoutUser()(userDispatch, authDispath);
      } else {
        throw error;
      }
    }
  };
};

export const updateProgram = (program: ProgramFeedType, token: string) => {
  return async (dispatch: FeedDispath, userDispatch: UserDispath, authDispath: AuthDispath) => {
    const data = {
      name: program.name,
      slug: program.slug,
      path: program.path,
      clients: program.clients,
      tags: program.tags,
      description: program.description,
      public: program.public,
    };

    try {
      program = await api.updateProgram({uid: program.uid}, data, {token});

      commitUpdateFeed({
        type: 'program',
        entity: program,
      })(dispatch)

      return program;
    } catch (error) {
      if (error.request.status === 401) {
        commitLogoutUser()(userDispatch, authDispath);
      } else {
        throw error;
      }
    }
  };
};

export const getProgramData = (program: ProgramFeedType, token?: string) => {
  return async (dispatch: FeedDispath, userDispatch: UserDispath, authDispath: AuthDispath) => {
    try {
      const data = await api.getProgramFlows({uid: program.uid}, {token})
      return data.data;
    } catch (error) {
      if (error.request.status === 401) {
        commitLogoutUser()(userDispatch, authDispath);
      } else {
        throw error;
      }
    }
  };
};

export const setProgramData = (program: ProgramFeedType, token?: string) => {
  return async (dispatch: FeedDispath, userDispatch: UserDispath, authDispath: AuthDispath) => {
    const body = {
      data: program.data,
    };

    try {
      const data = await api.updateProgramFlows({uid: program.uid}, body, {token});
      program.updated = moment();

      commitUpdateFeed({
        type: 'program',
        entity: program,
      })(dispatch)

      return data;
    } catch (error) {
      if (error.request.status === 401) {
        commitLogoutUser()(userDispatch, authDispath);
      } else {
        throw error;
      }
    }
  };
};

export const deleteProgram = (program: ProgramFeedType, token: string) => {
  return async (dispatch: FeedDispath, userDispatch: UserDispath, authDispath: AuthDispath) => {
    try {
      const isDeleted = await api.deleteProgram({uid: program.uid}, {token})

      commitDeleteFeed({
        type: 'program',
        entity: program,
      })(dispatch)

      return isDeleted;
    } catch (error) {
      if (error.request.status === 401) {
        commitLogoutUser()(userDispatch, authDispath);
      } else {
        throw error;
      }
    }
  };
};

export const getFolderTree = (uid: UuidType, token?: string) => {
  return async (dispatch: FeedDispath, userDispatch: UserDispath, authDispath: AuthDispath) => {
    let config = {};
    if (token) {
      config = {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`,
        },
      };
    }

    try {
      const folders = await fetchCollection(uid, 'folders', null, 1, config);
      const tree = ['/'];
      for (const folder of folders) {
        tree.push(`${folder.path === '/' ? '' : folder.path}/${folder.slug}`);
      }

      return tree.sort();
    } catch (error) {
      if (error.request.status === 401) {
        commitLogoutUser()(userDispatch, authDispath);
      } else {
        throw error;
      }
    }
  };
};

export const createFolder = (folder: FolderFeedType, uid: UuidType, token?: string) => {
  return async (dispatch: FeedDispath, userDispatch: UserDispath, authDispath: AuthDispath) => {
    const data = {
      name: folder.name,
      slug: folder.name,
      path: folder.path,
    };

    try {
      folder = await api.createUserFolder({uid}, data, {token})

      commitUpdateFeed({
        type: 'folder',
        entity: folder,
      })(dispatch)

      return folder;
    } catch (error) {
      if (error.request.status === 401) {
        commitLogoutUser()(userDispatch, authDispath);
      } else {
        throw error;
      }
    }
  };
};

export const updateParentFolder = (folder: FolderFeedType, token?: string) => {
  return async (dispatch: FeedDispath, userDispatch: UserDispath, authDispath: AuthDispath) => {
    const data = {
      name: folder.name,
      slug: folder.slug,
      path: folder.path,
    };

    try {
      folder = await api.updateFolder({uid: folder.uid}, data, {token})

      commitSetParentFolderFeed(folder)(dispatch);

      return folder;
    } catch (error) {
      if (error.request.status === 401) {
        commitLogoutUser()(userDispatch, authDispath);
      } else {
        throw error;
      }
    }
  };
};

export const deleteParentFolder = (folder: FolderFeedType, token?: string) => {
  return async (dispatch: FeedDispath, userDispatch: UserDispath, authDispath: AuthDispath) => {
    try {
      const isDeleted = await api.deleteFolder({uid: folder.uid}, {token})

      commitSetParentFolderFeed(undefined)(dispatch);

      return isDeleted;
    } catch (error) {
      if (error.request.status === 401) {
        commitLogoutUser()(userDispatch, authDispath);
      } else {
        throw error;
      }
    }
  };
};

export const FeedContext = React.createContext<{feed: FeedProviderState, feedDispatch: FeedDispath, feedRef: MutableRefObject<FeedProviderState>}>({
  feed: defaultState,
  feedDispatch: () => {
    throw new Error('FeedContext not yet initialized.');
  },
  feedRef: {
    current: defaultState
  }
});
FeedContext.displayName = 'FeedContext';

export function FeedProvider(props: FeedProviderProps) {
  const [feed, feedDispatch, feedRef] = useReducerRef<FeedProviderState, FeedAction>((
    state: FeedProviderState = defaultState,
    action: FeedAction
  ) => {
    switch (action.type) {
      case FeedActionTypes.COMMIT_CLEAR_FEED:
        return {
          ...state,
          items: {},
        };
      case FeedActionTypes.COMMIT_UPDATE_FEED:
        state.items[`${action.item.type}-${action.item.entity.uid}`] = action.item;
        return {
          ...state,
        };
      case FeedActionTypes.COMMIT_DELETE_FEED:
        delete state.items[`${action.item.type}-${action.item.entity.uid}`];
        return {
          ...state,
        };
      case FeedActionTypes.COMMIT_SET_PARENT_FOLDER_FEED:
        return {
          ...state,
          parentFolder: action.parentFolder,
        };
      case FeedActionTypes.COMMIT_SET_SLUG_FEED:
        return {
          ...state,
          slug: action.slug,
        };
      case FeedActionTypes.COMMIT_SET_UID_FEED:
        return {
          ...state,
          uid: action.uid,
        };
      default:
        return state;
    }
  }, defaultState);

  return (
    <FeedContext.Provider value={{feed, feedDispatch, feedRef}}>
      {props.children}
    </FeedContext.Provider>
  );
}

export const FeedConsumer = FeedContext.Consumer;

export function useFeed() {
  return useContext(FeedContext);
}
