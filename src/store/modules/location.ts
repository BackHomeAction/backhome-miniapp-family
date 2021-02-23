import { Module } from "vuex";
import { LocationState, RootState } from "../types";
import { MutationTypes } from "@/enums/mutationTypes";

const Location: Module<LocationState, RootState> = {
  state: {
    location: {
      latitude: 0,
      longitude: 0,
    },
  },

  mutations: {
    [MutationTypes.SET_LOCATION]: (state, location: typeof state.location) => {
      state.location = location;
      console.debug(state);
    },
  },

  actions: {},

  getters: {
    location: (state) => state.location,
  },
};

export default Location;
