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
		var student_name = doc.getElementById("student_name");
		var teacher_name = doc.getElementById("teacher_name");
		var reset = doc.getElementById("reset");
		var search = doc.getElementById("search");
		var start = doc.getElementById("start");
		var end = doc.getElementById("end");

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
				"states": {
					"zindex": 9998
				}
			});
			var selectCampusInfo = {
				"selectCampusId": selectCampusId,
				"action": "notelesson"
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

		//上课状态
		var state = document.body.querySelector('.state');

		var stateList = state.children;
		stateList.item(0).addEventListener("tap", function() {
			var stateclassList = this.classList;
			if(stateclassList.contains('label-default')) {
				stateclassList.remove('label-default');
				stateclassList.add('label-success');
			} else {
				stateclassList.add('label-default');
				stateclassList.remove('label-success');
			}
		});

		stateList.item(1).addEventListener("tap", function() {
			var stateclassList = this.classList;
			if(stateclassList.contains('label-default')) {
				stateclassList.remove('label-default');
				stateclassList.add('label-danger');
			} else {
				stateclassList.add('label-default');
				stateclassList.remove('label-danger');
			}
		});

		stateList.item(2).addEventListener("tap", function() {
			var stateclassList = this.classList;
			if(stateclassList.contains('label-default')) {
				stateclassList.remove('label-default');
				stateclassList.add('label-primary');
			} else {
				stateclassList.add('label-default');
				stateclassList.remove('label-primary');
			}
		});
		stateList.item(3).addEventListener("tap", function() {
			var stateclassList = this.classList;
			if(stateclassList.contains('label-default')) {
				stateclassList.remove('label-default');
				stateclassList.add('label-warning');
			} else {
				stateclassList.add('label-default');
				stateclassList.remove('label-warning');
			}
		});
		stateList.item(4).addEventListener("tap", function() {
			var stateclassList = this.classList;
			if(stateclassList.contains('label-default')) {
				stateclassList.remove('label-default');
				stateclassList.add('label-danger1');
			} else {
				stateclassList.add('label-default');
				stateclassList.remove('label-danger1');
			}
		});

		//上课方式

		var style = document.body.querySelector('.style');

		var styleList = style.children;
		styleList.item(0).addEventListener("tap", function() {
			var styleclassList = this.classList;
			if(styleclassList.contains('label-default')) {
				styleclassList.remove('label-default');
				styleclassList.add('label-success');
			} else {
				styleclassList.add('label-default');
				styleclassList.remove('label-success');
			}
		});

		styleList.item(1).addEventListener("tap", function() {
			var styleclassList = this.classList;
			if(styleclassList.contains('label-default')) {
				styleclassList.remove('label-default');
				styleclassList.add('label-danger');
			} else {
				styleclassList.add('label-default');
				styleclassList.remove('label-danger');
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
				stateclassList.remove('label-success', 'label-warning', 'label-danger', 'label-primary', 'label-danger1');
				stateclassList.add('label-default');
			});
			
			$.each(styleList, function(index, item) {
				var styleclassList = item.classList;
				styleclassList.remove('label-success', 'label-warning');
				styleclassList.add('label-default');
			});
			student_name.value = "";
			teacher_name.value = "";
			lesson_name.value = "";
			subject_name.value = "";
			start.value = "";
			end.value = "";
			campusName.value = "所有校区"
			selectCampusId = "";

		});

		search.addEventListener("tap", function() {
			var notelessonstate = [];
			var notelessonstyle =[];
			
			$.each(stateList, function(index, item) {
				var stateclassList = item.classList;
				var statedataset = item.dataset;
				if(!stateclassList.contains('label-default')) {
					notelessonstate.push(statedataset.code);
				}
			});
			$.each(styleList, function(index, item) {
				var styleclassList = item.classList;
				var styledataset = item.dataset;
				if(!styleclassList.contains('label-default')) {
					notelessonstyle.push(styledataset.code);
				}
			});
			
			
			var searchpar = {
				student_name: student_name.value,
				teacher_name: teacher_name.value,
				notelesson_start: start.value,
				notelesson_end: end.value,
				lesson_name: lesson_name.value,
				subject_name: subject_name.value,
				state: notelessonstate,
				campus_id: selectCampusId,
				style:notelessonstyle
			};
			console.log(JSON.stringify(searchpar));
			var notelessonListwebview = plus.webview.getWebviewById('notelesson_list.html');
			$.fire(notelessonListwebview, 'search', searchpar);
			closeMenu();
		}, false)

		function closeMenu() {
			mui.fire(main, "menu:swiperight");
		}
		window.addEventListener("swiperight", closeMenu);
	});

})(mui, document)