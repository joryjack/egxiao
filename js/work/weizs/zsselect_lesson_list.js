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
		enable_flag = "";
	var weizsselectLessonInfo = app.getWeizsselectLessonInfo();
	
	if(JSON.stringify(weizsselectLessonInfo) != "{}") {
		deafultSelectId = weizsselectLessonInfo.selectlessonId;
		action = weizsselectLessonInfo.action;
		enable_flag = weizsselectLessonInfo.enable_flag;
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
			var lessonRequest = {
				org_id: account.org_id,
				lesson_name: "",
				pagesize: pagesize,
				pageindex: 1,
				enable_flag: enable_flag
			}

			table.innerHTML = "";
			nodata.style.display = "none";
			app.GetLessonList(lessonRequest, function(data) {
				currentPageIndex = 1;
				console.log(data.items.length );
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
		var lessonlist = data.items;
		for(var i = 0; i < lessonlist.length; i++) {
			var li = document.createElement('li');  
			if(lessonlist[i].enable_flag == "2") {
				li.className = 'mui-table-view-cell  mui-checkbox mui-left actived';
			} else {
				li.className = 'mui-table-view-cell  mui-checkbox mui-left';
			}
			if(lessonlist[i].id == deafultSelectId) {

				li.innerHTML = '<input name="checkbox" value="' + lessonlist[i].id + '" type="checkbox" checked ><a class="mui-navigate"  data-model=\'' + JSON.stringify(lessonlist[i]) + '\'><span>' + lessonlist[i].name + '</span></a>';
			} else {
				li.innerHTML = '<input name="checkbox" value="' + lessonlist[i].id + '" type="checkbox" ><a class="mui-navigate"   data-model=\'' + JSON.stringify(lessonlist[i]) + '\' ><span>' + lessonlist[i].name + '</span></a>';
			}
			table.appendChild(li);
		}
	}

	$(".mui-table-view").on('tap', 'a', function() {
		var id = this.previousElementSibling.value;
		var model = JSON.parse(this.dataset.model);
		var lesson_mainwebview = plus.webview.getWebviewById('zsselect_lesson_main.html');
		if(lesson_mainwebview) {
			lesson_mainwebview.close();
		}
		switch(action) {
			case "addzsslesson":
				var addZslessonPage = $.preload({
					"id": 'add_zslesson.html',
					"url": 'add_zslesson.html'
				});
				
				$.fire(addZslessonPage, 'selectLessonParameter', {
					id: model.id,
					name: model.name,
					price: model.price,
					lesson_num: model.lesson_num,
					type: model.type
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
			var lessonRequest = {
				org_id: account.org_id,
				lesson_name: "",
				pagesize: pagesize,
				pageindex: currentPageIndex,
				enable_flag: enable_flag
			}
			$('#pullrefresh').pullRefresh().endPullupToRefresh(currentPageIndex > totalPageCount);
			if(!(currentPageIndex > totalPageCount)) {
				app.GetLessonList(lessonRequest, function(data) {
					pushViewElement(data);
				});
			}
		}, 1500);
	}
})(mui, document)