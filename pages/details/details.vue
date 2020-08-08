<template>
	<view class="content details">
		<!-- 表单 -->
		<view class="popup" v-if="isShowPopup">
			<view class="mask"></view>
			<view class="popup-wrap">
				<view class="close" @tap="closePopup">
					<icon type="clear" size="26" />
				</view>
				<view class="form-title">注册可免费获取全套课程</view>
				<view class="form-subtitle">真人老师在线指导</view>
				<view class="from">
					<input class="uni-input" placeholder="您的姓名" v-model="username" />
					<input class="uni-input" placeholder="手机号" maxlength="11" v-model="phone"/>
					<view class="get-code">
						<input class="uni-input authcode" placeholder="验证码" v-model="inputcode" />
						<button class="btn" type="default" @tap="getCode" :disabled="authText=='获取验证码'?false:true">{{authText}}</button>
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
				<view class="play-mask" v-if="noLogin" @tap="playVideo"></view>
				<!-- 根据视频的id来切换到对应的视频 -->
				<video src="https://ugcydzd.qq.com/uwMROfz2r5zAoaQXGdGnC2dfJ7xBbC6Xu5OsXbmLfLunH5lr/x09498tpo27.p712.1.mp4?sdtfrom=v1104&guid=55f5a3102cb5344ed3c5acb3580e54de&vkey=D6D06D44317C5D250E3221AF1189B726F224459E3B114E23B2049020A0A10150948EF20FB023D33015B005ACB68A7DD24E8BCF05CC172E878B529504EE3294EB365BB3088D11573991F9516035DF8A6916D464761EAA1DDCB0F99A18EF5B8A867863E5CB2F48B69DA0DBC5604EB0E8CEB4354CE956A1FD234711E71FB1197CA8" controls></video>
			</view>
			
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
								<view class="list-box" @tap="goChapter(item.id)">
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
				// backurlArr: [],
				btnTxt: '',
				id: '',
				detail: {},
				// vid: '',
				tabId: 1,
				
				noLogin: true,
				isShowPopup: true,
				username: '',
				phone: '',
				authcode: 1, // 后台发送的验证码
				inputcode: '', // 用户输入验证码
				authText: '获取验证码',
				timeId: null,
			};
		},
		onLoad(options) {
			this.state = options.state;
			this.id = options.id;
			// this.state = 1;
			// this.id = 2;
			this.btnTxt = '播放视频';
			this.getLive();
			
			// 判断是否存储手机号码
			uni.getStorage({
			    key: 'phone',
			    success: (res) => {
					console.log(res.data, 1234)
					this.isShowPopup = false;
					this.noLogin = false;
			    }
			});
	
			uni.showShareMenu({
				withShareTicket: true
			});
		},
		methods: {
			closePopup(){
				this.isShowPopup = false;
			},
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
							title:'验证码已发'
						})
					}
				})
				this.authText = 60;
				this.timeId = setInterval(() => {
					console.log('定时器')
					this.authText = this.authText - 1;
					if(this.authText == 0){
						this.authText = '获取验证码'
						clearInterval(this.timeId)
					}
				}, 1000)
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
				uni.showToast({
					title:'注册成功'
				})
				this.isShowPopup = false;
				this.noLogin = false;
				// 存storage
				uni.setStorage({
					key: 'phone',
					data: md5('THEA2020.$' + this.phone),
					success: (res) => {
						console.log(res, 111)
					}
				});
			},
			playVideo(){
				// console.log('点击了播放按钮')
				uni.getStorage({
				    key: 'phone',
					success: () => {},
					fail: () => {
						console.log('没注册')
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
			},
			// 目录下视频切换
			goChapter(id){
				console.log(id, '视频切换');
				// this.id = id
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
	z-index: 300;
	.uni-icon-clear:before {
	    content: "\EA0F";
	}
}
.popup-wrap{
	position: fixed;
	top: 50%;
	left: 50%;
	margin: -325rpx 0 0 -324rpx;
	overflow: hidden;
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
