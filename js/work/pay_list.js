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
	var defaultTab = document.getElementById('defaultTab');

	var student_name, enroll_start, enroll_end, state,create_name,lesson_name,campus_id ;
	window.addEventListener("search", function(e) {
		student_name = e.detail.student_name;
		enroll_start = e.detail.enroll_start;
		enroll_end = e.detail.enroll_end;
		state = e.detail.state;
		create_name = e.detail.create_name;
		lesson_name = e.detail.lesson_name;
		campus_id = e.detail.campus_id;
		pulldownRefresh();
	});

	window.addEventListener("reload", function(e) {
		pulldownRefresh();
	});

	function GetLessonNumHTML(type, lessonNum) {
		var html = ""
		switch(type) {
			case "1":
				html = '<p><em class="price-danger price-large">' + lessonNum + '</em>课时</p><p>课时</p>';
				break;
			case "2":
				html = '<p><em class="price-danger price-large">' + lessonNum + '</em>课时</p><p>课时包</p>';
				break;
			default:
				break;
		}
		return html;
	}
	/*
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		setTimeout(function() {
			var enrollRequest = {
				org_id: account.org_id,
				account_id: account.id,
				pagesize: pagesize,
				pageindex: 1,
				student_name: student_name,
				enroll_start: enroll_start,
				enroll_end: enroll_end,
				state: state,
				campus_id: campus_id,
				create_name: create_name,
				lesson_name: lesson_name
			}

			console.log(JSON.stringify(enrollRequest));
			nodata.style.display = "none";
			table.innerHTML = "";
			app.GetEnrollList(enrollRequest, function(data) {
				var payMainwebview = plus.webview.getWebviewById('/work/pay_main.html');
				 console.log(data.discountNumber);  
				 var discountText="";
				 if(typeof(data.discountNumber)!="undefined"){
				 	discountText ='优惠:' +data.discountNumber.toFixed(2) +',  ';
				 }
				defaultTab.innerHTML = '<p>欠费:' + data.arrearsNumber.toFixed(2) + '</p><p>'+discountText+'缴费:' + data.paymentNumber.toFixed(2) + '</p>'
				
				$.fire(payMainwebview, 'resetMsgInfo', { totalItemCount: data.totalItemCount, itemGroupCount: data.itemGroupCount });

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
		var paylist = data.items
		for(var i = 0; i < paylist.length; i++) {
			var div = document.createElement('div');
			div.className = 'mui-card';

			div.innerHTML = '<div class="mui-card-header  mui-card-media"><img src="../images/50x50t.png" style="border-radius: 50%; " /><h6 class="mui-h6 mui-pull-right">' + paylist[i].lesson_price + '￥/' + app.lessonTypeHTML(paylist[i].lesson_type) + '</h6><div class="mui-media-body"><span>' + paylist[i].create_name + '</span><p>' + app.ConvertJsonTime(paylist[i].create_time) + '</p></div></div>    	<div class="mui-card-content"><div class="mui-card-content-inner"><div class="mui-hidden">' + JSON.stringify(paylist[i]) + '</div><p class="mui-card-correlation"><i class=" mui-icon iconfont icon-xiangmu"></i><span style=" padding-right: 10px;">课程:</span><span>' + paylist[i].lesson_name + '</span> <span class=" mui-h5 mui-pull-right"></span></p><div class="mui-row" style="padding-top: 10px;"><div class="mui-col-xs-6"><p><em  class="price-success price-large">' + paylist[i].payment + '</em>￥</p><p>缴费金额</p><p>欠费金额 <em class="price-danger">' + paylist[i].arrears + '</em>元</p></div><div class=" mui-col-xs-6">' + GetLessonNumHTML(paylist[i].lesson_type, paylist[i].lesson_number) + '<p>优惠金额<em class="price-danger">' + paylist[i].discount + '</em> 元</p></div></div><p>说明:' + paylist[i].description + '</p></div>   <p class="mui-card-correlation student" style=" padding-left: 15px;"  data-model=\'' + JSON.stringify(paylist[i].student) + '\' ><i class=" mui-icon iconfont icon-guanlian"></i><span style=" padding-right: 10px;">报名学员:</span><span>' + paylist[i].stu_name + '</span></p></div>   <div class="mui-card-footer"><a class="mui-h6"><i class=" mui-icon mui-icon mui-icon-extra mui-icon-extra-like" style=" font-size: 1.2em;"></i> 赞</a><a class="mui-h6  remove" data-id="' + paylist[i].id + '" data-studentid="' + paylist[i].stu_id + '"   data-lessonid="' + paylist[i].lesson_id + '" ><i class=" mui-icon mui-icon-trash" style=" font-size: 1.5em;"></i>删除</a></div>';
			table.appendChild(div);
		}
	}

	/**
	 * 报名详情
	 */
	$(".mui-scroll").on('tap', '.mui-card-content-inner', function() {
		var contentdata = this.childNodes[0].innerHTML;

		localStorage.setItem('$enroll', contentdata);
		var detailEnrollPage = $.preload({
			"id": 'detail_enroll.html',
			"url": 'detail_enroll.html'
		});
		detailEnrollPage.show("pop-in");
	});

	/**
	 * 学员详情
	 */
	$(".mui-scroll").on('tap', '.student', function() {
		var contentdata = this.dataset.model;
		console.log(contentdata);
		var modifyStudentPage = $.preload({
			"id": 'detail_student.html',
			"url": 'detail_student.html'
		});
		var student = JSON.parse(contentdata);
		//student.source = getSourceValue(student.source);
		localStorage.setItem('$student', JSON.stringify(student));
		modifyStudentPage.show("pop-in");
	});

	$(".mui-scroll").on('tap', '.remove', function() {
		var $this = this;
		var btnArray = ['是', '否'];
		mui.confirm('确定删除该条报名记录?删除后将不能恢复。', '删除报名记录', btnArray, function(e) {
			if(e.index == 1) {
				console.log("否")
			} else {
				var enrollRequest = {
					id: $this.dataset.id,
					stu_id: $this.dataset.studentid,
					lesson_id: $this.dataset.lessonid,
					enable_flag: "0"
				}
				var payRequest = {
					data: JSON.stringify(enrollRequest),
					dean_id: "",
					dean_name: ""
				}

				console.log(JSON.stringify(payRequest));
				if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
					plus.nativeUI.toast('网络不给力，请检查网络设置');
					return;
				}
				var waiting = plus.nativeUI.showWaiting();
				app.deleteSaveEnroll(payRequest, function(data) {
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
			var enrollRequest = {
				org_id: account.org_id,
				account_id: account.id,
				pagesize: pagesize,
				pageindex: currentPageIndex,
				campus_id: campus_id,
				student_name: student_name,
				enroll_start: enroll_start,
				enroll_end: enroll_end,
				state: state,
				create_name: create_name,
				lesson_name: lesson_name
			}
			$('#pullrefresh').pullRefresh().endPullupToRefresh(currentPageIndex > totalPageCount);
			if(!(currentPageIndex > totalPageCount)) {
				app.GetEnrollList(enrollRequest, function(data) {
					pushViewElement(data);
				});
			}
		}, 1500);
	}

})(mui, document)