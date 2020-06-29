
/**
 * @file
 * @author 作者
 * @desc 添加页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */
var pkfield;	// 业务数据ID
var businessId;    // 附件上传业务ID

//当前登陆用户
var user = JSON.parse(sessionStorage.user);

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	comboxid+='eventtype'+',';
	singleDomainName+='eventType'+","
	loadSelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	
	showMap();
	initGuardian();
	initReportperson();
	
	//初始化部门
	initUnitComboTree('unitid');
	setComboObjWidth('unitid',0.270,'combobox');
	//初始化管线
	initLineLoopComboTree('lineloopoid');
	setComboObjWidth('lineloopoid',0.270,'combobox');

	// 不带描述信息的图片上传    // 先执行的没有执行成功事件
	$("#picUpload").initializeWebUploader({
		fileType:"pic",
		addDesc:"false",
		uploadBtn:"#saveButton",
		url : rootPath+"/attachment/upload.do",
		moduleCode:"samples",
		
		fileNumLimit:20,  // 上传文件的个数不传有默认值200
//		extensions:"png", // 上传文件的后缀 不传有默认值
		
		picAndFile:"all", // 图片和附件同时存在     标识
		
		uploadBeforeFun:function(){
			var bsId = saveBaseInfo();
			return bsId;
		}
		// 这里没有执行成功事件
	});

	// 带描述信息的文件上传    // 后执行的没有上传按钮
	$("#fileUpload").initializeWebUploader({
		fileType:"file",
		addDesc:"true",
		// 这里没有开始上传事件的触发按钮
		url : rootPath+"/attachment/upload.do",
		moduleCode:"samples", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
	
		fileNumLimit:20,  // 上传文件的个数 不传默认值为200
//		extensions:"doc,docx", // 上传文件的后缀 不传默认值为'doc,docx,xlsx,xls,pdf,zip,ppt,pptx'
		
		picAndFile:"all", // 图片和附件同时存在     标识
		
		uploadBeforeFun:function(){
			var bsId = saveBaseInfo();
			return bsId;
		},
		uploadSuccessFun:function(){
				top.showAlert("提示", "保存成功", 'info', function() {
					reloadData("query_gps_event.html","#gpsEventdatagrid");
					closePanel();
				});
		}
	});
	
});

/**
 * 控制第三方施工标签显隐
 * @param eventtype
 * @returns
 */
function initConstructionHTML(eventtype){
	if(eventtype == '06'){
		var rs = '<tr><td id="constructionTdname" width="20%">\
			<span style="color:red;vertical-align: bottom;margin-right:5px">*</span>\
			<span>第三方施工上报：</span>\
		</td>\
		<td id="constructionTd" width="30%">\
			<input id="constructionidname" name="constructionidname" onclick="selectConstruct()" class="easyui-validatebox input_bg" required="true" ></input>\
		</td></tr>';
		$('#constructionTr').after(rs);
		$('#constructionidname').validatebox();
//		$("#constructionidname").rules("add",{required:true});
	}else{
		$('#constructionTdname').remove();
		$('#constructionTd').remove();
	}
}

function initGuardian(){
	$('#guardian').combobox({
		panelHeight:150,
		editable:true,
		valueField : "codeid",
		textField : "codename"
	});
	setComboObjWidth('guardian',0.270,'combobox');
}

function getGuardian(unitid){
	$('#guardian').combobox({
		panelHeight:100,
		url : rootPath+'/gpsconstruction/getInspectorByUnit.do?unitid='+unitid+'&inspectortype=01',
		valueField : "oid",
		textField : "insname",
	});
	setComboObjWidth('guardian',0.270,'combobox');
}

/**
 * 初始化当前登陆用户下拉框
 * @returns
 */
function initReportperson(){
	$('#reportperson').val(user.oid);
	$('#reportpersonname').val(user.userName);
}

/**
 * 选择第三方施工上报信息
 * @returns
 */
function selectConstruct(){
	top.getDlg("../gps_construction/selectconstruction/select_gps_construction.html?unitid="+user.unitId+"&constructionid="+$('#constructionid').val(),
			"selectGpsConstruction","选择第三方施工上报信息",900,650,false,true,true);
}

/**
 * 初始化当前登陆用户所在部门及子部门树下拉框
 * @returns
 */
function initUnitComboTree(unitid){
	/* 以下初始化查询面板 */
	/* 部门 */
	$('#'+unitid).combotree({
		panelHeight:150,
		editable:true,
		mode:'remote',
		valueField : "oid",
		textField : "unitName",
		onSelect:function(node){
			getGuardian(node.id);
		},
		onLoadSuccess:function(data){
			$('#'+unitid).combotree('setValue', user.unitId);
			getGuardian(user.unitId);
		}
	});
	$.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){
		console.log(result);
		$('#'+unitid).combotree('loadData', result.data);
	})
    setComboObjWidth(unitid,0.172,'combobox');
}

///**
// * @desc 保存基本信息获取业务id
// */
function saveBaseInfo(){
	var  bID = null;
	if(isNull(businessId)){
		bID = saveGpsEvent();  // sava()保存基本信息函数，返回业务id
	}else{
		bID = businessId;
	}
	return bID;
}

/**
 * @desc 添加数据-保存
 */
function saveGpsEvent(){
	disableButtion("saveButton");
	var bool=$("#gpsEventForm").form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;
	}
	$.ajax({
		url : rootPath+"/gpsevent/save.do",
		type: "post",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($("#gpsEventForm").serializeToJson()),
		success: function(data){
			if(data.status==1){
				businessId=data.data;
				pkfield=data.data;
			}else if(data.code == "400") {
				top.showAlert("提示", "保存失败", 'error');
				enableButtion("saveButton");
			}else{
				top.showAlert("提示", data.msg, 'info');
				enableButtion("saveButton");
			}
		}
	});
	enableButtion("saveButton");
	
		return businessId;    // 附件上传业务ID

}


/**
 * @desc 关闭添加页面
 */
function closePanel() {
	top. closeDlg("addGpsEvent");
}

/**
 * @desc 重新加载数据
 * @param shortUrl 重新加载数据的页面
 * @param elementId 权限列表的id
 */
function reloadData(shortUrl, elementId) {
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(shortUrl) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
}


/**
 * @desc 加载新增，修改单选下拉列表框
 * @param comboxid 下拉列表框的id，以逗号隔开
 * @param singleDomainName 值域名称，以逗号隔开
 */
function loadSelectData(comboxid,singleDomainName){
	if(comboxid!='' && comboxid !=undefined){
		var select = comboxid.split(",");
		var singleDomainNameArr = singleDomainName.split(",");
		for(var i=0;i<select.length-1;i++){
			if(singleDomainNameArr[i]==''){
				continue;
			}
			var id=select[i];
			$('#' + id).combobox({
				panelHeight:100,
				url : rootPath+"jasframework/sysdoman/getDoman.do?domainName="+singleDomainNameArr[i],
				valueField : 'codeId',
				textField : 'codeName',
				onSelect : function(row){
					//保存个性表单的值域value值
					$('#'+id).val(row.codeId);
					$('#'+id+'ID').val(row.codeName);
					initConstructionHTML(row.codeId);
				},
				onLoadSuccess:function(data){
					if(data.length>0){
//						$('#'+id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.270,'combobox');
		}
	}
}

/**
 * @desc 加载新增，修改多选选下拉列表框
 * @param comboxid 下拉列表框的id，以逗号隔开
 * @param moreDomainName 值域名称，以逗号隔开
 */
function loadMoreSelectData(comboxid,moreDomainName){
	if(comboxid!='' && comboxid !=undefined){
		var select = comboxid.split(",");
		var moreDomainNameArr = moreDomainName.split(",");
		for(var i=0;i<select.length-1;i++){
			var id=select[i];
			$('#' + id).combobox({
				panelHeight:100,
				multiple:true,
				url : rootPath+"jasframework/sysdoman/getDoman.do?domainName="+moreDomainNameArr[i],
				valueField : 'codeId',
				textField : 'codeName',
				onSelect : function(row){
					//保存个性表单的值域value值
					$('#'+id).val(row.codeId);
					$('#'+id+'ID').val(row.codeName);
				},
				onLoadSuccess:function(data){
					if(data.length>0){
//						$('#' + id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.270,'combobox');
		}
	}
}



function getDomainValue( target ) {
    var list = target.combobox('getData');
    for( var i = 0 ; i < list.length ; i++ ) {
        if(list[i].codeId == target.combobox('getValue')) {
            return list[i].codeName;
        }
    }
    return ' ';
}

function showMap(){
	$('#locationXY').on('click',function(){
		addLocation();
	})
}

//弹出加载层
function load(message) {  
    $("<div class=\"datagrid-mask\"></div>").css({ display: "block", width: "100%", height: $(window).height() }).appendTo("body");  
    $("<div class=\"datagrid-mask-msg\"></div>").html(message).appendTo("body").css({ display: "block", left: ($(document.body).outerWidth(true) - 190) / 2, top: ($(window).height() - 45) / 2 });  
}
//取消加载层  
function disLoad() {  
    $(".datagrid-mask").remove();  
    $(".datagrid-mask-msg").remove();  
}

function showCursor(){
	disLoad();
	top.hideDlg('addGpsEvent');
	
	let fra = parent.$("iframe");
	for ( let i = 0; i < fra.length; i++) {
		if (fra[i].id == 'frm2d') {
			fra[i].contentWindow.getXY(getLocationCallBack);
		}
	}
	
	
}

/* 添加位置坐标 */
function addLocation(){
	/* 打开地图 */ 
	if(!top.toShow2d){
		/* 显示二维地图 */
		if(typeof showmap2d != 'undefined'){
			showmap2d();
		}else{
			top.showmap2d();
		}
		
		load("正在加载地图，请稍后...");
		setTimeout('showCursor()',4000);
	}else{
		showCursor();
	}
	
}

function getLocationCallBack(obj){
		console.log('坐标是'+obj)
		let xy = obj.split(',');
		let x = xy[0];
		let y = xy[1];
		/* 给input赋值 */
		$('#lon').val(x);
		$('#lat').val(y);
	    top.showDlg("addGpsEvent");
	    
	   top.tab.delMapTab('2d');
}

/**
 * 选择第三方事件回调
 * @param dataId
 * @param projectname
 * @param happenbegindate
 * @returns
 */
function selectconstructcallback(dataId, projectname, happenbegindate){
	$('#constructionid').val(dataId);
	if(dataId == null || dataId == ''){
		$('#constructionidname').val('');
	}else{
		$('#constructionidname').val(projectname+' ('+happenbegindate+')');
	}
}

function temporarykeypoint(){
	if($('#unitid').combotree('getValue') == null || $('#unitid').combotree('getValue') == ''){
		top.showAlert("提示", "请先选择部门！", 'info');
		return;
	}
	if($('#guardian').combobox('getValue') == null || $('#guardian').combobox('getValue') == ''){
		top.showAlert("提示", "请先选择事件监护人员！", 'info');
		return;
	}
	if($('#lon').val() == null || $('#lon').val() == '' || $('#lat').val() == null || $('#lat').val() == ''){
		top.showAlert("提示", "请先选择坐标！", 'info');
		return;
	}
	if($('#keypointname').val() == null || $('#keypointname').val() == ''){
		top.getDlg("../../linePatrolManage/insTask/temporaryKeypoint/save_gps_temporary_keypoint_construct.html?lon="+$('#lon').val()+"&lat="+$('#lat').val()
				+"&inspectoroid="+$('#guardian').combobox('getValue')+"&unitid="+$('#unitid').combotree('getValue')+"&consDialogname=addGpsEvent"
				+"&temporarykeypointtype=02",
				"addGpsTemporaryKeypointconstruct","添加临时关键点",800,600,false,true,true);
	}else{
		top.getDlg("../../linePatrolManage/insTask/temporaryKeypoint/update_gps_temporary_keypoint_construct.html?oid="+$('#keypointname').val()
				+"&consDialogname=addGpsEvent&temporarykeypointtype=02","updateGpsTemporaryKeypointconstruct","修改临时关键点",800,600,false,true,true);
	}
}

function temporarykeypointcallback(temporarykeypointoid, temporarykeypointoidname){
	$('#keypointname').val(temporarykeypointoid);
	$('#keypointnamename').val(temporarykeypointoidname);
}
