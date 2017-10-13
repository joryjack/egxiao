(function($, doc) {
	$.init();
	$.plusReady(function() {
		var account = app.getAccount();
		var stateChart = doc.getElementById("stateChart");
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

		var data = [{
			value: 0,
			name: '线索'
		}, {
			value: 0,
			name: '跟进'
		}, {
			value: 0,
			name: '报名'
		}, {
			value: 0,
			name: '续报'
		}];

		option = {
			tooltip: {
				trigger: 'item',
				formatter: "{b} : {c}个"
			},
			legend: {
				orient: 'horizontal',
				bottom: '0%',
				data: ['线索', '跟进', '报名', '续报']
			},
			series: [{
				type: 'funnel',
				left: '10%',
				top: 20,
				color: color,
				width: '80%',
				minSize: '0%',
				maxSize: '100%',
				sort: 'descending',
				gap: 1,
				label: {
					normal: {
						show: true,
						position: 'inside'
					},
					emphasis: {
						textStyle: {
							fontSize: 20
						}
					}
				},
				labelLine: {
					normal: {
						length: 10,
						lineStyle: {
							width: 1,
							type: 'solid'
						}
					}
				},
				itemStyle: {
					normal: {
						borderColor: '#fff',
						borderWidth: 1
					}
				},
				data: data
			}]
		};

		var eChart = echarts.init(stateChart);
		eChart.setOption(option);
		var stateRequest = {
			org_id: account.org_id,
			account_id: account.id
		};

		eChart.showLoading();
		app.GetstudentStateList(stateRequest, function(data) {
			eChart.hideLoading();
			console.log(JSON.stringify(data));
			if(data != []) {
				eChart.setOption({
					series: [{
						data: data
					}]
				});
				var liHTML = "";

				$.each(data, function(index, item) {
					liHTML += '<li class="mui-table-view-cell"><p> <i class="mui-icon iconfont icon-dian" style="color: ' + color[index] + '; position: absolute;"></i><span  class="sourcename">' + item.name + '</span> <span class="mui-pull-right">' + item.value + '</span> </p></li>';
				});
				list.innerHTML = liHTML;
			}
		});

		rightBar.addEventListener('tap', function() {
			eChart.showLoading();
			app.GetstudentStateList(stateRequest, function(data) {
				eChart.hideLoading();
				console.log(JSON.stringify(data));
				if(data != []) {
					eChart.setOption({
						series: [{
							data: data
						}]
					});
					var liHTML = "";

					$.each(data, function(index, item) {
						liHTML += '<li class="mui-table-view-cell"><p> <i class="mui-icon iconfont icon-dian" style="color: ' + color[index] + '; position: absolute;"></i><span  class="sourcename">' + item.name + '</span> <span class="mui-pull-right">' + item.value + '</span> </p></li>';
					});
					list.innerHTML = liHTML;
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
			var stateSearchRequest = {
				org_id: account.org_id,
				state_start: start.value,
				state_end: end.value,
				account_id: account.id
			};
			console.log(JSON.stringify(stateSearchRequest));
			eChart.showLoading();
				
			app.GetstudentStateList(stateSearchRequest, function(data) {
				eChart.hideLoading();
				console.log(JSON.stringify(data));
				if(data != []) {
					eChart.setOption({
						series: [{
							data: data
						}]
					});
					var liHTML = "";
					$.each(data, function(index, item) {
						liHTML += '<li class="mui-table-view-cell"><p> <i class="mui-icon iconfont icon-dian" style="color: ' + color[index] + '; position: absolute;"></i><span  class="sourcename">' + item.name + '</span> <span class="mui-pull-right">' + item.value + '</span> </p></li>';
					});
					list.innerHTML = liHTML;
				}
				toggleMenu();
			});
		}, false);

	});
})(mui, document)