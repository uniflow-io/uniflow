import request from 'axios';
import Container from '../../container';
import { Server } from '../../services';
import { ApiException } from '../../models';

const container = new Container()
const server = container.get(Server)

export const contact = (email: string, message: string) => {
  return async (dispatch) => {
    try {
      const response = await request.post(`${server.getBaseUrl()}/api/contacts`, {
        email: email,
        message: message,
      });
      return response.data;
    } catch (error) {
      throw new ApiException(server.handleErrors(error.response));
    }
  };
};
