(function($, doc) {
	$.init();
	$.plusReady(function() {
		var account = app.getAccount();
		var consumeChart = doc.getElementById("consumeChart");
		var list = doc.getElementById("list");
		var rightBar = doc.getElementById("rightBar");

		var menuWrapper = doc.getElementById("menu-wrapper");
		var menu = doc.getElementById("menu");
		var menuWrapperClassList = menuWrapper.classList;
		var backdrop = doc.getElementById("menu-backdrop");
		var rightFilter = doc.getElementById("rightFilter");

		var reset = doc.getElementById("reset");
		var search = doc.getElementById("search");
		var start = doc.getElementById("start");
		var end = doc.getElementById("end");

		backdrop.addEventListener('tap', toggleMenu);
		rightFilter.addEventListener('tap', toggleMenu);
		var busying = false;
		var color = ['#53D1C5', '#FFCC67', '#FF999A', '#AF89D6'];

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

		var itemStyle = {
			normal: {
				color: function(params) {
					return color[params.dataIndex];
				}
			}
		};
		var xdata = ['按课时', '消耗按课时', '按包课时', '消耗按包课时'];
		var ydata = [0, 0, 0, 0];
		option = {
			color: color,
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			title: {
				text: "说明:按课时指课时制,按包指课时包。",
				x: "4%",
				bottom: 15,
				textStyle: {
					 color: '#90979c',
					fontSize: '12'
					
				},
			},
			legend: {
				data: xdata,
				bottom: '10',
				icon: 'square',
			},
			grid: {
				top: '25',
				left: '3%',
				right: '4%',
				containLabel: true
			},
			xAxis: [{
				type: 'category',
				data: xdata,
				axisTick: {
					alignWithLabel: true
				}
			}],
			yAxis: [{
				type: 'value'
			}],
			series: [{
				type: 'bar',
				barWidth: '60%',
				itemStyle: itemStyle,
				data: ydata
			}]
		};
		var eChart = echarts.init(consumeChart);
		eChart.setOption(option);
		var consumeRequest = {
			org_id: account.org_id,
			account_id: account.id
		};
		eChart.showLoading();
		app.GetstudentConsumeList(consumeRequest, function(data) {
			eChart.hideLoading();
			console.log(JSON.stringify(data));
			if(data != []) {
				var liHTML = "";
				ydata = [];
				$.each(data, function(index, item) {
					ydata.push(item.value);
					liHTML += '<li class="mui-table-view-cell"><p> <i class="mui-icon iconfont icon-dian" style="color: ' + color[index] + '; position: absolute;"></i><span  class="sourcename">' + item.name + '</span> <span class="mui-pull-right">' + item.value + '</span> </p></li>';
				});

				list.innerHTML = liHTML;
				console.log(ydata);
				eChart.setOption({
					series: [{
						data: ydata
					}]
				});
			}
		});

		rightBar.addEventListener('tap', function() {
			eChart.showLoading();
			app.GetstudentConsumeList(consumeRequest, function(data) {
				eChart.hideLoading();
				console.log(JSON.stringify(data));
				if(data != []) {
					var liHTML = "";
					ydata = [];
					$.each(data, function(index, item) {
						ydata.push(item.value);
						liHTML += '<li class="mui-table-view-cell"><p> <i class="mui-icon iconfont icon-dian" style="color: ' + color[index] + '; position: absolute;"></i><span  class="sourcename">' + item.name + '</span> <span class="mui-pull-right">' + item.value + '</span> </p></li>';
					});

					list.innerHTML = liHTML;
					eChart.setOption({
						series: [{
							data: ydata
						}]
					});
				}
			});
		}, false);

		//开始
		start.addEventListener('tap', function() {
			var $this = this;
			var optionsJson = $this.getAttribute('data-options') || '{"type":"date"}';
			var options = JSON.parse(optionsJson);
			var picker = new $.DtPicker(options);
			picker.show(function(rs) {
				$this.value = rs.text;
				picker.dispose();
			});
		});
		//结束
		end.addEventListener('tap', function() {
			var $this = this;
			var optionsJson = $this.getAttribute('data-options') || '{"type":"date"}';
			var options = JSON.parse(optionsJson);
			var picker = new $.DtPicker(options);
			picker.show(function(rs) {
				$this.value = rs.text;
				picker.dispose();
			});
		});
		reset.addEventListener("tap", function() {
			start.value = "";
			end.value = "";
		});

		search.addEventListener("tap", function() {
			var consumeSearchRequest = {
				org_id: account.org_id,
				consume_start: start.value,
				consume_end: end.value,
				account_id: account.id
			};
			console.log(JSON.stringify(consumeSearchRequest));
			eChart.showLoading();
			app.GetstudentConsumeList(consumeSearchRequest, function(data) {
				eChart.hideLoading();
				console.log(JSON.stringify(data));

				if(data != []) {
					var liHTML = "";
					ydata = [];
					$.each(data, function(index, item) {
						ydata.push(item.value);
						liHTML += '<li class="mui-table-view-cell"><p> <i class="mui-icon iconfont icon-dian" style="color: ' + color[index] + '; position: absolute;"></i><span  class="sourcename">' + item.name + '</span> <span class="mui-pull-right">' + item.value + '</span> </p></li>';
					});

					list.innerHTML = liHTML;
					eChart.setOption({
						series: [{
							data: ydata
						}]
					});
				}
				toggleMenu();
			});
		}, false);

	});
})(mui, document)