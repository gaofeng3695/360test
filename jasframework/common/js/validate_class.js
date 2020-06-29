/**
 * 
 * 文件描述:表单验证。
 *
 * @author zhanggf
 * @version 1.0
 * 创建时间： 2012-08-30 上午17:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：   2012-12-01       修改人： zhanggf
 * 修改内容： 
 **********************************************************************
 */
$.extend($.fn.validatebox.defaults.rules,{
	CHS : {
		validator : function(value, param) {
			return /^[\u0391-\uFFE5]+$/.test(value);
		},
		message : '请输入汉字'
	},
	ZIP : {
		validator : function(value, param) {
			return /^[1-9]\d{5}$/.test(value);
		},
		message : '邮政编码不存在'
	},
	QQ : {
		validator : function(value, param) {
			return /^[1-9]\d{4,10}$/.test(value);
		},
		message : 'QQ号码不正确'
	},

	doubleNumber : {
		validator : function(value, param) {
			return /^[-+]?\d+(\.\d+)?$/.test(value);
		},
		message : '只能是数字小数点负号'
	},
	TaskpointName : {
		validator : function(value, param) {
			return !/^[\"&?%#$]*$/.test(value);
		},
		message : '名称不允许</br>输入双引号、&、?、%、#、$。'
	},
	loginName : {
		validator : function(value, param) {
			return /^[\u0391-\uFFE5\w]+$/.test(value);
		},
		message : '名称只允许汉字</br>字母、数字及下划线。'
	},
	safepass : {
		validator : function(value, param) {
			return safePassword(value);
		},
		message : '密码由字母和数字组成，至少6位'
	},
	equalTo : {
		validator : function(value, param) {
			return value == $(param[0]).val();
		},
		message : '两次输入的字符不一至'
	},
	number : {
		validator : function(value, param) {
			return /^\d+$/.test(value);
		},
		message : '请输入数字'
	},
	idcard : {
		validator : function(value, param) {
			return idCard(value);
		},
		message : '请输入正确的身份证号码'
	},
	minLength : { // 判断最小长度
		validator : function(value, param) {
			return value.length >= param[0];
		},
		message : '最少输入 {0} 个字符。'
	},
	maxLength : { // 判断最da长度
		validator : function(value, param) {
			//return value.length <= param[0];
			 var len = 0;  
			 for (var i=0; i<value.length; i++) {  
			     if (value.charCodeAt(i)>127 || value.charCodeAt(i)==94) {  
			         len += 2;  
			     } else {  
			         len ++;  
			     }
			 } 
			 return len <= param[0]
		},
		message : '最大长度不能超过 {0} 个字符。'
	},
	addfeaureValidate : { // 判断最da长度
		validator : function(value, param) {
			if(value.length <= param[0]){
				var number =value.split(",");
				if(value.substring(value.length-1,value.length)!=','){
					if(number.length%2==0){
						var flag =false;
						for(var i=0;i<number.length;i++){
							if(/^[-+]?\d+(\.\d+)?$/.test(number[i])){
								flag= true;
							}else{
								flag = false;
								break;
							}
						}
						return flag;
					}else{
						return false;
					}
				}else{
					return false;
				}
			}else{
				return false;
			}
		},
		message : '格式不对或最大长度不能超过 {0} 个字符。'
	},
	spatialDataValidate : { // 判断空间数据格式
		validator : function(value) {
				var number =value.split(",");
				if(value.substring(value.length-1,value.length)!=','){
					if(number.length%2==0){
						var flag =false;
						for(var i=0;i<number.length;i++){
							if(/^[-+]?\d+(\.\d+)?$/.test(number[i])){
								flag= true;
							}else{
								flag = false;
								break;
							}
						}
						return flag;
					}else{
						return false;
					}
				}else{
					return false;
				}
		},
		message : '数据格式错误。'
	},
	maxNumber : { // 判断最大数字
		validator : function(value, param) {
			return /^[+]?[0-9]+\d*$/i.test(value)
					&& value <= param[0];
		},
		message : '输入数字已经超出准许范围。'
	},
	minNumber : { // 判断最大数字
		validator : function(value, param) {
			return /^[+]?[0-9]+\d*$/i.test(value)
					&& value >= param[0];
		},
		message : '输入数字过小。'
	},
	minFloat:{//最小
		validator : function(value,param) {
			return /^\d+(?:.\d{1,2})?$/i.test(value)
		},
		message : '格式不对，请输入正整数，或者小数点保留后两位。'
	},
	betweenNumber : {
		validator : function(value, param) {
			if(!value.match(/^\d+(\.\d+)?$/i)){
				return false;
			}
			if(param[0]>= param[1]){
				return false;
			}
			return value >= param[0] && value <= param[1];
		},
		message : "输入数字必须介于{0}和{1}之间."
	},
	length : {
		validator : function(value, param) {
			var len = $.trim(value).length;
			return len >= param[0] && len <= param[1];
		},
		message : "输入内容长度必须介于{0}和{1}之间."
	},
	phone : {// 验证电话号码
		validator : function(value) {
			return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i
					.test(value);
		},
		message : '格式不正确,请使用下面格式:020-88888888'
	},
	mobile : {// 验证手机号码
		validator : function(value) {
			return /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(value);
		},
		message : '手机号码格式不正确'
	},
	mobileAndPhone : {// 验证手机号码
		validator : function(value) {
			return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i
                .test(value) || /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(value);
			/*return /(^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$)|(^(13|15|18)\d{9}$)/i
					.test(value);*/
		},
		message : '电话号码格式不正确'
	},
	idcard : {// 验证身份证
		validator : function(value) {
			return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value);
		},
		message : '身份证号码格式不正确'
	},
	intOrFloat : {// 验证整数或小数
		validator : function(value) {
			return /^\d+(\.\d+)?$/i.test(value);
		},
		message : '请输入数字，并确保格式正确'
	},
	percentage : {// 验证百分数
		validator : function(value) {
			return /^([0-9][0-9]?(\.[0-9]{1,2})?)%$|^(0\.[1-9][0-9]?)%$|^(0\.[0-9][1-9])%$|^100(\.00)?%$/i
					.test(value);
		},
		message : '请输入有效的百分数(例：xx.xx%)'
	},
	currency : {// 验证货币
		validator : function(value) {
			return /^\d+(\.\d+)?$/i.test(value);
		},
		message : '货币格式不正确'
	},
	qq : {// 验证QQ,从10000开始
		validator : function(value) {
			return /^[1-9]\d{4,9}$/i.test(value);
		},
		message : 'QQ号码格式不正确'
	},
	integer : {// 验证整数
		validator : function(value) {
			return /^[+]?[0-9]+\d*$/i.test(value);
		},
		message : '请输入整数'
	},
	chinese : {// 验证中文
		validator : function(value) {
			return /^[\u0391-\uFFE5]+$/i.test(value);
		},
		message : '请输入中文'
	},
	english : {// 验证英语
		validator : function(value) {
			return /^[A-Za-z]+$/i.test(value);
		},
		message : '请输入英文'
	},
	unnormal : {// 验证是否包含空格和非法字符
		validator : function(value) {
			return /.+/i.test(value);
		},
		message : '输入值不能为空和包含其他非法字符'
	},
	general : {
		validator : function(value) {
			return /^[\u4e00-\u9fa5_a-zA-Z0-9\-\:\：]+$/i
					.test(value);
		},
		message : '输入值不能为空和包含其他非法字符'
	},
	generals : {
		validator : function(value) {
			// return
			// /^[\u4e00-\u9fa5_a-zA-Z0-9\-\#\_\(\)\:]+$/i.test(value);
			return /^[\w\W]$/i.test(value);

		},
		message : '输入值不能为空和包含其他非法字符'
	},
	username : {// 验证用户名
		validator : function(value) {
			return /^[a-zA-Z][a-zA-Z0-9_]{1,25}$/i.test(value);
		},
		message : '用户名不合法（字母开头，允许2-25字符，允许字母数字下划线）'
	},
	faxno : {// 验证传真
		validator : function(value) {
			// return /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[
			// ]){1,12})+$/i.test(value);
			return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i
					.test(value);
		},
		message : '传真号码不正确'
	},
	zip : {// 验证邮政编码
		validator : function(value) {
			return /^[1-9]\d{5}$/i.test(value);
		},
		message : '邮政编码格式不正确'
	},
	ip : {// 验证IP地址
		validator : function(value) {
			return /d+.d+.d+.d+/i.test(value);
		},
		message : 'IP地址格式不正确'
	},
	name : {// 验证姓名，可以是中文或英文
		validator : function(value) {
			return /^[\u0391-\uFFE5]+$/i.test(value)
					| /^\w+[\w\s]+\w+$/i.test(value);
		},
		message : '请输入姓名'
	},
	carNo : {
		validator : function(value) {
			return /^[\u4E00-\u9FA5][\da-zA-Z]{6}$/.test(value);
		},
		message : '车牌号码无效（例：粤J12350）'
	},
	carenergin : {
		validator : function(value) {
			return /^[a-zA-Z0-9]{16}$/.test(value);
		},
		message : '发动机型号无效(例：FG6H012345654584)'
	},
	email : {
		validator : function(value) {
			return /^\w+([-.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
					.test(value);
		},
		message : '请输入有效的电子邮件账号(例：abc@126.com)'
	},
	msn : {
		validator : function(value) {
			return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
					.test(value);
		},
		message : '请输入有效的msn账号(例：abc@hotnail(msn/live).com)'
	},
	same : {
		validator : function(value, param) {
			if ($("#" + param[0]).val() != "" && value != "") {
				return $("#" + param[0]).val() == value;
			} else {
				return true;
			}
		},
		message : '两次输入的密码不一致！'
	},
	zhengzhengshu : {
		validator : function(value) {
			return /^[1-9][0-9]*$/
					.test(value);
		},
		message : '只能输入正整数'
	},
	xpoint : {
		validator : function(value) {
			if (value > 0 && value < 180)
				return true;
			else
				return false;
		},
		message : '请输入有效的经度'
	},
	ypoint : {
		validator : function(value) {
			if (value > 0 && value < 90)
				return true;
			else
				return false;
		},
		message : '请输入有效的纬度'
	},
	priUrl : {
		validator : function(value) {
			return /(^\/\/.|^\/|^[a-zA-Z])?:?\/.+(\/$)?/
					.test(value);
		},
		message : '权限url不合法'
	},
	exists:{
		validator:function(value,param){
			var cc = $("#"+param[0]);
	        var v = cc.combobox('getValue');
	        var rows = cc.combobox('getData');
	        if(!v){
	        	return true;
	        }
	        for(var i=0; i<rows.length; i++){
	            if (rows[i].id == v){
	            	return true;
	            }
	        }
	        return false;
	    },
	    //message:'The entered value does not exists.'
	    message:'输入的值不在下拉选项内，请在下拉选项内选择！'
	},
	comboxRequired:{
        validator: function(value, param){
            return value!= param[0];
        },
        message: '请在下拉框选项内选择一个数据'
    },
    comboxExists:{
		validator:function(value,param){
			var cc = $("#"+param[0]);
	        var text = cc.combobox('getText');
	        var data = cc.combobox('getData');
	        var mode = cc.combobox('options').mode;
	        
	        var textField = cc.combobox('options').textField;
	        var valueField = cc.combobox('options').valueField;
	        if(!text){
	        	return true;
	        }

       	    var otherArr = []; // 用于存放对应的选中字段id
       	    var textArr = text.split(",");
	        if(data.length < textArr.length) return false;
	 	    for(var i = 0 , len = data.length; i < len; i++){
	 	        for(var j = 0, leng = textArr.length; j < leng; j++){
	 	             if(data[i][textField]  == textArr[j]){
	 	                otherArr.push(data[i][valueField]);
	 	                continue;
	 	             }
	 	         }
	 	   }
	       if(otherArr.length < textArr.length){
	           return false
	       }else{
              if(mode == 'remote'){
                cc.combobox('setValues',otherArr);
   	           }
	           return true
	        }
	         
	        return false;
	    },
	    message:'输入的值不在下拉选项内，请在下拉选项内选择！'
	},
	combogridExists:{
		validator:function(value,param){
			var cc = $("#"+param[0]);
	        var t = cc.combogrid('getText');
	        var rows = cc.combogrid('grid').datagrid('getData').rows;
	        if(!t){
	        	return true;
	        }
	        for(var i=0; i<rows.length; i++){
	            if (rows[i][param[1]] == t){
	            	return true;
	            }
	        }
	        return false;
	    },
	    //message:'The entered value does not exists.'
	    message:'输入的值不在下拉选项内，请在下拉选项内选择！'
	},
    decimalNumber:{
    	validator: function(value,param){
    		var p1 = param[0];
    		var p2 = param[1];
    		var s = "";
    		if(p2 == 0){
    			s = "^[0-9]{0,"+param[0]+"}$";
    		}else{
    			s = "^[0-9]{0,"+param[0]+"}([.]{1}[0-9]{1,"+param[1]+"})?$";
    		}
    		var re =new RegExp(s);
    		return re.test(value);
    	},
    	message: '只允许有{0}位整数和{1}位小数'
    },

	lon:{
		//校验经度
		validator:function(value){
			var longrg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,20})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
			if(!longrg.test(value)){
				return false;
			//	return '经度整数部分为0-180,小数部分为0到20位!';
			}
			if (value < 73.66){
				return false;
			//	return '经度过小,请重新输入!';
			}
			if (value > 135.05){
				return false;
			//	return '经度过大,请重新输入!';
			}
			return true;
		},
		message: "请输入有效的经度",
	},
	lat:{
		//纬度
		validator:function(value){
			var latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,20}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
			if(!latreg.test(value)){
				return false;
			//	return '纬度整数部分为0-90,小数部分为0到20位!';
			}

			if (value < 3.86){
				return false;
			//	return '纬度过小,请重新输入!';
			}
			if (value > 53.55){
				return false;
			//	return '纬度过大,请重新输入!';
			}
			return true;
		},
		message: "请输入有效的纬度",
	},
});