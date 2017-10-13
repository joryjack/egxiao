(function($, doc) {
	$.init(

	);
	var setpwdsubmit = doc.getElementById("setpwdsubmit");

	$.plusReady(function() {

		var select_activate_organization = plus.webview.getWebviewById("select-activate-organization.html");
		if(select_activate_organization) {
			select_activate_organization.close();
		}

		var inputList = document.querySelectorAll('input[type="password"]');
		var org_id = "",
			phone = "";
		window.addEventListener('getParameter', function(options) {
			inputList[0].value = "";
			inputList[1].value = "";
		})

		setpwdsubmit.addEventListener('tap', function(event) {
			if(inputList[0].value != inputList[1].value) {
				$.toast('两次输入密码必须一致');
				return;
			}

			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			var $activateAccountPar = app.getactivateAccountPar();
			var setpwdInfo = {
				org_id: $activateAccountPar.org_id,
				phone: $activateAccountPar.phone,
				password: inputList[0].value
			}

			var waiting = plus.nativeUI.showWaiting();
			app.setPassword(setpwdInfo, function(data) {
				waiting.close();
				if(typeof data == 'string') {
					plus.nativeUI.toast(data);
					return;
				} else {
					if(data.success) {
						localStorage.removeItem('$activateAccountPar');
						plus.nativeUI.toast(data.msg);
						$.openWindow({
							url: '../login.html',
							id: 'setpwd_login.html',
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