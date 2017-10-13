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
		var start = doc.getElementById("start");
		var end = doc.getElementById("end");
		var style = document.body.querySelector('.style');
		
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
				"action": "record",
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

		var styleList = style.children;
		styleList.item(0).addEventListener("tap", function() {
			var styleclassList = this.classList;
			if(styleclassList.contains('label-default')) {
				styleclassList.remove('label-default');
				styleclassList.add('label-danger');
			} else {
				styleclassList.add('label-default');
				styleclassList.remove('label-danger');
			}
		});

		styleList.item(1).addEventListener("tap", function() {
			var styleclassList = this.classList;
			if(styleclassList.contains('label-default')) {
				styleclassList.remove('label-default');
				styleclassList.add('label-warning');
			} else {
				styleclassList.add('label-default');
				styleclassList.remove('label-warning');
			}
		});

		styleList.item(2).addEventListener("tap", function() {
			var styleclassList = this.classList;
			if(styleclassList.contains('label-default')) {
				styleclassList.remove('label-default');
				styleclassList.add('label-success');
			} else {
				styleclassList.add('label-default');
				styleclassList.remove('label-success');
			}
		});
		styleList.item(3).addEventListener("tap", function() {
			var styleclassList = this.classList;
			if(styleclassList.contains('label-default')) {
				styleclassList.remove('label-default');
				styleclassList.add('label-primary');
			} else {
				styleclassList.add('label-default');
				styleclassList.remove('label-primary');
			}
		});
		styleList.item(4).addEventListener("tap", function() {
			var styleclassList = this.classList;
			if(styleclassList.contains('label-default')) {
				styleclassList.remove('label-default');
				styleclassList.add('label-danger1');
			} else {
				styleclassList.add('label-default');
				styleclassList.remove('label-danger1');
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
			console.log("我执行了");
			$.each(styleList, function(index, item) {
				var styleclassList = item.classList;
				styleclassList.remove('label-success', 'label-warning', 'label-danger', 'label-primary', 'label-danger1');
				styleclassList.add('label-default');
			});
			name.value = "";
			start.value = "";
			end.value = "";
			create_name.value = "";
			campusName.value ="所有校区"
			selectCampusId ="";
		});

		search.addEventListener("tap", function() {
			var recordstyle = [];
			$.each(styleList, function(index, item) {
				var styleclassList = item.classList;
				var styledataset = item.dataset;
				if(!styleclassList.contains('label-default')) {
					recordstyle.push(styledataset.code);
				}
			});
			var searchpar = {
				record_style: recordstyle,
				student_name: name.value,
				record_start: start.value,
				record_end: end.value,
				create_name: create_name.value,
				campus_id: selectCampusId
			};
			var recordListwebview = plus.webview.getWebviewById('record_list.html');
			$.fire(recordListwebview, 'search', searchpar);
			closeMenu();
		}, false)

		function closeMenu() {
			mui.fire(main, "menu:swiperight");
		}
		window.addEventListener("swiperight", closeMenu);
	});

})(mui, document)