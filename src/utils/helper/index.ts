import mixinParam from "./route";

export const navigateTo = (url: string, params: null | object = null) => {
  if (params) {
    url = mixinParam(url, params);
  }
  uni.navigateTo({
    url,
  });
};

export const navigateBack = (delta: number = 1) => {
  uni.navigateBack({ delta });
};

export const reLaunch = (url: string) => {
  uni.reLaunch({
    url,
  });
};

export const showToast = (
  title: string,
  icon: "success" | "loading" | "none" | undefined = "none",
  duration = 1
) => {
  uni.showToast({ title, icon, duration: duration * 1000 });
};

export const switchTab = (url: string) => {
  uni.switchTab({
    url,
  });
};

export const showModalError = (content = "未知错误") => {
  return showModal("错误", content);
};

export const showModal = (
  title = "提示",
  content = "未知错误",
  showCancel = false
) => {
  return new Promise<void>((resolve, reject) => {
    uni.showModal({
      title: title,
      content,
      showCancel,
      success: function (res) {
        if (res.confirm) {
          resolve();
        } else if (res.cancel) {
          reject();
        }
      },
    });
  });
};

export const showLoading = (title = "加载中") => {
  uni.showLoading({
    title,
  });
};

export const hideLoading = () => {
  uni.hideLoading();
};
