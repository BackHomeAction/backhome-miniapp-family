<template>
  <view class="input">
    <view class="edit">
      <view
        class="image"
        @tap="sendImageMessage"
      >
        <view class="icon" />
      </view>
      <textarea
        v-model="inputText"
        class="input"
        placeholder="输入消息…"
        auto-height
        confirm-type="done"
        :maxlength="-1"
        disable-default-padding
        cursor-spacing="10"
      />
      <u-button
        class="send"
        :disabled="!inputText"
        size="mini"
        type="func"
        custom-style="height: 62rpx; line-height: 62rpx; padding: 0 24rpx; margin-left: 16rpx;"
        @click="sendTextMessage"
      >
        发送
      </u-button>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import UButton from "@/components/UButton/index.vue";
import { Case } from "@/api/types/models";
import {
  sendGroupImageMessage,
  sendGroupTextMessage,
} from "@/service/timService";
import { showModalError } from "@/utils/helper";

const inputText = ref("");

const useInput = () => {
  const isIOS = () => {
    return uni.getSystemInfoSync().platform === "ios";
  };

  return { inputText, isIOS };
};

const useChat = (data: Case) => {
  const sendTextMessage = async () => {
    if (!data.id) return;

    try {
      await sendGroupTextMessage(data.id, inputText.value);
      inputText.value = "";
    } catch (e) {
      showModalError("消息发送失败");
    }
  };

  const sendImageMessage = async () => {
    if (!data.id) return;

    try {
      await sendGroupImageMessage(data.id);
    } catch (e) {
      showModalError("消息发送失败");
    }
  };

  return { sendTextMessage, sendImageMessage };
};

export default defineComponent({
  components: { UButton },
  props: {
    data: {
      type: Object as PropType<Case>,
      default: null,
    },
  },
  setup(props) {
    return { ...useInput(), ...useChat(props.data) };
  },
});
</script>

<style lang="scss" scoped>
.edit {
  width: 750rpx;
  min-height: 80rpx;
  background: #f8f8f8;
  display: flex;
  padding: 10rpx 16rpx;
  box-sizing: border-box;
  align-items: flex-end;
  border-top: 1px solid #dddddd;
  border-bottom: 1px solid #dddddd;

  .image {
    box-sizing: border-box;
    padding-right: 24rpx;

    .icon {
      width: 56rpx;
      height: 56rpx;
      background-image: url("@/static/images/chat/image.png");
      background-size: cover;
    }
  }

  .input {
    flex: 1;
    background: #ffffff;
    border-radius: 8rpx;
    border: 2rpx solid #dddddd;
    padding: 10rpx;
    line-height: 36rpx;
  }
}
</style>
