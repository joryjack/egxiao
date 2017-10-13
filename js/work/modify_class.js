(function($, doc) {
	$.init();
	$.plusReady(function() {
		var selectlessonId = "",
			Lessontype = "";

		var class_name = doc.getElementById('class_name');
		var selectlesson = doc.getElementById('selectlesson');
		var lesson_type = doc.getElementById('lesson_type');
		var rightBar = doc.getElementById('rightBar');
		var description = doc.getElementById("description");

		var self = plus.webview.currentWebview();
		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			class_name.value = "";
			selectlesson.innerHTML = "请选择";
			Lessontype = "";
			lesson_type.value = "";
			description.value = "";

			var classListwebview = plus.webview.getWebviewById('class_list.html');
			$.fire(classListwebview, 'reload', {});
			self.close();
		}, false);

		//选课程
		selectlesson.addEventListener('tap', function() {
			var select_lesson_mainPage = $.preload({
				"id": 'select_lesson_main.html',
				"url": 'select_lesson_main.html'
			});
			var selectLessonInfo = {
				"selectlessonId": selectlessonId,
				"action": "class",
				"enable_flag":""
			}
			localStorage.setItem('$selectLessonInfo', JSON.stringify(selectLessonInfo));
			var select_lesson_listwebview = plus.webview.getWebviewById('select_lesson_list.html');
			$.fire(select_lesson_listwebview, 'getParameter', {
				id: selectlessonId
			});
			$.fire(select_lesson_mainPage, 'getParameter', {});
			select_lesson_mainPage.show("pop-in");
		});

		window.addEventListener('selectLessonParameter', function(options) {
			if(options.detail.id) {
				selectlessonId = options.detail.id;
				selectlesson.value = options.detail.name;
				Lessontype = options.detail.type;
				switch(Lessontype) {
					case "1": //学时
						lesson_type.value = "课时";
						break;
					case "2":
						lesson_type.value = "课时包";
						break;
					default:
						break;
				}

			}
		});

		//提交
		rightBar.addEventListener('tap', function() {
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			if(class_name.value.trim() == "") {
				$.toast("请填写班级名称");
				return;
			}
			if(selectlessonId == "") {
				$.toast("请选择课程");
				return;
			}
			var account = app.getAccount();
			if(account) {
				var classRequest = {
					org_id: account.org_id,
					name: class_name.value.trim(),
					lesson_id: selectlessonId,
					lesson_name: selectlesson.value,
					lesson_type: Lessontype,
					description: description.value,
					create_by: account.id,
					campus_id: account.campus_id
				}
				var waiting = plus.nativeUI.showWaiting();
				 console.log(JSON.stringify(classRequest));
				app.SaveClass(classRequest, function(data) {
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