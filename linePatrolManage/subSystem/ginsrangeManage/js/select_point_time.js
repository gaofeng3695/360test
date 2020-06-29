/* 获取巡检频次 */
var times = getUrlParam("count");

/* 新增或者更新 */
var original = getUrlParam("original"); 

/* 类型，一天M巡 或者 不是 */
var type = getUrlParam("type"); 

/* 日巡 or 夜巡 */
var instype = getUrlParam("instype"); 

/* 巡检频次 */
var mn = getUrlParam("mn"); 

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	/* 获取上一次的频次 */
	let oldMn = sessionStorage.getItem('mn');
	
	/*console.log('关键点执行的频次是：'+times);*/
	if(type == 'single')
		createCoupleElement(times);
	else
		createCoupleElement(1);
	
	/* 设置时间不得小于今天 */
	for( let i = 0 ; i < times ; i++ ){
		$('#startTime'+(i+1)).on('click',function(){
			WdatePicker({dateFmt:'HH:mm:ss',minTime:'06:00:00',maxTime:'20:00:00'});
		})
		$('#endTime'+(i+1)).on('click',function(){
			WdatePicker({dateFmt:'HH:mm:ss',minTime:'06:00:00',maxTime:'20:00:00'});
		})
	}
	
	/* 如果timeArray有值并且1天N巡中的N值相同，就取值 */
	let orginalValue = sessionStorage.getItem('timeArray');
	let orginalJSONValue = JSON.parse(orginalValue);
	if(orginalValue!= 'undefined' && orginalValue!= '' && orginalValue!= null && orginalValue != 'null' ){
		if(oldMn == mn ){
			for(let j = 0 ; j< orginalJSONValue.length ; j++ ){
				$('#startTime'+(j+1)).val(orginalJSONValue[j].startTime);
				$('#endTime'+(j+1)).val(orginalJSONValue[j].endTime);
			}
		}
	}
	
	/* 点击保存，将所有的日期组成JSON数组的形式，传给上一个页面，继而存入数据库. */
	$('#saveButton').on('click',function(e){
		e.preventDefault();
		disableButtion("saveButton");
		var bool=$("#timeForm").form('validate');
		if(bool==false){
			enableButtion("saveButton");
			return bool;
		}
		/* 将所有的巡检时间组成JSON数组 */
		let array = '[';
		for( let i = 0 ; i < times ; i++ ){
			/* 获取第i组的开始时间和结束时间 */
			let startTime = $('#startTime'+(i+1)).val();
			let endTime = $('#endTime'+(i+1)).val();
			/* 如果时间没值，提示必填 */
			if(startTime == '' || endTime == ''){
				top.showAlert("提示", "第"+(i+1)+"次巡检的时间不能为空！", 'info');
				enableButtion("saveButton");
				return false;
			}else{
				let item = '{\"startTime\" : \"'+startTime+'\",\"endTime\": \"'+endTime+'\"}';
				array += item;
			}
			
			/* 如果不是最后一个元素，在array后面加一个逗号 */
			if(i != (times-1)){
				array += ',';
			}
		}
		
		array += ']';
		/* 判断结束时间是否大于开始时间 */
		/*if(!compareDate()){
			enableButtion("saveButton");
			return false;
		}*/
		
		/* 如果验证都通过了，就将array的值传给前一个页面  */
		sessionStorage.removeItem('timeArray');
		sessionStorage.setItem('timeArray', array);
		
		/* 存储巡检频次到sessionStorage */
		sessionStorage.setItem('mn',mn);
		
		/* 执行上一个页面的重新加载数据方法 */
		reloadData();
		
		/* 关闭页面 */
		closePanel();
	})
})

/**
 * 获取url中的参数
 * @param name
 * @returns
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

/**
 * 创建一对关键点执行的开始时间与结束时间
 */
function createCoupleElement(number){
	for(let i = 0 ; i < number; i++){
		let node = '<tr>';
		node += '<td width=\"20%\"><span>第'+(i+1)+'次巡检开始时间：</span></td>';
		node += '<td width=\"30%\">';
		/* 如果是日巡 早上6点到晚上8点；夜巡晚上8点到第二天早上6点。 */
		if(instype == '01')
			node += '<input id=\"startTime'+(i+1)+'\" value = "06:00:00" required = \"required\" name=\"startTime'+i+'\" class=\"easyui-validatebox Wdate input_bg\" />';
		else
			node += '<input id=\"startTime'+(i+1)+'\" value = "20:00:00" required = \"required\" name=\"startTime'+i+'\" class=\"easyui-validatebox Wdate input_bg\" />';
		node += '</td>';
		node += '<td width=\"20%\"><span>第'+(i+1)+'次巡检结束时间：</span></td>';
		node += '<td width=\"30%\">';
		
		/* 如果是日巡 早上6点到晚上8点；夜巡晚上8点到第二天早上6点。 */
		if(instype == '01')
			node += '<input id=\"endTime'+(i+1)+'\" value = "20:00:00" required = \"required\" name=\"endTime'+i+'\" class=\"easyui-validatebox Wdate input_bg\"  />';
		else
			node += '<input id=\"endTime'+(i+1)+'\" value = "06:00:00" required = \"required\" name=\"endTime'+i+'\" class=\"easyui-validatebox Wdate input_bg\"  />';
		node += '</td>';
		node += '</tr>';
		$('#time').append(node);
	}
}

/**
 * 比较时间
 */
function compareDate(){
	/*console.log('验证时间要大于或者等于当前时间');*/
	for( let i = 0; i < times ; i++ ){
		/* 获取起始时间 */
		let effectivebegindate = $('#startTime'+(i+1)).val();
		/* 获取结束时间 */
		let effectiveenddate = $('#endTime'+(i+1)).val();
		if(effectiveenddate >= effectivebegindate){
			continue;
		}else{
			top.showAlert("提示", "第"+(i+1)+"次巡检的结束时间必须大于或者等于开始时间", 'info');
			enableButtion("saveButton");
			return false;
		}
	}
	return true;
	
}

/**
 * @desc 关闭添加页面
 */
function closePanel() {
	top.closeDlg("selectPointTime");
}

/**
 * @desc 重新加载数据
 * @param shortUrl 重新加载数据的页面
 * @param elementId 权限列表的id
 */
function reloadData(shortUrl) {
	/*console.log("重新加载数据");*/
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].id=='iframe_addGpsInsrange' || fra[i].id=='iframe_updateGpsInsrange') {
			fra[i].contentWindow.reloadTaskTimeData();
		}
	}
}


//对Date的扩展，将 Date 转化为指定格式的String
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
//例子： 
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
 var o = {
     "M+": this.getMonth() + 1, //月份 
     "d+": this.getDate(), //日 
     "h+": this.getHours(), //小时 
     "m+": this.getMinutes(), //分 
     "s+": this.getSeconds(), //秒 
     "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
     "S": this.getMilliseconds() //毫秒 
 };
 if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
 for (var k in o)
 if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
 return fmt;
}