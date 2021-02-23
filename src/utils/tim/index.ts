import TIM from "tim-wx-sdk";
import TIMUploadPlugin from "tim-upload-plugin";
import timSettings from "@/config/tim";
import store from "@/store";
import { MutationTypes } from "@/enums/mutationTypes";
import { ActionTypes } from "@/enums/actionTypes";

const options = {
  SDKAppID: timSettings.SDKAppID, // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
};

// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
const tim = TIM.create(options); // SDK 实例通常用 tim 表示

// 注册监听事件
registerEvents(tim);

// 设置 SDK 日志输出级别，详细分级请参见 <a href="https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#setLogLevel">setLogLevel 接口的说明</a>
if (process.env.NODE_ENV === "development") {
  tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
} else {
  tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
}

// 注册腾讯云即时通信IM上传插件
tim.registerPlugin({ "tim-upload-plugin": TIMUploadPlugin });

function registerEvents(tim: any) {
  tim.on(TIM.EVENT.SDK_READY, onReadyStateUpdate);
  tim.on(TIM.EVENT.SDK_NOT_READY, onReadyStateUpdate);

  // tim.on(TIM.EVENT.KICKED_OUT, kickOut);
  // tim.on(TIM.EVENT.ERROR, onError);

  tim.on(TIM.EVENT.MESSAGE_RECEIVED, messageReceived);
  tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, convListUpdate);
  tim.on(TIM.EVENT.GROUP_LIST_UPDATED, groupListUpdate);
  // tim.on(TIM.EVENT.BLACKLIST_UPDATED, blackListUpdate);
  // tim.on(TIM.EVENT.NET_STATE_CHANGE, netStateChange);
  // tim.on(TIM.EVENT.MESSAGE_READ_BY_PEER, onMessageReadByPeer);
}

function onReadyStateUpdate(params: { name: string }) {
  const isSDKReady = params.name === TIM.EVENT.SDK_READY;
  if (isSDKReady) {
    // 拉取个人资料
    tim.getMyProfile().then((res: { data: any }) => {
      console.log(res);
      store.commit(MutationTypes.SET_TIM_MY_INFO, res.data);
    });
    // 拉取群组列表
    tim.getGroupList();
    // wx.$app.getBlacklist().then((res) => {
    //   store.commit("setBlacklist", res.data);
    // });
  }
  store.commit(MutationTypes.SET_TIM_SDK_READY, isSDKReady);
}

function groupListUpdate(event: { data: any }) {
  store.commit(MutationTypes.SET_TIM_MY_GROUPS, event.data);
}

function convListUpdate(event: { data: any }) {
  store.commit(MutationTypes.SET_TIM_ALL_CONVERSATION, event.data);
}

function messageReceived(event: any) {
  store.dispatch(ActionTypes.onMessageEvent, event);
}

export default tim;
