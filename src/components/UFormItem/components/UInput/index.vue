<template>
  <view class="u-input__wrapper">
    <view
      class="u-input"
      :class="[
        state.focus ? 'u-input--focus' : '',
      ]"
    >
      <view class="u-input__row">
        <input
          v-model="inputValue"
          :type="type"
          class="u-input__input"
          :placeholder="placeholder"
          placeholder-class="u-input--placeholder"
          :maxlength="maxlength"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @confirm="handleConfirm"
          @keyboardheightchange="handleKeyBoardHeightChange"
        >
      </view>
      <span class="u-input__outline" />
      <span class="u-input__outline u-input__outline--dynamic" />
    </view>
    <span
      v-if="description"
      class="u-input__description"
    >{{ description }}</span>
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    type: {
      type: String,
      default: "text",
    },
    value: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    maxlength: {
      type: [String, Number],
      default: "1000",
    },
    labelWidth: {
      type: [String, Number],
      default: "150",
    },
  },
  emits: [
    "input",
    "onInput",
    "focus",
    "blur",
    "confirm",
    "keyboardheightchange",
  ],
  data() {
    return {
      inputValue: "",
      state: {
        focus: false,
      },
    };
  },
  watch: {
    inputValue(val) {
      if (val !== this.value) {
        this.$emit("input", val);
      }
    },
    value(val) {
      if (val !== this.inputValue) {
        this.inputValue = val;
      }
    },
  },
  methods: {
    handleInput(e: any) {
      this.$emit("onInput", e);
    },
    handleFocus(e: any) {
      this.$emit("focus", e);
      this.state.focus = true;
    },
    handleBlur(e: any) {
      this.$emit("blur", e);
      this.state.focus = false;
    },
    handleConfirm(e: any) {
      this.$emit("confirm", e);
    },
    handleKeyBoardHeightChange(e: any) {
      this.$emit("keyboardheightchange", e);
    },
  },
});
</script>

<style lang="scss">
.u-input {
  height: 88rpx;
  position: relative;

  &__row {
    display: flex;
  }

  &__label {
    font-size: $uni-font-size-lg;
    margin: 22rpx 0;
  }

  &__input {
    font-size: $uni-font-size-lg;
    margin: 22rpx 0;
    flex: 1;
  }

  &--placeholder {
    color: $uni-text-color-placeholder;
  }

  &--focus {
    .u-input__outline--dynamic {
      transform: scaleX(1);
      transform-origin: left center;
    }
  }

  &__description {
    font-size: $uni-font-size-xs;
    color: $uni-text-color-darkgrey;
  }

  &__outline {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    transform: scaleY(0.5);
    background-color: #f0f0f0;

    &--dynamic {
      background-color: $uni-text-color-darkgrey;
      transform: scaleX(0);
      transform-origin: right center;
      transition: transform 0.3s ease-in-out;
    }
  }
}
</style>
