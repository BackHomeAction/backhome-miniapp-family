declare class Ws {
  constructor();
  connect();
  reconnect();
  disconnect();
  subscribe(destination: string, callback: Function);
  unsubscribe(destination: string);
  send(destination: string, message: string);
}

export default Ws
