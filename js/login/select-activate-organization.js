(function($, doc) {
	$.init()
	$.plusReady(function() {

		var htmlStr = '';
		var content = doc.getElementsByClassName("mui-table-view")[0];
		var data = app.getActivateOrganization();
		var phone = "";
		var self = plus.webview.currentWebview();
		window.addEventListener('getParameter', function(options) {})
		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
            localStorage.removeItem('$activateAccountPar');
			self.close();
		}, false);
		var toSetPassWord = function(org_id) {
           var $activateAccountPar = app.getactivateAccountPar();
			$activateAccountPar.org_id= org_id;
			localStorage.setItem('$activateAccountPar', JSON.stringify($activateAccountPar));
			
			var reset_passwordPage = $.preload({
				"id": 'selectorg-set_password.html',
				"url": 'set_password.html'
			});
			$.fire(reset_passwordPage, 'getParameter', {});
			reset_passwordPage.show("pop-in");

		};
		for(var i = 0; i < data.length; i++) {
			var orgInfo = data[i];
			htmlStr += '<li class="mui-table-view-cell">' +
				'<a  data-uorg="' + orgInfo.org_id + '" class="mui-navigate-right" >' + orgInfo.org_name +
				'</a>' +
				'</li>';
		}
		content.innerHTML = htmlStr;
		mui('.mui-table-view').on('tap', 'a', function() {
			var _dataOrg_id = this.getAttribute('data-uorg');
			toSetPassWord(_dataOrg_id);
		});
	});
})(mui, document)