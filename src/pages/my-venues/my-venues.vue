<template>
  <view class="page-container">
    <!-- 预订状态筛选 -->
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

    <!-- 预订列表 -->
    <view class="booking-list" v-if="bookingList.length > 0">
      <view 
        class="booking-item card" 
        v-for="booking in filteredBookings" 
        :key="booking.id"
      >
        <view class="booking-header">
          <view class="venue-info">
            <image class="venue-image" :src="booking.venue.image" mode="aspectFill" />
            <view class="venue-details">
              <text class="venue-name">{{ booking.venue.name }}</text>
              <text class="venue-location">{{ booking.venue.location }}</text>
            </view>
          </view>
          <view class="booking-status" :class="booking.status">
            {{ getStatusText(booking.status) }}
          </view>
        </view>
        
        <view class="booking-info">
          <view class="info-row">
            <text class="info-label">场地:</text>
            <text class="info-value">{{ booking.courtName }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">时间:</text>
            <text class="info-value">{{ booking.time }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">时长:</text>
            <text class="info-value">{{ booking.duration }}小时</text>
          </view>
          <view class="info-row">
            <text class="info-label">费用:</text>
            <text class="info-value price">¥{{ booking.totalPrice }}</text>
          </view>
          <view class="info-row" v-if="booking.deposit > 0">
            <text class="info-label">押金:</text>
            <text class="info-value">¥{{ booking.deposit }}</text>
          </view>
        </view>
        
        <view class="booking-actions">
          <button 
            class="action-btn" 
            v-if="booking.status === 'pending'"
            @click="payBooking(booking.id)"
          >
            立即支付
          </button>
          <button 
            class="action-btn" 
            v-if="booking.status === 'pending'"
            @click="cancelBooking(booking.id)"
          >
            取消预订
          </button>
          <button 
            class="action-btn" 
            v-if="booking.status === 'confirmed'"
            @click="contactVenue(booking.venue.phone)"
          >
            联系场馆
          </button>
          <button 
            class="action-btn" 
            v-if="booking.status === 'confirmed' && canCancel(booking.time)"
            @click="cancelBooking(booking.id)"
          >
            申请退款
          </button>
          <button 
            class="action-btn primary" 
            v-if="booking.status === 'completed'"
            @click="rateVenue(booking.id)"
          >
            评价场馆
          </button>
          <button 
            class="action-btn" 
            @click="viewBookingDetail(booking.id)"
          >
            查看详情
          </button>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <text class="empty-text">暂无场地预订记录</text>
      <text class="empty-tip">去预订一个场地开始运动吧</text>
      <button class="go-booking-btn" @click="goToBooking">预订场地</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

interface Venue {
  id: number
  name: string
  image: string
  location: string
  phone: string
}

interface Booking {
  id: number
  venue: Venue
  courtName: string
  time: string
  duration: number
  totalPrice: number
  deposit: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded'
  bookingTime: string
  paymentTime?: string
}

interface StatusOption {
  key: string
  label: string
}

// 响应式数据
const bookingList = ref<Booking[]>([])
const currentStatus = ref('all')
const loading = ref(false)

// 状态选项
const statusOptions = ref<StatusOption[]>([
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待支付' },
  { key: 'confirmed', label: '已确认' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
  { key: 'refunded', label: '已退款' }
])

// 过滤后的预订列表
const filteredBookings = computed(() => {
  if (currentStatus.value === 'all') {
    return bookingList.value
  }
  return bookingList.value.filter(booking => booking.status === currentStatus.value)
})

// 页面加载
onMounted(() => {
  loadBookingList()
})

// 页面参数处理
onLoad((options: any) => {
  if (options.status) {
    currentStatus.value = options.status
  }
})

// 加载预订列表
function loadBookingList() {
  loading.value = true
  
  // 模拟数据
  setTimeout(() => {
    bookingList.value = [
      {
        id: 1,
        venue: {
          id: 1,
          name: '星河网球俱乐部',
          image: '/static/images/venue1.jpg',
          location: '朝阳区星河路88号',
          phone: '010-12345678'
        },
        courtName: '1号场地',
        time: '2024-01-20 14:00-16:00',
        duration: 2,
        totalPrice: 200,
        deposit: 50,
        status: 'confirmed',
        bookingTime: '2024-01-15 10:30:00',
        paymentTime: '2024-01-15 10:35:00'
      },
      {
        id: 2,
        venue: {
          id: 2,
          name: '蓝天网球中心',
          image: '/static/images/venue2.jpg',
          location: '海淀区蓝天大道66号',
          phone: '010-87654321'
        },
        courtName: '3号场地',
        time: '2024-01-18 16:00-17:00',
        duration: 1,
        totalPrice: 80,
        deposit: 0,
        status: 'completed',
        bookingTime: '2024-01-14 15:20:00',
        paymentTime: '2024-01-14 15:25:00'
      },
      {
        id: 3,
        venue: {
          id: 3,
          name: '绿茵网球场',
          image: '/static/images/venue3.jpg',
          location: '西城区绿茵街12号',
          phone: '010-11223344'
        },
        courtName: '2号场地',
        time: '2024-01-22 10:00-12:00',
        duration: 2,
        totalPrice: 160,
        deposit: 40,
        status: 'pending',
        bookingTime: '2024-01-16 09:15:00'
      }
    ]
    loading.value = false
  }, 1000)
}

// 切换状态
function switchStatus(status: string) {
  currentStatus.value = status
}

// 获取状态文本
function getStatusText(status: string) {
  const statusMap: Record<string, string> = {
    'pending': '待支付',
    'confirmed': '已确认',
    'completed': '已完成',
    'cancelled': '已取消',
    'refunded': '已退款'
  }
  return statusMap[status] || '未知状态'
}

// 判断是否可以取消
function canCancel(bookingTime: string) {
  const now = new Date()
  const booking = new Date(bookingTime.split(' ')[0] + ' ' + bookingTime.split(' ')[1].split('-')[0])
  const timeDiff = booking.getTime() - now.getTime()
  const hoursDiff = timeDiff / (1000 * 3600)
  return hoursDiff > 24 // 提前24小时可以取消
}

// 支付预订
function payBooking(bookingId: number) {
  console.log('支付预订:', bookingId)
  // 跳转到支付页面
}

// 取消预订
function cancelBooking(bookingId: number) {
  uni.showModal({
    title: '确认取消',
    content: '确定要取消预订吗？',
    success: (res) => {
      if (res.confirm) {
        // 处理取消逻辑
        console.log('取消预订:', bookingId)
      }
    }
  })
}

// 联系场馆
function contactVenue(phone: string) {
  uni.makePhoneCall({
    phoneNumber: phone,
    success: () => {
      console.log('拨打电话成功')
    },
    fail: (err) => {
      console.log('拨打电话失败:', err)
      uni.showToast({
        title: '拨打失败',
        icon: 'none'
      })
    }
  })
}

// 评价场馆
function rateVenue(bookingId: number) {
  console.log('评价场馆:', bookingId)
  // 跳转到评价页面
}

// 查看预订详情
function viewBookingDetail(bookingId: number) {
  uni.navigateTo({
    url: `/pages/booking-detail/booking-detail?id=${bookingId}`
  })
}

// 去预订场地
function goToBooking() {
  uni.navigateTo({
    url: '/pages/booking/booking'
  })
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
  overflow-x: auto;
}

.tab-item {
  flex-shrink: 0;
  text-align: center;
  padding: 30rpx 20rpx;
  font-size: 28rpx;
  color: #666666;
  position: relative;
  white-space: nowrap;
}

.tab-item.active {
  color: #07c160;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
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

.venue-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.venue-image {
  width: 80rpx;
  height: 80rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.venue-details {
  flex: 1;
}

.venue-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 8rpx;
}

.venue-location {
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

.booking-status.refunded {
  background-color: #10aeff;
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