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
	var student = app.getStudent();
	var totalPageCount = 0;
	var currentPageIndex = 1;
	var pagesize = 8;
	var nodata = document.body.querySelector('.nodata');


	var table = document.body.querySelector('.mui-scroll');
	window.addEventListener("reload", function(e) {
		pulldownRefresh();

	});

	function getNextTime(nexttime) {
		var nexttimeHTML = "";
		if(nexttime != null && nexttime != "") {
			nexttimeHTML = ' <p class="mui-card-correlation"><i class="mui-icon  iconfont icon-time"></i><span>下次跟进：</span><span>' + app.ConvertJsonTime(nexttime) + '</span</p> ';
		} else {
			nexttimeHTML = ' <p class="mui-card-correlation"><i class="mui-icon  iconfont icon-time"></i><span>下次跟进：</span><span>无计划</span</p> ';
		}
		return nexttimeHTML;
	}
	/*
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		setTimeout(function() {
			var recordRequest = {
				org_id: account.org_id,
				account_id: account.id,
				pagesize: pagesize,
				pageindex: 1,
				student_id:student.id
			}
			console.log(JSON.stringify(recordRequest) );
			nodata.style.display = "none";
			table.innerHTML = "";
			app.GetRecordList(recordRequest, function(data) {
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
		var recordlist = data.items
		for(var i = 0; i < recordlist.length; i++) {

			var div = document.createElement('div');
			div.className = 'mui-card';
			div.innerHTML = '<div class="mui-card-header  mui-card-media"> <img src="../images/50x50t.png" style="border-radius: 50%; " /><h6 class="mui-h6 mui-pull-right">' + app.talkStyleHTML(recordlist[i].record.style) + '</h6><div class="mui-media-body"><span>' + recordlist[i].record.create_name + '</span><p>' + app.ConvertJsonTime(recordlist[i].record.create_time) + '</p></div></div><div class="mui-card-content"><div class="mui-card-content-inner"><p>' + app.studentStateHTML(recordlist[i].record.state) + '</p><div>' + recordlist[i].record.r_content + '</div>  ' + getNextTime(recordlist[i].record.next_time)+' </div></div><div class="mui-card-footer"><a class="mui-h6"><i class=" mui-icon mui-icon mui-icon-extra mui-icon-extra-like" style=" font-size: 1.2em;"></i> 赞</a><a class="mui-h6  remove" data-id="' + recordlist[i].record.id + '" data-studentid="' + recordlist[i].record.student_id + '" ><i class=" mui-icon mui-icon-trash" style=" font-size: 1.5em;"></i>删除</a></div>';
			table.appendChild(div);
		}
	}

	$(".mui-scroll").on('tap', '.remove', function() {

		var $this = this;
		var btnArray = ['是', '否'];
		mui.confirm('确定删除该条跟进记录?删除后将不可能恢复。', '删除跟进记录', btnArray, function(e) {
			if(e.index == 1) {
				console.log("否")
			} else {
				var recordRequest = {
					id: $this.dataset.id,
					student_id: $this.dataset.studentid,
					enable_flag: "0"
				}
				console.log(JSON.stringify(recordRequest));
				if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
					plus.nativeUI.toast('网络不给力，请检查网络设置');
					return;
				}
				var waiting = plus.nativeUI.showWaiting();
				app.DeleteRecord(recordRequest, function(data) {
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
	//}
	/*
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		setTimeout(function() {
			++currentPageIndex
			var recordRequest = {
				org_id: account.org_id,
				account_id: account.id,
				pagesize: pagesize,
				pageindex: currentPageIndex,
				student_id:student.id
			}
			$('#pullrefresh').pullRefresh().endPullupToRefresh(currentPageIndex > totalPageCount);
			if(!(currentPageIndex > totalPageCount)) {
				app.GetRecordList(recordRequest, function(data) {
					pushViewElement(data);
				});
			}
		}, 1500);
	}

})(mui, document)