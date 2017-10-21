(function($, doc) {
	$.init({
		swipeBack: false
	});

	$.plusReady(function() {

		var _self;
		_self = plus.webview.currentWebview();

		_self.setPullToRefresh({
			auto: true,
			support: true,
			height: '180px',
			range: '150px',
			style: 'circle',
			offset: '100px'
		}, pulldownRefresh);

		var nodata = document.body.querySelector('.nodata');
		var table = document.body.querySelector('.mui-table-view');

		_self.addEventListener('hide', function() {

			_self.close();
		}, false);

		loaddata();

		window.addEventListener('reloaddata', function(options) {
			loaddata();
		});

		/**
		 * 下拉刷新具体业务实现
		 */
		function pulldownRefresh() {
			setTimeout(function() {
				loaddata();
				_self.endPullToRefresh();
			}, 1500);
		}

		function loaddata() {

			var account = app.getAccount();
			console.log(JSON.stringify(account));
			var campusRequest = {
				org_id: account.org_id,
				account_id: account.id
			}

			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			table.innerHTML = "";
			nodata.style.display = "none";

			app.GetNearEduCampusList(campusRequest, function(data) {
				if(data.length == 0) {
					var tableClassList = table.classList;
					tableClassList.add("mui-hidden");
					nodata.style.display = "block";

				} else {
					var tableClassList = table.classList;
					tableClassList.remove("mui-hidden");
					pushData(data);
				}
			});
		}

		function pushData(data) {
			for(var i = 0; i < data.length; i++) {
				var lihtml = "";
				var liElement = document.createElement('li');
				liElement.className = 'mui-table-view-cell';
				liElement.setAttribute('data-model', '' + JSON.stringify(data[i]) + '');
				lihtml += '<a class="mui-navigate-right" >';
				lihtml += '<span style="color: #333; font-size: 16px;">' + data[i].name + '</span>';
				lihtml += '</a>';

				liElement.innerHTML = lihtml;
				table.appendChild(liElement);
			}
		}

		$('.mui-content').on('tap', 'li', function() {
			var necampusModel = this.dataset.model;
			localStorage.setItem("$necampusModel", necampusModel);
			var templatePage = $.preload({
				"id": "detail_campus.html",
				"url": "detail_campus.html"
			});
			templatePage.show("pop-in");
		});

		var add_zslesson = doc.getElementById("add_zslesson")
		add_zslesson.addEventListener('tap', function(event) {
			var weiZSInfodata = app.getWeiZSInfodata();
			if(!userBusinessPermission(weiZSInfodata.weiZSPerResponse.userRole)) {
				$.toast("你没有发布权限");
				return;
			}

			var addzslessonPage = $.preload({
				"id": 'add_necampus.html',
				"url": 'add_necampus.html'
			});
			addzslessonPage.show("pop-in");
		});
		var userBusinessPermission = function(data) {
			var b = false;
			for(var i = 0; i < data.length; i++) {
				if(data[i].role_id == "07ec2b419dbe4f51a14c5c9b4e4e5b0d") {
					b = true;
				}
			}
			return b;
		}
	});

})(mui, document)