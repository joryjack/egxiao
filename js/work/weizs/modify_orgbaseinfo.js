(function($, doc) {
	$.init({
		swipeBack: false
	});

	$.plusReady(function() {
		var account = app.getAccount();

		var shortname = doc.getElementById("shortname");
		var showOrgType = doc.getElementById("orgType");
		var showOrgSize = doc.getElementById("orgSize");

		var showOrgTypePopover = doc.getElementById("showOrgTypePopover");
		var showOrgSizePopover = doc.getElementById("showOrgSizePopover");

		var orgTypeId = "",
			orgSizeId = "";
		puahData();
		var inputList = doc.querySelectorAll('input');
		var self = plus.webview.currentWebview();

		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			orgTypeId = "";
			orgSizeId = "";

			$.each(inputList, function(index, item) {
				item.value = '';
			});
			//			var organizationinfowebview = plus.webview.getWebviewById('organizationinfo.html');
			//			$.fire(organizationinfowebview, 'reload', {});
			self.close();
		}, false);

		showOrgType.addEventListener('tap', function() {
			$("#showOrgTypePopover").popover("toggle");
		});

		$("#showOrgTypePopover .mui-table-view").on('tap', 'a', function() {
			showOrgType.value = this.innerText;
			orgTypeId = this.dataset.orgtype;
			$("#showOrgTypePopover").popover("toggle");
		});

		//状态
		showOrgSize.addEventListener('tap', function() {
			$("#showOrgSizePopover").popover("toggle");
		});

		$("#showOrgSizePopover .mui-table-view").on('tap', 'a', function() {
			showOrgSize.value = this.innerText;
			orgSizeId = this.dataset.orgsize;

			$("#showOrgSizePopover").popover("toggle");
		});

		//提交
		saveOrgBaseInfo.addEventListener('tap', function() {
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			if(shortname.value.trim() == "") {
				$.toast('请填写机构简称');
				return;
			}
			if(orgTypeId == "") {
				$.toast('请选择机构所属分类');
				return;
			}

			if(orgSizeId == "") {
				$.toast('请选学员规模');
				return;
			}

			var account = app.getAccount();

			if(account) {
				var orgBaseInfoRequest = {
					id: account.org_id,
					shortname: shortname.value.trim(),
					org_size: orgSizeId,
					org_type: orgTypeId
				}
				var waiting = plus.nativeUI.showWaiting();
				console.log(JSON.stringify(orgBaseInfoRequest));
				app.SaveOrgBaseInfo(orgBaseInfoRequest, function(data) {
					waiting.close();
					if(typeof data == 'string') {
						$.toast(data);
						return;
					} else {
						if(data.success) {
							$.toast(data.msg);
							var weiZSInfodata = app.getWeiZSInfodata();
							weiZSInfodata.weiZSPerResponse.organization.shortname = shortname.value.trim();
							weiZSInfodata.weiZSPerResponse.organization.org_size = orgSizeId;
							weiZSInfodata.weiZSPerResponse.organization.org_type = orgTypeId;
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
			shortname.value = weiZSInfodata.weiZSPerResponse.organization.shortname;
			showOrgType.value = app.orgTypeName(weiZSInfodata.weiZSPerResponse.organization.org_type);
			showOrgSize.value = app.orgSizeName(weiZSInfodata.weiZSPerResponse.organization.org_size);
			orgSizeId = weiZSInfodata.weiZSPerResponse.organization.org_size;
			orgTypeId = weiZSInfodata.weiZSPerResponse.organization.org_type;
		}
	})
})(mui, document)