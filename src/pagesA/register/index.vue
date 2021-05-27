<template>
  <view class="page">
    <view
      class="step"
      :class="[
        step === 1 ? 'step--show' : ''
      ]"
    >
      <view class="title">
        绑定手机号
      </view>
      <sms-verify
        v-if="step === 1"
        :phone="smsForm.phone"
        :code="smsForm.code"
        sms-api="family/getBindCode"
        @phoneChange="handlePhoneChange"
        @codeChange="handleCodeChange"
      />
    </view>
    <view
      class="step"
      :class="[
        step === 2 ? 'step--show' : ''
      ]"
    >
      <view class="title">
        绑定个人身份信息
      </view>
      <u-input
        v-if="step === 2"
        v-model="profileForm.name"
        placeholder="请输入姓名"
        label="姓名"
        label-width="180"
      />
      <picker
        mode="region"
        :value="addressArray"
        @change="handleAddressPickerChange"
      >
        <view class="picker">
          <view class="picker__label">
            所在地
          </view>
          <view
            class="picker__value"
            :style="{color: address === '请选择' ? '#c7c7cc' : ''}"
          >
            {{ address }}
          </view>
        </view>
      </picker>
    </view>

    <view class="actions">
      <u-button
        type="primary"
        shape="circle"
        shadow
        :disabled="!isAllowNextStep"
        :loading="isLoading"
        @click="handleNextStep"
      >
        {{ step === 2 ? "确认提交" : "下一步" }}
      </u-button>
    </view>
  </view>
</template>

<script lang="ts">
import authService from "@/service/authService";
import { computed, defineComponent, reactive, ref } from "vue";
import UInput from "@/components/UInput/index.vue";
import UButton from "@/components/UButton/index.vue";
import SmsVerify from "@/components/SmsVerify/index.vue";
import {
  requestBindPhone,
  requestUpdateInformation,
  requestUpdateWechatUserInfo,
} from "@/api/user";
import { navigateBack, showToast } from "@/utils/helper";
import store from "@/store";

const step = ref(1);

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

  const verifyPhone = async () => {
    await requestBindPhone({
      phone: smsForm.phone,
      code: smsForm.code,
    });
  };

  return { smsForm, handlePhoneChange, handleCodeChange, verifyPhone };
};

const useProfileVerify = () => {
  const profileForm = reactive({
    name: "",
    province: undefined,
    city: undefined,
    district: undefined,
  });

  const verifyProfile = async (userInfo: any) => {
    await requestUpdateInformation(profileForm);
    await requestUpdateWechatUserInfo({
      encryptedData: userInfo.encryptedData,
      iv: userInfo.iv,
    });
  };

  const handleAddressPickerChange = async (e: any) => {
    const arr = e.detail.value;
    profileForm.province = arr[0];
    profileForm.city = arr[1];
    profileForm.district = arr[2];
  };

  const address = computed(() => {
    const province = profileForm.province;
    const city = profileForm.city;
    const district = profileForm.district;

    return province && city && district
      ? `${province} ${city} ${district}`
      : "请选择";
  });

  const addressArray = computed(() => {
    const province = profileForm.province;
    const city = profileForm.city;
    const district = profileForm.district;

    return [province, city, district];
  });

  return {
    profileForm,
    verifyProfile,
    handleAddressPickerChange,
    address,
    addressArray,
  };
};

export default defineComponent({
  components: { UButton, UInput, SmsVerify },
  setup() {
    const smsVerify = useSmsVerify();
    const profileVerify = useProfileVerify();
    const isLoading = ref(false);

    const handleNextStep = async () => {
      const userInfo = await wx.getUserProfile({
        desc: "获取您的用户名和头像",
      });

      isLoading.value = true;
      if (step.value === 1) {
        try {
          await smsVerify.verifyPhone();
          step.value = 2;
        } catch (e) {
          console.log(e);
        }
      } else if (step.value === 2) {
        try {
          await profileVerify.verifyProfile(userInfo);
          showToast("验证成功", "success");
          await authService.getUserInfo();
          navigateBack();
        } catch (e) {
          console.log(e);
        }
      }
      isLoading.value = false;
    };

    const isAllowNextStep = computed(() => {
      if (step.value === 2) {
        return profileVerify.profileForm.name.length >= 2;
      }

      return (
        smsVerify.smsForm.phone.length === 11 &&
        smsVerify.smsForm.code.length === 6
      );
    });

    return {
      step,
      isAllowNextStep,
      handleNextStep,
      isLoading,
      ...smsVerify,
      ...profileVerify,
    };
  },
  onLoad(query) {
    if (query && query.step === "2") {
      step.value = 2;
    } else {
      step.value = 1;
    }
  },
  onUnload() {
    if (!store.getters.hasFamilyInfo) {
      authService.logout();
    }
  },
});
</script>

<style lang="scss" scoped>
.page {
  position: relative;
}

.title {
  font-size: $uni-font-size-xxl;
  margin-bottom: 50rpx;
}

.actions {
  position: absolute;
  top: 750rpx;
  left: 0;
  box-sizing: border-box;
  width: 100vw;
  text-align: center;
}

.step {
  opacity: 0;
  transition: all 0.2s linear;
  padding: 72rpx;
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: 100vw;

  &--show {
    opacity: 1;
  }
}

.picker {
  height: 88rpx;
  padding-top: 22rpx;
  display: flex;
  justify-content: space-between;

  &__label {
    font-size: $uni-font-size-lg;
    margin: 22rpx 0;
    width: 180rpx;
  }

  &__value {
    font-size: $uni-font-size-lg;
    margin: 22rpx 0;
    flex: 1;
  }
}
</style>
