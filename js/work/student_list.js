/*
 * 
 */

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
	var stu_state = [];
	var stu_name = "";
	var sales_name = "";
	var dean_name = "",
		campus_id = "";

	var phoneUL = doc.body.querySelector('#showPhonePopover .mui-table-view');

	var table = document.body.querySelector('.mui-table-view');
	window.addEventListener("search", function(e) {
		stu_state = e.detail.state;
		stu_name = e.detail.name;
		sales_name = e.detail.sales_name;
		dean_name = e.detail.dean_name;
		campus_id = e.detail.campus_id;
		pulldownRefresh();
	});

	window.addEventListener("reload", function(e) {
		var liList = document.querySelectorAll('.oa-contact-content');

		var studentModel = app.getStudent();
		$.each(liList, function(index, item) {
			var contentdata = item.childNodes[0].innerHTML;
			var student = JSON.parse(contentdata);

			if(JSON.stringify(studentModel) != "{}") {
				if(studentModel.id == student.id) {
					var liInnerHTML = pushsingleViewElement(studentModel);
					item.parentNode.parentNode.parentNode.innerHTML = liInnerHTML;
					return;
				}
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
				break;
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
	/*
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		setTimeout(function() {
			var studentrRequest = {
				org_id: account.org_id,
				stu_name: stu_name,
				sales_name: sales_name,
				dean_name: dean_name,
				campus_id: campus_id,
				account_id: account.id,
				pagesize: pagesize,
				pageindex: 1,
				state: stu_state
			}
			table.innerHTML = "";
			nodata.style.display = "none";
            console.log(JSON.stringify(studentrRequest));
			app.GetStudentList(studentrRequest, function(data) {
				currentPageIndex = 1;
				var payListwebview = plus.webview.getWebviewById('/work/student_main.html');
				$.fire(payListwebview, 'resetStudentNum', {
					totalItemCount: data.totalItemCount
				});

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

	function pushsingleViewElement(studentModel) {
		return '<a class="mui-navigate"><div class="oa-contact-cell mui-table"><div class="oa-contact-avatar mui-table-cell"><img src="../images/50x50s.png" /></div><div class="oa-contact-content mui-table-cell"><div class="mui-hidden">' + JSON.stringify(studentModel) + '</div><div class="mui-clearfix"><h4 class="oa-contact-name">' + studentModel.name + app.studentSexHTML(studentModel.sex) + '</h4>' + studentStateHTML(studentModel.state) + '</div><p class="oa-contact-email mui-h6"><span>跟进：' + lastrecordTime(studentModel.lastrecord_time) + '</span></p></div><div class="oa-contact-tel mui-table-cell"  data-phone="' + studentModel.phone + '" data-phone2="' + (studentModel.phone2 != null ? studentModel.phone2 : "") + '" data-studentphone="' + (studentModel.student_phone != null ? studentModel.student_phone : "") + '"  ><span class="mui-icon  mui-icon-phone mui-pull-right student-phone" ></span></div></div></a> ';
	}

	function pushViewElement(data) {
		//
		totalPageCount = data.totalPageCount;
		var studentlist = data.items;
		for(var i = 0; i < studentlist.length; i++) {
			var div = document.createElement('li');
			div.className = 'mui-table-view-cell';
			div.innerHTML = '<a class="mui-navigate"><div class="oa-contact-cell mui-table"><div class="oa-contact-avatar mui-table-cell"><img src="../images/50x50s.png" /></div><div class="oa-contact-content mui-table-cell"><div class="mui-hidden">' + JSON.stringify(studentlist[i]) + '</div><div class="mui-clearfix"><h4 class="oa-contact-name">' + studentlist[i].name + app.studentSexHTML(studentlist[i].sex) + '</h4>' + studentStateHTML(studentlist[i].state) + '</div><p class="oa-contact-email mui-h6"><span>跟进：' + lastrecordTime(studentlist[i].lastrecord_time) + '</span></p></div><div class="oa-contact-tel mui-table-cell"  data-phone="' + studentlist[i].phone + '" data-phone2="' + (studentlist[i].phone2 != null ? studentlist[i].phone2 : "") + '" data-studentphone="' + (studentlist[i].student_phone != null ? studentlist[i].student_phone : "") + '" ><span class="mui-icon  mui-icon-phone mui-pull-right student-phone" ></span></div></div></a> ';
			table.appendChild(div);
		}
		//regidterEvent();
	}

	$(".mui-table-view").on('tap', '.oa-contact-content', function() {
		//获取id
		var contentdata = this.childNodes[0].innerHTML;
		var modifyStudentPage = $.preload({
			"id": 'detail_student.html',
			"url": 'detail_student.html'
		});
		var student = JSON.parse(contentdata);
		console.log(JSON.stringify(student));
		var studentModel = app.getStudent();

		if(JSON.stringify(studentModel) != "{}") {
			if(studentModel.id != student.id) {
				localStorage.setItem('$student', JSON.stringify(student));
			}
		} else {
			localStorage.setItem('$student', JSON.stringify(student));
		}

		modifyStudentPage.show("pop-in");
	});

	$(".mui-table-view").on('tap', '.oa-contact-tel', function() {
		var teldataset = this.dataset;

		if(teldataset.phone2 == "" && teldataset.studentphone == "") {
			if(mui.os.plus) {
				plus.device.dial(teldataset.phone);
			} else {
				location.href = teldataset.phone;
			}
		} else {
			var phonehtmlStr = "";
			phonehtmlStr += '<li class="mui-table-view-cell"><a  data-phone="' + teldataset.phone + '" >' + teldataset.phone + '<span class="mui-pull-right">家长</span></a></li>';
			if(teldataset.phone2 != "") {
				phonehtmlStr += '<li class="mui-table-view-cell"><a  data-phone="' + teldataset.phone2 + '" >' + teldataset.phone2 + '<span class="mui-pull-right">家长</span></a></li>';
			}
			if(teldataset.studentphone != "") {
				phonehtmlStr += '<li class="mui-table-view-cell"><a  data-phone="' + teldataset.studentphone + '" >' + teldataset.studentphone + '<span class="mui-pull-right">学员</span></a></li>';
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

	/*
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		setTimeout(function() {
			++currentPageIndex
			var studentrRequest = {
				org_id: account.org_id,
				stu_name: stu_name,
				sales_name: sales_name,
				dean_name: dean_name,
				campus_id: campus_id,
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