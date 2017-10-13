(function($, doc) {
	$.init();
	$.plusReady(function() {
		var rightBar = doc.getElementById("rightBar");
		var inputList = document.querySelectorAll('input');
		var self = plus.webview.currentWebview();
		var id = "";
		var title = document.querySelector('.mui-title');
		var subjectInput = doc.getElementById("subject");

		var subject = app.getmodifySubject();
		if(JSON.stringify(subject) != "{}") {
			subjectInput.value = subject.name;
			id = subject.id;
			title.innerHTML = "编辑科目";
		} else {
			title.innerHTML = "新建科目";
		}

		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			//将所有的之前输入过的密码全部清空
			$.each(inputList, function(index, item) {
				item.value = '';
			});
			id ="";
			var subjectwebview = plus.webview.getWebviewById('/manage/subject_list.html');
			$.fire(subjectwebview, 'reload', {});

			self.close();
		}, false);
		rightBar.addEventListener('tap', function() {
			var account = app.getAccount();
			if(subjectInput.value.trim() != "") {
				if(account) {
					var subject = {
						id: id,
						org_id: account.org_id,
						name: subjectInput.value.trim(),
						enable_flag: "1"
					}
					if(id != null && id != "") {
						subject["update_by"] = account.id;
					} else {
						subject["create_by"] = account.id;
					}
					var waiting = plus.nativeUI.showWaiting();
					app.SaveSubject(subject, function(data) {
						waiting.close();
						$.toast(data.msg);
						$.back();
					});
				} else {
					$.toast("数据丢失");
				}
			} else {
				$.toast("科目名称不能为空");
			}
		}, false);
	});
})(mui, document)