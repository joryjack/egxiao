(function($, doc) {

	$.init();

	$.plusReady(function() {

		var close_necampus = doc.getElementById("close_necampus");
		var open_necampus = doc.getElementById("open_necampus");
		var closeaudit_necampus = doc.getElementById("closeaudit_necampus");
		var openaudit_necampus = doc.getElementById("openaudit_necampus");

		mui('.mui-scroll-wrapper').scroll();
		var detailneCampus = document.body.querySelector('.mui-scroll');

		puahData();

		window.addEventListener('reloaddata', function(options) {
			puahData();
		});

		var self = plus.webview.currentWebview();

		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			var orgnearedulistwebview = plus.webview.getWebviewById('orgnearedulist.html');
			$.fire(orgnearedulistwebview, 'reloaddata', {});
			self.close();
		}, false);

		function puahData() {
			detailneCampus.innerHTML = "";
			var weiZSInfodata = app.getWeiZSInfodata();
			var necampusModel = app.getNecampusModel();
			var close_necampusclassList = close_necampus.classList;
			var open_necampusclassList = open_necampus.classList;

			var closeaudit_necampusclassList = closeaudit_necampus.classList;
			var openaudit_necampusclassList = openaudit_necampus.classList;
			console.log("enable_flag：" + necampusModel.enable_flag + "   state:" + necampusModel.state);
			if(necampusModel.enable_flag == "2" && necampusModel.state == "1") {

				open_necampusclassList.add("mui-hidden");
				close_necampusclassList.add("mui-hidden");
				closeaudit_necampusclassList.add("mui-hidden");
				openaudit_necampusclassList.remove("mui-hidden");

			} else if(necampusModel.enable_flag == "2" && necampusModel.state == "2") {

				open_necampusclassList.add("mui-hidden");
				close_necampusclassList.remove("mui-hidden");
				closeaudit_necampusclassList.add("mui-hidden");
				openaudit_necampusclassList.add("mui-hidden");
			} else if(necampusModel.enable_flag == "3" && necampusModel.state == "1") {
				open_necampusclassList.add("mui-hidden");
				close_necampusclassList.add("mui-hidden");
				closeaudit_necampusclassList.remove("mui-hidden");
				openaudit_necampusclassList.add("mui-hidden");
			} else if(necampusModel.enable_flag == "3" && necampusModel.state == "2") {
				open_necampusclassList.remove("mui-hidden");
				close_necampusclassList.add("mui-hidden");
				closeaudit_necampusclassList.add("mui-hidden");
				openaudit_necampusclassList.add("mui-hidden");
			} else {
				open_necampusclassList.remove("mui-hidden");
				close_necampusclassList.add("mui-hidden");
				closeaudit_necampusclassList.add("mui-hidden");
				openaudit_necampusclassList.add("mui-hidden");
			}

			var baseinfocontent = "";

			baseinfocontent += '<div class="baseinfo-content">';
			baseinfocontent += '<div class="title"><span class=" iconfont icon-offline "></span> <span style="color: #333;">' + necampusModel.name + '</span> </div>';
			baseinfocontent += '<p> <span class ="fontcolor-default">地址 </span><span style="font-size: 12px; padding-left: 5px;">' + necampusModel.cityanddistrict + necampusModel.street + necampusModel.streetNum + '</span></p>';
			baseinfocontent += '</div>';

			var necampusTel = "";
			necampusTel += '<div class="mui-card">';
			necampusTel += '<div class="mui-card-header"><div class="title"><i class=" mui-icon iconfont icon-kefu" style=" font-size: 18px;"></i> <span>招生电话</span></div></div>';
			necampusTel += '<div class="mui-card-content" style="padding: 0 0 10px 15px;"><p>' + necampusModel.phone + '</p></div>';
			necampusTel += '</div>';

			var subjectWord = "";
			subjectWord += '<div class="mui-card">';
			subjectWord += '<div class="mui-card-header"><div class="title"><i class=" mui-icon iconfont icon-subject" style="font-size: 16px;"></i> <span>开设课程</span></div></div>';
			subjectWord += '<div class="mui-card-content" style="padding: 0 0 10px 15px;"><p>' + necampusModel.subject_word + '</p></div>';
			subjectWord += '</div>';
		
			detailneCampus.innerHTML = baseinfocontent + necampusTel + subjectWord;
		}

		var modify_necampus = doc.getElementById("modify_necampus")
		modify_necampus.addEventListener('tap', function(event) {
			var weiZSInfodata = app.getWeiZSInfodata();
			if(!userBusinessPermission(weiZSInfodata.weiZSPerResponse.userRole)) {
				$.toast("你没有编辑权限");
				return;
			}
			var modifynecampusPage = $.preload({
				"id": 'modify_necampus.html',
				"url": 'modify_necampus.html'
			});
			modifynecampusPage.show("pop-in");
		});

		close_necampus.addEventListener('tap', function(event) {

			var weiZSInfodata = app.getWeiZSInfodata();
			if(!userBusinessPermission(weiZSInfodata.weiZSPerResponse.userRole)) {
				$.toast("你没有操作权限");
				return;
			}

			var btnArray = ['是', '否'];
			mui.confirm('确定退出附近教育吗?退出后该校区将不能在附近教育中查看到', '退出附近教育', btnArray, function(e) {
				if(e.index == 1) {
					console.log("否")
				} else {
					var account = app.getAccount();
					var necampusModel = app.getNecampusModel();

					var necampusRequest = {
						id: necampusModel.id,
						update_by: account.id,
						enable_flag: "3"
					}

					if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
						plus.nativeUI.toast('网络不给力，请检查网络设置');
						return;
					}
					var waiting = plus.nativeUI.showWaiting();
					app.ModifyNECampus(necampusRequest, function(data) {
						waiting.close();
						if(data.success) {
							var close_necampusclassList = close_necampus.classList;
							var open_necampusclassList = open_necampus.classList;

							var closeaudit_necampusclassList = closeaudit_necampus.classList;
							var openaudit_necampusclassList = openaudit_necampus.classList;

							open_necampusclassList.add("mui-hidden");
							close_necampusclassList.add("mui-hidden");
							openaudit_necampusclassList.add("mui-hidden");
							closeaudit_necampusclassList.remove("mui-hidden");

							necampusModel.enable_flag = "3";
							necampusModel.state = "1";
							localStorage.setItem("$necampusModel", JSON.stringify(necampusModel));
							$.toast(data.msg);
						} else {
							$.toast(data.msg);
						}
					});
				}
			});
		});
		open_necampus.addEventListener('tap', function(event) {

			var weiZSInfodata = app.getWeiZSInfodata();
			if(!userBusinessPermission(weiZSInfodata.weiZSPerResponse.userRole)) {
				$.toast("你没有操作权限");
				return;
			}

			var necampusModel = app.getNecampusModel();
			switch(necampusModel.enable_flag) {
				case "4":
					$.toast("该入驻校区由于违反发布规则,已被荣校官方下架");
					break;
				case "3":
					var account = app.getAccount();
					var zslessonRequest = {
						id: necampusModel.id,
						update_by: account.id,
						enable_flag: "2"
					}
					if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
						plus.nativeUI.toast('网络不给力，请检查网络设置');
						return;
					}
					var waiting = plus.nativeUI.showWaiting();
					app.ModifyNECampus(zslessonRequest, function(data) {
						waiting.close();
						if(data.success) {
							var close_necampusclassList = close_necampus.classList;
							var open_necampusclassList = open_necampus.classList;

							var closeaudit_necampusclassList = closeaudit_necampus.classList;
							var openaudit_necampusclassList = openaudit_necampus.classList;

							open_necampusclassList.add("mui-hidden");
							close_necampusclassList.add("mui-hidden");
							closeaudit_necampusclassList.add("mui-hidden");
							openaudit_necampusclassList.remove("mui-hidden");

							necampusModel.enable_flag = "2";
							necampusModel.state = "1";
							localStorage.setItem("$necampusModel", JSON.stringify(necampusModel));
							$.toast(data.msg);
						} else {
							$.toast(data.msg);
						}
					});
					break;
				case "0":
					$.toast("该校区退出附近教育");
					break;

				default:
					break;
			}

		});

		closeaudit_necampus.addEventListener('tap', function() {
			mui.alert('我们已受理你的申请,请耐心等待2-3个工作日。如有问题请致电：023-81214646', '温馨提示', function() {});
		});
		openaudit_necampus.addEventListener('tap', function() {
			mui.alert('我们已受理你的申请,请耐心等待2-3个工作日。如有问题请致电：023-81214646', '温馨提示', function() {});
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