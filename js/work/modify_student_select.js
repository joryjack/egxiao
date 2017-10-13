(function($, doc) {
	$.init();
	$.plusReady(function() {

		$('.mui-scroll-wrapper').scroll();
		var selectSource = doc.getElementById("selectSource");

		var id = "";
		var name = doc.getElementById("name");
		var phone = doc.getElementById("phone");
		var description = doc.getElementById("description");

		var inputList = doc.querySelectorAll('input');
		var self = plus.webview.currentWebview();
		var rightBar = doc.getElementById("rightBar");
		var title = doc.querySelector('.mui-title');

		var morefield = doc.querySelector('.morefield');
		var show_morefield = doc.getElementById("show_morefield");
		var hide_morefield = doc.getElementById("hide_morefield");
		var selectSex = doc.getElementById("selectSex");
		var phone2 = doc.getElementById("phone2");
		var student_phone = doc.getElementById("student_phone");

		show_morefield.addEventListener("tap", function() {
			var showclassList = show_morefield.classList
			var hideclassList = hide_morefield.classList;
			var morefieldclassList = morefield.classList;

			hideclassList.remove('mui-hidden');
			showclassList.add('mui-hidden');
			morefieldclassList.remove('mui-hidden');

		});
		hide_morefield.addEventListener("tap", function() {
			var showclassList = show_morefield.classList
			var hideclassList = hide_morefield.classList;
			var morefieldclassList = morefield.classList;

			showclassList.remove('mui-hidden');
			hideclassList.add('mui-hidden');
			morefieldclassList.add('mui-hidden');
		});
		selectSex.addEventListener('tap', function() {
			$("#popoverSex").popover("toggle");
		});

		$("#popoverSex .mui-table-view").on('tap', 'a', function() {
			selectSex.innerHTML = this.innerText;
			$("#popoverSex").popover("toggle");
		});

		window.addEventListener('getParameter', function(options) {

		});

		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			$.each(inputList, function(index, item) {
				item.value = '';
			});
			selectSource.innerHTML = "请选择";
			var studentListwebview = plus.webview.getWebviewById('select_student_list.html');
			$.fire(studentListwebview, 'reload', {});
			self.close();
		}, false);

		selectSource.addEventListener('tap', function() {
			$("#popover").popover("toggle");
		});

		$(".mui-table-view").on('tap', 'a', function() {
			selectSource.innerHTML = this.innerText;
			$("#popover").popover("toggle");
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
				var student = {
					id: id,
					org_id: account.org_id,
					phone: phone.value.trim(),
					name: name.value.trim(),
					source: selectSource.innerHTML,
					sales_name: account.name,
					description: description.value
				}

				if(selectSex.innerHTML != "请选择" && selectSex.innerHTML != "") {
					student["sex"] = selectSex.innerHTML;
				}
				if(phone2.value != "") {
					student["phone2"] = phone2.value;
				}
				if(student_phone.value != "") {
					student["student_phone"] = student_phone.value;
				}

				if(id != null && id != "") {
					student["update_by"] = account.id;
				} else {
					student["create_by"] = account.id;
					student["campus_id"] = account.campus_id;
					
				}
				var waiting = plus.nativeUI.showWaiting();
				app.SaveStudent(student, function(data) {
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