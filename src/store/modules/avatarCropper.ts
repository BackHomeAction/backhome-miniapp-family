import { Module } from "vuex";
import { AvatarCropperState, RootState } from "../types";
import { MutationTypes } from "@/enums/mutationTypes";

const avatarCropper: Module<AvatarCropperState, RootState> = {
  state: {
    path: "",
  },

  mutations: {
    [MutationTypes.SET_AVATAR_PATH]: (state, path: string) => {
      state.path = path;
      console.debug(state);
    },
  },

  actions: {},

  getters: {
    avatarPath: (state) => state.path,
  },
};

export default avatarCropper;
