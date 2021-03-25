<template>
  <view>
    <painter
      style="position:fixed; top:-9999rpx"
      :palette="data"
      use2-d
      @imgOK="onImgOK"
    />
    <image
      v-if="posterUrl"
      :src="posterUrl"
    />
  </view>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

const posterUrl = ref("");

const startTop = 50;
const gapSize = 70;
const common = {
  left: "20rpx",
  fontSize: "60rpx",
};

const data = {
  background: "#eee",
  width: "854rpx",
  height: "600rpx",
  borderRadius: "20rpx",
  views: [
    {
      type: "text",
      text: "fontWeight: 'bold'",
      css: [
        {
          top: `${startTop + 4 * gapSize}rpx`,
          fontWeight: "bold",
        },
        common,
      ],
    },
  ],
};

export default defineComponent({
  setup() {
    const onImgOK = (e: any) => {
      console.log(e);
      posterUrl.value = e.detail.path;
    };

    return { data, onImgOK, posterUrl };
  },
});
</script>

<style lang="scss" scoped></style>
