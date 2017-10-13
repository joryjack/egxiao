(function($, doc) {
	$.init();
	$.plusReady(function() {
		var account = app.getAccount();
		var table = document.body.querySelector('.mui-content');
		var rightBar = doc.getElementById("rightBar");

		var self = plus.webview.currentWebview();
		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			var recordtodowebview = plus.webview.getWebviewById('/report/recordtodo.html');
			$.fire(recordtodowebview, 'reload', {});

			localStorage.removeItem("$recrodtodoType")
			self.close();
		}, false);
		var $recrodtodoType = localStorage.getItem("$recrodtodoType");
		var title = document.querySelector('.mui-title');
        
        var phoneUL = doc.body.querySelector('#showPhonePopover .mui-table-view');

		if(JSON.stringify($recrodtodoType) != "{}") {
			switch($recrodtodoType) {
				case "today":
					title.innerHTML = "今日待跟进";
					break;
				case "threeDay":
					title.innerHTML = "3日内待跟进";
					break;
				case "sevenDay":
					title.innerHTML = "7日内待跟进";
					break;
				case "month":
					title.innerHTML = "本月待跟进";
					break;
			}
		} else {
			title.innerHTML = "本月待跟进";
		}
		var recordPlanRequest = {
			org_id: account.org_id,
			account_id: account.id,
			time_bucket: $recrodtodoType
		};

		window.addEventListener("reload", function(e) {
			app.GetRecordPlanList(recordPlanRequest, function(data) {
				pushViewElement(data);
			});
		});
		app.GetRecordPlanList(recordPlanRequest, function(data) {
			pushViewElement(data);
		});
		rightBar.addEventListener('tap', function() {
			app.GetRecordPlanList(recordPlanRequest, function(data) {
				pushViewElement(data);
			});
		}, false);

		function getNextTime(nexttime, record_id) {
			var nexttimeHTML = "";
			if(nexttime != null && nexttime != "") {
				nexttimeHTML = '<p class="mui-card-correlation time" data-id="' + record_id + '"><i class="mui-icon  iconfont icon-time"></i><span>到期：</span><span>' + app.ConvertJsonTime(nexttime) + '</span</p> ';
			} else {
				nexttimeHTML = '<p class="mui-card-correlation"><i class="mui-icon  iconfont icon-time"></i><span>下次跟进：</span><span>无计划</span</p> ';
			}
			return nexttimeHTML;
		}

		function pushViewElement(data) {
			table.innerHTML = "";
			if(data.length > 0) {
				for(var i = 0; i < data.length; i++) {
					var div = document.createElement('div');
					div.className = 'mui-card';
					div.innerHTML = '<div class="mui-card-header  mui-card-media"> <img src="../images/50x50s.png" style="border-radius: 50%; " /><h6 class="mui-h6 mui-pull-right">' + app.talkStyleHTML(data[i].record.style) + '</h6><div class="mui-media-body"><span>' + data[i].name + '</span><p>' + app.ConvertJsonTime(data[i].record.create_time) + '</p></div></div>   <div class="mui-card-content"><div class="mui-card-content-inner"><div>' + data[i].record.r_content + '</div>     ' + getNextTime(data[i].record.next_time, data[i].record.id) + ' </div></div>    <div class="mui-card-footer"><a class="mui-h6 remove"  data-id="' + data[i].record.id + '" ><i class=" mui-icon mui-icon-trash " style=" font-size: 1.5em;"></i>作废</a><a class="mui-h6 call" data-phone="' + data[i].phone + '" data-phone2="' + (data[i].phone2 != null ? data[i].phone2 : "") + '" data-studentphone="' + (data[i].student_phone != null ? data[i].student_phone : "") + '"  ><i class=" mui-icon  iconfont icon-phone fontcolor-success" style=" font-size: 1.4em; padding-top: 5px; padding-right: 5px;"></i>联系</a><a class="mui-h6 save"><div class="mui-hidden">' + JSON.stringify(data[i]) + '</div><i class=" mui-icon  iconfont icon-wancheng fontcolor-success" style=" font-size: 1.4em; padding-top: 5px; padding-right: 5px;"></i>处理</a></div>';
					table.appendChild(div);
				}
			} else {
				table.innerHTML = '<div class="nodata" style="background-color: #fff; "><a href="#">!<h5 class="mui-h5" class="animated" style="padding-top: 15px;">啥子都没得</h5></a></div>';
			}
		}
		//延期
		$(".mui-content").on('tap', '.time', function() {
			var $this = this;
			var optionsJson = $this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var picker = new $.DtPicker(options);
			picker.show(function(rs) {
				$this.childNodes.item(2).innerHTML = rs.text;
				if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
					plus.nativeUI.toast('网络不给力，请检查网络设置');
					return;
				}
				picker.dispose();
				var recordRequest = {
					org_id: account.org_id,
					record_id: $this.dataset.id,
					next_time: $this.childNodes.item(2).innerHTML + ":00"
				}

				if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
					plus.nativeUI.toast('网络不给力，请检查网络设置');
					return;
				}
				app.modifyRecordPlan(recordRequest, function(data) {
					if(data.success) {
						$.toast("已延期");
					} else {
						$.toast(data.msg);
					}
				});

			});
		});

		//作废
		$(".mui-content").on('tap', '.remove', function() {
			var $this = this;
			var recordRequest = {
				org_id: account.org_id,
				record_id: $this.dataset.id
			}

			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			var waiting = plus.nativeUI.showWaiting();
			app.modifyRecordPlan(recordRequest, function(data) {
				waiting.close();
				if(data.success) {
					$.toast("已作废");
					var muiCardElement = $this.parentElement.parentElement;
					muiCardElement.parentElement.removeChild(muiCardElement);
				} else {
					$.toast(data.msg);
				}
			});

		});
		//处理
		$(".mui-content").on('tap', '.save', function() {
			var contentdata = this.childNodes[0].innerHTML;
			var modifyStudentPage = $.preload({
				"id": 'modify_recordplan.html',
				"url": 'modify_recordplan.html'
			});

			localStorage.setItem('$recordplan', contentdata);
			modifyStudentPage.show("pop-in");
		});

		//呼叫
		$(".mui-content").on('tap', '.call', function() {
			var teldataset = this.dataset;

			if(teldataset.phone2 == "" && teldataset.studentphone == "") {
				if(mui.os.plus) {
					plus.device.dial(teldataset.phone);
				} else {
					location.href = teldataset.phone;
				}
			} else {
				var phonehtmlStr = "";
				phonehtmlStr += '<li class="mui-table-view-cell"><a  data-phone="' + teldataset.phone + '" >' + teldataset.phone + '<span class="mui-pull-right">家长</span></a></li>';
				if(teldataset.phone2 != "") {
					phonehtmlStr += '<li class="mui-table-view-cell"><a  data-phone="' + teldataset.phone2 + '" >' + teldataset.phone2 + '<span class="mui-pull-right">家长</span></a></li>';
				}
				if(teldataset.studentphone != "") {
					phonehtmlStr += '<li class="mui-table-view-cell"><a  data-phone="' + teldataset.studentphone + '" >' + teldataset.studentphone + '<span class="mui-pull-right">学员</span></a></li>';
				}
				phoneUL.innerHTML = phonehtmlStr;
				$("#showPhonePopover").popover("toggle");
			}

		});
		
		$("#showPhonePopover .mui-table-view").on('tap', 'a', function() {
			var phone = this.dataset.phone;
			$("#showPhonePopover").popover("toggle");
			if(mui.os.plus) {
				plus.device.dial(phone);
			} else {
				location.href = phone;
			}
		});
		
	});
})(mui, document)