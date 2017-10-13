(function($, doc) {
	$.init({
		swipeBack: false //启用右滑关闭功能
	});
	var settings = app.getSettings();
	var name = doc.getElementById('name');
	var phone = doc.getElementById('phone');
	var account = app.getAccount();
	if(account) {
		name.innerText = account.name;
		phone.innerText = account.phone;
	}
	window.addEventListener('show', function() {
		var account = app.getAccount();
		name.innerText = account.name;
		phone.innerText = account.phone;
	}, false);
	$.plusReady(function() {
		var mui_table_views = ["#infocenter", "#appliction", "#setting"];
		for(var i = 0; i < mui_table_views.length; i++) {
			$(mui_table_views[i]).on('tap', 'a', function() {
				var a = this;
				var href = a.getAttribute('href');
				if(href ==""){return;}
					var templatePage = $.preload({
						"id": href,
						"url": href
					});
					$.fire(templatePage, 'reload', {});
					templatePage.show("pop-in");	
			});
		}
	});

})(mui, document)