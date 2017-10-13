(function($, doc) {
	$.init();
	$.plusReady(function() {
		var account = app.getAccount();
		var rightBar = doc.getElementById("rightBar");

		var menuWrapper = doc.getElementById("menu-wrapper");
		var menu = doc.getElementById("menu");
		var menuWrapperClassList = menuWrapper.classList;
		var backdrop = doc.getElementById("menu-backdrop");

		var reset = doc.getElementById("reset");
		var search = doc.getElementById("search");
		var start = doc.getElementById("start");
		var end = doc.getElementById("end");

		var todayNum = doc.getElementById("todayNum");
		var threeDayNum = doc.getElementById("threeDayNum");
		var sevenDayNum = doc.getElementById("sevenDayNum");
		var monthNum = doc.getElementById("monthNum");

		var recordtodoRequest = {
			org_id: account.org_id,
			account_id: account.id
		};
		
		window.addEventListener("reload", function(e) {
			app.GetRecordToDoList(recordtodoRequest, function(data) {
				if(data != []) {
					todayNum.innerHTML = data.todayNum;
					threeDayNum.innerHTML = data.threeDayNum;
					sevenDayNum.innerHTML = data.sevenDayNum;
					monthNum.innerHTML = data.monthNum;
				}
			});
		});
		app.GetRecordToDoList(recordtodoRequest, function(data) {
			if(data != []) {
				todayNum.innerHTML = data.todayNum;
				threeDayNum.innerHTML = data.threeDayNum;
				sevenDayNum.innerHTML = data.sevenDayNum;
				monthNum.innerHTML = data.monthNum;
			}
		});

		rightBar.addEventListener('tap', function() {
			app.GetRecordToDoList(recordtodoRequest, function(data) {
				if(data != []) {
					todayNum.innerHTML = data.todayNum;
					threeDayNum.innerHTML = data.threeDayNum;
					sevenDayNum.innerHTML = data.sevenDayNum;
					monthNum.innerHTML = data.monthNum;
				}
			});
		}, false);

		$(".mui-row").on('tap', '.mui-col-xs-6', function() {
			localStorage.setItem("$recrodtodoType", this.dataset.type);
			var recordtodoListPage = $.preload({
				"id": 'recordtodo_list.html',
				"url": 'recordtodo_list.html'
			});
			recordtodoListPage.show("pop-in");
		});

	});
})(mui, document)