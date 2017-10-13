(function($, doc) {
	$.init({
		swipeBack: false
	});

	$.plusReady(function() {

		var txtobj = {
			textareaId: "abstractText", //外层容器的class
			numberId: "numberId", //textarea的class
			maxNumber: 500 //数字的最大数目
		}
		app.textareaFn(txtobj)
		var abstractText = doc.getElementById("abstractText");
		var saveAbstractText = doc.getElementById("saveAbstractText");

		puahData();

		var self = plus.webview.currentWebview();

		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			var organizationinfowebview = plus.webview.getWebviewById('organizationinfo.html');
			$.fire(organizationinfowebview, 'reload', {});
			self.close();
		}, false);

		//提交
		saveAbstractText.addEventListener('tap', function() {
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			if(abstractText.value.trim() == "") {
				$.toast('请填写机构简介');
				return;
			}
			var account = app.getAccount();
			if(account) {
				var abstractStr = abstractText.value
				abstractStr = abstractStr.replace(/</g, '&lt;').replace(/>/g, '&gt;');
				abstractStr = abstractStr.replace(/\s/g, "&nbsp;").
				abstractStr = abstractStr.replace(/\n|\r\n/g, "<br/>");
				console.log(abstractStr);
				var orgAbstractRequest = {
					org_id: account.org_id,
					abstractStr: abstractStr,
					account_id: account.id
				}
				var waiting = plus.nativeUI.showWaiting();
				app.SaveOrgAbstract(orgAbstractRequest, function(data) {
					waiting.close();
					if(typeof data == 'string') {
						$.toast(data);
						return;
					} else {
						if(data.success) {
							$.toast(data.msg);
							var weiZSInfodata = app.getWeiZSInfodata();
							weiZSInfodata.weiZSPerResponse.organization.description = abstractStr;
							localStorage.setItem("$WeiZSInfo", JSON.stringify(weiZSInfodata));
							$.back();
						} else {
							$.toast(data.msg);
						}
					}
				});
			} else {
				$.toast("数据丢失");
			}
		}, false);

		function puahData() {
			var weiZSInfodata = app.getWeiZSInfodata();
			console.log(weiZSInfodata.weiZSPerResponse.organization.description);
			if(weiZSInfodata.weiZSPerResponse.organization.description != null) {
				var description = weiZSInfodata.weiZSPerResponse.organization.description
				abstractText.value = description.replace(/<br\/>|"/g, "\r\n");
			}

		}
	})
})(mui, document)