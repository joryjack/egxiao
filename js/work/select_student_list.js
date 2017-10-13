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
	var account = app.getAccount();
	var totalPageCount = 0;
	var currentPageIndex = 1;
	var pagesize = 20;
	var nodata = document.body.querySelector('.nodata');
	var deafultSelectId = "",
		action = "",
		state_par = "";
	var selectStudentInfo = app.getSelectStudentInfo();
	if(JSON.stringify(selectStudentInfo) != "{}") {
		deafultSelectId = selectStudentInfo.selectStudentId;
		action = selectStudentInfo.action;
		state_par = selectStudentInfo.state;
	}
	var stu_state = [];
	var stu_name = "";

	var table = document.body.querySelector('.mui-table-view');

	window.addEventListener("search", function(e) {
		stu_state = e.detail.state;
		stu_name = e.detail.name;
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

	var studentStateHTML = function(state) {
		var stateHTML = "";
		switch(state) {
			case "stuState0001":
				stateHTML = '<span class="oa-contact-position mui-h6 mui-pull-right fontcolor-warning" >跟进中</span>';
				break;
			case "stuState0002":
				stateHTML = '<span class="oa-contact-position mui-h6 mui-pull-right fontcolor-success" >已报名</span>';
				break;
			case "stuState0003":
				stateHTML = '<span class="oa-contact-position mui-h6 mui-pull-right fontcolor-danger" >无意向</span>';
				break;
			case "stuState0004":
				stateHTML = '<span class="oa-contact-position mui-h6 mui-pull-right fontcolor-primary" >已结课</span>';
				break;
			case "stuState0005":
				stateHTML = '<span class="oa-contact-position mui-h6 mui-pull-right fontcolor-danger1" >已流失</span>';
			default:
				break;
		}
		return stateHTML;
	}



	var lastrecordTime = function(lastrecordtime) {
		if(lastrecordtime == null || lastrecordtime == "") {
			return "暂无"
		}
		return new Date(lastrecordtime).toISOString().replace(/T/g, ' ').replace(/:[\d]{2}\.[\d]{3}Z/, '');
	}

	window.addEventListener("reload", function(e) {
		pulldownRefresh();
	});
	/*
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		setTimeout(function() {
			var studentrRequest = {
				org_id: account.org_id,
				stu_name: stu_name,
				account_id: account.id,
				pagesize: pagesize,
				pageindex: 1,
				state: stu_state
			}

			table.innerHTML = "";
			nodata.style.display = "none";
			app.GetStudentList(studentrRequest, function(data) {
				currentPageIndex = 1;
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
		var studentlist = data.items;
		for(var i = 0; i < studentlist.length; i++) {
			var div = document.createElement('li');
			div.className = 'mui-table-view-cell  mui-checkbox mui-left ';
			if(studentlist[i].id == deafultSelectId) {
				div.innerHTML = '<input name="checkbox" value="' + studentlist[i].id + '" type="checkbox" checked ><a class="mui-navigate" data-name="' + studentlist[i].name + '"  data-state="' + studentlist[i].state + '"><div class="oa-contact-cell mui-table"><div class="oa-contact-avatar mui-table-cell"><img src="../images/50x50s.png" /></div><div class="oa-contact-content mui-table-cell"><div class="mui-hidden">' + JSON.stringify(studentlist[i]) + '</div><div class="mui-clearfix"><h4 class="oa-contact-name">' + studentlist[i].name + '</h4>' + studentStateHTML(studentlist[i].state) + '</div><p class="oa-contact-email mui-h6"><span>跟进：' + lastrecordTime(studentlist[i].lastrecord_time) + '</span></p></div></div></a> ';
			} else {
				div.innerHTML = '<input name="checkbox" value="' + studentlist[i].id + '" type="checkbox" ><a class="mui-navigate" data-name="' + studentlist[i].name + '"  data-state="' + studentlist[i].state + '" ><div class="oa-contact-cell mui-table"><div class="oa-contact-avatar mui-table-cell"><img src="../images/50x50s.png" /></div><div class="oa-contact-content mui-table-cell"><div class="mui-hidden">' + JSON.stringify(studentlist[i]) + '</div><div class="mui-clearfix"><h4 class="oa-contact-name">' + studentlist[i].name + '</h4>' + studentStateHTML(studentlist[i].state) + '</div><p class="oa-contact-email mui-h6"><span>跟进：' + lastrecordTime(studentlist[i].lastrecord_time) + '</span></p></div></div></a> ';
			}

			table.appendChild(div);
		}
		//regidterEvent();
	}

	$(".mui-table-view").on('tap', 'a', function() {
		var id = this.previousElementSibling.value;
		var name = this.dataset.name;
		var state = this.dataset.state;

		var student_mainwebview = plus.webview.getWebviewById('select_student_main.html');
		if(student_mainwebview) {
			student_mainwebview.close();
		}
		switch(action) {
			case "record":
				var modifyRecordPage = $.preload({
					"id": 'modify_record.html',
					"url": 'modify_record.html'
				});
				$.fire(modifyRecordPage, 'selectStudentParameter', {
					id: id,
					name: name,
					state: state
				});
				break;
			case "pay":
				var modifyPayPage = $.preload({
					"id": 'modify_pay.html',
					"url": 'modify_pay.html'
				});
				$.fire(modifyPayPage, 'selectStudentParameter', {
					id: id,
					name: name,
					state: state
				});
				break;
			case "student_noteLesson":
				var modifyStudentNoteLessonPage = $.preload({
					"id": 'modify_student_notelesson.html',
					"url": 'modify_student_notelesson.html'
				});
				$.fire(modifyStudentNoteLessonPage, 'selectStudentParameter', {
					id: id,
					name: name,
					state: state
				});
				break;
			case "again_noteLesson":

				var againNotelessonPage = $.preload({
					"id": 'again_notelesson.html',
					"url": 'again_notelesson.html'
				});

				$.fire(againNotelessonPage, 'selectStudentParameter', {
					id: id,
					name: name,
					state: state
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
			var studentrRequest = {
				org_id: account.org_id,
				stu_name: stu_name,
				account_id: account.id,
				pagesize: pagesize,
				pageindex: currentPageIndex,
				state: stu_state
			}
			$('#pullrefresh').pullRefresh().endPullupToRefresh(currentPageIndex > totalPageCount);
			if(!(currentPageIndex > totalPageCount)) {
				app.GetStudentList(studentrRequest, function(data) {
					pushViewElement(data);
				});
			}
		}, 1500);
	}
})(mui, document)