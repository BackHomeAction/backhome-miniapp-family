import { Module } from "vuex";
import { UserState, RootState } from "../types";
import { MutationTypes } from "@/enums/mutationTypes";
import { ActionTypes } from "@/enums/actionTypes";
import { requestGetUserInfo, requestLogin } from "@/api/user";
import {
  removeRefreshToken,
  removeToken,
  setRefreshToken,
  setToken,
} from "@/utils/auth";

const user: Module<UserState, RootState> = {
  state: {
    logged: false,
    userInfo: null,
    hasFamilyInfo: false,
  },

  mutations: {
    [MutationTypes.SET_LOGIN]: (state, logged: typeof state.logged) => {
      state.logged = logged;
      console.debug(state);
    },
    [MutationTypes.SET_USER_INFO]: (state, userInfo: typeof state.userInfo) => {
      state.userInfo = userInfo;
      state.hasFamilyInfo = userInfo?.name !== null && userInfo?.phone !== null;
      console.debug(state);
    },
  },

  actions: {
    [ActionTypes.login]: ({ commit }) => {
      return new Promise((resolve, reject) => {
        uni.login({
          success: async ({ code }) => {
            try {
              const res = await requestLogin({ code });
              res.data.token && setToken(res.data.token);
              res.data.refreshToken && setRefreshToken(res.data.refreshToken);
              commit(MutationTypes.SET_LOGIN, true);
              resolve(res);
            } catch (e) {
              reject();
            }
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    },
    [ActionTypes.logout]: ({ commit }) => {
      return new Promise((resolve, reject) => {
        try {
          removeToken();
          removeRefreshToken();
          commit(MutationTypes.SET_LOGIN, false);
          resolve("退出成功");
        } catch (e) {
          reject(e);
        }
      });
    },
    [ActionTypes.getUserInfo]: ({ commit }) => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await requestGetUserInfo();
          if (res.data && res.data.data && res.data.data) {
            commit(MutationTypes.SET_USER_INFO, res.data.data);
          }
          resolve(res.data.data);
        } catch (e) {
          reject(e);
        }
      });
    },
  },

  getters: {
    logged: (state) => state.logged,
    userInfo: (state) => state.userInfo,
    hasFamilyInfo: (state) => state.hasFamilyInfo,
  },
};

export default user;
