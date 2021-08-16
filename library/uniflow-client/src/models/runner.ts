import consoleBridge from '../bridges/console';
import axiosBridge from '../bridges/axios';

export default class Runner {
  run(flows) {
    const context = {
      console: consoleBridge,
      axios: axiosBridge,
    };
  }
}
