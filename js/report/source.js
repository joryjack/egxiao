(function($, doc) {
	$.init();

	$.plusReady(function() {
		var aourceChart = doc.getElementById("sourceChart");
		var list = doc.getElementById("list");
		var rightBar = doc.getElementById("rightBar");
		var account = app.getAccount();
		var menuWrapper = doc.getElementById("menu-wrapper");
		var menu = doc.getElementById("menu");
		var menuWrapperClassList = menuWrapper.classList;
		var backdrop = doc.getElementById("menu-backdrop");
		var rightFilter = doc.getElementById("rightFilter");

		var reset = doc.getElementById("reset");
		var search = doc.getElementById("search");
		var start = doc.getElementById("start");
		var end = doc.getElementById("end");
		var self = plus.webview.currentWebview();
		self.addEventListener('hide', function() {
			self.close();
		}, false);
		backdrop.addEventListener('tap', toggleMenu);
		rightFilter.addEventListener('tap', toggleMenu);
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

		var data = [{
			value: 0,
			name: '自然来电'
		}, {
			value: 0,
			name: '转介绍'
		}, {
			value: 0,
			name: '渠道合作'
		}, {
			value: 0,
			name: '活动填单'
		}, {
			value: 0,
			name: '自然来访'
		}, {
			value: 0,
			name: '其他'
		}, {
			value: 0,
			name: '微直招'
		}, {
			value: 0,
			name: '户外广告'
		}, {
			value: 0,
			name: '网络媒体'
		}, {
			value: 0,
			name: '老学员'
		}];
		option = {
			tooltip: {
				show: true,
				trigger: 'item',
				formatter: "{b}: {c} ({d}%)"
			},
			legend: {
				orient: 'horizontal',
				bottom: '0%',
				data: ['自然来电', '转介绍', '渠道合作', '活动填单', '自然来访', '其他','微直招','户外广告','网络媒体','老学员']
			},
			series: [{
				type: 'pie',
				top: 20,
				selectedMode: 'single',
				radius: ['25%', '58%'],
				center: ['50%', '40%'],
				color: ['#86D560', '#AF89D6', '#59ADF3', '#FF999A', '#FFCC67', "#53D1C5" ,"#C3C6CD","#9487F9","#FCA254","#BFCB67"],
				label: {
					normal: {
						position: 'inner',
						formatter: '{d}%',
						textStyle: {
							color: '#fff',
							fontWeight: 'bold',
							fontSize: 12
						}
					}
				},
				data: data
			}]
		};
		var eChart = echarts.init(sourceChart);
		eChart.setOption(option);
		var sourceRequest = {
			org_id: account.org_id,
			account_id: account.id
		};

		eChart.showLoading();
		app.GetstudentSourceList(sourceRequest, function(data) {
			eChart.hideLoading();
			console.log(JSON.stringify(data));
			if(data != []) {
				eChart.setOption({
					series: [{
						data: data
					}]
				});
				var liHTML = "";
				var color = ['#86D560', '#AF89D6', '#59ADF3', '#FF999A', '#FFCC67', "#53D1C5" ,"#C3C6CD","#9487F9","#FCA254","#BFCB67"];
				$.each(data, function(index, item) {
					liHTML += '<li class="mui-table-view-cell"><p> <i class="mui-icon iconfont icon-dian" style="color: ' + color[index] + '; position: absolute;"></i><span  class="sourcename">' + item.name + '</span> <span class="mui-pull-right">' + item.value + '</span> </p></li>';
				});
				list.innerHTML = liHTML;
			}
		});

		rightBar.addEventListener('tap', function() {
			eChart.showLoading();
			app.GetstudentSourceList(sourceRequest, function(data) {
				eChart.hideLoading();
				console.log(JSON.stringify(data));
				if(data != []) {
					eChart.setOption({
						series: [{
							data: data
						}]
					});
					var liHTML = "";
					var color = ['#86D560', '#AF89D6', '#59ADF3', '#FF999A', '#FFCC67', "#53D1C5","#C3C6CD"];
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
			eChart.showLoading();
			var sourceSearchRequest = {
				org_id: account.org_id,
				source_start: start.value,
				source_end: end.value,
				account_id: account.id
			};
			app.GetstudentSourceList(sourceSearchRequest, function(data) {
				eChart.hideLoading();
				console.log(JSON.stringify(data));
				if(data != []) {
					eChart.setOption({
						series: [{
							data: data
						}]
					});
					var liHTML = "";
					var color = ['#86D560', '#AF89D6', '#59ADF3', '#FF999A', '#FFCC67', "#53D1C5","#C3C6CD"];
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