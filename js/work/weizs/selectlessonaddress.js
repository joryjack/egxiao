(function($, doc) {
	$.init({
		swipeBack: false
	});

	$.plusReady(function() {
		var map = null;
		var city = "重庆市";

		map = new plus.maps.Map("map");
		mui('.mui-scroll-wrapper').scroll();
		/**
		 * 获取对象属性的值
		 * 主要用于过滤三级联动中，可能出现的最低级的数据不存在的情况，实际开发中需要注意这一点；
		 * @param {Object} obj 对象
		 * @param {String} param 属性名
		 */
		var _getParam = function(obj, param) {
			return obj[param] || '';
		};

		var cityulHTML = doc.getElementById("cityul");
		var address_form = doc.getElementById("address_form");
		var select_msg = doc.getElementById("select_msg");
		var saveNav = doc.getElementById("saveNav");

		var saveBtn = doc.getElementById("saveBtn");

		var searchMapResultHTML = doc.getElementById("searchMapResult");
		var searchMapResultul = doc.getElementById("searchMapResultul");

		var showCityPickerButton = doc.getElementById("showCityPicker");

		var saveSearchNav = doc.getElementById("saveSearchNav");

		var cancel = doc.getElementById("cancel");
		var confirm = doc.getElementById("confirm");
		var verifyAddress = doc.getElementById("verifyAddress");

		var street = doc.getElementById("street");
		var houseNumber = doc.getElementById("houseNumber");

		var cityResult = doc.getElementById('cityResult');
		var select_city = doc.getElementById("select_city");
		var select_street = doc.getElementById("select_street");

		puahData();

		var cityPicker3 = new $.PopPicker({
			layer: 3
		});

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
			$.fire(organizationinfowebview, 'pushlessonAddressdata', {});
			self.close();

		}, false);
		cityPicker3.setData(cityData3);

		showCityPickerButton.addEventListener('tap', function(event) {
			cityPicker3.show(function(items) {

				cityResult.innerText = _getParam(items[1], 'text') + _getParam(items[2], 'text');
				city = _getParam(items[1], 'text');
				var address_formClassList = address_form.classList;
				address_formClassList.remove("mui-hidden");

				var saveNavClassList = saveNav.classList;
				saveNavClassList.remove("mui-hidden");
				select_city.innerText = cityResult.innerText;
				//返回 false 可以阻止选择框的关闭
				//return false;
			});
		}, false);

		//street 输入事件
		street.addEventListener("input", function(event) {
			//if(street.value.trim() != "") {

			var searchMapResultHTMLClassList = searchMapResultHTML.classList;

			if(street.value.trim() == "") {
				var select_msgClassList = select_msg.classList;
				select_msgClassList.add("mui-hidden");
			}
			searchMap(street.value.trim());

			//}

		}, false);

		street.addEventListener("focus", function() {
			var cityulHTMLClassList = cityulHTML.classList;
			cityulHTMLClassList.add("mui-hidden");

			var searchMapResultHTMLClassList = searchMapResultHTML.classList;
			searchMapResultHTMLClassList.remove("mui-hidden");

			saveSearchNavClassList = saveSearchNav.classList;
			saveSearchNavClassList.remove("mui-hidden");

		}, false);
		//取消
		cancel.addEventListener("tap", function() {
			var cityulHTMLClassList = cityulHTML.classList;
			cityulHTMLClassList.remove("mui-hidden");
			searchMapResultul.innerHTML = "";
			street.value = "";
			var searchMapResultHTMLClassList = searchMapResultHTML.classList;
			searchMapResultHTMLClassList.remove("mui-hidden");
			searchMapResultHTMLClassList.add("mui-hidden");

			saveSearchNavClassList = saveSearchNav.classList;
			saveSearchNavClassList.add("mui-hidden");

		}, false);

		//门牌号
		houseNumber.addEventListener("input", function() {
			select_street.innerHTML = street.value + houseNumber.value;
		}, false);

		verifyAddress.addEventListener("tap", function() {
			var $setlessonAddressPoint = app.getSetlessonAddressPoint();
			if($setlessonAddressPoint.longitude == 0 && $setlessonAddressPoint.latitude == 0) {
				$.toast("当前选择的地址 未识别，请重新选择");
				return;
			}

			var lessonaddressmapPage = $.preload({
				"id": 'lesson_address_map.html',
				"url": 'lesson_address_map.html'
			});
			lessonaddressmapPage.show("zoom-fade-out");

		}, false);

		confirm.addEventListener("tap", function() {
			var cityulHTMLClassList = cityulHTML.classList;
			cityulHTMLClassList.remove("mui-hidden");
			searchMapResultul.innerHTML = "";

			var searchMapResultHTMLClassList = searchMapResultHTML.classList;
			searchMapResultHTMLClassList.remove("mui-hidden");
			searchMapResultHTMLClassList.add("mui-hidden");

			saveSearchNavClassList = saveSearchNav.classList;
			saveSearchNavClassList.add("mui-hidden");

		}, false);

		$(".searchMapResultul").on('tap', 'li', function() {
			var positionModelStr = this.dataset.model;
			console.log(positionModelStr);
			var positionModel = JSON.parse(positionModelStr);
			var reg = /(.*?)[省市区县]/ig;
			var address = positionModel.address;
			var result = address.match(reg);
			if(result) {
				var cityAnddistrict = "";
				switch(result.length) {
					case 3:
						if(result[1].match(/(.+?)[区县]/)) {
							cityAnddistrict = result[0] + result[1];
						} else {
							cityAnddistrict = result[1] + result[2];
						}
						break;
					case 2:
						if(result[1].match(/(.+?)[区县]/)) {
							cityAnddistrict = result[0] + result[1];
						}
						break;
					default:
						break;
				}
				console.log(cityAnddistrict);
				if(cityAnddistrict != "") {
					cityResult.innerText = cityAnddistrict;
					select_city.innerText = cityResult.innerText;
				}

			}
			street.value = positionModel.name;
			var $setlessonAddressPoint = app.getSetlessonAddressPoint();
			$setlessonAddressPoint.longitude = positionModel.point.longitude;
			$setlessonAddressPoint.latitude = positionModel.point.latitude;

			localStorage.setItem("$setlessonAddressPoint", JSON.stringify($setlessonAddressPoint));

			var select_msgClassList = select_msg.classList;
			select_msgClassList.remove("mui-hidden");

			select_street.innerHTML = positionModel.name  + houseNumber.value;;

			var select_streetClassList = select_street.classList;
			select_streetClassList.remove("mui-hidden");

			select_streetClassList = saveBtn.classList;

			select_streetClassList.remove("mui-btn-ronschool");
			select_streetClassList.remove("mui-btn-deafult");
			select_streetClassList.remove("mui-disabled");
			select_streetClassList.add("mui-btn-ronschool");

		});

		saveBtn.addEventListener("tap", function() {
			if(houseNumber.value.trim() == "") {
				$.toast("请填写门牌号");
				return;
			}

			var $setlessonAddressPoint = app.getSetlessonAddressPoint();
			if($setlessonAddressPoint.longitude == 0 && $setlessonAddressPoint.latitude == 0) {
				$.toast("当前选择的地址 未识别，请重新选择");
				return;
			}

			var lessonAddressInfo = {
				city: city,
				cityanddistrict: select_city.innerText,
				street: street.value,
				streetNum: houseNumber.value,
				longitude: $setlessonAddressPoint.longitude,
				latitude: $setlessonAddressPoint.latitude
			}
			localStorage.setItem("$lessonAddressInfo", JSON.stringify(lessonAddressInfo));
			$.back();

		}, false);

		function searchMap(key) {
			//地图检索
			var searchObj = new plus.maps.Search(map);
			//设置检索返回结果每页的信息数目
			searchObj.setPageCapacity(20);
			//城市兴趣点检索
			searchObj.poiSearchInCity(city, key);
			searchObj.onPoiSearchComplete = function(state, result) {
				console.log("onPoiSearchComplete: " + state + " , " + result.currentNumber);
				if(state == 0) {
					if(result.currentNumber <= 0) {
						console.log("没有检索到结果");
					}
					var liHTML = "";
					for(var i = 0; i < result.currentNumber; i++) {
						var pos = result.getPosition(i);
						liHTML += '<li data-model=\'' + JSON.stringify(pos) + '\' class="mui-table-view-cell"><a>' + pos.name + '</a></li>';
					}
					console.log(liHTML);
					searchMapResultul.innerHTML = liHTML;

				} else {
					console.log("检索失败");
				}
			}
		}

		function puahData() {
			var lessonAddressInfodata = app.getLessonAddressInfo();

			city = lessonAddressInfodata.city;
			console.log(JSON.stringify(lessonAddressInfodata));
			console.log(JSON.stringify(lessonAddressInfodata.cityanddistrict));

			if(lessonAddressInfodata.cityanddistrict != null && lessonAddressInfodata.cityanddistrict != "") {
				cityResult.innerText = lessonAddressInfodata.cityanddistrict;
				select_city.innerText = lessonAddressInfodata.cityanddistrict;
				var address_formClassList = address_form.classList;
				address_formClassList.remove("mui-hidden");

			}

			if(lessonAddressInfodata.street != null && lessonAddressInfodata.street != "") {
				street.value = lessonAddressInfodata.street;
				select_street.innerHTML = lessonAddressInfodata.street + lessonAddressInfodata.streetNum;

				var select_streetClassList = select_street.classList;
				select_streetClassList.remove("mui-hidden");

				select_streetClassList = saveBtn.classList;
				select_streetClassList.remove("mui-btn-ronschool");
				select_streetClassList.remove("mui-btn-deafult");
				select_streetClassList.remove("mui-disabled");
				select_streetClassList.add("mui-btn-ronschool");

				var select_msgClassList = select_msg.classList;
				select_msgClassList.remove("mui-hidden");

			}

			if(lessonAddressInfodata.streetNum != null && lessonAddressInfodata.streetNum != "") {
				houseNumber.value = lessonAddressInfodata.streetNum;
			}

			var $setlessonAddressPoint = app.getSetlessonAddressPoint();
			$setlessonAddressPoint.longitude = $setlessonAddressPoint.longitude;
			$setlessonAddressPoint.latitude = $setlessonAddressPoint.latitude;
			localStorage.setItem("$setlessonAddressPoint", JSON.stringify($setlessonAddressPoint));
		}

	});
})(mui, document)