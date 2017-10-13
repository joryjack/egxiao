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
		state = "";
	var class_name = "";

	var selectClassInfo = app.getSelectClassInfo();
	if(JSON.stringify(selectClassInfo) != "{}") {
		deafultSelectId = selectClassInfo.selectClassId;
		action = selectClassInfo.action;
		state = selectClassInfo.state;
	}

	window.addEventListener("search", function(e) {
		class_name = e.detail.name;
		pulldownRefresh();
	});

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
			var classRequest = {
				org_id: account.org_id,
				account_id: account.id,
				pagesize: pagesize,
				pageindex: 1,
				state: state,
				class_name: class_name
			}

			table.innerHTML = "";
			nodata.style.display = "none";
			app.GetClassList(classRequest, function(data) {
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
		var classlist = data.items;
		for(var i = 0; i < classlist.length; i++) {
			var li = document.createElement('li');
			switch(classlist[i].state) {
				case "1":
					li.className = 'mui-table-view-cell  mui-checkbox mui-left activedwarning ';
					break;
				case "2":
					li.className = 'mui-table-view-cell  mui-checkbox mui-left activedsuccess ';
					break;
				case "3":
					li.className = 'mui-table-view-cell  mui-checkbox mui-left activeddanger ';
					break;
				default:
					li.className = 'mui-table-view-cell  mui-checkbox mui-left ';
					break;
			}

			li.setAttribute('data-model', '' + JSON.stringify(classlist[i]) + '');
			if(classlist[i].id == deafultSelectId) {
				li.innerHTML = '<input name="checkbox" value="' + classlist[i].id + '" type="checkbox" checked ><a class="mui-navigate"  data-name="' + classlist[i].name + '" ><span>' + classlist[i].name + '</span></a>';
			} else {
				li.innerHTML = '<input name="checkbox" value="' + classlist[i].id + '" type="checkbox" ><a class="mui-navigate"  data-name="' + classlist[i].name + '"  ><span>' + classlist[i].name + '</span></a>';
			}
			table.appendChild(li);
		}
	}

	$(".mui-table-view").on('tap', 'li', function() {
		//		var id = this.previousElementSibling.value;
		//		var name = this.dataset.name;
		var model = this.dataset.model;
		console.log(model);
		var class_mainwebview = plus.webview.getWebviewById('select_class_main.html');
		if(class_mainwebview) {
			class_mainwebview.close();
		}
		switch(action) {
			case "class_noteLesson":
				var modifyClassNoteLessonPage = $.preload({
					"id": 'modify_class_notelesson.html',
					"url": 'modify_class_notelesson.html'
				});
				$.fire(modifyClassNoteLessonPage, 'selectClassParameter', {
					model: model
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
			var classRequest = {
				org_id: account.org_id,
				account_id: account.id,
				pagesize: pagesize,
				pageindex: currentPageIndex,
				state: state,
				class_name: class_name
			}
			$('#pullrefresh').pullRefresh().endPullupToRefresh(currentPageIndex > totalPageCount);
			if(!(currentPageIndex > totalPageCount)) {
				app.GetClassList(classRequest, function(data) {
					pushViewElement(data);
				});
			}
		}, 1500);
	}
})(mui, document)