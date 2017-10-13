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
			var select_campus_mainwebview = plus.webview.getWebviewById('select_campus_main.html');
			if(select_campus_mainwebview) {
				select_campus_mainwebview.close();
			}
			self.close();
		}, false);

	})
	var account = app.getAccount();
	var totalPageCount = 0;
	var currentPageIndex = 1;
	var table = document.body.querySelector('.mui-table-view');
	var pagesize = 30;
	var nodata = document.body.querySelector('.nodata');
	var deafultSelectId =  localStorage.getItem('$selectCampusid') || "";
	window.addEventListener('getParameter', function(options) {
			deafultSelectId = options.detail.id;
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
			li.className = 'mui-table-view-cell  mui-checkbox mui-left ';
			
			if(campuslist[i].id == deafultSelectId) {
				li.innerHTML = '<input type="checkbox" value="' + campuslist[i].id + '"  checked /><a class="mui-navigate" data-name="' + campuslist[i].name + '"><span>' + campuslist[i].name + '</span></a>';
			} else {
				li.innerHTML = '<input type="checkbox" value="' + campuslist[i].id + '"   /><a class="mui-navigate" data-name="' + campuslist[i].name + '"><span>' + campuslist[i].name + '</span></a>';
			}
			table.appendChild(li);
		}
		regidterEvent();
	}

	function regidterEvent() {
		
		
		$(".mui-table-view").on('tap', 'a', function() {
			var select_campus_mainwebview = plus.webview.getWebviewById('select_campus_main.html');
		if(select_campus_mainwebview) {
			select_campus_mainwebview.close();
		}
			var id = this.previousElementSibling.value;
			var name = this.dataset.name;
			var modifyPersonnelPage = $.preload({
				"id": 'modify_personnel.html',
				"url": 'modify_personnel.html'
			});
			$.fire(modifyPersonnelPage, 'selectCampusParameter', {
				id: id,
				name: name
			});
			
			modifyPersonnelPage.show("pop-in");
			
		});
	}
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