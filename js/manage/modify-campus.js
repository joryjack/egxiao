(function($, doc) {
	$.init();

	$.plusReady(function() {
		var rightBar = doc.getElementById("rightBar");
		var inputList = document.querySelectorAll('input');
		var self = plus.webview.currentWebview();
		var id = "";
		var title = document.querySelector('.mui-title');
		var nameInput = doc.getElementById("name");

		var campus = app.getmodifyCampus();
		if(JSON.stringify(campus) != "{}") {
			nameInput.value = campus.name;
			id = campus.id;
			title.innerHTML = "编辑校区";
		} else {
			title.innerHTML = "新建校区";
		}

		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			//将所有的之前输入过的密码全部清空
			$.each(inputList, function(index, item) {
				item.value = '';
			});
			var campuswebview = plus.webview.getWebviewById('campus_list.html');
			$.fire(campuswebview, 'reload', {});

			self.close();
		}, false);
		rightBar.addEventListener('tap', function() {
			var account = app.getAccount();
			if(nameInput.value.trim() != "") {
				if(account) {
					var campus = {
						id: id,
						org_id: account.org_id,
						name: nameInput.value.trim(),
						enable_flag: "1"
					}
					if(id != null && id != "") {
						campus["update_by"] = account.id;
					} else {
						campus["create_by"] = account.id;
					}

					var waiting = plus.nativeUI.showWaiting();
					app.SaveCampus(campus, function(data) {
						waiting.close();
						$.toast(data.msg);
						$.back();
					});
				} else {
					$.toast("数据丢失");
				}
			} else {
				$.toast("校区名称不能为空");
			}
		}, false);
	})
})(mui, document)