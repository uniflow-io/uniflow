import {
  COMMIT_PUSH_FLOW,
  COMMIT_POP_FLOW,
  COMMIT_UPDATE_FLOW,
  COMMIT_SET_FLOWS,
} from './actions-types';

const defaultState = [];

const graph = (state = defaultState, action) => {
  switch (action.type) {
    case COMMIT_PUSH_FLOW:
      const newStatePush = state.slice();
      newStatePush.splice(action.index, 0, {
        flow: action.flow,
      });
      return newStatePush;
    case COMMIT_POP_FLOW:
      const newStatePop = state.slice();
      newStatePop.splice(action.index, 1);
      return newStatePop;
    case COMMIT_UPDATE_FLOW:
      return state.map((item, index) => {
        if (index !== action.index) {
          return item;
        }

        return {
          ...item,
          ...{
            data: action.data,
          },
        };
      });
    case COMMIT_SET_FLOWS:
      return action.flows.slice();
    default:
      return state;
  }
};

export default graph;
