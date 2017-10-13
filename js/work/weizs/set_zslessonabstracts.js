(function($, doc) {
	$.init({
		swipeBack: false
	});

	$.plusReady(function() {

		var txtobj = {
			textareaId: "abstractText", //外层容器的class
			numberId: "numberId", //textarea的class
			maxNumber: 500 //数字的最大数目
		}
		app.textareaFn(txtobj)
		var abstractText = doc.getElementById("abstractText");
		var saveAbstractText = doc.getElementById("saveAbstractText");

		puahData();

		var self = plus.webview.currentWebview();

		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			var organizationinfowebview;
			var $weizszslessonaction = app.getWeizszslessonaction();
			switch($weizszslessonaction.action) {
				case "addlesson":
					organizationinfowebview = plus.webview.getWebviewById('add_zslesson.html');
					break;
				case "modifylesson":
					organizationinfowebview = plus.webview.getWebviewById('modify_zslesson.html');
					break;
				default:
					organizationinfowebview = plus.webview.getWebviewById('add_zslesson.html');
					break;
			}
			$.fire(organizationinfowebview, 'pushzslessonabstractsdata', {});
			self.close();

		}, false);

		//提交
		saveAbstractText.addEventListener('tap', function() {

			if(abstractText.value.trim() == "") {
				$.toast('请填写课程简介');
				return;
			}
			var abstractStr = abstractText.value
			abstractStr = abstractStr.replace(/</g, '&lt;').replace(/>/g, '&gt;');
			abstractStr = abstractStr.replace(/\s/g, "&nbsp;").
			abstractStr = abstractStr.replace(/\n|\r\n/g, "<br/>");
			var zslessonabstractsdata = app.getSetzslessonabstracts();
			zslessonabstractsdata.abstracts = abstractStr;

			localStorage.setItem("$setzslessonabstracts", JSON.stringify(zslessonabstractsdata));

			$.back();
		}, false);

		function puahData() {
			var zslessonabstractsdata = app.getSetzslessonabstracts();
			if(zslessonabstractsdata.abstracts != null) {
				var abstracts = zslessonabstractsdata.abstracts;
				abstractText.value = abstracts.replace(/<br\/>|"/g, "\r\n");
			}

		}
	})
})(mui, document)