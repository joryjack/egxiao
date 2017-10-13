(function($, doc) {
	$.init();
	$.plusReady(function() {
		var account = app.getAccount();
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
		var lessonTime = doc.getElementById("lessonTime");
		var patchTime = doc.getElementById("patchTime");
		var leaveTime = doc.getElementById("leaveTime");
		var auditionTime = doc.getElementById("auditionTime");
		var lessonNum = doc.getElementById("lessonNum");
		var lessonDay = doc.getElementById("lessonDay");

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

		var lessonBriefRequest = {
			org_id: account.org_id,
			account_id: account.id
		};

		app.GetLessonBrief(lessonBriefRequest, function(data) {
			if(data != []) {
				lessonTime.innerHTML = data.lessonTime;
				patchTime.innerHTML = data.patchTime;
				leaveTime.innerHTML = data.leaveTime;
				auditionTime.innerHTML = data.auditionTime;
				lessonNum.innerHTML = data.lessonNum;
				lessonDay.innerHTML = data.lessonDay;
			}
		});

		rightBar.addEventListener('tap', function() {
			app.GetLessonBrief(lessonBriefRequest, function(data) {
				if(data != []) {
					lessonTime.innerHTML = data.lessonTime;
					patchTime.innerHTML = data.patchTime;
					leaveTime.innerHTML = data.leaveTime;
					auditionTime.innerHTML = data.auditionTime;
					lessonNum.innerHTML = data.lessonNum;
					lessonDay.innerHTML = data.lessonDay;
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
			var lessonBriefRequest = {
				org_id: account.org_id,
				account_id: account.id,
				lessonbrief_start: start.value,
				lessonbrief_end: end.value
			};
			app.GetLessonBrief(lessonBriefRequest, function(data) {
				if(data != []) {
					lessonTime.innerHTML = data.lessonTime;
					patchTime.innerHTML = data.patchTime;
					leaveTime.innerHTML = data.leaveTime;
					auditionTime.innerHTML = data.auditionTime;
					lessonNum.innerHTML = data.lessonNum;
					lessonDay.innerHTML = data.lessonDay;
				}
				toggleMenu();
			});
			
		}, false);

	});
})(mui, document)