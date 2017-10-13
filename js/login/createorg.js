(function($, doc) {
	$.init();
	$.plusReady(function() {
		var settings = app.getSettings();
		var org = doc.getElementById("org");
		var username = doc.getElementById("username");
		var userpassword = doc.getElementById("password");
		var submitbtn = doc.getElementById("orgsubmit");

		org.addEventListener('input', function() {
			if(org.value.trim() != "" && username.value.trim() != "" && userpassword.value.trim() != "" && app.validatePassword(userpassword.value.trim())) {
				var submitbtnlist = orgsubmit.classList;
				submitbtnlist.remove('mui-btn-grey', 'mui-disabled');
				submitbtnlist.add('mui-btn-primary');
			} else {
				var submitbtnlist = orgsubmit.classList;
				submitbtnlist.add('mui-btn-grey', 'mui-disabled');
				submitbtnlist.remove('mui-btn-primary');
			}
		});
		username.addEventListener('input', function() {
			if(org.value.trim() != "" && username.value.trim() != "" && userpassword.value.trim() != "" && app.validatePassword(userpassword.value.trim())) {
				var submitbtnlist = orgsubmit.classList;
				submitbtnlist.remove('mui-btn-grey', 'mui-disabled');
				submitbtnlist.add('mui-btn-primary');
			} else {
				var submitbtnlist = orgsubmit.classList;
				submitbtnlist.add('mui-btn-grey', 'mui-disabled');
				submitbtnlist.remove('mui-btn-primary');
			}
		});
		userpassword.addEventListener('input', function() {
			if(org.value.trim() != "" && username.value.trim() != "" && userpassword.value.trim() != "" && app.validatePassword(userpassword.value.trim())) {
				var submitbtnlist = orgsubmit.classList;
				submitbtnlist.remove('mui-btn-grey', 'mui-disabled');
				submitbtnlist.add('mui-btn-primary');
			} else {
				var submitbtnlist = orgsubmit.classList;
				submitbtnlist.add('mui-btn-grey', 'mui-disabled');
				submitbtnlist.remove('mui-btn-primary');
			}
		});
		submitbtn.addEventListener('tap', function() {
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			var $phone = localStorage.getItem('$phone') || "{}";
			var regInfo = {
				org_name: org.value,
				phone: $phone,
				name: username.value,
				password: userpassword.value
			}
			var waiting = plus.nativeUI.showWaiting();
			app.register(regInfo, function(data) {
				waiting.close();
				if(data.success) {
					var createOrgWebview = plus.webview.getWebviewById("createOrg.html");
					if(createOrgWebview) {
						createOrgWebview.close();
					}
					var registerWebview = plus.webview.getWebviewById("/login/register.html");
					if(registerWebview) {
						registerWebview.close();
					}
					plus.nativeUI.toast('注册成功');
					localStorage.removeItem('$phone');
					$.openWindow({
						url: '../login.html',
						id: 'createorg-login.html',
						show: {
							aniShow: 'pop-in'
						},
						waiting: {
							autoShow: false
						}
					});
				} else {
					plus.nativeUI.toast(data.msg);
				}
			})
		})
	});
})(mui, document)