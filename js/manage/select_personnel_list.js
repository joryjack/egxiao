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
	var deafultSelectId = localStorage.getItem('$selectLeaderid') || "";

	var table = document.body.querySelector('.mui-table-view');

	var per_name = "",
		per_phone = "";
	window.addEventListener("search", function(e) {
		per_name = e.detail.name;
		per_phone = e.detail.phone;
		pulldownRefresh();
	});

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
				name: per_name,
				phone: per_phone,
				pagesize: pagesize,
				pageindex: 1
			}
			table.innerHTML = "";
			nodata.style.display = "none";
			app.GetPersonnelList(personnelRequest, function(data) {
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
		regidterEvent();
	}

	function regidterEvent() {
		$(".mui-table-view").on('tap', 'a', function() {
			var id = this.previousElementSibling.value;
			var name = this.dataset.name;
			var modifyPersonnelPage = $.preload({
				"id": 'modify_personnel.html',
				"url": 'modify_personnel.html'
			});
			$.fire(modifyPersonnelPage, 'selectUserParameter', {
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
			var personnelRequest = {
				org_id: account.org_id,
				name: per_name,
				phone: per_phone,
				pagesize: pagesize,
				pageindex: currentPageIndex
			}
			$('#pullrefresh').pullRefresh().endPullupToRefresh(currentPageIndex > totalPageCount);
			if(!(currentPageIndex > totalPageCount)) {
				app.GetPersonnelList(personnelRequest, function(data) {
					pushViewElement(data);
				});
			}
		}, 1500);
	}
})(mui, document)