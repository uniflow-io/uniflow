import { COMMIT_SET_PAGE, COMMIT_SET_THEME } from './actions-types';

const defaultState = {
  page: 'home',
  theme: 'light',
};

const app = (state = defaultState, action) => {
  switch (action.type) {
    case COMMIT_SET_PAGE:
      return {
        ...state,
        page: action.page,
      };
    case COMMIT_SET_THEME:
      return {
        ...state,
        theme: action.theme,
      };
    default:
      return state;
  }
};

export default app;
