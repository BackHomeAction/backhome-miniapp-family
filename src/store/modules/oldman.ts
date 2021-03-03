import { Module } from "vuex";
import { OldmanState, RootState } from "../types";
import { MutationTypes } from "@/enums/mutationTypes";
import { ActionTypes } from "@/enums/actionTypes";
import { requestGetOldMen } from "@/api/oldman";

const Oldman: Module<OldmanState, RootState> = {
  state: {
    oldmanList: [],
  },

  mutations: {
    [MutationTypes.SET_OLDMAN_LIST]: (
      state,
      oldmanList: typeof state.oldmanList
    ) => {
      state.oldmanList = oldmanList;
      console.debug(state);
    },
  },

  actions: {
    [ActionTypes.getOldmanList]: ({ commit }) => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await requestGetOldMen();
          if (res.data && res.data.data) {
            commit(MutationTypes.SET_OLDMAN_LIST, res.data.data);
          }
          resolve(res.data.data);
        } catch (e) {
          reject(e);
        }
      });
    },
  },

  getters: {
    oldmanList: (state) => state.oldmanList,
  },
};

export default Oldman;
