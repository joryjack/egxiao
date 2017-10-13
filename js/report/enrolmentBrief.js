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
		var studentCount = doc.getElementById("studentCount");
		var invalidStudent = doc.getElementById("invalidStudent");
		var customerNum = doc.getElementById("customerNum");
		var recordNum = doc.getElementById("recordNum");
		var recordStuNum = doc.getElementById("recordStuNum");
		var continueNum = doc.getElementById("continueNum");

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

		var enrolmentBriefRequest = {
			org_id: account.org_id,
			account_id: account.id
		};

		app.GetEnrolmentBrief(enrolmentBriefRequest, function(data) {
			if(data != []) {
				studentCount.innerHTML = data.studentCount;
				invalidStudent.innerHTML = data.invalidStudent;
				customerNum.innerHTML = data.customerNum;
				recordNum.innerHTML = data.recordNum;
				recordStuNum.innerHTML = data.recordStuNum;
				continueNum.innerHTML = data.continueNum;
			}
		});

		rightBar.addEventListener('tap', function() {
			app.GetEnrolmentBrief(enrolmentBriefRequest, function(data) {
				if(data != []) {
					studentCount.innerHTML = data.studentCount;
					invalidStudent.innerHTML = data.invalidStudent;
					customerNum.innerHTML = data.customerNum;
					recordNum.innerHTML = data.recordNum;
					recordStuNum.innerHTML = data.recordStuNum;
					continueNum.innerHTML = data.continueNum;
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
			var enrolmentBriefRequest = {
				org_id: account.org_id,
				account_id: account.id,
				enrolment_start: start.value,
				enrolment_end: end.value
			};
			app.GetEnrolmentBrief(enrolmentBriefRequest, function(data) {
				if(data != []) {
					studentCount.innerHTML = data.studentCount;
					invalidStudent.innerHTML = data.invalidStudent;
					customerNum.innerHTML = data.customerNum;
					recordNum.innerHTML = data.recordNum;
					recordStuNum.innerHTML = data.recordStuNum;
					continueNum.innerHTML = data.continueNum;
				}
				toggleMenu();
			});

		}, false);

	});
})(mui, document)