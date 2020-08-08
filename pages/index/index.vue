<template>
	<view class="content">
		<!-- 轮播 -->
		<view class="banner bgw mb" v-if="bannerList.length > 0">
			<swiper circular="true" :indicator-dots="false" :autoplay="false" :interval="3000" :duration="1000">
				<swiper-item @tap="goDetail(item.id, item.state)" v-for="(item, index) in bannerList" :key="index"><image :src="item.pic" mode="scaleToFill"></image></swiper-item>
			</swiper>
		</view>
		<!-- 近期直播（轮播） -->
		<view class="banner-near bgw mb" v-if="topList.length > 0">
			<!-- <view class="xn-tit-1">近期直播</view> -->
			<view class="pages-box">
				<text class="active">{{ bannerNearCurrent }}</text>
				/
				<text>{{ bannerNearLength }}</text>
			</view>
			<swiper circular="true" :indicator-dots="false" :autoplay="true" :interval="3000" :duration="1000" @change="getCurrent">
				<swiper-item class="school-card" v-for="(item, index) in topList" :key="index" @tap="goDetail(item.id, item.state)">
					<image :src="item.pic" mode="scaleToFill"></image>
					<view class="txt">
						<view class="h3 one">{{ item.title }}</view>
						<view class="time"><tsFormatTime :time="item.starttime"></tsFormatTime></view>
						<view class="btn">进入课堂</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 精选/回看 -->
		<view class="live-list bgw">
			<view class="live-tab">
				<view class="tab" :class="active == 0 ? 'active' : ''" @tap="getXnLive()">精选</view>
				<view class="tab" :class="active == 'bool' ? 'active' : ''" @tap="getXnLive(1, 'bool')">回看</view>
			</view>
			<view class="school-box">
				<view class="school-card" v-for="(item, index) in liveList" :key="index" @tap="goDetail(item.id, item.state)">
					<image :src="item.pic" mode="scaleToFill"></image>
					<view class="txt">
						<view class="h3 line2">{{ item.title }}</view>
						<view class="time"><tsFormatTime :time="item.starttime"></tsFormatTime></view>
						<view class="btn">进入课堂</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import tsFormatTime from '@/components/tsFormatTime.vue';
	import util from '@/common/js/util.js';
	
	export default {
		components: {
			tsFormatTime
		},
		data() {
			return {
				topList: [], // 近期直播
				bannerNearCurrent: 1,
				bannerNearLength: 1,
				liveList: [], // 精选/回看 数据
				active: 0, // 精选/回放 tab
				pageNum: 1,
				loadingData: false,
				bannerList: []
			};
		},
		onLoad() {
			this.getBanner();
			this.nearLive();
			this.getXnLive();
			
			uni.showShareMenu({
				withShareTicket: true
			});
		},
		methods: {
			getBanner() {
				// 3.获取推荐直播
				util.http(this.url + '/getRecentlyLiveDy', {}, res => {
					// console.log(res, 111222)
					if (res.data.msg == 'OK') {
						var bannerList = res.data.data;
						bannerList = this.setState(bannerList);
						this.bannerList = bannerList;
					}
				});
			},
			nearLive() {
				// 1.获取直播列表
				util.http(this.url + '/getDyLive', {}, res => {
					// console.log(res, 'nearLive')
					if (res.data.msg == 'OK') {
						var topList = res.data.data;
						topList = this.setState(topList);
						this.bannerNearLength = topList.length;
						this.topList = topList;
					}
				});
			},
			getXnLive(p, isback, loadMore) {
				/*
				 * p:页码
				 * isback:是否回看 可选项(bool)  默认false
				 * loadMore:是否下一页
				 * loadingData：
				 */
				loadMore = loadMore || false;
				p = p || 1;
				isback = isback || 0;
				var data = {
					p: p,
					isback: isback
				};
				this.active = isback;
				// 1.获取直播列表
				util.http(this.url + '/getDyLive', data, res => {
					// console.log(res, 111)
					if (res.data.msg == 'OK') {
						var liveList = res.data.data;
						// liveList = this.setState(liveList);
						if (loadMore) {
							var oldArr = this.liveList,
								newArr = oldArr.concat(liveList);
							this.liveList = newArr;
							uni.hideLoading();
						} else {
							this.liveList = liveList;
						}
						this.loadingData = liveList.length > 5 ? false : true;
					} else {
						if (p == 1 && isback == 0) {
							this.active = 'bool';
							this.getXnLive(1, 'bool');
						}
						this.loadingData = true;
						uni.hideLoading();
						uni.showToast({
							title: '没有更多了',
							icon: 'none'
						});
					}
				});
			},
			goDetail(id, state) {
				uni.navigateTo({
					url: '../details/details?id=' + id + '&state=' + state
				});
			},
			getCurrent(e) {
				this.bannerNearCurrent = e.detail.current + 1;
			},
			setState(list) {
				// console.log('调用setState')
				var time = new Date(),
					now = time.getTime();
				for (var i = 0; i < list.length; i++) {
					if (list[i].backurl.length > 0) {
						//回看
						list[i].state = '1';
					} else if (list[i].starttime * 1000 > now) {
						//预约
						list[i].state = '-1';
					} else if (list[i].endtime * 1000 < now) {
						// 直播已结束 无回看地址
						list[i].state = '2';
					} else {
						// if((list[i].starttime * 1000 <= now) && (list[i].endtime * 1000 > now))
						// 直播中
						list[i].state = '0';
					}
				}
				return list;
			}
		}
	}
</script>

<style lang="scss">
.banner {
	padding-top: 30rpx;
	padding-bottom: 30rpx;

	swiper {
		width: 690rpx;
		height: 340rpx;
		margin: 0 auto;
		image {
			width: 690rpx;
			height: 340rpx;
			border-radius: 20rpx;
		}

		.wx-swiper-dot-active {
			border: 1rpx solid #fff;
		}
	}
}

.banner-near {
	padding-top: 30rpx;
	padding-bottom: 30rpx;
	position: relative;

	.pages-box {
		position: absolute;
		right: 30rpx;
		top: 30rpx;
		width: 86rpx;
		height: 48rpx;
		line-height: 44rpx;
		border-radius: 24rpx;
		border: solid 2rpx #e6e6e6;
		font-size: 26rpx;
		color: #999;
		text-align: center;

		&.active {
			color: #333;
		}
	}

	swiper {
		width: 690rpx;
		// height: 460rpx;
		height: 480rpx;

		.school-card {
			padding: 0;
		}
	}
}

.live-list {
	padding-bottom: 30rpx;

	.live-tab {
		padding-top: 20rpx;

		.tab {
			height: 50rpx;
			line-height: 50rpx;
			display: inline-block;
			font-size: 36rpx;
			color: #999;
			position: relative;
			padding-right: 20rpx;
			margin-right: 20rpx;

			&.active {
				color: #333;
				font-weight: bold;
			}

			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 0;
				margin-top: -16rpx;
				width: 4rpx;
				background-color: #ddd;
				height: 32rpx;
			}

			&:nth-last-child(1) {
				&:after {
					display: none;
				}
			}
		}
	}
}

.school-card {
	width: 690rpx;
	padding: 30rpx 0;
	border-bottom: 1rpx solid #ddd;
	position: relative;

	&:nth-last-child(1) {
		border: none;
	}

	image {
		width: 690rpx;
		height: 340rpx;
		margin-bottom: 20rpx;
		border-radius: 20rpx;
	}

	.txt {
		position: relative;
		padding-bottom: 10rpx;
		.h3 {
			width: 465rpx;
			font-size: 32rpx;
			line-height: 1.6;
			margin-bottom: 10rpx;
			font-weight: bold;
		}

		.time {
			font-size: 28rpx;

			text {
				display: inline-block;
				margin-right: 20rpx;
			}
		}

		.btn {
			position: absolute;
			right: 0;
			bottom: 10rpx;
			width: 179rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: 30rpx;
			color: #fff;
			background-image: linear-gradient(-90deg, #1d7be4 0%, #78befd 100%);
			box-shadow: 0 7rpx 10rpx 0 rgba(32, 124, 228, 0.25);
			border-radius: 40rpx;
		}
	}
}
</style>
