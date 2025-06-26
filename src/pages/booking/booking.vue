<template>
  <view class="page-container">
    <!-- 搜索区域 -->
    <view class="search-section">
      <view class="search-box">
        <input
          class="search-input"
          placeholder="搜索场馆名称"
          v-model="searchKeyword"
          @confirm="searchVenues"
        />
        <button class="search-btn" @click="searchVenues">搜索</button>
      </view>

      <!-- 筛选条件 -->
      <view class="filter-section">
        <scroll-view class="filter-scroll" scroll-x="true">
          <view class="filter-list">
            <view
              class="filter-item"
              :class="{ active: selectedFilters.includes(filter.key) }"
              v-for="filter in filterOptions"
              :key="filter.key"
              @click="toggleFilter(filter.key)"
            >
              {{ filter.label }}
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 场馆列表 -->
    <view class="venue-list" v-if="venueList.length > 0">
      <view
        class="venue-item card"
        v-for="venue in filteredVenues"
        :key="venue.id"
        @click="goToVenueDetail(venue.id)"
      >
        <image class="venue-image" :src="venue.image" mode="aspectFill"></image>
        <view class="venue-info">
          <view class="venue-header">
            <text class="venue-name">{{ venue.name }}</text>
            <view class="venue-rating">
              <text class="rating-score">{{ venue.rating }}</text>
              <text class="rating-text">分</text>
            </view>
          </view>

          <view class="venue-details">
            <view class="detail-item">
              <text class="detail-label">地址:</text>
              <text class="detail-value">{{ venue.address }}</text>
            </view>
            <view class="detail-item">
              <text class="detail-label">类型:</text>
              <text class="detail-value">{{ venue.courtType }}</text>
            </view>
            <view class="detail-item">
              <text class="detail-label">价格:</text>
              <text class="detail-value price">¥{{ venue.priceRange }}</text>
            </view>
          </view>

          <view class="venue-tags">
            <text class="tag" v-for="tag in venue.tags" :key="tag">{{
              tag
            }}</text>
          </view>

          <view class="venue-footer">
            <text class="distance">距离 {{ venue.distance }}</text>
            <button class="book-btn" @click.stop="quickBook(venue.id)">
              立即预订
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else-if="!loading">
      <image
        class="empty-icon"
        src="/static/placeholders/empty-venue.png"
        mode="aspectFit"
      ></image>
      <text class="empty-text">暂无场馆信息</text>
      <text class="empty-tip">试试搜索其他关键词</text>
    </view>

    <!-- 加载状态 -->
    <view class="loading-state" v-if="loading">
      <text class="loading-text">加载中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";

interface Venue {
  id: number;
  name: string;
  image: string;
  address: string;
  courtType: string;
  priceRange: string;
  rating: number;
  tags: string[];
  distance: string;
  category: string[];
}

interface FilterOption {
  key: string;
  label: string;
}

// 响应式数据
const searchKeyword = ref("");
const venueList = ref<Venue[]>([]);
const selectedFilters = ref<string[]>([]);
const loading = ref(false);

// 筛选选项
const filterOptions = ref<FilterOption[]>([
  { key: "indoor", label: "室内" },
  { key: "outdoor", label: "室外" },
  { key: "hard", label: "硬地" },
  { key: "clay", label: "红土" },
  { key: "grass", label: "草地" },
  { key: "nearby", label: "附近" },
  { key: "cheap", label: "价格优惠" },
]);

// 计算过滤后的场馆列表
const filteredVenues = computed(() => {
  if (selectedFilters.value.length === 0) {
    return venueList.value;
  }

  return venueList.value.filter((venue) => {
    return selectedFilters.value.some(
      (filter) =>
        venue.category.includes(filter) ||
        venue.tags.some((tag) => tag.includes(filter))
    );
  });
});

// 页面加载
onMounted(() => {
  loadVenueList();
});

// 页面参数处理
onLoad((options: any) => {
  if (options.keyword) {
    searchKeyword.value = decodeURIComponent(options.keyword);
    searchVenues();
  }
});

// 加载场馆列表
function loadVenueList() {
  loading.value = true;

  // 模拟数据，实际应该调用API
  setTimeout(() => {
    venueList.value = [
      {
        id: 1,
        name: "黄龙体育中心",
        image: "/static/images/venues/venue1.jpg",
        address: "西湖区 黄龙 室内 硬地",
        courtType: "室内硬地",
        priceRange: "120-200/小时",
        rating: 4.8,
        tags: ["室内", "硬地", "专业"],
        distance: "2.8km",
        category: ["indoor", "hard"],
      },
      {
        id: 2,
        name: "GS网球俱乐部（浙报店）",
        image: "/static/images/venues/venue2.jpg",
        address: "拱墅区 浙报印务 室内 硬地",
        courtType: "室内硬地",
        priceRange: "100-150/小时",
        rating: 4.5,
        tags: ["室内", "硬地"],
        distance: "5.1km",
        category: ["indoor", "hard"],
      },
      {
        id: 3,
        name: "城北体育公园-网球中心",
        image: "/static/images/venues/venue3.jpg",
        address: "拱墅区 室内 硬地",
        courtType: "室内硬地",
        priceRange: "80-120/小时",
        rating: 4.3,
        tags: ["室内", "硬地", "价格优惠"],
        distance: "5.1km",
        category: ["indoor", "hard", "cheap"],
      },
      {
        id: 4,
        name: "西湖网球俱乐部",
        image: "/static/images/venues/venue4.jpg",
        address: "余杭区 西湖 室外 硬地",
        courtType: "室外硬地",
        priceRange: "60-100/小时",
        rating: 4.2,
        tags: ["室外", "硬地", "风景好"],
        distance: "6.2km",
        category: ["outdoor", "hard"],
      },
      {
        id: 5,
        name: "平击网球俱乐部",
        image: "/static/images/venues/venue5.jpg",
        address: "余杭区 五常 室内 硬地",
        courtType: "室内硬地",
        priceRange: "90-140/小时",
        rating: 4.6,
        tags: ["室内", "硬地"],
        distance: "9.8km",
        category: ["indoor", "hard"],
      },
    ];
    loading.value = false;
  }, 1000);
}

// 搜索场馆
function searchVenues() {
  if (!searchKeyword.value.trim()) {
    loadVenueList();
    return;
  }

  loading.value = true;

  // 模拟搜索API调用
  setTimeout(() => {
    venueList.value = venueList.value.filter(
      (venue) =>
        venue.name.includes(searchKeyword.value) ||
        venue.address.includes(searchKeyword.value)
    );
    loading.value = false;
  }, 500);
}

// 切换筛选条件
function toggleFilter(filterKey: string) {
  const index = selectedFilters.value.indexOf(filterKey);
  if (index > -1) {
    selectedFilters.value.splice(index, 1);
  } else {
    selectedFilters.value.push(filterKey);
  }
}

// 跳转到场馆详情
function goToVenueDetail(id: number) {
  uni.showToast({
    title: "跳转到场馆详情",
    icon: "none",
  });
}

// 快速预订
function quickBook(id: number) {
  uni.showModal({
    title: "预订确认",
    content: "是否立即预订该场馆？",
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: "预订成功",
          icon: "success",
        });
      }
    },
  });
}
</script>

<style scoped>
.search-section {
  background-color: #ffffff;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.filter-section {
  margin-top: 20rpx;
}

.filter-scroll {
  white-space: nowrap;
}

.filter-list {
  display: flex;
  padding: 10rpx 0;
}

.filter-item {
  padding: 12rpx 24rpx;
  background-color: #f5f5f5;
  color: #666666;
  border-radius: 32rpx;
  font-size: 28rpx;
  margin-right: 16rpx;
  white-space: nowrap;
}

.filter-item.active {
  background-color: #07c160;
  color: #ffffff;
}

.venue-list {
  padding: 0 20rpx;
}

.venue-item {
  margin-bottom: 20rpx;
  overflow: hidden;
}

.venue-image {
  width: 100%;
  height: 300rpx;
  border-radius: 16rpx 16rpx 0 0;
}

.venue-info {
  padding: 24rpx;
}

.venue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.venue-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  flex: 1;
}

.venue-rating {
  display: flex;
  align-items: center;
}

.rating-score {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff6b6b;
  margin-right: 4rpx;
}

.rating-text {
  font-size: 24rpx;
  color: #999999;
}

.venue-details {
  margin-bottom: 16rpx;
}

.detail-item {
  display: flex;
  margin-bottom: 8rpx;
}

.detail-label {
  font-size: 28rpx;
  color: #666666;
  width: 80rpx;
}

.detail-value {
  font-size: 28rpx;
  color: #333333;
  flex: 1;
}

.detail-value.price {
  color: #ff6b6b;
  font-weight: bold;
}

.venue-tags {
  margin-bottom: 16rpx;
}

.venue-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.distance {
  font-size: 28rpx;
  color: #999999;
}

.book-btn {
  background-color: #07c160;
  color: #ffffff;
  border-radius: 32rpx;
  padding: 12rpx 32rpx;
  font-size: 28rpx;
  border: none;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 32rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 32rpx;
  color: #666666;
  margin-bottom: 16rpx;
}

.empty-tip {
  font-size: 28rpx;
  color: #999999;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999999;
}
</style>
