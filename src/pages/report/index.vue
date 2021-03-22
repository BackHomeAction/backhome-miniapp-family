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
        <u-form-item border-bottom> 
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
        v-if="!hasOldMan || reportType === 1"
        required
        label="姓名"
      >
        <u-input
          v-model="form.name"
          placeholder="请输入老人姓名"
        />
      </u-form-item>
      <u-form-item
        v-if="!hasOldMan || reportType === 1"
        label="照片"
        required
        border-bottom
        custom-style="padding-right: 0"
      >
        <scroll-view scroll-x>
          <view style="display: flex;">
            <old-man-photo-uploader
              :photos="form.identificationPhoto ? [form.identificationPhoto] : []"
              :max-upload="1"
              label="请在此处添加证件照"
              @change="handleIdPhotoUploaded"
            />
            <old-man-photo-uploader
              :photos="form.lifePhoto"
              :max-upload="8"
              label="添加其他照片"
              @change="handleLifePhotoUploaded"
            />
          </view>
        </scroll-view>
      </u-form-item>
      <u-form-item
        v-if="!hasOldMan || reportType === 1"
        label="性别"
        required
      >
        <u-picker
          :range="sexRange"
          :value="sexText"
          placeholder="请选择性别"
          @change="handleSexChange"
        />
      </u-form-item>
      <u-form-item
        v-if="!hasOldMan || reportType === 1"
        label="出生日期"
        required
      >
        <u-picker
          mode="date"
          :value="form.birthday"
          :select-value="form.birthday"
          placeholder="请选择出生日期"
          @change="handleBirthdayChange"
        />
      </u-form-item>
      <u-form-item
        label="走失时间"
        required
        border-bottom
        @tap="showDatePicker = true"
      >
        <u-picker-wrapper>
          {{ form.lostTime }}
        </u-picker-wrapper>
      </u-form-item>
      <u-form-item
        label="走失地点"
        required
        border-bottom
        @tap="handleChooseLostPlace"
      >
        <u-picker-wrapper>
          <span :class="{'picker__value--blank': !form.lostPlace}">
            {{ form.lostPlace ? form.lostPlace.name : '请选择' }}
          </span>
        </u-picker-wrapper>
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
import UPickerWrapper from "@/components/UFormItem/components/UPickerWrapper/index.vue";
import URadio from "@/components/UFormItem/components/URadio/index.vue";
import OldManSelector from "./components/OldManSelector/index.vue";
import store from "@/store";
import DatePicker from "@/components/DatePicker/index.vue";
import { IPlace } from "@/enums/placeTypes";
import dayjs from "@/utils/dayjs";
import mapSettings from "@/config/map";
import { reLaunch, showModal, showToast } from "@/utils/helper";
import { requestCreateNewCase } from "@/api/mission";
import OldManPhotoUploader from "@/components/OldManPhotoUploader/index.vue";
import { ActionTypes } from "@/enums/actionTypes";
import { requestAddOldMan } from "@/api/oldman";

interface IForm {
  name: string;
  identificationPhoto: string;
  lifePhoto: Array<string>;
  sex: number;
  birthday: string;
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

interface INewOldmanForm {
  province: string;
  city: string;
  district: string;
  place: string;
  address: string;
  name: string;
  sex: number;
  birthDate: string;
  identificationPhoto: string;
}

const form: IForm = reactive({
  name: "",
  identificationPhoto: "",
  lifePhoto: [],
  sex: 0,
  birthday: "",
  lostTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  lostPlace: null,
  others: "",
});

const reportType = ref(0);
const hasOldMan = computed(() => {
  return store.getters.oldmanList && store.getters.oldmanList.length > 0;
});
const selectedOldmanId = ref(0);

const useBirthday = () => {
  const handleBirthdayChange = (e: any) => {
    const value = e.detail.value;

    form.birthday = value;
  };

  return { handleBirthdayChange };
};

const useSex = () => {
  const sexRange = ["男", "女"];

  const sexText = computed(() => {
    if (!form.sex) return "";
    return form.sex === 1 ? "男" : "女";
  });

  const handleSexChange = (e: any) => {
    const value = e.detail.value;
    if (value === "0") {
      form.sex = 1;
    } else {
      form.sex = 2;
    }
  };

  return { sexRange, sexText, handleSexChange };
};

const usePhotoUploader = () => {
  const handleIdPhotoUploaded = (photoList: Array<string>) => {
    form.identificationPhoto = photoList[0];
  };

  const handleLifePhotoUploaded = (photoList: Array<string>) => {
    form.lifePhoto = photoList;
  };

  return { handleIdPhotoUploaded, handleLifePhotoUploaded };
};

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
  if (!form.lostTime) {
    showToast("请选择走失时间");
    return;
  }
  if (!form.lostPlace) {
    showToast("请选择走失地点");
    return;
  }

  if (hasOldMan.value && reportType.value === 0) {
    // 已添加老人直接报案
    if (!selectedOldmanId.value) {
      showToast("请选择走失老人");
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
      reLaunch("/pages/myMissions/index");
    } catch (e) {
      console.log(e);
    }
    isSaving.value = false;
  }

  if (!hasOldMan.value || reportType.value === 1) {
    if (!form.name) {
      showToast("请输入老人姓名");
      return;
    }
    if (!form.identificationPhoto) {
      showToast("请上传老人证件照（用于人脸识别）");
      return;
    }
    if (!form.sex) {
      showToast("请选择老人性别");
      return;
    }
    if (!form.birthday) {
      showToast("请选择老人生日");
      return;
    }

    isSaving.value = true;
    try {
      // 新建老人
      const newOldmanForm: INewOldmanForm = {
        province: form.lostPlace.province,
        city: form.lostPlace.city,
        district: form.lostPlace.district,
        place: form.lostPlace.name,
        address: form.lostPlace.address,
        name: form.name,
        sex: form.sex,
        birthDate: form.birthday,
        identificationPhoto: form.identificationPhoto,
      };
      const res = await requestAddOldMan(newOldmanForm);
      console.log(res);
      const oldmanId = res.data.data?.id;
      if (!oldmanId) throw new Error("添加老人失败");

      const postForm: IPostForm = {
        oldManId: oldmanId,
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

      await store.dispatch(ActionTypes.getOldmanList);
      reLaunch("/pages/myMissions/index");
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
    UPicker,
    UPickerWrapper,
    URadio,
    DatePicker,
    OldManPhotoUploader,
  },
  setup() {
    return {
      ...useReportType(),
      ...useDatePicker(),
      ...useLostPlace(),
      ...usePhotoUploader(),
      ...useSex(),
      ...useBirthday(),
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

.picker {
  &__value {
    &--blank {
      color: $uni-text-color-placeholder !important;
    }
  }
}
</style>
