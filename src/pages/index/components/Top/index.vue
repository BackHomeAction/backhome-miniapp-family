<template>
  <view
    class="top"
    :style="{paddingTop: `${menuTop}px`}"
  >
    <view
      class="background background--red"
      :style="{
        height: `calc(${menuTop}px + 580rpx)`,
        clipPath: `circle(calc(${menuTop}px + 1600rpx) at 375rpx calc(-${menuTop}px + -1100rpx))`
      }"
    />
    <view
      class="title"
      :style="{lineHeight: `${menuHeight}px`}"
    >
      归家行动
    </view>
    <swiper
      class="swiper"
      indicator-dots
      autoplay
    >
      <swiper-item
        v-if="!banners || !banners.length"
      >
        <view class="swiper-item swiper-item-default" />
      </swiper-item>
      <!-- TODO: 默认banner -->
      <swiper-item
        v-for="item in banners"
        :key="item.id"
      >
        <view
          class="swiper-item"
          :style="{backgroundImage: `url(${item.url})`}"
          @click="handleClickBanner(item.noticeId)"
        />
      </swiper-item>
    </swiper>
  </view>
</template>

<script lang="ts">
import { ActionTypes } from "@/enums/actionTypes";
import { navigateTo } from "@/utils/helper";
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { useTop } from "@/uses/useTop";

const useBanners = () => {
  const store = useStore();

  store.dispatch(ActionTypes.getBanners);

  const banners = computed(() => {
    return store.getters.banners;
  });

  const handleClickBanner = (id: number) => {
    navigateTo("/pages/announcement/index", { id });
  };

  return { banners, handleClickBanner };
};

export default defineComponent({
  props: {},
  setup() {
    return {
      ...useTop(),
      ...useBanners(),
    };
  },
  options: {
    styleIsolation: "shared",
  },
});
</script>

<style lang="scss" scoped>
.top--title {
  .box {
    margin-top: 80rpx;
  }
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 750rpx;
  height: 432rpx;
  clip-path: circle(700rpx at 375rpx -250rpx);
  z-index: -1;

  &--red {
    background: $uni-color-primary;
  }
}

.title {
  font-size: $uni-font-size-xxl;
  color: #ffffff;
  margin-left: 39rpx;
}

.swiper {
  margin: 80rpx auto 20rpx auto;
  width: 672rpx;
  height: 320rpx;
  border-radius: 20rpx;
  overflow: hidden;

  &-item {
    width: 672rpx;
    height: 320rpx;
    background-size: cover;
    background-position: 50% 50%;
    border-radius: 20rpx;
    overflow: hidden;

    &-default {
      background-image: url("https://fwwb2020-common.tgucsdn.com/images/banner/default.jpg");
    }
  }
}
</style>
