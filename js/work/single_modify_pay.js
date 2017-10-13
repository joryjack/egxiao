(function($, doc) {
	$.init();
	$.plusReady(function() {
		var selectStudentId = "",
			selectlessonId = "",
			Lessontype = "",
			selectPersonnelId = "";

		var selectStudent = doc.getElementById('selectStudent');
		var selectlesson = doc.getElementById('selectlesson');
		var lesson_price = doc.getElementById('lesson_price');
		var lesson_type = doc.getElementById('lesson_type');
		var lesson_number = doc.getElementById('lesson_number');
		var subtotal = doc.getElementById('subtotal');
		var payment = doc.getElementById('payment');
		var discount = doc.getElementById('discount');
		var selectdean = doc.getElementById('selectdean');
		var rightBar = doc.getElementById('rightBar');
		var description = doc.getElementById("description");

		var lesson_num = doc.getElementById("lesson_num");
		var lesson_num_div = doc.getElementById("lesson_num_div");
		
		var payDate = doc.getElementById("payDate");
		payDate.value = app.getNowFormatShortDate();

		var self = plus.webview.currentWebview();
		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			selectStudentId = "";
			selectStudent.innerHTML = "请选择";
			selectlessonId = "";
			selectlesson.innerHTML = "请选择";
			lesson_price.value = "0";
			Lessontype = "";
			lesson_type.value = "";
			lesson_number.value = "";
			subtotal.value = "0";
			payment.value = "";
			discount.value = "";
			description.value = "";
			selectPersonnelId = "";
			selectdean.innerHTML = "请选择";

			var singlestulessonwebview = plus.webview.getWebviewById('singlestu_lesson.html');
			$.fire(singlestulessonwebview, 'reload', {});
			self.close();
		}, false);

		var student = app.getStudent();
		selectStudentId = student.id;
		selectStudent.innerHTML = student.name;

		var $singleStuLesson = app.getSingleStuLesson();

		if(JSON.stringify($singleStuLesson) != '{}') {
			selectlessonId = $singleStuLesson.id;
			selectlesson.innerHTML = $singleStuLesson.name;
			lesson_price.value = $singleStuLesson.price;
			Lessontype = $singleStuLesson.type;
			lesson_num.value = 0;

			discount.value = "";
			switch(Lessontype) {
				case "1": //学时
					lesson_type.value = "课时";
					subtotal.value = "0";
					payment.value = "";
					lesson_number.value = "0";
					lesson_num_div.classList.remove("mui-hidden");
					lesson_num_div.classList.add("mui-hidden");
					break;
				case "2":
					lesson_type.value = "课时包";
					subtotal.value = $singleStuLesson.price;
					payment.value = subtotal.value;
					
					lesson_num.value = $singleStuLesson.lesson_num;
					lesson_number.value = $singleStuLesson.lesson_num;
					lesson_num_div.classList.remove("mui-hidden");
					break;
				default:
					break;
			}
		}
		//数量
		lesson_number.addEventListener('input', function() {
			if(selectlessonId == "") {
				$.toast("请选择课程");
				this.value = "";
				return;
			}
			var subtotalNum = isNaN(parseFloat(this.value, 10)) ? 0 : parseFloat(this.value, 10);

			if(lesson_num_div.classList.contains('mui-hidden')) {
				lesson_num.value = 0;
			} else {
				if(subtotalNum > parseFloat(lesson_num.value, 10)) {
					this.value =0;
					$.toast("数量不能大于课时包的课时数");
					return;
				}
			}
			switch(Lessontype) {
				case "1":
					subtotal.value = subtotalNum * parseFloat(lesson_price.value, 10);
					payment.value = subtotal.value
					break;
				case "2":
					subtotal.value = (parseFloat(lesson_price.value, 10) / parseFloat(lesson_num.value, 10) * subtotalNum).toFixed(2);
					payment.value = subtotal.value
					break;
				default:
					break;
			}
		});
		//优惠
		discount.addEventListener('input', function() {
			if(lesson_number.value == "") {
				$.toast("请先填写数量");
				this.value = "";
				return;
			}
			var discountFloat = isNaN(parseFloat(this.value, 10)) ? 0 : parseFloat(this.value, 10);
			payment.value = parseFloat(subtotal.value, 10) - discountFloat;
		});
		
		//日期
		payDate.addEventListener('tap', function() {
			var $this = this;
			var optionsJson = $this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var picker = new $.DtPicker(options);
			picker.show(function(rs) {
				$this.value = rs.text;
				picker.dispose();
			});
		});
		
		//教务 dean
		selectdean.addEventListener('tap', function() {
			var byrole_personnel_mainPage = $.preload({
				"id": 'byrole_personnel_main.html',
				"url": 'byrole_personnel_main.html'
			});
			var byrolePersonnelInfo = {
				"selectPersonnelId": selectPersonnelId,
				"action": "singlemodifypay",
				"other": false,
				"roleidList": ["bc0acdf3aa6346d4889ee402a7eb89f1"]
			}
			localStorage.setItem('$byrolePersonnelInfo', JSON.stringify(byrolePersonnelInfo));
			var byrole_personnel_listwebview = plus.webview.getWebviewById('byrole_personnel_list.html');
			$.fire(byrole_personnel_listwebview, 'getParameter', {
				id: selectPersonnelId
			});
			$.fire(byrole_personnel_mainPage, 'getParameter', {});
			byrole_personnel_mainPage.show("pop-in");
		});

		window.addEventListener('selectPersonnelParameter', function(options) {
			if(options.detail.id) {
				selectPersonnelId = options.detail.id;
				selectdean.innerHTML = options.detail.name;
			}
		});

		//提交
		rightBar.addEventListener('tap', function() {
			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}

			if(selectStudentId == "") {
				$.toast('请选择学员');
				return;
			}
			if(selectlessonId == "") {
				$.toast('请选择课程');
				return;
			}
			if(lesson_number.value == "") {
				$.toast('请输入数量');
				return;
			}
			var paymentNum = isNaN(parseFloat(payment.value, 10)) ? 0 : parseFloat(payment.value, 10);
			var discountNum = isNaN(parseFloat(discount.value, 10)) ? 0 : parseFloat(discount.value, 10);
			var subtotalNum = parseFloat(subtotal.value, 10);
			if(paymentNum < 0) {
				$.toast('请填写实缴金额');
				return;
			}
			if(subtotalNum < discountNum + paymentNum) {
				$.toast('实缴与优惠的和必须小于等于小计');
				return;
			}
			//			if(selectPersonnelId == "") {
			//				$.toast('请选择教务老师');
			//				return;
			//			}
			var account = app.getAccount();
			if(account) {
				var enrollRequest = {
					org_id: account.org_id,
					camp_id: account.campus_id,
					lesson_id: selectlessonId,
					lesson_name: selectlesson.innerHTML,
					lesson_price: isNaN(parseFloat(lesson_price.value, 10)) ? 0 : parseFloat(lesson_price.value, 10),
					lesson_type: Lessontype,
					lesson_number: isNaN(parseFloat(lesson_number.value, 10)) ? 0 : parseFloat(lesson_number.value, 10),
					stu_id: selectStudentId,
					stu_name: selectStudent.innerHTML,
					payment: paymentNum,
					arrears: subtotalNum - discountNum - paymentNum,
					discount: discountNum,
					description: description.value,
					create_by: account.id,
					create_name: account.name,
					create_time: payDate.value
				}
				var payRequest = {
					data: JSON.stringify(enrollRequest),
					dean_id: selectPersonnelId,
					dean_name: selectdean.innerHTML
				}
				console.log(JSON.stringify(payRequest));

				var waiting = plus.nativeUI.showWaiting();
				app.SaveEnroll(payRequest, function(data) {
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
	})
})(mui, document)