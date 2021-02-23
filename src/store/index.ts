import { createStore } from "vuex";

import user from "./modules/user";
import avatarCropper from "./modules/avatarCropper";
import announcement from "./modules/announcement";
import location from "./modules/location";
import common from "./modules/common";
import mission from "./modules/mission";
import websocket from "./modules/websocket";
import tim from "./modules/tim";

export default createStore({
  modules: {
    user,
    avatarCropper,
    announcement,
    location,
    common,
    mission,
    websocket,
    tim,
  },
});
