(function($, doc) {
	$.init();

	$.plusReady(function() {

		cleardata();
		var rightBar = doc.getElementById("rightBar");
		var shortname = doc.getElementById("shortname");
		var selectlesson = doc.getElementById('selectlesson');

		var zslesson_name = doc.getElementById('zslesson_name');
		var zslesson_type = doc.getElementById('zslesson_type');
		var zslesson_price = doc.getElementById('zslesson_price');
		var zslesson_type = doc.getElementById('zslesson_type');
		var zslesson_price = doc.getElementById('zslesson_price');

		var setlightspot = doc.getElementById('setlightspot');
		var setapplystudent = doc.getElementById('setapplystudent');
		var setlessonaddress = doc.getElementById('setlessonaddress');
		var setabstracts = doc.getElementById('setabstracts');

		var saveZslesson = doc.getElementById('saveZslesson');

		var readAgreement = doc.getElementById('readAgreement');

		var selectlessonId = "",
			Lessontype = "";
		var lesson_num = 0;

		var self = plus.webview.currentWebview();

		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			var zslessonwebview = plus.webview.getWebviewById('zslesson.html');
			$.fire(zslessonwebview, 'reloaddata', {});
			self.close();
		}, false);

		//加载机构 信息
		puahData();
		//选课程
		selectlesson.addEventListener('tap', function() {

			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}

			var select_lesson_mainPage = $.preload({
				"id": 'zsselect_lesson_main.html',
				"url": 'zsselect_lesson_main.html'
			});
			var weizsselectLessonInfo = {
				"selectlessonId": selectlessonId,
				"action": "addzsslesson",
				"enable_flag": "1"
			}
			localStorage.setItem('$weizsselectLessonInfo', JSON.stringify(weizsselectLessonInfo));
			var select_lesson_listwebview = plus.webview.getWebviewById('zsselect_lesson_list.html');
			$.fire(select_lesson_listwebview, 'getParameter', {
				id: selectlessonId
			});
			$.fire(select_lesson_mainPage, 'getParameter', {});
			select_lesson_mainPage.show("zoom-fade-out");
		});

		window.addEventListener('selectLessonParameter', function(options) {
			if(options.detail.id) {
				selectlessonId = options.detail.id;
				zslesson_name.innerHTML = options.detail.name;
				zslesson_price.innerHTML = options.detail.price;
				Lessontype = options.detail.type;
				lesson_num = options.detail.lesson_num;
				switch(Lessontype) {
					case "1": //学时
						zslesson_type.innerHTML = "课时";
						break;
					case "2":
						zslesson_type.innerHTML = "课时包";
						break;
					default:
						break;
				}

			}
		});

		//课程亮点
		setlightspot.addEventListener('tap', function() {
			localStorage.setItem('$zsbAction', JSON.stringify({
				"action": "addlesson"
			}));
			var set_lightspotPage = $.preload({
				"id": 'set_lightspot.html',
				"url": 'set_lightspot.html'
			});
			set_lightspotPage.show("zoom-fade-out");
		});

		window.addEventListener('pushlightspotdata', function(options) {
			var lightspotdata = app.getSetlightspot();
			console.log(JSON.stringify(lightspotdata));
			if(lightspotdata.lightspot != null && lightspotdata.lightspot != "") {
				setlightspot.innerHTML = ' <span class="mui-pull-left">课程亮点</span><span class="mui-pull-right roundcheckfill mui-icon iconfont icon-roundcheckfill" ></span>';
			} else {
				setlightspot.innerHTML = '<span class="mui-pull-left">课程亮点</span><span class="mui-pull-right fontcolor-default">请填写</span>';
			}
		});
		//适合学员
		setapplystudent.addEventListener('tap', function() {
			localStorage.setItem('$zsbAction', JSON.stringify({
				"action": "addlesson"
			}));
			var set_applystudentPage = $.preload({
				"id": 'set_applystudent.html',
				"url": 'set_applystudent.html'
			});
			set_applystudentPage.show("zoom-fade-out");
		});

		window.addEventListener('pushapplystudentdata', function(options) {
			var applystudentdata = app.getSetapplystudent();
			if(applystudentdata.applystudent != null && applystudentdata.applystudent != "") {
				setapplystudent.innerHTML = '<span class="mui-pull-left">适合学员</span><span class="mui-pull-right roundcheckfill mui-icon iconfont icon-roundcheckfill" ></span>';
			} else {
				setapplystudent.innerHTML = '<span class="mui-pull-left">适合学员</span><span class="mui-pull-right fontcolor-default">请填写</span>';
			}
		});

		//上课地址
		setlessonaddress.addEventListener('tap', function() {
			localStorage.setItem('$zsbAction', JSON.stringify({
				"action": "addlesson"
			}));
			var selectlessoninfoPage = $.preload({
				"id": 'selectlessonaddress.html',
				"url": 'selectlessonaddress.html'
			});
			selectlessoninfoPage.show("zoom-fade-out");
		});

		window.addEventListener('pushlessonAddressdata', function(options) {

			var lessonAddressInfodata = app.getLessonAddressInfo();

			if(lessonAddressInfodata.longitude != 0 || lessonAddressInfodata.latitude != 0) {
				setlessonaddress.innerHTML = '<span class="mui-pull-left">上课地址</span><span id="lesson_address" style="width: 65%;" class="mui-pull-right mui-ellipsis  mui-text-right fontcolor-default">' + lessonAddressInfodata.cityanddistrict + lessonAddressInfodata.street + lessonAddressInfodata.streetNum + '</span>';
			} else {
				setlessonaddress.innerHTML = '<span class="mui-pull-left">上课地址</span><span id="lesson_address" style="width: 65%;" class="mui-pull-right mui-ellipsis  mui-text-right fontcolor-default">请选择</span>';
			}
		});

		//课程简介
		setabstracts.addEventListener('tap', function() {
			localStorage.setItem('$zsbAction', JSON.stringify({
				"action": "addlesson"
			}));
			var set_zslessonabstractsPage = $.preload({
				"id": 'set_zslessonabstracts.html',
				"url": 'set_zslessonabstracts.html'
			});
			set_zslessonabstractsPage.show("pop-in");
		});

		window.addEventListener('pushzslessonabstractsdata', function(options) {

			var zslessonabstractsdata = app.getSetzslessonabstracts();
			if(zslessonabstractsdata.abstracts != null && zslessonabstractsdata.abstracts != "") {
				setabstracts.innerHTML = '<span class="mui-pull-left">课程简介</span><span class="mui-pull-right roundcheckfill mui-icon iconfont icon-roundcheckfill" ></span>';
			} else {
				setabstracts.innerHTML = '<span class="mui-pull-left">课程简介</span><span class="mui-pull-right fontcolor-default">请填写</span>';
			}
		});

		readAgreement.addEventListener('tap', function() {
			var agreementPage = $.preload({
				"id": 'agreement.html',
				"url": 'agreement.html'
			});
			agreementPage.show("zoom-fade-out");
		});

		//发布招生课程
		rightBar.addEventListener('tap', function() {
			saveData();
		});

		saveZslesson.addEventListener('tap', function() {
			saveData();
		});

		function saveData() {
			if(selectlessonId == "") {
				$.toast("请选择课程");
				return;
			}

			var lightspotdata = app.getSetlightspot();
			if(lightspotdata.lightspot == null || lightspotdata.lightspot == "") {
				$.toast("请简要说明课程亮点");
				return;
			}

			var applystudentdata = app.getSetapplystudent();
			if(applystudentdata.applystudent == null || applystudentdata.applystudent == "") {
				$.toast("请简要说明课程适合学员");
				return;
			}

			var lessonAddressInfodata = app.getLessonAddressInfo();
			if(lessonAddressInfodata.longitude == 0 && lessonAddressInfodata.latitude == 0) {
				$.toast("请填写上课地址");
				return;
			}

			var zslessonabstractsdata = app.getSetzslessonabstracts();
			if(zslessonabstractsdata.abstracts == null || zslessonabstractsdata.abstracts == "") {
				$.toast("请填写课程简介  ");
				return;
			}
			var account = app.getAccount();
			var zslessonRequest = {
				org_id: account.org_id,
				lesson_id: selectlessonId,
				lesson_name: zslesson_name.innerHTML,
				apply_student: applystudentdata.applystudent,
				lightspot: lightspotdata.lightspot,
				abstracts: zslessonabstractsdata.abstracts,
				cityanddistrict: lessonAddressInfodata.cityanddistrict,
				street: lessonAddressInfodata.street,
				streetNum: lessonAddressInfodata.streetNum,
				longitude: lessonAddressInfodata.longitude,
				latitude: lessonAddressInfodata.latitude,
				price: isNaN(parseFloat(zslesson_price.innerHTML, 10)) ? 0 : parseFloat(zslesson_price.innerHTML, 10),
				type: Lessontype,
				lesson_num: lesson_num,
				create_by: account.id
			};

			console.log(JSON.stringify(zslessonRequest));

			var waiting = plus.nativeUI.showWaiting();
			app.SaveZslesson(zslessonRequest, function(data) {
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
		}

		function puahData() {
			var weiZSInfodata = app.getWeiZSInfodata();

			if(weiZSInfodata.weiZSPerResponse.organization.shortname != null) {
				shortname.innerHTML = weiZSInfodata.weiZSPerResponse.organization.shortname;
			}

		}

		function cleardata() {
			var $setlightspot = {
				lightspot: ""
			}
			localStorage.setItem("$setlightspot", JSON.stringify($setlightspot));
			var $setapplystudent = {
				applystudent: ""
			}
			localStorage.setItem("$setapplystudent", JSON.stringify($setapplystudent));

			var $setzslessonabstracts = {
				abstracts: ""
			}
			localStorage.setItem("$setzslessonabstracts", JSON.stringify($setzslessonabstracts));

			var $setlessonAddressPoint = {
				longitude: 0,
				latitude: 0
			}
			localStorage.setItem("$setlessonAddressPoint", JSON.stringify($setlessonAddressPoint));

			var lessonAddressInfo = {
				city: "",
				cityanddistrict: "",
				street: "",
				streetNum: "",
				longitude: 0,
				latitude: 0
			}
			localStorage.setItem("$lessonAddressInfo", JSON.stringify(lessonAddressInfo));
		}
		//getGeocode();

	});

})(mui, document)