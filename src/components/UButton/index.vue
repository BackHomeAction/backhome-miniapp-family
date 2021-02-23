<template>
  <button
    class="u-btn u-line-1 u-fix-ios-appearance"
    :class="[
      'u-size-' + size,
      plain ? 'u-btn--' + type + '--plain' : '',
      loading ? 'u-loading' : '',
      shadow ? 'u-shadow' : '',
      shape == 'circle' ? 'u-round-circle' : '',
      hairLine ? showHairLineBorder : 'u-btn--bold-border',
      'u-btn--' + type,
      disabled ? `u-btn--${type}--disabled` : ''
    ]"
    :disabled="disabled"
    :form-type="formType"
    :open-type="openType"
    :app-parameter="appParameter"
    :hover-stop-propagation="hoverStopPropagation"
    :send-message-title="sendMessageTitle"
    :send-message-path="sendMessagePath"
    :data-name="dataName"
    :session-from="sessionFrom"
    :send-message-img="sendMessageImg"
    :show-message-card="showMessageCard"
    :style="customStyle"
    :hover-class="getHoverClass"
    :loading="loading"
    @click="click"
    @getphonenumber="getphonenumber"
    @getuserinfo="getuserinfo"
    @error="error"
    @opensetting="opensetting"
    @launchapp="launchapp"
  >
    <slot />
  </button>
</template>

<script lang="ts">
/**
 * button 按钮
 * @description Button 按钮
 * @tutorial https://www.uviewui.com/components/button.html
 * @property {String} size 按钮的大小
 * @property {String} type 按钮的样式类型
 * @property {Boolean} plain 按钮是否镂空，背景色透明
 * @property {Boolean} disabled 是否禁用
 * @property {Boolean} hair-line 是否显示按钮的细边框(默认true)
 * @property {Boolean} shape 按钮外观形状，见文档说明
 * @property {Boolean} loading 按钮名称前是否带 loading 图标(App-nvue 平台，在 ios 上为雪花，Android上为圆圈)
 * @property {String} form-type 用于 <form> 组件，点击分别会触发 <form> 组件的 submit/reset 事件
 * @property {String} open-type 开放能力
 * @property {String} data-name 额外传参参数，用于小程序的data-xxx属性，通过target.dataset.name获取
 * @property {String} hover-class 指定按钮按下去的样式类。当 hover-class="none" 时，没有点击态效果(App-nvue 平台暂不支持)
 * @property {Object} custom-style 对按钮的自定义样式，对象形式，见文档说明
 * @event {Function} click 按钮点击
 * @event {Function} getphonenumber open-type="getPhoneNumber"时有效
 * @event {Function} getuserinfo 用户点击该按钮时，会返回获取到的用户信息，从返回参数的detail中获取到的值同uni.getUserInfo
 * @event {Function} error 当使用开放能力时，发生错误的回调
 * @event {Function} opensetting 在打开授权设置页并关闭后回调
 * @event {Function} launchapp 打开 APP 成功的回调
 * @example <u-button>月落</u-button>
 */

import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    // 是否细边框
    hairLine: {
      type: Boolean,
      default: true,
    },
    // 是否加阴影
    shadow: {
      type: Boolean,
      default: false,
    },
    // 按钮的预置样式，default，primary，error，warning，success, func
    type: {
      type: String,
      default: "default",
    },
    // 按钮尺寸，default，medium，mini
    size: {
      type: String,
      default: "default",
    },
    // 按钮形状，circle（两边为半圆），square（带圆角）
    shape: {
      type: String,
      default: "square",
    },
    // 按钮是否镂空
    plain: {
      type: Boolean,
      default: false,
    },
    // 是否禁止状态
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否加载中
    loading: {
      type: Boolean,
      default: false,
    },
    // 开放能力，具体请看uniapp稳定关于button组件部分说明
    // https://uniapp.dcloud.io/component/button
    openType: {
      type: String,
      default: "",
    },
    // 用于 <form> 组件，点击分别会触发 <form> 组件的 submit/reset 事件
    // 取值为submit（提交表单），reset（重置表单）
    formType: {
      type: String,
      default: "",
    },
    // 打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效
    // 只微信小程序、QQ小程序有效
    appParameter: {
      type: String,
      default: "",
    },
    // 指定是否阻止本节点的祖先节点出现点击态，微信小程序有效
    hoverStopPropagation: {
      type: Boolean,
      default: false,
    },
    // 会话来源，open-type="contact"时有效。只微信小程序有效
    sessionFrom: {
      type: String,
      default: "",
    },
    // 会话内消息卡片标题，open-type="contact"时有效
    // 默认当前标题，只微信小程序有效
    sendMessageTitle: {
      type: String,
      default: "",
    },
    // 会话内消息卡片点击跳转小程序路径，open-type="contact"时有效
    // 默认当前分享路径，只微信小程序有效
    sendMessagePath: {
      type: String,
      default: "",
    },
    // 会话内消息卡片图片，open-type="contact"时有效
    // 默认当前页面截图，只微信小程序有效
    sendMessageImg: {
      type: String,
      default: "",
    },
    // 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，
    // 用户点击后可以快速发送小程序消息，open-type="contact"时有效
    showMessageCard: {
      type: Boolean,
      default: false,
    },
    // 手指按（触摸）按钮时按钮时的背景颜色
    hoverBgColor: {
      type: String,
      default: "",
    },
    // 按下的类名
    hoverClass: {
      type: String,
      default: "",
    },
    // 自定义样式
    customStyle: {
      type: [String, Object, Array],
      default: "",
    },
  },
  emits: [
    "click",
    "getphonenumber",
    "getuserinfo",
    "error",
    "opensetting",
    "launchapp",
  ],
  setup(props, { emit }) {
    const click = (e: any) => {
      if (props.loading) {
        return;
      }

      emit("click", e);
    };
    const getphonenumber = (res: any) => {
      emit("getphonenumber", res);
    };
    const getuserinfo = (res: any) => {
      emit("getuserinfo", res);
    };
    const error = (res: any) => {
      emit("error", res);
    };
    const opensetting = (res: any) => {
      emit("opensetting", res);
    };
    const launchapp = (res: any) => {
      emit("launchapp", res);
    };

    // 当没有传bgColor变量时，按钮按下去的颜色类名
    const getHoverClass = computed(() => {
      if (props.loading || props.disabled || props.hoverClass) return "";
      let hoverClass = "";
      hoverClass = props.plain
        ? "u-" + props.type + "-plain-hover"
        : "u-" + props.type + "-hover";
      return hoverClass;
    });

    // 在'primary', 'success', 'error', 'warning', 'func'类型下，不显示边框，否则会造成四角有毛刺现象
    const showHairLineBorder = computed(() => {
      if (
        ["primary", "success", "error", "warning", "func"].indexOf(
          props.type
        ) >= 0 &&
        !props.plain
      ) {
        return "";
      } else {
        return "u-hairline-border";
      }
    });

    return {
      click,
      getphonenumber,
      getuserinfo,
      error,
      opensetting,
      launchapp,
      getHoverClass,
      showHairLineBorder,
    };
  },
});
</script>

<style scoped lang="scss">
.u-btn::after {
  border: none;
}

.u-btn {
  position: relative;
  border: 0;
  border-radius: 10rpx;
  /* #ifndef APP-NVUE */
  display: inline-flex;
  /* #endif */
  // 避免边框某些场景可能被“裁剪”，不能设置为hidden
  overflow: visible;
  line-height: 1;
  // @include vue-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 80rpx;
  z-index: 1;
  box-sizing: border-box;
  transition: all 0.15s;

  &--bold-border {
    border: 1px solid #ffffff;
  }

  &--default {
    color: $u-content-color;
    border-color: #c0c4cc;
    background-color: #ffffff;
  }

  &--primary {
    color: #ffffff;
    border-color: $u-type-primary;
    background-color: $u-type-primary;
  }

  &--success {
    color: #ffffff;
    border-color: $u-type-success;
    background-color: $u-type-success;
  }

  &--error {
    color: #ffffff;
    border-color: $u-type-error;
    background-color: $u-type-error;
  }

  &--warning {
    color: #ffffff;
    border-color: $u-type-warning;
    background-color: $u-type-warning;
  }

  &--func {
    color: #ffffff;
    border-color: $u-type-func;
    background-color: $u-type-func;
  }

  &--default--disabled {
    color: $u-button-text-disabled;
    border-color: #e4e7ed;
    background-color: #ffffff;
  }

  &--primary--disabled {
    color: $u-button-text-disabled !important;
    border-color: $u-type-primary-disabled !important;
    background-color: $u-type-primary-disabled !important;
  }

  &--success--disabled {
    color: $u-button-text-disabled !important;
    border-color: $u-type-success-disabled !important;
    background-color: $u-type-success-disabled !important;
  }

  &--error--disabled {
    color: $u-button-text-disabled !important;
    border-color: $u-type-error-disabled !important;
    background-color: $u-type-error-disabled !important;
  }

  &--warning--disabled {
    color: $u-button-text-disabled !important;
    border-color: $u-type-warning-disabled !important;
    background-color: $u-type-warning-disabled !important;
  }

  &--func--disabled {
    color: $u-button-text-disabled !important;
    border-color: $u-type-func-disabled !important;
    background-color: $u-type-func-disabled !important;
  }

  &--primary--plain {
    color: $u-type-primary !important;
    border-color: $u-type-primary-disabled !important;
    background-color: $u-type-primary-light !important;
  }

  &--success--plain {
    color: $u-type-success !important;
    border-color: $u-type-success-disabled !important;
    background-color: $u-type-success-light !important;
  }

  &--error--plain {
    color: $u-type-error !important;
    border-color: $u-type-error-disabled !important;
    background-color: $u-type-error-light !important;
  }

  &--warning--plain {
    color: $u-type-warning !important;
    border-color: $u-type-warning-disabled !important;
    background-color: $u-type-warning-light !important;
  }

  &--func--plain {
    color: $u-type-func !important;
    border-color: $u-type-func-disabled !important;
    background-color: $u-type-func-light !important;
  }
}
.u-hairline-border:after {
  content: " ";
  position: absolute;
  pointer-events: none;
  // 设置为border-box，意味着下面的scale缩小为0.5，实际上缩小的是伪元素的内容（border-box意味着内容不含border）
  box-sizing: border-box;
  // 中心点作为变形(scale())的原点
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  left: 0;
  top: 0;
  width: 199.8%;
  height: 199.7%;
  -webkit-transform: scale(0.5, 0.5);
  transform: scale(0.5, 0.5);
  border: 1px solid currentColor;
  z-index: 1;
}
.u-wave-ripple {
  z-index: 0;
  position: absolute;
  border-radius: 100%;
  background-clip: padding-box;
  pointer-events: none;
  user-select: none;
  transform: scale(0);
  opacity: 1;
  transform-origin: center;
}
.u-wave-ripple.u-wave-active {
  opacity: 0;
  transform: scale(2);
  transition: opacity 1s linear, transform 0.4s linear;
}
.u-round-circle {
  border-radius: 100rpx;
}
.u-round-circle::after {
  border-radius: 100rpx;
}
.u-loading::after {
  background-color: hsla(0, 0%, 100%, 0.35);
}
.u-size-default {
  font-size: 30rpx;
  height: 80rpx;
  line-height: 80rpx;
}
.u-size-medium {
  /* #ifndef APP-NVUE */
  display: inline-flex;
  /* #endif */
  width: auto;
  font-size: 26rpx;
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 30rpx;
}
.u-size-mini {
  /* #ifndef APP-NVUE */
  display: inline-flex;
  /* #endif */
  width: auto;
  font-size: 22rpx;
  padding-top: 1px;
  height: 50rpx;
  line-height: 50rpx;
  padding: 0 20rpx;
}
.u-primary-plain-hover {
  color: #ffffff !important;
  background: $u-type-primary-dark !important;
}
.u-default-plain-hover {
  color: $u-type-primary-dark !important;
  background: $u-type-primary-light !important;
}
.u-success-plain-hover {
  color: #ffffff !important;
  background: $u-type-success-dark !important;
}
.u-warning-plain-hover {
  color: #ffffff !important;
  background: $u-type-warning-dark !important;
}
.u-error-plain-hover {
  color: #ffffff !important;
  background: $u-type-error-dark !important;
}
.u-info-plain-hover {
  color: #ffffff !important;
  background: $u-type-info-dark !important;
}
.u-func-plain-hover {
  color: #ffffff !important;
  background: $u-type-func-dark !important;
}
.u-default-hover {
  color: $u-type-primary-dark !important;
  border-color: $u-type-primary-dark !important;
  background-color: $u-type-primary-light !important;
}
.u-primary-hover {
  background: $u-type-primary-dark !important;
  color: #fff;
}
.u-success-hover {
  background: $u-type-success-dark !important;
  color: #fff;
}
.u-info-hover {
  background: $u-type-info-dark !important;
  color: #fff;
}
.u-warning-hover {
  background: $u-type-warning-dark !important;
  color: #fff;
}
.u-error-hover {
  background: $u-type-error-dark !important;
  color: #fff;
}
.u-func-hover {
  background: $u-type-func-dark !important;
  color: #fff;
}
.u-shadow {
  box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.5);
}
</style>
