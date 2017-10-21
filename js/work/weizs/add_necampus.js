(function($, doc) {
	$.init();

	$.plusReady(function() {

		cleardata();
		var rightBar = doc.getElementById("rightBar");
		
		var selectnecampus = doc.getElementById('selectnecampus');

		var necampus_name = doc.getElementById('necampus_name');
		var subjectWord = doc.getElementById('subjectWord');
		var findStuPhone = doc.getElementById('findStuPhone');
		var setnecampusaddress = doc.getElementById('setnecampusaddress');

		var saveNeCampus = doc.getElementById('saveNeCampus');

		var readAgreement = doc.getElementById('readAgreement');

		var selectlnecampusId = "";

		var self = plus.webview.currentWebview();

		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			var zslessonwebview = plus.webview.getWebviewById('orgnearedulist.html');
			$.fire(zslessonwebview, 'reloaddata', {});
			self.close();
		}, false);

		//加载机构 信息
		puahData();
		//入驻校区
		selectnecampus.addEventListener('tap', function() {

			if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('网络不给力，请检查网络设置');
				return;
			}

			var selectCamupsmainPage = $.preload({
				"id": 'neselect_campus_main.html',
				"url": 'neselect_campus_main.html'
			});
			var enable_flag = ["1"];
			var neSelectCampusInfo = {
				"selectlnecampusId": selectlnecampusId,
				"action": "addnecampus",
				"enable_flag": enable_flag
			}
			localStorage.setItem('$neSelectCampusInfo', JSON.stringify(neSelectCampusInfo));
			var neselect_campus_listwebview = plus.webview.getWebviewById('neselect_campus_list.html');
			$.fire(neselect_campus_listwebview, 'getParameter', {
				id: selectlnecampusId
			});
			$.fire(selectCamupsmainPage, 'getParameter', {});
			selectCamupsmainPage.show("zoom-fade-out");
		});

		window.addEventListener('selectCampusParameter', function(options) {
			if(options.detail.id) {
				selectlnecampusId = options.detail.id;
				necampus_name.innerHTML = options.detail.name;
			}
		});

		//开设课程
		subjectWord.addEventListener('tap', function() {
			localStorage.setItem('$zsbAction', JSON.stringify({
				"action": "addCampus"
			}));
			var setSubjectWordPage = $.preload({
				"id": 'set_subjectWord.html',
				"url": 'set_subjectWord.html'
			});
			setSubjectWordPage.show("zoom-fade-out");
		});

		window.addEventListener('pushSubjectWorddata', function(options) {
			var subjectWordData = app.getSetSubjectWord();

			if(subjectWordData.subjectWord != null && subjectWordData.subjectWord != "") {
				subjectWord.innerHTML = ' <span class="mui-pull-left">开设课程</span><span class="mui-pull-right roundcheckfill mui-icon iconfont icon-roundcheckfill" ></span>';
			} else {
				subjectWord.innerHTML = '<span class="mui-pull-left">开设课程</span><span class="mui-pull-right fontcolor-default">请填写</span>';
			}
		});
		//招生电话
		findStuPhone.addEventListener('tap', function() {
			localStorage.setItem('$zsbAction', JSON.stringify({
				"action": "addCampus"
			}));
			var set_applystudentPage = $.preload({
				"id": 'set_campustel.html',
				"url": 'set_campustel.html'
			});
			set_applystudentPage.show("zoom-fade-out");
		});

		window.addEventListener('pushcampusteldata', function(options) {
			var campusteldata = app.getSetcampustel();
			if(campusteldata.campustel != null && campusteldata.campustel != "") {
				findStuPhone.innerHTML = '<span class="mui-pull-left">招生电话</span><span class="mui-pull-right roundcheckfill mui-icon iconfont icon-roundcheckfill" ></span>';
			} else {
				findStuPhone.innerHTML = '<span class="mui-pull-left">招生电话</span><span class="mui-pull-right fontcolor-default">请填写</span>';
			}
		});

		//校区地址
		setnecampusaddress.addEventListener('tap', function() {
			localStorage.setItem('$zsbAction', JSON.stringify({
				"action": "addCampus"
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
				setnecampusaddress.innerHTML = '<span class="mui-pull-left">校区地址</span><span id="lesson_address" style="width: 65%;" class="mui-pull-right mui-ellipsis  mui-text-right fontcolor-default">' + lessonAddressInfodata.cityanddistrict + lessonAddressInfodata.street + lessonAddressInfodata.streetNum + '</span>';
			} else {
				setnecampusaddress.innerHTML = '<span class="mui-pull-left">校区地址</span><span id="lesson_address" style="width: 65%;" class="mui-pull-right mui-ellipsis  mui-text-right fontcolor-default">请选择</span>';
			}
		});

		readAgreement.addEventListener('tap', function() {
			var agreementPage = $.preload({
				"id": 'ne_agreement.html',
				"url": 'ne_agreement.html'
			});
			agreementPage.show("zoom-fade-out");
		});

		//发布招生课程
		rightBar.addEventListener('tap', function() {
			saveData();
		});

		saveNeCampus.addEventListener('tap', function() {
			saveData();
		});

		function saveData() {
			if(selectlnecampusId == "") {
				$.toast("请选择入住校区");
				return;
			}

			var subjectWordData = app.getSetSubjectWord();
			
			if(subjectWordData.subjectWord == null || subjectWordData.subjectWord  == "") {
				$.toast("请填写开设课程");
				return;
			}
			
			var campusteldata = app.getSetcampustel();
			if(campusteldata.campustel == null || campusteldata.campustel == "") {
				$.toast("请简填写招生电话");
				return;
			}

			var lessonAddressInfodata = app.getLessonAddressInfo();
			if(lessonAddressInfodata.longitude == 0 && lessonAddressInfodata.latitude == 0) {
				$.toast("请填写校区地址");
				return;
			}

			var account = app.getAccount();
			var neCampusRequest = {
				id:selectlnecampusId,
				org_id: account.org_id,
				subject_word: subjectWordData.subjectWord ,
				phone: campusteldata.campustel,
				cityanddistrict: lessonAddressInfodata.cityanddistrict,
				street: lessonAddressInfodata.street,
				streetNum: lessonAddressInfodata.streetNum,
				longitude: lessonAddressInfodata.longitude,
				latitude: lessonAddressInfodata.latitude,
				update_by: account.id,
				enable_flag:"2"
			};

			console.log(JSON.stringify(neCampusRequest));

			var waiting = plus.nativeUI.showWaiting();
			app.SaveNECampus(neCampusRequest, function(data) {
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
			var $setcampustel = {
				campustel: ""
			}
			localStorage.setItem("$setcampustel", JSON.stringify($setcampustel));

			var $setsubjectWord = {
				subjectWord: ""
			}
			localStorage.setItem("$setsubjectWord", JSON.stringify($setsubjectWord));

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