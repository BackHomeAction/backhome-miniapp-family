<template>
  <view class="body">
    <view class="tip">
      (带 <span style="color: #D0021B">*</span> 为必填项)
    </view>
    <u-form>
      <u-form-item
        label="姓名"
        required
      >
        <u-input
          v-model="form.name"
          placeholder="请输入老人姓名"
        />
      </u-form-item>
      <u-form-item
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
              check-validity
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
        label="家属联系方式"
        required
      >
        <u-input
          v-model="form.phone"
          type="number"
          placeholder="请输入联系人的手机号码"
        />
      </u-form-item>
      <u-form-item
        label="身份证号码"
        required
      >
        <u-input
          v-model="form.idcard"
          type="idcard"
          placeholder="请输入老人的身份证号码"
        />
      </u-form-item>
      <u-form-item
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
        label="身高"
        required
      >
        <u-input
          v-model="form.height"
          type="number"
          placeholder="请输入老人身高 (cm)"
        />
      </u-form-item>
      <u-form-item
        label="体重"
        required
      >
        <u-input
          v-model="form.weight"
          type="number"
          placeholder="请输入老人体重 (kg)"
        />
      </u-form-item>
      <u-form-item
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
        label="居住地区"
        required
      >
        <u-picker
          mode="region"
          :value="regionText"
          :select-value="regionArray"
          placeholder="请选择居住地区"
          @change="handleRegionChange"
        />
      </u-form-item>
      <u-form-item
        label="详细地址"
      >
        <u-input
          v-model="form.address"
          placeholder="请输入老人的居住地址（精确到门牌号）"
        />
      </u-form-item>
      <u-form-item
        label="常去地点"
        border-bottom
      >
        <offen-places-selector
          :value="form.offenPlaces"
          @add="handleAddOffenPlace"
          @remove="handleRemoveOffenPlace"
        />
      </u-form-item>
      <u-form-item
        label="是否老年痴呆"
      >
        <u-picker
          :range="senileDementiaRange"
          :value="senileDementiaText"
          placeholder="请选择是否老年痴呆"
          @change="handleSenileDementiaChange"
        />
      </u-form-item>
      <u-form-item
        label="残疾/患病情况"
      >
        <u-input
          v-model="form.disability"
          placeholder="可以输入老人的残疾/患病情况"
        />
      </u-form-item>
      <u-form-item
        label="其他体貌特征"
      >
        <u-input
          v-model="form.otherFeature"
          placeholder="可以输入老人的体貌特征"
        />
      </u-form-item>
      <u-form-item
        label="备注信息"
      >
        <u-input
          v-model="form.others"
          placeholder="可以输入关于老人的其他信息"
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
        保存
      </u-button>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from "vue";
import UButton from "@/components/UButton/index.vue";
import UForm from "@/components/UForm/index.vue";
import UFormItem from "@/components/UFormItem/index.vue";
import UInput from "@/components/UFormItem/components/UInput/index.vue";
import UPicker from "@/components/UFormItem/components/UPicker/index.vue";
import OffenPlacesSelector from "./components/OffenPlacesSelector/index.vue";
import OldManPhotoUploader from "@/components/OldManPhotoUploader/index.vue";
import { IPlace } from "@/enums/placeTypes";
import mapSettings from "@/config/map";
import { showModalError, showToast, navigateBack } from "@/utils/helper";
import { requestAddOldMan, requestEditOldMan } from "@/api/oldman";
import store from "@/store";
import { ActionTypes } from "@/enums/actionTypes";
import { OldMan } from "@/api/types/models";

const oldmanId = ref(0);

interface IForm {
  name: string;
  phone: string;
  idcard: string;
  sex: number;
  height: string;
  weight: string;
  birthday: string;
  province: string;
  city: string;
  district: string;
  address: string;
  offenPlaces: Array<IPlace>;
  senileDementia: number;
  disability: string;
  otherFeature: string;
  others: string;
  identificationPhoto: string;
  lifePhoto: Array<string>;
}

interface IPostForm {
  name: string;
  phone: string;
  idcard: string;
  sex: number;
  height: number;
  weight: number;
  birthDate: string;
  province: string;
  city: string;
  district: string;
  address: string;
  offerPlace: string;
  senileDementia: number;
  disability: string;
  otherFeature: string;
  others: string;
  identificationPhoto: string;
  lifePhoto: string;
}

const form: IForm = reactive({
  name: "",
  phone: "",
  idcard: "",
  sex: 0,
  height: "",
  weight: "",
  birthday: "",
  province: "",
  city: "",
  district: "",
  address: "",
  offenPlaces: [],
  senileDementia: 2,
  disability: "",
  otherFeature: "",
  others: "",
  identificationPhoto: "",
  lifePhoto: [],
});

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

const useBirthday = () => {
  const handleBirthdayChange = (e: any) => {
    const value = e.detail.value;

    form.birthday = value;
  };

  return { handleBirthdayChange };
};

const useAddress = () => {
  const regionText = computed(() => {
    const province = form.province;
    const city = form.city;
    const district = form.district;

    return province && city && district
      ? `${province} ${city} ${district}`
      : "";
  });

  const regionArray = computed(() => {
    const province = form.province;
    const city = form.city;
    const district = form.district;

    return [province, city, district];
  });

  const handleRegionChange = (e: any) => {
    const value = e.detail.value;

    form.province = value[0];
    form.city = value[1];
    form.district = value[2];
  };

  return { regionText, regionArray, handleRegionChange };
};

const useOffenPlaces = () => {
  const handleAddOffenPlace = () => {
    const key = mapSettings.key;
    const referer = mapSettings.appName;
    uni.navigateTo({
      url: "plugin://chooseLocation/index?key=" + key + "&referer=" + referer,
    });
  };

  const handleRemoveOffenPlace = (item: IPlace) => {
    const index = form.offenPlaces.findIndex((obj) => obj.name === item.name);
    form.offenPlaces.splice(index, 1);
  };

  return { handleAddOffenPlace, handleRemoveOffenPlace };
};

const useSenileDementia = () => {
  const senileDementiaRange = ["否", "是"];

  const senileDementiaText = computed(() => {
    if (!form.senileDementia) return "";
    return form.senileDementia === 1 ? "是" : "否";
  });

  const handleSenileDementiaChange = (e: any) => {
    const value = e.detail.value;
    if (value === "0") {
      form.senileDementia = 2;
    } else {
      form.senileDementia = 1;
    }
  };

  return {
    senileDementiaRange,
    senileDementiaText,
    handleSenileDementiaChange,
  };
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

const isSaving = ref(false);

const handleSubmit = async () => {
  const postForm: IPostForm = {
    name: form.name,
    phone: form.phone,
    idcard: form.idcard,
    sex: form.sex,
    height: parseInt(form.height, 10),
    weight: parseInt(form.weight, 10),
    birthDate: form.birthday,
    province: form.province,
    city: form.city,
    district: form.district,
    address: form.address,
    offerPlace: JSON.stringify(form.offenPlaces),
    senileDementia: form.senileDementia,
    disability: form.disability,
    otherFeature: form.otherFeature,
    others: form.others,
    identificationPhoto: form.identificationPhoto,
    lifePhoto: JSON.stringify(form.lifePhoto),
  };

  if (!postForm.name) {
    showToast("请输入老人姓名");
    return;
  }
  if (!postForm.phone) {
    showToast("请输入家属联系方式");
    return;
  }
  if (!postForm.idcard) {
    showToast("请输入老人身份证号");
    return;
  }
  if (!postForm.sex) {
    showToast("请选择老人性别");
    return;
  }
  if (!postForm.height) {
    showToast("请输入老人身高");
    return;
  }
  if (!postForm.weight) {
    showToast("请输入老人体重");
    return;
  }
  if (!postForm.birthDate) {
    showToast("请选择老人生日");
    return;
  }
  if (!postForm.district) {
    showToast("请选择老人居住地区");
    return;
  }
  if (!postForm.identificationPhoto) {
    showToast("请上传老人证件照（用于人脸识别）");
    return;
  }

  console.log(postForm);

  isSaving.value = true;
  try {
    if (oldmanId.value) {
      await requestEditOldMan({ id: oldmanId.value, ...postForm });
      // 如果是编辑老人，检查是否有案件信息，如果有的话需要更新
      const currentMissionOldManID =
        store.getters.currentMission?.missionInfo?.oldMan?.id;
      if (currentMissionOldManID && currentMissionOldManID === oldmanId.value) {
        store.dispatch(ActionTypes.initCurrentMission, {
          id: store.getters.currentMission.missionInfo.id,
        });
      }
    } else {
      await requestAddOldMan(postForm);
    }
    await store.dispatch(ActionTypes.getOldmanList);
    showToast("保存成功", "success");
    navigateBack();
  } catch (e) {
    console.log(e);
  }
  isSaving.value = false;
};

export default defineComponent({
  components: {
    UButton,
    UForm,
    UFormItem,
    UInput,
    UPicker,
    OffenPlacesSelector,
    OldManPhotoUploader,
  },
  setup() {
    return {
      form,
      ...useSex(),
      ...useBirthday(),
      ...useAddress(),
      ...useOffenPlaces(),
      ...useSenileDementia(),
      ...usePhotoUploader(),
      handleSubmit,
      isSaving,
    };
  },
  onShow() {
    const chooseLocation = requirePlugin("chooseLocation");
    const location = chooseLocation.getLocation();
    if (location) {
      if (
        form.offenPlaces.findIndex((obj) => obj.name === location.name) === -1
      ) {
        form.offenPlaces.push(location);
        showToast("添加成功", "success");
      } else {
        showModalError("请勿选择相同的地点！");
      }
      chooseLocation.setLocation(null);
    }
  },
  onLoad(params: { id: string }) {
    form.name = "";
    form.phone = "";
    form.idcard = "";
    form.sex = 0;
    form.height = "";
    form.weight = "";
    form.birthday = "";
    form.province = "";
    form.city = "";
    form.district = "";
    form.address = "";
    form.offenPlaces = [];
    form.senileDementia = 2;
    form.disability = "";
    form.otherFeature = "";
    form.others = "";
    form.identificationPhoto = "";
    form.lifePhoto = [];

    if (params.id) {
      // edit
      oldmanId.value = parseInt(params.id, 10);
      uni.setNavigationBarTitle({
        title: "编辑老人",
      });

      const oldman = store.getters.oldmanList.find(
        (oldman: OldMan) => oldman.id === parseInt(params.id)
      );
      console.debug(oldman);

      form.name = oldman.name;
      form.phone = oldman.phone;
      form.idcard = oldman.idcard;
      form.sex = oldman.sex;
      if (oldman.height) form.height = oldman.height.toString();
      if (oldman.weight) form.weight = oldman.weight.toString();
      form.birthday = oldman.birthDate;
      form.province = oldman.province;
      form.city = oldman.city;
      form.district = oldman.district;
      form.address = oldman.address;
      form.offenPlaces = JSON.parse(oldman.offerPlace) || [];
      form.senileDementia = oldman.senileDementia;
      form.disability = oldman.disability;
      form.otherFeature = oldman.otherFeature;
      form.others = oldman.others;
      form.identificationPhoto = oldman.identificationPhoto;
      form.lifePhoto = JSON.parse(oldman.lifePhoto) || [];
    } else {
      // new
      oldmanId.value = 0;
      uni.setNavigationBarTitle({
        title: "添加老人",
      });

      // 置入手机号
      if (store.getters.userInfo.phone) {
        form.phone = store.getters.userInfo.phone;
      }
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

.tip {
  box-sizing: border-box;
  padding: 0 32rpx;
  margin-top: 32rpx;
  font-size: 32rpx;
  font-weight: 400;
  color: #000000;
  line-height: 50rpx;
  text-align: right;
}
</style>
