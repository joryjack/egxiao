(function($, doc) {
	$.init({
		keyEventBind: {
			backbutton: false,
			menubutton: false
		}
	});
	var main = null;
	$.plusReady(function() {

		main = plus.webview.currentWebview().opener();
		var name = doc.getElementById("name");
		var reset = doc.getElementById("reset");
		var search = doc.getElementById("search");

		reset.addEventListener("tap", function() {

			name.value = "";
		});

		search.addEventListener("tap", function() {

			var searchpar = {
				name: name.value
			};
			var classListwebview = plus.webview.getWebviewById('select_lesson_list.html');
			$.fire(classListwebview, 'search', searchpar);
			closeMenu();
		}, false)

		function closeMenu() {
			mui.fire(main, "menu:swiperight");
		}
		window.addEventListener("swiperight", closeMenu);
	});

})(mui, document)