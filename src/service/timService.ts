import { ActionTypes } from "./../enums/actionTypes";
import store from "@/store";
import tim from "@/utils/tim";
import TIM from "tim-wx-sdk";
import { MutationTypes } from "@/enums/mutationTypes";
import { loginTIM } from "./authService";

const getGroupID = (caseId: number) => {
  return store.getters.tim.groupIDsMap.get(`case_${caseId}`);
};

const getConversationID = (caseId: number) => {
  return "GROUP" + getGroupID(caseId);
};

export const checkoutGroup = (caseId: number) => {
  store.dispatch(ActionTypes.checkoutConversation, getConversationID(caseId));
};

export const getMessageList = async () => {
  return await store.dispatch(ActionTypes.getMessageList);
};

export const resetGroup = () => {
  store.commit(MutationTypes.RESET_CURRENT_CONVERSATION);
};

const checkLogin = async () => {
  const state = store.getters.tim.isSdkReady;
  if (!state) {
    await loginTIM();
  }
};

export const sendGroupTextMessage = async (caseId: number, text: string) => {
  await checkLogin();

  const message = tim.createTextMessage({
    to: getGroupID(caseId),
    conversationType: TIM.TYPES.CONV_GROUP,
    payload: {
      text,
    },
  });
  await tim.sendMessage(message);
  store.commit(MutationTypes.SEND_MESSAGE, message);
};

export const sendGroupImageMessage = async (caseId: number) => {
  await checkLogin();

  uni.chooseImage({
    count: 1,
    success: async (file) => {
      const message = tim.createImageMessage({
        to: getGroupID(caseId),
        conversationType: TIM.TYPES.CONV_GROUP,
        payload: {
          file,
        },
      });
      await tim.sendMessage(message);
      store.commit(MutationTypes.SEND_MESSAGE, message);
    },
  });
};
