import { requestRefreshToken } from "./../../api/user";
import authService from "@/service/authService";
import { getRefreshToken, setRefreshToken, setToken } from "../auth";
import { reLaunch, showModalError } from "../helper";
import Request from "./lib";
import { ResponseDataStateTypes } from "@/enums/responseDataStateTypes";

// 是否正在刷新的标记
let isRefreshing = false;
// 重试队列，每一项将是一个待执行的函数形式
let requests: Function[] = [];

// 刷新 token
const refreshToken = async () => {
  const res = await requestRefreshToken({
    refreshToken: getRefreshToken(),
  });
  if (res.data.status !== ResponseDataStateTypes.OK) {
    throw Error();
  }
  return res;
};

const http = new Request({
  baseURL: "https://fwwb2020-app-volunteer.tgucsdn.com/",
});

http.interceptors.request.use(
  async (config) => {
    const noInterceptor = config.custom && config.custom.noInterceptor;
    if (noInterceptor) {
      return config;
    }

    const noAuth = config.custom && config.custom.noAuth;
    let token = uni.getStorageSync("token");

    if (!noAuth) {
      if (!token) {
        // 如果接口需要登录但用户未登录，则请求登录
        await authService.login();
        token = uni.getStorageSync("token");
      }

      // 判断是否需要传 token
      if (token) {
        config.header = {
          ...config.header,
          Authorization: `Bearer ${token}`,
        };
      } else {
        // 如果 token 不存在，且该接口不是无需 token 的接口，且登录失败，则取消本次请求
        return Promise.reject(config);
      }
    }

    return config;
  },
  (config) => {
    // 可使用async await 做异步操作
    return Promise.reject(config);
  }
);

http.interceptors.response.use(
  (response: any) => {
    /* 对响应成功做点什么 可使用 async await 做异步操作 */
    const noInterceptor =
      response.config.custom && response.config.custom.noInterceptor;
    if (noInterceptor) {
      return response;
    }

    const state = response.data.status;
    const message = response.data.message;

    // 无感刷新 token
    if (state === ResponseDataStateTypes.TOKEN_EXPIRED) {
      const { config } = response;
      if (!isRefreshing) {
        isRefreshing = true;
        return refreshToken()
          .then((res) => {
            const { token, refreshToken } = res.data;
            if (token && refreshToken) {
              setToken(token);
              setRefreshToken(refreshToken);
              console.log("[request] Refresh token success.");
              config.header.Authorization = `Bearer ${token}`;
              // 已经刷新了token，将所有队列中的请求进行重试
              requests.forEach((cb) => cb(token));
              requests = [];
              return http.request(config);
            } else {
              throw new Error("刷新 token 失败");
            }
          })
          .catch(async (res) => {
            // 无法刷新 token，需要重新登录
            console.error("[request] Refresh token error =>", res);
            // 重定向到登录页面
            uni.showModal({
              title: "错误",
              content: "请重新登录",
              showCancel: false,
              success: () => {
                // 退出登录
                authService.logout();
                reLaunch("/pages/me/index");
              },
            });

            // 抛出错误，阻止本次请求
            const error = new Error("登录态过期");
            // error.response = response
            throw error;
          })
          .finally(() => {
            isRefreshing = false;
          });
      }
      // 正在刷新token，返回一个未执行resolve的promise
      return new Promise((resolve) => {
        // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
        requests.push((token: string) => {
          if (token) {
            config.header.Authorization = `Bearer ${token}`;
          }
          resolve(http.request(config));
        });
      });
    }

    if (state !== ResponseDataStateTypes.OK) {
      if (state === ResponseDataStateTypes.TOKEN_ERROR) {
        // token 错误
        // 重定向到登录页面
        uni.showModal({
          title: "错误",
          content: "请重新登录",
          showCancel: false,
          success: () => {
            // 退出登录
            authService.logout();
            reLaunch("/pages/me/index");
          },
        });
      } else {
        showModalError(message);
      }
      return Promise.reject(response);
    }

    return response;
  },
  (response: any) => {
    /*  对响应错误做点什么 （statusCode !== 200）*/
    showModalError("服务器错误");
    return Promise.reject(response);
  }
);

export default http;
