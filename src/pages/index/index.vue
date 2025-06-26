<template>
  <view class="page-container">
    <!-- 搜索订场区域 -->
    <view class="search-section">
      <view class="search-box">
        <input
          class="search-input"
          placeholder="搜索场馆名称"
          v-model="searchKeyword"
          @confirm="searchVenues"
        />
        <button class="search-btn" @click="searchVenues">搜索场馆</button>
      </view>
    </view>

    <!-- 快捷功能区 -->
    <view class="quick-actions">
      <view class="action-item" @click="goToBooking">
        <image
          class="action-icon"
          src="/static/icons/action/icon-booking.svg"
          mode="aspectFit"
        ></image>
        <text class="action-text">订场</text>
      </view>
      <view class="action-item" @click="goToCoaches">
        <image
          class="action-icon"
          src="/static/icons/action/icon-coach.svg"
          mode="aspectFit"
        ></image>
        <text class="action-text">找教练</text>
      </view>
      <view class="action-item" @click="goToActivities">
        <image
          class="action-icon"
          src="/static/icons/action/icon-activity.svg"
          mode="aspectFit"
        ></image>
        <text class="action-text">UTR活动</text>
      </view>
      <view class="action-item" @click="goToClubs">
        <image
          class="action-icon"
          src="/static/icons/action/icon-club.svg"
          mode="aspectFit"
        ></image>
        <text class="action-text">俱乐部</text>
      </view>
    </view>

    <!-- 教练和陪练推荐 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">网球教练与陪练</text>
        <text class="more-btn" @click="goToCoaches">更多 ></text>
      </view>
      <scroll-view class="coach-scroll" scroll-x="true">
        <view class="coach-list">
          <view
            class="coach-item"
            v-for="coach in coachList"
            :key="coach.id"
            @click="goToCoachDetail(coach.id)"
          >
            <image
              class="coach-avatar"
              :src="coach.avatar"
              mode="aspectFill"
            ></image>
            <view class="coach-info">
              <text class="coach-name">{{ coach.name }}</text>
              <view class="coach-tags">
                <text class="tag">{{ coach.level }}</text>
                <text class="tag">{{ coach.specialty }}</text>
              </view>
              <view class="coach-utr">
                <text class="utr-score">UTR {{ coach.utr }}</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- UTR活动展示 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">UTR活动</text>
        <text class="more-btn" @click="goToActivities">更多 ></text>
      </view>
      <view class="activity-list">
        <view
          class="activity-item card"
          v-for="activity in activityList"
          :key="activity.id"
          @click="goToActivityDetail(activity.id)"
        >
          <view class="activity-header">
            <text class="activity-title">{{ activity.title }}</text>
            <view class="activity-status" :class="activity.status">
              {{ getActivityStatusText(activity.status) }}
            </view>
          </view>
          <view class="activity-info">
            <view class="info-item">
              <text class="info-label">时间:</text>
              <text class="info-value">{{ activity.time }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">地点:</text>
              <text class="info-value">{{ activity.location }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">要求:</text>
              <text class="info-value">UTR {{ activity.utrRange }}</text>
            </view>
          </view>
          <view class="activity-footer">
            <text class="participants"
              >已报名 {{ activity.participants }}/{{
                activity.maxParticipants
              }}</text
            >
            <text class="price">¥{{ activity.price }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// 响应式数据
const searchKeyword = ref("");
const coachList = ref([]);
const activityList = ref([]);

// 页面加载时获取数据
onMounted(() => {
  loadCoachList();
  loadActivityList();
});

// 搜索场馆
function searchVenues() {
  if (!searchKeyword.value.trim()) {
    uni.showToast({
      title: "请输入场馆名称",
      icon: "none",
    });
    return;
  }

  uni.navigateTo({
    url: `/pages/booking/booking?keyword=${encodeURIComponent(
      searchKeyword.value
    )}`,
  });
}

// 加载教练列表
function loadCoachList() {
  // 模拟数据，实际应该调用API
  coachList.value = [
    {
      id: 1,
      name: "白影",
      avatar: "/static/images/coaches/coach1.png",
      level: "教练",
      specialty: "陪练",
      utr: "4.5",
    },
    {
      id: 2,
      name: "小罗",
      avatar: "/static/images/coaches/coach2.png",
      level: "教练",
      specialty: "陪练",
      utr: "5.2",
    },
    {
      id: 3,
      name: "陈小明",
      avatar: "/static/images/coaches/coach3.png",
      level: "陪练",
      specialty: "基础",
      utr: "3.8",
    },
  ];
}

// 加载活动列表
function loadActivityList() {
  // 模拟数据，实际应该调用API
  activityList.value = [
    {
      id: 1,
      title: "UTR网球积分赛3.0（蒙马体育）",
      time: "06月26日 周四 09:30",
      location: "城东体育网球训练中心",
      utrRange: "2-4",
      participants: 5,
      maxParticipants: 8,
      price: 120,
      status: "open",
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
    },
  ];
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

// 页面跳转函数
function goToBooking() {
  console.log("跳转到订场页面");
  uni.navigateTo({
    url: "/pages/booking/booking",
    success: () => {
      console.log("跳转成功");
    },
    fail: (err) => {
      console.error("跳转失败:", err);
    },
  });
}

function goToCoaches() {
  console.log("跳转到教练页面");
  uni.navigateTo({
    url: "/pages/coaches/coaches",
    success: () => {
      console.log("跳转成功");
    },
    fail: (err) => {
      console.error("跳转失败:", err);
    },
  });
}

function goToActivities() {
  console.log("跳转到活动页面");
  uni.navigateTo({
    url: "/pages/activities/activities",
    success: () => {
      console.log("跳转成功");
    },
    fail: (err) => {
      console.error("跳转失败:", err);
    },
  });
}

function goToClubs() {
  console.log("跳转到俱乐部页面");
  uni.switchTab({
    url: "/pages/clubs/clubs",
    success: () => {
      console.log("跳转成功");
    },
    fail: (err) => {
      console.error("跳转失败:", err);
    },
  });
}

function goToCoachDetail(id: number) {
  console.log("跳转到教练详情页面:", id);
  uni.navigateTo({
    url: `/pages/coach-detail/coach-detail?id=${id}`,
    success: () => {
      console.log("跳转成功");
    },
    fail: (err) => {
      console.error("跳转失败:", err);
    },
  });
}

function goToActivityDetail(id: number) {
  console.log("跳转到活动详情页面:", id);
  uni.navigateTo({
    url: `/pages/activity-detail/activity-detail?id=${id}`,
    success: () => {
      console.log("跳转成功");
    },
    fail: (err) => {
      console.error("跳转失败:", err);
    },
  });
}
</script>

<style scoped>
.search-section {
  padding: 20rpx;
  background-color: #ffffff;
  margin-bottom: 20rpx;
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  background-color: #ffffff;
  padding: 40rpx 20rpx;
  margin-bottom: 20rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 16rpx;
}

.action-text {
  font-size: 28rpx;
  color: #333333;
}

.section {
  margin-bottom: 40rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20rpx 20rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
}

.more-btn {
  font-size: 28rpx;
  color: #07c160;
}

.coach-scroll {
  white-space: nowrap;
}

.coach-list {
  display: flex;
  padding: 0 20rpx;
}

.coach-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-right: 20rpx;
  min-width: 200rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.coach-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-bottom: 16rpx;
}

.coach-info {
  text-align: center;
}

.coach-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 12rpx;
}

.coach-tags {
  margin-bottom: 12rpx;
}

.coach-utr {
  margin-top: 8rpx;
}

.activity-list {
  padding: 0 20rpx;
}

.activity-item {
  margin-bottom: 20rpx;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.activity-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  flex: 1;
}

.activity-status {
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
  font-size: 24rpx;
  color: #ffffff;
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

.activity-info {
  margin-bottom: 16rpx;
}

.info-item {
  display: flex;
  margin-bottom: 8rpx;
}

.info-label {
  font-size: 28rpx;
  color: #666666;
  width: 80rpx;
}

.info-value {
  font-size: 28rpx;
  color: #333333;
  flex: 1;
}

.activity-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.participants {
  font-size: 28rpx;
  color: #666666;
}

.price {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff6b6b;
}
</style>
