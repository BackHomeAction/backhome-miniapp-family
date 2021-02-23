import { Module } from "vuex";
import { CommonState, RootState } from "../types";
import { MutationTypes } from "@/enums/mutationTypes";
import { ActionTypes } from "@/enums/actionTypes";
import {
  requestGetOnlineVolunteerNumber,
  requestGetVolunteerNumber,
} from "@/api/volunteer";
import { requestGetOpenCaseNumber } from "@/api/mission";

const Common: Module<CommonState, RootState> = {
  state: {
    count: {
      onlineVolunteerNumber: 0,
      totalVolunteerNumber: 0,
      openingTaskNumber: 0,
    },
  },

  mutations: {
    [MutationTypes.SET_COUNT]: (state, count: typeof state.count) => {
      state.count = count;
      console.debug(state);
    },
  },

  actions: {
    [ActionTypes.getCount]: ({ commit }) => {
      const getVolunteerNumber = async () => {
        return (await requestGetVolunteerNumber()).data.data;
      };
      const getOnlineVolunteerNumber = async () => {
        return (await requestGetOnlineVolunteerNumber()).data.data;
      };
      const getOpenTaskNumber = async () => {
        return (await requestGetOpenCaseNumber()).data.data;
      };

      return new Promise<void>(async (resolve, reject) => {
        try {
          const res = await Promise.all([
            getOnlineVolunteerNumber(),
            getVolunteerNumber(),
            getOpenTaskNumber(),
          ]);
          commit(MutationTypes.SET_COUNT, {
            onlineVolunteerNumber: res[0],
            totalVolunteerNumber: res[1],
            openingTaskNumber: res[2],
          });
          resolve();
        } catch (e) {
          console.log(e);
          reject();
        }
      });
    },
  },

  getters: {
    count: (state) => state.count,
  },
};

export default Common;
