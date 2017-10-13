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

	var table = document.body.querySelector('.mui-table-view');
	var per_name = "",
		per_phone = "";
	window.addEventListener("search", function(e) {
		per_name = e.detail.name;
		per_phone = e.detail.phone;
		pulldownRefresh();
	});
	window.addEventListener("reload", function(e) {
		pulldownRefresh();
	});
	var userRoleName = function(data) {
		var role_name = [];
		for(var i = 0; i < data.length; i++) {
			role_name.push(data[i].role_name);
		}
		return role_name.join(',');
	}
	var userStateHTML = function(state) {
		var stateHTML = "";
		switch(state) {
			case "userState0001":
				stateHTML = '<span class="oa-contact-position mui-h6 mui-pull-right  fontcolor-success" >正常</span>';
				break;
			case "userState0002":
				stateHTML = '<span class="oa-contact-position mui-h6 mui-pull-right   fontcolor-danger" >停用</span>';
				break;
			case "userState0003":
				stateHTML = '<span class="oa-contact-position mui-h6 mui-pull-right  fontcolor-warning" >未激活</span>';
				break;
			default:
				break;
		}
		return stateHTML;
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
			
			nodata.style.display = "none";
			table.innerHTML = "";

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
			div.className = 'mui-table-view-cell';
			div.setAttribute('data-model', '' + JSON.stringify(personnellist[i]) + '');
			if(personnellist[i].enable_flag == "1") {
				div.innerHTML = '<a class="mui-navigate"><div class="oa-contact-cell mui-table"><div class="oa-contact-avatar mui-table-cell"><img src="../images/50x50t.png" /></div><div class="oa-contact-content mui-table-cell"><div class="mui-hidden">' + JSON.stringify(personnellist[i]) + '</div><div class="mui-clearfix"><h4 class="oa-contact-name">' + personnellist[i].name + '</h4>' + (personnellist[i].enable_flag == "1" ? "" : userStateHTML(personnellist[i].state)) + '</div><p class="oa-contact-email mui-h6"><span>' + personnellist[i].campusname + '/</span><span>' + userRoleName(personnellist[i].userRole) + '</span></p></div><div data-phone="' + personnellist[i].phone + '" class="oa-contact-tel mui-table-cell"><span class="mui-icon  mui-icon-phone mui-pull-right" style="color:#55BD9A; font-size:2em;"></span></div></div></a>';
			} else {
				div.innerHTML = liElementInnerHTML(personnellist[i], personnellist[i].state);
			}

			table.appendChild(div);
		}
		//regidterEvent();
	}

	function liElementInnerHTML(model, state) {
		var muisliderHTML = "";
		switch(state) {
			case "userState0001":
				muisliderHTML = '<div class="mui-slider-left mui-disabled"><a class="mui-btn mui-btn-warning">停用</a></div><div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-warning">停用</a></div>';
				break;
			case "userState0002":
				muisliderHTML = '<div class="mui-slider-left mui-disabled"><a class="mui-btn mui-btn-success">启用</a></div><div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-success">启用</a></div>';
				break;
			default:
				break;
		}

		return muisliderHTML + ' <div class="mui-slider-handle"><a class="mui-navigate" style="color:#000"><div class="oa-contact-cell mui-table"><div class="oa-contact-avatar mui-table-cell"><img src="../images/50x50t.png" /></div><div class="oa-contact-content mui-table-cell"><div class="mui-hidden">' + JSON.stringify(model) + '</div><div class="mui-clearfix"><h4 class="oa-contact-name">' + model.name + '</h4>' + (model.enable_flag == "1" ? "" : userStateHTML(state)) + '</div><p class="oa-contact-email mui-h6"><span>' + model.campusname + '/</span><span>' + userRoleName(model.userRole) + '</span></p></div><div data-phone="' + model.phone + '" class="oa-contact-tel mui-table-cell"><span class="mui-icon  mui-icon-phone mui-pull-right" style="color:#55BD9A; font-size:2em;"></span></div></div></a>  <div>';
	}

	var btnArray = ['确认', '取消'];
	//停用
	$('.mui-table-view').on('tap', '.mui-btn-warning', function(event) {
		var elem = this;
		var li = elem.parentNode.parentNode;
		mui.confirm('确定停用该员工账号？', '停用账号', btnArray, function(e) {
			var model = JSON.parse(li.dataset.model);
			var personnelRequest = {
				id: model.id,
				org_id: model.org_id,
				state: "userState0002"
			}
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			var waiting = plus.nativeUI.showWaiting();
			app.SaveUserState(personnelRequest, function(data) {
				waiting.close();
				if(data.success) {
					li.innerHTML = liElementInnerHTML(model, "userState0002");
				} else {
					$.toast(data.msg);
				}
			});
		});
	});
	//启用
	$('.mui-table-view').on('tap', '.mui-btn-success', function(event) {
		var elem = this;
		var li = elem.parentNode.parentNode;
		mui.confirm('确定启用用该员工账号？', '启用账号', btnArray, function(e) {
			var model = JSON.parse(li.dataset.model);
			var personnelRequest = {
				id: model.id,
				org_id: model.org_id,
				state: "userState0001"
			}
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			var waiting = plus.nativeUI.showWaiting();
			app.SaveUserState(personnelRequest, function(data) {
				waiting.close();
				if(data.success) {
					li.innerHTML = liElementInnerHTML(model, "userState0001");
				} else {
					$.toast(data.msg);
				}
			});
		});
	});
	$(".mui-table-view").on('tap', '.oa-contact-content', function() {
		//获取id
		var contentdata = this.childNodes[0].innerHTML;
		var modifyPersonnelPage = $.preload({
			"id": 'modify_personnel.html',
			"url": 'modify_personnel.html'
		});

		localStorage.setItem('$modifyPersonnel', contentdata);

		modifyPersonnelPage.show("pop-in");
	});

	$(".mui-table-view").on('tap', '.oa-contact-tel', function() {
		var teldataset = this.dataset;
		if(mui.os.plus) {
			plus.device.dial(teldataset.phone);
		} else {
			location.href = teldataset.phone;
		}
	}, false);

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