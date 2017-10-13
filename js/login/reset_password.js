(function($, doc) {
	$.init(

	);
	var resetpwdsubmit = doc.getElementById("resetpwdsubmit");

	$.plusReady(function() {

		var select_user_organization = plus.webview.getWebviewById("select-user-organization.html");
		if(select_user_organization) {
			select_user_organization.close();
		}
		var inputList = document.querySelectorAll('input[type="password"]');
		var org_id = "",
			phone = "";
		window.addEventListener('getParameter', function(options) {
			inputList[0].value = "";
			inputList[1].value = "";
		})

		resetpwdsubmit.addEventListener('tap', function(event) {
			if(inputList[0].value != inputList[1].value) {
				$.toast('两次输入密码必须一致');
				return;
			}

			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			var $forgetPasswordPar = app.getforgetPasswordPar();
			var resetpwdInfo = {
				org_id: $forgetPasswordPar.org_id,
				phone: $forgetPasswordPar.phone,
				password: inputList[0].value
			}
			console.log(JSON.stringify(resetpwdInfo))
			var waiting = plus.nativeUI.showWaiting();
			app.resetPassword(resetpwdInfo, function(data) {
				waiting.close();
				if(typeof data == 'string') {
					plus.nativeUI.toast(data);
					return;
				} else {
					if(data.success) {
						localStorage.removeItem('$forgetPasswordPar');
						plus.nativeUI.toast(data.msg);
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
						plus.nativeUI.toast(data.msg);
					}
				}
			})

		})
	})
}(mui, document));