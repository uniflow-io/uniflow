import request from 'axios'
import server from '../../utils/server'

export const getBlog = () => {
    return (dispatch) => {
        return request
            .get(`${server.getBaseUrl()}/api/blog`)
            .then((response) => {
                return response.data;
            })
    }
}
