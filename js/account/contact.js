(function($, doc) {
	$.init();
	var account = app.getAccount();
	var table = doc.body.querySelector('.mui-table-view');
	var userRoleName = function(data) {
		var role_name = [];
		for(var i = 0; i < data.length; i++) {
			role_name.push(data[i].role_name);
		}
		return role_name.join(',');
	}
	
	$.plusReady(function() {
		var self = plus.webview.currentWebview();
		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			self.close();
		}, false);

		if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
			plus.nativeUI.toast('网络不给力，请检查网络设置');
			return;
		}
		var waiting = plus.nativeUI.showWaiting();
		app.GetContact({
			org_id: account.org_id,
			campus_id: account.campus_id,
			account_id: account.id
		}, function(data) {
			waiting.close();
			pushViewElement(data);
			var header = doc.querySelector('header.mui-bar');
			var list = doc.getElementById('list');
			list.style.height = (doc.body.offsetHeight - header.offsetHeight) + 'px';
			window.indexedList = new $.IndexedList(list);
		})
	});

	function pushViewElement(data) {

		var personnellist = data;
		//step 1
		var contactList = [];
		for(var i = 0; i < personnellist.length; i++) {
			var personnel = {};
			personnel.jianpin = pinyinUtil.getFirstLetter(personnellist[i].name);
			personnel.quanpin = pinyinUtil.getPinyin(personnellist[i].name).replace(/\s/g, "");
			personnel.html = '<div class="oa-contact-cell mui-table"><div class="oa-contact-avatar mui-table-cell"><img src="../images/50x50t.png" /></div><div class="oa-contact-content mui-table-cell"><div class="mui-clearfix"><h4 class="oa-contact-name">' + personnellist[i].name + '</h4></div><p class="oa-contact-email mui-h6"><span>' + personnellist[i].campusname + '/</span><span>' + userRoleName(personnellist[i].userRole) + '</span></p></div><div data-phone="' + personnellist[i].phone + '" class="oa-contact-tel mui-table-cell"><span class="mui-icon  mui-icon-phone mui-pull-right" style="color:#55BD9A; font-size:2em;"></span></div></div>';
			contactList.push(personnel);

		}
		//step 2
		//利用js中的sort方法  
		contactList.sort(sortquanpin);
		//step 3
		var html = "";
		var az = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		for(var i = 0; i < az.length; i++) {
			// step 4
			var tempPersonnel = contactList.filter(function(personnel) {
				return personnel.jianpin.substr(0, 1) == az[i];
			});
			// step 5
			if(tempPersonnel.length > 0) {
				html += '<li data-group="' + az[i] + '" class="mui-table-view-divider mui-indexed-list-group">' + az[i] + '</li>';
				$.each(tempPersonnel, function(index, item) {
					html += '<li data-value="' + item.jianpin + '" data-tags="' + item.quanpin + '" class="mui-table-view-cell mui-indexed-list-item">' + item.html + '</li>';
				});
			}
		}
		console.log(html);
		table.innerHTML = html;
	}

	function sortquanpin(a, b) {
		return a.quanpin - b.quanpin
	}

	$(".mui-table-view").on('tap', '.oa-contact-tel', function() {
		var teldataset = this.dataset;
		if(mui.os.plus) {
			plus.device.dial(teldataset.phone);
		} else {
			location.href = teldataset.phone;
		}
	}, false);

})(mui, document)