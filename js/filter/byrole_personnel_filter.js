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
		var nameInput = doc.getElementById("name");
		var phoneInput = doc.getElementById("phone");
		var reset = doc.getElementById("reset");
		var search = doc.getElementById("search");
		
		reset.addEventListener("tap", function() {
			nameInput.value = "";
			phoneInput.value = "";
		});

		search.addEventListener("tap", function() {
			var searchpar = {
				name: nameInput.value,
				phone: phoneInput.value
			};
			console.log(JSON.stringify(searchpar));
			var personnelListwebview = plus.webview.getWebviewById('byrole_personnel_list.html');
			$.fire(personnelListwebview, 'search', searchpar);
			closeMenu();
		}, false)

		function closeMenu() {
			mui.fire(main, "menu:swiperight");
		}
		window.addEventListener("swiperight", closeMenu);
	});

})(mui, document)