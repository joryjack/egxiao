(function($, doc) {
	$.init();

	$.plusReady(function() {
		var self = plus.webview.currentWebview();
		var mui_card = doc.querySelectorAll(".mui-card");
		var rightBar = doc.getElementById("rightBar");
		var studentPhone = "";

		var table = document.body.querySelector('.mui-table-view');

		self.addEventListener('hide', function() {
			var data = {
				"lesson_name": "",
				"payment": "",
				"arrears": "",
				"stu_name": ""
			};
			pushEnrollHTML(data);
			table.innerHTML = '<li class="mui-table-view-cell"><p></p></li>';
			var payListwebview = plus.webview.getWebviewById('pay_list.html');
			$.fire(payListwebview, 'reload', {});
			self.close();
		}, false);

		var account = app.getAccount();
		var enroll = app.getEnroll();
		console.log("2312");
		pushEnrollHTML(enroll);

		window.addEventListener('reloadEnroll', function(options) {
			enroll = app.getEnroll();
			pushEnrollHTML(enroll);
			var cashFlowRequest = {
				org_id: account.org_id,
				item_id: enroll.id
			}
		
			if(account) {
				app.GetCashFlowListbyItemid(cashFlowRequest, function(data) {
					pushCashFlowHTML(data);
				});
			}
		});
var cashFlowRequest = {
				org_id: account.org_id,
				item_id: enroll.id
			}
			if(account) {
				app.GetCashFlowListbyItemid(cashFlowRequest, function(data) {
					pushCashFlowHTML(data);
				});
			}
		window.addEventListener('getParameter', function(options) {
			var cashFlowRequest = {
				org_id: account.org_id,
				item_id: enroll.id
			}
			if(account) {
				app.GetCashFlowListbyItemid(cashFlowRequest, function(data) {
					pushCashFlowHTML(data);
				});
			}
		});

		function pushEnrollHTML(enroll) {
			var recordElement = mui_card[0].childNodes;

			var enrollcontentElement = recordElement.item(3).childNodes;

			var enrollcontentinnerElement = enrollcontentElement.item(1).childNodes;
			var p1Element = enrollcontentinnerElement.item(1).childNodes;
			p1Element.item(1).innerHTML = enroll.lesson_name;

			var p2Element = enrollcontentinnerElement.item(3).childNodes;
			p2Element.item(1).innerHTML = enroll.payment;

			var p3Element = enrollcontentinnerElement.item(5).childNodes;
			p3Element.item(1).innerHTML = enroll.arrears;

			var p4Element = enrollcontentinnerElement.item(7).childNodes;
			p4Element.item(2).innerHTML = enroll.stu_name;

		}

		function pushCashFlowHTML(data) {
			console.log(JSON.stringify(data));
			var liHTML = "";

			for(var i = 0; i < data.length; i++) {
				//<li class="mui-table-view-cell"><p><span class="span-left">张三</span> <span style="padding-left: 10px; margin-left: 10px; border-left:1px solid #f5f5f5 ;">2015-08-07 05:26</span> </p></li>  
				if(i < data.length - 1) {
					liHTML += '<li class="mui-table-view-cell"><p><span class="span-left">' + data[i].create_name + '</span> <span style="padding-left: 10px; margin-left: 10px; border-left:1px solid #f5f5f5 ;">' + app.ConvertJsonTime(data[i].create_time) + '</span><a class="mui-icon mui-icon-closeempty  mui-pull-right remove" data-id="' + data[i].id + '" data-itemid="' + data[i].item_id + '" data-moeny="'+data[i].moeny+'"></a></p><p>缴纳学费:' + data[i].moeny + '元</p></li>';
				} else {
					liHTML += '<li class="mui-table-view-cell"><p><span class="span-left">' + data[i].create_name + '</span> <span style="padding-left: 10px; margin-left: 10px; border-left:1px solid #f5f5f5 ;">' + app.ConvertJsonTime(data[i].create_time) + '</span></p><p>缴纳学费:' + data[i].moeny + '元</p></li>';
				}
			}
			table.innerHTML = liHTML == "" ? '<li class="mui-table-view-cell"><p></p></li>' : liHTML;
		}
		$(".mui-table-view").on('tap', '.remove', function() {
			var $this = this;
			var btnArray = ['是', '否'];
			mui.confirm('确定删除该条缴费记录?删除后将不可能恢复。', '删除缴费记录', btnArray, function(e) {
				if(e.index == 1) {
					console.log("否")
				} else {
					var cashFlowMoney =  parseFloat($this.dataset.moeny);
					var cashFlowRequest = {
						id: $this.dataset.id,
						item_id: $this.dataset.itemid,
						moeny: cashFlowMoney
					}
					console.log(JSON.stringify(cashFlowRequest));
					if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
						plus.nativeUI.toast('网络不给力，请检查网络设置');
						return;
					}
					var waiting = plus.nativeUI.showWaiting();
					app.SaveEnrollCashFlow(cashFlowRequest, function(data) {
						waiting.close();
						if(data.success) {
							enroll.arrears = enroll.arrears + cashFlowMoney;
							enroll.payment = enroll.payment -cashFlowMoney;
							pushEnrollHTML(enroll);
							localStorage.setItem('$enroll', JSON.stringify(enroll));
							
							var muiULElement = $this.parentElement.parentElement;
							muiULElement.parentElement.removeChild(muiULElement);
						} else {
							$.toast(data.msg);
						}
					});
				}
			});
		});

		rightBar.addEventListener('tap', function(event) {
			if(enroll.arrears <= 0) {
				$.toast("两清了，不需要缴费了O(∩_∩)O~");
				return;
			}
			var addPayPage = $.preload({
				"id": 'add_pay.html',
				"url": 'add_pay.html'
			});
			addPayPage.addEventListener('loaded', function() {
				$.fire(addPayPage, 'getParameter', {});
			});
			addPayPage.show("pop-in");
		});
	});
})(mui, document)