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
		var nodata = document.body.querySelector('.state');

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
				"action": "class",
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
			console.log("selectCampusParameter : " + JSON.stringify(options.detail));
			if(options.detail.id) {
				selectCampusId = options.detail.id;
				campusName.value = options.detail.name;
			}
		});

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

		stateList.item(2).addEventListener("tap", function() {
			var stateclassList = this.classList;
			if(stateclassList.contains('label-default')) {
				stateclassList.remove('label-default');
				stateclassList.add('label-success');
			} else {
				stateclassList.add('label-default');
				stateclassList.remove('label-success');
			}
		});

		reset.addEventListener("tap", function() {
			console.log("我执行了");
			$.each(stateList, function(index, item) {
				var stateclassList = item.classList;
				stateclassList.remove('label-success', 'label-warning', 'label-danger');
				stateclassList.add('label-default');
			});
			name.value = "";
			campusName.value ="所有校区";
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
				state: state,
				name: name.value,
				campus_id: selectCampusId
			};
			var classListwebview = plus.webview.getWebviewById('class_list.html');
			$.fire(classListwebview, 'search', searchpar);
			closeMenu();
		}, false)

		function closeMenu() {
			mui.fire(main, "menu:swiperight");
		}
		window.addEventListener("swiperight", closeMenu);
	});

})(mui, document)