(function($, doc) {
	$.init();

	$.plusReady(function() {

		var lesson_name = doc.getElementById("lesson_name");
		var student_name = doc.getElementById("student_name");
		var arrears = doc.getElementById("arrears");
		var payment = doc.getElementById("payment");
		var self = plus.webview.currentWebview();

		var enroll = app.getEnroll();
		lesson_name.value = enroll.lesson_name;
		student_name.value = enroll.stu_name;
		arrears.value = enroll.arrears;
		var inputList = doc.querySelectorAll('input');

		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			var paymentNum = isNaN(parseFloat(payment.value,10)) ? 0 : parseFloat(payment.value,10);
			enroll.arrears = enroll.arrears - paymentNum;
			enroll.payment += paymentNum;
			localStorage.setItem('$enroll', JSON.stringify(enroll));

			$.each(inputList, function(index, item) {
				item.value = "";
			});
			var detailenrollwebview = plus.webview.getWebviewById('detail_enroll.html');
			$.fire(detailenrollwebview, 'reloadEnroll', {});
			self.close();
		}, false);
		//提交
		rightBar.addEventListener('tap', function() {
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}
			var paymentNum = isNaN(parseFloat(payment.value,10)) ? 0 : parseFloat(payment.value,10);
			var arrearsNum = isNaN(parseFloat(arrears.value,10)) ? 0 : parseFloat(arrears.value,10);
			if(paymentNum == 0) {
				$.toast('请填写缴费金额');
				return;
			}
			if(arrearsNum < paymentNum) {
				$.toast('实缴金额不能大于欠费金额');
				return;
			}
			var account = app.getAccount();
			if(account) {
				var cashFlowRequest = {
					org_id: account.org_id,
					campus_id: account.campus_id,
					item_id: enroll.id,
					item_name: "缴纳学费" + enroll.lesson_name,
					moeny: paymentNum,
					per_id: enroll.stu_id,
					per_name: enroll.stu_name,
					create_by: account.id,
					create_name: account.name
				}
				console.log(JSON.stringify(cashFlowRequest))
				var waiting = plus.nativeUI.showWaiting();
				app.SaveEnrollCashFlow(cashFlowRequest, function(data) {
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