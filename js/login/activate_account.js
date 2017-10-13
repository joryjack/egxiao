(function($, doc) {
	$.init();
	var account = doc.getElementById("account");
	var validateCodebtn = doc.getElementById("validateCodebtn");
	var validateCode = doc.getElementById("validateCode");
	var activatebtn = doc.getElementById("activatebtn");
	$.plusReady(function() {
		window.addEventListener('getParameter', function(options) {
			account.value = options.detail.phone;
			validateCode.value = "";
		});
		validateCodebtn.addEventListener('tap', function(event) {
			if(!app.validatePhone(account.value)) {
				plus.nativeUI.toast('手机号错误');
				return;
			}
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			var smsInfo = {
				phone: account.value,
				template_type: "activate"
			};
			app.validatecode(smsInfo, function(data) {
				if(data.success) {
					app.setCode(data.err_code);
					console.log(data.err_code);

				} else {
					plus.nativeUI.toast(data.msg);
					console.log(data.msg);
				}
			})
			var validateCodebtnlist = validateCodebtn.classList;
			var time = 60,
				timer = setInterval(function() {
					validateCodebtnlist.add('mui-disabled');
					validateCodebtn.innerHTML = (--time) + "秒重新获取", time <= 0 && (validateCodebtnlist.remove('mui-disabled'), validateCodebtn.innerHTML = "再次获取", clearInterval(timer));
				}, 1e3);
		});

		activatebtn.addEventListener('tap', function(event) {
			if(validateCode.value == "") {
				plus.nativeUI.toast('请输入验证码');
			}
			if(app.checkCode(validateCode.value)) {
				if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
					plus.nativeUI.toast('网络不给力，请检查网络设置');
					return;
				}
				var filterInfo = {
					phone: account.value,
					state: "userState0003"
				}
				var waiting = plus.nativeUI.showWaiting();
				app.userOrganization(filterInfo, function(data) {
					waiting.close();
					if(typeof data == 'string') {
						plus.nativeUI.toast(data);
						return;
					}
					if(data.length == 0) {
						plus.nativeUI.toast("账户不存在或已激活");
						return;
					}
					localStorage.setItem('$activateOrganization', JSON.stringify(data));
					if(data.length == 1) {
						var $activateAccountPar = {
							phone: account.value, //扩展参数
							org_id: data[0].org_id
						}
						localStorage.setItem('$activateAccountPar', JSON.stringify($activateAccountPar));
						var set_passwordPage = $.preload({
							"id": 'activate_account-set_password.html',
							"url": 'set_password.html'
						});
						$.fire(set_passwordPage, 'getParameter', {});
						set_passwordPage.show("pop-in");
					} else {
						var $activateAccountPar = {
							phone: account.value, //扩展参数
							org_id: ""
						}
						localStorage.setItem('$activateAccountPar', JSON.stringify($activateAccountPar));
						var select_user_orgPage = $.preload({
							"id": 'select-activate-organization.html',
							"url": 'select-activate-organization.html'
						});
						$.fire(select_user_orgPage, 'getParameter', {});
						select_user_orgPage.show("pop-in");
					}

				});
			} else {
				plus.nativeUI.toast('验证码错误');
			}
		})

	});
}(mui, document));