<template>
  <view class="body">
    <scroll-view
      scroll-x
      class="image"
    >
      <image
        v-for="(path, index) in images"
        :key="index"
        class="image-item"
        :src="path"
        mode="aspectFill"
        @click="handlePreviewPhoto(index)"
      />
    </scroll-view>
    <view
      v-if="data && data.id"
      class="info"
    >
      <u-cell-group>
        <u-cell-item
          title="姓名"
          :value="data.oldMan.name"
          :arrow="false"
          hover-class="none"
        />
        <u-cell-item
          title="年龄"
          :value="manAge"
          :arrow="false"
          hover-class="none"
        />
        <u-cell-item
          title="性别"
          :value="data.oldMan.sex === 1 ? '男' : '女'"
          :arrow="false"
          hover-class="none"
        />
        <u-cell-item
          title="家属联系方式"
          :value="data.oldMan.phone"
          @click="makePhoneCall(data.oldMan.phone)"
        />
        <u-cell-item
          title="身份证号"
          :value="data.oldMan.idcard"
          :arrow="false"
          hover-class="none"
        />
      </u-cell-group>
      <u-cell-group title=" ">
        <u-cell-item
          title="身高"
          :value="`${data.oldMan.height} cm`"
          :arrow="false"
          hover-class="none"
        />
        <u-cell-item
          title="体重"
          :value="`${data.oldMan.weight} kg`"
          :arrow="false"
          hover-class="none"
        />
        <u-cell-item
          title="其他体貌特征"
          :value="data.oldMan.otherFeature ? data.oldMan.otherFeature : '暂无'"
          :arrow="false"
          hover-class="none"
        />
      </u-cell-group>
      <u-cell-group title=" ">
        <u-cell-item
          title="走失地点"
          :value="data.place"
          @click="handleClickLostPlace"
        />
        <u-cell-item
          title="常去地点"
          :value="offenPlaceNumber > 0 ? `${offenPlaceNumber} 个` : '暂无'"
          @click="handleClickOffenPlace"
        />
      </u-cell-group>
      <u-cell-group title=" ">
        <u-cell-item
          title="是否老年痴呆"
          :value="data.oldMan.senileDementia === 1 ? '是' : '否'"
          :arrow="false"
          hover-class="none"
        />
        <u-cell-item
          title="残疾情况"
          :value="data.oldMan.disability ? data.oldMan.disability : '暂无'"
          :arrow="false"
          hover-class="none"
        />
      </u-cell-group>
    </view>

    <places-popup
      v-model="showOffenPlacesPopup"
      :data="offenPlace"
    />
  </view>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import UCellGroup from "@/components/UCellGroup/index.vue";
import UCellItem from "@/components/UCellItem/index.vue";
import dayjs from "@/utils/dayjs";
import PlacesPopup from "./PlacesPopup.vue";

export default defineComponent({
  components: { UCellGroup, UCellItem, PlacesPopup },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    // 计算图片列表
    const images = computed(() => {
      const lifePhotos = props?.data?.oldMan
        ? JSON.parse(props.data.oldMan.lifePhoto)
        : [];

      return [props?.data?.oldMan?.identificationPhoto, ...lifePhotos];
    });

    // 点击图片进行预览
    const handlePreviewPhoto = (index: number) => {
      uni.previewImage({
        urls: images.value,
        current: index.toString(),
      });
    };

    // 计算年龄
    const manAge = computed(() => {
      return parseInt(dayjs(props?.data?.oldMan?.birthDate).fromNow(), 10);
    });

    // 常去地点
    const offenPlace = computed(() => {
      return props?.data?.oldMan
        ? JSON.parse(props.data.oldMan.offerPlace)
        : [];
    });
    // 常去地点数量
    const offenPlaceNumber = computed(() => {
      return props?.data?.oldMan
        ? JSON.parse(props.data.oldMan.offerPlace).length
        : [];
    });

    // 电话拨号
    const makePhoneCall = (tel: string) => {
      uni.makePhoneCall({
        phoneNumber: tel,
      });
    };

    // 点击走失地点
    const handleClickLostPlace = () => {
      uni.openLocation({
        latitude: props.data.latitude,
        longitude: props.data.longitude,
        name: props.data.place,
        address: props.data.address,
      });
    };

    // 是否展示常去地点弹框
    const showOffenPlacesPopup = ref(false);
    // 点击常去地点
    const handleClickOffenPlace = () => {
      showOffenPlacesPopup.value = true;
    };

    return {
      images,
      handlePreviewPhoto,
      manAge,
      offenPlace,
      offenPlaceNumber,
      makePhoneCall,
      handleClickLostPlace,
      showOffenPlacesPopup,
      handleClickOffenPlace,
    };
  },
});
</script>

<style lang="scss" scoped>
// .body {
//   padding-bottom: 100rpx;
// }

.image {
  width: 100%;
  white-space: nowrap;

  &-item {
    border-radius: 10rpx;
    margin-right: 8rpx;
    width: 308rpx;
    height: 196rpx;
  }
}
</style>
