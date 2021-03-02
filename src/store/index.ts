import { createStore } from "vuex";

import user from "./modules/user";
import announcement from "./modules/announcement";
import mission from "./modules/mission";
import websocket from "./modules/websocket";
import tim from "./modules/tim";

export default createStore({
  modules: {
    user,
    announcement,
    mission,
    websocket,
    tim,
  },
});
