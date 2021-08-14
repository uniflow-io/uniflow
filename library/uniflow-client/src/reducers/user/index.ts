import { COMMIT_UPDATE_SETTINGS, COMMIT_LOGOUT_USER } from './actions-types';

const defaultState = {
  uid: undefined,
  apiKey: undefined,
  username: undefined,
  email: undefined,
  firstname: undefined,
  lastname: undefined,
  facebookId: undefined,
  githubId: undefined,
  roles: [],
  links: {
    lead: undefined,
  },
};

const user = (state = defaultState, action) => {
  switch (action.type) {
    case COMMIT_UPDATE_SETTINGS:
      return {
        ...state,
        ...action.user,
      };
    case COMMIT_LOGOUT_USER:
      return {
        ...defaultState,
      };
    default:
      return state;
  }
};

export default user;
