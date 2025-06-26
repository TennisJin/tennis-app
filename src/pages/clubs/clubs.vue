<template>
  <view class="page-container">
    <!-- 城市筛选 -->
    <view class="city-filter">
      <view class="current-city" @click="toggleCityPicker">
        <text class="city-name">{{ currentCity }}</text>
        <text class="city-arrow" :class="{ rotated: showCityList }">▼</text>
      </view>
      <!-- 城市选择下拉列表 -->
      <view class="city-dropdown" v-if="showCityList">
        <view
          class="city-option"
          v-for="city in cityList"
          :key="city.code"
          @click="selectCity(city)"
        >
          <text class="city-text">{{ city.name }}</text>
          <text class="city-check" v-if="city.name === currentCity">✓</text>
        </view>
      </view>
    </view>

    <!-- 我的俱乐部 -->
    <view class="section" v-if="myClubs.length > 0">
      <view class="section-title">我的俱乐部</view>
      <view class="club-list">
        <view
          class="club-item card"
          v-for="club in myClubs"
          :key="club.id"
          @click="goToClubDetail(club.id)"
        >
          <image class="club-logo" :src="club.logo" mode="aspectFill"></image>
          <view class="club-info">
            <text class="club-name">{{ club.name }}</text>
            <text class="club-location">{{ club.location }}</text>
            <view class="club-tags">
              <text class="tag" v-for="tag in club.tags" :key="tag">{{
                tag
              }}</text>
            </view>
            <text class="club-members">{{ club.memberCount }}个成员</text>
          </view>
          <view class="club-distance">
            <text class="distance">{{ club.distance }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 发现网球俱乐部 -->
    <view class="section">
      <view class="section-title">发现网球俱乐部</view>
      <view class="club-list">
        <view
          class="club-item card"
          v-for="club in recommendClubs"
          :key="club.id"
          @click="goToClubDetail(club.id)"
        >
          <image class="club-logo" :src="club.logo" mode="aspectFill"></image>
          <view class="club-info">
            <text class="club-name">{{ club.name }}</text>
            <text class="club-location">{{ club.location }}</text>
            <view class="club-tags">
              <text class="tag" v-for="tag in club.tags" :key="tag">{{
                tag
              }}</text>
            </view>
            <text class="club-members">{{ club.memberCount }}个成员</text>
          </view>
          <view class="club-distance">
            <text class="distance">{{ club.distance }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Club {
  id: number;
  name: string;
  logo: string;
  location: string;
  tags: string[];
  memberCount: number;
  distance: string;
}

interface City {
  code: string;
  name: string;
}

// 响应式数据
const currentCity = ref("杭州");
const myClubs = ref<Club[]>([]);
const recommendClubs = ref<Club[]>([]);
const cityList = ref<City[]>([]);
const showCityList = ref(false);

// 页面加载时获取数据
onMounted(() => {
  loadMyClubs();
  loadRecommendClubs();
  loadCityList();
  getCurrentLocation();
});

// 获取当前位置
function getCurrentLocation() {
  const location = uni.getStorageSync("userLocation");
  if (location) {
    // 根据经纬度获取城市信息
    getCityByLocation(location.latitude, location.longitude);
  }
}

// 根据位置获取城市
function getCityByLocation(latitude: number, longitude: number) {
  // 这里应该调用地图API获取城市信息
  // 暂时使用模拟数据
  console.log("获取城市信息", latitude, longitude);
}

// 加载我的俱乐部
function loadMyClubs() {
  // 模拟数据，实际应该调用API
  myClubs.value = [
    {
      id: 1,
      name: "律动网球俱乐部",
      logo: "/static/images/venues/club1.png",
      location: "余杭区 良渚 室外 硬地",
      tags: ["室外", "硬地"],
      memberCount: 127,
      distance: "5.7km",
    },
    {
      id: 2,
      name: "阿蓝网球俱乐部",
      logo: "/static/images/venues/club2.png",
      location: "拱墅区 良渚 室内 硬地",
      tags: ["室内", "硬地"],
      memberCount: 128,
      distance: "6.2km",
    },
  ];
}

// 加载推荐俱乐部
function loadRecommendClubs() {
  // 模拟数据，实际应该调用API
  recommendClubs.value = [
    {
      id: 3,
      name: "溪上网球",
      logo: "/static/images/venues/club3.png",
      location: "拱墅区 拱墅 室外 硬地",
      tags: ["室外", "硬地"],
      memberCount: 127,
      distance: "2.8km",
    },
    {
      id: 4,
      name: "黄龙体育中心",
      logo: "/static/images/venues/club4.png",
      location: "西湖区 黄龙 室内 硬地",
      tags: ["室内", "硬地"],
      memberCount: 100,
      distance: "2.8km",
    },
    {
      id: 5,
      name: "GS网球俱乐部（浙报店）",
      logo: "/static/images/venues/club5.png",
      location: "拱墅区 浙报印务 室内 硬地",
      tags: ["室内", "硬地"],
      memberCount: 41,
      distance: "5.1km",
    },
    {
      id: 6,
      name: "城北体育公园-网球中心",
      logo: "/static/images/venues/club6.png",
      location: "拱墅区 室内 硬地",
      tags: ["室内", "硬地"],
      memberCount: 194,
      distance: "5.1km",
    },
    {
      id: 7,
      name: "西湖网球俱乐部",
      logo: "/static/club7.jpg",
      location: "余杭区 西湖 室外 硬地",
      tags: ["室外", "硬地"],
      memberCount: 34,
      distance: "6.2km",
    },
    {
      id: 8,
      name: "享趣网球",
      logo: "/static/club8.jpg",
      location: "拱墅区 拱墅 室内 硬地",
      tags: ["室内", "硬地"],
      memberCount: 92,
      distance: "7.4km",
    },
    {
      id: 9,
      name: "52网球俱乐部",
      logo: "/static/club9.jpg",
      location: "拱墅区 室内 硬地",
      tags: ["室内", "硬地"],
      memberCount: 41,
      distance: "7.6km",
    },
    {
      id: 10,
      name: "飞纳网球俱乐部",
      logo: "/static/club10.jpg",
      location: "拱墅区 牛山 室内 硬地",
      tags: ["室内", "硬地"],
      memberCount: 194,
      distance: "9.3km",
    },
    {
      id: 11,
      name: "平击网球俱乐部",
      logo: "/static/club11.jpg",
      location: "余杭区 五常 室内 硬地",
      tags: ["室内", "硬地"],
      memberCount: 34,
      distance: "9.8km",
    },
  ];
}

// 加载城市列表
function loadCityList() {
  cityList.value = [
    { code: "hz", name: "杭州" },
    { code: "sh", name: "上海" },
    { code: "bj", name: "北京" },
    { code: "sz", name: "深圳" },
    { code: "gz", name: "广州" },
    { code: "nj", name: "南京" },
    { code: "cd", name: "成都" },
    { code: "wh", name: "武汉" },
  ];
}

// 切换城市选择器显示状态
function toggleCityPicker() {
  showCityList.value = !showCityList.value;
}

// 选择城市
function selectCity(city: City) {
  currentCity.value = city.name;
  showCityList.value = false;
  // 重新加载俱乐部数据
  loadRecommendClubs();
  uni.showToast({
    title: `已切换到${city.name}`,
    icon: "success",
  });
}

// 跳转到俱乐部详情
function goToClubDetail(id: number) {
  uni.navigateTo({
    url: `/pages/club-detail/club-detail?id=${id}`,
  });
}
</script>

<style scoped>
.city-filter {
  background-color: #ffffff;
  padding: 20rpx;
  margin-bottom: 20rpx;
  position: relative;
}

.current-city {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background-color: #f8f8f8;
  border-radius: 16rpx;
  cursor: pointer;
}

.city-name {
  font-size: 32rpx;
  color: #333333;
  font-weight: 500;
}

.city-arrow {
  font-size: 24rpx;
  color: #666666;
  transition: transform 0.3s ease;
}

.city-arrow.rotated {
  transform: rotate(180deg);
}

.city-dropdown {
  position: absolute;
  top: 100%;
  left: 20rpx;
  right: 20rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 400rpx;
  overflow-y: auto;
}

.section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  padding: 0 20rpx 20rpx;
}

.club-list {
  padding: 0 20rpx;
}

.club-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  padding: 24rpx;
}

.club-logo {
  width: 100rpx;
  height: 100rpx;
  border-radius: 16rpx;
  margin-right: 24rpx;
}

.club-info {
  flex: 1;
}

.club-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 8rpx;
  display: block;
}

.club-location {
  font-size: 28rpx;
  color: #666666;
  margin-bottom: 12rpx;
  display: block;
}

.club-tags {
  margin-bottom: 8rpx;
}

.club-members {
  font-size: 24rpx;
  color: #999999;
  display: block;
}

.club-distance {
  text-align: right;
}

.distance {
  font-size: 28rpx;
  color: #666666;
}

.city-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: background-color 0.2s;
  cursor: pointer;
}

.city-option:hover {
  background-color: #f8f8f8;
}

.city-option:last-child {
  border-bottom: none;
}

.city-option:first-child {
  border-radius: 16rpx 16rpx 0 0;
}

.city-option:last-child {
  border-radius: 0 0 16rpx 16rpx;
  border-bottom: none;
}

.city-text {
  font-size: 32rpx;
  color: #333333;
}

.city-check {
  font-size: 32rpx;
  color: #07c160;
  font-weight: bold;
}
</style>
