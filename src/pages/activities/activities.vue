<template>
  <view class="page-container">
    <!-- 搜索和筛选 -->
    <view class="search-section">
      <view class="search-box">
        <input
          class="search-input"
          placeholder="搜索活动名称"
          v-model="searchKeyword"
          @confirm="searchActivities"
        />
        <button class="search-btn" @click="searchActivities">搜索</button>
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

    <!-- 活动列表 -->
    <view class="activity-list" v-if="activityList.length > 0">
      <view
        class="activity-item card"
        v-for="activity in filteredActivities"
        :key="activity.id"
        @click="goToActivityDetail(activity.id)"
      >
        <view class="activity-header">
          <text class="activity-title">{{ activity.title }}</text>
          <view class="activity-status" :class="activity.status">
            {{ getActivityStatusText(activity.status) }}
          </view>
        </view>

        <view class="activity-tags">
          <text class="tag" v-for="tag in activity.tags" :key="tag">{{
            tag
          }}</text>
        </view>

        <view class="activity-info">
          <view class="info-row">
            <view class="info-item">
              <image
                class="info-icon"
                src="/static/icons/status/icon-time.png"
                mode="aspectFit"
              ></image>
              <text class="info-text">{{ activity.time }}</text>
            </view>
          </view>

          <view class="info-row">
            <view class="info-item">
              <image
                class="info-icon"
                src="/static/icons/status/icon-location.png"
                mode="aspectFit"
              ></image>
              <text class="info-text">{{ activity.location }}</text>
            </view>
          </view>

          <view class="info-row">
            <view class="info-item">
              <image
                class="info-icon"
                src="/static/icons/status/icon-utr.png"
                mode="aspectFit"
              ></image>
              <text class="info-text">UTR {{ activity.utrRange }}</text>
            </view>
          </view>

          <view class="info-row" v-if="activity.ageRange">
            <view class="info-item">
              <image
                class="info-icon"
                src="/static/icons/status/icon-age.png"
                mode="aspectFit"
              ></image>
              <text class="info-text">{{ activity.ageRange }}</text>
            </view>
          </view>

          <view class="info-row" v-if="activity.gender">
            <view class="info-item">
              <image
                class="info-icon"
                src="/static/icons/status/icon-gender.png"
                mode="aspectFit"
              ></image>
              <text class="info-text">{{ activity.gender }}</text>
            </view>
          </view>
        </view>

        <view class="activity-footer">
          <view class="participants-info">
            <text class="participants-text"
              >已报名 {{ activity.participants }}/{{
                activity.maxParticipants
              }}</text
            >
            <view class="progress-bar">
              <view
                class="progress-fill"
                :style="{
                  width:
                    (activity.participants / activity.maxParticipants) * 100 +
                    '%',
                }"
              ></view>
            </view>
          </view>
          <view class="price-info">
            <text class="price-text">¥{{ activity.price }}</text>
            <button
              class="join-btn"
              :class="{ disabled: activity.status !== 'open' }"
              @click.stop="joinActivity(activity.id)"
              :disabled="activity.status !== 'open'"
            >
              {{ getJoinButtonText(activity.status) }}
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else-if="!loading">
      <image
        class="empty-icon"
        src="/static/placeholders/empty-activity.png"
        mode="aspectFit"
      ></image>
      <text class="empty-text">暂无活动信息</text>
      <text class="empty-tip">试试调整筛选条件</text>
    </view>

    <!-- 加载状态 -->
    <view class="loading-state" v-if="loading">
      <text class="loading-text">加载中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { ActivityService } from "@/services/api";
import { AuthManager } from "@/utils/auth";

interface Activity {
  id: number;
  title: string;
  time: string;
  location: string;
  utrRange: string;
  ageRange?: string;
  gender?: string;
  participants: number;
  maxParticipants: number;
  price: number;
  status: "open" | "full" | "closed" | "cancelled";
  tags: string[];
  category: string[];
  level: string;
  type: string;
}

interface FilterOption {
  key: string;
  label: string;
}

// 响应式数据
const searchKeyword = ref("");
const activityList = ref<Activity[]>([]);
const selectedFilters = ref<string[]>([]);
const loading = ref(false);

// 筛选选项
const filterOptions = ref<FilterOption[]>([
  { key: "open", label: "报名中" },
  { key: "beginner", label: "初级" },
  { key: "intermediate", label: "中级" },
  { key: "advanced", label: "高级" },
  { key: "singles", label: "单打" },
  { key: "doubles", label: "双打" },
  { key: "mixed", label: "混双" },
  { key: "male", label: "男子" },
  { key: "female", label: "女子" },
  { key: "youth", label: "青少年" },
  { key: "adult", label: "成人" },
  { key: "weekend", label: "周末" },
  { key: "affordable", label: "价格优惠" },
]);

// 计算过滤后的活动列表
const filteredActivities = computed(() => {
  let result = activityList.value;

  // 关键词搜索
  if (searchKeyword.value.trim()) {
    result = result.filter(
      (activity) =>
        activity.title.includes(searchKeyword.value) ||
        activity.location.includes(searchKeyword.value)
    );
  }

  // 筛选条件
  if (selectedFilters.value.length > 0) {
    result = result.filter((activity) =>
      selectedFilters.value.some(
        (filter) =>
          activity.category.includes(filter) ||
          activity.status === filter ||
          activity.tags.some((tag) => tag.includes(filter))
      )
    );
  }

  return result;
});

// 页面加载
onMounted(() => {
  loadActivityList();
});

// 加载活动列表
async function loadActivityList() {
  loading.value = true;

  try {
    const response = await ActivityService.getActivities({
      page: 1,
      limit: 20,
      keyword: searchKeyword.value,
      filters: selectedFilters.value
    });
    
    activityList.value = response.data.map((activity: any) => ({
      id: activity.id,
      title: activity.title,
      time: new Date(activity.startTime).toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      location: `${activity.location} | ${activity.distance || '0km'}`,
      utrRange: activity.utrRange || "不限",
      ageRange: activity.ageRange,
      gender: activity.gender,
      participants: activity.currentParticipants || 0,
      maxParticipants: activity.maxParticipants || 0,
      price: activity.price || 0,
      status: activity.status || "open",
      tags: activity.tags || [],
      category: activity.category || [],
      level: activity.level || "intermediate",
      type: activity.type || "singles"
    }));
  } catch (error: any) {
    console.error("获取活动列表失败:", error);
    // 使用默认数据作为降级方案
    setTimeout(() => {
      activityList.value = [
      {
        id: 1,
        title: "UTR网球积分赛3.0（蒙马体育）",
        time: "06月26日 周四 09:30",
        location: "城东体育网球训练中心 | 17.0km",
        utrRange: "2-4",
        participants: 5,
        maxParticipants: 8,
        price: 120,
        status: "open",
        tags: ["有顶棚", "4人打", "UTR2-4", "冠军300"],
        category: ["open", "intermediate", "singles"],
        level: "intermediate",
        type: "singles",
      },
      {
        id: 2,
        title: "UTR网球积分赛2.5『功量网球中心』",
        time: "06月26日 周四 09:30",
        location: "功量网球中心",
        utrRange: "1.5-3",
        participants: 3,
        maxParticipants: 6,
        price: 100,
        status: "open",
        tags: ["单打比赛", "UTR1-3", "2.5水平", "不限性别"],
        category: ["open", "beginner", "singles", "affordable"],
        level: "beginner",
        type: "singles",
      },
      {
        id: 3,
        title: "UTR网球积分赛2.0初学者场（溪上）",
        time: "04月19日 周六 18:00",
        location: "溪上网球（红土球场）",
        utrRange: "1.5-3",
        ageRange: "纯初学者，不会发球",
        participants: 8,
        maxParticipants: 8,
        price: 80,
        status: "full",
        tags: ["溪上网球", "红土", "有顶棚", "单打", "UTR 1.5-3"],
        category: ["full", "beginner", "singles"],
        level: "beginner",
        type: "singles",
      },
      {
        id: 4,
        title: "UTR网球积分赛2.5（溪上）",
        time: "04月18日 周五 19:00",
        location: "溪上网球（红土球场）",
        utrRange: "1.5-3",
        participants: 6,
        maxParticipants: 6,
        price: 90,
        status: "closed",
        tags: ["溪上网球", "红土", "有顶棚", "单打", "UTR 1.5-3"],
        category: ["closed", "beginner", "singles"],
        level: "beginner",
        type: "singles",
      },
      {
        id: 5,
        title: "女子网球专场活动",
        time: "06月28日 周六 14:00",
        location: "黄龙体育中心",
        utrRange: "2-5",
        gender: "仅限女性",
        participants: 4,
        maxParticipants: 12,
        price: 150,
        status: "open",
        tags: ["女子专场", "双打", "周末"],
        category: ["open", "female", "doubles", "weekend"],
        level: "intermediate",
        type: "doubles",
      },
      {
        id: 6,
        title: "亲子网球体验课",
        time: "06月29日 周日 10:00",
        location: "西湖网球俱乐部",
        utrRange: "不限",
        ageRange: "6-12岁儿童+家长",
        participants: 6,
        maxParticipants: 10,
        price: 80,
        status: "open",
        tags: ["亲子", "体验课", "周末", "儿童"],
        category: ["open", "youth", "weekend", "affordable"],
        level: "beginner",
        type: "lesson",
      },
      {
        id: 7,
        title: "高级双打训练营",
        time: "06月30日 周一 19:00",
        location: "GS网球俱乐部",
        utrRange: "4-7",
        participants: 2,
        maxParticipants: 8,
        price: 200,
        status: "open",
        tags: ["高级", "双打", "训练营"],
        category: ["open", "advanced", "doubles"],
        level: "advanced",
        type: "training",
      },
      {
        id: 8,
        title: "混双友谊赛",
        time: "07月01日 周二 18:30",
        location: "城北体育公园",
        utrRange: "3-6",
        participants: 8,
        maxParticipants: 16,
        price: 120,
        status: "open",
        tags: ["混双", "友谊赛", "不限性别"],
        category: ["open", "mixed", "intermediate"],
        level: "intermediate",
        type: "match",
      },
    ];
      loading.value = false;
    }, 1000);
  }
}

// 搜索活动
function searchActivities() {
  console.log("搜索活动:", searchKeyword.value);
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

// 获取活动状态文本
function getActivityStatusText(status: string) {
  const statusMap = {
    open: "报名中",
    full: "已满员",
    closed: "已结束",
    cancelled: "已取消",
  };
  return statusMap[status] || "未知状态";
}

// 获取报名按钮文本
function getJoinButtonText(status: string) {
  const buttonMap = {
    open: "报名",
    full: "已满",
    closed: "已结束",
    cancelled: "已取消",
  };
  return buttonMap[status] || "报名";
}

// 跳转到活动详情
function goToActivityDetail(id: number) {
  uni.navigateTo({
    url: `/pages/activity-detail/activity-detail?id=${id}`,
  });
}

// 报名活动
async function joinActivity(id: number) {
  const activity = activityList.value.find((a) => a.id === id);
  if (!activity || activity.status !== "open") {
    return;
  }

  // 检查登录状态
  if (!AuthManager.isLoggedIn()) {
    uni.showModal({
      title: "提示",
      content: "请先登录后再报名活动",
      showCancel: false,
      success: () => {
        uni.navigateTo({
          url: "/pages/login/login"
        });
      }
    });
    return;
  }

  uni.showModal({
    title: "确认报名",
    content: `确认报名参加「${activity.title}」？\n费用：¥${activity.price}`,
    success: async (res) => {
      if (res.confirm) {
        try {
          uni.showLoading({
            title: "报名中..."
          });
          
          await ActivityService.joinActivity(id);
          
          // 更新本地数据
          activity.participants++;
          if (activity.participants >= activity.maxParticipants) {
            activity.status = "full";
          }

          uni.hideLoading();
          uni.showToast({
            title: "报名成功",
            icon: "success",
          });
        } catch (error: any) {
          uni.hideLoading();
          uni.showToast({
            title: error.message || "报名失败，请重试",
            icon: "none",
            duration: 2000
          });
        }
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

.activity-list {
  padding: 0 20rpx;
}

.activity-item {
  margin-bottom: 20rpx;
  padding: 24rpx;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
}

.activity-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  flex: 1;
  margin-right: 16rpx;
  line-height: 1.3;
}

.activity-status {
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
  font-size: 24rpx;
  color: #ffffff;
  white-space: nowrap;
}

.activity-status.open {
  background-color: #07c160;
}

.activity-status.full {
  background-color: #ff6b6b;
}

.activity-status.closed {
  background-color: #999999;
}

.activity-status.cancelled {
  background-color: #ff4757;
}

.activity-tags {
  margin-bottom: 16rpx;
}

.activity-info {
  margin-bottom: 20rpx;
}

.info-row {
  margin-bottom: 12rpx;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 12rpx;
}

.info-text {
  font-size: 28rpx;
  color: #666666;
  flex: 1;
}

.activity-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.participants-info {
  flex: 1;
  margin-right: 20rpx;
}

.participants-text {
  font-size: 28rpx;
  color: #666666;
  margin-bottom: 8rpx;
  display: block;
}

.progress-bar {
  width: 100%;
  height: 8rpx;
  background-color: #f0f0f0;
  border-radius: 4rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #07c160;
  transition: width 0.3s ease;
}

.price-info {
  display: flex;
  align-items: center;
}

.price-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff6b6b;
  margin-right: 16rpx;
}

.join-btn {
  background-color: #07c160;
  color: #ffffff;
  border-radius: 32rpx;
  padding: 12rpx 32rpx;
  font-size: 28rpx;
  border: none;
}

.join-btn.disabled {
  background-color: #cccccc;
  color: #999999;
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
