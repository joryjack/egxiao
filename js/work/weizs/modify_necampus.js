(function($, doc) {
	$.init({
		swipeBack: false
	});

	$.plusReady(function() {

		cleardata();
		var rightBar = doc.getElementById("rightBar");
		
		var selectnecampus = doc.getElementById('selectnecampus');

		var necampus_name = doc.getElementById('necampus_name');
		var subjectWord = doc.getElementById('subjectWord');
		var findStuPhone = doc.getElementById('findStuPhone');
		var setnecampusaddress = doc.getElementById('setnecampusaddress');

		var saveNeCampus = doc.getElementById('saveNeCampus');
		var selectlnecampusId = "";

		//加载机构 信息
		puahData();

		var self = plus.webview.currentWebview();
		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			var detailnecampuswebview = plus.webview.getWebviewById('detail_campus.html');
			$.fire(detailnecampuswebview, 'reloaddata', {});
			self.close();
		}, false);

		//开设课程
		subjectWord.addEventListener('tap', function() {
			localStorage.setItem('$zsbAction', JSON.stringify({
				"action": "modifyCampus"
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
				"action": "modifyCampus"
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
				"action": "modifyCampus"
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
				update_by: account.id
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
						var necampusModel = app.getNecampusModel();
						necampusModel.subject_word = subjectWordData.subjectWord;
						necampusModel.phone =  campusteldata.campustel;
					
						necampusModel.cityanddistrict = lessonAddressInfodata.cityanddistrict;
						necampusModel.street = lessonAddressInfodata.street;
						necampusModel.streetNum = lessonAddressInfodata.streetNum;
						necampusModel.longitude = lessonAddressInfodata.longitude;
						necampusModel.latitude = lessonAddressInfodata.latitude;
						localStorage.setItem("$necampusModel", JSON.stringify(necampusModel));

						$.back();
					} else {
						$.toast(data.msg);
					}
				}
			});
		}

		function puahData() {
			var weiZSInfodata = app.getWeiZSInfodata();
			var necampusModel = app.getNecampusModel();
			if(weiZSInfodata.weiZSPerResponse.organization.shortname != null) {
				shortname.innerHTML = weiZSInfodata.weiZSPerResponse.organization.shortname;
			}

			selectlnecampusId = necampusModel.id;
			necampus_name.innerHTML = necampusModel.name;
			
			var subjectWordData = app.getSetSubjectWord();
			subjectWordData.subjectWord = necampusModel.subject_word;
			localStorage.setItem("$setsubjectWord", JSON.stringify(subjectWordData));
			
			if(subjectWordData.subjectWord != null && subjectWordData.subjectWord != "") {
				subjectWord.innerHTML = ' <span class="mui-pull-left">开设课程</span><span class="mui-pull-right roundcheckfill mui-icon iconfont icon-roundcheckfill" ></span>';
			} else {
				subjectWord.innerHTML = '<span class="mui-pull-left">开设课程</span><span class="mui-pull-right fontcolor-default">请填写</span>';
			}

			var campusteldata = app.getSetcampustel();
			campusteldata.campustel= necampusModel.phone;
			localStorage.setItem("$setcampustel", JSON.stringify(campusteldata));
			if(campusteldata.campustel != null && campusteldata.campustel != "") {
				findStuPhone.innerHTML = '<span class="mui-pull-left">招生电话</span><span class="mui-pull-right roundcheckfill mui-icon iconfont icon-roundcheckfill" ></span>';
			} else {
				findStuPhone.innerHTML = '<span class="mui-pull-left">招生电话</span><span class="mui-pull-right fontcolor-default">请填写</span>';
			}

			var lessonAddressInfodata = app.getLessonAddressInfo();
			lessonAddressInfodata.city = "";
			lessonAddressInfodata.cityanddistrict = necampusModel.cityanddistrict;
			lessonAddressInfodata.street = necampusModel.street;
			lessonAddressInfodata.streetNum = necampusModel.streetNum;
			lessonAddressInfodata.longitude = necampusModel.longitude;
			lessonAddressInfodata.latitude = necampusModel.latitude;
			localStorage.setItem("$lessonAddressInfo", JSON.stringify(lessonAddressInfodata));

			var $setlessonAddressPoint = app.getSetlessonAddressPoint();
			$setlessonAddressPoint.longitude = necampusModel.longitude;
			$setlessonAddressPoint.latitude = necampusModel.latitude;
			localStorage.setItem("$setlessonAddressPoint", JSON.stringify($setlessonAddressPoint));

			if(lessonAddressInfodata.longitude != 0 || lessonAddressInfodata.latitude != 0) {
				setnecampusaddress.innerHTML = '<span class="mui-pull-left">校区地址</span><span id="lesson_address" style="width: 65%;" class="mui-pull-right mui-ellipsis  mui-text-right fontcolor-default">' + lessonAddressInfodata.cityanddistrict + lessonAddressInfodata.street + lessonAddressInfodata.streetNum + '</span>';
			} else {
				setnecampusaddress.innerHTML = '<span class="mui-pull-left">校区地址</span><span id="lesson_address" style="width: 65%;" class="mui-pull-right mui-ellipsis  mui-text-right fontcolor-default">请选择</span>';
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