(function($, doc) {
	$.init();
	//阻尼系数
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	$('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});

	var account = app.getAccount();
	var totalPageCount1 = 0,
		totalPageCount2 = 0,
		totalPageCount3 = 0,
		totalPageCount4 = 0,
		totalPageCount5 = 0;
	var currentPageIndex1 = 1,
		currentPageIndex2 = 1,
		currentPageIndex3 = 1,
		currentPageIndex4 = 1,
		currentPageIndex5 = 1;
	var pagesize = 20;

	var rightBar = doc.getElementById("rightBar");
	var rightSearch = doc.getElementById("rightSearch");
	
	var phoneUL = doc.body.querySelector('#showPhonePopover .mui-table-view');
	
	$.ready(function() {
		initData();
		//循环初始化所有下拉刷新，上拉加载。
		$.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
			$(pullRefreshEl).pullToRefresh({
				down: {
					callback: function() {
						var self = this;
						var ul = self.element.querySelector('.mui-table-view');
						var datasetList = ul.dataset;
						console.log(JSON.stringify(datasetList));
						pulldownRefresh(self, datasetList.state, ul);
					}
				},
				up: {
					callback: function() {
						var self = this;
						var ul = self.element.querySelector('.mui-table-view');
						var datasetList = ul.dataset;
						console.log(JSON.stringify(datasetList));
						pullupRefresh(self, datasetList.state, ul);
					}
				}
			});
		});

		function initData() {
			//循环初始化所有下拉刷新，上拉加载。
			$.each(document.querySelectorAll('.mui-table-view'), function(index, ul) {
				var datasetList = ul.dataset;
				pulldata(datasetList.state, ul);
			});
		}

		function pulldata(stu_state, ul) {
			var _stustate = [];
			_stustate.push(stu_state);
			var studentrRequest = {
				org_id: account.org_id,
				account_id: account.id,
				pagesize: pagesize,
				pageindex: 1,
				state: _stustate
			}
			ul.innerHTML = "";

			app.GetStudentList(studentrRequest, function(data) {
				setTotalPageCount(stu_state, data.totalPageCount);
				ul.appendChild(pushViewElement(data));
			});

		}

		/*
		 * 下拉刷新具体业务实现
		 * @param {Object} pullRefreshEl
		 * @param {Object} stu_state
		 * @param {Object} ul
		 */
		var pulldownRefresh = function(pullRefreshEl, stu_state, ul) {
			setTimeout(function() {
				var _stustate = [];
				_stustate.push(stu_state);
				var studentrRequest = {
					org_id: account.org_id,
					account_id: account.id,
					pagesize: pagesize,
					pageindex: 1,
					state: _stustate
				}
				ul.innerHTML = "";
				//nodata.style.display = "none";
				var _pullRefreshEl = pullRefreshEl;

				app.GetStudentList(studentrRequest, function(data) {
					setTotalPageCount(stu_state, data.totalPageCount);
					setCurrentPageIndex(stu_state);

					if(data.items.length == 0) {

						//nodata.style.display = "block";
						_pullRefreshEl.endPullDownToRefresh();

					} else {
						ul.appendChild(pushViewElement(data));

						_pullRefreshEl.endPullDownToRefresh();
						_pullRefreshEl.refresh(true);

					}
				});

			}, 1000);
		}

		/*
		 * 上拉加载具体业务实现
		 * @param {Object} pullRefreshEl
		 * @param {Object} stu_state
		 * @param {Object} ul
		 */
		var pullupRefresh = function(pullRefreshEl, stu_state, ul) {
			var currentPageIndex = 1,
				totalPageCount = 0;
			var _stustate = [];
			_stustate.push(stu_state);
			var _parameterList = parameterList(stu_state);

			currentPageIndex = _parameterList.currentPageIndex;
			totalPageCount = _parameterList.totalPageCount;
			setTimeout(function() {
				var _pullRefreshEl = pullRefreshEl;
				var studentrRequest = {
					org_id: account.org_id,
					account_id: account.id,
					pagesize: pagesize,
					pageindex: currentPageIndex,
					state: _stustate
				}
				_pullRefreshEl.endPullUpToRefresh(currentPageIndex > totalPageCount);
				if(!(currentPageIndex > totalPageCount)) {
					app.GetStudentList(studentrRequest, function(data) {
						setTotalPageCount(stu_state, data.totalPageCount);
						ul.appendChild(pushViewElement(data));
					
					});
				}
			}, 1000);
		}

		/**
		 * item html
		 * @param {Object} data
		 */
		function pushViewElement(data) {
			//totalPageCount = data.totalPageCount;
			var studentlist = data.items;
			var fragment = document.createDocumentFragment();
			for(var i = 0; i < studentlist.length; i++) {
				var div = document.createElement('li');
				div.className = 'mui-table-view-cell';
				div.innerHTML = '<a class="mui-navigate"><div class="oa-contact-cell mui-table"><div class="oa-contact-avatar mui-table-cell"><img src="../images/50x50s.png" /></div><div class="oa-contact-content mui-table-cell"><div class="mui-hidden">' + JSON.stringify(studentlist[i]) + '</div><div class="mui-clearfix"><h4 class="oa-contact-name">' + studentlist[i].name + app.studentSexHTML(studentlist[i].sex)+ '</h4></div><p class="oa-contact-email mui-h6"><span>跟进：' + app.ConvertJsonTime(studentlist[i].lastrecord_time) + '</span></p></div><div class="oa-contact-tel mui-table-cell"  data-phone="' + studentlist[i].phone + '" data-phone2="' + (studentlist[i].phone2 != null ? studentlist[i].phone2 : "") + '" data-studentphone="' + (studentlist[i].student_phone != null ? studentlist[i].student_phone : "") + '" ><span class="mui-icon  mui-icon-phone mui-pull-right student-phone" ></span></div></div></a> ';
				fragment.appendChild(div);
			}
			return fragment;
		}

		/**
		 * 下拉参数
		 * @param {Object} state
		 */
		var parameterList = function(state) {
			var parameters = {
				"currentPageIndex": 1,
				"totalPageCount": 0
			};
			var currentPageIndex = 1;
			console.log(state);
			switch(state) {
				case "stuState0001":
					++currentPageIndex1;
					currentPageIndex = currentPageIndex1;
					parameters.currentPageIndex = currentPageIndex;
					parameters.totalPageCount = totalPageCount1;
					break;
				case "stuState0002":
					++currentPageIndex2;
					currentPageIndex = currentPageIndex2;
					parameters.currentPageIndex = currentPageIndex;
					parameters.totalPageCount = totalPageCount2;
					break;
				case "stuState0003":
					++currentPageIndex3;
					currentPageIndex = currentPageIndex3;

					parameters.currentPageIndex = currentPageIndex;
					parameters.totalPageCount = totalPageCount3;
					break;
				case "stuState0004":
					++currentPageIndex4;
					currentPageIndex = currentPageIndex4;

					parameters.currentPageIndex = currentPageIndex;
					parameters.totalPageCount = totalPageCount4;
					break;
				case "stuState0005":
					++currentPageIndex5;
					currentPageIndex = currentPageIndex5;

					parameters.currentPageIndex = currentPageIndex;
					parameters.totalPageCount = totalPageCount5;
					break;
				default:
					break;
			}
			return parameters;
		}

		/**
		 * 总页数
		 * @param {Object} state
		 * @param {Object} totalPageCount
		 */
		var setTotalPageCount = function(state, totalPageCount) {
			switch(state) {
				case "stuState0001":
					totalPageCount1 = totalPageCount;
					break;
				case "stuState0002":
					totalPageCount2 = totalPageCount;
					break;
				case "stuState0003":
					totalPageCount3 = totalPageCount;
					break;
				case "stuState0004":
					totalPageCount4 = totalPageCount;
					break;
				case "stuState0005":
					totalPageCount5 = totalPageCount;
					break;
				default:
					break;
			}
		}
		/**
		 * 当前页数
		 * @param {Object} state
		 */
		var setCurrentPageIndex = function(state) {
			switch(state) {
				case "stuState0001":
					currentPageIndex1 = 1;
					break;
				case "stuState0002":
					currentPageIndex2 = 1;
					break;
				case "stuState0003":
					currentPageIndex3 = 1;
					break;
				case "stuState0004":
					currentPageIndex4 = 1;
					break;
				case "stuState0005":
					currentPageIndex5 = 1;
					break;
				default:
					break;
			}
		}

		$(".mui-table-view").on('tap', '.oa-contact-content', function() {
			//获取id
			var contentdata = this.childNodes[0].innerHTML;
			var modifyStudentPage = $.preload({
				"id": 'detail_student.html',
				"url": 'detail_student.html'
			});
			var student = JSON.parse(contentdata);
			var studentModel = app.getStudent();
			if(JSON.stringify(studentModel) != "{}") {
				if(studentModel.id != student.id) {
					localStorage.setItem('$student', JSON.stringify(student));
				}
			} else {
				localStorage.setItem('$student', JSON.stringify(student));
			}
			modifyStudentPage.show("pop-in");
		});

		$(".mui-table-view").on('tap', '.oa-contact-tel', function() {
			var teldataset = this.dataset;
       
			if(teldataset.phone2 == "" && teldataset.studentphone == "") {
				if(mui.os.plus) {
					plus.device.dial(teldataset.phone);
				} else {
					location.href = teldataset.phone;
				}
			} else {
				var phonehtmlStr = "";
				phonehtmlStr += '<li class="mui-table-view-cell"><a  data-phone="' + teldataset.phone + '" >' + teldataset.phone + '<span class="mui-pull-right">家长</span></a></li>';
				if(teldataset.phone2 != "") {
					phonehtmlStr += '<li class="mui-table-view-cell"><a  data-phone="' + teldataset.phone2 + '" >' + teldataset.phone2 + '<span class="mui-pull-right">家长</span></a></li>';
				}
				if(teldataset.studentphone != "") {
					phonehtmlStr += '<li class="mui-table-view-cell"><a  data-phone="' + teldataset.studentphone + '" >' + teldataset.studentphone + '<span class="mui-pull-right">学员</span></a></li>';
				}
				phoneUL.innerHTML = phonehtmlStr;
				$("#showPhonePopover").popover("toggle");
			}
		}, false);

		$("#showPhonePopover .mui-table-view").on('tap', 'a', function() {
			var phone = this.dataset.phone;
			$("#showPhonePopover").popover("toggle");
			if(mui.os.plus) {
				plus.device.dial(phone);
			} else {
				location.href = phone;
			}
		});

		rightBar.addEventListener('tap', function(event) {
			var modifyStudentPage = $.preload({
				"id": 'modify_student.html',
				"url": 'modify_student.html'
			});
			modifyStudentPage.addEventListener('loaded', function() {
				$.fire(modifyStudentPage, 'getParameter', {});
			});
			modifyStudentPage.show("pop-in");
		});

		rightSearch.addEventListener('tap', function(event) {
			var modifyStudentPage = $.preload({
				"id": '/work/student_main.html',
				"url": '/work/student_main.html'
			});
			modifyStudentPage.addEventListener('loaded', function() {
				$.fire(modifyStudentPage, 'getParameter', {});
			});
			modifyStudentPage.show("pop-in");
		});

	});
})(mui, document);