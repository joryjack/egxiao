(function($, doc) {
	$.init();
	$.plusReady(function() {

		var lessonName = doc.getElementById('lessonName');
		var lessonyuNum = doc.getElementById('lessonyuNum');
		var lesson_number = doc.getElementById('lesson_number');
		var description = doc.getElementById("description");
		var rightBar = doc.getElementById('rightBar');

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
				$.toast('请输入课时数量');
				return;
			}
			if(parseFloat(lesson_number.value, 10) > parseFloat(lessonyuNum.value, 10)) {
				$.toast('退的课时数大于剩余课时数');
				return;
			}
             
             if(description.value.trim() ==""){
             	$.toast('请填写退课原因');
				return;
             }
 
			var account = app.getAccount();
			var student = app.getStudent();
			if(account) {

				var payment;
				switch($singleStuLesson.type) {
					case "1":
						payment = $singleStuLesson.price * parseFloat(lesson_number.value, 10)
						break;
					case "2":
						payment = (parseFloat($singleStuLesson.price, 10) / parseFloat($singleStuLesson.lesson_num, 10) * parseFloat(lesson_number.value, 10)).toFixed(2);
						break;
					default:
						break;
				}

				var enrollRequest = {
					org_id: account.org_id,
					camp_id: account.campus_id,
					lesson_id: $singleStuLesson.id,
					lesson_name: $singleStuLesson.name,
					lesson_price: $singleStuLesson.price,
					lesson_type: $singleStuLesson.type,
					payment: payment,
					lesson_number: parseFloat(lesson_number.value, 10),
					stu_id: student.id,
					stu_name: student.name,
					description: description.value,
					create_by: account.id,
					create_name: account.name
				}
				console.log(JSON.stringify(enrollRequest) );
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