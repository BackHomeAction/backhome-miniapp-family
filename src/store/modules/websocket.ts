import { Module } from "vuex";
import { WebsocketState, RootState } from "../types";
import { MutationTypes } from "@/enums/mutationTypes";

const Websocket: Module<WebsocketState, RootState> = {
  state: {
    ws: null,
  },

  mutations: {
    [MutationTypes.SET_WS]: (state, ws: typeof state.ws) => {
      state.ws = ws;
      console.debug(state);
    },
  },

  actions: {},

  getters: {
    ws: (state) => state.ws,
  },
};

export default Websocket;
