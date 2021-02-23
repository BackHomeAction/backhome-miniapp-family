import Ws from "../utils/websocket";

const ws = new Ws();

/**
 * 启动服务
 */
export const startWebsocket = () => {
  console.log("WebSocket service started.");
  ws && ws.connect();
};

/**
 * 停止服务
 */
export const stopWebsocket = () => {
  console.log("WebSocket service stopped.");
  ws.disconnect();
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
