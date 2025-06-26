<template>
  <view class="page-container">
    <!-- 搜索和筛选 -->
    <view class="search-section">
      <view class="search-box">
        <input
          class="search-input"
          placeholder="搜索教练姓名"
          v-model="searchKeyword"
          @confirm="searchCoaches"
        />
        <button class="search-btn" @click="searchCoaches">搜索</button>
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

    <!-- 教练列表 -->
    <view class="coach-list" v-if="coachList.length > 0">
      <view
        class="coach-item card"
        v-for="coach in filteredCoaches"
        :key="coach.id"
        @click="goToCoachDetail(coach.id)"
      >
        <view class="coach-header">
          <image
            class="coach-avatar"
            :src="coach.avatar"
            mode="aspectFill"
          ></image>
          <view class="coach-basic">
            <view class="coach-name-row">
              <text class="coach-name">{{ coach.name }}</text>
              <view class="coach-gender" :class="coach.gender">
                {{ coach.gender === "male" ? "♂" : "♀" }}
              </view>
            </view>
            <view class="coach-level">
              <text class="level-text">{{ coach.level }}</text>
              <text class="experience-text">{{ coach.experience }}年经验</text>
            </view>
            <view class="coach-utr">
              <text class="utr-score">UTR {{ coach.utr }}</text>
            </view>
          </view>
          <view class="coach-price">
            <text class="price-text">¥{{ coach.price }}/小时</text>
          </view>
        </view>

        <view class="coach-specialties">
          <text class="specialty-label">擅长:</text>
          <view class="specialty-tags">
            <text
              class="tag"
              v-for="specialty in coach.specialties"
              :key="specialty"
            >
              {{ specialty }}
            </text>
          </view>
        </view>

        <view class="coach-intro" v-if="coach.introduction">
          <text class="intro-text">{{ coach.introduction }}</text>
        </view>

        <!-- 教学视频 -->
        <view
          class="coach-videos"
          v-if="coach.videos && coach.videos.length > 0"
        >
          <text class="video-label">教学视频:</text>
          <scroll-view class="video-scroll" scroll-x="true">
            <view class="video-list">
              <view
                class="video-item"
                v-for="video in coach.videos"
                :key="video.id"
                @click.stop="playVideo(video.url)"
              >
                <image
                  class="video-thumb"
                  :src="video.thumbnail"
                  mode="aspectFill"
                ></image>
                <view class="play-icon">▶</view>
                <text class="video-title">{{ video.title }}</text>
              </view>
            </view>
          </scroll-view>
        </view>

        <view class="coach-footer">
          <view class="coach-rating">
            <text class="rating-text">评分: {{ coach.rating }}</text>
            <text class="review-count">({{ coach.reviewCount }}条评价)</text>
          </view>
          <view class="coach-location">
            <text class="location-text">{{ coach.location }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else-if="!loading">
      <image
        class="empty-icon"
        src="/static/empty-coach.png"
        mode="aspectFit"
      ></image>
      <text class="empty-text">暂无教练信息</text>
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

interface Video {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
}

interface Coach {
  id: number;
  name: string;
  avatar: string;
  gender: "male" | "female";
  level: string;
  experience: number;
  utr: string;
  price: number;
  specialties: string[];
  introduction: string;
  videos?: Video[];
  rating: number;
  reviewCount: number;
  location: string;
  category: string[];
}

interface FilterOption {
  key: string;
  label: string;
}

// 响应式数据
const searchKeyword = ref("");
const coachList = ref<Coach[]>([]);
const selectedFilters = ref<string[]>([]);
const loading = ref(false);

// 筛选选项
const filterOptions = ref<FilterOption[]>([
  { key: "coach", label: "教练" },
  { key: "sparring", label: "陪练" },
  { key: "beginner", label: "初学者" },
  { key: "intermediate", label: "中级" },
  { key: "advanced", label: "高级" },
  { key: "male", label: "男教练" },
  { key: "female", label: "女教练" },
  { key: "nearby", label: "附近" },
  { key: "affordable", label: "价格优惠" },
]);

// 计算过滤后的教练列表
const filteredCoaches = computed(() => {
  let result = coachList.value;

  // 关键词搜索
  if (searchKeyword.value.trim()) {
    result = result.filter(
      (coach) =>
        coach.name.includes(searchKeyword.value) ||
        coach.specialties.some((s) => s.includes(searchKeyword.value))
    );
  }

  // 筛选条件
  if (selectedFilters.value.length > 0) {
    result = result.filter((coach) =>
      selectedFilters.value.some(
        (filter) =>
          coach.category.includes(filter) ||
          filter === coach.gender ||
          coach.specialties.some((s) => s.includes(filter))
      )
    );
  }

  return result;
});

// 页面加载
onMounted(() => {
  loadCoachList();
});

// 加载教练列表
function loadCoachList() {
  loading.value = true;

  // 模拟数据，实际应该调用API
  setTimeout(() => {
    coachList.value = [
      {
        id: 1,
        name: "白影",
        avatar: "/static/coach1.png",
        gender: "male",
        level: "专业教练",
        experience: 8,
        utr: "4.5",
        price: 200,
        specialties: ["正手技术", "反手技术", "发球技术"],
        introduction: "前职业球员，擅长技术指导和战术分析，有丰富的教学经验。",
        videos: [
          {
            id: 1,
            title: "正手击球技巧",
            url: "/static/video1.mp4",
            thumbnail: "/static/video1-thumb.jpg",
          },
          {
            id: 2,
            title: "发球动作要领",
            url: "/static/video2.mp4",
            thumbnail: "/static/video2-thumb.jpg",
          },
        ],
        rating: 4.8,
        reviewCount: 156,
        location: "西湖区",
        category: ["coach", "advanced", "male"],
      },
      {
        id: 2,
        name: "小罗",
        avatar: "/static/coach2.png",
        gender: "male",
        level: "高级教练",
        experience: 6,
        utr: "5.2",
        price: 180,
        specialties: ["底线技术", "网前技术", "体能训练"],
        introduction: "注重基础技术训练，善于因材施教，帮助学员快速提升。",
        videos: [
          {
            id: 3,
            title: "底线对拉技巧",
            url: "/static/video3.mp4",
            thumbnail: "/static/video3-thumb.jpg",
          },
        ],
        rating: 4.6,
        reviewCount: 89,
        location: "拱墅区",
        category: ["coach", "intermediate", "male"],
      },
      {
        id: 3,
        name: "陈小明",
        avatar: "/static/coach3.png",
        gender: "male",
        level: "陪练",
        experience: 3,
        utr: "3.8",
        price: 120,
        specialties: ["基础陪练", "多球训练"],
        introduction: "耐心细致，适合初学者和中级球员的陪练训练。",
        rating: 4.3,
        reviewCount: 45,
        location: "余杭区",
        category: ["sparring", "beginner", "male", "affordable"],
      },
      {
        id: 4,
        name: "李美娜",
        avatar: "/static/coach4.png",
        gender: "female",
        level: "专业教练",
        experience: 5,
        utr: "4.2",
        price: 160,
        specialties: ["女子网球", "青少年训练", "技术纠错"],
        introduction: "专注女子网球教学，擅长青少年技术培养和心理辅导。",
        videos: [
          {
            id: 4,
            title: "女子网球技巧",
            url: "/static/video4.mp4",
            thumbnail: "/static/video4-thumb.jpg",
          },
        ],
        rating: 4.7,
        reviewCount: 78,
        location: "西湖区",
        category: ["coach", "intermediate", "female"],
      },
      {
        id: 5,
        name: "王强",
        avatar: "/static/coach5.png",
        gender: "male",
        level: "高级陪练",
        experience: 4,
        utr: "4.0",
        price: 140,
        specialties: ["实战陪练", "比赛模拟"],
        introduction: "实战经验丰富，能够模拟各种比赛场景，提升实战能力。",
        rating: 4.4,
        reviewCount: 62,
        location: "江干区",
        category: ["sparring", "intermediate", "male"],
      },
    ];
    loading.value = false;
  }, 1000);
}

// 搜索教练
function searchCoaches() {
  // 搜索逻辑已在computed中处理
  console.log("搜索教练:", searchKeyword.value);
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

// 跳转到教练详情
function goToCoachDetail(id: number) {
  uni.navigateTo({
    url: `/pages/coach-detail/coach-detail?id=${id}`,
  });
}

// 播放视频
function playVideo(url: string) {
  uni.showToast({
    title: "播放视频功能开发中",
    icon: "none",
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

.coach-list {
  padding: 0 20rpx;
}

.coach-item {
  margin-bottom: 20rpx;
  padding: 24rpx;
}

.coach-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16rpx;
}

.coach-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 24rpx;
}

.coach-basic {
  flex: 1;
}

.coach-name-row {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.coach-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  margin-right: 12rpx;
}

.coach-gender {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  color: #ffffff;
}

.coach-gender.male {
  background-color: #4a90e2;
}

.coach-gender.female {
  background-color: #f5a623;
}

.coach-level {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.level-text {
  font-size: 28rpx;
  color: #07c160;
  margin-right: 16rpx;
}

.experience-text {
  font-size: 24rpx;
  color: #999999;
}

.coach-price {
  text-align: right;
}

.price-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff6b6b;
}

.coach-specialties {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.specialty-label {
  font-size: 28rpx;
  color: #666666;
  margin-right: 12rpx;
}

.specialty-tags {
  display: flex;
  flex-wrap: wrap;
}

.coach-intro {
  margin-bottom: 16rpx;
}

.intro-text {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.5;
}

.coach-videos {
  margin-bottom: 16rpx;
}

.video-label {
  font-size: 28rpx;
  color: #666666;
  margin-bottom: 12rpx;
  display: block;
}

.video-scroll {
  white-space: nowrap;
}

.video-list {
  display: flex;
}

.video-item {
  position: relative;
  margin-right: 16rpx;
  text-align: center;
}

.video-thumb {
  width: 160rpx;
  height: 120rpx;
  border-radius: 8rpx;
  display: block;
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48rpx;
  height: 48rpx;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 24rpx;
}

.video-title {
  font-size: 24rpx;
  color: #666666;
  margin-top: 8rpx;
  display: block;
  width: 160rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.coach-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.coach-rating {
  display: flex;
  align-items: center;
}

.rating-text {
  font-size: 28rpx;
  color: #ff6b6b;
  margin-right: 8rpx;
}

.review-count {
  font-size: 24rpx;
  color: #999999;
}

.location-text {
  font-size: 28rpx;
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
