const TokenKey = "token";
const RefreshTokenKey = "refresh_token";

export function getToken() {
  return uni.getStorageSync(TokenKey);
}

export function setToken(token: string) {
  return uni.setStorageSync(TokenKey, token);
}

export function removeToken() {
  return uni.removeStorageSync(TokenKey);
}

export function getRefreshToken() {
  return uni.getStorageSync(RefreshTokenKey);
}

export function setRefreshToken(refreshToken: string) {
  return uni.setStorageSync(RefreshTokenKey, refreshToken);
}

export function removeRefreshToken() {
  return uni.removeStorageSync(RefreshTokenKey);
}
