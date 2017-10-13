(function($, doc) {
	$.init();
	$.plusReady(function() {
		var lessonName = doc.getElementById('lessonName');
		var lessonyuNum = doc.getElementById('lessonyuNum');
		var lesson_number = doc.getElementById('lesson_number');
		var description = doc.getElementById("description");
		var rightBar = doc.getElementById('rightBar');
		var payment = doc.getElementById('payment');
		var payment_div = doc.getElementById('payment_div');

		$('.mui-content .mui-switch').each(function() {
			//toggle.classList.contains('mui-active') 可识别该toggle的开关状态
			if(this.classList.contains('mui-active')) {
				payment_div.classList.remove("mui-hidden");
				payment.value = "";
			} else {
				payment_div.classList.add("mui-hidden");
				payment.value = "";
			}

			/**
			 * toggle 事件监听
			 */
			this.addEventListener('toggle', function(event) {
				//event.detail.isActive 可直接获取当前状态
				if(event.detail.isActive) {
					payment_div.classList.remove("mui-hidden");
					payment.value = "";
				} else {
					payment_div.classList.add("mui-hidden");
					payment.value = "";
				}
			});
		});

		var self = plus.webview.currentWebview();
		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			lessonName.innerHTML = "";
			lessonyuNum.value = 0;
			lesson_number.value = "";
			description.value = "";
			var singlestulessonwebview = plus.webview.getWebviewById('singlestu_lesson.html');
			$.fire(singlestulessonwebview, 'reload', {});
			self.close();
		}, false);

		var $singleStuLesson = app.getSingleStuLesson();

		if(JSON.stringify($singleStuLesson) != '{}') {
			console.log(JSON.stringify($singleStuLesson));
			lessonName.innerHTML = $singleStuLesson.name;
			lessonyuNum.value = $singleStuLesson.totalNum - $singleStuLesson.userNum;
		}

		//提交
		rightBar.addEventListener('tap', function() {
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			if(lesson_number.value == "") {
				$.toast('请输入数量');
				return;
			}
			if(parseFloat(lesson_number.value, 10) > parseFloat(lessonyuNum.value, 10)) {
				$.toast('退的天数大于天数');
				return;
			}

			var account = app.getAccount();
			var student = app.getStudent();

			var payment_value = payment.value == "" ? "0" : payment.value;
			if(account) {
				var enrollRequest = {
					org_id: account.org_id,
					camp_id: account.campus_id,
					lesson_id: $singleStuLesson.id,
					lesson_name: $singleStuLesson.name,
					lesson_price: $singleStuLesson.price,
					lesson_type: $singleStuLesson.type,
					lesson_number: parseFloat(lesson_number.value, 10),
					stu_id: student.id,
					stu_name: student.name,
					payment: parseFloat(payment_value, 10),
					description: description.value,
					create_by: account.id,
					create_name: account.name
				}
				var waiting = plus.nativeUI.showWaiting();
				app.SaveEndEnroll(enrollRequest, function(data) {
					waiting.close();
					if(typeof data == 'string') {
						$.toast(data);
						return;
					} else {
						if(data.success) {
							$.toast(data.msg);
							$.back();
						} else {
							$.toast(data.msg);
						}
					}
				});
			} else {
				$.toast("数据丢失");
			}

		}, false);
	})
})(mui, document)