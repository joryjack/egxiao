(function($, doc) {
	$.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				auto: true,
				callback: pulldownRefresh
			},
			up: {
				contentrefresh: '正在加载...',
				contentnomore: '我是有底线的',
				callback: pullupRefresh
			}
		}
	});
	$.plusReady(function() {
		var self = plus.webview.currentWebview();
		self.addEventListener('hide', function() {
			var byrole_personnel_mainwebview = plus.webview.getWebviewById('byrole_personnel_main.html');
			if(byrole_personnel_mainwebview) {
				byrole_personnel_mainwebview.close();
			}
			self.close();
		}, false);

	})

	var account = app.getAccount();
	var totalPageCount = 0;
	var currentPageIndex = 1;
	var pagesize = 20;
	var nodata = document.body.querySelector('.nodata');

	var deafultSelectId = "",
		action = "",
		other = "";
	var roleidList = [];

	var byrolePersonnelInfo = app.getByrolePersonnelInfo();
	if(JSON.stringify(byrolePersonnelInfo) != "{}") {
		deafultSelectId = byrolePersonnelInfo.selectPersonnelId;
		action = byrolePersonnelInfo.action;
		var roleidListTemp = byrolePersonnelInfo.roleidList;
		for(var i = 0; i < roleidListTemp.length; i++) {
			roleidList.push(roleidListTemp[i]);
		}
	}

	var table = document.body.querySelector('.mui-table-view');
	var per_name = "",
		per_phone = "";
	window.addEventListener("search", function(e) {
		per_name = e.detail.name;
		per_phone = e.detail.phone;
		pulldownRefresh();
	});
	window.addEventListener('getParameter', function(options) {
		var inputList = document.querySelectorAll('input');
		$.each(inputList, function(index, item) {
			if(item.value == deafultSelectId) {
				item.checked = true;
			} else {
				item.checked = false;
			}
		});
	});

	var userRoleName = function(data) {
		var role_name = [];
		for(var i = 0; i < data.length; i++) {
			role_name.push(data[i].role_name);
		}
		return role_name.join(',');
	}
	/*
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		setTimeout(function() {
			var personnelRequest = {
				org_id: account.org_id,
				account_id:account.id,
				campus_id: account.campus_id,
				other: false,
				name: per_name,
				phone: per_phone,
				pagesize: pagesize,
				roleidList: roleidList,
				pageindex: 1
			}
			table.innerHTML = "";
			app.GetPersonnelByRoleList(personnelRequest, function(data) {
				currentPageIndex = 1;
				nodata.style.display = "none";
				if(data.items.length == 0) {
					nodata.style.display = "block";
					$('#pullrefresh').pullRefresh().endPulldownToRefresh();
					$('#pullrefresh').pullRefresh().disablePullupToRefresh();
				} else {
					pushViewElement(data);
					//regidterEvent();
					$('#pullrefresh').pullRefresh().endPulldownToRefresh();
					$('#pullrefresh').pullRefresh().refresh(true);
				}
			});

		}, 1500);
	}

	function pushViewElement(data) {
		totalPageCount = data.totalPageCount;
		var personnellist = data.items;
		for(var i = 0; i < personnellist.length; i++) {
			var div = document.createElement('li');
			div.className = 'mui-table-view-cell  mui-checkbox mui-left';

			if(personnellist[i].id == deafultSelectId) {
				div.innerHTML = '<input name="checkbox" value="' + personnellist[i].id + '" type="checkbox" checked ><a class="mui-navigate" data-name="' + personnellist[i].name + '"><div class="oa-contact-cell mui-table"><div class="oa-contact-avatar mui-table-cell"><img src="../images/50x50t.png" /></div><div class="oa-contact-content mui-table-cell"><div class="mui-clearfix"><h4 class="oa-contact-name">' + personnellist[i].name + '</h4></div><p class="oa-contact-email mui-h6"><span>' + personnellist[i].campusname + '/</span><span>' + userRoleName(personnellist[i].userRole) + '</span></p></div></div></a>';
			} else {
				div.innerHTML = '<input name="checkbox" value="' + personnellist[i].id + '" type="checkbox" ><a class="mui-navigate" data-name="' + personnellist[i].name + '" ><div class="oa-contact-cell mui-table"><div class="oa-contact-avatar mui-table-cell"><img src="../images/50x50t.png" /></div><div class="oa-contact-content mui-table-cell"><div class="mui-clearfix"><h4 class="oa-contact-name">' + personnellist[i].name + '</h4></div><p class="oa-contact-email mui-h6"><span>' + personnellist[i].campusname + '/</span><span>' + userRoleName(personnellist[i].userRole) + '</span></p></div></div></a>';
			}
			table.appendChild(div);
		}

	}

	$(".mui-table-view").on('tap', 'a', function() {
		var id = this.previousElementSibling.value;
		var name = this.dataset.name;
		roleidList = [];

		var byrole_personnel_mainwebview = plus.webview.getWebviewById('byrole_personnel_main.html');
		if(byrole_personnel_mainwebview) {
			byrole_personnel_mainwebview.close();
		}

		switch(action) {
			case "pay":
				var modifyPayPage = $.preload({
					"id": 'modify_pay.html',
					"url": 'modify_pay.html'
				});
				$.fire(modifyPayPage, 'selectPersonnelParameter', {
					id: id,
					name: name
				});
				break;
			case "student_noteLesson":
				var modifyPayPage = $.preload({
					"id": 'modify_student_notelesson.html',
					"url": 'modify_student_notelesson.html'
				});
				$.fire(modifyPayPage, 'selectPersonnelParameter', {
					id: id,
					name: name
				});
				break;
			case "class_noteLesson":
				var modifyPayPage = $.preload({
					"id": 'modify_class_notelesson.html',
					"url": 'modify_class_notelesson.html'
				});
				$.fire(modifyPayPage, 'selectPersonnelParameter', {
					id: id,
					name: name
				});
				break;
			case "singlestudent_noteLesson":
				var modifyPayPage = $.preload({
					"id": 'single_modify_notelesson.html',
					"url": 'single_modify_notelesson.html'
				});
				$.fire(modifyPayPage, 'selectPersonnelParameter', {
					id: id,
					name: name
				});
				break;
			case "singlemodifypay":
				var singlemodifypayPage = $.preload({
					"id": 'single_modify_pay.html',
					"url": 'single_modify_pay.html'
				});
				$.fire(singlemodifypayPage, 'selectPersonnelParameter', {
					id: id,
					name: name
				});
				break;
			case "again_noteLesson":
				var againNotelessonPage = $.preload({
					"id": 'again_notelesson.html',
					"url": 'again_notelesson.html'
				});

				$.fire(againNotelessonPage, 'selectPersonnelParameter', {
					id: id,
					name: name
				});

				break;
			case "singlestu_again_noteLesson":
				var againNotelessonPage = $.preload({
					"id": 'singlestu_again_notelesson.html',
					"url": 'singlestu_again_notelesson.html'
				});

				$.fire(againNotelessonPage, 'selectPersonnelParameter', {
					id: id,
					name: name
				});
				break;
			case "add_sales":
				var detail_student = $.preload({
					"id": 'detail_student.html',
					"url": 'detail_student.html'
				});

				$.fire(detail_student, 'selectSalesParameter', {
					id: id,
					name: name
				});
				break;
			case "add_dean":
				var detail_student = $.preload({
					"id": 'detail_student.html',
					"url": 'detail_student.html'
				});

				$.fire(detail_student, 'selectDeanParameter', {
					id: id,
					name: name
				});
				break;
			case "singleaddpay":
				var sigleaddpayPage = $.preload({
					"id": 'single_add_pay.html',
					"url": 'single_add_pay.html'
				});
				$.fire(sigleaddpayPage, 'selectPersonnelParameter', {
					id: id,
					name: name
				});
				break;

			default:
				break;
		}

	});

	/*
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		setTimeout(function() {
			++currentPageIndex
			var personnelRequest = {
				org_id: account.org_id,
				account_id:account.id,
				campus_id: account.campus_id,
				other: false,
				name: per_name,
				phone: per_phone,
				roleidList: roleidList,
				pagesize: pagesize,
				pageindex: currentPageIndex
			}
			$('#pullrefresh').pullRefresh().endPullupToRefresh(currentPageIndex > totalPageCount);
			if(!(currentPageIndex > totalPageCount)) {
				app.GetPersonnelByRoleList(personnelRequest, function(data) {
					pushViewElement(data);
				});
			}
		}, 1500);
	}
})(mui, document)