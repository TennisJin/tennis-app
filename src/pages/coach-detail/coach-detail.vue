<template>
  <view class="page-container">
    <!-- 教练基本信息 -->
    <view class="coach-header card">
      <view class="coach-basic">
        <image
          class="coach-avatar"
          :src="coach.avatar"
          mode="aspectFill"
        ></image>
        <view class="coach-info">
          <view class="name-section">
            <text class="coach-name">{{ coach.name }}</text>
            <view class="gender-badge" :class="coach.gender">
              {{ coach.gender === "male" ? "男" : "女" }}
            </view>
          </view>

          <view class="coach-stats">
            <view class="stat-item">
              <text class="stat-label">UTR</text>
              <text class="stat-value utr">{{ coach.utr }}</text>
            </view>
            <view class="stat-item">
              <text class="stat-label">经验</text>
              <text class="stat-value">{{ coach.experience }}年</text>
            </view>
            <view class="stat-item">
              <text class="stat-label">评分</text>
              <text class="stat-value rating">{{ coach.rating }}</text>
            </view>
          </view>

          <view class="coach-level">
            <text class="level-badge" :class="coach.level">{{
              getLevelText(coach.level)
            }}</text>
          </view>
        </view>
      </view>

      <view class="coach-tags">
        <text class="tag" v-for="tag in coach.specialties" :key="tag">{{
          tag
        }}</text>
      </view>

      <view class="price-section">
        <text class="price-label">课程价格</text>
        <text class="price-value">¥{{ coach.price }}/小时</text>
      </view>
    </view>

    <!-- 教练介绍 -->
    <view class="coach-intro card">
      <view class="section-title">教练介绍</view>
      <text class="intro-text">{{ coach.introduction }}</text>

      <view class="achievements" v-if="coach.achievements.length > 0">
        <text class="achievements-title">主要成就</text>
        <view class="achievement-list">
          <text
            class="achievement-item"
            v-for="achievement in coach.achievements"
            :key="achievement"
          >
            • {{ achievement }}
          </text>
        </view>
      </view>
    </view>

    <!-- 教学视频 -->
    <view class="videos-section card" v-if="coach.videos.length > 0">
      <view class="section-title">教学视频</view>

      <scroll-view class="videos-scroll" scroll-x="true">
        <view class="videos-list">
          <view
            class="video-item"
            v-for="video in coach.videos"
            :key="video.id"
            @click="playVideo(video)"
          >
            <view class="video-cover">
              <image
                class="cover-image"
                :src="video.cover"
                mode="aspectFill"
              ></image>
              <view class="play-icon">
                <image src="/static/icon-play.png" mode="aspectFit"></image>
              </view>
            </view>
            <text class="video-title">{{ video.title }}</text>
            <text class="video-duration">{{ video.duration }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 课程安排 -->
    <view class="schedule-section card">
      <view class="section-title">课程安排</view>

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
        <view class="slots-grid">
          <view
            class="time-slot"
            v-for="slot in timeSlots"
            :key="slot.time"
            @click="selectTimeSlot(slot)"
            :class="{
              selected: selectedTimeSlot?.time === slot.time,
              disabled: slot.status !== 'available',
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

    <!-- 学员评价 -->
    <view class="reviews-section card">
      <view class="section-header">
        <text class="section-title">学员评价</text>
        <text class="more-reviews" @click="viewAllReviews">查看全部</text>
      </view>

      <view class="review-summary">
        <view class="rating-overview">
          <text class="overall-rating">{{ coach.rating }}</text>
          <view class="rating-stars">
            <text
              class="star"
              v-for="n in 5"
              :key="n"
              :class="{ filled: n <= Math.floor(coach.rating) }"
              >★</text
            >
          </view>
          <text class="review-count">{{ coach.reviewCount }}条评价</text>
        </view>
      </view>

      <view class="review-list">
        <view
          class="review-item"
          v-for="review in coach.reviews.slice(0, 3)"
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
      <view class="booking-summary" v-if="selectedTimeSlot">
        <text class="summary-text">
          {{ selectedDate }} {{ selectedTimeSlot.time }} · ¥{{ coach.price }}
        </text>
      </view>
      <view class="action-buttons">
        <button class="contact-btn" @click="contactCoach">联系教练</button>
        <button
          class="book-btn"
          @click="bookLesson"
          :disabled="!selectedTimeSlot"
          :class="{ disabled: !selectedTimeSlot }"
        >
          立即预约
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Coach {
  id: number;
  name: string;
  avatar: string;
  gender: "male" | "female";
  utr: number;
  experience: number;
  rating: number;
  reviewCount: number;
  level: "beginner" | "intermediate" | "advanced" | "professional";
  specialties: string[];
  price: number;
  introduction: string;
  achievements: string[];
  videos: Video[];
  reviews: Review[];
  phone: string;
}

interface Video {
  id: number;
  title: string;
  cover: string;
  duration: string;
  url: string;
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
}

interface DateOption {
  value: string;
  day: string;
  date: string;
}

// 响应式数据
const coach = ref<Coach>({
  id: 0,
  name: "",
  avatar: "",
  gender: "male",
  utr: 0,
  experience: 0,
  rating: 0,
  reviewCount: 0,
  level: "intermediate",
  specialties: [],
  price: 0,
  introduction: "",
  achievements: [],
  videos: [],
  reviews: [],
  phone: "",
});

const selectedDate = ref("");
const selectedTimeSlot = ref<TimeSlot | null>(null);
const availableDates = ref<DateOption[]>([]);
const timeSlots = ref<TimeSlot[]>([]);
const loading = ref(false);

// 页面加载
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = currentPage.options;

  if (options.id) {
    loadCoachDetail(parseInt(options.id));
  }

  generateAvailableDates();
});

// 加载教练详情
function loadCoachDetail(id: number) {
  loading.value = true;

  // 模拟数据，实际应该调用API
  setTimeout(() => {
    coach.value = {
      id: id,
      name: "李教练",
      avatar: "/static/coach-avatar1.png",
      gender: "male",
      utr: 8.5,
      experience: 8,
      rating: 4.9,
      reviewCount: 156,
      level: "professional",
      specialties: ["正手技术", "发球技术", "战术指导", "体能训练"],
      price: 300,
      introduction:
        "前职业网球运动员，拥有8年丰富的教学经验。曾获得多项国内外网球赛事冠军，擅长技术细节指导和战术分析。教学风格严谨细致，能够根据学员的不同水平制定个性化训练计划。",
      achievements: [
        "2018年全国网球锦标赛男单冠军",
        "2019年亚洲网球公开赛四强",
        "国家一级网球运动员",
        "中国网球协会认证教练员",
        "培养学员获得省级比赛冠军20余人次",
      ],
      videos: [
        {
          id: 1,
          title: "正手击球技术要领",
          cover: "/static/video-cover1.jpg",
          duration: "05:32",
          url: "/static/video1.mp4",
        },
        {
          id: 2,
          title: "发球技术详解",
          cover: "/static/video-cover2.jpg",
          duration: "08:15",
          url: "/static/video2.mp4",
        },
        {
          id: 3,
          title: "网前截击技巧",
          cover: "/static/video-cover3.jpg",
          duration: "06:48",
          url: "/static/video3.mp4",
        },
      ],
      reviews: [
        {
          id: 1,
          name: "张同学",
          avatar: "/static/student-avatar1.png",
          rating: 5,
          date: "2024-06-20",
          content:
            "李教练非常专业，技术指导很到位，我的正手技术有了明显提升。教学很有耐心，强烈推荐！",
        },
        {
          id: 2,
          name: "王同学",
          avatar: "/static/student-avatar2.png",
          rating: 5,
          date: "2024-06-18",
          content:
            "跟李教练学了3个月，从完全不会到现在能打比赛了。教练很负责，课后还会给练习建议。",
        },
        {
          id: 3,
          name: "刘同学",
          avatar: "/static/student-avatar3.png",
          rating: 4,
          date: "2024-06-15",
          content:
            "教练技术很好，讲解清晰。就是有时候要求比较严格，不过这样进步更快。",
        },
      ],
      phone: "138-0000-0000",
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
  const slots: TimeSlot[] = [];

  // 生成9:00-21:00的时间段
  for (let hour = 9; hour <= 21; hour++) {
    const time = `${hour.toString().padStart(2, "0")}:00`;
    slots.push({
      time,
      status: Math.random() > 0.3 ? "available" : "booked",
    });
  }

  timeSlots.value = slots;
}

// 选择日期
function selectDate(date: string) {
  selectedDate.value = date;
  selectedTimeSlot.value = null;
  generateTimeSlots(date);
}

// 选择时间段
function selectTimeSlot(slot: TimeSlot) {
  if (slot.status !== "available") {
    return;
  }

  selectedTimeSlot.value = slot;
}

// 获取水平等级文本
function getLevelText(level: string) {
  const levelMap = {
    beginner: "初级教练",
    intermediate: "中级教练",
    advanced: "高级教练",
    professional: "专业教练",
  };
  return levelMap[level] || "教练";
}

// 获取时间段状态文本
function getSlotStatusText(status: string) {
  const statusMap = {
    available: "可预约",
    booked: "已预约",
    unavailable: "不可用",
  };
  return statusMap[status] || "";
}

// 播放视频
function playVideo(video: Video) {
  // 这里可以集成视频播放器
  uni.showToast({
    title: `播放视频: ${video.title}`,
    icon: "none",
  });
}

// 预约课程
function bookLesson() {
  if (!selectedTimeSlot.value) {
    uni.showToast({
      title: "请选择上课时间",
      icon: "none",
    });
    return;
  }

  const bookingInfo = {
    coach: coach.value.name,
    date: selectedDate.value,
    time: selectedTimeSlot.value.time,
    price: coach.value.price,
  };

  uni.navigateTo({
    url: `/pages/lesson-confirm/lesson-confirm?data=${encodeURIComponent(
      JSON.stringify(bookingInfo)
    )}`,
  });
}

// 联系教练
function contactCoach() {
  uni.showActionSheet({
    itemList: ["拨打电话", "发送消息"],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.makePhoneCall({
          phoneNumber: coach.value.phone,
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
    url: `/pages/coach-reviews/coach-reviews?id=${coach.value.id}`,
  });
}
</script>

<style scoped>
.coach-header {
  margin-bottom: 20rpx;
  padding: 32rpx;
}

.coach-basic {
  display: flex;
  margin-bottom: 24rpx;
}

.coach-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  margin-right: 24rpx;
}

.coach-info {
  flex: 1;
}

.name-section {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.coach-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  margin-right: 12rpx;
}

.gender-badge {
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  font-size: 22rpx;
  color: #ffffff;
}

.gender-badge.male {
  background-color: #1890ff;
}

.gender-badge.female {
  background-color: #ff6b6b;
}

.coach-stats {
  display: flex;
  margin-bottom: 16rpx;
}

.stat-item {
  margin-right: 32rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666666;
  display: block;
}

.stat-value {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
  display: block;
}

.stat-value.utr {
  color: #07c160;
}

.stat-value.rating {
  color: #ffd700;
}

.coach-level {
  margin-bottom: 16rpx;
}

.level-badge {
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
  font-size: 24rpx;
  color: #ffffff;
}

.level-badge.beginner {
  background-color: #52c41a;
}

.level-badge.intermediate {
  background-color: #1890ff;
}

.level-badge.advanced {
  background-color: #fa8c16;
}

.level-badge.professional {
  background-color: #f5222d;
}

.price-section {
  display: flex;
  align-items: baseline;
  margin-top: 20rpx;
}

.price-label {
  font-size: 28rpx;
  color: #666666;
  margin-right: 16rpx;
}

.price-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #ff6b6b;
}

.coach-intro {
  margin-bottom: 20rpx;
  padding: 32rpx;
}

.intro-text {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 24rpx;
}

.achievements {
  border-top: 1rpx solid #f0f0f0;
  padding-top: 24rpx;
}

.achievements-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 16rpx;
  display: block;
}

.achievement-list {
  margin-top: 12rpx;
}

.achievement-item {
  font-size: 26rpx;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 8rpx;
  display: block;
}

.videos-section {
  margin-bottom: 20rpx;
  padding: 32rpx;
}

.videos-scroll {
  white-space: nowrap;
  margin-top: 20rpx;
}

.videos-list {
  display: flex;
  padding: 10rpx 0;
}

.video-item {
  margin-right: 20rpx;
  width: 200rpx;
}

.video-cover {
  position: relative;
  width: 200rpx;
  height: 120rpx;
  border-radius: 12rpx;
  overflow: hidden;
  margin-bottom: 12rpx;
}

.cover-image {
  width: 100%;
  height: 100%;
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48rpx;
  height: 48rpx;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-icon image {
  width: 24rpx;
  height: 24rpx;
}

.video-title {
  font-size: 26rpx;
  color: #333333;
  display: block;
  margin-bottom: 4rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-duration {
  font-size: 22rpx;
  color: #999999;
}

.schedule-section {
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

.slots-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.time-slot {
  border: 2rpx solid #f0f0f0;
  border-radius: 12rpx;
  padding: 20rpx 16rpx;
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
  font-size: 28rpx;
  color: #333333;
  font-weight: bold;
  display: block;
  margin-bottom: 6rpx;
}

.slot-status {
  font-size: 22rpx;
  color: #666666;
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

.review-summary {
  margin-bottom: 24rpx;
  padding: 24rpx;
  background-color: #f8f8f8;
  border-radius: 12rpx;
}

.rating-overview {
  display: flex;
  align-items: center;
}

.overall-rating {
  font-size: 48rpx;
  font-weight: bold;
  color: #ffd700;
  margin-right: 16rpx;
}

.rating-stars {
  margin-right: 16rpx;
}

.star {
  color: #ddd;
  font-size: 24rpx;
}

.star.filled {
  color: #ffd700;
}

.review-count {
  font-size: 26rpx;
  color: #666666;
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
