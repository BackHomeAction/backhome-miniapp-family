<template>
  <picker
    :mode="mode"
    :range="range"
    :range-key="rangeKey"
    :disabled="disabled"
    :value="selectValue"
    @change="handleChange"
    @cancel="handleCancel"
  >
    <view class="u-picker">
      <view class="picker">
        <view
          class="picker__value"
          :class="{'picker__value--blank': value===''}"
        >
          {{ value!=="" ? value : placeholder }}
        </view>
        <view class="picker__tip">
          选择
        </view>
        <span class="outline" />
      </view>
    </view>
  </picker>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    range: {
      type: Array,
      default: () => {
        return [];
      },
    },
    rangeKey: {
      type: String,
      default: "",
    },
    mode: {
      type: String as PropType<"selector" | "multiSelector" | "time" | "date">,
      default: "selector",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: "",
    },
    selectValue: {
      type: [String, Array],
      default: null,
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
  },
  emits: ["change", "cancel"],
  setup(props, { emit }) {
    const handleChange = (e: any) => {
      emit("change", e);
    };
    const handleCancel = () => {
      emit("cancel");
    };

    return { handleChange, handleCancel };
  },
});
</script>

<style lang="scss" scoped>
.u-picker {
  height: 66rpx;
}

.picker {
  display: flex;
  justify-content: space-between;
  margin: 22rpx 0;
  box-sizing: border-box;
  height: 44rpx;
  position: relative;

  &__value {
    font-size: 32rpx;
    font-weight: 400;
    color: #000000;
    line-height: 50rpx;
    flex: 1;

    &--blank {
      color: $uni-text-color-placeholder !important;
    }
  }

  &__tip {
    font-size: 32rpx;
    font-weight: 400;
    color: #539eb7;
    line-height: 50rpx;
  }

  .outline {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -22rpx;
    height: 1px;
    transform: scaleY(0.5);
    background-color: #f0f0f0;
  }
}
</style>
