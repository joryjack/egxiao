(function($, doc) {
	$.init();
	$.plusReady(function() {
		var selectClassId = "",
			selectPersonnelId = "",
			subjectId = "";
		var selectClass = doc.getElementById("selectClass");
		var lesson_name = doc.getElementById("lesson_name");
		var lessonDate = doc.getElementById("lessonDate");
		var lesson_number = doc.getElementById("lesson_number");
		var showSubject = doc.getElementById("showSubject");
		var showLessonState = doc.getElementById("showLessonState");
		var showLessonStyle = doc.getElementById("showLessonStyle");
		var description = doc.getElementById("description");

		var selectTeacher = doc.getElementById("selectTeacher");
		var subjectUL = doc.body.querySelector('#showSubjectPopover .mui-table-view');

		var rightBar = doc.getElementById("rightBar");
		var inputList = doc.querySelectorAll('input');

		lessonDate.value = app.getNowFormatShortDate();

		var self = plus.webview.currentWebview();
		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			selectClassId = "";
			selectPersonnelId = "";
			subjectId = "";
			$.each(inputList, function(index, item) {
				item.value = '';
			});
			var notelessonListwebview = plus.webview.getWebviewById('notelesson_list.html');
			$.fire(notelessonListwebview, 'reload', {});
			self.close();
		}, false);
		//选班级
		selectClass.addEventListener('tap', function() {
			var select_student_mainPage = $.preload({
				"id": 'select_class_main.html',
				"url": 'select_class_main.html'
			});
			var $selectClassInfo = {
				"selectClassId": selectClassId,
				"action": "class_noteLesson",
				"state": [2]
			}
			localStorage.setItem('$selectClassInfo', JSON.stringify($selectClassInfo));
			var select_student_listwebview = plus.webview.getWebviewById('select_class_list.html');
			$.fire(select_student_listwebview, 'getParameter', {
				id: selectClassId
			});
			$.fire(select_student_mainPage, 'getParameter', {});
			select_student_mainPage.show("pop-in");
		});

		window.addEventListener('selectClassParameter', function(options) {
			
				var modelstring = options.detail.model || "{}";
				var model = JSON.parse(modelstring);
				selectClassId = model.id;
				selectClass.value = model.name;
				lesson_name.value  = model.lesson_name;
				if(model.pre_teacher_id != null) {
					selectPersonnelId = model.pre_teacher_id;
					selectTeacher.value = model.pre_teacher_name;
				}
				if(model.pre_subject_id != null) {
					showSubject.value = model.pre_subject_name;
					subjectId = model.pre_subject_id;
				}
                if(model.pre_lesson_number != null) {
					lesson_number.value =model.pre_lesson_number;
				}
		});

		//日期
		lessonDate.addEventListener('tap', function() {
			var $this = this;
			var optionsJson = $this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var picker = new $.DtPicker(options);
			picker.show(function(rs) {
				$this.value = rs.text;
				picker.dispose();
			});
		});
		//科目
		var noteLessonSubjectList = app.getNoteLessonSubject();
		var subjecthtmlStr = "";
		for(var i = 0; i < noteLessonSubjectList.length; i++) {
			var subject = noteLessonSubjectList[i];
			subjecthtmlStr += '<li class="mui-table-view-cell"><a  data-subjectid="' + subject.id + '" >' + subject.name + '</a></li>';

		}
		subjectUL.innerHTML = subjecthtmlStr;
		$('.mui-scroll-wrapper').scroll();
		showSubject.addEventListener('tap', function() {
			$("#showSubjectPopover").popover("toggle");
		});

		$("#showSubjectPopover .mui-table-view").on('tap', 'a', function() {
			showSubject.value = this.innerText;
			subjectId = this.dataset.subjectid;
			$("#showSubjectPopover").popover("toggle");
		});

		//状态
		showLessonState.addEventListener('tap', function() {
			$("#showLessonStatePopover").popover("toggle");
		});

		$("#showLessonStatePopover .mui-table-view").on('tap', 'a', function() {
			showLessonState.value = this.innerText;
			$("#showLessonStatePopover").popover("toggle");
		});

		showLessonStyle.addEventListener('tap', function() {
			$("#showLessonStylePopover").popover("toggle");
		});

		$("#showLessonStylePopover .mui-table-view").on('tap', 'a', function() {
			showLessonStyle.value = this.innerText;
			$("#showLessonStylePopover").popover("toggle");
		});

		//教务 dean
		selectTeacher.addEventListener('tap', function() {
			var byrole_personnel_mainPage = $.preload({
				"id": 'byrole_personnel_main.html',
				"url": 'byrole_personnel_main.html'
			});
			var byrolePersonnelInfo = {
				"selectPersonnelId": selectPersonnelId,
				"action": "class_noteLesson",
				"other": false,
				"roleidList": ["09a3d67a7a914d199fa31ffa15f0ca8a"]
			}
			localStorage.setItem('$byrolePersonnelInfo', JSON.stringify(byrolePersonnelInfo));
			var byrole_personnel_listwebview = plus.webview.getWebviewById('byrole_personnel_list.html');
			$.fire(byrole_personnel_listwebview, 'getParameter', {
				id: selectPersonnelId
			});
			$.fire(byrole_personnel_mainPage, 'getParameter', {});
			byrole_personnel_mainPage.show("pop-in");
		});
		window.addEventListener('selectPersonnelParameter', function(options) {
			if(options.detail.id) {
				selectPersonnelId = options.detail.id;
				selectTeacher.value = options.detail.name;
			}
		});

		//提交
		rightBar.addEventListener('tap', function() {
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			if(selectClassId == "") {
				$.toast('请选择班级');
				return;
			}
			if(lesson_number.value == "") {
				$.toast('请输入数量');
				return;
			}

			if(lessonDate.value == "") {
				$.toast('请选择日期时间');
				return;
			}

			if(showSubject.value == "") {
				$.toast('请选择科目');
				return;
			}

			if(showLessonState.value == "") {
				$.toast('请选择上课状态');
				return;
			}

			if(selectPersonnelId == "") {
				$.toast('请选择上课老师');
				return;
			}
			var account = app.getAccount();

			if(account) {
				var notelessonRequest = {
					org_id: account.org_id,
					lesson_num: lesson_number.value,
					lesson_time: lessonDate.value,
					subject_id: subjectId,
					subject_name: showSubject.value,
					teacher_id: selectPersonnelId,
					teacher_name: selectTeacher.value,
					state: showLessonState.value,
					style: showLessonStyle.value,
					create_by: account.id,
					campus_id: account.campus_id,
					description: description.value
				}
				var classnotelessonRequest = {
					class_id: selectClassId,
					noteLesson: notelessonRequest
				}

				console.log(JSON.stringify(classnotelessonRequest));

				var waiting = plus.nativeUI.showWaiting();

				app.SaveNoteLessonbyClass(classnotelessonRequest, function(data) {
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

	});
})(mui, document)