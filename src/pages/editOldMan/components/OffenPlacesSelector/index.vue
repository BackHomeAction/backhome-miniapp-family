<template>
  <view class="body">
    <view
      v-for="item in value"
      :key="item.name"
      class="item"
      @click="handleRemoveItem(item)"
    >
      <view class="item-icon item-icon-remove" />
      <view class="item-text">
        {{ item.name }}
      </view>
    </view>

    <view
      class="item"
      @click="handleAddItem"
    >
      <view class="item-icon item-icon-add" />
      <view class="item-text">
        添加老人常去地点
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { IPlace } from "@/enums/placeTypes";

export default defineComponent({
  props: {
    value: {
      type: Array as PropType<Array<IPlace>>,
      default: () => {
        return [];
      },
    },
  },
  emits: ["add", "remove"],
  setup(props, { emit }) {
    const handleAddItem = () => {
      emit("add");
    };
    const handleRemoveItem = (item: IPlace) => {
      emit("remove", item);
    };

    return { handleAddItem, handleRemoveItem };
  },
});
</script>

<style lang="scss" scoped>
.body {
  padding-bottom: 16rpx;
}

.item {
  display: flex;
  align-items: center;

  &-icon {
    width: 32rpx;
    height: 32rpx;
    background-size: contain;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    margin-right: 8rpx;

    &-add {
      background-image: url("@/static/images/editOldMan/add.png");
    }

    &-remove {
      background-image: url("@/static/images/editOldMan/remove.png");
    }
  }

  &-text {
    font-size: 32rpx;
    font-weight: 400;
    color: #539eb7;
    line-height: 50rpx;
  }
}
</style>
