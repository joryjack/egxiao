(function($, doc) {
	$.init();
	$.plusReady(function() {
		var settings = app.getSettings();
		var account = doc.getElementById("account");
		var validateCodebtn = doc.getElementById("validateCodebtn");
		var validateCode = doc.getElementById("validateCode");
		var register = doc.getElementById("register");
		var servicecode = "joryjack";
		account.addEventListener('input', function() {
			if(app.validatePhone(account.value)) {
				var validateCodebtnlist = validateCodebtn.classList;

				validateCodebtnlist.remove('mui-btn-grey', 'mui-disabled');
				validateCodebtnlist.add('mui-btn-primary');
			}
		});

		validateCodebtn.addEventListener('tap', function(event) {
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			var smsInfo = {
				phone: account.value,
				template_type: "register"
			};
			app.validatecode(smsInfo, function(data) {
				if(typeof data == 'string') {
					plus.nativeUI.toast(data);
					return;
				} else {
					if(data.success) {
						app.setCode(data.err_code);
					} else {
						plus.nativeUI.toast(data.msg);
					}
				}
			})
			var validateCodebtnlist = validateCodebtn.classList;
			var time = 60,
				timer = setInterval(function() {
					validateCodebtnlist.add('mui-btn-grey', 'mui-disabled');
					validateCodebtnlist.remove('mui-btn-primary');
					validateCodebtn.innerHTML = (--time) + "秒重新获取", time <= 0 && (
						validateCodebtnlist.remove('mui-btn-grey', 'mui-disabled'),
						validateCodebtnlist.add('mui-btn-primary'), validateCodebtn.innerHTML = "再次获取", clearInterval(timer));
				}, 1e3);

			//plus.nativeUI.toast('获取验证码');
		})
		validateCode.addEventListener('input', function() {
			if(this.value.length == 6) {
				var registerlist = register.classList;
				registerlist.remove('mui-btn-grey', 'mui-disabled');
				registerlist.add('mui-btn-primary');
			}
		});

		register.addEventListener('tap', function(event) {
			if(app.checkCode(validateCode.value)) {
				var user = {
					phone: account.value
				}
				localStorage.setItem('$phone', account.value);
				$.openWindow({
					url: 'createOrg.html',
					id: 'createOrg.html',
					show: {
						aniShow: 'pop-in'
					},
					waiting: {
						autoShow: false
					}
				});
			} else {
				plus.nativeUI.toast('验证码错误');
			}
		})
	});

})(mui, document)