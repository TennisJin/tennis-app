// 图标配置文件
// 统一管理所有图标路径，便于维护和主题切换

export const ICONS = {
  // 底部导航图标
  TAB: {
    HOME: "/static/icons/tab/tab-home.png",
    HOME_ACTIVE: "/static/icons/tab/tab-home-current.png",
    CLUBS: "/static/icons/tab/tab-clubs.png",
    CLUBS_ACTIVE: "/static/icons/tab/tab-clubs-current.png",
    PROFILE: "/static/icons/tab/tab-profile.png",
    PROFILE_ACTIVE: "/static/icons/tab/tab-profile-current.png",
  },

  // 功能图标
  ACTION: {
    BOOKING: "/static/icons/action/icon-booking.png",
    COACH: "/static/icons/action/icon-coach.png",
    ACTIVITY: "/static/icons/action/icon-activity.svg",
    CLUB: "/static/icons/action/icon-club.svg",
    HELP: "/static/icons/action/icon-help.svg",
    MATCH: "/static/icons/action/icon-match.svg",
    ORDER: "/static/icons/action/icon-order.svg",
    WALLET: "/static/icons/action/icon-wallet.svg",
  },

  // 状态图标（预留）
  STATUS: {
    // 可以添加成功、失败、警告等状态图标
  },
} as const;

// 图片资源路径
export const IMAGES = {
  // 头像
  AVATARS: {
    DEFAULT: "/static/images/avatars/default-avatar.png",
    COACH_AVATAR: "/static/images/avatars/coach-avatar1.png",
  },

  // 教练图片
  COACHES: {
    COACH1: "/static/images/coaches/coach1.jpg",
    COACH2: "/static/images/coaches/coach2.jpg",
    COACH3: "/static/images/coaches/coach3.jpg",
    COACH4: "/static/images/coaches/coach4.jpg",
    COACH5: "/static/images/coaches/coach5.jpg",
  },

  // 场馆图片
  VENUES: {
    VENUE1: "/static/images/venues/venue1.jpg",
    VENUE2: "/static/images/venues/venue2.jpg",
    VENUE3: "/static/images/venues/venue3.jpg",
    VENUE4: "/static/images/venues/venue4.jpg",
    VENUE5: "/static/images/venues/venue5.jpg",
    CLUB1: "/static/images/venues/club1.png",
    CLUB2: "/static/images/venues/club2.png",
    CLUB3: "/static/images/venues/club3.png",
    CLUB4: "/static/images/venues/club4.png",
    CLUB5: "/static/images/venues/club5.png",
    CLUB6: "/static/images/venues/club6.png",
    FACILITY_CLAY: "/static/images/venues/facility-claycourt.png",
    FACILITY_HARD: "/static/images/venues/facility-hardcourt.png",
    FACILITY_COACH: "/static/images/venues/facility-coach.png",
  },

  // 占位图片
  PLACEHOLDERS: {
    EMPTY_COACH: "/static/placeholders/empty-coach.png",
    EMPTY_VENUE: "/static/placeholders/empty-venue.png",
  },
} as const;

// 类型定义
export type IconType = keyof typeof ICONS;
export type ImageType = keyof typeof IMAGES;
