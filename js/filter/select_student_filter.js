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
		var nodata = document.body.querySelector('.state');

		var stateList = nodata.children;
		stateList.item(0).addEventListener("tap", function() {
			var stateclassList = this.classList;
			if(stateclassList.contains('label-default')) {
				stateclassList.remove('label-default');
				stateclassList.add('label-danger');
			} else {
				stateclassList.add('label-default');
				stateclassList.remove('label-danger');
			}
		});

		stateList.item(1).addEventListener("tap", function() {
			var stateclassList = this.classList;
			if(stateclassList.contains('label-default')) {
				stateclassList.remove('label-default');
				stateclassList.add('label-warning');
			} else {
				stateclassList.add('label-default');
				stateclassList.remove('label-warning');
			}
		});

		stateList.item(2).addEventListener("tap", function() {
			var stateclassList = this.classList;
			if(stateclassList.contains('label-default')) {
				stateclassList.remove('label-default');
				stateclassList.add('label-success');
			} else {
				stateclassList.add('label-default');
				stateclassList.remove('label-success');
			}
		});

		stateList.item(3).addEventListener("tap", function() {
			var stateclassList = this.classList;
			if(stateclassList.contains('label-default')) {
				stateclassList.remove('label-default');
				stateclassList.add('label-primary');
			} else {
				stateclassList.add('label-default');
				stateclassList.remove('label-primary');
			}
		});
		stateList.item(4).addEventListener("tap", function() {
			var stateclassList = this.classList;
			if(stateclassList.contains('label-default')) {
				stateclassList.remove('label-default');
				stateclassList.add('label-danger1');
			} else {
				stateclassList.add('label-default');
				stateclassList.remove('label-danger1');
			}
		});

		reset.addEventListener("tap", function() {
			$.each(stateList, function(index, item) {
				var stateclassList = item.classList;
				stateclassList.remove('label-success', 'label-warning', 'label-danger', 'label-danger1', 'label-primary');
				stateclassList.add('label-default');
			});
			name.value = "";
		});

		search.addEventListener("tap", function() {
			var state = [];
			$.each(stateList, function(index, item) {
				var stateclassList = item.classList;
				var statedataset = item.dataset;
				if(!stateclassList.contains('label-default')) {
					state.push(statedataset.code);
				}
			});
			var searchpar = {
				state: state,
				name: name.value
			};
			console.log(JSON.stringify(searchpar));
			var studentListwebview = plus.webview.getWebviewById('select_student_list.html');
			$.fire(studentListwebview, 'search', searchpar);
			closeMenu();
		}, false)

		function closeMenu() {
			mui.fire(main, "menu:swiperight");
		}
		window.addEventListener("swiperight", closeMenu);
	});

})(mui, document)