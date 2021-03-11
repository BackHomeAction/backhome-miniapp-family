<template>
  <view class="radio">
    <view
      v-for="(item, index) in range"
      :key="index"
      class="item"
      @click="handleClick(index)"
    >
      <view class="item__content">
        {{ item }}
      </view>
      <view
        v-if="value === index"
        class="item__icon"
      />
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    range: {
      type: Array,
      default: () => {
        return [];
      },
    },
    value: {
      type: Number,
      default: 0,
    },
  },
  emits: ["input"],
  setup(props, { emit }) {
    const handleClick = (index: number) => {
      emit("input", index);
    };

    return { handleClick };
  },
});
</script>

<style lang="scss" scoped>
.radio {
  background: #ffffff;

  .item {
    height: 66rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &__content {
      font-size: 32rpx;
      font-weight: 400;
      color: #000000;
      line-height: 50rpx;
      flex: 1;
    }

    &__icon {
      width: 40rpx;
      height: 40rpx;
      background-image: url("@/static/images/report/check.png");
      background-size: contain;
      background-position: 50% 50%;
    }
  }
}
</style>
