<template>
  <view>
    <u-cell-group>
      <u-cell-item
        title="头像"
        :value-style="{display: 'flex', flexDirection:'row-reverse', alignItems: 'center'}"
        :arrow="false"
        @click="handleChooseAvatar"
      >
        <view class="avatar">
          <image
            :src="userInfo.avatarUrl"
            mode="aspectFill"
            class="avatar-image"
          />
          <view class="avatar-icon">
            <image
              src="@/static/images/profile/camera.png"
              class="avatar-icon-image"
            />
          </view>
        </view>
      </u-cell-item>
      <u-cell-item
        title="姓名"
        :value="userInfo.name"
        :arrow="false"
        hover-class="none"
      />
    </u-cell-group>
    <u-cell-group title=" ">
      <u-cell-item
        title="手机号"
        :value="userInfo.phone"
        @click="handleEditPhoneNumber"
      />
    </u-cell-group>
    <u-cell-group title=" ">
      <u-cell-item
        title="注册时间"
        :value="parseDateTime(userInfo.registerTime)"
        :arrow="false"
        hover-class="none"
      />
      <u-cell-item
        title="注册时长"
        :value="registerTimeFromNow"
        :arrow="false"
        hover-class="none"
      />
      <picker
        mode="region"
        :value="addressArray"
        @change="handleAddressPickerChange"
      >
        <u-cell-item
          title="常居地"
          :value="address"
        />
      </picker>
      <!-- <u-cell-item
        title="个人简介"
        value="新版本"
      /> -->
    </u-cell-group>
  </view>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import UCellGroup from "@/components/UCellGroup/index.vue";
import UCellItem from "@/components/UCellItem/index.vue";
import { useStore } from "vuex";
import dayjs from "@/utils/dayjs";
import { requestUpdateAvatar, requestUpdateInformation } from "@/api/user";
import authService from "@/service/authService";
import {
  hideLoading,
  navigateTo,
  showLoading,
  showModalError,
  showToast,
} from "@/utils/helper";
import { VolunteerInformation } from "@/api/types/models";
import store from "@/store";
import { MutationTypes } from "@/enums/mutationTypes";
import { requestUploadImage } from "@/api/common";
import { useTime } from "@/uses/useTime";

const editUserInfo = async (params: VolunteerInformation) => {
  showLoading("请稍候");
  try {
    await requestUpdateInformation(params);
    await authService.getUserInfo();
    showToast("修改成功", "success");
  } catch (e) {
    console.log(e);
    hideLoading();
  }
};

const useShowInfo = () => {
  const store = useStore();

  const userInfo = computed(() => {
    return store.getters.userInfo;
  });

  const registerTimeFromNow = computed(() => {
    const time: string = userInfo?.value?.registerTime;

    return dayjs(time).fromNow(true);
  });

  const address = computed(() => {
    const province = userInfo?.value?.province;
    const city = userInfo?.value?.city;
    const district = userInfo?.value?.district;

    return province && city && district
      ? `${province} ${city} ${district}`
      : "";
  });

  const addressArray = computed(() => {
    const province = userInfo?.value?.province;
    const city = userInfo?.value?.city;
    const district = userInfo?.value?.district;

    return [province, city, district];
  });

  return {
    userInfo,
    registerTimeFromNow,
    address,
    addressArray,
  };
};

const useEditAddress = () => {
  const handleAddressPickerChange = async (e: any) => {
    const arr = e.detail.value;
    await editUserInfo({
      province: arr[0],
      city: arr[1],
      district: arr[2],
    });
  };

  return { handleAddressPickerChange };
};

const useEditAvatar = () => {
  const handleChooseAvatar = () => {
    navigateTo("/pages/UAvatarCropper/index", {
      // 输出图片宽度，高等于宽，单位px
      destWidth: 200,
      // 裁剪框宽度，高等于宽，单位px
      rectWidth: 200,
      // 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
      fileType: "jpg",
    });
  };

  return { handleChooseAvatar };
};

const uploadAvatar = async (path: string) => {
  showLoading("请稍候");
  try {
    const uploadRes = await requestUploadImage(path);
    console.log(uploadRes);
    if (uploadRes.data.status !== 200 || !uploadRes.data.data) {
      throw Error("上传图片失败");
    }
    const avatarUrl = uploadRes.data.data;
    await requestUpdateAvatar({ avatarUrl });
    await authService.getUserInfo();
    showToast("修改成功", "success");
  } catch (e) {
    console.log(e);
    hideLoading();
    showModalError("上传图片失败");
  }
};

export default defineComponent({
  components: { UCellGroup, UCellItem },
  setup() {
    const handleEditPhoneNumber = () => {
      navigateTo("/pages/editPhoneNumber/index");
    };

    return {
      ...useShowInfo(),
      ...useEditAddress(),
      ...useEditAvatar(),
      handleEditPhoneNumber,
      ...useTime(),
    };
  },
  onShow() {
    if (store.getters.avatarPath) {
      uploadAvatar(store.getters.avatarPath);
      store.commit(MutationTypes.SET_AVATAR_PATH, "");
    }
  },
});
</script>

<style lang="scss" scoped>
.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 100%;
  overflow: hidden;
  position: relative;

  &-image {
    width: 96rpx;
    height: 96rpx;
    border-radius: 100%;
  }

  &-icon {
    position: absolute;
    bottom: 0;
    width: 96rpx;
    height: 24rpx;
    // background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;

    &-image {
      width: 24rpx;
      height: 24rpx;
    }
  }
}
</style>
