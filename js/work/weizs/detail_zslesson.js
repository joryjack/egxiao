(function($, doc) {
	//分享操作
	var shares = {};
	$.init();

	$.plusReady(function() {

		var close_zslesson = doc.getElementById("close_zslesson");
		var open_zslesson = doc.getElementById("open_zslesson");
		//share
		plus.share.getServices(function(s) {
			if(s && s.length > 0) {
				for(var i = 0; i < s.length; i++) {
					var t = s[i];
					shares[t.id] = t;
				}
			}
		}, function() {
			console.log("获取分享服务列表失败");
		});
		//分享链接点击事件
		document.getElementById("rightBar").addEventListener('tap', function() {
			var ids = [{
					id: "weixin",
					ex: "WXSceneSession"
				}, {
					id: "weixin",
					ex: "WXSceneTimeline"
				}],
				bts = [{
					title: "发送给微信好友"
				}, {
					title: "分享到微信朋友圈"
				}];
			plus.nativeUI.actionSheet({
				cancel: "取消",
				buttons: bts
			}, function(e) {
				var i = e.index;
				if(i > 0) {
					var s_id = ids[i - 1].id;
					var share = shares[s_id];
					if(share) {
						if(share.authenticated) {
							shareMessage(share, ids[i - 1].ex);
						} else {
							share.authorize(function() {
								shareMessage(share, ids[i - 1].ex);
							}, function(e) {
								console.log("认证授权失败：" + e.code + " - " + e.message);
							});
						}
					} else {
						mui.toast("无法获取分享服务，请检查manifest.json中分享插件参数配置，并重新打包")
					}
				}
			});
		});

		function shareMessage(share, ex) {
			var zslessonModel = app.getZslessonModel();
			var weiZSInfodata = app.getWeiZSInfodata();
			var herf = 'http://www.weizhizhao.cn/?data=' + zslessonModel.sharepar;
			var title = "【微直招】" + weiZSInfodata.weiZSPerResponse.organization.shortname + "," + zslessonModel.zslesson.lesson_name + "课程,正在被" +(304+ zslessonModel.zslesson.look_num) + "人围观。"
			var msg = {
				extra: {
					scene: ex
				}
			};
			msg.href = herf;

			msg.title = title;
			msg.content = "我正在围观，还不错，分享给你，一起看吧!";

			msg.thumbs = ["_www/images/logo.png"];
			share.send(msg, function() {
				console.log("分享到\"" + share.description + "\"成功！ ");
			}, function(e) {
				console.log("分享到\"" + share.description + "\"失败: " + e.code + " - " + e.message);
			});
		}

		mui('.mui-scroll-wrapper').scroll();
		var detailLesson = document.body.querySelector('.mui-scroll');

		puahData();

		window.addEventListener('reloaddata', function(options) {
			puahData();
		});

		var self = plus.webview.currentWebview();

		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			var zslessonwebview = plus.webview.getWebviewById('zslesson.html');
			$.fire(zslessonwebview, 'reloaddata', {});
			self.close();
		}, false);

		function puahData() {
			detailLesson.innerHTML = "";
			var weiZSInfodata = app.getWeiZSInfodata();
			var zslessonModel = app.getZslessonModel();

			if(zslessonModel.zslesson.enable_flag == "1") {
				var close_zslessonclassList = close_zslesson.classList;
				var open_zslessonclassList = open_zslesson.classList;
				close_zslessonclassList.remove("mui-hidden");
				open_zslessonclassList.add("mui-hidden");
			} else {
				var close_zslessonclassList = close_zslesson.classList;
				var open_zslessonclassList = open_zslesson.classList;
				close_zslessonclassList.add("mui-hidden");
				open_zslessonclassList.remove("mui-hidden");
			}
			var influence = "";
			influence += '<ul class="mui-table-view mui-grid-view mui-grid-9" style="padding: 10px 0;">';

			influence += '<li class="mui-table-view-cell mui-media mui-col-xs-4 boder-line"><a href="footprint_main.html" style="padding:0;"><div><i class="mui-icon iconfont icon-footprint mui-text-left" style=" font-size: 18px;"></i><span class="mui-icon-small mui-text-right">' + zslessonModel.zslesson.footprint_num + '</span></div><div class="mui-media-body ">人留下脚印</div></a></li>';

			influence += '<li class="mui-table-view-cell mui-media mui-col-xs-4 boder-line"><a href="coding" style="padding:0;"><div><i class="mui-icon iconfont icon-parents mui-text-left" style=" font-size: 18px;"></i><span class="mui-icon-small mui-text-right">' + zslessonModel.zslesson.support_num + '</span></div><div class="mui-media-body">人为你代言</div></a></li>';

			influence += '<li class="mui-table-view-cell mui-media mui-col-xs-4"><a href="coding" style="padding:0;"><div><i class="mui-icon iconfont icon-show mui-text-left" style=" font-size: 18px;"></i><span class="mui-icon-small mui-text-right">' + zslessonModel.zslesson.look_num + '</span></div><div class="mui-media-body">人通过分享围观</div></a></li>';

			influence += '</ul>';

			var baseinfocontent = "";
			baseinfocontent += '<div class="baseinfo-content">';
			baseinfocontent += '<div><span class=" iconfont icon-offline"></span> <span style="color: #333;">' + zslessonModel.zslesson.lesson_name + '</span> <span class="mui-h6 fontcolor-danger fontcolor-default">[' + zslessonModel.zslesson.price + '￥/' + app.lessonTypeHTML(zslessonModel.zslesson.type) + ']</span></div>';
			baseinfocontent += '<p class="lightspot">' + zslessonModel.zslesson.lightspot + '</p>';
			baseinfocontent += '<div class="org_info"><p>' + weiZSInfodata.weiZSPerResponse.organization.shortname + '</p><p>' + app.orgTypeName(weiZSInfodata.weiZSPerResponse.organization.org_type) + ' | ' + app.orgSizeName(weiZSInfodata.weiZSPerResponse.organization.org_size) + '</p><p><span class=" fontcolor-default">上课地址</span><span style="font-size: 12px; padding-left: 5px;">' + zslessonModel.zslesson.cityanddistrict + zslessonModel.zslesson.street + zslessonModel.zslesson.streetNum + '</span></p></div>';
			baseinfocontent += '</div>';

			var lessonAbstracts = "";
			lessonAbstracts += '<div class="mui-card">';
			lessonAbstracts += '<div class="mui-card-header"><div><i class=" mui-icon iconfont icon-subject" style=" font-size: 16px;"></i> <span>课程简介</span></div></div>';
			lessonAbstracts += '<div class="mui-card-content"><div class="mui-card-content-inner">' + zslessonModel.zslesson.abstracts + '</div></div>';
			lessonAbstracts += '</div>';

			var applyStudent = "";
			applyStudent += '<div class="mui-card">';
			applyStudent += '<div class="mui-card-header"><div><i class=" mui-icon iconfont icon-xueyuan" style=" font-size: 18px;"></i> <span>适合学员</span></div></div>';
			applyStudent += '<div class="mui-card-content"><div class="mui-card-content-inner"><p>' + zslessonModel.zslesson.apply_student + '</p></div></div>';
			applyStudent += '</div>';

			detailLesson.innerHTML = influence + baseinfocontent + lessonAbstracts + applyStudent;
		}

          $('.mui-content').on('tap', 'a', function() {
			var a = this;
			var href = this.getAttribute('href');
			if(href == "coding" || href == "loading") {
				if("coding" == href) {
					$.toast("逐步开放中...");
				}
				return;
			}
			if(href == "footprint_main.html"){
				var zslessonModel = app.getZslessonModel();
				 var footprintpar ={
				 	 "zslesson_id":zslessonModel.zslesson.id };
				 localStorage.setItem("$footprintpar", JSON.stringify(footprintpar));
			}
			
			var templatePage = $.preload({
				"id": href,
				"url": href
			});
		   
			$.fire(templatePage, 'reload', {});
			templatePage.show("pop-in");
		});

		var modify_zslesson = doc.getElementById("modify_zslesson")
		modify_zslesson.addEventListener('tap', function(event) {
			var weiZSInfodata = app.getWeiZSInfodata();
			if(!userBusinessPermission(weiZSInfodata.weiZSPerResponse.userRole)) {
				$.toast("你没有编辑权限");
				return;
			}
			var modifyzslessonPage = $.preload({
				"id": 'modify_zslesson.html',
				"url": 'modify_zslesson.html'
			});
			modifyzslessonPage.show("pop-in");
		});

		close_zslesson.addEventListener('tap', function(event) {
			
			var weiZSInfodata = app.getWeiZSInfodata();
			if(!userBusinessPermission(weiZSInfodata.weiZSPerResponse.userRole)) {
				$.toast("你没有操作权限");
				return;
			}
			
			var btnArray = ['是', '否'];
			mui.confirm('确定关闭课程吗?关闭之后分享将无法查看', '关闭课程', btnArray, function(e) {
				if(e.index == 1) {
					console.log("否")
				} else {
					var account = app.getAccount();
					var zslessonModel = app.getZslessonModel();
					var zslessonRequest = {
						id: zslessonModel.zslesson.id,
						update_by: account.id,
						enable_flag: "2"
					}

					if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
						plus.nativeUI.toast('网络不给力，请检查网络设置');
						return;
					}
					var waiting = plus.nativeUI.showWaiting();
					app.ModifyZslesson(zslessonRequest, function(data) {
						waiting.close();
						if(data.success) {
							var close_zslessonclassList = close_zslesson.classList;
							var open_zslessonclassList = open_zslesson.classList;
							close_zslessonclassList.add("mui-hidden");
							open_zslessonclassList.remove("mui-hidden");
							zslessonModel.zslesson.enable_flag = "2";
							localStorage.setItem("$zslessonModel", JSON.stringify(zslessonModel));
							$.toast(data.msg);
						} else {
							$.toast(data.msg);
						}
					});
				}
			});
		});
		open_zslesson.addEventListener('tap', function(event) {
			
			var weiZSInfodata = app.getWeiZSInfodata();
			if(!userBusinessPermission(weiZSInfodata.weiZSPerResponse.userRole)) {
				$.toast("你没有操作权限");
				return;
			}
			
			var zslessonModel = app.getZslessonModel();
			switch(zslessonModel.zslesson.enable_flag) {
				case "3":
					$.toast("该课程由于违反发布规则,已被荣校官方删除");
					break;
				case "2":
				var account = app.getAccount();
					var zslessonRequest = {
						id: zslessonModel.zslesson.id,
						update_by: account.id,
						enable_flag: "1"
					}
					if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
						plus.nativeUI.toast('网络不给力，请检查网络设置');
						return;
					}
					var waiting = plus.nativeUI.showWaiting();
					app.ModifyZslesson(zslessonRequest, function(data) {
						waiting.close();
						if(data.success) {
							var close_zslessonclassList = close_zslesson.classList;
							var open_zslessonclassList = open_zslesson.classList;
							close_zslessonclassList.remove("mui-hidden");
							open_zslessonclassList.add("mui-hidden");
							zslessonModel.zslesson.enable_flag = "2";
							localStorage.setItem("$zslessonModel", JSON.stringify(zslessonModel));
							$.toast(data.msg);
						} else {
							$.toast(data.msg);
						}
					});
					break;
				case "0":
					$.toast("该课程已删除,你可以重新发布");
					break;

				default:
					break;
			}

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