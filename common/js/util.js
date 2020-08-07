function http(url,data,callBack,method){
	method = method || "GET";
	uni.request({
		url: url,
		method: method,
		data:data,
		success: res => {
			callBack(res);
		},
		fail: () => {
			console.log('请求超时');
		}
	});
};

export default {
	http:http
}