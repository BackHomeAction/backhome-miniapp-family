<template>
  <view>
    <top />
    <view class="body">
      <index-item
        icon="/static/images/home/add.png"
        name="我的老人"
        description="在这里完善老人的详细信息"
        path="/pages/myOldMans/index"
        need-login
      />
      <index-item
        icon="/static/images/home/report.png"
        name="快速报案"
        description="如发现老人走失，请及时在此报案"
        style="margin-top: 48rpx;"
        path="/pages/report/index"
        need-login
        skip-register
      />
      <index-item
        icon="/static/images/home/history.png"
        name="已报案件"
        description="如已报案，在此跟进案情"
        style="margin-top: 48rpx;"
        path="/pages/myMissions/index"
        need-login
      />
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Top from "./components/Top/index.vue";
import IndexItem from "./components/IndexItem/index.vue";

export default defineComponent({
  components: { Top, IndexItem },
  setup() {
    return {};
  },
  onShow() {},
});
</script>

<style lang="scss" scoped>
.body {
  margin-top: 64rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
