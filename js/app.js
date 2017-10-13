(function($, owner) {

	/*
	 * 通用Funcation
	 */
	var httpurl = "https://api.egxiao.com:8443/";
	httpurl = "http://apitemp.egxiao.com/";
	var re = new RegExp("^(?![0-9@#$%^&*()+=|{}':;',\\[\\].<>/?~！!@#￥%……&*（）——+|{}【】‘；：”“’。，、？]+$)(?![a-zA-Z@#$%^&*()+=|{}':;',\\[\\].<>/?~！!@#￥%……&*（）——+|{}【】‘；：”“’。，、？]+$)[0-9A-Za-z@#$%^&*()+=|{}':;',\\[\\].<>/?~！!@#￥%……&*（）——+|{}【】‘；：”“’。，、？]{6,18}$");
	var chrnum = /^1[3,4,5,7,8]\d{9}$/; //手机号
	var decimalreg = /^\d+(\.\d{1,2})?$/;
	var serviceCode = "joryjack";
	//校验密码
	owner.validatePassword = function(password) {
		return re.test(password);
	}
	//校验手机号
	owner.validatePhone = function(phone) {
		return chrnum.test(phone);
	}
	//设置Code
	owner.setCode = function(servicevalidateCode) {
		serviceCode = servicevalidateCode;
		var time = 600,
			timer = setInterval(function() {
				--time, time <= 0 && (serviceCode = "joryjack", clearInterval(timer));
			}, 1e3); //十分钟内有效
	}
	//获取Code
	owner.checkCode = function(validateCode) {
		console.log(serviceCode);
		return serviceCode == validateCode;
	}

	owner.textareaFn = function(parameter) {
		//定义变量
		var $textareaId = parameter.textareaId; //textarea的class
		var $numberId = parameter.numberId; //数字的class
		var $maxNumber = parameter.maxNumber; //数字的最大数目

		var $thistextareaId = document.getElementById($textareaId);
		var $thisnumberId = document.getElementById($numberId);
		$thistextareaId.addEventListener("input", function() {
			numChange();
		});

		/**
		 * 判断是不是中文
		 * @param {Object} str
		 */
		function isChinese(str) {
			var reCh = /[u00-uff]/;
			return !reCh.test(str);
		}

		function numChange() {
			var strlen = 0; //初始定义长度为0
			var txtval = $thistextareaId.value.trim();
			var tempTextVal = "";
			for(var i = 0; i < txtval.length; i++) {
				if(isChinese(txtval.charAt(i)) == true) {
					//中文为2个字符
					strlen = strlen + 2;
				} else {
					//英文一个字符
					strlen = strlen + 1;
				}
				if(Math.ceil(strlen / 2) <= $maxNumber) {
					tempTextVal += txtval.charAt(i);
				}
			}
			strlen = Math.ceil(strlen / 2); //中英文相加除2取整数
			if($maxNumber - strlen < 0) {
				$thisnumberId.innerHTML = $maxNumber;
				$thistextareaId.value = tempTextVal;
			} else {

				$thisnumberId.innerHTML = strlen;
			}
		}
	}
	/**
	 * 数组元素判存
	 * @param {Object} arr
	 * @param {Object} value
	 */
	owner.isInArray = function(arr, value) {
		if(arr.indexOf && typeof(arr.indexOf) == 'function') {
			var index = arr.indexOf(value);
			if(index >= 0) {
				return true;
			}
		}
		return false;
	}

	/*
	 * 短信模板
	 */
	function getSmsTemplateCode(template_type) {
		switch(template_type) {
			case "register":
				return "SMS_16815287"; //注册
				break;
			case "resetpwd":
				return "SMS_16795240"; //修改密码
				break;
			case "activate":
				return "SMS_16795241" //激活
				break;
			default:
				break;
		}
	}
	//精确到分钟的本地时间
	owner.getNowFormatShortDate = function() {
		var date = new Date();
		var seperator1 = "-";
		var seperator2 = ":";
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		if(month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if(strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
			" " + date.getHours() + seperator2 + date.getMinutes();
		return currentdate;
	}

	owner.comptime = function(datetime) {
		var datetimeDate = new Date(datetime);
		var dateTimeNow = new Date();
		var b = false;
		var a = (datetimeDate - dateTimeNow) / 3600 / 1000;
		if(a < 0) {
			b = false;
		} else if(a > 0) {
			b = true;
		} else if(a == 0) {
			b = true;
		} else {
			b = false
		}
		return b;
	}
	//课程类型Code
	function getLessonTypeCode(typevalue) {
		var LessonTypeCode = ""
		switch(typevalue) {
			case "课时":
				LessonTypeCode = "1"
				break;
			case "课时包":
				LessonTypeCode = "2"
				break;
			default:
				break;
		}
		return LessonTypeCode;
	}
	
	owner.studentSexHTML = function(studentSexValue) {
		var studentSexHTML = ""

		switch(studentSexValue) {
			case "男":
				studentSexHTML = '<span class="mui-icon iconfont icon-male fontcolor-primary" style=" padding-left:5px; font-size:0.8em;"></span>'; 
				break;
			case "女":
				studentSexHTML = '<span class="mui-icon iconfont icon-female fontcolor-danger" style=" padding-left:5px;font-size:0.8em;"></span>'; 
				break;
		
			default:
				break;
		}

		return studentSexHTML;
	}
	//学员来源
	owner.getSourceCode = function getSourceCode(sourcevalue) {
		var sourceCode = ""
		switch(sourcevalue) {
			case "自然来电":
				sourceCode = "stuSource0001";
				break;
			case "转介绍":
				sourceCode = "stuSource0002";
				break;
			case "渠道合作":
				sourceCode = "stuSource0003";
				break;
			case "活动填单":
				sourceCode = "stuSource0004";
				break;
			case "自然来访":
				sourceCode = "stuSource0005";
				break;
			case "其他":
				sourceCode = "stuSource0006";
				break;
			case "微直招":
				sourceCode = "stuSource0007";
				break;
			case "户外广告":
				sourceCode = "stuSource0008";
				break;
			case "网络媒体":
				sourceCode = "stuSource0009";
				break;
			case "老学员":
				sourceCode = "stuSource0010";
				break;
			default:
				break;
		}
		return sourceCode;
	}

	owner.getSourceValue = function(sourcecode) {
		var sourceValue = ""
		switch(sourcecode) {
			case "stuSource0001":
				sourceValue = "自然来电";
				break;
			case "stuSource0002":
				sourceValue = "转介绍";
				break;
			case "stuSource0003":
				sourceValue = "渠道合作";
				break;
			case "stuSource0004":
				sourceValue = "活动填单";
				break;
			case "stuSource0005":
				sourceValue = "自然来访";
				break;
			case "stuSource0006":
				sourceValue = "其他";
				break;
			case "stuSource0007":
				sourceValue = "微直招";
				break;
			case "stuSource0008":
				sourceValue = "户外广告";
				break;
			case "stuSource0009":
				sourceValue = "网络媒体";
				break;
			case "stuSource0010":
				sourceValue = "老学员";
				break;
			default:
				break;
		}
		return sourceValue;
	}

	function getTalkStyle(talkStylevalue) {
		var talkStyleCode = ""
		switch(talkStylevalue) {
			case "打电话":
				talkStyleCode = "talkStyle0001";
				break;
			case "到访":
				talkStyleCode = "talkStyle0002";
				break;
			case "发短信":
				talkStyleCode = "talkStyle0003";
				break;
			case "微信":
				talkStyleCode = "talkStyle0004";
				break;

			default:
				break;
		}
		return talkStyleCode;
	}

	owner.getStudentState = function(statevalue) {
		var stateCode = ""
		switch(statevalue) {
			case "跟进中":
				stateCode = "stuState0001";
				break;
			case "已报名":
				stateCode = "stuState0002";
				break;
			case "无意向":
				stateCode = "stuState0003";
				break;
			case "已结课":
				stateCode = "stuState0004";
				break;
			case "已流失":
				stateCode = "stuState0005";
				break;
			default:
				break;
		}
		return stateCode;
	}
	owner.studentStateHTML = function(state) {
		var stateHTML = "";
		switch(state) {
			case "stuState0001":
				stateHTML = '<span class="label label-warning" >跟进中</span>';
				break;
			case "stuState0002":
				stateHTML = '<span class="label label-success" >已报名</span>';
				break;
			case "stuState0003":
				stateHTML = '<span class="label label-danger" >无意向</span>';
				break;
			case "stuState0004":
				stateHTML = '<span class="label label-primary" >已结课</span>';
				break;
			case "stuState0005":
				stateHTML = '<span class="label label-danger1" >已流失</span>';
				break;
			default:
				break;
		}
		return stateHTML;
	}

	owner.getNoteLessonStateCode = function(stateValue) {
		var stateCode = ""
		switch(stateValue) {
			case "上课":
				stateCode = "noleState0001";
				break;
			case "旷课":
				stateCode = "noleState0002";
				break;
			case "补课":
				stateCode = "noleState0003";
				break;
			case "请假不扣课":
				stateCode = "noleState0004";
				break;
			case "请假扣课":
				stateCode = "noleState0005";
				break;
			default:
				break;
		}
		return stateCode;
	}
	/*
	 * 上课状态
	 */
	owner.noteLessonStateHTML = function(state) {
		var stateHTML = "";
		switch(state) {
			case "noleState0001":
				stateHTML = '<span class="label label-success" >上课</span>';
				break;
			case "noleState0002":
				stateHTML = '<span class="label label-danger" >旷课</span>';
				break;
			case "noleState0003":
				stateHTML = '<span class="label label-primary" >补课</span>';
				break;
			case "noleState0004":
				stateHTML = '<span class="label label-warning" >请假不扣课</span>';
				break;
			case "noleState0005":
				stateHTML = '<span class="label label-danger1" >请假扣课</span>';
				break;
			default:
				break;
		}
		return stateHTML;
	}
	owner.getnoteLessonStateValue = function(state) {
		var stateHTML = "";
		switch(state) {
			case "noleState0001":
				stateHTML = '上课';
				break;
			case "noleState0002":
				stateHTML = '旷课';
				break;
			case "noleState0003":
				stateHTML = '补课';
				break;
			case "noleState0004":
				stateHTML = '请假不扣课';
				break;
			case "noleState0005":
				stateHTML = '请假扣课';
				break;
			default:
				break;
		}
		return stateHTML;
	}
	//上课方式
	function getNoteLessonStyleCode(styleValue) {
		var stateCode = ""
		switch(styleValue) {
			case "正式":
				stateCode = "1";
				break;
			case "体验":
				stateCode = "2";
				break;
			default:
				break;
		}
		return stateCode;
	}
	owner.getNoteLessonStyleValue = function(styleCode) {
		var stateValue = ""
		switch(styleCode) {
			case "1":
				stateValue = "正式";
				break;
			case "2":
				stateValue = "体验";
				break;
			default:
				break;
		}
		return stateValue;
	}
	//JsonTime转换
	owner.ConvertJsonTime = function(datetime) {
		if(datetime == null || datetime == "") {
			return "暂无"
		}
		return new Date(datetime).toISOString().replace(/T/g, ' ').replace(/:[\d]{2}\.[\d]{3}Z/, '');
	}
	owner.talkStyleHTML = function(state) {
		var talkStyleHTML = "";
		switch(state) {
			case "talkStyle0001":
				talkStyleHTML = '打电话';
				break;
			case "talkStyle0002":
				talkStyleHTML = '到访';
				break;
			case "talkStyle0003":
				talkStyleHTML = '发短信';
				break;
			case "talkStyle0004":
				talkStyleHTML = '微信';
				break;
			case "talkStyle0005":
				talkStyleHTML = '脚印';
				break;
			default:
				break;
		}
		return talkStyleHTML;
	}

	//课程类型HTML
	owner.lessonTypeHTML = function(LessonTypeCode) {
		var lessonTypeHTML = ""
		switch(LessonTypeCode) {
			case "1":
				lessonTypeHTML = "课时"
				break;
			case "2":
				lessonTypeHTML = "课时包"
				break;
			default:
				break;
		}
		return lessonTypeHTML;
	}

	//班级类型HTML
	owner.classStateHTML = function(classStateCode) {
		var classStateHTML = ""
		switch(classStateCode) {
			case "1":
				classStateHTML = '<span class="label label-warning">待开课</span>';
				break;
			case "2":
				classStateHTML = '<span class="label label-success">已开课</span>';
				break;
			case "3":
				classStateHTML = '<span class="label label-danger">已结课</span>';
				break;
			default:
				break;
		}
		return classStateHTML;
	}

	owner.enrollStyleHTML = function(enrollStyleCode) {
		var enrollStyleHTML = ""

		switch(enrollStyleCode) {
			case "0":
				enrollStyleHTML = '<span class=" mui-pull-right">未结算</span>'; /* label label-warning*/
				break;
			case "1":
				enrollStyleHTML = '<span class=" mui-pull-right">按消结算</span>'; /* */
				break;
			case "2":
				enrollStyleHTML = '<span class=" mui-pull-right ">已结算</span>'; /* label label-danger*/
				break;
			default:
				break;
		}

		return enrollStyleHTML;
	}

	owner.orgTypeName = function(orgTypeCode) {
		var orgTypeName = ""
		switch(orgTypeCode) {
			case "3c1e1ab210db4055817249d27eebf39c":
				orgTypeName = '文化课';
				break;
			case "e4575338c1584f07963b320e58246c59":
				orgTypeName = '艺术';
				break;
			case "9835dac4c50041c7a6271b2ca702047c":
				orgTypeName = '兴趣';
				break;
			case "e9971a66147a4f239c2591059a6ee47c":
				orgTypeName = '语言';
				break;
			case "19b3d60c8228495ba9ee95abae635140":
				orgTypeName = '体育';
				break;
			case "a3006ad044054ffeb2bea9b477fe7615":
				orgTypeName = '综合';
				break;
			default:
				break;
		}
		return orgTypeName;
	}
	/*
	 * 机构类型
	 */
	owner.orgTypeName = function(orgTypeCode) {
		var orgTypeName = ""
		switch(orgTypeCode) {
			case "3c1e1ab210db4055817249d27eebf39c":
				orgTypeName = '文化课';
				break;
			case "e4575338c1584f07963b320e58246c59":
				orgTypeName = '艺术';
				break;
			case "9835dac4c50041c7a6271b2ca702047c":
				orgTypeName = '兴趣';
				break;
			case "e9971a66147a4f239c2591059a6ee47c":
				orgTypeName = '语言';
				break;
			case "19b3d60c8228495ba9ee95abae635140":
				orgTypeName = '体育';
				break;
			case "a3006ad044054ffeb2bea9b477fe7615":
				orgTypeName = '综合';
				break;
			default:
				break;
		}
		return orgTypeName;
	}

	owner.orgSizeName = function(orgSizeCode) {
		var orgSizeName = ""
		switch(orgSizeCode) {
			case "f5491ec02e5f440eafa6d695212e9fa3":
				orgSizeName = '0-50学员';
				break;
			case "b87a6dd8568746fbb88eb97ff65e7cea":
				orgSizeName = '50-150学员';
				break;
			case "33f025ced47a4f0dacb9563402011338":
				orgSizeName = '150-300学员';
				break;
			case "1d40ba212252462b9cff5a2675fc12d4":
				orgSizeName = '300-500学员';
				break;
			case "83f19dbfec164328a5b5c227e3bc7d9b":
				orgSizeName = '500-800学员';
				break;
			case "6404bffe11954bbb91292300d034aebc":
				orgSizeName = '800以上';
				break;
			default:
				break;
		}
		return orgSizeName;
	}
	/* end */

	/*
	 * 用户登录
	 */
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';

		if(!chrnum.test(loginInfo.account)) {
			return callback('请输入正确的手机号码');
		}
		if(loginInfo.password.length < 6 || loginInfo.password.length > 16) {
			return callback('密码输入错误');
		}
		console.log(Base64.encode(loginInfo.password));
		$.getJSONP(httpurl + 'api/account/login', {
			phone: loginInfo.account,
			password: Base64.encode(loginInfo.password)
		}, function(data) {
			return callback(data);
		});
	};

	/*
	 * 用户机构
	 */
	owner.userOrganization = function(filterinfo, callback) {
		$.getJSONP(httpurl + 'api/account/GetUserOrganization', filterinfo, function(data) {
			return callback(data);
		});
	}

	/*
	 * 验证码
	 */
	owner.validatecode = function(smsinfo, callback) {

		$.getJSONP(httpurl + 'api/sms/validatecode', {
			phone: smsinfo.phone,
			template_code: getSmsTemplateCode(smsinfo.template_type)
		}, function(data) {
			return callback(data);
		});
	};

	/*
	 * 新用户注册
	 */
	owner.register = function(regInfo, callback) {

		regInfo.password = Base64.encode(regInfo.password);
		console.log(JSON.stringify(regInfo));
		$.getJSONP(httpurl + 'api/account/adminregister', regInfo, function(data) {
			return callback(data);
		});
	};

	// getOrgInfos 
	owner.getOrgInfos = function() {
		var orgInfosText = localStorage.getItem('$orgInfos') || "{}";
		return JSON.parse(orgInfosText);
	}
	//当前状态
	owner.getAccount = function() {
		var accountText = localStorage.getItem('$account') || "{}";
		return JSON.parse(accountText);
	}
	//用户机构
	owner.getUserOrganization = function() {
		var stateText = localStorage.getItem('$userOrganization') || "{}";
		return JSON.parse(stateText);
	};

	//激活机构
	owner.getActivateOrganization = function() {
		var stateText = localStorage.getItem('$activateOrganization') || "{}";
		return JSON.parse(stateText);
	};
	/*
	 * 激活参数
	 */
	owner.getactivateAccountPar = function() {
		var activateAccountPar = localStorage.getItem('$activateAccountPar') || "{}";
		return JSON.parse(activateAccountPar);
	};
	/*
	 * 忘记密码参数
	 */
	owner.getforgetPasswordPar = function() {
		var forgetPasswordPar = localStorage.getItem('$forgetPasswordPar') || "{}";
		return JSON.parse(forgetPasswordPar);
	};
	/**
	 * 找回密码
	 **/
	owner.resetPassword = function(resetpwdInfo, callback) {
		if(resetpwdInfo.org_id == null && resetpwdInfo.phone == null) {
			return callback('数据丢失请重试');
		}
		if(!re.test(resetpwdInfo.password)) {
			return callback('密码为6-16位的字母和数字组合');
		}
		$.getJSONP(httpurl + 'api/account/ResetPwd', {
			org_id: resetpwdInfo.org_id,
			phone: resetpwdInfo.phone,
			password: Base64.encode(resetpwdInfo.password)
		}, function(data) {
			console.log(JSON.stringify(data))
			return callback(data);
		});
	};
	/*
	 * 修改密码
	 */
	owner.modifypwdInfo = function(modifypwdInfo, callback) {
		if(modifypwdInfo.org_id == null && modifypwdInfo.phone == null) {
			return callback('数据丢失请重试');
		}
		if(!re.test(modifypwdInfo.newpassword)) {
			return callback('密码为6-16位的字母和数字组合');
		}
		$.getJSONP(httpurl + 'api/account/ModifyPwd', {
			org_id: modifypwdInfo.org_id,
			phone: modifypwdInfo.phone,
			oldpassword: Base64.encode(modifypwdInfo.oldpassword),
			newpassword: Base64.encode(modifypwdInfo.newpassword)
		}, function(data) {
			console.log(JSON.stringify(data))
			return callback(data);
		});
	};

	/**
	 * 激活账号
	 **/
	owner.setPassword = function(setpwdInfo, callback) {
		if(setpwdInfo.org_id == null && setpwdInfo.phone == null) {
			return callback('数据丢失请重试');
		}
		if(!re.test(setpwdInfo.password)) {
			return callback('密码为6-16位的字母和数字组合');
		}
		$.getJSONP(httpurl + 'api/account/activate', {
			org_id: setpwdInfo.org_id,
			phone: setpwdInfo.phone,
			password: Base64.encode(setpwdInfo.password)
		}, function(data) {
			console.log(JSON.stringify(data))
			return callback(data);
		});
	};

	/*
	 * 用户权限
	 */
	owner.getUserPermission = function(userRequest, callback) {

		$.getJSONP(httpurl + 'api/account/UserPermissionExtendV2', {
			org_id: userRequest.org_id,
			user_id: userRequest.user_id
		}, function(data) {
			return callback(data);
		});
	};

	/*
	 * 机构科目
	 */
	owner.getSubjectList = function(orgid, callback) {
		console.log(orgid);
		$.getJSONP(httpurl + 'api/setting/getSubjectList', {
			org_id: orgid
		}, function(data) {
			return callback(data);
		});
	};
	/*
	 * 保存科目
	 */
	owner.SaveSubject = function(subject, callback) {
		$.getJSONP(httpurl + 'api/setting/SaveSubject', {
			data: JSON.stringify(subject)
		}, function(data) {
			return callback(data);
		});
	}

	/*
	 * 机构校区
	 */
	owner.GetCampusLsit = function(campusRequest, callback) {
		console.log(JSON.stringify(campusRequest));
		$.getJSONP(httpurl + 'api/setting/getCampusList', {
			data: JSON.stringify(campusRequest)
		}, function(data) {
			return callback(data);
		});
	}
	/*
	 * 保存校区
	 */
	owner.SaveCampus = function(campusRequest, callback) {
		$.getJSONP(httpurl + 'api/setting/SaveCampus', {
			data: JSON.stringify(campusRequest)
		}, function(data) {
			return callback(data);
		});
	}

	/*
	 * 机构课程
	 */
	owner.GetLessonList = function(lessonRequest, callback) {

		$.getJSONP(httpurl + 'api/setting/GetLessonList', {
			data: JSON.stringify(lessonRequest)
		}, function(data) {
			return callback(data);
		});
	}
	/*
	 * SaveLesson
	 */
	owner.SaveLesson = function(lessonRequest, callback) {
		if(!decimalreg.test(lessonRequest.price)) {
			return callback('价格输入格式有误');
		}
		var lessonType = getLessonTypeCode(lessonRequest.type)
		if(lessonType == "") {
			return callback('请选择课程类型');
		} else {
			lessonRequest.type = lessonType
		}
		console.log(JSON.stringify(lessonRequest));
		$.getJSONP(httpurl + 'api/setting/SaveLesson', {
			data: JSON.stringify(lessonRequest)
		}, function(data) {
			return callback(data);
		});
	}
	owner.ModifyLesson = function(lessonRequest, callback) {

		$.getJSONP(httpurl + 'api/setting/ModifyLesson', lessonRequest, function(data) {
			return callback(data);
		});
	}
	/*
	 * 人事
	 */
	owner.GetPersonnelList = function(personnelRequest, callback) {
		$.getJSONP(httpurl + 'api/account/GetPersonnelList', {
			data: JSON.stringify(personnelRequest)
		}, function(data) {
			return callback(data);
		});
	}
	owner.GetPersonnelById = function(personnelRequest, callback) {
		$.getJSONP(httpurl + 'api/account/GetPersonnelById', personnelRequest, function(data) {
			return callback(data);
		});
	}

	/*
	 * 保存用户信息
	 */
	owner.SaveUser = function(userRequest, callback) {
		if(!chrnum.test(userRequest.phone)) {
			return callback('请输入正确的手机号码');
		}
		console.log(JSON.stringify(userRequest));
		$.getJSONP(httpurl + 'api/account/saveuser', {
			data: JSON.stringify(userRequest)
		}, function(data) {
			return callback(data);
		});
	}
	/*
	 * 保存用户基本信息
	 */
	owner.SaveUserBaseInfo = function(userRequest, callback) {
		$.getJSONP(httpurl + 'api/account/SaveUserBaseInfo', {
			data: JSON.stringify(userRequest)
		}, function(data) {
			return callback(data);
		});
	}
	owner.SaveUserState = function(userRequest, callback) {
		$.getJSONP(httpurl + 'api/account/SaveUserState', userRequest, function(data) {
			return callback(data);
		});
	}
	/*
	 * 学员
	 */
	owner.GetStudentList = function(studentRequest, callback) {
		$.getJSONP(httpurl + 'api/student/GetStudentListExtension', {
			data: JSON.stringify(studentRequest)
		}, function(data) {
			return callback(data);
		});
	}
	owner.GetStudentdDetailInfo = function(studentRequest, callback) {
		$.getJSONP(httpurl + 'api/student/GetStudentdDetailInfo', studentRequest, function(data) {
			return callback(data);
		});
	}

	owner.ModifyStudentSaleDean = function(studentSaleDeanRequest, callback) {
		console.log(JSON.stringify(studentSaleDeanRequest));
		$.getJSONP(httpurl + 'api/student/ModifyStudentSaleDean', studentSaleDeanRequest, function(data) {
			return callback(data);
		});
	}

	owner.GetStudentCashFlowList = function(studentCashFlowRequest, callback) {
		console.log(JSON.stringify(studentCashFlowRequest));
		$.getJSONP(httpurl + 'api/student/GetStudentCashFlowList', {
			data: JSON.stringify(studentCashFlowRequest)
		}, function(data) {
			return callback(data);
		});
	}

	owner.SaveStudent = function(studentRequest, callback) {
		console.log(JSON.stringify(studentRequest));

		if(!chrnum.test(studentRequest.phone)) {
			return callback('请输入正确的手机号码');
		}
		if(studentRequest.phone2 != undefined && studentRequest.phone2 != null) {
			if(!chrnum.test(studentRequest.phone2)) {
				return callback('请输入正确的手机号码');
			} else {
				if(studentRequest.phone2 == studentRequest.phone) {
					return callback('家长电话不能相同');
				}

			}
		}
		if(studentRequest.student_phone != undefined && studentRequest.student_phone != null) {
			if(!chrnum.test(studentRequest.student_phone)) {
				return callback('请输入正确的手机号码');
			} else {
				if(studentRequest.phone2 == studentRequest.student_phone ||studentRequest.phone== studentRequest.student_phone  ) {
					return callback('学员电话不能与家长电话相同');
				}

			}
		}
		studentRequest.source = owner.getSourceCode(studentRequest.source);
		if(studentRequest.source == "") {
			return callback('请选择来源');
		}
		$.getJSONP(httpurl + 'api/student/savestudent', {
			data: JSON.stringify(studentRequest)
		}, function(data) {
			return callback(data);
		});
	}
	/**
	 * 添加咨询教务
	 * @param {Object} studentRequest
	 * @param {Object} callback
	 */
	owner.addSalesDean = function(studentRequest, callback) {

		$.getJSONP(httpurl + 'api/student/savestudent', {
			data: JSON.stringify(studentRequest)
		}, function(data) {
			return callback(data);
		});
	}
	/**
	 * 修改学员状态
	 * @param {Object} studentRequest
	 * @param {Object} callback
	 */
	owner.modifyStudentState = function(studentRequest, callback) {
		$.getJSONP(httpurl + 'api/student/savestudent', {
			data: JSON.stringify(studentRequest)
		}, function(data) {
			return callback(data);
		});
	}

	owner.GetStuLessonDetailInfo = function(lessonRequest, callback) {
		$.getJSONP(httpurl + 'api/student/GetStuLessonDetailInfo', lessonRequest, function(data) {
			return callback(data);
		});
	}
	/*
	 * 跟进记录
	 */
	owner.GetRecordList = function(recordRequest, callback) {
		$.getJSONP(httpurl + 'api/work/GetRecordList', {
			data: JSON.stringify(recordRequest)
		}, function(data) {
			return callback(data);
		});
	}
	/*
	 * 通过角色获取人事
	 */
	owner.GetPersonnelByRoleList = function(personnelRequest, callback) {
		 console.log(JSON.stringify(personnelRequest));
		$.getJSONP(httpurl + 'api/account/GetPersonnelByRoleListExtension', {
			"data": JSON.stringify(personnelRequest)
		}, function(data) {
			return callback(data);
		});
	}

	/*
	 * 跟进记录学员
	 */
	owner.getStudent = function() {
		var settingsText = localStorage.getItem('$student') || "{}";
		return JSON.parse(settingsText);
	}

	owner.SaveRecord = function(recordRequest, callback) {

		recordRequest.state = owner.getStudentState(recordRequest.state);
		recordRequest.style = getTalkStyle(recordRequest.style);
		if(recordRequest.state == "") {
			return callback('请选择跟进状态');
		}
		if(recordRequest.style == "") {
			return callback('请选择跟进方式');
		}
		$.getJSONP(httpurl + 'api/work/SaveRecord', {
			data: JSON.stringify(recordRequest)
		}, function(data) {
			return callback(data);
		});
	}
	owner.DeleteRecord = function(recordRequest, callback) {
		$.getJSONP(httpurl + 'api/work/SaveRecord', {
			data: JSON.stringify(recordRequest)
		}, function(data) {
			return callback(data);
		});
	}
	/*
	 * 获取通讯录
	 */
	owner.GetContact = function(accountRequest, callback) {
		$.getJSONP(httpurl + '/api/account/GetContact', accountRequest, function(data) {
			return callback(data);
		});
	}

	/*
	 * 缴费记录
	 */
	owner.GetEnrollList = function(enrollRequest, callback) {
		$.getJSONP(httpurl + 'api/work/GetEnrollList', {
			data: JSON.stringify(enrollRequest)
		}, function(data) {
			return callback(data);
		});
	}
	/*
	 * 报名
	 */
	owner.SaveEnroll = function(payRequest, callback) {
		var enrollRequest = JSON.parse(payRequest.data);
		enrollRequest.create_time = enrollRequest.create_time + ":00";
		payRequest.data = JSON.stringify(enrollRequest);
		console.log(JSON.stringify(payRequest));
		$.getJSONP(httpurl + 'api/work/SaveEnroll', payRequest, function(data) {
			return callback(data);
		});
	}
	owner.deleteSaveEnroll = function(payRequest, callback) {
		$.getJSONP(httpurl + 'api/work/SaveEnroll', payRequest, function(data) {
			return callback(data);
		});
	}

	/*
	 * 退费
	 */
	owner.SaveEndEnroll = function(payRequest, callback) {
		console.log(JSON.stringify(payRequest));
		$.getJSONP(httpurl + 'api/work/SaveEndEnroll', {
			data: JSON.stringify(payRequest)
		}, function(data) {
			return callback(data);
		});
	}
	/*
	 * 学期结算
	 */
	owner.SaveHSEnrollSemester = function(payRequest, callback) {
		$.getJSONP(httpurl + 'api/work/SaveHSEnrollSemester', {
			data: JSON.stringify(payRequest)
		}, function(data) {
			return callback(data);
		});
	}

//	/*
//	 * 通过角色获取人事
//	 */
//	owner.GetPersonnelByRoleList = function(personnelRequest, callback) {
//		$.getJSONP(httpurl + 'api/account/GetPersonnelByRoleList', {
//			data: JSON.stringify(personnelRequest)
//		}, function(data) {
//			return callback(data);
//		});
//	}
	/*
	 * 通过报名缴费记录
	 */
	owner.GetCashFlowListbyItemid = function(cashFlowRequest, callback) {
		$.getJSONP(httpurl + 'api/work/GetCashFlowListbyItemid', cashFlowRequest, function(data) {
			return callback(data);
		});
	}
	owner.SaveEnrollCashFlow = function(cashFlowRequest, callback) {
		$.getJSONP(httpurl + 'api/work/SaveEnrollCashFlow', {
			data: JSON.stringify(cashFlowRequest)
		}, function(data) {
			return callback(data);
		});
	}

	/*
	 * 班级
	 */
	owner.GetClassList = function(classRequest, callback) {
		$.getJSONP(httpurl + 'api/work/GetClassList', {
			data: JSON.stringify(classRequest)
		}, function(data) {
			return callback(data);
		});
	}
	owner.SaveClass = function(classRequest, callback) {
		$.getJSONP(httpurl + 'api/work/SaveClass', {
			data: JSON.stringify(classRequest)
		}, function(data) {
			return callback(data);
		});
	}

	//	owner.GetClassStudent = function(classStudentRequest, callback) {
	//		$.getJSONP(httpurl + 'api/work/GetClassStudent', classStudentRequest, function(data) {
	//			return callback(data);
	//		});
	//	}

	/**
	 *班内学员
	 * @param {Object} classStudentRequest
	 * @param {Object} callback
	 */
	owner.GetClassStudent = function(classStudentRequest, callback) {
		$.getJSONP(httpurl + 'api/work/GetClassStudentExtension', classStudentRequest, function(data) {
			return callback(data);
		});
	}
	owner.GetNOClassStudent = function(noClassStudentRequest, callback) {
		$.getJSONP(httpurl + 'api/work/GetNOClassStudent', noClassStudentRequest, function(data) {
			return callback(data);
		});
	}
	owner.SaveClassStudent = function(classStudentRequest, callback) {
		$.getJSONP(httpurl + 'api/work/SaveClassStudent', {
			data: JSON.stringify(classStudentRequest)
		}, function(data) {
			return callback(data);
		});
	}
	owner.deleteClassStudent = function(classStudentRequest, callback) {
		$.getJSONP(httpurl + 'api/work/deleteClassStudent', classStudentRequest, function(data) {
			return callback(data);
		});
	}

	/*
	 * 记上课
	 */
	owner.GetNoteLesson = function(noteLessonRequest, callback) {
		$.getJSONP(httpurl + 'api/work/GetNoteLesson', {
			data: JSON.stringify(noteLessonRequest)
		}, function(data) {
			return callback(data);
		});
	}
	owner.SaveNoteLesson = function(noteLessonRequest, callback) {
		noteLessonRequest.state = owner.getNoteLessonStateCode(noteLessonRequest.state);
		if(noteLessonRequest.state == "") {
			return callback('请选择上课状态');
		}
		noteLessonRequest.style = getNoteLessonStyleCode(noteLessonRequest.style);
		if(noteLessonRequest.style == "") {
			return callback('请选择上课方式');
		}
		noteLessonRequest.lesson_time = noteLessonRequest.lesson_time + ":00";

		$.getJSONP(httpurl + 'api/work/SaveNoteLesson', {
			data: JSON.stringify(noteLessonRequest)
		}, function(data) {
			return callback(data);
		});
	}
	owner.SaveNoteLessonbyClass = function(classnotelessonRequest, callback) {
		classnotelessonRequest.noteLesson.state = owner.getNoteLessonStateCode(classnotelessonRequest.noteLesson.state);
		if(classnotelessonRequest.noteLesson.state == "") {
			return callback('请选择上课状态');
		}
		classnotelessonRequest.noteLesson.style = getNoteLessonStyleCode(classnotelessonRequest.noteLesson.style);
		if(classnotelessonRequest.noteLesson.style == "") {
			return callback('请选择上课方式');
		}
		classnotelessonRequest.noteLesson.lesson_time = classnotelessonRequest.noteLesson.lesson_time + ":00";
		console.log(JSON.stringify(classnotelessonRequest));
		$.getJSONP(httpurl + 'api/work/SaveNoteLessonbyClass', {
			data: JSON.stringify(classnotelessonRequest)
		}, function(data) {
			return callback(data);
		});
	}
	owner.DeleteNoteLesson = function(noteLessonRequest, callback) {

		$.getJSONP(httpurl + 'api/work/SaveNoteLesson', {
			data: JSON.stringify(noteLessonRequest)
		}, function(data) {
			return callback(data);
		});
	}

	/*
	 * report
	 */
	//来源
	owner.GetstudentSourceList = function(sourceRequest, callback) {
		console.log(JSON.stringify(sourceRequest));
		$.getJSONP(httpurl + 'api/report/GetstudentSourceList', {
			data: JSON.stringify(sourceRequest)
		}, function(data) {
			return callback(data);
		});
	}
	//招生
	owner.GetstudentStateList = function(stateRequest, callback) {
		$.getJSONP(httpurl + 'api/report/GetstudentStateList', {
			data: JSON.stringify(stateRequest)
		}, function(data) {
			return callback(data);
		});
	}

	//课消
	owner.GetstudentConsumeList = function(consumeRequest, callback) {
		$.getJSONP(httpurl + 'api/report/GetstudentConsumeList', {
			data: JSON.stringify(consumeRequest)
		}, function(data) {
			return callback(data);
		});
	}
	owner.GetFinanceList = function(financeRequest, callback) {

		$.getJSONP(httpurl + 'api/report/GetFinanceList', {
			data: JSON.stringify(financeRequest)
		}, function(data) {
			return callback(data);
		});
	}

	//招生简报
	owner.GetEnrolmentBrief = function(enrolmentBriefRequest, callback) {
		$.getJSONP(httpurl + 'api/report/GetEnrolmentBrief', {
			data: JSON.stringify(enrolmentBriefRequest)
		}, function(data) {
			return callback(data);
		});
	}
	//上课简报
	owner.GetLessonBrief = function(lessonBriefRequest, callback) {
		$.getJSONP(httpurl + 'api/report/GetLessonBrief', {
			data: JSON.stringify(lessonBriefRequest)
		}, function(data) {
			return callback(data);
		});
	}
	//待跟进计划
	owner.GetRecordToDoList = function(recordtodoRequest, callback) {
		$.getJSONP(httpurl + 'api/report/GetRecordToDoList', {
			data: JSON.stringify(recordtodoRequest)
		}, function(data) {
			return callback(data);
		});
	}
	//待跟进计划
	owner.GetRecordPlanList = function(recordPlanRequest, callback) {
		$.getJSONP(httpurl + 'api/work/GetRecordPlanList', {
			data: JSON.stringify(recordPlanRequest)
		}, function(data) {
			return callback(data);
		});
	}
	//修改待跟进计划
	owner.modifyRecordPlan = function(recordPlanRequest, callback) {
		$.getJSONP(httpurl + 'api/work/modifyRecordPlan', {
			data: JSON.stringify(recordPlanRequest)
		}, function(data) {
			return callback(data);
		});
	}
	owner.SaveRecordPlan = function(recordPlanRequest, callback) {
		var data = JSON.parse(recordPlanRequest.data);
		data.state = owner.getStudentState(data.state);
		data.style = getTalkStyle(data.style);
		if(data.state == "") {
			return callback('请选择跟进状态');
		}
		if(data.style == "") {
			return callback('请选择跟进方式');
		}
		recordPlanRequest.data = JSON.stringify(data);
		$.getJSONP(httpurl + 'api/work/SaveRecordPlan', recordPlanRequest, function(data) {
			return callback(data);
		});
	}

	/**
	 * 微招生
	 */
	///微招生信息
	owner.GetWeiZSInfo = function(weiZSPerRequest, callback) {
		console.log(JSON.stringify(weiZSPerRequest));
		$.getJSONP(httpurl + 'api/WeiZS/GetWeiZSInfo', weiZSPerRequest, function(data) {
			return callback(data);
		});
	}
	/**
	 * 保存机构基本信息
	 * @param {Object} orgBaseInfoRequest
	 * @param {Object} callback
	 */
	owner.SaveOrgBaseInfo = function(orgBaseInfoRequest, callback) {
		$.getJSONP(httpurl + 'api/Account/SaveOrgBaseInfo', {
			"data": JSON.stringify(orgBaseInfoRequest)
		}, function(data) {
			return callback(data);
		});
	}
	/**
	 * 保存机构简介
	 * @param {Object} orgAbstractRequest
	 * @param {Object} callback
	 */
	owner.SaveOrgAbstract = function(orgAbstractRequest, callback) {

		orgAbstractRequest.abstractStr = Base64.encode(orgAbstractRequest.abstractStr);
		console.log(JSON.stringify(orgAbstractRequest));
		$.getJSONP(httpurl + 'api/Account/SaveOrgAbstract', orgAbstractRequest, function(data) {
			return callback(data);
		});
	}
	/**
	 * 读取招生课程
	 * @param {Object} zslessonRequest
	 * @param {Object} callback
	 */
	owner.GetZslessonList = function(zslessonRequest, callback) {
		console.log(JSON.stringify(zslessonRequest));
		$.getJSONP(httpurl + 'api/WeiZS/GetZslessonList', {
			"data": JSON.stringify(zslessonRequest)
		}, function(data) {
			return callback(data);
		});
	}
	/*
	 * 保存招生课程
	 * @param {Object} zslessonRequest
	 * @param {Object} callback
	 */
	owner.SaveZslesson = function(zslessonRequest, callback) {

		zslessonRequest.apply_student = Base64.encode(zslessonRequest.apply_student);
		zslessonRequest.lightspot = Base64.encode(zslessonRequest.lightspot);
		zslessonRequest.abstracts = Base64.encode(zslessonRequest.abstracts);

		console.log(JSON.stringify(zslessonRequest));
		$.getJSONP(httpurl + 'api/WeiZS/SaveZslesson', {
			"data": JSON.stringify(zslessonRequest)
		}, function(data) {
			return callback(data);
		});
	}

	owner.ModifyZslesson = function(zslessonRequest, callback) {

		console.log(JSON.stringify(zslessonRequest));
		$.getJSONP(httpurl + 'api/WeiZS/SaveZslesson', {
			"data": JSON.stringify(zslessonRequest)
		}, function(data) {
			return callback(data);
		});
	}
	/**
	 * 脚印详情 
	 * @param {Object} studentRequest
	 * @param {Object} callback
	 */
	owner.GetZSFootPrintList = function(studentRequest, callback) {
		console.log(JSON.stringify(studentRequest));
		$.getJSONP(httpurl + 'api/WeiZS/GetZSFootPrintList', {
			data: JSON.stringify(studentRequest)
		}, function(data) {
			return callback(data);
		});
	}
	
	/**
	 * 各校区学员分析
	 * @param {Object} studentChatRequest
	 * @param {Object} callback
	 */
	owner.GetStudentChatData = function(studentChatRequest, callback) {
		$.getJSONP(httpurl + 'api/report/GetStudentChatData', {
			data: JSON.stringify(studentChatRequest)
		}, function(data) {
			return callback(data);
		});
	}
	/**
	 * 各校区跟进分析
	 * @param {Object} recordsChatRequest
	 * @param {Object} callback
	 */
	owner.GetRecordsChatData  = function(recordsChatRequest, callback) {
		$.getJSONP(httpurl + 'api/report/GetRecordsChatData', {
			data: JSON.stringify(recordsChatRequest)
		}, function(data) {
			return callback(data);
		});
	}
    /**
     * 各个校区报名分析
     * @param {Object} enrollChatRequest
     * @param {Object} callback
     */
	owner.GetEnrollChatData  =  function(enrollChatRequest, callback) {
		$.getJSONP(httpurl + 'api/report/GetEnrollChatData', {
			data: JSON.stringify(enrollChatRequest)
		}, function(data) {
			return callback(data);
		});
	}
	 /**
     * 各个校区记上课分析
     * @param {Object} enrollChatRequest
     * @param {Object} callback
     */
	owner.GetNoteLessonChatData  =  function(noteLessonChatRequest, callback) {
		$.getJSONP(httpurl + 'api/report/GetNoteLessonChatData', {
			data: JSON.stringify(noteLessonChatRequest)
		}, function(data) {
			return callback(data);
		});
	}
	
	
	
	/**
	 * 个人影响力 
	 * @param {Object} singleInfluenceRequest
	 * @param {Object} callback
	 */
	owner.GetSingleInfluence = function(singleInfluenceRequest, callback) {

		console.log(JSON.stringify(singleInfluenceRequest));
		$.getJSONP(httpurl + 'api/WeiZS/GetSingleInfluence', singleInfluenceRequest, function(data) {
			console.log(data);
			return callback(data);
		});
	}
	/**
	 * 设置应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 获取应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
	/*
	 * 获取选择学员信息
	 */
	owner.getSelectStudentInfo = function() {
		var selectStudentInfo = localStorage.getItem('$selectStudentInfo') || "{}";
		return JSON.parse(selectStudentInfo);
	}
	/**
	 * 获取选择课程信息
	 **/
	owner.getSelectLessonInfo = function() {
		var selectLessonInfo = localStorage.getItem('$selectLessonInfo') || "{}";
		return JSON.parse(selectLessonInfo);
	}
	/**
	 * 获取选择课程信息
	 **/
	owner.getWeizsselectLessonInfo = function() {
		var selectLessonInfo = localStorage.getItem('$weizsselectLessonInfo') || "{}";
		return JSON.parse(selectLessonInfo);
	}
	/*
	 * 获取根据角色选择的人事信息
	 */
	owner.getByrolePersonnelInfo = function() {
		var byrolePersonnelInfo = localStorage.getItem('$byrolePersonnelInfo') || "{}";
		return JSON.parse(byrolePersonnelInfo);
	}
	/**
	 * 获取报名信息
	 **/
	owner.getEnroll = function() {
		var enroll = localStorage.getItem('$enroll') || "{}";
		return JSON.parse(enroll);
	}

	/*
	 * 班级
	 */
	owner.getClass = function() {
		var $class = localStorage.getItem('$class') || "{}";
		return JSON.parse($class);
	}
	/*
	 * 选择班级信息
	 */
	owner.getSelectClassInfo = function() {
		var $selectClassInfo = localStorage.getItem('$selectClassInfo') || "{}";
		return JSON.parse($selectClassInfo);
	}
	/*
	 * 科目
	 */
	owner.getNoteLessonSubject = function() {
		var $noteLessonSubject = localStorage.getItem('$noteLessonSubject') || "{}";
		return JSON.parse($noteLessonSubject);
	}
	//学员单个课程
	owner.getSingleStuLesson = function() {
		var $singleStuLesson = localStorage.getItem('$singleStuLesson') || "{}";
		return JSON.parse($singleStuLesson);
	}
	//modifyPersonnel
	owner.getmodifyPersonnel = function() {
		var $singleStuLesson = localStorage.getItem('$modifyPersonnel') || "{}";
		return JSON.parse($singleStuLesson);
	}
	//modifyLesson
	owner.getmodifyLesson = function() {
		var $modifyLesson = localStorage.getItem('$modifyLesson') || "{}";
		return JSON.parse($modifyLesson);
	}
	//modifySubject
	owner.getmodifySubject = function() {
		var $modifySubject = localStorage.getItem('$modifySubject') || "{}";
		return JSON.parse($modifySubject);
	}
	//modifyCampus
	owner.getmodifyCampus = function() {
		var $modifyCampus = localStorage.getItem('$modifyCampus') || "{}";
		return JSON.parse($modifyCampus);
	}

	//$recordplan 
	owner.getRecordplan = function() {
		var $recordplan = localStorage.getItem('$recordplan') || "{}";
		return JSON.parse($recordplan);
	}

	//notelessondata
	owner.getnotelessondata = function() {
		var $notelessondata = localStorage.getItem('$notelessondata') || "{}";
		return JSON.parse($notelessondata);
	}

	//notelessondata
	owner.getsinglestunotelessondata = function() {
		var $notelessondata = localStorage.getItem('$singlestunotelessondata') || "{}";
		return JSON.parse($notelessondata);
	}
	//$UserRole
	owner.getUserRoledata = function() {
		var $userRoledata = localStorage.getItem('$UserRole') || "{}";
		return JSON.parse($userRoledata);
	}
	
	//WeiZSInfo
	owner.getWeiZSInfodata = function() {
		var $notelessondata = localStorage.getItem('$WeiZSInfo') || "{}";
		return JSON.parse($notelessondata);
	}
	//$setlightspot
	owner.getSetlightspot = function() {
		var $setlightspot = localStorage.getItem('$setlightspot') || "{}";
		return JSON.parse($setlightspot);
	}
	//$setapplystudent
	owner.getSetapplystudent = function() {
		var $setapplystudent = localStorage.getItem('$setapplystudent') || "{}";
		return JSON.parse($setapplystudent);
	}
	//$setzslessonabstracts
	owner.getSetzslessonabstracts = function() {
		var $setzslessonabstracts = localStorage.getItem('$setzslessonabstracts') || "{}";
		return JSON.parse($setzslessonabstracts);
	}

	//$setlessonAddressPoint
	owner.getSetlessonAddressPoint = function() {
		var $setlessonAddressPoint = localStorage.getItem('$setlessonAddressPoint') || "{}";
		return JSON.parse($setlessonAddressPoint);
	}
	//$lessonAddressInfo
	owner.getLessonAddressInfo = function() {
		var $lessonAddressInfo = localStorage.getItem('$lessonAddressInfo') || "{}";
		return JSON.parse($lessonAddressInfo);
	}
	//$zslessonModel
	owner.getZslessonModel = function() {
		var $zslessonModel = localStorage.getItem('$zslessonModel') || "{}";
		return JSON.parse($zslessonModel);
	}
	//$weizszslessonaction
	owner.getWeizszslessonaction = function() {
		var $weizszslessonaction = localStorage.getItem('$weizszslessonaction') || "{}";
		return JSON.parse($weizszslessonaction);
	}

	//$footprintpar
	owner.getfootprintpar = function() {
		var $footprintpar = localStorage.getItem('$footprintpar') || "{}";
		return JSON.parse($footprintpar);
	}
     
    //$filterselectCampusInfo
	owner.getFilterselectCampusInfo = function() {
		var byrolePersonnelInfo = localStorage.getItem('$filterselectCampusInfo') || "{}";
		return JSON.parse(byrolePersonnelInfo);
	}
}(mui, window.app = {}));