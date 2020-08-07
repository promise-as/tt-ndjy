<template>
	<view class="formatime">
		{{formatTime}}
	</view>
</template>

<script>
	export default {
		name:'tsFormatTime',
		props:{
			time:{
				type:String
			},
			format:{
				type:String
			}
		},
		computed:{
			formatTime:function(){
				var timestamp = this.time * 1000;
				var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
				var returnArr = [];
				var format = this.format || 'Y/M/D h:m';
				var date = new Date(timestamp);
				var year = date.getFullYear()
				var month = date.getMonth() + 1
				var day = date.getDate()
				var hour = date.getHours()
				var minute = date.getMinutes()
				var second = date.getSeconds()
				returnArr.push(year, month, day, hour, minute, second);
				returnArr = returnArr.map(this.formatNumber);
				for (var i in returnArr) {
				    format = format.replace(formateArr[i], returnArr[i]);
				}
				return format;
			}
		},
		methods:{
			formatNumber(n) {
			    n = n.toString()
			    return n[1] ? n : '0' + n
			}
		}
	}
</script>

<style lang="scss">

</style>
