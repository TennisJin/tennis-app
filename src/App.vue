<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";

onLaunch(() => {
  console.log("App Launch");
  // 初始化应用
  initApp();
});

onShow(() => {
  console.log("App Show");
});

onHide(() => {
  console.log("App Hide");
});

// 初始化应用
function initApp() {
  // 检查登录状态
  checkLoginStatus();
  // 获取用户位置权限
  getLocationPermission();
}

// 检查登录状态
function checkLoginStatus() {
  const token = uni.getStorageSync("token");
  if (!token) {
    console.log("用户未登录");
  }
}

// 获取位置权限
function getLocationPermission() {
  uni.getLocation({
    type: "wgs84",
    success: (res) => {
      console.log("获取位置成功:", res);
      uni.setStorageSync("userLocation", {
        latitude: res.latitude,
        longitude: res.longitude,
      });
    },
    fail: (err) => {
      console.log("获取位置失败:", err);
    },
  });
}
</script>

<style>
/*每个页面公共css */
@import url("./styles/common.css");
</style>
