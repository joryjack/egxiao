(function($, doc) {
	$.init();
	$.plusReady(function() {
		var self = plus.webview.currentWebview();

		var rightBar = doc.getElementById("rightBar");
		var table = doc.body.querySelector('.mui-table-view');
		var $class = app.getClass();
		var nodata = doc.body.querySelector('.nodata');
		if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
			plus.nativeUI.toast('网络不给力，请检查网络设置');
			return;
		}
		var account = app.getAccount();
		var noClassStudentRequest = {
			org_id: account.org_id,
			camp_id: account.campus_id,
			class_id: $class.id,
			lesson_id: $class.lesson_id
		}
        
        console.log(JSON.stringify(noClassStudentRequest) );
		if(JSON.stringify(account) == "{}") {
			$.toast("数据丢失");
			return;
		}
		
		//为页面添加事件监听hide
		self.addEventListener('hide', function() {
			var detailclasswebview = plus.webview.getWebviewById('detail_class.html');
			$.fire(detailclasswebview, 'reloaddetailclass', {});
			self.close();
		}, false);
		
		nodata.style.display = "none";
		var waiting = plus.nativeUI.showWaiting();
		app.GetNOClassStudent(noClassStudentRequest, function(data) {
			waiting.close();
			if(data.length == "0") {
				nodata.style.display = "block";
			} else {
				pushStudentHTML(data);
			}
		})

		function pushStudentHTML(data) {
			var liHTML = "";
			for(var i = 0; i < data.length; i++) {
				var _totalNum = data[i].totalNum == null ? 0 : data[i].totalNum;
				var _useNum = data[i].useNum == null ? 0 : data[i].useNum;
				liHTML += '<li class="mui-table-view-cell mui-checkbox mui-left"><input name="checkbox" value="' + data[i].id + '" type="checkbox">	<a class="mui-navigate"><div class="oa-contact-cell mui-table"><div class="oa-contact-avatar mui-table-cell"><img src="../images/50x50s.png" style=" width: 45px;" /></div>  <div class="oa-contact-content mui-table-cell"><div class="mui-clearfix"><h4 class="oa-contact-name">' + data[i].name + '</h4></div>'+lesssonDetailHTML($class.lesson_type, _totalNum, _useNum) +' </div></div></a> </li>';
                  //<p class="oa-contact-email mui-h6">	<span>上课：' + (data[i].noteLesson == null ?"无":app.ConvertJsonTime(data[i].noteLesson.lesson_time)) + '</span></p>
			}
			table.innerHTML = liHTML;
		}

          /**
		 * 学员课程详情
		 */
		function lesssonDetailHTML(lesson_type, totalNum, useNum) {
			var _lesssonDetailHTML = "";
			if(lesson_type == "1" || lesson_type == "2") {
				_lesssonDetailHTML = '<p class="oa-contact-email mui-h6"><div class="mui-row mui-h6"><div class="mui-col-xs-4">总：<span>' + totalNum + '</span></div><div class="mui-col-xs-4">消：<span>' + useNum + '</span></div><div class="mui-col-xs-4">剩：<span>' + (totalNum - useNum) + '</span></div></div></p>';
			}
			return _lesssonDetailHTML
		}
		rightBar.addEventListener('tap', function(event) {
			var studentIdList = [];
			var inputList = document.querySelectorAll('input');
			$.each(inputList, function(index, item) {
				if(item.checked) {
					studentIdList.push(item.value);
				}
			});
			if(studentIdList.length == 0) {
				$.toast("请选择学员");
				return;
			}
			var classStudentRequest = {
				org_id: account.org_id,
				class_id: $class.id,
				studentIds: studentIdList,
				create_by: account.id
			}
		
			var waiting = plus.nativeUI.showWaiting();
			app.SaveClassStudent(classStudentRequest, function(data) {
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

		});
	});
})(mui, document)