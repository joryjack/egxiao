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
	var nodata = document.body.querySelector('.nodata');
	var lesson_name = "";
	window.addEventListener("search", function(e) {
		lesson_name = e.detail.name;
		pulldownRefresh();
	});

	var typeName = function(type) {
		switch(type) {
			case "1":
				return '课时';
				break;
			case "2":
				return '课时包';
				break;
		}
	}
	var typeHTML = function(type) {
		switch(type) {
			case "1":
				return '<span class="label label-success">课时</span>';
				break;
			case "2":
				return '<span class="label label-primary">课时包</span>';
				break;
		}
	}

	var getDetailHTML = function(type, price, lesson_num) {
		var detailHTML = "";

		switch(type) {
			case "1":
				detailHTML += '<div class="mui-row">';
				detailHTML += '<div class="mui-col-xs-6"><p><label>价格:</label> <span><em class="lesson-price">' + price + '</em> ￥/课时</span></p></div>';
				detailHTML += '</div>';
				break;
			case "2":
				detailHTML += '<div class="mui-row">';
				detailHTML += '<div class="mui-col-xs-6"><p><label>价格:</label> <span><em class="lesson-price">' + price + '</em> ￥/课时包</span></p></div>';
				if(lesson_num != null) {
					detailHTML += '<div class="mui-col-xs-6"><p><label>课时:</label> <span><em class="lesson-price">' + lesson_num + '</em>个</span></p></div>';
				}
				detailHTML += '</div>';
				break
			default:
				break;
		}
		return detailHTML;
	}
	var enable_flagHTML = function(enable_flag) {
		switch(enable_flag) {
			case "1":
				return '<i class=" mui-icon iconfont icon-show lesson-state" ></i> <span>显示</span>';
				break;
			case "2":
				return '<i class=" mui-icon iconfont icon-hidden lesson-state" ></i> <span>隐藏</span>';
				break;
		}
	}
	var table = document.body.querySelector('.mui-scroll');
	window.addEventListener("reload", function(e) {
		pulldownRefresh();

	});

	/*
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		setTimeout(function() {
			var lessonRequest = {
				org_id: account.org_id,
				lesson_name: lesson_name,
				pagesize: pagesize,
				pageindex: 1
			}
			table.innerHTML = "";
			nodata.style.display = "none";

			app.GetLessonList(lessonRequest, function(data) {

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
		var lessonlist = data.items
		for(var i = 0; i < lessonlist.length; i++) {
			var div = document.createElement('div');
			div.className = 'mui-card';
			div.innerHTML = '<div class="mui-card-header  mui-card-header-danger"><i class="mui-icon iconfont icon-huakuai card-header-icon"></i><span>' + lessonlist[i].name + '</span></div><div class="mui-card-content" data-model= \'' + JSON.stringify(lessonlist[i]) + '\' data-id="' + lessonlist[i].id + '" data-name="' + lessonlist[i].name + '" data-price="' + lessonlist[i].price + '" data-type="' + typeName(lessonlist[i].type) + '" data-description="' + lessonlist[i].description + '" ><div class="mui-card-content-inner"> ' + getDetailHTML(lessonlist[i].type, lessonlist[i].price, lessonlist[i].lesson_num) + '     <p class="mui-card-content-lastp"> <span style="padding-right: 10px; ">说明</span><span>' + (lessonlist[i].description == null ? "" : lessonlist[i].description) + '</span></p></div></div><div class="mui-card-footer"><a class="mui-h6">' + typeHTML(lessonlist[i].type) + '</a><a class="mui-h6 lessonstate" data-id="' + lessonlist[i].id + '" data-enableflag="' + lessonlist[i].enable_flag + '">' + enable_flagHTML(lessonlist[i].enable_flag) + '</a></div>';

			table.appendChild(div);
		}

		//regidterEvent();
	}

	//function regidterEvent() {
	$(".mui-scroll").on('tap', '.mui-card-content', function() {
		//获取id
		var contentdata = this.dataset.model;
		var modifyLessonPage = $.preload({
			"id": 'modify_lesson.html',
			"url": 'modify_lesson.html'
		});
		localStorage.setItem('$modifyLesson', contentdata);
		modifyLessonPage.show("pop-in");
	});

	$(".mui-scroll").on('tap', '.lessonstate', function() {
		if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
			plus.nativeUI.toast('网络不给力，请检查网络设置');
			return;

		}
		var id = this.getAttribute("data-id");
		var enable_flag = this.getAttribute("data-enableflag");
		var i = this.childNodes.item(0);
		var span = this.childNodes.item(2);
		var a = this;

		var lesson = {
			id: id,
			org_id: account.org_id,
			enable_flag: (enable_flag == "1" ? "2" : "1"),
			update_by: account.id
		}
		console.log(JSON.stringify(lesson));
		var waiting = plus.nativeUI.showWaiting();
		app.ModifyLesson(lesson, function(data) {
			waiting.close();
			if(data.success) {
				a.setAttribute("data-enableflag", lesson.enable_flag);
				if(enable_flag == "1") {
					i.classList.remove("icon-show");
					i.classList.add("icon-hidden");
					span.innerText = "隐藏";
				} else {
					i.classList.remove("icon-hidden");
					i.classList.add("icon-show");
					span.innerText = "显示";
				}
			}
			$.toast(data.msg);
		});

		//				var btnArray = ['是','否' ];
		//				mui.confirm('确定隐藏'+name+'？ 隐藏后记上课将无法选定该科目。', '隐藏科目', btnArray, function(e) {
		//					if (e.index == 1) {
		//						console.log("否")
		//					} else {
		//							console.log("是")
		//					}
		//				})

	});
	//}
	/*
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		setTimeout(function() {
			++currentPageIndex
			var lessonRequest = {
				org_id: account.org_id,
				lesson_name: lesson_name,
				pagesize: pagesize,
				pageindex: currentPageIndex
			}
			$('#pullrefresh').pullRefresh().endPullupToRefresh(currentPageIndex > totalPageCount);
			if(!(currentPageIndex > totalPageCount)) {
				app.GetLessonList(lessonRequest, function(data) {
					pushViewElement(data);
					//regidterEvent();
					//$('#pullrefresh').pullRefresh().endPullupToRefresh(currentPageIndex == totalPageCount);
				});
			}

		}, 1500);
	}

})(mui, document)