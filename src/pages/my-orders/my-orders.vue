<template>
  <view class="page-container">
    <!-- 订单状态筛选 -->
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

    <!-- 订单列表 -->
    <view class="order-list" v-if="orderList.length > 0">
      <view
        class="order-item card"
        v-for="order in filteredOrders"
        :key="order.id"
        @click="goToOrderDetail(order.id)"
      >
        <view class="order-header">
          <text class="order-number">订单号：{{ order.orderNumber }}</text>
          <view class="order-status" :class="order.status">
            {{ getStatusText(order.status) }}
          </view>
        </view>

        <view class="order-content">
          <image
            class="venue-image"
            :src="order.venueImage"
            mode="aspectFill"
          ></image>
          <view class="order-info">
            <text class="venue-name">{{ order.venueName }}</text>
            <text class="court-info"
              >{{ order.courtType }} · {{ order.courtNumber }}号场</text
            >
            <text class="time-info">{{ order.date }} {{ order.timeSlot }}</text>
            <text class="price-info">￥{{ order.totalPrice }}</text>
          </view>
        </view>

        <view class="order-actions">
          <button
            class="action-btn"
            v-if="order.status === 'pending'"
            @click.stop="cancelOrder(order.id)"
          >
            取消订单
          </button>
          <button
            class="action-btn primary"
            v-if="order.status === 'pending'"
            @click.stop="payOrder(order.id)"
          >
            立即支付
          </button>
          <button
            class="action-btn"
            v-if="order.status === 'completed'"
            @click.stop="rateOrder(order.id)"
          >
            评价
          </button>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <text class="empty-text">暂无订单</text>
      <text class="empty-tip">去预订一个场地吧</text>
      <button class="go-booking-btn" @click="goToBooking">立即预订</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";

interface Order {
  id: number;
  orderNumber: string;
  venueName: string;
  venueImage: string;
  courtType: string;
  courtNumber: number;
  date: string;
  timeSlot: string;
  totalPrice: number;
  status: "pending" | "paid" | "completed" | "cancelled";
  createTime: string;
}

interface StatusOption {
  key: string;
  label: string;
}

// 响应式数据
const orderList = ref<Order[]>([]);
const currentStatus = ref("all");
const loading = ref(false);

// 状态选项
const statusOptions = ref<StatusOption[]>([
  { key: "all", label: "全部" },
  { key: "pending", label: "待支付" },
  { key: "paid", label: "已支付" },
  { key: "completed", label: "已完成" },
  { key: "cancelled", label: "已取消" },
]);

// 过滤后的订单列表
const filteredOrders = computed(() => {
  if (currentStatus.value === "all") {
    return orderList.value;
  }
  return orderList.value.filter(
    (order) => order.status === currentStatus.value
  );
});

// 页面加载
onMounted(() => {
  loadOrderList();
});

// 页面参数处理
onLoad((options: any) => {
  if (options.status) {
    currentStatus.value = options.status;
  }
});

// 加载订单列表
function loadOrderList() {
  loading.value = true;

  // 模拟数据
  setTimeout(() => {
    orderList.value = [
      {
        id: 1,
        orderNumber: "TN202401150001",
        venueName: "星河网球俱乐部",
        venueImage: "/static/venue1.jpg",
        courtType: "硬地",
        courtNumber: 1,
        date: "2024-01-20",
        timeSlot: "14:00-16:00",
        totalPrice: 200,
        status: "pending",
        createTime: "2024-01-15 10:30:00",
      },
      {
        id: 2,
        orderNumber: "TN202401140002",
        venueName: "蓝天网球中心",
        venueImage: "/static/venue2.jpg",
        courtType: "红土",
        courtNumber: 3,
        date: "2024-01-18",
        timeSlot: "16:00-18:00",
        totalPrice: 180,
        status: "completed",
        createTime: "2024-01-14 15:20:00",
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
    pending: "待支付",
    paid: "已支付",
    completed: "已完成",
    cancelled: "已取消",
  };
  return statusMap[status] || "未知状态";
}

// 取消订单
function cancelOrder(orderId: number) {
  uni.showModal({
    title: "确认取消",
    content: "确定要取消这个订单吗？",
    success: (res) => {
      if (res.confirm) {
        // 处理取消逻辑
        console.log("取消订单:", orderId);
      }
    },
  });
}

// 支付订单
function payOrder(orderId: number) {
  console.log("支付订单:", orderId);
  // 跳转到支付页面
}

// 评价订单
function rateOrder(orderId: number) {
  console.log("评价订单:", orderId);
  // 跳转到评价页面
}

// 查看订单详情
function goToOrderDetail(orderId: number) {
  uni.navigateTo({
    url: `/pages/order-detail/order-detail?id=${orderId}`,
  });
}

// 去预订
function goToBooking() {
  uni.navigateTo({
    url: "/pages/booking/booking",
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

.order-list {
  padding: 20rpx;
}

.order-item {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.order-number {
  font-size: 28rpx;
  color: #666666;
}

.order-status {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #ffffff;
}

.order-status.pending {
  background-color: #ff9500;
}

.order-status.paid {
  background-color: #07c160;
}

.order-status.completed {
  background-color: #576b95;
}

.order-status.cancelled {
  background-color: #fa5151;
}

.order-content {
  display: flex;
  margin-bottom: 20rpx;
}

.venue-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}

.order-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.venue-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 8rpx;
}

.court-info,
.time-info {
  font-size: 28rpx;
  color: #666666;
  margin-bottom: 8rpx;
}

.price-info {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff6b35;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
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

.go-booking-btn {
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
