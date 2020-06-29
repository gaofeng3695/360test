
var idArray = getParamter("idArray").split(",");//业务数据IDList
var frameName = getParamter("frameName");//弹框名字
var flag = 0;//标志
var pkfield=idArray[0];	// 业务数据ID

$(document).ready(function(){
	if(idArray.length > 1){
		$("#beforebtn").linkbutton("enable");
		$("#beforebtn").show();
		$("#nextbtn").linkbutton("enable");
		$("#nextbtn").show();
		$("#allbtn").show();
	}else{
		$("#beforebtn").linkbutton("disable");
		$("#beforebtn").hide();
		$("#nextbtn").linkbutton("disable");
		$("#nextbtn").hide();
		$("#allbtn").hide();
	}
});


/**
 * 查看上一条信息
 * @returns
 */
function lastData(){
	if(flag <= 0){
		top.showAlert('提示', '没有上一条了', 'info');
		return;
	}
	pkfield = idArray[flag-1];
	flag -= 1;
	initPage()
}

/**
 * 查看下一条信息
 * @returns
 */
function nextData(callback){
	if(flag >= (idArray.length - 1)){
		top.showAlert('提示', '没有下一条了', 'info');
		return;
	}
	pkfield = idArray[flag+1];
	flag += 1;
	initPage();
}

/**
 * 抽检通过
 * @returns
 */
function pass(className,queryPage,datagrid){
	var obj = $("input[name='obj']:checked").val();
	var toPassidArray = [];
	/*if(obj == 0){//当前
		toPassidArray.push(idArray[flag])
//		idArray.splice(flag,flag+1);
	}else if(obj == 1){//全部
		toPassidArray = idArray;
//		idArray = [];
	}*/
	if(obj == "on"){//全部
		toPassidArray = idArray;
	}else{//当前
		toPassidArray.push(idArray[flag])
	}
	if(!isNull(toPassidArray)){
		var advice = $("#advice").val();
		$.messager.confirm('抽检', '您确定抽检通过吗？\n\t',function(r){
			if (r){
				$.ajax({
				   url: rootPath+"/consDcsCommon/randomPassData.do?className="+className,
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idArray" : toPassidArray,"advice":advice}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							for (var i = idArray.length - 1; i >= 0; i--) {
							    a = idArray[i];
							    for (var j = toPassidArray.length - 1; j >= 0; j--) {
							        b = toPassidArray[j];
							        if (a == b) {
							        	idArray.splice(i, 1);
							        	toPassidArray.splice(j, 1);
							            break;
							        }
							    }
							}
							if(idArray.length <= 0){
								reloadData(queryPage+".html","#"+datagrid);
								closePanel();
							}else{
								if(flag <= (idArray.length - 1)){
									pkfield = idArray[flag];
									initPage();
								}
							}
						}else{
							top.showAlert("错误","抽检失败","error");
						}
				   },
				   error : function(data) {
						top.showAlert('错误', '抽检出错', 'info');
					}
				});
			}
		});	
	}
}

/**
 * 抽检退回
 * @returns
 */
function notPass(className,queryPage,datagrid){
	var obj = $("input[name='obj']:checked").val();
	var toPassidArray = [];
/*	if(obj == 0){//当前
		toPassidArray.push(idArray[flag])
//		idArray.splice(flag,flag+1);
	}else if(obj == 1){//全部
		toPassidArray = idArray;
//		idArray = [];
	}*/
	if(obj == "on"){//全部
		toPassidArray = idArray;
	}else{//当前
		toPassidArray.push(idArray[flag])
	}
	if(!isNull(toPassidArray)){
		var advice = $("#advice").val();
		if(advice == null || advice.trim() == ""){
			top.showAlert('提示', '请填写审批意见', 'info');
			return;
		}
		$.messager.confirm('抽检', '您确定抽检退回吗？\n\t',function(r){
			if (r){
				$.ajax({
				   url: rootPath+"/consDcsCommon/randomNotPassData.do?className="+className,
				   contentType: 'application/json;charset=utf-8',
				   data: JSON.stringify({"idArray" : toPassidArray,"advice":advice}),
				   type: "POST",
				   dataType:"json",
				   async:false,
				   success: function(data){
						if(data.status==1){
							for (var i = idArray.length - 1; i >= 0; i--) {
							    a = idArray[i];
							    for (var j = toPassidArray.length - 1; j >= 0; j--) {
							        b = toPassidArray[j];
							        if (a == b) {
							        	idArray.splice(i, 1);
							        	toPassidArray.splice(j, 1);
							            break;
							        }
							    }
							}
							if(idArray.length <= 0){
								reloadData(queryPage+".html","#"+datagrid);
								closePanel();
							}else{
								if(flag <= (idArray.length - 1)){
									pkfield = idArray[flag];
									initPage();
								}
							}
						}else{
							top.showAlert("错误","抽检失败","error");
						}
				   },
				   error : function(data) {
						top.showAlert('错误', '抽检出错', 'info');
					}
				});
			}
		});	
	}
}