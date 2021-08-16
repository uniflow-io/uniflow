import request from 'axios';
import server from '../../utils/server';
import { ApiException } from '../../exceptions';

export const contact = (email: string, message: string) => {
  return async (dispatch) => {
    try {
      const response = await request.post(`${server.getBaseUrl()}/api/contacts`, {
        email: email,
        message: message,
      })
      return response.data;
    } catch(error) {
        throw new ApiException(server.handleErrors(error.response));
    }
  };
};
