(function($, doc) {
	$.init({
		keyEventBind: {
			backbutton: false,
			menubutton: false
		}
	});
	var main = null;
	$.plusReady(function() {
		var selectCampusId = "";
		main = plus.webview.currentWebview().opener();
		var name = doc.getElementById("name");
		var reset = doc.getElementById("reset");
		var search = doc.getElementById("search");

		var end = doc.getElementById("end");
		var style = document.body.querySelector('.style');

		var nodata = document.body.querySelector('.state');

		var stateList = nodata.children;
		stateList.item(0).addEventListener("tap", function() {
			var stateclassList = this.classList;
			if(stateclassList.contains('label-default')) {
				stateclassList.remove('label-default');
				stateclassList.add('label-danger');
			} else {
				stateclassList.add('label-default');
				stateclassList.remove('label-danger');
			}
		});
		var dataRange = doc.getElementById("dataRange");
		var campusName = doc.getElementById("campus_name");

		var userRoledata = app.getUserRoledata();
		var userBusinessPermission = function(data) {
			var b = false;
			for(var i = 0; i < data.length; i++) {
				if(data[i] == "07ec2b419dbe4f51a14c5c9b4e4e5b0d") {
					b = true;
				}
			}
			return b;
		}

		if(userBusinessPermission(userRoledata)) {
			var dataRangeList = dataRange.classList;
			dataRangeList.remove('mui-hidden');
		} else {
			var dataRangeList = dataRange.classList;
			dataRangeList.remove('mui-hidden');
			dataRangeList.add('mui-hidden');
		}

		//选择数据范围
		campusName.addEventListener('tap', function() {
			var selectCampusMainPage = $.preload({
				"id": 'select_campus_main.html',
				"url": 'select_campus_main.html',
				"styles": {
							"zindex": 9998
						}
			});
			var selectCampusInfo = {
				"selectCampusId": selectCampusId,
				"action": "enroll",
			}
			localStorage.setItem('$filterselectCampusInfo', JSON.stringify(selectCampusInfo));
			var selectCampusListwebview = plus.webview.getWebviewById('select_campus_list.html');
			$.fire(selectCampusListwebview, 'getParameter', {
				id: selectCampusId
			});
			$.fire(selectCampusMainPage, 'getParameter', {});
			selectCampusMainPage.show("zoom-fade-out");
		});

		window.addEventListener('selectCampusParameter', function(options) {
			if(options.detail.id) {
				selectCampusId = options.detail.id;
				campusName.value = options.detail.name;
			}
		});

		stateList.item(1).addEventListener("tap", function() {
			var stateclassList = this.classList;
			if(stateclassList.contains('label-default')) {
				stateclassList.remove('label-default');
				stateclassList.add('label-warning');
			} else {
				stateclassList.add('label-default');
				stateclassList.remove('label-warning');
			}
		});

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
			$.each(stateList, function(index, item) {
				var stateclassList = item.classList;
				stateclassList.remove('label-success', 'label-warning', 'label-danger');
				stateclassList.add('label-default');
			});
			name.value = "";
			start.value = "";
			end.value = "";
			create_name.value = "";
			lesson_name.value = "";
			campusName.value ="所有校区"
			selectCampusId ="";
		});

		search.addEventListener("tap", function() {
			var state = [];
			$.each(stateList, function(index, item) {
				var stateclassList = item.classList;
				var statedataset = item.dataset;
				if(!stateclassList.contains('label-default')) {
					state.push(statedataset.code);
				}
			});

			var searchpar = {
				student_name: name.value,
				enroll_start: start.value,
				enroll_end: end.value,
				state: state,
				create_name: create_name.value,
				campus_id: selectCampusId,
				lesson_name: lesson_name.value
			};

			console.log(JSON.stringify(searchpar));
			var enrollListwebview = plus.webview.getWebviewById('pay_list.html');
			$.fire(enrollListwebview, 'search', searchpar);
			closeMenu();
		}, false)

		function closeMenu() {
			mui.fire(main, "menu:swiperight");
		}
		window.addEventListener("swiperight", closeMenu);
	});

})(mui, document)