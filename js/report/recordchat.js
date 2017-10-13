(function($, doc) {
	$.init();
	$.plusReady(function() {
		
			mui('.mui-scroll-wrapper').scroll();
			
		var account = app.getAccount();
		var recordChart = doc.getElementById("recordChart");

		var rightBar = doc.getElementById("rightBar");

		var menuWrapper = doc.getElementById("menu-wrapper");
		var menu = doc.getElementById("menu");
		var menuWrapperClassList = menuWrapper.classList;
		var backdrop = doc.getElementById("menu-backdrop");

		var chartType = doc.getElementById("chartType");
		var dataScope = doc.getElementById("dataScope");

		var charttable = doc.getElementById("charttable");
		var chartPie = doc.getElementById("chartPie");

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
				"id": 'datascope/recordchat_datascope.html',
				"url": 'datascope/recordchat_datascope.html'
			});
			studentchat_datascopePage.addEventListener('loaded', function() {
				$.fire(studentchat_datascopePage, 'getParameter', {});
			});
			studentchat_datascopePage.show("pop-in");
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

		var option = {

			tooltip: {
				trigger: 'item',
				formatter: "{b} : {c} ({d}%)"
			},
			legend: {
				x: 'center',
				y: 'bottom',
				data: ['']
			},

			calculable: true,
			series: [{
				name: '半径模式',
				type: 'pie',
				radius: ['25%', '58%'],
				center: ['50%', '40%'],
				roseType: 'radius',
				color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3", "#e5cf0d", "#97b552", "#95706d", "#dc69aa", "#07a2a4", "#9a7fd1", "#588dd5", "#f5994e", "#c05050", "#59678c", "#c9ab00", "#7eb00a", "#6f5553", "#c14089"],
				data: [{
					value: 0,
					name: ''
				}]
			}]
		};

        //报表类型切换
		/**
		 * 切换Table
		 */
		charttable.addEventListener("tap", function() {
			charttable.innerHTML = '<em class="chartType-active  mui-icon  iconfont icon-check" style=" font-size: 1.1em; padding-right: 2px;"></em>统计表';
			chartPie.innerHTML = '<em class="chartType  mui-icon  iconfont icon-check" style=" font-size: 1.1em; padding-right: 2px;"></em>南丁格尔玫瑰图';
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
		chartPie.addEventListener("tap", function() {
			chartPie.innerHTML = '<em class="chartType-active  mui-icon  iconfont icon-check" style=" font-size: 1.1em; padding-right: 2px;"></em>南丁格尔玫瑰图 ';
			charttable.innerHTML = '<em class="chartType  mui-icon  iconfont icon-check" style=" font-size: 1.1em; padding-right: 2px;"></em>统计表';

			var chartTypeClassList = chartType.classList;
			chartTypeClassList.remove('mui-active');

			var tableClassList = table.classList;
			tableClassList.add('mui-hidden');
			var chartClassList = chart.classList;
			chartClassList.remove('mui-hidden');

			toggleMenu();

		}, false);


		var eChart = echarts.init(recordChart);
		eChart.setOption(option);
		var record_start, record_end;
		
		//查询
		window.addEventListener("search", function(e) {
			var dataScopeClassList = dataScope.classList;
			dataScopeClassList.remove('mui-active');
			record_start = e.detail.record_start;
			record_end = e.detail.record_end;

			loadData();
		});
		loadData()

		function loadData() {
			var recordChartRequest = {
				org_id: account.org_id,
				account_id: account.id,
				record_start: record_start,
				record_end: record_end
			};

			eChart.showLoading();
			app.GetRecordsChatData(recordChartRequest, function(data) {
				eChart.hideLoading();
				console.log(JSON.stringify(data));
				if(data != []) {
					var legendData = [],
						seriesData = [];

					for(var i = 0; i < data.length; i++) {
						legendData.push(data[i].campus_name);
						var dicModel = {
							value: 0,
							name: ""
						};
						dicModel.name = data[i].campus_name;
						dicModel.value = data[i].count;
						seriesData.push(dicModel);

					}
					table.appendChild(pushTableHtml(data));

					eChart.setOption({
						legend: {
							data: legendData
						},
						series: [{
							data: seriesData
						}]
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
				liHTML += '<p><span>' + data[i].campus_name + '</span><span class=" mui-pull-right">' + data[i].count + '/次</span></p>';

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