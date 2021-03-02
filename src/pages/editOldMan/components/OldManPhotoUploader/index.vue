<template>
  <view class="body">
    <view
      v-for="item in photos"
      :key="item"
      class="item"
    >
      <image
        class="item item-image"
        :src="item"
        mode="aspectFill"
        @click="handlePreviewPhoto(item)"
      />
      <view
        class="item-remove"
        @click="handleRemovePhoto(item)"
      >
        <view class="item-remove-icon iconfont icon-close" />
      </view>
    </view>
    <view
      v-if="photos.length < maxUpload"
      class="item item-add"
      @click="handleAddPhoto"
    >
      <view class="item-add-icon iconfont icon-increase" />
      <view class="item-add-label">
        {{ label }}
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { showLoading, hideLoading, showModalError } from "@/utils/helper";
import { requestUploadImage } from "@/api/common";

const uploadImage = async (path: string) => {
  const uploadRes = await requestUploadImage(path);
  console.log(uploadRes);
  if (uploadRes.data.status !== 200 || !uploadRes.data.data) {
    throw Error("上传图片失败");
  }
  return uploadRes.data.data;
};

export default defineComponent({
  props: {
    photos: {
      type: Array as PropType<Array<string>>,
      default: () => {
        return [];
      },
    },
    maxUpload: {
      type: Number,
      default: 1,
    },
    label: {
      type: String,
      default: "请上传图片",
    },
  },
  emits: ["change"],
  setup(props, { emit }) {
    const handleAddPhoto = async () => {
      uni.chooseImage({
        count: 1,
        success: async (res) => {
          showLoading("请稍候");
          try {
            const url = await uploadImage(res.tempFilePaths[0]);
            const newPhotoList = props.photos.slice(0);
            newPhotoList.push(url);
            emit("change", newPhotoList);
          } catch (e) {
            console.log(e);
            showModalError("上传图片失败");
          }
          hideLoading();
        },
      });
    };

    const handleRemovePhoto = (path: string) => {
      const index = props.photos.findIndex((url) => url === path);
      const newPhotoList = props.photos.slice(0);
      newPhotoList.splice(index, 1);
      emit("change", newPhotoList);
    };

    // 点击图片进行预览
    const handlePreviewPhoto = (path: string) => {
      uni.previewImage({
        urls: props.photos,
        current: props.photos.findIndex((url) => url === path).toString(),
      });
    };

    return { handleAddPhoto, handleRemovePhoto, handlePreviewPhoto };
  },
});
</script>

<style lang="scss" scoped>
.body {
  box-sizing: border-box;
  padding-top: 22rpx;
  display: inline-flex;
}

.item {
  display: inline-block;
  width: 252rpx;
  height: 140rpx;
  border-radius: 10rpx;
  position: relative;

  & + & {
    margin-left: 32rpx;
  }

  &-remove {
    position: absolute;
    top: -10rpx;
    right: -10rpx;
    width: 40rpx;
    height: 40rpx;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #000000;
    opacity: 0.5;

    &-icon {
      color: #ffffff;
      font-size: 35rpx;
    }
  }

  &-add {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 2rpx solid #979797;

    &-icon {
      font-size: 60rpx;
      color: #979797;
    }

    &-label {
      font-size: 20rpx;
      font-weight: 400;
      color: #979797;
      line-height: 28rpx;
    }
  }
}
</style>
