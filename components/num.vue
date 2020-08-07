<template>
	<view>
		<text>{{ num }}</text>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	computed: {
		num: function randomNum() {
			var minNum = 200;
			var maxNum = 360;
			return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
		}
	}
};
</script>

<style></style>
