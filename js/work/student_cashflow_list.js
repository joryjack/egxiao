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
	var student = app.getStudent();
	var totalPageCount = 0;
	var currentPageIndex = 1;
	var pagesize = 25;
	var nodata = document.body.querySelector('.nodata');

	var table = document.body.querySelector('.mui-table-view');
	window.addEventListener("reload", function(e) {
		pulldownRefresh();

	});

	function getMoenyHTML(type, moeny) {
		var moenyHTMLHTML = "";
		switch(type) {
			case "1":
				moenyHTMLHTML = '<span class="fontcolor-success">' + moeny + '</span>';
				break;
			case "2":
				moenyHTMLHTML = '<span class="fontcolor-danger">' + moeny + '</span>';
				break;
			default:
				break;
		}
		return moenyHTMLHTML;
	}
	/*
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		setTimeout(function() {
			var studentCashFlowRequest = {
				org_id: account.org_id,
				account_id: account.id,
				pagesize: pagesize,
				pageindex: 1,
				student_id: student.id
			}

			nodata.style.display = "none";
			table.innerHTML = "";
			app.GetStudentCashFlowList(studentCashFlowRequest, function(data) {
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
		var studentCashFlowList = data.items

		for(var i = 0; i < studentCashFlowList.length; i++) {
			
			var div = document.createElement('li');
			div.className = 'mui-table-view-cell';
			div.innerHTML = '<p><span class="span-left" style="color:#9AA1AA; font-weight: 900;">' + studentCashFlowList[i].create_name + '</span> <span style="padding-left: 10px; margin-left: 10px; border-left:1px solid #f5f5f5 ;">' + app.ConvertJsonTime(studentCashFlowList[i].create_time) + '</span></p><p>' + studentCashFlowList[i].item_name + ' ' + getMoenyHTML(studentCashFlowList[i].type, studentCashFlowList[i].moeny) + '元 </p><p>说明     ' + (studentCashFlowList[i].description==null?"":studentCashFlowList[i].description) + ' </p> ';
			table.appendChild(div);
		}

	}

	/*
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		setTimeout(function() {
			++currentPageIndex
			var studentCashFlowRequest = {
				org_id: account.org_id,
				account_id: account.id,
				pagesize: pagesize,
				pageindex: currentPageIndex,
				student_id: student.id
			}
			$('#pullrefresh').pullRefresh().endPullupToRefresh(currentPageIndex > totalPageCount);
			if(!(currentPageIndex > totalPageCount)) {
				app.GetStudentCashFlowList(studentCashFlowRequest, function(data) {
					pushViewElement(data);
				});
			}
		}, 1500);
	}

})(mui, document)