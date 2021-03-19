import Ws from "../utils/websocket";
import store from "@/store";
import { MutationTypes } from "@/enums/mutationTypes";

const ws = new Ws();
let interval: number = 0;

const getLocation = () => {
  return new Promise<UniApp.GetLocationSuccess>((resolve, reject) => {
    uni.getLocation({
      type: "gcj02",
      altitude: true,
      success: (data) => {
        resolve(data);
      },
      fail() {
        reject();
      },
    });
  });
};

const intervalFunction = async () => {
  const logged = store.getters.logged;
  if (!logged) return;

  const location = await getLocation();
  store.commit(MutationTypes.SET_LOCATION, {
    longitude: location.longitude,
    latitude: location.latitude,
  });
  sendWebsocketMessage("/home/family", "ping");
  console.debug("Location reporter triggered.", location);
};

/**
 * 启动服务
 */
export const startWebsocket = () => {
  console.log("WebSocket service started.");
  ws && ws.connect();
  interval = setInterval(intervalFunction, 10000);
  store.commit(MutationTypes.SET_WS, ws);
};

/**
 * 停止服务
 */
export const stopWebsocket = () => {
  console.log("WebSocket service stopped.");
  ws.disconnect();
  clearInterval(interval);
};

/**
 * 发送消息
 *
 * @param {string} destination
 * @param {(Object | string)} data
 */
export const sendWebsocketMessage = (
  destination: string,
  data: Object | string
) => {
  const message = data instanceof Object ? JSON.stringify(data) : data;
  ws && ws.send(destination, message);
};
