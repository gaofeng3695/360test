function showUserLoginInfo(){
	$.post(rootPath+"/gpsnotice/getNotice.do",function(result){
		if(result.stauts = 1){
			var msg = "";
			var data = result.data;
			if(data != null){
				//获取部门id
				var unitid = data.unitid;
				
				msg += "<span style=\"line-height:20px;\"><b><font color='red'>"+data.userName+"</font></b>,您好!您：<br/>"+
					  "上次登录时间为：<font color='red'>"+data.lastLoginDate+"</font><br/>";
				
				//是否存在漏巡预警信息，判断是否需要弹漏巡预警信息
				if(data.omitwarningInspNum != null && data.omitwarningInspNum > 0){
					msg += '漏巡预警人数：<a href="#" onclick="omitwarning(\''+unitid+'\')"><font color="red">'+data.omitwarningInspNum+'</font></a><br/>';
					msg += '未巡关键点数量：<a href="#" onclick="omitwarning(\''+unitid+'\')"><font color="red">'+data.omitwarningPointNum+'</font></a><br/>';
				}
			
				
				//巡检覆盖率不达标预警
				if(data.planCover != null && data.taskCover != null){
					msg += '计划覆盖率预警值:<a href="#" onclick="coverageratewarning(\''+unitid+'\')"><font color="red">'+Math.round(data.planCover*100)/100+'%</font></a><br/>';
					msg += '计划覆盖率实际值:<a href="#" onclick="coverageratewarning(\''+unitid+'\')"><font color="red">'+Math.round(data.planCoverreal*100)/100+'%</font></a><br/>';
					msg += '任务覆盖率预警值:<a href="#" onclick="coverageratewarning(\''+unitid+'\')"><font color="red">'+Math.round(data.taskCover*100)/100+'%</font></a><br/>';
					msg += '任务覆盖率实际值:<a href="#" onclick="coverageratewarning(\''+unitid+'\')"><font color="red">'+Math.round(data.taskCoverreal*100)/100+'%</font></a><br/>';
				}	
				if(data.loginNum != undefined){
					msg += '登录次数:<a href="#" onclick="loginwarning(\''+unitid+'\')"><font color="red">'+data.loginNum+'</font></a><br/>';
					msg += '设置次数:<a href="#" onclick="loginwarning(\''+unitid+'\')"><font color="red">'+data.loginwarnNum+'</font></a><br/>';
				}
				
				msg += "</span>";
				showMessage(msg);
			}
		}else{
			top.showAlert('错误', '查询出错', 'info');
		}
	})
}

/**
 * 查看巡检覆盖率不达标
 * @returns
 */
function coverageratewarning(unitid){
	tab.openTabs("140302","覆盖率预警信息记录",rootPath+"/warninginfo/coverageratewarning/coverwarnrecord/query_gps_cover_warnrecord.html",true,true);
}

/**
 * 查看漏巡预警信息
 * @returns
 */
function omitwarning(unitid){
	tab.openTabs("140102","漏巡预警信息记录",rootPath+"/warninginfo/omitwarning/omitmissrecord/query_gps_omit_missrecord.html",true,true);
}



/**
 * 登录预警
 * @param unitid
 * @returns
 */
function loginwarning(unitid){
	tab.openTabs("140202","登录预警信息记录",rootPath+"/warninginfo/loginwarning/loginwarnrecord/query_gps_login_warnrecord.html",true,true);
}


/**
 * 弹系统提示信息
 * @param msg
 * @returns
 */
function showMessage(msg){
	$.messager.show({
		title:'系统提示',
		width:300,
		height:170,
		msg:msg,
		timeout:500000
	});
}