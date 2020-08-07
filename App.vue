<script>
	export default {
		onLaunch: function() {
			// console.log('App Launch')
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		},
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	page {
		background-color: #f8f8f8;
	}

	image {
		max-width: 100%;
	}

	view,
	text,
	input,
	textarea,
	button {
		box-sizing: border-box;
		color: #333;
	}

	.flex {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.space-between {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
	}

	.one {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.bgw {
		background-color: #fff;
		box-sizing: border-box;
		padding: 0 30rpx;
		width: 100vw;
	}

	.mask {
		width: 100vw;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		background-color: rgba($color: #000000, $alpha: 0.6);
		z-index: 100;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		color: #333;
		// padding-bottom: 98rpx;
	}

	.button-hover {
		background-color: transparent;
	}

	button {
		background-color: transparent;
		padding: 0;
		line-height: 2;
		margin: 0;

		&::after {
			border: none;
			transform: scale(1);
		}
	}

	scroll-view {
		justify-content: flex-start;
		flex-wrap: nowrap;
		width: auto;
		white-space: nowrap;
	}

	@mixin ells($row) {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: $row;
		-webkit-box-orient: vertical;
		white-space: wrap;
	}

	.line2 {
		@include ells(2);
	}

	.line3 {
		@include ells(3);
	}

	.mb {
		margin-bottom: 20rpx;
	}

	.placeholder {
		color: #666;
	}

	.xn-tit-1 {
		font-size: 36rpx;
		color: #333333;
		font-weight: bold;
		height: 50rpx;
		line-height: 50rpx;
		margin-bottom: 24rpx;
	}

	.xn-tit-2 {
		display: inline-block;
		position: relative;
		margin-bottom: 40rpx;
		padding-top: 40rpx;
		font-size: 36rpx;
		color: #333333;
		font-weight: bold;

		&:after {
			content:'' ;
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 8rpx;
			background-image: linear-gradient(90deg,
				#78befd 0%,
				#1d7be4 100%);
		}
	}
</style>
