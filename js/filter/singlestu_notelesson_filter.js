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
		var teacher_name = doc.getElementById("teacher_name");
		var reset = doc.getElementById("reset");
		var search = doc.getElementById("search");
		var start = doc.getElementById("start");
		var end = doc.getElementById("end");
        
        var style = document.body.querySelector('.style');

		var styleList = style.children;
		styleList.item(0).addEventListener("tap", function() {
			var styleclassList = this.classList;
			if(styleclassList.contains('label-default')) {
				styleclassList.remove('label-default');
				styleclassList.add('label-success');
			} else {
				styleclassList.add('label-default');
				styleclassList.remove('label-success');
			}
		});

		styleList.item(1).addEventListener("tap", function() {
			var styleclassList = this.classList;
			if(styleclassList.contains('label-default')) {
				styleclassList.remove('label-default');
				styleclassList.add('label-danger');
			} else {
				styleclassList.add('label-default');
				styleclassList.remove('label-danger');
			}
		});

		styleList.item(2).addEventListener("tap", function() {
			var styleclassList = this.classList;
			if(styleclassList.contains('label-default')) {
				styleclassList.remove('label-default');
				styleclassList.add('label-primary');
			} else {
				styleclassList.add('label-default');
				styleclassList.remove('label-primary');
			}
		});
        styleList.item(3).addEventListener("tap", function() {
			var styleclassList = this.classList;
			if(styleclassList.contains('label-default')) {
				styleclassList.remove('label-default');
				styleclassList.add('label-warning');
			} else {
				styleclassList.add('label-default');
				styleclassList.remove('label-warning');
			}
		});
		styleList.item(4).addEventListener("tap", function() {
			var styleclassList = this.classList;
			if(styleclassList.contains('label-default')) {
				styleclassList.remove('label-default');
				styleclassList.add('label-danger1');
			} else {
				styleclassList.add('label-default');
				styleclassList.remove('label-danger1');
			}
		});

		//开始
		start.addEventListener('tap', function() {
			var $this = this;
			var optionsJson = $this.getAttribute('data-options') || '{"type":"date"}';
			var options = JSON.parse(optionsJson);
			var picker = new $.DtPicker(options);
			picker.show(function(rs) {
				$this.value = rs.text;
				picker.dispose();
			});
		});
		//结束
		end.addEventListener('tap', function() {
			var $this = this;
			var optionsJson = $this.getAttribute('data-options') || '{"type":"date"}';
			var options = JSON.parse(optionsJson);
			var picker = new $.DtPicker(options);
			picker.show(function(rs) {
				$this.value = rs.text;
				picker.dispose();
			});
		});
		reset.addEventListener("tap", function() {
			$.each(styleList, function(index, item) {
				var styleclassList = item.classList;
				styleclassList.remove('label-success', 'label-warning', 'label-danger','label-primary','label-danger1');
				styleclassList.add('label-default');
			});
			teacher_name.value = "";
			lesson_name.value = "";
			subject_name.value = "";
			start.value = "";
			end.value = "";

		});

		search.addEventListener("tap", function() {
           var notelessonstate = [];
			$.each(styleList, function(index, item) {
				var styleclassList = item.classList;
				var styledataset = item.dataset;
				if(!styleclassList.contains('label-default')) {
					notelessonstate.push(styledataset.code);
				} 
			});
			var searchpar = {
				teacher_name: teacher_name.value,
				notelesson_start: start.value,
				notelesson_end: end.value,
				lesson_name: lesson_name.value,
				subject_name: subject_name.value,
				state:notelessonstate
			};
			var notelessonListwebview = plus.webview.getWebviewById('singlestu_notelesson_list.html');
			$.fire(notelessonListwebview, 'search', searchpar);
			closeMenu();
		}, false)

		function closeMenu() {
			mui.fire(main, "menu:swiperight");
		}
		window.addEventListener("swiperight", closeMenu);
	});

})(mui, document)