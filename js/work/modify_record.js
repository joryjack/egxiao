(function($, doc) {
	$.init();
	$.plusReady(function() {

		var showSalePicker = doc.getElementById("showSalePicker");
		var showStylePicker = doc.getElementById("showStylePicker");
		var showSaleResult = doc.getElementById("showSaleResult");
		var showStyleResult = doc.getElementById("showStyleResult");
		var showNextTime = doc.getElementById("showNextTime");
		var name = doc.getElementById("name");
		var phone = doc.getElementById("phone");
		var description = doc.getElementById("description");

		var inputList = doc.querySelectorAll('input');
		var self = plus.webview.currentWebview();
		var rightBar = doc.getElementById("rightBar");
		var title = doc.querySelector('.mui-title');

		var selectStudentId = "";
		var selectStudent = doc.getElementById("selectStudent");

		var recordContent = doc.getElementById("recordContent");
		window.addEventListener('getParameter', function(options) {

		});

		window.addEventListener('selectStudentParameter', function(options) {
			if(options.detail.id) {
				selectStudentId = options.detail.id
				console.log(selectStudent.childNodes[2])
				selectStudent.childNodes.item(2).innerHTML = options.detail.name;
				var showSaleClassList = showSalePicker.classList;
				switch(options.detail.state) {
					case "stuState0002":
						showSaleResult.innerHTML = "已报名";
						showSaleClassList.add("mui-disabled");
						break;
					case "stuState0004":
						showSaleResult.innerHTML = "已结课";
						showSaleClassList.add("mui-disabled");
						break;
					case "stuState0005":
						showSaleResult.innerHTML = "已流失";
						showSaleClassList.add("mui-disabled");
						break;
					default:
						showSaleResult.innerHTML = "跟进状态";
						showSaleClassList.remove("mui-disabled");
						break;
				}
			}
		});

		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			recordContent.value = "";
			selectStudentId = "";
			selectStudent.childNodes.item(2).innerHTML = "请选择";
			showSaleResult.innerHTML = "跟进状态";
			showStyleResult.innerHTML = "跟进方式";
			showNextTime.childNodes.item(3).innerHTML = "请选择"

			var studentListwebview = plus.webview.getWebviewById('record_list.html');
			$.fire(studentListwebview, 'reload', {});
			self.close();
		}, false);

		showSalePicker.addEventListener('tap', function() {
			var statevalues =['已报名','已结课','已流失'];
			if(app.isInArray(statevalues,showSaleResult.innerHTML)) {
				return;
			}
			$("#showSalePopover").popover("toggle");
		});
		showStylePicker.addEventListener('tap', function() {
			$("#showStylePopover").popover("toggle");
		});

		$("#showSalePopover .mui-table-view").on('tap', 'a', function() {
			showSaleResult.innerHTML = this.innerText;
			$("#showSalePopover").popover("toggle");
		});
		$("#showStylePopover .mui-table-view").on('tap', 'a', function() {
			showStyleResult.innerHTML = this.innerText;
			$("#showStylePopover").popover("toggle");
		});

		selectStudent.addEventListener('tap', function() {
			var select_student_mainPage = $.preload({
				"id": 'select_student_main.html',
				"url": 'select_student_main.html'
			});
			var selectStudentInfo = {
				"selectStudentId": selectStudentId,
				"action": "record",
				"state": []
			}
			localStorage.setItem('$selectStudentInfo', JSON.stringify(selectStudentInfo));
			var select_student_listwebview = plus.webview.getWebviewById('select_student_list.html');
			$.fire(select_student_listwebview, 'getParameter', {
				id: selectStudentId
			});
			$.fire(select_student_mainPage, 'getParameter', {});
			select_student_mainPage.show("pop-in");
		});

		showNextTime.addEventListener('tap', function() {
			var $this = this;
			var optionsJson = $this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var picker = new $.DtPicker(options);
			picker.show(function(rs) {
				showNextTime.childNodes.item(3).innerHTML = rs.text;
				picker.dispose();
			});
		});

		rightBar.addEventListener('tap', function() {
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			var account = app.getAccount();
			if(recordContent.value.trim() == "") {
				$.toast("请填写跟进记录");
				return;
			}
			if(selectStudentId == "") {
				$.toast("请选择跟进学员");
				return;
			}
			if(showSaleResult.innerHTML == "跟进状态") {
				$.toast("请选择跟进状态");
				return;
			}
			if(showStyleResult.innerHTML == "跟进方式") {
				$.toast("请选择跟进方式");
				return;
			}
			if(account) {
				var recordRequest = {
					org_id: account.org_id,
					r_content: recordContent.value.trim(),
					student_id: selectStudentId,
					student_name: selectStudent.childNodes.item(2).innerHTML,
					state: showSaleResult.innerHTML,
					style: showStyleResult.innerHTML,
					create_by: account.id,
					campus_id: account.campus_id,
					create_name: account.name
				}
				if(showNextTime.childNodes.item(3).innerHTML != "请选择" && showNextTime.childNodes.item(3).innerHTML != "") {
					recordRequest["next_time"] = showNextTime.childNodes.item(3).innerHTML + ":00";
				}
				console.log(JSON.stringify(recordRequest));
				var waiting = plus.nativeUI.showWaiting();
				app.SaveRecord(recordRequest, function(data) {
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
				})
			} else {
				$.toast("数据丢失");
			}

		}, false);
	});

})(mui, document)