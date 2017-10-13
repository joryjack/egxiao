(function($, doc) {
	$.init();

	$.plusReady(function() {
		var self = plus.webview.currentWebview();
		var mui_card = doc.querySelectorAll(".mui-card");
		var rightBar = doc.getElementById("rightBar");
		var editClassBar = doc.getElementById("editClassBar");

		var studentPhone = "";

		var table = document.body.querySelector('.mui-table-view');

		var studentNum = doc.body.querySelector(".card-header-num")

		self.addEventListener('hide', function() {
			//			var data = {
			//				"lesson_name": "",
			//				"payment": "",
			//				"arrears": "",
			//				"stu_name": ""
			//			};
			//			pushClassHTML(data);
			//			table.innerHTML = '<li class="mui-table-view-cell"><p></p></li>';
			var payListwebview = plus.webview.getWebviewById('class_list.html');
			$.fire(payListwebview, 'reload', {});
			self.close();
		}, false);

		var account = app.getAccount();
		var $class = app.getClass();
		pushClassHTML($class);
		var classStudentRequest = {
			org_id: account.org_id,
			lesson_id: $class.lesson_id,
			class_id: $class.id
		}
		if(account) {
			app.GetClassStudent(classStudentRequest, function(data) {
				pushStudentHTML(data);
			});
		}
		window.addEventListener('reloaddetailclass', function(options) {
			$class = app.getClass();
			pushClassHTML($class);
			var classStudentRequest = {
				org_id: account.org_id,
				lesson_id: $class.lesson_id,
				class_id: $class.id
			}
			if(account) {
				app.GetClassStudent(classStudentRequest, function(data) {
					pushStudentHTML(data);
				});
			}
		});

		window.addEventListener('getParameter', function(options) {
			var classStudentRequest = {
				org_id: account.org_id,
				lesson_id: $class.lesson_id,
				class_id: $class.id
			}
			if(account) {
				app.GetClassStudent(classStudentRequest, function(data) {
					pushStudentHTML(data);
				});
			}
		});

		function pushClassHTML($class) {
			var classElement = mui_card[0].childNodes;
			var classcontentElement = classElement.item(3).childNodes;

			var classcontentinnerElement = classcontentElement.item(1).childNodes;
			var p1Element = classcontentinnerElement.item(1).childNodes;
			p1Element.item(1).innerHTML = $class.name;

			var p2Element = classcontentinnerElement.item(3).childNodes;
			p2Element.item(1).innerHTML = $class.lesson_name;

			var p3Element = classcontentinnerElement.item(5).childNodes;
			p3Element.item(1).innerHTML = app.lessonTypeHTML($class.lesson_type)

			var p4Element = classcontentinnerElement.item(7).childNodes;
			p4Element.item(1).innerHTML = $class.description;

		}

		function pushStudentHTML(data) {
			console.log(JSON.stringify(data));
			studentNum.innerHTML = data.length + "个"
			var liHTML = "";
			for(var i = 0; i < data.length; i++) {
				var _totalNum = data[i].totalNum == null ? 0 : data[i].totalNum;
				var _useNum = data[i].useNum == null ? 0 : data[i].useNum;
				var notelessonHTML = "";
				if($class.lesson_type == "1" || $class.lesson_type == "2") {
					notelessonHTML = data[i].noteLesson == null ? "" : data[i].noteLesson.teacher_name + '/' + data[i].noteLesson.lesson_num + '课时/' + app.ConvertJsonTime(data[i].noteLesson.lesson_time);
				} else {
					notelessonHTML = data[i].noteLesson == null ? "" : data[i].noteLesson.teacher_name + '/' + data[i].noteLesson.lesson_num + '天/' + app.ConvertJsonTime(data[i].noteLesson.lesson_time);
				}

				liHTML += '<li class="mui-table-view-cell student" data-model=\'' + JSON.stringify(data[i].student) + '\' ><div class="mui-slider-left mui-disabled"><a class="mui-btn mui-btn-warning">出班</a></div><div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-warning">出班</a></div>  	<div class="mui-slider-handle">   <div class="oa-contact-cell mui-table"><div class="oa-contact-avatar mui-table-cell" style="width: 55px;"> <img src="../images/50x50s.png" style="width: 40px;" /></div>  <div class="oa-contact-content mui-table-cell"><div class="mui-clearfix"><h4 class="oa-contact-name">' + data[i].student.name + '</h4></div><p class="oa-contact-email mui-h6"><span>' + (data[i].noteLesson == null ? "无" : notelessonHTML) + '</span></p> ' + lesssonDetailHTML($class.lesson_type, _totalNum, _useNum) + ' </div></div>   </div></li>';

			}
			table.innerHTML = liHTML == "" ? '<li class="mui-table-view-cell"><p>暂无</p></li>' : liHTML;
		}

		/**
		 * 学员课程详情
		 */
		function lesssonDetailHTML(lesson_type, totalNum, useNum) {
			var _lesssonDetailHTML = "";
			if(lesson_type == "1" || lesson_type == "2") {
				_lesssonDetailHTML = '<p class="oa-contact-email mui-h6"><div class="mui-row mui-h6"><div class="mui-col-xs-4">总：<span>' + totalNum + '</span></div><div class="mui-col-xs-4">消：<span>' + useNum + '</span></div><div class="mui-col-xs-4">剩：<span>' + (totalNum - useNum) + '</span></div></div></p>';
			}
			return _lesssonDetailHTML
		}
		/**
		 * 学员出班
		 */
		var btnArray = ['确认', '取消'];
		$('.mui-table-view').on('tap', '.mui-btn-warning', function() {

			var elem = this;
			var li = elem.parentNode.parentNode;
			mui.confirm('确定对学员进行出班操作?出班后记上课该学员将不再随班记上课。？', '学员出班', btnArray, function(e) {

				if(e.index == 1) {
					console.log("否")
				} else {
					var model = JSON.parse(li.dataset.model);
					var classStudentRequest = {
						org_id: account.org_id,
						class_id: $class.id,
						student_id: model.id
					}

					if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
						plus.nativeUI.toast('网络不给力，请检查网络设置');
						return;
					}
					var waiting = plus.nativeUI.showWaiting();
					app.deleteClassStudent(classStudentRequest, function(data) {
						waiting.close();
						if(data.success) {
							studentNum.innerHTML = (parseInt(studentNum.innerHTML, 10) - 1) + "个";

							li.parentElement.removeChild(li);
						} else {
							$.toast(data.msg);
						}
					});
				}
			});

		});

		editClassBar.addEventListener('tap', function(event) {
			var modifyStudentPage = $.preload({
				"id": 'edit_class.html',
				"url": 'edit_class.html'
			});
			modifyStudentPage.addEventListener('loaded', function() {
				$.fire(modifyStudentPage, 'getParameter', {});
			});
			modifyStudentPage.show("pop-in");
		});
		/**
		 * 添加班内学员
		 */
		rightBar.addEventListener('tap', function(event) {
			var addclassStudentPage = $.preload({
				"id": 'add_classStudent.html',
				"url": 'add_classStudent.html'
			});
			addclassStudentPage.addEventListener('loaded', function() {
				$.fire(addclassStudentPage, 'getParameter', {});
			});
			addclassStudentPage.show("pop-in");
		});

		$(".mui-table-view").on('tap', '.student', function() {
			var contentdata = this.dataset.model;
			console.log(contentdata);
			var modifyStudentPage = $.preload({
				"id": 'detail_student.html',
				"url": 'detail_student.html'
			});
			var student = JSON.parse(contentdata);
			//student.source = getSourceValue(student.source);
			localStorage.setItem('$student', JSON.stringify(student));
			modifyStudentPage.show("pop-in");
		});
	});
})(mui, document)