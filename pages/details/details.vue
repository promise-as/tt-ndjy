<template>
	<view class="content details">
		<!-- 表单 -->
		<view class="popup" v-if="isShowPopup">
			<view class="mask"></view>
			<view class="uni-common-mt popup-wrap">
				<view class="close" @tap="closePopup">
					<icon type="clear" size="26" />
				</view>
				<view class="form-title">注册可免费获取全套课程</view>
				<view class="form-subtitle">真人老师在线指导</view>
				<view class="from">
					<input class="uni-input" focus placeholder="您的姓名" v-model="username" />
					<input class="uni-input" placeholder="手机号" maxlength="11" v-model="phone"/>
					<view class="get-code">
						<input class="uni-input authcode" placeholder="验证码" v-model="inputcode" />
						<button class="btn" type="default" @tap="getCode">获取验证码</button>
					</view>
					<button class="submit" @tap="getphonenumber">立即注册</button>
				</view>
			</view>
		</view>
		
		<!-- 回放界面 -->
		<view class="back-con-box">
			<view class="h1 one bgw">{{ detail.title }}</view>
			
			<!-- 回放视频 -->
			<view class="play">
				<view class="play-mask" v-if="phone == ''" @tap.stop="playVideo"></view>
				<video src="https://ugcsjy.qq.com/uwMROfz2r57EIaQXGdGnC2dePkZaz9nvINvy8qtBz-4opyj0/szg_2919_50001_0b6bcuaa4aaadeabtebnb5pvcfodbykqadsa.f622.mp4?sdtfrom=v1010&guid=d8b130f632b936b2a147d2b27aec3fb5&vkey=B5396B1F39909420B30C59C715F814C4ABE61C4DB966EF6492C538BE4AE31C5CEAB7DC76D7A5409199E7269C781E6EFE3943EE2CDC2624A080E478C2906CE29303496D9D0C1047EF5617064CDCF0EAB29E1F66695C660FF5E47C07A7AB54EF9EBEDC5D6ED617C5FE0C63ACD69D3775311091039236BB2C4C539A751D8AB298E2" controls></video>
				<!-- <view>视频播放区域</view> -->
			</view>
			<!-- <view class="video-box"><txv-video :vid="vid" :autoplay="true" playerid="txv1"></txv-video></view> -->
			<view class="con bgw">
				<view class="lesson">
					<view class="tabs">
						<view class="tab" @tap="onTabSwitch(1)" :class="tabId == 1 ? 'xn-tit-2' : ''">课程简介</view>
						<view class="tab" v-if="detail.fj" @tap="onTabSwitch(2)" :class="tabId == 2 ? 'xn-tit-2' : ''">课程目录</view>
					</view>
					<view class="tab-card">
						<view class="txt" v-if="tabId == 1"><uParse :content="detail.intro" /></view>
						<view class="txt txt-2" v-if="tabId == 2">
							<view v-for="(item, index) in detail.fj" :key="index">
								<view class="list-box" @tap="goChapter(item.backurl, item.cid, item.token)">
									<view class="title">章节{{ index + 1 }}:{{ item.title }}</view>
									<view class="flex btm">
										<view class="time"><tsFormatTime :time="item.starttime"></tsFormatTime></view>
										<view class="read flex">
											<num />
											次学习
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	import md5 from '@/common/js/MD5.js';
	import tsFormatTime from '@/components/tsFormatTime.vue';
	import uParse from '@/components/uParse/src/wxParse.vue';
	import num from '@/components/num.vue';
	import util from '@/common/js/util.js';
	
	import {checkIsNotNull, checkName, checkPhoneNum} from '../../static/check.js'
	
	export default {
		components: {
			tsFormatTime,
			uParse,
			num
		},
		data() {  
			return {
				state: '',
				backurl: '', // 视频地址
				btnTxt: '',
				id: '',
				detail: {},
				// vid: '',
				tabId: 1,
				
				isShowPopup: true,
				username: '',
				phone: '',
				authcode: 1, // 后台发送的验证码
				inputcode: '' // 用户输入验证码
			};
		},
		onLoad(options) {
			this.state = options.state;
			// this.state = 1;
			this.id = options.id;
			// this.id = 2;
			this.btnTxt = '播放视频';
			this.getLive();
			
			// 判断是否存储手机号码
			uni.getStorage({
			    key: 'phone',
			    success: (res) => {
					this.isShowPopup = false;
			    }
			});
	
			// uni.showShareMenu({
			// 	withShareTicket: true
			// });
		},
		methods: {
			// 获取验证码
			getCode(){
				let phone = this.phone;
				if(!checkPhoneNum(phone)){
					uni.showToast({
						title:'手机号格式不正确',
						icon:'none'
					})
					return null;
				}
				util.http(this.url + '/phonecodecheck', {phone}, res => {
					if(res.data.msg == 'OK'){
						this.authcode = res.data.data // 4为数字
						uni.showToast({
							title:'验证码已发送到您的手机，注意查收'
						})
					}else{
						uni.showToast({
							title:'验证码获取失败',
							icon:'none'
						})
					}
				})
				
			},
			getphonenumber(){
				// console.log(this.username, this.phone, 123)
				if(!checkIsNotNull(this.username) || !checkIsNotNull(this.phone)){
					uni.showToast({
						title:'用户名或者密码不能为空',
						icon:'none'
					})
					return null;
				}
				if(!checkName(this.username)){
					uni.showToast({
						title:'名字格式不正确',
						icon:'none'
					})
					return null;
				}
				if(!checkPhoneNum(this.phone)){
					uni.showToast({
						title:'手机号格式不正确',
						icon:'none'
					})
					return null;
				}
				if(this.authcode !== Number(this.inputcode)){
					uni.showToast({
						title:'验证码不正确',
						icon:'none'
					})
					return null;
				}
				this.isShowPopup = false;
				// 存storage
				uni.setStorage({
					key: 'phone',
					data: md5('THEA2020.$' + this.phone),
					success: (res) => {
						console.log(res, 111)
					}
				});
			},
			closePopup(){
				this.isShowPopup = false;
			},
			playVideo(){
				console.log('点击了播放按钮')
				
				uni.getStorage({
				    key: 'phone',
					fail: () => {
						this.isShowPopup = true;
					}
				});
			},
			
			onTabSwitch(index) {
				this.tabId = index;
			},
			getLive() {
				// 2.获取直播详情
				var data = {
					id: this.id,
					token: md5('THEA2020.$' + this.id)
				};
				util.http(this.url + '/liveDyInfoId', data, res => {
					var data = res.data.data;
					if (data.backurl.length > 0) {
						var str = data.backurl;
					}
					this.detail = data;
				});
			}
		}
	};
</script>

<style lang="scss">
@import url('../../components/uParse/src/wxParse.css');
page {
	background-color: #fff;
}
.details {
	.tabs {
		padding: 0 30rpx;
	}
	.tab-card {
		.wxParse .p {
			margin: 0;
		}
		.txt{
			padding: 0 30rpx;
			margin-top: -15rpx;
		}
		.txt-2 {
			padding: 0 30rpx;
			margin-top: -15rpx;
		}
	}
	.lesson {
		.tab {
			display: inline-block;
			position: relative;
			margin-bottom: 20rpx;
			padding-top: 40rpx;
			font-size: 36rpx;
			color: #333333;
			font-weight: bold;
			margin-right: 20rpx;
		}
		.list-box {
			border-bottom: 2rpx solid #efefef;
			padding: 20rpx 0;
			.title {
				font-size: 32rpx;
				line-height: 1.6;
				margin-bottom: 10rpx;
			}
		}
		.btm {
			font-size: 28rpx;
			justify-content: flex-start;
		}
		.time {
			margin-right: 20rpx;
		}
	}

	.h1 {
		font-weight: bold;
		font-size: 36rpx;
		color: #111;
		line-height: 130rpx;
	}

	.video-box {
		width: 100vw;
		height: auto;
	}

	.con {
		padding: 0 0 30rpx 0;
		position: relative;
	}

	.live-btn {
		position: fixed;
		left: 30rpx;
		bottom: 16rpx;
		width: 690rpx;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		background-image: linear-gradient(-90deg, #1d7be4 0%, #78befd 100%);
		box-shadow: 0 7rpx 10rpx 0 rgba(32, 124, 228, 0.25);
		border-radius: 44rpx;
		font-size: 32rpx;
		color: #fff;
	}

	.live-time {
		position: relative;
		left: 130rpx;
		bottom: 144rpx;
		width: 490rpx;
		height: 64rpx;
		line-height: 64rpx;
		box-shadow: 0px 0px 35px 0px rgba(255, 101, 65, 0.25);
		border-radius: 10px;
		background: url(https://img.thea.cn/public/platform/thea/202003/xiaoniu/images/live-time.png) no-repeat center;
		background-size: 100% 100%;

		.txt-l {
			font-size: 26rpx;
			color: #333;
			padding: 0 24rpx;
			display: inline-block;
		}

		.txt-r {
			font-size: 30rpx;
			color: #fff;
			padding-left: 20rpx;
			position: relative;
			display: inline-block;

			.formatime {
				font-size: 30rpx;
				color: #fff;
			}
		}
	}
}
.popup{
	position: relative;
}
.close{
	position: absolute;
	top: 20rpx;
	right: 20rpx;
	z-index: 200;
	.uni-icon-clear:before {
	    content: "\EA0F";
	}
}
.popup-wrap{
	position: absolute;
	transform: translate(-50%, 50%);
	z-index: 200;
	width: 648rpx;
	height: 650rpx;
	padding: 30rpx;
	background: #fff;
	
	.form-title{
		font-size: 36rpx;
		color: #101010;
		text-align: center;
	}
	.form-subtitle{
		font-size: 30rpx;
		color: #98989a;
		text-align: center;
	}
	.from{
		padding-top: 60rpx;
	}
	.uni-input{
		height: 80rpx;
		line-height: 80rpx;
		border-bottom: 1rpx solid #ccc;
		margin-bottom: 20rpx;
	}
	.authcode{
		border-bottom: 0;
		width: 60%;
	}
	.get-code{
		position: relative;
		border-bottom: 1rpx solid #ccc;
		.btn{
			position: absolute;
			top: 10px;
			right: 0;
			width: 166rpx;
			height: 60rpx;
			line-height: 60rpx;
			background-color: rgba(255, 99, 19, 0.7);
			color: #fff;
			font-size: 24rpx;
		}
	}
	.submit{
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		margin-top: 30rpx;
		background-color: rgb(255, 99, 19);
		color: #fff;
		font-size: 28rpx;
		text-align: center;
	}
}
.play{
	position: relative;
	.play-mask{
		position: absolute;
		z-index: 100;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
	}
	video{
		width: 100%;
	}
}
</style>
