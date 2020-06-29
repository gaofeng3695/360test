/**
 * 定时器页面管理
 */
$(document).ready(function(){
    initUnitComboTree('unitid');
})
/**
 * 同步系统集成号
 * @returns
 */
function syncSafetySN(){
	$('.local-notice').css('display','block');
	$.ajax({
	   url: rootPath+"/timermanage/syncSafetySN.do",
	   contentType: 'application/json;charset=utf-8',
	   timeout : 300000000,
	   type: "POST",
	   dataType:"json",
	   success: function(data){
			if(data.status==1){
                $('.local-notice').css('display','none');
				top.showAlert("提示","执行成功","info");
			}else if(data.code == "400") {
                $('.local-notice').css('display','none');
				top.showAlert("提示", "保存失败", 'error');
			}else{
                $('.local-notice').css('display','none');
				top.showAlert("提示", data.msg, 'info');
			}
	   },
	   error : function(data) {
           $('.local-notice').css('display','none');
		   top.showAlert('提示', '耗时较长，勿再次点击按钮，请耐心等候...', 'info');
	   }
	});
}

/**
 * 同步部门
 * @returns
 */
function syncDept(){
    $('.local-notice').css('display','block');
	$.ajax({
	   url: rootPath+"/timermanage/syncDept.do",
	   contentType: 'application/json;charset=utf-8',
        timeout : 300000000,
	   type: "POST",
	   dataType:"json",
	   success: function(data){
			if(data.status==1){
                $('.local-notice').css('display','none');
				top.showAlert("提示","执行成功","info");
			}else if(data.code == "400") {
                $('.local-notice').css('display','none');
				top.showAlert("提示", "保存失败", 'error');
			}else{
                $('.local-notice').css('display','none');
				top.showAlert("提示", data.msg, 'info');
			}
	   },
	   error : function(data) {
           $('.local-notice').css('display','none');
		   top.showAlert('提示', '耗时较长，勿再次点击按钮，请耐心等候...', 'info');
	   }
	});
}

/**
 * 同步用户
 * @returns
 */
function syncUser(){
    $('.local-notice').css('display','block');
	$.ajax({
	   url: rootPath+"/timermanage/syncUser.do",
	   contentType: 'application/json;charset=utf-8',
        timeout : 300000000,
	   type: "POST",
	   dataType:"json",
	   success: function(data){
			if(data.status==1){
                $('.local-notice').css('display','none');
				top.showAlert("提示","执行成功","info");
			}else if(data.code == "400") {
                $('.local-notice').css('display','none');
				top.showAlert("提示", "保存失败", 'error');
			}else{
                $('.local-notice').css('display','none');
				top.showAlert("提示", data.msg, 'info');
			}
	   },
	   error : function(data) {
           $('.local-notice').css('display','none');
		   top.showAlert('提示', '耗时较长，勿再次点击按钮，请耐心等候...', 'info');
	   }
	});
}

/**
 * 同步管线数据
 * @returns
 */
function syncPineLoop(){
    $('.local-notice').css('display','block');
	$.ajax({
	   url: rootPath+"/timermanage/syncPineLoop.do",
        timeout : 300000000,
	   contentType: 'application/json;charset=utf-8',
	   type: "POST",
	   dataType:"json",
	   success: function(data){
			if(data.status==1){
                $('.local-notice').css('display','none');
				top.showAlert("提示","执行成功","info");
			}else if(data.code == "400") {
                $('.local-notice').css('display','none');
				top.showAlert("提示", "保存失败", 'error');
			}else{
                $('.local-notice').css('display','none');
				top.showAlert("提示", data.msg, 'info');
			}
	   },
	   error : function(data) {
           $('.local-notice').css('display','none');
		   top.showAlert('提示', '耗时较长，勿再次点击按钮，请耐心等候...', 'info');
	   }
	});
}

/**
 * 同步巡检范围
 * @returns
 */
function syncSubIns(){
    $('.local-notice').css('display','block');
	$.ajax({
	   url: rootPath+"/timermanage/syncSubIns.do",
        timeout : 300000000,
	   contentType: 'application/json;charset=utf-8',
	   type: "POST",
	   dataType:"json",
	   success: function(data){
			if(data.status==1){
                $('.local-notice').css('display','none');
				top.showAlert("提示","执行成功","info");
			}else if(data.code == "400") {
                $('.local-notice').css('display','none');
				top.showAlert("提示", "保存失败", 'error');
			}else{
                $('.local-notice').css('display','none');
				top.showAlert("提示", data.msg, 'info');
			}
	   },
	   error : function(data) {
           $('.local-notice').css('display','none');
		   top.showAlert('提示', '耗时较长，勿再次点击按钮，请耐心等候...', 'info');
	   }
	});
}

/**
 * 同步不巡检范围
 * @returns
 */
function syncUnSubIns(){
    $('.local-notice').css('display','block');
	$.ajax({
	   url: rootPath+"/timermanage/syncUnSubIns.do",
	   contentType: 'application/json;charset=utf-8',
        timeout : 300000000,
	   type: "POST",
	   dataType:"json",
	   success: function(data){
			if(data.status==1){
                $('.local-notice').css('display','none');
				top.showAlert("提示","执行成功","info");
			}else if(data.code == "400") {
                $('.local-notice').css('display','none');
				top.showAlert("提示", "保存失败", 'error');
			}else{
                $('.local-notice').css('display','none');
				top.showAlert("提示", data.msg, 'info');
			}
	   },
	   error : function(data) {
           $('.local-notice').css('display','none');
		   top.showAlert('提示', '耗时较长，勿再次点击按钮，请耐心等候...', 'info');
	   }
	});
}

/**
 * 同步计划
 * @returns
 */
function syncPlanInfo(){
    $('.local-notice').css('display','block');
	$.ajax({
	   url: rootPath+"/timermanage/syncPlanInfo.do",
	   contentType: 'application/json;charset=utf-8',
        timeout : 300000000,
	   type: "POST",
	   dataType:"json",
	   success: function(data){
			if(data.status==1){
                $('.local-notice').css('display','none');
				top.showAlert("提示","执行成功","info");
			}else if(data.code == "400") {
                $('.local-notice').css('display','none');
				top.showAlert("提示", "保存失败", 'error');
			}else{
                $('.local-notice').css('display','none');
				top.showAlert("提示", data.msg, 'info');
			}
	   },
	   error : function(data) {
           $('.local-notice').css('display','none');
		   top.showAlert('提示', '耗时较长，勿再次点击按钮，请耐心等候...', 'info');
	   }
	});
}

/**
 * 同步桩数据
 * @returns
 */
function syncMarker(){
    $('.local-notice').css('display','block');
	$.ajax({
	   url: rootPath+"/timermanage/syncMarker.do",
	   contentType: 'application/json;charset=utf-8',
        timeout : 300000000,
	   type: "POST",
	   dataType:"json",
	   success: function(data){
			if(data.status==1){
                $('.local-notice').css('display','none');
				top.showAlert("提示","执行成功","info");
			}else if(data.code == "400") {
                $('.local-notice').css('display','none');
				top.showAlert("提示", "保存失败", 'error');
			}else{
                $('.local-notice').css('display','none');
				top.showAlert("提示", data.msg, 'info');
			}
	   },
	   error : function(data) {
           $('.local-notice').css('display','none');
		   top.showAlert('提示', '耗时较长，勿再次点击按钮，请耐心等候...', 'info');
	   }
	});
}

/**
 * 删除管道工巡检区段
 * @returns
 */
function deleteGInsrange(){
    $('.local-notice').css('display','block');
	$.ajax({
	   url: rootPath+"/timermanage/deleteGInsrange.do",
	   contentType: 'application/json;charset=utf-8',
        timeout : 300000000,
	   type: "POST",
	   dataType:"json",
	   success: function(data){
			if(data.status==1){
                $('.local-notice').css('display','none');
				top.showAlert("提示","执行成功","info");
			}else if(data.code == "400") {
                $('.local-notice').css('display','none');
				top.showAlert("提示", "保存失败", 'error');
			}else{
                $('.local-notice').css('display','none');
				top.showAlert("提示", data.msg, 'info');
			}
	   },
	   error : function(data) {
           $('.local-notice').css('display','none');
		   top.showAlert('提示', '耗时较长，勿再次点击按钮，请耐心等候...', 'info');
	   }
	});
}

/**
 * 定时保存前一天gps巡检轨迹至arcgis空间表
 * @returns
 */
function savePatrolxyLine(){
    $('.local-notice').css('display','block');
	$.ajax({
	   url: rootPath+"/timermanage/savePatrolxyLine.do",
	   contentType: 'application/json;charset=utf-8',
        timeout : 300000000,
	   type: "POST",
	   dataType:"json",
	   success: function(data){
			if(data.status==1){
                $('.local-notice').css('display','none');
				top.showAlert("提示","执行成功","info");
			}else if(data.code == "400") {
                $('.local-notice').css('display','none');
				top.showAlert("提示", "保存失败", 'error');
			}else{
                $('.local-notice').css('display','none');
				top.showAlert("提示", data.msg, 'info');
			}
	   },
	   error : function(data) {
           $('.local-notice').css('display','none');
		   top.showAlert('提示', '耗时较长，勿再次点击按钮，请耐心等候...', 'info');
	   }
	});
}

/**
 * 定时保存前一天gps巡检轨迹至arcgis空间表
 * @returns
 */
function saveStationfstatistic(){
    $('.local-notice').css('display','block');
	/* 获取部门ID 和统计时间 */
	/*let unitId = $("#unitid").val();
	let date = $("#releasedate").val();*/

	let unitId = "";
	let date = "";
	$.ajax({
	   url: rootPath+"/timermanage/saveStationfstatistic.do?unitId="+unitId+"&date="+date,
	   contentType: 'application/json;charset=utf-8',
        timeout : 300000000,
	   type: "POST",
	   dataType:"json",
	   success: function(data){
			if(data.status==1){
                $('.local-notice').css('display','none');
				top.showAlert("提示","执行成功","info");
			}else if(data.code == "400") {
                $('.local-notice').css('display','none');
				top.showAlert("提示", "保存失败", 'error');
			}else{
                $('.local-notice').css('display','none');
				top.showAlert("提示", data.msg, 'info');
			}
	   },
	   error : function(data) {
           $('.local-notice').css('display','none');
		   top.showAlert('提示', '耗时较长，勿再次点击按钮，请耐心等候...', 'info');
	   }
	});
}

/**
 * 统计前一天巡线工和各站各分公司分数
 * @returns
 */
function statisticsScore(){
    $('.local-notice').css('display','block');

	/* 获取设置时间 */
	/*let nowDate = $("#scoreDate").val();
    let unitId = $("#unitid").val();*/

    let nowDate = "";
    let unitId = "";
	$.ajax({
	   url: rootPath+"/timermanage/statisticsScore.do?nowDate="+nowDate+"&unitId="+unitId,
	   contentType: 'application/json;charset=utf-8',
	   type: "POST",
        timeout : 300000000,
	   dataType:"json",
	   success: function(data){
			if(data.status==1){
                $('.local-notice').css('display','none');
				top.showAlert("提示","执行成功","info");
			}else if(data.code == "400") {
                $('.local-notice').css('display','none');
				top.showAlert("提示", "保存失败", 'error');
			}else{
                $('.local-notice').css('display','none');
				top.showAlert("提示", data.msg, 'info');
			}
	   },
	   error : function(data) {
           $('.local-notice').css('display','none');
		   top.showAlert('提示', '耗时较长，勿再次点击按钮，请耐心等候...', 'info');
	   }
	});
}

/**
 * 同步异常处理结果
 * @returns
 */
function getNinspectionForDate(){
    $('.local-notice').css('display','block');
	$.ajax({
	   url: rootPath+"/timermanage/getNinspectionForDate.do",
	   contentType: 'application/json;charset=utf-8',
	   type: "POST",
        timeout : 300000000,
	   dataType:"json",
	   success: function(data){
			if(data.status==1){
                $('.local-notice').css('display','none');
				top.showAlert("提示","异常处理结果同步成功","info");
			}else if(data.code == "400") {
                $('.local-notice').css('display','none');
				top.showAlert("提示", "异常处理结果同步失败", 'error');
			}else{
                $('.local-notice').css('display','none');
				top.showAlert("提示", data.msg, 'info');
			}
	   },
	   error : function(data) {
           $('.local-notice').css('display','none');
		   top.showAlert('提示', '耗时较长，勿再次点击按钮，请耐心等候...', 'info');
	   }
	});
}


/**
 * 保存GPS线空间数据测试
 * @returns
 */
function convertPolyline(){
    $('.local-notice').css('display','block');
    $.ajax({
        url: rootPath+"/pathlinepoint/convertPolyline.do",
        contentType: 'application/json;charset=utf-8',
        type: "POST",
        timeout : 300000000,
        dataType:"json",
        success: function(data){
            if(data.status==1){
                $('.local-notice').css('display','none');
                top.showAlert("提示","执行成功","info");
            }else if(data.code == "400") {
                $('.local-notice').css('display','none');
                top.showAlert("提示", "保存失败", 'error');
            }else{
                $('.local-notice').css('display','none');
                top.showAlert("提示", data.msg, 'info');
            }
        },
        error : function(data) {
            $('.local-notice').css('display','none');
			top.showAlert('提示', '耗时较长，勿再次点击按钮，请耐心等候...', 'info');
        }
    });
}

/**
 * 生成覆盖率预警记录
 * @returns
 */
function generateCoverwarnRecord(){
    $('.local-notice').css('display','block');
	$.ajax({
	   url: rootPath+"/timermanage/generatecoverwarnrecord.do",
	   contentType: 'application/json;charset=utf-8',
	   type: "POST",
        timeout : 300000000,
	   dataType:"json",
	   success: function(data){
			if(data.status==1){
                $('.local-notice').css('display','none');
				top.showAlert("提示","执行成功","info");
			}else if(data.code == "400") {
                $('.local-notice').css('display','none');
				top.showAlert("提示", "保存失败", 'error');
			}else{
                $('.local-notice').css('display','none');
				top.showAlert("提示", data.msg, 'info');
			}
	   },
	   error : function(data) {
           $('.local-notice').css('display','none');
		   top.showAlert('提示', '耗时较长，勿再次点击按钮，请耐心等候...', 'info');
	   }
	});
}
/**
 * 生成登录预警记录
 * @returns
 */
function generateLoginwarnRecord(){
    $('.local-notice').css('display','block');
	$.ajax({
		url: rootPath+"/timermanage/generateloginwarnrecord.do",
		contentType: 'application/json;charset=utf-8',
		type: "POST",
        timeout : 300000000,
		dataType:"json",
		success: function(data){
			if(data.status==1){
                $('.local-notice').css('display','none');
				top.showAlert("提示","执行成功","info");
			}else if(data.code == "400") {
                $('.local-notice').css('display','none');
				top.showAlert("提示", "保存失败", 'error');
			}else{
                $('.local-notice').css('display','none');
				top.showAlert("提示", data.msg, 'info');
			}
		},
		error : function(data) {
            $('.local-notice').css('display','none');
			top.showAlert('提示', '耗时较长，勿再次点击按钮，请耐心等候...', 'info');
		}
	});
}
/**
 * 生成日常任务
 * @returns
 */
function generateInspectortask(){
    $('.local-notice').css('display','block');
	$.ajax({
		url: rootPath+"/timermanage/generateinspectortask.do",
		contentType: 'application/json;charset=utf-8',
		type: "POST",
        timeout : 300000000,
		dataType:"json",
		success: function(data){
			if(data.status==1){
                $('.local-notice').css('display','none');
				top.showAlert("提示","执行成功","info");
			}else if(data.code == "400") {
                $('.local-notice').css('display','none');
				top.showAlert("提示", "保存失败", 'error');
			}else{
                $('.local-notice').css('display','none');
				top.showAlert("提示", data.msg, 'info');
			}
		},
		error : function(data) {
            $('.local-notice').css('display','none');
			top.showAlert('提示', '耗时较长，勿再次点击按钮，请耐心等候...', 'info');
		}
	});
}
/**
 * 生成日常任务
 * @returns
 */
function generateTemporarytask(){
    $('.local-notice').css('display','block');
	$.ajax({
		url: rootPath+"/timermanage/generatetemporarytask.do",
		contentType: 'application/json;charset=utf-8',
		type: "POST",
        timeout : 300000000,
		dataType:"json",
		success: function(data){
			if(data.status==1){
                $('.local-notice').css('display','none');
				top.showAlert("提示","执行成功","info");
			}else if(data.code == "400") {
                $('.local-notice').css('display','none');
				top.showAlert("提示", "保存失败", 'error');
			}else{
                $('.local-notice').css('display','none');
				top.showAlert("提示", data.msg, 'info');
			}
		},
		error : function(data) {
            $('.local-notice').css('display','none');
			top.showAlert('提示', '耗时较长，勿再次点击按钮，请耐心等候...', 'info');
		}
	});
}
/**
 * 生成日常任务
 * @returns
 */
function generateSegmentScore(){
    $('.local-notice').css('display','block');
	$.ajax({
		url: rootPath+"/gpsinspector/getDistrictHeadStatisticsScore.do",
		contentType: 'application/json;charset=utf-8',
		type: "POST",
        timeout : 300000000,
		dataType:"json",
		success: function(data){
			if(data.status==1){
                $('.local-notice').css('display','none');
				top.showAlert("提示","执行成功","info");
			}else if(data.code == "400") {
                $('.local-notice').css('display','none');
				top.showAlert("提示", "保存失败", 'error');
			}else{
                $('.local-notice').css('display','none');
				top.showAlert("提示", data.msg, 'info');
			}
		},
		error : function(data) {
            $('.local-notice').css('display','none');
			top.showAlert('提示', '耗时较长，勿再次点击按钮，请耐心等候...', 'info');
		}
	});
}