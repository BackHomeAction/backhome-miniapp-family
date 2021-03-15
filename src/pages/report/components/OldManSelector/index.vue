<template>
  <view class="body">
    <scroll-view
      v-for="item in list"
      :key="item.id"
      scroll-x
      class="item"
      :class="{'item--selected': item.id === value}"
      @click="handleClick(item.id ? item.id : 0)"
    >
      <image
        class="item__image"
        mode="aspectFill"
        :src="item.identificationPhoto"
      />
    </scroll-view>
  </view>
</template>

<script lang="ts">
import { OldMan } from "@/api/types/models";
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
  emits: ["input"],
  setup(props, { emit }) {
    const store = useStore();
    const list: ComputedRef<Array<OldMan>> = computed(() => {
      return store.getters.oldmanList;
    });

    const handleClick = (index: number) => {
      emit("input", index);
    };

    return { list, handleClick };
  },
});
</script>


<style lang="scss" scoped>
.body {
  background: #ffffff;
}

.item {
  box-sizing: border-box;
  width: 88rpx;
  height: 88rpx;
  display: inline-flex;
  border-radius: 100%;
  justify-content: center;
  align-items: center;

  &__image {
    width: 80rpx;
    height: 80rpx;
    border-radius: 100%;
  }

  &--selected {
    border: 4rpx solid #539eb7;
  }

  & + & {
    margin-left: 60rpx;
  }
}
</style>
