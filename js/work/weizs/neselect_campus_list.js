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
		enable_flag = [];
	var neSelectCampusInfo = app.getNESelectCampusInfo();

	if(JSON.stringify(neSelectCampusInfo) != "{}") {
		deafultSelectId = neSelectCampusInfo.selectlnecampusId;
		action = neSelectCampusInfo.action;
		enable_flag = neSelectCampusInfo.enable_flag;
	}

	var table = document.body.querySelector('.mui-table-view');
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

	/*
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		setTimeout(function() {

			table.innerHTML = "";
			nodata.style.display = "none";
			var campusRequest = {
				org_id: account.org_id,
				campus_name: "",
				pagesize: pagesize,
				pageindex: 1,
				enable_flag:enable_flag
			}
			table.innerHTML = "";
			app.GetCampusLsit(campusRequest, function(data) {
				currentPageIndex = 1;
				console.log(data.items.length);
				if(data.items.length == 0) {
					nodata.style.display = "block";

					$('#pullrefresh').pullRefresh().endPulldownToRefresh();
					$('#pullrefresh').pullRefresh().disablePullupToRefresh();
				} else {
					pushViewElement(data);

					$('#pullrefresh').pullRefresh().endPulldownToRefresh();
					$('#pullrefresh').pullRefresh().refresh(true);
				}
			});

		}, 1500);
	}

	function pushViewElement(data) {
		totalPageCount = data.totalPageCount;
		var campuslist = data.items;
		for(var i = 0; i < campuslist.length; i++) {
			var li = document.createElement('li');
li.className = 'mui-table-view-cell  mui-checkbox mui-left ';
			if(campuslist[i].id == deafultSelectId) {
				
				li.innerHTML = '<input name="checkbox" value="' + campuslist[i].id + '" type="checkbox" checked ><a class="mui-navigate"  data-model=\'' + JSON.stringify(campuslist[i]) + '\'><span>' + campuslist[i].name + '</span></a>';
			} else {
				
				li.innerHTML = '<input name="checkbox" value="' + campuslist[i].id + '" type="checkbox" ><a class="mui-navigate"   data-model=\'' + JSON.stringify(campuslist[i]) + '\' ><span>' + campuslist[i].name + '</span></a>';
			}
			table.appendChild(li);
		}

	}

	$(".mui-table-view").on('tap', 'a', function() {
		var id = this.previousElementSibling.value;
		var model = JSON.parse(this.dataset.model);
		var campus_mainwebview = plus.webview.getWebviewById('neselect_campus_main.html');
		if(campus_mainwebview) {
			campus_mainwebview.close();
		}
		switch(action) {
			case "addnecampus":
				var addnecampusPage = $.preload({
					"id": 'add_necampus.html',
					"url": 'add_necampus.html'
				});

				$.fire(addnecampusPage, 'selectCampusParameter', {
					id: model.id,
					name: model.name
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
			var campusRequest = {
				org_id: account.org_id,
				campus_name: "",
				pagesize: pagesize,
				pageindex: currentPageIndex,
				enable_flag:enable_flag
			}
			$('#pullrefresh').pullRefresh().endPullupToRefresh(currentPageIndex > totalPageCount);
			if(!(currentPageIndex > totalPageCount)) {
				app.GetCampusLsit(campusRequest, function(data) {
					pushViewElement(data);
				});
			}

		}, 1500);
	}
})(mui, document)