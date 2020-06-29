
/**
 * @file
 * @author 作者
 * @desc 添加页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

/**
 * @desc 页面初始化
 */

var businessId;   // 附件上传业务ID
$(document).ready(function(){

	var comboxid='status,condition,devtype,';
	var singleDomainName='devicestatus,devicecondition,devicetype,';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	loadSelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	
	var user = JSON.parse(sessionStorage.user);
	var userArray = [];
	userArray.push(user);
	initUnitComboTreeLocal('unitid');
	setComboObjWidth('unitid',0.270,'combobox');

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
					reloadData("query_gps_device.html","#gpsDevicedatagrid");
					closePanel();
				});
		}
	});

    $('#unitid').tooltip({
        position: 'right',
        content: '<span style="color:#fff">This is the tooltip message.</span>',
        onShow: function(){
            $(this).tooltip('tip').css({
                backgroundColor: '#666',
                borderColor: '#666'
            });
        }
    });
    
    /* 初始化部门 */
	$('#unitid').combotree('setValue',user.unitId);
});

/**
 * @desc 保存基本信息获取业务id
 */
function saveBaseInfo(){
	var  bID = null;
	if(isNull(businessId)){
		bID = saveGpsDevice();  // sava()保存基本信息函数，返回业务id
	}else{
		bID = businessId;
	}
	return bID;
}

/**
 * @desc 添加数据-保存
 */
function saveGpsDevice(){


    $('#unitid').validatebox('isValid');
	disableButtion("saveButton");
	var bool=$("#gpsDeviceForm").form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;
	}
	$.ajax({
		url : rootPath+"/gpsdevice/save.do",
		type: "post",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($("#gpsDeviceForm").serializeToJson()),
		success: function(data){
			if(data.status==1){
				businessId=data.data;
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
	top. closeDlg("addGpsDevice");
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
					$(".validatebox-readonly").css("background-color","#f3f3ef");
				},
				onLoadSuccess:function(data){
					if(data.length>0){
						if(data[0].domainName == 'devicestatus'){
							$('#status').combobox('setValue','01');
						}
						if(data[0].domainName == 'devicecondition'){
							$('#condition').combobox('setValue','02');
						}
						//$('#'+id).combobox('setValue',data[0].codeId);
						
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
						$('#' + id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.270,'combobox');
		}
	}
}
/**
 * 初始化当前登陆用户所在部门及子部门树下拉框
 * @returns
 */
function initUnitComboTreeLocal(unitid){
	/* 以下初始化查询面板 */
	/* 部门 */
	$('#'+unitid).combotree({
		panelHeight:150,
		editable:true,
		mode:'remote',
		valueField : "oid",
		textField : "unitName",
		onSelect : function(row){
		}
	});
	$.post(rootPath+'/xncommon/getUnitChildren.do?unitId='+user.unitId+'&unitName='+encodeURI(user.unitName),function(result){

		$('#'+unitid).combotree('loadData', result.data);
	})
    setComboObjWidth(unitid,0.172,'combobox');
}
