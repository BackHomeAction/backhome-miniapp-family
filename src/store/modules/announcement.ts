import { Module } from "vuex";
import { AnnouncementState, RootState } from "../types";
import { MutationTypes } from "@/enums/mutationTypes";
import { ActionTypes } from "@/enums/actionTypes";
import { requestGetAnnouncements, requestGetBanners } from "@/api/announcement";

const Announcement: Module<AnnouncementState, RootState> = {
  state: {
    announcements: [],
    banners: [],
  },

  mutations: {
    [MutationTypes.SET_ANNOUNCEMENT_LIST]: (
      state,
      announcements: typeof state.announcements
    ) => {
      state.announcements = announcements;
      console.debug(state);
    },
    [MutationTypes.SET_BANNER_LIST]: (state, banners: typeof state.banners) => {
      state.banners = banners;
      console.debug(state);
    },
  },

  actions: {
    [ActionTypes.getAnnouncements]: ({ commit }) => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await requestGetAnnouncements();
          if (res.data && res.data.data) {
            commit(MutationTypes.SET_ANNOUNCEMENT_LIST, res.data.data);
          }
          resolve(res.data.data);
        } catch (e) {
          reject(e);
        }
      });
    },
    [ActionTypes.getBanners]: ({ commit }) => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await requestGetBanners();
          if (res.data && res.data.data) {
            commit(MutationTypes.SET_BANNER_LIST, res.data.data);
          }
          resolve(res.data.data);
        } catch (e) {
          reject(e);
        }
      });
    },
  },

  getters: {
    announcements: (state) => state.announcements,
    banners: (state) => state.banners,
  },
};

export default Announcement;
