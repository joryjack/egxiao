(function($, doc) {
	$.init();
	$.plusReady(function() {
		var selectStudentId = "",
			selectlessonId = "",
			Lessontype = "",
			selectPersonnelId = "",
			subjectId = "",
			lesson_price = "";
		var selectStudent = doc.getElementById("selectStudent");
		var selectlesson = doc.getElementById("selectlesson");
		var lesson_type = doc.getElementById('lesson_type');
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
		var self = plus.webview.currentWebview();

		var notelessondata = app.getnotelessondata();
      
		if(JSON.stringify(notelessondata) != "{}") {
			selectStudentId = notelessondata.student_id;
			selectStudent.value = notelessondata.student_name;
			selectlessonId = notelessondata.lesson_id;
			selectlesson.value = notelessondata.lesson_name;
			Lessontype = notelessondata.lesson_type;
			lesson_price = notelessondata.lesson_price;
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
			lesson_number.value = notelessondata.lesson_num;
			lessonDate.value = app.getNowFormatShortDate();
			showSubject.value = notelessondata.subject_name;
			subjectId = notelessondata.subject_id;

			showLessonState.value = app.getnoteLessonStateValue(notelessondata.state);
			showLessonStyle.value = app.getNoteLessonStyleValue(notelessondata.style);

			selectPersonnelId = notelessondata.teacher_id;
			selectTeacher.value = notelessondata.teacher_name;
		}

		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			selectStudentId = "";
			selectlessonId = "";
			Lessontype = "";
			selectPersonnelId = "";
			subjectId = "";
			lesson_price = "";
			$.each(inputList, function(index, item) {
				item.value = '';
			});
			var notelessonListwebview = plus.webview.getWebviewById('notelesson_list.html');
			$.fire(notelessonListwebview, 'reload', {});
			self.close();
		}, false);
		//选学员
		selectStudent.addEventListener('tap', function() {
			var select_student_mainPage = $.preload({
				"id": 'select_student_main.html',
				"url": 'select_student_main.html'
			}); 
			var selectStudentInfo = {
					"selectStudentId": selectStudentId,
					"action": "again_noteLesson",
					"state": []
				}
				//"stuState0002"
			localStorage.setItem('$selectStudentInfo', JSON.stringify(selectStudentInfo));
			var select_student_listwebview = plus.webview.getWebviewById('select_student_list.html');
			$.fire(select_student_listwebview, 'getParameter', {
				id: selectStudentId
			});
			$.fire(select_student_mainPage, 'getParameter', {});
			select_student_mainPage.show("pop-in");
		});

		window.addEventListener('selectStudentParameter', function(options) {
			if(options.detail.id) {
				selectStudentId = options.detail.id;
				selectStudent.value = options.detail.name;
			}
		});

//		//选课程
//		selectlesson.addEventListener('tap', function() {
//			var select_lesson_mainPage = $.preload({
//				"id": 'select_lesson_main.html',
//				"url": 'select_lesson_main.html'
//			});
//			var selectLessonInfo = {
//				"selectlessonId": selectlessonId,
//				"action": "again_noteLesson",
//				"enable_flag": ""
//			}
//			localStorage.setItem('$selectLessonInfo', JSON.stringify(selectLessonInfo));
//			var select_lesson_listwebview = plus.webview.getWebviewById('select_lesson_list.html');
//			$.fire(select_lesson_listwebview, 'getParameter', {
//				id: selectlessonId
//			});
//			$.fire(select_lesson_mainPage, 'getParameter', {});
//			select_lesson_mainPage.show("pop-in");
//		});
//
//		window.addEventListener('selectLessonParameter', function(options) {
//
//			if(options.detail.id) {
//				console.log(options.detail.name);
//				selectlessonId = options.detail.id;
//				selectlesson.value = options.detail.name;
//				Lessontype = options.detail.type;
//				lesson_price = options.detail.price;
//				switch(Lessontype) {
//					case "1": //学时
//						lesson_type.value = "学时制";
//						break;
//					case "2":
//						lesson_type.value = "学期制";
//						break;
//					default:
//						break;
//				}
//			}
//		});

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

		//上课老师
		selectTeacher.addEventListener('tap', function() {
			var byrole_personnel_mainPage = $.preload({
				"id": 'byrole_personnel_main.html',
				"url": 'byrole_personnel_main.html'
			});
			var byrolePersonnelInfo = {
				"selectPersonnelId": selectPersonnelId,
				"action": "again_noteLesson",
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
			if(selectStudentId == "") {
				$.toast('请选择学员');
				return;
			}

			if(selectlessonId == "") {
				$.toast('请选择课程');
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
					student_id: selectStudentId,
					student_name: selectStudent.value,
					lesson_id: selectlessonId,
					lesson_name: selectlesson.value,
					lesson_price: lesson_price,
					lesson_type: Lessontype,
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

				console.log(JSON.stringify(notelessonRequest));

				var waiting = plus.nativeUI.showWaiting();
				app.SaveNoteLesson(notelessonRequest, function(data) {
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