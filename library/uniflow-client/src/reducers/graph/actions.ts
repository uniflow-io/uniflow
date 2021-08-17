import {
  COMMIT_PUSH_FLOW,
  COMMIT_POP_FLOW,
  COMMIT_UPDATE_FLOW,
  COMMIT_SET_FLOWS,
} from './actions-types';
import request from 'axios';
import Container from '../../container';
import { Server } from '../../services';

const container = new Container()
const server = container.get(Server)


export const commitPushFlow = (index, flow) => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_PUSH_FLOW,
      index,
      flow,
    });
    return Promise.resolve();
  };
};
export const commitPopFlow = (index) => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_POP_FLOW,
      index,
    });
    return Promise.resolve();
  };
};
export const commitUpdateFlow = (index, data) => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_UPDATE_FLOW,
      index,
      data,
    });
    return Promise.resolve();
  };
};
export const commitSetFlows = (flows) => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_SET_FLOWS,
      flows,
    });
    return Promise.resolve();
  };
};

export const getFlows = (page: number) => {
  return async (dispatch) => {
    try {
      const response = await request.get(`${server.getBaseUrl()}/api/programs?page=${page}`);
      return response.data;
    } catch (error) {
      return [];
    }
  };
};
