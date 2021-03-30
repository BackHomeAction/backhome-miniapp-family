<template>
  <view>
    <view v-if="announcement && announcement.title">
      <view class="name">
        <view style="height: 66rpx;">
          {{ announcement.title }}
        </view>
      </view>
      <view class="from">
        <view style="height:34rpx;">
          发布人：{{ announcement.publisher }}
        </view>
      </view>
      <view class="time">
        <view style="height: 34rpx;">
          发布于：{{ announcement.time }}
        </view>
      </view>
      <view class="content">
        <rich-text
          style="width: 650rpx"
          :nodes="announcement.content"
        />
      </view>
    </view>
  </view>
</template> 

<script lang="ts">
import { requestGetAnnouncementByID } from "@/api/announcement";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
  onLoad(option: any) {
    this.getAnnouncement(option.id);
  },
  data() {
    return {
      announcement: {},
    };
  },
  methods: {
    async getAnnouncement(id: number) {
      uni.showNavigationBarLoading();
      try {
        const res = await requestGetAnnouncementByID(id);
        console.log(res.data.data);
        if (res.data.data) {
          this.announcement = res.data.data[0];
        }
      } catch (e) {
        console.log(e);
      }
      uni.hideNavigationBarLoading();
    },
  },
});
</script>

<style lang="scss" scoped>
@mixin wh($width, $heigh, $top, $left) {
  width: $width;
  height: $heigh;
  margin-top: $top;
  margin-left: $left;
  display: flex;
  justify-content: center;
}
@mixin font($size, $color, $lineh) {
  font-size: $size;
  color: $color;
  line-height: $lineh;
}
.name {
  @include wh(750rpx, 66rpx, 48rpx, 0);
  @include font(48rpx, #000000, 66rpx);
}
.from {
  @include wh(750rpx, 34rpx, 16rpx, 0);
  @include font(24rpx, #979797, 34rpx);
}
.time {
  @include font(24rpx, #979797, 34rpx);
  @include wh(750rpx, 34rpx, 16rpx, 0);
}
.content {
  @include font(24rpx, #000000, 34rpx);
  @include wh(750rpx, 1020rpx, 30rpx, 0);
}
</style>
