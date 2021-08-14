import {
  COMMIT_CLEAR_FEED,
  COMMIT_UPDATE_FEED,
  COMMIT_DELETE_FEED,
  COMMIT_SET_PARENT_FOLDER_FEED,
  COMMIT_SET_SLUG_FEED,
  COMMIT_SET_UID_FEED,
} from './actions-types';

const defaultState = {
  items: {},
  parentFolder: undefined,
  slug: undefined,
  uid: undefined,
};

const feed = (state = defaultState, action) => {
  switch (action.type) {
    case COMMIT_CLEAR_FEED:
      return {
        ...state,
        items: {},
      };
    case COMMIT_UPDATE_FEED:
      state.items[`${action.item.type}-${action.item.entity.uid}`] = action.item;
      return {
        ...state,
      };
    case COMMIT_DELETE_FEED:
      delete state.items[`${action.item.type}-${action.item.entity.uid}`];
      return {
        ...state,
      };
    case COMMIT_SET_PARENT_FOLDER_FEED:
      return {
        ...state,
        parentFolder: action.parentFolder,
      };
    case COMMIT_SET_SLUG_FEED:
      return {
        ...state,
        slug: action.slug,
      };
    case COMMIT_SET_UID_FEED:
      return {
        ...state,
        uid: action.uid,
      };
    default:
      return state;
  }
};

export default feed;
