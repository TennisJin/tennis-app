<template>
  <view class="page-container">
    <!-- 场馆图片轮播 -->
    <swiper
      class="venue-swiper"
      indicator-dots="true"
      autoplay="true"
      interval="3000"
      duration="500"
    >
      <swiper-item v-for="(image, index) in venue.images" :key="index">
        <image class="swiper-image" :src="image" mode="aspectFill"></image>
      </swiper-item>
    </swiper>

    <!-- 场馆基本信息 -->
    <view class="venue-info card">
      <view class="venue-header">
        <text class="venue-name">{{ venue.name }}</text>
        <view class="venue-rating">
          <text class="rating-score">{{ venue.rating }}</text>
          <view class="rating-stars">
            <text
              class="star"
              v-for="n in 5"
              :key="n"
              :class="{ filled: n <= Math.floor(venue.rating) }"
              >★</text
            >
          </view>
          <text class="rating-count">({{ venue.reviewCount }}条评价)</text>
        </view>
      </view>

      <view class="venue-address">
        <image
          class="address-icon"
          src="/static/icon-location.png"
          mode="aspectFit"
        ></image>
        <text class="address-text">{{ venue.address }}</text>
        <text class="distance-text">{{ venue.distance }}</text>
      </view>

      <view class="venue-tags">
        <text class="tag" v-for="tag in venue.tags" :key="tag">{{ tag }}</text>
      </view>
    </view>

    <!-- 场地类型和价格 -->
    <view class="courts-section card">
      <view class="section-title">场地信息</view>

      <view class="court-list">
        <view
          class="court-item"
          v-for="court in venue.courts"
          :key="court.id"
          @click="selectCourt(court)"
          :class="{ selected: selectedCourt?.id === court.id }"
        >
          <view class="court-info">
            <text class="court-name">{{ court.name }}</text>
            <text class="court-type">{{ court.type }}</text>
            <view class="court-features">
              <text
                class="feature"
                v-for="feature in court.features"
                :key="feature"
                >{{ feature }}</text
              >
            </view>
          </view>

          <view class="court-pricing">
            <view class="price-item">
              <text class="price-label">白天</text>
              <text class="price-value">¥{{ court.dayPrice }}/小时</text>
            </view>
            <view class="price-item">
              <text class="price-label">夜间</text>
              <text class="price-value">¥{{ court.nightPrice }}/小时</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 时间选择 -->
    <view class="time-section card" v-if="selectedCourt">
      <view class="section-title">选择时间</view>

      <!-- 日期选择 -->
      <view class="date-selector">
        <scroll-view class="date-scroll" scroll-x="true">
          <view class="date-list">
            <view
              class="date-item"
              v-for="date in availableDates"
              :key="date.value"
              @click="selectDate(date.value)"
              :class="{ selected: selectedDate === date.value }"
            >
              <text class="date-day">{{ date.day }}</text>
              <text class="date-date">{{ date.date }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 时间段选择 -->
      <view class="time-slots" v-if="selectedDate">
        <view class="time-period">
          <text class="period-title">白天时段 (06:00-18:00)</text>
          <view class="slots-grid">
            <view
              class="time-slot"
              v-for="slot in dayTimeSlots"
              :key="slot.time"
              @click="toggleTimeSlot(slot)"
              :class="{
                selected: selectedTimeSlots.includes(slot.time),
                disabled:
                  slot.status === 'booked' || slot.status === 'unavailable',
              }"
            >
              <text class="slot-time">{{ slot.time }}</text>
              <text class="slot-status">{{
                getSlotStatusText(slot.status)
              }}</text>
            </view>
          </view>
        </view>

        <view class="time-period">
          <text class="period-title">夜间时段 (18:00-23:00)</text>
          <view class="slots-grid">
            <view
              class="time-slot"
              v-for="slot in nightTimeSlots"
              :key="slot.time"
              @click="toggleTimeSlot(slot)"
              :class="{
                selected: selectedTimeSlots.includes(slot.time),
                disabled:
                  slot.status === 'booked' || slot.status === 'unavailable',
              }"
            >
              <text class="slot-time">{{ slot.time }}</text>
              <text class="slot-status">{{
                getSlotStatusText(slot.status)
              }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 场馆设施 -->
    <view class="facilities-section card">
      <view class="section-title">场馆设施</view>

      <view class="facilities-grid">
        <view
          class="facility-item"
          v-for="facility in venue.facilities"
          :key="facility.name"
        >
          <image
            class="facility-icon"
            :src="facility.icon"
            mode="aspectFit"
          ></image>
          <text class="facility-name">{{ facility.name }}</text>
        </view>
      </view>
    </view>

    <!-- 用户评价 -->
    <view class="reviews-section card">
      <view class="section-header">
        <text class="section-title">用户评价</text>
        <text class="more-reviews" @click="viewAllReviews">查看全部</text>
      </view>

      <view class="review-list">
        <view
          class="review-item"
          v-for="review in venue.reviews.slice(0, 3)"
          :key="review.id"
        >
          <view class="review-header">
            <image
              class="reviewer-avatar"
              :src="review.avatar"
              mode="aspectFill"
            ></image>
            <view class="reviewer-info">
              <text class="reviewer-name">{{ review.name }}</text>
              <view class="review-rating">
                <text
                  class="star"
                  v-for="n in 5"
                  :key="n"
                  :class="{ filled: n <= review.rating }"
                  >★</text
                >
              </view>
            </view>
            <text class="review-date">{{ review.date }}</text>
          </view>
          <text class="review-content">{{ review.content }}</text>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-actions">
      <view
        class="booking-summary"
        v-if="selectedCourt && selectedTimeSlots.length > 0"
      >
        <text class="summary-text">
          {{ selectedCourt.name }} · {{ selectedTimeSlots.length }}小时 · ¥{{
            totalPrice
          }}
        </text>
      </view>
      <view class="action-buttons">
        <button class="contact-btn" @click="contactVenue">联系场馆</button>
        <button
          class="book-btn"
          @click="bookCourt"
          :disabled="!selectedCourt || selectedTimeSlots.length === 0"
          :class="{
            disabled: !selectedCourt || selectedTimeSlots.length === 0,
          }"
        >
          立即预订
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

interface Venue {
  id: number;
  name: string;
  address: string;
  distance: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  images: string[];
  courts: Court[];
  facilities: Facility[];
  reviews: Review[];
  phone: string;
}

interface Court {
  id: number;
  name: string;
  type: string;
  features: string[];
  dayPrice: number;
  nightPrice: number;
}

interface Facility {
  name: string;
  icon: string;
}

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  content: string;
}

interface TimeSlot {
  time: string;
  status: "available" | "booked" | "unavailable";
  price: number;
}

interface DateOption {
  value: string;
  day: string;
  date: string;
}

// 响应式数据
const venue = ref<Venue>({
  id: 0,
  name: "",
  address: "",
  distance: "",
  rating: 0,
  reviewCount: 0,
  tags: [],
  images: [],
  courts: [],
  facilities: [],
  reviews: [],
  phone: "",
});

const selectedCourt = ref<Court | null>(null);
const selectedDate = ref("");
const selectedTimeSlots = ref<string[]>([]);
const availableDates = ref<DateOption[]>([]);
const dayTimeSlots = ref<TimeSlot[]>([]);
const nightTimeSlots = ref<TimeSlot[]>([]);
const loading = ref(false);

// 计算总价格
const totalPrice = computed(() => {
  if (!selectedCourt.value || selectedTimeSlots.value.length === 0) {
    return 0;
  }

  let total = 0;
  selectedTimeSlots.value.forEach((time) => {
    const hour = parseInt(time.split(":")[0]);
    if (hour >= 6 && hour < 18) {
      total += selectedCourt.value!.dayPrice;
    } else {
      total += selectedCourt.value!.nightPrice;
    }
  });

  return total;
});

// 页面加载
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = currentPage.options;

  if (options.id) {
    loadVenueDetail(parseInt(options.id));
  }

  generateAvailableDates();
});

// 加载场馆详情
function loadVenueDetail(id: number) {
  loading.value = true;

  // 模拟数据，实际应该调用API
  setTimeout(() => {
    venue.value = {
      id: id,
      name: "城东体育网球训练中心",
      address: "杭州市江干区城东路123号",
      distance: "17.0km",
      rating: 4.8,
      reviewCount: 256,
      tags: ["室内场地", "有顶棚", "停车方便", "设施完善"],
      images: [
        "/static/venue1.jpg",
        "/static/venue2.jpg",
        "/static/venue3.jpg",
        "/static/venue4.jpg",
      ],
      courts: [
        {
          id: 1,
          name: "1号场地",
          type: "硬地场",
          features: ["有顶棚", "灯光充足", "场地平整"],
          dayPrice: 80,
          nightPrice: 120,
        },
        {
          id: 2,
          name: "2号场地",
          type: "硬地场",
          features: ["有顶棚", "灯光充足", "场地平整"],
          dayPrice: 80,
          nightPrice: 120,
        },
        {
          id: 3,
          name: "3号场地",
          type: "红土场",
          features: ["室外", "天然红土", "专业级"],
          dayPrice: 100,
          nightPrice: 150,
        },
      ],
      facilities: [
        { name: "停车场", icon: "/static/facility-parking.png" },
        { name: "更衣室", icon: "/static/facility-locker.png" },
        { name: "淋浴间", icon: "/static/facility-shower.png" },
        { name: "休息区", icon: "/static/facility-rest.png" },
        { name: "WiFi", icon: "/static/facility-wifi.png" },
        { name: "饮水机", icon: "/static/facility-water.png" },
        { name: "商店", icon: "/static/facility-shop.png" },
        { name: "教练服务", icon: "/static/facility-coach.png" },
      ],
      reviews: [
        {
          id: 1,
          name: "张三",
          avatar: "/static/avatar1.png",
          rating: 5,
          date: "2024-06-20",
          content: "场地很不错，设施齐全，停车也方便。教练很专业，下次还会来。",
        },
        {
          id: 2,
          name: "李四",
          avatar: "/static/avatar2.png",
          rating: 4,
          date: "2024-06-18",
          content: "环境很好，场地维护得很好，就是价格稍微贵了一点。",
        },
        {
          id: 3,
          name: "王五",
          avatar: "/static/avatar3.png",
          rating: 5,
          date: "2024-06-15",
          content: "非常满意！场地质量高，服务态度好，强烈推荐！",
        },
      ],
      phone: "0571-12345678",
    };

    loading.value = false;
  }, 1000);
}

// 生成可选日期
function generateAvailableDates() {
  const dates: DateOption[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    const day = i === 0 ? "今天" : i === 1 ? "明天" : dayNames[date.getDay()];
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    const value = date.toISOString().split("T")[0];

    dates.push({
      value,
      day,
      date: dateStr,
    });
  }

  availableDates.value = dates;
}

// 生成时间段
function generateTimeSlots(date: string) {
  // 白天时段 6:00-18:00
  const daySlots: TimeSlot[] = [];
  for (let hour = 6; hour < 18; hour++) {
    const time = `${hour.toString().padStart(2, "0")}:00`;
    daySlots.push({
      time,
      status: Math.random() > 0.3 ? "available" : "booked",
      price: selectedCourt.value?.dayPrice || 80,
    });
  }

  // 夜间时段 18:00-23:00
  const nightSlots: TimeSlot[] = [];
  for (let hour = 18; hour < 23; hour++) {
    const time = `${hour.toString().padStart(2, "0")}:00`;
    nightSlots.push({
      time,
      status: Math.random() > 0.4 ? "available" : "booked",
      price: selectedCourt.value?.nightPrice || 120,
    });
  }

  dayTimeSlots.value = daySlots;
  nightTimeSlots.value = nightSlots;
}

// 选择场地
function selectCourt(court: Court) {
  selectedCourt.value = court;
  selectedTimeSlots.value = [];

  if (selectedDate.value) {
    generateTimeSlots(selectedDate.value);
  }
}

// 选择日期
function selectDate(date: string) {
  selectedDate.value = date;
  selectedTimeSlots.value = [];

  if (selectedCourt.value) {
    generateTimeSlots(date);
  }
}

// 切换时间段选择
function toggleTimeSlot(slot: TimeSlot) {
  if (slot.status !== "available") {
    return;
  }

  const index = selectedTimeSlots.value.indexOf(slot.time);
  if (index > -1) {
    selectedTimeSlots.value.splice(index, 1);
  } else {
    selectedTimeSlots.value.push(slot.time);
  }

  // 排序时间段
  selectedTimeSlots.value.sort();
}

// 获取时间段状态文本
function getSlotStatusText(status: string) {
  const statusMap = {
    available: "可预订",
    booked: "已预订",
    unavailable: "不可用",
  };
  return statusMap[status] || "";
}

// 预订场地
function bookCourt() {
  if (!selectedCourt.value || selectedTimeSlots.value.length === 0) {
    uni.showToast({
      title: "请选择场地和时间",
      icon: "none",
    });
    return;
  }

  const bookingInfo = {
    venue: venue.value.name,
    court: selectedCourt.value.name,
    date: selectedDate.value,
    timeSlots: selectedTimeSlots.value,
    totalPrice: totalPrice.value,
  };

  uni.navigateTo({
    url: `/pages/booking-confirm/booking-confirm?data=${encodeURIComponent(
      JSON.stringify(bookingInfo)
    )}`,
  });
}

// 联系场馆
function contactVenue() {
  uni.showActionSheet({
    itemList: ["拨打电话", "发送消息"],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.makePhoneCall({
          phoneNumber: venue.value.phone,
        });
      } else if (res.tapIndex === 1) {
        uni.navigateTo({
          url: "/pages/customer-service/customer-service",
        });
      }
    },
  });
}

// 查看所有评价
function viewAllReviews() {
  uni.navigateTo({
    url: `/pages/venue-reviews/venue-reviews?id=${venue.value.id}`,
  });
}
</script>

<style scoped>
.venue-swiper {
  height: 400rpx;
  margin-bottom: 20rpx;
}

.swiper-image {
  width: 100%;
  height: 100%;
}

.venue-info {
  margin-bottom: 20rpx;
  padding: 32rpx;
}

.venue-header {
  margin-bottom: 20rpx;
}

.venue-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 12rpx;
}

.venue-rating {
  display: flex;
  align-items: center;
}

.rating-score {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff6b6b;
  margin-right: 12rpx;
}

.rating-stars {
  margin-right: 12rpx;
}

.star {
  color: #ddd;
  font-size: 24rpx;
}

.star.filled {
  color: #ffd700;
}

.rating-count {
  font-size: 26rpx;
  color: #666666;
}

.venue-address {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.address-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 12rpx;
}

.address-text {
  font-size: 28rpx;
  color: #666666;
  flex: 1;
}

.distance-text {
  font-size: 26rpx;
  color: #999999;
}

.courts-section {
  margin-bottom: 20rpx;
  padding: 32rpx;
}

.court-list {
  margin-top: 20rpx;
}

.court-item {
  border: 2rpx solid #f0f0f0;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.court-item.selected {
  border-color: #07c160;
  background-color: #f0fff4;
}

.court-item:last-child {
  margin-bottom: 0;
}

.court-info {
  flex: 1;
}

.court-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 8rpx;
}

.court-type {
  font-size: 26rpx;
  color: #666666;
  display: block;
  margin-bottom: 12rpx;
}

.court-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.feature {
  background-color: #f5f5f5;
  color: #666666;
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  font-size: 22rpx;
}

.court-pricing {
  text-align: right;
}

.price-item {
  margin-bottom: 8rpx;
}

.price-item:last-child {
  margin-bottom: 0;
}

.price-label {
  font-size: 24rpx;
  color: #666666;
  display: block;
}

.price-value {
  font-size: 28rpx;
  font-weight: bold;
  color: #ff6b6b;
  display: block;
}

.time-section {
  margin-bottom: 20rpx;
  padding: 32rpx;
}

.date-selector {
  margin-bottom: 32rpx;
}

.date-scroll {
  white-space: nowrap;
}

.date-list {
  display: flex;
  padding: 10rpx 0;
}

.date-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 24rpx;
  margin-right: 16rpx;
  border-radius: 16rpx;
  border: 2rpx solid #f0f0f0;
  white-space: nowrap;
}

.date-item.selected {
  border-color: #07c160;
  background-color: #f0fff4;
}

.date-day {
  font-size: 24rpx;
  color: #666666;
  margin-bottom: 4rpx;
}

.date-date {
  font-size: 28rpx;
  color: #333333;
  font-weight: bold;
}

.time-period {
  margin-bottom: 32rpx;
}

.time-period:last-child {
  margin-bottom: 0;
}

.period-title {
  font-size: 28rpx;
  color: #333333;
  font-weight: bold;
  display: block;
  margin-bottom: 16rpx;
}

.slots-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
}

.time-slot {
  border: 2rpx solid #f0f0f0;
  border-radius: 12rpx;
  padding: 16rpx 8rpx;
  text-align: center;
}

.time-slot.selected {
  border-color: #07c160;
  background-color: #f0fff4;
}

.time-slot.disabled {
  background-color: #f5f5f5;
  color: #ccc;
}

.slot-time {
  font-size: 26rpx;
  color: #333333;
  font-weight: bold;
  display: block;
  margin-bottom: 4rpx;
}

.slot-status {
  font-size: 20rpx;
  color: #666666;
}

.facilities-section {
  margin-bottom: 20rpx;
  padding: 32rpx;
}

.facilities-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24rpx;
  margin-top: 20rpx;
}

.facility-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.facility-icon {
  width: 48rpx;
  height: 48rpx;
  margin-bottom: 8rpx;
}

.facility-name {
  font-size: 24rpx;
  color: #666666;
  text-align: center;
}

.reviews-section {
  margin-bottom: 140rpx;
  padding: 32rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.more-reviews {
  font-size: 26rpx;
  color: #07c160;
}

.review-list {
  margin-top: 20rpx;
}

.review-item {
  margin-bottom: 24rpx;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.review-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.review-header {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.reviewer-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  margin-right: 16rpx;
}

.reviewer-info {
  flex: 1;
}

.reviewer-name {
  font-size: 28rpx;
  color: #333333;
  display: block;
  margin-bottom: 4rpx;
}

.review-rating {
  display: flex;
}

.review-date {
  font-size: 24rpx;
  color: #999999;
}

.review-content {
  font-size: 26rpx;
  color: #666666;
  line-height: 1.5;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-top: 1rpx solid #f0f0f0;
  z-index: 100;
}

.booking-summary {
  padding: 16rpx 20rpx;
  background-color: #f8f8f8;
  border-bottom: 1rpx solid #f0f0f0;
}

.summary-text {
  font-size: 26rpx;
  color: #333333;
}

.action-buttons {
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
}

.contact-btn {
  flex: 1;
  background-color: #f8f8f8;
  color: #333333;
  border-radius: 32rpx;
  padding: 20rpx;
  font-size: 30rpx;
  border: none;
}

.book-btn {
  flex: 2;
  background-color: #07c160;
  color: #ffffff;
  border-radius: 32rpx;
  padding: 20rpx;
  font-size: 30rpx;
  font-weight: bold;
  border: none;
}

.book-btn.disabled {
  background-color: #cccccc;
  color: #999999;
}
</style>
