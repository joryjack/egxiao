(function($, doc) {
	$.init({
		swipeBack: false
	});

	$.plusReady(function() {
		var account = app.getAccount();
		var userinfo = doc.getElementById("userinfo");
		var weizsInfoNum = doc.getElementById("weizsInfoNum");
		var weiZSApps1 = doc.getElementById("weiZSApps1");

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
			var weiZSPerRequest = {
				org_id: account.org_id,
				account_id: account.id
			}

			app.GetWeiZSInfo(weiZSPerRequest, function(data) {
				localStorage.setItem("$WeiZSInfo", JSON.stringify(data));
				pushData();
			});
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
			
			if(href == "vip_organizationinfo.html"|| href == "organizationinfo.html") {
				var weiZSInfodata = app.getWeiZSInfodata();
				if(!userBusinessPermission(weiZSInfodata.weiZSPerResponse.userRole)) {
					$.toast("你没有查看权限");
					return;
				}
			}
			if(href == "footprint_main.html"){
				 var footprintpar ={
				 	 "zslesson_id":""
				 }
				 localStorage.setItem("$footprintpar", JSON.stringify(footprintpar));
			}
			
			var templatePage = $.preload({
				"id": href,
				"url": href
			});
		   
			$.fire(templatePage, 'reload', {});
			templatePage.show("pop-in");
		});

		function pushData() {
			var weiZSInfodata = app.getWeiZSInfodata();
			console.log(JSON.stringify(weiZSInfodata));
			var userinfoHTML = "",
				weizsInfoNumHTML = "",
				weiZSApps1HTML = "";
			if(weiZSInfodata != null) {
				//userinfo
				if(weiZSInfodata.weiZSPerResponse.organization.is_vip != "0" && app.comptime(weiZSInfodata.weiZSPerResponse.organization.end_vip_time)) {
					userinfoHTML += '<div class="oa-contact-avatar mui-table-cell actived"><img src="../../images/50x50t.png" /></div>';
				} else {
					userinfoHTML += '<div class="oa-contact-avatar mui-table-cell "><img src="../../images/50x50t.png" /></div>';
				}

				userinfoHTML += '<div  class="oa-contact-content mui-table-cell">';
				userinfoHTML += '<div class="mui-clearfix"><h4 class="oa-contact-name">' + weiZSInfodata.weiZSPerResponse.name + '</h4></div>';
				userinfoHTML += '<p class="oa-contact-email mui-h6"><span class="oa-contact-name">' + userRoleName(weiZSInfodata.weiZSPerResponse.userRole) + '</span></p>';
				userinfoHTML += '</div>';
				userinfo.innerHTML = userinfoHTML;
				//num
				weizsInfoNumHTML += '<li class="mui-table-view-cell mui-media mui-col-xs-6 " style="border-right: 1px dashed #eee;"><a href="zslesson.html" style="padding:0;"><span class="mui-icon-small">' + weiZSInfodata.zmlesson_totalNum + '</span><div class="mui-media-body">微直招</div></a></li>';
				weizsInfoNumHTML += '<li class="mui-table-view-cell mui-media mui-col-xs-6"><a href="orgnearedulist.html" style="padding:0;"><span class="mui-icon-small">' + weiZSInfodata.campus_totalNum + '</span><div class="mui-media-body">附近教育</div></a></li>';
				//weizsInfoNumHTML += '<li class="mui-table-view-cell mui-media mui-col-xs-6 " style="border-right: 1px dashed #eee;"><a href="zslesson.html" style="padding:0;"><span class="mui-icon-small">' + weiZSInfodata.zmlesson_totalNum + '</span><div class="mui-media-body">课程管理</div></a></li>';
				//weizsInfoNumHTML += '<li class="mui-table-view-cell mui-media mui-col-xs-6"><a href="footprint_main.html" style="padding:0;"><span class="mui-icon-small">' + weiZSInfodata.student_totalNum + '</span><div class="mui-media-body">脚印</div></a></li>';
				weizsInfoNum.innerHTML = weizsInfoNumHTML;

				//apps
				weiZSApps1HTML += '<li class="mui-table-view-cell mui-media mui-col-xs-3 "><a href="system_msg.html"><span class="mui-icon  iconfont icon-mark"></span><div class="mui-media-body">消息</div></a></li>';
				weiZSApps1HTML += '<li class="mui-table-view-cell mui-media mui-col-xs-3 "><a href="vip_organizationinfo.html"><span class="mui-icon iconfont icon-choiceness"></span><div class="mui-media-body">认证机构</div></a></li>';
				weiZSApps1HTML += '<li class="mui-table-view-cell mui-media mui-col-xs-3"><a href="organizationinfo.html"><span class="mui-icon iconfont  icon-org-line"></span><div class="mui-media-body">机构信息</div></a></li>';
				weiZSApps1HTML += '<li class="mui-table-view-cell mui-media mui-col-xs-3 "><a href="coding"><span class="mui-icon iconfont icon-result"></span><div class="mui-media-body">效果看板</div></a> </li>';
				weiZSApps1.innerHTML = weiZSApps1HTML;
			}
		}

		var userRoleName = function(data) {
			var role_name = [];
			for(var i = 0; i < data.length; i++) {
				role_name.push(data[i].role_name);
			}
			return role_name.join(',');
		}

		var userBusinessPermission = function(data) {
			var b = false;
			for(var i = 0; i < data.length; i++) {
				if(data[i].role_id == "07ec2b419dbe4f51a14c5c9b4e4e5b0d") {
					b = true;
				}
			}
			return b;
		}
	})
})(mui, document)