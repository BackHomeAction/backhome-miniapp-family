<template>
  <view class="sms">
    <view class="phone">
      <u-input
        v-model="phoneValue"
        type="number"
        placeholder="请输入手机号"
        maxlength="11"
        label="手机号"
      />
    </view>
    <view class="code">
      <message-input
        mode="bottomLine"
        :maxlength="6"
        :width="65"
        :font-size="36"
        inactive-color="#C7C7CC"
        active-color="#799351"
        style="margin-left: -3px"
        @change="handleCodeChange"
        @finish="handleCodeFinish"
      />
      <u-button
        size="medium"
        type="success"
        :disabled="!isAllowSendCode"
        :loading="isSendingSMS"
        @click="handleSendSMS"
      >
        {{ countDown === 0 ? "获取验证码" : `重发短信(${countDown.toString().padStart(2, '0')})` }}
      </u-button>
    </view>
  </view>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import UInput from "../UInput/index.vue";
import UButton from "../UButton/index.vue";
import MessageInput from "../MessageInput/index.vue";
import { requestGetCode } from "@/api/common";
import { showToast } from "@/utils/helper";

export default defineComponent({
  components: { UInput, UButton, MessageInput },
  props: {
    phone: {
      type: String,
      default: "",
    },
    code: {
      type: String,
      default: "",
    },
    smsApi: {
      type: String,
      default: "",
    },
    smsInterval: {
      type: Number,
      default: 60,
    },
  },
  emits: ["phoneChange", "codeChange", "finish"],
  setup(props, { emit }) {
    const phoneValue = ref(props.phone);
    const codeValue = ref(props.code);
    const isSendingSMS = ref(false);
    const countDown = ref(0);

    const isAllowSendCode = computed(() => {
      return phoneValue.value.length === 11 && countDown.value === 0;
    });

    watch(phoneValue, (newVal) => {
      emit("phoneChange", newVal);
    });

    const handleCodeChange = (val: string) => {
      emit("codeChange", val);
      codeValue.value = val;
    };

    const handleCodeFinish = (val: string) => {
      emit("finish", val);
    };

    const handleSendSMS = async () => {
      isSendingSMS.value = true;

      try {
        await requestGetCode(props.smsApi, { phone: phoneValue.value });
        showToast("验证码发送成功", "success");
        countDown.value = props.smsInterval;
        const timeStop = setInterval(() => {
          countDown.value--;
          if (countDown.value === 0) {
            clearInterval(timeStop);
          }
        }, 1000);
      } catch (e) {}

      isSendingSMS.value = false;
    };

    return {
      isAllowSendCode,
      phoneValue,
      codeValue,
      handleCodeChange,
      handleCodeFinish,
      countDown,
      handleSendSMS,
      isSendingSMS,
    };
  },
});
</script>

<style lang="scss" scoped>
.code {
  margin-top: 50rpx;
  display: flex;
  justify-content: space-between;
}
</style>
