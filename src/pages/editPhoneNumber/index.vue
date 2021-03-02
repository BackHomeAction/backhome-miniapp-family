<template>
  <view class="page">
    <view class="title">
      绑定新手机号
    </view>
    <sms-verify
      :phone="smsForm.phone"
      :code="smsForm.code"
      sms-api="family/getUpdateCode"
      @phoneChange="handlePhoneChange"
      @codeChange="handleCodeChange"
    />

    <view class="actions">
      <u-button
        type="primary"
        shape="circle"
        shadow
        :loading="isLoading"
        :disabled="!isAllowSubmit"
        @click="handleSubmit"
      >
        确认提交
      </u-button>
    </view>
  </view>
</template>

<script lang="ts">
import UButton from "@/components/UButton/index.vue";
import SmsVerify from "@/components/SmsVerify/index.vue";
import { requestBindPhone } from "@/api/user";
import authService from "@/service/authService";
import {
  hideLoading,
  navigateBack,
  showLoading,
  showToast,
} from "@/utils/helper";
import { computed, defineComponent, reactive, ref } from "vue";

const useSmsVerify = () => {
  const smsForm = reactive({
    phone: "",
    code: "",
  });

  const handlePhoneChange = (val: string) => {
    smsForm.phone = val;
  };

  const handleCodeChange = (val: string) => {
    smsForm.code = val;
  };

  const submit = async () => {
    await requestBindPhone({
      phone: smsForm.phone,
      code: smsForm.code,
    });
  };

  return { smsForm, handlePhoneChange, handleCodeChange, submit };
};

export default defineComponent({
  components: { UButton, SmsVerify },
  setup() {
    const smsVerify = useSmsVerify();
    const isLoading = ref(false);

    const handleSubmit = async () => {
      showLoading("请稍候");
      try {
        await smsVerify.submit();
        await authService.getUserInfo();
        showToast("修改成功", "success");
        navigateBack();
      } catch (e) {
        console.log(e);
        hideLoading();
      }
    };

    const isAllowSubmit = computed(() => {
      return (
        smsVerify.smsForm.phone.length === 11 &&
        smsVerify.smsForm.code.length === 6
      );
    });

    return {
      ...smsVerify,
      isLoading,
      handleSubmit,
      isAllowSubmit,
    };
  },
});
</script>

<style lang="scss" scoped>
.page {
  padding: 72rpx;
}

.title {
  font-size: $uni-font-size-xxl;
  margin-bottom: 50rpx;
}

.actions {
  margin-top: 350rpx;
  text-align: center;
}
</style>
