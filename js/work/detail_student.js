(function($, doc) {
	$.init();

	$.plusReady(function() {

		mui('.mui-scroll-wrapper').scroll();

		/**
		 * 参数
		 */
		var contact_cell = doc.querySelectorAll(".oa-contact-cell");
		var detailStuElementList = doc.querySelectorAll(".detailStuElement");

		var studentphoneBtn = doc.getElementById("studentphoneBtn");
		var self = plus.webview.currentWebview();
		var mui_card = doc.querySelectorAll(".mui-card");
		var showRecordDetail = doc.getElementById("showRecordDetail");
		var showNoteLessonDetail = doc.getElementById("showNoteLessonDetail");
		var showEnrollDetail = doc.getElementById("showEnrollDetail");
		var addNewLesson = doc.getElementById("addNewLesson");

		var rightBar = doc.getElementById("rightBar");
		var description = doc.getElementById("description");
		var sales = doc.getElementById("sales");
		var sales_union = doc.getElementById("sales_union");
		var dean = doc.getElementById("dean");
		var dean_union = doc.getElementById("dean_union");

		var studentsate = doc.getElementById("studentsate");
		var studentsource = doc.getElementById("studentsource");
		var studentsex = doc.getElementById("studentsex");
		var phone = "",
			phone2 = "",
			studentPhone = "";

		var phoneUL = doc.body.querySelector('#showPhonePopover .mui-table-view');

		var ConvertJsonTime = function(lastrecordtime) {
			if(lastrecordtime == null || lastrecordtime == "") {
				return "暂无"
			}
			return new Date(lastrecordtime).toISOString().replace(/T/g, ' ').replace(/:[\d]{2}\.[\d]{3}Z/, '');
		}

		self.addEventListener('hide', function() {
			var data = {
				"recordNum": 0,
				"record": null,
				"noteLessonNum": 0,
				"noteLesson": null,
				"lessonNum": 0,
				"lesson": [],
				"simpleMclass": [],
				"studentCost": {
					"payment": 0,
					"arrears": 0,
					"balance": 0,
					"cash_coupon_total": 0,
					"cash_coupon": 0,
					"refund": 0
				}
			};
			pushHTML(data);
			var studentListwebview = plus.webview.getWebviewById('student_list.html');
			$.fire(studentListwebview, 'reload', {});
			self.close();
		}, false);
		var account = app.getAccount();
		var student = app.getStudent();
		pushStudentHtml(student);

		window.addEventListener('reloadStudent', function(options) {
			student = app.getStudent();
			pushStudentHtml(student);
		});
		var studentRequest = {
			org_id: account.org_id,
			stu_id: student.id
		}
		if(account) {
			app.GetStudentdDetailInfo(studentRequest, function(data) {
				pushHTML(data);
			});
		}
		window.addEventListener('getParameter', function(options) {
			student = app.getStudent();
			pushStudentHtml(student);
			var studentRequest = {
				org_id: account.org_id,
				stu_id: student.id
			}
			if(account) {
				app.GetStudentdDetailInfo(studentRequest, function(data) {
					pushHTML(data);
				});
			}
		});
		rightBar.addEventListener('tap', function(event) {
			var modifyStudentPage = $.preload({
				"id": 'edit_student.html',
				"url": 'edit_student.html'
			});
			modifyStudentPage.addEventListener('loaded', function() {
				$.fire(modifyStudentPage, 'getParameter', {});
			});
			modifyStudentPage.show("pop-in");
		});

		studentphoneBtn.addEventListener('tap', function() {
			if(phone2 == "" && studentPhone == "") {
				if(mui.os.plus) {
					plus.device.dial(phone);
				} else {
					location.href = phone;
				}
			} else {
				var phonehtmlStr = "";
				phonehtmlStr += '<li class="mui-table-view-cell"><a  data-phone="' + phone + '" >' + phone + '<span class="mui-pull-right">家长</span></a></li>';
				if(phone2 != "") {
					phonehtmlStr += '<li class="mui-table-view-cell"><a  data-phone="' + phone2 + '" >' + phone2 + '<span class="mui-pull-right">家长</span></a></li>';
				}
				if(studentPhone != "") {
					phonehtmlStr += '<li class="mui-table-view-cell"><a  data-phone="' + studentPhone + '" >' + studentPhone + '<span class="mui-pull-right">学员</span></a></li>';
				}
				phoneUL.innerHTML = phonehtmlStr;
				$("#showPhonePopover").popover("toggle");
			}
		}, false);
		$("#showPhonePopover .mui-table-view").on('tap', 'a', function() {
			var phone = this.dataset.phone;
			$("#showPhonePopover").popover("toggle");
			if(mui.os.plus) {
				plus.device.dial(phone);
			} else {
				location.href = phone;
			}
		});

		showRecordDetail.addEventListener('tap', function() {
			var recordPage = $.preload({
				"id": 'singlestu_record_main.html',
				"url": 'singlestu_record_main.html'
			});

			$.fire(recordPage, 'getParameter', {});

			recordPage.show("pop-in");
		}, false);
		showNoteLessonDetail.addEventListener('tap', function() {
			var notelessonPage = $.preload({
				"id": 'singlestu_notelesson_main.html',
				"url": 'singlestu_notelesson_main.html'
			});

			$.fire(notelessonPage, 'getParameter', {});

			notelessonPage.show("pop-in");
		}, false);

		/**
		 * 打开学员流水详细信息
		 */
		showStudentCashFlowDetail.addEventListener('tap', function() {
			var student_cashflowPage = $.preload({
				"id": 'student_cashflow_main.html',
				"url": 'student_cashflow_main.html'
			});

			$.fire(student_cashflowPage, 'getParameter', {});

			student_cashflowPage.show("pop-in");
		}, false);
		/**
		 * 为学员报新的培训课程
		 */
		addNewLesson.addEventListener('tap', function() {
			var singleaddpayPage = $.preload({
				"id": 'single_add_pay.html',
				"url": 'single_add_pay.html'
			});
			$.fire(singleaddpayPage, 'getParameter', {});
			singleaddpayPage.show("pop-in");
		}, false);

		/**
		 * 学员HTML
		 * @param {Object} student
		 */
		function pushStudentHtml(student) {
			console.log(JSON.stringify(student));

			phone = student.phone;
			phone2 = student.phone2 != null ? student.phone2 : "";
			studentPhone = student.student_phone != null ? student.student_phone : "";
			var stuBaseInfoElement = contact_cell[0].childNodes;
			stuBaseInfoElement.item(1).innerHTML = '<img src="../images/50x50s.png" />';

			var stuBaseInfoElementchild = stuBaseInfoElement.item(3).childNodes;
			stuBaseInfoElementchild.item(1).innerHTML = '<h4 class="oa-contact-name">' + student.name + '</h4>';
			stuBaseInfoElementchild.item(3).innerHTML = '<span>创建：' + app.ConvertJsonTime(student.create_time) + '</span>';
			var detailStuElement = detailStuElementList[0].childNodes;

			studentsate.innerHTML = app.studentStateHTML(student.state);
			studentsource.innerHTML = '<p>' + app.getSourceValue(student.source) + '</p>';
			studentsex.innerHTML = '<p>' + (student.sex != null ? student.sex : "") + '</p>';

			if(student.sales_id != null && student.sales_id != "") {
				sales.innerHTML = '<p><span class="sales_remove">' + student.sales_name + '<i class="font-badge mui-icon mui-icon-minus fontcolor-danger" style=" font-size: 0.8em;"></i></span></p>';
				if(student.sales_union_id != null && student.sales_union_id != "") {
					sales_union.innerHTML = '<p><span class="sales_remove">' + student.sales_union_name + '<i class="font-badge mui-icon mui-icon-minus fontcolor-danger" style=" font-size: 0.8em;"></i></span></p>';

				} else {
					sales_union.innerHTML = '<p><span class="sales_add"><i class="mui-icon mui-icon-plus fontcolor-success"></i></span></p>';
				}
			} else {
				if(student.sales_union_id != null && student.sales_union_id != "") {
					sales_union.innerHTML = '<p><span class="sales_remove" >' + student.sales_union_name + '<i class="font-badge mui-icon mui-icon-minus fontcolor-danger" style=" font-size: 0.8em;"></i></span></p>';
					sales.innerHTML = '<p><span class="sales_add"><i class="mui-icon mui-icon-plus fontcolor-success"></i></span></p>';
				} else {
					sales.innerHTML = '<p><span  class="sales_add"><i class="mui-icon mui-icon-plus fontcolor-success"></i></span></p>';
				}
			}

			if(student.dean_id != null && student.dean_id != "") {
				dean.innerHTML = '<p><span style="padding-right: 10px;"></span><span class="dean_remove">' + student.dean_name + '<i class="font-badge mui-icon mui-icon-minus fontcolor-danger" style=" font-size: 0.8em;"></i></span></p>';

				if(student.dean_union_id != null && student.dean_union_id != "") {
					dean_union.innerHTML = '<p><span class="dean_remove">' + student.dean_union_name + '<i class="font-badge mui-icon mui-icon-minus fontcolor-danger" style=" font-size: 0.8em;"></i></span></p>';
				} else {
					dean_union.innerHTML = '<p><span class="dean_add"><i class="mui-icon mui-icon-plus fontcolor-success"></i></span></p>';
				}
			} else {
				if(student.dean_union_id != null && student.dean_union_id != "") {
					dean_union.innerHTML = '<p><span style="padding-right: 10px;"></span><span class="dean_remove" >' + student.dean_union_name + '<i class="font-badge mui-icon mui-icon-minus fontcolor-danger" style=" font-size: 0.8em;"></i></span></p>';
					dean.innerHTML = '<p ><span class="dean_add"><i class="mui-icon mui-icon-plus fontcolor-success"></i></span></p>';
				} else {
					dean.innerHTML = '<p><span style="padding-right: 10px;"></span><span class="dean_add"><i class="mui-icon mui-icon-plus fontcolor-success"></i></span></p>';
				}
			}
			description.innerHTML = '<span style="padding-right: 10px;">备注:' + (student.description == null ? "无" : student.description) + '</span>';
		}

		/**
		 * 学员更多信息
		 * @param {Object} data
		 */
		function pushHTML(data) {
			var recordElement = mui_card[0].childNodes;

			var enrollElement = mui_card[1].childNodes;
			var simpleMclassElement = mui_card[2].childNodes
			var noteLessonElement = mui_card[3].childNodes;
			var recordheadElement = recordElement.item(1).childNodes;
			recordheadElement.item(3).innerHTML = '跟进记录  <i class="card-header-num">' + data.recordNum + '个</i>';
			var recordcontentElement = recordElement.item(3).childNodes;
			var record = data.record;
			recordcontentElement.item(1).innerHTML = (record == null ? '<p>暂无</p>' : '<p><span class="span-left">' + record.create_name + '</span><span style="padding-left: 10px;">' + ConvertJsonTime(record.create_time) + '</span></p><p>' + record.r_content + '</p>');

			var noteLessonheadElement = noteLessonElement.item(1).childNodes;
			noteLessonheadElement.item(3).innerHTML = '上课记录  <i class="card-header-num">' + data.noteLessonNum + '个</i>';
			var noteLessoncontentElement = noteLessonElement.item(3).childNodes;
			var noteLesson = data.noteLesson;
			noteLessoncontentElement.item(1).innerHTML = (noteLesson == null ? '<p>暂无</p>' : '<p> <span style=" padding-right: 10px; ">课程</span><span>' + noteLesson.lesson_name + '</span></p><p><span style=" padding-right: 10px; ">教师</span><span>' + noteLesson.teacher_name + '</span></p><p> <span style=" padding-right: 10px; ">时间</span><span>' + ConvertJsonTime(noteLesson.create_time) + '</span></p>');

			var enrollheadElement = enrollElement.item(1).childNodes;
			enrollheadElement.item(3).innerHTML = '报名课程   <i class="card-header-num">' + data.lessonNum + '个</i>';
			var enrollcontentElement = enrollElement.item(3).childNodes;
			var lesson = data.lesson;
			var liHTML = "";
			for(var i = 0; i < lesson.length; i++) {
				liHTML += '<li class="mui-table-view-cell"><p class="mui-navigate-right" ><span class="mui-hidden">' + JSON.stringify(lesson[i]) + '</span><span>' + lesson[i].name + '</span></p></li>';

			}
			liHTML = liHTML == "" ? '<li class="mui-table-view-cell"><p>暂无</p></li>' : liHTML;
			var ulElement = enrollcontentElement.item(1).childNodes;
			ulElement.item(1).innerHTML = liHTML;
			//班级
			var simpleMclasscontentElement = simpleMclassElement.item(3).childNodes;
			var simpleMclass = data.simpleMclass;
			var smliHTML = "";
			console.log(JSON.stringify(simpleMclass));
			for(var i = 0; i < simpleMclass.length; i++) {
				smliHTML += '<li class="mui-table-view-cell"><p class="mui-navigate" ><span>' + simpleMclass[i].name + '</span></p></li>';

			}
			smliHTML = smliHTML == "" ? '<li class="mui-table-view-cell"><p>暂无</p></li>' : smliHTML;
			var smUlElement = simpleMclasscontentElement.item(1).childNodes;
			smUlElement.item(1).innerHTML = smliHTML;

			doc.getElementById("payment").innerHTML = data.studentCost.payment + "￥";
			doc.getElementById("cash_coupon_total").innerHTML = data.studentCost.cash_coupon_total + "￥";
			doc.getElementById("arrears").innerHTML = data.studentCost.arrears + "￥";
			doc.getElementById("balance").innerHTML = data.studentCost.balance + "￥";
			doc.getElementById("cash_coupon").innerHTML = data.studentCost.cash_coupon + "￥";
			doc.getElementById("refund").innerHTML = data.studentCost.refund + "￥";

		}
		//咨询
		$(".detailStuElement").on('tap', '.sales_remove', function() {
			var sales_remove = doc.querySelectorAll('.sales_remove');
			var $sales_remove = this.parentElement.parentElement;
			console.log($sales_remove.id);
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			var studentSaleDeanRequest = {
				org_id: account.org_id,
				stu_id: student.id,
				type: $sales_remove.id
			}

			var waiting = plus.nativeUI.showWaiting();
			app.ModifyStudentSaleDean(studentSaleDeanRequest, function(data) {
				waiting.close();

				if(data.success) {
					$.toast("操作成功");
					if(sales_remove.length == 2) {
						switch($sales_remove.id) {
							case "sales":
								sales.innerHTML = '<p><span class="sales_add"><i class="mui-icon mui-icon-plus fontcolor-success"></i></span></p>';
								student.sales_id = "";
								student.sales_name = "";
								localStorage.setItem('$student', JSON.stringify(student));
								break;
							case "sales_union":
								sales_union.innerHTML = '<p><span class="sales_add"><i class="mui-icon mui-icon-plus fontcolor-success"></i></span></p>';
								student.sales_union_id = "";
								student.sales_union_name = "";
								localStorage.setItem('$student', JSON.stringify(student));
								break;
						}
					} else {
						sales.innerHTML = '<p><span class="sales_add"><i class="mui-icon mui-icon-plus fontcolor-success"></i></span></p>';
						sales_union.innerHTML = '';
					}

				} else {
					$.toast(data.msg);
				}
			});

		});
		var $sales_add;
		$(".detailStuElement").on('tap', '.sales_add', function() {
			$sales_add = this;
			var byrole_personnel_mainPage = $.preload({
				"id": 'byrole_personnel_main.html',
				"url": 'byrole_personnel_main.html'
			});
			var byrolePersonnelInfo = {
				"selectPersonnelId": "",
				"action": "add_sales",
				"other": false,
				"roleidList": ["439aca7899de48d1a459aa76007b501b"]
			}
			localStorage.setItem('$byrolePersonnelInfo', JSON.stringify(byrolePersonnelInfo));
			var byrole_personnel_listwebview = plus.webview.getWebviewById('byrole_personnel_list.html');
			$.fire(byrole_personnel_listwebview, 'getParameter', {
				id: ""
			});
			$.fire(byrole_personnel_mainPage, 'getParameter', {});
			byrole_personnel_mainPage.show("pop-in");

		});
		window.addEventListener('selectSalesParameter', function(options) {
			if(options.detail.id) {
				var flag = $sales_add.parentElement.parentElement.id;
				var personnel_id = options.detail.id;
				var personnel_name = options.detail.name;

				var salesstudent = {
					id: student.id,
					update_by: account.id
				}
				switch(flag) {
					case "sales":
						salesstudent["sales_id"] = personnel_id;
						salesstudent["sales_name"] = options.detail.name;
						break;
					case "sales_union":
						salesstudent["sales_union_id"] = options.detail.id;
						salesstudent["sales_union_name"] = options.detail.name;
						break;
				}
				var sales_remove = doc.querySelectorAll('.sales_remove');
				var waiting = plus.nativeUI.showWaiting();
				app.addSalesDean(salesstudent, function(data) {
					waiting.close();
					if(typeof data == 'string') {
						$.toast(data);
						return;
					} else {
						if(data.success) {
							switch(flag) {
								case "sales":
									sales.innerHTML = '<p><span class="sales_remove" >' + personnel_name + '<i class="font-badge mui-icon mui-icon-minus fontcolor-danger" style=" font-size: 0.8em;"></i></span></p>';
									if(sales_remove.length == 0) {
										sales_union.innerHTML = '<p><span class="sales_add"><i class="mui-icon mui-icon-plus fontcolor-success"></i></span></p>';
									}

									student.sales_id = personnel_id;
									student.sales_name = personnel_name;
									localStorage.setItem('$student', JSON.stringify(student));
									break;
								case "sales_union":
									sales_union.innerHTML = '<p><span class="sales_remove" >' + personnel_name + '<i class="font-badge mui-icon mui-icon-minus fontcolor-danger" style=" font-size: 0.8em;"></i></span></p>';
									if(sales_remove.length == 0) {
										sales.innerHTML = '<p><span class="sales_add"><i class="mui-icon mui-icon-plus fontcolor-success"></i></span></p>';
									}

									student.sales_union_id = personnel_id;
									student.sales_union_name = personnel_name;
									localStorage.setItem('$student', JSON.stringify(student));
									break;
							}
							$.toast("操作成功");
						} else {
							$.toast(data.msg);
						}
					}
				});
			}
		});

		//教务
		$(".detailStuElement").on('tap', '.dean_remove', function() {
			var dean_remove = doc.querySelectorAll('.dean_remove');
			var $dean_remove = this.parentElement.parentElement;

			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			var studentSaleDeanRequest = {
				org_id: account.org_id,
				stu_id: student.id,
				type: $dean_remove.id
			}

			var waiting = plus.nativeUI.showWaiting();
			app.ModifyStudentSaleDean(studentSaleDeanRequest, function(data) {
				waiting.close();
				if(data.success) {
					$.toast("操作成功");
					if(dean_remove.length == 2) {
						switch($dean_remove.id) {
							case "dean":
								student.dean_id = "";
								student.dean_name = "";
								localStorage.setItem('$student', JSON.stringify(student));
								dean.innerHTML = '<p><span class="dean_add"><i class="mui-icon mui-icon-plus fontcolor-success"></i></span></p>';
								break;
							case "dean_union":
								student.dean_union_id = "";
								student.dean_union_name = "";
								localStorage.setItem('$student', JSON.stringify(student));

								dean_union.innerHTML = '<p><span class="dean_add"><i class="mui-icon mui-icon-plus fontcolor-success"></i></span></p>';
								break;
						}
					} else {
						dean.innerHTML = '<p><span class="dean_add"><i class="mui-icon mui-icon-plus fontcolor-success"></i></span></p>';
						dean_union.innerHTML = '';
					}

				} else {
					$.toast(data.msg);
				}
			});

		});
		var $dean_add;
		$(".detailStuElement").on('tap', '.dean_add', function() {
			$dean_add = this;
			var byrole_personnel_mainPage = $.preload({
				"id": 'byrole_personnel_main.html',
				"url": 'byrole_personnel_main.html'
			});
			var byrolePersonnelInfo = {
				"selectPersonnelId": "",
				"action": "add_dean",
				"other": false,
				"roleidList": ["bc0acdf3aa6346d4889ee402a7eb89f1"]
			}
			localStorage.setItem('$byrolePersonnelInfo', JSON.stringify(byrolePersonnelInfo));
			var byrole_personnel_listwebview = plus.webview.getWebviewById('byrole_personnel_list.html');
			$.fire(byrole_personnel_listwebview, 'getParameter', {
				id: ""
			});
			$.fire(byrole_personnel_mainPage, 'getParameter', {});
			byrole_personnel_mainPage.show("pop-in");
		});
		// selectDeanParameter
		window.addEventListener('selectDeanParameter', function(options) {
			if(options.detail.id) {
				var flag = $dean_add.parentElement.parentElement.id;
				var personnel_id = options.detail.id;
				var personnel_name = options.detail.name;

				var deanstudent = {
					id: student.id,
					update_by: account.id
				}
				switch(flag) {
					case "dean":
						deanstudent["dean_id"] = personnel_id;
						deanstudent["dean_name"] = options.detail.name;
						break;
					case "dean_union":
						deanstudent["dean_union_id"] = options.detail.id;
						deanstudent["dean_union_name"] = options.detail.name;
						break;
				}
				var dean_remove = doc.querySelectorAll('.dean_remove');
				console.log(dean_remove.length)
				var waiting = plus.nativeUI.showWaiting();
				app.addSalesDean(deanstudent, function(data) {
					waiting.close();
					if(typeof data == 'string') {
						$.toast(data);
						return;
					} else {
						if(data.success) {
							switch(flag) {
								case "dean":
									dean.innerHTML = '<p><span class="dean_remove" >' + personnel_name + '<i class="font-badge mui-icon mui-icon-minus fontcolor-danger" style=" font-size: 0.8em;"></i></span></p>';
									if(dean_remove.length == 0) {
										dean_union.innerHTML = '<p><span class="dean_add"><i class="mui-icon mui-icon-plus fontcolor-success"></i></span></p>';
									}
									student.dean_id = personnel_id;
									student.dean_name = personnel_name;
									localStorage.setItem('$student', JSON.stringify(student));
									break;
								case "dean_union":
									dean_union.innerHTML = '<p><span class="dean_remove" >' + personnel_name + '<i class="font-badge mui-icon mui-icon-minus fontcolor-danger" style=" font-size: 0.8em;"></i></span></p>';
									if(dean_remove.length == 0) {
										dean.innerHTML = '<p><span class="dean_add"><i class="mui-icon mui-icon-plus fontcolor-success"></i></span></p>';
									}
									student.dean_union_id = personnel_id;
									student.dean_union_name = personnel_name;
									localStorage.setItem('$student', JSON.stringify(student));
									break;
							}
							$.toast("操作成功");
						} else {
							$.toast(data.msg);
						}
					}
				});
			}
		});

		//报名课程
		$(".enrollLesson").on('tap', '.mui-navigate-right', function() {
			var contentdata = this.childNodes[0].innerHTML;

			var singleStuLessonPage = $.preload({
				"id": 'singlestu_lesson.html',
				"url": 'singlestu_lesson.html'
			});

			localStorage.setItem('$singleStuLesson', contentdata);

			$.fire(singleStuLessonPage, 'getParameter', {});

			singleStuLessonPage.show("pop-in");
			console.log(contentdata);
		});

		studentsate.addEventListener('tap', function() {
			console.log(student.state);
			var studentModel = app.getStudent();
			var state = ['stuState0002', 'stuState0004', 'stuState0005'];
			if(!app.isInArray(state, studentModel.state)) {
				return;
			}
			$("#popover").popover("toggle");
		}, false);

		$("#popover .mui-table-view").on('tap', 'a', function() {

			$("#popover").popover("toggle");
			var aText = this.innerText;
			var statevalue = app.getStudentState(aText);
			if(statevalue == "") {
				$.toast("请选择学员状态");
				return;
			}
			var deanstudent = {
				id: student.id,
				state: statevalue,
				update_by: account.id
			}
			var waiting = plus.nativeUI.showWaiting();
			app.modifyStudentState(deanstudent, function(data) {
				waiting.close();
				if(typeof data == 'string') {
					$.toast(data);
					return;
				} else {
					if(data.success) {
						student.state = statevalue;
						studentsate.innerHTML = app.studentStateHTML(student.state);
						localStorage.setItem('$student', JSON.stringify(student));
						$.toast("操作成功");
					} else {
						$.toast(data.msg);
					}
				}
			});
		});

	});

})(mui, document)