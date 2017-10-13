(function($, doc) {
	$.init();
	$.plusReady(function() {
		var lessonname = doc.getElementById("lessonname");
		var selectType = doc.getElementById("selectType");
		var lessonnumdiv = doc.getElementById("lessonnumdiv");
		var lessonnum = doc.getElementById("lessonnum");
		lessonnum.value = "";

		var price = doc.getElementById("price");

		var description = doc.getElementById("description");

		var rightBar = doc.getElementById("rightBar");
		var inputList = doc.querySelectorAll('input');
		var self = plus.webview.currentWebview();
		var id = "";
		var title = doc.querySelector('.mui-title');

		var selectTypeClassList = selectType.classList;

		selectType.addEventListener('tap', function() {
			$("#popover").popover("toggle");
		});

		$(".mui-table-view").on('tap', 'a', function() {
			lessonnum.value = "";
			var lessonTypeName = this.innerText;
			switch(lessonTypeName) {
				case "课时":
					lessonnumdiv.classList.remove("mui-hidden");
					lessonnumdiv.classList.add("mui-hidden");
					break;
				case "课时包":
					lessonnumdiv.classList.remove("mui-hidden");
					break;
				default:
					break;
			}
			selectType.innerHTML = this.innerText;
			$("#popover").popover("toggle");
		});
		price.addEventListener('input', function(event) {
			var value = this.value;
			if(value.length > 8) {
				this.value = value.substring(0, 8);
			}
		});

		selectTypeClassList.remove("mui-disabled");
		var lesson = app.getmodifyLesson();
		if(JSON.stringify(lesson) != "{}") {
			lessonname.value = lesson.name;

			selectType.innerHTML = app.lessonTypeHTML(lesson.type);
			switch(lesson.type) {
				case "1":
					lessonnumdiv.classList.remove("mui-hidden");
					lessonnumdiv.classList.add("mui-hidden");
					break;
				case "2":
					lessonnumdiv.classList.remove("mui-hidden");
					break;
				default:
					break;
			}
			price.value = lesson.price;
			lessonnum.value  = lesson.lesson_num;
			var descriptionValue = lesson.description
			
			description.value = descriptionValue == "null" ? "" : descriptionValue;
			id = lesson.id;
			title.innerHTML = "编辑课程";
		} else {
			title.innerHTML = "新建课程";
			selectType.innerHTML = "请选择";
		}

		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			$.each(inputList, function(index, item) {
				item.value = '';
			});
			var campuswebview = plus.webview.getWebviewById('lesson_list.html');
			$.fire(campuswebview, 'reload', {});

			self.close();
		}, false);

		rightBar.addEventListener('tap', function() {
			var account = app.getAccount();
			if(lessonname.value.trim() == "") {
				$.toast("没有填写课程名称");
				return;
			}
			if(selectType.innerHTML == "请选择") {
				$.toast("请选择课程类型");
				return;
			}
			if(price.value == "") {
				$.toast("请输入课程价格");
				return;
			}
			if(lessonnumdiv.classList.contains('mui-hidden')) {
				lessonnum.value = 0;
			} else {
				if(lessonnum.value == "") {
					$.toast("请输入课时数量");
					return;
				}
			}

			if(account) {
				var lesson = {
					id: id,
					org_id: account.org_id,
					name: lessonname.value.trim(),
					price: price.value,
					type: selectType.innerHTML,
					lesson_num: lessonnum.value,
					enable_flag: "1",
					description: description.value
				}
				if(id != null && id != "") {
					lesson["update_by"] = account.id;
				} else {
					lesson["create_by"] = account.id;
				}

				var waiting = plus.nativeUI.showWaiting();
				app.SaveLesson(lesson, function(data) {
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