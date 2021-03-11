<template>
  <view class="body">
    <view class="title">
      请选择
    </view>
    <u-form>
      <u-form-item>
        <u-radio
          v-model="reportType"
          :range="reportTypeRange"
        />
      </u-form-item>
    </u-form>
    <view v-if="hasOldMan && reportType === 0">
      <view class="title">
        选择走失老人
      </view>
      <u-form>
        <u-form-item>
          <old-man-selector v-model="selectedOldmanId" />
        </u-form-item>
      </u-form>
    </view>

    <view
      v-if="hasOldMan && reportType === 0"
      class="title"
    >
      补充走失信息
    </view>
    <view
      v-else
      class="title"
    >
      请填写基本信息
      <view style="font-size: 26rpx; color: #D0021B">
        *报案后请及时完善更多信息
      </view>
    </view>
    <u-form>
      <u-form-item
        label="走失时间"
        required
        border-bottom
        @tap="showDatePicker = true"
      >
        {{ form.lostTime }}
      </u-form-item>
      <u-form-item
        label="走失地点"
        required
        border-bottom
        @tap="handleChooseLostPlace"
      >
        {{ form.lostPlace ? form.lostPlace.name : '请选择' }}
      </u-form-item>
      <u-form-item
        label="其他走失信息"
      >
        <u-input
          v-model="form.others"
          placeholder="可以输入走失时的穿着等"
        />
      </u-form-item>
    </u-form>

    <view class="actions">
      <u-button
        type="primary"
        shadow
        shape="circle"
        :loading="isSaving"
        @click="handleSubmit"
      >
        确认无误 立即报案
      </u-button>
    </view>

    <date-picker
      :show="showDatePicker"
      :show-holiday="false"
      :value="form.lostTime"
      type="datetime"
      @cancel="showDatePicker = false"
      @confirm="handleConfirmLostTime"
    />
  </view>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from "vue";
import UButton from "@/components/UButton/index.vue";
import UForm from "@/components/UForm/index.vue";
import UFormItem from "@/components/UFormItem/index.vue";
import UInput from "@/components/UFormItem/components/UInput/index.vue";
import UPicker from "@/components/UFormItem/components/UPicker/index.vue";
import URadio from "@/components/UFormItem/components/URadio/index.vue";
import OldManSelector from "./components/OldManSelector/index.vue";
import store from "@/store";
import DatePicker from "@/components/DatePicker/index.vue";
import { IPlace } from "@/enums/placeTypes";
import dayjs from "@/utils/dayjs";
import mapSettings from "@/config/map";
import { showModal, showToast } from "@/utils/helper";
import { requestCreateNewCase } from "@/api/mission";

interface IForm {
  lostTime: string;
  lostPlace: null | IPlace;
  others: string;
}

interface IPostForm {
  oldManId: number;
  province: string;
  city: string;
  district: string;
  place: string;
  address: string;
  longitude: number;
  latitude: number;
  lostTime: string;
  others: string;
}

const form: IForm = reactive({
  lostTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  lostPlace: null,
  others: "",
});

const reportType = ref(0);
const hasOldMan = computed(() => {
  return store.getters.oldmanList && store.getters.oldmanList.length > 0;
});
const selectedOldmanId = ref(0);

const useReportType = () => {
  const reportTypeRange = computed(() => {
    return hasOldMan.value
      ? ["已添加过老人直接报案", "尚未添加老人"]
      : ["尚未添加老人"];
  });

  return { reportType, hasOldMan, reportTypeRange };
};

const useDatePicker = () => {
  const showDatePicker = ref(false);

  const handleConfirmLostTime = (e: {
    value: string | Array<any>;
    date: Date;
  }) => {
    form.lostTime = dayjs(e.date).format("YYYY-MM-DD HH:mm:ss");
    showDatePicker.value = false;
  };

  return { showDatePicker, handleConfirmLostTime };
};

const useLostPlace = () => {
  const handleChooseLostPlace = () => {
    const key = mapSettings.key;
    const referer = mapSettings.appName;
    uni.navigateTo({
      url: "plugin://chooseLocation/index?key=" + key + "&referer=" + referer,
    });
  };

  return { handleChooseLostPlace };
};

const isSaving = ref(false);

const handleSubmit = async () => {
  if (hasOldMan.value && reportType.value === 0) {
    // 已添加老人直接报案
    if (!selectedOldmanId.value) {
      showToast("请选择走失老人");
      return;
    }
    if (!form.lostTime) {
      showToast("请选择走失时间");
      return;
    }
    if (!form.lostPlace) {
      showToast("请选择走失地点");
      return;
    }
    isSaving.value = true;
    try {
      const postForm: IPostForm = {
        oldManId: selectedOldmanId.value,
        province: form.lostPlace.province,
        city: form.lostPlace.city,
        district: form.lostPlace.district,
        place: form.lostPlace.name,
        address: form.lostPlace.address,
        longitude: form.lostPlace.longitude,
        latitude: form.lostPlace.latitude,
        lostTime: form.lostTime,
        others: form.others,
      };
      await requestCreateNewCase(postForm);
      await showModal("报案成功", "请及时完善案件信息");
      // TODO: 跳报案列表
    } catch (e) {
      console.log(e);
    }
    isSaving.value = false;
  }
};

export default defineComponent({
  components: {
    UButton,
    UForm,
    UFormItem,
    OldManSelector,
    UInput,
    // UPicker,
    URadio,
    DatePicker,
  },
  setup() {
    return {
      ...useReportType(),
      ...useDatePicker(),
      ...useLostPlace(),
      selectedOldmanId,
      form,
      handleSubmit,
      isSaving,
    };
  },
  onShow() {
    const chooseLocation = requirePlugin("chooseLocation");
    const location = chooseLocation.getLocation();
    if (location) {
      form.lostPlace = location;
      chooseLocation.setLocation(null);
    }
  },
  onUnload() {
    const chooseLocation = requirePlugin("chooseLocation");
    chooseLocation.setLocation(null);
  },
});
</script>

<style lang="scss" scoped>
.body {
  box-sizing: border-box;
  padding-bottom: 60rpx;
}

.actions {
  box-sizing: border-box;
  margin-top: 40rpx;
  text-align: center;
}

.title {
  box-sizing: border-box;
  padding: 0 32rpx;
  margin-top: 32rpx;
  font-size: 32rpx;
  font-weight: 400;
  color: #000000;
  line-height: 50rpx;
}
</style>
