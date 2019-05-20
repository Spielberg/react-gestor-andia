import axios from 'axios';

import config from './config';

/**
  * function fetchComments
  * llamamos al server para obtener comentarios
  * @param cb {function} callback
  * @return {void}
  *
function fetchComments({ limit, offset = null } , cb = () => (null)) {
  this.props.displayLoading();
  let url = `${config.COMMENTS.url}&limit=${limit}`;
  if (offset !== null) {
    url = `${url}&offset=${offset}`;
  }
  if (config.DEBUG) console.log(`fetchComments url:${url}`);
  axios.get(url)
    .then(response => {
      this.props.hideLoading();
      return cb(null, response.data);
    })
    .catch(error => {
      this.props.hideLoading();
      return cb(error, {});
    });
}
*/

export default {
  //fetchComments,
};
