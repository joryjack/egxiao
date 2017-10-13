(function($, doc) {
	$.init({
		gestureConfig: {
			tap: true, //默认为true
			longtap: true //默认为false

		}
	});

	$.plusReady(function() {
		var self = plus.webview.currentWebview();
		var mui_card = doc.querySelectorAll(".mui-card");
		var rightBar = doc.getElementById("rightBar");

		var rightBarEnd = doc.getElementById("rightBarEnd");

		var table = doc.querySelectorAll('.mui-table-view');

		var rowNum = doc.querySelectorAll(".card-header-num")

		var totalNum = 0,
			userNum = 0;

		self.addEventListener('hide', function() {

			pushLessonHTML($singleStuLesson);
			var data = {
				"totalNum": 0,
				"userNum": 0,
				"enroll": []
			};
			pushLessonDetailHTML(data);
			var detailstudentwebview = plus.webview.getWebviewById('detail_student.html');
			$.fire(detailstudentwebview, 'getParameter', {});
			self.close();
		}, false);

		var account = app.getAccount();
		var $student = app.getStudent();
		var $singleStuLesson = app.getSingleStuLesson();

		pushLessonHTML($singleStuLesson);

		window.addEventListener('reload', function(options) {
			var lessonRequest = {
				org_id: account.org_id,
				stu_id: $student.id,
				lesson_id: $singleStuLesson.id
			}
			if(account) {
				console.log(JSON.stringify(lessonRequest));
				app.GetStuLessonDetailInfo(lessonRequest, function(data) {
					pushLessonDetailHTML(data);
				});
			}
		});
		var lessonRequest = {
			org_id: account.org_id,
			stu_id: $student.id,
			lesson_id: $singleStuLesson.id
		}
		if(account) {
			console.log(JSON.stringify(lessonRequest));
			app.GetStuLessonDetailInfo(lessonRequest, function(data) {
				pushLessonDetailHTML(data);
			});
		}
		window.addEventListener('getParameter', function(options) {
			var lessonRequest = {
				org_id: account.org_id,
				stu_id: $student.id,
				lesson_id: $singleStuLesson.id
			}
			if(account) {
				console.log(JSON.stringify(lessonRequest));
				app.GetStuLessonDetailInfo(lessonRequest, function(data) {
					pushLessonDetailHTML(data);
				});
			}
		});

		function pushLessonHTML($singleStuLesson) {
			var classElement = mui_card[0].childNodes;
			var classcontentElement = classElement.item(3).childNodes;

			var classcontentinnerElement = classcontentElement.item(1).childNodes;
			var p1Element = classcontentinnerElement.item(1).childNodes;
			p1Element.item(1).innerHTML = $singleStuLesson.name;

			var essontypename = doc.getElementById("lessontypename")
			lessontypename.innerHTML = app.lessonTypeHTML($singleStuLesson.type);

		}

		function pushLessonDetailHTML(data) {
			console.log(JSON.stringify(data));

			var lessontotalNum = doc.getElementById("lessontotalNum");
			var lessonuseNum = doc.getElementById("lessonuseNum");
			var lessonyuNum = doc.getElementById("lessonyuNum");
             	var lesson_unit = "";
            switch ($singleStuLesson.type){
            	case "1":
            	case "2":
            	     lesson_unit = "课时";
            		break;
            	default:
            		break;
            }
			var lesson_msg = $singleStuLesson.type == "1" || $singleStuLesson.type == "2"? "" : " <span style='color:#E66B14;'>*长按结算</span>"
			data.userNum = data.userNum == null ? 0 : data.userNum;
			data.totalNum = data.totalNum == null ? 0 : data.totalNum

			totalNum = data.totalNum;
			userNum = data.userNum;

			lessontotalNum.innerHTML = '<em class="fontcolor-primary"  style=" font-style:initial;">' + data.totalNum + '</em> ' + lesson_unit;

			lessonuseNum.innerHTML = '<em class="fontcolor-success"  style="font-style:initial; ">' + data.userNum + '</em>' + lesson_unit;
			lessonyuNum.innerHTML = '<em class="fontcolor-danger"  style="font-style:initial; ">' + (data.totalNum - data.userNum) + '</em>' + lesson_unit;

			var liHTMLEnroll = "",
				liHTMLUNEnroll = "";
			var liHTMLEnrollNum = 0,
				liHTMLUNEnrollNum = 0;

			for(var i = 0; i < data.enroll.length; i++) {

				if(data.enroll[i].lesson_number >= 0) {
					liHTMLEnroll += '  <li data-model=\'' + JSON.stringify(data.enroll[i]) + '\' class="mui-table-view-cell"><p><span class="span-left">' + data.enroll[i].create_name + '</span> <span style="padding-left: 10px; margin-left: 10px; border-left:1px solid #f5f5f5 ;">' + app.ConvertJsonTime(data.enroll[i].create_time) + '</span> ' + app.enrollStyleHTML(data.enroll[i].style) + ' </p><p>报名' + data.enroll[i].lesson_number + ' ' + lesson_unit + '   </p><p>说明' + data.enroll[i].description + ' </p></li>';
					liHTMLEnrollNum += 1;
				} else {
					liHTMLUNEnroll += '<li class="mui-table-view-cell"><p><span class="span-left">' + data.enroll[i].create_name + '</span> <span style="padding-left: 10px; margin-left: 10px; border-left:1px solid #f5f5f5 ;">' + app.ConvertJsonTime(data.enroll[i].create_time) + '</span> ' + app.enrollStyleHTML(data.enroll[i].style) + ' </p><p>退课 ' + -data.enroll[i].lesson_number + ' ' + lesson_unit + ' </p><p>说明' + data.enroll[i].description + ' </p></li>';
					liHTMLUNEnrollNum += 1
				}

			}
			table[0].innerHTML = liHTMLEnroll == "" ? '<li class="mui-table-view-cell"><p>没得报名记录</p></li>' : liHTMLEnroll;
			rowNum[0].innerHTML = liHTMLEnrollNum + "条" + lesson_msg;
			table[1].innerHTML = liHTMLUNEnroll == "" ? '<li class="mui-table-view-cell"><p>没得退课记录</p></li>' : liHTMLUNEnroll;
			rowNum[1].innerHTML = liHTMLUNEnrollNum + "条";
		}

		rightBar.addEventListener('tap', function(event) {
			var singlemodifypayPage = $.preload({
				"id": 'single_modify_pay.html',
				"url": 'single_modify_pay.html'
			});
			singlemodifypayPage.addEventListener('loaded', function() {
				$.fire(singlemodifypayPage, 'getParameter', {});
			});
			singlemodifypayPage.show("pop-in");
		});

		rightBarEnd.addEventListener('tap', function(event) {
			$singleStuLesson["totalNum"] = totalNum;
			$singleStuLesson["userNum"] = userNum;
			localStorage.setItem('$singleStuLesson', JSON.stringify($singleStuLesson));

			switch($singleStuLesson.type) {
				case "1":
				case "2":
					var single_end_enrollPage = $.preload({
						"id": 'single_end_enroll.html',
						"url": 'single_end_enroll.html'
					});

					single_end_enrollPage.addEventListener('loaded', function() {
						$.fire(single_end_enrollPage, 'getParameter', {});
					});
					single_end_enrollPage.show("pop-in");
					break;
				case "3":
					var single_end_enrollsemesterPage = $.preload({
						"id": 'single_end_enrollsemester.html',
						"url": 'single_end_enrollsemester.html'
					});

					single_end_enrollsemesterPage.addEventListener('loaded', function() {
						$.fire(single_end_enrollsemesterPage, 'getParameter', {});
					});
					single_end_enrollsemesterPage.show("pop-in");
					break;
				default:
					break;
			}

		});

		$(".enroll").on('longtap', 'li', function() {
			var $this = this;
			var enrollModel = JSON.parse($this.dataset.model);
			if(enrollModel.style == "0") {
				var btnArray = ['是', '否'];
				mui.confirm('确定结算?操作不可逆。', '结算报名', btnArray, function(e) {
					if(e.index == 1) {
						console.log("否")
					} else {
						var enrollRequest = {
							id: enrollModel.id,
							org_id: account.org_id,
							stu_id: $student.id,
							payment: enrollModel.payment,
							discount: enrollModel.discount,
							style: "2"
						}
						if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
							plus.nativeUI.toast('网络不给力，请检查网络设置');
							return;
						}
						console.log(JSON.stringify(enrollRequest));
						var waiting = plus.nativeUI.showWaiting();
						app.SaveHSEnrollSemester(enrollRequest, function(data) {
							waiting.close();
							if(data.success) {
								var lessonRequest = {
									org_id: account.org_id,
									stu_id: $student.id,
									lesson_id: $singleStuLesson.id
								}
								if(account) {
									console.log(JSON.stringify(lessonRequest));
									app.GetStuLessonDetailInfo(lessonRequest, function(data) {
										pushLessonDetailHTML(data);
									});
								}
							} else {
								$.toast(data.msg);
							}
						});
					}
				});
			}
		});

	});
})(mui, document)