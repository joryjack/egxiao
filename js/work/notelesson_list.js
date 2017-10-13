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

	var table = document.body.querySelector('.mui-scroll');
	var notelessonstate = [];
	var notelessonstyle= [];
	var student_name, teacher_name, notelesson_start, notelesson_end, create_name, lesson_name, subject_name,campus_id ;
	window.addEventListener("search", function(e) {
		notelessonstate = e.detail.state;
		student_name = e.detail.student_name;
		teacher_name = e.detail.teacher_name;
		notelesson_start = e.detail.notelesson_start;
		notelesson_end = e.detail.notelesson_end;
		create_name = e.detail.create_name;
		lesson_name = e.detail.lesson_name;
		subject_name = e.detail.subject_name;
		campus_id = e.detail.campus_id;
		notelessonstyle = e.detail.style;
		pulldownRefresh();
	});

	window.addEventListener("reload", function(e) {
		pulldownRefresh();

	});

	function GetLessonNumHTML(lessonType, lesson_num) {
		var LessonNumHTML = "";
		switch(lessonType) {
			case "1":
				LessonNumHTML = '<em class="price-success  " >' + lesson_num + '</em>/课时';
				break;
			case "2":
				LessonNumHTML = '<em class="price-success" >' + lesson_num + '</em>/课时';
				break;
			default:

				break;
		}
		return LessonNumHTML;
	}
	/*
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		$("#topPopover").popover("hide");
		setTimeout(function() {
			var notelessonRequest = {
				org_id: account.org_id,
				account_id: account.id,
				pagesize: pagesize,
				pageindex: 1,
				campus_id: campus_id,
				student_name: student_name,
				teacher_name: teacher_name,
				notelesson_start: notelesson_start,
				notelesson_end: notelesson_end,
				lesson_name: lesson_name,
				subject_name: subject_name,
				state: notelessonstate,
				style:notelessonstyle
			}
			nodata.style.display = "none";
			table.innerHTML = "";
			app.GetNoteLesson(notelessonRequest, function(data) {
				currentPageIndex = 1;
				var notelessonMainwebview = plus.webview.getWebviewById('/work/notelesson_main.html');

				$.fire(notelessonMainwebview, 'resetMsgInfo', {
					totalItemCount: data.totalItemCount,
					itemGroupCount: data.itemGroupCount,
					lessonNumber: data.lessonNumber
				});
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
		console.log(JSON.stringify(data));
		totalPageCount = data.totalPageCount;
		var notelessonlist = data.items
		for(var i = 0; i < notelessonlist.length; i++) {

			var div = document.createElement('div');
			div.className = 'mui-card';
			var header = '<div class="mui-card-header  mui-card-media"> <img src="../images/50x50s.png" style="border-radius: 50%; " /><h6 class="mui-h6 mui-pull-right">' + app.lessonTypeHTML(notelessonlist[i].noteLesson.lesson_type) + '</h6><div class="mui-media-body"><span>' + notelessonlist[i].noteLesson.student_name + '</span><p>' + app.ConvertJsonTime(notelessonlist[i].noteLesson.lesson_time) + '</p></div></div>';
            //<div class="mui-row"><div class="mui-col-xs-6"><p>消耗学费:' + notelessonlist[i].noteLesson.moeny + '￥</p></div><div class=" mui-col-xs-6"><p>消耗优惠:' + notelessonlist[i].noteLesson.cash_coupon + '￥</p></div></div> 
			var content = '<div class="mui-card-content"><div class="mui-card-content-inner"><p class="mui-card-correlation"><i class=" mui-icon iconfont icon-xiangmu"></i><span style=" padding-right: 10px;">课程:</span><span>' + notelessonlist[i].noteLesson.lesson_name + '</span></p>	<div class="mui-row" style="padding-top: 10px;"><div class="mui-col-xs-6"><p>消耗:' + GetLessonNumHTML(notelessonlist[i].noteLesson.lesson_type, notelessonlist[i].noteLesson.lesson_num) + '</p></div><div class=" mui-col-xs-6">	<p>科目:<em style=" font-style: normal; color: #a386f2; ">' + notelessonlist[i].noteLesson.subject_name + '</em></p></div></div>   <p>说明:' + notelessonlist[i].noteLesson.description + '</p><p class="mui-card-correlation"><i class=" mui-icon iconfont icon-guanlian"></i><span style=" padding-right: 10px;">教师:</span><span>' + notelessonlist[i].noteLesson.teacher_name + '老师</span></p> <p class="mui-card-correlation"><i class=" mui-icon iconfont icon-my-line"></i><span style=" padding-right: 10px;">操作人:</span><span>' + notelessonlist[i].create_name + '</span></p>  </div></div>';

			var footer = '<div class="mui-card-footer"><a class="mui-h6 "><b class="noteLessonState" data-id="' + notelessonlist[i].noteLesson.id + '" >' + app.noteLessonStateHTML(notelessonlist[i].noteLesson.state) + '</b><span style="padding-left:10px">' + (notelessonlist[i].noteLesson.style == "1" ? "正式" : "体验") + '</span></a><a data-id="' + notelessonlist[i].noteLesson.id + '"  class=" mui-h6 more"><div class="mui-hidden">' + JSON.stringify(notelessonlist[i].noteLesson) + '</div><i class=" mui-icon iconfont icon-more " style=" vertical-align: middle;"></i>更多</a> 	</div>';
			div.innerHTML = header + content + footer;
			table.appendChild(div);
		}
	}

	var $B_this;
	var b_noteLesson_id = "";
	//状态
	$(".mui-scroll").on('tap', '.noteLessonState', function() {
		$B_this = this;
		b_noteLesson_id = $B_this.dataset.id;
		$("#showLessonStatePopover").popover("toggle");

	});

	$("#showLessonStatePopover .mui-table-view").on('tap', 'a', function() {

		$("#showLessonStatePopover").popover("toggle");
		var atext = this.innerText;
		var statekey = app.getNoteLessonStateCode(atext);
		if(statekey == "") {
			return callback('请选择上课状态');
		}
		var noteLessonRequest = {
			id: b_noteLesson_id,
			state: statekey,
			update_by: account.id
		}
		if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
			plus.nativeUI.toast('网络不给力，请检查网络设置');
			return;
		}
		console.log(JSON.stringify(noteLessonRequest));
		var waiting = plus.nativeUI.showWaiting();
		app.DeleteNoteLesson(noteLessonRequest, function(data) {
			waiting.close();
			if(data.success) {
				$.toast("更改成功");
				$B_this.innerHTML = app.noteLessonStateHTML(statekey);
			} else {
				$.toast(data.msg);
			}
		});

	});

	var noteLesson_id = "",
		notelesson_data;
	var $this;
	$(".mui-scroll").on('tap', '.more', function() {
		$this = this;
		noteLesson_id = $this.dataset.id;
		notelesson_data = this.childNodes[0].innerHTML;
		mui('#moreaction').popover('toggle');

	});
	$("#moreaction").on('tap', 'a', function() {
		var hrefValue = this.getAttribute('href');
		switch(hrefValue) {
			case "delete":
				deleteNoteLesson(noteLesson_id);
				break;
			case "again_notelesson":
				againNotelesson(notelesson_data);
				break;
		}

		mui('#moreaction').popover('toggle');

	});
	//删除上课
	function deleteNoteLesson(noteLessonId) {
		var btnArray = ['是', '否'];
		mui.confirm('确定删除该上课记录?删除后将不可能恢复。', '温馨提示', btnArray, function(e) {
			if(e.index == 1) {
				console.log("否")
			} else {
				var noteLessonRequest = {
					id: noteLesson_id,
					update_by: account.id,
					enable_flag: "0"
				}
				console.log(JSON.stringify(noteLessonRequest));
				if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
					plus.nativeUI.toast('网络不给力，请检查网络设置');
					return;
				}
				var waiting = plus.nativeUI.showWaiting();
				app.DeleteNoteLesson(noteLessonRequest, function(data) {
					waiting.close();
					if(data.success) {
						$.toast("删除成功");
						var muiCardElement = $this.parentElement.parentElement;
						muiCardElement.parentElement.removeChild(muiCardElement);
					} else {
						$.toast(data.msg);
					}

				});
			}
		});
	}
	//续上课
	function againNotelesson(notelessondata) {
		if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
			plus.nativeUI.toast('网络不给力，请检查网络设置');
			return;
		}
		var waiting = plus.nativeUI.showWaiting();
		app.getSubjectList(account.org_id, function(data) {
			waiting.close();
			if(data.length <= 0) {
				$.toast("请联系管理员添加科目");
				return;
			}
			localStorage.setItem("$noteLessonSubject", JSON.stringify(data));
			localStorage.setItem("$notelessondata", notelessondata);
			var againNotelessonPage = $.preload({
				"id": 'again_notelesson.html',
				"url": 'again_notelesson.html'
			});
			againNotelessonPage.show("pop-in");
		});
	}

	$("#topPopover .mui-table-view").on('tap', 'a', function() {
		var $this = this;
		$("#topPopover").popover("hide");
		if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
			plus.nativeUI.toast('网络不给力，请检查网络设置');
			return;
		}
		var waiting = plus.nativeUI.showWaiting();
		app.getSubjectList(account.org_id, function(data) {
			waiting.close();
			if(data.length <= 0) {
				$.toast("请联系管理员添加科目");
				return;
			}
			localStorage.setItem("$noteLessonSubject", JSON.stringify(data));

			var action = $this.innerText;
			switch(action) {
				case "按班记":
					var modifyClassNoteLessonPage = $.preload({
						"id": 'modify_class_notelesson.html',
						"url": 'modify_class_notelesson.html'
					});
					modifyClassNoteLessonPage.addEventListener('loaded', function() {
						$.fire(modifyClassNoteLessonPage, 'getParameter', {});
					});
					modifyClassNoteLessonPage.show("pop-in");
					break;
				case "按学员记":
					var modifyStudentNoteLessonPage = $.preload({
						"id": 'modify_student_notelesson.html',
						"url": 'modify_student_notelesson.html'
					});
					modifyStudentNoteLessonPage.addEventListener('loaded', function() {
						$.fire(modifyStudentNoteLessonPage, 'getParameter', {});
					});
					modifyStudentNoteLessonPage.show("pop-in");
					break;
				default:
					break;
			}
		});

	});

	/*
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		$("#topPopover").popover("hide");
		setTimeout(function() {
			++currentPageIndex
			var notelessonRequest = {
				org_id: account.org_id,
				account_id: account.id,
				pagesize: pagesize,
				pageindex: currentPageIndex,
				campus_id: campus_id,
				student_name: student_name,
				teacher_name: teacher_name,
				notelesson_start: notelesson_start,
				notelesson_end: notelesson_end,
				lesson_name: lesson_name,
				subject_name: subject_name,
				state: notelessonstate,
				style:notelessonstyle
			}

			console.log(JSON.stringify(notelessonRequest));
			$('#pullrefresh').pullRefresh().endPullupToRefresh(currentPageIndex > totalPageCount);
			if(!(currentPageIndex > totalPageCount)) {
				app.GetNoteLesson(notelessonRequest, function(data) {
					pushViewElement(data);
				});
			}
		}, 1500);
	}

})(mui, document)