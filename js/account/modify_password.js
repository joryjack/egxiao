(function($, doc) {
	$.init(

	);
	var resetpwdsubmit = doc.getElementById("resetpwdsubmit");

	$.plusReady(function() {
		var inputList = document.querySelectorAll('input[type="password"]');
		var account = app.getAccount();

		resetpwdsubmit.addEventListener('tap', function(event) {
			if(inputList[1].value != inputList[2].value) {
				$.toast('两次输入密码必须一致');
				return;
			}
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			var modifypwdInfo = {
				org_id: account.org_id,
				phone: account.phone,
				oldpassword: inputList[0].value,
				newpassword: inputList[1].value
			}

			var waiting = plus.nativeUI.showWaiting();
			
			 console.log(JSON.stringify(modifypwdInfo));
			app.modifypwdInfo(modifypwdInfo, function(data) {
				waiting.close();
				if(typeof data == 'string') {
					$.toast(data);
					return;
				} else {
					if(data.success) {
						$.toast(data.msg);
						localStorage.removeItem('$account');
						var main = plus.webview.getWebviewById("main.html");
						//触发主页面的gohome事件
						$.fire(main, 'gohome');
						var list = plus.webview.all();
						$.each(list, function(index, item) {
							if(item.id.indexOf("manage") >= 0 || item.id.indexOf("work") >= 0) {
								item.close();
							}
						});
						$.openWindow({
							url: '../login.html',
							id: 'resetpwd_login.html',
							preload: true,
							show: {
								aniShow: 'pop-in'
							},
							styles: {
								popGesture: 'hide'
							},
							waiting: {
								autoShow: false
							}
						});
					} else {
						$.toast(data.msg);
					}
				}
			})

		})
	})
}(mui, document));