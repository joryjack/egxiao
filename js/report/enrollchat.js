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
				"id": 'datascope/enrollchat_datascope.html',
				"url": 'datascope/enrollchat_datascope.html'
			});
			studentchat_datascopePage.addEventListener('loaded', function() {
				$.fire(studentchat_datascopePage, 'getParameter', {});
			});
			studentchat_datascopePage.show("pop-in");
		});

		var enroll_start, enroll_end;
		//查询
		window.addEventListener("search", function(e) {
			var dataScopeClassList = dataScope.classList;
			dataScopeClassList.remove('mui-active');
			enroll_start = e.detail.enroll_start;
			enroll_end = e.detail.enroll_end;
         
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
				data: ['实缴金额', '欠款金额', '优惠金额']
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
					name: '实缴金额',
					type: 'line',
					itemStyle: {
						normal: {
							color: '#86D560'
						}
					},
					data: [0]
				},
				{
					name: '欠款金额',
					type: 'line',
					itemStyle: {
						normal: {
							color: '#FFCC67'
						}
					},
					data: [0]
				},
				{
					name: '优惠金额',
					type: 'line',
					itemStyle: {
						normal: {
							color: '#53D1C5'
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
			var enrollChatRequest = {
				org_id: account.org_id,
				account_id: account.id,
				enroll_start: enroll_start,
				enroll_end: enroll_end
			};
            console.log(JSON.stringify(enrollChatRequest));
			eChart.showLoading();
			app.GetEnrollChatData(enrollChatRequest, function(data) {
				eChart.hideLoading();
				console.log(JSON.stringify(data));
				if(data != []) {
					var xAxisData = [],
						paymentData = [],
						arrearsData = [],
						discountData = [];
					for(var i = 0; i < data.length; i++) {
						xAxisData.push(data[i].campus_name);
						paymentData.push(data[i].payment);
						arrearsData.push(data[i].arrears);
						discountData.push(data[i].discount);

					}
					table.appendChild(pushTableHtml(data));
					eChart.setOption({
						xAxis: {
							data: xAxisData
						},
						series: [{
								data: paymentData
							},
							{
								data: arrearsData
							},
							{
								data: discountData
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
				liHTML += '<div class="mui-col-xs-6"><p>实缴金额:' + data[i].payment + '</p></div>';
				liHTML += '<div class="mui-col-xs-6"><p>欠款金额:' + data[i].arrears + '</p></div>';
				liHTML += '<div class="mui-col-xs-6"><p>优惠金额:' + data[i].discount + '</p></div>';
				liHTML += '</div>';
				div.innerHTML = liHTML;
				fragment.appendChild(div);
			}
			return fragment;
		}

		rightBar.addEventListener('tap', function() {
			loadData();
		}, false);

	});
})(mui, document)