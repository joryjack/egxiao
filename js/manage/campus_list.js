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
	var table = document.body.querySelector('.mui-table-view');
	var pagesize = 15;
	var nodata = document.body.querySelector('.nodata');
	window.addEventListener("reload", function(e) {
		pulldownRefresh();
	});

	/*
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		setTimeout(function() {
			var campusRequest = {
				org_id: account.org_id,
				campus_name: "",
				pagesize: pagesize,
				pageindex: 1
			}
			table.innerHTML = "";
			app.GetCampusLsit(campusRequest, function(data) {
				currentPageIndex = 1;
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
		var campuslist = data.items
		for(var i = 0; i < campuslist.length; i++) {
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell';
			li.innerHTML = '<a class="mui-navigate-right" data-id="' + campuslist[i].id + '"  data-name="' + campuslist[i].name + '"><i class="mui-icon iconfont icon-org-line subject_icon"></i><span>' + campuslist[i].name + '</span></a>';
			table.appendChild(li);
		}
		//regidterEvent();
	}

	$(".mui-table-view").on('tap', 'a', function() {
		//获取id
		var id = this.getAttribute("data-id");
		var name = this.getAttribute("data-name");

		var modifyCampusPage = $.preload({
			"id": 'modify_campus.html',
			"url": 'modify_campus.html'
		});
		var contentdata = {
			id: id,
			name: name
		};
		localStorage.setItem('$modifyCampus', JSON.stringify(contentdata));

		modifyCampusPage.show("pop-in");
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
				pageindex: currentPageIndex
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