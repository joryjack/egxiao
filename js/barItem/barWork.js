(function($, doc) {
	$.init({
		swipeBack: false
	});

	$.plusReady(function() {
		var account = app.getAccount();
		if(JSON.stringify(account) != "{}") {
			var userRequest = {
				org_id: account.org_id,
				user_id: account.id
			}
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			var waiting = plus.nativeUI.showWaiting();
			app.getUserPermission(userRequest, function(data) {
				waiting.close();
				localStorage.setItem("$UserRole", JSON.stringify(data.role));
				if(data.permission.length == 1) {
					$.toast(data.permission[0]);
					mui.openWindow({
						url: '../login.html',
						id: '../login.html',
						show: {
							aniShow: 'pop-in'
						},
						waiting: {
							autoShow: false
						}
					});
					return;
				}
				addView(data.permission);
				$('.mui-table-view').on('tap', 'a', function() {
					var a = this;
					var href = this.getAttribute('href');
					if(href == "coding" || href == "loading") {
						return;
					}

					var templatePage = $.preload({
						"id": href,
						"url": href
					});
					$.fire(templatePage, 'reload', {});
					templatePage.show("pop-in");
				});
			});
		}
		window.addEventListener('show', function() {
			var account = app.getAccount();

			var userRequest = {
				org_id: account.org_id,
				user_id: account.id
			}
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			if(JSON.stringify(account) != "{}") {
				var waiting = plus.nativeUI.showWaiting();
				app.getUserPermission(userRequest, function(data) {
					waiting.close();
					localStorage.setItem("$UserRole", JSON.stringify(data.role));
					if(data.permission.length == 1) {
						$.toast(data.permission[0]);
						mui.openWindow({
							url: '../login.html',
							id: '../login.html',
							show: {
								aniShow: 'pop-in'
							},
							waiting: {
								autoShow: false
							}
						});
						return;
					}
					console.log(JSON.stringify(data));
					addView(data.permission);
					$('.mui-table-view').on('tap', 'a', function() {
						var a = this;
						var href = this.getAttribute('href');

						if(href == "coding" || href == "loading") {
							return;
						}
						var templatePage = $.preload({
							"id": href,
							"url": href
						});
						$.fire(templatePage, 'reload', {});
						templatePage.show("pop-in");
					});
				});
			}
		}, false);

	});

	function addView(data) {
		var dicArray = [{
			'title': '日常',
			'cells': [
				//					{'id':'task', 'name':'任务','bgColor':'#23c3bb','image':'icon-renwu','href':'work/createtask-needtem.html'},
				//				{
				//					'id': 'student',
				//					'name': '学员',
				//					'bgColor': '#F15D5B',
				//					'image': 'icon-xueyuan',
				//					'href': '/work/student_main.html',
				//					'PermissionCode': '101'
				//
				//				}, 
				{
					'id': 'student',
					'name': '学员',
					'bgColor': '#F15D5B',
					'image': 'icon-xueyuan',
					'href': '/work/student_with_tab.html',
					'PermissionCode': '101'

				}, {
					'id': 'record',
					'name': '跟进',
					'bgColor': '#FBD04E',
					'image': 'icon-jilu',
					'href': '/work/record_main.html',
					'PermissionCode': '102'
				}, {
					'id': 'pay',
					'name': '报名',
					'bgColor': '#53D1C5',
					'image': 'icon-baoming',
					'href': '/work/pay_main.html',
					'PermissionCode': '103'
				}, {
					'id': 'class',
					'name': '班级',
					'bgColor': '#C3C6CD',
					'image': 'icon-banji',
					'href': '/work/class_main.html',
					'PermissionCode': '104'
				},
				//					{'id':'paike', 'name':'排课','bgColor':'#5ed486','image':'icon-paike','href':''},		
				{
					'id': 'notelesson',
					'name': '记上课',
					'bgColor': '#9487F9',
					'image': 'icon-jishangke',
					'href': '/work/notelesson_main.html',
					'PermissionCode': '105'
				},
				{
					'name': '招生呗',
					'bgColor': '#53D1C5',
					'image': 'icon-master-zhizhao',
					'href': '/work/weizs/weizs.html',
					'PermissionCode': '106'
				}
			]
		}, {
			'title': '管理',
			'cells': [{
				'id': 'personnel',
				'name': '员工',
				'bgColor': '#FCA254',
				'image': 'icon-renshi',
				'href': '/manage/personnel_main.html',
				'PermissionCode': '201'
			}, {
				'id': 'lesson',
				'name': '课程',
				'bgColor': '#24c1c6',
				'image': 'icon-xiangmu',
				'href': '/manage/lesson_main.html',
				'PermissionCode': '202'
			}, {
				'id': 'subject',
				'name': '科目',
				'bgColor': '#F5D96B',
				'image': 'icon-subject',
				'href': '/manage/subject_list.html',
				'PermissionCode': '203'
			}, {
				'id': 'org',
				'name': '校区',
				'bgColor': '#ef6678',
				'image': 'icon-org-line',
				'href': '/manage/campus_main.html',
				'PermissionCode': '204'
			}]
		}, {
			'title': '统计',
			'cells': [{
				'name': '数据看板 ',
				'bgColor': '#53D1C5',
				'image': 'icon-data',
				'href': '/report/datakanban.html',
				'PermissionCode': '305'

			}, {
				'name': '来源',
				'bgColor': '#B387F8',
				'image': 'icon-laiyuan',
				'href': '/report/source.html',
				'PermissionCode': '301'

			}, {
				'name': '招生',
				'bgColor': '#11B7F3',
				'image': 'icon-zhaosheng',
				'href': '/report/state.html',
				'PermissionCode': '302'
			}, {
				'name': '课消',
				'bgColor': '#FE698F',
				'image': 'icon-kexiao',
				'href': '/report/consume.html',
				'PermissionCode': '303'
			}, {
				'name': '财务',
				'bgColor': '#F5D96B',
				'image': 'icon-caiwu',
				'href': '/report/finance.html',
				'PermissionCode': '304'
			}]
		}];

		var content = document.getElementsByClassName('listContent')[0];
		var htmlStr = '';

		for(var i = 0; i < dicArray.length; i++) {
			var dic = dicArray[i]
			var htmlListStr = '';
			for(var j = 0; j < dic.cells.length; j++) {
				if(data.indexOf(dic.cells[j].PermissionCode) != -1) {
					if(dic.cells[j].PermissionCode == "106") {
						htmlListStr += '' +
							'<li class="mui-table-view-cell mui-media mui-col-xs-3 app actived">' +
							'<a id=' + dic.cells[j].id + ' href=' + dic.cells[j].href + '>' +
							'<span class="mui-icon iconfont ' + dic.cells[j].image + '" style="background-color: ' + dic.cells[j].bgColor + ';"></span>' +
							'<div class="mui-media-body" style="color: #605e5f;">' + dic.cells[j].name + '</div>' +
							'</a>' +
							'</li>';
					} else {
						htmlListStr += '' +
							'<li class="mui-table-view-cell mui-media mui-col-xs-3">' +
							'<a id=' + dic.cells[j].id + ' href=' + dic.cells[j].href + '>' +
							'<span class="mui-icon iconfont ' + dic.cells[j].image + '" style="background-color: ' + dic.cells[j].bgColor + ';"></span>' +
							'<div class="mui-media-body" style="color: #605e5f;">' + dic.cells[j].name + '</div>' +
							'</a>' +
							'</li>';
					}

				}

			}
			if(htmlListStr != "") {
				htmlStr += '' +
					'<p class="listContetTitle">' + dic.title + '</p>' +
					'<ul class="mui-table-view mui-grid-view mui-grid-9">' +
					htmlListStr +
					'</ul>';
			}

		}
		content.innerHTML = htmlStr;
	}
})(mui, document)