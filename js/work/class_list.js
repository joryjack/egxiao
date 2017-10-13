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
	var pagesize = 6;
	var class_state = [];
	var class_name = "",campus_id ="";
	var nodata = document.body.querySelector('.nodata');

	var table = document.body.querySelector('.mui-scroll');

	window.addEventListener("search", function(e) {
		class_state = e.detail.state;
		class_name = e.detail.name;
		campus_id = e.detail.campus_id;
		pulldownRefresh();
	});
	window.addEventListener("reload", function(e) {
		pulldownRefresh();
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
				class_state: class_state,
				class_name: class_name,
				campus_id: campus_id
			}
			nodata.style.display = "none";
			table.innerHTML = "";
			app.GetClassList(classRequest, function(data) {
				currentPageIndex = 1;

				var classMainwebview = plus.webview.getWebviewById('/work/class_main.html');
				$.fire(classMainwebview, 'resetMsgInfo', { totalItemCount: data.totalItemCount});
				
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
		var classlist = data.items
		for(var i = 0; i < classlist.length; i++) {

			var div = document.createElement('div');
			div.className = 'mui-card';

			div.innerHTML = '<div class="mui-card-header   mui-card-header-default"><span class="mui-icon iconfont icon-huakuai card-header-icon"></span><span>' + classlist[i].name + '<i class="card-header-num">' + classlist[i].student_num + '个学员</i> </span><span class="mui-icon mui-icon-forward card-header-nav"><div class="mui-hidden">' + JSON.stringify(classlist[i]) + '</div></span></div>    <div class="mui-card-content"><div class="mui-card-content-inner"><p> <span style="padding-right: 10px; ">课程</span><span>' + classlist[i].lesson_name + '</span></p><p class="mui-card-content-lastp "> <span style="padding-right: 10px; ">说明</span><span>' + classlist[i].description + '</span></p></div></div>    <div class="mui-card-footer"><a class="mui-h6">' + app.classStateHTML(classlist[i].state) + ' <span style="padding-left:10px;">' + app.lessonTypeHTML(classlist[i].lesson_type) + '</span> </a><a class="mui-h6 remove" data-id="' + classlist[i].id + '" data-state="' + classlist[i].state + '" ><i class=" mui-icon mui-icon-trash" style="font-size: 1.5em;"></i>删除</a></div>';

			table.appendChild(div);
		}
	}

	$(".mui-scroll").on('tap', '.card-header-nav', function() {
		var contentdata = this.childNodes[0].innerHTML;

		localStorage.setItem('$class', contentdata);
		var detailClassPage = $.preload({
			"id": 'detail_class.html',
			"url": 'detail_class.html'
		});

		//		detailClassPage.addEventListener('loaded', function() {
		//			$.fire(detailClassPage, 'getParameter', {});
		//		});
		detailClassPage.show("pop-in");
	});

	$(".mui-scroll").on('tap', '.remove', function() {
		var $this = this;
		if($this.dataset.state != "1") {
			$.toast("已在使用，不能删除");
			return;
		}

		var btnArray = ['是', '否'];
		mui.confirm('确定删除该班级?删除后将不可能恢复。', '删除班级', btnArray, function(e) {
			if(e.index == 1) {
				console.log("否")
			} else {
				var classRequest = {
					id: $this.dataset.id,
					state: "0"
				}
				console.log(JSON.stringify(classRequest));
				if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
					plus.nativeUI.toast('网络不给力，请检查网络设置');
					return;
				}
				var waiting = plus.nativeUI.showWaiting();
				app.SaveClass(classRequest, function(data) {
					waiting.close();
					if(data.success) {
						var muiCardElement = $this.parentElement.parentElement;
						muiCardElement.parentElement.removeChild(muiCardElement);
					} else {
						$.toast(data.msg);
					}
				});
			}
		});

	});

	/*
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		setTimeout(function() {
			++currentPageIndex
			var classRequest = {
				org_id: account.org_id,
				class_name: "",
				account_id: account.id,
				pagesize: pagesize,
				pageindex: currentPageIndex,
				class_state: class_state,
				class_name: class_name,
				campus_id: campus_id
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