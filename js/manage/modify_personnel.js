(function($, doc) {
	$.init();
	$.plusReady(function() {

		var selectRole = doc.getElementById("selectRole");
		var rolecancel = doc.getElementById("rolecancel");
		var roleconfirm = doc.getElementById("roleconfirm");
		var roleid = [];

		var id = "",
			selectLeaderid = "",
			selectCampusid = "";
		var selectCampusName = doc.getElementById("selectCampusName");
		var selectLeaderName = doc.getElementById("selectLeaderName");

		var name = doc.getElementById("name");
		var phone = doc.getElementById("phone");
		var description = doc.getElementById("description");

		var inputList = doc.querySelectorAll('input');
		var self = plus.webview.currentWebview();
		var rightBar = doc.getElementById("rightBar");
		var title = doc.querySelector('.mui-title');

		var personnel = app.getmodifyPersonnel();
		var account = app.getAccount();

		if(JSON.stringify(personnel) != "{}") {
			id = personnel.id;
			phone.value = personnel.phone;
			name.value = personnel.name;
			selectLeaderid = personnel.leader_id;
			if(selectLeaderid == "") {
				selectLeaderName.innerHTML = "请选择";
			} else {
				selectLeaderName.innerHTML = personnel.leader_name;
			}
			selectCampusid = personnel.campus_id;
			if(selectCampusid == "") {
				selectCampusName.innerHTML = "请选择";
			} else {
				selectCampusName.innerHTML = personnel.campusname;
			}
			roleid = [];
			var roleName = [];
			var userRole = personnel.userRole;
			for(var i = 0; i < userRole.length; i++) {
				roleName.push(userRole[i].role_name);
				roleid.push(userRole[i].role_id);
			}
			
			selectRole.innerHTML = roleName.join(',') == "" ? "请选择" : roleName.join(',');
			
			var showSelectRoleList = selectRole.classList;
			if(roleid.indexOf("07ec2b419dbe4f51a14c5c9b4e4e5b0d") >-1 &&  personnel.id == account.id ) {
				showSelectRoleList.add("mui-disabled");
			} else {
				showSelectRoleList.remove("mui-disabled");
			}

			title.innerHTML = "编辑员工";
		} else {
            var showSelectRoleList = selectRole.classList;
			showSelectRoleList.remove("mui-disabled");
            
			title.innerHTML = "新建员工";
		}

		window.addEventListener('selectUserParameter', function(options) {
			if(options.detail.id) {
				selectLeaderid = options.detail.id
				selectLeaderName.innerHTML = options.detail.name;
			}
		});
		window.addEventListener('selectCampusParameter', function(options) {
			if(options.detail.id) {
				selectCampusid = options.detail.id
				selectCampusName.innerHTML = options.detail.name;
			}
		});

		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			$.each(inputList, function(index, item) {
				item.value = '';
			});
			selectLeaderid = "";
			selectCampusid = "";
			roleid = [];
			selectRole.innerHTML = "请选择";
			selectCampusName.innerHTML = "请选择";
			selectLeaderName.innerHTML = "请选择";
			var personnelListwebview = plus.webview.getWebviewById('personnel_list.html');

			var personnel_mainwebview = plus.webview.getWebviewById('select_personnel_main.html');
			if(personnel_mainwebview) {
				personnel_mainwebview.close();
			}

			var campus_mainwebview = plus.webview.getWebviewById('select_campus_main.html');
			if(campus_mainwebview) {
				campus_mainwebview.close();
			}

			$.fire(personnelListwebview, 'reload', {});
			self.close();
		}, false);

		selectRole.addEventListener('tap', function() {
			$("#popover").popover("toggle");
		});
		rolecancel.addEventListener('tap', function() {
			var inputList = doc.querySelectorAll('input');
			$("#popover").popover("toggle");
		});
		roleconfirm.addEventListener('tap', function() {
			var inputList = doc.querySelectorAll('#popover input');
			var roleName = [];
			roleid = [];
			for(var i = 0; i < inputList.length; i++) {
				if(inputList[i].checked) {
					roleName.push(inputList[i].previousElementSibling.innerText);
					roleid.push(inputList[i].value);
				}
			}
			selectRole.innerHTML = roleName.join(',') == "" ? "请选择" : roleName.join(',');
			$("#popover").popover("toggle");
		});

		selectLeaderName.addEventListener('tap', function() {
			var select_personnel_mainPage = $.preload({
				"id": 'select_personnel_main.html',
				"url": 'select_personnel_main.html'
			});
			localStorage.setItem('$selectLeaderid', selectLeaderid);
			var select_personnel_listwebview = plus.webview.getWebviewById('select_personnel_list.html');
			$.fire(select_personnel_listwebview, 'getParameter', {
				id: selectLeaderid
			});
			$.fire(select_personnel_mainPage, 'getParameter', {});
			select_personnel_mainPage.show("pop-in");
		});
		selectCampusName.addEventListener('tap', function() {
			var select_personnel_mainPage = $.preload({
				"id": 'select_campus_main.html',
				"url": 'select_campus_main.html'
			});
			localStorage.setItem('$selectCampusid', selectCampusid);

			var select_campus_listwebview = plus.webview.getWebviewById('select_campus_list.html');
			$.fire(select_campus_listwebview, 'getParameter', {
				id: selectCampusid
			});
			$.fire(select_personnel_mainPage, 'getParameter', {});
			select_personnel_mainPage.show("pop-in");
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
			if(selectCampusid == "") {
				$.toast("请选择校区");
				return;
			}

			if(roleid.length == 0) {
				$.toast("请选择职务");
				return;
			}
			if(account) {
				var user = {
					id: id,
					org_id: account.org_id,
					org_name: account.org_name,
					phone: phone.value.trim(),
					name: name.value.trim(),
					leader_id: selectLeaderid,
					leader_name: (selectLeaderid == "" ? "" : selectLeaderName.innerHTML),
					campus_id: selectCampusid,
					roles: roleid
				};
				if(id != null && id != "") {
					user["update_by"] = account.id;
				} else {
					user["create_by"] = account.id;
				}
				console.log(JSON.stringify(user));
				var waiting = plus.nativeUI.showWaiting();
				app.SaveUser(user, function(data) {
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