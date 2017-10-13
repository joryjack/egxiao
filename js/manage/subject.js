(function($, doc) {
	$.init();
	$.plusReady(function() {
		var rightBar = doc.getElementById("rightBar");
		var org_id = "";
		var account = app.getAccount();
		var nodata = document.body.querySelector('.nodata');
		rightBar.addEventListener('tap', function(event) {
			var modifySubjectPage = $.preload({
				"id": 'modify-subject.html',
				"url": 'modify-subject.html'
			});
			localStorage.removeItem('$modifySubject');
			modifySubjectPage.show("pop-in");
		});
		if(account) {
			window.addEventListener("reload", function(e) {
				org_id = account.org_id;
				if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
					plus.nativeUI.toast('网络不给力，请检查网络设置');
					return;
				}
				app.getSubjectList(org_id, function(data) {
					addViewElement(data);
				});
			});
			org_id = account.org_id;
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			app.getSubjectList(org_id, function(data) {
				addViewElement(data);
			});
			regidterEvent();
		} else {
			nodata.style.display = "block";
		}

		function regidterEvent() {
			$(".mui-table-view").on('tap', '.mui-pull-left', function() {
				//获取id
				var id = this.getAttribute("data-id");
				var name = this.getAttribute("data-name");
				var modifySubjectPage = $.preload({
					"id": 'modify-subject.html',
					"url": 'modify-subject.html'
				});
				
				var contentdata = {
						id: id,
						name: name
					}
				localStorage.setItem('$modifySubject', JSON.stringify(contentdata));

				modifySubjectPage.show("pop-in");
			});
			$(".mui-table-view").on('tap', '.mui-pull-right', function() {
				if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
					plus.nativeUI.toast('网络不给力，请检查网络设置');
					return;
				}
				var id = this.getAttribute("data-id");
				var name = this.getAttribute("data-name");
				var enable_flag = this.getAttribute("data-enableflag");
				var i = this.childNodes.item(0);
				var span = this.childNodes.item(2);
				var a = this;
				var subject = {
					id: id,
					org_id: account.org_id,
					enable_flag: (enable_flag == "1" ? "2" : "1"),
					update_by: account.id
				};

				var waiting = plus.nativeUI.showWaiting();
				app.SaveSubject(subject, function(data) {
					waiting.close();
					if(data.success) {
						a.setAttribute("data-enableflag", subject.enable_flag);
						if(enable_flag == "1") {
							i.classList.remove("icon-show");
							i.classList.add("icon-hidden");
							span.innerText = "隐藏";
						} else {
							i.classList.remove("icon-hidden");
							i.classList.add("icon-show");
							span.innerText = "显示";
						}
					}
					$.toast(data.msg);
				});

				//				var btnArray = ['是','否' ];
				//				mui.confirm('确定隐藏'+name+'？ 隐藏后记上课将无法选定该科目。', '隐藏科目', btnArray, function(e) {
				//					if (e.index == 1) {
				//						console.log("否")
				//					} else {
				//							console.log("是")
				//					}
				//				})

			});
		}

		function addViewElement(data) {
			var table = document.body.querySelector('.mui-table-view');
			var cells = document.body.querySelectorAll('.mui-table-view-cell');
			nodata.style.display = "none";
			if(data.length == 0) {
				nodata.style.display = "block";
			}
			table.innerHTML = "";
			for(var i = 0; i < data.length; i++) {
				var li = document.createElement('li');
				li.className = 'mui-table-view-cell';
				if(data[i].enable_flag == 1) {
					li.innerHTML = '<a class="mui-pull-left mui-text-left" data-id="' + data[i].id + '"  data-name="' + data[i].name + '"   style=" width: 80%;"><i class="mui-icon mui-icon-bars  subject_icon"></i><span>' + data[i].name + '</span></a><a class=" mui-h5 mui-pull-right mui-text-right " data-id="' + data[i].id + '"  data-name="' + data[i].name + '"  data-enableflag="1"  style=" width: 20%;  color: #A9A9A9;"><i class=" mui-icon iconfont icon-show subject-state" ></i> <span>显示</span></a>';
				} else {
					li.innerHTML = '<a class="mui-pull-left mui-text-left" data-id="' + data[i].id + '"  data-name="' + data[i].name + '"   style=" width: 80%;"><i class="mui-icon mui-icon-bars  subject_icon"></i><span>' + data[i].name + '</span></a><a class=" mui-h5 mui-pull-right mui-text-right " data-id="' + data[i].id + '"  data-name="' + data[i].name + '"  data-enableflag="2" style=" width: 20%;  color: #A9A9A9;"><i class=" mui-icon iconfont icon-hidden subject-state" ></i> <span>隐藏</span></a>';
				}
				table.appendChild(li);
			}
		}
	});
})(mui, document)