if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const ON_SHOW = "onShow";
  const ON_HIDE = "onHide";
  const ON_LAUNCH = "onLaunch";
  const ON_LOAD = "onLoad";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const createHook = (lifecycle) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onShow = /* @__PURE__ */ createHook(ON_SHOW);
  const onHide = /* @__PURE__ */ createHook(ON_HIDE);
  const onLaunch = /* @__PURE__ */ createHook(ON_LAUNCH);
  const onLoad = /* @__PURE__ */ createHook(ON_LOAD);
  const _sfc_main$f = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props) {
      const searchKeyword = vue.ref("");
      const coachList = vue.ref([]);
      const activityList = vue.ref([]);
      vue.onMounted(() => {
        loadCoachList();
        loadActivityList();
      });
      function searchVenues() {
        if (!searchKeyword.value.trim()) {
          uni.showToast({
            title: "请输入场馆名称",
            icon: "none"
          });
          return;
        }
        uni.navigateTo({
          url: `/pages/booking/booking?keyword=${encodeURIComponent(searchKeyword.value)}`
        });
      }
      function loadCoachList() {
        coachList.value = [
          {
            id: 1,
            name: "白影",
            avatar: "/static/coach1.jpg",
            level: "教练",
            specialty: "陪练",
            utr: "4.5"
          },
          {
            id: 2,
            name: "罗学云",
            avatar: "/static/coach2.jpg",
            level: "教练",
            specialty: "陪练",
            utr: "5.2"
          },
          {
            id: 3,
            name: "陈小明",
            avatar: "/static/coach3.jpg",
            level: "陪练",
            specialty: "基础",
            utr: "3.8"
          }
        ];
      }
      function loadActivityList() {
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
            status: "open"
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
            status: "open"
          }
        ];
      }
      function getActivityStatusText(status) {
        const statusMap = {
          "open": "报名中",
          "full": "已满员",
          "closed": "已结束",
          "cancelled": "已取消"
        };
        return statusMap[status] || "未知状态";
      }
      function goToBooking() {
        formatAppLog("log", "at pages/index/index.vue:211", "跳转到订场页面");
        uni.navigateTo({
          url: "/pages/booking/booking",
          success: () => {
            formatAppLog("log", "at pages/index/index.vue:215", "跳转成功");
          },
          fail: (err) => {
            formatAppLog("error", "at pages/index/index.vue:218", "跳转失败:", err);
          }
        });
      }
      function goToCoaches() {
        formatAppLog("log", "at pages/index/index.vue:224", "跳转到教练页面");
        uni.navigateTo({
          url: "/pages/coaches/coaches",
          success: () => {
            formatAppLog("log", "at pages/index/index.vue:228", "跳转成功");
          },
          fail: (err) => {
            formatAppLog("error", "at pages/index/index.vue:231", "跳转失败:", err);
          }
        });
      }
      function goToActivities() {
        formatAppLog("log", "at pages/index/index.vue:237", "跳转到活动页面");
        uni.navigateTo({
          url: "/pages/activities/activities",
          success: () => {
            formatAppLog("log", "at pages/index/index.vue:241", "跳转成功");
          },
          fail: (err) => {
            formatAppLog("error", "at pages/index/index.vue:244", "跳转失败:", err);
          }
        });
      }
      function goToClubs() {
        formatAppLog("log", "at pages/index/index.vue:250", "跳转到俱乐部页面");
        uni.switchTab({
          url: "/pages/clubs/clubs",
          success: () => {
            formatAppLog("log", "at pages/index/index.vue:254", "跳转成功");
          },
          fail: (err) => {
            formatAppLog("error", "at pages/index/index.vue:257", "跳转失败:", err);
          }
        });
      }
      function goToCoachDetail(id) {
        formatAppLog("log", "at pages/index/index.vue:263", "跳转到教练详情页面:", id);
        uni.navigateTo({
          url: `/pages/coach-detail/coach-detail?id=${id}`,
          success: () => {
            formatAppLog("log", "at pages/index/index.vue:267", "跳转成功");
          },
          fail: (err) => {
            formatAppLog("error", "at pages/index/index.vue:270", "跳转失败:", err);
          }
        });
      }
      function goToActivityDetail(id) {
        formatAppLog("log", "at pages/index/index.vue:276", "跳转到活动详情页面:", id);
        uni.navigateTo({
          url: `/pages/activity-detail/activity-detail?id=${id}`,
          success: () => {
            formatAppLog("log", "at pages/index/index.vue:280", "跳转成功");
          },
          fail: (err) => {
            formatAppLog("error", "at pages/index/index.vue:283", "跳转失败:", err);
          }
        });
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "page-container" }, [
          vue.createCommentVNode(" 搜索订场区域 "),
          vue.createElementVNode("view", { class: "search-section" }, [
            vue.createElementVNode("view", { class: "search-box" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "search-input",
                  placeholder: "搜索场馆名称",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchKeyword.value = $event),
                  onConfirm: searchVenues
                },
                null,
                544
                /* HYDRATE_EVENTS, NEED_PATCH */
              ), [
                [vue.vModelText, searchKeyword.value]
              ]),
              vue.createElementVNode("button", {
                class: "search-btn",
                onClick: searchVenues
              }, "搜索场馆")
            ])
          ]),
          vue.createCommentVNode(" 快捷功能区 "),
          vue.createElementVNode("view", { class: "quick-actions" }, [
            vue.createElementVNode("view", {
              class: "action-item",
              onClick: goToBooking
            }, [
              vue.createElementVNode("image", {
                class: "action-icon",
                src: "/static/icon-booking.png",
                mode: "aspectFit"
              }),
              vue.createElementVNode("text", { class: "action-text" }, "订场")
            ]),
            vue.createElementVNode("view", {
              class: "action-item",
              onClick: goToCoaches
            }, [
              vue.createElementVNode("image", {
                class: "action-icon",
                src: "/static/icon-coach.png",
                mode: "aspectFit"
              }),
              vue.createElementVNode("text", { class: "action-text" }, "找教练")
            ]),
            vue.createElementVNode("view", {
              class: "action-item",
              onClick: goToActivities
            }, [
              vue.createElementVNode("image", {
                class: "action-icon",
                src: "/static/icon-activity.png",
                mode: "aspectFit"
              }),
              vue.createElementVNode("text", { class: "action-text" }, "UTR活动")
            ]),
            vue.createElementVNode("view", {
              class: "action-item",
              onClick: goToClubs
            }, [
              vue.createElementVNode("image", {
                class: "action-icon",
                src: "/static/icon-club.png",
                mode: "aspectFit"
              }),
              vue.createElementVNode("text", { class: "action-text" }, "俱乐部")
            ])
          ]),
          vue.createCommentVNode(" 教练和陪练推荐 "),
          vue.createElementVNode("view", { class: "section" }, [
            vue.createElementVNode("view", { class: "section-header" }, [
              vue.createElementVNode("text", { class: "section-title" }, "网球教练与陪练"),
              vue.createElementVNode("text", {
                class: "more-btn",
                onClick: goToCoaches
              }, "更多 >")
            ]),
            vue.createElementVNode("scroll-view", {
              class: "coach-scroll",
              "scroll-x": "true"
            }, [
              vue.createElementVNode("view", { class: "coach-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(coachList.value, (coach) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "coach-item",
                      key: coach.id,
                      onClick: ($event) => goToCoachDetail(coach.id)
                    }, [
                      vue.createElementVNode("image", {
                        class: "coach-avatar",
                        src: coach.avatar,
                        mode: "aspectFill"
                      }, null, 8, ["src"]),
                      vue.createElementVNode("view", { class: "coach-info" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "coach-name" },
                          vue.toDisplayString(coach.name),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("view", { class: "coach-tags" }, [
                          vue.createElementVNode(
                            "text",
                            { class: "tag" },
                            vue.toDisplayString(coach.level),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "text",
                            { class: "tag" },
                            vue.toDisplayString(coach.specialty),
                            1
                            /* TEXT */
                          )
                        ]),
                        vue.createElementVNode("view", { class: "coach-utr" }, [
                          vue.createElementVNode(
                            "text",
                            { class: "utr-score" },
                            "UTR " + vue.toDisplayString(coach.utr),
                            1
                            /* TEXT */
                          )
                        ])
                      ])
                    ], 8, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])
          ]),
          vue.createCommentVNode(" UTR活动展示 "),
          vue.createElementVNode("view", { class: "section" }, [
            vue.createElementVNode("view", { class: "section-header" }, [
              vue.createElementVNode("text", { class: "section-title" }, "UTR活动"),
              vue.createElementVNode("text", {
                class: "more-btn",
                onClick: goToActivities
              }, "更多 >")
            ]),
            vue.createElementVNode("view", { class: "activity-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(activityList.value, (activity) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "activity-item card",
                    key: activity.id,
                    onClick: ($event) => goToActivityDetail(activity.id)
                  }, [
                    vue.createElementVNode("view", { class: "activity-header" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "activity-title" },
                        vue.toDisplayString(activity.title),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "view",
                        {
                          class: vue.normalizeClass(["activity-status", activity.status])
                        },
                        vue.toDisplayString(getActivityStatusText(activity.status)),
                        3
                        /* TEXT, CLASS */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "activity-info" }, [
                      vue.createElementVNode("view", { class: "info-item" }, [
                        vue.createElementVNode("text", { class: "info-label" }, "时间:"),
                        vue.createElementVNode(
                          "text",
                          { class: "info-value" },
                          vue.toDisplayString(activity.time),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "info-item" }, [
                        vue.createElementVNode("text", { class: "info-label" }, "地点:"),
                        vue.createElementVNode(
                          "text",
                          { class: "info-value" },
                          vue.toDisplayString(activity.location),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "info-item" }, [
                        vue.createElementVNode("text", { class: "info-label" }, "要求:"),
                        vue.createElementVNode(
                          "text",
                          { class: "info-value" },
                          "UTR " + vue.toDisplayString(activity.utrRange),
                          1
                          /* TEXT */
                        )
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "activity-footer" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "participants" },
                        "已报名 " + vue.toDisplayString(activity.participants) + "/" + vue.toDisplayString(activity.maxParticipants),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "price" },
                        "¥" + vue.toDisplayString(activity.price),
                        1
                        /* TEXT */
                      )
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ]);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-83a5a03c"], ["__file", "/Users/private/Documents/code/vue/tennis-app/src/pages/index/index.vue"]]);
  const _sfc_main$e = /* @__PURE__ */ vue.defineComponent({
    __name: "booking",
    setup(__props) {
      const searchKeyword = vue.ref("");
      const venueList = vue.ref([]);
      const selectedFilters = vue.ref([]);
      const loading = vue.ref(false);
      const filterOptions = vue.ref([
        { key: "indoor", label: "室内" },
        { key: "outdoor", label: "室外" },
        { key: "hard", label: "硬地" },
        { key: "clay", label: "红土" },
        { key: "grass", label: "草地" },
        { key: "nearby", label: "附近" },
        { key: "cheap", label: "价格优惠" }
      ]);
      const filteredVenues = vue.computed(() => {
        if (selectedFilters.value.length === 0) {
          return venueList.value;
        }
        return venueList.value.filter((venue) => {
          return selectedFilters.value.some(
            (filter) => venue.category.includes(filter) || venue.tags.some((tag) => tag.includes(filter))
          );
        });
      });
      vue.onMounted(() => {
        loadVenueList();
      });
      onLoad((options) => {
        if (options.keyword) {
          searchKeyword.value = decodeURIComponent(options.keyword);
          searchVenues();
        }
      });
      function loadVenueList() {
        loading.value = true;
        setTimeout(() => {
          venueList.value = [
            {
              id: 1,
              name: "黄龙体育中心",
              image: "/static/venue1.jpg",
              address: "西湖区 黄龙 室内 硬地",
              courtType: "室内硬地",
              priceRange: "120-200/小时",
              rating: 4.8,
              tags: ["室内", "硬地", "专业"],
              distance: "2.8km",
              category: ["indoor", "hard"]
            },
            {
              id: 2,
              name: "GS网球俱乐部（浙报店）",
              image: "/static/venue2.jpg",
              address: "拱墅区 浙报印务 室内 硬地",
              courtType: "室内硬地",
              priceRange: "100-150/小时",
              rating: 4.5,
              tags: ["室内", "硬地"],
              distance: "5.1km",
              category: ["indoor", "hard"]
            },
            {
              id: 3,
              name: "城北体育公园-网球中心",
              image: "/static/venue3.jpg",
              address: "拱墅区 室内 硬地",
              courtType: "室内硬地",
              priceRange: "80-120/小时",
              rating: 4.3,
              tags: ["室内", "硬地", "价格优惠"],
              distance: "5.1km",
              category: ["indoor", "hard", "cheap"]
            },
            {
              id: 4,
              name: "西湖网球俱乐部",
              image: "/static/venue4.jpg",
              address: "余杭区 西湖 室外 硬地",
              courtType: "室外硬地",
              priceRange: "60-100/小时",
              rating: 4.2,
              tags: ["室外", "硬地", "风景好"],
              distance: "6.2km",
              category: ["outdoor", "hard"]
            },
            {
              id: 5,
              name: "平击网球俱乐部",
              image: "/static/venue5.jpg",
              address: "余杭区 五常 室内 硬地",
              courtType: "室内硬地",
              priceRange: "90-140/小时",
              rating: 4.6,
              tags: ["室内", "硬地"],
              distance: "9.8km",
              category: ["indoor", "hard"]
            }
          ];
          loading.value = false;
        }, 1e3);
      }
      function searchVenues() {
        if (!searchKeyword.value.trim()) {
          loadVenueList();
          return;
        }
        loading.value = true;
        setTimeout(() => {
          venueList.value = venueList.value.filter(
            (venue) => venue.name.includes(searchKeyword.value) || venue.address.includes(searchKeyword.value)
          );
          loading.value = false;
        }, 500);
      }
      function toggleFilter(filterKey) {
        const index = selectedFilters.value.indexOf(filterKey);
        if (index > -1) {
          selectedFilters.value.splice(index, 1);
        } else {
          selectedFilters.value.push(filterKey);
        }
      }
      function goToVenueDetail(id) {
        uni.showToast({
          title: "跳转到场馆详情",
          icon: "none"
        });
      }
      function quickBook(id) {
        uni.showModal({
          title: "预订确认",
          content: "是否立即预订该场馆？",
          success: (res) => {
            if (res.confirm) {
              uni.showToast({
                title: "预订成功",
                icon: "success"
              });
            }
          }
        });
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "page-container" }, [
          vue.createCommentVNode(" 搜索区域 "),
          vue.createElementVNode("view", { class: "search-section" }, [
            vue.createElementVNode("view", { class: "search-box" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "search-input",
                  placeholder: "搜索场馆名称",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchKeyword.value = $event),
                  onConfirm: searchVenues
                },
                null,
                544
                /* HYDRATE_EVENTS, NEED_PATCH */
              ), [
                [vue.vModelText, searchKeyword.value]
              ]),
              vue.createElementVNode("button", {
                class: "search-btn",
                onClick: searchVenues
              }, "搜索")
            ]),
            vue.createCommentVNode(" 筛选条件 "),
            vue.createElementVNode("view", { class: "filter-section" }, [
              vue.createElementVNode("scroll-view", {
                class: "filter-scroll",
                "scroll-x": "true"
              }, [
                vue.createElementVNode("view", { class: "filter-list" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(filterOptions.value, (filter) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: vue.normalizeClass(["filter-item", { active: selectedFilters.value.includes(filter.key) }]),
                        key: filter.key,
                        onClick: ($event) => toggleFilter(filter.key)
                      }, vue.toDisplayString(filter.label), 11, ["onClick"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ])
            ])
          ]),
          vue.createCommentVNode(" 场馆列表 "),
          venueList.value.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "venue-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(vue.unref(filteredVenues), (venue) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "venue-item card",
                  key: venue.id,
                  onClick: ($event) => goToVenueDetail(venue.id)
                }, [
                  vue.createElementVNode("image", {
                    class: "venue-image",
                    src: venue.image,
                    mode: "aspectFill"
                  }, null, 8, ["src"]),
                  vue.createElementVNode("view", { class: "venue-info" }, [
                    vue.createElementVNode("view", { class: "venue-header" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "venue-name" },
                        vue.toDisplayString(venue.name),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { class: "venue-rating" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "rating-score" },
                          vue.toDisplayString(venue.rating),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("text", { class: "rating-text" }, "分")
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "venue-details" }, [
                      vue.createElementVNode("view", { class: "detail-item" }, [
                        vue.createElementVNode("text", { class: "detail-label" }, "地址:"),
                        vue.createElementVNode(
                          "text",
                          { class: "detail-value" },
                          vue.toDisplayString(venue.address),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "detail-item" }, [
                        vue.createElementVNode("text", { class: "detail-label" }, "类型:"),
                        vue.createElementVNode(
                          "text",
                          { class: "detail-value" },
                          vue.toDisplayString(venue.courtType),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "detail-item" }, [
                        vue.createElementVNode("text", { class: "detail-label" }, "价格:"),
                        vue.createElementVNode(
                          "text",
                          { class: "detail-value price" },
                          "¥" + vue.toDisplayString(venue.priceRange),
                          1
                          /* TEXT */
                        )
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "venue-tags" }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList(venue.tags, (tag) => {
                          return vue.openBlock(), vue.createElementBlock(
                            "text",
                            {
                              class: "tag",
                              key: tag
                            },
                            vue.toDisplayString(tag),
                            1
                            /* TEXT */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ]),
                    vue.createElementVNode("view", { class: "venue-footer" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "distance" },
                        "距离 " + vue.toDisplayString(venue.distance),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("button", {
                        class: "book-btn",
                        onClick: vue.withModifiers(($event) => quickBook(venue.id), ["stop"])
                      }, "立即预订", 8, ["onClick"])
                    ])
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : !loading.value ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 1 },
            [
              vue.createCommentVNode(" 空状态 "),
              vue.createElementVNode("view", { class: "empty-state" }, [
                vue.createElementVNode("image", {
                  class: "empty-icon",
                  src: "/static/empty-venue.png",
                  mode: "aspectFit"
                }),
                vue.createElementVNode("text", { class: "empty-text" }, "暂无场馆信息"),
                vue.createElementVNode("text", { class: "empty-tip" }, "试试搜索其他关键词")
              ])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          )) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 加载状态 "),
          loading.value ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "loading-state"
          }, [
            vue.createElementVNode("text", { class: "loading-text" }, "加载中...")
          ])) : vue.createCommentVNode("v-if", true)
        ]);
      };
    }
  });
  const PagesBookingBooking = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-eb52234e"], ["__file", "/Users/private/Documents/code/vue/tennis-app/src/pages/booking/booking.vue"]]);
  const _sfc_main$d = /* @__PURE__ */ vue.defineComponent({
    __name: "clubs",
    setup(__props) {
      const currentCity = vue.ref("杭州");
      const myClubs = vue.ref([]);
      const recommendClubs = vue.ref([]);
      const cityList = vue.ref([]);
      const cityPopup = vue.ref();
      vue.onMounted(() => {
        loadMyClubs();
        loadRecommendClubs();
        loadCityList();
        getCurrentLocation();
      });
      function getCurrentLocation() {
        const location = uni.getStorageSync("userLocation");
        if (location) {
          getCityByLocation(location.latitude, location.longitude);
        }
      }
      function getCityByLocation(latitude, longitude) {
        formatAppLog("log", "at pages/clubs/clubs.vue:132", "获取城市信息", latitude, longitude);
      }
      function loadMyClubs() {
        myClubs.value = [
          {
            id: 1,
            name: "律动网球俱乐部",
            logo: "/static/club1.jpg",
            location: "余杭区 良渚 室外 硬地",
            tags: ["室外", "硬地"],
            memberCount: 127,
            distance: "5.7km"
          },
          {
            id: 2,
            name: "阿蓝网球俱乐部",
            logo: "/static/club2.jpg",
            location: "拱墅区 良渚 室内 硬地",
            tags: ["室内", "硬地"],
            memberCount: 128,
            distance: "6.2km"
          }
        ];
      }
      function loadRecommendClubs() {
        recommendClubs.value = [
          {
            id: 3,
            name: "溪上网球",
            logo: "/static/club3.jpg",
            location: "拱墅区 拱墅 室外 硬地",
            tags: ["室外", "硬地"],
            memberCount: 127,
            distance: "2.8km"
          },
          {
            id: 4,
            name: "黄龙体育中心",
            logo: "/static/club4.jpg",
            location: "西湖区 黄龙 室内 硬地",
            tags: ["室内", "硬地"],
            memberCount: 100,
            distance: "2.8km"
          },
          {
            id: 5,
            name: "GS网球俱乐部（浙报店）",
            logo: "/static/club5.jpg",
            location: "拱墅区 浙报印务 室内 硬地",
            tags: ["室内", "硬地"],
            memberCount: 41,
            distance: "5.1km"
          },
          {
            id: 6,
            name: "城北体育公园-网球中心",
            logo: "/static/club6.jpg",
            location: "拱墅区 室内 硬地",
            tags: ["室内", "硬地"],
            memberCount: 194,
            distance: "5.1km"
          },
          {
            id: 7,
            name: "西湖网球俱乐部",
            logo: "/static/club7.jpg",
            location: "余杭区 西湖 室外 硬地",
            tags: ["室外", "硬地"],
            memberCount: 34,
            distance: "6.2km"
          },
          {
            id: 8,
            name: "享趣网球",
            logo: "/static/club8.jpg",
            location: "拱墅区 拱墅 室内 硬地",
            tags: ["室内", "硬地"],
            memberCount: 92,
            distance: "7.4km"
          },
          {
            id: 9,
            name: "52网球俱乐部",
            logo: "/static/club9.jpg",
            location: "拱墅区 室内 硬地",
            tags: ["室内", "硬地"],
            memberCount: 41,
            distance: "7.6km"
          },
          {
            id: 10,
            name: "飞纳网球俱乐部",
            logo: "/static/club10.jpg",
            location: "拱墅区 牛山 室内 硬地",
            tags: ["室内", "硬地"],
            memberCount: 194,
            distance: "9.3km"
          },
          {
            id: 11,
            name: "平击网球俱乐部",
            logo: "/static/club11.jpg",
            location: "余杭区 五常 室内 硬地",
            tags: ["室内", "硬地"],
            memberCount: 34,
            distance: "9.8km"
          }
        ];
      }
      function loadCityList() {
        cityList.value = [
          { code: "hz", name: "杭州" },
          { code: "sh", name: "上海" },
          { code: "bj", name: "北京" },
          { code: "sz", name: "深圳" },
          { code: "gz", name: "广州" },
          { code: "nj", name: "南京" },
          { code: "cd", name: "成都" },
          { code: "wh", name: "武汉" }
        ];
      }
      function showCityPicker() {
        cityPopup.value.open();
      }
      function closeCityPicker() {
        cityPopup.value.close();
      }
      function selectCity(city) {
        currentCity.value = city.name;
        closeCityPicker();
        loadRecommendClubs();
        uni.showToast({
          title: `已切换到${city.name}`,
          icon: "success"
        });
      }
      function goToClubDetail(id) {
        uni.navigateTo({
          url: `/pages/club-detail/club-detail?id=${id}`
        });
      }
      return (_ctx, _cache) => {
        const _component_uni_popup = vue.resolveComponent("uni-popup");
        return vue.openBlock(), vue.createElementBlock("view", { class: "page-container" }, [
          vue.createCommentVNode(" 城市筛选 "),
          vue.createElementVNode("view", { class: "city-filter" }, [
            vue.createElementVNode("view", {
              class: "current-city",
              onClick: showCityPicker
            }, [
              vue.createElementVNode(
                "text",
                { class: "city-name" },
                vue.toDisplayString(currentCity.value),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "city-arrow" }, "▼")
            ])
          ]),
          vue.createCommentVNode(" 我的俱乐部 "),
          myClubs.value.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "section"
          }, [
            vue.createElementVNode("view", { class: "section-title" }, "我的俱乐部"),
            vue.createElementVNode("view", { class: "club-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(myClubs.value, (club) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "club-item card",
                    key: club.id,
                    onClick: ($event) => goToClubDetail(club.id)
                  }, [
                    vue.createElementVNode("image", {
                      class: "club-logo",
                      src: club.logo,
                      mode: "aspectFill"
                    }, null, 8, ["src"]),
                    vue.createElementVNode("view", { class: "club-info" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "club-name" },
                        vue.toDisplayString(club.name),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "club-location" },
                        vue.toDisplayString(club.location),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { class: "club-tags" }, [
                        (vue.openBlock(true), vue.createElementBlock(
                          vue.Fragment,
                          null,
                          vue.renderList(club.tags, (tag) => {
                            return vue.openBlock(), vue.createElementBlock(
                              "text",
                              {
                                class: "tag",
                                key: tag
                              },
                              vue.toDisplayString(tag),
                              1
                              /* TEXT */
                            );
                          }),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ]),
                      vue.createElementVNode(
                        "text",
                        { class: "club-members" },
                        vue.toDisplayString(club.memberCount) + "个成员",
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "club-distance" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "distance" },
                        vue.toDisplayString(club.distance),
                        1
                        /* TEXT */
                      )
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 发现网球俱乐部 "),
          vue.createElementVNode("view", { class: "section" }, [
            vue.createElementVNode("view", { class: "section-title" }, "发现网球俱乐部"),
            vue.createElementVNode("view", { class: "club-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(recommendClubs.value, (club) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "club-item card",
                    key: club.id,
                    onClick: ($event) => goToClubDetail(club.id)
                  }, [
                    vue.createElementVNode("image", {
                      class: "club-logo",
                      src: club.logo,
                      mode: "aspectFill"
                    }, null, 8, ["src"]),
                    vue.createElementVNode("view", { class: "club-info" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "club-name" },
                        vue.toDisplayString(club.name),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "club-location" },
                        vue.toDisplayString(club.location),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { class: "club-tags" }, [
                        (vue.openBlock(true), vue.createElementBlock(
                          vue.Fragment,
                          null,
                          vue.renderList(club.tags, (tag) => {
                            return vue.openBlock(), vue.createElementBlock(
                              "text",
                              {
                                class: "tag",
                                key: tag
                              },
                              vue.toDisplayString(tag),
                              1
                              /* TEXT */
                            );
                          }),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ]),
                      vue.createElementVNode(
                        "text",
                        { class: "club-members" },
                        vue.toDisplayString(club.memberCount) + "个成员",
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "club-distance" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "distance" },
                        vue.toDisplayString(club.distance),
                        1
                        /* TEXT */
                      )
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createCommentVNode(" 城市选择弹窗 "),
          vue.createVNode(
            _component_uni_popup,
            {
              ref_key: "cityPopup",
              ref: cityPopup,
              type: "bottom"
            },
            {
              default: vue.withCtx(() => [
                vue.createElementVNode("view", { class: "city-picker" }, [
                  vue.createElementVNode("view", { class: "picker-header" }, [
                    vue.createElementVNode("text", { class: "picker-title" }, "选择城市"),
                    vue.createElementVNode("text", {
                      class: "picker-close",
                      onClick: closeCityPicker
                    }, "×")
                  ]),
                  vue.createElementVNode("view", { class: "city-list" }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList(cityList.value, (city) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          class: "city-option",
                          key: city.code,
                          onClick: ($event) => selectCity(city)
                        }, [
                          vue.createElementVNode(
                            "text",
                            { class: "city-text" },
                            vue.toDisplayString(city.name),
                            1
                            /* TEXT */
                          ),
                          city.name === currentCity.value ? (vue.openBlock(), vue.createElementBlock("text", {
                            key: 0,
                            class: "city-check"
                          }, "✓")) : vue.createCommentVNode("v-if", true)
                        ], 8, ["onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])
                ])
              ]),
              _: 1
              /* STABLE */
            },
            512
            /* NEED_PATCH */
          )
        ]);
      };
    }
  });
  const PagesClubsClubs = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-b7b7fa85"], ["__file", "/Users/private/Documents/code/vue/tennis-app/src/pages/clubs/clubs.vue"]]);
  const _sfc_main$c = /* @__PURE__ */ vue.defineComponent({
    __name: "profile",
    setup(__props) {
      const userInfo = vue.ref({
        id: 1,
        name: "吐丝",
        avatar: "/static/default-avatar.png",
        rating: 4,
        utr: "6.77",
        gender: "male"
      });
      vue.onMounted(() => {
        loadUserInfo();
      });
      function loadUserInfo() {
        const storedUserInfo = uni.getStorageSync("userInfo");
        if (storedUserInfo) {
          userInfo.value = storedUserInfo;
        } else {
          fetchUserInfo();
        }
      }
      function fetchUserInfo() {
        formatAppLog("log", "at pages/profile/profile.vue:117", "获取用户信息");
      }
      function goToOrders() {
        uni.navigateTo({
          url: "/pages/my-orders/my-orders"
        });
      }
      function goToWallet() {
        uni.showToast({
          title: "功能开发中",
          icon: "none"
        });
      }
      function goToMyActivities() {
        uni.navigateTo({
          url: "/pages/my-activities/my-activities"
        });
      }
      function goToMatchRecords() {
        uni.showToast({
          title: "功能开发中",
          icon: "none"
        });
      }
      function goToApplyClub() {
        uni.navigateTo({
          url: "/pages/apply-club/apply-club"
        });
      }
      function goToApplyCoach() {
        uni.navigateTo({
          url: "/pages/apply-coach/apply-coach"
        });
      }
      function goToHelp() {
        uni.showToast({
          title: "功能开发中",
          icon: "none"
        });
      }
      function contactService() {
        uni.showModal({
          title: "联系客服",
          content: "客服微信：tennis-service\n客服电话：400-123-4567",
          showCancel: false,
          confirmText: "知道了"
        });
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "page-container" }, [
          vue.createCommentVNode(" 用户信息卡片 "),
          vue.createElementVNode("view", { class: "user-card card" }, [
            vue.createElementVNode("view", { class: "user-info" }, [
              vue.createElementVNode("image", {
                class: "user-avatar",
                src: userInfo.value.avatar,
                mode: "aspectFill"
              }, null, 8, ["src"]),
              vue.createElementVNode("view", { class: "user-details" }, [
                vue.createElementVNode(
                  "text",
                  { class: "user-name" },
                  vue.toDisplayString(userInfo.value.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "user-rating" }, [
                  vue.createElementVNode("text", { class: "rating-label" }, "评级:"),
                  vue.createElementVNode(
                    "text",
                    { class: "rating-value" },
                    vue.toDisplayString(userInfo.value.rating),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "utr-score" },
                    "UTR: " + vue.toDisplayString(userInfo.value.utr),
                    1
                    /* TEXT */
                  )
                ])
              ])
            ])
          ]),
          vue.createCommentVNode(" 快捷功能 "),
          vue.createElementVNode("view", { class: "quick-menu" }, [
            vue.createElementVNode("view", { class: "menu-row" }, [
              vue.createElementVNode("view", {
                class: "menu-item",
                onClick: goToOrders
              }, [
                vue.createElementVNode("image", {
                  class: "menu-icon",
                  src: "/static/icon-order.png",
                  mode: "aspectFit"
                }),
                vue.createElementVNode("text", { class: "menu-text" }, "订单")
              ]),
              vue.createElementVNode("view", {
                class: "menu-item",
                onClick: goToWallet
              }, [
                vue.createElementVNode("image", {
                  class: "menu-icon",
                  src: "/static/icon-wallet.png",
                  mode: "aspectFit"
                }),
                vue.createElementVNode("text", { class: "menu-text" }, "卡包")
              ])
            ])
          ]),
          vue.createCommentVNode(" 功能列表 "),
          vue.createElementVNode("view", { class: "function-list" }, [
            vue.createElementVNode("view", {
              class: "list-item",
              onClick: goToMyActivities
            }, [
              vue.createElementVNode("image", {
                class: "item-icon",
                src: "/static/icon-activity.png",
                mode: "aspectFit"
              }),
              vue.createElementVNode("text", { class: "item-text" }, "我的活动"),
              vue.createElementVNode("text", { class: "item-arrow" }, ">")
            ]),
            vue.createElementVNode("view", {
              class: "list-item",
              onClick: goToMatchRecords
            }, [
              vue.createElementVNode("image", {
                class: "item-icon",
                src: "/static/icon-match.png",
                mode: "aspectFit"
              }),
              vue.createElementVNode("text", { class: "item-text" }, "比赛记录"),
              vue.createElementVNode("text", { class: "item-arrow" }, ">")
            ]),
            vue.createElementVNode("view", {
              class: "list-item",
              onClick: goToApplyClub
            }, [
              vue.createElementVNode("image", {
                class: "item-icon",
                src: "/static/icon-club.png",
                mode: "aspectFit"
              }),
              vue.createElementVNode("text", { class: "item-text" }, "申请创建俱乐部"),
              vue.createElementVNode("text", { class: "item-arrow" }, ">")
            ]),
            vue.createElementVNode("view", {
              class: "list-item",
              onClick: goToApplyCoach
            }, [
              vue.createElementVNode("image", {
                class: "item-icon",
                src: "/static/icon-coach.png",
                mode: "aspectFit"
              }),
              vue.createElementVNode("text", { class: "item-text" }, "申请成为教练或陪练"),
              vue.createElementVNode("text", { class: "item-arrow" }, ">")
            ]),
            vue.createElementVNode("view", {
              class: "list-item",
              onClick: goToHelp
            }, [
              vue.createElementVNode("image", {
                class: "item-icon",
                src: "/static/icon-help.png",
                mode: "aspectFit"
              }),
              vue.createElementVNode("text", { class: "item-text" }, "帮助&反馈"),
              vue.createElementVNode("text", { class: "item-arrow" }, ">")
            ])
          ]),
          vue.createCommentVNode(" 联系客服 "),
          vue.createElementVNode("view", { class: "contact-service" }, [
            vue.createElementVNode("button", {
              class: "service-btn",
              onClick: contactService
            }, " 如有疑问？联系客服 ")
          ])
        ]);
      };
    }
  });
  const PagesProfileProfile = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-04d37cba"], ["__file", "/Users/private/Documents/code/vue/tennis-app/src/pages/profile/profile.vue"]]);
  const _sfc_main$b = /* @__PURE__ */ vue.defineComponent({
    __name: "coaches",
    setup(__props) {
      const searchKeyword = vue.ref("");
      const coachList = vue.ref([]);
      const selectedFilters = vue.ref([]);
      const loading = vue.ref(false);
      const filterOptions = vue.ref([
        { key: "coach", label: "教练" },
        { key: "sparring", label: "陪练" },
        { key: "beginner", label: "初学者" },
        { key: "intermediate", label: "中级" },
        { key: "advanced", label: "高级" },
        { key: "male", label: "男教练" },
        { key: "female", label: "女教练" },
        { key: "nearby", label: "附近" },
        { key: "affordable", label: "价格优惠" }
      ]);
      const filteredCoaches = vue.computed(() => {
        let result = coachList.value;
        if (searchKeyword.value.trim()) {
          result = result.filter(
            (coach) => coach.name.includes(searchKeyword.value) || coach.specialties.some((s) => s.includes(searchKeyword.value))
          );
        }
        if (selectedFilters.value.length > 0) {
          result = result.filter(
            (coach) => selectedFilters.value.some(
              (filter) => coach.category.includes(filter) || filter === coach.gender || coach.specialties.some((s) => s.includes(filter))
            )
          );
        }
        return result;
      });
      vue.onMounted(() => {
        loadCoachList();
      });
      function loadCoachList() {
        loading.value = true;
        setTimeout(() => {
          coachList.value = [
            {
              id: 1,
              name: "白影",
              avatar: "/static/coach1.jpg",
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
                  thumbnail: "/static/video1-thumb.jpg"
                },
                {
                  id: 2,
                  title: "发球动作要领",
                  url: "/static/video2.mp4",
                  thumbnail: "/static/video2-thumb.jpg"
                }
              ],
              rating: 4.8,
              reviewCount: 156,
              location: "西湖区",
              category: ["coach", "advanced", "male"]
            },
            {
              id: 2,
              name: "罗学云",
              avatar: "/static/coach2.jpg",
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
                  thumbnail: "/static/video3-thumb.jpg"
                }
              ],
              rating: 4.6,
              reviewCount: 89,
              location: "拱墅区",
              category: ["coach", "intermediate", "male"]
            },
            {
              id: 3,
              name: "陈小明",
              avatar: "/static/coach3.jpg",
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
              category: ["sparring", "beginner", "male", "affordable"]
            },
            {
              id: 4,
              name: "李美娜",
              avatar: "/static/coach4.jpg",
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
                  thumbnail: "/static/video4-thumb.jpg"
                }
              ],
              rating: 4.7,
              reviewCount: 78,
              location: "西湖区",
              category: ["coach", "intermediate", "female"]
            },
            {
              id: 5,
              name: "王强",
              avatar: "/static/coach5.jpg",
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
              category: ["sparring", "intermediate", "male"]
            }
          ];
          loading.value = false;
        }, 1e3);
      }
      function searchCoaches() {
        formatAppLog("log", "at pages/coaches/coaches.vue:329", "搜索教练:", searchKeyword.value);
      }
      function toggleFilter(filterKey) {
        const index = selectedFilters.value.indexOf(filterKey);
        if (index > -1) {
          selectedFilters.value.splice(index, 1);
        } else {
          selectedFilters.value.push(filterKey);
        }
      }
      function goToCoachDetail(id) {
        uni.navigateTo({
          url: `/pages/coach-detail/coach-detail?id=${id}`
        });
      }
      function playVideo(url) {
        uni.showToast({
          title: "播放视频功能开发中",
          icon: "none"
        });
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "page-container" }, [
          vue.createCommentVNode(" 搜索和筛选 "),
          vue.createElementVNode("view", { class: "search-section" }, [
            vue.createElementVNode("view", { class: "search-box" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "search-input",
                  placeholder: "搜索教练姓名",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchKeyword.value = $event),
                  onConfirm: searchCoaches
                },
                null,
                544
                /* HYDRATE_EVENTS, NEED_PATCH */
              ), [
                [vue.vModelText, searchKeyword.value]
              ]),
              vue.createElementVNode("button", {
                class: "search-btn",
                onClick: searchCoaches
              }, "搜索")
            ]),
            vue.createCommentVNode(" 筛选条件 "),
            vue.createElementVNode("view", { class: "filter-section" }, [
              vue.createElementVNode("scroll-view", {
                class: "filter-scroll",
                "scroll-x": "true"
              }, [
                vue.createElementVNode("view", { class: "filter-list" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(filterOptions.value, (filter) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: vue.normalizeClass(["filter-item", { active: selectedFilters.value.includes(filter.key) }]),
                        key: filter.key,
                        onClick: ($event) => toggleFilter(filter.key)
                      }, vue.toDisplayString(filter.label), 11, ["onClick"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ])
            ])
          ]),
          vue.createCommentVNode(" 教练列表 "),
          coachList.value.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "coach-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(vue.unref(filteredCoaches), (coach) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "coach-item card",
                  key: coach.id,
                  onClick: ($event) => goToCoachDetail(coach.id)
                }, [
                  vue.createElementVNode("view", { class: "coach-header" }, [
                    vue.createElementVNode("image", {
                      class: "coach-avatar",
                      src: coach.avatar,
                      mode: "aspectFill"
                    }, null, 8, ["src"]),
                    vue.createElementVNode("view", { class: "coach-basic" }, [
                      vue.createElementVNode("view", { class: "coach-name-row" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "coach-name" },
                          vue.toDisplayString(coach.name),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass(["coach-gender", coach.gender])
                          },
                          vue.toDisplayString(coach.gender === "male" ? "♂" : "♀"),
                          3
                          /* TEXT, CLASS */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "coach-level" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "level-text" },
                          vue.toDisplayString(coach.level),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "experience-text" },
                          vue.toDisplayString(coach.experience) + "年经验",
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "coach-utr" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "utr-score" },
                          "UTR " + vue.toDisplayString(coach.utr),
                          1
                          /* TEXT */
                        )
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "coach-price" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "price-text" },
                        "¥" + vue.toDisplayString(coach.price) + "/小时",
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "coach-specialties" }, [
                    vue.createElementVNode("text", { class: "specialty-label" }, "擅长:"),
                    vue.createElementVNode("view", { class: "specialty-tags" }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList(coach.specialties, (specialty) => {
                          return vue.openBlock(), vue.createElementBlock(
                            "text",
                            {
                              class: "tag",
                              key: specialty
                            },
                            vue.toDisplayString(specialty),
                            1
                            /* TEXT */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])
                  ]),
                  coach.introduction ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "coach-intro"
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "intro-text" },
                      vue.toDisplayString(coach.introduction),
                      1
                      /* TEXT */
                    )
                  ])) : vue.createCommentVNode("v-if", true),
                  vue.createCommentVNode(" 教学视频 "),
                  coach.videos && coach.videos.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 1,
                    class: "coach-videos"
                  }, [
                    vue.createElementVNode("text", { class: "video-label" }, "教学视频:"),
                    vue.createElementVNode("scroll-view", {
                      class: "video-scroll",
                      "scroll-x": "true"
                    }, [
                      vue.createElementVNode("view", { class: "video-list" }, [
                        (vue.openBlock(true), vue.createElementBlock(
                          vue.Fragment,
                          null,
                          vue.renderList(coach.videos, (video) => {
                            return vue.openBlock(), vue.createElementBlock("view", {
                              class: "video-item",
                              key: video.id,
                              onClick: vue.withModifiers(($event) => playVideo(video.url), ["stop"])
                            }, [
                              vue.createElementVNode("image", {
                                class: "video-thumb",
                                src: video.thumbnail,
                                mode: "aspectFill"
                              }, null, 8, ["src"]),
                              vue.createElementVNode("view", { class: "play-icon" }, "▶"),
                              vue.createElementVNode(
                                "text",
                                { class: "video-title" },
                                vue.toDisplayString(video.title),
                                1
                                /* TEXT */
                              )
                            ], 8, ["onClick"]);
                          }),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ])
                    ])
                  ])) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode("view", { class: "coach-footer" }, [
                    vue.createElementVNode("view", { class: "coach-rating" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "rating-text" },
                        "评分: " + vue.toDisplayString(coach.rating),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "review-count" },
                        "(" + vue.toDisplayString(coach.reviewCount) + "条评价)",
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "coach-location" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "location-text" },
                        vue.toDisplayString(coach.location),
                        1
                        /* TEXT */
                      )
                    ])
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : !loading.value ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 1 },
            [
              vue.createCommentVNode(" 空状态 "),
              vue.createElementVNode("view", { class: "empty-state" }, [
                vue.createElementVNode("image", {
                  class: "empty-icon",
                  src: "/static/empty-coach.png",
                  mode: "aspectFit"
                }),
                vue.createElementVNode("text", { class: "empty-text" }, "暂无教练信息"),
                vue.createElementVNode("text", { class: "empty-tip" }, "试试调整筛选条件")
              ])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          )) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 加载状态 "),
          loading.value ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "loading-state"
          }, [
            vue.createElementVNode("text", { class: "loading-text" }, "加载中...")
          ])) : vue.createCommentVNode("v-if", true)
        ]);
      };
    }
  });
  const PagesCoachesCoaches = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-e75ca479"], ["__file", "/Users/private/Documents/code/vue/tennis-app/src/pages/coaches/coaches.vue"]]);
  const _sfc_main$a = /* @__PURE__ */ vue.defineComponent({
    __name: "activities",
    setup(__props) {
      const searchKeyword = vue.ref("");
      const activityList = vue.ref([]);
      const selectedFilters = vue.ref([]);
      const loading = vue.ref(false);
      const filterOptions = vue.ref([
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
        { key: "affordable", label: "价格优惠" }
      ]);
      const filteredActivities = vue.computed(() => {
        let result = activityList.value;
        if (searchKeyword.value.trim()) {
          result = result.filter(
            (activity) => activity.title.includes(searchKeyword.value) || activity.location.includes(searchKeyword.value)
          );
        }
        if (selectedFilters.value.length > 0) {
          result = result.filter(
            (activity) => selectedFilters.value.some(
              (filter) => activity.category.includes(filter) || activity.status === filter || activity.tags.some((tag) => tag.includes(filter))
            )
          );
        }
        return result;
      });
      vue.onMounted(() => {
        loadActivityList();
      });
      function loadActivityList() {
        loading.value = true;
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
              type: "singles"
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
              type: "singles"
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
              type: "singles"
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
              type: "singles"
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
              type: "doubles"
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
              type: "lesson"
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
              type: "training"
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
              type: "match"
            }
          ];
          loading.value = false;
        }, 1e3);
      }
      function searchActivities() {
        formatAppLog("log", "at pages/activities/activities.vue:345", "搜索活动:", searchKeyword.value);
      }
      function toggleFilter(filterKey) {
        const index = selectedFilters.value.indexOf(filterKey);
        if (index > -1) {
          selectedFilters.value.splice(index, 1);
        } else {
          selectedFilters.value.push(filterKey);
        }
      }
      function getActivityStatusText(status) {
        const statusMap = {
          "open": "报名中",
          "full": "已满员",
          "closed": "已结束",
          "cancelled": "已取消"
        };
        return statusMap[status] || "未知状态";
      }
      function getJoinButtonText(status) {
        const buttonMap = {
          "open": "报名",
          "full": "已满",
          "closed": "已结束",
          "cancelled": "已取消"
        };
        return buttonMap[status] || "报名";
      }
      function goToActivityDetail(id) {
        uni.navigateTo({
          url: `/pages/activity-detail/activity-detail?id=${id}`
        });
      }
      function joinActivity(id) {
        const activity = activityList.value.find((a) => a.id === id);
        if (!activity || activity.status !== "open") {
          return;
        }
        uni.showModal({
          title: "确认报名",
          content: `确认报名参加「${activity.title}」？
费用：¥${activity.price}`,
          success: (res) => {
            if (res.confirm) {
              activity.participants++;
              if (activity.participants >= activity.maxParticipants) {
                activity.status = "full";
              }
              uni.showToast({
                title: "报名成功",
                icon: "success"
              });
            }
          }
        });
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "page-container" }, [
          vue.createCommentVNode(" 搜索和筛选 "),
          vue.createElementVNode("view", { class: "search-section" }, [
            vue.createElementVNode("view", { class: "search-box" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "search-input",
                  placeholder: "搜索活动名称",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchKeyword.value = $event),
                  onConfirm: searchActivities
                },
                null,
                544
                /* HYDRATE_EVENTS, NEED_PATCH */
              ), [
                [vue.vModelText, searchKeyword.value]
              ]),
              vue.createElementVNode("button", {
                class: "search-btn",
                onClick: searchActivities
              }, "搜索")
            ]),
            vue.createCommentVNode(" 筛选条件 "),
            vue.createElementVNode("view", { class: "filter-section" }, [
              vue.createElementVNode("scroll-view", {
                class: "filter-scroll",
                "scroll-x": "true"
              }, [
                vue.createElementVNode("view", { class: "filter-list" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(filterOptions.value, (filter) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: vue.normalizeClass(["filter-item", { active: selectedFilters.value.includes(filter.key) }]),
                        key: filter.key,
                        onClick: ($event) => toggleFilter(filter.key)
                      }, vue.toDisplayString(filter.label), 11, ["onClick"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ])
            ])
          ]),
          vue.createCommentVNode(" 活动列表 "),
          activityList.value.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "activity-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(vue.unref(filteredActivities), (activity) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "activity-item card",
                  key: activity.id,
                  onClick: ($event) => goToActivityDetail(activity.id)
                }, [
                  vue.createElementVNode("view", { class: "activity-header" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "activity-title" },
                      vue.toDisplayString(activity.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(["activity-status", activity.status])
                      },
                      vue.toDisplayString(getActivityStatusText(activity.status)),
                      3
                      /* TEXT, CLASS */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "activity-tags" }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList(activity.tags, (tag) => {
                        return vue.openBlock(), vue.createElementBlock(
                          "text",
                          {
                            class: "tag",
                            key: tag
                          },
                          vue.toDisplayString(tag),
                          1
                          /* TEXT */
                        );
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]),
                  vue.createElementVNode("view", { class: "activity-info" }, [
                    vue.createElementVNode("view", { class: "info-row" }, [
                      vue.createElementVNode("view", { class: "info-item" }, [
                        vue.createElementVNode("image", {
                          class: "info-icon",
                          src: "/static/icon-time.png",
                          mode: "aspectFit"
                        }),
                        vue.createElementVNode(
                          "text",
                          { class: "info-text" },
                          vue.toDisplayString(activity.time),
                          1
                          /* TEXT */
                        )
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "info-row" }, [
                      vue.createElementVNode("view", { class: "info-item" }, [
                        vue.createElementVNode("image", {
                          class: "info-icon",
                          src: "/static/icon-location.png",
                          mode: "aspectFit"
                        }),
                        vue.createElementVNode(
                          "text",
                          { class: "info-text" },
                          vue.toDisplayString(activity.location),
                          1
                          /* TEXT */
                        )
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "info-row" }, [
                      vue.createElementVNode("view", { class: "info-item" }, [
                        vue.createElementVNode("image", {
                          class: "info-icon",
                          src: "/static/icon-utr.png",
                          mode: "aspectFit"
                        }),
                        vue.createElementVNode(
                          "text",
                          { class: "info-text" },
                          "UTR " + vue.toDisplayString(activity.utrRange),
                          1
                          /* TEXT */
                        )
                      ])
                    ]),
                    activity.ageRange ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "info-row"
                    }, [
                      vue.createElementVNode("view", { class: "info-item" }, [
                        vue.createElementVNode("image", {
                          class: "info-icon",
                          src: "/static/icon-age.png",
                          mode: "aspectFit"
                        }),
                        vue.createElementVNode(
                          "text",
                          { class: "info-text" },
                          vue.toDisplayString(activity.ageRange),
                          1
                          /* TEXT */
                        )
                      ])
                    ])) : vue.createCommentVNode("v-if", true),
                    activity.gender ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 1,
                      class: "info-row"
                    }, [
                      vue.createElementVNode("view", { class: "info-item" }, [
                        vue.createElementVNode("image", {
                          class: "info-icon",
                          src: "/static/icon-gender.png",
                          mode: "aspectFit"
                        }),
                        vue.createElementVNode(
                          "text",
                          { class: "info-text" },
                          vue.toDisplayString(activity.gender),
                          1
                          /* TEXT */
                        )
                      ])
                    ])) : vue.createCommentVNode("v-if", true)
                  ]),
                  vue.createElementVNode("view", { class: "activity-footer" }, [
                    vue.createElementVNode("view", { class: "participants-info" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "participants-text" },
                        "已报名 " + vue.toDisplayString(activity.participants) + "/" + vue.toDisplayString(activity.maxParticipants),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { class: "progress-bar" }, [
                        vue.createElementVNode(
                          "view",
                          {
                            class: "progress-fill",
                            style: vue.normalizeStyle({ width: activity.participants / activity.maxParticipants * 100 + "%" })
                          },
                          null,
                          4
                          /* STYLE */
                        )
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "price-info" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "price-text" },
                        "¥" + vue.toDisplayString(activity.price),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("button", {
                        class: vue.normalizeClass(["join-btn", { disabled: activity.status !== "open" }]),
                        onClick: vue.withModifiers(($event) => joinActivity(activity.id), ["stop"]),
                        disabled: activity.status !== "open"
                      }, vue.toDisplayString(getJoinButtonText(activity.status)), 11, ["onClick", "disabled"])
                    ])
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : !loading.value ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 1 },
            [
              vue.createCommentVNode(" 空状态 "),
              vue.createElementVNode("view", { class: "empty-state" }, [
                vue.createElementVNode("image", {
                  class: "empty-icon",
                  src: "/static/empty-activity.png",
                  mode: "aspectFit"
                }),
                vue.createElementVNode("text", { class: "empty-text" }, "暂无活动信息"),
                vue.createElementVNode("text", { class: "empty-tip" }, "试试调整筛选条件")
              ])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          )) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 加载状态 "),
          loading.value ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "loading-state"
          }, [
            vue.createElementVNode("text", { class: "loading-text" }, "加载中...")
          ])) : vue.createCommentVNode("v-if", true)
        ]);
      };
    }
  });
  const PagesActivitiesActivities = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-263c7cd9"], ["__file", "/Users/private/Documents/code/vue/tennis-app/src/pages/activities/activities.vue"]]);
  const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
    __name: "club-detail",
    setup(__props) {
      const club = vue.ref({
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
        longitude: 0
      });
      const activeTab = vue.ref("intro");
      const isJoined = vue.ref(false);
      const loading = vue.ref(false);
      const navItems = vue.ref([
        { key: "intro", label: "介绍" },
        { key: "activities", label: "活动" },
        { key: "members", label: "成员" },
        { key: "photos", label: "相册" }
      ]);
      vue.onMounted(() => {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        const options = currentPage.options;
        if (options.id) {
          loadClubDetail(parseInt(options.id));
        }
      });
      function loadClubDetail(id) {
        loading.value = true;
        setTimeout(() => {
          club.value = {
            id,
            name: "杭州网球俱乐部",
            logo: "/static/club-logo1.png",
            coverImage: "/static/club-cover1.jpg",
            address: "杭州市西湖区文三路123号",
            memberCount: 156,
            activityCount: 28,
            rating: 4.8,
            tags: ["专业训练", "比赛组织", "社交活动", "设施完善"],
            introduction: "杭州网球俱乐部成立于2015年，是杭州地区最具影响力的网球俱乐部之一。俱乐部拥有8片标准网球场地，包括4片硬地场和4片红土场，配备专业的灯光系统和完善的配套设施。我们致力于为网球爱好者提供专业的训练指导、丰富的比赛活动和良好的社交平台。",
            facilities: [
              { name: "硬地场", icon: "/static/facility-hardcourt.png" },
              { name: "红土场", icon: "/static/facility-claycourt.png" },
              { name: "更衣室", icon: "/static/facility-locker.png" },
              { name: "淋浴间", icon: "/static/facility-shower.png" },
              { name: "休息区", icon: "/static/facility-rest.png" },
              { name: "停车场", icon: "/static/facility-parking.png" },
              { name: "商店", icon: "/static/facility-shop.png" },
              { name: "餐厅", icon: "/static/facility-restaurant.png" }
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
                status: "open"
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
                status: "open"
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
                status: "full"
              }
            ],
            members: [
              {
                id: 1,
                name: "张会长",
                avatar: "/static/member-avatar1.png",
                role: "俱乐部会长",
                utr: 7.2,
                level: "advanced"
              },
              {
                id: 2,
                name: "李教练",
                avatar: "/static/member-avatar2.png",
                role: "主教练",
                utr: 8.5,
                level: "advanced"
              },
              {
                id: 3,
                name: "王秘书",
                avatar: "/static/member-avatar3.png",
                role: "秘书长",
                utr: 5.8,
                level: "intermediate"
              },
              {
                id: 4,
                name: "刘同学",
                avatar: "/static/member-avatar4.png",
                role: "普通会员",
                utr: 3.2,
                level: "intermediate"
              },
              {
                id: 5,
                name: "陈同学",
                avatar: "/static/member-avatar5.png",
                role: "普通会员",
                utr: 2.5,
                level: "beginner"
              }
            ],
            photos: [
              "/static/club-photo1.jpg",
              "/static/club-photo2.jpg",
              "/static/club-photo3.jpg",
              "/static/club-photo4.jpg",
              "/static/club-photo5.jpg",
              "/static/club-photo6.jpg",
              "/static/club-photo7.jpg",
              "/static/club-photo8.jpg"
            ],
            latitude: 30.2741,
            longitude: 120.1551
          };
          isJoined.value = Math.random() > 0.5;
          loading.value = false;
        }, 1e3);
      }
      function switchTab(tab) {
        activeTab.value = tab;
      }
      function getActivityStatusText(status) {
        const statusMap = {
          "open": "报名中",
          "full": "已满员",
          "closed": "已结束"
        };
        return statusMap[status] || "未知状态";
      }
      function getLevelText(level) {
        const levelMap = {
          "beginner": "初级",
          "intermediate": "中级",
          "advanced": "高级"
        };
        return levelMap[level] || "未知";
      }
      function goToActivityDetail(id) {
        uni.navigateTo({
          url: `/pages/activity-detail/activity-detail?id=${id}`
        });
      }
      function previewPhoto(index) {
        uni.previewImage({
          urls: club.value.photos,
          current: index
        });
      }
      function openMap() {
        uni.openLocation({
          latitude: club.value.latitude,
          longitude: club.value.longitude,
          name: club.value.name,
          address: club.value.address
        });
      }
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
                  icon: "success"
                });
              }
            }
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
                  icon: "success"
                });
              }
            }
          });
        }
      }
      function contactClub() {
        uni.showActionSheet({
          itemList: ["拨打电话", "发送邮件", "发送消息"],
          success: (res) => {
            if (res.tapIndex === 0) {
              uni.makePhoneCall({
                phoneNumber: club.value.phone
              });
            } else if (res.tapIndex === 1 && club.value.email) {
              uni.showToast({
                title: `邮箱: ${club.value.email}`,
                icon: "none",
                duration: 3e3
              });
            } else if (res.tapIndex === 2) {
              uni.navigateTo({
                url: "/pages/customer-service/customer-service"
              });
            }
          }
        });
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "page-container" }, [
          vue.createCommentVNode(" 俱乐部头部信息 "),
          vue.createElementVNode("view", { class: "club-header" }, [
            vue.createCommentVNode(" 俱乐部封面图 "),
            vue.createElementVNode("image", {
              class: "club-cover",
              src: club.value.coverImage,
              mode: "aspectFill"
            }, null, 8, ["src"]),
            vue.createCommentVNode(" 俱乐部基本信息 "),
            vue.createElementVNode("view", { class: "club-info card" }, [
              vue.createElementVNode("view", { class: "club-basic" }, [
                vue.createElementVNode("image", {
                  class: "club-logo",
                  src: club.value.logo,
                  mode: "aspectFill"
                }, null, 8, ["src"]),
                vue.createElementVNode("view", { class: "club-details" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "club-name" },
                    vue.toDisplayString(club.value.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "club-stats" }, [
                    vue.createElementVNode("view", { class: "stat-item" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "stat-number" },
                        vue.toDisplayString(club.value.memberCount),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("text", { class: "stat-label" }, "成员")
                    ]),
                    vue.createElementVNode("view", { class: "stat-item" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "stat-number" },
                        vue.toDisplayString(club.value.activityCount),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("text", { class: "stat-label" }, "活动")
                    ]),
                    vue.createElementVNode("view", { class: "stat-item" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "stat-number" },
                        vue.toDisplayString(club.value.rating),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("text", { class: "stat-label" }, "评分")
                    ])
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "club-tags" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(club.value.tags, (tag) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        class: "tag",
                        key: tag
                      },
                      vue.toDisplayString(tag),
                      1
                      /* TEXT */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createElementVNode("view", { class: "club-location" }, [
                vue.createElementVNode("image", {
                  class: "location-icon",
                  src: "/static/icon-location.png",
                  mode: "aspectFit"
                }),
                vue.createElementVNode(
                  "text",
                  { class: "location-text" },
                  vue.toDisplayString(club.value.address),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("button", {
                  class: "map-btn",
                  onClick: openMap
                }, "地图")
              ])
            ])
          ]),
          vue.createCommentVNode(" 功能导航 "),
          vue.createElementVNode("view", { class: "nav-section card" }, [
            vue.createElementVNode("view", { class: "nav-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(navItems.value, (nav) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: vue.normalizeClass(["nav-item", { active: activeTab.value === nav.key }]),
                    key: nav.key,
                    onClick: ($event) => switchTab(nav.key)
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "nav-text" },
                      vue.toDisplayString(nav.label),
                      1
                      /* TEXT */
                    )
                  ], 10, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createCommentVNode(" 内容区域 "),
          vue.createElementVNode("view", { class: "content-section" }, [
            vue.createCommentVNode(" 俱乐部介绍 "),
            activeTab.value === "intro" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "intro-section card"
            }, [
              vue.createElementVNode("view", { class: "section-title" }, "俱乐部介绍"),
              vue.createElementVNode(
                "text",
                { class: "intro-text" },
                vue.toDisplayString(club.value.introduction),
                1
                /* TEXT */
              ),
              club.value.facilities.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "facilities"
              }, [
                vue.createElementVNode("text", { class: "facilities-title" }, "俱乐部设施"),
                vue.createElementVNode("view", { class: "facilities-grid" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(club.value.facilities, (facility) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "facility-item",
                        key: facility.name
                      }, [
                        vue.createElementVNode("image", {
                          class: "facility-icon",
                          src: facility.icon,
                          mode: "aspectFit"
                        }, null, 8, ["src"]),
                        vue.createElementVNode(
                          "text",
                          { class: "facility-name" },
                          vue.toDisplayString(facility.name),
                          1
                          /* TEXT */
                        )
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("view", { class: "contact-info" }, [
                vue.createElementVNode("text", { class: "contact-title" }, "联系方式"),
                vue.createElementVNode("view", { class: "contact-item" }, [
                  vue.createElementVNode("image", {
                    class: "contact-icon",
                    src: "/static/icon-phone.png",
                    mode: "aspectFit"
                  }),
                  vue.createElementVNode(
                    "text",
                    { class: "contact-text" },
                    vue.toDisplayString(club.value.phone),
                    1
                    /* TEXT */
                  )
                ]),
                club.value.email ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "contact-item"
                }, [
                  vue.createElementVNode("image", {
                    class: "contact-icon",
                    src: "/static/icon-email.png",
                    mode: "aspectFit"
                  }),
                  vue.createElementVNode(
                    "text",
                    { class: "contact-text" },
                    vue.toDisplayString(club.value.email),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true)
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" 俱乐部活动 "),
            activeTab.value === "activities" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "activities-section"
            }, [
              vue.createElementVNode("view", { class: "activity-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(club.value.activities, (activity) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "activity-item card",
                      key: activity.id,
                      onClick: ($event) => goToActivityDetail(activity.id)
                    }, [
                      vue.createElementVNode("view", { class: "activity-header" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "activity-title" },
                          vue.toDisplayString(activity.title),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass(["activity-status", activity.status])
                          },
                          vue.toDisplayString(getActivityStatusText(activity.status)),
                          3
                          /* TEXT, CLASS */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "activity-info" }, [
                        vue.createElementVNode("view", { class: "info-item" }, [
                          vue.createElementVNode("image", {
                            class: "info-icon",
                            src: "/static/icon-time.png",
                            mode: "aspectFit"
                          }),
                          vue.createElementVNode(
                            "text",
                            { class: "info-text" },
                            vue.toDisplayString(activity.time),
                            1
                            /* TEXT */
                          )
                        ]),
                        vue.createElementVNode("view", { class: "info-item" }, [
                          vue.createElementVNode("image", {
                            class: "info-icon",
                            src: "/static/icon-location.png",
                            mode: "aspectFit"
                          }),
                          vue.createElementVNode(
                            "text",
                            { class: "info-text" },
                            vue.toDisplayString(activity.location),
                            1
                            /* TEXT */
                          )
                        ]),
                        vue.createElementVNode("view", { class: "info-item" }, [
                          vue.createElementVNode("image", {
                            class: "info-icon",
                            src: "/static/icon-utr.png",
                            mode: "aspectFit"
                          }),
                          vue.createElementVNode(
                            "text",
                            { class: "info-text" },
                            "UTR " + vue.toDisplayString(activity.utrRange),
                            1
                            /* TEXT */
                          )
                        ])
                      ]),
                      vue.createElementVNode("view", { class: "activity-footer" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "participants-text" },
                          vue.toDisplayString(activity.participants) + "/" + vue.toDisplayString(activity.maxParticipants) + "人",
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "price-text" },
                          "¥" + vue.toDisplayString(activity.price),
                          1
                          /* TEXT */
                        )
                      ])
                    ], 8, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              club.value.activities.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "empty-state"
              }, [
                vue.createElementVNode("image", {
                  class: "empty-icon",
                  src: "/static/empty-activity.png",
                  mode: "aspectFit"
                }),
                vue.createElementVNode("text", { class: "empty-text" }, "暂无活动")
              ])) : vue.createCommentVNode("v-if", true)
            ])) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" 俱乐部成员 "),
            activeTab.value === "members" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 2,
              class: "members-section"
            }, [
              vue.createElementVNode("view", { class: "member-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(club.value.members, (member) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "member-item",
                      key: member.id
                    }, [
                      vue.createElementVNode("image", {
                        class: "member-avatar",
                        src: member.avatar,
                        mode: "aspectFill"
                      }, null, 8, ["src"]),
                      vue.createElementVNode("view", { class: "member-info" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "member-name" },
                          vue.toDisplayString(member.name),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "member-role" },
                          vue.toDisplayString(member.role),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "member-utr" },
                          "UTR " + vue.toDisplayString(member.utr),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode(
                        "view",
                        {
                          class: vue.normalizeClass(["member-level", member.level])
                        },
                        vue.toDisplayString(getLevelText(member.level)),
                        3
                        /* TEXT, CLASS */
                      )
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode(" 俱乐部相册 "),
            activeTab.value === "photos" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 3,
              class: "photos-section"
            }, [
              vue.createElementVNode("view", { class: "photos-grid" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(club.value.photos, (photo, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "photo-item",
                      key: index,
                      onClick: ($event) => previewPhoto(index)
                    }, [
                      vue.createElementVNode("image", {
                        class: "photo-image",
                        src: photo,
                        mode: "aspectFill"
                      }, null, 8, ["src"])
                    ], 8, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              club.value.photos.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "empty-state"
              }, [
                vue.createElementVNode("image", {
                  class: "empty-icon",
                  src: "/static/empty-photo.png",
                  mode: "aspectFit"
                }),
                vue.createElementVNode("text", { class: "empty-text" }, "暂无照片")
              ])) : vue.createCommentVNode("v-if", true)
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createCommentVNode(" 底部操作栏 "),
          vue.createElementVNode("view", { class: "bottom-actions" }, [
            vue.createElementVNode("button", {
              class: "contact-btn",
              onClick: contactClub
            }, "联系俱乐部"),
            vue.createElementVNode(
              "button",
              {
                class: vue.normalizeClass(["join-btn", { joined: isJoined.value }]),
                onClick: joinClub
              },
              vue.toDisplayString(isJoined.value ? "已加入" : "加入俱乐部"),
              3
              /* TEXT, CLASS */
            )
          ])
        ]);
      };
    }
  });
  const PagesClubDetailClubDetail = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-5040bae3"], ["__file", "/Users/private/Documents/code/vue/tennis-app/src/pages/club-detail/club-detail.vue"]]);
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
    __name: "coach-detail",
    setup(__props) {
      const coach = vue.ref({
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
        phone: ""
      });
      const selectedDate = vue.ref("");
      const selectedTimeSlot = vue.ref(null);
      const availableDates = vue.ref([]);
      const timeSlots = vue.ref([]);
      const loading = vue.ref(false);
      vue.onMounted(() => {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        const options = currentPage.options;
        if (options.id) {
          loadCoachDetail(parseInt(options.id));
        }
        generateAvailableDates();
      });
      function loadCoachDetail(id) {
        loading.value = true;
        setTimeout(() => {
          coach.value = {
            id,
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
            introduction: "前职业网球运动员，拥有8年丰富的教学经验。曾获得多项国内外网球赛事冠军，擅长技术细节指导和战术分析。教学风格严谨细致，能够根据学员的不同水平制定个性化训练计划。",
            achievements: [
              "2018年全国网球锦标赛男单冠军",
              "2019年亚洲网球公开赛四强",
              "国家一级网球运动员",
              "中国网球协会认证教练员",
              "培养学员获得省级比赛冠军20余人次"
            ],
            videos: [
              {
                id: 1,
                title: "正手击球技术要领",
                cover: "/static/video-cover1.jpg",
                duration: "05:32",
                url: "/static/video1.mp4"
              },
              {
                id: 2,
                title: "发球技术详解",
                cover: "/static/video-cover2.jpg",
                duration: "08:15",
                url: "/static/video2.mp4"
              },
              {
                id: 3,
                title: "网前截击技巧",
                cover: "/static/video-cover3.jpg",
                duration: "06:48",
                url: "/static/video3.mp4"
              }
            ],
            reviews: [
              {
                id: 1,
                name: "张同学",
                avatar: "/static/student-avatar1.png",
                rating: 5,
                date: "2024-06-20",
                content: "李教练非常专业，技术指导很到位，我的正手技术有了明显提升。教学很有耐心，强烈推荐！"
              },
              {
                id: 2,
                name: "王同学",
                avatar: "/static/student-avatar2.png",
                rating: 5,
                date: "2024-06-18",
                content: "跟李教练学了3个月，从完全不会到现在能打比赛了。教练很负责，课后还会给练习建议。"
              },
              {
                id: 3,
                name: "刘同学",
                avatar: "/static/student-avatar3.png",
                rating: 4,
                date: "2024-06-15",
                content: "教练技术很好，讲解清晰。就是有时候要求比较严格，不过这样进步更快。"
              }
            ],
            phone: "138-0000-0000"
          };
          loading.value = false;
        }, 1e3);
      }
      function generateAvailableDates() {
        const dates = [];
        const today = /* @__PURE__ */ new Date();
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
            date: dateStr
          });
        }
        availableDates.value = dates;
      }
      function generateTimeSlots(date) {
        const slots = [];
        for (let hour = 9; hour <= 21; hour++) {
          const time = `${hour.toString().padStart(2, "0")}:00`;
          slots.push({
            time,
            status: Math.random() > 0.3 ? "available" : "booked"
          });
        }
        timeSlots.value = slots;
      }
      function selectDate(date) {
        selectedDate.value = date;
        selectedTimeSlot.value = null;
        generateTimeSlots();
      }
      function selectTimeSlot(slot) {
        if (slot.status !== "available") {
          return;
        }
        selectedTimeSlot.value = slot;
      }
      function getLevelText(level) {
        const levelMap = {
          "beginner": "初级教练",
          "intermediate": "中级教练",
          "advanced": "高级教练",
          "professional": "专业教练"
        };
        return levelMap[level] || "教练";
      }
      function getSlotStatusText(status) {
        const statusMap = {
          "available": "可预约",
          "booked": "已预约",
          "unavailable": "不可用"
        };
        return statusMap[status] || "";
      }
      function playVideo(video) {
        uni.showToast({
          title: `播放视频: ${video.title}`,
          icon: "none"
        });
      }
      function bookLesson() {
        if (!selectedTimeSlot.value) {
          uni.showToast({
            title: "请选择上课时间",
            icon: "none"
          });
          return;
        }
        const bookingInfo = {
          coach: coach.value.name,
          date: selectedDate.value,
          time: selectedTimeSlot.value.time,
          price: coach.value.price
        };
        uni.navigateTo({
          url: `/pages/lesson-confirm/lesson-confirm?data=${encodeURIComponent(JSON.stringify(bookingInfo))}`
        });
      }
      function contactCoach() {
        uni.showActionSheet({
          itemList: ["拨打电话", "发送消息"],
          success: (res) => {
            if (res.tapIndex === 0) {
              uni.makePhoneCall({
                phoneNumber: coach.value.phone
              });
            } else if (res.tapIndex === 1) {
              uni.navigateTo({
                url: "/pages/customer-service/customer-service"
              });
            }
          }
        });
      }
      function viewAllReviews() {
        uni.navigateTo({
          url: `/pages/coach-reviews/coach-reviews?id=${coach.value.id}`
        });
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "page-container" }, [
          vue.createCommentVNode(" 教练基本信息 "),
          vue.createElementVNode("view", { class: "coach-header card" }, [
            vue.createElementVNode("view", { class: "coach-basic" }, [
              vue.createElementVNode("image", {
                class: "coach-avatar",
                src: coach.value.avatar,
                mode: "aspectFill"
              }, null, 8, ["src"]),
              vue.createElementVNode("view", { class: "coach-info" }, [
                vue.createElementVNode("view", { class: "name-section" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "coach-name" },
                    vue.toDisplayString(coach.value.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["gender-badge", coach.value.gender])
                    },
                    vue.toDisplayString(coach.value.gender === "male" ? "男" : "女"),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                vue.createElementVNode("view", { class: "coach-stats" }, [
                  vue.createElementVNode("view", { class: "stat-item" }, [
                    vue.createElementVNode("text", { class: "stat-label" }, "UTR"),
                    vue.createElementVNode(
                      "text",
                      { class: "stat-value utr" },
                      vue.toDisplayString(coach.value.utr),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "stat-item" }, [
                    vue.createElementVNode("text", { class: "stat-label" }, "经验"),
                    vue.createElementVNode(
                      "text",
                      { class: "stat-value" },
                      vue.toDisplayString(coach.value.experience) + "年",
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "stat-item" }, [
                    vue.createElementVNode("text", { class: "stat-label" }, "评分"),
                    vue.createElementVNode(
                      "text",
                      { class: "stat-value rating" },
                      vue.toDisplayString(coach.value.rating),
                      1
                      /* TEXT */
                    )
                  ])
                ]),
                vue.createElementVNode("view", { class: "coach-level" }, [
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["level-badge", coach.value.level])
                    },
                    vue.toDisplayString(getLevelText(coach.value.level)),
                    3
                    /* TEXT, CLASS */
                  )
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "coach-tags" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(coach.value.specialties, (tag) => {
                  return vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      class: "tag",
                      key: tag
                    },
                    vue.toDisplayString(tag),
                    1
                    /* TEXT */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createElementVNode("view", { class: "price-section" }, [
              vue.createElementVNode("text", { class: "price-label" }, "课程价格"),
              vue.createElementVNode(
                "text",
                { class: "price-value" },
                "¥" + vue.toDisplayString(coach.value.price) + "/小时",
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createCommentVNode(" 教练介绍 "),
          vue.createElementVNode("view", { class: "coach-intro card" }, [
            vue.createElementVNode("view", { class: "section-title" }, "教练介绍"),
            vue.createElementVNode(
              "text",
              { class: "intro-text" },
              vue.toDisplayString(coach.value.introduction),
              1
              /* TEXT */
            ),
            coach.value.achievements.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "achievements"
            }, [
              vue.createElementVNode("text", { class: "achievements-title" }, "主要成就"),
              vue.createElementVNode("view", { class: "achievement-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(coach.value.achievements, (achievement) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        class: "achievement-item",
                        key: achievement
                      },
                      " • " + vue.toDisplayString(achievement),
                      1
                      /* TEXT */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createCommentVNode(" 教学视频 "),
          coach.value.videos.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "videos-section card"
          }, [
            vue.createElementVNode("view", { class: "section-title" }, "教学视频"),
            vue.createElementVNode("scroll-view", {
              class: "videos-scroll",
              "scroll-x": "true"
            }, [
              vue.createElementVNode("view", { class: "videos-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(coach.value.videos, (video) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "video-item",
                      key: video.id,
                      onClick: ($event) => playVideo(video)
                    }, [
                      vue.createElementVNode("view", { class: "video-cover" }, [
                        vue.createElementVNode("image", {
                          class: "cover-image",
                          src: video.cover,
                          mode: "aspectFill"
                        }, null, 8, ["src"]),
                        vue.createElementVNode("view", { class: "play-icon" }, [
                          vue.createElementVNode("image", {
                            src: "/static/icon-play.png",
                            mode: "aspectFit"
                          })
                        ])
                      ]),
                      vue.createElementVNode(
                        "text",
                        { class: "video-title" },
                        vue.toDisplayString(video.title),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "video-duration" },
                        vue.toDisplayString(video.duration),
                        1
                        /* TEXT */
                      )
                    ], 8, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 课程安排 "),
          vue.createElementVNode("view", { class: "schedule-section card" }, [
            vue.createElementVNode("view", { class: "section-title" }, "课程安排"),
            vue.createCommentVNode(" 日期选择 "),
            vue.createElementVNode("view", { class: "date-selector" }, [
              vue.createElementVNode("scroll-view", {
                class: "date-scroll",
                "scroll-x": "true"
              }, [
                vue.createElementVNode("view", { class: "date-list" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(availableDates.value, (date) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: vue.normalizeClass(["date-item", { selected: selectedDate.value === date.value }]),
                        key: date.value,
                        onClick: ($event) => selectDate(date.value)
                      }, [
                        vue.createElementVNode(
                          "text",
                          { class: "date-day" },
                          vue.toDisplayString(date.day),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "date-date" },
                          vue.toDisplayString(date.date),
                          1
                          /* TEXT */
                        )
                      ], 10, ["onClick"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ])
            ]),
            vue.createCommentVNode(" 时间段选择 "),
            selectedDate.value ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "time-slots"
            }, [
              vue.createElementVNode("view", { class: "slots-grid" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(timeSlots.value, (slot) => {
                    var _a;
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: vue.normalizeClass(["time-slot", {
                        selected: ((_a = selectedTimeSlot.value) == null ? void 0 : _a.time) === slot.time,
                        disabled: slot.status !== "available"
                      }]),
                      key: slot.time,
                      onClick: ($event) => selectTimeSlot(slot)
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "slot-time" },
                        vue.toDisplayString(slot.time),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "slot-status" },
                        vue.toDisplayString(getSlotStatusText(slot.status)),
                        1
                        /* TEXT */
                      )
                    ], 10, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createCommentVNode(" 学员评价 "),
          vue.createElementVNode("view", { class: "reviews-section card" }, [
            vue.createElementVNode("view", { class: "section-header" }, [
              vue.createElementVNode("text", { class: "section-title" }, "学员评价"),
              vue.createElementVNode("text", {
                class: "more-reviews",
                onClick: viewAllReviews
              }, "查看全部")
            ]),
            vue.createElementVNode("view", { class: "review-summary" }, [
              vue.createElementVNode("view", { class: "rating-overview" }, [
                vue.createElementVNode(
                  "text",
                  { class: "overall-rating" },
                  vue.toDisplayString(coach.value.rating),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "rating-stars" }, [
                  (vue.openBlock(), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(5, (n) => {
                      return vue.createElementVNode(
                        "text",
                        {
                          class: vue.normalizeClass(["star", { filled: n <= Math.floor(coach.value.rating) }]),
                          key: n
                        },
                        "★",
                        2
                        /* CLASS */
                      );
                    }),
                    64
                    /* STABLE_FRAGMENT */
                  ))
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "review-count" },
                  vue.toDisplayString(coach.value.reviewCount) + "条评价",
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createElementVNode("view", { class: "review-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(coach.value.reviews.slice(0, 3), (review) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "review-item",
                    key: review.id
                  }, [
                    vue.createElementVNode("view", { class: "review-header" }, [
                      vue.createElementVNode("image", {
                        class: "reviewer-avatar",
                        src: review.avatar,
                        mode: "aspectFill"
                      }, null, 8, ["src"]),
                      vue.createElementVNode("view", { class: "reviewer-info" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "reviewer-name" },
                          vue.toDisplayString(review.name),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("view", { class: "review-rating" }, [
                          (vue.openBlock(), vue.createElementBlock(
                            vue.Fragment,
                            null,
                            vue.renderList(5, (n) => {
                              return vue.createElementVNode(
                                "text",
                                {
                                  class: vue.normalizeClass(["star", { filled: n <= review.rating }]),
                                  key: n
                                },
                                "★",
                                2
                                /* CLASS */
                              );
                            }),
                            64
                            /* STABLE_FRAGMENT */
                          ))
                        ])
                      ]),
                      vue.createElementVNode(
                        "text",
                        { class: "review-date" },
                        vue.toDisplayString(review.date),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode(
                      "text",
                      { class: "review-content" },
                      vue.toDisplayString(review.content),
                      1
                      /* TEXT */
                    )
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createCommentVNode(" 底部操作栏 "),
          vue.createElementVNode("view", { class: "bottom-actions" }, [
            selectedTimeSlot.value ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "booking-summary"
            }, [
              vue.createElementVNode(
                "text",
                { class: "summary-text" },
                vue.toDisplayString(selectedDate.value) + " " + vue.toDisplayString(selectedTimeSlot.value.time) + " · ¥" + vue.toDisplayString(coach.value.price),
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "action-buttons" }, [
              vue.createElementVNode("button", {
                class: "contact-btn",
                onClick: contactCoach
              }, "联系教练"),
              vue.createElementVNode("button", {
                class: vue.normalizeClass(["book-btn", { disabled: !selectedTimeSlot.value }]),
                onClick: bookLesson,
                disabled: !selectedTimeSlot.value
              }, " 立即预约 ", 10, ["disabled"])
            ])
          ])
        ]);
      };
    }
  });
  const PagesCoachDetailCoachDetail = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-47f95605"], ["__file", "/Users/private/Documents/code/vue/tennis-app/src/pages/coach-detail/coach-detail.vue"]]);
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    __name: "activity-detail",
    setup(__props) {
      const activity = vue.ref({
        id: 0,
        title: "",
        time: "",
        location: "",
        utrRange: "",
        participants: 0,
        maxParticipants: 0,
        price: 0,
        status: "open",
        tags: [],
        organizer: {
          name: "",
          phone: "",
          avatar: ""
        },
        venue: {
          name: "",
          address: "",
          latitude: 0,
          longitude: 0
        }
      });
      const participantsList = vue.ref([]);
      const loading = vue.ref(false);
      vue.onMounted(() => {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        const options = currentPage.options;
        if (options.id) {
          loadActivityDetail(parseInt(options.id));
        }
      });
      function loadActivityDetail(id) {
        loading.value = true;
        setTimeout(() => {
          activity.value = {
            id,
            title: "UTR网球积分赛3.0（蒙马体育）",
            time: "06月26日 周四 09:30-12:00",
            location: "城东体育网球训练中心",
            utrRange: "2.0-4.0",
            participants: 5,
            maxParticipants: 8,
            price: 120,
            status: "open",
            tags: ["有顶棚", "4人打", "UTR2-4", "冠军300"],
            description: "本次活动是专为UTR 2.0-4.0水平的球友举办的积分赛，采用单打形式，每场比赛为抢七局制。比赛将严格按照UTR积分规则进行，获胜者将获得相应的UTR积分提升。活动提供专业裁判和计分服务，确保比赛的公平公正。",
            organizer: {
              name: "蒙马体育",
              phone: "400-123-4567",
              avatar: "/static/organizer-avatar.png"
            },
            venue: {
              name: "城东体育网球训练中心",
              address: "杭州市江干区城东路123号",
              latitude: 30.2741,
              longitude: 120.1551
            }
          };
          participantsList.value = [
            {
              id: 1,
              name: "张三",
              avatar: "/static/avatar1.png",
              utr: 3.2,
              level: "intermediate"
            },
            {
              id: 2,
              name: "李四",
              avatar: "/static/avatar2.png",
              utr: 2.8,
              level: "intermediate"
            },
            {
              id: 3,
              name: "王五",
              avatar: "/static/avatar3.png",
              utr: 3.5,
              level: "intermediate"
            },
            {
              id: 4,
              name: "赵六",
              avatar: "/static/avatar4.png",
              utr: 2.5,
              level: "beginner"
            },
            {
              id: 5,
              name: "钱七",
              avatar: "/static/avatar5.png",
              utr: 3.8,
              level: "advanced"
            }
          ];
          loading.value = false;
        }, 1e3);
      }
      function getActivityStatusText(status) {
        const statusMap = {
          "open": "报名中",
          "full": "已满员",
          "closed": "已结束",
          "cancelled": "已取消"
        };
        return statusMap[status] || "未知状态";
      }
      function getJoinButtonText(status) {
        const buttonMap = {
          "open": "立即报名",
          "full": "已满员",
          "closed": "已结束",
          "cancelled": "已取消"
        };
        return buttonMap[status] || "立即报名";
      }
      function getLevelText(level) {
        const levelMap = {
          "beginner": "初级",
          "intermediate": "中级",
          "advanced": "高级"
        };
        return levelMap[level] || "未知";
      }
      function joinActivity() {
        if (activity.value.status !== "open") {
          return;
        }
        uni.showModal({
          title: "确认报名",
          content: `确认报名参加「${activity.value.title}」？

活动时间：${activity.value.time}
活动地点：${activity.value.location}
费用：¥${activity.value.price}`,
          success: (res) => {
            if (res.confirm) {
              activity.value.participants++;
              if (activity.value.participants >= activity.value.maxParticipants) {
                activity.value.status = "full";
              }
              participantsList.value.push({
                id: Date.now(),
                name: "我",
                avatar: "/static/my-avatar.png",
                utr: 3,
                level: "intermediate"
              });
              uni.showToast({
                title: "报名成功",
                icon: "success"
              });
            }
          }
        });
      }
      function contactOrganizer() {
        uni.showActionSheet({
          itemList: ["拨打电话", "发送消息"],
          success: (res) => {
            if (res.tapIndex === 0) {
              uni.makePhoneCall({
                phoneNumber: activity.value.organizer.phone
              });
            } else if (res.tapIndex === 1) {
              uni.navigateTo({
                url: "/pages/customer-service/customer-service"
              });
            }
          }
        });
      }
      function openMap() {
        uni.openLocation({
          latitude: activity.value.venue.latitude,
          longitude: activity.value.venue.longitude,
          name: activity.value.venue.name,
          address: activity.value.venue.address
        });
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "page-container" }, [
          vue.createCommentVNode(" 活动头部信息 "),
          vue.createElementVNode("view", { class: "activity-header card" }, [
            vue.createElementVNode("view", { class: "header-top" }, [
              vue.createElementVNode(
                "text",
                { class: "activity-title" },
                vue.toDisplayString(activity.value.title),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["activity-status", activity.value.status])
                },
                vue.toDisplayString(getActivityStatusText(activity.value.status)),
                3
                /* TEXT, CLASS */
              )
            ]),
            vue.createElementVNode("view", { class: "activity-tags" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(activity.value.tags, (tag) => {
                  return vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      class: "tag",
                      key: tag
                    },
                    vue.toDisplayString(tag),
                    1
                    /* TEXT */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createElementVNode("view", { class: "price-section" }, [
              vue.createElementVNode("text", { class: "price-label" }, "活动费用"),
              vue.createElementVNode(
                "text",
                { class: "price-value" },
                "¥" + vue.toDisplayString(activity.value.price),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createCommentVNode(" 活动详情 "),
          vue.createElementVNode("view", { class: "activity-details card" }, [
            vue.createElementVNode("view", { class: "detail-section" }, [
              vue.createElementVNode("view", { class: "section-title" }, "活动信息"),
              vue.createElementVNode("view", { class: "detail-item" }, [
                vue.createElementVNode("image", {
                  class: "detail-icon",
                  src: "/static/icon-time.png",
                  mode: "aspectFit"
                }),
                vue.createElementVNode("view", { class: "detail-content" }, [
                  vue.createElementVNode("text", { class: "detail-label" }, "活动时间"),
                  vue.createElementVNode(
                    "text",
                    { class: "detail-value" },
                    vue.toDisplayString(activity.value.time),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "detail-item" }, [
                vue.createElementVNode("image", {
                  class: "detail-icon",
                  src: "/static/icon-location.png",
                  mode: "aspectFit"
                }),
                vue.createElementVNode("view", { class: "detail-content" }, [
                  vue.createElementVNode("text", { class: "detail-label" }, "活动地点"),
                  vue.createElementVNode(
                    "text",
                    { class: "detail-value" },
                    vue.toDisplayString(activity.value.location),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("button", {
                    class: "location-btn",
                    onClick: openMap
                  }, "查看地图")
                ])
              ]),
              vue.createElementVNode("view", { class: "detail-item" }, [
                vue.createElementVNode("image", {
                  class: "detail-icon",
                  src: "/static/icon-utr.png",
                  mode: "aspectFit"
                }),
                vue.createElementVNode("view", { class: "detail-content" }, [
                  vue.createElementVNode("text", { class: "detail-label" }, "UTR要求"),
                  vue.createElementVNode(
                    "text",
                    { class: "detail-value" },
                    vue.toDisplayString(activity.value.utrRange),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              activity.value.ageRange ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "detail-item"
              }, [
                vue.createElementVNode("image", {
                  class: "detail-icon",
                  src: "/static/icon-age.png",
                  mode: "aspectFit"
                }),
                vue.createElementVNode("view", { class: "detail-content" }, [
                  vue.createElementVNode("text", { class: "detail-label" }, "年龄要求"),
                  vue.createElementVNode(
                    "text",
                    { class: "detail-value" },
                    vue.toDisplayString(activity.value.ageRange),
                    1
                    /* TEXT */
                  )
                ])
              ])) : vue.createCommentVNode("v-if", true),
              activity.value.gender ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "detail-item"
              }, [
                vue.createElementVNode("image", {
                  class: "detail-icon",
                  src: "/static/icon-gender.png",
                  mode: "aspectFit"
                }),
                vue.createElementVNode("view", { class: "detail-content" }, [
                  vue.createElementVNode("text", { class: "detail-label" }, "性别要求"),
                  vue.createElementVNode(
                    "text",
                    { class: "detail-value" },
                    vue.toDisplayString(activity.value.gender),
                    1
                    /* TEXT */
                  )
                ])
              ])) : vue.createCommentVNode("v-if", true)
            ])
          ]),
          vue.createCommentVNode(" 报名情况 "),
          vue.createElementVNode("view", { class: "participants-section card" }, [
            vue.createElementVNode("view", { class: "section-title" }, "报名情况"),
            vue.createElementVNode("view", { class: "participants-stats" }, [
              vue.createElementVNode("view", { class: "stat-item" }, [
                vue.createElementVNode(
                  "text",
                  { class: "stat-number" },
                  vue.toDisplayString(activity.value.participants),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "stat-label" }, "已报名")
              ]),
              vue.createElementVNode("view", { class: "stat-divider" }, "/"),
              vue.createElementVNode("view", { class: "stat-item" }, [
                vue.createElementVNode(
                  "text",
                  { class: "stat-number" },
                  vue.toDisplayString(activity.value.maxParticipants),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "stat-label" }, "总名额")
              ])
            ]),
            vue.createElementVNode("view", { class: "progress-section" }, [
              vue.createElementVNode("view", { class: "progress-bar" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "progress-fill",
                    style: vue.normalizeStyle({ width: activity.value.participants / activity.value.maxParticipants * 100 + "%" })
                  },
                  null,
                  4
                  /* STYLE */
                )
              ]),
              vue.createElementVNode(
                "text",
                { class: "progress-text" },
                " 还剩 " + vue.toDisplayString(activity.value.maxParticipants - activity.value.participants) + " 个名额 ",
                1
                /* TEXT */
              )
            ]),
            vue.createCommentVNode(" 已报名用户列表 "),
            participantsList.value.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "participants-list"
            }, [
              vue.createElementVNode("text", { class: "list-title" }, "已报名用户"),
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(participantsList.value, (participant) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "participant-item",
                    key: participant.id
                  }, [
                    vue.createElementVNode("image", {
                      class: "participant-avatar",
                      src: participant.avatar,
                      mode: "aspectFill"
                    }, null, 8, ["src"]),
                    vue.createElementVNode("view", { class: "participant-info" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "participant-name" },
                        vue.toDisplayString(participant.name),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "participant-utr" },
                        "UTR " + vue.toDisplayString(participant.utr),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(["participant-level", participant.level])
                      },
                      vue.toDisplayString(getLevelText(participant.level)),
                      3
                      /* TEXT, CLASS */
                    )
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createCommentVNode(" 活动描述 "),
          activity.value.description ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "description-section card"
          }, [
            vue.createElementVNode("view", { class: "section-title" }, "活动描述"),
            vue.createElementVNode(
              "text",
              { class: "description-text" },
              vue.toDisplayString(activity.value.description),
              1
              /* TEXT */
            )
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 注意事项 "),
          vue.createElementVNode("view", { class: "notice-section card" }, [
            vue.createElementVNode("view", { class: "section-title" }, "注意事项"),
            vue.createElementVNode("view", { class: "notice-list" }, [
              vue.createElementVNode("text", { class: "notice-item" }, "• 请提前15分钟到达场地"),
              vue.createElementVNode("text", { class: "notice-item" }, "• 请自备球拍和运动装备"),
              vue.createElementVNode("text", { class: "notice-item" }, "• 如需取消报名，请提前24小时联系客服"),
              vue.createElementVNode("text", { class: "notice-item" }, "• 活动期间请注意安全，量力而行"),
              vue.createElementVNode("text", { class: "notice-item" }, "• 遇恶劣天气活动可能延期或取消")
            ])
          ]),
          vue.createCommentVNode(" 底部操作栏 "),
          vue.createElementVNode("view", { class: "bottom-actions" }, [
            vue.createElementVNode("button", {
              class: "contact-btn",
              onClick: contactOrganizer
            }, "联系主办方"),
            vue.createElementVNode("button", {
              class: vue.normalizeClass(["join-btn", { disabled: activity.value.status !== "open" }]),
              onClick: joinActivity,
              disabled: activity.value.status !== "open"
            }, vue.toDisplayString(getJoinButtonText(activity.value.status)), 11, ["disabled"])
          ])
        ]);
      };
    }
  });
  const PagesActivityDetailActivityDetail = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-47f02b22"], ["__file", "/Users/private/Documents/code/vue/tennis-app/src/pages/activity-detail/activity-detail.vue"]]);
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    __name: "my-orders",
    setup(__props) {
      const orderList = vue.ref([]);
      const currentStatus = vue.ref("all");
      const loading = vue.ref(false);
      const statusOptions = vue.ref([
        { key: "all", label: "全部" },
        { key: "pending", label: "待支付" },
        { key: "paid", label: "已支付" },
        { key: "completed", label: "已完成" },
        { key: "cancelled", label: "已取消" }
      ]);
      const filteredOrders = vue.computed(() => {
        if (currentStatus.value === "all") {
          return orderList.value;
        }
        return orderList.value.filter((order) => order.status === currentStatus.value);
      });
      vue.onMounted(() => {
        loadOrderList();
      });
      onLoad((options) => {
        if (options.status) {
          currentStatus.value = options.status;
        }
      });
      function loadOrderList() {
        loading.value = true;
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
              createTime: "2024-01-15 10:30:00"
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
              createTime: "2024-01-14 15:20:00"
            }
          ];
          loading.value = false;
        }, 1e3);
      }
      function switchStatus(status) {
        currentStatus.value = status;
      }
      function getStatusText(status) {
        const statusMap = {
          "pending": "待支付",
          "paid": "已支付",
          "completed": "已完成",
          "cancelled": "已取消"
        };
        return statusMap[status] || "未知状态";
      }
      function cancelOrder(orderId) {
        uni.showModal({
          title: "确认取消",
          content: "确定要取消这个订单吗？",
          success: (res) => {
            if (res.confirm) {
              formatAppLog("log", "at pages/my-orders/my-orders.vue:195", "取消订单:", orderId);
            }
          }
        });
      }
      function payOrder(orderId) {
        formatAppLog("log", "at pages/my-orders/my-orders.vue:203", "支付订单:", orderId);
      }
      function rateOrder(orderId) {
        formatAppLog("log", "at pages/my-orders/my-orders.vue:209", "评价订单:", orderId);
      }
      function goToOrderDetail(orderId) {
        uni.navigateTo({
          url: `/pages/order-detail/order-detail?id=${orderId}`
        });
      }
      function goToBooking() {
        uni.navigateTo({
          url: "/pages/booking/booking"
        });
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "page-container" }, [
          vue.createCommentVNode(" 订单状态筛选 "),
          vue.createElementVNode("view", { class: "status-tabs" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(statusOptions.value, (status) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: vue.normalizeClass(["tab-item", { active: currentStatus.value === status.key }]),
                  key: status.key,
                  onClick: ($event) => switchStatus(status.key)
                }, vue.toDisplayString(status.label), 11, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createCommentVNode(" 订单列表 "),
          orderList.value.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "order-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(vue.unref(filteredOrders), (order) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "order-item card",
                  key: order.id,
                  onClick: ($event) => goToOrderDetail(order.id)
                }, [
                  vue.createElementVNode("view", { class: "order-header" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "order-number" },
                      "订单号：" + vue.toDisplayString(order.orderNumber),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(["order-status", order.status])
                      },
                      vue.toDisplayString(getStatusText(order.status)),
                      3
                      /* TEXT, CLASS */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "order-content" }, [
                    vue.createElementVNode("image", {
                      class: "venue-image",
                      src: order.venueImage,
                      mode: "aspectFill"
                    }, null, 8, ["src"]),
                    vue.createElementVNode("view", { class: "order-info" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "venue-name" },
                        vue.toDisplayString(order.venueName),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "court-info" },
                        vue.toDisplayString(order.courtType) + " · " + vue.toDisplayString(order.courtNumber) + "号场",
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "time-info" },
                        vue.toDisplayString(order.date) + " " + vue.toDisplayString(order.timeSlot),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "price-info" },
                        "￥" + vue.toDisplayString(order.totalPrice),
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "order-actions" }, [
                    order.status === "pending" ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 0,
                      class: "action-btn",
                      onClick: vue.withModifiers(($event) => cancelOrder(order.id), ["stop"])
                    }, " 取消订单 ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                    order.status === "pending" ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 1,
                      class: "action-btn primary",
                      onClick: vue.withModifiers(($event) => payOrder(order.id), ["stop"])
                    }, " 立即支付 ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                    order.status === "completed" ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 2,
                      class: "action-btn",
                      onClick: vue.withModifiers(($event) => rateOrder(order.id), ["stop"])
                    }, " 评价 ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 1 },
            [
              vue.createCommentVNode(" 空状态 "),
              vue.createElementVNode("view", { class: "empty-state" }, [
                vue.createElementVNode("text", { class: "empty-text" }, "暂无订单"),
                vue.createElementVNode("text", { class: "empty-tip" }, "去预订一个场地吧"),
                vue.createElementVNode("button", {
                  class: "go-booking-btn",
                  onClick: goToBooking
                }, "立即预订")
              ])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          ))
        ]);
      };
    }
  });
  const PagesMyOrdersMyOrders = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-fa8e2822"], ["__file", "/Users/private/Documents/code/vue/tennis-app/src/pages/my-orders/my-orders.vue"]]);
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    __name: "my-activities",
    setup(__props) {
      const activityList = vue.ref([]);
      const currentStatus = vue.ref("all");
      const loading = vue.ref(false);
      const statusOptions = vue.ref([
        { key: "all", label: "全部" },
        { key: "registered", label: "已报名" },
        { key: "completed", label: "已完成" },
        { key: "cancelled", label: "已取消" }
      ]);
      const filteredActivities = vue.computed(() => {
        if (currentStatus.value === "all") {
          return activityList.value;
        }
        return activityList.value.filter((activity) => activity.status === currentStatus.value);
      });
      vue.onMounted(() => {
        loadActivityList();
      });
      onLoad((options) => {
        if (options.status) {
          currentStatus.value = options.status;
        }
      });
      function loadActivityList() {
        loading.value = true;
        setTimeout(() => {
          activityList.value = [
            {
              id: 1,
              title: "周末UTR积分赛",
              time: "2024-01-20 14:00-18:00",
              location: "星河网球俱乐部",
              utrRange: "4.0-6.0",
              participants: 8,
              maxParticipants: 16,
              status: "registered",
              registerTime: "2024-01-15 10:30:00",
              fee: 100
            },
            {
              id: 2,
              title: "新手友谊赛",
              time: "2024-01-18 16:00-18:00",
              location: "蓝天网球中心",
              utrRange: "2.0-4.0",
              participants: 12,
              maxParticipants: 12,
              status: "completed",
              registerTime: "2024-01-14 15:20:00",
              fee: 50
            }
          ];
          loading.value = false;
        }, 1e3);
      }
      function switchStatus(status) {
        currentStatus.value = status;
      }
      function getStatusText(status) {
        const statusMap = {
          "registered": "已报名",
          "completed": "已完成",
          "cancelled": "已取消"
        };
        return statusMap[status] || "未知状态";
      }
      function cancelActivity(activityId) {
        uni.showModal({
          title: "确认取消",
          content: "确定要取消报名吗？",
          success: (res) => {
            if (res.confirm) {
              formatAppLog("log", "at pages/my-activities/my-activities.vue:192", "取消报名:", activityId);
            }
          }
        });
      }
      function rateActivity(activityId) {
        formatAppLog("log", "at pages/my-activities/my-activities.vue:200", "评价活动:", activityId);
      }
      function goToActivityDetail(activityId) {
        uni.navigateTo({
          url: `/pages/activity-detail/activity-detail?id=${activityId}`
        });
      }
      function goToActivities() {
        uni.navigateTo({
          url: "/pages/activities/activities"
        });
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "page-container" }, [
          vue.createCommentVNode(" 活动状态筛选 "),
          vue.createElementVNode("view", { class: "status-tabs" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(statusOptions.value, (status) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: vue.normalizeClass(["tab-item", { active: currentStatus.value === status.key }]),
                  key: status.key,
                  onClick: ($event) => switchStatus(status.key)
                }, vue.toDisplayString(status.label), 11, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createCommentVNode(" 活动列表 "),
          activityList.value.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "activity-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(vue.unref(filteredActivities), (activity) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "activity-item card",
                  key: activity.id,
                  onClick: ($event) => goToActivityDetail(activity.id)
                }, [
                  vue.createElementVNode("view", { class: "activity-header" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "activity-title" },
                      vue.toDisplayString(activity.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(["activity-status", activity.status])
                      },
                      vue.toDisplayString(getStatusText(activity.status)),
                      3
                      /* TEXT, CLASS */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "activity-info" }, [
                    vue.createElementVNode("view", { class: "info-row" }, [
                      vue.createElementVNode("text", { class: "info-label" }, "时间:"),
                      vue.createElementVNode(
                        "text",
                        { class: "info-value" },
                        vue.toDisplayString(activity.time),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "info-row" }, [
                      vue.createElementVNode("text", { class: "info-label" }, "地点:"),
                      vue.createElementVNode(
                        "text",
                        { class: "info-value" },
                        vue.toDisplayString(activity.location),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "info-row" }, [
                      vue.createElementVNode("text", { class: "info-label" }, "UTR要求:"),
                      vue.createElementVNode(
                        "text",
                        { class: "info-value" },
                        vue.toDisplayString(activity.utrRange),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "info-row" }, [
                      vue.createElementVNode("text", { class: "info-label" }, "参与人数:"),
                      vue.createElementVNode(
                        "text",
                        { class: "info-value" },
                        vue.toDisplayString(activity.participants) + "/" + vue.toDisplayString(activity.maxParticipants),
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "activity-actions" }, [
                    activity.status === "registered" ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 0,
                      class: "action-btn",
                      onClick: vue.withModifiers(($event) => cancelActivity(activity.id), ["stop"])
                    }, " 取消报名 ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                    activity.status === "completed" ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 1,
                      class: "action-btn primary",
                      onClick: vue.withModifiers(($event) => rateActivity(activity.id), ["stop"])
                    }, " 评价活动 ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 1 },
            [
              vue.createCommentVNode(" 空状态 "),
              vue.createElementVNode("view", { class: "empty-state" }, [
                vue.createElementVNode("text", { class: "empty-text" }, "暂无活动记录"),
                vue.createElementVNode("text", { class: "empty-tip" }, "去参加一个UTR活动吧"),
                vue.createElementVNode("button", {
                  class: "go-activities-btn",
                  onClick: goToActivities
                }, "查看活动")
              ])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          ))
        ]);
      };
    }
  });
  const PagesMyActivitiesMyActivities = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-22e95da8"], ["__file", "/Users/private/Documents/code/vue/tennis-app/src/pages/my-activities/my-activities.vue"]]);
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    __name: "apply-club",
    setup(__props) {
      const formData = vue.ref({
        clubName: "",
        description: "",
        address: "",
        phone: "",
        courtCount: "",
        courtType: "",
        businessHours: "",
        licenseImage: "",
        courtImages: [],
        contactName: "",
        contactPosition: "",
        wechat: ""
      });
      const courtTypes = vue.ref(["室内硬地", "室外硬地", "红土场", "草地场", "人工草场"]);
      const courtTypeIndex = vue.ref(0);
      const isFormValid = vue.computed(() => {
        return formData.value.clubName && formData.value.description && formData.value.address && formData.value.phone && formData.value.courtCount && formData.value.courtType && formData.value.businessHours && formData.value.licenseImage && formData.value.courtImages.length > 0 && formData.value.contactName;
      });
      vue.onMounted(() => {
      });
      onLoad((options) => {
      });
      function onCourtTypeChange(e) {
        courtTypeIndex.value = e.detail.value;
        formData.value.courtType = courtTypes.value[e.detail.value];
      }
      function uploadLicense() {
        uni.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: (res) => {
            formData.value.licenseImage = res.tempFilePaths[0];
          },
          fail: (err) => {
            formatAppLog("log", "at pages/apply-club/apply-club.vue:265", "上传失败:", err);
          }
        });
      }
      function uploadCourtImage() {
        const remainCount = 6 - formData.value.courtImages.length;
        uni.chooseImage({
          count: remainCount,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: (res) => {
            formData.value.courtImages.push(...res.tempFilePaths);
          },
          fail: (err) => {
            formatAppLog("log", "at pages/apply-club/apply-club.vue:281", "上传失败:", err);
          }
        });
      }
      function previewImage(image) {
        uni.previewImage({
          urls: [image],
          current: image
        });
      }
      function deleteImage(index) {
        formData.value.courtImages.splice(index, 1);
      }
      function submitApplication() {
        if (!isFormValid.value) {
          uni.showToast({
            title: "请填写完整信息",
            icon: "none"
          });
          return;
        }
        uni.showLoading({
          title: "提交中..."
        });
        setTimeout(() => {
          uni.hideLoading();
          uni.showModal({
            title: "申请提交成功",
            content: "我们将在3个工作日内审核您的申请，请耐心等待",
            showCancel: false,
            success: () => {
              uni.navigateBack();
            }
          });
        }, 2e3);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "page-container" }, [
          vue.createCommentVNode(" 页面标题 "),
          vue.createElementVNode("view", { class: "page-header" }, [
            vue.createElementVNode("text", { class: "page-title" }, "申请创建俱乐部"),
            vue.createElementVNode("text", { class: "page-subtitle" }, "填写以下信息，我们将尽快审核您的申请")
          ]),
          vue.createCommentVNode(" 申请表单 "),
          vue.createElementVNode("view", { class: "form-container" }, [
            vue.createCommentVNode(" 俱乐部基本信息 "),
            vue.createElementVNode("view", { class: "form-section" }, [
              vue.createElementVNode("text", { class: "section-title" }, "俱乐部基本信息"),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "俱乐部名称 *"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => formData.value.clubName = $event),
                    placeholder: "请输入俱乐部名称",
                    maxlength: "50"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, formData.value.clubName]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "俱乐部简介 *"),
                vue.withDirectives(vue.createElementVNode(
                  "textarea",
                  {
                    class: "form-textarea",
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => formData.value.description = $event),
                    placeholder: "请简要介绍俱乐部的特色和服务",
                    maxlength: "500"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, formData.value.description]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "俱乐部地址 *"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => formData.value.address = $event),
                    placeholder: "请输入详细地址",
                    maxlength: "100"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, formData.value.address]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "联系电话 *"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => formData.value.phone = $event),
                    placeholder: "请输入联系电话",
                    type: "number",
                    maxlength: "11"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, formData.value.phone]
                ])
              ])
            ]),
            vue.createCommentVNode(" 场地信息 "),
            vue.createElementVNode("view", { class: "form-section" }, [
              vue.createElementVNode("text", { class: "section-title" }, "场地信息"),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "场地数量 *"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => formData.value.courtCount = $event),
                    placeholder: "请输入场地数量",
                    type: "number"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, formData.value.courtCount]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "场地类型 *"),
                vue.createElementVNode("picker", {
                  class: "form-picker",
                  value: courtTypeIndex.value,
                  range: courtTypes.value,
                  onChange: onCourtTypeChange
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "picker-text" },
                    vue.toDisplayString(courtTypes.value[courtTypeIndex.value] || "请选择场地类型"),
                    1
                    /* TEXT */
                  )
                ], 40, ["value", "range"])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "营业时间 *"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => formData.value.businessHours = $event),
                    placeholder: "例如：06:00-22:00",
                    maxlength: "20"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, formData.value.businessHours]
                ])
              ])
            ]),
            vue.createCommentVNode(" 资质证明 "),
            vue.createElementVNode("view", { class: "form-section" }, [
              vue.createElementVNode("text", { class: "section-title" }, "资质证明"),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "营业执照 *"),
                vue.createElementVNode("view", {
                  class: "upload-area",
                  onClick: uploadLicense
                }, [
                  formData.value.licenseImage ? (vue.openBlock(), vue.createElementBlock("image", {
                    key: 0,
                    class: "upload-image",
                    src: formData.value.licenseImage,
                    mode: "aspectFill"
                  }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock("view", {
                    key: 1,
                    class: "upload-placeholder"
                  }, [
                    vue.createElementVNode("text", { class: "upload-icon" }, "+"),
                    vue.createElementVNode("text", { class: "upload-text" }, "上传营业执照")
                  ]))
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "场地照片 *"),
                vue.createElementVNode("view", { class: "upload-grid" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(formData.value.courtImages, (image, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "upload-item",
                        key: index,
                        onClick: ($event) => previewImage(image)
                      }, [
                        vue.createElementVNode("image", {
                          class: "upload-image",
                          src: image,
                          mode: "aspectFill"
                        }, null, 8, ["src"]),
                        vue.createElementVNode("view", {
                          class: "delete-btn",
                          onClick: vue.withModifiers(($event) => deleteImage(index), ["stop"])
                        }, "×", 8, ["onClick"])
                      ], 8, ["onClick"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  )),
                  formData.value.courtImages.length < 6 ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "upload-item upload-placeholder",
                    onClick: uploadCourtImage
                  }, [
                    vue.createElementVNode("text", { class: "upload-icon" }, "+"),
                    vue.createElementVNode("text", { class: "upload-text" }, "添加照片")
                  ])) : vue.createCommentVNode("v-if", true)
                ]),
                vue.createElementVNode("text", { class: "upload-tip" }, "最多上传6张场地照片")
              ])
            ]),
            vue.createCommentVNode(" 联系人信息 "),
            vue.createElementVNode("view", { class: "form-section" }, [
              vue.createElementVNode("text", { class: "section-title" }, "联系人信息"),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "联系人姓名 *"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => formData.value.contactName = $event),
                    placeholder: "请输入联系人姓名",
                    maxlength: "20"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, formData.value.contactName]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "联系人职位"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => formData.value.contactPosition = $event),
                    placeholder: "请输入联系人职位",
                    maxlength: "30"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, formData.value.contactPosition]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "微信号"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => formData.value.wechat = $event),
                    placeholder: "请输入微信号",
                    maxlength: "50"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, formData.value.wechat]
                ])
              ])
            ])
          ]),
          vue.createCommentVNode(" 提交按钮 "),
          vue.createElementVNode("view", { class: "submit-container" }, [
            vue.createElementVNode("button", {
              class: "submit-btn",
              onClick: submitApplication,
              disabled: !vue.unref(isFormValid)
            }, " 提交申请 ", 8, ["disabled"]),
            vue.createElementVNode("text", { class: "submit-tip" }, "提交后我们将在3个工作日内审核并回复")
          ])
        ]);
      };
    }
  });
  const PagesApplyClubApplyClub = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-42a741ad"], ["__file", "/Users/private/Documents/code/vue/tennis-app/src/pages/apply-club/apply-club.vue"]]);
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "apply-coach",
    setup(__props) {
      const formData = vue.ref({
        realName: "",
        gender: "",
        age: "",
        phone: "",
        city: "",
        experience: "",
        skills: [],
        introduction: "",
        level: "",
        certificates: [],
        idCardFront: "",
        idCardBack: "",
        privatePrice: "",
        groupPrice: "",
        sparringPrice: "",
        weekdayTime: "",
        weekendTime: ""
      });
      const genders = vue.ref(["男", "女"]);
      const genderIndex = vue.ref(0);
      const experienceOptions = vue.ref(["1年以下", "1-3年", "3-5年", "5-10年", "10年以上"]);
      const experienceIndex = vue.ref(0);
      const skillOptions = vue.ref(["基础教学", "技术提升", "战术指导", "体能训练", "青少年培训", "成人培训"]);
      const levelOptions = vue.ref(["初级教练", "PTR认证", "ITF认证", "USPTA认证", "国家级教练"]);
      const levelIndex = vue.ref(0);
      const isFormValid = vue.computed(() => {
        return formData.value.realName && formData.value.gender && formData.value.age && formData.value.phone && formData.value.city && formData.value.experience && formData.value.skills.length > 0 && formData.value.introduction && formData.value.level && formData.value.certificates.length > 0 && formData.value.idCardFront && formData.value.idCardBack && formData.value.privatePrice;
      });
      vue.onMounted(() => {
      });
      onLoad((options) => {
      });
      function onGenderChange(e) {
        genderIndex.value = e.detail.value;
        formData.value.gender = genders.value[e.detail.value];
      }
      function onExperienceChange(e) {
        experienceIndex.value = e.detail.value;
        formData.value.experience = experienceOptions.value[e.detail.value];
      }
      function onLevelChange(e) {
        levelIndex.value = e.detail.value;
        formData.value.level = levelOptions.value[e.detail.value];
      }
      function toggleSkill(skill) {
        const index = formData.value.skills.indexOf(skill);
        if (index > -1) {
          formData.value.skills.splice(index, 1);
        } else {
          formData.value.skills.push(skill);
        }
      }
      function uploadCertificate() {
        const remainCount = 3 - formData.value.certificates.length;
        uni.chooseImage({
          count: remainCount,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: (res) => {
            formData.value.certificates.push(...res.tempFilePaths);
          },
          fail: (err) => {
            formatAppLog("log", "at pages/apply-coach/apply-coach.vue:398", "上传失败:", err);
          }
        });
      }
      function deleteCertificate(index) {
        formData.value.certificates.splice(index, 1);
      }
      function uploadIdFront() {
        uni.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: (res) => {
            formData.value.idCardFront = res.tempFilePaths[0];
          },
          fail: (err) => {
            formatAppLog("log", "at pages/apply-coach/apply-coach.vue:418", "上传失败:", err);
          }
        });
      }
      function uploadIdBack() {
        uni.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: (res) => {
            formData.value.idCardBack = res.tempFilePaths[0];
          },
          fail: (err) => {
            formatAppLog("log", "at pages/apply-coach/apply-coach.vue:433", "上传失败:", err);
          }
        });
      }
      function previewImage(image) {
        uni.previewImage({
          urls: [image],
          current: image
        });
      }
      function submitApplication() {
        if (!isFormValid.value) {
          uni.showToast({
            title: "请填写完整信息",
            icon: "none"
          });
          return;
        }
        uni.showLoading({
          title: "提交中..."
        });
        setTimeout(() => {
          uni.hideLoading();
          uni.showModal({
            title: "申请提交成功",
            content: "我们将在3个工作日内审核您的申请，请耐心等待",
            showCancel: false,
            success: () => {
              uni.navigateBack();
            }
          });
        }, 2e3);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "page-container" }, [
          vue.createCommentVNode(" 页面标题 "),
          vue.createElementVNode("view", { class: "page-header" }, [
            vue.createElementVNode("text", { class: "page-title" }, "申请成为教练"),
            vue.createElementVNode("text", { class: "page-subtitle" }, "加入我们的教练团队，分享您的网球技能")
          ]),
          vue.createCommentVNode(" 申请表单 "),
          vue.createElementVNode("view", { class: "form-container" }, [
            vue.createCommentVNode(" 个人基本信息 "),
            vue.createElementVNode("view", { class: "form-section" }, [
              vue.createElementVNode("text", { class: "section-title" }, "个人基本信息"),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "真实姓名 *"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => formData.value.realName = $event),
                    placeholder: "请输入真实姓名",
                    maxlength: "20"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, formData.value.realName]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "性别 *"),
                vue.createElementVNode("picker", {
                  class: "form-picker",
                  value: genderIndex.value,
                  range: genders.value,
                  onChange: onGenderChange
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "picker-text" },
                    vue.toDisplayString(genders.value[genderIndex.value] || "请选择性别"),
                    1
                    /* TEXT */
                  )
                ], 40, ["value", "range"])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "年龄 *"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => formData.value.age = $event),
                    placeholder: "请输入年龄",
                    type: "number"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, formData.value.age]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "联系电话 *"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => formData.value.phone = $event),
                    placeholder: "请输入联系电话",
                    type: "number",
                    maxlength: "11"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, formData.value.phone]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "所在城市 *"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => formData.value.city = $event),
                    placeholder: "请输入所在城市",
                    maxlength: "20"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, formData.value.city]
                ])
              ])
            ]),
            vue.createCommentVNode(" 教学经验 "),
            vue.createElementVNode("view", { class: "form-section" }, [
              vue.createElementVNode("text", { class: "section-title" }, "教学经验"),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "教学年限 *"),
                vue.createElementVNode("picker", {
                  class: "form-picker",
                  value: experienceIndex.value,
                  range: experienceOptions.value,
                  onChange: onExperienceChange
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "picker-text" },
                    vue.toDisplayString(experienceOptions.value[experienceIndex.value] || "请选择教学年限"),
                    1
                    /* TEXT */
                  )
                ], 40, ["value", "range"])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "擅长领域 *"),
                vue.createElementVNode("view", { class: "checkbox-group" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(skillOptions.value, (skill, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "checkbox-item",
                        key: index,
                        onClick: ($event) => toggleSkill(skill)
                      }, [
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass(["checkbox", { checked: formData.value.skills.includes(skill) }])
                          },
                          [
                            formData.value.skills.includes(skill) ? (vue.openBlock(), vue.createElementBlock("text", {
                              key: 0,
                              class: "check-icon"
                            }, "✓")) : vue.createCommentVNode("v-if", true)
                          ],
                          2
                          /* CLASS */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "checkbox-label" },
                          vue.toDisplayString(skill),
                          1
                          /* TEXT */
                        )
                      ], 8, ["onClick"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "个人简介 *"),
                vue.withDirectives(vue.createElementVNode(
                  "textarea",
                  {
                    class: "form-textarea",
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => formData.value.introduction = $event),
                    placeholder: "请介绍您的教学理念、特色和成就",
                    maxlength: "500"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, formData.value.introduction]
                ])
              ])
            ]),
            vue.createCommentVNode(" 资质证书 "),
            vue.createElementVNode("view", { class: "form-section" }, [
              vue.createElementVNode("text", { class: "section-title" }, "资质证书"),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "教练等级 *"),
                vue.createElementVNode("picker", {
                  class: "form-picker",
                  value: levelIndex.value,
                  range: levelOptions.value,
                  onChange: onLevelChange
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "picker-text" },
                    vue.toDisplayString(levelOptions.value[levelIndex.value] || "请选择教练等级"),
                    1
                    /* TEXT */
                  )
                ], 40, ["value", "range"])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "证书照片 *"),
                vue.createElementVNode("view", { class: "upload-grid" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(formData.value.certificates, (image, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "upload-item",
                        key: index,
                        onClick: ($event) => previewImage(image)
                      }, [
                        vue.createElementVNode("image", {
                          class: "upload-image",
                          src: image,
                          mode: "aspectFill"
                        }, null, 8, ["src"]),
                        vue.createElementVNode("view", {
                          class: "delete-btn",
                          onClick: vue.withModifiers(($event) => deleteCertificate(index), ["stop"])
                        }, "×", 8, ["onClick"])
                      ], 8, ["onClick"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  )),
                  formData.value.certificates.length < 3 ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "upload-item upload-placeholder",
                    onClick: uploadCertificate
                  }, [
                    vue.createElementVNode("text", { class: "upload-icon" }, "+"),
                    vue.createElementVNode("text", { class: "upload-text" }, "添加证书")
                  ])) : vue.createCommentVNode("v-if", true)
                ]),
                vue.createElementVNode("text", { class: "upload-tip" }, "最多上传3张证书照片")
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "身份证照片 *"),
                vue.createElementVNode("view", { class: "id-upload" }, [
                  vue.createElementVNode("view", { class: "id-item" }, [
                    vue.createElementVNode("text", { class: "id-label" }, "身份证正面"),
                    vue.createElementVNode("view", {
                      class: "upload-area",
                      onClick: uploadIdFront
                    }, [
                      formData.value.idCardFront ? (vue.openBlock(), vue.createElementBlock("image", {
                        key: 0,
                        class: "upload-image",
                        src: formData.value.idCardFront,
                        mode: "aspectFill"
                      }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock("view", {
                        key: 1,
                        class: "upload-placeholder"
                      }, [
                        vue.createElementVNode("text", { class: "upload-icon" }, "+"),
                        vue.createElementVNode("text", { class: "upload-text" }, "上传正面")
                      ]))
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "id-item" }, [
                    vue.createElementVNode("text", { class: "id-label" }, "身份证反面"),
                    vue.createElementVNode("view", {
                      class: "upload-area",
                      onClick: uploadIdBack
                    }, [
                      formData.value.idCardBack ? (vue.openBlock(), vue.createElementBlock("image", {
                        key: 0,
                        class: "upload-image",
                        src: formData.value.idCardBack,
                        mode: "aspectFill"
                      }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock("view", {
                        key: 1,
                        class: "upload-placeholder"
                      }, [
                        vue.createElementVNode("text", { class: "upload-icon" }, "+"),
                        vue.createElementVNode("text", { class: "upload-text" }, "上传反面")
                      ]))
                    ])
                  ])
                ])
              ])
            ]),
            vue.createCommentVNode(" 收费标准 "),
            vue.createElementVNode("view", { class: "form-section" }, [
              vue.createElementVNode("text", { class: "section-title" }, "收费标准"),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "一对一私教课 *"),
                vue.createElementVNode("view", { class: "price-input" }, [
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      class: "form-input price-field",
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => formData.value.privatePrice = $event),
                      placeholder: "请输入价格",
                      type: "number"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, formData.value.privatePrice]
                  ]),
                  vue.createElementVNode("text", { class: "price-unit" }, "元/小时")
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "小组课程"),
                vue.createElementVNode("view", { class: "price-input" }, [
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      class: "form-input price-field",
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => formData.value.groupPrice = $event),
                      placeholder: "请输入价格",
                      type: "number"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, formData.value.groupPrice]
                  ]),
                  vue.createElementVNode("text", { class: "price-unit" }, "元/小时")
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "陪练服务"),
                vue.createElementVNode("view", { class: "price-input" }, [
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      class: "form-input price-field",
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => formData.value.sparringPrice = $event),
                      placeholder: "请输入价格",
                      type: "number"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, formData.value.sparringPrice]
                  ]),
                  vue.createElementVNode("text", { class: "price-unit" }, "元/小时")
                ])
              ])
            ]),
            vue.createCommentVNode(" 可授课时间 "),
            vue.createElementVNode("view", { class: "form-section" }, [
              vue.createElementVNode("text", { class: "section-title" }, "可授课时间"),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "工作日时间"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => formData.value.weekdayTime = $event),
                    placeholder: "例如：18:00-21:00",
                    maxlength: "20"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, formData.value.weekdayTime]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "form-label" }, "周末时间"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => formData.value.weekendTime = $event),
                    placeholder: "例如：09:00-18:00",
                    maxlength: "20"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, formData.value.weekendTime]
                ])
              ])
            ])
          ]),
          vue.createCommentVNode(" 提交按钮 "),
          vue.createElementVNode("view", { class: "submit-container" }, [
            vue.createElementVNode("button", {
              class: "submit-btn",
              onClick: submitApplication,
              disabled: !vue.unref(isFormValid)
            }, " 提交申请 ", 8, ["disabled"]),
            vue.createElementVNode("text", { class: "submit-tip" }, "提交后我们将在3个工作日内审核并回复")
          ])
        ]);
      };
    }
  });
  const PagesApplyCoachApplyCoach = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-9fcb475a"], ["__file", "/Users/private/Documents/code/vue/tennis-app/src/pages/apply-coach/apply-coach.vue"]]);
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "my-coaches",
    setup(__props) {
      const bookingList = vue.ref([]);
      const currentStatus = vue.ref("all");
      const loading = vue.ref(false);
      const statusOptions = vue.ref([
        { key: "all", label: "全部" },
        { key: "pending", label: "待确认" },
        { key: "confirmed", label: "已确认" },
        { key: "completed", label: "已完成" },
        { key: "cancelled", label: "已取消" }
      ]);
      const filteredBookings = vue.computed(() => {
        if (currentStatus.value === "all") {
          return bookingList.value;
        }
        return bookingList.value.filter((booking) => booking.status === currentStatus.value);
      });
      vue.onMounted(() => {
        loadBookingList();
      });
      onLoad((options) => {
        if (options.status) {
          currentStatus.value = options.status;
        }
      });
      function loadBookingList() {
        loading.value = true;
        setTimeout(() => {
          bookingList.value = [
            {
              id: 1,
              coach: {
                id: 1,
                name: "张教练",
                avatar: "/static/images/coach1.jpg",
                level: "PTR认证教练",
                phone: "13800138001"
              },
              time: "2024-01-20 14:00-16:00",
              location: "星河网球俱乐部",
              courseType: "一对一私教课",
              price: 300,
              status: "confirmed",
              bookingTime: "2024-01-15 10:30:00"
            },
            {
              id: 2,
              coach: {
                id: 2,
                name: "李教练",
                avatar: "/static/images/coach2.jpg",
                level: "ITF认证教练",
                phone: "13800138002"
              },
              time: "2024-01-18 16:00-17:00",
              location: "蓝天网球中心",
              courseType: "技术指导课",
              price: 200,
              status: "completed",
              bookingTime: "2024-01-14 15:20:00"
            }
          ];
          loading.value = false;
        }, 1e3);
      }
      function switchStatus(status) {
        currentStatus.value = status;
      }
      function getStatusText(status) {
        const statusMap = {
          "pending": "待确认",
          "confirmed": "已确认",
          "completed": "已完成",
          "cancelled": "已取消"
        };
        return statusMap[status] || "未知状态";
      }
      function cancelBooking(bookingId) {
        uni.showModal({
          title: "确认取消",
          content: "确定要取消预约吗？",
          success: (res) => {
            if (res.confirm) {
              formatAppLog("log", "at pages/my-coaches/my-coaches.vue:227", "取消预约:", bookingId);
            }
          }
        });
      }
      function contactCoach(phone) {
        uni.makePhoneCall({
          phoneNumber: phone,
          success: () => {
            formatAppLog("log", "at pages/my-coaches/my-coaches.vue:238", "拨打电话成功");
          },
          fail: (err) => {
            formatAppLog("log", "at pages/my-coaches/my-coaches.vue:241", "拨打电话失败:", err);
            uni.showToast({
              title: "拨打失败",
              icon: "none"
            });
          }
        });
      }
      function rateCoach(bookingId) {
        formatAppLog("log", "at pages/my-coaches/my-coaches.vue:252", "评价教练:", bookingId);
      }
      function reschedule(bookingId) {
        formatAppLog("log", "at pages/my-coaches/my-coaches.vue:258", "改期:", bookingId);
      }
      function goToCoaches() {
        uni.navigateTo({
          url: "/pages/coaches/coaches"
        });
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "page-container" }, [
          vue.createCommentVNode(" 预约状态筛选 "),
          vue.createElementVNode("view", { class: "status-tabs" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(statusOptions.value, (status) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: vue.normalizeClass(["tab-item", { active: currentStatus.value === status.key }]),
                  key: status.key,
                  onClick: ($event) => switchStatus(status.key)
                }, vue.toDisplayString(status.label), 11, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createCommentVNode(" 预约列表 "),
          bookingList.value.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "booking-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(vue.unref(filteredBookings), (booking) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "booking-item card",
                  key: booking.id
                }, [
                  vue.createElementVNode("view", { class: "booking-header" }, [
                    vue.createElementVNode("view", { class: "coach-info" }, [
                      vue.createElementVNode("image", {
                        class: "coach-avatar",
                        src: booking.coach.avatar,
                        mode: "aspectFill"
                      }, null, 8, ["src"]),
                      vue.createElementVNode("view", { class: "coach-details" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "coach-name" },
                          vue.toDisplayString(booking.coach.name),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "coach-level" },
                          vue.toDisplayString(booking.coach.level),
                          1
                          /* TEXT */
                        )
                      ])
                    ]),
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(["booking-status", booking.status])
                      },
                      vue.toDisplayString(getStatusText(booking.status)),
                      3
                      /* TEXT, CLASS */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "booking-info" }, [
                    vue.createElementVNode("view", { class: "info-row" }, [
                      vue.createElementVNode("text", { class: "info-label" }, "时间:"),
                      vue.createElementVNode(
                        "text",
                        { class: "info-value" },
                        vue.toDisplayString(booking.time),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "info-row" }, [
                      vue.createElementVNode("text", { class: "info-label" }, "地点:"),
                      vue.createElementVNode(
                        "text",
                        { class: "info-value" },
                        vue.toDisplayString(booking.location),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "info-row" }, [
                      vue.createElementVNode("text", { class: "info-label" }, "课程:"),
                      vue.createElementVNode(
                        "text",
                        { class: "info-value" },
                        vue.toDisplayString(booking.courseType),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "info-row" }, [
                      vue.createElementVNode("text", { class: "info-label" }, "费用:"),
                      vue.createElementVNode(
                        "text",
                        { class: "info-value price" },
                        "¥" + vue.toDisplayString(booking.price),
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "booking-actions" }, [
                    booking.status === "pending" ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 0,
                      class: "action-btn",
                      onClick: ($event) => cancelBooking(booking.id)
                    }, " 取消预约 ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                    booking.status === "confirmed" ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 1,
                      class: "action-btn",
                      onClick: ($event) => contactCoach(booking.coach.phone)
                    }, " 联系教练 ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                    booking.status === "completed" ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 2,
                      class: "action-btn primary",
                      onClick: ($event) => rateCoach(booking.id)
                    }, " 评价教练 ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                    booking.status === "confirmed" ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 3,
                      class: "action-btn",
                      onClick: ($event) => reschedule(booking.id)
                    }, " 改期 ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 1 },
            [
              vue.createCommentVNode(" 空状态 "),
              vue.createElementVNode("view", { class: "empty-state" }, [
                vue.createElementVNode("text", { class: "empty-text" }, "暂无教练预约记录"),
                vue.createElementVNode("text", { class: "empty-tip" }, "去找个专业教练提升技术吧"),
                vue.createElementVNode("button", {
                  class: "go-coaches-btn",
                  onClick: goToCoaches
                }, "查看教练")
              ])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          ))
        ]);
      };
    }
  });
  const PagesMyCoachesMyCoaches = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-60610dea"], ["__file", "/Users/private/Documents/code/vue/tennis-app/src/pages/my-coaches/my-coaches.vue"]]);
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "my-venues",
    setup(__props) {
      const bookingList = vue.ref([]);
      const currentStatus = vue.ref("all");
      const loading = vue.ref(false);
      const statusOptions = vue.ref([
        { key: "all", label: "全部" },
        { key: "pending", label: "待支付" },
        { key: "confirmed", label: "已确认" },
        { key: "completed", label: "已完成" },
        { key: "cancelled", label: "已取消" },
        { key: "refunded", label: "已退款" }
      ]);
      const filteredBookings = vue.computed(() => {
        if (currentStatus.value === "all") {
          return bookingList.value;
        }
        return bookingList.value.filter((booking) => booking.status === currentStatus.value);
      });
      vue.onMounted(() => {
        loadBookingList();
      });
      onLoad((options) => {
        if (options.status) {
          currentStatus.value = options.status;
        }
      });
      function loadBookingList() {
        loading.value = true;
        setTimeout(() => {
          bookingList.value = [
            {
              id: 1,
              venue: {
                id: 1,
                name: "星河网球俱乐部",
                image: "/static/images/venue1.jpg",
                location: "朝阳区星河路88号",
                phone: "010-12345678"
              },
              courtName: "1号场地",
              time: "2024-01-20 14:00-16:00",
              duration: 2,
              totalPrice: 200,
              deposit: 50,
              status: "confirmed",
              bookingTime: "2024-01-15 10:30:00",
              paymentTime: "2024-01-15 10:35:00"
            },
            {
              id: 2,
              venue: {
                id: 2,
                name: "蓝天网球中心",
                image: "/static/images/venue2.jpg",
                location: "海淀区蓝天大道66号",
                phone: "010-87654321"
              },
              courtName: "3号场地",
              time: "2024-01-18 16:00-17:00",
              duration: 1,
              totalPrice: 80,
              deposit: 0,
              status: "completed",
              bookingTime: "2024-01-14 15:20:00",
              paymentTime: "2024-01-14 15:25:00"
            },
            {
              id: 3,
              venue: {
                id: 3,
                name: "绿茵网球场",
                image: "/static/images/venue3.jpg",
                location: "西城区绿茵街12号",
                phone: "010-11223344"
              },
              courtName: "2号场地",
              time: "2024-01-22 10:00-12:00",
              duration: 2,
              totalPrice: 160,
              deposit: 40,
              status: "pending",
              bookingTime: "2024-01-16 09:15:00"
            }
          ];
          loading.value = false;
        }, 1e3);
      }
      function switchStatus(status) {
        currentStatus.value = status;
      }
      function getStatusText(status) {
        const statusMap = {
          "pending": "待支付",
          "confirmed": "已确认",
          "completed": "已完成",
          "cancelled": "已取消",
          "refunded": "已退款"
        };
        return statusMap[status] || "未知状态";
      }
      function canCancel(bookingTime) {
        const now = /* @__PURE__ */ new Date();
        const booking = /* @__PURE__ */ new Date(bookingTime.split(" ")[0] + " " + bookingTime.split(" ")[1].split("-")[0]);
        const timeDiff = booking.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1e3 * 3600);
        return hoursDiff > 24;
      }
      function payBooking(bookingId) {
        formatAppLog("log", "at pages/my-venues/my-venues.vue:272", "支付预订:", bookingId);
      }
      function cancelBooking(bookingId) {
        uni.showModal({
          title: "确认取消",
          content: "确定要取消预订吗？",
          success: (res) => {
            if (res.confirm) {
              formatAppLog("log", "at pages/my-venues/my-venues.vue:284", "取消预订:", bookingId);
            }
          }
        });
      }
      function contactVenue(phone) {
        uni.makePhoneCall({
          phoneNumber: phone,
          success: () => {
            formatAppLog("log", "at pages/my-venues/my-venues.vue:295", "拨打电话成功");
          },
          fail: (err) => {
            formatAppLog("log", "at pages/my-venues/my-venues.vue:298", "拨打电话失败:", err);
            uni.showToast({
              title: "拨打失败",
              icon: "none"
            });
          }
        });
      }
      function rateVenue(bookingId) {
        formatAppLog("log", "at pages/my-venues/my-venues.vue:309", "评价场馆:", bookingId);
      }
      function viewBookingDetail(bookingId) {
        uni.navigateTo({
          url: `/pages/booking-detail/booking-detail?id=${bookingId}`
        });
      }
      function goToBooking() {
        uni.navigateTo({
          url: "/pages/booking/booking"
        });
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "page-container" }, [
          vue.createCommentVNode(" 预订状态筛选 "),
          vue.createElementVNode("view", { class: "status-tabs" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(statusOptions.value, (status) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: vue.normalizeClass(["tab-item", { active: currentStatus.value === status.key }]),
                  key: status.key,
                  onClick: ($event) => switchStatus(status.key)
                }, vue.toDisplayString(status.label), 11, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createCommentVNode(" 预订列表 "),
          bookingList.value.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "booking-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(vue.unref(filteredBookings), (booking) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "booking-item card",
                  key: booking.id
                }, [
                  vue.createElementVNode("view", { class: "booking-header" }, [
                    vue.createElementVNode("view", { class: "venue-info" }, [
                      vue.createElementVNode("image", {
                        class: "venue-image",
                        src: booking.venue.image,
                        mode: "aspectFill"
                      }, null, 8, ["src"]),
                      vue.createElementVNode("view", { class: "venue-details" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "venue-name" },
                          vue.toDisplayString(booking.venue.name),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "venue-location" },
                          vue.toDisplayString(booking.venue.location),
                          1
                          /* TEXT */
                        )
                      ])
                    ]),
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(["booking-status", booking.status])
                      },
                      vue.toDisplayString(getStatusText(booking.status)),
                      3
                      /* TEXT, CLASS */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "booking-info" }, [
                    vue.createElementVNode("view", { class: "info-row" }, [
                      vue.createElementVNode("text", { class: "info-label" }, "场地:"),
                      vue.createElementVNode(
                        "text",
                        { class: "info-value" },
                        vue.toDisplayString(booking.courtName),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "info-row" }, [
                      vue.createElementVNode("text", { class: "info-label" }, "时间:"),
                      vue.createElementVNode(
                        "text",
                        { class: "info-value" },
                        vue.toDisplayString(booking.time),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "info-row" }, [
                      vue.createElementVNode("text", { class: "info-label" }, "时长:"),
                      vue.createElementVNode(
                        "text",
                        { class: "info-value" },
                        vue.toDisplayString(booking.duration) + "小时",
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "info-row" }, [
                      vue.createElementVNode("text", { class: "info-label" }, "费用:"),
                      vue.createElementVNode(
                        "text",
                        { class: "info-value price" },
                        "¥" + vue.toDisplayString(booking.totalPrice),
                        1
                        /* TEXT */
                      )
                    ]),
                    booking.deposit > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "info-row"
                    }, [
                      vue.createElementVNode("text", { class: "info-label" }, "押金:"),
                      vue.createElementVNode(
                        "text",
                        { class: "info-value" },
                        "¥" + vue.toDisplayString(booking.deposit),
                        1
                        /* TEXT */
                      )
                    ])) : vue.createCommentVNode("v-if", true)
                  ]),
                  vue.createElementVNode("view", { class: "booking-actions" }, [
                    booking.status === "pending" ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 0,
                      class: "action-btn",
                      onClick: ($event) => payBooking(booking.id)
                    }, " 立即支付 ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                    booking.status === "pending" ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 1,
                      class: "action-btn",
                      onClick: ($event) => cancelBooking(booking.id)
                    }, " 取消预订 ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                    booking.status === "confirmed" ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 2,
                      class: "action-btn",
                      onClick: ($event) => contactVenue(booking.venue.phone)
                    }, " 联系场馆 ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                    booking.status === "confirmed" && canCancel(booking.time) ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 3,
                      class: "action-btn",
                      onClick: ($event) => cancelBooking(booking.id)
                    }, " 申请退款 ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                    booking.status === "completed" ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 4,
                      class: "action-btn primary",
                      onClick: ($event) => rateVenue(booking.id)
                    }, " 评价场馆 ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                    vue.createElementVNode("button", {
                      class: "action-btn",
                      onClick: ($event) => viewBookingDetail(booking.id)
                    }, " 查看详情 ", 8, ["onClick"])
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 1 },
            [
              vue.createCommentVNode(" 空状态 "),
              vue.createElementVNode("view", { class: "empty-state" }, [
                vue.createElementVNode("text", { class: "empty-text" }, "暂无场地预订记录"),
                vue.createElementVNode("text", { class: "empty-tip" }, "去预订一个场地开始运动吧"),
                vue.createElementVNode("button", {
                  class: "go-booking-btn",
                  onClick: goToBooking
                }, "预订场地")
              ])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          ))
        ]);
      };
    }
  });
  const PagesMyVenuesMyVenues = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-a6fad96f"], ["__file", "/Users/private/Documents/code/vue/tennis-app/src/pages/my-venues/my-venues.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/booking/booking", PagesBookingBooking);
  __definePage("pages/clubs/clubs", PagesClubsClubs);
  __definePage("pages/profile/profile", PagesProfileProfile);
  __definePage("pages/coaches/coaches", PagesCoachesCoaches);
  __definePage("pages/activities/activities", PagesActivitiesActivities);
  __definePage("pages/club-detail/club-detail", PagesClubDetailClubDetail);
  __definePage("pages/coach-detail/coach-detail", PagesCoachDetailCoachDetail);
  __definePage("pages/activity-detail/activity-detail", PagesActivityDetailActivityDetail);
  __definePage("pages/my-orders/my-orders", PagesMyOrdersMyOrders);
  __definePage("pages/my-activities/my-activities", PagesMyActivitiesMyActivities);
  __definePage("pages/apply-club/apply-club", PagesApplyClubApplyClub);
  __definePage("pages/apply-coach/apply-coach", PagesApplyCoachApplyCoach);
  __definePage("pages/my-coaches/my-coaches", PagesMyCoachesMyCoaches);
  __definePage("pages/my-venues/my-venues", PagesMyVenuesMyVenues);
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      onLaunch(() => {
        formatAppLog("log", "at App.vue:5", "App Launch");
        initApp();
      });
      onShow(() => {
        formatAppLog("log", "at App.vue:11", "App Show");
      });
      onHide(() => {
        formatAppLog("log", "at App.vue:15", "App Hide");
      });
      function initApp() {
        checkLoginStatus();
        getLocationPermission();
      }
      function checkLoginStatus() {
        const token = uni.getStorageSync("token");
        if (!token) {
          formatAppLog("log", "at App.vue:30", "用户未登录");
        }
      }
      function getLocationPermission() {
        uni.getLocation({
          type: "wgs84",
          success: (res) => {
            formatAppLog("log", "at App.vue:39", "获取位置成功:", res);
            uni.setStorageSync("userLocation", {
              latitude: res.latitude,
              longitude: res.longitude
            });
          },
          fail: (err) => {
            formatAppLog("log", "at App.vue:46", "获取位置失败:", err);
          }
        });
      }
      return () => {
      };
    }
  });
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "/Users/private/Documents/code/vue/tennis-app/src/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
