(function($, doc) {
	$.init();
	$.plusReady(function() {
		$('.mui-scroll-wrapper').scroll();

		var student = app.getStudent("$student");
		var selectSource = doc.getElementById("selectSource");
		var selectSex = doc.getElementById("selectSex");

		var id = "";
		var name = doc.getElementById("name");
		var phone = doc.getElementById("phone");
		var description = doc.getElementById("description");

		var inputList = doc.querySelectorAll('input');
		var self = plus.webview.currentWebview();
		var rightBar = doc.getElementById("rightBar");
		var title = doc.querySelector('.mui-title');

		var phone2 = doc.getElementById("phone2");
		var student_phone = doc.getElementById("student_phone");

		window.addEventListener('getParameter', function(options) {

		});
		if(student) {
			id = student.id;
			name.value = student.name;
			phone.value = student.phone;
			phone2.value = (student.phone2 == null ? "" : student.phone2);
			student_phone.value = (student.student_phone == null ? "" : student.student_phone);
			description.value = student.description;
	
			selectSource.innerHTML = app.getSourceValue(student.source);
			if(student.sex != null && student.sex != "") {
				selectSex.innerHTML = student.sex;
			}

		}
		//为页面添加事件监听hide
		self.addEventListener('hide', function() {

			$.each(inputList, function(index, item) {
				item.value = '';
			});
			selectSource.innerHTML = "请选择";
			var detailstudentwebview = plus.webview.getWebviewById('detail_student.html');
			$.fire(detailstudentwebview, 'reloadStudent', {});
			self.close();
		}, false);

		selectSource.addEventListener('tap', function() {
			if(student.source == "stuSource0007") {
				return;
			}
			$("#popover").popover("toggle");
		});
		selectSex.addEventListener('tap', function() {
			$("#popoverSex").popover("toggle");
		});

		$("#popover .mui-table-view").on('tap', 'a', function() {
			selectSource.innerHTML = this.innerText;
			$("#popover").popover("toggle");
		});
		$("#popoverSex .mui-table-view").on('tap', 'a', function() {
			selectSex.innerHTML = this.innerText;
			$("#popoverSex").popover("toggle");
		});
		rightBar.addEventListener('tap', function() {
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			var account = app.getAccount();
			if(name.value.trim() == "") {
				$.toast("没有填写姓名");
				return;
			}

			if(account) {
				var studentModel = {
					id: id,
					org_id: account.org_id,
					phone: phone.value.trim(),
					name: name.value.trim(),
					source: selectSource.innerHTML,
					description: description.value
				}
				if(selectSex.innerHTML != "请选择" && selectSex.innerHTML != "") {
					studentModel["sex"] = selectSex.innerHTML;
				}
				
				if(phone2.value != "") {
					studentModel["phone2"] = phone2.value;
					student["phone2"] = phone2.value;
				}

				if(student_phone.value != "") {
					studentModel["student_phone"] = student_phone.value;
					student["student_phone"] = student_phone.value;
					
				}
				if(id != null && id != "") {
					studentModel["update_by"] = account.id;
				} else {
					studentModel["create_by"] = account.id;
					studentModel["campus_id"] = account.campus_id;
				}
				console.log(JSON.stringify(studentModel));
				var waiting = plus.nativeUI.showWaiting();
				app.SaveStudent(studentModel, function(data) {
					waiting.close();
					if(typeof data == 'string') {
						$.toast(data);
						return;
					} else {
						if(data.success) {

							student.name = name.value;
							student.phone = phone.value;
							student.source = app.getSourceCode(selectSource.innerHTML);
							student.description = description.value;
							if(selectSex.innerHTML != "请选择" && selectSex.innerHTML != "") {
								student.sex = selectSex.innerHTML;
							}

							localStorage.setItem('$student', JSON.stringify(student));
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