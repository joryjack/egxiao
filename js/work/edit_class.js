(function($, doc) {
	$.init();

	$.plusReady(function() {

		function getclassStateCode(classStateValue) {
			var classStateCode = "1"
			switch(classStateValue) {
				case "已开课":
					classStateCode = "2";
					break;
				case "已结课":
					classStateCode = "3";
					break;
			}
			return classStateCode;
		}

		function getclassStateValue(classStateCode) {
			var classStateValue = "请选择"
			switch(classStateCode) {
				case "2":
					classStateValue = "已开课";
					break;
				case "3":
					classStateValue = "已结课";
					break;
			}
			return classStateValue;
		}
		var $class = app.getClass();
		var id = "";
		var class_name = doc.getElementById("class_name");
		var selectlesson = doc.getElementById("selectlesson");
		var lesson_type = doc.getElementById("lesson_type");
		var classState = doc.getElementById("classState");
		var description = doc.getElementById("description");

		var inputList = doc.querySelectorAll('input');
		var self = plus.webview.currentWebview();
		var rightBar = doc.getElementById("rightBar");
		var title = doc.querySelector('.mui-title');

		window.addEventListener('getParameter', function(options) {

		});
		if($class) {
			id = $class.id;
			class_name.value = $class.name;
			selectlesson.value = $class.lesson_name;
			lesson_type.value = app.lessonTypeHTML($class.lesson_type);
			classState.value = getclassStateValue($class.state);
			description.value = $class.description;
		}
		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			$class.name = class_name.value;
			$class.state = getclassStateCode(classState.value);
			localStorage.setItem('$class', JSON.stringify($class));
			$.each(inputList, function(index, item) {
				item.value = '';
			});

			var detailstudentwebview = plus.webview.getWebviewById('detail_class.html');
			$.fire(detailstudentwebview, 'reloaddetailclass', {});
			self.close();
		}, false);

		classState.addEventListener('tap', function() {
			$("#popover").popover("toggle");
		});

		$(".mui-table-view").on('tap', 'a', function() {
			classState.value = this.innerText;
			$("#popover").popover("toggle");
		});

		rightBar.addEventListener('tap', function() {
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			var account = app.getAccount();
			if(class_name.value.trim() == "") {
				$.toast("没有填写班级名称");
				return;
			}

			if(account) {
				var mclassRequest = {
					id: id,
					org_id: account.org_id,
					name: class_name.value.trim(),
					state:getclassStateCode(classState.value) ,
					description:description.value,
					update_by: account.id
				}
				
				var waiting = plus.nativeUI.showWaiting();
				app.SaveClass(mclassRequest, function(data) {
					waiting.close();
					if(typeof data == 'string') {
						$.toast(data);
						return;
					} else {
						if(data.success) {
							$.toast(data.msg);
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
	});

})(mui, document)