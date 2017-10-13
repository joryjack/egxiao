(function($, doc) {
	$.init({
		swipeBack: false
	});

	$.plusReady(function() {
		var account = app.getAccount();
		var influenceNum = doc.getElementById("influenceNum");

		loaddata();
		var _self;
		_self = plus.webview.currentWebview();

		_self.setPullToRefresh({
			auto: true,
			support: true,
			height: '180px',
			range: '150px',
			style: 'circle',
			offset: '100px'
		}, pulldownRefresh);

		//	pulldownRefresh();
		/**
		 * 下拉刷新具体业务实现
		 */
		function pulldownRefresh() {
			setTimeout(function() {
				loaddata();
				_self.endPullToRefresh();
			}, 1500);
		}

		function loaddata() {
			var singleInfluenceRequest = {
				org_id: account.org_id,
				account_id: account.id
			}
           console.log(JSON.stringify(singleInfluenceRequest));
			app.GetSingleInfluence(singleInfluenceRequest, function(data) { 
	              influenceNum.innerHTML=data;
			});
		}
	     document.getElementById("alertHelp").addEventListener('tap', function() {
				mui.alert('影响力是您分享的课程覆盖到的用户；分享的课程被转发的越多，就能被更多的人看到，影响力和分享课程中的脚印数、代言数、围观数息息相关。\n影响力越高，您为机构带来的价值越高。', '什么是影响力？','我知道了' ,function() {
					
				},'div');
			}); 
	})
})(mui, document)