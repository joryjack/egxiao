(function($, doc) {
	$.init();
	$.plusReady(function() {

		mui('.mui-scroll-wrapper').scroll();

		var account = app.getAccount();
		var studentChart = doc.getElementById("studentChart");

		var rightBar = doc.getElementById("rightBar");

		var menuWrapper = doc.getElementById("menu-wrapper");
		var menu = doc.getElementById("menu");
		var menuWrapperClassList = menuWrapper.classList;
		var backdrop = doc.getElementById("menu-backdrop");

		var chartType = doc.getElementById("chartType");
		var dataScope = doc.getElementById("dataScope");

		var charttable = doc.getElementById("charttable");
		var chartline = doc.getElementById("chartline");

		var table = doc.getElementById("table");
		var chart = doc.getElementById("chart");

		backdrop.addEventListener('tap', function() {
			var chartTypeClassList = chartType.classList;
			chartTypeClassList.remove('mui-active');
			toggleMenu();
		});
		chartType.addEventListener('tap', toggleMenu);

		dataScope.addEventListener('tap', function(event) {

			var studentchat_datascopePage = $.preload({
				"id": 'datascope/studentchat_datascope.html',
				"url": 'datascope/studentchat_datascope.html'
			});
			studentchat_datascopePage.addEventListener('loaded', function() {
				$.fire(studentchat_datascopePage, 'getParameter', {});
			});
			studentchat_datascopePage.show("pop-in");
		});
		var student_start, student_end;
		//查询
		window.addEventListener("search", function(e) {
			var dataScopeClassList = dataScope.classList;
			dataScopeClassList.remove('mui-active');
			student_start = e.detail.student_start;
			student_end = e.detail.student_end;

			loadData();
		});
		var busying = false;

		function toggleMenu() {
			if(busying) {
				return;
			}
			busying = true;
			if(menuWrapperClassList.contains('mui-active')) {
				doc.body.classList.remove('menu-open');
				menuWrapper.className = 'menu-wrapper fade-out-up animated';
				menu.className = 'menu bounce-out-up animated';
				setTimeout(function() {
					backdrop.style.opacity = 0;
					menuWrapper.classList.add('hidden');
				}, 500);
			} else {
				doc.body.classList.add('menu-open');
				menuWrapper.className = 'menu-wrapper fade-in-down animated mui-active';
				menu.className = 'menu bounce-in-down animated';
				backdrop.style.opacity = 1;
			}
			setTimeout(function() {
				busying = false;
			}, 500);
		}

		//报表类型切换
		/**
		 * 切换Table
		 */
		charttable.addEventListener("tap", function() {
			charttable.innerHTML = '<em class="chartType-active  mui-icon  iconfont icon-check" style=" font-size: 1.1em; padding-right: 2px;"></em>统计表';
			chartline.innerHTML = '<em class="chartType  mui-icon  iconfont icon-check" style=" font-size: 1.1em; padding-right: 2px;"></em>折线图';
			var chartTypeClassList = chartType.classList;
			chartTypeClassList.remove('mui-active');

			var tableClassList = table.classList;
			tableClassList.remove('mui-hidden');
			var chartClassList = chart.classList;
			chartClassList.add('mui-hidden');

			toggleMenu();

		}, false);
		/**
		 * 切换 Line
		 */
		chartline.addEventListener("tap", function() {
			chartline.innerHTML = '<em class="chartType-active  mui-icon  iconfont icon-check" style=" font-size: 1.1em; padding-right: 2px;"></em>折线图 ';
			charttable.innerHTML = '<em class="chartType  mui-icon  iconfont icon-check" style=" font-size: 1.1em; padding-right: 2px;"></em>统计表';

			var chartTypeClassList = chartType.classList;
			chartTypeClassList.remove('mui-active');

			var tableClassList = table.classList;
			tableClassList.add('mui-hidden');
			var chartClassList = chart.classList;
			chartClassList.remove('mui-hidden');

			toggleMenu();

		}, false);

		var option = {
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['跟进学员', '报名学员', '无意向学员', '结课学员', '流失学员']
			},
			grid: {
				left: '3%',
				right: '5%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: ['']
			},
			yAxis: {
				type: 'value'
			},
			series: [{
					name: '跟进学员',
					type: 'line',
					itemStyle: {
						normal: {
							color: '#86D560'
						}
					},
					data: [0]
				},
				{
					name: '报名学员',
					type: 'line',
					itemStyle: {
						normal: {
							color: '#FFCC67'
						}
					},
					data: [0]
				},
				{
					name: '无意向学员',
					type: 'line',
					itemStyle: {
						normal: {
							color: '#53D1C5'
						}
					},
					data: [0]
				},
				{
					name: '结课学员',
					type: 'line',
					itemStyle: {
						normal: {
							color: '#AF89D6'
						}
					},
					data: [0]
				},
				{
					name: '流失学员',
					type: 'line',
					itemStyle: {
						normal: {
							color: '#FF999A'
						}
					},
					data: [0]
				}
			]
		};

		var eChart = echarts.init(studentChart);
		eChart.setOption(option);
		loadData();

		function loadData() {
			var studentChatRequest = {
				org_id: account.org_id,
				account_id: account.id,
				student_start: student_start,
				student_end: student_end
			};
			console.log(JSON.stringify(studentChatRequest));

			eChart.showLoading();
			app.GetStudentChatData(studentChatRequest, function(data) {
				eChart.hideLoading();
				console.log(JSON.stringify(data));
				if(data != []) {
					var xAxisData = [],
						recordData = [],
						enrollData = [],
						nointerestData = [],
						graduateData = [],
						leaveData = [];
					for(var i = 0; i < data.length; i++) {
						xAxisData.push(data[i].campus_name);
						recordData.push(data[i].record_number);
						enrollData.push(data[i].enroll_number);
						nointerestData.push(data[i].nointerest_number);
						graduateData.push(data[i].graduate_number);
						leaveData.push(data[i].leave_number);
					}

					table.appendChild(pushTableHtml(data));
					eChart.setOption({
						xAxis: {
							data: xAxisData
						},
						series: [{
								data: recordData
							},
							{
								data: enrollData
							},
							{
								data: nointerestData
							},
							{
								data: graduateData
							},
							{
								data: leaveData
							}
						]
					});
				}

			});
		}

		/**
		 * table buiding
		 * @param {Object} data
		 */
		function pushTableHtml(data) {
			table.innerHTML = "";

			var fragment = document.createDocumentFragment();
			for(var i = 0; i < data.length; i++) {
				var div = document.createElement('li');
				div.className = 'mui-table-view-cell';
				var liHTML = "";
				liHTML += '<div class="mui-row">';
				liHTML += '<div class="mui-col-xs-12"><p>' + data[i].campus_name + '</p></div>';
				liHTML += '<div class="mui-col-xs-6"><p>跟进学员:' + data[i].record_number + '</p></div>';
				liHTML += '<div class="mui-col-xs-6"><p>报名学员:' + data[i].enroll_number + '</p></div>';
				liHTML += '<div class="mui-col-xs-6"><p>无意向学员:' + data[i].nointerest_number + '</p></div>';
				liHTML += '<div class="mui-col-xs-6"><p>结课学员:' + data[i].graduate_number + '</p></div>';
				liHTML += '<div class="mui-col-xs-6"><p>流失学员:' + data[i].leave_number + '</p></div>';
				liHTML += '</div>';
				div.innerHTML = liHTML;
				fragment.appendChild(div);
			}
			return fragment;
		}
		/**
		 * 刷新
		 */
		rightBar.addEventListener('tap', function() {
			loadData();
		}, false);

	});
})(mui, document)