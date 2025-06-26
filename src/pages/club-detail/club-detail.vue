<template>
  <view class="page-container">
    <!-- 俱乐部头部信息 -->
    <view class="club-header">
      <!-- 俱乐部封面图 -->
      <image
        class="club-cover"
        :src="club.coverImage"
        mode="aspectFill"
      ></image>

      <!-- 俱乐部基本信息 -->
      <view class="club-info card">
        <view class="club-basic">
          <image class="club-logo" :src="club.logo" mode="aspectFill"></image>
          <view class="club-details">
            <text class="club-name">{{ club.name }}</text>
            <view class="club-stats">
              <view class="stat-item">
                <text class="stat-number">{{ club.memberCount }}</text>
                <text class="stat-label">成员</text>
              </view>
              <view class="stat-item">
                <text class="stat-number">{{ club.activityCount }}</text>
                <text class="stat-label">活动</text>
              </view>
              <view class="stat-item">
                <text class="stat-number">{{ club.rating }}</text>
                <text class="stat-label">评分</text>
              </view>
            </view>
          </view>
        </view>

        <view class="club-tags">
          <text class="tag" v-for="tag in club.tags" :key="tag">{{ tag }}</text>
        </view>

        <view class="club-location">
          <image
            class="location-icon"
            src="/static/icons/status/icon-location.png"
            mode="aspectFit"
          ></image>
          <text class="location-text">{{ club.address }}</text>
          <button class="map-btn" @click="openMap">地图</button>
        </view>
      </view>
    </view>

    <!-- 功能导航 -->
    <view class="nav-section card">
      <view class="nav-list">
        <view
          class="nav-item"
          v-for="nav in navItems"
          :key="nav.key"
          @click="switchTab(nav.key)"
          :class="{ active: activeTab === nav.key }"
        >
          <text class="nav-text">{{ nav.label }}</text>
        </view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content-section">
      <!-- 俱乐部介绍 -->
      <view class="intro-section card" v-if="activeTab === 'intro'">
        <view class="section-title">俱乐部介绍</view>
        <text class="intro-text">{{ club.introduction }}</text>

        <view class="facilities" v-if="club.facilities.length > 0">
          <text class="facilities-title">俱乐部设施</text>
          <view class="facilities-grid">
            <view
              class="facility-item"
              v-for="facility in club.facilities"
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

        <view class="contact-info">
          <text class="contact-title">联系方式</text>
          <view class="contact-item">
            <image
              class="contact-icon"
              src="/static/icons/action/icon-phone.png"
              mode="aspectFit"
            ></image>
            <text class="contact-text">{{ club.phone }}</text>
          </view>
          <view class="contact-item" v-if="club.email">
            <image
              class="contact-icon"
              src="/static/icons/action/icon-email.png"
              mode="aspectFit"
            ></image>
            <text class="contact-text">{{ club.email }}</text>
          </view>
        </view>
      </view>

      <!-- 俱乐部活动 -->
      <view class="activities-section" v-if="activeTab === 'activities'">
        <view class="activity-list">
          <view
            class="activity-item card"
            v-for="activity in club.activities"
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
                <image
                  class="info-icon"
                  src="/static/icons/status/icon-time.png"
                  mode="aspectFit"
                ></image>
                <text class="info-text">{{ activity.time }}</text>
              </view>
              <view class="info-item">
                <image
                  class="info-icon"
                  src="/static/icon-location.png"
                  mode="aspectFit"
                ></image>
                <text class="info-text">{{ activity.location }}</text>
              </view>
              <view class="info-item">
                <image
                  class="info-icon"
                  src="/static/icons/status/icon-utr.png"
                  mode="aspectFit"
                ></image>
                <text class="info-text">UTR {{ activity.utrRange }}</text>
              </view>
            </view>

            <view class="activity-footer">
              <text class="participants-text"
                >{{ activity.participants }}/{{
                  activity.maxParticipants
                }}人</text
              >
              <text class="price-text">¥{{ activity.price }}</text>
            </view>
          </view>
        </view>

        <view class="empty-state" v-if="club.activities.length === 0">
          <image
            class="empty-icon"
            src="/static/placeholders/empty-activity.png"
            mode="aspectFit"
          ></image>
          <text class="empty-text">暂无活动</text>
        </view>
      </view>

      <!-- 俱乐部成员 -->
      <view class="members-section" v-if="activeTab === 'members'">
        <view class="member-list">
          <view
            class="member-item"
            v-for="member in club.members"
            :key="member.id"
          >
            <image
              class="member-avatar"
              :src="member.avatar"
              mode="aspectFill"
            ></image>
            <view class="member-info">
              <text class="member-name">{{ member.name }}</text>
              <text class="member-role">{{ member.role }}</text>
              <text class="member-utr">UTR {{ member.utr }}</text>
            </view>
            <view class="member-level" :class="member.level">
              {{ getLevelText(member.level) }}
            </view>
          </view>
        </view>
      </view>

      <!-- 俱乐部相册 -->
      <view class="photos-section" v-if="activeTab === 'photos'">
        <view class="photos-grid">
          <view
            class="photo-item"
            v-for="(photo, index) in club.photos"
            :key="index"
            @click="previewPhoto(index)"
          >
            <image class="photo-image" :src="photo" mode="aspectFill"></image>
          </view>
        </view>

        <view class="empty-state" v-if="club.photos.length === 0">
          <image
            class="empty-icon"
            src="/static/placeholders/empty-photo.png"
            mode="aspectFit"
          ></image>
          <text class="empty-text">暂无照片</text>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-actions">
      <button class="contact-btn" @click="contactClub">联系俱乐部</button>
      <button class="join-btn" @click="joinClub" :class="{ joined: isJoined }">
        {{ isJoined ? "已加入" : "加入俱乐部" }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Club {
  id: number;
  name: string;
  logo: string;
  coverImage: string;
  address: string;
  memberCount: number;
  activityCount: number;
  rating: number;
  tags: string[];
  introduction: string;
  facilities: Facility[];
  phone: string;
  email?: string;
  activities: Activity[];
  members: Member[];
  photos: string[];
  latitude: number;
  longitude: number;
}

interface Facility {
  name: string;
  icon: string;
}

interface Activity {
  id: number;
  title: string;
  time: string;
  location: string;
  utrRange: string;
  participants: number;
  maxParticipants: number;
  price: number;
  status: "open" | "full" | "closed";
}

interface Member {
  id: number;
  name: string;
  avatar: string;
  role: string;
  utr: number;
  level: "beginner" | "intermediate" | "advanced";
}

interface NavItem {
  key: string;
  label: string;
}

// 响应式数据
const club = ref<Club>({
  id: 0,
  name: "",
  logo: "",
  coverImage: "",
  address: "",
  memberCount: 0,
  activityCount: 0,
  rating: 0,
  tags: [],
  introduction: "",
  facilities: [],
  phone: "",
  activities: [],
  members: [],
  photos: [],
  latitude: 0,
  longitude: 0,
});

const activeTab = ref("intro");
const isJoined = ref(false);
const loading = ref(false);

// 导航项
const navItems = ref<NavItem[]>([
  { key: "intro", label: "介绍" },
  { key: "activities", label: "活动" },
  { key: "members", label: "成员" },
  { key: "photos", label: "相册" },
]);

// 页面加载
onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = currentPage.options;

  if (options.id) {
    loadClubDetail(parseInt(options.id));
  }
});

// 加载俱乐部详情
function loadClubDetail(id: number) {
  loading.value = true;

  // 模拟数据，实际应该调用API
  setTimeout(() => {
    club.value = {
      id: id,
      name: "杭州网球俱乐部",
      logo: "/static/images/clubs/club-logo1.png",
      coverImage: "/static/images/clubs/club-cover1.jpg",
      address: "杭州市西湖区文三路123号",
      memberCount: 156,
      activityCount: 28,
      rating: 4.8,
      tags: ["专业训练", "比赛组织", "社交活动", "设施完善"],
      introduction:
        "杭州网球俱乐部成立于2015年，是杭州地区最具影响力的网球俱乐部之一。俱乐部拥有8片标准网球场地，包括4片硬地场和4片红土场，配备专业的灯光系统和完善的配套设施。我们致力于为网球爱好者提供专业的训练指导、丰富的比赛活动和良好的社交平台。",
      facilities: [
        {
          name: "硬地场",
          icon: "/static/images/venues/facility-hardcourt.png",
        },
        {
          name: "红土场",
          icon: "/static/images/venues/facility-claycourt.png",
        },
        { name: "更衣室", icon: "/static/icons/status/facility-locker.png" },
        { name: "淋浴间", icon: "/static/icons/status/facility-shower.png" },
        { name: "休息区", icon: "/static/icons/status/facility-rest.png" },
        { name: "停车场", icon: "/static/icons/status/facility-parking.png" },
        { name: "商店", icon: "/static/icons/status/facility-shop.png" },
        { name: "餐厅", icon: "/static/icons/status/facility-restaurant.png" },
      ],
      phone: "0571-88888888",
      email: "info@hztennisclub.com",
      activities: [
        {
          id: 1,
          title: "UTR网球积分赛3.0",
          time: "06月26日 周四 09:30",
          location: "俱乐部1号场地",
          utrRange: "2-4",
          participants: 5,
          maxParticipants: 8,
          price: 120,
          status: "open",
        },
        {
          id: 2,
          title: "周末双打友谊赛",
          time: "06月29日 周日 14:00",
          location: "俱乐部2-3号场地",
          utrRange: "3-6",
          participants: 12,
          maxParticipants: 16,
          price: 80,
          status: "open",
        },
        {
          id: 3,
          title: "青少年网球训练营",
          time: "07月01日 周二 16:00",
          location: "俱乐部4号场地",
          utrRange: "1-3",
          participants: 8,
          maxParticipants: 8,
          price: 150,
          status: "full",
        },
      ],
      members: [
        {
          id: 1,
          name: "张会长",
          avatar: "/static/images/avatars/member-avatar1.png",
          role: "俱乐部会长",
          utr: 7.2,
          level: "advanced",
        },
        {
          id: 2,
          name: "李教练",
          avatar: "/static/images/avatars/member-avatar2.png",
          role: "主教练",
          utr: 8.5,
          level: "advanced",
        },
        {
          id: 3,
          name: "王秘书",
          avatar: "/static/images/avatars/member-avatar3.png",
          role: "秘书长",
          utr: 5.8,
          level: "intermediate",
        },
        {
          id: 4,
          name: "刘同学",
          avatar: "/static/images/avatars/member-avatar4.png",
          role: "普通会员",
          utr: 3.2,
          level: "intermediate",
        },
        {
          id: 5,
          name: "陈同学",
          avatar: "/static/images/avatars/member-avatar5.png",
          role: "普通会员",
          utr: 2.5,
          level: "beginner",
        },
      ],
      photos: [
        "/static/images/clubs/club-photo1.jpg",
        "/static/images/clubs/club-photo2.jpg",
        "/static/images/clubs/club-photo3.jpg",
        "/static/images/clubs/club-photo4.jpg",
        "/static/images/clubs/club-photo5.jpg",
        "/static/images/clubs/club-photo6.jpg",
        "/static/images/clubs/club-photo7.jpg",
        "/static/images/clubs/club-photo8.jpg",
      ],
      latitude: 30.2741,
      longitude: 120.1551,
    };

    // 检查用户是否已加入俱乐部
    isJoined.value = Math.random() > 0.5;

    loading.value = false;
  }, 1000);
}

// 切换标签页
function switchTab(tab: string) {
  activeTab.value = tab;
}

// 获取活动状态文本
function getActivityStatusText(status: string) {
  const statusMap = {
    open: "报名中",
    full: "已满员",
    closed: "已结束",
  };
  return statusMap[status] || "未知状态";
}

// 获取水平等级文本
function getLevelText(level: string) {
  const levelMap = {
    beginner: "初级",
    intermediate: "中级",
    advanced: "高级",
  };
  return levelMap[level] || "未知";
}

// 跳转到活动详情
function goToActivityDetail(id: number) {
  uni.navigateTo({
    url: `/pages/activity-detail/activity-detail?id=${id}`,
  });
}

// 预览照片
function previewPhoto(index: number) {
  uni.previewImage({
    urls: club.value.photos,
    current: index,
  });
}

// 打开地图
function openMap() {
  uni.openLocation({
    latitude: club.value.latitude,
    longitude: club.value.longitude,
    name: club.value.name,
    address: club.value.address,
  });
}

// 加入俱乐部
function joinClub() {
  if (isJoined.value) {
    uni.showModal({
      title: "确认退出",
      content: `确认退出「${club.value.name}」？`,
      success: (res) => {
        if (res.confirm) {
          isJoined.value = false;
          club.value.memberCount--;
          uni.showToast({
            title: "已退出俱乐部",
            icon: "success",
          });
        }
      },
    });
  } else {
    uni.showModal({
      title: "确认加入",
      content: `确认加入「${club.value.name}」？`,
      success: (res) => {
        if (res.confirm) {
          isJoined.value = true;
          club.value.memberCount++;
          uni.showToast({
            title: "加入成功",
            icon: "success",
          });
        }
      },
    });
  }
}

// 联系俱乐部
function contactClub() {
  uni.showActionSheet({
    itemList: ["拨打电话", "发送邮件", "发送消息"],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.makePhoneCall({
          phoneNumber: club.value.phone,
        });
      } else if (res.tapIndex === 1 && club.value.email) {
        // 发送邮件（实际应用中可能需要调用邮件应用）
        uni.showToast({
          title: `邮箱: ${club.value.email}`,
          icon: "none",
          duration: 3000,
        });
      } else if (res.tapIndex === 2) {
        uni.navigateTo({
          url: "/pages/customer-service/customer-service",
        });
      }
    },
  });
}
</script>

<style scoped>
.club-header {
  position: relative;
  margin-bottom: 20rpx;
}

.club-cover {
  width: 100%;
  height: 300rpx;
}

.club-info {
  margin: -60rpx 20rpx 0;
  padding: 32rpx;
  position: relative;
  z-index: 10;
}

.club-basic {
  display: flex;
  margin-bottom: 24rpx;
}

.club-logo {
  width: 100rpx;
  height: 100rpx;
  border-radius: 16rpx;
  margin-right: 24rpx;
  border: 4rpx solid #ffffff;
}

.club-details {
  flex: 1;
}

.club-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 16rpx;
}

.club-stats {
  display: flex;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 40rpx;
}

.stat-number {
  font-size: 32rpx;
  font-weight: bold;
  color: #07c160;
}

.stat-label {
  font-size: 24rpx;
  color: #666666;
  margin-top: 4rpx;
}

.club-location {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
}

.location-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 12rpx;
}

.location-text {
  font-size: 28rpx;
  color: #666666;
  flex: 1;
}

.map-btn {
  background-color: #07c160;
  color: #ffffff;
  border-radius: 20rpx;
  padding: 8rpx 20rpx;
  font-size: 24rpx;
  border: none;
}

.nav-section {
  margin-bottom: 20rpx;
  padding: 0;
}

.nav-list {
  display: flex;
  border-bottom: 1rpx solid #f0f0f0;
}

.nav-item {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  position: relative;
}

.nav-item.active {
  color: #07c160;
}

.nav-item.active::after {
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

.nav-text {
  font-size: 30rpx;
  color: #333333;
}

.nav-item.active .nav-text {
  color: #07c160;
  font-weight: bold;
}

.content-section {
  margin-bottom: 120rpx;
}

.intro-section {
  padding: 32rpx;
}

.intro-text {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 32rpx;
}

.facilities {
  margin-bottom: 32rpx;
  padding-top: 32rpx;
  border-top: 1rpx solid #f0f0f0;
}

.facilities-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 20rpx;
  display: block;
}

.facilities-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24rpx;
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

.contact-info {
  padding-top: 32rpx;
  border-top: 1rpx solid #f0f0f0;
}

.contact-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 20rpx;
  display: block;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.contact-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 12rpx;
}

.contact-text {
  font-size: 28rpx;
  color: #666666;
}

.activities-section {
  padding: 0 20rpx;
}

.activity-list {
  margin-top: 20rpx;
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
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
  flex: 1;
  margin-right: 16rpx;
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

.activity-info {
  margin-bottom: 16rpx;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.info-icon {
  width: 28rpx;
  height: 28rpx;
  margin-right: 12rpx;
}

.info-text {
  font-size: 26rpx;
  color: #666666;
}

.activity-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.participants-text {
  font-size: 26rpx;
  color: #666666;
}

.price-text {
  font-size: 28rpx;
  font-weight: bold;
  color: #ff6b6b;
}

.members-section {
  padding: 20rpx;
}

.member-list {
  margin-top: 20rpx;
}

.member-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
}

.member-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  margin-right: 20rpx;
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 30rpx;
  color: #333333;
  font-weight: bold;
  display: block;
  margin-bottom: 6rpx;
}

.member-role {
  font-size: 26rpx;
  color: #666666;
  display: block;
  margin-bottom: 4rpx;
}

.member-utr {
  font-size: 24rpx;
  color: #07c160;
}

.member-level {
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
  font-size: 22rpx;
  color: #ffffff;
}

.member-level.beginner {
  background-color: #52c41a;
}

.member-level.intermediate {
  background-color: #1890ff;
}

.member-level.advanced {
  background-color: #f5222d;
}

.photos-section {
  padding: 20rpx;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8rpx;
  margin-top: 20rpx;
}

.photo-item {
  aspect-ratio: 1;
  border-radius: 8rpx;
  overflow: hidden;
}

.photo-image {
  width: 100%;
  height: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
}

.empty-icon {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 24rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 28rpx;
  color: #999999;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 20rpx;
  border-top: 1rpx solid #f0f0f0;
  display: flex;
  gap: 20rpx;
  z-index: 100;
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

.join-btn {
  flex: 2;
  background-color: #07c160;
  color: #ffffff;
  border-radius: 32rpx;
  padding: 20rpx;
  font-size: 30rpx;
  font-weight: bold;
  border: none;
}

.join-btn.joined {
  background-color: #cccccc;
  color: #666666;
}
</style>
