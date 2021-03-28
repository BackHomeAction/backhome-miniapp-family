<template>
  <scroll-view>
    <view class="body">
      <!-- 注意上线时使用 canvas2d -->
      <painter
        id="poster"
        style="position:fixed; top:-9999rpx"
        :palette="data"
        dirty
        l-r-u
        @imgOK="onImgOK"
        @imgErr="onImgErr"
      />
      <painter
        id="poster-small"
        style="position:fixed; top:-9999rpx"
        :palette="dataSmall"
        dirty
        l-r-u
        @imgOK="onSmallImgOK"
        @imgErr="onSmallImgErr"
      />
      <scroll-view
        v-if="!isLoading"
        class="poster"
        :class="{'single-page': isSinglePage}"
        scroll-y
      >
        <view class="poster__wrapper">
          <image
            v-if="posterUrl"
            :src="posterUrl"
            mode="aspectFill"
            class="poster__image"
          />
        </view>
      </scroll-view>
      <view
        v-if="!isSinglePage"
        class="action"
      >
        <button
          class="action__item"
          open-type="share"
        >
          <view class="item__icon">
            <image
              src="/static/images/icon/share.png"
              mode="aspectFill"
              class="icon__image"
            />
          </view>
          <view class="item__text">
            发送给好友
          </view>
        </button>
        <view
          class="action__item"
          @click="handleShareToMoments"
        >
          <view class="item__icon">
            <image
              src="/static/images/icon/moments.png"
              mode="aspectFill"
              class="icon__image"
            />
          </view>
          <view class="item__text">
            分享到朋友圈
          </view>
        </view>
        <view
          class="action__item"
          @click="handleSaveToAlbum"
        >
          <view class="item__icon">
            <text class="icon__font iconfont icon-download" />
          </view>
          <view class="item__text">
            保存到相册
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script lang="ts">
import { requestGetCaseByID } from "@/api/open";
import { Case } from "@/api/types/models";
import dayjs from "@/utils/dayjs";
import {
  hideLoading,
  navigateBack,
  showLoading,
  showModalError,
  showToast,
} from "@/utils/helper";
import { computed, defineComponent, Ref, ref } from "vue";

const posterUrl = ref("");
const smallPosterUrl = ref("");
const isLoading = ref(true);
const isSinglePage = ref(false); // 是否为单页模式
const caseID = ref(0);
const caseInfo: Ref<null | Case> = ref(null);

// 计算年龄
const manAge = computed(() => {
  return parseInt(dayjs(caseInfo.value?.oldMan?.birthDate).fromNow(), 10);
});
// 走失日期
const lostDate = computed(() => {
  return dayjs(caseInfo.value?.lostTime).format("YYYY年MM月DD日");
});
// 常去地点文字
const offenPlaceText = computed(() => {
  if (!caseInfo.value?.oldMan?.offerPlace) return "暂无";

  let text = "";
  const list = JSON.parse(caseInfo.value?.oldMan.offerPlace);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list.map((ele: any, index: number) => {
    if (index !== list.length - 1) {
      text += `${ele.name}、`;
    } else {
      text += ele.name;
    }
  });

  return text;
});
// 描述文字
const featureText = computed(() => {
  if (!caseInfo.value) return "暂无";

  let text = "";

  if (caseInfo.value?.oldMan?.height) {
    text += `身高${caseInfo.value?.oldMan?.height}cm，`;
  }
  if (caseInfo.value?.oldMan?.weight) {
    text += `体重${caseInfo.value?.oldMan?.weight}kg，`;
  }
  if (caseInfo.value?.oldMan?.senileDementia === 2) {
    text += "患有老年痴呆，";
  }
  if (caseInfo.value?.oldMan?.others) {
    text += `${caseInfo.value?.oldMan?.others}，`;
  }

  if (text == "") return "暂无";

  return text.substring(0, text.lastIndexOf("，"));
});

const usePoster = () => {
  const common = {
    color: "#ffffff",
    shadow: "1px 2px 4px #000000",
  };

  const data = computed(() => {
    if (!caseID.value) return null;

    return {
      background: "#eee",
      width: "550px",
      height: "1000px",
      borderRadius: "20px",
      views: [
        // 模板
        {
          type: "image",
          url: "https://fwwb2020-common.tgucsdn.com/images/poster/template.jpg",
          css: {
            width: "550px",
            height: "1000px",
            borderRadius: "20px",
          },
        },
        // 老人照片
        {
          type: "image",
          url: caseInfo.value?.oldMan?.identificationPhoto,
          css: {
            width: "154px",
            height: "180px",
            top: "170px",
            left: "80px",
            borderRadius: "12px",
          },
        },
        // 小程序码
        {
          type: "image",
          url: `https://fwwb2020-app-volunteer.tgucsdn.com/largeScreen/unlimited?caseId=${caseID.value}`,
          css: {
            width: "86px",
            height: "86px",
            bottom: "10px",
            left: "10px",
          },
        },
        // 姓名性别
        {
          id: "text-name",
          type: "text",
          text: `${caseInfo.value?.oldMan?.name}${
            caseInfo.value?.oldMan?.sex === 1 ? "（男）" : "（女）"
          }`,
          css: [
            {
              top: "370px",
              left: "80px",
              fontWeight: "bold",
              fontSize: "42px",
            },
            common,
          ],
        },
        // 年龄
        {
          type: "text",
          text: `年龄：${manAge.value} 岁`,
          css: [
            {
              top: "440px",
              left: "80px",
              fontSize: "24px",
            },
            common,
          ],
        },
        // 走失日期
        {
          type: "text",
          text: `走失日期：${lostDate.value}`,
          css: [
            {
              top: "480px",
              left: "80px",
              fontSize: "24px",
            },
            common,
          ],
        },
        // 走失地点
        {
          id: "text-lostplace",
          type: "text",
          text: `走失地点：${caseInfo.value?.place}`,
          css: [
            {
              width: "380px",
              maxLines: 2,
              top: "520px",
              left: "80px",
              fontSize: "24px",
              lineHeight: "28.8px",
            },
            common,
          ],
        },
        // 特征描述
        {
          id: "text-offenplace",
          type: "text",
          text: `常去地点：${offenPlaceText.value}`,
          css: [
            {
              width: "380px",
              maxLines: 2,
              top: ["540px", "text-lostplace"],
              left: "80px",
              fontSize: "24px",
              lineHeight: "28.8px",
            },
            common,
          ],
        },
        // 特征描述
        {
          id: "text-feature",
          type: "text",
          text: `走失人特征：${featureText.value}`,
          css: [
            {
              width: "380px",
              maxLines: 3,
              top: ["580px", "text-offenplace"],
              left: "80px",
              fontSize: "24px",
              lineHeight: "28.8px",
            },
            common,
          ],
        },
        // 家属联系方式
        {
          type: "text",
          text: `家属联系方式：${caseInfo.value?.oldMan?.phone || "暂无"}`,
          css: [
            {
              width: "380px",
              maxLines: 2,
              top: "770px",
              left: "80px",
              fontSize: "24px",
              lineHeight: "28.8px",
            },
            common,
          ],
        },
      ],
    };
  });

  const onImgOK = (e: any) => {
    console.log(e);
    posterUrl.value = e.detail.path;
    isLoading.value = false;
    hideLoading();
  };

  const onImgErr = async (e: any) => {
    console.log(e);
    await showModalError("海报生成失败");
    hideLoading();

    navigateBack();
  };

  return { data, onImgOK, onImgErr };
};

const usePosterSmall = () => {
  const common = {
    color: "#ffffff",
    shadow: "1px 2px 4px #000000",
  };

  const dataSmall = computed(() => {
    if (!caseID.value) return null;

    return {
      background: "#eee",
      width: "500px",
      height: "400px",
      views: [
        // 模板
        {
          type: "image",
          url:
            "https://fwwb2020-common.tgucsdn.com/images/poster/template-small.jpg",
          css: {
            width: "500px",
            height: "400px",
          },
        },
        // 老人照片
        {
          type: "image",
          url: caseInfo.value?.oldMan?.identificationPhoto,
          css: {
            width: "77px",
            height: "85px",
            top: "100px",
            left: "60px",
            borderRadius: "12px",
          },
        },
        // 姓名性别
        {
          id: "text-name",
          type: "text",
          text: `${caseInfo.value?.oldMan?.name}${
            caseInfo.value?.oldMan?.sex === 1 ? "（男）" : "（女）"
          }`,
          css: [
            {
              top: "117px",
              left: "160px",
              fontWeight: "bold",
              fontSize: "36px",
            },
            common,
          ],
        },
        // 年龄
        {
          type: "text",
          text: `年龄：${manAge.value} 岁`,
          css: [
            {
              top: "195px",
              left: "60px",
              fontSize: "20px",
            },
            common,
          ],
        },
        // 走失日期
        {
          type: "text",
          text: `走失日期：${lostDate.value}`,
          css: [
            {
              top: "225px",
              left: "60px",
              fontSize: "20px",
            },
            common,
          ],
        },
        // 走失地点
        {
          id: "text-lostplace",
          type: "text",
          text: `走失地点：${caseInfo.value?.place}`,
          css: [
            {
              width: "380px",
              maxLines: 1,
              top: "255px",
              left: "60px",
              fontSize: "20px",
            },
            common,
          ],
        },
        // 特征描述
        {
          type: "text",
          text: `走失人特征：${featureText.value}`,
          css: [
            {
              width: "370px",
              maxLines: 3,
              top: ["265px", "text-lostplace"],
              left: "60px",
              fontSize: "20px",
              lineHeight: "24px",
            },
            common,
          ],
        },
        // 家属联系方式
        {
          type: "text",
          text: `家属联系方式：${caseInfo.value?.oldMan?.phone || "暂无"}`,
          css: [
            {
              width: "380px",
              maxLines: 2,
              top: "340px",
              left: "60px",
              fontSize: "20px",
            },
            common,
          ],
        },
      ],
    };
  });

  const onSmallImgOK = (e: any) => {
    smallPosterUrl.value = e.detail.path;
  };

  const onSmallImgErr = async (e: any) => {
    console.log(e);
  };

  return { dataSmall, onSmallImgOK, onSmallImgErr };
};

const getCaseInfo = async (caseId: number) => {
  showLoading();
  try {
    const res = await requestGetCaseByID({ caseId });
    if (!res.data?.data) {
      throw new Error();
    }
    console.log(res.data.data);
    caseInfo.value = res.data.data;
  } catch (e) {
    console.log(e);
  }
};

const saveImageToAlbum = (path: string) => {
  showLoading("保存中");
  uni.saveImageToPhotosAlbum({
    filePath: path,
    success: () => {
      showToast("保存成功", "success");
      hideLoading();
    },
    fail: () => {
      showToast("保存失败");
      hideLoading();
    },
  });
};

const useActions = () => {
  const handleShareToMoments = () => {
    showToast("请点击右上角按钮分享");
  };

  const handleSaveToAlbum = () => {
    uni.getSetting({
      success(res) {
        if (!res.authSetting["scope.writePhotosAlbum"]) {
          wx.authorize({
            scope: "scope.writePhotosAlbum",
            success() {
              saveImageToAlbum(posterUrl.value);
            },
          });
        } else {
          saveImageToAlbum(posterUrl.value);
        }
      },
    });
  };

  return { handleShareToMoments, handleSaveToAlbum };
};

export default defineComponent({
  setup() {
    return {
      ...usePoster(),
      ...usePosterSmall(),
      ...useActions(),
      posterUrl,
      isLoading,
      caseInfo,
      isSinglePage,
    };
  },
  onLoad(params: { id: string }) {
    caseID.value = parseInt(params.id, 10);
    const { scene } = uni.getLaunchOptionsSync();
    if (scene === 1154) {
      isSinglePage.value = true;
    }
  },
  onReady() {
    getCaseInfo(caseID.value);
  },
  onShareAppMessage() {
    return {
      title: `为爱接力，帮${caseInfo.value?.district}走失老人回家`,
      path: `/pagesA/poster/index?id=${caseID.value}`,
      imageUrl: smallPosterUrl.value,
    };
  },
  onShareTimeline() {
    return {
      title: `为爱接力，帮${caseInfo.value?.district}走失老人回家`,
      query: `id=${caseID.value}`,
    };
  },
});
</script>

<style lang="scss" scoped>
.body {
  position: relative;
  height: 100vh;

  &::before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: url("../../static/images/poster/background_small.jpg");
    background-size: cover;
    transform: scale(1.1);
    filter: blur(50px);
  }
}

.poster {
  box-sizing: border-box;
  height: calc(100vh - 200rpx);

  &.single-page {
    height: 100vh;
  }

  &__wrapper {
    box-sizing: border-box;
    padding: 40rpx 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    filter: drop-shadow(0 8rpx 8rpx rgba(0, 0, 0, 0.4));
  }

  &__image {
    width: 675rpx;
    height: 1227.272727rpx;
  }
}

.action {
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  background: #f7f7f7;
  width: 100vw;
  height: 200rpx;
  padding: 40rpx 100rpx 60rpx 100rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    // fix button style
    position: relative;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-size: inherit;
    text-align: inherit;
    text-decoration: inherit;
    line-height: inherit;
    border: none;
    border-radius: none;
    -webkit-tap-highlight-color: transparent;
    overflow: hidden;
    cursor: pointer;
    color: inherit;
    background: none;

    &::after {
      border: none;
    }

    .item {
      &__icon {
        width: 100rpx;
        height: 100rpx;
        border-radius: 26rpx;
        box-shadow: 0rpx 0rpx 4rpx 0 rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        background: #ffffff;

        .icon {
          &__image {
            width: 70rpx;
            height: 70rpx;
          }
          &__font {
            font-size: 55rpx;
          }
        }
      }

      &__text {
        margin-top: 14rpx;
        font-size: 22rpx;
        line-height: 30rpx;
        color: $uni-text-color-darkgrey;
      }
    }
  }
}
</style>
