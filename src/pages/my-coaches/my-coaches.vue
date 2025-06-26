<template>
  <view class="page-container">
    <!-- 预约状态筛选 -->
    <view class="status-tabs">
      <view
        class="tab-item"
        :class="{ active: currentStatus === status.key }"
        v-for="status in statusOptions"
        :key="status.key"
        @click="switchStatus(status.key)"
      >
        {{ status.label }}
      </view>
    </view>

    <!-- 预约列表 -->
    <view class="booking-list" v-if="bookingList.length > 0">
      <view
        class="booking-item card"
        v-for="booking in filteredBookings"
        :key="booking.id"
      >
        <view class="booking-header">
          <view class="coach-info">
            <image
              class="coach-avatar"
              :src="booking.coach.avatar"
              mode="aspectFill"
            />
            <view class="coach-details">
              <text class="coach-name">{{ booking.coach.name }}</text>
              <text class="coach-level">{{ booking.coach.level }}</text>
            </view>
          </view>
          <view class="booking-status" :class="booking.status">
            {{ getStatusText(booking.status) }}
          </view>
        </view>

        <view class="booking-info">
          <view class="info-row">
            <text class="info-label">时间:</text>
            <text class="info-value">{{ booking.time }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">地点:</text>
            <text class="info-value">{{ booking.location }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">课程:</text>
            <text class="info-value">{{ booking.courseType }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">费用:</text>
            <text class="info-value price">¥{{ booking.price }}</text>
          </view>
        </view>

        <view class="booking-actions">
          <button
            class="action-btn"
            v-if="booking.status === 'pending'"
            @click="cancelBooking(booking.id)"
          >
            取消预约
          </button>
          <button
            class="action-btn"
            v-if="booking.status === 'confirmed'"
            @click="contactCoach(booking.coach.phone)"
          >
            联系教练
          </button>
          <button
            class="action-btn primary"
            v-if="booking.status === 'completed'"
            @click="rateCoach(booking.id)"
          >
            评价教练
          </button>
          <button
            class="action-btn"
            v-if="booking.status === 'confirmed'"
            @click="reschedule(booking.id)"
          >
            改期
          </button>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <text class="empty-text">暂无教练预约记录</text>
      <text class="empty-tip">去找个专业教练提升技术吧</text>
      <button class="go-coaches-btn" @click="goToCoaches">查看教练</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";

interface Coach {
  id: number;
  name: string;
  avatar: string;
  level: string;
  phone: string;
}

interface Booking {
  id: number;
  coach: Coach;
  time: string;
  location: string;
  courseType: string;
  price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  bookingTime: string;
}

interface StatusOption {
  key: string;
  label: string;
}

// 响应式数据
const bookingList = ref<Booking[]>([]);
const currentStatus = ref("all");
const loading = ref(false);

// 状态选项
const statusOptions = ref<StatusOption[]>([
  { key: "all", label: "全部" },
  { key: "pending", label: "待确认" },
  { key: "confirmed", label: "已确认" },
  { key: "completed", label: "已完成" },
  { key: "cancelled", label: "已取消" },
]);

// 过滤后的预约列表
const filteredBookings = computed(() => {
  if (currentStatus.value === "all") {
    return bookingList.value;
  }
  return bookingList.value.filter(
    (booking) => booking.status === currentStatus.value
  );
});

// 页面加载
onMounted(() => {
  loadBookingList();
});

// 页面参数处理
onLoad((options: any) => {
  if (options.status) {
    currentStatus.value = options.status;
  }
});

// 加载预约列表
function loadBookingList() {
  loading.value = true;

  // 模拟数据
  setTimeout(() => {
    bookingList.value = [
      {
        id: 1,
        coach: {
          id: 1,
          name: "张教练",
          avatar: "/static/images/coach1.jpg",
          level: "PTR认证教练",
          phone: "13800138001",
        },
        time: "2024-01-20 14:00-16:00",
        location: "星河网球俱乐部",
        courseType: "一对一私教课",
        price: 300,
        status: "confirmed",
        bookingTime: "2024-01-15 10:30:00",
      },
      {
        id: 2,
        coach: {
          id: 2,
          name: "李教练",
          avatar: "/static/images/coach2.jpg",
          level: "ITF认证教练",
          phone: "13800138002",
        },
        time: "2024-01-18 16:00-17:00",
        location: "蓝天网球中心",
        courseType: "技术指导课",
        price: 200,
        status: "completed",
        bookingTime: "2024-01-14 15:20:00",
      },
    ];
    loading.value = false;
  }, 1000);
}

// 切换状态
function switchStatus(status: string) {
  currentStatus.value = status;
}

// 获取状态文本
function getStatusText(status: string) {
  const statusMap: Record<string, string> = {
    pending: "待确认",
    confirmed: "已确认",
    completed: "已完成",
    cancelled: "已取消",
  };
  return statusMap[status] || "未知状态";
}

// 取消预约
function cancelBooking(bookingId: number) {
  uni.showModal({
    title: "确认取消",
    content: "确定要取消预约吗？",
    success: (res) => {
      if (res.confirm) {
        // 处理取消逻辑
        console.log("取消预约:", bookingId);
      }
    },
  });
}

// 联系教练
function contactCoach(phone: string) {
  uni.makePhoneCall({
    phoneNumber: phone,
    success: () => {
      console.log("拨打电话成功");
    },
    fail: (err) => {
      console.log("拨打电话失败:", err);
      uni.showToast({
        title: "拨打失败",
        icon: "none",
      });
    },
  });
}

// 评价教练
function rateCoach(bookingId: number) {
  console.log("评价教练:", bookingId);
  // 跳转到评价页面
}

// 改期
function reschedule(bookingId: number) {
  console.log("改期:", bookingId);
  // 跳转到改期页面
}

// 去查看教练
function goToCoaches() {
  uni.navigateTo({
    url: "/pages/coaches/coaches",
  });
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.status-tabs {
  display: flex;
  background-color: #ffffff;
  padding: 0 20rpx;
  border-bottom: 1rpx solid #e5e5e5;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 30rpx 0;
  font-size: 28rpx;
  color: #666666;
  position: relative;
}

.tab-item.active {
  color: #07c160;
  font-weight: bold;
}

.tab-item.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 4rpx;
  background-color: #07c160;
  border-radius: 2rpx;
}

.booking-list {
  padding: 20rpx;
}

.booking-item {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.coach-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.coach-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  margin-right: 20rpx;
}

.coach-details {
  flex: 1;
}

.coach-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 8rpx;
}

.coach-level {
  font-size: 24rpx;
  color: #666666;
}

.booking-status {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #ffffff;
}

.booking-status.pending {
  background-color: #ff9500;
}

.booking-status.confirmed {
  background-color: #07c160;
}

.booking-status.completed {
  background-color: #576b95;
}

.booking-status.cancelled {
  background-color: #fa5151;
}

.booking-info {
  margin-bottom: 20rpx;
}

.info-row {
  display: flex;
  margin-bottom: 12rpx;
}

.info-label {
  font-size: 28rpx;
  color: #666666;
  width: 100rpx;
}

.info-value {
  font-size: 28rpx;
  color: #333333;
  flex: 1;
}

.info-value.price {
  color: #ff6b35;
  font-weight: bold;
}

.booking-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  flex-wrap: wrap;
}

.action-btn {
  padding: 16rpx 32rpx;
  border-radius: 24rpx;
  font-size: 28rpx;
  border: 1rpx solid #e5e5e5;
  background-color: #ffffff;
  color: #333333;
}

.action-btn.primary {
  background-color: #07c160;
  color: #ffffff;
  border-color: #07c160;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 40rpx;
  text-align: center;
}

.empty-text {
  font-size: 32rpx;
  color: #999999;
  margin-bottom: 16rpx;
}

.empty-tip {
  font-size: 28rpx;
  color: #cccccc;
  margin-bottom: 40rpx;
}

.go-coaches-btn {
  padding: 20rpx 40rpx;
  background-color: #07c160;
  color: #ffffff;
  border-radius: 24rpx;
  font-size: 28rpx;
  border: none;
}

.card {
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}
</style>
